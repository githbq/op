/**
 *
 * 我的审批列表
 *
 */
define( function(require, exports, module){

	var Pagination = require('common/widget/pagination/pagination');
	var OpenApprovalList = require('module/openapprovallist/openapprovallist');
	var DetailApproval = require('../../order/detailapproval/detailapproval');
	var DetailBind = require('module/detailbind/detailbind');

	exports.init = function(){
		var $el = exports.$el;
		
		var approvalList = new OpenApprovalList( { 'wrapper':$el} );  	//
		approvalList.render();

		var detailBind = new DetailBind();

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

		/*
		approvalList.on('detailBind',function( id , eid , type , state,isCanEdit ){

			detailBind.showInfo( id , eid , type , state,isCanEdit );
		});
		detailBind.on('success',function(){
			approvalList.searchEve();
		});
		*/
	}
});
