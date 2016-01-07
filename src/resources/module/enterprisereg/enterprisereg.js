/**
 *
 *  添加企业
 *  todo
 *  接口校验
 *  初始化id时初始化选择产品
 */
define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./enterprisereg.html');
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
				me.$product.removeAttr('disabled');
				me.$title.text('付费企业注册');
			}
			//获取所有必须的枚举信息
			me.getEnums();

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
            })
				
			me.model.set('enterpriseName', IBSS.tempEnterprise['enterpriseName']);
			me.model.set('address', IBSS.tempEnterprise['address']);
			//me.model.set('regionName', IBSS.tempEnterprise['regionName']);
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
			IBSS.tempEnterprise['industry'] && me.$('.e-industry').attr('disabled','disabled');

			if( IBSS.tempEnterprise['regionName'] ){
				me.$regionName.val( IBSS.tempEnterprise['regionName'] ).attr('disabled','disabled');
			}

			me.model.set('enterpriseFilingId', IBSS.tempEnterprise['id']);


			//记录所有的枚举信息是否获取完毕
			me.state = false;

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
			'.content-product': 'product',
			'.companyscale':'companyscale',
			'.saleteamscale':'saleteamscale',
			'.endTime': 'endTime',

			'.yearlimit': 'yearlimit',               //合同年限
			'.contractprice': 'contractprice',       //合同金额
			'.deviceamount': 'deviceamount',          //终端数量
			'.action-add': 'actionAdd',

			'.startTime': 'startTime',
            '.endTime': 'endTime',
            '.businessLicense':'businessLicense',
            '.companyGate':'companyGate',

            '.regionName': 'regionName'
		},

		/**
		 *
		 * 上传各种文件
		 */
		uploadFile: function( callback , errorcallback){
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
				's': false,
				'pr': false
			};

			//检查是否获取完毕
			function check(){
				if( state.i && state.e && state.p && state.g && state.k && state.r && state.c && state.s && state.pr ){
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
		
			//获取产品列表
			/*util.api({
				'url': '/product/querypage',
				'data': {
					'isPage':1
				},
				'success': function( data ){
					console.warn( data );
					var list = [{'name':'请选择','value':''}];
					if( data.success ){
						data.value.model.content.forEach( function( item ){
							list.push( {'name':item.name,'value':item.id} );
							productMap[item.id] = item;
						});
						util.resetSelect( me.$product,list );
						state['pr'] = true;

						check();
					}
				}
			});*/

			/**
			 *
			 * 产品变更 相关数量也变更
			 */
			me.$product.on('change',function(){

				var id = me.$product.val();
				if( id ){

					var info = productMap[id];
					me.model.set('accountTotalAmount', info.deviceMaxCount );
					// me.model.set('smsTotalAmount', info.textMessageCount );
					me.model.set('storageTotalSpace', info.storage );
				}
			});

			/**
			 *
			 * 动态计算折扣
			 */
			//年限改变
			/*me.$yearlimit.on('change',function(){
				me.getdiscount();
			});*/

			//合同金额改变
			me.$contractprice.on('focusout',function(){
				me.model.set('contractPrice',parseFloat(me.model.get('contractPrice'))?parseFloat(me.model.get('contractPrice')):'');
				me.getdiscount();
			});

			//终端数量改变
			me.$deviceamount.on('focusout',function(){
				me.model.set('accountTotalAmount',parseInt(me.model.get('accountTotalAmount'))?parseInt(me.model.get('accountTotalAmount')):'');
				
				me.getdiscount();
			});
			//合同开始时间
			me.$startTime.on('focusout',function(){
				me.getdiscount();
			});
			//合同结束时间时间
			me.$endTime.on('focusout',function(){
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
		
		//获取折扣
		getdiscount: function(){
			var me = this;

			var buyCount = me.model.get('accountTotalAmount'),
				amount = me.model.get('contractPrice');
				
			var contractStartTime = '';  
			var contractEndTime = '';

			if( me.$startTime.val() ){
				contractStartTime = new Date( me.$startTime.val() ).getTime();
			}
			if( me.$endTime.val() ){
				contractEndTime = new Date( me.$endTime.val() ).getTime();
			}

			if( buyCount && contractEndTime && amount && contractStartTime){

				me.discountxhr && me.discountxhr.abort();
				me.discountxhr = util.api({
					url:'/enterprise/getdiscount',
					'data':{
						'buyCount': buyCount,
						'contractStartTime': contractStartTime,
						'contractEndTime': contractEndTime,
						'amount': amount
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							if(tempDiscount<0){
								util.showToast('计算所得折扣小于0，请重新调整金额！');
								return false;
							}
							me.model.set('discount', data.value.model);
						}
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
         * 分为免费企业注册 和 付费企业注册
         */
		addEve: function(){
			var me = this;
			tme = me;
			var startTime='',endTime='';
			if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() ).getTime();
            }
            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() ).getTime();
            }
	
      		me.model.set('enterpriseShortName',me.model.get('enterpriseAccount'));
            me.model.set('contractStartTime',startTime);
            me.model.set('contractEndTime',endTime);
			me.model.set('accountTotalAmount',me.$deviceamount.val());
			me.model.set('storageTotalSpace',parseFloat(me.model.get('storageTotalSpace'))?parseFloat(me.model.get('storageTotalSpace')):'');
			me.model.set('dealDays',parseInt(me.model.get('dealDays'))?parseInt(me.model.get('dealDays')):'');
            var model = me.model;

			
			/**
			 *
			 * 进行信息校验
			 */
			//企业名称
			if( !model.get('enterpriseName') ){
				util.showToast('请填写企业名称');
				return false;
			}
			
			//企业账号
			if( !model.get('enterpriseAccount') ){
				util.showToast('请填写企业账号');
				return false;
			}
			
			/*
			if( !me.$regionName.val() ){
				util.showToast('请选择区域');
				return false;
			}else{
				me.model.set( 'regionName', me.$regionName.val() );
			}
			*/

			//地址
			if( !model.get('address') ){
				util.showToast('请填写地址');
				return false;
			}
			//行业信息
			if( !model.get('industry') ){
				util.showToast('请选择行业信息');
				return false;
			}
			//来源信息
			if( !model.get('source') ){
				util.showToast('请选择来源信息');
				return false;
			}
			//省市
			if( !model.get('province') ){
				util.showToast('请选择省市信息');
				return false;
			}
			//团队类型
			if( !model.get('groupType') ){
				util.showToast('请选择团队类型');
				return false;
			}
			//了解渠道
			if( !model.get('knowSource') ){
				util.showToast('请选择了解渠道');
				return false;
			}
			//注册动机
			if( !model.get('registerMotive') ){
				util.showToast('请选择注册动机');
				return false;
			}
			//公司规模
			if( !model.get('companyScale') ){
				util.showToast('请选择公司规模');
				return false;
			}
			//销售团队规模
			if( !model.get('saleTeamScale') ){
				util.showToast('请选择销售团队规模');
				return false;
			}
			
			//城市
			if( !model.get('city') ){
				util.showToast('请填写城市信息');
				return false;
			}
			//成交周期
			if( !model.get('dealDays') ){
				util.showToast('请填写成交周期');
				return false;
			}
			//企业负责人姓名
			if( !model.get('keyContactName') ){
				util.showToast('请填写企业负责人姓名');
				return false;
			}
			//企业负责人电话
			if( !model.get('keyContactPhone') ){
				util.showToast('请填写企业负责人电话');
				return false;
			}
			//企业负责人邮箱
			if( !model.get('keyContactEmail') ){
				util.showToast('请填写企业负责人邮箱');
				return false;
			}
			//平台管理员
			if( !model.get('contactName') ){
				util.showToast('请填写平台管理员姓名');
				return false;
			}
			//平台管理员电话
			if( !model.get('contactPhone') ){
				util.showToast('请填写平台管理员电话');
				return false;
			}
			//平台管理员邮箱
			if( !model.get('contactEmail') ){
				util.showToast('请填写平台管理员邮箱');
				return false;
			}
			if( !model.get('contractStartTime') ){
				util.showToast('请填写合同开始时间');
				return false;
			}
			if( !model.get('contractEndTime') ){
				util.showToast('请填写合同结束时间');
				return false;
			}
			var sumCount = me.$deviceamount.val()?parseInt(model.get('accountTotalAmount')):0;
			
			if(sumCount==0){
				util.showToast('请填写销客终端总量');
				return false;
			}
			
			/*
			if(sumCount==0||sumCount>15){
				util.showTip('请填写销客终端总量且上限为15');
				return false;
			}
			*/
			
			if(!model.get('storageTotalSpace')){
				util.showToast('请填写空间总量');
				return false;
			}
			if( me.$contract[0].files.length <= 0 ){
				util.showToast('请选择合同文件');
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
			

			if( state == false ){
				util.showToast('信息填写不完整');
				return ;
			}
			
			
			me.$actionAdd.text('提交中....');
			me.$actionAdd.attr('disabled','disabled');

            me.uploadFile(function(){
            	util.api({
					'url':'/enterprise/addfreeenterprise',
					'data': me.model.all(),
					'success': function( data ){
						console.warn(data);
						if( data.success ){
							util.showTip('开通审批提交成功');
							location.hash = "#agentsupport/entprisefiling";
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
			//}
		}

	});

	module.exports = AddEnt;
});
