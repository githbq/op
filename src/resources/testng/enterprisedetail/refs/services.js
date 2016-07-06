define(function (require, exports, module) {
    var app = null;
    try {
        app = angular.module('common.services');
    } catch (e) {
        app = angular.module('common.services', []);
    }
    //文件上传服务
    var uploader = require('common/widget/upload').uploader;
    app.factory('fileService', function () {
        var factory = {};
        factory.sendFile = function (e, callback) {
            return uploader.send({
                'url': '/op/api/file/uploadsinglefileandcheck',
                'files': e.target.files,
                'options': {
                    'limittype': 'IMAGE'
                },
                'success': callback
            });
        };
        return factory;
    });

    app.factory('getEnumService', function () {
        var factory = {};
        //获取枚举值 并赋值给select
        factory.load = function (Ename, needEmpty, cb) {
            var list = [];
            $.isFunction(needEmpty) && (cb = needEmpty);
            needEmpty === true && (list.push({text: '请选择', id: ''}));
            util.getEnums(Ename, function (data) {
                data.value.model.forEach(function (item) {
                    if (item && item.text !== undefined && item.value !== undefined) {
                        list.push({'text': item.text, 'id': item.value + ''});
                    }
                });
                cb && cb(list);
            });
        };
        return factory;
    });
    //级联下拉列表服务
    app.factory('cascadeSelectService', function () {
        var factory = {};
        var $scope = null;
        //级联下拉列表
        //cascadeSelectService.cascadeSelect($scope,[
        //    {ngModelName: 'entInfo.province', config: $scope.provinceConfig},
        //    {ngModelName: 'entInfo.city', config: $scope.cityConfig},
        //    {ngModelName: 'entInfo.county', config: $scope.countyConfig}
        //], cascadeSelectService.createPullFunc({url: '~/op/api/district/getListByParent', data: {name: 'parentValue'}}, function (data, item) {
        //    data.push({id: item.value.toString(), text: item.name});
        //}));

        factory.cascadeSelect = function (scope, selectConfigs, remotePullFunc, needWatch) {
            $scope = scope;
            var cacheWatch=scope.cascadeSelectCacheWatch= scope.cascadeSelectCacheWatch||{};//监听键的缓存　防止多重监听
            var remotePullFunc = remotePullFunc || factory.createPullFunc();
            for (var i = 0; i < selectConfigs.length; i++) {
                var selectConfig = selectConfigs[i];
                setDefaultForConfig(selectConfig);
                var nextSelectConfig = selectConfigs.length > i + 1 ? selectConfigs[i + 1] : null;
                (function (i, total, selectConfig, nextSelectConfig, needWatch) {
                    if (needWatch !== false) {
                        if (cacheWatch[selectConfig.ngModelName]) {
                            return;
                        } else {
                            cacheWatch[selectConfig.ngModelName] = true;
                        }
                        $scope.$watch(selectConfig.ngModelName, function (newValue, oldValue, scope) {

                            if (i > 0 && !selectConfig.config.auto) {
                                return;
                            }
                            if (newValue != oldValue) {
                                if (i !== total - 1 && nextSelectConfig) {
                                    nextSelectConfig.config.data = [];
                                    eval('$scope.' + nextSelectConfig.ngModelName + '= ""');
                                    nextSelectConfig.config.auto = true;
                                    newValue && remotePullFunc(nextSelectConfig.config, getEvalValue(selectConfig.ngModelName), function () {
                                        exeConfig(nextSelectConfig);
                                    });
                                }
                            }
                        });
                    }
                })(i, selectConfigs.length, selectConfig, nextSelectConfig, needWatch);
            }
            var firstSelectConfig = selectConfigs[0];
            remotePullFunc(firstSelectConfig.config, 0, function () {
                exeConfig(firstSelectConfig);
            });
            function exeConfig(selectConfig) {
                eval('$scope.' + selectConfig.ngModelName + '= selectConfig.config.defaultValue');
                selectConfig.config.defaultValue = '';
            }

            function setDefaultForConfig(selectConfig) {
                eval('selectConfig.config.defaultValue=$scope.' + selectConfig.ngModelName);
                eval('$scope.' + selectConfig.ngModelName + '=null');
            }

            function getEvalValue(ngModelName) {
                return $scope.$eval(ngModelName);
            }
        };

        factory.createPullFunc = function (options, responseCallback, paramsFunc) {
            return function (config, parentValue, cb) {
                options = options || {};

                var defaultOption = {
                    url: '~/op/api/enums/getlistByParent',
                    data: {name: 'INDUSTRY_NEW', parentValue: parentValue || 0},
                    success: function (result) {
                        if (result.success) {
                            var data = [];
                            for (var i = 0; i < result.value.model.length; i++) {
                                var item = result.value.model[i];
                                if (responseCallback) {
                                    responseCallback(data, item);
                                } else {
                                    data.push({id: item.value.toString(), text: item.text});
                                }
                            }
                            $scope.$apply(function () {
                                config.placeholder = '请选择';
                                config.data = data;
                                cb && cb(data);
                            });
                        }
                    }
                };
                //提供参数可自定义
                if (paramsFunc) {
                    defaultOption = paramsFunc(config, parentValue, defaultOption);
                }
                if (defaultOption.data) {
                    defaultOption.data.parentValue && (options.data.parentValue = defaultOption.data.parentValue);
                    options.data = $.extend(defaultOption.data, options.data);
                }
                util.api($.extend(defaultOption, options));
            }
        };
        return factory;
    });
});