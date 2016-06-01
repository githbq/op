define(function (require, exports, module) {
    require('common/widget/select2/select2');
    var app = angular.module('app', []);
    require('./directives');
    /**
     * select2 内置查询功能
     */
    app.factory('select2Query', ["$timeout", function ($timeout) {
        return {
            testAJAX: function () {
                var config = {
                    minimumInputLength: 1,
                    ajax: {
                        url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
                        dataType: 'jsonp',
                        data: function (term) {
                            return {
                                q: term,
                                page_limit: 10,
                                apikey: "ju6z9mjyajq2djue3gbvv26t"
                            };
                        },
                        results: function (data, page) {
                            return {results: data.movies};
                        }
                    },
                    formatResult: function (data) {
                        return data.title;
                    },
                    formatSelection: function (data) {
                        return data.title;
                    }
                };

                return config;
            }
        }
    }]);
    app.controller('appCtrl', ["$scope", "$timeout", function ($scope, $timeout) {
        $scope.config1 = {
            data: [{id: 1, text: '北京'}, {id: 2, text: '上海'}, {id: 3, text: '广东'}, {id: 4, text: '湖北'}],
            multiple:false,
            placeholder: '尚无数据'
        };

        $scope.config2= {
            data:  [{id: '1-1', text: '北京市'}, {id: '2-1', text: '上海市'}, {id: '3-1', text: '深圳'}, {id: '4-1', text: '武汉'}, {id: '4-2', text: '黄冈'}],
            multiple:false,
            placeholder: '尚无数据'
        };
        $scope.province=1;
        $scope.city='2-1';
        $scope.$watch('province', function (newValue,oldValue, scope) {
           alert('province:changed');
            debugger
        }, true);
        $scope.$watch('city', function (newValue,oldValue, scope) {
            alert('city:changed');
        }, true);
    }]);

    exports.init = function () {
        var $el = exports.$el;
        //end 事件监听案例
        angular.bootstrap($el.get(0), ['app']);

    };


});
