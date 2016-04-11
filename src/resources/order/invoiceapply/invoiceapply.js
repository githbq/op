

define(function (require, exports, module) {

    var sform = require('common/widget/sform/sform');

    var PageClass = MClass(sform.PageClass).include({
        i_getTemplateStr: function () {
            var me = this;
            return  me.templateStr;
        },
        init: function (data) {
            var me = this;
            me.templateStr = data.templateStr;
            PageClass.__super__.init.apply(this, arguments);
        }
    });
    exports.init = function () {
        var dataItems=[];




        var me = this;
        var $el = exports.$el;
        var templateStr=$el.find('.list-main').html();
        var page = new PageClass({templateStr:templateStr,dataItems:dataItems,wrapperView: $el.find('.list-main')});


    }
});