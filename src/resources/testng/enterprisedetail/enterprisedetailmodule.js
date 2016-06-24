define(function (require, exports, module) {
    require('common/widget/select2/select2');
    require('./refs/directives');
    var myApp = angular.module('formApp', ['angular.filter', 'ngMessages', 'common.directives']);
    require('./refs/products-directive');
    require('./refs/product-services');//对应的远程服务
    var dialogManager = require('./refs/dialog');

    var mainCtrlScope = null;
    var Page = MClass(M.Center).include({
        view: require('./template.html'),
        init: function () {
            var me = this;
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
        }
    });

    module.exports = Page;


    myApp.controller('form1Controller', ['$scope', '$timeout', function ($scope, $timeout) {

    }]);
    myApp.controller('form2Controller', ['$scope', function ($scope) {


    }]);
    myApp.controller('form3Controller', ['$scope', function ($scope) {

    }]);


    myApp.directive('testValidate', function () {
        return {
            scope: {ngModel: '=', condition: '='},
            link: function (scope, iElem, iAttr) {


            }
        }
    });
    myApp.controller('mainController', ['$scope', '$timeout', 'select2Query', 'getEnumService', function ($scope, $timeout, select2Query, getEnumService) {

        mainCtrlScope = $scope;
        //产品已购信息
        $scope.productInfos = [[{name: '培训人数', value: 'xxxx'}], [{name: 'CRM用户数', value: 'xxxx'}, {name: false, value: '2016年-2017年'}]];

        //付款信息
        var payInfo = $scope.payInfo = {payStatus: 1};
        $scope.testResult3 = function (form) {

        };
        $scope.currPayAmountList = [{currPayAmount: 1, productId: 1, productName: 'CRM分期', purchaseAmount: 555}, {currPayAmount: 7, productId: 7, productName: '工资助手分期', purchaseAmount: 666}];
        //receiptsAccountConfig
        //总部到款账户
        $scope.receiptsAccountConfig = {
            //data: [{id: '1-1-1', text: '昌平区'}, {id: '2-1-1', text: '浦东区'}, {id: '3-1-1', text: '宝安区'}, {id: '4-1-1', text: '汉口'}, {id: '4-2-1', text: '黄梅县'}],
            data: [],
            multiple: false,
            placeholder: '加载中...',
            search: false,
            defaultValue: '110000',
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        //特殊条款
        $scope.specialClausesConfig = {
            //data: [{id: '1-1-1', text: '昌平区'}, {id: '2-1-1', text: '浦东区'}, {id: '3-1-1', text: '宝安区'}, {id: '4-1-1', text: '汉口'}, {id: '4-2-1', text: '黄梅县'}],
            data: [],
            multiple: false,
            placeholder: '加载中...',
            search: false,
            defaultValue: '110000',
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        //企业详情信息
        var entInfo = $scope.entInfo = {};
        $scope.enterpriseReadonly = false;//企业详情信息 只读
        $scope.payInfoReadonly = false;//企业详情信息 只读
        $scope.productReadonly = false;//产品信息 只读
        $scope.testBasicForm = function () {
        };

        //多功能下拉选框
        $scope.entInfo.province = '130000';
        $scope.entInfo.city = '150000';
        $scope.entInfo.county = '130000';

        $scope.entInfo.provinceDataValue = '';
        $scope.entInfo.cityDataValue = '';
        $scope.entInfo.countyDataValue = '';
        $scope.accountConfig = {
            //data: [{id: 1, text: '111111111111111'}, {id: 2, text: '22222222222'}, {id: 3, text: '3333333333'}, {id: 4, text: '支付宝'}],
            data: [],
            multiple: false,
            placeholder: '必须与实际打款的单位/个人名称一致',
            search: false
        };
        $scope.provinceConfig = {
            //data: [{id: 1, text: '北京'}, {id: 2, text: '上海'}, {id: 3, text: '广东'}, {id: 4, text: '湖北'}],
            data: [],
            multiple: false,
            placeholder: '加载中...'
            //, minimumResultsForSearch: Infinity//不显示搜索框
            ,
            search: false,
            defaultValue: '110000'
        };

        $scope.cityConfig = {
            //data: [{id: '1-1', text: '北京市'}, {id: '2-1', text: '上海市'}, {id: '3-1', text: '深圳'}, {id: '4-1', text: '武汉'}, {id: '4-2', text: '黄冈'}],
            data: [],
            multiple: false,
            placeholder: '加载中...',
            search: false,
            defaultValue: '110000'
        };
        $scope.countyConfig = {
            //data: [{id: '1-1-1', text: '昌平区'}, {id: '2-1-1', text: '浦东区'}, {id: '3-1-1', text: '宝安区'}, {id: '4-1-1', text: '汉口'}, {id: '4-2-1', text: '黄梅县'}],
            data: [],
            multiple: false,
            placeholder: '加载中...',
            search: false,
            defaultValue: '110000'
        };
        cascadeSelect([
            {ngModelName: 'entInfo.province', config: $scope.provinceConfig},
            {ngModelName: 'entInfo.city', config: $scope.cityConfig},
            {ngModelName: 'entInfo.county', config: $scope.countyConfig}
        ], createPullFunc({url: '~/op/api/district/getListByParent', data: {name: 'parentValue'}}, function (data, item) {
            data.push({id: item.value.toString(), text: item.name});
        }));
        //end多功能下拉选框　


        //多功能下拉选框　行业
        entInfo.industryFirst = '';
        entInfo.industrySecond = '';
        entInfo.industryThird = '';

        entInfo.industryFirstDataValue = '';
        entInfo.industrySecondDataValue = '';
        entInfo.industryThirdDataValue = '';


        $scope.industryFirstConfig = {
            //data: [{id: 1, text: '行业A'}, {id: 2, text: '行业B'}, {id: 3, text: '行业C'}, {id: 4, text: '行业D'}],
            data: [],
            multiple: false,
            placeholder: '加载中...',
            search: false,
            defaultValue: '100'
        };

        $scope.industrySecondConfig = {
            // data: [{id: '1-1', text: '行业A－1'}, {id: '2-1', text: '行业B－1'}, {id: '3-1', text: '行业C－1'}, {id: '4-1', text: '行业D－1'}, {id: '4-2', text: '行业D－2'}],
            data: [],
            multiple: false,
            placeholder: '加载中...',
            defaultValue: '150',
            search: false
        };
        $scope.industryThirdConfig = {
            //data: [{id: '1-1-1', text: '行业A－1－1'}, {id: '2-1-1', text: '行业B－1－1'}, {id: '3-1-1', text: '行业C－1－1'}, {id: '4-1-1', text: '行业D－1－1'}, {id: '4-2-1', text: '行业D－1－2'}],
            data: [],
            multiple: false,
            placeholder: '加载中...',
            defaultValue: '100',
            search: false
        };

        cascadeSelect([
            {ngModelName: 'entInfo.industryFirst', config: $scope.industryFirstConfig},
            {ngModelName: 'entInfo.industrySecond', config: $scope.industrySecondConfig},
            {ngModelName: 'entInfo.industryThird', config: $scope.industryThirdConfig}
        ]);
        //{ngModelName:'',config}
        //级联下拉列表
        function cascadeSelect(selectConfigs, remotePullFunc) {
            var remotePullFunc = remotePullFunc || createPullFunc();
            for (var i = 0; i < selectConfigs.length; i++) {
                var selectConfig = selectConfigs[i];
                var nextSelectConfig = selectConfigs.length > i + 1 ? selectConfigs[i + 1] : null;
                (function (i, total, selectConfig, nextSelectConfig) {
                    $scope.$watch(selectConfig.ngModelName, function (newValue, oldValue, scope) {
                        if (i > 0 && !selectConfig.config.auto) {
                            return;
                        }
                        if (newValue != oldValue) {
                            if (i !== total - 1 && nextSelectConfig) {
                                nextSelectConfig.config.data = [];
                                eval('$scope.' + nextSelectConfig.ngModelName + '= ""');
                                nextSelectConfig.config.auto = true;
                                newValue && remotePullFunc(nextSelectConfig.config, getEvalValue(selectConfig.ngModelName), function () {
                                    exeConfig(nextSelectConfig);
                                });
                            }
                        }
                    });
                })(i, selectConfigs.length, selectConfig, nextSelectConfig);
            }
            var firstSelectConfig = selectConfigs[0];
            remotePullFunc(firstSelectConfig.config, 0, function () {
                exeConfig(firstSelectConfig);
            });
            function exeConfig(seletConfig) {
                eval('$scope.' + seletConfig.ngModelName + '= seletConfig.config.defaultValue');
                seletConfig.config.defaultValue = '';
            }

            function getEvalValue(ngModelName) {
                return $scope.$eval(ngModelName);
            }
        }

        function createPullFunc(options, responseCallback) {
            return function (config, parentValue, cb) {
                options = options || {};
                var defaultOption = {
                    url: '~/op/api/enums/getlistByParent',
                    data: {name: 'INDUSTRY', parentValue: parentValue || 0},
                    success: function (result) {
                        if (result.success) {
                            var data = [];
                            for (var i = 0; i < result.value.model.length; i++) {
                                var item = result.value.model[i];
                                if (responseCallback) {
                                    responseCallback(data, item);
                                } else {
                                    data.push({id: item.value.toString(), text: item.text});
                                }
                            }
                            $scope.$apply(function () {
                                config.placeholder = '请选择';
                                config.data = data;
                                cb && cb(data);
                            });
                        }
                    }
                };
                if (defaultOption.data) {
                    options.data = $.extend(defaultOption.data, options.data);
                }
                util.api($.extend(defaultOption, options));
            }
        }

        //end 多功能下拉选框　行业

        //公司规模
        $scope.companyScaleConfig = {
            data: [],
            multiple: false,
            placeholder: '加载中...',
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
            placeholder: '加载中...',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        getEnumService.load('GROUP_TYPE', function (list) {
            $scope.$apply(function () {
                $scope.companyScaleConfig.data = list;
                $scope.companyScaleConfig.placeholder = '请选择';
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
            placeholder: '加载中...',
            defaultValue: '100',
            search: false,
            minimumResultsForSearch: Infinity//不显示搜索框
        };
        getEnumService.load('SALE_TEAM_SCALE',true, function (list) {
            $scope.$apply(function () {
                $scope.companyScaleConfig.data = list;
                $scope.companyScaleConfig.placeholder = '请选择';
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
            $scope.step++;
        };


        //支付信息

        //end 支付信息
        $scope.save = function () {
            $scope.saving = true;
            $timeout(function () {
                $scope.saving = false;
            }, 2000);
        };
        $scope.close = function () {
            alert('关闭')
        };
    }]);

});