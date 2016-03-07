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
        value: new Date().getTime()
    }));
    //终端结束日期
    dataItems.push(new DataItem({
        name: 'endTime_2',
        value: new Date().getTime()
    }));

    //表单部分订单总金额
    dataItems.push(new DataItem({
        name: 'enterpriseId',
        value: null
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
                if ($dom.val()) {
                    me.attrs.apiPool.api_getServicePrice({
                        data: {enterpriseId: me.o_getFieldValue('enterpriseId'), personCount: $dom.val()}, success: function (response) {
                            //{"login":true,"model":2000,"privilege":true,"success":true,"value":{"model":2000}}
                            if (response.success) {
                                me.o_setValue({name: 'purchaseAmount_3', value: response.model});
                                me.o_setValue({name: 'productAmount_3', value: response.model});
                                checkTypeForPrice.call(me, e);
                            }
                        }
                    });
                } else {
                    me.o_setValue({name: 'purchaseAmount_3', value: ''});
                    me.o_setValue({name: 'productAmount_3', value: ''})
                }
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
        name: 'productAmount_3',
        value: ''
    }));
    //服务费 试用 赠送 折扣 的容器
    dataItems.push(new DataItem({
        name: 'typewrapper_3',
        visible: false
    }));
    //服务费金额文本框
    dataItems.push(new DataItem({
        name: 'purchaseAmount_wrapper_3',
        visible: false
    }));
    //服务费 1试用 2赠送 3折扣 的容器
    dataItems.push(new DataItem({
        name: 'type_3',
        value: '3',
        events: [
            {
                key: 'change', value: checkTypeForPrice
            }
        ]
    }));


    //服务费 文本
    dataItems.push(new DataItem({
        name: 'purchaseAmount_3',
        value: ''
    }));
    //服务费 输入
    dataItems.push(new DataItem({
        name: 'purchaseAmount_input_3',
        value: '',
        visible: false,
        events: [{
            key: 'change',
            value: function (e) {
                var me = this;
                var $dom = $(e.target);
                $dom.val($dom.val().replace(/[^\.\d]/g, ''));
            }
        }],
        validateOptions: {
            required: {
                allowHidden: false, enable: true, value: true, message: '请填写服务费金额', handler: function (error, value, option, $ele) {
                }
            }
        }
    }));

    //名片部分
    dataItems.push(new DataItem({
        name: 'businesscard'
    }));

    function checkTypeForPrice(e) {
        var me = this;
        var typeValue = me.o_getFieldValue('type_3');
        switch (typeValue.toString()) {
            case '1':
            case '2':
            {
                me.o_setValue({name: 'purchaseAmount_input_3', value: 0})
            }
                ;
                break;
            case '3':
            {
                me.o_setValue({name: 'purchaseAmount_input_3', value: me.o_getFieldValue('purchaseAmount_3')})
            }
                ;
                break;
        }
    }
});
