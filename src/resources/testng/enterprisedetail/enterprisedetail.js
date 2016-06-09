define(function (require, exports, module) {
    require('common/widget/select2/select2');
    require('./refs/directives');
    var myApp = angular.module('formApp', ['ngMessages', 'common.directives']);
    require('./refs/products-directive');
    require('./refs/product-services');//对应的远程服务
    myApp.controller('form1Controller', ['$scope', function ($scope) {

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

        $scope.enterpriseReadonly=false;
        $scope.ent={};//企业详情信息
        $scope.testBasicForm = function () {
            debugger
        };

        $scope.select2Query = select2Query;//下拉列表远程数据
        //多功能复选框
        $scope.province = '';
        $scope.city = '';
        $scope.area = '';

        $scope.provinceDataValue = '';
        $scope.cityDataValue = '';
        $scope.areaDataValue = '';
        $scope.provinceConfig = {
            data: [{id: 1, text: '北京'}, {id: 2, text: '上海'}, {id: 3, text: '广东'}, {id: 4, text: '湖北'}],
            multiple: false,
            placeholder: '尚无数据',
            minimumResultsForSearch: Infinity//不显示搜索框
        };

        $scope.cityConfig = {
            data: [{id: '1-1', text: '北京市'}, {id: '2-1', text: '上海市'}, {id: '3-1', text: '深圳'}, {id: '4-1', text: '武汉'}, {id: '4-2', text: '黄冈'}],
            multiple: false,
            placeholder: '尚无数据'
        };
        $scope.areaConfig = {
            data: [{id: '1-1-1', text: '昌平区'}, {id: '2-1-1', text: '浦东区'}, {id: '3-1-1', text: '宝安区'}, {id: '4-1-1', text: '汉口'}, {id: '4-2-1', text: '黄梅县'}],
            multiple: false,
            placeholder: '尚无数据'
        };
        $scope.province=1;
        //$scope.city='2-1';
        $scope.$watch('province', function (newValue, oldValue, scope) {
            //alert('province:changed');
            debugger
        }, true);
        $scope.$watch('city', function (newValue, oldValue, scope) {
            //alert('city:changed');
        }, true);
        $scope.$watch('area', function (newValue, oldValue, scope) {
            //alert('area:changed');
        }, true);
        //end多功能复选框　


        //多功能复选框　行业
        $scope.industry1 = '';
        $scope.industry2 = '';
        $scope.industry3 = '';

        $scope.industry1DataValue = '';
        $scope.industry2DataValue = '';
        $scope.industry3DataValue = '';
        $scope.industry1Config = {
            data: [{id: 1, text: '行业A'}, {id: 2, text: '行业B'}, {id: 3, text: '行业C'}, {id: 4, text: '行业D'}],
            multiple: false,
            placeholder: '尚无数据'
        };

        $scope.industry2Config = {
            data: [{id: '1-1', text: '行业A－1'}, {id: '2-1', text: '行业B－1'}, {id: '3-1', text: '行业C－1'}, {id: '4-1', text: '行业D－1'}, {id: '4-2', text: '行业D－2'}],
            multiple: false,
            placeholder: '尚无数据'
        };
        $scope.industry3Config = {
            data: [{id: '1-1-1', text: '行业A－1－1'}, {id: '2-1-1', text: '行业B－1－1'}, {id: '3-1-1', text: '行业C－1－1'}, {id: '4-1-1', text: '行业D－1－1'}, {id: '4-2-1', text: '行业D－1－2'}],
            multiple: false,
            placeholder: '尚无数据'
        };
        $scope.$watch('industry1', function (newValue, oldValue, scope) {
            //alert('industry1:changed');
            debugger
        }, true);
        $scope.$watch('industry2', function (newValue, oldValue, scope) {
            //alert('industry2:changed');
        }, true);
        $scope.$watch('industry3', function (newValue, oldValue, scope) {
            //alert('industry3:changed');
        }, true);
        //end 多功能复选框　行业


        $scope.testResult = function () {
            debugger
        };
        $scope.saving = false;
        $scope.step = 1;//步骤
        $scope.prevStep = function () {
            $scope.step--;
        };
        $scope.nextStep = function () {
            $scope.step++;
        };
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