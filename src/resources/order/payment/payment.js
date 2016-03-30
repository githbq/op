define( function( require, exports, module ) {
    var IBSS = window.IBSS;

	var OrderInfo = require('../widget/orderinfo/orderinfo');
	var InvoiceInfo = require('../widget/invoice/invoice');
	var GetMoney = require('../widget/getmoney/getmoney');
	
    var PayMent = MClass( M.Center ).include( {
        
        elements: {
            '#tabs li'   :'tabsList',
			'.common-add':'commonAdd'
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

			me.checkType();
        },
		//判断类型.
		checkType:function(){
			var me = this;
			me.$('.order-id').text(me.attrs.id)
			
			$.when( me.setOrderList(), me.getReceiveOrder() ).done(function(){
						
				me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common-invioce'),'data':null,'editFlag':true,'type':17 } );
				me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common-basic'),'data':me.attrs.orderList,'editFlag':true,'type':17} );
				me.attrs.getMoney = new GetMoney( { 'wrapper':me.$view.find('.common-product'),'data':me.attrs.receiveData,'editFlag':true,'type':17,'showType':true} );

			});
		
		},
		//当前订单合同信息
		getReceiveOrder:function(){
			var me = this;
			return util.api({
					'url':'/odr/'+me.attrs.id+'/paidInfo',
					'success': function( data ){

						if( data.success ){
							me.attrs.receiveData = data.value.model;

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

				//尾款订单数据
				if( me.attrs.getMoney.getValue() ){
					var tem = me.attrs.getMoney.getValue() ;
					objData.orderEntity.order = tem.order;
					objData.orderEntity.subOrders = tem.subOrders;
					objData.orderEntity.order.contractNo = me.attrs.contractNo;
					objData.orderEntity.order.oriOrderId = me.attrs.id;
				}else{
					return ;
				}

				//发票信息校验和取值
				if( me.attrs.invoiceCommon.getInfo() ){
					var temp  = me.attrs.invoiceCommon.getInfo();
					objData.orderEntity.invoice =temp.invoice;
					 $.extend(true, objData.orderEntity.order, temp.order );
				}else{
					return ;
				}

			//获取订单类型
			objData.orderEntity.order['orderType'] = 17 ;
			objData.enterprise.enterpriseId = me.attrs.enterpriseId;

			util.api({
				'url':'/odr/balancePayment/submit',
				'data':JSON.stringify( objData ),
				'button': {
					'el': me.$commonAdd,
					'text':'提交中......'
				},
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
			location.hash = "#order/orderlist";
			
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