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

	var contentStr = require('./detailapproval.html');
	var BasicInfo = require('../widget/basicinfo/basicinfo');
	var Explain = require('../widget/explain/explain');
	var OrderInfo = require('../widget/orderinfo/orderinfo');
	var InvoiceInfo = require('../widget/invoice/invoice');
	var productinfo = require('../widget/productinfo/productinfo');

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
			'width': 1300
		},

		elements: {
		
		},

		events:{
			
		},

		
		init: function(){
			DetailApproval.__super__.init.apply( this,arguments );
			var me = this;
			
			//选择区域模块

            me.areaTree = new AreaTree();
            me.areaTree.on('selectarea',function( treenodes ){
                
                me.$filingRegion.val( treenodes[0]['name'] ).attr('data-code', treenodes[0]['code'] );
            });

		},

		//设置状态
		setState: function(){
			var me = this;

			me.$('.state').hide();
			

			if( me.attrs.canCancel == 'true' ){
				me.$('.state-cancel').show()
				me.$statusDisabled.attr('disabled','disabled');
			}
			if( me.attrs.canCancel == 'false' ){
				me.$statusDisabled.attr('disabled','disabled');
			}
			if( me.attrs.isCurrentTask  == 'true' ){
				me.$('.state-current').show();
				me.$statusDisabled.removeAttr('disabled');
				
				
				//me.$lookCard.hide()
				me.$upCard.show();
				me.$upCardAdd.hide();
			}else if( me.attrs.isCurrentTask  == 'true' && me.attrs.type  == 'addPurchaseApproval' ){
				me.$statusDisabled.attr('disabled','disabled');
				me.$statusDisabledAdd.removeAttr('disabled');
				me.$('.state-current').show();
				me.$upCardAdd.show();
				me.$upCard.hide();
			}else{
				me.$statusDisabled.attr('disabled','disabled');
		
				me.$statusDisabledAdd.attr('disabled','disabled');
			}
			if( me.attrs.isCurrentTask  == 'true'){
				me.$refuseDisabled.removeAttr('disabled');
				
			}
			me.setType();
		},
		//根据申请类型不同显示不同的信息
		setType: function(){
			var me = this;

		},

		/**
		 *
		 *撤销审批
		 */
		 //选择区域
        regionEve: function(){
            var me = this;
            me.areaTree.show();
        },

		backoutEve: function(){
			var me = this;

			me.$actionResend.text('提交中....');
			me.$actionResend.attr('disabled','disabled');
			me.$actionSave.text('提交中....');
			me.$actionSave.attr('disabled','disabled');
			me.$actionBackout.text('提交中....');
			me.$actionBackout.attr('disabled','disabled');
			util.api({
				'url': '~/op/api/approval/withdrawapproval',
				'data':{
					'processInstanceId': me.attrs.id
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						util.showTip('撤销成功');
						me.trigger( 'saveSuccess');
						me.$statusDisabled.removeAttr('disabled');
						me.attrs.canCancel = 'false';
						me.attrs.isCurrentTask = 'true';
						me.setState();
					}
				},
				'complete': function(){
					me.$actionResend.text('保存提交');
					me.$actionResend.removeAttr('disabled');
					me.$actionSave.text('保存');
					me.$actionSave.removeAttr('disabled');
					me.$actionBackout.text('撤销审批');
					me.$actionBackout.removeAttr('disabled');
				}
			})
		},

		/**
		 *
		 *保存提交
		 */
		resendEve:function(){
			var me = this;
			
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
			me.setState();
			me.sortType();
			
			DetailApproval.__super__.show.apply( this,arguments );
		},
		//根据定单类型区分设置
		sortType:function(){
			var me = this;
			me.attrs.options.orderType = parseInt(me.attrs.options.orderType)
			switch( me.attrs.options.orderType )
			{
				case 1: case 13:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new BasicInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.enterpriseData.enterprise,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});

					break;
				case 2: case 14:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new BasicInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.enterpriseData.enterprise,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});

					break;
				case 3:case 15:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
						//基本信息
						me.attrs.basicCommon = new BasicInfo( { 'wrapper':me.$view.find('.common--basic'),'data':{},
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});


					break;
				case 4:case 16:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){

						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
						//基本信息
						me.attrs.basicCommon = new BasicInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.enterpriseData.enterprise,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});

					break;
				case 5:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
					});
					//基本信息
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':{},
						'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );


					break;
				case 6:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
					});
					//基本信息
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':{},
						'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );


					break;
				case 7:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
					});
					//基本信息
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':{},
						'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

					break;
				case 8:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
					});
					//基本信息
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':{},
						'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );


					break;
				case 9:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
					});
					//基本信息
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':{},
						'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );


					break;
				case 10:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
					});
					//基本信息
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':{},
						'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );


					break;
				case 11:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
					});
					//基本信息
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':{},
						'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

					break;
				case 12:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
					});
					//基本信息
					me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':{},
						'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

					break;
				default:
			}

		},
		//获取企业基本信息
		getEnterpriseInfo:function(  ){
			var me = this;

			return  util.api({
				'url':'~/op/api/order/enterprise/getEnterpriseInfo',
				'data':{
					'enterpriseId':me.attrs.options.enterpriseId,
					'orderType':me.attrs.options.orderType
				},
				'success': function( data ){
					if( data.success ){
						me.attrs.enterpriseData = data.value.model;
						//callback && callback();
					}
				}
			})
		},
		//获取订单详情
		getOrderDetail:function( ){
			var me = this;

			return  util.api({
				'url':'/odr/getOrderDetail',
				'data':{'orderId':me.attrs.options.id},
				'success': function( data ){
					if( data.success ){
						me.attrs.orderData = data.value.model;
						//callback && callback();
					}
				}
			})

		},
		//设置订单基本信息
		 setOrderInfo:function(){
			 var  me = this;
			var productData = me.attrs.orderData;
			 productData.enterpriseExtend = me.attrs.enterpriseData.enterpriseExtend;
			 productData.contract = me.attrs.enterpriseData.contract ? me.attrs.enterpriseData.contract : null ;
			 me.attrs.prodeuctObj =  productinfo.showProductInfo( {terminalInfo:{$view:me.$view.find('.common-terminalinfo')},
					 tableInfo:{$view:me.$view.find('.common-tableinfo')},
					 formInfo:{$view:me.$view.find('.common-forminfo')}}
				 ,me.attrs.options.orderType,{'enterpriseId':me.attrs.options.enterpriseId,'readonly': !me.attrs.options.editFlag,'data':productData } );

			 //发票信息
			 me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common--invioce'),'data':me.attrs.orderData,
				 'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
		 },

		//判断审批类型
		judgeType:function(){
			
			var me = this;
		},
		//判断是否可以编辑状态：
		checkEdit:function(){
			
		},
		//设置自己部分的显示和隐藏：
		setState:function(){
			var me = this;
			me.$('.state').hide();
			me.$('.state-'+me.attrs.options.state).show()
		},

		//驳回
        rejectEve: function(){
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
                        'processInstanceId': me.attrs.processInstanceId,   //流程实例ID
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
                            me.trigger('success');
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
        agreeEve: function(){
            var me = this;

            if( !me.model.get('comment') ){
               // util.showToast('请填写意见');
                //return;
            }
            var bool = confirm("确认同意此条审批吗?");
            if( bool ){
				me.$actionReject.text('提交中....');
				me.$actionReject.attr('disabled','disabled');
				me.$actionResend.text('提交中....');
				me.$actionResend.attr('disabled','disabled');
                util.api({
                    'url': '~/op/api/approval/directapprove',
                    'data':{
                        'processInstanceId': me.attrs.processInstanceId,     //流程实例ID
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
                            me.trigger('success');
                        }
                    },
					complete: function(){
						me.$actionReject.text('驳回');
						me.$actionReject.removeAttr('disabled');
						me.$actionResend.text('保存通过');
						me.$actionResend.removeAttr('disabled');
					}
                })
            }
        },
		
		//重新发送
		hide: function(){
			var me = this;
			this.remove();
			DetailApproval.__super__.hide.apply( this,arguments );
		}
	});
        
	module.exports = DetailApproval;
});
