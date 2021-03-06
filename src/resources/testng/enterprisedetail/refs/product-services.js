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
                data: {contractNo: contractNo},
                success: function (result) {
                    if (result.success) {
                        callback(result.value.model);
                    } else {
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
                'url': '/odr/queryProductHistoryVOList',
                'data': {'ea': enterpriseAccount},
                'success': function (result) {
                    if (result.success) {
                        callback(result.value.model,result.value);
                    }
                }
            });
        };
        //获取复选框默认数据
        factory.getInitData = function (enterpriseId, submitType, callback) {
            //if (enterpriseId && (enterpriseId || submitType)) {
            if (enterpriseId || submitType) {
                return util.api({
                    url: '~/op/api/a/odrDraft/getInitData',
                    data: {enterpriseId: enterpriseId, submitType: submitType},
                    success: function (result) {
                        if (result.success) {
                            callback(result.value.model);
                        }
                    }
                });
            }
        };
        //获取产品的大JSON串
        factory.getDiyOrderFormLogic = function (enterpriseId,orderId, callback) {
            return util.api({
                'url': '~/op/api/a/odrDraft/getDiyOrderFormLogic',
                'data': {enterpriseId: enterpriseId,orderId:orderId},
                'success': function (result) {
                    if (result.success) {
                        callback(result.value.model);
                    }
                }
            });
        };
        //获取编辑时的订单详情
        factory.getOrderDetailByOrderId = function (orderId, callback) {
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
        var dialogManager = require('./dialog');
        //选择销售弹窗
        factory.selectSalesmenDialog = function (array, parent$timeout) {
            var accountConfig = {
                data: [],
                multiple: false,
                placeholder: '请输入条件查询',
                maximumInputLength: 50
            };
            var dialog = dialogManager.getInstance(null,
                {
                    defaultAttr: {
                        title: '选择销售',
                        width: 600
                    },
                    content: require('./dialogtemplate.html')
                }
            );

            dialog.bootstrap(['common.directives', 'common.services', 'formApp'], function (app) {
                app.controller('dialogController', ['$scope', '$timeout', 'select2Query', function ($scope, $timeout, select2Query) {
                    var vm = this;
                    vm.config = accountConfig;
                    vm.ajaxConfig = select2Query.getEmplyeeAjaxConfig();
                    vm.ngModel = null;
                    vm.select2Model = null;
                    vm.placeholder = '请输入条件查询';
                    vm.clickEnter = function () {
                        var me = this;
                        if (me.select2Model) {
                            parent$timeout(function () {
                                // debugger
                                if (!_.findWhere(array, {accountId: me.select2Model.data.accountId})) {
                                    array.push(me.select2Model.data);
                                }
                            }, 10);
                        }
                    };
                    vm.clickCancel = function () {

                    }
                }]);
            });
            dialog.show();
        };
        //选择合作人
        factory.selectPartnersDialog = function (array, parent$timeout) {
            var accountConfig = {
                data: [],
                multiple: false,
                placeholder: '请输入条件查询',
                maximumInputLength: 50
            };
            var dialog = dialogManager.getInstance(null,
                {
                    defaultAttr: {
                        title: '选择跟进人',
                        width: 600
                    },
                    content: require('./dialogtemplate.html')
                }
            );
            dialog.bootstrap(['common.directives', 'common.services', 'formApp'], function (app) {
                app.controller('dialogController', ['$scope', '$timeout', 'select2Query', function ($scope, $timeout, select2Query) {
                    var vm = this;
                    vm.config = accountConfig;
                    vm.ajaxConfig = select2Query.getEmplyeeAjaxConfig();
                    vm.ngModel = null;
                    vm.select2Model = null;
                    vm.placeholder = '请选择...';
                    vm.clickEnter = function () {
                        var me = this;
                        if (me.select2Model) {
                            parent$timeout(function () {
                                if (!_.findWhere(array, {accountId: me.select2Model.data.accountId})) {
                                    array.push(me.select2Model.data);
                                }
                            }, 10);
                        }
                    };
                    vm.clickCancel = function () {
                    }
                }]);
            });
            dialog.show();
        };

        //提交企业详情
        factory.submitStepEntInfo = function (data, callback) {
            return util.api({
                url: "~/op/api/a/odrDraft/draftEnterpriseNext",
                data: data,
                success: callback
            });
        };
        //提交产品信息
        factory.submitStepProductInfo = function (data, callback) {
            return util.api({
                url: "~/op/api/a/odrDraft/draftOrderNext",
                data: data,
                success: callback
            });
        };
        //提交支付信息
        factory.submitStepPayInfo = function (data, callback) {
            return util.api({
                url: "~/op/api/a/odrDraft/draftPaidInfoNext",
                data: data,
                success: callback
            });
        };
        //获取代理商区域
        factory.getAgentArea = function (callback) {
            return util.api({
                url: "~/op/api/a/odrDraft/getAgentArea",
                data: data,
                success: function (result) {
                    if (result.success) {
                        callback(result.value.model);
                    }
                }
            });
        };
        //获取分期产品的数据
        factory.getCurrPayList = function (data, callback) {
            return util.api({
                url: "~/op/api/a/odrDraft/getCurrPayList",
                data: data,
                success: function (result) {
                    if (result.success) {
                        callback(result.value.model);
                    }
                }
            });
        };
        return factory;
    });
});
