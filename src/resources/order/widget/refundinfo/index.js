define(function (require, exports, module) {

    var sform = require('common/widget/sform/sform');
    var tplStr = require('./template.html');
    var PageClass = MClass(sform.PageClass).include({
        i_selector: '#refundinfo',
        i_getTemplateStr: function () {
            var me = this;
            return $(tplStr).filter(me.i_selector).html();
        },
        init: function () {
            var me = this;
            PageClass.__super__.init.apply(this, arguments);
        }
    });
    module.exports = PageClass;
});