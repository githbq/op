/**
 *
 *  添加企业
 *  todo
 *  接口校验
 *  初始化id时初始化选择产品
 */
define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./addenterprise.html');
	var uploader = require('common/widget/upload').uploader;
	var AreaTree = require('module/areatree/areatree'); 

	var industryMap = {},    //行业MAP
		productMap = {},     //产品MAP
		sourceMap = {},      //来源MAP
		provinceMap = {},    //省市MAP
		groupMap = {};       //团队类型MAP

	var AddEnt = MClass( M.Center ).include({
		view: contentStr,
		/*
		defaultAttr:{
			'title': '添加企业',
			'width': 680
		},
		*/
		init: function(){
			AddEnt.__super__.init.apply( this,arguments );
			var me = this;


			/**
			 *
			 * 进行状态变换
			 * 如果是付费企业
			 * 显示一些额外信息
			 */
			if( me.attrs['isPay'] == true ){
				//
				me.$view.find('.state-pay').show();
				me.$title.text('付费企业注册');
			}

			/**
			 *
			 * 选择区域初始化
			 */
			me.areaTree = new AreaTree();
            me.areaTree.on('selectarea',function( treenodes ){
                
                me.$regionName.val( treenodes[0]['name'] ).attr('data-code', treenodes[0]['code'] );
            });
            me.$regionName.on('click',function(){
            	me.areaTree.show();
            });

			me.model.set('enterpriseName', IBSS.tempEnterprise['enterpriseName']);
			//me.model.set('regionName', IBSS.tempEnterprise['regionName']);
			me.model.set('address', IBSS.tempEnterprise['address']);
			me.model.set('keyContactName', IBSS.tempEnterprise['representative']);
			me.model.set('enterpriseFilingId', IBSS.tempEnterprise['id']);
			me.model.set('source', IBSS.tempEnterprise['source']);
			me.model.set('industry', IBSS.tempEnterprise['industry']);
			me.model.set('contractCopy', '');
			me.model.set('contractCopyFileName', '');


			IBSS.tempEnterprise['enterpriseName'] && me.$('.enterpriseName').attr('disabled','disabled');
			IBSS.tempEnterprise['address'] && me.$('.address').attr('disabled','disabled');
			IBSS.tempEnterprise['representative'] && me.$('.keyContactName').attr('disabled','disabled');
			IBSS.tempEnterprise['source'] && me.$('.e-source').attr('disabled','disabled');
			IBSS.tempEnterprise['industry']&& me.$('.e-industry').attr('disabled','disabled');

			me.model.set('enterpriseFilingId', IBSS.tempEnterprise['id']);

			if( IBSS.tempEnterprise['regionName'] ){
				me.$regionName.val( IBSS.tempEnterprise['regionName'] ).attr('disabled','disabled');
			}

			me.model.set('enterpriseFilingId', IBSS.tempEnterprise['id']);

			//获取所有必须的枚举信息
			me.getEnums();
			
			//记录所有的枚举信息是否获取完毕
			me.state = false;

			/**
			 *
			 * 合同上传
			 * input[file]变更时 合同文件自动上传
			 */
			me.$contract.on('change',function(){
				var Extlist = ".BMP.GIF.JPEG.JPG.PNG";
				var file_name = /\.[^\.]+/.exec(this.value);
				if(Extlist.indexOf(file_name[0].toUpperCase()) == -1){
					this.value = '';
				}
			});
			me.$contractCopy.on('change',function(){
				var Extlist = ".BMP.GIF.JPEG.JPG.PNG";
				var file_name = /\.[^\.]+/.exec(this.value);
				if(Extlist.indexOf(file_name[0].toUpperCase()) == -1){
					this.value = '';
				}else{
					me.$actionAdd.attr('disabled','disabled');
					me.$actionAdd.text('文件上传...');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$contractCopy[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('contractCopy', response.value.model.path );
							me.model.set('contractCopyFileName', response.value.model.FileName );
							
							me.$actionAdd.removeAttr('disabled');
							me.$actionAdd.text('提交');
						},
						'error':function(response){
							me.$actionAdd.removeAttr('disabled');
							me.$actionAdd.text('提交');
							me.$contractCopy.val('');
							return false;
						}
					})
				}
			});

			me.$businessLicense.on('change',function(){
				var Extlist = ".BMP.GIF.JPEG.JPG.PNG";
				var file_name = /\.[^\.]+/.exec(this.value);
				if(Extlist.indexOf(file_name[0].toUpperCase()) == -1){
					this.value = '';
				}
			});

			me.$companyGate.on('change',function(){
				var Extlist = ".BMP.GIF.JPEG.JPG.PNG";
				var file_name = /\.[^\.]+/.exec(this.value);
				if(Extlist.indexOf(file_name[0].toUpperCase()) == -1){
					this.value = '';
				}
			});

			me.$startTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});
            me.$endTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});

           /**
            *
            * 获取折扣信息
            */
           /**
            *
            * 调试信息
            *
            *window.debugmodel = me.model;
            */
		},
		events:{
			'click .action-add': 'addEve',
			'click .action-cancel': 'cancelEve'
		},

		elements: {
			'.enterprise-content h3': 'title',
			'.e-industry': 'industry',
			'.e-source': 'source',
			'.e-province': 'province',
			'.e-group': 'group',
			'.e-knowsource': 'knowsource',
			'.e-motive': 'motive',
			'.contract': 'contract',
			'.contractCopy': 'contractCopy',
			'.companyscale':'companyscale',
			'.saleteamscale':'saleteamscale',
			'.endTime': 'endTime',

			'.contractprice': 'contractprice',        //合同金额
			'.deviceamount': 'deviceamount',          //终端数量
			'.marketingAccountAmount': 'marketingAccountAmount',          //营销版数量数量
			'.action-add': 'actionAdd',

			'.startTime': 'startTime',                //合同开始时间
            '.endTime': 'endTime',                    //合同结束时间
            '.businessLicense':'businessLicense',
            '.companyGate':'companyGate',
            '.contract':'contract',
			'.useBusinessCard':'useBusinessCard',
			'.card-price':'cardPrice',
			'.regionName': 'regionName'
		},


		//获取枚举值
		getEnums: function(){
			var me = this;
			
			var state = {
				'i': false,
				'e': false,
				'p': false,
				'g': false,
				'k': false,
				'r': false,
				'c': false,
				's': false
			};

			//检查是否获取完毕
			function check(){
				if( state.i && state.e && state.p && state.g && state.k && state.r && state.c && state.s){
					me.state = true;
					me.model.set('source', IBSS.tempEnterprise['source']);
					me.model.set('industry', IBSS.tempEnterprise['industry']);
				}
			}

			//获取枚举值 并赋值给select
			function generate( Ename , Map , $select , str ){
				var list = [{'name':'请选择','value':''}];

				util.getEnums( Ename , function( data ){
					data.value.model.forEach( function( item ){
						Map[item.value] = item;
						list.push({'name':item.text,'value':item.value});
					});
					util.resetSelect($select,list);
					if( str ){
						state[ str ] = true;
					}

					check();
				})
			}

			//合同金额改变
			me.$contractprice.on('focusout',function(){
				me.model.set('contractPrice',parseFloat(me.model.get('contractPrice'))?parseFloat(me.model.get('contractPrice')):'');
				me.getdiscount();
			});
			//终端总量
			me.$deviceamount.on('focusout',function(){
				var buyCount = me.model.get('marketingAccountAmount')?parseInt(me.model.get('marketingAccountAmount')):0;
				me.model.set('accountTotalAmount',parseInt(me.model.get('accountTotalAmount'))?parseInt(me.model.get('accountTotalAmount')):'');
				if(buyCount>0){
					me.getFreeNum();
				}
				
			});

			//营销版数量改变
			me.$marketingAccountAmount.on('focusout',function(){
				me.getFreeNum();
				me.getdiscount();
			});

			//开始时间
			me.$startTime.on('focusout',function(){
				me.getdiscount();
			});

			//结束时间
			me.$endTime.on('focusout',function(){
				me.getdiscount();
			});
			//是否使用名片
			me.$useBusinessCard.on('change',function(){
				me.getdiscount();
			});


			//获取行业列表
			generate('INDUSTRY', industryMap , me.$industry , 'i');

			//获取来源
			generate('ENT_LST_SOURCE', sourceMap , me.$source , 'e');

			//获取省市
			generate('PROVINCE', provinceMap , me.$province , 'p');

			//获取团队类型
			generate('GROUP_TYPE', groupMap , me.$group , 'g');

			//获取了解渠道
			generate('KNOW_SOURCE', {} , me.$knowsource , 'k');

			//获取注册动机
			generate('REGISTER_MOTIVE', {} , me.$motive , 'r');

			//获取公司规模
			generate('CAMPANY_SCALE', {} , me.$companyscale , 'c');

			//获取销售团队规模
			generate('SALE_TEAM_SCALE', {} , me.$saleteamscale ,'s');

			$('.e-industry').val(me.model.get('INDUSTRY'));
		},
		//获取赠送数量
		getFreeNum: function(){
			var me = this;

			var buyCount = me.model.get('marketingAccountAmount')?parseInt(me.model.get('marketingAccountAmount')):0;
			me.model.set('marketingAccountAmount',parseInt(me.model.get('marketingAccountAmount'))?parseInt(me.model.get('marketingAccountAmount')):'');
			
			var	sumNum =  me.$deviceamount.val()?parseInt(me.$deviceamount.val()):0;
			if(sumNum>0&&sumNum<buyCount){
				util.showToast('营销版数量不能大于销客终端数量');
				me.model.set('marketingAccountAmount','');
				return false;
			}
			/*
			if(sumNum!=0&&(sumNum-buyCount)>15){
				util.showToast('终端赠送上限为15,请修改终端总量!');
				me.$deviceamount.val('');
				return false;
			}
			*/
			if(buyCount>0){
				me.model.set('isPaid','1');
			}else{
				me.model.set('isPaid','0');
			}
		},
		
		//获取折扣
		getdiscount: function(){
			var me = this;

			var accountAmount = me.model.get('marketingAccountAmount'),
				contractPrice = me.model.get('contractPrice'),
				buyBusinessCard = me.model.get('useBusinessCard');

			var contractStartTime = '';  
			var contractEndTime = '';

			if( me.$startTime.val() ){
				contractStartTime = new Date( me.$startTime.val() ).getTime();
			}
			if( me.$endTime.val() ){
				contractEndTime = new Date( me.$endTime.val() ).getTime();
			}
			if( contractStartTime && contractEndTime && buyBusinessCard =='1'){
				util.api({
					'url':'/enterprise/getbusinesscardprice',
					'data':{
						'contractStartTime':contractStartTime,
						'contractEndTime':contractEndTime
					},
					'success': function( data ){
						if( data.success ){
							me.model.set('cardPrice', data.value.model);
							me.$cardPrice.show();
							console.log(data);
							return false;
						}
					}
				});
			}
			if(buyBusinessCard =='0'){
				me.$cardPrice.hide();
				me.model.set('cardPrice','');
			}


			if( accountAmount && contractPrice && contractStartTime && contractEndTime && buyBusinessCard ){
			

				me.discountxhr && me.discountxhr.abort();
				me.discountxhr = util.api({
					url:'/enterprise/getdiscount',
					'data':{
						'accountAmount': accountAmount,
						'contractStartTime': contractStartTime,
						'contractEndTime': contractEndTime,
						'contractPrice': contractPrice,
						'buyBusinessCard':buyBusinessCard
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							if(data.value.model<0){
								me.model.set('discount', '');
								util.showToast('计算所得折扣小于0,合同金额需大于等于名片金额！');
								return false;
							}
							me.model.set('discount', data.value.model);
							me.$actionAdd.text('提交');
							me.$actionAdd.removeAttr('disabled');
						}else{
							me.$actionAdd.text('提交');
							me.$actionAdd.removeAttr('disabled');
						}
					}
				})
			}
		},

		/**
		 * 上传各附件
		 */
		uploadFile: function( callback , errorcallback ){
			var me = this;
			var state = {
				'contract': true,
				'business': true,
				'gate': true
			};

			if( me.$contract[0].files.length > 0 ){
				state.contract = false;
			}
			if( me.$businessLicense[0].files.length > 0 ){
				state.business = false;
			}
			if( me.$companyGate[0].files.length > 0 ){
				state.gate = false;
			}

			//检查是否全都上传完毕
			function check(){
				if( state.contract && state.business && state.gate ){
					callback && callback();
				}
			}

			if( !state.contract ){
				uploader.send({
                    'url': '/op/api/file/uploadsinglefileandcheck',
                    'files': me.$contract[0].files,
                    'options':{'limittype':'IMAGE'},
                    'success': function( response ){
                        me.model.set('contract', response.value.model.path );
                        me.model.set('contractFileName', response.value.model.FileName );
                        state.contract = true;
                        check();
                    },
                    'error': function(){
                    	errorcallback && errorcallback();
                    }
                });
			}
			if( !state.business ){
				uploader.send({
                    'url': '/op/api/file/uploadsinglefileandcheck',
                    'files': me.$businessLicense[0].files,
                    'options':{'limittype':'IMAGE'},
                    'success': function( response ){
                        me.model.set('businessLicense', response.value.model.path );
                        me.model.set('businessLicenseFileName', response.value.model.FileName );
                        state.business = true;
                        check();
                    },
                    'error': function(){
                    	errorcallback && errorcallback();
                    }
                })
			}
			if( !state.gate ){
				uploader.send({
                    'url': '/op/api/file/uploadsinglefileandcheck',
                    'files': me.$companyGate[0].files,
                    'options':{'limittype':'IMAGE'},
                    'success': function( response ){
                        console.warn( response );
                        me.model.set('companyGatePicture', response.value.model.path );
                        me.model.set('companyGatePictureFileName', response.value.model.FileName );
                        state.gate = true;
                        check();
                    },
                    'error': function(){
                    	errorcallback && errorcallback();
                    }
                })
			}
		},

		//显示
		render: function(){
			var me = this;
			me.attrs['wrapper'].html( me.$view );
		},

		cancelEve: function(){
			location.hash = "#agentsupport/entprisefiling";
		},
		/**
		 * 添加企业
         */
		addEve: function(){
			var me = this;
			var startTime,endTime;
			
			if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() ).getTime();
            }
            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() ).getTime();
            }
			me.model.set('dealDays',parseInt(me.model.get('dealDays'))?parseInt(me.model.get('dealDays')):'');
			me.model.set('storageTotalSpace',parseFloat(me.model.get('storageTotalSpace'))?parseFloat(me.model.get('storageTotalSpace')):'');
            me.model.set('contractStartTime',startTime);
            me.model.set('contractEndTime',endTime);
            me.model.set('enterpriseShortName',me.model.get('enterpriseAccount'));
            me.model.set('productId',1);
			//me.model.set('marketingAccountAmount',me.model.get('marketingAccountAmount'));
            var model = me.model.all();
			
			/*
            if( !me.$regionName.val() ){
				util.showToast('请选择区域');
				return false;
			}else{
				me.model.set( 'regionName', me.$regionName.val() );
			}
			*/
			/*if( !me.state ){
				util.showTip('信息未获取完毕 请稍等');
				return;
			}*/
			var countNum =me.model.get('accountTotalAmount')? parseInt(me.model.get('accountTotalAmount')):0;
			var singleNum = me.model.get('marketingAccountAmount')?parseInt(me.model.get('marketingAccountAmount')):0;
			if(countNum==0 && singleNum==0){
				util.showToast('销客终端数量与营销版数量不能同时为零！');
				return false;
			}

			/*
			if(singleNum!=0 && countNum!=0 && (countNum-singleNum)>15){
				util.showToast('终端赠送上限为15！');
				return false;
			}else if(countNum!=0 && singleNum==0 && countNum>15){
				util.showToast('终端赠送上限为15！');
				return false;
			}
			*/
			if(countNum==0&&singleNum>0){
				me.model.set('accountTotalAmount',me.model.get('marketingAccountAmount'));
			}
			
			if(countNum!=0&&(countNum<singleNum)){
				
				util.showToast('营销版数量不能大于销客终端数量');
				return false;
			}
			var state = true; 
			//检测必填项
			me.$('.required').each(function(){
				var $this = $( this );
				var attr = $this.attr('ce-model');

				if( !me.model.get(attr) ){
					util.warnInput( $this );
					state = false;
				}else{
					util.unWarnInput( $this );
				}
			});

			if(me.$contract[0].files.length <= 0){
				util.warnInput( $('.contract') );
				state = false;
			}else{
				util.unWarnInput( $('.contract') );
			}

			if( !me.model.get('contractStartTime') ){
				util.warnInput( $('.startTime') );
				state = false;
			}else{
				util.unWarnInput( $('.startTime') );
			}

			if( !me.model.get('contractEndTime') ){
				util.warnInput( $('.endTime') );
				state = false;
			}else{
				util.unWarnInput( $('.endTime'));
			}

			if( state == false ){
				util.showToast('信息填写不完整');
				return ;
			}
			
			me.$actionAdd.text('提交中....');
			me.$actionAdd.attr('disabled','disabled');

			//付费企业开通
			me.uploadFile(function(){
            	util.api({
					'url':'/enterprise/addpaidenterprise',
					'data': me.model.all(),
					'success': function( data ){
						console.warn(data);
						if( data.success ){
							util.showTip('付费企业开通审批提交成功');
							location.hash = "#agentsupport/entprisefiling"
						}
					},
					complete: function(){
						me.$actionAdd.text('提交');
						me.$actionAdd.removeAttr('disabled');
					}
				});
            },function(){
            	me.$actionAdd.text('提交');
				me.$actionAdd.removeAttr('disabled');
            });
		}

	});

	module.exports = AddEnt;
});
