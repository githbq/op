define(function (require, exports, module) {


    exports.setOtherData=function(terminalInfo, tableInfo, formInfo,data){
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
            productAmount:formInfoData.productAmount
        };

    };
    //转换输入值
    exports.setSuborders=function(terminalInfo, tableInfo, formInfo,data){
        var terminalInfoData = terminalInfo.o_getValues();
        var tableInfoData = tableInfo.o_getValues();
        var formInfoData = formInfo.o_getValues();
        //suborders //////////////////////////////////////////
        var ids = tableInfoData.check.split(',');
        if(terminalInfo.o_getFieldData('businesscard').visible){
            ids.push('8');
        }
        if(terminalInfo.o_getFieldData('useCRMWrapper').visible && me.__refs.terminalInfo.o_getFieldValue('useCRM')){
            ids.push('1');
        }
        if(terminalInfo.o_getFieldValue('useFX')){
            ids.push('2');
            ids.push('3');
        }
        terminalInfo.o_getFieldValue('');
        $(ids).each(function (i, n) {
                if ($.inArray(n, ids) >= 0) {
                    var fromData=tableInfoData;
                    if(n=='1' || n=='2' || n=='3' || n=='8'){
                        fromData=terminalInfoData;
                    }

                    data.subOrders.push({
                        subOrder: {
                            productId: n,
                            purchaseCount:  fromData['purchaseCount_'+n]||1,
                            subOrderType: 1,
                            purchaseAmount: fromData['purchaseAmount_' + n]||0,
                            startTime: fromData['startTime_' + n],
                            endTime: fromData['endTime_' + n],
                            productAmount: fromData['productAmount_' + n]||0,
                            discount: fromData['discount_' + n]||0,
                            currPayAmount:fromData['currPayAmount_'+n]||0
                        }
                    });
                }
            }
        );
    }
});










