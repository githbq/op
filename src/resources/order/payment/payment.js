define( function( require, exports, module ) {
    var IBSS = window.IBSS;

	var OrderInfo = require('../widget/orderinfo/orderinfo');
	var InvoiceInfo = require('../widget/invoice/invoice');
	
    var PayMent = MClass( M.Center ).include( {
        
        elements: {
            '#tabs li'   :'tabsList'
        },
        events: {
			'click .action-cancel': 'cancelEve',
			'click .common-add' : 'getOrderInfo',
			'click .special-add' : 'specialAddEve'
        },
        init: function() {
            PayMent.__super__.init.apply( this, arguments );
            var me = this;

			me.attrs.orderList = {};
			me.attrs.id = me.attrs.paralist||'';

			me.checkType();
        },
		//判断类型.
		checkType:function(){
			var me = this;
			
			
			$.when( me.setOrderList(), me.getReceiveOrder() ).done(function(){
						
				me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-invioce'),'data':{},'editFlag':true,'type':17 } );
				me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common-basic'),'data':me.attrs.orderList,'editFlag':true,'type':9} );
			});
		
		},
		//当前订单合同信息
		getReceiveOrder:function(){
			var me = this;
			return util.api({
					'url':'/odr/contract/paidInfo',
					'data':{'contractNo':me.attrs.contractNo},
					'success': function( data ){

						if( data.success ){
							me.attrs.receiveData = '';
							//me.attrs.orderList = data;
							
						}
					}
				});

		},
		
		//渲染订单和产品基础信息：
		setOrderList:function( callback ){
			var me = this;

			return util.api({
					'url':'/odr/queryProductVOList',
					'data':{'ea':me.attrs.ea },
					'success': function( data ){

						if( data.success ){
							me.attrs.orderList = data;
						}
					}
				});

		},
	
		//获取全部订单数据
		getOrderInfo:function(){
			var me = this,objData  = { 'orderEntity':{},'enterprise':{}};
			
		

				//基本信息校验和取值
				if( me.attrs.basicCommon.getValue() ){
					var tem ={'enterprise': me.attrs.basicCommon.getValue()} ;
					$.extend(true, objData, tem );
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
					 $.extend(true, objData.orderEntity.order, temp.order , me.attrs.tempData);
				}else{
					return ;
				}
 				objData.orderEntity.order['isTp'] = 0;
			
			//获取订单类型
			objData.orderEntity.order['orderType'] = me.attrs.orderType ;
			//objData.enterpriseFilingId = objData.enterprise.enterpriseFilingId
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
			});
		},
		cancelEve: function(){
			
			var me = this; 
			
			location.hash = "#ent/lst";
			
		}
    } );

    exports.init = function(param) {
		var $el = exports.$el;
		param = param || [];
		console.log(param)
		if(param.length<1) {

			return false;
		}
		var payMent = new PayMent( { 'view':$el,'id':param[0], 'enterpriseId':param[1] ,
		"orderType":param[2],"opinion":param[3],"isTp":param[4],"ea":param[5],"contractNo":param[6]} );

    }
} );