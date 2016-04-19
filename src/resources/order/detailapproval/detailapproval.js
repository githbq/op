/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

	var IBSS = window.IBSS,
        TPL = IBSS.tpl;
		
	var Slider = require('common/widget/slider/slider');
	 var AreaTree = require('module/areatree/areatree');

	var contentStr = require('./detailapproval.html');
	var BasicInfo = require('../widget/basicinfo/basicinfo');
	var Explain = require('../widget/explain/explain');
	var OrderInfo = require('../widget/orderinfo/orderinfo');
	var InvoiceInfo = require('../widget/invoice/invoice');
	var productinfo = require('../widget/productinfo/productinfo');

	var orderTypeAry = ['','办公版新购-普通','办公版新购-特批','营销版新购-普通','营销版新购-特批','办公版增购-普通',
		'办公版增购-特批','营销版增购-普通','营销版增购-特批','办公版续费-普通','办公版续费-特批',
		'营销版续费-普通','营销版续费-特批','关联自注册办公版-普通','关联自注册办公版-特批',
		'关联自注册营销版-普通','关联自注册营销版-特批','收尾款'
	];
	
	var productIdDic = {
            '1': 'CRM',
            '2': '逍客终端',
            '3': '服务',
            '4': 'PK助手',
            '5': '会议助手',
            '6': 'HR助手',
            '7': '工资助手',
            '8':'名片',
			'12':'自定义助手'	
        }; 

    /////////////////
    //
    //  查看审批详情
    /////////////////
	var DetailApproval = MClass( Slider ).include({

		content: contentStr,

		defaultAttr: {
			'width': 1300
		},
		elements: {
			'.action-save':'actionSave',
			'.action-resend':'actionResend',
			'.action-agree':'actionAgree',
			'.action-reject':'actionReject',
			'.action-submit':'actionSubmit',
			'.action-agree-pass':'actionAgreePass',
			'.enterpriseAccount':'enterpriseAccount',
			'.money-time':'moneyTime'
		},
		events:{
			'click .action-save':'actionSaveEve',
			'click .action-submit':'actionSubmitEve',
			'click .action-resend':'actionResendEve',
			'click .action-agree':'actionAgreeEve',
			'click .action-reject':'actionRejectEve',
			'click .action-agree-pass':'actionAgreePassEve'
		},

		
		init: function(){
			DetailApproval.__super__.init.apply( this,arguments );
			var me = this;
			
			//选择区域模块
			me.$moneyTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});
            me.areaTree = new AreaTree();
            me.areaTree.on('selectarea',function( treenodes ){
                
                me.$filingRegion.val( treenodes[0]['name'] ).attr('data-code', treenodes[0]['code'] );
            });

		},

		/**
		 *
		 * @param id   实例id
		 * @param eid  企业id
		 * @param type 类型
		 */
		show: function( options ){
			var me = this;
			me.attrs.options = options||{};
			//me.attrs.options.isTp = 0;
			//me.attrs.options.editFlag=true;
			me.attrs.orderList = {};
			me.attrs.enterpriseData = {};
			me.attrs.allData = {'orderEntity':{},'contract':{},'enterpriseExtend':{},'enterprise':{}};
			me.$('.enterpriseAccount').attr('disable','disable');
			me.setState();
			me.sortType();
			
			DetailApproval.__super__.show.call( this,true );
		},
		//根据定单类型区分设置
		sortType:function(){
			var me = this;
			me.attrs.options.orderType = parseInt(me.attrs.options.orderType)
			switch( me.attrs.options.orderType )
			{
				case 1: case 13:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new BasicInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.enterpriseData.enterprise,
							'editFlag':me.attrs.basicInfoEdit,'type':me.attrs.options.orderType,'ea':me.attrs.options.ea} );
					});

					break;
				case 2: case 14:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.basicInfoEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new BasicInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.enterpriseData.enterprise,
							'editFlag':me.attrs.basicInfoEdit,'type':me.attrs.options.orderType,'ea':me.attrs.options.ea} );
					});

					break;
				case 3:case 15:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
						//基本信息
						me.attrs.basicCommon = new BasicInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.enterpriseData.enterprise,
							'editFlag':me.attrs.basicInfoEdit,'type':me.attrs.options.orderType,'ea':me.attrs.options.ea} );
					});


					break;
				case 4:case 16:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/).done(function(){

						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
						//基本信息
						me.attrs.basicCommon = new BasicInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.enterpriseData.enterprise,
							'editFlag':me.attrs.basicInfoEdit,'type':me.attrs.options.orderType,'ea':me.attrs.options.ea} );
					});

					break;
				case 5:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/, me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );
					});

					break;
				case 6:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/,me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );
					});

					break;
				case 7:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/,me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );
					});

					break;
				case 8:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/,me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );
					});

					break;
				case 9:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/,me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );
					});

					break;
				case 10:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/,me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );
					});

					break;
				case 11:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/,me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );
					});


					break;
				case 12:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail()/*, me.getEnterpriseInfo()*/,me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.moneyEdit,'type':me.attrs.options.orderType} );
					});


					break;
				default:
			}

		},
		//获取企业基本信息
		getEnterpriseInfo:function(  ){
			var me = this;

			return  util.api({
				'url':'~/op/api/order/enterprise/getEnterpriseInfo',
				'data':{
					'orderId':me.attrs.options.id
				},
				'success': function( data ){
					if( data.success ){
						me.attrs.enterpriseData = data.value.model;
						$.extend(true, me.attrs.allData, me.attrs.enterpriseData );
						
						//callback && callback();
					}
				}
			})
		},
		//获取订单详情
		getOrderDetail:function( ){
			var me = this;

			return  util.api({
				'url':'/odr/getOrderDetail',
				'data':{'orderId':me.attrs.options.id},
				'success': function( data ){
					if( data.success ){
						me.attrs.orderData = data.value.model.orderEntity;
						me.attrs.enterpriseData.contract = data.value.model.contract ? data.value.model.contract :null;
						me.attrs.enterpriseData.enterprise = data.value.model.enterprise ? data.value.model.enterprise :null;
						me.attrs.enterpriseData.enterpriseExtend = data.value.model.enterpriseExtend ? data.value.model.enterpriseExtend :null;
						me.setOptions();
						//me.attrs.allData.orderEntity = me.attrs.orderData;
						$.extend(true, me.attrs.allData, data.value.model );
						//$.extend(true, me.attrs.allData, me.attrs.orderData );
						//callback && callback();
					}
				}
			})

		},
		//渲染订单和产品基础信息：
		setOrderList:function( callback ){
			var me = this;

			return util.api({
					'url':'/odr/queryProductVOList',
					'data':{'ea':me.attrs.options.ea },
					'success': function( data ){

						if( data.success ){

							me.attrs.orderList = data;
							callback && callback();
						}
					}
			});

		},
		//设置订单基本信息
		 setOrderInfo:function(){
			 var  me = this;
			 var payInfoReadonly = !me.attrs.options.editFlag;
			 var allReadonly = !me.attrs.options.editFlag;
			me.attrs.productData = me.attrs.orderData;
			var edit = false;
			me.attrs.subData = {'subOrders':{}};
			
			//获取企业子产品开始时间不能编辑的子产品
			if(me.attrs.orderData.order.status==0){
				me.getNeedDate();
			}
			
			 me.attrs.productData.enterpriseExtend = me.attrs.enterpriseData.enterpriseExtend ? me.attrs.enterpriseData.enterpriseExtend:null;
			 var tempOrderType = parseInt(me.attrs.options.orderType);
			 switch( tempOrderType )
			{
				case 13:
					tempOrderType = 1;
					break;
				case 14:
					tempOrderType = 2;
					break;
				case 15:
					tempOrderType = 3;
					break;
				case 16:
					tempOrderType = 4;
					break;
				default:
			}
			if(me.attrs.options.rejectsFrom && (me.attrs.options.rejectsFrom == 2 ) && me.attrs.options.editFlag){
				payInfoReadonly = false;
				//me.attrs.moneyEdit = false
				allReadonly = true;
			}
			if(me.attrs.options.rejectsFrom && ( me.attrs.options.rejectsFrom == 3 ) && me.attrs.options.editFlag){
				payInfoReadonly = true;
				//me.attrs.moneyEdit = false
				allReadonly = true;
			}
			/*if( me.attrs.options.editFlag ){
				edit = true;
			}*/
	
			 me.attrs.productData.contract = me.attrs.enterpriseData.contract ? me.attrs.enterpriseData.contract : null ;
			 me.attrs.prodeuctObj =  productinfo.showProductInfo( {terminalInfo:{$view:me.$view.find('.common-terminalinfo')},
					 tableInfo:{$view:me.$view.find('.common-tableinfo')},
					 formInfo:{$view:me.$view.find('.common-forminfo')}}
				 ,tempOrderType ,{'edit':true,'payInfoReadonly':payInfoReadonly,'enterpriseId':me.attrs.options.enterpriseId,'readonly': allReadonly,'data':me.attrs.productData,'refuse':me.attrs.options.editFlag} );

			 //发票信息
			 me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common--invioce'),'data':me.attrs.orderData,
				 'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
				 
			//获取联合跟进人
			me.getCustomHelper();

		 },
		 //获取现有跟进人信息：
		getCustomHelper:function(){
			var me = this;
			
			util.api({
				'url': '~/op/api/order/enterprise/getEnterprisePartners',
				'data': {
					'enterpriseId': me.attrs.options.enterpriseId
				},
				'success': function (data) {
					console.warn(data);
					if (data.success) {
						
						me.attrs.list = data.value.model;
						me.$view.find('.helper-box').empty();
						if(me.attrs.list.length==0){
							me.$view.find('.helper-box').append(' <a class="badge" >暂无</a>');
						}
						var obj = me.attrs.list;
						for(var i=0;i<obj.length;i++){
							me.$view.find('.helper-box').append(' <a class="badge" data-id="'+obj[i].accountId+'" >'+obj[i].accountName+'&nbsp;&nbsp;&nbsp;</a>');
						}
						
					}
				}
			})
			
		},
		 
		 //转换为基本需要时间格式
		getNeedDate:function(  ){
			var me = this;
			var subArry = [];
			var sortDate = [];
			var data = me.attrs.orderList.model||[];
			var productData = me.attrs.productData||[];
			
			function crmSortDate(){
				if( sortDate.length > 0 ){
					sortDate.sort(function( a,b ){
						return a-b;
					});
					
				}
			}
			
			
			var tempOrderType = parseInt(me.attrs.options.orderType);
			 switch( tempOrderType )
			{
				case 5:case 6:case 7:case 8:
					for(var i = 0 ;i<data.length; i++ ){
						
						if( data[i].code == "CRM" ){
							sortDate.push( data[i].startDate );
							sortDate.push( data[i].endDate );
						}
					}
					//计算crm增购的时间最大范围
					crmSortDate();
					
					/*me.attrs.subData =  {
						'subOrders':subArry
					}*/
					for(var i =0;i<productData.subOrders.length;i++){
									
						if(productData.subOrders[i].subOrder.productId==1){
							productData.subOrders[i].subOrder['startTime_min'] = sortDate[0];
							var aryLen = sortDate.length-1;
							productData.subOrders[i].subOrder['endTime_max'] = sortDate[aryLen];
							break;
						}
						
					}
					//$.extend(true, productData.subOrders, me.attrs.subData.subOrders );
					break;
				case 9:case 10:case 11:case 12:
				
					function dateCompare(nowDate,endDate)
					{
						var arr=nowDate.split("/");
						var starttime=new Date(arr[0],arr[1],arr[2]);
						var starttimes=starttime.getTime();

						var arrs=endDate.split("/");
						var lktime=new Date(arrs[0],arrs[1],arrs[2]);
						var lktimes=lktime.getTime();

						if(starttimes>=lktimes)
						{
							return false;
						}
						return true;
					}
					_.map( data , function( obj , index){
						switch( obj["code"] )
						{
							case "PK_Helper":
								var nowDate = new Date( new Date().getTime() )._format('yyyy/MM/dd');
								var endDate = new Date( obj["endDate"]  )._format('yyyy/MM/dd');
								if( dateCompare(nowDate,endDate) ){
									var tempObe = {"subOrder":{
										"productId":4,
										"startTime":obj["endDate"],
										"flag":true,
										"startTime_readonly":true
									}}
									subArry.push(tempObe)
									
									/*for(var i =0;i<productData.subOrders.length;i++){
										
										if(productData.subOrders[i].subOrder.productId==4){
											productData.subOrders[i].subOrder['startTime'] = obj["endDate"];
											productData.subOrders[i].subOrder['startTime_readonly'] = true;
											break;
										}
									}*/
								}
								
						
								break;
							case "Meeting_Helper":
								var nowDate = new Date( new Date().getTime() )._format('yyyy/MM/dd');
								var endDate = new Date( obj["endDate"]  )._format('yyyy/MM/dd');
								if( dateCompare(nowDate,endDate) ){
									var tempObe = {"subOrder":{
										"productId":5,
										"startTime":obj["endDate"],
										"flag":true,
										"startTime_readonly":true
									}}
									subArry.push(tempObe)
									/*for(var i =0;i<productData.subOrders.length;i++){
									
										if(productData.subOrders[i].subOrder.productId==5){
											productData.subOrders[i].subOrder['startTime'] = obj["endDate"];
											productData.subOrders[i].subOrder['startTime_readonly'] = true;
											break;
										}
									}*/
								}
								break;
							case "Salary_Helper":
								var nowDate = new Date( new Date().getTime() )._format('yyyy/MM/dd');
								var endDate = new Date( obj["endDate"]  )._format('yyyy/MM/dd');
								if( dateCompare(nowDate,endDate) ){
									var tempObe = {"subOrder":{
										"productId":7,
										"startTime":obj["endDate"],
										"flag":true,
										"startTime_readonly":true
									}}
									subArry.push(tempObe)
									
									/*for(var i =0;i<productData.subOrders.length;i++){
									
										if(productData.subOrders[i].subOrder.productId==7){
											productData.subOrders[i].subOrder['startTime'] = obj["endDate"];
											productData.subOrders[i].subOrder['startTime_readonly'] = true;
											break;
										}
									}*/

								}

								break;
							case "Custom_Helper":
								var nowDate = new Date( new Date().getTime() )._format('yyyy/MM/dd');
								var endDate = new Date( obj["endDate"]  )._format('yyyy/MM/dd');
								if( dateCompare(nowDate,endDate) ){
									var tempObe = {"subOrder":{
										"productId":12,
										"startTime":obj["endDate"],
										"flag":true,
										"startTime_readonly":true
									}}
									subArry.push(tempObe)
									/*for(var i =0;i<productData.subOrders.length;i++){
									
										if(productData.subOrders[i].subOrder.productId==5){
											productData.subOrders[i].subOrder['startTime'] = obj["endDate"];
											productData.subOrders[i].subOrder['startTime_readonly'] = true;
											break;
										}
									}*/
								}
								break;
							default:
						}
					});
					for(var j =0;j<subArry.length;j++){
						for(var i =0;i<productData.subOrders.length;i++){
							if(productData.subOrders[i].subOrder.productId==subArry[j].subOrder.productId){
								productData.subOrders[i].subOrder['startTime'] = subArry[j].subOrder["startTime"];
								productData.subOrders[i].subOrder['startTime_readonly'] = true;
								subArry[j].subOrder["flag"]=false;
							}
						}
					}
					for(var a = 0; a<subArry.length;a++){
						var arrlong =  productData.subOrders.length;
						if(subArry[a].subOrder["flag"]){
							subArry[a].subOrder["enabled"]=false;
							productData.subOrders.push(subArry[a]);
						}
					}
					
					break;
	
				default:
			}
			me.attrs.productData = productData;
		},
		
		//设置自己部分的显示和隐藏：
		setState:function(){
			var me = this;
			me.$('.state').hide();
			me.$('.state-'+me.attrs.options.state).show();
			if(me.attrs.options.editFlag){
				me.$('.state-refuse').show();
			}
			me.$('.currentTask-'+me.attrs.options.currentTask).show();
			
			//设置是否可以编辑
			me.attrs.moneyEdit = me.attrs.options.editFlag;
			me.attrs.basicInfoEdit = me.attrs.options.editFlag;
			//财务驳回只能部分编辑和小助手第二次驳回
			if(me.attrs.options.rejectsFrom && (me.attrs.options.rejectsFrom == 2 || me.attrs.options.rejectsFrom == 3 ) && me.attrs.options.editFlag){
				me.attrs.moneyEdit = false;
				me.attrs.basicInfoEdit = false;
			}
			var typeString = '1,2,3,4,13,14,15,16';
			if( me.attrs.options.currentTask == 'support' && typeString.indexOf(me.attrs.options.orderType)>-1){
				me.attrs.basicInfoEdit = true;
				me.$('.action-agree-pass').show();
			}

		},
		//设置审批意见
		setOptions:function(){
			var me = this,strDom = '';
			var opinionObj = {'support':'小助手开通','support2':'小助手确认','finance':'财务','sup':'小助手'};
			var personStr = "support,support2,finance,sup";
			
			var optionsList = me.attrs.orderData.order.rejectReason ? me.attrs.orderData.order.rejectReason.split('<+>'): [];
			for(var i = 0; i<optionsList.length; i++){
				var tempAry = optionsList[i].split('<->');
				if(personStr.indexOf(tempAry[0])>-1){
					tempAry[0] = opinionObj[tempAry[0]];
				}
				tempAry[2] = (tempAry[2]=='true') ? '同意':'驳回';
				strDom+='<tr><td>'+tempAry[0]+'</td><td>'+tempAry[1]+'</td><td>'+tempAry[2]+'</td><td>'+tempAry[3]+'</td></tr>'
			}
			
			//判断审批意见
			var opinion = strDom ? strDom :'<tr><td colspan="4" style="text-align: center;">暂无</td></tr>';
			me.$('.last-options').html( opinion );
			
			//设置到款时间 receivedPayDate
			var receivedPayDate = (me.attrs.orderData && me.attrs.orderData.order && me.attrs.orderData.order.receivedPayDate)  ? new Date( me.attrs.orderData.order.receivedPayDate  )._format("yyyy-MM-dd"):'';
			if(receivedPayDate){
				me.$('.receivedPayDate').show();
				me.$('.receivedPayDate-text').text(receivedPayDate);
				me.$('.currentTask-finance').hide();
			}
			
		},
		//获取全部订单数据
		getOrderInfo:function( callback ){

			var me = this,objData  = { 'orderEntity':{}};

			

			//获取普通订单信息
			//基本信息校验和取值
			if( me.attrs.basicCommon.getValue() ){
				//objData.enterprise = me.attrs.basicCommon.getValue();
				var tem ={'enterprise': me.attrs.basicCommon.getValue()} ;
				tem.enterprise && $.extend(true, objData, tem  );
			}else{
				return ;
			}

			//产品信息
			if(me.attrs.prodeuctObj.validate()){
				var temp = me.attrs.prodeuctObj.getData();
				objData.enterpriseExtend = temp.enterpriseExtend ;
				objData.contract = temp.contract;
				objData.orderEntity.order = temp.order
				objData.orderEntity.subOrders = temp.subOrders;
				if(temp.subOrders.length<1){
					util.showToast('请至少选择一款子产品！');
					return false;
				}
				if(!me.checkUsedDate( temp.subOrders )){
					return false;
				}
			}else{
				util.showToast('产品信息填写不完整！');
				return false;
			}

			//检测自订单是否小于7折
			if( !me.attrs.options.isTp || me.attrs.options.isTp == '0'){
				if(!me.checkDiscount(temp.subOrders)){
					util.showToast('子产品折扣低于8折，必须申请特批');
					return false;
				}
			}
			//发票信息校验和取值
			if( me.attrs.invoiceCommon.getInfo() ){
				var temp  = me.attrs.invoiceCommon.getInfo();
				temp.invoice ? objData.orderEntity.invoice =temp.invoice : objData.orderEntity.invoice = null;
				$.extend(true, objData.orderEntity.order, temp.order );
			}else{
				return ;
			}

			if(me.attrs.options.isTp == '1'){
				//获取特批地址
				if( me.attrs.explainCommon.getValue() ){
					var temp  = me.attrs.explainCommon.getValue();
					objData.orderEntity.order['approvedUrl'] = temp.approvedUrl;
				}else{
					return ;
				}
			}

			//综合折扣
			me.getDiscount( objData.orderEntity.subOrders ,objData.orderEntity.order.amount , function(  ){
				var discoutFlag = true;

				me.attrs.invoiceCommon.setDiscount( me.attrs.complexDiscount );
				objData.orderEntity.order['discount'] = me.attrs.complexDiscount ;
				objData.contract['discount'] = me.attrs.complexDiscount ;
				objData.enterpriseExtend['enterpriseId'] = me.attrs.options.enterpriseId;
				if(objData.orderEntity.invoice && objData.orderEntity.invoice['businessLicense']){
					objData.enterpriseExtend['businessLicense'] = objData.orderEntity.invoice['businessLicense'] ;
					objData.enterpriseExtend['businessLicenseFileName'] = objData.orderEntity.invoice['businessLicenseFileName'];
				}
				var tempSubOrders = objData.orderEntity.subOrders;
				objData.orderEntity.subOrders = null;
				$.extend(true, me.attrs.allData, objData);
				
				
				me.attrs.allData.orderEntity.subOrders = me.attrs.orderData.subOrders||[];
				
				var lengI = tempSubOrders.length;
				var lengJ = me.attrs.allData.orderEntity.subOrders.length;
				for(var i=0;i<lengI;i++){
					for(var j=0;j<lengJ; j++){
						var tempObj = tempSubOrders[i].subOrder;
						var tempExtends = tempSubOrders[i].productExtends||[];
						if(tempSubOrders[i].subOrder.productId == me.attrs.allData.orderEntity.subOrders[j].subOrder.productId ){
							
							for(var key in tempObj){
								me.attrs.allData.orderEntity.subOrders[j].subOrder[key] = tempObj[key];
							}
							tempSubOrders[i].subOrder['hasFlag']=true;
							if(tempExtends.length>0){
								
								if(me.attrs.allData.orderEntity.subOrders[j].productExtends.length>0){
										for(var ke in tempExtends[0]){
											me.attrs.allData.orderEntity.subOrders[j].productExtends[0][ke] = tempExtends[0][ke];
										}
								}else{
									me.attrs.allData.orderEntity.subOrders[j].productExtends=[];
									me.attrs.allData.orderEntity.subOrders[j].productExtends.push(tempExtends[0]) ;
								}
						
							}
							me.attrs.allData.orderEntity.subOrders[j].orderFlag = true;
							
						}
						
					}
				}
				for(var i=0;i<lengI;i++){
					var tempObj = tempSubOrders[i].subOrder;
					if(!tempObj['hasFlag']){
						tempSubOrders[i].orderFlag = true;
						me.attrs.allData.orderEntity.subOrders.push(tempSubOrders[i]);
					}
				}
				var newLenth = me.attrs.allData.orderEntity.subOrders.length;
				var temarry = [];
				for(var a=0;a<newLenth;a++){
					if(me.attrs.allData.orderEntity.subOrders[a].orderFlag){
						//me.attrs.allData.orderEntity.subOrders[a]=null;
						//me.attrs.allData.orderEntity.subOrders.splice(a,1);
						//newLenth = me.attrs.allData.orderEntity.subOrders.length;
						//a--;
						temarry.push(me.attrs.allData.orderEntity.subOrders[a]);
						//delete me.attrs.allData.orderEntity.subOrders[a];
					}
				}
				me.attrs.allData.orderEntity.subOrders = temarry;

				//调用回调
				callback && callback();

			});
		},
		//检测子产品使用时时间不能超过九十天
		checkUsedDate:function( data ){
			var me = this;
			for( var i = 0; i< data.length; i++){
				if( data[i].productExtends && data[i].productExtends.length>0 && data[i].productExtends[0].productKey == 'buytype' && data[i].productExtends[0].productValue == '1' ){
					var startTime = data[i].subOrder.startTime;
					var endTime = data[i].subOrder.endTime ;
					var iDays = parseInt(Math.abs(endTime - startTime ) / 1000 / 60 / 60 /24)
					if( iDays > 90 ){
						var productName = productIdDic[data[i].subOrder.productId];
						
						util.showToast(productName+'试用版时间不能超过90天！');
						return false;
						
					}
				}
			}
			return true;
	
		},
		//检测自订单折扣是否大于8折
		checkDiscount:function( data ){
			var me = this;
			var discoutFlag = true;

			switch( me.attrs.options.orderType ){
				case 1:case 2:case 3:case 4:case 13:case 14:case 15:case 16:
					_.map( data , function( obj ){
						if(obj.subOrder.productId ==1 || obj.subOrder.productId ==4  || obj.subOrder.productId ==5 || obj.subOrder.productId ==12 ){
							if( obj.subOrder.discount  &&  obj.subOrder.discount<8){
								discoutFlag = false;
								//util.showToast('子产品折扣低于8折，必须申请特批');
								//return false;
							}
						}
					});
					break;
				default:
					_.map( data , function( obj ){
						if(obj.subOrder.productId ==1 || obj.subOrder.productId ==4  || obj.subOrder.productId ==7  || obj.subOrder.productId ==5 || obj.subOrder.productId ==12 ){
							if( obj.subOrder.discount  &&  obj.subOrder.discount<8){
								discoutFlag = false;
							}
						}
					});
			}

			if( !discoutFlag ){

				return false;
			}
			return true;
		},
		//获取综合折扣
		getDiscount:function( data ,account ,callback){
			var me = this;

			var tempObj = {
				'productJson':JSON.stringify(data),
				'contractAmount':account,
				'orderType':me.attrs.options.orderType
			}
			/**
			 * 计算订单总折扣
			 * @param request
			 * @param resp
			 * @param serviceFee 培训服务费
			 * @param productJson 产品信息集合json串
			 * @param contractAmount 合同总金额
			 * @return
			 */
			util.api({
				'url':'~/op/api/rebate/calculateSum',
				'data':tempObj,
				'success': function( data ){

					if( data.success ){
						me.attrs.complexDiscount = data.value.model;
						callback && callback( data.value.model );
					}
				},
			})
		},
		//保存
		actionSaveEve:function(){
			var me = this;
			console.log(me.attrs.allData)
			//var tempData = {'orderId':me.attrs.options.id,'orderVO':me.attrs.allData};
			me.attrs.allData.orderEntity.order.id = me.attrs.options.id;
		
			me.getOrderInfo(function(){
				var tempUrl = '';
				
				switch( me.attrs.options.orderType ){
					case 9:case 10:case 11:case 12:
						tempUrl = '/odr/renew/update'
						break;
					default:
						tempUrl = '/odr/updateOrderVO'
				}
				me.$actionSubmit.text('提交中....');
				me.$actionSubmit.attr('disabled','disabled');
				util.api({
					'url':tempUrl,
					'data':JSON.stringify( me.attrs.allData ),
					'contentType':'application/json;charset=UTF-8 ',
					'button': {
						'el': me.$actionSave,
						'text':'提交中......'
					},
					'success': function( data ){
						if( data.success ){
							util.showTip('提交成功！');
							me.trigger( 'saveSuccess');
							me.hide();
						}
					},
					'complete': function(){
						me.$actionSubmit.text('保存提交');
						me.$actionSubmit.removeAttr('disabled');
					}
				})
				
			});
			
		},
		//保存提交
		actionSubmitEve:function(){
			var me = this;
			me.attrs.allData.orderEntity.order.id = me.attrs.options.id;
			me.getOrderInfo(function(){
				var tempUrl = '';
				
				switch( me.attrs.options.orderType ){
					case 9:case 10:case 11:case 12:
						tempUrl = '/odr/renew/update'
						break;
					default:
						tempUrl = '/odr/updateOrderVO'
				}
				me.$actionSave.text('提交中....');
				me.$actionSave.attr('disabled','disabled');
				me.$actionAgreePass.text('提交中....');
				me.$actionAgreePass.attr('disabled','disabled');
				me.$actionAgree.text('提交中....');
				me.$actionAgree.attr('disabled','disabled');
				me.$actionReject.text('提交中....');
				me.$actionReject.attr('disabled','disabled');
				util.api({
					'url':tempUrl,
					'data':JSON.stringify( me.attrs.allData ),
					'contentType':'application/json;charset=UTF-8 ',
					'button': {
						'el': me.$actionSubmit,
						'text':'提交中......'
					},
					'success': function( data ){
						if( data.success ){
							changeNode();
						}
					},
					'error': function(){
						me.$actionSave.text('保存');
						me.$actionSave.removeAttr('disabled');
						me.$actionAgreePass.text('保存通过');
						me.$actionAgreePass.removeAttr('disabled');
						me.$actionReject.text('驳回');
						me.$actionReject.removeAttr('disabled');
						me.$actionAgree.text('同意');
						me.$actionAgree.removeAttr('disabled');
					}
				})
				
			});
			 //移交至下一个节点
            function changeNode(){
                util.api({
                    'url':'~/op/api/approval/directapprove',
                    'data':{
                        'processInstanceId': me.attrs.options.processInstanceId,
                        'approved': true,
                        'opinion':''
                    },
                    'success':function( data ){
                        if( data.success ){
                            util.showTip('保存提交发送成功');

							me.trigger( 'saveSuccess');
                            me.hide();
                        }
                    },
					'complete': function(){
						me.$actionSave.text('保存');
						me.$actionSave.removeAttr('disabled');
						me.$actionAgreePass.text('保存通过');
						me.$actionAgreePass.removeAttr('disabled');
						me.$actionReject.text('驳回');
						me.$actionReject.removeAttr('disabled');
						me.$actionAgree.text('同意');
						me.$actionAgree.removeAttr('disabled');
					}
                })
            };
		},
		//驳回
		actionRejectEve: function(){
            var me = this;

            if( !me.model.get('comment') ){
                util.showToast('请填写意见');
                return;
            }
            var bool = confirm("确认驳回此条审批吗?");
            if( bool ){
				me.$actionAgree.text('提交中....');
				me.$actionAgree.attr('disabled','disabled');
				me.$actionAgreePass.text('提交中....');
				me.$actionAgreePass.attr('disabled','disabled');
                util.api({
                    'url': '~/op/api/approval/directapprove',
                    'data':{
                        'processInstanceId': me.attrs.options.processInstanceId,   //流程实例ID
                        'approved': false,                  //审批结果(通过/拒绝)
                        'opinion': me.model.get('comment')  //审批意见
                    },
					'button': {
						'el': me.$actionReject,
						'text':'提交中......'
					},
                    success: function( data ){
                        console.warn( data );
                        if( data.success ){
                            util.showTip('批复成功');
                            me.hide();
                            me.trigger( 'saveSuccess');
                        }
                    },
					complete: function(){
						me.$actionAgree.text('同意');
						me.$actionAgree.removeAttr('disabled');
						me.$actionAgreePass.text('保存通过');
						me.$actionAgreePass.removeAttr('disabled');
					}
                })
            }
        },

        //同意
		actionAgreeEve: function(){
            var me = this;
			var bool = confirm("确认同意此条审批吗?");
			
			if( bool ){
				if( me.attrs.options.currentTask == 'finance' && !me.attrs.orderData.order.receivedPayDate ){
				   me.setMoneyTime(function(){
						me.replyOptions();
				   });
				}else{
					me.replyOptions();
				}

			}
    
        },
		//小助手报保存并通过
		actionAgreePassEve:function(){
			var me = this;
			var bool = confirm("确认修改并通过此条审批吗?");
			if(bool){
				me.actionSubmitEve();
			}
		},
		//批复审批
		replyOptions:function(){
		 	var me = this;
		
			me.$actionReject.text('提交中....');
			me.$actionReject.attr('disabled','disabled');
			me.$actionResend.text('提交中....');
			me.$actionResend.attr('disabled','disabled');
			util.api({
				'url': '~/op/api/approval/directapprove',
				'data':{
					'processInstanceId': me.attrs.options.processInstanceId,     //流程实例ID
					'approved': true,                     //审批结果(通过/拒绝)
					'opinion': me.model.get('comment')    //审批意见
				},
				'button': {
					'el': me.$actionAgree,
					'text':'提交中......'
				},
				success: function( data ){
					console.warn( data );
					if( data.success ){
						util.showTip('批复成功');
						me.hide();
						me.trigger( 'saveSuccess');
					}
				},
				complete: function(){
					me.$actionReject.text('驳回');
					me.$actionReject.removeAttr('disabled');
					me.$actionResend.text('保存通过');
					me.$actionResend.removeAttr('disabled');
				}
			})
			
		},
		//设置到款时间
		setMoneyTime:function( callback ){
			var me = this;
			if(!me.$moneyTime.val() ){
				util.showToast('请填写到账时间！');
				return false;
			}
			util.api({
				'url': '/odr/setreceivedpaydate',
				'data':{
					'orderId': me.attrs.options.id,   //流程实例ID
					'receivedPayDate':new Date( me.$moneyTime.val()  ).getTime()          //审批结果(通过/拒绝)
				},
				success: function( data ){
					console.warn( data );
					if( data.success ){
						callback && callback();
					}
				}
			})
		},
		//重新发送
		hide: function(){
			var me = this;
			me.remove();
			DetailApproval.__super__.hide.apply( this,arguments );
		}
	});
        
	module.exports = DetailApproval;
});
