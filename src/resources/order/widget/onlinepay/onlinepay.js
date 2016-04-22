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
						me.attrs.dataObj.orderid = me.attrs.options.id||'';
						me.attrs.dataObj.enterpriseAccount = data.value.model.odrOrder.enterpriseAccount||'';
						me.attrs.dataObj.enterpriseName = data.value.model.odrOrder.enterpriseName||'';
						me.attrs.dataObj.payAccount = data.value.model.odrOnlineOrderRecord.payType +"——"+ data.value.model.odrOnlineOrderRecord.payNo;
						me.attrs.dataObj.purchaseAmount = data.value.model.odrSubOrder.purchaseAmount||'';
						me.attrs.dataObj.purchaseCount = data.value.model.odrSubOrder.purchaseCount||'';
						me.attrs.dataObj.payTime = data.value.model.odrOnlineOrderRecord.payTime ? new Date( data.value.model.odrOnlineOrderRecord.payTime )._format('yyyy-MM-dd hh:mm'):'';
						me.attrs.dataObj.payStatus =  data.value.model.odrOrder.payStatus||'';
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
