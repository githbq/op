define(function( require , exports , module ){

	var template = require('./invoice.html'); 



	//订单模块
	var Invoice = MClass( M.Center ).include({

		view: template,
		
		events: {
			'click [name="invoice"]': 'invoiceEve',
			'click [name="intype"]': 'intypeEve'
		},

		//发票点击事件
		invoiceEve: function( e ){
			var me = this;
			var target = $( e.currentTarget ).attr('data-target');
			
			console.log( target );
			me.$('.'+target).show().siblings().hide();
		},

		//类型点击事件
		intypeEve: function( e ){
			var me = this;
			var target = $( e.currentTarget ).attr('data-target');

			me.$('.'+target).show().siblings().hide();
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
