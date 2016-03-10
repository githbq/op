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
    exports.transferDataItem = function (terminalDataItems, tableDataItems, formDataItems, controller) {//转换数据项
        common.setCommonData(controller, terminalDataItems, tableDataItems, formDataItems,4);

        controller(terminalDataItems, 'typewrapper_8', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'typewrapper_1', function (n) {
            n.visible = true;
        });
        controller(tableDataItems, 'table_type_7', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'purchaseAmount_input_8', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'purchaseAmount_wrapper_3', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'purchaseAmount_input_3', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'purchaseAmount_input_1', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'discount_1', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'purchaseAmount_1', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'useCRMWrapper', function (n) {
            n.visible = true;

        });
        controller(terminalDataItems, 'useCRM', function (n) {
            n.visible = true;
            n.value = true;
            n.readonly=true;
        });
        controller(terminalDataItems, 'purchaseAmount_3', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'kunbangWrapper', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'businesscard', function (n) {
            n.visible = true;
        });
        controller(formDataItems, 'payStatus_name', function (n) {
            n.visible = true;
        });
        controller(formDataItems, 'payStatus_name', function (n) {
            n.visible = false;
        });
        controller(formDataItems, 'payStatus_select', function (n) {
            n.visible = true;
        });
        controller(tableDataItems, 'table_type', function (n) {
            n.visible = true;
        });
        //工资助手强制
        common.setGZHelper(controller,terminalDataItems,tableDataItems,formDataItems);
        //工资助手强制 end



        return {terminalDataItems: terminalDataItems, tableDataItems: tableDataItems, formDataItems: formDataItems};
    }

});










