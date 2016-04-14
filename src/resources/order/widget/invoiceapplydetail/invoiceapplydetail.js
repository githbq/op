define(function (require, exports, module) {

    var Invoice = require('./index');
    var DataItem = require('common/widget/sform/sform').PageDataClass;
    var controllerConfig = {
        '1': require('./states/type1')
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
    exports.show = function (data, result) {

        var templateData = {content: []};
        var dataItems = require('./dataitems/items').getItems();
        var controller = getDataControllerByType(1);//根据类型获取控制器
        var transferedDataItems = controller.transferDataItem(dataItems, controlDataItems, result);//用控制器转换输入的数据项
        var invoice = new Invoice({templateData: templateData, wrapperView: data.$view, dataItems: transferedDataItems.dataItems, apiPool: {}});
        invoice.render();
        return {
            getData: controller.transferResultData(invoice), validate: function () {
                return invoice.o_validate();
            }
        };
    };
    //根据类型获取不同的订单控制器
    function getDataControllerByType(type) {
        return controllerConfig[type.toString()];
    }

});