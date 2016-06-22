//
// 退款slider
/////////////////////////////
define( function(require, exports, module){

	var IBSS = window.IBSS,
        TPL = IBSS.tpl;
		
	var Slider = require('common/widget/slider/slider');
	var AreaTree = require('module/areatree/areatree');

	var contentStr = require('./backmoney.html');
	var OrderInfo = require('../widget/orderinfo/orderinfo');
	var CotractMoney = require('../widget/cotractmoney/cotractmoney');
	var refundinfo = require('../widget/refundinfo/refundinfo');
	var InvoiceList = require('../widget/invoicelist/invoicelist');
	
	var orderTypeAry = ['','办公版新购-普通','办公版新购-特批','营销版新购-普通','营销版新购-特批','办公版增购-普通',
		'办公版增购-特批','营销版增购-普通','营销版增购-特批','办公版续费-普通','办公版续费-特批',
		'营销版续费-普通','营销版续费-特批','关联自注册办公版-普通','关联自注册办公版-特批',
		'关联自注册营销版-普通','关联自注册营销版-特批','收尾款'
	];

    /////////////////
    //
    // 退款详情
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
			'click .action-reject':'actionRejectEve',
			'click .common-add':'commonAddEve',
			'click .action-cancel':'actionCancelEve'
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
			me.attrs.invioceAry = [];
			me.attrs.invioceIdAry = [];
			me.attrs.orderInfoValue = {};
			
			me.setState();
			me.sortType();
			
			DetailApproval.__super__.show.call( this,true );
		},
		//根据定单类型区分设置
		sortType:function(){
			var me = this;
			me.attrs.options.orderType = parseInt(me.attrs.options.orderType)
	
			$.when(  me.setOrderList(), me.getOrderBackMoneyInfo() ).then( function(result1,result2){

				return  me.getInvoiceList()
				
			} ).done(function(){

				me.setOrderInfo();
				
				if(me.attrs.invoiceData.length>0){
					me.showInvoiceList()

				}
				
				//企业信息
				me.attrs.basicCommon = new OrderInfo( { 'wrapper':me.$view.find('.common--basic'),'data':me.attrs.orderList,
					'editFlag':me.attrs.options.editFlag,'type':me.attrs.options.orderType} );
					
				//合同付款信息
				me.attrs.refundVO.readonly = !me.attrs.options.editFlag;
				me.attrs.cotractMoney = new CotractMoney( { 'wrapper':me.$view.find('.common-product'),'orderId':me.attrs.options.id,'hasInovice':me.attrs.hasInovice, 'editFlag':me.attrs.options.editFlag} );
				if(me.attrs.options.newFirst =='newFirst'){
					me.attrs.cotractMoney.on('successData',function(){
						me.attrs.refundVO = me.attrs.cotractMoney.getVauel();
						//退款信息
						
						me.attrs.refundinfo =  refundinfo.show( {$view:me.$view.find('.common--meoney')}, me.attrs.refundVO ); 
					})
					
				}else{
					//退款信息
					me.attrs.refundinfo =  refundinfo.show( {$view:me.$view.find('.common--meoney')}, me.attrs.refundVO ); 
				}
				
				
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
		//查询订单退款
		getOrderBackMoneyInfo:function(   ){
			var me = this;

			return util.api({
					'url':'/odr/refund/queryinfo',
					'data':{'orderId':me.attrs.options.id },
					'success': function( data ){

						if( data.success ){

							me.attrs.orderInfoValue = data.value;
							me.attrs.refundVO = data.value.model ?  data.value.model:{'refund':{},'subRefunds':[]};
							me.setOptions();
						}
					}
			});

		},
		//获取发票列表：
		getInvoiceList:function( callback  ){
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
			me.attrs.invioceAry = [];
			for(var i = 0; i<tempLength; i++){
				if( me.attrs.orderInfoValue.model && (me.attrs.invoiceData[i].invoiceStatus == 1 || me.attrs.invoiceData[i].invoiceStatus == 2 )){
					me.attrs.hasInovice = 1;
					for(var j = 0; j< me.attrs.orderInfoValue.model.refundInvoices.length; j++ ){
						if( (me.attrs.invoiceData[i].id ==  me.attrs.orderInfoValue.model.refundInvoices[j].invoiceId )  ){
							var tempClass = "invoice_"+i;
							me.$view.find('.common--invioce').append('<div class="'+tempClass+'"></div>');
							var temp = {} ;
							temp.filedData = me.attrs.orderInfoValue.model.refundInvoices[j];
							temp[me.attrs.invoiceData[i].id] = new InvoiceList( { 'wrapper':me.$view.find('.'+tempClass+''),'dataObj':me.attrs.invoiceData[i] ,'filedData':me.attrs.orderInfoValue.model.refundInvoices[j],'id':me.attrs.invoiceData[i].id,'editFlag':me.attrs.options.editFlag } );
							me.attrs.invioceAry.push( temp );
							me.attrs.invioceIdAry.push(me.attrs.invoiceData[i].id)
							break;
						}
					}
					
				}else if( me.attrs.invoiceData[i].invoiceStatus == 1 ||  me.attrs.invoiceData[i].invoiceStatus == 2 ){
					me.attrs.hasInovice = 1;
					var tempClass = "invoice_"+i;
					me.$view.find('.common--invioce').append('<div class="'+tempClass+'"></div>');
					var temp = {} 
					temp[me.attrs.invoiceData[i].id] = new InvoiceList( { 'wrapper':me.$view.find('.'+tempClass+''),'dataObj':me.attrs.invoiceData[i] ,'id':me.attrs.invoiceData[i].id,'editFlag':me.attrs.options.editFlag } );
					me.attrs.invioceAry.push( temp );
					me.attrs.invioceIdAry.push( me.attrs.invoiceData[i].id )
				}
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
			me.$('.state-'+me.attrs.options.newFirst).show();
			if(me.attrs.options.editFlag && me.attrs.options.newFirst!='newFirst'){
				me.$('.state-refuse').show();
			}
			me.$('.currentTask-'+me.attrs.options.currentTask).show();
			me.$('.order-id').html( me.attrs.options.id );
		
			
		},
		//设置审批意见
		setOptions:function(){
			var me = this,
				strDom = '';
			
			var opinionObj = {'support':'小助手开通','support2':'小助手确认','finance':'数据中心','sup':'小助手'};
			var personStr = "support,support2,finance,sup";
			 
			var optionsList = me.attrs.refundVO.refund.approvalInfo ? me.attrs.refundVO.refund.approvalInfo.split('<+>'): [];



			for(var i = 0; i<optionsList.length; i++){
				var tempAry = optionsList[i].split('<->');

				if( tempAry.length == 5 ){
	            	if( personStr.indexOf(tempAry[1]) > -1 ){
	            		tempAry[1] = opinionObj[tempAry[1]];
	            	}
	            	tempAry[1] = tempAry[1] + '-' + tempAry[0];
	            	tempAry = tempAry.slice(1);
	            }else{
	            	if(personStr.indexOf(tempAry[0]) > -1) {
	                	tempAry[0] = opinionObj[tempAry[0]];
	            	}
	            }

	            
				tempAry[2] = (tempAry[2]=='true') ? '同意':'驳回';
				strDom+='<tr><td>'+ tempAry[0] + '</td><td>'+tempAry[1]+'</td><td>'+tempAry[2]+'</td><td>'+tempAry[3]+'</td></tr>'

			}
			
			//判断审批意见

			var opinion = strDom ? strDom :'<tr><td colspan="4" style="text-align: center;">暂无</td></tr>';
			me.$('.last-options').html( opinion );
		
			
			//设置到款时间 receivedPayDate
			var receivedPayDate = (me.attrs.refundVO && me.attrs.refundVO.refund && me.attrs.refundVO.refund.refundTime ) ? new Date( me.attrs.refundVO.refund.refundTime  )._format("yyyy-MM-dd"):'';
			if(receivedPayDate){
				me.$('.receivedPayDate').show();
				me.$('.receivedPayDate-text').text(receivedPayDate);
				me.$('.currentTask-finance').hide();
			}

		},

		//循环获取发票信息：
		getInvioceValue:function( callback ){
			var me = this , objData = {};
			me.attrs.refundInvoices = [];
			var tempLength =  me.attrs.invioceAry.length;
			for(var i =0; i<tempLength; i++ ){
				var invoiceId = me.attrs.invioceIdAry[i];
				var tempValue = me.attrs.invioceAry[i][invoiceId].getValue();
				if(!tempValue){
					util.showToast('发票信息不完整！');
					return false;
				
				}
				if( me.attrs.orderInfoValue.model ){
					
					tempValue = $.extend(true, me.attrs.invioceAry[i].filedData, tempValue);
					me.attrs.refundInvoices.push( tempValue );
				}else{
					me.attrs.refundInvoices.push( tempValue );
				}
			}
			
			//产品信息
			if (me.attrs.refundinfo.validate()){
				objData =  me.attrs.refundinfo.getData();
				objData.refund.orderId = me.attrs.options.id;
				me.attrs.refundVO.refund = $.extend(true, me.attrs.refundVO.refund, objData.refund);
				if(!me.attrs.options.newFirst){
					for(var i = 0; i< me.attrs.refundVO.subRefunds.length; i++){
						for(var j = 0; j<objData.subRefunds.length; j++){
							if(me.attrs.refundVO.subRefunds[i].productId == objData.subRefunds[j].productId ){
								me.attrs.refundVO.subRefunds[i] = $.extend(true, me.attrs.refundVO.subRefunds[i],objData.subRefunds[j]);
								break;
							}
						}
					}
				}else{
					me.attrs.refundVO.subRefunds = objData.subRefunds;
				}
				
			}else{
				util.showToast('退款信息填写不完整！');
				return false;
			}
			me.attrs.refundVO.refundInvoices = me.attrs.refundInvoices;
			callback && callback();
		},
		//提交
		commonAddEve:function(){
			var me = this;
			
			me.getInvioceValue( function(){ 
				
				me.$('.common-add').text('提交中....');
				me.$('.common-add').attr('disabled','disabled');
				util.api({
					'url':'/odr/refund/save',
					'data':JSON.stringify( me.attrs.refundVO ),
					'contentType':'application/json;charset=UTF-8 ',
					'success': function( data ){

						if( data.success ){
							util.showTip('提交成功！');
							me.trigger( 'saveSuccess');
							me.hide();
							
						}
					},
					'complete': function(){
						me.$('.common-add').text('提交');
						me.$('.common-add').removeAttr('disabled');
					}
				});
			});
			
		},
		//取消
		actionCancelEve:function(){
			var me = this;
			me.hide();
		},
		//保存
		actionSaveEve:function(){
			var me = this;
			console.log(me.attrs.allData)
			
			me.getInvioceValue( function(){ 
				var tempUrl = me.attrs.options.newFirst ? '/odr/refund/save':'/odr/refund/update';
				
				me.$('.common-add').text('提交中....');
				me.$('.common-add').attr('disabled','disabled');
				util.api({
					'url':tempUrl,
					'data':JSON.stringify( me.attrs.refundVO ),
					'contentType':'application/json;charset=UTF-8 ',
					'success': function( data ){

						if( data.success ){

							util.showTip('提交成功！');
							me.trigger( 'saveSuccess');
							me.hide();
			
						}
					},
					'complete': function(){
						me.$('.common-add').text('提交');
						me.$('.common-add').removeAttr('disabled');
					}
				});
			});
			
		},
		//保存提交
		actionSubmitEve:function(){
			var me = this;

			
			me.getInvioceValue( function(){ 
				var tempUrl = me.attrs.options.newFirst ? '/odr/refund/save':'/odr/refund/update';
				me.$('.common-add').text('提交中....');
				me.$('.common-add').attr('disabled','disabled');
				util.api({
					'url':tempUrl,
					'data':JSON.stringify( me.attrs.refundVO ),
					'contentType':'application/json;charset=UTF-8 ',
					'success': function( data ){

						if( data.success ){

							changeNode();
						}
					},
					'complete': function(){
						me.$('.common-add').text('提交');
						me.$('.common-add').removeAttr('disabled');
					}
				});
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
                            util.showTip('提交成功！');
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
				 if( me.attrs.options.currentTask == 'finance' ){
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
				util.showToast('请填写退款时间！');
				return false;
			}
			util.api({
				'url': '/odr/refund/setrefundtime',
				'data':{
					'refundId': me.attrs.refundVO.refund.id,   //退款id
					'refundTime':new Date( me.$moneyTime.val()  ).getTime()          //退款时间
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
