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
                    var resultData = [{data: [], state: 1, productId: 1}, {data: [], productId: 11}, {data: [], productId: 111}, {data: [], productId: 1111}];
                    //JSON格式转换
                    for (var i = 0; i < productJson.logics.length; i++) {
                        var logic = productJson.logics[i];
                        debugger
                        var find = _.findWhere(resultData, {productId: logic.attr.productId});
                        if (find) {
                            //不再直接替换成结果data而是用采用结果data去赋值给原始data 最终取值使用原始data
                            _.each(logic.data, function (item, i) {
                                var rData = _.findWhere(find.data, {name: item.name});
                                if (rData) {
                                    logic.data.value = rData.value;
                                }
                            });
                            logic.currState = find.state;
                        }
                        var state = getStateCombine(logic);
                        var show = !!_.findWhere(resultData, {productId: logic.attr.productId});
                        //与基状态合并
                        products.push({productId: logic.attr.productId, states: state, logic: logic, show: show});
                    }
                    //复选框选中事件
                    scope.productCheckboxs = _.map(productJson.products, function (item, i) {
                        var findProduct = _.findWhere(resultData, {productId: item.productId});
                        item.show = !!findProduct;
                        return {id: item.productId, text: item.text, checked: !!findProduct};
                    });
                    //产品复选框
                    scope.checkProduct = function (checked, checkbox) {
                        var findProduct = _.findWhere(products, {productId: checkbox.id});
                        findProduct && (findProduct.show = checked);
                    };
                    //初始化验证数据
                    initValidate(products);
                    //视图中渲染的结构
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
                    //验证状态初始化
                    function initValidate(products) {

                        for (var i = 0; i < products.length; i++) {
                            var product = products[i];
                        }

                        function resolveProductStates(product) {
                            var states = product.states;
                            var logic = product.logic;
                            for (var i = 0; i < states.length; i == 0) {
                                var stateItem = states[i];
                                executeValidateInit(stateItem, logic)

                            }
                        }

                        //执行验证值初始化行为
                        function executeValidateInit(state, logic) {
                            state.validateInit = state.validateInit || [];
                            for (var i = 0; i < state.validateInit.length; i++) {
                                var initItem = state.validateInit[i];
                                witchInitType(initItem, state.validate, logic)

                            }
                        }

                        //根据类型执行取值
                        function switchInitType(initItem, validate, logic) {
                            switch (initItem.value.type) {
                                case 'ajax':
                                {
                                    util.api({
                                        url: '~' + initItem.url,
                                        data: getQueryData(initItem.query),
                                        success: function (result) {
                                            if (result.success) {
                                                validate[initItem.name] = result.value.model[initItem.value.backName];
                                            }
                                        }
                                    });
                                }
                                    ;
                                    break;
                                case 'attr':
                                {
                                    validate[initItem.name] = logic.attr[initItem.name];

                                }
                                    ;
                                    break;
                                case 'global':
                                {
                                    validate[initItem.name] = logic.global[initItem.name];
                                }
                                    ;
                                    break;
                            }
                        }


                    }


                    //控制值改变时事件  fieldStruct 元素的模型
                    scope.fieldChange = function (fieldStruct, product, form) {
                        //执行验证
                        debugger

                        //执行事件
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
                                    //直接赋值操作
                                    evaluationForValueType(changeItem);
                                }
                                    ;
                                    break;
                                case 'ajax':
                                {
                                    //远程赋值操作
                                    ajaxSetValue(changeItem);

                                }
                                    ;
                            }
                        }

                        //ajax赋值操作
                        function ajaxSetValue(changeItem) {
                            if (!changeItem.url) {
                                return;
                            }
                            util.api({
                                url: '~' + changeItem.url,
                                data: getQueryData(changeItem.query),
                                success: function (result) {
                                    if (result.success) {
                                        setResponse(result.value.model, changeItem);
                                    }
                                }
                            });


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
                                case 'state':{
                                      function setStateForSource(){


                                      }


                                };break;
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
                    //获取推送到后端的数据
                    function getQueryData(querys) {
                        var data = {};
                        for (var i = 0; i < querys.length; i++) {
                            var queryItem = querys[i];
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

                    //获取后后端推送的数据
                    scope.getResultData = function () {
                        return _.map(products, function (item, i) {
                            return {productId: item.productId, data: item.logic.data, state: item.logic.currState};
                        });
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