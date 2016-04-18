/**
 * Created by hubq on 2016/4/7.
 */
define(function (require, exports, module) {

    var apiPool = {};
    //审批接口
    apiPool.directApprove = function (id, approved, comment, success) {
        util.api({
            'url': '~/op/api/approval/directapprove',
            'data': {
                'processInstanceId': id,   //流程实例ID
                'approved': approved,                  //审批结果(通过/拒绝)
                'opinion': comment  //审批意见
            },
            success: success
        })
    };
    //更新发票开具信息
    apiPool.updateInvoice = function (data, success) {
        util.api({
            'url': '/odr/invoice/updateInvoice',
            'data': JSON.stringify(data),
            'contentType': 'application/json;charset=UTF-8 ',
            success: success
        });
    };
    var DataItem = require('common/widget/sform/sform').PageDataClass;
    module.exports.getItems = function () {
        var dataItems = [];
        dataItems.push(new DataItem({name: 'enterpriseId', value: ''}));
        dataItems.push(new DataItem({name: 'apiPool', value: apiPool}));
        dataItems.push(new DataItem({
            name: 'save',
            events: [{
                key: 'click', value: function (e) {
                    var me = this;
                    if (me.o_getFieldData('save').using || !confirm('确定保存?')) {
                        return;
                    }
                    me.o_setValue({name: 'save', using: true});
                    (getUpdateInvoice(function (result, me) {
                        me.o_setValue({name: 'save', using: false});
                        if (result.success) {
                            util.showTip('保存成功');

                            me.trigger('doClose', true);
                        }
                    })).call(this, e);
                }
            }]
        }));
        dataItems.push(new DataItem({
            name: 'cancel',
            events: [{
                key: 'click', value: function (e) {
                    var me = this;
                    me.trigger('doClose', false);
                }
            }]
        }));
        dataItems.push(new DataItem({
            name: 'refuse',
            events: [{
                key: 'click', value: refuseOrAgree(false)
            }]
        }));
        dataItems.push(new DataItem({
            name: 'agree',
            events: [{
                key: 'click', value: refuseOrAgree(true)
            }]
        }));
        //审批同意或拒绝
        function refuseOrAgree(approved) {
            return function (e) {
                var me = this;
                var $dom = $(e.target);
                if (me.o_getFieldData($dom.attr('data-name')).using || !confirm('确定执行?')) {
                    return;
                }
                me.o_setValue({name: $dom.attr('data-name'), using: true});
                if (approved) {
                    (getUpdateInvoice(function (result, me) {
                        me.o_setValue({name: $dom.attr('data-name'), using: false});
                        if (!result.success) {
                            return
                        }
                        saveCommnet();
                    })).call(me, e);
                } else {
                    saveCommnet();
                }
                function saveCommnet() {
                    me.o_getFieldValue('apiPool').directApprove(me.o_getFieldValue('processInstanceId'), approved, me.o_getFieldValue('comment'), function (result) {
                        if (result.success) {
                            util.showTip('操作成功');
                            me.trigger('doClose', true);
                        }
                    });
                }

            }
        }

        function getUpdateInvoice(callback) {
            return function (e) {
                var me = this;
                var data = {
                    id: me.o_getFieldValue('invoiceId'),
                    invoiceStatus: me.o_getFieldValue('invoiceStatus'),
                    invoiceDate: me.o_getFieldValue('invoiceDate'),
                    invoiceCompany: me.o_getFieldValue('invoiceCompany'),
                    invoiceNo: me.o_getFieldValue('invoiceNo')
                };
                me.o_getFieldValue('apiPool').updateInvoice(data, function (result) {
                    if (callback) {
                        callback(result, me);
                    }
                })
            }

        }


        return dataItems;
    }
});