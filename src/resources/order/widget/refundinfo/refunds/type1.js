define(function (require, exports, module) {
    //已开普票
    var common = require('./index');
    //转换结果值
    exports.transferResultData = function (itemInfo) {
        return function () {
            var originData = {refundVO:{refund:{},subRefunds:[]}};
            originData.refundVO.refund= itemInfo.o_getValues(function($ele, data, result){
                if(data.visible==false){
                    result[data.name]=undefined;
                    return;
                }
                if(data.name.indexOf('_amount')>0){
                    originData.refundVO.subRefunds.push({product_id:1,amount:60,refund_amount:result[data.name]});
                }
            });
            return originData;
        }
    };
    //转换输入值
    exports.transferDataItem = function (dataItems, controller, responseData) {//转换数据项
        //common.showOriginFile(controller, dataItems, responseData);
        return {dataItems:dataItems};
    }

});










