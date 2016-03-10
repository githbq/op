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
    var orderControllerConfig = {
        '1': require('./orders/neworder_office_normal'),
        '2': require('./orders/neworder_office_special'),
        '3': require('./orders/neworder_sell_normal'),
        '4': require('./orders/neworder_sell_special'),
        '5': require('./orders/addorder_office_normal'),
        '6': require('./orders/addorder_office_special'),
        '7': require('./orders/addorder_sell_normal'),
        '8': require('./orders/addorder_sell_special'),
        '9': require('./orders/reneworder_office_normal'),
        '10': require('./orders/reneworder_office_special'),
        '11': require('./orders/reneworder_sell_normal'),
        '12': require('./orders/reneworder_sell_special')
    };
    var TerminalInfo = require('./terminalinfo');
    var TableInfo = require('./tableinfo');
    var FormInfo = require('./forminfo');
    var terminalDataItems = require('./dataitems/terminaldataitems');
    var tableDataItems = require('./dataitems/tabledataitems');
    var formDataItems = require('./dataitems/formdataitems');
    var terminalInfo, tableInfo, formInfo = null;

    var DataItem = require('./index').PageDataClass;

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

//data:{terminalInfo:{$view:xx},tableInfo:{$view:xx},formInfo:{$view:xx},}
//type:订单类型
    exports.showProductInfo = function (data, type, result) {
        var controller = getDataControllerByType(type);//根据类型获取控制器
        if(!controller){return;}
        var transferedDataItems = controller.transferDataItem(terminalDataItems, tableDataItems, formDataItems, controlDataItems);//用控制器转换输入的数据项
        var apiPool = {api_getServicePrice: api_getServicePrice, api_getCalculateSingle: api_getCalculateSingle};//API池
        if (data.terminalInfo && data.terminalInfo.$view) {
            terminalInfo = new TerminalInfo({wrapperView: data.terminalInfo.$view, dataItems: transferedDataItems.terminalDataItems, apiPool: apiPool});
        }
        if (data.tableInfo && data.tableInfo.$view) {
            tableInfo = new TableInfo({wrapperView: data.tableInfo.$view, dataItems: transferedDataItems.tableDataItems, apiPool: apiPool});
        }
        if (data.formInfo && data.formInfo.$view) {
            formInfo = new FormInfo({wrapperView: data.formInfo.$view, dataItems: transferedDataItems.formDataItems, apiPool: apiPool});
        }
        var refs = {terminalInfo: terminalInfo, tableInfo: tableInfo, formInfo: formInfo, getData: controller.transferResultData(terminalInfo, tableInfo, formInfo)};
        formInfo.__refs = tableInfo.__refs = terminalInfo.__refs = refs;

        terminalInfo.render();
        tableInfo.render();
        formInfo.render();
        terminalInfo.$('[data-name=purchaseCount_1]:first').change();
        tableInfo.$('[data-name=check]:first').change();
        afterRender(type, terminalInfo, tableInfo, formInfo);
        return refs;
    };

    function afterRender(type, terminalInfo, tableInfo, formInfo) {
        if (parseInt(type) <= 8) {
            //续费不让修改
            tableInfo.$('input[value=7]').attr('disabled', 'disabled');
        }
    }


    /*
     * @apiParam {Integer} enterpriseId 企业id
     * @apiParam {Integer} personCount 新增服务人数
     * @apiSuccess {String} result 本次增购服务人数的产品原价
     */
    function api_getServicePrice(options) {
        connectApi($.extend({
            url: '~/op/api/a/odr/getServicePrice'
        }, options))
    }

    /**
     * 计算单一产品折扣
     * @param id 产品id
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param sum 数量
     * @param contractAmount 合同金额
     * @return
     */
    function api_getCalculateSingle(options) {
        connectApi($.extend({
            url: '~/op/api/rebate/calculateSingle'
        }, options))
    }


    function connectApi(option) {
        util.api({
            'url': option.url,
            'data': option.data,
            'success': option.success
        })
    }

    //根据类型获取不同的订单控制器
    function getDataControllerByType(type) {
        return orderControllerConfig[type.toString()];
    }


});










