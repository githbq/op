define(function (require, exports, module) {
    var app = angular.module('formApp');
    app.factory('select2Query', ['$timeout', function ($timeout) {
        return {
            getEmplyeeAjaxConfig: function () {
                var config = {
                    minimumInputLength: 1,
                    ajax: {
                        cache: true,
                        url: "/op/api/a/odrDraft/getAccountForSubOrderPartner",
                        type: 'POST',
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
                        url: '/op/api/ba/queryListByBankAccount',
                        type: 'POST',
                        data: function (term) {
                            return {
                                bankAccount: term
                            };
                        },
                        results: function (data, page) {
                            var results = [];
                            if (data.success && data.value.model && data.value.model) {
                                _.each(data.value.model || [], function (item, i) {
                                    results.push({id: item.bankAccount, text: item.bankAccount})
                                });
                            }
                            ;
                            return {results: results};
                        }
                    },
                    formatResult: function (data) {
                        return data.text;
                    },
                    formatSelection: function (data) {
                        return data.text;
                    }
                };
                return config;
            }
        }
    }]);

    app.factory('productService', function () {
        var factory = {};
        //根据合同号获取
        factory.getDataByContractNo = function (contractNo, callback) {
            return util.api({
                url: '~/op/api/a/odrDraft/validateContractNo',
                data:{contractNo:contractNo},
                success: function (result) {
                if (result.success) {
                    callback(result.value.model);
                }else{
                    callback(false);
                }
            }
            });
        };
        //获取订单历史列表
        factory.getOrderList = function (enterpriseAccount, callback) {
            if (!enterpriseAccount) {
                return;
            }
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
        //获取产品的大JSON串
        factory.getDiyOrderFormLogic = function (enterpriseId, callback) {
            return util.api({
                'url': '~/op/api/a/odrDraft/getDiyOrderFormLogic',
                'data': {'enterpriseId': enterpriseId},
                'success': function (result) {
                    if (result.success) {
                        callback(result.value.model);
                    }
                }
            });
        };
        //获取编辑时的订单详情
        factory.getOrderDetailByOrderId = function (orderId,callback) {
            if (!orderId) {
                return;
            }
            return util.api({
                'url': '~/op/api/a/odr/showOrderDetail',
                'data': {orderId: orderId},
                'success': function (result) {
                    if (result.success) {
                        callback(result.value.model);
                        /*
                         canEditEnterprise	是否可以编辑企业 true or false	boolean
                         canEditOrder	是否可以编辑产品信息	boolean
                         canEditPaidInfo	是否可以编辑付款信息	boolean
                         odrDraftEnterprise	企业草稿	object
                         odrDraftOrder	订单草稿	object
                         odrDraftPaidInfo	付款草稿	object
                         odrOrder	订单对象	object
                         odrReceivedPay	到款信息	object
                         * */
                    }
                }
            });
        };
        return factory;
    });
});
