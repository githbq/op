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

    exports.show = function (type, data, result) {
        var templateData = {
            content: [
                {title: 'CRM申请退款金额', name: 'crm_amount', value:''},
                {title: 'PK助手申请退款金额', name: 'pk_amount', value: ''},
                {title: '会议助手申请退款金额', name: 'meeting_amount', value: ''},
                {title: '自定义助手申请退款金额', name: 'custom_amount', value: ''},
                {title: '工资助手申请退款金额', name: 'salary_amount', value: ''},
                {title: '申请退款总金额', name: 'refund_amount', value: ''}
            ]
        };
        var dataItems = require('./dataitems/items').getItems();
        var controller = getDataControllerByType(1);//根据类型获取控制器
        var transferedDataItems = controller.transferDataItem(dataItems, controlDataItems, result);//用控制器转换输入的数据项
        var refundInfo = new RefundInfo({templateData: templateData, wrapperView: data.$view, dataItems: transferedDataItems.dataItems, apiPool: {}});
        refundInfo.render();
        return { getData: controller.transferResultData(refundInfo),validate:function(){
            return refundInfo.o_validate();
        }};
    };
    //根据类型获取不同的订单控制器
    function getDataControllerByType(type) {
        return orderControllerConfig[type.toString()];
    }

});