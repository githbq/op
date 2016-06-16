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
                                    findData.value = state.value.value || '';
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
                    //控制值改变时事件  fieldStruct 元素的模型
                    scope.fieldChange = function (fieldStruct, product) {
                        debugger
                        fieldStruct.onchange = fieldStruct.onchange || [];
                        for (var i = 0; i < fieldStruct.onchange.length; i++) {
                            var changeItem = fieldStruct.onchange[i];
                            done(changeItem);
                        }
                        scope.$apply();
                        function done(changeItem) {
                            switch (changeItem.type) {
                                case 'evaluation':
                                {
                                    // scope.$apply(function () {
                                    //赋值操作
                                    evaluationForValueType(changeItem);
                                    //});
                                }
                                    ;
                                    break;
                                case 'ajax':
                                {
                                    //远程操作
                                    ajaxSetValue(changeItem);

                                }
                                    ;
                                    break;
                                case '':
                                {
                                }
                                    ;
                                    break;
                                case '':
                                {
                                }
                                    ;
                                    break;
                                case '':
                                {
                                }
                                    ;
                                    break;
                            }
                        }

                        //ajax赋值操作
                        function ajaxSetValue(changeItem) {
                            if (!changeItem.url) {
                                return;
                            }
                            util.api({
                                url: '~' + changeItem.url,
                                data: getQueryData(changeItem),
                                success: function (result) {
                                    if (result.success) {
                                        setResponse(result.value.model, changeItem);
                                    }
                                }
                            });
                            //获取推送到后端的数据
                            function getQueryData(changeItem) {
                                changeItem.query = changeItem.query || [];
                                var data = {};
                                for (var i = 0; i < changeItem.query.length; i++) {
                                    var queryItem = changeItem.query[i];
                                    var findValue = getValueForSwitchValueType(queryItem.valueType, queryItem.valueRef);
                                    data[queryItem.name] = findValue;
                                }
                                return data;
                            }

                            //根据不同的拿值类型拿值
                            function getValueForSwitchValueType(valueType, refName) {
                                var value = null;
                                switch (valueType) {
                                    case 'data':
                                    {
                                        var findData = _.findWhere(product.logic.data, {name: refName});
                                        value = findData.value;
                                    }
                                        ;
                                        break;
                                    case 'attr':
                                    {
                                        value = product.logic.attr[refName];
                                    }
                                        ;
                                        break;
                                    case 'global':
                                    {
                                        value = product.logic.global[refName];
                                    }
                                        ;
                                        break;
                                }
                                return value;
                            }

                            //根据ajax返回的值向数据中赋值
                            function setResponse(data, changeItem) {
                                scope.$apply(function () {
                                    if (changeItem.response.writeBackType == 'merge') {//合并到data上
                                        _.each(data, function (value, key) {
                                            var findData = _.findWhere(product.logic.data, {name: key});
                                            findData && (findData.value = value);
                                        });
                                    }
                                    if (changeItem.response.writeBackType == 'mapping' && changeItem.response.mapper) {//映射合并
                                        for (var i = 0; i < changeItem.response.mapper.length; i++) {
                                            var mapperItem = changeItem.response.mapper[i];
                                            setMappingValue(data, mapperItem);
                                        }
                                    }
                                });
                            }

                            function setMappingValue(responseData, mapperItem) {
                                switch (mapperItem.valueType) {
                                    case 'data':
                                    {
                                        var findData = _.findWhere(product.logic.data, {name: mapperItem.valueRef});
                                        if (findData) {
                                            findData.value = responseData[mapperItem.name];
                                        }
                                    }
                                        ;
                                        brack;
                                    case 'attr':
                                    {
                                        product.logic.attr[mapperItem.valueRef] = responseData[mapperItem.name];

                                    }
                                        ;
                                        brack;
                                    case 'global':
                                    {
                                        product.global.attr[mapperItem.valueRef] = responseData[mapperItem.name];
                                    }
                                        ;
                                        brack;
                                }
                            }
                        };
                        //根据赋值类型进行赋值
                        function evaluationForValueType(changeItem) {
                            switch (changeItem.valueType) {
                                case 'data':
                                {
                                    var findvalue = null;
                                    //从data中赋值
                                    var find = _.findWhere(product.logic.data, {name: changeItem.target});
                                    setValueForSource(changeItem, find, {data: true});
                                }
                                    ;
                                    break;

                                case 'attr':
                                {
                                    setValueForSource(changeItem, product.logic.attr, {attr: true});
                                }
                                    ;
                                    break;
                                case 'global':
                                {
                                    //从global中赋值
                                    setValueForSource(changeItem, product.logic.global, {global: true});
                                }
                                    ;
                                    break;
                            }
                        }

                        //根据源不同 去给对象赋值
                        function setValueForSource(changeItem, findData, DataIs) {
                            if (!findData || !changeItem.target) {
                                return;
                            }
                            if (changeItem.source == 'value') {
                                if (DataIs.data) {
                                    findData.value = fieldStruct.value.valueData.value;
                                } else if (DataIs.attr || DataIs.global) {
                                    findData[changeItem.target] && (findData[changeItem.target] = fieldStruct.value.valueData.value);
                                }
                            }
                        }

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