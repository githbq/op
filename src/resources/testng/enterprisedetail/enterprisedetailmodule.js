define(function (require, exports, module) {
    require('common/widget/select2/select2');
    require('./refs/directives');
    var myApp = angular.module('formApp', ['ngMessages', 'common.directives','angular.filter']);
    require('./refs/products-directive');
    require('./refs/product-services');//对应的远程服务
    var dialogManager = require('./refs/dialog');


    var Page = MClass( M.Center ).include({
        view: require('./template.html'),
        init: function(){
            var me=this;
            Page.__super__.init.apply( me , arguments );

            angular.bootstrap(me.$view, ['formApp']);
        },
        //渲染
        render: function(){
            this.attrs['wrapper'].empty().append( this.$view );
        }
    });

    module.exports=Page;
















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
        $scope.config1 = {
            data: [],
            placeholder: '尚无数据',
            search: false
        };
        $scope.a = 4;
        $timeout(function () {
            $scope.config1.data = [{id: 1, text: 'bug'}, {id: 2, text: 'duplicate'}, {id: 3, text: 'invalid'}, {id: 4, text: 'wontfix'}];
            $scope.config1.placeholder = '加载完毕'
        }, 1000);


        var entInfo = $scope.entInfo = {};
        $scope.enterpriseReadonly = false;//企业详情信息 只读
        $scope.payInfoReadonly = false;//企业详情信息 只读
        $scope.ent = {};//企业详情信息
        $scope.testBasicForm = function () {
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
            search: false,
            defaultValue:'110000'
        };

        $scope.cityConfig = {
            //data: [{id: '1-1', text: '北京市'}, {id: '2-1', text: '上海市'}, {id: '3-1', text: '深圳'}, {id: '4-1', text: '武汉'}, {id: '4-2', text: '黄冈'}],
            data: [],
            multiple: false,
            placeholder: '尚无数据',
            search: false,
            defaultValue:'110000'
        };
        $scope.areaConfig = {
            //data: [{id: '1-1-1', text: '昌平区'}, {id: '2-1-1', text: '浦东区'}, {id: '3-1-1', text: '宝安区'}, {id: '4-1-1', text: '汉口'}, {id: '4-2-1', text: '黄梅县'}],
            data: [],
            multiple: false,
            placeholder: '尚无数据',
            search: false,
            defaultValue:'110000'
        };
        cascadeSelect([
            {ngModelName: 'entInfo.province', config: $scope.provinceConfig},
            {ngModelName: 'entInfo.city', config: $scope.cityConfig},
            {ngModelName: 'entInfo.area', config: $scope.areaConfig}
        ],createPullFunc({url:'~/op/api/district/getListByParent',data:{name: 'parentValue'}},function(data,item){
            data.push({id: item.value.toString(), text: item.name});
        }));
        //end多功能下拉选框　


        //多功能下拉选框　行业
        entInfo.industry1 = '';
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
            search: false,
            defaultValue: '100'
        };

        $scope.industry2Config = {
            // data: [{id: '1-1', text: '行业A－1'}, {id: '2-1', text: '行业B－1'}, {id: '3-1', text: '行业C－1'}, {id: '4-1', text: '行业D－1'}, {id: '4-2', text: '行业D－2'}],
            data: [],
            multiple: false,
            placeholder: '尚无数据',
            defaultValue: '150',
            search: false
        };
        $scope.industry3Config = {
            //data: [{id: '1-1-1', text: '行业A－1－1'}, {id: '2-1-1', text: '行业B－1－1'}, {id: '3-1-1', text: '行业C－1－1'}, {id: '4-1-1', text: '行业D－1－1'}, {id: '4-2-1', text: '行业D－1－2'}],
            data: [],
            multiple: false,
            placeholder: '尚无数据',
            defaultValue: '100',
            search: false
        };

        cascadeSelect([
            {ngModelName: 'entInfo.industry1', config: $scope.industry1Config},
            {ngModelName: 'entInfo.industry2', config: $scope.industry2Config},
            {ngModelName: 'entInfo.industry3', config: $scope.industry3Config}
        ]);
        //{ngModelName:'',config}
        //级联下拉列表
        function cascadeSelect(selectConfigs,remotePullFunc) {
            var remotePullFunc = remotePullFunc||createPullFunc();
            for (var i = 0; i < selectConfigs.length; i++) {
                var selectConfig = selectConfigs[i];
                var nextSelectConfig = selectConfigs.length > i + 1 ? selectConfigs[i + 1] : null;
                (function (i, total, selectConfig, nextSelectConfig) {
                    //$scope.$watch(selectConfig.ngModelName, function (newValue, oldValue, scope) {
                    //    if (i > 0 && !selectConfig.config.auto) {
                    //        return;
                    //    }
                    //    if (newValue != oldValue) {
                    //        if (i !== total - 1 && nextSelectConfig) {
                    //            nextSelectConfig.config.data = [];
                    //            eval('$scope.' + nextSelectConfig.ngModelName + '= ""');
                    //            nextSelectConfig.config.auto = true;
                    //            newValue && remotePullFunc(nextSelectConfig.config, getEvalValue(selectConfig.ngModelName),function(){
                    //                exeConfig(nextSelectConfig);
                    //            });
                    //        }
                    //    }
                    //});
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
                return eval('$scope.' + ngModelName);
            }
        }
        function createPullFunc(options,responseCallback) {
            return function (config, parentValue, cb) {
                options=options||{};
                var defaultOption={
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
                                config.placeholder = '加载完毕,请选择';
                                config.data = data;
                                cb && cb(data);
                            });
                        }
                    }
                };
                if(defaultOption.data){
                    options.data=$.extend(defaultOption.data,options.data);
                }
                util.api($.extend(defaultOption,options));
            }
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
        $scope.step = 2;//步骤
        $scope.prevStep = function () {


            $scope.step--;
        };
        $scope.nextStep = function () {
            if ($scope.step == 1) {//企业详情界面
                if ($scope.mainForm.basicForm.$invalid) {
                    debugger
                    $scope['step_'+$scope.step+'_validate_error']=true;
                    return;
                }
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