define(function (require, exports, module) {
    //已开普票
    var common = require('./index');
    //转换结果值
    exports.transferResultData = function (itemInfo) {
        return function () {
            var originData = {refundVO: {refund: {}, subRefunds: []}};
            originData.refundVO.refund = itemInfo.o_getValues(function ($ele, data, result) {
                if (data.visible == false) {
                    result[data.name] = undefined;
                    return;
                }
                if (data.name.indexOf('_amount') > 0) {
                    originData.refundVO.subRefunds.push({product_id: 1, amount: 60, refund_amount: result[data.name]});
                }
            });
            return originData;
        }
    };
    //转换输入值
    exports.transferDataItem = function (dataItems, controller, responseData) {//转换数据项
        //common.showOriginFile(controller, dataItems, responseData);
        if (responseData) {
            if (responseData.refund) {
                var refund = responseData.refund;
                for (var i in refund) {
                    if (refund.hasOwnProperty(i)) {
                        controller(dataItems, i, function (item) {
                            item.value = refund[i];
                        })
                    }
                }
            }
            var amount = 0;
            if (responseData.subRefunds) {
                var subRefunds = responseData.subRefunds;
                for (var i = 0; i = subRefunds.length; i++) {
                    var subRefund = subRefunds[i];
                    amount += subRefund.amount || 0;
                }
            }
            controller(dataItems, 'amount', function (item) {
                item.value = amount;
            })
        }
        return {dataItems: dataItems};
    }

});










