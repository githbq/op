define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    module.exports.getItems = function () {
        var dataItems = [];
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
            value: ''
        }));
        //终端结束日期
        dataItems.push(new DataItem({
            name: 'endTime_2',
            value: ''
        }));


        //企业ID
        dataItems.push(new DataItem({
            name: 'enterpriseId',
            value: 1
        }));

        //使用销客终端复选框
        dataItems.push(new DataItem({
            name: 'useFX',
            value: true,
            readonly: true,
            events: [
                {
                    key: 'change', value: function (e) {
                    priceComput.call(this,e);
                }
                }]
        }));
        //使用销客终端复选框
        dataItems.push(new DataItem({
            name: 'useCRM',
            events: [
                {
                    key: 'change', value: function (e) {
                    priceComput.call(this,e);
                }
                }]
        }));
        var typeIds = ['1', '3', '8'];

        $(typeIds).each(function (i, n) {
            //服务人数
            dataItems.push(new DataItem({
                name: 'purchaseCount_' + n,
                value: '',
                __silent: true,
                events: [{
                    key: 'change', value: function (e) {

                        var me = this;
                        var $dom = $(e.target);
                        if (n != '3') {
                            if (n == '1') {//CRM的数量变化还要计算一下原价
                                changeForGetPrice.call(me, e);
                            } else {
                                checkTypeForPrice.call(me, e, n);
                                priceComput.call(me, e);
                            }
                        } else {

                            $dom.val($dom.val().replace(/[^\.\d]/g, ''));
                            me.o_field_getData($dom).__silent = false;
                            if ($dom.val()) {
                                me.attrs.apiPool.api_getServicePrice({
                                    data: {enterpriseId: me.o_getFieldValue('enterpriseId'), personCount: $dom.val()}, success: function (response) {
                                        //{"login":true,"model":2000,"privilege":true,"success":true,"value":{"model":2000}}
                                        if (response.success) {

                                            me.o_setValue({name: 'purchaseAmount_' + n, value: response.model});
                                            me.o_setValue({name: 'purchaseAmount_input_' + n, value: response.model});
                                            me.o_setValue({name: 'productAmount_' + n, value: response.model});
                                            checkTypeForPrice.call(me, e, n);
                                            priceComput.call(me, e);
                                        } else {
                                            me.o_setValue({name: 'purchaseAmount_input_' + n, value: ''});
                                            me.o_setValue({name: 'purchaseAmount_' + n, value: ''});
                                            me.o_setValue({name: 'productAmount_' + n, value: ''})
                                        }
                                    }
                                });
                            } else {
                                me.o_setValue({name: 'purchaseAmount_input_' + n, value: ''});
                                me.o_setValue({name: 'purchaseAmount_' + n, value: ''});
                                me.o_setValue({name: 'productAmount_' + n, value: ''})
                            }
                        }
                    }
                }],
                validateOptions: {
                    required: {
                        enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                        }
                    }
                }
            }));


            //金额
            dataItems.push(new DataItem({
                name: 'purchaseAmount_input_' + n,
                value: '',
                __silent: true,
                events: [{
                    key: 'change', value: function (e) {
                        var me = this;
                        var $dom = $(e.target);
                        me.o_setValue({name: 'purchaseAmount_' + n, value: $dom.val()});
                        changeForGetPrice.call(me, e,true);
                    }
                }],
                validateOptions: {
                    required: {
                        enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                        }
                    }
                }
            }));


            dataItems.push(new DataItem({
                name: 'startTime_' + n,
                value: '',
                events: [{
                    key: 'blur', value: function (e) {
                        var me = this;
                        setTimeout(function () {
                            changeForGetPrice.call(me, e);
                        }, 200);
                    }
                }]
            }));
            dataItems.push(new DataItem({
                name: 'endTime_' + n,
                value: '',
                events: [{
                    key: 'blur', value: function (e) {
                        var me = this;
                        setTimeout(function () {
                            changeForGetPrice.call(me, e);
                        },200)
                    }
                }]
            }));
            //产品原价
            dataItems.push(new DataItem({
                name: 'productAmount_' + n,
                value: ''
            }));
            //产品原价
            dataItems.push(new DataItem({
                name: 'purchaseAmount_' + n,
                value: ''
            }));
            //服务费 试用 赠送 折扣 的容器
            dataItems.push(new DataItem({
                name: 'typewrapper_' + n,
                visible: false
            }));
            //服务费金额文本框
            dataItems.push(new DataItem({
                name: 'purchaseAmount_wrapper_' + n,
                visible: false
            }));
            //服务费 1试用 2赠送 3折扣 的容器
            dataItems.push(new DataItem({
                name: 'type_' + n,
                value: n == '8' ? '4' : '3',
                events: [
                    {
                        key: 'change', value: function (e) {
                        var me = this;
                        var typeValue = me.o_getFieldValue('type_' + n);
                        var data = me.o_getFieldData('type_' + n);
                        switch (typeValue.toString()) {
                            case '1':
                            case '2':
                            {
                                me.o_setValue({name: 'purchaseAmount_' + n, value: 0});
                                me.o_setValue({name: 'purchaseAmount_input_' + n, value: 0, readonly: true})
                            }
                                ;
                                break;
                            case '3':
                            {

                                if (data.__editChange === false) {
                                    data.__editChange = true;
                                    me.o_setValue({name: 'purchaseAmount_' + n});
                                    me.o_setValue({name: 'purchaseAmount_input_' + n, readonly: false});
                                } else {
                                    me.o_setValue({name: 'purchaseAmount_' + n, value: me.o_getFieldValue('purchaseAmount_' + n)});
                                    me.o_setValue({name: 'purchaseAmount_input_' + n, value: me.o_getFieldValue('purchaseAmount_' + n), readonly: false})
                                }
                                me.o_data_getField({name: 'startTime_' + n}).blur();
                            }
                                ;
                                break;
                            case '4':
                            {
                                if (data.__editChange === false) {
                                    data.__editChange = true;
                                    me.o_setValue({name: 'purchaseAmount_' + n});
                                    me.o_setValue({name: 'purchaseAmount_input_' + n, readonly: false});
                                } else {
                                    me.o_setValue({name: 'purchaseAmount_' + n, value: me.o_getFieldValue('purchaseAmount_' + n)});
                                    me.o_setValue({name: 'purchaseAmount_input_' + n, value: me.o_getFieldValue('purchaseAmount_' + n), readonly: false})
                                }
                                me.o_data_getField({name: 'startTime_' + n}).blur();
                            }
                                ;
                                break;
                        }
                    }
                    }
                ]
            }));
        });


        dataItems.push(new DataItem({
            name: 'startTime_2',
            readonly: true
        }));
        dataItems.push(new DataItem({
            name: 'endTime_2',
            readonly: true
        }));
        //捆绑只读
        dataItems.push(new DataItem({
            name: 'kunbang',
            value: true,
            readonly: true
        }));
        function checkTypeForPrice(e, id) {

            var me = this;
            var typeValue = me.o_getFieldValue('type_' + id);
            switch (typeValue.toString()) {
                case '1':
                case '2':
                {
                    me.o_setValue({name: 'purchaseAmount_' + id, value: 0})
                    me.o_setValue({name: 'purchaseAmount_input_' + id, value: 0, readonly: true})
                }
                    ;
                    break;
                case '4':
                case '3':
                {
                    me.o_setValue({name: 'purchaseAmount' + id, value: me.o_getFieldValue('purchaseAmount_input_' + id)})
                    me.o_setValue({name: 'purchaseAmount_input_' + id, value: me.o_getFieldValue('purchaseAmount_input_' + id), readonly: false})
                }
                    ;
                    break;
            }
        }

        var numberIds = ['2', '3', '8'];


        //名片部分
        dataItems.push(new DataItem({
            name: 'useCRMWrapper',
            visible: false
        }));
        //名片部分
        dataItems.push(new DataItem({
            name: 'businesscard',
            visible: true
        }));


        //价格计算
        function priceComput(e) {
            this.__refs.tableInfo.$('[data-name=check]:first').change();
        }

        function changeForGetPrice(e,change) {
            var me = this;
            var $dom = $(e.target);
            var id = $dom.parents('[data-productid]').attr('data-productid');

            if ($dom.is('[datecontrol]')) {
                $dom.change();
            }
            var sum = 1;
            if (id == '1') {//针对CRM数量可改
                sum = me.o_getFieldValue('purchaseCount_' + id);
                if (!sum) {
                    return;
                }
            }

            var options = {
                data: {
                    id: id,
                    startDate: me.o_getFieldValue('startTime_' + id),
                    endDate: me.o_getFieldValue('endTime_' + id),
                    sum: sum,
                    contractAmount: me.o_getFieldValue('purchaseAmount_' + id) || 0
                },
                success: function (responseData) {
                    if (responseData.success) {
                        //{"amount":200,"rebate":1.7000000000000002}
                        me.o_setValue({name: 'discount_' + id, value: responseData.model.rebate});

                        me.o_setValue({name: 'productAmount_' + id, value: responseData.model.amount});
                        //me.o_setValue({name: 'purchaseAmount_' + id, value: responseData.model.amount});
                        //me.o_setValue({name: 'purchaseAmount_input_' + id, value: responseData.model.amount});
                        checkTypeForPrice.call(me, e, id);
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
                    me.attrs.apiPool.api_getCalculateSingle(options);
                }
            }
        }

        return dataItems;
    }

});
