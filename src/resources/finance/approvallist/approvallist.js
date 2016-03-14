/**
 *
 * 我的审批列表
 *
 */
define( function(require, exports, module){
	var IBSS = window.IBSS,
		TPL = IBSS.tpl;
	
	var DetailApproval = require('../../order/detailApproval/detailApproval');
	var OpenApprovalList = require('module/openapprovallist/openapprovallist');
	var DetailBind = require('module/detailbind/detailbind');

	exports.init = function(){
		var $el = exports.$el;
		
		var approvalList = new OpenApprovalList( { 'wrapper':$el } );  	//
		approvalList.render();

		var detailApproval;
		approvalList.on('detail',function( detail , state ){
			
			detailApproval = new DetailApproval();
            var data = {
                'id' : detail.orderId || '',
                'enterpriseId': detail.enterpriseId || '', 
                'editFlag': detail.canEdit,
                'orderType': detail.orderType || '',
                'opinion': detail.opinion || '',
                'isTp': detail.isTp || '',
                'state': state || '',
                'ea': detail.enterpriseAccount || '',
                'currentTask': detail.currentTask || '',
                'processInstanceId': detail.processInstanceId || ''
            }
            detailApproval.show( data );
            detailApproval.on('saveSuccess',function(){
                approvalList.getList();
            });
		});
	}
});
