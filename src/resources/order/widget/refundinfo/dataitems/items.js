/**
 * Created by hubq on 2016/4/7.
 */
define(function (require, exports, module) {
    var DataItem = require('common/widget/sform/sform').PageDataClass;
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
    module.exports.getItems = function () {

        var dataItems = [];
        //合同总金额
        dataItems.push(new DataItem({
            name: 'purchaseCount_3',
            value: 'purchaseCount_3',
            attr: {maxlength: 9},
            validateOptions: {
                required: {
                    enable: true, value: true, message: '请填写合同总金额', handler: function (error, value, option, $ele) {
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
                        var $uploadinfo = $(e.target).parent().find('.uploadinfo');
                        $uploadinfo.show().text('上传中...');
                        sendFile(e, function (response) {
                            $uploadinfo.hide().text('');
                            me.o_setValue({name: 'contract', value: JSON.stringify({contract: response.value.model.path, contractFileName: response.value.model.FileName})});
                        });
                    }
                }
            ],
            validateOptions: {
                required: {
                    enable: true, value: true, handler: function (error, value, option, $ele) {
                        if (!this.o_getFieldValue('contract')) {
                            return error = {field: $ele, name: 'required', option: option};
                        }
                        return false;
                    }
                }
            }
        }));

         return dataItems;
    }
});