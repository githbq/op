define(function (require, exports, module) {
    var Page = require('./enterprisedetailmodule');
    exports.init = function () {
        var $el = exports.$el;
        var p = new Page({wrapper: $el});
        p.render();
        //setTimeout(function () {
        //    debugger
        //    //p.nextStep();//下一步
        //    //  p.prevStep();//上一步
        //    //  p.hideFootBtns();//隐藏底部按钮
        //    // p.hideTopBar();//隐藏头部第几步提示栏
        //}, 5000)
    };
});