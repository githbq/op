define(function (require, exports, module) {
    var Page=require('./enterprisedetailmodule');
    exports.init = function () {
        var $el = exports.$el;
        var p=new Page({wrapper:$el});
        p.render();
    };
});