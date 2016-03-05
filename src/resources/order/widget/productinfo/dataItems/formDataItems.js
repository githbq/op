define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var uploader = require('common/widget/upload').uploader;
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
    dataItems.push(new DataItem({
        name: 'contract'
    }));
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

    dataItems.push(new DataItem({
        name: 'contractCopy'
    }));
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
    dataItems.push(new DataItem({
        name: 'payerName'
    }));
    dataItems.push(new DataItem({
        name: 'sealName'
    }));

});
