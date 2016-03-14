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
			var value = $( e.currentTarget ).val();
			if( value == '1' ){
				me.$('.teaminfo').show();
			} else {
				me.$('.teaminfo').hide();
			}
		},

		/**
		 *
		 * attrs
		 *  wrapper 
		 *  data
		 *  editFlag
		 *  type
		 */
		init: function( attrs ){
			Invoice.__super__.init.apply( this, arguments );
			var me = this;

			console.warn('invoice init');
			console.warn( attrs );

			//设置数据 显示数据
			if( attrs.data ){
				me.model.load( attrs.data.invoice );
				me.model.load( attrs.data.order );

				if( attrs.data.order && attrs.data.order.discount ){
					me.setDiscount( attrs.data.order.discount );
				}

				if( attrs.data.invoice.invoiceType == 1 ){
					me.$('.invoice-bar label').eq(0).trigger('click');
					me.$('[name="intype"]').eq(0).trigger('click');
					me.$('.yyzzimg').show().find('img').attr('src',"/op/api/file/previewimage?filePath="+attrs.data.invoice.businessLicense)

				}else if( attrs.data.invoice.invoiceType == 2 ){
					me.$('.invoice-bar label').eq(0).trigger('click');
					me.$('[name="intype"]').eq(1).trigger('click');
					me.$('.yyzzimg').show().find('img').attr('src',"/op/api/file/previewimage?filePath="+attrs.data.invoice.businessLicense)
					me.$('.nsrzimg').show().find('img').attr('src',"/op/api/file/previewimage?filePath="+attrs.data.invoice.taxpayerQualification)
				}else{
					me.$('.invoice-bar label').eq(1).trigger('click');
				}

				if( attrs.data.order.isTp == 1 ){

					me.$('[name="team"]').eq(1).trigger('click');
				}else{
					me.$('[name="team"]').eq(0).trigger('click');
				}

				me.$('.roleinfo').hide();
			}
			if( attrs.editFlag == false ){
				me.$('input').attr('disabled','disabled');
			}

			//初始化事件
			this.initEvents();
			this.render();
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

			var departmentname = '';
			if( IBSS.role.department && IBSS.role.department.name ){
				departmentname = IBSS.role.department.name;
			}

			this.model.set('departmentname', departmentname);
			this.model.set('accountname', IBSS.role.name);
		},

		//外部接口 获取当前数据信息
		getInfo: function(){
			var me = this;

			//进行表单验证

			//获取发票类型
			var intype = me.$('[name="intype"]:checked').val();
			var invoice = me.$('[name="invoice"]:checked').val();

			var invoiceType;
			if( invoice == '2' ){

				invoiceType = 3;
			}else if( invoice == '1' ){

				if( intype == '1' ){
					invoiceType = 1;
				}else if( intype == '2' ){
					invoiceType = 2;
				}
			}

			me.model.set('invoiceType',invoiceType);

			switch( invoice ){
				case '1':
					switch( intype ){
						case '1':
							if( !me.model.get('businessLicense') ){
								util.showToast('请选择营业执照');
								return false;
							}
							if( !me.model.get('invoiceHead') ){
								util.showToast('请填写发票抬头');
								return false;
							}
							if( !me.model.get('amount') ){
								util.showToast('请填写发票金额');
								return false;
							}
						break;
						case '2':
							if( !me.model.get('businessLicense') ){
								util.showToast('请选择营业执照');
								return false;
							}
							if( !me.model.get('taxpayerQualification') ){
								util.showToast('请选择一般纳税人资质证书');
								return false;
							}
							if( !me.model.get('invoiceHead') ){
								util.showToast('请填写发票抬头');
								return false;
							}
							if( !me.model.get('amount') ){
								util.showToast('请填写发票金额');
								return false;
							}
							if( !me.model.get('taxpayerIdentificationNo') ){
								util.showToast('请填写纳税人识别号');
								return false;
							}
							if( !me.model.get('address') ){
								util.showToast('请填写地址');
								return false;
							}
							if( !me.model.get('telephone') ){
								util.showToast('请填写电话');
								return false;
							}
							if( !me.model.get('bankName') ){
								util.showToast('请填写开户行');
								return false;
							}
							if( !me.model.get('bankAccount') ){
								util.showToast('请填写账号');
								return false;
							}
						break;
					}
				break;
				case '2':
					if( !me.model.get('companyName') ){
						util.showToast('请填写公司名称');
						return false;
					}
					if( !me.model.get('amount') ){
						util.showToast('请填写收据金额');
						return false;
					}
				break;
				case '3':
				break;
			}
			
			var invoiceinfo;
			if( invoice == "3" ){
				invoiceinfo = null;
			}else{
				invoiceinfo = me.model.all();
			}

			return {
				'invoice': invoiceinfo,
				'order':{
					'isCooperation': me.$('[name="team"]:checked').val(),   //是否合作单
					'cooperationUnit': me.model.get('cooperationUnit'),     //部门员工      
					'remark': me.model.get('remark')                        //备注
				}
			};
		},

		//设置折扣
		setDiscount: function( number ){
			var me = this;
			me.$('.discount').text( number + '折' );
		}
	});


	module.exports = Invoice;
})
