define(function (require, exports, module) {
    var myApp = angular.module('formApp',['ngMessages']);
    myApp.controller('testFormController', ['$scope', function ($scope) {

        $scope.data={a:1,b:2,c:3};

        $scope.value = '测试使用' + Math.random();
        $scope.clickMe = function () {
            $scope.clicked = true;
        };
        $scope.getFormStatus = function(){
            alert('in');
            debugger
            console.log($scope.form);
        }
    }]);

    myApp.controller('testFormsController', ['$scope', function ($scope) {

        $scope.formList=[
            {
                name:'form1',
                data:{a:'1',b:'2',c:'3'}
            },
            {
                name:'form2',
                data:{a:'11',b:'22',c:'33'}
            },
            {
                name:'form3',
                data:{a:'1111',b:'2222',c:'3333'}
            }
        ];


        $scope.getFormStatus = function(){
            alert('in');
            debugger
            console.log($scope.form);
        }
    }]);
    exports.init = function () {
        var $el = exports.$el;
        angular.bootstrap($el.get(0), ['formApp']);
    };

});