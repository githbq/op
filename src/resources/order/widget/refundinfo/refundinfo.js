define(function (require, exports, module) {

    var RefundInfo = require('./index');

    var orderControllerConfig = {
        '1': require('./dataitems/type1')
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
    exports.show = function (type, data) {
        var terminalDataItems = require('./dataitems/items').getItems();
        var controller = getDataControllerByType(type);//根据类型获取控制器
          var refundInfo=new RefundInfo({wrapperView: data.$view, dataItems: transferedDataItems.formDataItems, apiPool: apiPool});
    }
    //根据类型获取不同的订单控制器
    function getDataControllerByType(type) {
        return orderControllerConfig[type.toString()];
    }

});