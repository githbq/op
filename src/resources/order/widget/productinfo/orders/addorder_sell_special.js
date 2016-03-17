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
        controller(terminalDataItems, 'type_8', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'purchaseAmount_input_8', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'purchaseAmount_input_3', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'purchaseAmount_1', function (n) {
            n.visible = false;
        });
        controller(terminalDataItems, 'purchaseAmount_input_1', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'useCRMWrapper', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'kunbangWrapper', function (n) {
            n.visible = true;
        });
        controller(terminalDataItems, 'useFX', function (n) {
            n.readonly = false;
            n.value = false;

        });
        controller(terminalDataItems, 'useCRM', function (n) {
            n.visible = false;
            n.readonly = true;
            n.value = true;
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
        controller(formDataItems, 'discount_1', function (n) {
            n.visible = true;
        });
        common.setNotable(controller, terminalDataItems, tableDataItems, formDataItems);
        //工资助手强制
        common.setGZHelper(controller, terminalDataItems, tableDataItems, formDataItems);
        //增购默认时间
        common.setAddOrderTime(controller, terminalDataItems, tableDataItems, formDataItems);
        //工资助手强制 end
        //$(['currPayAmount_1', 'currPayAmount_2', 'currPayAmount_3', 'currPayAmount', 'currPayAmount_5', 'currPayAmount_7']).each(function (i, n) {
        //    controller(formDataItems, n, function (n) {
        //        n.visible = false;
        //    });
        //});
        common.setCommonData(controller, terminalDataItems, tableDataItems, formDataItems, 8, responseData);

        return {terminalDataItems: terminalDataItems, tableDataItems: tableDataItems, formDataItems: formDataItems};

        var hasCRM = false;
        if (responseData && responseData.subOrders) {

            $(responseData.subOrders).each(function (j, m) {

                if (m.subOrder.productId == '1') {
                    hasCRM = true;
                }
            });
        }
        controller(tableDataItems, 'tablelist', function (n) {
            n.visible = true;
        });
        controller(tableDataItems, 'check', function (n) {
            n.value = false;
            n.on('setFieldValue', function () {
                var me = this;
                if (responseData && responseData.subOrders) {
                    $(responseData.subOrders).each(function (j, m) {
                        var checkbox = me.$('input[type=checkbox][name=check][value=' + n.subOrder.productId + ']');
                        if (n.subOrder && checkbox.length > 0) {//如果存在此纪录 则隐藏 且取消勾选
                            checkbox.prop('checked', false).attr('checked', false);
                            checkbox.parents('tr').attr('hidetr','hidetr').hide();
                        }
                    });

                }

            });
        });

        if (!hasCRM) {
            controller(terminalDataItems, 'useFX', function (n) {
                n.visible = false;
            });
            controller(terminalDataItems, 'typewrapper_8', function (n) {
                n.visible = true;
            });
            controller(terminalDataItems, 'typewrapper_1', function (n) {
                n.visible = true;
            });
            controller(tableDataItems, 'type_7', function (n) {
                n.visible = false;
            });
            controller(terminalDataItems, 'purchaseAmount_input_8', function (n) {
                n.visible = false;
            });
            controller(terminalDataItems, 'purchaseAmount_input_3', function (n) {
                n.visible = true;
            });
            controller(terminalDataItems, 'purchaseAmount_input_1', function (n) {
                n.visible = true;
            });
            controller(terminalDataItems, 'discount_1', function (n) {
                n.visible = true;
            });
            controller(terminalDataItems, 'purchaseAmount_1', function (n) {
                n.visible = false;
            });
            controller(terminalDataItems, 'useCRMWrapper', function (n) {
                n.visible = true;

            });
            controller(terminalDataItems, 'useCRM', function (n) {
                n.visible = false;
                n.value = true;
                n.readonly = true;
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
        }
    }

});










