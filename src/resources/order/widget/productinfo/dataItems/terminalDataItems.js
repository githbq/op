define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var dataItems = module.exports = [];
    //终端总个数
    dataItems.push(new DataItem({
        name: 'purchaseCount_2',
        value: '1000',
        readonly: true
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
        name: 'startTime_2',
        value: new Date().getTime(),
        readonly: true
    }));
    //终端结束日期
    dataItems.push(new DataItem({
        name: 'endTime_2',
        value: new Date().getTime(),
        readonly: true
    }));


    //服务人数
    dataItems.push(new DataItem({
        name: 'purchaseCount_3',
        value: '',
        __silent: true,
        events: [{
            key: 'change', value: function (e) {
                var me = this;
                var $dom = $(e.target);
                $dom.val($dom.val().replace(/[^\.\d]/g, ''));
                me.o_field_getData($dom).__silent = false;

            }
        }],
        validateOptions: {
            required: {
                enable: true, value: true, message: '请填写服务人数', handler: function (error, value, option, $ele) {
                }
            }
        }
    }));

    //产品原价
    dataItems.push(new DataItem({
        name: 'purchaseAmount_3',
        value: ''
    }));
    //产品原价
    dataItems.push(new DataItem({
        name: 'purchaseAmount_3',
        value: ''
    }));


    //名片部分
    dataItems.push(new DataItem({
        name: 'businesscard'
    }));


});
