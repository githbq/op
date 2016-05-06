//hubq

define(function (require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');
    var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');
    var InvoiceApplyList = require('../widget/invoiceapplylist/invoiceapplylist');
    var ExpressDetail = require('../widget/express/express');           //快递详情


    exports.init = function ( param ) {
       var $el = exports.$el;
		
		param = param || [];

        var invoiceApplyList = new InvoiceApplyList( {'wrapper':$el ,'state':'agent'} );
		
		invoiceApplyList.on('refuse',function(jump){
			invoiceApplyList.jumpEve(jump);
		})
		if(param.length>0){
			invoiceApplyList.trigger('refuse','refuse');
		}else{
			invoiceApplyList.refresh();
		}

        //发票模块
        var invoiceDetail = new InvoiceDetail();

        //快递模块
        var expressDetail = new ExpressDetail({'state':'agent'});

        //查看发票详情
        invoiceApplyList.on('detail', function( orderId, inid , approvalStatus , info ){
            invoiceDetail.show( orderId, inid, approvalStatus , info );
        });
        
        invoiceDetail.on('editSuccess',function(){
            invoiceApplyList.refresh();
        })

        //查看快递详情
        invoiceApplyList.on('expressdetail', function( id , state ){
            console.log('expdetail' + id);
            expressDetail.show( id );
        });
    }
});