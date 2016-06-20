//产品指令
define(function (require, exports, module) {
    var productJson = require('./productsjson.js');
    var dialogManager = require('./dialog');
    var waterfallcomput = require('./waterfallcomput');
    var colWrapperStr = '<div class="product-col-wraper" style="border:3px solid green;overflow:hidden;float:left;"></div>';

    angular.module('formApp').directive('products', function () {
            return {
                scope: {},
                template: require('./products-template.html'),
                link: function (scope, iElem, iAttrs) {

                    var products = [];
                    //后端推过来的结果 与提交的结果完全一致的数据结构
                    var resultData = [{data: [], state: 0, productId: 1}, {data: [], productId: 11}, {data: [], productId: 111}, {data: [], productId: 1111}, {data: [], productId: 11111}];
                    //JSON格式转换
                    for (var i = 0; i < productJson.logics.length; i++) {
                        var logic = productJson.logics[i];
                        changeState({logic: logic, productId: logic.attr.productId});
                    }
                    //瀑布布局重置
                    function wrapperReset() {
                        setTimeout(function () {
                            $('.product-col-wraper').each(function (i, n) {
                                if ($('.product',n).length==0) {
                                    $(n).remove();
                                }
                            });
                            $('.product').each(function (i, n) {
                                var $dom = $(n);
                                if ($dom.parents('.product-col-wraper').length > 0) {
                                    $dom.unwrap();
                                }
                            });
                            waterfallcomput($('.products-border'), $('.product'), colWrapperStr);
                        }, 10);
                    }

                    function changeState(product) {
                        wrapperReset();
                        var find = _.findWhere(resultData, {productId: product.productId});
                        if (find) {
                            //不再直接替换成结果data而是用采用结果data去赋值给原始data 最终取值使用原始data
                            _.each(product.logic.data, function (item, i) {
                                var rData = _.findWhere(find.data, {name: item.name});
                                if (rData) {
                                    item.value = rData.value;
                                }
                            });
                            logic.currState = find.state;
                        }
                        product.states = getStateCombine(logic);
                        product.show = !!_.findWhere(resultData, {productId: product.productId});
                        var findIndex = _.findIndex(products, {productId: product.productId});
                        if (findIndex >= 0) {
                            products[findIndex] = product;
                        } else {
                            products.push(product);
                        }
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
                        wrapperReset();
                    };
                    //初始化验证数据
                    initValidate(products);
                    //视图中渲染的结构
                    scope.products = products;
                    function getStateCombine(logic) {
                        debugger
                        //创建副本 避免污染原始数据
                        var baseState = angular.copy(logic.baseState);
                        var state = angular.copy(logic.states[logic.currState || 0]);
                        //子状态与基状态合并
                        for (var i = 0; i < baseState.length; i++) {
                            var name = baseState[i].name;
                            var stateItem = baseState[i];
                            var findState = _.findWhere(state, {name: name});
                            if (findState) {
                                baseState[i] = angular.extend({}, stateItem, findState);
                            }
                            var findData = _.findWhere(logic.data, {name: name});
                            var newState = baseState[i];
                            if (findData) {
                                newState.value = newState.value || {};
                                if (checkoutUN(findData.value)) {
                                    findData.value = newState.value.value || '';
                                }
                                newState.value.valueData = findData;
                            }
                        }
                        var tempItems = [];
                        _.each(baseState, function (item, i) {
                            if (!item.hidden) {
                                tempItems.push(item);
                            }
                        });
                        return tempItems;
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
                                switchInitType(initItem, state.validate, logic)

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
                                                scope.$apply(function () {
                                                    validate[initItem.name] = result.value.model[initItem.value.backName];
                                                });
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
                            done(changeItem, fieldStruct);
                        }
                        setTimeout(function () {
                            scope.$apply()
                        }, 10);
                        function done(changeItem) {
                            switch (changeItem.type) {
                                case 'evaluation':
                                {
                                    //直接赋值操作
                                    evaluationForValueType(changeItem, fieldStruct, product);
                                }
                                    ;
                                    break;
                                case 'ajax':
                                {
                                    //远程赋值操作
                                    ajaxSetValue(changeItem, fieldStruct);

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
                        function evaluationForValueType(changeItem, fieldStruct, product) {
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
                                case 'state':
                                {
                                    setStateForSource(changeItem, fieldStruct, product);
                                }
                                    ;
                                    break;
                            }
                        }

                        //设置状态
                        function setStateForSource(changeItem, fieldStruct, product) {
                            var state = null;
                            _.each(fieldStruct.items, function (n, i) {//目前只有拥有 items属性的元素才会有可能改变状态
                                var findState = n[changeItem.source];
                                if (findState !== undefined && n.value == fieldStruct.value.valueData.value) {
                                    setState(findState, product);
                                }
                            })
                        }

                        function setState(state, product) {
                            _.each(resultData, function (item, j) {
                                if (item.productId == product.productId) {
                                    if (item.state !== state) {
                                        item.state = state;
                                        setTimeout(function () {
                                            changeState(product);
                                        }, 10);
                                    }
                                }
                            });
                        }

                        //end 设置状态

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
                    scope.addSalesmen = function (field) {
                        debugger
                        field.value.valueData.valueItems = field.value.valueData.valueItems || [];

                        field.value.valueData.valueItems.push({
                            "name": "张三",
                            "department": '广州大一部',
                            "inputTitle": "签约金额",
                            "value": "111"
                        });
                    };
                    scope.addPartners = function (field) {
                        field.value.valueData.valueItems = field.value.valueData.valueItems || [];
                        field.value.valueData.valueItems.push({
                            "name": "张三",
                            "department": '广州大一部',
                            "value": "AAAAAA"
                        });
                    };
                    //弹窗选择 添加销售
                    scope.selectSalesmenDialog = function (array) {
                        var accountConfig = {
                            data: [{id: 1, text: '111111111111111'}, {id: 2, text: '22222222222'}, {id: 3, text: '3333333333'}, {id: 4, text: '支付宝'}],
                            multiple: false,
                            placeholder: '必须与实际打款的单位/个人名称一致'
                        };
                        var dialog = dialogManager.getInstance(null,
                            {
                                defaultAttr: {
                                    title: 'testResult',
                                    width: 500
                                },
                                content: require('./dialogtemplate.html')
                            }
                        );
                        dialog.bootstrap(['common.directives', 'common.services'], function (app) {
                            app.controller('dialogController', ['$scope', '$timeout', function ($scope, $timeout) {
                                var vm = this;
                                vm.config = accountConfig;
                                vm.ngModel = null;
                                vm.select2Model = null;
                                vm.placeholder = '请选择...';
                                vm.clickEnter = function () {
                                    debugger
                                    scope.$apply(function () {
                                        array.push({
                                            "name": "张三",
                                            "department": '广州大一部',
                                            "inputTitle": "签约金额",
                                            "value": "111"
                                        });
                                    });
                                };
                                vm.clickCancel = function () {

                                }
                            }]);
                        });
                        dialog.show();
                    };
                    //弹窗选择 添加跟进人
                    scope.selectPartnersDialog = function (array) {
                        var accountConfig = {
                            data: [{id: 1, text: '111111111111111'}, {id: 2, text: '22222222222'}, {id: 3, text: '3333333333'}, {id: 4, text: '支付宝'}],
                            multiple: false,
                            placeholder: '必须与实际打款的单位/个人名称一致'
                        };
                        var dialog = dialogManager.getInstance(null,
                            {
                                defaultAttr: {
                                    title: 'testResult',
                                    width: 500
                                },
                                content: require('./dialogtemplate.html')
                            }
                        );
                        dialog.bootstrap(['common.directives', 'common.services'], function (app) {
                            app.controller('dialogController', ['$scope', '$timeout', function ($scope, $timeout) {
                                var vm = this;
                                vm.config = accountConfig;
                                vm.ngModel = null;
                                vm.select2Model = null;
                                vm.placeholder = '请选择...';
                                vm.clickEnter = function () {
                                    debugger
                                    scope.$apply(function () {
                                        array.push({
                                            "name": "张三",
                                            "department": '广州大一部',
                                            "value": "AAAAAA"
                                        });
                                    });
                                };
                                vm.clickCancel = function () {

                                }
                            }]);
                        });
                        dialog.show();
                    };
                }
            }
        }
    )
    ;
});