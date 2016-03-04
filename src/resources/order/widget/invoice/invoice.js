define(function( require , exports , module ){

	var template = require('./invoice.html'); 



	//订单模块
	var Invoice = MClass( M.Center ).include({

		view: template,
		
		events: {
			'click [name="invoice"]': 'invoiceEve'
		},

		//发票类型点击事件
		invoiceEve: function( e ){
			var me = this;
			var target = $( e.currentTarget ).attr('data-target');
			
			console.log( target );
			me.$('.invoice'+target).show().siblings().hide();
		},

		init: function(){
			Invoice.__super__.init.apply( this, arguments );
		},

		render: function(){
			this.attrs['wrapper'].html( this.$view );
		}
	});


	module.exports = Invoice;
})
