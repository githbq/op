define(function (reuqire, exports, module) {
    var app = angular.module('common.directives');
    //全角转半角
    function CtoH(str) {//todo
        return str;
        var result = "";
        if (str) {
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) == 12288) {
                    result += String.fromCharCode(str.charCodeAt(i) - 12256);
                    continue;
                }
                if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) result += String.fromCharCode(str.charCodeAt(i) - 65248);
                else result += String.fromCharCode(str.charCodeAt(i));
            }
        }
        return result;
    }
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

    var NUMBER_REGEXP = /^\d{1,6}((\.)\d{0,2})?$/;
    var INTEGER_REGEXP = /^[0-9][0-9]{0,5}$/;
    app.directive('number', function () {
        return {
            require: 'ngModel',
            scope: {config:'=number',maxNumber: '=', minNumber: '=', max: '@', min: '@', ngModel: '=', ngRequired: '='},
            link: function (scope, elm, attrs, ctrl) {
                var exp=NUMBER_REGEXP;
                if(scope.config && scope.config.int){
                    exp=INTEGER_REGEXP;
                }
                scope.ngModel = setMaxOrMinValue(scope.ngModel);
                elm.off('keyup').on('keyup', function () {
                    var $dom = $(this);
                    var result = ($dom.val().replace(/[^\.\d]/g, ''));
                    result = CtoH(result);
                    if (!exp.test(result) && result !== '') {
                        var findIndex=result.indexOf('.');
                        if(findIndex>=6 || findIndex<0){
                            result=result.substr(0,6);
                        }else if(findIndex>=0){
                            result=result.substr(0,findIndex+3);
                        }
                        result=(Math.floor(result*100)/100).toString();
                        if(scope.config&&scope.config.int){
                            result=result.replace(/\./g,'');
                        }
                    }
                    result = setMaxOrMinValue(result,true);
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
                function setMaxOrMinValue(result,ignoreMin) {
                    if (isNaN(result) || result === '') {
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
                        if (scope.min && !ignoreMin) {
                            min = parseFloat(scope.min);
                        }
                        if (!(isNaN(max) || max === '') && result > max) {
                            result = max;
                        }
                        if (!(isNaN(min) || min === '') && result < min && !ignoreMin) {
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
                    console.log('$parsers:'+viewValue)
                    if (exp.test(viewValue)) {
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

    var ACCOUNT_REGEXP = /^[a-z][a-z0-9]{5,19}$/i;
   // var HASNUMBER_REGEXP = /\d{1,}/g;//是否包含一个数字验证
    app.directive('account', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    viewValue = CtoH(viewValue)
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
    var TELEPHONE_REGEXP= /^0\d{2,3}-?\d{7,8}$/
    app.directive('telephone', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (TELEPHONE_REGEXP.test(viewValue)||PHONE_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('telephone', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('telephone', false);
                        return undefined;
                    }
                });
            }
        };
    });

    var PHONE_REGEXP = /^[0-9]{11}$/;
    app.directive('phone', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                elm.off('keyup').on('keyup', function () {
                    var $dom = $(this);
                    var result = ($dom.val().replace(/[^\d]/g, ''));
                    result = CtoH(result);
                    if (!isNaN(result) && result !== '') {
                        var subLength=result.length;
                        if(result.length>11){
                            subLength=11;
                        }
                        result=result.substr(0,subLength);
                    }
                    $dom.val(result);
                    ctrl.$setViewValue(result ? parseInt(result) : result, true);//只能赋模型的值不能改变VIEW
                    setTimeout(function () {
                        ctrl.$setValidity('phone', true);
                        ctrl.$setValidity('maxlength', true);
                    }, 100);
                });
                ctrl.$parsers.unshift(function (viewValue) {
                    debugger
                    if (PHONE_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('phone', true);
                        ctrl.$setValidity('maxlength', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('phone', false);
                        return undefined;
                    }
                });
            }
        };
    });
    //inputName  只能是数字及字母
    var NAME_REGEXP = /^[a-z0-9]{0,50}$/i;
    app.directive('inputName', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    debugger
                    if (NAME_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('inputName', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('inputName', false);
                        return viewValue;
                    }
                });
            }
        };
    });
    //数组
    //app.directive('arrayRequired', function () {
    //    return {
    //        require: 'ngModel',
    //        scope:{ngModel:'='},
    //        link: function (scope, elm, attr, ctrl) {
    //            if (!ctrl) return;
    //            debugger
    //            //attr.arrayRequired = true; // force truthy in case we are on non input element
    //            ctrl.$validators.arrayRequired = function (modelValue, viewValue) {
    //                return scope.$eval(attr.ngModel) && scope.$eval(attr.ngModel).length > 0;
    //            };
    //            ctrl.$parsers.unshift(function (viewValue) {
    //                alert('arrayRequired');
    //            });
    //            scope.$watch('ngModel', function () {
    //                alert(2)
    //                //ctrl.$validate();
    //            });
    //        }
    //    };
    //});
});