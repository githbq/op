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
            me.areaTree = new AreaTree();
            me.areaTree.on('selectarea',function( treenodes ){
                
                me.$filingRegion.val( treenodes[0]['name'] ).attr('data-code', treenodes[0]['code'] );
            });

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
			//me.attrs.options.isTp = 0;
			//me.attrs.options.editFlag=true;
			me.attrs.orderList = {};
			me.attrs.enterpriseData = {};
			me.attrs.allData = {'orderEntity':{},'contract':{},'enterpriseExtend':{},'enterprise':{}};
			me.$('.enterpriseAccount').attr('disable','disable');
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
						me.attrs.basicCommon = new BasicInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.enterpriseData.enterprise,
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
					$.when( me.getOrderDetail(), me.getEnterpriseInfo(), me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData.order,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});

					break;
				case 6:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo(),me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData.order,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();
						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});

					break;
				case 7:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo(),me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData.order,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});

					break;
				case 8:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo(),me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData.order,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});

					break;
				case 9:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo(),me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData.order,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});

					break;
				case 10:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo(),me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData.order,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});

					break;
				case 11:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo(),me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData.order,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});


					break;
				case 12:
					me._setTitle( orderTypeAry[me.attrs.options.orderType] );
					$.when( me.getOrderDetail(), me.getEnterpriseInfo(),me.setOrderList()).done(function(){
						//备注信息
						me.attrs.explainCommon = new Explain( { 'wrapper':me.$view.find('.common--explain'),'data':me.attrs.orderData.order,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

						//setOrderInfo--订单信息
						me.setOrderInfo();

						//基本信息
						me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
							'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					});


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
						$.extend(true, me.attrs.allData, me.attrs.enterpriseData );
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

						me.attrs.allData.orderEntity = me.attrs.orderData;
						//$.extend(true, me.attrs.allData, me.attrs.orderData );
						//callback && callback();
					}
				}
			})

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
		//设置订单基本信息
		 setOrderInfo:function(){
			 var  me = this;
			var productData = me.attrs.orderData;
			 productData.enterpriseExtend = me.attrs.enterpriseData.enterpriseExtend ? me.attrs.enterpriseData.enterpriseExtend:null;
			 var tempOrderType = parseInt(me.attrs.options.orderType);
			 switch( tempOrderType )
			{
				case 13:
					tempOrderType = 1;
					break;
				case 14:
					tempOrderType = 2;
					break;
				case 15:
					tempOrderType = 3;
					break;
				case 16:
					tempOrderType = 4;
					break;
				default:
			}
	
			 productData.contract = me.attrs.enterpriseData.contract ? me.attrs.enterpriseData.contract : null ;
			 me.attrs.prodeuctObj =  productinfo.showProductInfo( {terminalInfo:{$view:me.$view.find('.common-terminalinfo')},
					 tableInfo:{$view:me.$view.find('.common-tableinfo')},
					 formInfo:{$view:me.$view.find('.common-forminfo')}}
				 ,tempOrderType ,{'enterpriseId':me.attrs.options.enterpriseId,'readonly': !me.attrs.options.editFlag,'data':productData } );

			 //发票信息
			 me.attrs.invoiceCommon = new InvoiceInfo( { 'wrapper':me.$view.find('.common--invioce'),'data':me.attrs.orderData,
				 'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );

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
			//判断审批意见
			var opinion = me.attrs.options.opinion ? me.attrs.options.opinion :'暂无';
			me.$('.last-options').text(opinion);

		},
		//获取全部订单数据
		getOrderInfo:function( callback ){

			var me = this,objData  = { 'orderEntity':{}};

			

			//获取普通订单信息
			//基本信息校验和取值
			if( me.attrs.basicCommon.getValue() ){
				//objData.enterprise = me.attrs.basicCommon.getValue();
				var tem ={'enterprise': me.attrs.basicCommon.getValue()} ;
				tem.enterprise && $.extend(true, objData, tem  );
			}else{
				return ;
			}

			//产品信息
			if(me.attrs.prodeuctObj.validate()){
				var temp = me.attrs.prodeuctObj.getData();
				objData.enterpriseExtend = temp.enterpriseExtend ;
				objData.contract = temp.contract;
				objData.orderEntity.order = temp.order
				objData.orderEntity.subOrders = temp.subOrders;
				if(temp.subOrders.length<1){
					util.showToast('请至少选择一款子产品！');
					return false;
				}
			}else{
				util.showToast('产品信息填写不完整！');
				return false;
			}

			//检测自订单是否小于7折
			if(me.attrs.options.isTp == '0'){
				if(!me.checkDiscount(temp.subOrders)){
					util.showToast('子产品折扣低于8折，必须申请特批');
					return false;
				}
			}
			//发票信息校验和取值
			if( me.attrs.invoiceCommon.getInfo() ){
				var temp  = me.attrs.invoiceCommon.getInfo();
				temp.invoice ? objData.orderEntity.invoice =temp.invoice : objData.orderEntity.invoice = null;
				$.extend(true, objData.orderEntity.order, temp.order );
			}else{
				return ;
			}

			if(me.attrs.options.isTp == '1'){
				//获取特批地址
				if( me.attrs.explainCommon.getValue() ){
					var temp  = me.attrs.explainCommon.getValue();
					objData.orderEntity.order['approvedUrl'] = temp.approvedUrl;
				}else{
					return ;
				}
			}

			//综合折扣
			me.getDiscount( objData.orderEntity.subOrders ,objData.orderEntity.order.amount , function(  ){
				var discoutFlag = true;

				me.attrs.invoiceCommon.setDiscount( me.attrs.complexDiscount );
				objData.orderEntity.order['discount'] = me.attrs.complexDiscount ;
				objData.contract['discount'] = me.attrs.complexDiscount ;
				objData.enterpriseExtend['enterpriseId'] = me.attrs.options.enterpriseId;
				if(objData.orderEntity.invoice && objData.orderEntity.invoice['businessLicense']){
					objData.enterpriseExtend['businessLicense'] = objData.orderEntity.invoice['businessLicense'] ;
					objData.enterpriseExtend['businessLicenseFileName'] = objData.orderEntity.invoice['businessLicenseFileName'];
				}
				$.extend(true, me.attrs.allData, objData );
				
				//调用回调
				callback && callback();

			});
		},
		//检测自订单折扣是否大于8折
		checkDiscount:function( data ){
			var me = this;
			var discoutFlag = true;

			switch( me.attrs.options.orderType ){
				case 1:case 2:case 3:case 4:case 13:case 14:case 15:case 16:
					_.map( data , function( obj ){
						if(obj.subOrder.productId ==1 || obj.subOrder.productId ==4  || obj.subOrder.productId ==5 ){
							if( obj.subOrder.discount  &&  obj.subOrder.discount<8){
								discoutFlag = false;
								//util.showToast('子产品折扣低于8折，必须申请特批');
								//return false;
							}
						}
					});
					break;
				default:
					_.map( data , function( obj ){
						if(obj.subOrder.productId ==1 || obj.subOrder.productId ==4  || obj.subOrder.productId ==7  || obj.subOrder.productId ==5 ){
							if( obj.subOrder.discount  &&  obj.subOrder.discount<8){
								discoutFlag = false;
							}
						}
					});
			}

			if( !discoutFlag ){

				return false;
			}
			return true;
		},
		//获取综合折扣
		getDiscount:function( data ,account ,callback){
			var me = this;

			var tempObj = {
				'productJson':JSON.stringify(data),
				'contractAmount':account,
				'orderType':me.attrs.options.orderType
			}
			/**
			 * 计算订单总折扣
			 * @param request
			 * @param resp
			 * @param serviceFee 培训服务费
			 * @param productJson 产品信息集合json串
			 * @param contractAmount 合同总金额
			 * @return
			 */
			util.api({
				'url':'~/op/api/rebate/calculateSum',
				'data':tempObj,
				'success': function( data ){

					if( data.success ){
						me.attrs.complexDiscount = data.value.model;
						callback && callback( data.value.model );
					}
				},
			})
		},
		//保存
		actionSaveEve:function(){
			var me = this;
			console.log(me.attrs.allData)
			//var tempData = {'orderId':me.attrs.options.id,'orderVO':me.attrs.allData};
			me.attrs.allData.orderEntity.order.id = me.attrs.options.id;
			me.getOrderInfo(function(){
				util.api({
					'url':'/odr/updateOrderVO',
					'data':JSON.stringify( me.attrs.allData ),
					'contentType':'application/json;charset=UTF-8 ',
					'success': function( data ){
						if( data.success ){
							util.showTip('提交成功！');
							me.trigger( 'saveSuccess');
							me.hide();
						}
					}
				})
				
			});
			
		},
		//保存提交
		actionSubmitEve:function(){
			var me = this;
			me.attrs.allData.orderEntity.order.id = me.attrs.options.id;
			me.getOrderInfo(function(){
				util.api({
					'url':'/odr/updateOrderVO',
					'data':JSON.stringify( me.attrs.allData ),
					'contentType':'application/json;charset=UTF-8 ',
					'success': function( data ){
						if( data.success ){
							changeNode();
						}
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

            if( me.attrs.options.currentTask == 'finance' ){
               me.setMoneyTime(function(){
					me.replyOptions();
			   });
            }else{
				me.replyOptions();
			}

        },
		//批复审批
		replyOptions:function(){
		 	var me = this;
			var bool = confirm("确认同意此条审批吗?");
			if( bool ){
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
			}
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