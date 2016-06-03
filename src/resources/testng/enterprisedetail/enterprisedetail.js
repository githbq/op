define(function (require, exports, module) {
    var myApp = angular.module('formApp', ['ngMessages', 'common.directives']);
    require('./refs/directives');
    require('./refs/products-directive');
    myApp.controller('form1Controller', ['$scope', function ($scope) {

    }]);
    myApp.controller('form2Controller', ['$scope', function ($scope) {


    }]);
    myApp.controller('form3Controller', ['$scope', function ($scope) {

    }]);
    myApp.controller('mainController', ['$scope', '$timeout', function ($scope, $timeout) {
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