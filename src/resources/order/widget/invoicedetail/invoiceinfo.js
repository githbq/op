define(function( require , exports , module ){

	var template = require('./invoiceinfo.html'); 
	var Slider = require('common/widget/slider/slider');

	//订单模块
	var InvoiceInfo = MClass( Slider ).include({

		content: template,

		defaultAttr:{
			'title':'发票',
			'width': 600
		},

		events: {
			'click .submit': 'submitEve',
			'click .cancel': 'cancelEve'
		},

		//确定
		submitEve: function(){
			var me = this;
		},

		//取消
		cancelEve: function(){
			var me = this;
		},

		/**
		 *
		 *  attrs
		 *  wrapper 
		 *  data
		 *  editFlag
		 *  type
		 */
		init: function( attrs ){
			InvoiceInfo.__super__.init.apply( this, arguments );
			var me = this;
		},

		//外部接口 获取当前数据信息
		getInfo: function(){
			var me = this;
		}
	});

	module.exports = InvoiceInfo;
})
