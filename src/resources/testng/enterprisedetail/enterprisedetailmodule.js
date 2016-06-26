define(function (require, exports, module) {
    require('common/widget/select2/select2');
    require('./refs/directives');
    var myApp = angular.module('formApp', ['angular.filter', 'ngMessages', 'common.directives']);
    require('./refs/products-directive');
    require('./refs/product-services');//对应的远程服务
    var dialogManager = require('./refs/dialog');

    var mainCtrlScope = null;
    var mainData = null;
    var Page = MClass(M.Center).include({
        view: require('./template.html'),
        init: function (data) {
            var me = this;
            mainData = data;
            Page.__super__.init.apply(me, arguments);

            angular.bootstrap(me.$view, ['formApp']);
            me.mainCtrlScope = null;
        },
        //渲染
        render: function () {
            this.attrs['wrapper'].empty().append(this.$view);
        },
        hideTopBar: function () {
            var me = this;
            if (mainCtrlScope) {
                mainCtrlScope.$apply(function () {
                    mainCtrlScope.hideTopBar = true;
                });
            }
        },
        hideFootBtns: function () {
            var me = this;
            if (mainCtrlScope) {
                mainCtrlScope.$apply(function () {
                    mainCtrlScope.hideFootBtns = true;
                });
            }
        },
        nextStep: function () {
            mainCtrlScope.$apply(function () {
                mainCtrlScope.nextStep()
            });
        },
        prevStep: function () {
            mainCtrlScope.$apply(function () {
                mainCtrlScope.prevStep();
            });
        },
        goToStep: function (step) {//跳到指定的某一步
            if (step && step > 0 && step <= 3) {
                mainCtrlScope.$apply(function () {
                    mainCtrlScope.step = step;
                });
            }
        }
    });

    module.exports = Page;
    myApp.controller('form1Controller', ['$scope', '$timeout', function ($scope, $timeout) {

    }]);
    myApp.controller('form2Controller', ['$scope', 'productService', function ($scope, productService) {
        //产品已购信息
        $scope.productInfos = [];
        //||'ceshishur3'
        productService.getOrderList($scope.globalInfo.enterpriseAccount, function (data) {
            $scope.$apply(function () {
                $scope.productInfos = data;
            });
        });
        productService.getDiyOrderFormLogic($scope.globalInfo.enterpriseId || '', function (data) {
            debugger
            $scope.$apply(function () {
                $scope.productJson = angular.fromJson(data);
            });
        });
    }]);
    myApp.controller('form3Controller', ['$scope', 'productService', 'select2Query', function ($scope, productService, select2Query) {
        $scope.bankAjaxConfig = select2Query.getBankAjaxConfig();
        //付款信息
        var payInfo = $scope.payInfo;//从mainController拿到的对象
        // payInfo.receiptsAccount = 'xxxxxxxxxxxxxx';
        //payInfo.partReadonly=true;
        //$scope.payInfo.productList = [{currPayAmount: 1, productId: 1, productName: 'CRM分期', purchaseAmount: 555, toAgent: true}, {currPayAmount: 7, productId: 7, productName: '工资助手分期', purchaseAmount: 666}];
        $scope.payInfo.productList = $scope.payInfo.productList || [];
        var contractPrice = 0;
        _.each($scope.payInfo.productList, function (item) {
            if (item.purchaseAmount) {
                contractPrice += item.purchaseAmount;
            }
        });
        $scope.payInfo.contractPrice = contractPrice;

        $scope.testResult3 = function (form) {

        };
        //付款状态改变事件
        $scope.payStatusChange = function (value) {
            _.each($scope.payInfo.productList, function (item, i) {
                item.currPayAmount = 0;
            });
            switch (value.toString()) {
                case '1':
                {
                    //全额
                    var agentPrice = 0;
                    var companyPrice = 0;
                    _.each($scope.payInfo.productList, function (item, i) {
                        if (item.toAgent) {
                            agentPrice += parseFloat(item.purchaseAmount);
                        } else {
                            companyPrice += parseFloat(item.purchaseAmount)
                        }
                    });
                    payInfo.agentCurrPayAmount = agentPrice;
                    payInfo.currPayAmount = companyPrice;
                }
                    ;
                    break;
                case '2':
                {
                    //未付
                    payInfo.agentCurrPayAmount = 0;
                    payInfo.currPayAmount = 0;
                }
                    ;
                    break;
                case '3':
                {
                    //分期
                    payInfo.agentCurrPayAmount = 0;
                    payInfo.currPayAmount = 0;
                }
                    ;
                    break;
            }
        };
        $scope.payStatusChange(payInfo.payStatus);
        //分期金额值改变事件
        $scope.currPayAmountChange = function (productList) {
            var agentPrice = 0;
            var companyPrice = 0;
            _.each(productList, function (item, i) {
                if (item.toAgent) {
                    agentPrice += parseFloat(item.currPayAmount);
                } else {
                    companyPrice += parseFloat(item.currPayAmount)
                }
            });
            payInfo.agentCurrPayAmount = agentPrice;
            payInfo.currPayAmount = companyPrice;
        };
        $scope.getDataByContractNo = function (value) {
            debugger
            productService.getDataByContractNo({contractNo: value}, function (result) {
                if (!result) {//合同号不可用
                    $scope.$apply(function () {
                        $scope.payInfo.contractNo = '';
                    });
                }
            })
        };
        //receiptsAccountConfig
        //总部到款账户
        $scope.receiptsAccountConfig = {
            //data: [{id: '1-1-1', text: '昌平区'}, {id: '2-1-1', text: '浦东区'}, {id: '3-1-1', text: '宝安区'}, {id: '4-1-1', text: '汉口'}, {id: '4-2-1', text: '黄梅县'}],
            data: [],
            multiple: false,
            placeholder: '必须与实际打款的单位/个人名称一致',
            search: false
        };
    }]);


    myApp.directive('testValidate', function () {
        return {
            scope: {ngModel: '=', condition: '='},
            link: function (scope, iElem, iAttr) {


            }
        }
    });
    myApp.controller('mainController', ['$scope', '$timeout', 'select2Query', 'getEnumService', 'cascadeSelectService', 'productService', function ($scope, $timeout, select2Query, getEnumService, cascadeSelectService, productService) {
        var globalInfo = $scope.globalInfo = {};
        //企业详情信息
        var entInfo = $scope.entInfo = {};
        //产品信息模块
        var productInfo = $scope.productInfo = {};
        //付款信息
        var payInfo = $scope.payInfo = {payStatus: 1};
        //全局行为状态
        var action = $scope.action = {doing: false};
        //模拟数据
        entInfo = $scope.entInfo = {"province": "110000", "city": "110100", "county": "110102", "provinceDataValue": "", "cityDataValue": {"id": "110100", "text": "市辖区"}, "countyDataValue": {"id": "110102", "text": "西城区"}, "industryFirst": "100", "industrySecond": "122", "industryThird": "127", "industryFirstDataValue": "", "industrySecondDataValue": {"id": "122", "text": "计算机软件"}, "industryThirdDataValue": {"id": "127", "text": "办公软件"}, "groupType": "3", "groupTypeDataValue": {"text": "全公司", "id": "3"}, "saleTeamScale": "2", "saleTeamScaleDataValue": {"text": "1-5人", "id": "2"}, "isSaleTeam": "0", "isSaleTeamDataValue": {"id": "0", "text": "否"}, "companyScale": "4", "companyScaleDataValue": {"text": "11-20人", "id": "4"}, "isReferral": "0", "isReferralDataValue": {"id": "0", "text": "否"}, "isReference": "0", "isReferenceDataValue": {"id": "0", "text": "否"}, "keyContactName": "7676", "keyContactPhone": "567576", "contactName": "765576", "contactPhone": "576576", "address": "765576", "enterpriseName": "576576", "area": "576576", "enterpriseAccount": "F234554", "keyContactEmail": "765576@fds.gfh", "contactEmail": "756756@gbfc.df", "contactIm": "434343"};
        //

        mainCtrlScope = $scope;


        $scope.enterpriseReadonly = false;//企业详情信息 只读
        $scope.payInfoReadonly = false;//企业详情信息 只读
        $scope.productReadonly = false;//产品信息 只读
        $scope.testBasicForm = function () {
        };

        //多功能下拉选框
        //$scope.entInfo.province = '110000';
        //$scope.entInfo.city = '140000';
        //$scope.entInfo.county = '110000';

        $scope.entInfo.provinceDataValue = '';
        $scope.entInfo.cityDataValue = '';
        $scope.entInfo.countyDataValue = '';

        $scope.provinceConfig = {
            //data: [{id: 1, text: '北京'}, {id: 2, text: '上海'}, {id: 3, text: '广东'}, {id: 4, text: '湖北'}],
            data: [],
            multiple: false,
            placeholder: '请选择'
            //, minimumResultsForSearch: Infinity//不显示搜索框
            ,
            search: false
        };

        $scope.cityConfig = {
            //data: [{id: '1-1', text: '北京市'}, {id: '2-1', text: '上海市'}, {id: '3-1', text: '深圳'}, {id: '4-1', text: '武汉'}, {id: '4-2', text: '黄冈'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            search: false
        };
        $scope.countyConfig = {
            //data: [{id: '1-1-1', text: '昌平区'}, {id: '2-1-1', text: '浦东区'}, {id: '3-1-1', text: '宝安区'}, {id: '4-1-1', text: '汉口'}, {id: '4-2-1', text: '黄梅县'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            search: false
        };
        cascadeSelectService.cascadeSelect($scope, [
            {ngModelName: 'entInfo.province', config: $scope.provinceConfig},
            {ngModelName: 'entInfo.city', config: $scope.cityConfig},
            {ngModelName: 'entInfo.county', config: $scope.countyConfig}
        ], cascadeSelectService.createPullFunc({url: '~/op/api/district/getListByParent', data: {name: 'parentValue'}}, function (data, item) {
            data.push({id: item.value.toString(), text: item.name});
        }));
        //end多功能下拉选框　


        //多功能下拉选框　行业
        //entInfo.industryFirst = '100';
        //entInfo.industrySecond = '150';
        //entInfo.industryThird = '100';

        entInfo.industryFirstDataValue = '';
        entInfo.industrySecondDataValue = '';
        entInfo.industryThirdDataValue = '';


        $scope.industryFirstConfig = {
            //data: [{id: 1, text: '行业A'}, {id: 2, text: '行业B'}, {id: 3, text: '行业C'}, {id: 4, text: '行业D'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            search: false
        };

        $scope.industrySecondConfig = {
            // data: [{id: '1-1', text: '行业A－1'}, {id: '2-1', text: '行业B－1'}, {id: '3-1', text: '行业C－1'}, {id: '4-1', text: '行业D－1'}, {id: '4-2', text: '行业D－2'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            search: false
        };
        $scope.industryThirdConfig = {
            //data: [{id: '1-1-1', text: '行业A－1－1'}, {id: '2-1-1', text: '行业B－1－1'}, {id: '3-1-1', text: '行业C－1－1'}, {id: '4-1-1', text: '行业D－1－1'}, {id: '4-2-1', text: '行业D－1－2'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            search: false
        };
        cascadeSelectService.cascadeSelect($scope, [
            {ngModelName: 'entInfo.industryFirst', config: $scope.industryFirstConfig},
            {ngModelName: 'entInfo.industrySecond', config: $scope.industrySecondConfig},
            {ngModelName: 'entInfo.industryThird', config: $scope.industryThirdConfig}
        ]);
        //end 多功能下拉选框　行业

        //公司规模
        $scope.companyScaleConfig = {
            data: [],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        getEnumService.load('CAMPANY_SCALE', function (list) {
            $scope.$apply(function () {
                $scope.companyScaleConfig.data = list;
                $scope.companyScaleConfig.placeholder = '请选择';
            });
        });
        //使用对象类型
        $scope.groupTypeConfig = {
            data: [],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        //使用对象类型
        getEnumService.load('GROUP_TYPE', function (list) {
            $scope.$apply(function () {
                $scope.groupTypeConfig.data = list;
                $scope.groupTypeConfig.placeholder = '请选择';
            });
        });
        //是否有销售团队
        $scope.isSaleTeamConfig = {
            data: [{id: '1', text: '是'}, {id: '0', text: '否'}],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        //销售团队规模
        $scope.saleTeamScaleConfig = {
            //data: [{id: '1-1-1', text: '行业A－1－1'}, {id: '2-1-1', text: '行业B－1－1'}, {id: '3-1-1', text: '行业C－1－1'}, {id: '4-1-1', text: '行业D－1－1'}, {id: '4-2-1', text: '行业D－1－2'}],
            data: [],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        getEnumService.load('SALE_TEAM_SCALE', true, function (list) {
            $scope.$apply(function () {
                $scope.saleTeamScaleConfig.data = list;
                $scope.saleTeamScaleConfig.placeholder = '请选择';
            });
        });
        //是否转介绍
        $scope.isReferralConfig = {
            data: [{id: '1', text: '是'}, {id: '0', text: '否'}],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        //是否标杆
        $scope.isReferenceConfig = {
            data: [{id: '1', text: '是'}, {id: '0', text: '否'}],
            multiple: false,
            placeholder: '请选择',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };

        $scope.testResult = function () {
            util.api({
                data: {},
                url: '/odr/receivedpay/list',
                success: function (result) {
                    debugger


                }
            });
            $scope.selectDialog();
        };
        $scope.selectDialog = function (array) {
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
                    content: require('./refs/dialogtemplate.html')
                }
            );
            dialog.bootstrap(['common.directives', 'common.services'], function (app) {
                app.controller('dialogController', ['$scope', function ($scope) {
                    var vm = this;
                    vm.config = accountConfig;
                    vm.ngModel = null;
                    vm.select2Model = null;
                    vm.placeholder = '请选择...';
                    vm.clickEnter = function () {
                        array && array.push(vm.select2Model);
                    };
                    vm.clickCancel = function () {

                    }
                }]);
            });
            dialog.show();
        };
        $scope.saving = false;
        $scope.step = 1;//步骤
        $scope.prevStep = function () {
            $scope.step--;
        };
        $scope.nextStep = function (form) {
            debugger
            if ($scope.step == 1) {//企业详情界面
                //if (form.$invalid) {
                //    $scope['step_' + $scope.step + '_validate_error'] = true;
                //    return;
                //}
            }
            switch ($scope.step) {
                case 1:
                {//企业详情界面
                    submitStepEntInfo(function (result) {
                        debugger
                        if (result.success) {
                            $scope.$apply(function () {
                                var data = result.value.model;
                                $scope.entInfo.draftEnterpriseId = data.id;
                                $scope.productInfo.draftEnterpriseId = data.id;
                                $scope.payInfo.draftEnterpriseId = data.id;
                                debugger
                                $scope.productInfo.initData = data.initData;
                                $scope.step++;
                            });
                        }
                    });
                    return;
                }
                    ;
                    break;
                case 2:
                {//产品信息
                    submitStepProductInfo(function (result) {
                        debugger
                        if (result.success) {
                            $scope.$apply(function () {
                                var data = result.value.model;
                                $scope.productInfo.draftOrderId = data.draftOrderId;
                                $scope.payInfo.draftOrderId = data.draftOrderId;
                                $scope.payInfo.productList = data.productList;
                                $scope.step++;
                            });
                        }
                    });
                    return;
                }
                    ;
                    break;
            }
            //$scope.step++;
        };
        //企业草稿提交  需要enterpriseAccount
        function submitStepEntInfo(callback) {
            action.doing = true;
            util.api({
                url: "~/op/api/a/odrDraft/draftEnterpriseNext",
                data: {odrDraftEnterprise: angular.toJson(angular.extend({enterpriseAccount: null}, $scope.entInfo))},
                success: function (result) {
                    callback(result);
                },
                complete: function () {
                    $scope.$apply(function () {
                        action.doing = false;
                    });
                }
            })
        }

        //订单草稿  需要 enterpriseId
        function submitStepProductInfo(callback) {
            debugger
            action.doing = true;
            //数据二次处理
            var dataResultCopy = angular.copy($scope.productInfo.dataResult);
            var newDataResult = [];
            _.each(dataResultCopy, function (item) {
                item.show && (newDataResult.push(item));
                var tempData = [];
                _.each(item.data, function (dataItem) {
                    dataItem.hidden !== true && (tempData.push(dataItem));
                    delete dataItem.hidden;
                });
                item.data = tempData;
            });
            util.api({
                url: "~/op/api/a/odrDraft/draftOrderNext",
                data: {
                    odrDraftOrder: angular.toJson({
                        enterpriseId: null,
                        draftEnterpriseId: $scope.productInfo.draftEnterpriseId,
                        id: $scope.productInfo.draftOrderId,
                        content: angular.toJson(newDataResult)
                    })
                },
                success: callback,
                complete: function () {
                    $scope.$apply(function () {
                        action.doing = false;
                    });
                }
            })
        }

        //付款信息
        function submitStepPayInfo(callback) {
            debugger
            action.doing = true;
            util.api({
                url: "~/op/api/a/odrDraft/draftPaidInfoNext",
                data: {odrDraftPaidInfo: angular.toJson($scope.payInfo), submitType: mainData.type},
                success: callback,
                complete: function () {
                    $scope.$apply(function () {
                        action.doing = false;
                    });
                }
            })
        }

        $scope.save = function () {
            //付款信息
            submitStepPayInfo(function (result) {
                debugger
                if (result.success) {
                    alert('操作成功');
                }
            });
            return;
        };
        $scope.close = function () {
            IBSS.tplEvent.trigger('order1.2Close');
        };
    }]);

});