define(function (require, exports, module) {
    var app = angular.module('formApp');
    app.factory('select2Query', ['$timeout', function ($timeout) {
        return {
            getEmplyeeAjaxConfig: function () {
                var config = {
                    minimumInputLength: 1,
                    ajax: {
                        cache: true,
                        url: "/api/a/odrDraft/getAccountForSubOrderPartner",
                        dataType: 'json',
                        data: function (term) {
                            return {
                                accountName: term
                            };
                        },
                        results: function (data, page) {
                            var results = [];
                            if (data.success) {
                                _.each(data.value.model || [], function (item, i) {
                                    results.push({id: item.accountId, text: item.accountName, selection: item.deptName + ':' + item.accountName, data: item});
                                });
                            }
                            ;
                            return {results: results};
                        }
                    },
                    formatResult: function (data) {
                        return data.selection;
                    },
                    formatSelection: function (data) {
                        return data.selection;
                    }
                };
                return config;
            },
            getBankAjaxConfig: function () {
                var config = {
                    minimumInputLength: 1,
                    ajax: {
                        cache: true,
                        // url: "/api/a/odrDraft/getAccountForSubOrderPartner",
                        url: '/op/api/ba/querylist',
                        dataType: 'json',
                        data: function (term) {
                            return {
                                q: term
                            };
                        },
                        results: function (data, page) {
                            var results = [];
                            if (data.success) {
                                _.each(data.value.model.content || [], function (item, i) {
                                    results.push({id: item.bankAccount, text: item.bankAccount, selection: '账户:' + item.bankAccount + '  公司：' + item.company + '  银行名称:' + item.bankName})
                                });
                            }
                            ;
                            return {results: results};
                        }
                    },
                    formatResult: function (data) {
                        return data.selection;
                    },
                    formatSelection: function (data) {
                        debugger
                        return data.text;
                    }
                };
                return config;
            }
        }
    }]);

    app.factory('productService', function () {
        var factory = {};
        factory.getOrderList = function (enterpriseAccount, callback) {
            return util.api({
                'url': '/odr/queryProductVOList',
                'data': {'ea': enterpriseAccount},
                'success': function (result) {
                    if (result.success) {
                        callback(result.value.model);
                    }
                }
            });
        };
        return factory;
    });
});
