define(function (reuqire, exports, module) {
    var app = angular.module('common.directives');
    var INTEGER_REGEXP = /^\-?\d*$/;
    app.directive('integer', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
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
    app.directive('smartFloat', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (FLOAT_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        return parseFloat(viewValue.replace(',', '.'));
                    } else {
                        ctrl.$setValidity('float', false);
                        return undefined;
                    }
                });
            }
        };
    });
    var EMAIL_REGEXP = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    app.directive('email', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (EMAIL_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('email', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('email', false);
                        return undefined;
                    }
                });
            }
        };
    });

    var NUMBER_REGEXP = /^\d{1,8}((\.|\,)\d{0,2})?$/;
    app.directive('number', function () {
        return {
            require: 'ngModel',
            scope: {maxNumber: '=',minNumber:'='},
            link: function (scope, elm, attrs, ctrl) {
                elm.off('keyup').on('keyup', function () {
                    var $dom = $(this);
                    var result = ($dom.val().replace(/[^\.\d]/g, ''));
                    if (!NUMBER_REGEXP.test(result)) {
                        result = '0';
                    }
                    $dom.val(result);
                    if (!isNaN(scope.maxNumber) && parseFloat(result) > scope.maxNumber) {
                        result = scope.maxNumber;
                    }
                    if (!isNaN(scope.minNumber) && parseFloat(result)<scope.minNumber) {
                        result = scope.minNumber;
                    }
                    $dom.val(result);
                    ctrl.$setViewValue(result, true);//只能赋模型的值不能改变VIEW
                    setTimeout(function () {
                        ctrl.$setValidity('number', true);
                    }, 100);
                });
                ctrl.$parsers.unshift(function (viewValue) {
                    if (NUMBER_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('number', true);
                        return parseFloat(viewValue.toString().replace(',', '.'));
                    } else {
                        ctrl.$setValidity('number', false);
                        return undefined;
                    }
                });
            }
        };
    });

    var ACCOUNT_REGEXP = /^[a-z][a-z\d]{5,19}$/i;
    app.directive('account', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    debugger
                    if (ACCOUNT_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('account', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('account', false);
                        return undefined;
                    }
                });
            }
        };
    });
});