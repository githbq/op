define(function (require, exports, module) {
    var sform = require('common/widget/sform/sform');
    var tplStr = require('./template.html');
    var PageClass = MClass(sform.PageClass).include({
        i_selector: '.m-invoicedetail-wrapper',
        i_getTemplateStr: function () {
            var me = this;
            return _.template($(tplStr).filter(me.i_selector).html())(me.templateData);
        },
        init: function (data) {
            var me = this;
            me.templateData = data.templateData;
            PageClass.__super__.init.apply(this, arguments);
        }
    });
    module.exports = PageClass;
});