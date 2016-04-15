/**
 * Created by hubq on 2016/4/7.
 */
define(function (require, exports, module) {
    //"invoiceType": "发票类型 1：普通增值税发票 2：增值税专用发票",
    //"invoiceProp": "发票属性：1款到开票,2预开发票"
    //"invoiceType": "发票类型 1：普通增值税发票 2：增值税专用发票"
    var DataItem = require('common/widget/sform/sform').PageDataClass;
    module.exports.getItems = function () {
        var dataItems = [];
        dataItems.push(new DataItem({name: 'enterpriseId', value: 'enterpriseId'}));
        return dataItems;
    }
});