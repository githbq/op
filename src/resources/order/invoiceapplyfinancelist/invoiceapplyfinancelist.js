//hubq

define(function (require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');
    var InvoiceApplyList = require('../widget/invoiceapplylist/invoiceapplylist');


    exports.init = function ( param ) {
        var $el = exports.$el;

        var invoiceApplyList = new InvoiceApplyList( {'wrapper':$el ,'state':'finance'} );
    }
});