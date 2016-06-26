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
            scope: {maxNumber: '=', minNumber: '=', max: '@', min: '@', ngModel: '=', ngRequired: '='},
            link: function (scope, elm, attrs, ctrl) {
                scope.ngModel = setMaxOrMinValue(scope.ngModel);
                elm.off('keyup').on('keyup', function () {
                    var $dom = $(this);
                    var result = ($dom.val().replace(/[^\.\d]/g, ''));
                    if (!NUMBER_REGEXP.test(result)) {
                        result = null;
                    }
                    $dom.val(result);
                    ctrl.$setViewValue(result !== null ? parseFloat(result) : result, true);//只能赋模型的值不能改变VIEW
                    setTimeout(function () {
                        ctrl.$setValidity('number', true);
                    }, 100);
                });
                elm.off('change').on('change', function () {
                    var $dom = $(this);
                    var result = $dom.val();
                    result = setMaxOrMinValue(result);
                    $dom.val(result);
                    ctrl.$setViewValue(parseFloat(result), true);//只能赋模型的值不能改变VIEW
                    setTimeout(function () {
                        ctrl.$setValidity('number', true);
                    }, 100);
                });
                function setMaxOrMinValue(result) {
                    if (isNaN(result) || result==='') {
                        result = null;
                    } else {
                        result = parseFloat(result);
                    }
                    if (result !== null) {
                        var max = scope.maxNumber;
                        var min = scope.minNumber;
                        if (scope.max) {
                            max = parseFloat(scope.max);
                        }
                        if (scope.min) {
                            min = parseFloat(scope.min);
                        }
                        if (!(isNaN(max)||max==='') && result > max) {
                            result = max;
                        }
                        if (!(isNaN(min)||min==='') && result < min) {
                            result = min;
                        }
                    }
                    //if (scope.required && !result) {
                    //    result = 0;
                    //}
                    return result;
                }

                //与非空进行兼容
                ctrl.$parsers.unshift(function (viewValue) {
                    if (NUMBER_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('number', true);
                        return parseFloat(viewValue.toString().replace(',', '.'));
                    } else if (viewValue === '' && scope.ngRequired) {
                        ctrl.$setValidity('number', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('number', true);
                        return '';
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
    var PHONE_REGEXP = /^[1-9]{3}\d{8}$/;
    app.directive('phone', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    debugger
                    if (PHONE_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('phone', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('phone', false);
                        return undefined;
                    }
                });
            }
        };
    });
});