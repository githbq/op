//hubq

define(function (require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');
    var InvoiceApplyAgent = require('../widget/invoiceapplylist/invoiceapplylist');


    exports.init = function ( param ) {
        var $el = exports.$el;

        var invoiceApplyAgent = new InvoiceApplyAgent( {'wrapper':$el ,'type':'finance'} );
    }
});