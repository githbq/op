define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var uploader = require('common/widget/upload').uploader;

    module.exports.getItems = function () {
        var dataItems = [];

        function sendFile(e, callback) {
            uploader.send({
                'url': '/op/api/file/uploadsinglefileandcheck',
                'files': e.target.files,
                'options': {
                    'limittype': 'IMAGE'
                },
                'success': callback
            })
        }

        //合同号
        dataItems.push(new DataItem({
            name: 'contractNo',
            value: '',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '请填写合同号', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }));
        //合同总金额
        dataItems.push(new DataItem({
            name: 'contractPrice',
            value: '',
            attr: {maxlength: 9},
            readonly: 'true',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '请填写合同总金额', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }));
        //原价总金额
        dataItems.push(new DataItem({
            name: 'productAmount',
            attr: {maxlength: 9},
            value: 0
        }));

        //付费状态值
        dataItems.push(new DataItem({
            name: 'payStatus',
            value: '1'
        }));
        //付费状态名
        dataItems.push(new DataItem({
            name: 'payStatus_name',
            value: '全款',
            visible: true,
            validateOptions: {
                required: {
                    enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }));

        dataItems.push(new DataItem({
            name: 'contract-image',
            visible: false
        }));
        dataItems.push(new DataItem({
            name: 'contractCopy-image',
            visible: false

        }));
        dataItems.push(new DataItem({
            name: 'companyGatePicture-image',
            visible: false

        }));
        //付费状态名 选择下拉列表
        dataItems.push(new DataItem({
            name: 'payStatus_select',
            visible: true,
            events: [
                {
                    key: 'change', value: function (e) {
                    var me = this;
                    var $dom = $(e.target);
                    var data = me.o_getFieldData('payStatus_select');
                    me.o_setValue({name: 'payStatus', value: $dom.val()});
                    switch ($dom.val()) {
                        case '1':
                        {
                            me.o_setValues([
                                {name: 'currPayAmount', value: me.o_getFieldValue('contractPrice')},
                                {name: 'currPayAmount_3', value: '0', visible: false},
                                {name: 'currPayAmount_1', value: '0', visible: false},
                                {name: 'currPayAmount_4', value: '0', visible: false},
                                {name: 'currPayAmount_5', value: '0', visible: false},
                                {name: 'currPayAmount_7', value: '0', visible: false},
                                {name: 'currPayAmount_8', value: '0', visible: false}
                            ]);
                            //全款
                        }
                            ;
                            break;
                        case '2':
                        {//分期
                            me.o_setValues([
                                {name: 'currPayAmount'},
                                {name: 'currPayAmount_3', visible: false},
                                {name: 'currPayAmount_1', visible: false},
                                {name: 'currPayAmount_4', visible: false},
                                {name: 'currPayAmount_5', visible: false},
                                {name: 'currPayAmount_7', visible: false},
                                {name: 'currPayAmount_8', visible: false}
                            ]);
                            var checkeds = me.__refs.tableInfo.o_getFieldValue('check').split(',');
                            if (me.__refs.terminalInfo.o_getFieldValue('useCRM') && me.__refs.terminalInfo.o_getFieldData('useCRMWrapper').visible) {//使用了销客终端 要加入服务费
                                checkeds.push('1');//CRM费用
                                if (me.__refs.terminalInfo.o_getFieldData('businesscard').visible) {
                                    checkeds.push('8');//名片费用
                                }
                            }
                            if (me.__refs.terminalInfo.o_getFieldValue('useFX')) {//使用了销客终端 要加入服务费
                                checkeds.push('3');//服务费
                            }
                            if (data.__editChanged === false) {
                                data.__editChanged = true;
                            }
                            $(checkeds).each(function (i, n) {
                                me.o_setValues([
                                    {name: 'currPayAmount_' + n, visible: true}
                                ]);
                            });
                        }
                            ;
                            break;
                        case '3':
                        {  //未付
                            me.o_setValues([
                                {name: 'currPayAmount_3', value: '0', visible: false},
                                {name: 'currPayAmount_1', value: '0', visible: false},
                                {name: 'currPayAmount_4', value: '0', visible: false},
                                {name: 'currPayAmount_5', value: '0', visible: false},
                                {name: 'currPayAmount_7', value: '0', visible: false},
                                {name: 'currPayAmount_8', value: '0', visible: false},
                                {name: 'currPayAmount', value: '0'}
                            ]);
                        }
                            ;
                            break;
                    }
                }
                }
            ]

        }));
        var currPayIdArr = [3, 1, 8, 4, 5, 7];
        $(currPayIdArr).each(function (i, n) {
            (function (id) {
                dataItems.push(new DataItem({
                    name: 'currPayAmount_' + id,
                    visible: false,
                    attr: {maxlength: 9},
                    events: [{
                        key: 'change', value: function (e) {
                            var me = this;
                            var controll=me.__refs.tableInfo;
                            if(id=='1' || id=='3' || id=='8'){
                                controll=me.__refs.terminalInfo;
                            }
                            var $dom=$(e.target);
                            $dom.val($dom.val().replace(/[^\.\d]/g, ''));

                            var purchaseAmount = controll.o_getFieldValue('purchaseAmount_' + id);
                            if (!purchaseAmount) {
                                $dom.val('');
                            }else if($dom.val() && parseFloat(purchaseAmount)<parseFloat($dom.val())){
                                util.showToast('分期金额不能大于对应的合同金额');
                                $dom.val(purchaseAmount);
                            }
                            var currPayAmount = 0;
                            me.$('.fenqi:visible').each(function (i, n) {
                                if ($(n).val()) {
                                    currPayAmount += parseFloat($(n).val());
                                }
                            });
                            me.o_setValue({name: 'currPayAmount', value: currPayAmount});

                        }
                    }]
                }));
            })(n);
        });
        //本次到款金额
        dataItems.push(new DataItem({
            name: 'currPayAmount',
            readonly: true,
            value: '',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '金额不能为空', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }));
        //打款日期
        dataItems.push(new DataItem({
            name: 'payDate',
            value: new Date().getTime(),
            validateOptions: {
                required: {
                    enable: true, value: true, message: '请填写打款日期', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }));

        //收款账户
        dataItems.push(new DataItem({
            name: 'receiptsAccount',
            value: '',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '请填写收款账户', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }));

        //付款单位/个人名称
        dataItems.push(new DataItem({
            name: 'payerName',
            value: '',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '请填写付款单位/个人名称', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }));
        //合同章名称
        dataItems.push(new DataItem({
            name: 'sealName',
            value: '',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '请填写合同章名称', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }));
        //合同照片 存成了字符串JSON
        dataItems.push(new DataItem({
            name: 'contract',
            value: '',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '请填写合同照片', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }));
        //合同照片 文件框
        dataItems.push(new DataItem({
            name: 'contract_file',
            events: [
                {
                    key: 'change',
                    value: function (e) {
                        var me = this;
                        sendFile(e, function (response) {
                            me.o_setValue({name: 'contract', value: JSON.stringify({contract: response.value.model.path, contractFileName: response.value.model.FileName})});
                        });
                    }
                }
            ],
            validateOptions:{
                required:{
                    enable:true,value:true,handler:function(error, value, option, $ele){
                        if(!this.o_getFieldValue('contract')){
                            return error = {field: $ele, name: 'required', option: option};
                        }
                        return false;
                    }
                }
            }
        }));
        //合同副本照片
        dataItems.push(new DataItem({
            name: 'contractCopy',
            value: ''
        }));
        //合同副本文件框
        dataItems.push(new DataItem({
            name: 'contractCopy_file',
            events: [
                {
                    key: 'change',
                    value: function (e) {
                        var me = this;
                        sendFile(e, function (response) {
                            me.o_setValue({name: 'contractCopy', value: JSON.stringify({contractCopy: response.value.model.path, contractCopyFileName: response.value.model.FileName})});
                        });
                    }
                }
            ]
        }));

        //门头照片
        dataItems.push(new DataItem({
            name: 'companyGatePicture',
            value: ''
        }));
        //门头照片文件框
        dataItems.push(new DataItem({
            name: 'companyGatePicture_file',
            events: [
                {
                    key: 'change',
                    value: function (e) {
                        var me = this;
                        sendFile(e, function (response) {
                            me.o_setValue({name: 'companyGatePicture', value: JSON.stringify({companyGatePicture: response.value.model.path, companyGatePictureFileName: response.value.model.FileName})});
                        });
                    }
                }
            ]
        }));
        //门头照片关键词
        dataItems.push(new DataItem({
            name: 'companyGateKeyword',
            value: ''
        }));
        //照片备注
        dataItems.push(new DataItem({
            name: 'companyGateRemark',
            value: ''
        }));

        return dataItems;
    }

});
