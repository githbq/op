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

        controller(terminalDataItems, 'typewrapper_3', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'purchaseAmount_input_3', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'purchaseAmount_3', function (n) {
            n.visible = false;
        });

        controller(terminalDataItems, 'businesscard', function (n) {
            n.visible = false;
        });
        controller(formDataItems, 'payStatus_name', function (n) {
            n.visible = false;
        });
        controller(formDataItems, 'payStatus_select', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'useCRMWrapper', function (n) {
            n.visible = false;

        });
        controller(terminalDataItems, 'useCRM', function (n) {
            n.visible = false;
            n.value = false;
        });
        common.setNotable(controller,terminalDataItems,tableDataItems,formDataItems);

        //工资助手强制
        common.setGZHelper(controller,terminalDataItems,tableDataItems,formDataItems);
        //工资助手强制 end
        //$(['currPayAmount_1', 'currPayAmount_2', 'currPayAmount_3', 'currPayAmount', 'currPayAmount_5', 'currPayAmount_7']).each(function (i, n) {
        //    controller(formDataItems, n, function (n) {
        //        n.visible = false;
        //    });
        //});
        common.setCommonData(controller, terminalDataItems, tableDataItems, formDataItems,6,responseData);
        return {terminalDataItems: terminalDataItems, tableDataItems: tableDataItems, formDataItems: formDataItems};
    }

});










