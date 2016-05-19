define(function (require, exports, module) {

    var Invoice = require('./index');
    var DataItem = require('common/widget/sform/sform').PageDataClass;
    var controllerConfig = {
        '1': require('./states/type1'),
        '2': require('./states/type2'),
        '3': require('./states/type3'),
        '4': require('./states/type4')
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

    exports.show = function (type, data, func) {
        //data.data.invoiceId = 66;
        //data.data.processInstanceId = "1110326";
        util.api({
            'url': '/odr/invoice/' + data.data.invoiceId + '/detail',
            'data': {},
            success: success
        });
        function success(result) {
            var resultData = null;
            if (result.success) {
                resultData = result.model;
            }
            resultData.invoiceId = data.data.invoiceId;
            resultData.processInstanceId = data.data.processInstanceId;
            var dataItems = require('./dataitems/items').getItems();

            if( type == 2 && resultData.notRefundStatus == false ){
                type = 4;
            }
            
            var controller = getDataControllerByType(type);//根据类型获取控制器
            var transferedDataItems = controller.transferDataItem(dataItems, controlDataItems, resultData);//用控制器转换输入的数据项
            var invoice = new Invoice({templateData: {}, wrapperView: data.$view, dataItems: transferedDataItems.dataItems, apiPool: {}});
            invoice.o_setValue({name: 'invoiceType-' + resultData.invoice.invoiceType, visible: true});
            invoice.render();
            var returnData = {
                instance: invoice,
                getData: controller.transferResultData(invoice), validate: function () {
                    return invoice.o_validate();
                }
            };
            func && func(returnData);
        }
    };
    //根据类型获取不同的订单控制器
    function getDataControllerByType(type) {
        return controllerConfig[type.toString()];
    }

});