define(function (require, exports, module) {

    var config = {
        '1': '办公版新购-普通',
        '2': '办公版新购-特批',
        '3': '营销版新购-普通',
        '4': '营销版新购-特批',
        '5': '办公版增购-普通',
        '6': '办公版增购-特批',
        '7': '营销版增购-普通',
        '8': '营销版增购-特批',
        '9': '办公版续费-普通',
        '10': '办公版续费-特批',
        '11': '营销版续费-普通',
        '12': '营销版续费-特批',
        '13': '关联自注册办公版-普通',
        '14': '关联自注册办公版-特批',
        '15': '关联自注册营销版-普通',
        '16': '关联自注册营销版-特批',
        '17': '收尾款'
    };
    var TerminalInfo = require('./terminalinfo');
    var TableInfo = require('./tableinfo');
    var FormInfo = require('./forminfo');
    var terminalDataItems = require('./dataitems/terminaldataitems');
    var tableDataItems = require('./dataitems/tabledataitems');
    var formDataItems = require('./dataitems/formdataitems');
    var terminalInfo, tableInfo, formInfo = null;
//data:{terminalInfo:{$view:xx,dataItems},tableInfo:{$view:xx,dataItems},formInfo:{$view:xx,dataItems},}
//type:订单类型
    exports.showProductInfo = function (data, type) {

        if (data.terminalInfo && data.terminalInfo.$view) {
            data.terminalInfo.$view.addClass('productinfo');
            terminalInfo = new TerminalInfo({view: data.terminalInfo.$view, dataItems: data.terminalInfo.dataItems || terminalDataItems});
        }
        if (data.tableInfo && data.tableInfo.$view) {
            data.terminalInfo.$view.addClass('productinfo');
            tableInfo = new TableInfo({view: data.tableInfo.$view, dataItems: data.tableInfo.dataItems || tableDataItems});
        }
        if (data.formInfo && data.formInfo.$view) {
            data.terminalInfo.$view.addClass('productinfo');
            formInfo = new FormInfo({view: data.formInfo.$view, dataItems: data.formInfo.dataItems || formDataItems});
        }
        return {terminalInfo: terminalInfo, tableInfo: tableInfo, formInfo: formInfo, data: transferDataByType(type)};
    };

    function getXinGouNormal(terminalInfo, tableInfo, formInfo) {


    }

    //转换数据
    function transferDataByType(type) {
        type = type || '1';
        var data = {order: {}, subOrders: [], contract: {}, enterpriseExtend: {}};
        switch (config[type]) {
            case '办公版新购-普通':
            {
                var terminalInfoData = terminalInfo.o_getValues();
                var tableInfoData = tableInfo.o_getValues();
                var formInfoData = formInfo.o_getValues();

                //终端部分//////////////////////////////////
                //销客终端总量
                data.subOrders.push({
                    purchaseCount: terminalInfoData.purchaseCount_0,
                    subOrderType: 0,
                    purchaseAmount: null,
                    startTime: terminalInfoData.startTime_0,
                    endTime: terminalInfoData.endTime_0
                });
                //服务人数
                data.subOrders.push({
                    purchaseCount: terminalInfoData.purchaseCount_1,
                    subOrderType: 1,
                    purchaseAmount: terminalInfoData.purchaseAmount_1,
                    startTime: null,
                    endTime: null
                });

                //表格部分 //////////////////////////////////////////
                var ids = ['11', '22', '33', '44'];
                var checkeds = tableInfoData.check.split(',');
                $(ids).each(function (i, n) {
                        if ($.inArray(n, checkeds) >= 0) {
                            data.subOrders.push({
                                purchaseCount: tableInfoData['purchaseCount_' + n],
                                subOrderType: 11,
                                purchaseAmount: tableInfoData['purchaseAmount_' + n],
                                startTime: tableInfoData['startDate_' + n],
                                endTime: tableInfoData['endDate_' + n],
                                productAmount: tableInfoData['productAmount_' + n]
                            });
                        }
                    }
                );
                debugger
                //合同部分//////////////////////////////////////////////////////////////////////////
                var contractData = $.parseJSON( '{}'||formInfoData.contract);
                var contractCopyData = $.parseJSON( '{}'||formInfoData.contractCopy);
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
                var companyGatePictureData = $.parseJSON( '{}'||formInfoData.companyGatePicture);
                data.enterpriseExtend = {
                    compayGatePicture: companyGatePictureData.compayGatePicture,
                    compayGatePictureFileName: companyGatePictureData.compayGatePictureFileName,
                    companyGateKeyword: formInfoData.companyGateKeyword,
                    companyGateRemark: formInfoData.companyGateRemark
                };
            }
                break;
        }
        console.warn('transferData=>' + type + ':' + JSON.stringify(data));
        return data;
    }
});









