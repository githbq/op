/**
 * Created by hubq on 2016/3/15.
 */
define(function (require, exports, module) {
    exports.getValidateLogic = function () {
        var validateLogic = {
            required: {
                enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                    var me = this;
                    if ($ele.is('[readonly],[disabled]')) {
                        return false;
                    }
                    var $checkbox = $ele.parents('.suborder:last').find('input[type=checkbox]:first');
                    if ($checkbox.length > 0) {
                        var id = $checkbox.val();
                        if ($checkbox.is(':checked')) {
                            if (me.o_data_getField({name: 'type_' + id}).length > 0 && me.o_data_getField({name: 'type_' + id}).is(':visible')) {
                                if (me.o_getFieldValue('type_' + id)!= '3' && me.o_getFieldValue('type_' + id) != '4') {
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