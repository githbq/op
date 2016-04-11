/**
*	企信类
*   需要指定常量
*	
*	IBSS.COMMON_PATH  //common模块 前端路径
*   IBSS.API_PATH     //后端数据请求路径
*   IBSS.USERS        // USERS 名字map
*   IBSS.role         // 当前用户信息
*/
define(function(require, exports, module){
	
	var $template = $( require('./qx.html') );

	var SelectDialog = require('./selectdialog'),
		FastReplyDialog = require( './fastreplydialog' ),
        AudioPlayer = require( '../audio-player/audio-player' );

	var mainTpl = $template.filter('#sessiontpl').html(),
		waitlistTpl = $template.filter('#waitlisttpl').html(),
		servicelistTpl = $template.filter('#servicelisttpl').html(), 
		endlistTpl = $template.filter('#endlisttpl').html();
		
	var $body = $('body');

	/**
	 * 客服通讯
	 * 等待结束列表 轮询刷新
	 * 服务中列表第一次获取 飘数 轮询刷新 当前对话窗口有飘数会触发对话窗口的刷新方法
	 */
	function Kf(){
		this.init.apply(this,arguments);
	}
	Kf.prototype={
		
		view: mainTpl,
		waitlistTpl: _.template( waitlistTpl ),
		servicelistTpl: _.template( servicelistTpl ),
		endlistTpl: _.template( endlistTpl ),

		//默认配置
		defaultAttr:{
			'commonListTimeInterval': 15000,       			//等待 已结束 列表 请求时间间隔(ms)
			'serviceListTimeInterval': 10000      		    //服务中列表 请求时间间隔(ms)
		},
		
		init: function(attr){
			var me = this;

			me.attr=_.extend({}, me.defaultAttr, attr||{});
			
			//初始化主dom元素 和 model对象
			me.$view = $(me.view);
			
			me.model = {
				'commonList': null,                         //等待已结束 列表数据
				'serviceList': null,                		//服务中     列表数据
				'serviceCount': null                        //服务中     列表飘数数据
			};

			me.selectDialog = new SelectDialog();           //发起新对话弹窗

			me.initDom();
			me.initEvent();
			me.onOpenConnect = function(){};                //打开对话窗口回调
			me.onCloseConnect = function(){};               //关闭对话窗口回调

			me.commonTimer = null;   		  				//等待结束轮询句柄
			me.serviceTimer = null;       	  				//服务中对话轮询句柄

			/*
			*@ 存储对话对象列表
			*/
			me.connects = {};                 				//当前所有的连接对象数组
			me.currentConnect = null;         				//当前激活的连接对象               

			/*
			*@ 触发第一个tab span 点击事件
			*/
			me.$view.find('.session-tab span').eq(0).trigger('click');
			
			/*
			*@ 请求三个列表 并开始轮询
			*/
			me.getCommonList(true);
			me.getServiceList();

		},
		initDom: function(){
			var $view = this.$view;

			this.$waitList = $view.find('#kf_wait');
			this.$serviceList = $view.find('#kf_service');
			this.$endList = $view.find('#kf_end');
			this.$waitNum = $view.find('.kf_wait'); 
			this.$serviceNum = $view.find('.kf_service');
			this.$endNum = $view.find('.kf_end');
            //this.$waitNumRefresh = $view.find( '.wait-info .queueCount' );
			
			this.$emptyTip = $view.find('.connect-empty');
		},
		initEvent: function(){
			var me = this;


			// tab切换事件 三个列表的显示隐藏  
			me.$view.on('click','.session-tab span',function(e){

				var $span = $(e.currentTarget),
					$target = me.$view.find($span.attr('data-target'));

				$span.addClass('active').siblings().removeClass('active');
				$target.addClass('active').siblings().removeClass('active');
			});


			// 列表点击事件 打开新的对话窗口
			me.$view.on('click','.kf-session li:not(.emptyTip)',function(e){
				var $li = $(e.currentTarget);

				me.$waitList.find('ul>li').removeClass('active');
				me.$serviceList.find('ul>li').removeClass('active');
				me.$endList.find('ul>li').removeClass('active');

				$li.addClass('active');
				var $count = $li.find('.session-count');
					$count && $count.removeClass('active');
				me.openConnect( $li.data('m') );
			});

			// 手动刷新 按钮
			me.$view.on('click','.wait-info',function(e){
				me.getCommonList(true);
			});
			
			// 发起新对话
			me.$view.on('click','.btn-new',function(e){
				me.selectDialog.show();		
			});
			me.selectDialog.on('select',function( model ){

				var bool = me.checkIsInService( model.sessionId );
				if(bool){
					me.addSession( model );
				}else{
					me.$serviceList.find('ul li[data-sessionid="'+model.sessionId+'"]').trigger('click');
				}
			});
		},

		// 检查是否是在服务列表中
		// 在列表中返回   false
		// 不在列表中返回 true
		checkIsInService: function( sessionId ){
			var me = this;

			var bool = true;
			_.each( me.model['serviceList'] , function( item,index ){
				if(item.sessionId == sessionId) bool = false;	
			})
			return bool;
		},

		//渲染
		render: function(){  
			var me = this;

			me.attr['wrapper'] && me.attr['wrapper'].html(me.$view);
		},

		/*
		* 获取等待和结束列表信息
		* bool 为true时 显示加载符 为false或不传时不显示加载符号
		*/
		getCommonList: function(bool){
			var me = this;

			me.commonTimer && clearTimeout(me.commonTimer);
			
			if(bool){
				me.$waitList.addClass('loading');
				me.$endList.addClass('loading');
			}

			util.api({
				'type':'post',
				'url':'/message/getsessionlistwithoutservice',
				'success':function(data){
					
					if(data.success){
						me.model['commonList'] = data.value;
						me.renderCommonList();
						me.blinkTitle();
					}
				},
				'complete':function(xhr,textstatus){
					if(bool){
						me.$waitList.removeClass('loading');
						me.$endList.removeClass('loading');
					}

					me.commonTimer = setTimeout(function(){ me.getCommonList() }, me.attr['commonListTimeInterval']);
				}
			})

		},


		/*
		*@ 有等待的人或未读消息 标题闪烁
		*/
		blinkTitle: function( ){
			var me = this;
			me.toastInterval && clearInterval( me.toastInterval );

			//是否有等待的人
			var hasWait = false;
			if(me.model['commonList'] && me.model['commonList']['wait'].length > 0){
				hasWait = true;
			}

			//是否有飘数
			var hasUnread = false;
			var serviceCount = me.model['serviceCount'] || {};
			for(var key in serviceCount){
				if(serviceCount[key]['noReadCount'] > 0){
					hasUnread = true;
					break;
				}
			}
			
			//变换函数
			var titleState = 0;
			function changeTitle(){
				if( titleState == 0 ){
					document.title = "【新消息】汇聚-纷享逍客畅享智慧工作";
					titleState = 1;
				}else{
					document.title = "【　　　】汇聚-纷享逍客畅享智慧工作";
					titleState = 0;
				}
			}

			if(hasWait || hasUnread){
				
				me.toastInterval = setInterval( changeTitle , 800 );
			}else{
				document.title = "汇聚-纷享逍客畅享智慧工作";
			}
		},

		/*
		 * 渲染等待 已结束列表数据
		 */
		renderCommonList: function(){
			var me = this,
				model = me.model['commonList'];

            var $waitListUl = me.$waitList.find('ul').empty();
            me.$waitNum.text( model['wait'].length );
            if(model.wait.length <= 0){
            	$waitListUl.html("<li class='emptyTip'><p>暂无对话</p></li>");
            }else{
            	_.each(model.wait,function(item,i){
            		me.parseItem(item);
	            	var $item = $( me.waitlistTpl({'info':item}) );
	            		$item.data('m',item);
	            	$waitListUl.append($item);
            	})
            }

            var $endListUl = me.$endList.find('ul').empty();
            me.$endNum.text( model['end'].length );
            if(model.end.length <= 0){
            	$endListUl.html("<li class='emptyTip'><p>暂无对话</p></li>");
            }else{
            	_.each(model.end,function(item,i){
            		me.parseItem(item);
	            	var $item = $( me.endlistTpl({'info':item}) );
	            		$item.data('m',item);
	            	$endListUl.append($item);
            	})	
            }
            
            //me.$waitNumRefresh.text( model['wait' ].length );
		},

		/*
		 * 单次获取服务列表信息
		 */
		getServiceList: function(){
			var me = this;

			me.$serviceList.addClass('loading');
			util.api({
				'type':'post',
				'url':'/message/getsessionlistinservice',
				'success': function(data){
					//console.warn(data);
					if(data.success){
						me.model['serviceList'] = data.value.model;
						me.renderServiceList();
						me.getCountOfSession();
					}
				},
				'complete': function(){
					
					me.$serviceList.removeClass('loading');
				}
			})
		},

		//渲染服务中列表数据
		renderServiceList: function(){
			var me = this,
				model = me.model['serviceList'];
         	
            me.$serviceNum.text( model.length );
            var $serviceListUl = me.$serviceList.find('ul').empty();

            if(model.length <= 0){
            	$serviceListUl.html("<li class='emptyTip'><p>暂无对话</p></li>");
            }else{
            	_.each(model,function(item,i){
            		me.parseItem(item);
	            	var $item = $( me.servicelistTpl({'info':item}) );
	            		$item.data('m',item);
	            	$serviceListUl.append($item);
            	})
            }
		},

		/*
		* 获取服务列表飘数及更新数据
		*/
		getCountOfSession: function(){
			var me = this;

			me.serviceTimer && clearTimeout(me.serviceTimer);
			
			//如果列表为空
			//清空model中的serviceCount
			//并停止闪烁
			if( me.$serviceList.find('ul li:not(.emptyTip)').length <= 0 ) {
				me.model['serviceCount'] = {};
				me.renderCountOfSession();
				me.blinkTitle();
				return;
			}

			util.api({
				'url': '/message/getcountofsession',
				'success': function(data){

					me.model['serviceCount'] = data['value'];
					me.renderCountOfSession();
					me.blinkTitle();
				},
				'complete': function(xhr,textstatus){
					me.serviceTimer = setTimeout(function(){ me.getCountOfSession() }, me.attr['serviceListTimeInterval']);
				}
			})
		},

		/*
		* 渲染飘数及最后对话时间
		* 渲染完成后 对列表进行排序
		*/
		renderCountOfSession: function(){
			var me = this,
				model = me.model['serviceCount'];

			me.$serviceList.find('.session-count').removeClass('active');

			_.each(model, function(item, key){

				var $section = me.$serviceList.find('[data-sessionid="'+key+'"]');
				if($section){
					var	m = $section.data('m');	
					m.lastMsgTime = item.lastMsgTime;
					if( m.lastMsgTime ){
						m.lastMsgDisplayTime = new Date(m.lastMsgTime)._format("yyyy.MM.dd hh:mm");
					}else{
						m.lastMsgDisplayTime = "";
					}

					$section.find('.user-time .servertime').text(m.lastMsgDisplayTime);
					if( item.noReadCount > 0 ) {
						$section.find('.session-count').text(item.noReadCount).addClass('active');
					}
				}
			})

			me.sortServiceList();
		},

		//对服务中列表进行排序
		//冒泡排序
		//todo 排序后和以前一样 不重新刷新列表
		//todo 如果本来列表为空 应该进行空提示
		sortServiceList: function(){
			var me = this;

			var $lists = me.$serviceList.find('ul li:not(.emptyTip)');
			$lists.sort(function(a,b){
				return ( $(b).data('m')['lastMsgTime'] - $(a).data('m')['lastMsgTime'] );
			}).detach();
			me.$serviceList.find('ul').html($lists);
		},

		/*
		 * 打开对话窗口
		 * 先检测是否已经打开 没打开就打开新的
		 */
		openConnect: function( data ){
			var me = this,
				connects = me.connects;

            var sessionId = data.sessionId,
            	clientId = data.clientId;

            var info = _.extend( {'wrapper':me.$view.find('.kf-connect-wrapper')}, data );
    
			if( me.currentConnect && (sessionId == me.currentConnect.attr['sessionId']) ){
				return;
			}

			//超过十个窗口 则移除掉
			var length = 0; 
			for(var key in connects){
				
				if(length >= 9){
					connects[key].remove && connects[key].remove();
					delete connects[key]
				}else{
					connects[key].hide();
				}

				length = length + 1;
			}

			if( connects[sessionId] ){
				connects[sessionId].show();
			}else{
				connects[sessionId] = new Connect(info,data,me);
				connects[sessionId].render();
				connects[sessionId].onTurnService = function( sessionId , model ){
					me.getCommonList();
					me.addSession( model );
				};
				connects[sessionId].onTurnWait = function(sessionId){
					me.getCommonList();
					me.deleteSession(sessionId);
					me.onCloseConnect();

					me.currentConnect = null;
					delete connects[sessionId];
				};
				connects[sessionId].onTurnEnd = function(sessionId){
					me.getCommonList();
					me.deleteSession(sessionId);
					me.onCloseConnect();

					me.currentConnect = null;
					delete connects[sessionId];
				};
			}

			me.currentConnect = connects[sessionId];

			/*
			 * 触发打开窗口 事件回调
			 */
			me.onOpenConnect && me.onOpenConnect( clientId );
		},


		/***
		*@func 将新session加入服务中列表 并触发点击事件 
		*/
		addSession: function(model){
			var me = this;

			//如果有无session提示 先清空
			me.$serviceList.find('ul .emptyTip').remove();

			//对model进行转化
			me.parseItem(model);

			//加至服务中列表的人 最后服务人员的名字改为自己
			model.customeServiceName = IBSS.role.name;
			
			me.model['serviceList'].push( model );

			var $item = $( me.servicelistTpl({'info':model}) ).data('m',model);

			me.$serviceList.find('ul').prepend( $item );
			me.$serviceNum.text( me.$serviceList.find('ul li:not(.emptyTip)').length );

			me.$serviceNum.trigger('click');
			$item.trigger('click');
			me.getCountOfSession();
			me.getCommonList();
		},

		//对单个session数据model 进行转化
		parseItem: function(item){
			if( item.lastMsgTime ){
				item.lastMsgDisplayTime = new Date(item.lastMsgTime)._format("yyyy.MM.dd hh:mm");
			}else{
				item.lastMsgDisplayTime = "";
			}
            if( item.clientHeadPicPath && item.clientHeadPicPath.length > 0 ) {
                item.avatar = IBSS.DOWNLOAD_URL+'/downloadavatar?path=' + item.clientHeadPicPath + '2.jpg&ea=' + item.clientCompanyAccount;
            } else {
                item.avatar = IBSS.COMMON_PATH + '/images/avatar-client-36.png';
            }
		},

		//移除服务中列表的一个session
		deleteSession: function(sessionId){
			var me = this;

			me.$serviceList.find('ul [data-sessionid="'+sessionId+'"]').remove();
			if( me.$serviceList.find('ul>li').length <=0 ){
				me.$serviceList.find('ul').html("<li class='emptyTip'><p>暂无对话</p></li>");
			}
			me.$serviceNum.text( me.$serviceList.find('ul li:not(.emptyTip)').length );

			var index;
			for(var i=0; i<me.model['serviceList'].length ; i++){
				if( me.model['serviceList'][i]['sessionId'] == sessionId  ){
					index = i;
					break;
				}
			}
			if(index != undefined){
				me.model['serviceList'].splice(index,1);
			}
		},

		//消除
		destory:function(){
			var me = this;

			clearTimeout(me.commonTimer);
			clearTimeout(me.serviceTimer);
		}
	}

	var connectTpl = $template.filter('#connecttpl').html(),
		connectlistTpl = $template.filter('#connectlisttpl').html();

	////////////////////////////////
	//  对话连接
	//  轮询触发函数 getmsg 
	////////////////////////////////
	function Connect(){
		this.init.apply(this,arguments);
	} 
	Connect.prototype={

		view: connectTpl,

		defaultAttr:{
			'wrapper':null,      			//外层容器
			'sessionId':'',      			//对话Id
			'clientName':'',     			//客户姓名
			'company':'',        			//公司名称
			'msgTimeInterval': 5000,    	//信息轮询间隔
			'status':null        			//当前对话类型 1: 等待 2: 服务中 3: 已结束
		},

		//初始化函数
		init: function(attr,model,parentList){
			var me = this;

			me.attr = _.extend({},me.defaultAttr,attr||{});
			me.parentList = parentList;
			me.$view = $(me.view).attr('data-sessionid',me.attr['sessionId']).attr('data-status',me.attr['status']).data('m',model);
			me.$view.find('.title-left h4').text( me.attr.clientName );
            me.$view.find('.title-left p').text( me.attr.company );


			me.fastreplydialog = new FastReplyDialog();

			me.imgfile = null;           	//图片文件
			me.commonfile = null;        	//附件

			me.audioTimer = null;         	//录音事件计时句柄
			me.msgTimer = null;           	//信息轮询的时间句柄 

			me.audiodata = {             	//语音文件
				'blob': null,       	 	//audio的blob数据
				'duration': 0       	 	//audio时长
			};

			me.model = {          //对话记录 数据对象缓存
				startId: -1,	  //起始id 
				endId: 0,         //结束id     
				list:null         //对话数据
			};       		

			me.initDom();
			me.initEvent();

			//转至服务中
            me.onTurnService = function(){};
			//转至结束
			me.onTurnEnd = function(){};
			//转至等待
			me.onTurnWait = function(){};
		},

		//初始化dom元素
		initDom: function(){
			var me = this;
			
			//消息显示 发送
			me.$infoContainer = me.$view.find('.connect-content');         //消息容器
			me.$infowrapper = me.$view.find('.content-info');              //消息画布
			me.$contentSend = me.$view.find('.connect-send');              //发送区域
			me.$textarea = me.$view.find('.area-textarea');
			
			//快捷回复
			me.$fastreply = me.$view.find('.bar-fastreply');        //快捷回复
			me.$fastreplycontent = me.$fastreply.find('.fastreply-content');
			me.$fastreplylist = me.$fastreplycontent.find('.fastreply-list');
			me.$fastreplyset = me.$fastreplycontent.find('.fastreply-set');
			me.$savereply = me.$view.find('[name="savereply"]');

			//表情
			me.$bq = me.$view.find('.bar-bq');                      
			me.$bqcontent = me.$bq.find('.bq-content');

			//录音
			me.$recorderbar = me.$view.find('.bar-recorder');
			me.$recordercontent = me.$view.find('.area-audio');
			me.$recorderbtn = me.$view.find('.btn-record');
			me.$audiofile = me.$view.find('.audio-file');
			me.$audioplay = me.$audiofile.find('.audio-play');
			me.$audiodelete = me.$audiofile.find('.audio-delete');


			//图片
			me.$inputImg = me.$view.find('[name="inputimg"]');

			//附件
			me.$inputFile = me.$view.find('[name="inputfile"]');

			//附件显示框
			me.$areaMedia = me.$view.find('.area-media');

			//发送按钮
			me.$send = me.$view.find('.btn-send');
		},

		//初始化事件
		initEvent: function(){
			var me = this;

			/**
			* 发送事件
			* 判断当前对话状态
			* 如果不处于服务中 先转换状态
			*/
			function sendEve(){
				if( me.$view.attr('data-status') != 2 ) {
                    me.preSend(function(){
                    	me.send();
                    });
                } else {
                    me.send();
                }
			}
			

			/**
			* 发送信息
			* enter 发送
			* ctrl+enter 换行
			*/
			me.$view.on('click','.btn-send',sendEve);
			me.$textarea.on('keydown',function(e){
				if( e.keyCode == 13 ){
					if( e.ctrlKey ){
						var value = me.$textarea.val() + '\n';
						me.$textarea.val( value );
						return true;
					}else{
						e.preventDefault();
						e.stopPropagation();
						sendEve();
						return false;
					}
				}
			});

			//textarea change事件
			me.$textarea.on('input',function(){ me._refreshCheck(); });
			

			//富媒体事件注册
			me.$inputImg.on('change',function(e){ me.imgChangeEve(e); me._refreshCheck(); });
			me.$inputFile.on('change',function(e){ me.fileChangeEve(e); me._refreshCheck(); });
			me.$view.on('click','.media-delete',function(e){
				me.$areaMedia.empty();
				me.imgfile = null; me.commonfile = null;
				me._refreshCheck();
			});

			// 状态转换事件注册
			me.$view.on('click','.btn-wait',function(){ me.turnWait(); });
			me.$view.on('click','.btn-end',function(){ me.turnEnd(); });


			// 快捷回复事件注册
			me.$view.on('click','.fastreply-ico',function(e){ me.fastReplyIcoEve(e); me.$bqcontent.hide(); });
			me.$view.on('click','.fastreply-list',function(e){ me.fastReplyListEve(e); me._refreshCheck(); });
			me.$view.on('click','.fastreply-set',function(e){ me.fastReplySetEve(e) });


			//表情事件注册
			me.$view.on('click','.bq-ico',function(e){ me.bqIcoEve(e); me.$fastreplycontent.removeClass('active'); });
			me.$view.on('click','.main-cookie',function(e){ me.cookieEve(e); me._refreshCheck(); });
			me.$view.on('click','.main-emotion',function(e){ me.emotionEve(e) });
			me.$view.on('click','.content-tab',function(e){
				e.stopPropagation();
				var $target = $(e.target),
					index = $target.index();
				
				$target.addClass('active').siblings().removeClass('active');
				me.$bqcontent.find('.content-main div').eq(index).show().siblings().hide();
			});


			// 聊天记录滚动事件
			// 滚动到顶部若 0.6 秒内还在顶部 则拉取历史信息
			var timer;
			me.$infoContainer.on('scroll',function(){
				if(timer) clearTimeout(timer);
				timer = setTimeout(function(){
					if( me.$infoContainer.scrollTop() <= 0) me.preGetMsg();
				},600);
			});

			// 录音按钮事件注册
			// 进行录音模式的开启和关闭
			me.$recorderbar.on('click',function(){
				
				if( !me.$recorderbar.hasClass('active') ){
					
					if( me._isAbleRecord() ){

						me._clearAudioData();
						me.$recorderbar.addClass('active');
						me.$recorderbar.siblings('span').addClass('deactive');
						me.$recordercontent.show();
						me.$view.find('.send-btn').addClass('audiomode');
					}

				}else{

					if( me.$recorderbtn.attr('data-status') == '1' ){
						alert('正在录音中');
						return;
					}
					me.$recorderbar.removeClass('active');
					me.$recorderbar.siblings('span').removeClass('deactive');
					me.$recordercontent.hide();
					me.$view.find('.send-btn').removeClass('audiomode');
					me._clearAudioData();
				}
			})

			me.$recorderbtn.on('click',function(e){ me.recorderEve(e) });
			me.$audioplay.on('click',function(e){
				FWRecorder.playBack('audio');
			});
			me.$audiodelete.on('click',function(e){ me._clearAudioData(); });

            me.$view.on('click', '.ac', function(e) {
                me.playAudio( e );
            });

			me.onBodyClick = function(e){
				me.$fastreplycontent.removeClass('active');
				me.$bqcontent.hide();	
			};
			
			$body.on( 'click' , me.onBodyClick );
		},

		//上传图片事件
		imgChangeEve: function(e){
			
			var me = this;

			////////////////
			//
			// ie11下value = '' 会触发change事件
			// 这里做个判断 如果 value = '' 直接返回
			///////////////
			if(me.$inputImg[0].value == '') return;
			

			//进行类型和大小检测
			//不符合条件的直接返回
			var imgfile = me.$inputImg[0].files[0];
			var type = imgfile.type.split('/')[1];

			if( type != 'jpg' && type != 'jpeg' && type !='png'){
				alert('请选择类型为jpg或png的图片文件');
				me.clearFileInput( me.$inputImg[0] );
				return false;
			}

			if( imgfile.size > 5000000){
				alert('请选择小于5MB的图片文件');
				me.clearFileInput( me.$inputImg[0] );
				return false
			}

			me.imgfile = imgfile;
			me.commonfile = null;

			var imgDom = '<section data-type="I">'
						+	'<span class="media-ico media-icoimg"></span>'
						+	'<span class="media-name">' + me.imgfile.name + '</span>'
						+	'<span class="media-delete">删除</span>'
						+ '</section>';
			me.$areaMedia.html(imgDom);
			me.clearFileInput( me.$inputImg[0] );
		},

		//上传附件事件
		fileChangeEve: function(e){
			
			var me = this;
			if(me.$inputFile[0].value == '') return;

			var file = me.$inputFile[0].files[0];
			if( file.size > 5000000 ){
				alert('请选择小于5MB的文件');
				me.clearFileInput( me.$inputFile[0] );
				return false;
			}

			me.commonfile = file;
			me.imgfile = null;

			var fileDom = '<section data-type="D">'
						+	'<span class="media-ico media-icofile"></span>'
						+	'<span class="media-name">' + me.commonfile.name + '</span>'
						+	'<span class="media-delete">删除</span>'
						+ '</section>';
			me.$areaMedia.html(fileDom);
			me.clearFileInput( me.$inputFile[0] );
		},

		//清空file
		clearFileInput: function(file){
			/*
		    if (file.outerHTML) {  // for IE, Opera, Safari, Chrome
		        file.outerHTML = file.outerHTML;
		    } else { // FF(包括3.5)
		        file.value = "";
		    }
		    */
		    file.value = "";
		},

		//快捷回复标志点击事件
		fastReplyIcoEve: function(e){
			e.stopPropagation();

			if( $(e.currentTarget).parent().hasClass('deactive') ) return;

			if(this.$fastreplycontent.hasClass('active')){
				this.$fastreplycontent.removeClass('active');
			}else{
				this.getFastReply();
				this.$fastreplycontent.addClass('active');
			}
		},

		//快捷回复列表点击事件
		fastReplyListEve: function(e){
			e.stopPropagation();
			this.$textarea.val($(e.target).text());
			this.$fastreplycontent.removeClass('active');
		},

		//快捷回复设置点击事件
		fastReplySetEve: function(e){
			this.fastreplydialog.show();
		},

		//表情ico
		bqIcoEve: function(e){
			e.stopPropagation();

			if( $(e.currentTarget).parent().hasClass('deactive') ) return;

			this.$view.find('.content-tab span').eq(0).trigger('click');
			this.$bqcontent.toggle();
		},

		//饼干表情内容点击
		cookieEve: function(e){
			var me = this;

			e.stopPropagation();
			var $target = $(e.target);
			var str = '['+$target.attr('data-name')+']';
			me.$bqcontent.hide();
			me._insertTextArea(str);
		},

		//小蜜蜂表情内容点击
		emotionEve: function(e){
			var me = this;

			e.stopPropagation();
			var id = $(e.target).attr('data-id');
			me.$bqcontent.hide();
			if( me.$view.attr('data-status') != 2 ) {
                me.preSend(function(){

                	me.$contentSend.addClass('sending');
                	me.sendEmotion(id,function(){
						me.getMsg();
					},true);
                });
            } else {

            	me.$contentSend.addClass('sending');
                me.sendEmotion(id,function(){
					me.getMsg();
				},true);
            }
		},

		//textarea光标处插入内容
		_insertTextArea: function( value ){
			var me = this,
            	textarea = me.$textarea[0];

            if (document.selection) {
                textarea.focus();
                sel = document.selection.createRange();
                sel.text = value;
                textarea.focus();
            }else if ( textarea.selectionStart || textarea.selectionStart == 0) {
                    var startPos = textarea.selectionStart;
                    var endPos = textarea.selectionEnd;
                    var scrollTop = textarea.scrollTop;
                    textarea.value = textarea.value.substring(0, startPos) + value + textarea.value.substring(endPos, textarea.value.length);
                    textarea.focus();
                    textarea.selectionStart = startPos + value.length;
                    textarea.selectionEnd = startPos + value.length;
                    textarea.scrollTop = scrollTop;
            }else {
                textarea.value += value;
                textarea.focus();
            }
		},

		//检测是否可以录音
		_isAbleRecord: function(){

			/*
			* 判断是否安装了flash
			*/
			if( swfobject.getFlashPlayerVersion().major == 0 ){
				alert("您的浏览器未安装FlashPlayer 请安装FlashPlayer后再使用录音功能");
				return false;
			}

			/*
			* 部分设备 即使插入了录音设备也无法检测成功 所有暂时注释
			*/
			
			/*
            if ( !FWRecorder.isReady ) {
                alert("请在录音插孔插入录音设备 否则无法使用录音功能 插入耳机后请刷新浏览器");
                return false;
            }

			if( !FWRecorder.isMicrophoneAccessible ){
				alert("请允许本网站使用录音设备 否则无法使用录音功能");
                FWRecorder.showPermissionWindow({permanent: true});
				return false;
			}
			
			*/

			return true;
		},

		//录音按钮点击事件
		recorderEve: function(e){
			var me = this;
			
			//点击均会清除 计时句柄
			me.audioTimer && clearTimeout( me.audioTimer );


			/*
			* 0 可以录制
			* 1 录制中
			*/
			var status = me.$recorderbtn.attr('data-status');
			if( status == 0){
				if( !me._isAbleRecord() ) return;

				try{
					FWRecorder.record('audio', 'audio.wav'); 
				}catch(err){
					me.$recorderbar.trigger('click');
					alert('请检查录音插孔是否已经插入录音设备 否则无法录音');
					return;
				}

				//若录音时长已过1分钟 自动触发结束点击事件
				me.audioTimer = setTimeout(function(){ me.$recorderbtn.trigger('click') },60000);

				me.$send.hide();
				me.$recorderbtn.text('点击结束录音').attr('data-status','1');
			}else{

				me.$send.show();
				me.$recorderbtn.text('点击开始录音').attr('data-status','0');

				try{
					FWRecorder.stopRecording('audio'); 
					me.audiodata.blob = FWRecorder.getBlob("audio");
					me.audiodata.duration = Math.ceil( FWRecorder.duration("audio") || 1 );
				}catch(err){
					me.$recorderbar.trigger('click');
					alert('请检查录音插孔是否已经插入录音设备 否则无法录音');
					return;
				}
				me.$audiofile.addClass('active');
			}
		},

		//清除录音信息
		//隐藏录音文件的显示
		_clearAudioData: function(){
			var me = this;

			me.audioTimer && clearTimeout( me.audioTimer );
			me.audiodata.blob = null;
			me.audiodata.duration = 0;
			me.$audiofile.removeClass('active');
		},

		////
		// 根据输入框的状态 刷新自定义回复是否可选
		////
		_refreshCheck: function(){
			var me = this;
			var isAble = true;

			var $section = me.$areaMedia.find('section'),
				textContent = me.$textarea.val();

			if( $section.length > 0){
				isAble = false;
			}else if( (textContent.length <= 0) || (textContent.length > 30) ){
				isAble = false;
			}

			if(isAble == false){
				me.$savereply[0].checked = false;
				me.$savereply[0].disabled = true;
			}else{
				me.$savereply[0].disabled = false;
			}
		},

		render: function(){
			
			if(!this.attr['wrapper']){
				throw('wrapper属性未赋值');
				return;
			}
			this.attr['wrapper'].append(this.$view);
			this.show();
		},

		// 等待中 已结束session 发送请求前须转换状态
		// 成功转换后 发送信息
        preSend: function(callback) {
            var me = this;

            util.api({
                type: 'post',
                url: '/message/acceptsession',
                data: { sessionId: me.attr['sessionId'] },
                success: function( data ) {
                    if ( data.success ) {

                    	me.$view.attr('data-status',2).data('m',data['value']['model']);
                        me.onTurnService( me.attr.sessionId , data['value']['model']);
                        callback();
                    } else {
                        util.showToast( data.message );
                    }
                }
            });
        },

        ////////////////////////
        //  发送纷享大表情    //
        ////////////////////////
        sendEmotion: function( emotionId,callback,closeMask ){
        	var me = this;

        	util.api({
        		'type':'post',
        		'url':'/message/sendmessage',
        		'data':{
        			'sessionId': me.attr['sessionId'],
        			'previousMessageId': me.model['endId'],
        			'content': JSON.stringify({'PackId':'FSB-0','Index':emotionId}),
        			'messageType': "E"
        		},
        		'success': function(data){
        			callback();
        		},
        		'complete': function(){
        			if(closeMask){ me.$contentSend.removeClass('sending') }
        		}
        	})
        },

        ////////////////////////
        //      发送文件      //
        ////////////////////////
        sendFile: function( type,callback, closeMask ){
         	var me = this;

         	var fd = new FormData(),
         		xhr = new XMLHttpRequest();

         	xhr.open('post',IBSS.API_PATH+'/upload/uploadtempfile',true);

         	switch(type){
         		
         		//语音文件
         		case 'A':
         		xhr.onreadystatechange = function(){
         			if(xhr.readyState==4 && xhr.status==200){
         				var info = JSON.parse(xhr.response);
         				var content = JSON.stringify( {'File':info['value']['tempPath'],'Duration': me.audiodata.duration} );
         				sendMsg(content);
         			}
         		}
         		fd.append('upfile',me.audiodata.blob,'audio.wav');
         		xhr.send(fd);
         		break;

         		//图片文件
         		case 'I':
         		xhr.onreadystatechange = function(){
         			if(xhr.readyState==4 && xhr.status==200){
         				var info = JSON.parse(xhr.response);
         				var content = JSON.stringify( {'Image':info['value']['tempPath']} );
         				sendMsg(content);
         			}
         		}
         		fd.append('upfile',me.imgfile);
         		xhr.send(fd);
         		break;
         		
         		//文档文件
         		case 'D':
         		xhr.onreadystatechange = function(){
         			if(xhr.readyState==4 && xhr.status==200){
         				var info = JSON.parse(xhr.response);
         				var content = JSON.stringify( {'File':info['value']['tempPath'],'Name':me.commonfile.name} );
         				sendMsg(content);
         			}
         		}
         		fd.append('upfile',me.commonfile);
         		xhr.send(fd);
         		break;
         	}

         	//发送信息
         	function sendMsg(content){
         		util.api({
					'type':'post',
					'url':'/message/sendmessage',
					'data':{
						'sessionId': me.attr['sessionId'],
						'content': content,
						'previousMessageId': me.model['endId'],
						'messageType': type
					},
					'success': function(data){
						callback();
					},
					'complete': function(){
						if( closeMask ){ me.$contentSend.removeClass('sending'); }
					}
				})
         	}
        },

	    ///////////////////////
	    //		发送文本	 //
	    ///////////////////////
	    sendTxt: function( content,callback, closeMask){
	    	var me = this;

	    	// 如果保存自定义回复check 开启
	    	// 则发送请求保存自定义回复
	    	if(me.$savereply[0].checked){
	    		util.api({
					'type': 'post',
					'url': '/quickmessage/add',
					'data': {
						'content':content
					},
					'success': function( data ){
						if(data.success){
							//todo
						}
					}
				})
	    	}

	    	util.api({
				'type':'post',
				'url':'/message/sendmessage',
				'data':{
					'sessionId': me.attr['sessionId'],
					'content': content,
					'previousMessageId': me.model['endId'],
					'messageType':'T'
				},
				'success': function(data){
					if( data.success ){
						callback();
					}
				},
				'complete': function(){
					if( closeMask ){ me.$contentSend.removeClass('sending'); }
				}
			})
	    },

	    //检测输入框内容不能全部为空
	    //返回 true     不为空
	    //返回 false    为空
        _checkBlankSpace: function(str){

		    while(str.lastIndexOf(" ")>=0){
		      	str = str.replace(" ","");
		    }
		    while(str.lastIndexOf("\n")>=0){
		    	str = str.replace('\n','');
		    }
		    if(str.length == 0){
		     	return false;
		    }
		    return true;
		},

		//清空附件和文本框
		_clear: function(){
			var me = this;

			me.$textarea.val('');
			var $mediadelete = me.$areaMedia.find('.media-delete');
			$mediadelete && $mediadelete.trigger('click');


			me.$savereply[0].checked = false;
			me.$savereply[0].disabled = true;
		},

		//////////////////////
		//  发送信息总接口  //
		//  层层嵌套        //
		//////////////////////
		send: function(){
			var me = this;
			
			//判断是否处于录音模式
			if( me.$recorderbar.hasClass('active') ){

				if( me.audiodata.blob == null ){
					alert('请先录音');
					return;
				}
				me.$contentSend.addClass('sending');
				me.sendFile('A',function(){
					me.$recorderbar.trigger('click');
					me.getMsg();
				},true)

			}else{

				//检测是否有附件
				var $section = me.$areaMedia.find('section'),
					type,
					textContent = me.$textarea.val();

				if( $section.length > 0){
					type = $section.attr('data-type');

					me.$contentSend.addClass('sending');
					me.sendFile(type,function(){
						
						if( me._checkBlankSpace(textContent) == false ){
							me._clear();
							me.getMsg();
							me.$contentSend.removeClass('sending');
						}else{

							me.sendTxt(textContent,function(){
								me._clear();
								me.getMsg();
							},true);
						}
					});

				}else{

					if( me._checkBlankSpace(textContent) == false ){
						alert("输入不能全部为空");
						return false;
					}else{
						//开启遮罩
						me.$contentSend.addClass('sending');
						me.sendTxt( textContent,function(){
							me._clear();
							me.getMsg();
						},true);
					}
				}
			}
		},

		//获取先前的信息 并增加消息显示
		preGetMsg: function(){
			var me = this;
			if( me.model['startId'] == 0 ){ return };

			util.api({
				'type':'post',
				'url':'/message/getmessages',
				'data':{
					'sessionId':me.attr['sessionId'],
					'startId':me.model['startId']
				},
				'success': function(data){
					if(data.success){
						if(data.value['model'].length <= 0) return;
						me.model['list'] = data.value['model'].reverse();
						me.model['startId'] = me.model['list'][0]['previousMessageId'];
						me.preAddList();
					}
				}
			})
		},

		preAddList: function(){
			var me = this,
				model = me.model['list'];

			me.parseList( model,function(){
				var listDom = '';
				for(var i = 0; i < model.length; i++){
					listDom = listDom + me.shiftModel( model[i] );
				}

				var $listDom = $(listDom);
				me.$infowrapper.prepend($listDom);
				
				var height = 0;
				for(var j = 0; j < $listDom.length; j++){
					height = height + $listDom.eq(j).outerHeight( true );
				}
				me.$infoContainer.scrollTop( height );
			});
		},

		//清除已有信息轮询
		clearMsgTime: function(){
			this.msgTimer && clearTimeout( this.msgTimer );
		},

		//////////////
		// 获取最新信息 并刷新显示列表
		// 成功后更新状态
		// 并接着轮询
		// bool 为true 滑动到底部
		// ///////////
		getMsg: function( bool ){
			var me = this;
			me.clearMsgTime();

			util.api({
				'type':'post',
				'url':'/message/getmessages',
				'data':{
					'sessionId':me.attr['sessionId']
				},
				'success': function(data){
					if( data.success ){
						// 将消息列表内容按时间顺序排列
						me.model['list'] = data.value['model'].reverse();
						
						//如果长度为0 直接返回
						var length = me.model['list'].length;
						if(length == 0) return;
						

						//me.model['startId'] = me.model['list'][0]['previousMessageId'] || 0;
						
						var startId = me.model['list'][0]['previousMessageId'] || 0;
						var endId = me.model['list'][length-1]['messageId'];
						
						me.parentList.getCountOfSession();
						
						//只有有新信息的时候才会刷新列表
						//新列表刷新的时候 也会主动触发session列表的服务列表的飘数更新函数
						if( me.model['endId'] < endId){
							me.model['endId'] = endId;
							me.model['startId'] = startId;
							me.refreshList();
						}

						if( bool ){
							me._scrollBottom();
						}

						//todo
						//当获取新信息时 如果正好滑到上面 需要有提示
						//如何保证信息的连续性
					}
				},
				'complete': function(){
					me.setRead( me.attr['sessionId'], me.model['endId'] );
				}
			})
		},

		// 设置已读已发送标识
		// complete后进行轮询
        setRead: function( sessionId, msgId ) {
        	var me = this;

        	//当对话窗口里没有信息时 直接进行轮询查看是否有信息
        	//
        	if( msgId == 0 ){
        		me.msgTimer = setTimeout(function(){ me.getMsg() }, me.attr['msgTimeInterval'] );
        	}else{
        		util.api({
	                url: '/message/updatelastread',
	                data: { sessionId: sessionId, readMessageId: msgId },
	                success: function( data ) {
	                    if( data.success ) {
	                    	var $section = me.$infowrapper.find('section[data-id="'+data['value']['model']+'"]');

	                   		//标为已读
	                   		try {

	                   			var $target = findPrevSection( $section );
	                   			if( $target ){
	                   				$target.addClass('read').removeClass('arrived').siblings().removeClass('read');

	                   				//设为已读后 高度增加 有可能需要上滑20像素
	                    			//上滑一次后 不用再次上滑
	                    			//var top = me.$infoContainer.scrollTop();
	                    			//me.$infoContainer.scrollTop( 20 + top );
	                   			} 
	                   		} catch (err){
	                   			throw err;
	                   		}
	                    }
	                },
	                complete: function(){
	                	me.msgTimer = setTimeout(function(){ me.getMsg() }, me.attr['msgTimeInterval'] );
	                }
	            });
        	}

        	/**
        	* 找到可标为已读的section
        	* section若为通知类型 查找上一个section 
        	*/
        	function findPrevSection(section){
        		
        		//为空
        		if( !section || section.length <=0 ){
        			return false;
        		}

        		if( section.hasClass('news') ){
        			return findPrevSection( section.prev() );
        		}else{
        			return section;
        		}
        	}

        },



        ////////////////////////////
        //
        // 对列表中的数据进行预处理 通过id获取name
		// 刷新显示列表 获取最新信息
		// 查看模板引擎的渲染原理
		//
		////////////////////////////
		refreshList: function(){
			var me = this,
				model = me.model['list'];

			me.parseList( model,function(){
				var listDom = '';
				for(var i=0; i<model.length ; i++){
					listDom = listDom + me.shiftModel( model[i] );
				}
				me.$infowrapper.html(listDom).find('section.info-r:last').addClass('arrived').siblings().removeClass('arrived');

				//滚动到底部
				me._scrollBottom();
			});
		},

		//滚动到聊天窗口底部
		_scrollBottom: function(){
			var me = this;
			var heightSpace = me.$infowrapper.outerHeight( true ) - me.$infoContainer.height();
			if(heightSpace < 0){ heightSpace = 0;}
			me.$infoContainer.scrollTop( heightSpace );
		},

		/////////////////////
		//
		//对聊天信息进行预处理
		//获取发送者name 转化时间 成功后执行callback
		//
		//////////////////////
		parseList: function( model,callback ){
			var me = this;

			//收集需要获取name的id
			var cacheUsers = {};
			_.each( model,function( element,index ){
				if( element.senderType == 1 ){
                    if ( element.senderId.indexOf('S.S.') != 0 ) {
                        var id = parseInt( element.senderId.split( '.' )[ 2 ] );
                        if ( IBSS.USERS[ id ] ) return;
                        cacheUsers[ id ] = false;
                    }
				}	
			});

			//获取name
			if( _.isEmpty(cacheUsers) ){
				refresh();
			}else{
				_.each( cacheUsers,function( value,key ){
					util.api({
						'url':'~/g/api/account/getnamebyid',
						'data':{
							'id':key
						},
						success: function(data){
							if( data.success ){
								cacheUsers[key] = data['value']['model'];
								IBSS.USERS[key] = data['value']['model'];
								if( checkOk() ){
									refresh();
								}
							}
						}
					})
				});
			}


			//检查客户名字是否已经获取完毕
			function checkOk(){
				for(var key in cacheUsers){
					if( cacheUsers[key] == false ) return false;
				}
				return true;
			}


			//转换时间
			function refresh(){
				for(var i = 0; i < model.length; i++){
                    var m = model[i];
					if( model[i]['senderType'] == 1){
                        if ( m.senderId.indexOf('S.S.') == 0 ) {
                            model[ i ].serverName = '纷享团队';
                        } else {
                            model[ i ][ 'serverName' ] = IBSS.USERS[ model[ i ][ 'senderId' ].split( '.' )[ 2 ] ];
                        }
					}else{
						model[i]['serverName'] = '';
					}
					model[i]['displayMessageTime'] = util.translateTime( model[i]['messageTime'] );
				}
				callback();
			}
		},

		//信息的数据dom转换
		shiftModel: function(info){

			var type = info.senderType,
				classType,
				sectionDom;


            var content = '', jc, avatar = '', ac = '';
            if ( info.messageType != 'T' ) {
                jc = $.parseJSON( info.content );
                //console.log( jc );
            }


            /*
             *type  0客户 1客服
             */
            if( type == 1){
                classType = 'info-r';
                avatar = IBSS.COMMON_PATH + '/images/avatar-human-36.png';
            }else{
                classType = 'info-l';
                avatar = this.attr.avatar;
            }

            // info.messageType
            // info.senderId
            switch( info.messageType ) {
                case "T":
                    if ( info.senderId == 'S.S.1' ) {
                        classType += ' bee';
                        avatar = IBSS.COMMON_PATH + '/images/avatar-bee-36.png';
                    } else if( info.senderId == 'S.S.2' ) {
                        classType += ' human';
                    } else {

                    }
                    content = util.emojiAll( info.content );
                    content = util.replaceLink( content );
                    break;
                case "A":
                    classType += ' audio';
                    content = '<div class="ac" data-src="' + jc.File + '" data-duration="' + jc.Duration + '"><img src="' + IBSS.COMMON_PATH + '/images/audio-grey.png" /><span class="duration">' + jc.Duration + '\'\'</span><div class="j-player"></div></div>';
                    break;
                //图片文件
                case "I":
                    classType += ' img';
                    content = '<a target="_blank" href="' + IBSS.DOWNLOAD_URL + '/previewfile?path=' + jc.Image  + '"><img src="' + IBSS.DOWNLOAD_URL + '/downloadfile?path=' + jc.Thumbnail  + '" alt="" /></a>';
                    break;
                case "E":
                    classType += ' emotion';
                    content = '<img src="' + IBSS.COMMON_PATH + '/images/kf' + '/' + jc.PackId + '/fs_bee_' + jc.Index + '.gif" />';
                    break;
                //文档
                case "D":
                    classType += ' document';
                    content = '<span class="preview"></span><div class="dc"><p><span class="title">' + jc.Name + '</span><span class="size">' + util.getFileSize(jc.Size) + '</span></p><p class="opts"><a class="opt" target="_blank" href="' + IBSS.DOWNLOAD_URL + '/downloadfile?path=' + jc.File + '&name=' + jc.Name + '">下载</a></p></div>';
                    break;
                
                //通知
                case "News":
                	if( jc.AC == "inapp" ){
                		jc.inAppName = util.getInAppName( jc.R );
                	}

                    classType = 'news human';
                    content = '<p class="tt">' + jc.Tt + '</p>'
                    		  + '<p class="time">' + util.formatDate( info.messageTime, 'YYYY-MM-dd') + '</p>' 
                    		  + ( jc.CP == '' ? '' : '<p class="cp"><img src="' + IBSS.DOWNLOAD_URL + '/downloadfile?path=' + jc.CP + '" /></p>' ) 
                    		  + '<p class="s">' + jc.S + '</p>';
                    ac = ( jc.AC == 'webview' ? '<p class="more">图文详情</p>' : '<p class="more">跳转到:  ' + jc.inAppName + '</p>' );
                    break;
                
                case 'LWN':
                    content = '[链接到工作提醒]';
                    break;
                case 'LWI':
                    content = '[链接到工作项]';
                    break;
                case 'LWS':
                    content = '[链接到日程]';
                    break;
                case 'LWV':
                    content = '[链接到投票]';
                    break;
                case 'L':
                    classType += ' map';
                    content = '<a title="' + jc.Text + '" target="_blank" href="http://m.amap.com/navi/?dest=' + jc.Longitude + ',' + jc.Latitude + '&destName=' + jc.Text + '&key=47a6ca401e4e72bccc0691a9df65aef1"><img src="' + IBSS.COMMON_PATH + '/images/kf' + '/map.png" alt="" /><span>' + jc.Text + '</span></a>';
                    break;
            }
			sectionDom = '<section class="' + classType + '" data-id="' + info['messageId'] +'">'
							+   '<p class="section-time">' + info['displayMessageTime'] + '</p>'
							+ 	'<div class="section-avatar"><img src="'+ avatar+'"/></div>'
							+ 	'<div class="section-msg">'
							+       '<div class="msg-name">' + info['serverName'] + '</div>'
							+ 		'<div class="msg"><span class="ak"></span>' + content + '</div>'
                            +       ac
							+   	'<p class="msg-state"><span class="state-read">已读</span><span class="state-arrived">已送达</span></p>'
							+ 	'</div>'
							+ '</section>';
			
			return sectionDom;
		},

		// 显示dom元素
		// 触发轮询
		show: function(){
			this.$view.show();
			this.getMsg( true );
			return this;
		},

		// 隐藏dom元素
		// 解除轮询
		hide: function(){
			this.$view.hide();
			this.clearMsgTime();
			return this;
		},
		
		// 移除
		remove: function(){
			var me = this;

			me.$view.remove();
			me.clearMsgTime();
			$body.off( 'click' , me.onBodyClick );
		},

		// 获取快捷回复列表
		getFastReply:function(){
			var me = this;

			util.api({
				'type': 'post',
				'url': '/quickmessage/getall',
				'beforeSend': function(){
					me.$fastreplylist.html('正在努力加载中...');
				},
				'success': function(info){

					var domStr = "";
					_.each(info.value.model,function(value){
						
						var str = "<p data-id='"+value['id']+"'>"+ value['content'] +"</p>"

						domStr = domStr + str;
					})
					me.$fastreplylist.html( domStr );
				}
			})
		},

		// 转至等待中列表
		turnWait: function(){
			var me = this;

            util.api({
                url: '/message/forwardsessiontowaiting',
                method: 'post',
                data: { sessionId: me.attr['sessionId'] },
                success: function( data ) {
                    if ( data.success ) {
                    	/*
                    	var model = me.$view.data('m');
                    	model.status = 1;
                    	me.$view.attr('data-status',1).data('m',model);
                    	me.clearMsgTime();  	//清除信息轮询
                        */
                        me.remove();
                        me.onTurnWait( me.attr['sessionId'] );
                    } else {
                        util.showToast( data.message );
                    }
                }
            });
		},

		// 转至结束列表
		turnEnd: function(){
			var me = this;

            util.api({
                url: '/message/stopsession',
                method: 'post',
                data: { sessionId: me.attr['sessionId'] },
                success: function( data ) {
                    if ( data.success ) {
                    	/*
                    	var model = me.$view.data('m');
                    	model.status = 3;
                    	me.$view.attr('data-status',3).data('m',model);
                    	me.clearMsgTime(); 		//清除信息轮询
                        */
                        me.remove();
                        me.onTurnEnd( me.attr['sessionId'] );
                    } else {
                        util.showToast( data.message );
                    }
                }
            });
		},

        /**
         *
         * @param evt
         * @private
         */
        playAudio: function (evt) {
            var me = this,
                $this = $(evt.currentTarget),
                audio = $this.data('audio');
            if (!audio) {
                var src = $this.attr( 'data-src' ),
                    duration = $this.attr( 'data-duration' );
                //console.log( $this );
                audio = new AudioPlayer({
                    element: $this.find('.j-player'),
                    "audioSrc": IBSS.DOWNLOAD_URL + '/downloadfile?path=' + src,
                    "themeStyle": 1,
                    "length": duration
                });
                audio.on('playing', function () {
                    $this.children( 'img' ).attr( 'src', IBSS.COMMON_PATH + '/images/audio-play-grey.gif' );
                    $this.addClass('state-playing');
                });
                audio.on('stoping pausing', function () {
                    $this.children( 'img' ).attr( 'src', IBSS.COMMON_PATH + '/images/audio-grey.png' );
                    $this.removeClass('state-playing');
                });
                $this.data('audio', audio);
            }

            if ($this.hasClass('state-playing')) {
                audio.stop();
            }
            else {
                audio.play();
            }
            evt.stopPropagation();
        }
		
	};

	module.exports = Kf;
});

