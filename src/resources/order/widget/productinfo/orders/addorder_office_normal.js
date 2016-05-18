define(function (require, exports, module) {
    var common = require('./index');
    //转换结果值
    exports.transferResultData = function (terminalInfo, tableInfo, formInfo) {
        return function () {
            var data = {order: {}, subOrders: [], contract: {}, enterpriseExtend: {}};
            var terminalInfoData = terminalInfo.o_getValues();
            var tableInfoData = tableInfo.o_getValues();
            var formInfoData = formInfo.o_getValues();
            common.setSuborders(terminalInfo, tableInfo, formInfo, data);//设置子订单
            //合同部分//////////////////////////////////////////////////////////////////////////
            common.setOtherData(terminalInfo, tableInfo, formInfo, data);//设置子订单
            return data;
        }
    };
    //转换输入值
    exports.transferDataItem = function (terminalDataItems, tableDataItems, formDataItems, controller, responseData) {//转换数据项

        controller(terminalDataItems, 'useFX', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'typewrapper_3', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'purchaseAmount_input_3', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'purchaseAmount_3', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'businesscard', function (n) {
            n.visible = false;
        });

        controller(formDataItems, 'payStatus_select', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'useCRMWrapper', function (n) {
            n.visible = false;

        });
        controller(terminalDataItems, 'useCRM', function (n) {
            n.visible = false;
            n.value = false;
        });
        common.setNotable(controller, terminalDataItems, tableDataItems, formDataItems);
        var arr = ['currPayAmount_1', 'currPayAmount_2', 'currPayAmount_3', 'currPayAmount_4', 'currPayAmount_5', 'currPayAmount_7', 'currPayAmount_8'];
        $(arr).each(function (i, b) {
            controller(formDataItems, b, function (n) {
                n.visible = false;
            });
        });
        common.setCommonData(controller, terminalDataItems, tableDataItems, formDataItems, 5, responseData);


        //增购逻辑
        var hasCRM = false;
        if (responseData && responseData.data && responseData.data.subOrders) {
            $(responseData.data.subOrders).each(function (j, m) {
                if (m.subOrder.productId == '1') {
                    hasCRM = true;
                }
            });
        }
        common.setAddOrderLogic(controller, terminalDataItems, tableDataItems, formDataItems, 5, responseData);
        //增购逻辑END
        controller(terminalDataItems, 'isadd', function (n) {
            n.value = true;
        });
        return {terminalDataItems: terminalDataItems, tableDataItems: tableDataItems, formDataItems: formDataItems};
    }

});










