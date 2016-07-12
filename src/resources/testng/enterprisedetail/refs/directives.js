define(function (require, exports, module) {
    require('./services');
    //require('plugin/uploadpreview');
    var app = angular.module('common.directives', ['common.services']);
    require('./datetime-directive');
    require('./select2-directive');//多功能复选框
    require('./validate-directive');
    var template = require('./template.html');

    function setRotate(elem, $btn) {
        var deg = 0;
        $btn.off('click').on("click", function (e) {
            if ((deg + 90) > 360) {
                deg = 90;
            } else {
                deg += 90;
            }
            var element = elem;
            var styles = ['webkitTransform', 'MozTransform', 'msTransform', 'OTransform', 'transform'];
            for (var i = 0; i < styles.length; i++) {
                element.style[styles[i]] = "rotate(" + deg + "deg)"
            }
            return false;
        });
    }

    app.directive('imagePreview', ['fileService', '$timeout', function (fileService, $timeout) {
        debugger
        return {
            replace: true,
            template: $(template).filter('.image-preview')[0].outerHTML,
            scope: {src: '=', show: '='},
            link: function (scope, iElem, iAttrs) {
                setRotate(iElem.find('img.preview')[0], iElem.find('.btn-rotate'));
                scope.close = function () {
                    scope.show = false;
                };
                scope.hrefClick = function ($event) {
                    $event.stopPropagation();
                };
            }
        }
    }]);
    app.directive('inputFile', ['fileService', '$timeout', function (fileService, $timeout) {
        return {
            scope: {maxCount: '=', multiple: '=', label: '@', ngReadonly: '=', ngRequired: '=', ngModel: '=', status: '=', response: '='},
            controller: ['$scope', function ($scope) {
            }],
            link: function (scope, iElem, iAttrs) {
                scope.multiple=false;
                scope.$watch('ngModel', function () {
                    $timeout(function () {
                        scope.ngModel = scope.ngModel || '';
                        var strs = scope.ngModel.split(',');
                        scope.imgArr = [];
                        _.each(strs, function (item) {
                            if (item) {
                                scope.imgArr.push(item);
                            }
                        })
                    }, 10);
                });
                scope.imgArr = [];
                scope.maxFileCount = scope.maxCount || 10;//可多上传情况下最多上传几张图片
                //if (scope.multiple !== false) {
                //    $('input[type=file]', iElem).attr({multiple: 'multiple'});
                //}
                scope.showBig = function (showPreview) {
                    showPreview.value = true;
                };
                scope.deleteImage = function ($index) {
                    debugger
                    scope.imgArr.splice($index, 1);
                    scope.ngModel = scope.imgArr.join(',');
                };
                //给容器添加样式
                iElem.addClass('input-file-container');
                scope.status = 'unload';
                //$('input[type=file]', iElem).uploadPreview({Callback: null, img: $('img', iElem)});
                iElem.find('input[type=file]').on('change', function (e) {
                    scope.$apply(function ($sope) {
                        scope.status = 'uploading';
                    });
                    fileService.sendFile(e, function (result) {
                        scope.$apply(function ($scope) {
                            scope.response = result;
                            iElem.find('input[type=file]').val('');
                            if (result.success) {
                                if (scope.multiple !== false) {
                                    scope.imgArr.push(result.value.model.path);
                                } else {
                                    scope.imgArr = [result.value.model.path];
                                }
                                scope.ngModel = scope.imgArr.join(',');
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
            template: $(template).filter('.upload-file')[0].outerHTML
        }
    }
    ])
    ;


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

})
;