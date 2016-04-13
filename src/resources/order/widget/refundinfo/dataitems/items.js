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
        //var files=['invoice_original','reject_proof','red_invoice_info','invoice_copy'];
        //      $(files).each(function(i,n){
        //
        //          dataItems.push(new DataItem({
        //              name: n+'_file',
        //              visible:false,
        //              events: [
        //                  {
        //                      key: 'change',
        //                      value: function (e) {
        //                          var me = this;
        //                          var $uploadinfo = $(e.target).parent().find('.uploadinfo');
        //                          $uploadinfo.show().text('上传中...');
        //                          sendFile(e, function (response) {
        //                              $uploadinfo.hide().text('');
        //                              me.o_setValue({name: 'contract', value: JSON.stringify({contract: response.value.model.path, contractFileName: response.value.model.FileName})});
        //                          });
        //                      }
        //                  }
        //              ],
        //              validateOptions: {
        //                  required: {
        //                      enable: true, value: true, handler: function (error, value, option, $ele) {
        //                          if (!this.o_getFieldValue(n)) {
        //                              return error = {field: $ele, name: 'required', option: option};
        //                          }
        //                          return false;
        //                      }
        //                  }
        //              }
        //          }));
        //
        //      });
        return dataItems;
    }
});