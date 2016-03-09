define(function (require, exports, module) {
    //转换结果值
    exports.transferResultData = function (terminalInfo, tableInfo, formInfo) {
        return function () {
            var data = {order: {}, subOrders: [], contract: {}, enterpriseExtend: {}};
            var terminalInfoData = terminalInfo.o_getValues();
            var tableInfoData = tableInfo.o_getValues();
            var formInfoData = formInfo.o_getValues();

            //终端部分//////////////////////////////////

            //销客终端总量
            data.subOrders.push({
                    subOrder: {
                        productId: 2,
                        purchaseCount: terminalInfoData.purchaseCount_2,
                        subOrderType: 1,
                        purchaseAmount: 0,
                        startTime: terminalInfoData.startTime_2,
                        endTime: terminalInfoData.endTime_2,
                        currPayAmount:formInfoData['currPayAmount_'+2]||0
                    }
                }
            );
            //服务人数
            data.subOrders.push({
                    subOrder: {
                        productId: 3,
                        purchaseCount: terminalInfoData.purchaseCount_3,
                        subOrderType: 1,
                        purchaseAmount: terminalInfoData.purchaseAmount_3,
                        startTime: terminalInfoData.startTime_3,
                        endTime: terminalInfoData.endTime_3,
                        currPayAmount:formInfoData['currPayAmount_'+3]||0
                    }
                }
            );


            //表格部分 //////////////////////////////////////////
            var ids = ['4', '5', '7'];
            var checkeds = tableInfoData.check.split(',');
            $(ids).each(function (i, n) {
                    if ($.inArray(n, checkeds) >= 0) {
                        data.subOrders.push({
                            subOrder: {
                                productId: n,
                                purchaseCount: 1,
                                subOrderType: 1,
                                purchaseAmount: tableInfoData['purchaseAmount_' + n],
                                startTime: tableInfoData['startDate_' + n],
                                endTime: tableInfoData['endDate_' + n],
                                productAmount: tableInfoData['productAmount_' + n],
                                discount: tableInfoData['discount_' + n]
                            }
                        });
                    }
                }
            );
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
                businessCardPrise: useBusinessCart ? terminalInfo.o_getFiledValue('purchaseAmount_8') : 0
            };
            //订单主信息
            data.order = {
                payStatus: 1,
                currPayAmount: formInfoData.currPayAmount,
                payDate: formInfoData.payDate,
                receiptsAccount: formInfoData.receiptsAccount,
                payerName: formInfoData.payerName,
                contractNo: formInfoData.contractNo,
                amount: formInfoData.contractPrice
            };
            return data;
        }
    };
    //转换输入值
    exports.transferDataItem = function (terminalDataItems, tableDataItems, formDataItems) {//转换数据项
        $(terminalDataItems).each(function(i,n){
           if(n.name=='typewrapper_3'){
               n.visible=true;
           }

        });
        return {terminalDataItems:terminalDataItems,tableDataItems:tableDataItems,formDataItems:formDataItems};
    }

});










