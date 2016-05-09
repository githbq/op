define(function( require , exports , module ){

	var template = require('./onlinepay.html'); 
	var uploader = require('common/widget/upload').uploader;
	var Slider = require('common/widget/slider/slider');

	
	//发票模块 提交编辑
	var OnlinePay = MClass( Slider ).include({

		content: template,

		defaultAttr:{
			'title':'订单详情',
			'width': 600
		},

		elements: {
		
		},

		events: {

		},

		/**
		 * init
		 */
		init: function( attrs ){
			OnlinePay.__super__.init.apply( this, arguments );
			var me = this;
			
		},


		// 显示
		// @param id 					订单id 
		// @param invoiceId     		发票id    
		// @param approvalStatus     
		//  0 提交        add   
		//  1 撤回        withdraw
		//	2 待审核      
		//  3 审批通过    
		//  9 被驳回      refuse 
		show: function( options ){
			OnlinePay.__super__.show.apply( this, arguments );

			var me = this;
			me.attrs.options = options||{};
			me.attrs.dataObj = {};


			//查询订单概况
			util.api({
				'url': '/odr/getOnlineOrderDetail',
				'data':{
					'orderId':me.attrs.options.id
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						var strToObj = $.parseJSON( data.value.model.orderExtends[0].value);
						var typeStr = {'1':'支付宝','2':'微信','3':'其他'};
						me.attrs.dataObj.orderid = me.attrs.options.id||'';
						me.attrs.dataObj.enterpriseAccount = data.value.model.order.enterpriseAccount||'';
						me.attrs.dataObj.enterpriseName = data.value.model.order.enterpriseName||'';
						me.attrs.dataObj.payAccount = typeStr[strToObj.payType] +"——"+ strToObj.payAccount;
						me.attrs.dataObj.purchaseAmount = strToObj.purchaseAmount||'';
						me.attrs.dataObj.purchaseCount = strToObj.purchaseCount||'';
						me.attrs.dataObj.payTime = strToObj.payTime ? new Date( parseInt(strToObj.payTime) )._format('yyyy-MM-dd hh:mm'):'';
						me.attrs.dataObj.payStatus =  data.value.model.order.payStatus||'';
						me.model.load( me.attrs.dataObj  )
					}
				}
			});
			
		},



		//隐藏
		hide: function( ){
			OnlinePay.__super__.hide.apply( this, arguments );

			var me = this;
		
		},	

	});

	module.exports = OnlinePay;
})
