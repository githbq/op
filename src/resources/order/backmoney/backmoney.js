/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

	var IBSS = window.IBSS,
        TPL = IBSS.tpl;
		
	var Slider = require('common/widget/slider/slider');
	 var AreaTree = require('module/areatree/areatree');

	var contentStr = require('./backmoney.html');
	var OrderInfo = require('../widget/orderinfo/orderinfo');
	var CotractMoney = require('../widget/cotractmoney/cotractmoney');
	var InvoiceList = require('../widget/invoicelist/invoicelist');
	
	var orderTypeAry = ['','办公版新购-普通','办公版新购-特批','营销版新购-普通','营销版新购-特批','办公版增购-普通',
		'办公版增购-特批','营销版增购-普通','营销版增购-特批','办公版续费-普通','办公版续费-特批',
		'营销版续费-普通','营销版续费-特批','关联自注册办公版-普通','关联自注册办公版-特批',
		'关联自注册营销版-普通','关联自注册营销版-特批','收尾款'
	];

    /////////////////
    //
    //  查看审批详情
    /////////////////
	var DetailApproval = MClass( Slider ).include({

		content: contentStr,

		defaultAttr: {
			'width': 1300,
			'title':'退款信息'
		},
		elements: {
			'.action-save':'actionSave',
			'.action-resend':'actionResend',
			'.action-agree':'actionAgree',
			'.action-reject':'actionReject',
			'.action-submit':'actionSubmit',
			'.enterpriseAccount':'enterpriseAccount',
			'.money-time':'moneyTime'
		},
		events:{
			'click .action-save':'actionSaveEve',
			'click .action-submit':'actionSubmitEve',
			'click .action-resend':'actionResendEve',
			'click .action-agree':'actionAgreeEve',
			'click .action-reject':'actionRejectEve'
		},

		
		init: function(){
			DetailApproval.__super__.init.apply( this,arguments );
			var me = this;
			
			//选择区域模块
			me.$moneyTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});
           
		},

		/**
		 *
		 * @param id   实例id
		 * @param eid  企业id
		 * @param type 类型
		 */
		show: function( options ){
			var me = this;
			me.attrs.options = options||{};
			me.attrs.orderList = {};
			me.attrs.hasInovice = 0;
			me.attrs.invoiceData = [];
			
			me.setState();
			me.sortType();
			
			DetailApproval.__super__.show.call( this,true );
		},
		//根据定单类型区分设置
		sortType:function(){
			var me = this;
			me.attrs.options.orderType = parseInt(me.attrs.options.orderType)
			
			//me._setTitle( orderTypeAry[me.attrs.options.orderType] );
			
			$.when(  me.setOrderList()/*, me.getInvoiceList() */).done(function(){
				
				me.setOrderInfo();
				/*me.attrs.invoiceData =[
				{
						"id": "发票ID",
		  "orderId": "订单号ID",
		  "invoiceProp": "发票属性：1款到开票,2预开发票",
		  "invoiceType": "发票类型 1：普通增值税发票 2：增值税专用发票",
		  "amount": "合同金额",
		  "invoiceHead": "发票抬头",
		  "businessLicenseFileName": "税务登记正本/副本或三证合一的营业执照 文件名",
		  "businessLicense": "税务登记正本/副本或三证合一的营业执照 照片",
		  "taxpayerQualificationFileName": "一般纳税人资质证书(或认定通知) 文件名",
		  "taxpayerQualification": "一般纳税人资质证书(或认定通知) 照片路径",
		  "taxpayerIdentificationNo": "纳税人识别号",
		  "receiverName": "收件人姓名",
		  "receiverAddress": "收件人地址",
		  "receiverPhone": "收件人电话",
		  "bankName": "开户行",
		  "bankAccount": "银行账号",
		  "approvalUrl": "审批链接",
		  "remark": "备注",
		  "approvalStatus": "审批状态：0待审核 1审批通过 9被驳回",
		  "invoiceStatus": "开票状态：0未开 1已开",
		  "invoiceNo": "发票号",
		  "invoiceCompany": "开票公司",
		  "invoiceDate": "开票日期",
		  "expressStatus": "快递状态：0未寄 1已寄",
		  "expressName": "快递公司",
		  "expressNo": "快递单号"
				},{
						"id": "发票ID",
		  "orderId": "订单号ID",
		  "invoiceProp": "发票属性：1款到开票,2预开发票",
		  "invoiceType": "发票类型 1：普通增值税发票 2：增值税专用发票",
		  "amount": "合同金额",
		  "invoiceHead": "发票抬头",
		  "businessLicenseFileName": "税务登记正本/副本或三证合一的营业执照 文件名",
		  "businessLicense": "税务登记正本/副本或三证合一的营业执照 照片",
		  "taxpayerQualificationFileName": "一般纳税人资质证书(或认定通知) 文件名",
		  "taxpayerQualification": "一般纳税人资质证书(或认定通知) 照片路径",
		  "taxpayerIdentificationNo": "纳税人识别号",
		  "receiverName": "收件人姓名",
		  "receiverAddress": "收件人地址",
		  "receiverPhone": "收件人电话",
		  "bankName": "开户行",
		  "bankAccount": "银行账号",
		  "approvalUrl": "审批链接",
		  "remark": "备注",
		  "approvalStatus": "审批状态：0待审核 1审批通过 9被驳回",
		  "invoiceStatus": "开票状态：0未开 1已开",
		  "invoiceNo": "发票号",
		  "invoiceCompany": "开票公司",
		  "invoiceDate": "开票日期",
		  "expressStatus": "快递状态：0未寄 1已寄",
		  "expressName": "快递公司",
		  "expressNo": "快递单号"
				}
				];*/
				if(me.attrs.invoiceData.length>0){
					me.showInvoiceList()
					me.attrs.hasInovice = 1; //有发票
				}
				

				//企业信息
				me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
					'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					
				//合同付款信息
				me.attrs.cotractMoney = new CotractMoney( { 'wrapper':me.$view.find('.common-product'),'orderId':me.attrs.options.id,'hasInovice':me.attrs.hasInovice} );
			});


		},

		//渲染订单和产品基础信息：
		setOrderList:function( callback ){
			var me = this;

			return util.api({
					'url':'/odr/queryProductVOList',
					'data':{'ea':me.attrs.options.ea },
					'success': function( data ){

						if( data.success ){

							me.attrs.orderList = data;
							callback && callback();
						}
					}
			});

		},
		//获取发票列表：
		getInvoiceList:function(  ){
			var me = this;

			return util.api({
					'url':'/odr/'+me.attrs.options.id+'/invoices ',
					'success': function( data ){

						if( data.success ){

							me.attrs.invoiceData = data.model;
							//callback && callback();
						}
					}
			});

		},
		//循环展示发票
		showInvoiceList:function(){
			var me = this;
			var tempLength = me.attrs.invoiceData.length;
			for(var i = 0; i<tempLength; i++){
				var tempClass = "invoice_"+i;
				me.$view.find('.common--invioce').append('<div class="'+tempClass+'"></div>');
				
				new InvoiceList( { 'wrapper':me.$view.find('.'+tempClass+''),'dataObj':me.attrs.invoiceData[i]} );
			}
		},
		//设置订单基本信息
		setOrderInfo:function(){
			 var  me = this;
			 //收尾款模块
			 //设置是否可以编辑
			me.attrs.moneyEdit = me.attrs.options.editFlag;
			//财务驳回只能部分编辑和小助手第二次驳回
			if(me.attrs.options.rejectsFrom &&  me.attrs.options.rejectsFrom == 3  && me.attrs.options.editFlag){
				me.attrs.moneyEdit = false;;
			}
			
		},
		//设置自己部分的显示和隐藏：
		setState:function(){
			var me = this;
			me.$('.state').hide();
			me.$('.state-'+me.attrs.options.state).show();
			if(me.attrs.options.editFlag){
				me.$('.state-refuse').show();
			}
			me.$('.currentTask-'+me.attrs.options.currentTask).show();
			me.$('.order-id').html( me.attrs.options.id );
		
			
			//设置到款时间 receivedPayDate
			var receivedPayDate = (me.attrs.orderData && me.attrs.orderData.order && me.attrs.orderData.order.receivedPayDate) ? new Date( me.attrs.orderData.order.receivedPayDate  )._format("yyyy-MM-dd"):'';
			if(receivedPayDate){
				me.$('.receivedPayDate').show();
				me.$('.receivedPayDate-text').text(receivedPayDate);
				me.$('.currentTask-finance').hide();
			}

		},
		//设置审批意见
		setOptions:function(){
			var me = this,strDom = '';
			
			var optionsList = me.attrs.orderData.order.rejectReason ? me.attrs.orderData.order.rejectReason.split('<+>'): [];
			for(var i = 0; i<optionsList.length; i++){
				var tempAry = optionsList[i].split('<->');
				tempAry[2] = (tempAry[2]=='true') ? '同意':'驳回';
				strDom+='<tr><td>'+tempAry[0]+'</td><td>'+tempAry[1]+'</td><td>'+tempAry[2]+'</td><td>'+tempAry[3]+'</td></tr>'
			}
			
			//判断审批意见
			var opinion = strDom ? strDom :'<tr><td colspan="4" style="text-align: center;">暂无</td></tr>';
			me.$('.last-options').html( opinion );
			
		},
		//获取全部订单数据
		getOrderInfo:function( callback ){

			var me = this,objData  = { 'orderEntity':{}};

			//获取普通订单信息
			
			//尾款订单数据
			if( me.attrs.getMoneyCommon.getValue() ){
				var tem = me.attrs.getMoneyCommon.getValue() ;
				objData.orderEntity.order = tem.order;
				objData.orderEntity.subOrders = tem.subOrders;
				objData.orderEntity.order.contractNo = me.attrs.options.contractNo;
				objData.orderEntity.order.oriOrderId = me.attrs.orderData.order.oriOrderId;
			}else{
				return ;
			}

			//发票信息校验和取值
			if( me.attrs.invoiceCommon.getInfo() ){
				var temp  = me.attrs.invoiceCommon.getInfo();
				temp.invoice ? objData.orderEntity.invoice =temp.invoice : objData.orderEntity.invoice = null;
				$.extend(true, objData.orderEntity.order, temp.order );
			}else{
				return ;
			}
			
			$.extend(true, me.attrs.allData, objData );
			callback && callback();
		},
		
		//保存
		actionSaveEve:function(){
			var me = this;
			console.log(me.attrs.allData)
			
			me.attrs.allData.orderEntity.order.id = me.attrs.options.id;
			me.getOrderInfo(function(){
				me.$actionSubmit.text('提交中....');
				me.$actionSubmit.attr('disabled','disabled');
				util.api({
					'url':'/odr/balancePayment/update',
					'data':JSON.stringify( me.attrs.allData ),
					'contentType':'application/json;charset=UTF-8 ',
					'button': {
						'el': me.$actionSave,
						'text':'提交中......'
					},
					'success': function( data ){
						if( data.success ){
							util.showTip('提交成功！');
							me.trigger( 'saveSuccess');
							me.hide();
						}
					},
					'complete': function(){
						me.$actionSubmit.text('保存提交');
						me.$actionSubmit.removeAttr('disabled');
					}
				})
				
			});
			
		},
		//保存提交
		actionSubmitEve:function(){
			var me = this;
			me.attrs.allData.orderEntity.order.id = me.attrs.options.id;
			me.getOrderInfo(function(){
				me.$actionSave.text('提交中....');
				me.$actionSave.attr('disabled','disabled');
				util.api({
					'url':'/odr/balancePayment/update',
					'data':JSON.stringify( me.attrs.allData ),
					'contentType':'application/json;charset=UTF-8 ',
					'button': {
						'el': me.$actionSubmit,
						'text':'提交中......'
					},
					'success': function( data ){
						if( data.success ){
							changeNode();
						}
					},
					'complete': function(){
						me.$actionSave.text('保存');
						me.$actionSave.removeAttr('disabled');
					}
				})
				
			});
			 //移交至下一个节点
            function changeNode(){
                util.api({
                    'url':'~/op/api/approval/directapprove',
                    'data':{
                        'processInstanceId': me.attrs.options.processInstanceId,
                        'approved': true,
                        'opinion':''
                    },
                    'success':function( data ){
                        if( data.success ){
                            util.showTip('保存提交发送成功');
							
							me.trigger( 'saveSuccess');
                            me.hide();
                        }
                    }
                })
            };
		},
		//驳回
		actionRejectEve: function(){
            var me = this;

            if( !me.model.get('comment') ){
                util.showToast('请填写意见');
                return;
            }
            var bool = confirm("确认驳回此条审批吗?");
            if( bool ){
				me.$actionAgree.text('提交中....');
				me.$actionAgree.attr('disabled','disabled');
				me.$actionResend.text('提交中....');
				me.$actionResend.attr('disabled','disabled');
                util.api({
                    'url': '~/op/api/approval/directapprove',
                    'data':{
                        'processInstanceId': me.attrs.options.processInstanceId,   //流程实例ID
                        'approved': false,                  //审批结果(通过/拒绝)
                        'opinion': me.model.get('comment')  //审批意见
                    },
					'button': {
						'el': me.$actionReject,
						'text':'提交中......'
					},
                    success: function( data ){
                        console.warn( data );
                        if( data.success ){
                            util.showTip('批复成功');
                            me.hide();
                            me.trigger( 'saveSuccess');
                        }
                    },
					complete: function(){
						me.$actionAgree.text('同意');
						me.$actionAgree.removeAttr('disabled');
						me.$actionResend.text('保存通过');
						me.$actionResend.removeAttr('disabled');
					}
                })
            }
        },

        //同意
		actionAgreeEve: function(){
            var me = this;
			
			var bool = confirm("确认同意此条审批吗?");
			if( bool ){
				 if( me.attrs.options.currentTask == 'finance' && !me.attrs.orderData.order.receivedPayDate){
				   me.setMoneyTime(function(){
						me.replyOptions();
				   });
				}else{
					me.replyOptions();
				}
			}
        },
		//批复审批
		replyOptions:function(){
		 	var me = this;
			
			me.$actionReject.text('提交中....');
			me.$actionReject.attr('disabled','disabled');
			me.$actionResend.text('提交中....');
			me.$actionResend.attr('disabled','disabled');
			util.api({
				'url': '~/op/api/approval/directapprove',
				'data':{
					'processInstanceId': me.attrs.options.processInstanceId,     //流程实例ID
					'approved': true,                     //审批结果(通过/拒绝)
					'opinion': me.model.get('comment')    //审批意见
				},
				'button': {
					'el': me.$actionAgree,
					'text':'提交中......'
				},
				success: function( data ){
					console.warn( data );
					if( data.success ){
						util.showTip('批复成功');
						me.hide();
						me.trigger( 'saveSuccess');
					}
				},
				complete: function(){
					me.$actionReject.text('驳回');
					me.$actionReject.removeAttr('disabled');
					me.$actionResend.text('保存通过');
					me.$actionResend.removeAttr('disabled');
				}
			})
			
		},
		//设置到款时间
		setMoneyTime:function( callback ){
			var me = this;
			if(!me.$moneyTime.val() ){
				util.showToast('请填写到账时间！');
				return false;
			}
			util.api({
				'url': '/odr/setreceivedpaydate',
				'data':{
					'orderId': me.attrs.options.id,   //流程实例ID
					'receivedPayDate':new Date( me.$moneyTime.val()  ).getTime()          //审批结果(通过/拒绝)
				},
				success: function( data ){
					console.warn( data );
					if( data.success ){
						callback && callback();
					}
				}
			})
		},
		//重新发送
		hide: function(){
			var me = this;
			me.remove();
			DetailApproval.__super__.hide.apply( this,arguments );
		}
	});
        
	module.exports = DetailApproval;
});
