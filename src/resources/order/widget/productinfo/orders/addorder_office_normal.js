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
                payStatus: 1,
                currPayAmount: formInfoData.currPayAmount,
                payDate: formInfoData.payDate,
                receiptsAccount: formInfoData.receiptsAccount,
                payerName: formInfoData.payerName,
                contractNo: formInfoData.contractNo,
                amount: formInfoData.contractPrice,
                productAmount: formInfoData.productAmount
            };
            return data;
        }
    };
    //转换输入值
    exports.transferDataItem = function (terminalDataItems, tableDataItems, formDataItems) {//转换数据项


        return {terminalDataItems: terminalDataItems, tableDataItems: tableDataItems, formDataItems: formDataItems};
    }

});










