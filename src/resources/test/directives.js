define(function (require, exports, module) {
    var app = angular.module('app.directives', []);
    app.directive('dir1', function () {

        return {
            restrict: 'EA',
            template: '<a>你好我是dir1指令!</a><div ng-transclude></div>',
            transclude: true
        };
    });
});