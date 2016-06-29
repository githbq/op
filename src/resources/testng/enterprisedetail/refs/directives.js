define(function (require, exports, module) {
    require('./services');
    require('plugin/uploadpreview');
    var app = angular.module('common.directives', ['common.services']);
    require('./datetime-directive');
    require('./select2-directive');//多功能复选框
    require('./validate-directive');
    var template = require('./template.html');
    app.directive('inputFile', ['fileService', '$timeout', function (fileService, $timeout) {
        return {
            scope: {label: '@', ngReadonly: '=', ngRequired: '=', ngModel: '=', status: '=', response: '='},
            controller: ['$scope', function ($scope) {
            }],
            link: function (scope, iElem, iAttrs) {
                scope.$watch('ngModel', function () {
                    if (scope.ngModel) {
                        scope.src = '/op/api/file/previewimage?filePath=' + scope.ngModel;
                        scope.href = '/op/api/file/previewimage?filePath=' + scope.ngModel;
                    }
                });
                //给容器添加样式
                iElem.addClass('input-file-container');
                scope.status = 'unload';
                $('input[type=file]', iElem).uploadPreview({Callback: null, img: $('img', iElem)});
                iElem.find('input[type=file]').on('change', function (e) {
                    scope.$apply(function ($sope) {
                        scope.status = 'uploading';
                    });
                    fileService.sendFile(e, function (result) {
                        scope.$apply(function ($scope) {
                            scope.response = result;
                            if (result.success) {
                                scope.ngModel = result.value.model.path;
                                scope.status = 'uploaded';
                                $timeout(function () {
                                    scope.status = 'unload';//三秒后结束状态
                                }, 2000);
                            } else {
                                scope.status = 'error';
                            }
                        });
                    });
                });
            },
            restrict: 'CA',
            template: $(template, '.uploadFile').html()
        }
    }]);


    //循环完成时 事件
    app.directive('onFinishRenderFilters', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }]);

});