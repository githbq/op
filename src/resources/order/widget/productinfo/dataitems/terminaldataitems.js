define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var helper = require('./index');
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
        //订单类型
        dataItems.push(new DataItem({
            name: 'orderType',
            value: ''
        }));

        //企业ID
        dataItems.push(new DataItem({
            name: 'enterpriseId',
            value: null
        }));

        //使用逍客终端复选框
        dataItems.push(new DataItem({
            name: 'useFX',
            value: true,
            readonly: true,
            events: [
                {
                    key: 'change', value: function (e) {
                    var me = this;
                    var $dom = $(e.target);
                    var checked = $dom.is(':checked');
                    var isReadonly = me.o_getFieldData('allreadonly').allreadonly === true;
                    priceComput.call(me, e);
                    for (var i in me.dataDic) {
                        if (me.dataDic.hasOwnProperty(i)) {
                            if ((i.toString().indexOf('_3') > 0) && i.toString().toLowerCase().indexOf('wrapper') < 0) {
                                if (checked && me.dataDic[i].old_readonly === undefined) {
                                    me.dataDic[i].old_readonly = !!me.dataDic[i].readonly;
                                }
                                me.dataDic[i].readonly = !checked ? true : ( me.dataDic[i].old_readonly === true ? isReadonly : false);
                                me.o_setValue(me.dataDic[i]);
                                if (i.toString().indexOf('type_') == 0) {
                                    var $type = me.o_data_getField(me.dataDic[i]);
                                    $type && $type.length > 0 && ($type.change());
                                }
                                /* CRM与服务费不再关联
                                 //if (i == 'purchaseAmount_input_3' && !me.dataDic[i].readonly) {//服务费合同金额
                                 //    if (me.o_getFieldValue('useCRM')) {
                                 //        me.dataDic[i].readonly = true;
                                 //        me.o_setValue(me.dataDic[i]);
                                 //    }
                                 //}
                                 */
                            }
                        }
                    }
                }
                }]
        }));
        dataItems[dataItems.length - 1].on('setFieldValue', function ($ele, value, data) {
            setTimeout(function () {
                $ele.change();
            }, 10);

        });
        //使用逍客终端复选框
        dataItems.push(new DataItem({
                name: 'useCRM',
                events: [
                    {
                        key: 'change', value: function (e) {
                        var me = this;
                        var $dom = $(e.target);
                        var checked = $dom.is(':checked');
                        var isReadonly = me.o_getFieldData('allreadonly').allreadonly === true;
                        /* CRM与服务费不再关联
                         //if ($dom.is(':checked')) {//选中的话 终端为0
                         //    me.o_setValue({name: 'purchaseAmount_input_3', value: '0', readonly: true});
                         //    me.o_setValue({name: 'purchaseAmount_3', value: '0'});
                         //    var id = $dom.val();
                         //    priceComput.call(this, e);
                         //
                         //} else {
                         //    me.o_setValue({name: 'purchaseAmount_input_3', readonly: me.o_getFieldValue('useFX') ? isReadonly : true});
                         //    me.o_data_getField({name: 'purchaseCount_3'}).change();//服务费
                         //}
                         */
                        for (var i in me.dataDic) {
                            if (me.dataDic.hasOwnProperty(i)) {
                                if ((i.toString().indexOf('_1') > 0 || i.toString().indexOf('_8') > 0) && i.toString().toLowerCase().indexOf('wrapper') < 0) {
                                    if (checked && me.dataDic[i].old_readonly === undefined) {
                                        me.dataDic[i].old_readonly = !!me.dataDic[i].readonly;
                                    }
                                    me.dataDic[i].readonly = !checked ? true : ( me.dataDic[i].old_readonly === true ? isReadonly : false);
                                    if (me.dataDic[i].__force) {
                                        me.dataDic[i].readonly = true;
                                    }
                                    me.o_setValue(me.dataDic[i]);
                                    if (i.toString().indexOf('type_') == 0) {
                                        var $type = me.o_data_getField(me.dataDic[i]);
                                        $type && $type.length > 0 && ($type.change());
                                    }
                                }
                            }
                        }
                    }
                    }
                ]
            }
        ))
        ;
        dataItems[dataItems.length - 1].on('setFieldValue', function ($ele, value, data) {
            setTimeout(function () {
                $ele.change();
            }, 10);

        });
        var typeIds = ['1', '3', '8'];

        $(typeIds).each(function (i, n) {
            //服务人数
            dataItems.push(new DataItem({
                name: 'purchaseCount_' + n,
                value: '',
                attr: {maxlength: 9},
                __silent: true,
                events: [{
                    key: 'change', value: function (e) {
                        debugger
                        var me = this;
                        var allreadonly = me.o_getFieldData('allreadonly').allreadonly;
                        var $dom = $(e.target);
                        if (n == '3' && !(parseFloat($dom.val()) > 5) && !(me.o_getFieldValue('isrenew') || me.o_getFieldValue('isadd'))) {
                            util.showToast('服务人数必须大于等于6');
                            $dom.val('');
                            return;
                        }
                        if ($dom.val() && parseFloat($dom.val()) <= 0) {
                            if ((n == '3' || n == '1' ) && (me.o_getFieldValue('isrenew') || me.o_getFieldValue('isadd'))) {//增购续费 服务人数可为0
                            } else {
                                util.showToast('数量必须大于0');
                                $dom.val('');
                                return;
                            }
                        }
                        if (n != '3') {
                            if (n == '1') {//CRM的数量变化还要计算一下原价
                                if ($dom.val() && parseFloat($dom.val()) > parseFloat(me.o_getFieldValue('purchaseCount_2'))) {
                                    util.showToast('CRM终端总量需小于等于逍客终端总量');
                                    $dom.val(me.o_getFieldValue('purchaseCount_2'));
                                }
                                changeForGetPrice.call(me, e);
                            } else {
                                checkTypeForPrice.call(me, e, n);
                                priceComput.call(me, e);
                            }
                        } else {
                            $dom.val($dom.val().replace(/[^\.\d]/g, ''));
                            me.o_field_getData($dom).__silent = false;
                            if ($dom.val() && !allreadonly) {
                                me.attrs.apiPool.api_getServicePrice({
                                    data: {enterpriseId: me.o_getFieldValue('enterpriseId'), personCount: $dom.val()}, success: function (response) {
                                        //{"login":true,"model":2000,"privilege":true,"success":true,"value":{"model":2000}}
                                        if (response.success) {
                                            //if (me.o_getFieldValue('useCRM')) {
                                            //    me.o_setValue({name: 'purchaseAmount_' + n, value: '0'});
                                            //    me.o_setValue({name: 'purchaseAmount_input_' + n, value: '0'});
                                            //} else {
                                            me.o_setValue({name: 'purchaseAmount_' + n, value: response.model});
                                            me.o_setValue({name: 'purchaseAmount_input_' + n, value: response.model, readonly: allreadonly});
                                            //}

                                            me.o_setValue({name: 'productAmount_' + n, value: response.model});

                                        } else {
                                            me.o_setValue({name: 'purchaseAmount_input_' + n, value: '0'});
                                            me.o_setValue({name: 'purchaseAmount_' + n, value: '0'});
                                            me.o_setValue({name: 'productAmount_' + n, value: '0'})
                                        }
                                        changeForGetPrice.call(me, e);
                                    }
                                });
                            } else if (!me.o_getFieldValue('isedit')) {
                                me.o_setValue({name: 'purchaseAmount_input_' + n, value: '0', readonly: allreadonly});
                                me.o_setValue({name: 'purchaseAmount_' + n, value: '0'});
                                me.o_setValue({name: 'productAmount_' + n, value: '0'});
                                changeForGetPrice.call(me, e);
                                me.o_setValue({name: 'purchaseAmount_input_' + n, readonly: allreadonly});
                                if (n == 3) {
                                    me.o_setValue({name: 'purchaseAmount_input_' + n, readonly: (me.o_getFieldValue('useCRM') || !me.o_getFieldValue('useFX'))});
                                }
                            }
                        }
                    }
                }]
                , validateOptions: helper.getValidateLogic()
            }));


            //金额
            dataItems.push(new DataItem({
                name: 'purchaseAmount_input_' + n,
                value: '0',
                readonly: false,
                attr: {maxlength: 9},
                validateOptions: helper.getValidateLogic(),
                __silent: true,
                events: [{
                    key: 'change', value: function (e) {
                        var me = this;
                        var $dom = $(e.target);
                        me.o_setValue({name: 'purchaseAmount_' + n, value: $dom.val()});
                        var id = $dom.parents('[data-productid]').attr('data-productid');
                        changeForGetPrice.call(me, e, false);
                    }
                }]
            }));


            dataItems.push(new DataItem({
                    name: 'startTime_' + n,
                    value: '',
                    validateOptions: helper.getValidateLogic(),
                    events: [{
                        key: 'blur', value: function (e) {
                            var me = this;
                            setTimeout(function () {
                                changeForGetPrice.call(me, e);
                            }, 200);
                        }
                    }]
                })
                //.on('setFieldValue', function ($ele, value, data, me) {
                //  //alert(value)
                //})
            );
            dataItems.push(new DataItem({
                name: 'endTime_' + n,
                value: '',
                validateOptions: helper.getValidateLogic(),
                events: [{
                    key: 'blur', value: function (e) {
                        var me = this;
                        setTimeout(function () {
                            changeForGetPrice.call(me, e);
                        }, 200)
                    }
                }]
            }));
            //产品原价
            dataItems.push(new DataItem({
                name: 'productAmount_' + n,
                value: 0,
                validateOptions: helper.getValidateLogic(),
                attr: {maxlength: 9}
            }));
            //合同金额
            dataItems.push(new DataItem({
                name: 'purchaseAmount_' + n,
                value: '0',
                validateOptions: helper.getValidateLogic(),
                attr: {maxlength: 9}
            }));
            //服务费 试用 赠送 折扣 的容器
            dataItems.push(new DataItem({
                name: 'typewrapper_' + n,
                visible: false
            }));
            //服务费金额文本框
            dataItems.push(new DataItem({
                name: 'purchaseAmount_wrapper_' + n,
                visible: false,
                attr: {maxlength: 9}
            }));
            //服务费 1试用 2赠送 3折扣 的容器
            dataItems.push(new DataItem({
                name: 'type_' + n,
                value: n == '8' ? '4' : '3',
                events: [
                    {
                        key: 'change', value: function (e) {
                        var me = this;
                        var isReadonly = me.o_getFieldData('allreadonly').allreadonly === true;
                        var condition = me.o_getFieldValue('useCRM');
                        if (n == 3) {
                            condition = me.o_getFieldValue('useFX') && !me.o_getFieldValue('useCRM');
                        }
                        var typeValue = me.o_getFieldValue('type_' + n);
                        var data = me.o_getFieldData('type_' + n);
                        switch (typeValue.toString()) {
                            case '1':
                            case '2':
                            {
                                me.o_setValue({name: 'purchaseAmount_' + n, value: 0});
                                me.o_setValue({name: 'purchaseAmount_input_' + n, value: 0, readonly: true});
                                me.o_setValue({name: 'discount_' + n, value: '0'});
                            }
                                ;
                                break;
                            case '3':
                            {
                                if (data.__editChange === false) {
                                    data.__editChange = true;
                                    me.o_setValue({name: 'purchaseAmount_' + n});
                                    me.o_setValue({name: 'purchaseAmount_input_' + n, readonly: condition ? isReadonly : true});
                                } else {
                                    me.o_setValue({name: 'purchaseAmount_' + n, value: me.o_getFieldValue('purchaseAmount_' + n)});
                                    me.o_setValue({name: 'purchaseAmount_input_' + n, value: me.o_getFieldValue('purchaseAmount_' + n), readonly: condition ? isReadonly : true})
                                }
                            }
                                ;
                                break;
                            case '4':
                            {
                                if (data.__editChange === false) {
                                    data.__editChange = true;
                                    me.o_setValue({name: 'purchaseAmount_' + n});
                                    me.o_setValue({name: 'purchaseAmount_input_' + n, readonly: condition ? isReadonly : true});
                                } else {
                                    me.o_setValue({name: 'purchaseAmount_' + n, value: me.o_getFieldValue('purchaseAmount_' + n)});
                                    me.o_setValue({name: 'purchaseAmount_input_' + n, value: me.o_getFieldValue('purchaseAmount_' + n), readonly: condition ? isReadonly : true})
                                }
                            }
                                ;
                                break;
                        }
                        changeForGetPrice.call(me, e);
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
                    me.o_setValue({name: 'purchaseAmount_' + id, value: 0});
                    me.o_setValue({name: 'purchaseAmount_input_' + id, value: 0, readonly: true});
                }
                    ;
                    break;
                case '4':
                case '3':
                {
                    var isReadonly = $(e.target).is('[readonly],[disabled]');
                    if (id == '3' && me.o_getFieldValue('useCRM')) {
                        me.o_setValue({name: 'purchaseAmount_input_' + id, readonly: true, value: me.o_getFieldValue('purchaseAmount_input_' + id)});
                    } else {
                        me.o_setValue({name: 'purchaseAmount_input_' + id, value: me.o_getFieldValue('purchaseAmount_input_' + id), readonly: isReadonly});
                    }
                    me.o_setValue({name: 'purchaseAmount' + id, value: me.o_getFieldValue('purchaseAmount_input_' + id)});
                }
                    ;
                    break;
            }

        }

        var numberIds = ['2', '3', '8'];


        //CRM部分
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

        function changeForGetPrice(e, change) {
            var me = this;
            var $dom = $(e.target);
            var id = $dom.parents('[data-productid]').attr('data-productid');

            //if ($dom.is('[datecontrol]')) {
            //    $dom.change();
            //}
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
                    contractAmount: me.o_getFieldValue('purchaseAmount_' + id) || 0,
                    orderType: me.o_getFieldValue('orderType')
                },
                success: function (responseData) {
                    if (responseData.success) {
                        //{"amount":200,"rebate":1.7000000000000002}
                        me.o_setValue({name: 'discount_' + id, value: responseData.model.rebate === null ? '' : responseData.model.rebate});

                        me.o_setValue({name: 'productAmount_' + id, value: responseData.model.amount});
                        if (id == '8') {
                            me.o_setValue({name: 'purchaseAmount_' + id, value: responseData.model.amount});
                        }
                        checkTypeForPrice.call(me, e, id);
                        priceComput.call(me, e);
                    }
                }
            };
            if (id == '3') {//服务人数不计算折扣
                checkTypeForPrice.call(me, e, id);
                priceComput.call(me, e);
            }
            else if (options.data.startDate && options.data.endDate) {
                if (options.data.startDate >= options.data.endDate) {
                    util.showToast('开始日期必须小于结束日期');
                    me.o_setValue({name: 'startTime_' + id, value: ''});
                    me.o_setValue({name: 'endTime_' + id, value: ''});
                } else {
                    //document.title=Math.random();
                    me.attrs.apiPool.api_getCalculateSingle(options);
                }
            }
        }

        return dataItems;
    }

})
;
