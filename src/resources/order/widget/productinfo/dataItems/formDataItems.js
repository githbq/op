define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var uploader = require('common/widget/upload').uploader;
    var dataItems = module.exports = [];

    function sendFile(e,callback) {
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
        validateOptions: {
            required: {
                enable: true, value: true, message: '请填写合同总金额', handler: function (error, value, option, $ele) {
                }
            }
        }
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
        validateOptions: {
            required: {
                enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                }
            }
        }
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
                    sendFile(e,function (response) {
                        debugger
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
                    sendFile(function (response) {
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
                    sendFile(function (response) {
                        console.warn(response);
                        me.o_setValue({name: 'contractCopy', value: JSON.stringify({companyGatePicture: response.value.model.path, companyGatePictureFileName: response.value.model.FileName})});
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
