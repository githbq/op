define(function (require, exports, module) {
    var app = angular.module('common.directives');
    app.directive('datetimeconfig', function () {
        //datetimeconfig 填写my97的配置　　　有　dateFmt:定义日期展示的格式化串  type:1　为取值的时候　后面加上23:59:59代表结束时间　不填则为开始时间00:00:00
        return {
            restrict: 'A',
            template: '<input name="{{name}}" style="cursor:pointer;" type="text" readonly="readonly" class="datetime-control" ng-model="stringValue"/>',
            scope: {datetimeconfig: '=', ngModel: '=', defaultValue: '=', allow: '=',getForm:'&getform',name:'@'},
            link: function (scope, iElem, iAttr) {
                scope.datetimeconfig = scope.datetimeconfig || {};
                var currentForm=scope.getForm && scope.getForm();
                var option = {
                    type: '0',
                    dateFmt: 'yyyy/MM/dd',
                    onpicked: function (control) {
                        alert(0000)
                        debugger
                        var value = control.el.value;
                        if(currentForm){
                            currentForm[scope.name].$setDirty();
                        }
                        //取值逻辑
                        scope.$apply(function(){
                            if (scope.datetimeconfig.type == '1') {//0开始时间 1为结束时间
                                scope.ngModel = new Date(value + " 23:59:59").getTime();
                            } else {
                                scope.ngModel = new Date(value + " 00:00:00").getTime();
                            }
                        });
                    }
                };
                var datetimeconfig = $.extend({},option, scope.datetimeconfig||{});
                debugger
                scope.stringValue = scope.defaultValue ? new Date(scope.defaultValue)._format(datetimeconfig.dateFmt) : '';//赋默认值
                if (scope.allow !== false) {
                    $('input', iElem).off('focus').on('focus', function () {//触发控件
                        WdatePicker(datetimeconfig);
                    });
                } else {
                    $('input', iElem).attr('disabled', 'disabled');
                }
            }
        }
    });
});