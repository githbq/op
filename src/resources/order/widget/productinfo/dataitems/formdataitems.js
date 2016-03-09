define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var uploader = require('common/widget/upload').uploader;
    var dataItems = module.exports = [];

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

    //付费状态名 选择下拉列表
    dataItems.push(new DataItem({
        name: 'payStatus_select',
        visible: true,
        events: [
            {
                key: 'change', value: function (e) {
                var me = this;
                var $dom = $(e.target);
                me.o_setValue({name: 'payStatus', value: $dom.val()});
                switch ($dom.val()) {
                    case '1':
                    {
                        me.o_setValues([
                            {name: 'currPayAmount', value: me.o_getFieldValue('contractPrice')},
                            {name: 'currPayAmount_3', value: '', visible: false},
                            {name: 'currPayAmount_1', value: '', visible: false},
                            {name: 'currPayAmount_4', value: '', visible: false},
                            {name: 'currPayAmount_5', value: '', visible: false},
                            {name: 'currPayAmount_7', value: '', visible: false}
                        ]);
                        //全款
                    }
                        ;
                        break;
                    case '2':
                    {//分期
                        me.o_setValues([
                            {name: 'currPayAmount', value: ''},
                            {name: 'currPayAmount_3', value: '', visible: false},
                            {name: 'currPayAmount_1', value: '', visible: false},
                            {name: 'currPayAmount_4', value: '', visible: false},
                            {name: 'currPayAmount_5', value: '', visible: false},
                            {name: 'currPayAmount_7', value: '', visible: false}
                        ]);
                        var checkeds = me.__refs.tableInfo.o_getFieldValue('check').split(',');
                        if (me.__refs.terminalInfo.o_getFieldValue('useFX') && me.__refs.terminalInfo.o_getFieldData('useCRMWrapper').visible) {//使用了销客终端 要加入服务费
                            checkeds.push('1');//CRM费用
                        }
                        if (me.__refs.terminalInfo.o_getFieldValue('useCRM')) {//使用了销客终端 要加入服务费
                            checkeds.push('3');//服务费
                        }
                        $(checkeds).each(function (i, n) {
                            me.o_setValues([
                                {name: 'currPayAmount_' + n, value: '', visible: true}
                            ]);
                        });
                    }
                        ;
                        break;
                    case '3':
                    {  //未付
                        me.o_setValues([
                            {name: 'currPayAmount_3', value: '', visible: false},
                            {name: 'currPayAmount_1', value: '', visible: false},
                            {name: 'currPayAmount_4', value: '', visible: false},
                            {name: 'currPayAmount_5', value: '', visible: false},
                            {name: 'currPayAmount_7', value: '', visible: false},
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

    //分期 服务费
    dataItems.push(new DataItem({
        name: 'currPayAmount_3',
        visible: false

    }));
    //分期 CRM费
    dataItems.push(new DataItem({
        name: 'currPayAmount_1',
        visible: false

    }));
    //分期 PK助手费
    dataItems.push(new DataItem({
        name: 'currPayAmount_4',
        visible: false

    }));
    //分期 会议助手费
    dataItems.push(new DataItem({
        name: 'currPayAmount_5',
        visible: false

    }));
    //PK助手费
    dataItems.push(new DataItem({
        name: 'currPayAmount_7',
        visible: false

    }));
    //本次到款金额
    dataItems.push(new DataItem({
        name: 'currPayAmount',
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
                        console.warn(response);
                        me.o_setValue({name: 'contract', value: JSON.stringify({contract: response.value.model.path, contractFileName: response.value.model.FileName})});
                    });
                }
            }
        ]
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
                        console.warn(response);
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
                        console.warn(response);
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


});
