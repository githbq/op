/**
 *
 * 我的审批列表
 *
 */
define( function(require, exports, module){
	var IBSS = window.IBSS;
	
	var DetailApproval = require('../../order/detailapproval/detailapproval');
	var OpenApprovalList = require('module/openapprovallist/openapprovallist');
    var DetailPayment = require('../../order/detailpayment/detailpayment');
	var BackMoney = require('../../order/backmoney/backmoney');

	exports.init = function(){
		var $el = exports.$el;
		
		var approvalList = new OpenApprovalList( { 'wrapper':$el } );  	//
		approvalList.render();


		var detailApproval,
            detailPayment;

		approvalList.on('detail',function( detail , state ){
			console.log( detail )
			
            var data = {
                'id' : detail.orderId,
                'enterpriseId': detail.enterpriseId, 
                'editFlag': false,//detail.canEdit,
                'orderType': detail.orderType,
                'opinion': detail.lastAssigneeOpinion,
                'isTp': detail.isTp,
                'state': state,
                'ea': detail.enterpriseAccount,
                'currentTask': detail.currentTask,
                'processInstanceId': detail.processInstanceId,
                'contractNo': detail.contractNo
            };
            if( detail.approvalTypeId =='refundApproval' ){
				detailApproval = new BackMoney();
                detailApproval.show( data );
                detailApproval.on('saveSuccess',function(){
                    approvalList.getList();
                })
				return false;
			}
            if( data.orderType != 17 ){

                detailApproval = new DetailApproval();
                detailApproval.show( data );
                detailApproval.on('saveSuccess',function(){
                    approvalList.getList();
                });
            } else {

                detailPayment = new DetailPayment();
                detailPayment.show( data );
                detailPayment.on('saveSuccess',function(){
                    approvalList.getList();
                });
            }
		});
	}
});
