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
	var productIdDic = {
            '1': 'CRM',
            '2': '销客终端',
            '3': '服务',
            '4': 'PK助手',
            '5': '会议助手',
            '6': 'HR助手',
            '7': '工资助手',
            '8':'名片'
        }; 
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
			me.attrs.tempData = {};
			me.attrs.orderList = {};
			//增购、续费需要的参数

			me.attrs.id = me.attrs.enterpriseId||'';
			me.attrs.account= me.attrs.account||'54976';
			me.attrs.subData = {}
			me.checkType();
        },
		//判断类型.
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
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':null,'editFlag':true,'type':1} );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':null,'editFlag':true,'type':2} );

					me.setProductShow();
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
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':null,'editFlag':true,'type':3} );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':null,'editFlag':true,'type':4} );

					me.setProductShow();
				break;
				  
				 //增购办公版订单
				case 'addOffice':
					me.setNavTitle( '增购办公版', '增购办公版特批');
					

					me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':5} );
					me.attrs.explainSpecial = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':6} );
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':null,'editFlag':true,'type':5} );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':null,'editFlag':true,'type':6} );
					
					me.setOrderInfo(function(){
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':me.attrs.orderList,'editFlag':true,'type':5} );
						me.attrs.basicSpecial = new OrderInfo( { 'wrapper':me.$view.find('.special-market-basic'),'data':me.attrs.orderList,'editFlag':true,'type':6} );
						me.getNeedDate();
						me.setProductShow();
					});
					
					break;
					
				 //增购营销版订单
				case 'addMarkey':
					me.setNavTitle( '增购营销版', '增购营销版特批');

					me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':7} );
					me.attrs.explainSpecial = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':8} );
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':null,'editFlag':true,'type':7 } );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':null,'editFlag':true,'type':8 } );

					me.setOrderInfo(function(){
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':me.attrs.orderList,'editFlag':true,'type':7} );
						me.attrs.basicSpecial = new OrderInfo( { 'wrapper':me.$view.find('.special-market-basic'),'data':me.attrs.orderList,'editFlag':true,'type':8} );
						me.getNeedDate();
						me.setProductShow();
					});
					
					break;
					
				//续费办公版订单
				case 'againOffice':
				
					me.setNavTitle( '续费办公版', '续费办公版特批');
					

					me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':9} );
					me.attrs.explainSpecial = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':10} );
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':null,'editFlag':true,'type':9 } );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':null,'editFlag':true,'type':10 } );

					me.setOrderInfo(function(){
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':me.attrs.orderList,'editFlag':true,'type':9} );
						me.attrs.basicSpecial= new OrderInfo( { 'wrapper':me.$view.find('.special-market-basic'),'data':me.attrs.orderList,'editFlag':true,'type':10} );
						me.getNeedDate();
						me.setProductShow();
					});
					
					break;
					
				//续费营销版订单
				case 'againMarkey':
				
					me.setNavTitle( '续费营销版', '续费营销版特批');
					

					me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':11} );
					me.attrs.explainSpecial = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':12} );
					me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-market-invioce'),'data':null,'editFlag':true,'type':11 } );
					me.attrs.invoiceSpecial = new InvoiceInfo( { 'wrapper':me.$view.find('.special-market-invioce'),'data':null,'editFlag':true,'type':12 } );

					me.setOrderInfo(function(){
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':me.attrs.orderList,'editFlag':true,'type':11} );
						me.attrs.basicSpecial = new OrderInfo( { 'wrapper':me.$view.find('.special-market-basic'),'data':me.attrs.orderList,'editFlag':true,'type':12} );
						me.getNeedDate();
						me.setProductShow();

					});
					
					break;	
				default:

			}
			//me.setProductShow();
		},
		//显示产品信息
		setProductShow:function(){
			var me = this;

			var tempOrderType = _.indexOf(orderDate, me.attrs.typeFlag+'-'+me.attrs.showType) ;
			tempOrderType = parseInt(tempOrderType);
			me.attrs.orderType = parseInt(tempOrderType) ;
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
			,tempOrderType,{'enterpriseId':me.attrs.id,'data':me.attrs.subData ,'readonly':false} );

		},
		//设置订单文字
		setNavTitle:function( common, special ){
			var me = this;
			me.$('.common-title').text( common )
			me.$('.special-title').text( special )
		},
		//渲染订单和产品基础信息：
		setOrderInfo:function( callback ){
			var me = this;

			util.api({
				'url':'/odr/queryProductVOList',
				'data':{'ea':me.attrs.account},
				'success': function( data ){

					if( data.success ){

						me.attrs.orderList = data;
						callback && callback();
					}
				}
			})

		},
		//转换为基本需要时间格式
		getNeedDate:function(  ){
			var me = this;
			var subArry = [];
			var data = me.attrs.orderList.model||[];

			if( me.attrs.typeFlag == 'addMarkey' || me.attrs.typeFlag == 'addOffice' ){
				//增购营销版需要crm时间
				for(var i = 0 ;i<data.length; i++ ){
					
					switch( data[i].code )
					{
						case "PK_Helper":
							var tempObe = {"subOrder":{
								"productId":4,
								"startTime": data[i].startDate,
								"endTime":data[i].endDate
							}}
							subArry.push(tempObe)
							break;

						case "Meeting_Helper'":
							var tempObe = {"subOrder":{
								"productId":5,
								"startTime": data[i].startDate,
								"endTime":data[i].endDate
							}}
							subArry.push(tempObe)

							break;
						case "Salary_Helper":
							var tempObe = {"subOrder":{
								"productId":7,
								"startTime": data[i].startDate,
								"endTime":data[i].endDate
							}}
							subArry.push(tempObe)

							break;
						case "CRM":
							var tempObe = {"subOrder":{
								"productId":1,
								"startTime": data[i].startDate,
								"endTime":data[i].endDate
							}}
							subArry.push(tempObe)

							break;
						case "HR_Helper":
							var tempObe = {"subOrder":{
								"productId":6,
								"startTime": data[i].startDate,
								"endTime":data[i].endDate
							}}
							subArry.push(tempObe)

							break;
						case "Business_Card":
							var tempObe = {"subOrder":{
								"productId":8,
								"startTime": data[i].startDate,
								"endTime":data[i].endDate
							}}
							subArry.push(tempObe)

							break;
						default:
					}
				}
				me.attrs.subData =  {
					'subOrders':subArry
				}

			}else if( me.attrs.typeFlag == 'againOffice' || me.attrs.typeFlag == 'againMarkey' ){
				//比较时间
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
									"startTime_readonly":true
								}}
								subArry.push(tempObe)
							}

							break;
						case "Meeting_Helper'":
							var nowDate = new Date( new Date().getTime() )._format('yyyy/MM/dd');
							var endDate = new Date( obj["endDate"]  )._format('yyyy/MM/dd');
							if( dateCompare(nowDate,endDate) ){
								var tempObe = {"subOrder":{
									"productId":5,
									"startTime":obj["endDate"],
									"startTime_readonly":true
								}}
								subArry.push(tempObe)
							}

							break;
						case "Salary_Helper":
							var nowDate = new Date( new Date().getTime() )._format('yyyy/MM/dd');
							var endDate = new Date( obj["endDate"]  )._format('yyyy/MM/dd');
							if( dateCompare(nowDate,endDate) ){
								var tempObe = {"subOrder":{
									"productId":7,
									"startTime":obj["endDate"],
									"startTime_readonly":true
								}}
								subArry.push(tempObe)
							}

							break;
						default:
					}
				});
				me.attrs.subData =  {
					'subOrders':subArry
				}
			}
		},
		//获取综合折扣
		getDiscount:function( data ,account ,callback){
			var me = this;

			var tempObj = {
				'productJson':JSON.stringify(data),
				'contractAmount':account,
				'orderType':me.attrs.orderType
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
				case 'newOffice': case 'releateOffice':
					me.attrs.url = '/odr/submit';
					//me.attrs.tempData = { "enterpriseFilingId":IBSS.tempEnterprise.id||''};
					objData.enterpriseFilingId = IBSS.tempEnterprise.id||'';
					break;
					
				//新购营销版类型
				case 'newMarket': case 'releateMarket':
					me.attrs.url = '/odr/submit';
					//me.attrs.tempData = { "enterpriseFilingId":IBSS.tempEnterprise.id||''};
					objData.enterpriseFilingId = IBSS.tempEnterprise.id||'';
					break;
				  
				 //增购办公版订单
				case 'addOffice':
					me.attrs.url = '/odr/submitPurchaseAdditional'
					me.attrs.tempData = { "orderEntity":{
							"order":{
								"enterpriseId":me.attrs.id ||''
							}
						},
						"enterpriseExtend":{
							"enterpriseId":me.attrs.id ||''
						},
						"enterprise":{
							"enterpriseId":me.attrs.id ||''
						}
					}
					break;
					
				 //增购营销版订单
				case 'addMarkey':
					me.attrs.url = '/odr/submitPurchaseAdditional'

					me.attrs.tempData = { "orderEntity":{
						"order":{
							"enterpriseId":me.attrs.id ||''
						}
					},
						"enterpriseExtend":{
							"enterpriseId":me.attrs.id ||''
						},
						"enterprise":{
							"enterpriseId":me.attrs.id ||''
						}
					}
					break;
					
				//续费办公版订单
				case 'againOffice':
					me.attrs.url = '/odr/renew/submit';
					objData.enterprise = { "enterpriseId":me.attrs.id }
					break;
					
				//续费营销版订单
				case 'againMarkey':
					me.attrs.url = '/odr/renew/submit';
					objData.enterprise = { "enterpriseId":me.attrs.id }
					break;	
				default:
				  
			}
			//获取普通订单信息
			if(me.attrs.showType == 'common'){

				//基本信息校验和取值
				if( me.attrs.basicCommon.getValue() ){
					var tem ={'enterprise': me.attrs.basicCommon.getValue()} ;
					tem.enterprise && $.extend(true, objData, tem );
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

				//检测子订单折扣是否低于8折
				if(!me.checkDiscount( temp.subOrders)){
					util.showToast('子产品折扣低于8折，必须申请特批');
					return false;
				}

				//发票信息校验和取值
				if( me.attrs.invoiceCommon.getInfo() ){
					var temp  = me.attrs.invoiceCommon.getInfo();
					temp.invoice ? objData.orderEntity.invoice =temp.invoice:objData.orderEntity.invoice = null;
					 $.extend(true, objData.orderEntity.order, temp.order);
				}else{
					return ;
				}
 				objData.orderEntity.order['isTp'] = 0;
			//获取特批订单信息
			}else{

				//基本信息校验和取值
				if( me.attrs.basicSpecial.getValue() ){
					var tem ={'enterprise':me.attrs.basicSpecial.getValue()}
					tem.enterprise && $.extend(true, objData, tem );
				}else{
					return ;
				}

				//产品信息
				if(me.attrs.prodeuctObj.validate()){
					var temp = me.attrs.prodeuctObj.getData();
					objData.enterpriseExtend = temp.enterpriseExtend ;
					objData.contract = temp.contract;
					objData.orderEntity.order = temp.order
					if(temp.subOrders.length<1){
						util.showToast('请至少选择一款子产品！');
						return false;
					}
					//检测类型为使用时，时间是90天
					if(!me.checkUsedDate( temp.subOrders )){
					
						return false;
					}
					objData.orderEntity.subOrders = temp.subOrders;
				
				}else{
					util.showToast('产品信息填写不完整！');
					return false;
				}

				//发票信息校验和取值
				if( me.attrs.invoiceSpecial.getInfo() ){
					var temp  = me.attrs.invoiceSpecial.getInfo();
					temp.invoice ? objData.orderEntity.invoice =temp.invoice : objData.orderEntity.invoice = null;
					$.extend(true, objData.orderEntity.order, temp.order);
				}else{
					return ;
				}

				//获取特批地址
				if( me.attrs.explainSpecial.getValue() ){
					var temp  = me.attrs.explainSpecial.getValue();
					objData.orderEntity.order['approvedUrl'] = temp.approvedUrl;
				}else{
					return ;
				}
 				objData.orderEntity.order['isTp'] = 1;
			}
			//获取订单类型
			objData.orderEntity.order['orderType'] = me.attrs.orderType ;
			$.extend(true, objData, me.attrs.tempData);
			if(objData.orderEntity.invoice && objData.orderEntity.invoice['businessLicense']){
				objData.enterpriseExtend['businessLicense'] = objData.orderEntity.invoice['businessLicense'] ;
				objData.enterpriseExtend['businessLicenseFileName'] = objData.orderEntity.invoice['businessLicenseFileName'];
			}
			//objData.enterpriseFilingId = objData.enterprise.enterpriseFilingId

			//综合折扣
			me.getDiscount( objData.orderEntity.subOrders ,objData.orderEntity.order.amount , function(  ){

				me.attrs.invoiceSpecial.setDiscount( me.attrs.complexDiscount );
				objData.orderEntity.order['discount'] = me.attrs.complexDiscount ;
				objData.contract['discount'] = me.attrs.complexDiscount ;

				util.api({
					'url':me.attrs.url,
					'data':JSON.stringify( objData ),
					'contentType':'application/json;charset=UTF-8 ',
					'success': function( data ){
						if( data.success ){
							util.showTip('提交成功！')
							location.hash = "#order/orderlist";
						}
					}
				})
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
						util.showToast(productName+'试用时间不能超过90天！');
						return false;
					}
				}
			}
			return true;
		},
		checkDiscount:function( data ){
			var me = this;
			var discoutFlag = true;
			if( me.attrs.typeFlag == 'newOffice' || me.attrs.typeFlag == 'newMarket'|| me.attrs.typeFlag == 'releateOffice'|| me.attrs.typeFlag == 'releateMarket' ){
				_.map( data , function( obj ){
					if(obj.subOrder.productId ==1 || obj.subOrder.productId ==4  || obj.subOrder.productId ==5 ){
						if( obj.subOrder.discount  &&  obj.subOrder.discount<8){
							discoutFlag = false;
							//util.showToast('子产品折扣低于8折，必须申请特批');
							//return false;
						}
					}
				});
			}else{
				_.map( data , function( obj ){
					if(obj.subOrder.productId ==1 || obj.subOrder.productId ==4  || obj.subOrder.productId ==7  || obj.subOrder.productId ==5 ){
						if( obj.subOrder.discount  &&  obj.subOrder.discount<8){
							discoutFlag = false;
							//util.showToast('子产品折扣低于8折，必须申请特批');
							//return false;
						}
					}
				});
			}
			if( !discoutFlag ){
				return false;
			}
			return  true;
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
				   location.hash = "#ent/lst";
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
		}else if( param.length==2 ){
			var newMarketing = new NewMarketing( { 'view':$el,'typeFlag':param[0], 'enterpriseId':param[1]} );
		}if( param.length==3 ){
			var newMarketing = new NewMarketing( { 'view':$el,'typeFlag':param[0], 'enterpriseId':param[1] ,"account":param[2]} );
		}

    }
} );