//产品指令
define(function (require, exports, module) {
    var productJson = require('./productsjson.js');
    angular.module('formApp').directive('products', function () {
            return {
                restrict: 'ECMA',
                scope: {},
                template: require('./products-template.html'),
                link: function (scope, iElem, iAttrs) {
                    var products = [];
                    var resultData = [{data: [], state: 1, productId: 11}, {data: [], productId: 11}, {data: [], productId: 11}, {data: [], productId: 11}];
                    //JSON格式转换
                    for (var i = 0; i < productJson.logics.length; i++) {
                        var logic = productJson.logics[i];
                        var find = _.findWhere(resultData, {productId: logic.attr.productId});
                        if (find) {
                            logic.data = find.data;
                            logic.currState = find.state;
                        }
                        var state = getStateCombine(logic);
                        //与基状态合并
                        products.push({states: state, logic: logic});
                    }
                    scope.products = products;
                    function getStateCombine(logic) {
                        //创建副本 避免污染原始数据
                        var baseState = angular.copy(logic.baseState);
                        var state = angular.copy(logic.states[logic.currState || 0]);
                        //子状态与基状态合并
                        for (var i = 0; i < baseState.length; i++) {
                            var name = baseState[i].name;
                            var findState = _.findWhere(state, {name: name});
                            if (findState) {
                                baseState[i] = findState;
                            }
                            var findData = _.findWhere(logic.data, {name: name});
                            var state = baseState[i];
                            if (findData) {
                                state.value = state.value || {};
                                if (checkoutUN(findData.value)) {
                                    findData.value = state.value.value||'';
                                }
                                state.value.valueData = findData;
                            }
                        }
                        return baseState;
                    }

                    //检查是undefined或者null
                    function checkoutUN(value) {
                        return value === undefined || value === null;
                    }

                    //end JSON格式转换


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
        }
    )
    ;


});