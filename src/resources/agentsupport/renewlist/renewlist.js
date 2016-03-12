define( function( require, exports, module ) {
      var IBSS = window.IBSS,
        TPL = IBSS.tpl;

	
    var OpenApprovalList = require('module/openapprovallist/openapprovallist');
    var DetailBind = require('module/detailbind/detailbind');
    var DetailApproval = require('../../order/detailapproval/detailapproval');
 
    exports.init = function( param ) {
        var $el = exports.$el;

        //审批列表
        var renewList = new OpenApprovalList( { 'wrapper':$el } );    //
        renewList.render();

        //付费开通审批详情
		var detailBind = new DetailBind();

        var detailApproval;

        renewList.on('detail',function( detail , state ){
            
            if( state == 'wait' ){
                state = 'agentwait';
            }

            console.log( detail )

            detailApproval = new DetailApproval();
            var data = {
                'id' : detail.orderId || '',
                'enterpriseId': detail.enterpriseId || '', 
                'editFlag': detail.canEdit || '',
                'orderType': detail.orderType || '',
                'opinion': detail.opinion || '',
                'isTp': detail.isTp || '',
                'state': state || '',
                'ea': detail.enterpriseAccount || '',
                'currentTask': detail.currentTash || '',
                'processInstanceId': detail.processInstanceId || ''
            }
            detailApproval.show( data );
        });

		renewList.on('detailBind',function( id , eid , type , state,isCurrentTask,isCanEdit, activeStatus ){
		
            detailBind.show( id , eid , type , state,isCurrentTask,isCanEdit ,activeStatus );
        });

        /*
        openApproval.on('update',function(){
            renewList.searchEve();
        });
		openApproval.on('saveSuccess',function(){
            renewList.getList();
        });
        */

		detailBind.on('sendsuccess',function(){
            renewList.searchEve();
        });
    }
} );

