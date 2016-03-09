define(function (require, exports, module) {

    //转换输入值
    exports.setSuborders=function(terminalInfo, tableInfo, formInfo,data){
        var terminalInfoData = terminalInfo.o_getValues();
        var tableInfoData = tableInfo.o_getValues();
        var formInfoData = formInfo.o_getValues();
        //suborders //////////////////////////////////////////
        var ids = ['2','3','4', '5', '7'];
        var checkeds = tableInfoData.check.split(',');
        if(terminalInfo.o_getFieldData('businesscard').visible){
            //名片可见
            checkeds.push('8');
        }
        if(terminalInfo.o_getFieldData('useCRMWrapper').visible && terminalInfo.o_getFieldValue('useCRM')){
            //使用CRM
            checkeds.push('1');
        }
        terminalInfo.o_getFieldValue('');
        $(ids).each(function (i, n) {
                if ($.inArray(n, checkeds) >= 0) {
                    data.subOrders.push({
                        subOrder: {
                            productId: n,
                            purchaseCount:  terminalInfoData['purchaseCount_'+n]||1,
                            subOrderType: 1,
                            purchaseAmount: tableInfoData['purchaseAmount_' + n]||0,
                            startTime: tableInfoData['startTime_' + n],
                            endTime: tableInfoData['endTime_' + n],
                            productAmount: tableInfoData['productAmount_' + n]||0,
                            discount: tableInfoData['discount_' + n],
                            currPayAmount:formInfoData['currPayAmount_'+n]||0
                        }
                    });
                }
            }
        );
    }
});










