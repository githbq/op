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
            data.terminalInfo.data && transferDataItems(data.terminalInfo.data, terminalDataItems);
            terminalInfo = new TerminalInfo({wrapperView: data.terminalInfo.$view, dataItems: terminalDataItems});
        }
        if (data.tableInfo && data.tableInfo.$view) {
            data.terminalInfo.$view.addClass('productinfo');
            data.terminalInfo.data && transferDataItems(data.tableInfo.data, tableDataItems);
            tableInfo = new TableInfo({wrapperView: data.tableInfo.$view, dataItems: tableDataItems});
        }
        if (data.formInfo && data.formInfo.$view) {
            data.terminalInfo.$view.addClass('productinfo');
            data.terminalInfo.data && transferDataItems(data.formInfo.data, formDataItems);
            formInfo = new FormInfo({wrapperView: data.formInfo.$view, dataItems: formDataItems});
        }
        debugger
        var refs = {terminalInfo: terminalInfo, tableInfo: tableInfo, formInfo: formInfo, getData: getTransferDataByType(type)};
        formInfo.__refs = tableInfo.__refs = terminalInfo.__refs = refs;
        terminalInfo.render();
        tableInfo.render();
        formInfo.render();
        terminalInfo.$('[data-name=purchaseCount_1]:first').change();

        return refs;
    };

    function getXinGouNormal(terminalInfo, tableInfo, formInfo) {


    }

    //dataItem转换
    function transferDataItems(data, dataItems) {
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                var temp = {};
                temp[i] = data[i];
                var item = _.findWhere(dataItems, temp);
                item && $.extend(item, {value: data[i]});
            }
        }
    }

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
                    productId:2,
                    purchaseCount: terminalInfoData.purchaseCount_2,
                    subOrderType: 0,
                    purchaseAmount: null,
                    startTime: terminalInfoData.startTime_2,
                    endTime: terminalInfoData.endTime_2
                });
                //服务人数
                data.subOrders.push({
                    productId:3,
                    purchaseCount: terminalInfoData.purchaseCount_3,
                    subOrderType: 1,
                    purchaseAmount: terminalInfoData.purchaseAmount_3,
                    startTime: null,
                    endTime: null
                });

                //表格部分 //////////////////////////////////////////
                var ids = [4,5,7];
                var checkeds = tableInfoData.check.split(',');
                $(ids).each(function (i, n) {
                        if ($.inArray(n, checkeds) >= 0) {
                            data.subOrders.push({
                                productId:n,
                                purchaseCount: 1,
                                subOrderType: 1,
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
                var contractData = $.parseJSON('{}' || formInfoData.contract);
                var contractCopyData = $.parseJSON('{}' || formInfoData.contractCopy);
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
                var companyGatePictureData = $.parseJSON('{}' || formInfoData.companyGatePicture);
                data.enterpriseExtend = {
                    compayGatePicture: companyGatePictureData.compayGatePicture,
                    compayGatePictureFileName: companyGatePictureData.compayGatePictureFileName,
                    companyGateKeyword: formInfoData.companyGateKeyword,
                    companyGateRemark: formInfoData.companyGateRemark
                };
                //订单主信息
                data.order = {
                    payStatus: 1,
                    currPayAmount: formInfoData.currPayAmount,
                    payDate: formInfoData.payDate,
                    receiptsAccount: formInfoData.receiptsAccount,
                    payerName: formInfoData.payerName,
                    contractNo: formInfoData.contractNo,
                    contractPrice: formInfoData.contractPrice
                };

            }
                break;
        }
        console.warn('transferData=>' + type + ':' + JSON.stringify(data));
        return data;
    }

    function getTransferDataByType(type) {
        //转换数据
        return function () {
            transferDataByType(type);
        }
    }

});










