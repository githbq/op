define(function (require, exports, module) {
    var myApp = angular.module('formApp',['ngMessages']);


    myApp.controller('basicinfoController', ["$scope", function ($scope) {

    }]);
    exports.init = function () {
        var $el = exports.$el;
        angular.bootstrap($el.get(0), ['formApp']);
    };

});