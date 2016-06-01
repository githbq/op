define(function (require, exports, module) {
    var myApp = angular.module('formApp',['ngMessages']);


    myApp.controller('testRepeatController',['$scope', function($scope){

        $scope.list=[1,2,3,4,1,2,3,4];
    }]);
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
                name:'formA',
                data:{a:'1',b:'2',c:'3',foods:[{name:'香蕉'},{name:'苹果'},{name:'桔子'}]}
            },
            {
                name:'formB',
                data:{a:'11',b:'22',c:'33',foods:[{name:'米饭'},{name:'面条'},{name:'烧饼'}]}
            },
            {
                name:'formC',
                data:{a:'1111',b:'2222',c:'3333',foods:[{name:'绿豆粥'},{name:'小米粥'},{name:'大米粥'}]}
            }
        ];


        $scope.getFormStatus = function(){
            debugger
            this[this.form.name].$commitViewValue();
            console.log($scope.form);
        }
        $scope.addFood=function(){
            debugger
            this.form.data.foods.push({name:''});
        }
    }]);
    exports.init = function () {
        var $el = exports.$el;
        angular.bootstrap($el.get(0), ['formApp']);
    };

});