define(function (require, exports, module) {
    //已开普票
    var common = require('./index');
    //转换结果值
    exports.transferResultData = function (itemInfo) {
        return function () {
            var originData = {refund: {}, subRefunds: []};
            var data = itemInfo.o_getValues();
            originData.refund.orderId = data.orderId;
            originData.refund.amount = data.amount;
            originData.refund.refundAmount = data.refundAmount;
            originData.refund.refundReason = data.refundReason;
            originData.refund.approvedUrl = data.approvedUrl;
            originData.refund.remark = data.remark;
            if (data.productIds) {
                $(data.productIds).each(function (i, n) {
                    originData.subRefunds.push({productId: n, amount: data['amount_' + n], refundAmount: data['refundAmount_' + n]})
                });
            }
            return originData;
        }
    };
    //转换输入值
    exports.transferDataItem = function (dataItems, controller, responseData) {//转换数据项
        controller(dataItems, 'refundAmount', function (item) {
            item.readonly = true;
        });
        if (responseData) {
            if (responseData.refund) {
                var refund = responseData.refund;
                for (var i in refund) {
                    if (refund.hasOwnProperty(i)) {
                        controller(dataItems, i, function (item) {
                            item.value = refund[i];
                            if (responseData.readonly === true) {
                                item.readonly = true;
                            }
                        })
                    }
                }
            }
            var amount = 0;
            if (responseData.subRefunds) {
                var subRefunds = responseData.subRefunds;
                for (var i = 0; i < subRefunds.length; i++) {
                    var subRefund = subRefunds[i];
                    amount += subRefund.amount || 0;
                    controller(dataItems, 'productIds', function (item) {
                        item.value = item.value || [];
                        item.value.push(subRefund.productId);
                    });
                    controller(dataItems, 'amount_' + subRefund.productId, function (item) {
                        item.value = subRefund.amount;
                    });
                    controller(dataItems, 'refundAmount_' + subRefund.productId, function (item) {
                        item.value = subRefund.refundAmount;
                        if (responseData.readonly === true) {
                            item.readonly = true;
                        }
                        item.events = [{
                            key: 'change', value: function (e) {
                                var me = this;
                                var $dom = $(e.target);
                                var refundAmount = 0;
                                setTimeout(function () {
                                    //if ($dom.val() && parseFloat($dom.val()) > me.o_getFieldData('amount_' + subRefund.productId).value) {
                                    //    $dom.val(me.o_getFieldData('amount_' + subRefund.productId).value)
                                    //}
                                    me.o_eachFields(function ($ele, data) {
                                        if (data.name.indexOf('refundAmount_') == 0 && $ele.val()) {
                                            refundAmount += parseFloat($ele.val());
                                        }
                                    });
                                    me.o_setValue({name: 'refundAmount', value: refundAmount});
                                }, 10);

                            }
                        }]
                    })
                }
            }
            controller(dataItems, 'amount', function (item) {
                item.value = amount;
            });
        }
        return {dataItems: dataItems};
    }

});










