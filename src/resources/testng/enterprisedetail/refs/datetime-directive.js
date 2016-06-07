define(function (require, exports, module) {
    var app = angular.module('common.directives');
    app.directive('datetimecontrol', function () {
        //datetimecontrol 填写my97的配置　　　有　dateFmt:定义日期展示的格式化串  type:1　为取值的时候　后面加上23:59:59代表结束时间　不填则为开发时间0:0:0
        return {
            restrict: 'A',
            template: '<input type="text" readonly="readonly" class="datetime-control" ng-model="stringValue"/>',
            scope: {datetimecontrol: '=', ngModel: '=', defaultValue: '='},
            link: function (scope, iElem, iAttr) {
                scope.datetimecontrol = scope.datetimecontrol || {};
                var option = {
                    type: '1',
                    replace: true,
                    dateFmt: 'yyyy/MM/dd',
                    onpicked: function () {
                        //取值逻辑
                        if (scope.datetimecontrol.type == '1') {//0开始时间 1为结束时间
                            scope.ngModel = new Date($ele.val() + " 23:59:59").getTime();
                        } else {
                            scope.ngModel = new Date($ele.val() + " 00:00:00").getTime();
                        }
                    }
                };
                scope.datetimecontrol = $.extend(option, scope.datetimecontrol);
                scope.stringValue = scope.defaultValue ? new Date(scope.defaultValue)._format(scope.datetimecontrol.dateFmt) : '';//赋默认值
                $('input', iElem).off('focus').on('focus', function () {//触发控件
                    WdatePicker(scope.datetimecontrol);
                });
            }
        }
    });
});