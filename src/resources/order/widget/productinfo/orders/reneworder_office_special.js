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
    exports.transferDataItem = function (terminalDataItems, tableDataItems, formDataItems, controller,responseData) {//转换数据项
        controller(terminalDataItems, 'type_13', function (n) {
            n.visible=true;
        });
        controller(terminalDataItems, 'purchaseAmount_13', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems,'useFX',function(n){
            n.value = false;
            n.readonly=false;
        });
        controller(terminalDataItems, 'typewrapper_3', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'purchaseAmount_input_3', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'purchaseAmount_3', function (n) {
            n.visible = false;
        });
        controller(formDataItems, 'payStatus_name', function (n) {
            n.visible = false;
        });
        controller(formDataItems, 'payStatus_select', function (n) {
            n.visible = true;
        });
        controller(tableDataItems,'type_7',function(n){
            n.value = '3';
        });
        common.setNoGZHelper(controller,terminalDataItems, tableDataItems, formDataItems);
        controller(tableDataItems, 'table_type_wrapper', function (n) {
            n.visible = true;
        });
        common.setRenewLogic(controller, terminalDataItems, tableDataItems, formDataItems,10,responseData);
        common.setCommonData(controller, terminalDataItems, tableDataItems, formDataItems,10,responseData);
        common.setRenewLogic(controller, terminalDataItems, tableDataItems, formDataItems,10, responseData);
        controller(terminalDataItems,'isrenew',function(n){
            n.value = true;
        });

        return {terminalDataItems: terminalDataItems, tableDataItems: tableDataItems, formDataItems: formDataItems};
    }

});










