define(function( require , exports , module ){

	var template = require('./invoice.html'); 
	var uploader = require('common/widget/upload').uploader;


	//订单模块
	var Invoice = MClass( M.Center ).include({

		view: template,
		
		elements: {
			'#businessLicense': 'businessLicense',
			'#qualification': 'qualification'
		},

		events: {
			'click [name="invoice"]': 'invoiceEve',
			'click [name="intype"]': 'intypeEve',
			'click [name="team"]': 'teamEve'
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

		//选择合作单
		teamEve: function( e ){
			var me = this;
			var value = $( e.currentTarget ).attr('data-value');
			if( value == 1 ){
				me.$('.teaminfo').show();
			} else {
				me.$('.teaminfo').hide();
			}
		},

		init: function(){
			Invoice.__super__.init.apply( this, arguments );

			//初始化事件
			this.initEvents();
		},

		//初始化事件
		initEvents: function(){
			var me = this;

			//
			me.$businessLicense.on('change',function(){
				console.log('change');
				console.log( me.$businessLicense[0].files );
				uploader.send({
					'url':'/op/api/file/uploadsinglefileandcheck',
					'files': me.$businessLicense[0].files,
					'options':{
						'limittype':'IMAGE'
					},
					'success': function( response ){
						console.warn( response );
						me.model.set('businessLicense', response.value.model.path );
						me.model.set('businessLicenseFileName', response.value.model.FileName );
					}
				})
			});
			//
			me.$qualification.on('change',function(){
				console.log('change');
				console.log( me.$qualification[0].files );
				uploader.send({
					'url': '/op/api/file/uploadsinglefileandcheck',
					'files': me.$qualification[0].files,
					'options':{
						'limittype':'IMAGE'
					},
					'success': function( response ){
						console.warn( response );
						me.model.set('taxpayerQualification', response.value.model.path );
						me.model.set('taxpayerQualificationFileName', response.value.model.FileName );
					}
				})
			});
		},

		render: function(){
			this.attrs['wrapper'].html( this.$view );
		},

		//外部接口 获取当前数据信息
		getInfo: function(){
			var me = this;

			return me.model.all();
		}
	});


	module.exports = Invoice;
})
