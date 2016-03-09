define(function (require, exports, module) {
    var common=require('./index');
    //转换结果值
    exports.transferResultData = function (terminalInfo, tableInfo, formInfo) {
        return function () {
            var data = {order: {}, subOrders: [], contract: {}, enterpriseExtend: {}};
            var terminalInfoData = terminalInfo.o_getValues();
            var tableInfoData = tableInfo.o_getValues();
            var formInfoData = formInfo.o_getValues();
            common.setSuborders(terminalInfo, tableInfo, formInfo,data);//设置子订单
            //合同部分//////////////////////////////////////////////////////////////////////////
            common.setOtherData(terminalInfo, tableInfo, formInfo,data);//设置子订单
            return data;
        }
    };
    //转换输入值
    exports.transferDataItem = function (terminalDataItems, tableDataItems, formDataItems) {//转换数据项

        $(terminalDataItems).each(function (i, n) {
            if (n.name == 'typewrapper_3') {
                n.visible = false;
            }
            if (n.name == 'purchaseAmount_wrapper_3') {
                n.visible = false;
            }
            else if (n.name == 'purchaseAmount_input_3') {
                n.visible = false;
            }
            else if (n.name == 'purchaseAmount_3') {
                n.visible = false;
            } else if (n.name == 'businesscard') {
                n.visible = false;
            }


        });

        var arr=['payStatus_select','currPayAmount_1','currPayAmount_1', 'currPayAmount_2', 'currPayAmount_3', 'currPayAmount_4', 'currPayAmount_5', 'currPayAmount_7'];
        $(arr).each(function(i,b){
            controller(formDataItems,b,function(n){
                n.visible = false;
            });
        });


        return {terminalDataItems: terminalDataItems, tableDataItems: tableDataItems, formDataItems: formDataItems};
    }

});










