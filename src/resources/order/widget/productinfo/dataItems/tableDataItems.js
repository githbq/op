define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var dataItems = module.exports = [];
    dataItems.push(new DataItem({
        name: 'checkAll',
        value: null,
        events: [
            {
                key: 'change',
                value: function (e) {
                    debugger
                    this.o_setValue({name: 'check', value: $(e.target).is(':checked')});
                }
            }, {
                key: "blur",
                value: function (e) {
                }
            }
        ]
    }));
    //表单部分订单总金额
    dataItems.push(new DataItem({
        name: 'order_amount',
        value: 0
    }));
    //复选框
    dataItems.push(new DataItem({
        name: 'check',
        value: '44',
        events: [
            {
                key: 'change',
                value: function (e) {
                    debugger
                    var me = this;
                    var $dom = $(e.target);
                    var data = this.o_field_getData($dom);
                    if (data.__inited) {
                        var $ele = me.o_data_getField(data);
                        var order_amount = 0;
                        $ele.each(function (i, n) {
                            var $n = $(n);
                            if ($n.is(':checked')) {//勾选的项进入计算
                                var id = $n.val();
                                order_amount += parseInt(me.o_getFieldValue('purchaseAmount_' + id) || 0);
                            }
                        });
                        debugger
                        me.o_setValue({name:'order_amount',value: order_amount});
                        debugger
                        alert(me.o_getFieldValue('order_amount'));
                    }
                }
            }
        ]
    }));

    var zhushous = [
        {id: 11, name: 'PK助手'},
        {id: 22, name: '会议助手'},
        {id: 33, name: 'HR助手'},
        {id: 44, name: '工资助手', options: {discount: {value: 'options->工资助手折扣'}}}
    ];
    $(zhushous).each(function (i, n) {
        n.options = n.options || {};

        //PK助手开始时间
        dataItems.push(new DataItem($.extend({
            name: 'startDate_' + n.id,
            value: n.name + '日期开始',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }, n.options.startDate)));
        //PK助手结束时间
        dataItems.push(new DataItem($.extend({
            name: 'endDate_' + n.id,
            value: n.name + '日期结束',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }, n.options.endDate)));

        //pk助手原价
        dataItems.push(new DataItem($.extend({
            name: 'productAmount_' + n.id,
            value: n.name + '合同金额',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }, n.options.productAmount)));

        //pk助手合同金额
        dataItems.push(new DataItem($.extend({
            name: 'purchaseAmount_' + n.id,
            value: n.name + '合同金额'
        }, n.options.purchaseAmount)));

        //pk助手折扣
        dataItems.push(new DataItem($.extend({
            name: 'discount_' + n.id,
            value: n.name + '折扣'
        }, n.options.discount)));


    });


});
