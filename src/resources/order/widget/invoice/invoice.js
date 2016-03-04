define(function( require , exports , module ){

	var template = require('./invoice.html'); 



	//订单模块
	var Invoice = MClass( M.Center ).include({

		view: template,
		
		elements: {
			'#businessLicense': 'businessLicense',
			'#qualification': 'qualification'
		},

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

			//初始化事件
			this.initEvents();
		},

		initEvents: function(){
			var me = this;

			me.$businessLicense.on('change',function(){
				console.log('change');
				console.log( me.$businessLicense[0] );
			});

			me.$qualification.on('change',function(){
				console.log('change');
				console.log( me.$qualification[0] );
			});
		},

		render: function(){
			this.attrs['wrapper'].html( this.$view );
		}
	});


	module.exports = Invoice;
})
