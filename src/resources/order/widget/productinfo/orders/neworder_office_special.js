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
        controller(terminalDataItems, 'useFX', function (n) {
            n.visible=false;
        });
        controller(terminalDataItems, 'giveCount_16', function (n) {
            n.value=1000;
        });
        controller(terminalDataItems, 'type_13', function (n) {
            n.visible=true;
        });
        controller(terminalDataItems, 'useCRM', function (n) {
            n.visible=false;
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
        controller(terminalDataItems, 'purchaseAmount_13', function (n) {
            n.visible = false;
        });
        controller(formDataItems, 'payStatus_name', function (n) {
            n.visible = false;
        });
        controller(formDataItems, 'payStatus_select', function (n) {
            n.visible = true;
        });
        controller(tableDataItems, 'table_type_wrapper', function (n) {
            n.visible = true;
        });
        //工资助手强制
        common.setGZHelper(controller,terminalDataItems,tableDataItems,formDataItems);
        //工资助手强制 end

        controller(terminalDataItems,'isnew',function(n){
            n.value = true;
        });
        common.setCommonData(controller, terminalDataItems, tableDataItems, formDataItems,2,responseData);
        return {terminalDataItems: terminalDataItems, tableDataItems: tableDataItems, formDataItems: formDataItems};
    }

});










