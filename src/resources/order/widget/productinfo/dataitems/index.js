/**
 * Created by hubq on 2016/3/15.
 */
define(function (require, exports, module) {
    exports.getValidateLogic = function () {
        var validateLogic = {
            required: {
                enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                    var me = this;
                    if ($ele.attr('data-name') == 'purchaseCount_3') {


                    }
                    if ($ele.attr('data-name') == 'purchaseCount_16') {
                        //培训助手购买流量不验证
                        return false;
                    }
                    if ($ele.is('[readonly],[disabled]')) {
                        return false;
                    }
                    var $checkbox = null;
                    var id = null;
                    if ($ele.parents('[data-productid]').attr('data-productid') == '3') {
                        $checkbox = $('[data-name=useFX]');
                        id = '3';
                    } else {
                        $checkbox = $ele.parents('.suborder:last').find('input[type=checkbox]:first');
                        id = $checkbox.val();
                    }
                    if ($ele.parents('[data-productid]').attr('data-productid') == '13') {
                        $checkbox = $('[data-name=useTrainning]');
                        id = '13';
                    }
                    if ($checkbox && id && $checkbox.length > 0) {
                        if ($checkbox.is(':checked')) {
                            if (me.o_data_getField({name: 'type_' + id}).length > 0 && me.o_data_getField({name: 'type_' + id}).is(':visible')) {
                                if (me.o_getFieldValue('type_' + id) != '3' && me.o_getFieldValue('type_' + id) != '4') {
                                    return false;
                                }
                            }
                        } else {
                            return false;
                        }
                    }
                }
            }
        };
        return validateLogic;
    }


});