define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var dataItems = module.exports = [];
    var productIdDic = {
        '1': 'CRM',
        '2': '销客终端',
        '3': '服务',
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
        //类型
        dataItems.push(new DataItem({
            name: 'table_type_' + n.id,
            value: '3',
            events: [
                {
                    key: 'change',
                    value: function (e) {
                        var me = this;
                        var $dom = $(e.target);
                        debugger
                        switch (me.o_getFieldValue($dom.attr('data-name'))) {
                            case '1':
                            {
                                //试用
                                me.o_setValue({name: 'purchaseAmount_' + n.id, value: '0', readonly: true});
                            }
                                ;
                                break;
                            case '2':
                            {
                                //赠送
                                me.o_setValue({name: 'purchaseAmount_' + n.id, value: '0', readonly: true});
                            }
                                ;
                                break;
                            case '3':
                            {
                                debugger
                                //折扣
                                me.o_setValue({name: 'purchaseAmount_' + n.id, value: '0', readonly: false});
                            }
                                ;
                                break;
                        }
                        me.o_data_getField({name: 'purchaseAmount_' + n.id}).change();
                    }
                }
            ]
        }));


        var startTime = '';
        var endTime = '';
        if (n.id == 7 ) {
            startTime = new Date().getTime();
            endTime = new Date().setFullYear(new Date().getFullYear() + 1);
        }

        //PK助手开始时间
        dataItems.push(new DataItem($.extend({
            name: 'startTime_' + n.id,
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
            name: 'endTime_' + n.id,
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

        var ids = this.o_getFieldValue('check').split(',');

        var order_amount = 0;
        var smallStartDate = 0;
        var maxEndDate = 0;
        var startDate = null;
        var endDate = null;
        var productAmount = 0;//产品原价


        if (me.__refs.terminalInfo.o_getFieldData('businesscard').visible) {
            ids.push('8');
        }
        if (me.__refs.terminalInfo.o_getFieldData('useCRMWrapper').visible && me.__refs.terminalInfo.o_getFieldValue('useCRM')) {
            ids.push('1');
        }

        if (me.__refs.terminalInfo.o_getFieldValue('useFX')) {
            //ids.push('2');
            ids.push('3');
        }


        $(ids).each(function (i, n) {
            var id = n;
            var timeModule = me.o_getFieldData('startTime_' + id) ? me : me.__refs.terminalInfo;
            startDate = timeModule.o_getFieldValue('startTime_' + id);
            endDate = timeModule.o_getFieldValue('endTime_' + id);

            if (!smallStartDate && startDate) {
                smallStartDate = startDate;
            }
            else if (smallStartDate > startDate && startDate) {
                smallStartDate = startDate;
            }
            if (!maxEndDate && endDate) {
                maxEndDate = endDate;
            }
            else if (maxEndDate < endDate && endDate) {
                maxEndDate = endDate;
            }
            var purchaseModule = me.o_getFieldData('purchaseAmount_' + id) ? me : me.__refs.terminalInfo;
            purchaseModule.__refs.terminalInfo.o_setValue({name: 'purchaseAmount_' + id, allow: true});
            purchaseModule.o_setValue({name: 'purchaseAmount_' + id, allow: true});


            order_amount += parseFloat(purchaseModule.o_getFieldValue('purchaseAmount_' + id) || 0);
            productAmount += parseFloat(purchaseModule.o_getFieldValue('productAmount_' + id) || 0);

        });
        me.__refs.terminalInfo.o_setValue({name: 'startTime_2', value: smallStartDate ? smallStartDate : null});
        me.__refs.terminalInfo.o_setValue({name: 'endTime_2', value: maxEndDate ? maxEndDate : null});
        console.log('合同总金额之表格部分计算结果1:' + me.o_getFieldValue('order_amount'));


        me.__refs.formInfo.o_setValue({name: 'contractPrice', value: order_amount});
        me.__refs.formInfo.o_setValue({name: 'productAmount', value: productAmount});
        console.log('合同总金额之表格部分计算结果2:' + me.o_getFieldValue('order_amount'));
        console.log('原价总金额之表格部分计算结果:' + me.o_getFieldValue('order_amount'));
        if (me.__refs.formInfo.o_getFieldData('payStatus_name').visible || me.__refs.formInfo.o_getFieldValue('payStatus_select') == '1') {
            me.__refs.formInfo.o_setValue({name: 'currPayAmount', value: order_amount});
        }
        if(me.__refs.formInfo.o_getFieldData('payStatus_select').visible){
            me.__refs.formInfo.o_data_getField({name:'payStatus_select'}).change();
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
                startDate: me.o_getFieldValue('startTime_' + id),
                endDate: me.o_getFieldValue('endTime_' + id),
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
                me.o_setValue({name: 'startTime_' + id, value: ''});
                me.o_setValue({name: 'endTime_' + id, value: ''});
            } else {
                if (me.o_getFieldData('purchaseAmount_'+id).readonly!==true) {
                    me.attrs.apiPool.api_getCalculateSingle(options);
                }
            }
        }
    }

});
