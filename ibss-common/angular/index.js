define(function (require, exports, module) {
    require('./lib/angular');
    require('./lib/angular-messages');
    angular.module('common.app', []);
    require('./filters');
    require('./services');
    require('./directives');



});