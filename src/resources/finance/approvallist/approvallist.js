/**
 *
 * 我的审批列表
 *
 */
define( function(require, exports, module){

	var Pagination = require('common/widget/pagination/pagination');
	var OpenApproval = require('module/openapproval/openapproval');
	var OpenApprovalList = require('module/openapprovallist/openapprovallist');

	exports.init = function(){
		var $el = exports.$el;
		
		var approvalList = new OpenApprovalList( { 'wrapper':$el } );  	//
		var openApproval = new OpenApproval();                 							//审批详情

		approvalList.render();

		approvalList.on('detail',function( id , eid , type , state ){

			openApproval.show( id , eid , type , state );
		});
		
		openApproval.on('success',function(){
			approvalList.searchEve();
		});

	}
});
