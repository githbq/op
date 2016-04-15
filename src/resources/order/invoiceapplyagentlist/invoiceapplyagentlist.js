//hubq

define(function (require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');
    var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');
    var InvoiceApplyList = require('../widget/invoiceapplylist/invoiceapplylist');


    exports.init = function ( param ) {
        var $el = exports.$el;

        var invoiceApplyList = new InvoiceApplyList( {'wrapper':$el ,'state':'agent'} );

        //发票模块
        var invoiceDetail = new InvoiceDetail();

        invoiceApplyList.on('detail',function( orderId, inid , approvalStatus ){
            invoiceDetail.show( orderId, inid, approvalStatus );
        });
    }
});