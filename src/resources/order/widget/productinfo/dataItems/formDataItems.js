define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var uploader = require('common/widget/upload').uploader;
    var dataItems = module.exports = [];

    //合同号
    dataItems.push(new DataItem({
        name: 'contractNo',
        value:'合同号'
    }));
    //合同总金额
    dataItems.push(new DataItem({
        name: 'contractPrice',
        value:'合同总金额'
    }));
    //付费状态值
    dataItems.push(new DataItem({
        name: 'payStatus',
        value:'1'
    }));
    //付费状态名
    dataItems.push(new DataItem({
        name: 'payStatus_name',
        value:'付费状态名:全额'
    }));
    //本次到款金额
    dataItems.push(new DataItem({
        name: 'currPayAmount',
        value:'本次到款金额'
    }));
    //打款日期
    dataItems.push(new DataItem({
        name: 'payDate',
        value:1023200032
    }));

    //收款账户
    dataItems.push(new DataItem({
        name: 'receiptsAccount',
        value:'收款账户$19999'
    }));

    //付款单位/个人名称
    dataItems.push(new DataItem({
        name: 'payerName',
        value:'付款单位/个人名称'
    }));
    //合同章名称
    dataItems.push(new DataItem({
        name: 'sealName',
        value:'合同章名称'
    }));
    //合同照片 存成了字符串JSON
    dataItems.push(new DataItem({
        name: 'contract',
        value:'合同照片'
    }));
    //合同照片 文件框
    dataItems.push(new DataItem({
        name: 'contract_file',
        events: [
            {
                key: 'change',
                value: function (e) {
                    var me = this;
                    uploader.send({
                        'url': '/op/api/file/uploadsinglefileandcheck',
                        'files': e.target.files,
                        'options': {
                            'limittype': 'IMAGE'
                        },
                        'success': function (response) {
                            console.warn(response);
                            me.o_setValue({name: 'contract', value: JSON.stringify({contract: response.value.model.path, contractFileName: response.value.model.FileName})});

                        }
                    })
                }
            }
        ]
    }));
   //合同副本照片
    dataItems.push(new DataItem({
        name: 'contractCopy',
        value:'合同副本照片'
    }));
    //合同副本文件框
    dataItems.push(new DataItem({
        name: 'contractCopy_file',
        events: [
            {
                key: 'change',
                value: function (e) {
                    var me = this;
                    uploader.send({
                        'url': '/op/api/file/uploadsinglefileandcheck',
                        'files': e.target.files,
                        'options': {
                            'limittype': 'IMAGE'
                        },
                        'success': function (response) {
                            console.warn(response);
                            me.o_setValue({name: 'contractCopy', value: JSON.stringify({contractCopy: response.value.model.path, contractCopyFileName: response.value.model.FileName})});

                        }
                    })
                }
            }
        ]
    }));

    //门头照片
    dataItems.push(new DataItem({
        name: 'companyGatePicture',
        value:'门头照片'
    }));
    //门头照片文件框
    dataItems.push(new DataItem({
        name: 'companyGatePicture_file',
        events: [
            {
                key: 'change',
                value: function (e) {
                    var me = this;
                    uploader.send({
                        'url': '/op/api/file/uploadsinglefileandcheck',
                        'files': e.target.files,
                        'options': {
                            'limittype': 'IMAGE'
                        },
                        'success': function (response) {
                            console.warn(response);
                            me.o_setValue({name: 'contractCopy', value: JSON.stringify({companyGatePicture: response.value.model.path, companyGatePictureFileName: response.value.model.FileName})});

                        }
                    })
                }
            }
        ]
    }));
    //门头照片关键词
    dataItems.push(new DataItem({
        name: 'companyGateKeyword',
        value:'门头照片关键词'
    }));
  //照片备注
    dataItems.push(new DataItem({
        name: 'companyGateRemark',
        value:'照片备注'
    }));











});
