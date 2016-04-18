define(function( require , exports , module ){

	var template = require('./invoicedetail.html'); 
	var uploader = require('common/widget/upload').uploader;
	var Slider = require('common/widget/slider/slider');

	//付费状态map
	var payStatusMap = {
		'1': '全款',
		'2': '分期',
		'3': '未付'
	}
	
	//发票模块 提交编辑
	/**
	 *  发票详情
     *  三种状态  
     *  1 发票申请  
     *  2 发票重新提交 
	 *  3 发票查看
	 */
	var InvoiceDetail = MClass( Slider ).include({

		content: template,

		defaultAttr:{
			'title':'发票申请信息',
			'width': 600
		},

		elements: {
			'#businessLicense': 'businessLicense',
			'#qualification': 'qualification'
		},

		events: {
			'click [name="invoice"]': 'typeEve',               //
			'click [name="invoicetype"]': 'typeEve',           //
			'click .submit': 'submitEve',                      //申请提交
			'click .save': 'saveEve',                          //重新保存
			'click .cancel': 'cancelEve'                       //取消
		},

		//发票类型点击切换事件
		typeEve: function(){
			var me = this;

			var invoice = me.$('[name="invoice"]:checked').val();
			var invoicetype = me.$('[name="invoicetype"]:checked').val();

			if( invoice == 1 ){

				if( invoicetype == 1 ){
					me.$('.file').hide();
					me.$('.typea').show().siblings('section').hide();
				}else if( invoicetype == 2 ){
					me.$('.file').show();
					me.$('.typeb').show().siblings('section').hide();
				}
			}else if( invoice == 2 ){

				if( invoicetype == 1 ){
					me.$('.file').hide();
					me.$('.typec').show().siblings('section').hide();
				}else if( invoicetype == 2 ){
					me.$('.file').show();
					me.$('.typed').show().siblings('section').hide();
				}
			}
		},

		//申请提交
		submitEve: function(){
			var me = this;

			console.log('确定')
			var info = me.getInfo();
			if( info ){
				util.api({
					'url':'/odr/invoice/save',
					'contentType':'application/json',
					'data': JSON.stringify(info),
					'button':{
                    	'text': '提交中',
                    	'el': me.$('.submit')
                	},
					'success': function( data ){
						if( data.success ){
							console.log('发票保存成功');
							util.showTip('发票提交成功');
							me.trigger('saveSuccess');
							me.hide();
						}
					}
				})
			};
		},

		//重新保存
		saveEve: function(){
			var me = this;

			var info = me.getInfo();

			console.log('saveEve');
			console.log(info)

			function changeState( callback ){

				util.api({
					'url':'~/op/api/approval/directInvoiceApprove',
					'data':{
						'processInstanceId': me.processInstanceId, //实例id
						'approved': true
					},
					'success': function( data ){
						if( data.success ){
							callback && callback();
						}
					}
				})
			};


			if( info ){
				util.api({
					'url':'/odr/invoice/update',
					'contentType': 'application/json',
					'data': JSON.stringify(info),
					'button':{
						'text': '保存中',
						'el': me.$('.save')
					},
					'success': function( data ){
						if( data.success ){

							changeState(function(){
								util.showTip('保存成功');
								me.hide();
							});
						}
					}
				})
			};
		},

		//取消
		cancelEve: function(){
			var me = this;
			me.hide();
		},

		/**
		 * init
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

		// 显示
		// @param id 					订单id 
		// @param invoiceId     		发票id    
		// @param approvalStatus     
		//  0 提交        add   
		//  1 撤回        withdraw
		//	2 待审核      
		//  3 审批通过    
		//  9 被驳回      refuse 
		show: function( id, invoiceId, approvalStatus , info ){
			InvoiceDetail.__super__.show.apply( this, arguments );

			console.log('id');
			console.log( id );
			var me = this;

			me.orderId = id;

			if( invoiceId ){
				me.invoiceId = invoiceId;
			}

			if( info ){
				me.processInstanceId = info.processInstanceId;   //实例ID
			}

			//查询订单概况
			util.api({
				'url': '/odr/' + id + '/info',
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						data.value.model.hetongamount = data.value.model.amount;
						delete data.value.model.amount;
						data.value.model.payStatusStr = payStatusMap[data.value.model.payStatus];
						delete data.value.model.payStatus;

						me.model.load( data.value.model );
						me.model.set('orderId',id);
						me.model.set('invoiceId',invoiceId);
					}
				}
			});
			
			//如果有发票id则 显示发票详情
			if( invoiceId ){
				
				util.api({
					'url':'/odr/invoice/'+invoiceId,
					'success': function( data ){

						if( data.success ){
							me.model.load( data.value.model );

							if( data.value.model.invoiceProp == 1 ){
								me.$('[name="invoice"]').eq(0).trigger('click');
							}else{
								me.$('[name="invoice"]').eq(1).trigger('click');
							}

							if( data.value.model.invoiceType == 1 ){
								me.$('[name="invoicetype"]').eq(0).trigger('click');
							}else{
								me.$('[name="invoicetype"]').eq(1).trigger('click');
							}
							
							//
							if( data.value.model.businessLicense ){
								me.$('#bsimg').show().find('img').attr('src','/op/api/file/previewimage?filePath='+data.value.model.businessLicense);
							}

							//
							if( data.value.model.taxpayerQualification ){
								me.$('#qaimg').show().find('img').attr('src','/op/api/file/previewimage?filePath='+data.value.model.taxpayerQualification);
							}

							me.typeEve();
							me.setState( approvalStatus );
						}
					}
				});
			}else{
				me.$('[name="invoice"]').eq(0).trigger('click');
				me.$('[name="invoicetype"]').eq(0).trigger('click');
				me.typeEve();
				me.setState( approvalStatus );
			};
		},

		//根据显隐状态
		setState: function( status ){
			var me = this;

			console.log( 'status' );
			console.log( status );

			me.$('[data-state]').hide();
			
			me.$('[data-state]').each(function(){
				var $el = $( this );
				var state = $el.attr('data-state').split(/\s+/);
				state.forEach(function( item , index ){
					if( item == status ){
						$el.show();
					}
				});
			});

			if( (status != 1 ) && ( status != 9 ) && ( status != 0 ) ){
				me.$('input,textarea').attr('disabled','disabled')
			}
		},

		//隐藏
		hide: function( ){
			InvoiceDetail.__super__.hide.apply( this, arguments );

			var me = this;
			me.model.clear();
			
			//清除其他选项
			me.$('input,textarea').removeAttr('disabled');

			me.$('.imginfo').hide();

			//重置input选中状态
			me.$('[name="invoice"]').eq(0).trigger('click');
			me.$('[name="invoicetype"]').eq(0).trigger('click');
		},	

		//获取当前数据信息
		getInfo: function(){
			var me = this;

			var invoice = me.$('[name="invoice"]:checked').val();
			var invoicetype = me.$('[name="invoicetype"]:checked').val();
			
			//信息检测

			//通用信息检测
			if( !me.model.get('invoiceHead') ){
				util.showToast('请填写发票抬头!');
				return false;
			}
			if( !me.model.get('amount') ){
				util.showToast('请填写发票金额!');
				return false;
			}
			if( !me.model.get('receiverName') ){
				util.showToast('请填写收件人姓名');
				return false;
			}
			if( !me.model.get('receiverPhone') ){
				util.showToast('请填写收件人电话');
				return false;
			}
			if( !me.model.get('receiverAddress') ){
				util.showToast('请填写收件人地址');
				return false;
			}

			//增值税专用发票信息检测
			if( invoicetype == 2 ){
				if( !me.model.get('businessLicense') ){
					util.showToast('请选择营业执照');
					return false;
				}
				if( !me.model.get('taxpayerQualification') ){
					util.showToast('请选择资质证书');
					return false;
				}
				if( !me.model.get('taxpayerIdentificationNo') ){
					util.showToast('请填写纳税人识别号');
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
			}

			//预开发票信息检测
			if( invoice == 2 ){
				if( !me.model.get('approvalUrl') ){
					util.showToast('请填写审批链接');
					return false;
				}
			}

			var info = {
				"orderId": me.orderId,
				"id": parseInt( me.model.get('invoiceId') ),
  				"invoiceProp": invoice,
  				"invoiceType": invoicetype,
  				"amount": me.model.get('amount'),
  				"invoiceHead": me.model.get('invoiceHead'),
  				"businessLicenseFileName": me.model.get('businessLicenseFileName'),
  				"businessLicense": me.model.get('businessLicense'),
  				"taxpayerQualificationFileName": me.model.get('taxpayerQualificationFileName'),
  				"taxpayerQualification": me.model.get('taxpayerQualification'),
  				"taxpayerIdentificationNo": me.model.get('taxpayerIdentificationNo'),
  				"receiverName": me.model.get('receiverName'),
  				"receiverAddress": me.model.get('receiverAddress'),
  				"receiverPhone": me.model.get('receiverPhone'),
  				"bankName": me.model.get('bankName'),
  				"bankAccount": me.model.get('bankAccount'),
  				"approvalUrl": me.model.get('approvalUrl'),
  				"remark": me.model.get('remark')
			}

			return info;
		}
	});

	module.exports = InvoiceDetail;
})
