define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var helper = require('./index');
    module.exports.getItems = function () {
        var dataItems = [];
        var productIdDic = {
            '1': 'CRM',
            '2': '销客终端',
            '3': '服务',
            '4': 'PK_Helper',
            '5': 'Meeting_Helper',
            '6': 'HR_Helper',
            '7': 'Salary_Helper',
            '8': '名片',
            '10': '百川',
            '11': '报数',
            '12': '自定义助手',
            '13': '培训助手',
            '14': '战报助手',
            '15': '考试助手',
            '16': '培训助手购买流量',
            '17': '项目管理'
        };
        //订单类型
        dataItems.push(new DataItem({
            name: 'orderType',
            value: ''
        }));
        dataItems.push(new DataItem({
            name: 'checkAll',
            value: null,
            events: [
                {
                    key: 'change',
                    value: function (e) {
                        var checked = $(e.target).is(':checked');
                        var me = this;
                        var $checks = $('[data-name=check]:visible');
                        $checks.each(function (i, n) {
                            var $check = $(n);
                            if (!$check.is('[readonly],[disabled]')) {
                                $check.prop('checked', checked).attr('checked', checked);
                            }
                            $(n).change();
                        });

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
                        var me = this;
                        var $dom = $(e.target);
                        var checked = $dom.is(':checked');
                        var readonly = !checked;
                        var id = $dom.val();
                        if (!$dom.is('[readonly],[disabled]')) {
                            if (!me.o_getFieldData('startTime_' + id).__force) {
                                me.o_setValue({name: 'startTime_' + id, readonly: readonly});
                            }
                            if (!me.o_getFieldData('endTime_' + id).__force) {
                                me.o_setValue({name: 'endTime_' + id, readonly: readonly});
                            }
                            me.o_setValue({name: 'type_' + id, readonly: readonly});
                            me.o_setValue({name: 'purchaseAmount_' + id, readonly: readonly});
                            if (!checked) {
                                me.__refs.formInfo.o_setValue({name: 'currPayAmount_' + id, value: 0});
                                me.o_setValue({name: 'purchaseAmount_' + id, value: 0});
                                me.o_setValue({name: 'discount_' + id, value: ''});
                            }
                        }
                        priceComput.call(this, e);
                    }
                }
            ]
        });

        //check.on('setFieldValue', function ($ele, value) {
        //
        //});
        //复选框
        dataItems.push(check);


        var zhushous = [
            {id: 4, name: 'PK助手'},
            {id: 5, name: '会议助手'},
            {id: 12, name: '自定义助手'},
            {id: 15, name: '考试助手'},
            {id: 14, name: '战报助手'},
            //{id: 13, name: '培训助手'},
            //{id: 16, name: '培训助手时长'},
            //{id: 6, name: 'HR助手'},
            {id: 7, name: '工资助手', options: {discount: {}}},
            {id: 17, name: '项目管理'}
        ];
        var getPriceEvents = [{
            key: 'change', value: changeForGetPrice
        }];
        var getPriceEventsForDate = [{
            key: 'blur', value: function (e) {
                var me = this;
                setTimeout(function () {
                    changeForGetPrice.call(me, e);
                }, 200);
            }
        }];

        $(zhushous).each(function (i, n) {
            (function (n) {
                n.options = n.options || {};
                //类型
                dataItems.push(new DataItem({
                    name: 'type_' + n.id,
                    readonly: true,
                    value: (n.id == '7' ? '2' : '3'),
                    events: [
                        {
                            key: 'change',
                            value: function (e) {
                                var me = this;
                                var isreadony = me.__refs.terminalInfo.o_getFieldData('allreadonly').allreadonly === true;
                                var $dom = $(e.target);
                                var condition = $dom.parents('tr').find('input[data-name=check]').is(':checked');
                                switch (me.o_getFieldValue($dom.attr('data-name'))) {
                                    case '1':
                                    //试用
                                    case '2':
                                    {
                                        //赠送
                                        me.o_setValue({name: 'purchaseAmount_' + n.id, value: '0', readonly: true});
                                        //清空折扣
                                        me.o_setValue({name: 'discount_' + n.id, value: '', readonly: true});
                                        //折扣类型 联动分期  2016-5-10 by hbq
                                        var payStatueData = me.__refs.formInfo.o_getFieldData('payStatus_select');
                                        if (payStatueData.visible === true && me.__refs.formInfo.o_getFieldValue('payStatus_select') == '2') {
                                            me.__refs.formInfo.o_setValue({name: 'currPayAmount_' + n.id, value: '0'});
                                            me.__refs.formInfo.o_data_getField('currPayAmount_' + n.id).change();
                                        }
                                    }
                                        ;
                                        break;
                                    case '3':
                                    {
                                        //折扣
                                        me.o_setValue({name: 'purchaseAmount_' + n.id, value: me.o_getFieldValue('productAmount_' + n.id) || '0', readonly: condition ? isreadony : true});
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
                if (n.id == 7) {
                    startTime = new Date().getTime();
                    endTime = new Date().setFullYear(new Date().getFullYear() + 1);
                }

                //PK助手开始时间
                dataItems.push(new DataItem($.extend({
                    name: 'startTime_' + n.id,
                    value: startTime,
                    readonly: true,
                    validateOptions: helper.getValidateLogic(),
                    events: getPriceEventsForDate
                }, n.options.startDate)));
                //PK助手结束时间
                dataItems.push(new DataItem($.extend({
                    name: 'endTime_' + n.id,
                    value: endTime,
                    readonly: true,
                    validateOptions: helper.getValidateLogic(),
                    events: getPriceEventsForDate
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
                    value: '',
                    attr: {maxlength: 9}
                }, n.options.productAmount)));

                //pk助手合同金额
                dataItems.push(new DataItem($.extend({
                    name: 'purchaseAmount_' + n.id,
                    attr: {'data-price': '1', maxlength: 9},
                    value: 0,
                    validateOptions: helper.getValidateLogic(),
                    events: [
                        {
                            key: 'change', value: function (e) {
                            priceComput.call(this, e);
                            changeForGetPrice.call(this, e, false);
                        }
                        }
                    ]
                }, n.options.purchaseAmount)));

                //pk助手折扣
                dataItems.push(new DataItem($.extend({
                    name: 'discount_' + n.id,
                    value: ''
                }, n.options.discount)));

            })(n);
        });


        //价格计算
        function priceComput(e) {
            var me = this;
            var ids = this.o_getFieldValue('check').split(',');

            var order_amount = 0;//合同总金额
            var curPayAmount = 0;//本次到款总金额
            var smallStartDate = 0;
            var maxEndDate = 0;
            var startDate = null;
            var endDate = null;
            var productAmount = 0;//产品原价
            var payStatus = me.__refs.formInfo.o_getFieldValue('payStatus_select');

            if (me.__refs.terminalInfo.o_getFieldData('useCRMWrapper').visible !== false && me.__refs.terminalInfo.o_getFieldValue('useCRM')) {
                ids.push('1');
            }
            if (me.__refs.terminalInfo.o_getFieldData('productTrainingWrapper').visible !== false && me.__refs.terminalInfo.o_getFieldValue('useTrainning')) {
                ids.push('13');
            }
            if (me.__refs.terminalInfo.o_getFieldData('productTimeLongWrapper').visible !== false && me.__refs.terminalInfo.o_getFieldValue('useTrainning')) {
                ids.push('16');
            }

            if (me.__refs.terminalInfo.o_getFieldValue('useFX')) {
                ids.push('3');
            }

            $(ids).each(function (i, n) {
                var id = n;
                checkTypeForPrice.call(me, e, id);
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

                if (id == 3 && me.__refs.formInfo.o_getFieldValue('orderAssigned') == 1) {//只有直销 服务费才加入到款总金额计算
                    curPayAmount += parseFloat(purchaseModule.o_getFieldValue('purchaseAmount_' + id) || 0);
                } else if (id != 3) {
                    curPayAmount += parseFloat(purchaseModule.o_getFieldValue('purchaseAmount_' + id) || 0);
                }

                //if (id == 3 && me.__refs.formInfo.o_getFieldValue('orderAssigned') != 1) {//如果不是直销   服务是不计入合同总金额
                //} else {
                order_amount += parseFloat(purchaseModule.o_getFieldValue('purchaseAmount_' + id) || 0);
                //}


                productAmount += parseFloat(purchaseModule.o_getFieldValue('productAmount_' + id) || 0);
                if (payStatus == 2) {
                    var currPayAmountData = me.__refs.formInfo.o_getFieldData('currPayAmount_' + id);
                    var curPayAmountItem = currPayAmountData && currPayAmountData.value || '0';
                    var purchaseAmountItem = purchaseModule.o_getFieldValue('purchaseAmount_' + id);
                    var curPayAmountItemResult = curPayAmountItem;
                    if (purchaseAmountItem && curPayAmountItem && parseFloat(purchaseAmountItem) < parseFloat(curPayAmountItem)) {
                        curPayAmountItemResult = purchaseAmountItem;
                    }
                    me.__refs.formInfo.o_setValue({name: 'currPayAmount_' + id, value: curPayAmountItemResult});
                }
            });
            //me.__refs.terminalInfo.o_setValue({name: 'startTime_2', value: smallStartDate ? smallStartDate : null});

            //me.__refs.terminalInfo.o_setValue({name: 'endTime_2', value: maxEndDate ? maxEndDate : null});
            //console.log('合同总金额之表格部分计算结果1:' + me.o_getFieldValue('order_amount'));

            me.__refs.formInfo.o_setValue({name: 'contractPrice', value: order_amount});
            me.__refs.formInfo.o_setValue({name: 'productAmount', value: productAmount});
            //console.log('合同总金额之表格部分计算结果2:' + me.o_getFieldValue('order_amount'));
            //console.log('原价总金额之表格部分计算结果:' + me.o_getFieldValue('order_amount'));
            if (me.__refs.formInfo.o_getFieldData('payStatus_name').visible !== false || me.__refs.formInfo.o_getFieldValue('payStatus_select') == '1') {
                me.__refs.formInfo.o_setValue({name: 'currPayAmount', value: curPayAmount});
            }
            if (me.__refs.formInfo.o_getFieldData('payStatus_select').visible !== false) {
                setTimeout(function () {
                    me.__refs.formInfo.o_data_getField({name: 'payStatus_select'}).change();
                }, 20);
            }

        }

        exports.priceComput = priceComput;
        function changeForGetPrice(e, change) {
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
                    contractAmount: me.o_getFieldValue('purchaseAmount_' + id),
                    orderType: me.o_getFieldValue('orderType'),
                    hasPurchaseCount: me.__refs.terminalInfo.o_getFieldValue('old_CRMCount') || '0'
                },
                success: function (responseData) {
                    console.warn(responseData);
                    if (responseData.success) {
                        //{"amount":200,"rebate":1.7000000000000002}
                        me.o_setValue({name: 'discount_' + id, value: responseData.model.rebate === null ? '' : responseData.model.rebate});
                        me.o_setValue({name: 'productAmount_' + id, value: responseData.model.amount});
                        checkTypeForPrice.call(me, e, id);
                        priceComput.call(me, e);
                        if (me.o_getFieldValue('type_' + id) == '3') {
                            me.o_setValue({name: 'purchaseAmount_' + id});
                        }
                    }
                }
            };
            if (options.data.startDate && options.data.endDate) {
                if (options.data.startDate > options.data.endDate) {
                    util.showToast('开始日期必须小于等于结束日期');
                    if (!me.o_getFieldData('startTime_' + id).__force) {
                        me.o_setValue({name: 'startTime_' + id, value: ''});
                    }
                    if (!me.o_getFieldData('endTime_' + id).__force) {
                        me.o_setValue({name: 'endTime_' + id, value: ''});
                    }
                    me.o_setValue({name: 'discount_' + id, value: ''});
                    me.o_setValue({name: 'productAmount_' + id, value: ''});
                } else {
                    if (me.o_getFieldValue('purchaseAmount_' + id) && me.o_getFieldData('endTime_' + id).readonly != true) {
                        options.data.startDate += 1;
                        options.data.endDate += 2;
                        if (me.__refs.terminalInfo.o_getFieldValue('allreadonly') !== true) {
                            me.attrs.apiPool.api_getCalculateSingle(options);
                        }

                    }
                }
            }
        }

        function checkTypeForPrice(e, id) {
            var me = this;
            var typeValue = me.o_getFieldValue('type_' + id);
            switch (typeValue.toString()) {
                case '1':
                case '2':
                {
                    me.o_setValue({name: 'purchaseAmount_' + id, value: 0, readonly: true});
                    me.o_setValue({name: 'purchaseAmount_input_' + id, value: 0, readonly: true});
                    me.o_setValue({name: 'discount_' + id, value: ''});
                    //折扣类型 联动分期  2016-5-10 by hbq
                    var payStatueData = me.__refs.formInfo.o_getFieldData('payStatus_select');
                    if (payStatueData.visible === true && me.__refs.formInfo.o_getFieldValue('payStatus_select') == '2') {
                        me.__refs.formInfo.o_setValue({name: 'currPayAmount_' + id, value: '0'});
                        me.__refs.formInfo.o_data_getField('currPayAmount_' + id).change();
                    }
                }
                    ;
                    break;
                case '4':
                case '3':
                {
                    me.o_setValue({name: 'purchaseAmount' + id, value: me.o_getFieldValue('productAmount_' + id)});
                    me.o_setValue({name: 'purchaseAmount_input_' + id, value: me.o_getFieldValue('productAmount_' + id)});
                }
                    ;
                    break;
            }

        }

        return dataItems;
    }
});
