//产品指令
define(function (require, exports, module) {
    var productsJson = require('./productsjson.js');
    angular.module('formApp').directive('products', function () {
            return {
                restrict: 'ECMA',
                scope: {},
                template: require('./products-template.html'),
                link: function (scope, iElem, iAttrs) {

                    scope.testGroup = function () {
                        debugger


                    };
                    scope.testGroup = function () {
                        debugger


                    };
                    scope.products = productsJson;

                    //产品逻辑
                    scope.$watch('products', function (newValue, oldValue, scope) {
                        debugger
                        productLogic();
                        console.log('products changed')
                    }, true);
                    //产品逻辑
                    function productLogic() {
                        for (var i = 0; i < scope.products.length; i++) {
                            var product = scope.products[i];

                            groupDisplayLogic(product.groups)
                        }
                    }

                    //组显示逻辑
                    function groupDisplayLogic(groups) {
                        var groupDic = groupsToDictionary(groups);
                        //组字典
                        for (var i = 0; i < groups.length; i++) {
                            var group = groups[i];
                            if (!group.fields) {
                                continue;
                            }
                            displayLogic(group.displayLogics, group, groupDic);
                        }
                    }

                    function displayLogic(displayLogics, group, groupDic) {
                        if(!displayLogics.conditions){//无条件 强制显示
                            displayLogics.result = true;
                            return ;
                        }
                        for (var i = 0; i < displayLogics.conditions.length; i++) {
                            var condition = displayLogics.conditions[i];
                            switch (condition.dataType) {
                                case "key":
                                {
                                    displayLogics.result = true;
                                }
                                    ;
                                    break;
                                case "name":
                                {
                                    displayWithNameLogic(condition, groupDic, displayLogics);
                                }
                                    ;
                                    break;
                            }
                        }
                    }

                    function displayWithNameLogic(condition, groupDic, displayLogics) {
                        var wantGroup = condition.groupName ? groupDic[condition.groupName] : group;
                        var fieldDic = fieldsToDictionary(wantGroup);
                        if (condition.valueCompare && fieldDic[condition.valueCompare.name] !== undefined && fieldDic[condition.valueCompare.name].value == condition.valueCompare.value) {
                            displayLogics.result = true;
                        } else {
                            displayLogics.result = false;
                        }
                    }

                    function groupsToDictionary(groups) {
                        var groupDic = {};
                        //组字典
                        for (var i = 0; i < groups.length; i++) {
                            var group = groups[i];
                            groupDic[group.name] = group;
                        }
                        return groupDic;
                    }

                    function fieldsToDictionary(group) {
                        var fieldDic = {};
                        if (group.fields) {
                            for (var i = 0; i < group.fields.length; i++) {
                                var field = group.fields[i];
                                fieldDic[field.name] = field;
                            }
                        }
                        return fieldDic;
                    }
                    //end产品逻辑
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