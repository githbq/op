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
        name: 'contractCopy_file',
        events: [
            {
                key: 'change',
                value: function (e) {
                    alert(1);
                    var me=this;
                    uploader.send({
                        'url': '/op/api/file/uploadsinglefileandcheck',
                        'files': e.target.files,
                        'options': {
                            'limittype': 'IMAGE'
                        },
                        'success': function (response) {
                            console.warn(response);
                            me.model.set('businessLicense', response.value.model.path);
                            me.model.set('businessLicenseFileName', response.value.model.FileName);
                            me.o_setValue({'purchaseAmount_44':JSON.stringify({businessLicense:response.value.model.path,businessLicenseFileName:response.value.model.FileName})});
                        }
                    })
                }
            }
        ]
    }));

    dataItems.push(new DataItem({
        name: 'contractCopy'
    }));



});
