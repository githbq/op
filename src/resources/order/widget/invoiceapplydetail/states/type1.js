define(function (require, exports, module) {
    //已开普票
    var common = require('./index');
    //转换结果值
    exports.transferResultData = function (itemInfo) {
        return function () {
            var originData = {refund: {}, subRefunds: []};

            return originData;
        }
    };
    //转换输入值
    exports.transferDataItem = function (dataItems, controller, responseData,type) {//转换数据项
        controller(dataItems,'save',function(item){
            item.visible=false;
        });
        common.setCommonData(dataItems,controller , responseData, type);
        return {dataItems: dataItems};
    }

});










