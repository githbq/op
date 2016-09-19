define(function (require, exports, module) {
    var app = angular.module('common.directives');
    app.directive('datetimeconfig', function () {
        //datetimeconfig 填写my97的配置　　　有　dateFmt:定义日期展示的格式化串  type:1　为取值的时候　后面加上23:59:59代表结束时间　不填则为开始时间00:00:00
        return {
            require: 'ngModel',
            restrict: 'A',
            template: '<input ng-disabled="ngDisabled" name="{{name}}" style="cursor:pointer;" type="text" readonly="readonly" class="datetime-control" ng-model="stringValue"/>',
            scope: { required2: '=', maxDate: '@', minDate: '@', ngChange: '&', datetimeconfig: '=', ngModel: '=', ngDisabled: '=', getForm: '&getform', name: '@' },
            link: function (scope, iElem, iAttr, ctrl) {
                scope.datetimeconfig = scope.datetimeconfig || {};
                var currentForm = scope.getForm && scope.getForm();
                ctrl.$parsers.unshift(function (viewValue) {
                    if (scope.ngModel) {
                        ctrl.$setValidity('required2', true);
                    } else {
                        ctrl.$setValidity('required2', false);
                    }
                });
                function valueChange(control) {
                    var value = control.el.value;
                    var field = currentForm[scope.name];
                    if (currentForm && field) {
                        field.$setDirty();
                        if (value && value.length > 0) {//处理require错误验证问题
                            field.$setValidity('required2', true);
                            field.$valid = true;
                        } else if (scope.required2) {
                            field.$setValidity('required2', false);
                        }
                    }
                    //取值逻辑
                    scope.$apply(function () {
                        transferDate(value);
                    });
                    scope.ngChange && scope.ngChange();
                }

                var option = {
                    type: '0',
                    dateFmt: 'yyyy/MM/dd',
                    onpicked: function (control) {
                        valueChange(control);
                    }, oncleared: function (control) {
                        valueChange(control);
                    }
                };
                scope.$watch('maxDate', function (newValue, oldValue) {
                    resetMaxOrMinDate(newValue, true);
                });
                scope.$watch('minDate', function (newValue, oldValue) {
                    resetMaxOrMinDate(newValue, false);
                });
                function resetMaxOrMinDate(value, isMax) {
                    if (value && !isNaN(value)) {
                        value = parseInt(value);
                        isMax && (scope.datetimeconfig.maxDate = new Date(value)._format(scope.datetimeconfig.dateFmt || 'yyyy/MM/dd'));
                        !isMax && (scope.datetimeconfig.minDate = new Date(value)._format(scope.datetimeconfig.dateFmt || 'yyyy/MM/dd'));
                        if ((isMax && scope.ngModel && value < scope.ngModel) || (!isMax && scope.ngModel && value > scope.ngModel)) {
                            scope.ngModel = value;
                        }
                        $('input', iElem).off('focus').on('focus', function () {//触发控件
                            WdatePicker(scope.datetimeconfig);
                        });
                    }
                }

                scope.$watch('ngModel', function () {
                    var datetimeconfig = scope.datetimeconfig = $.extend({}, option, scope.datetimeconfig || {});
                    transferDate();
                    scope.stringValue = scope.ngModel ? new Date(scope.ngModel)._format(datetimeconfig.dateFmt) : '';//赋默认值
                    if (!scope.ngDisabled) {
                        $('input', iElem).off('focus').on('focus', function () {//触发控件
                            WdatePicker(datetimeconfig);
                        });
                    } else {
                        $('input', iElem).attr('readonly', 'readonly');
                    }
                    var field = currentForm[scope.name];
                    if (scope.ngModel) {//处理require错误验证问题
                        field.$setValidity('required2', true);
                    } else if (scope.required2) {
                        field.$setValidity('required2', false);
                    }
                });

                function transferDate(str) {
                    if (str === undefined && scope.ngModel) {
                        str = new Date(scope.ngModel)._format(scope.datetimeconfig.dateFmt || 'yyyy/MM/dd')
                    }
                    if (!str) {
                        scope.ngModel = null;
                    } else { 
                        if (scope.datetimeconfig.dateFmt.indexOf('HH') >= 0) {
                            scope.ngModel = new Date(str).getTime();
                        }
                        else if (scope.datetimeconfig.type == '1' && scope.ngModel) {
                            scope.ngModel = new Date(str + " 23:59:59").getTime();
                        } else {
                            scope.ngModel = new Date(str + " 00:00:00").getTime();
                        }
                    }
                }
            }
        }
    });
});