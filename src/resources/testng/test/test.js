define(function (require, exports, module) {
    require('./directives.js');
    require('./services.js');
    exports.init = function () {
        var $el = exports.$el;

        var myApp2 = angular.module('orderApp2', ['app.directives', 'app.services']);
        myApp2.controller('testController', ["$scope", function ($scope) {
            $scope.value = 'myApp2';
            $scope.value2 = 'myApp222222';
        }]);


        var myApp = angular.module('orderApp', ['app.directives', 'orderApp2']);

        //myApp.controller('testController', ["$scope", function ($scope) {
        //
        //    $scope.value2 = '测试使用2---' + Math.random();
        //    $scope.value = '测试使用---' + Math.random();
        //    $scope.clickMe = function () {
        //        alert(1);
        //        $scope.clicked = true;
        //    }
        //}]);

        //父子controller案例
        myApp.controller('parentController', function ($scope) {
            $scope.value = {A: 'parentA', B: 'parentB'};
            $scope.clickMe = function () {
                debugger
            }
        });
        myApp.controller('childController', function ($scope) {

            $scope.clickMe = function () {
                debugger
            }

        });
        //end 父子controller案例


        //调用服务案例
        myApp.controller('service1Controller', function ($scope, serviceA) {
            debugger
            $scope.serviceA = serviceA;
            $scope.a = serviceA.a;
            $scope.b = serviceA.b;
            $scope.c = serviceA.c;
            $scope.clickMe = function () {

                debugger
            }
        });
        myApp.controller('service2Controller', function ($scope, serviceA) {
            debugger

            $scope.a = serviceA.a;
            $scope.b = serviceA.b;
            $scope.c = serviceA.c;
            $scope.serviceA = serviceA;
            $scope.clickMe = function () {

                debugger
            }
        });
        //end 调用服务案例

        /*
         * 事件监听 案例
         * 发送消息： $scope.$emit(name, data) 或者 $scope.$broadcast(name, data);

         接收消息： $scope.on(name,function(event,data){ });

         区别： $emit 广播给父controller   $broadcast 广播给子controller
         * */
        myApp.controller('event1Controller', function ($scope,$rootScope) {
            $scope.a='1';
            $scope.clickMe = function () {
                $scope.$broadcast('2child',this.a + ',from parent to child');
                $rootScope.$broadcast('root喊你',this.a + ',from root to child');
            };
            $scope.$on('2parent',function(event,msg){
                debugger

            })
        });
        myApp.controller('event1ChildController', function ($scope) {
            $scope.a='1';
            $scope.clickMe = function () {
                $scope.$emit('2parent',this.a + ',from child to parents');
            };
            $scope.$on('2child',function(event,msg){
                debugger
            });
        });
        myApp.controller('event2Controller', function ($scope) {
            $scope.$on('root喊你',function(event,msg){
                debugger
                alert('root大哥,我收到了');
            });
        });
        //end 事件监听案例
        angular.bootstrap($el.get(0), ['orderApp']);
    };

});