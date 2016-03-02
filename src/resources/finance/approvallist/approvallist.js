/**
 *
 * 我的审批列表
 *
 */
define( function(require, exports, module){

	var Pagination = require('common/widget/pagination/pagination');
	var OpenApproval = require('module/openapproval/openapproval');
	var OpenApprovalList = require('module/openapprovallist/openapprovallist');
	var DetailBind = require('module/detailbind/detailbind');
	var DetailPay = require('module/detailpay/detailpay');

	exports.init = function(){
		var $el = exports.$el;
		
		var approvalList = new OpenApprovalList( { 'wrapper':$el } );  	//
		var openApproval = new OpenApproval();                 							//审批详情
		var detailBind = new DetailBind();
		var detailPay = null;
		
		approvalList.render();

		approvalList.on('detail',function( id , eid , type , state,isCanEdit ){
			openApproval.show( id , eid , type , state,isCanEdit);
		});
		approvalList.on('detailBind',function( id , eid , type , state,isCanEdit ){

			detailBind.showInfo( id , eid , type , state,isCanEdit );
		});
		
		approvalList.on('detailPay',function( id , eid , type , state,isCanEdit ){
			detailPay = new DetailPay();
			detailPay.on('success',function(){
				approvalList.searchEve();
			});
			detailPay.showInfo( id , eid , type , state,isCanEdit );
		});
		
		openApproval.on('success',function(){
			approvalList.searchEve();
		});
		detailBind.on('success',function(){
			approvalList.searchEve();
		});

	}
});
