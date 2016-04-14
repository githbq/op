//hubq

define(function (require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');
    var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');
    var InvoiceApplyAgent = require('../widget/invoiceapplylist/invoiceapplylist');


    exports.init = function ( param ) {
        var $el = exports.$el;

        var invoiceApplyAgent = new InvoiceApplyAgent( {'wrapper':$el ,'type':'agent'} );

        //发票模块
        var invoiceDetail = new InvoiceDetail();

        invoiceApplyAgent.on('detail',function( orderId, inid , approvalStatus ){
            invoiceDetail.show( orderId, inid, approvalStatus );
        });
    }
});