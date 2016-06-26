//产品指令
define(function (require, exports, module) {
    //var productJson = require('./productsjson.js');
    var dialogManager = require('./dialog');
    var waterfallcomput = require('./waterfallcomput');
    var colWrapperStr = '<div class="product-col-wraper"></div>';
    //瀑布布局重置
    function wrapperReset(delay) {
        setTimeout(function () {
            $('.product-agent').each(function (i, n) {
                var $dom = $(n);
                if ($dom.parents('.product-col-wraper').length > 0) {
                    $dom.unwrap();
                }
            });
            waterfallcomput($('.products-border'), $('.product-agent').has('.product'), colWrapperStr);
        }, delay || 50);
    }

    function resizeEvent() {
        $('.enterprise-panel').length > 0 && wrapperReset();
    }

    //鼠标经过效果
    function mouseEnterEvent() {
        var productId = $(this).attr('data-productid');
        if ($('.product-agent[data-productid=' + productId + '] .product').length > 0) {
            $('.product-label').removeClass('active');

            $(this).addClass('active');
            $('.product-agent[data-productid]').removeClass('active');
            $('.product-agent[data-productid=' + productId + ']').addClass('active');
        }
    }

    //点击产品事件
    function clickAgentEvent() {
        var productId = $(this).attr('data-productid');
        $('.product-label').removeClass('active2').filter('[data-productid=' + productId + ']').addClass('active2');
    }

    angular.module('formApp').directive('products', function () {
            return {
                scope: {dataResult: '=', productReadonly: '=', show: '=', initData: '=', productJson: '='},
                template: require('./products-template.html'),
                link: function (scope, iElem, iAttrs) {
                    scope.$watch('show', function () {
                        if (scope.show) {
                            wrapperReset();
                        }
                    });
                    setTimeout(function () {
                        var $container = $('.enterprise-panel');
                        //用户体验优化
                        //窗口改变大小事件
                        $(window).off('resize', resizeEvent).on('resize', resizeEvent);
                        $container
                            .off('mouseenter', '.product-label', mouseEnterEvent)
                            .off('click', '.product-agent', clickAgentEvent)
                            .on('mouseenter', '.product-label', mouseEnterEvent)
                            .on('click', '.product-agent', clickAgentEvent);
                    }, 10);
                    scope.$watch('initData', function (newVal, oldVal) {
                        init();
                    });
                    scope.$watch('productJson', function (newVal, oldVal) {
                        init();
                    });
                    scope.products = scope.products || [];
                    scope.resultData = scope.resultData || [];
                    //end
                    function init() {
                        if (!scope.productJson) {
                            return;
                        }
                        scope.dataResult = scope.dataResult || [];//对外暴露的结果数据
                        //后端推过来的结果 与提交的结果完全一致的数据结构
                        resultData = [{data: [], state: 0, productId: 1}, {data: [], productId: 11}, {data: [], productId: 111}, {data: [], productId: 1111}, {data: [], productId: 11111}];
                        //JSON格式转换
                        //logic位置重排序
                        _.each(scope.productJson.logics, function (item, i) {
                            item.index = _.findIndex(scope.productJson.products, {productId: item.attr.productId});
                        });
                        scope.productJson.logics = scope.productJson.logics.sort(function (a, b) {
                            return a.index - b.index;
                        });

                        //循环拿到想要的产品模型
                        for (var i = 0; i < scope.productJson.logics.length; i++) {
                            var logic = scope.productJson.logics[i];
                            var product = {logic: logic, productId: logic.attr.productId};
                            product.index = _.findIndex(scope.productJson.products, {productId: product.productId});
                            changeState(product);
                        }
                        //产品复选框
                        scope.productCheckboxs = _.map(scope.productJson.products, function (item, i) {
                            var findProduct = _.findWhere(resultData, {productId: item.productId});
                            item.show = !!findProduct;
                            return {id: item.productId, text: item.text, checked: !!findProduct};
                        });
                        //初始化数据对复选框进行操作
                        if (scope.initData) {
                            //对复选框进行操作
                            _.each(scope.productCheckboxs, function (item, i) {
                                var findDataItem = _.findWhere(scope.initData, {productId: item.id});
                                if (findDataItem) {
                                    item.checked = findDataItem.check;
                                    item.canCancel = findDataItem.canCancel;
                                    var findProduct = _.findWhere(scope.products, {productId: item.id});
                                    findProduct && (findProduct.show = findDataItem.check);
                                    ////同步改变对应的结果值上的属性
                                    var dataResultItem = _.findWhere(scope.dataResult, {productId: item.id});
                                    dataResultItem.show = findProduct.show;
                                }
                            });
                        }
                    }

                    function changeState(product) {
                        wrapperReset();
                        var find = _.findWhere(resultData, {productId: product.productId});
                        var findInitData = _.findWhere(scope.initData || [], {productId: product.productId});
                        //不再直接替换成结果data而是用采用结果data去赋值给原始data 最终取值使用原始data
                        _.each(product.logic.data, function (item, i) {
                            var rData = null;
                            //先赋初始化数据
                            if (findInitData && findInitData.data) {
                                rData = _.findWhere(findInitData.data, {name: item.name});
                                if (rData && !checkoutUN(rData.value)) {
                                    item.value = rData.value;
                                }
                            }
                            if (find && find.data) {
                                //再赋保存的数据
                                rData = _.findWhere(find.data, {name: item.name});
                                if (rData && !checkoutUN(rData.value)) {
                                    item.value = rData.value;
                                }
                            }
                        });
                        if (find && !checkoutUN(find.state)) { //结果数据会可能修改状态
                            product.logic.currState = find.state;
                        }
                        var stateData = getStateCombine(product.logic);//所有的状态
                        product.states = stateData.visibleStates;//可见的状态
                        product.show = !!_.findWhere(resultData, {productId: product.productId});
                        var findIndex = _.findIndex(scope.products, {productId: product.productId});
                        if (findIndex >= 0) {
                            scope.products[findIndex] = product;
                        } else {
                            scope.products.push(product);
                        }
                        //处理返回结果
                        _.each(stateData.allStates, function (item, i) {
                            var findData = _.findWhere(product.logic.data, {name: item.name});
                            findData && (findData.hidden = item.hidden);
                        });
                        var findIndex = _.findIndex(scope.dataResult, {productId: product.productId});
                        var returnProductData = {productId: product.productId, data: product.logic.data, state: product.logic.currState || 0, show: product.show};
                        if (findIndex >= 0) {
                            scope.dataResult[findIndex] = returnProductData;
                        } else {
                            scope.dataResult.push(returnProductData);
                        }
                    }

                    //复选框选中事件
                    scope.checkProduct = function (checked, checkbox) {
                        var findProduct = _.findWhere(scope.products, {productId: checkbox.id});
                        findProduct.show = checked;
                        //同步改变对应的结果值上的属性
                        var dataResultItem = _.findWhere(scope.dataResult, {productId: checkbox.id});
                        dataResultItem.show = findProduct.show;
                        wrapperReset();
                    };
                    //初始化验证数据
                    initValidate(scope.products);
                    //视图中渲染的结构

                    function getStateCombine(logic) {
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
                        var hiddenTempItems = [];
                        _.each(baseState, function (item, i) {
                            if (!item.hidden) {
                                tempItems.push(item);
                            } else {
                                hiddenTempItems.push(item);
                            }
                        });
                        return {visibleStates: tempItems, hiddenStates: hiddenTempItems, allStates: baseState};
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
                                executeValidateInit(stateItem, logic, product);
                            }
                        }

                        //执行验证值初始化行为
                        function executeValidateInit(state, logic, product) {
                            state.validateInit = state.validateInit || [];
                            for (var i = 0; i < state.validateInit.length; i++) {
                                var initItem = state.validateInit[i];
                                switchInitType(initItem, state.validate, logic, product)

                            }
                        }

                        //根据类型执行取值
                        function switchInitType(initItem, validate, logic, product) {
                            switch (initItem.value.type) {
                                case 'ajax':
                                {
                                    util.api({
                                        url: '~' + initItem.url,
                                        data: getQueryData(initItem.query, product),
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
                        //执行事件
                        fieldStruct.onchange = fieldStruct.onchange || [];
                        for (var i = 0; i < fieldStruct.onchange.length; i++) {
                            var changeItem = fieldStruct.onchange[i];
                            done(changeItem, fieldStruct);
                        }
                        setTimeout(function () {
                            scope.$apply();
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
                                    ajaxSetValue(changeItem, fieldStruct, product);

                                }
                                    ;
                            }
                        }

                        //ajax赋值操作
                        function ajaxSetValue(changeItem, fieldStruct, product) {
                            if (!changeItem.url) {
                                return;
                            }
                            util.api({
                                url: '~' + changeItem.url,
                                data: getQueryData(changeItem.query, product),
                                success: function (result) {
                                    if (result.success && result.value.model) {//如果查询无效 result.value.model为false或者null
                                        setResponse(result.value.model, changeItem, product);
                                    }
                                }
                            });


                            //根据ajax返回的值向数据中赋值
                            function setResponse(data, changeItem, product) {
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
                                            setMappingValue(data, mapperItem, product);
                                        }
                                    }
                                });
                            }

                            function setMappingValue(responseData, mapperItem, product) {
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
                    function getQueryData(querys, product) {
                        var data = {};
                        for (var i = 0; i < querys.length; i++) {
                            var queryItem = querys[i];
                            var findValue = getValueForSwitchValueType(queryItem.valueType, queryItem.valueRef, product);
                            data[queryItem.name] = findValue;
                        }
                        return data;
                    }

                    //根据不同的拿值类型拿值
                    function getValueForSwitchValueType(valueType, refName, product) {
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

                    //获取对应的验证值
                    scope.getValidateValue = function (validateName, fieldStruct, product) {
                        if (fieldStruct.validate && fieldStruct.validate[validateName]) {
                            var validateItem = fieldStruct.validate[validateName];
                            var result = getValueForSwitchValueType(validateItem.valueType, validateItem.valueRef, product);
                            return result;
                        }
                    };
                    //弹窗选择 添加销售
                    scope.selectSalesmenDialog = function (array) {
                        var accountConfig = {
                            data: [],
                            multiple: false,
                            placeholder: '请输入条件查询'
                        };
                        var dialog = dialogManager.getInstance(null,
                            {
                                defaultAttr: {
                                    title: '选择销售',
                                    width: 600
                                },
                                content: require('./dialogtemplate.html')
                            }
                        );
                        dialog.bootstrap(['common.directives', 'common.services', 'formApp'], function (app) {
                            app.controller('dialogController', ['$scope', '$timeout', 'select2Query', function ($scope, $timeout, select2Query) {
                                var vm = this;
                                vm.config = accountConfig;
                                vm.ajaxConfig = select2Query.getEmplyeeAjaxConfig();
                                vm.ngModel = null;
                                vm.select2Model = null;
                                vm.placeholder = '请输入条件查询';
                                vm.clickEnter = function () {
                                    var me = this;
                                    if (me.select2Model) {
                                        scope.$apply(function () {
                                            array.push(me.select2Model.data);
                                        });
                                    }
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
                            data: [],
                            multiple: false,
                            placeholder: '请输入条件查询'
                        };
                        var dialog = dialogManager.getInstance(null,
                            {
                                defaultAttr: {
                                    title: '选择跟进人',
                                    width: 600
                                },
                                content: require('./dialogtemplate.html')
                            }
                        );
                        dialog.bootstrap(['common.directives', 'common.services', 'formApp'], function (app) {
                            app.controller('dialogController', ['$scope', '$timeout', 'select2Query', function ($scope, $timeout, select2Query) {
                                var vm = this;
                                vm.config = accountConfig;
                                vm.ajaxConfig = select2Query.getEmplyeeAjaxConfig();
                                vm.ngModel = null;
                                vm.select2Model = null;
                                vm.placeholder = '请选择...';
                                vm.clickEnter = function () {
                                    var me = this;
                                    if (me.select2Model) {
                                        scope.$apply(function () {
                                            array.push(me.select2Model.data);
                                        });
                                    }
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
})
;