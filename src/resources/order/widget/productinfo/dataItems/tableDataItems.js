define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var dataItems = module.exports = [];
    var productIdDic = {
        '1': 'CRM',
        '2': 'FXBC',
        '3': 'Number_System',
        '4': 'PK_Helper',
        '5': 'Meeting_Helper',
        '6': 'HR_Helper',
        '7': 'Salary_Helper'

    };
    dataItems.push(new DataItem({
        name: 'checkAll',
        value: null,
        events: [
            {
                key: 'change',
                value: function (e) {
                    this.o_setValue({name: 'check', value: $(e.target).is(':checked')});
                }
            }, {
                key: "blur",
                value: function (e) {
                }
            }
        ]
    }));
    //复选框
    var check = new DataItem({
        name: 'check',
        value: '7',
        events: [
            {
                key: 'change',
                value: function (e) {
                    priceComput.call(this, e);
                }
            }
        ]
    });
    check.on('setFieldValue', function ($ele, value) {

    });
    //复选框
    dataItems.push(check);

    var zhushous = [
        {id: 4, name: 'PK助手'},
        {id: 5, name: '会议助手'},
        //{id: 6, name: 'HR助手'},
        {id: 7, name: '工资助手', options: {discount: {}}}
    ];
    var getPriceEvents = [{
        key: 'change', value: changeForGetPrice
    }];
    var getPriceEventsForDate = [{
        key: 'blur', value: changeForGetPrice
    }];

    $(zhushous).each(function (i, n) {
        n.options = n.options || {};

        var startTime = '';
        var endTime = '';
        if (n.id == 7) {

            startTime = new Date().getTime();
            endTime = new Date().setFullYear(new Date().getFullYear() + 1);
        }

        //PK助手开始时间
        dataItems.push(new DataItem($.extend({
            name: 'startDate_' + n.id,
            value: startTime,
            validateOptions: {
                required: {
                    enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                    }
                }
            }, events: getPriceEventsForDate
        }, n.options.startDate)));
        //PK助手结束时间
        dataItems.push(new DataItem($.extend({
            name: 'endDate_' + n.id,
            value: endTime,
            validateOptions: {
                required: {
                    enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                    }
                }
            }, events: getPriceEventsForDate
        }, n.options.endDate)));


        if (n.id == 7) {
            dataItems[dataItems.length - 1].on('setFieldValue', function ($ele, value) {
                setTimeout(function () {
                    $ele.blur();
                }, 100);
            })
        }


        //pk助手原价
        dataItems.push(new DataItem($.extend({
            name: 'productAmount_' + n.id,
            value: ''
        }, n.options.productAmount)));

        //pk助手合同金额
        dataItems.push(new DataItem($.extend({
            name: 'purchaseAmount_' + n.id,
            attr: {'data-price': '1'},
            value: 0,
            events: [
                {
                    key: 'change', value: function (e) {
                    priceComput.call(this, e);
                    changeForGetPrice.call(this, e);
                }
                }
            ]
        }, n.options.purchaseAmount)));

        //pk助手折扣
        dataItems.push(new DataItem($.extend({
            name: 'discount_' + n.id,
            value: ''
        }, n.options.discount)));


    });

    //价格计算
    function priceComput(e) {
        var me = this;
        var $dom = $(e.target);
        var data = null;
        if ($dom.is('input[type=text]:not([datecontrol])')) {
            $dom.val($dom.val().replace(/[^\.\d]/g, ''));

        }
        data = this.o_field_getData($dom.parents('tr').find('input[type=checkbox]'));
        var $ele = me.o_data_getField(data);
        var order_amount = 0;
        var smallStartDate = 0;
        var maxEndDate = 0;
        var startDate = null;
        var endDate = null;
        var productAmount = 0;//产品原价
        $ele.each(function (i, n) {
            var $n = $(n);
            var id = $n.val();
            if ($n.is(':checked')) {//勾选的项进入计算
                startDate = me.o_getFieldValue('startDate_' + id);
                endDate = me.o_getFieldValue('endDate_' + id);

                if (!smallStartDate && startDate) {
                    smallStartDate = startDate;
                }
                if (smallStartDate > startDate) {
                    smallStartDate = startDate;
                }


                if (!maxEndDate && endDate) {
                    maxEndDate = endDate;
                }

                if (maxEndDate < endDate) {
                    maxEndDate = endDate;
                }
                me.o_setValue({name: 'purchaseAmount_' + id, allow: true});
                order_amount += parseFloat(me.o_getFieldValue('purchaseAmount_' + id) || 0);
                productAmount += parseFloat(me.o_getFieldValue('productAmount_' + id) || 0);
            } else {
                me.o_setValue({name: 'purchaseAmount_' + id, allow: false});
            }
        });
        me.__refs.terminalInfo.o_setValue({name: 'startTime_2', value: smallStartDate ? smallStartDate : null});
        me.__refs.terminalInfo.o_setValue({name: 'endTime_2', value: maxEndDate ? maxEndDate : null});
        console.log('合同总金额之表格部分计算结果1:' + me.o_getFieldValue('order_amount'));

        var purchaseAmount_3 = me.__refs.terminalInfo.o_getFieldValue('purchaseAmount_3');
        if (purchaseAmount_3) {//服务费
            order_amount += parseFloat(purchaseAmount_3);
        }
        var productAmount_3 = me.__refs.terminalInfo.o_getFieldValue('productAmount_3');
        if (productAmount_3) {//服务费
            productAmount += parseFloat(productAmount_3);
        }
        me.__refs.formInfo.o_setValue({name: 'contractPrice', value: order_amount});
        me.__refs.formInfo.o_setValue({name: 'productAmount', value: productAmount});
        console.log('合同总金额之表格部分计算结果2:' + me.o_getFieldValue('order_amount'));
        console.log('原价总金额之表格部分计算结果:' + me.o_getFieldValue('order_amount'));
        if (me.__refs.formInfo.o_getFieldData('payStatus_name').visible || me.__refs.formInfo.o_getFieldValue('payStatus_select')=='1') {
            me.__refs.formInfo.o_setValue({name: 'currPayAmount', value: order_amount});
        }
    }

    function changeForGetPrice(e) {
        var me = this;
        var $dom = $(e.target);
        var $tr = $dom.parents('tr');
        var id = $tr.find('input[type=checkbox]').val();

        if ($dom.is('[datecontrol]')) {
            $dom.change();
        }
        var options = {
            data: {
                id: id,
                startDate: me.o_getFieldValue('startDate_' + id),
                endDate: me.o_getFieldValue('endDate_' + id),
                sum: 1,
                contractAmount: me.o_getFieldValue('purchaseAmount_' + id)
            },
            success: function (responseData) {
                console.warn(responseData)
                if (responseData.success) {
                    //{"amount":200,"rebate":1.7000000000000002}
                    me.o_setValue({name: 'discount_' + id, value: responseData.model.rebate});
                    me.o_setValue({name: 'productAmount_' + id, value: responseData.model.amount});
                    priceComput.call(me, e);
                }
            }
        };
        if (options.data.startDate && options.data.endDate) {
            if (options.data.startDate >= options.data.endDate) {
                util.showToast('开始日期必须小于结束日期');
                me.o_setValue({name: 'startDate_' + id, value: ''});
                me.o_setValue({name: 'endDate_' + id, value: ''});
            } else {
                me.attrs.apiPool.api_getCalculateSingle(options);
            }
        }
    }

});
