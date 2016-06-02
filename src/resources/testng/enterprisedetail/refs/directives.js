define(function (require, exports, module) {
    require('./services');
    require('plugin/uploadpreview');
    var app = angular.module('common.directives', ['common.services']);
    var template = require('./template.html');
    app.directive('inputFile', ['fileService', '$timeout', function (fileService,$timeout) {
        return {
            scope: {label: '@', required: '=', ngModel: '=', status: '=', response: '=', src: '=defaultSrc', href: '=defaultHref'},
            controller: ['$scope', function ($scope) {
            }],
            link: function (scope, iElem, iAttrs) {
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
                                }, 3000);
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
});