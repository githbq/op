define(function (require, exports, module) {

    var RefundInfo = require('./index');
    var DataItem = require('common/widget/sform/sform').PageDataClass;
    var orderControllerConfig = {
        '1': require('./refunds/type1')
    };

    function controlDataItems(items, name, func) {
        var find = null;
        $(items).each(function (i, n) {
            if (n.name === name) {
                find = n;
                return false;
            }
        });
        if (!find) {
            find = new DataItem({name: name});
            items.push(find);
        }
        func(find);
    }

    var productIdDic = {
        '1': 'CRM',
        '2': '逍客终端',
        '3': '服务',
        '4': 'PK助手',
        '5': '会议助手',
        '6': 'HR助手',
        '7': '工资助手',
        '8': '名片',
        '10': '百川',
        '11': '报数',
        '12': '自定义助手'
    };
    exports.show = function (data, result) {
        //result = {
        //    refund: {
        //        orderId:'123',
        //        amount:10086,
        //        refundAmount:0,
        //        refundReason:'退款原因',
        //        approvedUrl:'http://www.baidu.common',
        //        remark:'备注写什么'
        //    }, subRefunds: [
        //        {productId:4,amount:444,refundAmount:null},
        //        {productId:5,amount:555,refundAmount:null},
        //        {productId:6,amount:666,refundAmount:null},
        //        {productId:7,amount:777,refundAmount:null}
        //    ]
        //};
        //result.readonly=true;
        var templateData = {content: []};
        if (result && result.subRefunds) {
            $(result.subRefunds).each(function (i, n) {
                templateData.content.push({title: productIdDic[n.productId.toString()], name: 'refundAmount_' + n.productId, value: n.amount});
            });
        }
        var dataItems = require('./dataitems/items').getItems();
        var controller = getDataControllerByType(1);//根据类型获取控制器
        var transferedDataItems = controller.transferDataItem(dataItems, controlDataItems, result);//用控制器转换输入的数据项
        var refundInfo = new RefundInfo({templateData: templateData, wrapperView: data.$view, dataItems: transferedDataItems.dataItems, apiPool: {}});
        refundInfo.render();
        return {
            getData: controller.transferResultData(refundInfo), validate: function () {
                return refundInfo.o_validate();
            }
        };
    };
    //根据类型获取不同的订单控制器
    function getDataControllerByType(type) {
        return orderControllerConfig[type.toString()];
    }

});