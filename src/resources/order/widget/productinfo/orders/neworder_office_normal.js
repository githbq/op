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
    exports.transferDataItem = function (terminalDataItems, tableDataItems, formDataItems,controller) {//转换数据项
        common.setCommonData(controller, terminalDataItems, tableDataItems, formDataItems,1);
        controller(terminalDataItems, 'typewrapper_3', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'purchaseAmount_wrapper_3', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'purchaseAmount_input_3', function (n) {
            n.visible = false;
        });

        controller(terminalDataItems, 'purchaseAmount_3', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'businesscard', function (n) {
            n.visible = false;
        });
        controller(formDataItems, 'payStatus_select', function (n) {
            n.visible = false;
        });
        //工资助手强制
        common.setGZHelper(controller,terminalDataItems,tableDataItems,formDataItems);
        //工资助手强制 end
        var arr=['currPayAmount_1', 'currPayAmount_2', 'currPayAmount_3', 'currPayAmount_4', 'currPayAmount_5', 'currPayAmount_7'];
        $(arr).each(function(i,b){
            controller(formDataItems,b,function(n){
                n.visible = false;
            });
        });


        return {terminalDataItems: terminalDataItems, tableDataItems: tableDataItems, formDataItems: formDataItems};
    }

});










