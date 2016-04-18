//hubq

define(function (require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');
    var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');
    var InvoiceApplyList = require('../widget/invoiceapplylist/invoiceapplylist');
    var ExpressDetail = require('../widget/express/express');           //快递详情


    exports.init = function ( param ) {
        var $el = exports.$el;

        var invoiceApplyList = new InvoiceApplyList( {'wrapper':$el ,'state':'agent'} );

        //发票模块
        var invoiceDetail = new InvoiceDetail();

        //快递模块
        var expressDetail = new ExpressDetail();

        invoiceApplyList.on('detail', function( orderId, inid , approvalStatus ){
            invoiceDetail.show( orderId, inid, approvalStatus );
        });
        
        invoiceApplyList.on('expressdetail', function( id ){
            console.log('expdetail' + id);
            expressDetail.show( id );
        });
    }
});