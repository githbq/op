define(function (require, exports, module) {
    var app = angular.module('app.services', []);
    app.factory('serviceB', ["$http", function($http) { // injectables go here
        var self = this; // Save reference
        self.a=1;
         return {a:self.a,b:2,c:3};
    }]);


    app.service('serviceA', ["$http", function($http) { // injectables go here
        var self = this; // Save reference
        self.data = {a:11,b:22,c:33};
        self.a=1;
        self.b=2;
        self.c=3;
        self.get = function() {
            return self.data;
        }
    }]);

    app.provider('serviceC', function() {
        this.a='123';
        this.$get = ["$http", function($http) { // injectables go here
            var self = this;
            var service = {
                a:self.a,
                b:2,
                c:3
            };
            return service;
        }]
    });

    module.exports=app;
});