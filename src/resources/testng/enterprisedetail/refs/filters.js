/**
 * Created by hubq on 2016/6/28.
 */
define(function (require, exports, module) {
    var app = null;
    try {
        app = angular.module('common.filters');
    } catch (e) {
        app = angular.module('common.filters', []);
    }
    //多功能trim 传一个true参数 则全局去空格
    app.filter('trim2', function () {
        return function (input, isGlobal) {
            var result='';
            if (input) {
                result = input.replace(/(^\s+)|(\s+$)/g, "");
                if (isGlobal) {
                    result = result.replace(/\s/g, "");
                }
            }
            return result;
        };
    });
});