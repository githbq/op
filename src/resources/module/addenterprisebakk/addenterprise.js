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
			
			//crm事件
			me.$('.crm-check').on('click',function(){
				if(me.$('.crm-check').is(':checked')){
					me.$('.crm-show').show();
					me.$('.crm-control').removeAttr('disabled');
				}else{
					me.$('.crm-show').hide();
					me.$('.crm-control').attr('disabled','disabled');
				}
			});
			
			//pk助手事件
			me.$('.pk-check').on('click',function(){
				if(me.$('.pk-check').is(':checked')){
					me.$('.pk-show').show();
					me.$('.pk-control').removeAttr('disabled');
				}else{
					me.$('.pk-show').hide();
					me.$('.pk-control').attr('disabled','disabled');
				}
			});
			
			//会议助手事件
			me.$('.meet-check').on('click',function(){
				if(me.$('.meet-check').is(':checked')){
					me.$('.meet-show').show();
					me.$('.meet-control').removeAttr('disabled');
				}else{
					me.$('.meet-show').hide();
					me.$('.meet-control').attr('disabled','disabled');
					me.$('.meet-control').val('');
				}
			});
			
			
			//Hr助手事件
			me.$('.hr-check').on('click',function(){
				if(me.$('.hr-check').is(':checked')){
					me.$('.hr-show').show();
					me.$('.hr-control').removeAttr('disabled');
				}else{
					me.$('.hr-show').hide();
					me.$('.hr-control').attr('disabled','disabled');
					me.$('.hr-control').val('');
				}
			});
			//工资助手事件
			me.$('.pay-check').on('click',function(){
				if(me.$('.pay-check').is(':checked')){
					me.$('.pay-show').show();
					me.$('.pay-control').removeAttr('disabled');
				}else{
					me.$('.pay-show').hide();
					me.$('.pay-control').attr('disabled','disabled');
					me.$('.pay-control').val('');
				}
			});
			
			//crm --时间--start
			me.$('.crm-startTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$('.crm-endTime').val() ? me.$('.crm-endTime').val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$('.crm-endTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$('.crm-startTime').val() ? me.$('.crm-startTime').val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			//crm --时间--end
			
			//pk --时间--start
			me.$('.pk-startTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$('.pk-endTime').val() ? me.$('.pk-endTime').val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$('.pk-endTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$('.pk-startTime').val() ? me.$('.pk-startTime').val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			//pk --时间--end
			
			//会议助手 --时间--start
			me.$('.meet-startTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$('.meet-endTime').val() ? me.$('.meet-endTime').val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$('.meet-endTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$('.meet-startTime').val() ? me.$('.meet-startTime').val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			//会议助手 --时间--end
			
			//hr助手 --时间--start
			me.$('.hr-startTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$('.hr-endTime').val() ? me.$('.hr-endTime').val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$('.hr-endTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$('.hr-startTime').val() ? me.$('.hr-startTime').val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			//hr助手 --时间--end
			
			//工资助手 --时间--start
			me.$('.pay-startTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$('.pay-endTime').val() ? me.$('.pay-endTime').val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$('.pay-endTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$('.pay-startTime').val() ? me.$('.pay-startTime').val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			//工资助手 --时间--end


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
				//me.getdiscount();
			});
			

			//crm开始时间
			me.$('.crm-startTime').on('focusout',function(){
				me.getdiscount();
			});

			//crm结束时间
			me.$('.crm-endTime').on('focusout',function(){
				me.getdiscount();
			});
			//crn金额改变
			me.$('.crm-money').on('focusout',function(){
				//me.model.set('contractPrice',parseFloat(me.model.get('contractPrice'))?parseFloat(me.model.get('contractPrice')):'');
				me.getdiscount();
			});
			//crn数量
			me.$('.crm-num').on('focusout',function(){
				//me.model.set('contractPrice',parseFloat(me.model.get('contractPrice'))?parseFloat(me.model.get('contractPrice')):'');
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

		//获取折扣
		getdiscount: function(){
			var me = this;

			var crmNum = me.$('.crm-num').val(),
				crmMoney = me.$('.crm-money').val(),
				buyBusinessCard = me.model.get('useBusinessCard');

			var crmStartTime = '';  
			var crmEndTime = '';

			if( me.$('.crm-startTime').val() ){
				crmStartTime = new Date( me.$('.crm-startTime').val() ).getTime();
			}
			if( me.$('.crm-endTime').val() ){
				crmEndTime = new Date( me.$('.crm-endTime').val() ).getTime();
			}
			if( crmStartTime && crmEndTime && buyBusinessCard =='1'){
				util.api({
					'url':'/enterprise/getbusinesscardprice',
					'data':{
						'contractStartTime':crmStartTime,
						'contractEndTime':crmEndTime
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

			
			if( crmNum && crmMoney && crmStartTime && crmEndTime && buyBusinessCard ){
			

				me.discountxhr && me.discountxhr.abort();
				me.discountxhr = util.api({
					url:'/enterprise/getdiscount',
					'data':{
						'accountAmount': crmNum,
						'contractStartTime': crmStartTime,
						'contractEndTime': crmEndTime,
						'contractPrice': crmMoney,
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
			
	
			me.model.set('dealDays',parseInt(me.model.get('dealDays'))?parseInt(me.model.get('dealDays')):'');
			me.model.set('storageTotalSpace',parseFloat(me.model.get('storageTotalSpace'))?parseFloat(me.model.get('storageTotalSpace')):'');
  
            me.model.set('enterpriseShortName',me.model.get('enterpriseAccount'));
            me.model.set('productId',1);
	
            var model = me.model.all();
			
			if(!me.$('.crm-check').is(':checked') && !me.$('.pk-check').is(':checked') && !me.$('.meet-check').is(':checked') && !me.$('.hr-check').is(':checked') && !me.$('.pay-check').is(':checked')){
				util.showTip('请至少选择一种助手产品');
				return false;
			}
			var tempArry = [];
			
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
			
			$("input[type='checkbox']:checked").each(function(){ 
				var className = $(this).attr('class').split('-')[0];
				switch(className)
				{
					case 'crm':
						if( !me.$('.crm-num').val() ){
							util.warnInput( $('.crm-num') );
							state = false;
						}else{
							util.unWarnInput( $('.crm-num') );
						}
						if( !me.$('.crm-money').val() ){
							util.warnInput( $('.crm-money') );
							state = false;
						}else{
							util.unWarnInput( $('.crm-money') );
						}
						if( !me.$('.crm-startTime').val() ){
							util.warnInput( $('.crm-startTime') );
							state = false;
						}else{
							util.unWarnInput( $('.crm-startTime') );
						}
						if( !me.$('.crm-endTime').val() ){
							util.warnInput( $('.crm-endTime') );
							state = false;
						}else{
							util.unWarnInput( $('.crm-endTime') );
						}
						
						var tempCrm = {
							'productId':1,
							'purchaseAmount':me.model.get('crm-purchaseAmount'),
							'purchaseCount':me.model.get('crm-purchaseCount'),
							'productAmount':me.model.get('crm-purchaseAmount'),
							'startTime':new Date( me.$('.crm-startTime').val() ).getTime(),
							'endTime':new Date( me.$('.crm-endTime').val() ).getTime(),
							'discount':10
							
						}
						tempArry.push(tempCrm);
						var tempBaichuan = {
							'productId':2,
							'purchaseAmount':9999, //页面没有百川数量设置默认
							'purchaseCount':0,
							'productAmount':0,
							'startTime':new Date( me.$('.crm-startTime').val() ).getTime(),
							'endTime':new Date( me.$('.crm-endTime').val() ).getTime(),
							'discount':10
							
						}
						tempArry.push(tempBaichuan);
						var tempSystem = {
							'productId':3,
							'purchaseAmount':9999, //页面没有百川数量设置默认
							'purchaseCount':0,
							'productAmount':0,
							'startTime':new Date( me.$('.crm-startTime').val() ).getTime(),
							'endTime':new Date( me.$('.crm-endTime').val() ).getTime(),
							'discount':10
							
						}
						tempArry.push(tempSystem);
						me.model.set('contractStartTime',new Date( me.$('.crm-startTime').val() ).getTime());
						me.model.set('contractEndTime',new Date( me.$('.crm-endTime').val() ).getTime());
					  break;
					  
					case 'pk':
					
						tempArry.push(me.getProductInfo('pk',4));
					
					  /*if( !me.$('.pk-purchaseAmount').val() ){
							util.warnInput( $('.pk-purchaseAmount') );
							state = false;
						}else{
							util.unWarnInput( $('.pk-purchaseAmount') );
						}
						if( !me.$('.pk-startTime').val() ){
							util.warnInput( $('.pk-startTime') );
							state = false;
						}else{
							util.unWarnInput( $('.pk-startTime') );
						}
						if( !me.$('.pk-endTime').val() ){
							util.warnInput( $('.pk-endTime') );
							state = false;
						}else{
							util.unWarnInput( $('.pk-endTime') );
						}
						
						var tempPk = {
							'productId':4,
							'purchaseAmount':me.model.get('pk-purchaseAmount'),
							'purchaseCount':9999,
							'productAmount':me.model.get('pk-purchaseAmount'),
							'startTime':new Date( me.$('.pk-startTime').val() ).getTime(),
							'endTime':new Date( me.$('.pk-endTime').val() ).getTime(),
							'discount':10
						}
						tempArry.push(tempPk);
						if(!me.model.get('contractStartTime')){
							me.model.set('contractStartTime',new Date( me.$('.pk-startTime').val() ).getTime());
							me.model.set('contractEndTime',new Date( me.$('.pk-endTime').val() ).getTime());
						}*/
					  break;
					  
					case 'meet':
						tempArry.push(me.getProductInfo('meet',5));
					  /*if( !me.$('.meet-purchaseAmount').val() ){
							util.warnInput( $('.meet-purchaseAmount') );
							state = false;
						}else{
							util.unWarnInput( $('.meet-purchaseAmount') );
						}
						if( !me.$('.meet-startTime').val() ){
							util.warnInput( $('.meet-startTime') );
							state = false;
						}else{
							util.unWarnInput( $('.meet-startTime') );
						}
						if( !me.$('.meet-endTime').val() ){
							util.warnInput( $('.meet-endTime') );
							state = false;
						}else{
							util.unWarnInput( $('.meet-endTime') );
						}
						
						var tempMeet = {
							'productId':5,
							'purchaseAmount':me.model.get('meet-purchaseAmount'),
							'purchaseCount':9999,
							'productAmount':me.model.get('meet-purchaseAmount'),
							'startTime':new Date( me.$('.meet-startTime').val() ).getTime(),
							'endTime':new Date( me.$('.meet-endTime').val() ).getTime(),
							'discount':10
						}
						tempArry.push(tempMeet);
						if(!me.model.get('contractStartTime')){
							me.model.set('contractStartTime',new Date( me.$('.meet-startTime').val() ).getTime());
							me.model.set('contractEndTime',new Date( me.$('.meet-endTime').val() ).getTime());
						}*/
					  break;
					case 'hr':
						tempArry.push(me.getProductInfo('hr',6));
					  /*if( !me.$('.hr-purchaseAmount').val() ){
							util.warnInput( $('.hr-purchaseAmount') );
							state = false;
						}else{
							util.unWarnInput( $('.hr-purchaseAmount') );
						}
						if( !me.$('.hr-startTime').val() ){
							util.warnInput( $('.hr-startTime') );
							state = false;
						}else{
							util.unWarnInput( $('.hr-startTime') );
						}
						if( !me.$('.hr-endTime').val() ){
							util.warnInput( $('.hr-endTime') );
							state = false;
						}else{
							util.unWarnInput( $('.hr-endTime') );
						}
						
						var tempHr = {
							'productId':6,
							'purchaseAmount':me.model.get('hr-purchaseAmount'),
							'purchaseCount':9999,
							'productAmount':me.model.get('hr-purchaseAmount'),
							'startTime':new Date( me.$('.hr-startTime').val() ).getTime(),
							'endTime':new Date( me.$('.hr-endTime').val() ).getTime(),
							'discount':10
						}
						tempArry.push(tempHr);
						if(!me.model.get('contractStartTime')){
							me.model.set('contractStartTime',new Date( me.$('.hr-startTime').val() ).getTime());
							me.model.set('contractEndTime',new Date( me.$('.hr-endTime').val() ).getTime());
						}*/
					  break;
					case 'pay':
					
						tempArry.push(me.getProductInfo('pay',7));
						
					  /*if( !me.$('.pay-purchaseAmount').val() ){
							util.warnInput( $('.pay-purchaseAmount') );
							state = false;
						}else{
							util.unWarnInput( $('.pay-purchaseAmount') );
						}
						if( !me.$('.pay-startTime').val() ){
							util.warnInput( $('.pay-startTime') );
							state = false;
						}else{
							util.unWarnInput( $('.pay-startTime') );
						}
						if( !me.$('.pay-endTime').val() ){
							util.warnInput( $('.pay-endTime') );
							state = false;
						}else{
							util.unWarnInput( $('.pay-endTime') );
						}
						
						var tempMeet = {
							'productId':7,
							'purchaseAmount':me.model.get('pay-purchaseAmount'),
							'purchaseCount':9999,
							'productAmount':me.model.get('pay-purchaseAmount'),
							'startTime':new Date( me.$('.pay-startTime').val() ).getTime(),
							'endTime':new Date( me.$('.pay-endTime').val() ).getTime(),
							'discount':10
						}
						tempArry.push(tempMeet);
						if(!me.model.get('contractStartTime')){
							me.model.set('contractStartTime',new Date( me.$('.pay-startTime').val() ).getTime());
							me.model.set('contractEndTime',new Date( me.$('.pay-endTime').val() ).getTime());
						}*/
					  break;
					  
					default:
					  
				}
			});


			if( state == false ){
				util.showToast('信息填写不完整');
				return ;
			}
		
			me.model.set('subOrderInfo',JSON.stringify( tempArry ));
			//付费状态
			me.model.set('payStatus',1);
			//crm如果没有填默认折扣10
			if(!me.$('.crm-num').val()){
				me.model.set('discount',10);
				me.model.set('marketingAccountAmount',0);
			}else{
				me.model.set('marketingAccountAmount',me.$('.crm-num').val());
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
		},
		getProductInfo:function(productStr,productId){
			var me = this;
			debugger
			if( !me.$('.'+productStr+'-purchaseAmount').val() ){
				util.warnInput( $('.'+productStr+'-purchaseAmount') );
				state = false;
			}else{
				util.unWarnInput( $('.'+productStr+'-purchaseAmount') );
			}
			if( !me.$('.'+productStr+'-startTime').val() ){
				util.warnInput( $('.'+productStr+'-startTime') );
				state = false;
			}else{
				util.unWarnInput( $('.'+productStr+'-startTime') );
			}
			if( !me.$('.'+productStr+'-endTime').val() ){
				util.warnInput( $('.'+productStr+'-endTime') );
				state = false;
			}else{
				util.unWarnInput( $('.'+productStr+'-endTime') );
			}
			
			var temp = {
				'productId':productId,
				'purchaseAmount':me.model.get(productStr+'-purchaseAmount'),
				'purchaseCount':9999,
				'productAmount':me.model.get(productStr+'-purchaseAmount'),
				'startTime':new Date( me.$('.'+productStr+'-startTime').val() ).getTime(),
				'endTime':new Date( me.$('.'+productStr+'-endTime').val() ).getTime(),
				'discount':10
			}
			
			if(!me.model.get('contractStartTime')){
				me.model.set('contractStartTime',new Date( me.$('.'+productStr+'-startTime').val() ).getTime());
				me.model.set('contractEndTime',new Date( me.$('.'+productStr+'-endTime').val() ).getTime());
			}
			return temp;
		}

	});

	module.exports = AddEnt;
});
