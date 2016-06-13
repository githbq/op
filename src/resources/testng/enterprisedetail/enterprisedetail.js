define(function (require, exports, module) {
    require('common/widget/select2/select2');
    require('./refs/directives');
    var myApp = angular.module('formApp', ['ngMessages', 'common.directives']);
    require('./refs/products-directive');
    require('./refs/product-services');//对应的远程服务
    var dialogManager = require('./refs/dialog');


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


    myApp.controller('mainController', ['$scope', '$timeout', 'select2Query', function ($scope, $timeout, select2Query) {
        var entInfo = $scope.entInfo = {};
        $scope.enterpriseReadonly = false;//企业详情信息 只读
        $scope.payInfoReadonly = false;//企业详情信息 只读
        $scope.ent = {};//企业详情信息
        $scope.testBasicForm = function () {
            debugger
        };

        //多功能下拉选框
        $scope.entInfo.province = '130000';
        $scope.entInfo.city = '150000';
        $scope.entInfo.area = '130000';

        $scope.entInfo.provinceDataValue = '';
        $scope.entInfo.cityDataValue = '';
        $scope.entInfo.areaDataValue = '';
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
            placeholder: '尚无数据'
            // minimumResultsForSearch: Infinity//不显示搜索框
            ,
            search: false
        };

        $scope.cityConfig = {
            //data: [{id: '1-1', text: '北京市'}, {id: '2-1', text: '上海市'}, {id: '3-1', text: '深圳'}, {id: '4-1', text: '武汉'}, {id: '4-2', text: '黄冈'}],
            data: [],
            multiple: false,
            placeholder: '尚无数据',
            search: false
        };
        $scope.areaConfig = {
            //data: [{id: '1-1-1', text: '昌平区'}, {id: '2-1-1', text: '浦东区'}, {id: '3-1-1', text: '宝安区'}, {id: '4-1-1', text: '汉口'}, {id: '4-2-1', text: '黄梅县'}],
            data: [],
            multiple: false,
            placeholder: '尚无数据',
            search: false
        };
        $scope.$watch('entInfo.province', function (newValue, oldValue, scope) {
            debugger
            if (newValue != oldValue) {
                $scope.entInfo.city = '';
                $scope.cityConfig.data = [];
            }
            if ($scope.provinceConfig.data.length == 0) {
                districtPull($scope.provinceConfig);
            }
            if ($scope.entInfo.province) {
                districtPull($scope.cityConfig, $scope.entInfo.province);
            }
        }, true);
        $scope.$watch('entInfo.city', function (newValue, oldValue, scope) {
            debugger
            if (newValue != oldValue) {
                $scope.entInfo.area = '';
                $scope.areaConfig.data = [];
            }
            if ($scope.entInfo.city) {
                districtPull($scope.areaConfig, $scope.entInfo.city);
            }
        }, true);
        function districtPull(config, parentValue) {
            util.api({
                url: '~/op/api/district/getListByParent',
                data: {name: 'parentValue', parentValue: parentValue || 0},
                success: function (result) {
                    if (result.success) {
                        var data = [];
                        for (var i = 0; i < result.value.model.length; i++) {
                            var item = result.value.model[i];
                            data.push({id: item.value, text: item.name});
                        }
                        config.placeholder = '加载完毕';
                        config.data = data;
                        $scope.$apply();
                    }
                }
            })
        }

        //end多功能下拉选框　


        //多功能下拉选框　行业
        entInfo.industry1 = '1';
        entInfo.industry2 = '';
        entInfo.industry3 = '';

        entInfo.industry1DataValue = '';
        entInfo.industry2DataValue = '';
        entInfo.industry3DataValue = '';
        $scope.industry1Config = {
            //data: [{id: 1, text: '行业A'}, {id: 2, text: '行业B'}, {id: 3, text: '行业C'}, {id: 4, text: '行业D'}],
            data: [],
            multiple: false,
            placeholder: '尚无数据',
            search: false
        };

        $scope.industry2Config = {
            // data: [{id: '1-1', text: '行业A－1'}, {id: '2-1', text: '行业B－1'}, {id: '3-1', text: '行业C－1'}, {id: '4-1', text: '行业D－1'}, {id: '4-2', text: '行业D－2'}],
            data: [],
            multiple: false,
            placeholder: '尚无数据',
            search: false
        };
        $scope.industry3Config = {
            //data: [{id: '1-1-1', text: '行业A－1－1'}, {id: '2-1-1', text: '行业B－1－1'}, {id: '3-1-1', text: '行业C－1－1'}, {id: '4-1-1', text: '行业D－1－1'}, {id: '4-2-1', text: '行业D－1－2'}],
            data: [],
            multiple: false,
            placeholder: '尚无数据',
            search: false
        };
        $scope.$watch('entInfo.industry1', function (newValue, oldValue, scope) {
            debugger
            if (newValue != oldValue) {
                $scope.entInfo.industry2 = '';
                $scope.industry2Config.data = [];
            }
            if ($scope.industry1Config.data.length == 0) {
                industryPull($scope.industry1Config);
            }
            if ($scope.entInfo.industry1) {
                industryPull($scope.industry2Config, $scope.entInfo.industry1);
            }
        }, true);
        $scope.$watch('entInfo.industry2', function (newValue, oldValue, scope) {
            if (newValue != oldValue) {
                $scope.entInfo.industry3 = '';
                $scope.industry3Config.data = [];
            }
            if ($scope.entInfo.industry2) {
                industryPull($scope.industry3Config, $scope.entInfo.industry2);
            }
        }, true);

        function industryPull(config, parentValue) {
            //$timeout(function () {
            //    config.data = [{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}];
            //    config.placeholder = '加载完毕'
            //}, 1000);
            //return ;
            util.api({
                url: '~/op/api/enums/getlistByParent',
                data: {name: 'INDUSTRY', parentValue: parentValue || 0},
                success: function (result) {
                    if (result.success) {
                        var data = [];
                        for (var i = 0; i < result.value.model.length; i++) {
                            var item = result.value.model[i];
                            data.push({id: item.value, text: item.text});
                        }
                        $scope.$apply(function () {
                            config.placeholder = '加载完毕';
                            config.data = data;
                        });
                    }
                }
            })
        }

        //end 多功能下拉选框　行业
        $scope.testResult = function () {
            debugger
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
        $scope.nextStep = function () {
            if ($scope.step == 1) {//企业详情界面
                //if ($scope.mainForm.basicForm.$invalid) {
                //    debugger
                //    $scope.step_1_validate_error=true;
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
    exports.init = function () {
        var $el = exports.$el;
        angular.bootstrap($el.get(0), ['formApp']);
    };

});