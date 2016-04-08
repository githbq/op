define(function( require , exports , module ){

	var template = require('./invoicedetail.html'); 
	var uploader = require('common/widget/upload').uploader;
	var Slider = require('common/widget/slider/slider');

	//订单模块
	var InvoiceDetail = MClass( Slider ).include({

		content: template,

		defaultAttr:{
			'title':'发票',
			'width': 600
		},

		elements: {
			'#businessLicense': 'businessLicense',
			'#qualification': 'qualification'
		},

		events: {
			'click [name="invoice"]': 'typeEve',
			'click [name="invoicetype"]': 'typeEve',
			'click .submit': 'submitEve',
			'click .cancel': 'cancelEve'
		},

		//发票类型点击切换事件
		typeEve: function(){
			var me = this;

			var invoice = me.$('[name="invoice"]:checked').val();
			var invoicetype = me.$('[name="invoicetype"]:checked').val();

			console.log( invoice );
			if( invoice == 0 ){

				if( invoicetype == 0 ){
					me.$('.file').hide();
					me.$('.typea').show().siblings('section').hide();
				}else if( invoicetype == 1 ){
					me.$('.file').show();
					me.$('.typeb').show().siblings('section').hide();
				}
			}else if( invoice == 1 ){

				if( invoicetype == 0 ){
					me.$('.file').hide();
					me.$('.typec').show().siblings('section').hide();
				}else if( invoicetype ==1 ){
					me.$('.file').show();
					me.$('.typed').show().siblings('section').hide();
				}
			}
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
			InvoiceDetail.__super__.init.apply( this, arguments );
			var me = this;
			
			//初始化事件
			me.initEvents();
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

		//外部接口 获取当前数据信息
		getInfo: function(){
			var me = this;

			
		}
	});

	module.exports = InvoiceDetail;
})
