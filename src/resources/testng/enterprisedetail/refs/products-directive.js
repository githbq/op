//产品指令
define(function (require, exports, module) {
    var productsJson = require('./productsjson.js');
    angular.module('formApp').directive('products', function () {
        return {
            restrict: 'ECMA',
            scope: {},
            template: require('./products-template.html'),
            link: function (scope, iElem, iAttrs) {
                debugger
                scope.products=productsJson;
               //scope.products = [{title: 'PK助手'}, {title: '战报助手'}, {title: '培训助手'}, {title: 'CRM'}, {title: '销客终端'}, {title: '会议助手'}];
            }
        }
    });


});