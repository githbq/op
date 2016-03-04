define(function (require, exports, module) {

    var index = require('./index.js');
    var IndexPageDataClass = index.PageDataClass;
    var IndexPageClass = index.PageClass;
    var AutoSelect = require('common/widget/autoselect/autoselect');
    var banks = require('./banks');
    var PageClass = MClass(IndexPageClass).include({
        selector: '#forminfo',
        init: function () {
            var me = this;
            PageClass.__super__.init.apply(this, arguments);
            me.autoSelect = new AutoSelect({data: banks});
            me.autoSelect.resetSelect(me.$('.bankno'));
        }
    });
    module.exports = PageClass;
});