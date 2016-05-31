define( function( require, exports, module ) {
    require('./directives.js');
    exports.init = function() {
        var $el = exports.$el;

        var myApp=angular.module('orderApp',['app.directives']);
        myApp.controller('testController',["$scope", function($scope){


            $scope.value='测试使用'+Math.random();
            $scope.clickMe=function(){
                alert(1);
                $scope.clicked=true;
            }
        }]);
        angular.bootstrap($el.get(0),['orderApp']);
    };

} );