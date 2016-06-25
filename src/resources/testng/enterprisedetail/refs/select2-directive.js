define(function (require, exports, module) {


    angular.module('common.directives').directive('select2', function () {
        return {
            restrict: 'A',
            scope: {
                config: '=',
                ngModel: '=',
                select2Model: '=',
                ajaxConfig: '='//远程查找服务
            },
            link: function (scope, element, attrs) {
                // 初始化
                var tagName = element[0].tagName,
                    config = {
                        allowClear: true,
                        multiple: !!attrs.multiple,
                        placeholder: attrs.placeholder || ' '   // 修复不出现删除按钮的情况
                    };

                // 生成select
                if (tagName === 'SELECT') {
                    // 初始化
                    var $element = $(element);
                    delete config.multiple;

                    $element
                        .prepend('<option value=""></option>')
                        .val('')
                        .select2(config);

                    // model - view
                    scope.$watch('ngModel', function (newVal) {
                        setTimeout(function () {
                            $element.find('[value^="?"]').remove();    // 清除错误的数据
                            $element.select2('val', newVal);
                        }, 0);
                    }, true);
                    return false;
                }

                // 处理input
                if (tagName === 'INPUT') {
                    // 初始化
                    var $element = $(element);
                    debugger
                    // 获取内置配置
                    if (scope.ajaxConfig) {
                        scope.config = angular.extend(scope.config||{},scope.ajaxConfig) ;
                    }

                    // 动态生成select2
                    scope.$watch('config', function () {
                        angular.extend(config, scope.config);
                        $element.select2('destroy').select2(config);
                        $element.select2('val', scope.ngModel);
                    }, true);

                    // view - model
                    $element.on('change', function () {
                        scope.$apply(function () {
                            scope.select2Model = $element.select2('data');
                        });
                    });

                    // model - view
                    scope.$watch('select2Model', function (newVal) {
                        $element.select2('data', newVal);
                    }, true);

                    // model - view
                    scope.$watch('ngModel', function (newVal) {
                        // 跳过ajax方式以及多选情况
                        if (config.ajax || config.multiple) {
                            return false
                        }

                        $element.select2('val', newVal);
                    }, true);
                }
            }
        }
    });


});