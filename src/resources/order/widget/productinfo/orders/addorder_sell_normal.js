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

        controller(terminalDataItems, 'discount_1', function (n) {
            n.visible = true;
        });
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
            n.value = true;

        });
        controller(terminalDataItems, 'useCRM', function (n) {
            n.visible = false;
            n.value = true;
            n.readonly = true;

        });
        controller(terminalDataItems, 'purchaseAmount_3', function (n) {
            n.visible = false;
        });

        controller(terminalDataItems, 'businesscard', function (n) {
            n.visible = false;
        });
        controller(formDataItems, 'payStatus_name', function (n) {
            n.visible = true;
        });
        controller(formDataItems, 'payStatus_select', function (n) {
            n.visible = false;
        });
        common.setNotable(controller, terminalDataItems, tableDataItems, formDataItems);
        //工资助手强制
        common.setGZHelper(controller, terminalDataItems, tableDataItems, formDataItems);
        //增购默认时间
        common.setAddOrderTime(controller, terminalDataItems, tableDataItems, formDataItems);

        common.setCommonData(controller, terminalDataItems, tableDataItems, formDataItems, 7, responseData);


        //增购逻辑
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
            n.value = '7';
            n.on('setFieldValue', function () {
                var me = this;
                if (responseData && responseData.subOrders) {
                    $(responseData.subOrders).each(function (j, m) {
                        var checkbox = me.$('input[type=checkbox][name=check][value=' + n.subOrder.productId + ']');
                        if (n.subOrder && checkbox.length > 0) {//如果存在此纪录 则隐藏 且取消勾选
                            checkbox.prop('checked', false).attr('checked', false);
                            checkbox.parents('tr').attr('hidetr', 'hidetr').hide();
                        }
                    });
                    //一个也没有就隐藏
                    if (me.$('.tableinfo tbody tr:not([hidetr])').length == 0) {
                        me.$('.tableinfo').hide();
                    }
                }
            });
        });
        if (!hasCRM) {
            controller(terminalDataItems, 'type_8', function (n) {
                n.visible = false;
            });
            controller(terminalDataItems, 'purchaseAmount_input_8', function (n) {
                n.visible = false;
            });

            controller(terminalDataItems, 'useCRMWrapper', function (n) {
                n.visible = true;

            });
            controller(terminalDataItems, 'kunbangWrapper', function (n) {
                n.visible=true;
            });
            controller(terminalDataItems, 'useCRM', function (n) {
                n.visible = false;
                n.value=true;
                n.readonly=true;
            });
            controller(terminalDataItems, 'businesscard', function (n) {
                n.visible = true;
            });
        }
        //增购逻辑END


        return {terminalDataItems: terminalDataItems, tableDataItems: tableDataItems, formDataItems: formDataItems};


    }

});










