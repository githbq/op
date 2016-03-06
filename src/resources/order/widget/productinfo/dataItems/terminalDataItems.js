define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var dataItems = module.exports = [];
    //终端总个数
    dataItems.push(new DataItem({
        name: 'purchaseCount_0',
        value: '1000',
        attr: {readonly: true}
        //,validateOptions: {
        //    required: {
        //        enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
        //        }
        //    }
        //},
        //events: [
        //    {
        //        key: 'click',
        //        value: function (e) {
        //        }
        //    }
        //]
    }));
    //终端开始日期
    dataItems.push(new DataItem({
        name: 'startTime_0',
        value: '',
        attr: {readonly: true}
    }));
    //终端结束日期
    dataItems.push(new DataItem({
        name: 'endTime_0',
        value: '',
        attr: {readonly: true}
    }));


    //服务人数
    dataItems.push(new DataItem({
        name: 'purchaseCount_1',
        value: '[服务人数]',
        validateOptions: {
            required: {
                enable: true, value: true, message: '请填写服务人数', handler: function (error, value, option, $ele) {
                }
            }
        }
    }));

    //产品原价
    dataItems.push(new DataItem({
        name: 'purchaseAmount_1',
        value: '[产品原价]'
    }));
    //产品原价
    dataItems.push(new DataItem({
        name: 'purchaseAmount_1',
        value: '[产品原价]'
    }));


    //名片部分
    dataItems.push(new DataItem({
        name: 'businesscard'
    }));


});
