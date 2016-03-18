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

	exports.init = function(){
		var $el = exports.$el;
		
		var approvalList = new OpenApprovalList( { 'wrapper':$el,'limits':true } );  	//
		approvalList.render();


		var detailApproval,
            detailPayment;

		approvalList.on('detail',function( detail , state ){
			console.log( detail )
			
            var data = {
                'id' : detail.orderId || '',
                'enterpriseId': detail.enterpriseId || '', 
                'editFlag': detail.canEdit,
                'orderType': detail.orderType || '',
                'opinion': detail.lastAssigneeOpinion || '',
                'isTp': detail.isTp || '',
                'state': state || '',
                'ea': detail.enterpriseAccount || '',
                'currentTask': detail.currentTask || '',
                'processInstanceId': detail.processInstanceId || '',
                'contractNo': detail.contractNo
            };
            
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
