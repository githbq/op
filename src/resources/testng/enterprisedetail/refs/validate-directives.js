define(function(reuqire,exports,module){
   var app=angular.module('common.directives',[]);
    var INTEGER_REGEXP = /^\-?\d*$/;
    app.directive('integer', function() {
        return {
            require : 'ngModel',
            link : function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    if (INTEGER_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('integer', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('integer', false);
                        return undefined;
                    }
                });
            }
        };
    });
    var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
    app.directive('smartFloat', function() {
        return {
            require : 'ngModel',
            link : function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    if (FLOAT_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        return parseFloat(viewValue.replace(',','.'));
                    } else {
                        ctrl.$setValidity('float', false);
                        return undefined;
                    }
                });
            }
        };
    });
    var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
    app.directive('decimal', function() {
        return {
            require : 'ngModel',
            link : function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    if (FLOAT_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        return parseFloat(viewValue.replace(',','.'));
                    } else {
                        ctrl.$setValidity('float', false);
                        return undefined;
                    }
                });
            }
        };
    });




});