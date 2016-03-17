define(function (require, exports, module) {

    var index = require('./index.js');
    var IndexPageDataClass = index.PageDataClass;
    var IndexPageClass = index.PageClass;
    var AutoSelect = require('common/widget/autoselect/autoselect');
    var banks = require('./banks');
    var tplStr = require('./template.html');

    function i_getTemplateStr() {
        var me = this;
        return $(tplStr).filter(me.i_selector).html();
    }

    var PageClass = MClass(IndexPageClass).include({
        i_selector: '#forminfo',
        i_getTemplateStr: i_getTemplateStr,
        init: function () {
            var me = this;
            PageClass.__super__.init.apply(this, arguments);
            me.autoSelect = new AutoSelect({data: banks});
            me.autoSelect.resetSelect(me.$('.bankno'));
        }
    });
    module.exports = PageClass;
});