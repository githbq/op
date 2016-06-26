/**
 * angular dialog
 */
define(function (require, exports, module) {
    var Dialog = require('common/widget/dialog/dialog');
    var PageDialog = MClass(Dialog);

    var config = {
        defaultAttr: {
            'class': 'rolesDialog',
            'title': '',
            'width': 650
        },
        elements: {},
        events: {
            "click .enter": 'enter',
            'click .cancel': 'cancel'
        },
        content: '<div>空模板</div>',
        init: function () {
            PageDialog.__super__.init.apply(this, arguments);
            this.rTree = null;
        },
        show: function (functions, opitons, types) {
            var me = this;
            PageDialog.__super__.show.apply(this, arguments);

        },
        enter: function () {
            var me = this;
            me.trigger('assginSuccess');
            me.hide();
        },
        cancel: function () {
            this.hide();
        },
        hide: function () {
            var me = this;
            PageDialog.__super__.remove.apply(this, arguments);

        },
        bootstrap: function (requires,callback) {
            var app=angular.module('app.pageDialog',requires||[]);
            callback && callback(app);
            return angular.bootstrap(this.$view[0],['app.pageDialog']);
        }
    };
    exports.getInstance = function (data, newconfig) {
        var PageDialog = MClass(Dialog).include($.extend({}, config, newconfig));
        var dialog = new PageDialog();
        return dialog;
    };
});
