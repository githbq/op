//产品指令
define(function (require, exports, module) {
    var productsJson = require('./productsjson.js');
    angular.module('formApp').directive('products', function () {
        return {
            restrict: 'ECMA',
            scope: {},
            template: require('./products-template.html'),
            link: function (scope, iElem, iAttrs) {
                scope.testGroup=function(){
                    debugger


                }
                scope.products=productsJson;
                scope.deleteArray = function (items, index) {
                    items.splice(index, 1);
                };
                scope.clickMe = function () {
                };
                scope.addSalesmen = function (items) {
                    items.push({
                        "name": "张三",
                        "department": '广州大一部',
                        "inputTitle": "签约金额",
                        "value": "111"
                    });
                };
                scope.addPartners = function (items) {
                    items.push({
                        "name": "张三",
                        "department": '广州大一部',
                        "value": "AAAAAA"
                    });
                };
                //scope.products = [{title: 'PK助手'}, {title: '战报助手'}, {title: '培训助手'}, {title: 'CRM'}, {title: '销客终端'}, {title: '会议助手'}];
            }
        }
    });


});