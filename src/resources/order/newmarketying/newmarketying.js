define( function( require, exports, module ) {
    var IBSS = window.IBSS;

	var BasicInfo = require('../widget/basicinfo/basicinfo');
	var Explain = require('../widget/explain/explain');
	var OrderInfo = require('../widget/orderinfo/orderinfo');
	var InvoiceInfo = require('../widget/invoice/invoice');
	var productinfo = require('../widget/productinfo/productinfo');
	var orderDate = ['',
						'newOffice-common','newOffice-special',
						'newMarket-common','newMarket-special',
						'addOffice-common','addOffice-special',
						'addMarkey-common','addMarkey-special',
						'againOffice-common','againOffice-special',
						'againMarkey-common','againMarkey-special',
						'releateOffice-common','releateOffice-special',
						'releateMarket-common','releateMarket-special',
					];
    var NewMarketing = MClass( M.Center ).include( {
        
        elements: {
            '#tabs li'   :'tabsList'
        },
        events: {
			'click .action-cancel': 'cancelEve',
			'click .common-add' : 'getOrderInfo',
			'click .special-add' : 'specialAddEve'
        },
        init: function() {
            NewMarketing.__super__.init.apply( this, arguments );
            var me = this;
			//me.$view.find('.list-pager')

			//切换表头
			me.$tabsList.on('click',function(){
				var $this = $(this);
				var $t = $this.index();
				me.$('#tabs li').removeClass('current');
				me.$(this).addClass('current');
				me.$('.content-box ').css('display','none');
				me.$('.content-box ').eq($t).css('display','block');

				if( $this.attr('class').indexOf('common')> -1 ){
					me.attrs.showType = 'common';
				}else{
					me.attrs.showType = 'special';
				}
				//重新设置产品信息模块
				me.setProductShow();
			})
			//初始化
			me.attrs.showType = 'common';
			//综合折扣
			me.attrs.complexDiscount = '';
			me.checkType();
        },
		//判断类型
		checkType:function(){
			var me = this;

			switch( me.attrs.typeFlag )
			{
				//新购办公版类型
				
				case "newOffice" : case "releateOffice":
					me.setNavTitle( '新购办公版', '新购办公版特批');
					
					if(!IBSS.tempEnterprise){
						location.hash = "#agentsupport/entprisefiling";
					}

					me.attrs.basicCommon = new BasicInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':1} );
					me.attrs.basicSpecial = new BasicInfo( { 'wrapper':me.$view.find('.special-market-basic'),'data':{},'editFlag':true,'type':2} );
					me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':1} );
					me.attrs.explainSpecial = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':2} );
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':{},'editFlag':true,'type':1} );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':{},'editFlag':true,'type':2} );
					
					break;
					
				//新购营销版类型
				case 'newMarket': case "releateMarket":
					me.setNavTitle( '新购营销版', '新购营销版特批');
					
					if(!IBSS.tempEnterprise){
						location.hash = "#agentsupport/entprisefiling";
					}
					
					me.attrs.basicCommon = new BasicInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':3} );
					me.attrs.basicSpecial = new BasicInfo( { 'wrapper':me.$view.find('.special-market-basic'),'data':{},'editFlag':true,'type':4} );
					me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':3} );
					me.attrs.explainSpecial = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':4} );
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':{},'editFlag':true,'type':3} );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':{},'editFlag':true,'type':4} );
					
					break;
				  
				 //增购办公版订单
				case 'addOffice':
					me.setNavTitle( '增购办公版', '增购办公版特批');
					
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':5} );
					me.attrs.basicSpecial = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':6} );
					me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':5} );
					me.attrs.explainSpecial = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':6} );
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':{},'editFlag':true,'type':5} );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':{},'editFlag':true,'type':6} );
					
					me.setOrderInfo();
					
					break;
					
				 //增购营销版订单
				case 'addMarkey':
					me.setNavTitle( '增购营销版', '增购营销版特批');
					
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':7} );
					me.attrs.basicSpecial = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':8} );
					me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':7} );
					me.attrs.explainSpecial = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':8} );
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':{},'editFlag':true,'type':7 } );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':{},'editFlag':true,'type':8 } );
					
					me.setOrderInfo();
					
					break;
					
				//续费办公版订单
				case 'againOffice':
				
					me.setNavTitle( '续费办公版', '续费办公版特批');
					
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':9} );
					me.attrs.basicSpecial= new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':10} );
					me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':9} );
					me.attrs.explainSpecial = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':10} );
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':{},'editFlag':true,'type':9 } );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':{},'editFlag':true,'type':10 } );

					me.setOrderInfo();
					
					break;
					
				//续费营销版订单
				case 'againMarkey':
				
					me.setNavTitle( '续费营销版', '续费营销版特批');
					
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':11} );
					me.attrs.basicSpecial = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':12} );
					me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':11} );
					me.attrs.explainSpecial = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':12} );
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':{},'editFlag':true,'type':11 } );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':{},'editFlag':true,'type':12 } );
					
					me.setOrderInfo();
					
					break;	
				default:

			}
			me.setProductShow();
		},
		//显示产品信息
		setProductShow:function(){
			var me = this;

			var tempOrderType = _.indexOf(orderDate, me.attrs.typeFlag+'-'+me.attrs.showType) ;

			me.attrs.orderType = tempOrderType;
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

			me.attrs.prodeuctObj =  productinfo.showProductInfo( {terminalInfo:{$view:me.$view.find('.'+me.attrs.showType+'-terminalinfo')},
					tableInfo:{$view:me.$view.find('.'+me.attrs.showType+'-tableinfo')},
					formInfo:{$view:me.$view.find('.'+me.attrs.showType+'-forminfo')}}
			,tempOrderType );

		},
		//设置订单文字
		setNavTitle:function( common, special ){
			var me = this;
			me.$('.common-title').text( common )
			me.$('.special-title').text( special )
		},
		//渲染订单和产品基础信息：
		setOrderInfo:function(){
			var me = this;
			
		},
		//获取综合折扣
		getDiscount:function( data ,account ,callback){
			var me = this;

			var tempObj = {
				'productJson':JSON.stringify(data),
				'contractAmount':account
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
					}else{
						//callback && callback( );
					}
				},
				'error':function(){
					//callback && callback( );
				}
			})
		},
		//获取全部订单数据
		getOrderInfo:function(){
			var me = this,objData  = { 'orderEntity':{}};
			
			switch( me.attrs.typeFlag )
			{
				//新购办公版类型
				case 'newOffice':
					me.attrs.url = '/odr/submit'

					break;
					
				//新购营销版类型
				case 'newMarket':

					break;
				  
				 //增购办公版订单
				case 'addOffice':

					break;
					
				 //增购营销版订单
				case 'addMarkey':

					break;
					
				//续费办公版订单
				case 'againOffice':

					break;
					
				//续费营销版订单
				case 'againMarkey':

					break;	
				default:
				  
			}
			//获取普通订单信息
			debugger
			if(me.attrs.showType == 'common'){

				//基本信息校验和取值
				if( me.attrs.basicCommon.getValue() ){
					objData.enterprise = me.attrs.basicCommon.getValue();
				}else{
					return ;
				}

				//产品信息
				var temp = me.attrs.prodeuctObj.getData();
				objData.enterpriseExtend = temp.enterpriseExtend ;
				objData.contract = temp.contract;
				objData.orderEntity.order = temp.order
				objData.orderEntity.subOrders = temp.subOrders;

				//发票信息校验和取值
				if( me.attrs.invoiceCommon.getInfo() ){
					var temp  = me.attrs.invoiceCommon.getInfo();
					objData.orderEntity.invoice =temp.invoice;
					 $.extend(true, objData.orderEntity.order, temp.order);
				}else{
					return ;
				}
 				objData.orderEntity.order['isTp'] = 0;
			//获取特批订单信息
			}else{

				//基本信息校验和取值
				if( me.attrs.basicSpecial.getValue() ){
					objData.enterprise = me.attrs.basicSpecial.getValue();
				}else{
					return ;
				}

				//产品信息
				var temp = me.attrs.prodeuctObj.getData();
				objData.enterpriseExtend = temp.enterpriseExtend ;
				objData.contract = temp.contract;
				objData.orderEntity.order = temp.order
				objData.orderEntity.subOrders = temp.subOrders;


				//发票信息校验和取值
				if( me.attrs.invoiceSpecial.getInfo() ){
					var temp  = me.attrs.invoiceSpecial.getInfo();
					objData.orderEntity.invoice =temp.invoice;
					$.extend(true, objData.orderEntity.order, temp.order);
				}else{
					return ;
				}

				//获取特批地址
				if( me.attrs.explainSpecial.getValue() ){
					var temp  = me.attrs.explainSpecial.getValue();
					objData.orderEntity.order['approved_url'] = temp.approved_url;
				}else{
					return ;
				}
 				objData.orderEntity.order['isTp'] = 1;
			}
			//获取订单类型
			objData.orderEntity.order['orderType'] = me.attrs.orderType ;

			//综合折扣
			me.getDiscount( objData.orderEntity.subOrders ,objData.orderEntity.order.amount , function(  ){
				var discoutFlag = true;
				if(me.attrs.showType == 'common'){
					me.attrs.invoiceCommon.setDiscount( me.attrs.complexDiscount );
					_.map( objData.orderEntity.subOrders , function( obj , index){
						if(obj.discount && obj.discount<8){
							discoutFlag = false;
							//break;
						}
					});
					if( !discoutFlag ){
						util.showToast('综合折扣低于8折，必须申请特批');
						return false;
					}
				}else{
					me.attrs.invoiceSpecial.setDiscount( me.attrs.complexDiscount );
				}
				objData.orderEntity.order['discount'] = me.attrs.complexDiscount ;
				objData.contract['discount'] = me.attrs.complexDiscount ;

			/*	var objData = {
					"orderEntity": {
						"order": {
							"payStatus": 1,
							"currPayAmount": "7000",
							"payDate": 1457280000000,
							"receiptsAccount": "110914627510801000130",
							"productAmount":10000,
							"payerName": "付款的",
							"contractNo": "1230010",
							"amount": "7500",
							"isCooperation": 1,
							"cooperationUnit": "风部",
							"remark": "背时",
							"orderType": 1,
							"discount": 0
						},
						"subOrders": [
							{"subOrder":{
								 "productId": 2,
								 "purchaseCount": "1000",
								 "subOrderType": 0,
								 "purchaseAmount": null,
								 "startTime": 1457280000000,
								 "endTime": 1488902400000
								 }
							},{
								"subOrder":{
								 "productId": 3,
								 "purchaseCount": "20",
								 "subOrderType": 1,
								 "purchaseAmount": "2000",
								 "startTime": 1457280000000,
								 "endTime": 1488902400000
								 }
							},{
								"subOrder":{
									 "productId": "4",
									 "purchaseCount": 1,
									 "subOrderType": 1,
									 "purchaseAmount": "500",
									 "startTime": 1457280000000,
									 "endTime": 1488902400000,
									 "productAmount": "400",
									 "discount": "12.5"
								}
							},{
								"subOrder":{
									 "productId": "5",
									 "purchaseCount": 1,
									 "subOrderType": 1,
									 "purchaseAmount": "5000",
									 "startTime": 1457280000000,
									 "endTime": 1488902400000,
									 "productAmount": "400",
									 "discount": "125.0"
								 }
							 },{
								 "subOrder":{
									 "productId": "7",
									 "purchaseCount": 1,
									 "subOrderType": 1,
									 "purchaseAmount": "0",
									 "startTime": 1457280000000,
									 "endTime": 1488816000000,
									 "productAmount": "",
									 "discount": ""
								 }
							 }
						],
						"invoice": {
							"companyName": "公司名称",
							"invoiceHead": "XXXX公司",
							"taxpayerIdentificationNo": "12300000",
							"address": "地址",
							"telephone": "15241101101",
							"bankName": "开户行",
							"bankAccount": "7889554122",
							"amount":7500,
							"departmentname": "",
							"accountname": "ceshiqrr",
							"cooperationUnit": "风部",
							"remark": "背时",
							"businessLicense": "G_201603_07_296d5212ca0d4227a1a703b3fb676119.png",
							"businessLicenseFileName": "Y(}_X[Y$8DWYFS)22Y9N]`X.png",
							"taxpayerQualification": "G_201603_07_922e2e96f2604ed5873c66a63197a30b.png",
							"taxpayerQualificationFileName": "phonebg.png",
							"invoiceType": 2
						}
					},
					"enterprise": {
						"enterpriseName": "测试折扣",
						"enterpriseAccount": "qiyezhanghao03",
						"address": "测试折扣",
						"industry": 2,
						"Vendorid": 90925,
						"source": 1,
						"groupType": "1",
						"StorageTotalSpace":0,
						"province": "12",
						"city": "城市",
						"knowSource": "1",
						"registerMotive": "98",
						"companyScale": "5",
						"isSaleTeam edit-flag": "1",
						"saleTeamScale": "7",
						"isFirstmeetingSign": "1",
						"isWillPin": "0",
						"isStrangerVisits": "1",
						"dealDays": "6",
						"isReferral": "1",
						"keyContactName": "测试折扣",
						"keyContactPhone": "183101010101",
						"keyContactEmail": "1831010@qq.com",
						"contactName": "dfd",
						"contactPhone": "18310101010",
						"contactEmail": "1831010@qq.com",
						"contactim": "183101010101",
						"enterpriseFilingId": 603,
						"contractCopy": "",
						"contractCopyFileName": ""
					},
					"enterpriseExtend": {
						"companyGateKeyword": "门头关键自",
						"useBusinessCard":0,//是否使用名片0否 1是
						businessCardPrise:0,//名片金额
						"companyGateRemark": "门头卑职"
					},
					"contract": {
						"contractNo": "1230010",
						"contractPrice": "7500",
						"sealName": "合同章",
						"contract": "G_201603_07_abe744dd182f44c4a1d1dd872aa0b993.png",
						"contractFileName": "Y(}_X[Y$8DWYFS)22Y9N]`X.png",
						"contractCopy": "G_201603_07_a91c762c3ada44a992f11c1d4d56ae7a.jpg",
						"contractCopyFileName": "TI4T)TD$II@T995WBNX(D_L.jpg",
						"discount": 0
					}
				};*/


				util.api({
					'url':me.attrs.url,
					'data':JSON.stringify( objData ),
					'contentType':'application/json;charset=UTF-8 ',
					'success': function( data ){

						if( data.success ){

						}
					}
				})
			});

		},
		cancelEve: function(){
			
			var me = this; 
			
			switch( me.attrs.typeFlag )
			{
				//新购返回
				case 'newOffice','newMarket':
					
					location.hash = "#agentsupport/entprisefiling";
					break;
				default:
				   location.hash = "#agentsupport/entprisefiling";
			}
		}
    } );

    exports.init = function(param) {
		var $el = exports.$el;
		param = param || [];
		console.log(param)
		if(param.length<1) {

			return false;
		}else if(param.length==1){
			var newMarketing = new NewMarketing( { 'view':$el,'typeFlag':param[0]} );
		}else if( param.length==1 ){
			var newMarketing = new NewMarketing( { 'view':$el,'typeFlag':param[0], 'paralist':param[1]} );
		}

    }
} );