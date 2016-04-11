define(function (require, exports, module) {
    //已开专票
    var common = require('./index');
    //转换结果值
    exports.transferResultData = function (itemInfo) {
        return function () {

            return data;
        }
    };
    //转换输入值
    exports.transferDataItem = function (dataItems, controller, responseData) {//转换数据项
        controller(dataItems, 'tipinfo', function (n) {
            n.value = '客户单位开具红字发票信息表、发票复印件必须退回！邮寄地址：北京市海淀区知春路甲63号卫星大厦纷享逍客703，陈贞  电话010-51242540';
        });
        common.hideBackTime(controller, dataItems, responseData);
        common.setCommonData(controller, dataItems, responseData);


        return {dataItems:dataItems};
    }

});










