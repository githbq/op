/**
 *
 * 我的审批列表
 *
 */
define( function(require, exports, module){

	
	var OpenApprovalList = require('module/openapprovallist/openapprovallist');
	var DetailBind = require('module/detailbind/detailbind');
	var DetailApproval = require('../../order/detailapproval/detailapproval');

	exports.init = function(){
		var $el = exports.$el;
		
		var approvalList = new OpenApprovalList( { 'wrapper':$el,'limits':true  } );  	//
		approvalList.render();
		

		var detailBind = new DetailBind();

		var detailApproval;

		approvalList.on('detail',function( detail, state ){
			console.log( detail )

			detailApproval = new DetailApproval();
			var data = {
				'id' : detail.orderId || '',
                'enterpriseId': detail.enterpriseId || '', 
                'editFlag': detail.canEdit || '',
                'orderType': detail.orderType || '',
                'opinion': detail.lastAssigneeOpinion || '',
                'isTp': detail.isTp || '',
                'state': state || '',
                'ea': detail.enterpriseAccount || '',
                'currentTask': detail.currentTash || '',
                'processInstanceId': detail.processInstanceId || ''
			}
			detailApproval.show( data );
			detailApproval.on('saveSuccess',function(){
				approvalList.getList();
			})
		});
		approvalList.on('detailBind',function( id , eid , type , state,isCanEdit ){

			detailBind.showInfo( id , eid , type , state,isCanEdit );
		});
		
		/*
		openApproval.on('success',function(){
			approvalList.searchEve();
		});
		*/

		detailBind.on('success',function(){
			approvalList.searchEve();
		});

	}
});
