//产品指令
define(function (require, exports, module) {
    //var productJson = require('./productsjson.js');

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
                scope: {dataResult: '=', fromData: '=', allReadonly: '=productReadonly', show: '=', initData: '=', productJson: '='},
                template: require('./products-template.html'),
                controller: ['$scope', '$timeout', 'productService', function ($scope, $timeout, productService) {
                    //标记是否由用户操作界面
                    $scope.isUserControl = false;
                    //全模块只读监听
                    $scope.$watch('allReadonly', function () {
                        $timeout(function () {
                            //啥也不干
                        }, 10);
                    });
                    $scope.showed = false;//标记是否已经显示过
                    //可见性属性监听
                    $scope.$watch('show', function () {
                        if ($scope.show && !$scope.showed) {
                            init();
                            $scope.showed = true;
                        } else {
                            wrapperReset();
                        }
                    });
                    //dom事件绑定
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
                    //初始化数据监听
                    $scope.$watch('initData', function (newVal, oldVal) {
                        if (newVal) {
                            init();
                        }
                    });
                    //产品结构数据监听
                    $scope.$watch('productJson', function (newVal, oldVal) {
                        init();
                    });
                    //用户上次保存的数据监听
                    $scope.$watch('fromData', function (newVal, oldVal) {
                        console.log(' fromData init');

                        console.warn(newVal);
                        init();

                    });

                    //end
                    function init() {

                        $scope.initData = $scope.initData || [];
                        $scope.products = $scope.products || [];
                        $scope.fromData = $scope.fromData || [];
                        $scope.dataResult = $scope.dataResult || [];//对外暴露的结果数据
                        if (!$scope.productJson) {
                            return;
                        }
                        //后端推过来的结果 与提交的结果完全一致的数据结构
                        //$scope.fromData = [{data: [], state: 0, productId: 1}, {data: [], productId: 11}, {data: [], productId: 111}, {data: [], productId: 1111}, {data: [], productId: 11111}];
                        //JSON格式转换
                        //logic位置重排序
                        _.each($scope.productJson.logics, function (item, i) {
                            item.index = _.findIndex($scope.productJson.products, {productId: item.attr.productId});
                            if ($scope.productJson.defaultStatus) {
                                var findDefault = _.findWhere($scope.productJson.defaultStatus, {productId: item.attr.productId});
                                if (findDefault) {
                                    item.currState = findDefault.state;
                                }
                            }
                        });
                        $scope.productJson.logics = $scope.productJson.logics.sort(function (a, b) {
                            return a.index - b.index;
                        });

                        //循环拿到想要的产品模型
                        for (var i = 0; i < $scope.productJson.logics.length; i++) {
                            var logic = $scope.productJson.logics[i];
                            var product = {logic: logic, productId: logic.attr.productId};
                            product.index = _.findIndex($scope.productJson.products, {productId: product.productId});
                            changeState(product);
                        }

                        //产品复选框
                        $scope.productCheckboxs = _.map($scope.productJson.products, function (item, i) {
                            var findProduct = _.findWhere($scope.fromData, {productId: item.productId});
                            item.show = !!findProduct;
                            return {id: item.productId, text: item.text, checked: !!findProduct, canCancel: findProduct ? findProduct.canCancel : undefined};
                        });
                        //初始化数据对复选框进行操作

                        //对复选框进行操作
                        _.each($scope.productCheckboxs, function (item, i) {
                            //初始数据填充
                            var findDataItem = _.findWhere($scope.initData, {productId: item.id});
                            if (findDataItem) {
                                item.checked = findDataItem.check;
                                item.canCancel = findDataItem.canCancel;
                                var findProduct = _.findWhere($scope.products, {productId: item.id});
                                if (findProduct) {
                                    findProduct.show = findDataItem.check;
                                }
                                ////同步改变对应的结果值上的属性
                                var dataResultItem = _.findWhere($scope.dataResult, {productId: item.id});
                                if (dataResultItem) {
                                    dataResultItem.show = findProduct.show;
                                    dataResultItem.canCancel = item.canCancel;
                                }
                            }
                            //上次填写数据填充
                            var fromDataItem = _.findWhere($scope.fromData, {productId: item.id});
                            if (fromDataItem) {
                                item.checked = true;
                                item.canCancel = fromDataItem.canCancel;
                                var findProduct = _.findWhere($scope.products, {productId: item.id});
                                if (findProduct) {
                                    findProduct.show = fromDataItem.show;
                                }
                                ////同步改变对应的结果值上的属性
                                var dataResultItem = _.findWhere($scope.dataResult, {productId: item.id});
                                if (dataResultItem) {
                                    dataResultItem.show = findProduct.show;
                                    dataResultItem.canCancel = item.canCancel;
                                }
                            }
                        });
                    }

                    //改变产品的状态　　　
                    function changeState(product, state) {
                        wrapperReset();
                        var find = _.findWhere($scope.fromData, {productId: product.productId});
                        var findInitData = _.findWhere($scope.initData || [], {productId: product.productId});
                        //不再直接替换成结果data而是用采用结果data去赋值给原始data 最终取值使用原始data
                        _.each(product.logic.data, function (item, i) {
                            var rData = null;
                            //先赋初始化数据
                            if (findInitData && findInitData.data) {
                                rData = _.findWhere(findInitData.data, {name: item.name});
                                if (rData && !checkUN(rData.value)) {
                                    item.value = rData.value;
                                }
                                if (rData && !checkUN(rData.valueItems)) {
                                    item.valueItems = rData.valueItems;
                                }
                            }
                            if (find && find.data) {
                                //再赋保存的数据
                                rData = _.findWhere(find.data, {name: item.name});
                                if (rData && !checkUN(rData.value)) {
                                    item.value = rData.value;
                                }
                                if (rData && !checkUN(rData.valueItems)) {
                                    item.valueItems = rData.valueItems;
                                }
                            }
                        });

                        if (find && !checkUN(find.state)) { //结果数据会可能修改状态
                            product.logic.currState = find.state;
                        }
                        if (!checkUN(state)) {//传参过来的状态
                            product.logic.currState = state;
                        }
                        var stateData = getStateCombine(product.logic, product);//所有的状态
                        product.states = stateData.visibleStates;//可见的状态
                        var findIndex = _.findIndex($scope.products, {productId: product.productId});
                        if (findIndex >= 0) {
                            $scope.products[findIndex] = product;
                        } else {
                            $scope.products.push(product);
                        }
                        //处理返回结果
                        var findIndex = _.findIndex($scope.dataResult, {productId: product.productId});
                        var returnProductData = {productId: product.productId, data: product.logic.data, state: product.logic.currState || 0, show: product.show};
                        if (findIndex >= 0) {
                            $scope.dataResult[findIndex] = returnProductData;
                        } else {
                            $scope.dataResult.push(returnProductData);
                        }
                    }

                   //如果用户快速点击复选框在DOM没渲染成功的时候就执行了第二次重组会发生意想不到的事件，所有要避免用户狂点击，数组变动过快
                    //复选框选中事件
                    $scope.checkProduct = function (checked, checkbox) {
                       $scope.checkboxDisabled=true;
                        $timeout(function () {
                            var findProduct = _.findWhere($scope.products, {productId: checkbox.id});
                            findProduct.show = checked;
                            //同步改变对应的结果值上的属性
                            var dataResultItem = _.findWhere($scope.dataResult, {productId: checkbox.id});
                            dataResultItem && (dataResultItem.show = findProduct.show);
                            wrapperReset();
                            $scope.checkboxDisabled=false;
                        }, 300);
                    };
                    //视图中渲染的结构  进行状态合并
                    function getStateCombine(logic, product) {
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
                                if (checkUN(findData.value)) {
                                    findData.value = newState.value.value || '';
                                }
                                newState.value.valueData = findData;
                                if ($scope.isUserControl && newState.value.valueData.readonly === true && !newState.readonly) {//在用户操作的值清空逻辑
                                    newState.value.valueData.value = '';
                                }
                                newState.value.valueData.hidden = newState.hidden;//由于数据是固定的而结构经常在变动 部分状态保存在data上
                                newState.value.valueData.readonly = newState.readonly;
                            }
                            switchSetStateValue(newState, product);//数据赋值逻辑
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

                    //分支判断为状态赋值
                    function switchSetStateValue(newState, product) {
                        switch (newState.value.type) {
                            case 'ajax':
                            {
                                ajaxSetValue(newState.value, product);
                            }
                                break;
                            case 'normal'://普通赋值由由结构中向数据赋值
                            {
                                newState.value.valueData.value = newState.value.value;
                            }
                                break;
                            case 'copy'://指定data里的一个值赋给这个值
                            {
                                newState.value.valueData.value = getValueForSwitchValueType(newState.value.valueType, newState.value.valueRef, product)
                            }
                                break;
                        }
                    }

                    //检查是undefined或者null
                    function checkUN(value) {
                        return value === undefined || value === null;
                    }

                    //end JSON格式转换


                    $scope.deleteArray = function (items, index) {
                        if (items && items.length > 0) {
                            items.splice(index, 1);
                        }
                    };
                    $scope.clickMe = function () {
                    };

                    //控制值改变时事件  fieldStruct 元素的模型
                    $scope.fieldChange = function (fieldStruct, product, form) {
                        $scope.isUserControl = true;
                        //执行事件
                        fieldStruct.onchange = fieldStruct.onchange || [];
                        //重新确实权重 确保ajax在最后被调用  priority优先级数越高越先调用
                        for (var i = 0; i < fieldStruct.onchange.length; i++) {
                            var changeItem = fieldStruct.onchange[i];
                            if (changeItem.type == 'ajax') {
                                changeItem.priority = 1;
                            } else {
                                changeItem.priority = 2;
                            }
                        }
                        //根据权重重新排序
                        fieldStruct.onchange = fieldStruct.onchange.sort(function (a, b) {
                            return b.priority - a.priority;
                        });
                        for (var i = 0; i < fieldStruct.onchange.length; i++) {
                            var changeItem = fieldStruct.onchange[i];
                            done(changeItem);
                        }
                        setTimeout(function () {
                            $scope.$apply();
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
                                    ajaxSetValue(changeItem, product);
                                }
                                    ;
                            }
                        }
                    };
                    //ajax赋值操作
                    function ajaxSetValue(changeItem, product) {
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
                    };
                    //根据ajax返回的值向数据中赋值
                    function setResponse(data, changeItem, product) {
                        $timeout(function () {
                            if (changeItem.backName && changeItem.valueData) {//单一数据来源赋值
                                changeItem.valueData.value = data[changeItem.backName];
                            }
                            else if (changeItem.response.writeBackType == 'merge') {//合并到data上
                                _.each(data, function (value, key) {
                                    var findData = _.findWhere(product.logic.data, {name: key});
                                    findData && (findData.value = value);
                                });
                            }
                            else if (changeItem.response.writeBackType == 'mapping' && changeItem.response.mapper) {//映射合并
                                for (var i = 0; i < changeItem.response.mapper.length; i++) {
                                    var mapperItem = changeItem.response.mapper[i];
                                    setMappingValue(data, mapperItem, product);
                                }
                            }
                        }, 10);
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
                                break;
                            case 'attr':
                            {
                                product.logic.attr[mapperItem.valueRef] = responseData[mapperItem.name];

                            }
                                ;
                                break;
                            case 'global':
                            {
                                $scope.productJson.global[mapperItem.valueRef] = responseData[mapperItem.name];
                            }
                                ;
                                break;
                        }
                    }

                    //根据赋值类型进行赋值
                    function evaluationForValueType(changeItem, fieldStruct, product) {
                        switch (changeItem.valueType) {
                            case 'data':
                            {
                                //从data中赋值
                                var find = _.findWhere(product.logic.data, {name: changeItem.target});
                                setValueForSource(changeItem, find, {data: true}, fieldStruct);
                            }
                                ;
                                break;

                            case 'attr':
                            {
                                setValueForSource(changeItem, product.logic.attr, {attr: true}, fieldStruct);
                            }
                                ;
                                break;
                            case 'global':
                            {
                                //从global中赋值
                                setValueForSource(changeItem, $scope.productJson.global, {global: true}, fieldStruct);
                            }
                                ;
                                break;
                            case 'state':
                            {   //改变状态
                                setStateForSource(changeItem, fieldStruct, product);
                            }
                                ;
                                break;
                        }
                    }

                    //设置状态
                    function setStateForSource(changeItem, fieldStruct, product) {
                        _.each(fieldStruct.items, function (n) {//目前只有拥有 items属性的元素才会有可能改变状态
                            var findState = n[changeItem.source];
                            if (findState !== undefined && n.value == fieldStruct.value.valueData.value) {
                                changeState(product, findState);
                            }
                        })
                    }

                    //end 设置状态

                    //根据源不同 去给对象赋值
                    function setValueForSource(changeItem, findData, DataIs, fieldStruct) {
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

                    //获取推送到后端的数据
                    function getQueryData(querys, product) {
                        var data = {};
                        for (var i = 0; i < querys.length; i++) {
                            var queryItem = querys[i];
                            if (!checkUN(queryItem.value)) {//支持直接在验证项上添加固定值
                                data[queryItem.name] = queryItem.value;
                            } else {
                                var findValue = getValueForSwitchValueType(queryItem.valueType, queryItem.valueRef, product);
                                data[queryItem.name] = findValue;
                            }
                        }
                        return data;
                    }

                    //根据不同的拿值类型拿值
                    function getValueForSwitchValueType(valueType, refName, product) {
                        var value = null;
                        switch (valueType) {
                            case 'data':
                            {
                                try {
                                    var findData = _.findWhere(product.logic.data, {name: refName});
                                    value = findData.value;
                                } catch (e) {
                                    debugger
                                    throw new error("数据上未配置这个关联名称:" + refName);
                                }
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
                                value = $scope.productJson.global[refName];
                            }
                                ;
                                break;
                        }
                        return value;
                    }

                    //获取对应的验证值  如果验证项上有value属性且不为空  则优先使用
                    $scope.getValidateValue = function (validateName, fieldStruct, product) {
                        if (fieldStruct.validate && fieldStruct.validate[validateName]) {
                            var result = null;
                            var validateItem = fieldStruct.validate[validateName];
                            if (!checkUN(validateItem.value)) {
                                result = validateItem.value;
                            } else {
                                result = getValueForSwitchValueType(validateItem.valueType, validateItem.valueRef, product);
                            }
                            return result;
                        }
                    };
                    //弹窗选择 添加销售
                    $scope.selectSalesmenDialog = function (array) {
                        productService.selectSalesmenDialog(array, $timeout);
                    };
                    //弹窗选择 添加跟进人
                    $scope.selectPartnersDialog = function (array) {
                        productService.selectPartnersDialog(array, $timeout);
                    };
                }]
            }
        }
    )
    ;
})
;