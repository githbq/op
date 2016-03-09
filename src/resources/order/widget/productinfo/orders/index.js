define(function (require, exports, module) {

    exports.setCommonData = function (controller, terminalDataItems, tableDataItems, formDataItems, type) {
        type = type.toString();
        controller(terminalDataItems, 'keyword', function (n) {
            if ($.inArray(type, ['1', '2', '3', '4']) >= 0) {
                n.value = '新购';
            }
            else if ($.inArray(type, ['5', '6', '7', '8']) >= 0) {
                n.value = '增购';
            }
            else if ($.inArray(type, ['9', '10', '11', '12']) >= 0) {
                n.value = '续费';
            }

        })
    }

    exports.setOtherData = function (terminalInfo, tableInfo, formInfo, data) {
        var terminalInfoData = terminalInfo.o_getValues();
        var tableInfoData = tableInfo.o_getValues();
        var formInfoData = formInfo.o_getValues();
        var contractData = $.parseJSON(formInfoData.contract || '{}');
        var contractCopyData = $.parseJSON(formInfoData.contractCopy || '{}');
        data.contract = {
            contractNo: formInfoData.contractNo,
            contractPrice: formInfoData.contractPrice,
            sealName: formInfoData.sealName,
            contract: contractData.contract,
            contractFileName: contractData.contractFileName,
            contractCopy: contractCopyData.contractCopy,
            contractCopyFileName: contractCopyData.contractCopyFileName
        };
        //门头照片
        var companyGatePictureData = $.parseJSON(formInfoData.companyGatePicture || '{}');
        var useBusinessCart = terminalInfo.o_getFieldData('businesscard').visible && terminalInfo.o_getFieldValue('useCRM') ? 1 : 0;//名片可见 CRM已勾选
        data.enterpriseExtend = {
            compayGatePicture: companyGatePictureData.compayGatePicture,
            compayGatePictureFileName: companyGatePictureData.compayGatePictureFileName,
            companyGateKeyword: formInfoData.companyGateKeyword,
            companyGateRemark: formInfoData.companyGateRemark,
            useBusinessCard: useBusinessCart,
            businessCardPrise: useBusinessCart ? terminalInfo.o_getFieldValue('purchaseAmount_8') : 0
        };
        //订单主信息
        data.order = {
            payStatus: formInfoData.payStatus,
            currPayAmount: formInfoData.currPayAmount,
            payDate: formInfoData.payDate,
            receiptsAccount: formInfoData.receiptsAccount,
            payerName: formInfoData.payerName,
            contractNo: formInfoData.contractNo,
            amount: formInfoData.contractPrice,
            productAmount: formInfoData.productAmount
        };

    };

    exports.setGZHelper = function (controller, terminalDataItems, tableDataItems, formDataItems) {
        controller(tableDataItems, 'table_type_7', function (n) {
            n.visible = false;
        });
        controller(tableDataItems, 'startTime_7', function (n) {
            n.readonly = true;
        });
        controller(tableDataItems, 'endTime_7', function (n) {
            n.readonly = true;
        });
        controller(tableDataItems, 'purchaseAmount_7', function (n) {
            n.readonly = true;
            n.value = 0;
        });
        controller(tableDataItems, 'productAmount_7', function (n) {
            n.value = 0;
        });

    };
    //没有表格
    exports.setNotable = function (controller, terminalDataItems, tableDataItems, formDataItems) {
        controller(tableDataItems, 'tablelist', function (n) {
            n.visible = false;
        });
        controller(tableDataItems, 'check', function (n) {
            n.value = false;
        });
    };
    //
    exports.setNoGZHelper = function (controller, terminalDataItems, tableDataItems, formDataItems) {
        controller(tableDataItems, 'check', function (n) {
            n.value = false;
        });
        controller(tableDataItems, 'startTime_7', function (n) {
            n.value = '';
        });
        controller(tableDataItems, 'endTime_7', function (n) {
            n.value = '';
        });
    };

    //转换输入值
    exports.setSuborders = function (terminalInfo, tableInfo, formInfo, data) {
        var terminalInfoData = terminalInfo.o_getValues();
        var tableInfoData = tableInfo.o_getValues();
        var formInfoData = formInfo.o_getValues();
        //suborders //////////////////////////////////////////
        var ids = tableInfoData.check.split(',');
        if (terminalInfo.o_getFieldData('businesscard').visible) {
            ids.push('8');
        }
        if (terminalInfo.o_getFieldData('useCRMWrapper').visible && terminalInfo.o_getFieldValue('useCRM')) {
            ids.push('1');
        }
        if (terminalInfo.o_getFieldValue('useFX')) {
            ids.push('2');
            ids.push('3');
        }
        terminalInfo.o_getFieldValue('');
        $(ids).each(function (i, n) {
                if ($.inArray(n, ids) >= 0) {
                    var fromData = tableInfoData;
                    var controler = tableInfo;
                    if (n == '1' || n == '2' || n == '3' || n == '8') {
                        fromData = terminalInfoData;
                        controler = terminalInfo;
                    }

                    var subOrder = {
                        productId: n,
                        purchaseCount: fromData['purchaseCount_' + n] || 1,
                        subOrderType: 1,
                        purchaseAmount: fromData['purchaseAmount_' + n] || 0,
                        startTime: fromData['startTime_' + n],
                        endTime: fromData['endTime_' + n],
                        productAmount: fromData['productAmount_' + n] || 0,
                        discount: fromData['discount_' + n] || 0,
                        currPayAmount: fromData['currPayAmount_' + n] || 0
                    };
                    if (n == '3') {
                        subOrder.startTime = fromData['startTime_2'];
                        subOrder.endTime = fromData['endTime_2'];
                    }
                    if (n == '1') {
                        if (terminalInfo.o_getFieldValue('kunbang') && terminal.o_data_getField('kunbang').is(':visible'))
                            subOrder.extends = [{productKey: 'bind', productValue: terminalInfo.o_getFieldValue('kunbang')}]
                    }
                    if (controler.o_data_getField('type_' + n).is(':visible')) {
                        var value = controler.o_getFieldValue('type_' + n);
                        if (n == '8' && value == '3') {
                            value = '4';//名片的值3  为4 代表正常
                        }
                        subOrder.extends = [{productKey: 'buytype', productValue: value}]
                    }
                    data.subOrders.push({
                        subOrder: subOrder
                    });
                }
            }
        );
    }
});










