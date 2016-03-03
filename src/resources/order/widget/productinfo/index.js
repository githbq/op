define(function (require, exports, module) {
    function DataItem() {
        this.name = "";
        this.events = [{
            key: "", value: function (e) {
            }
        }];
        this.data = [];
        this.type = "";
        this.validateOption = {require: {value: true, message: ''}};
        this.visible = true;
        this.disable = false;
        this.attr = {};
    }

    var tplStr = require('./template.html');
    var PageClass = MClass(M.Center).include({
            getTemplateStr: function () {
                var me = this;
                return $(tplStr).filter(me.selector).html();
            },
            init: function (data) {

                //在初始化前做的事
                var me = this;
                me.o_fields = [];
                $(data.dataItems).each(function (i, n) {
                    me.elements['field_' + n.name] = n.name;

                    me.o_fields.push({key: '$' + n.name, value: n});
                    $(n.events || []).each(function (j, m) {
                        me[m.key + ' .field_' + name] = m.value;
                    });
                });
               PageClass.__super__.init.apply(this, arguments);
               me.$view.html(me.getTemplateStr());

            },
            elements: {},
            i_events: {},
            i_dataItems: {},
            i_selector: '',
            o_fields: [{key: '', value: {}}],
            o_validate: function () {
            },
            o_getValues: function () {


            },
            o_setValues: function (value) {
                var me = this;
                if (value) {
                    var isArray = $.isArray(value);
                    for (var i in value) {
                        var data = null;
                        var field = null;
                        var valueObj = null;
                        if (isArray) {
                            field = me.o_findField(function ($ele, responseData) {
                                return value[i].name == responseData.name;
                            });
                            if (field) {
                                data = me.o_field_getData(field);
                                valueObj = value[i];
                            }
                        } else {
                            if (value.hasOwnProperty(i)) {
                                field = me.o_findField(function ($ele, responseData) {
                                    return responseData.name == i;
                                });
                                if (field) {
                                    data = me.o_field_getData(field);
                                    valueObj = {value: value[i]};
                                }
                            }
                        }
                        if (field) {

                            switch (data.type) {
                                case 'inputRadio':
                                {
                                    field.attr('checked', false).filter('[value="' + valueObj.value + '"]').click();
                                }
                                    ;
                                    break;
                                case 'inputCheckbox':
                                {
                                    field.filter('[value="' + valueObj.value + '"]').click();
                                }
                                    ;
                                    break;
                                default:
                                {
                                    field.val(valueObj.value);
                                }
                                    ;
                                    break;

                            }
                        }
                    }
                }
            },
            o_findField: function (callback) {
                var me = this;
                var results = me.o_findFields(callback);
                return results.length > 0 ? results[0] : null;
            },
            o_findFields: function (callback) {
                var me = this;
                var finds = [];
                me.o_eachFields(function ($ele, data) {
                    if (typeof(callback) == 'boolean' || (callback && callback($ele, data))) {
                        finds.push($ele);
                    }
                });
                return finds;
            },
            o_eachFields: function (callback) {
                var me = this;
                $(me.o_fields).each(function (i, n) {
                    n.value.attr = n.value.attr || {};
                    var $ele = me[n.key];
                    callback && callback($ele, $ele.data('data'));
                });
            },
            o_field_getWrapper: function ($ele) {
                return $ele.parents('.wrapper');
            },
            o_field_hideWrapper: function ($ele) {
                this.o_field_getData($ele).visible = false;
                return this.o_field_getWrapper($ele).hide();
            },
            o_field_setReadonly: function ($ele) {
                this.o_field_getData($ele).readonly = true;
                $ele.css('readonly', 'readonly').attr('readonly', 'readonly');
                return $ele;
            },
            o_field_getData: function ($ele) {
                return $ele.data('data');
            }
        }
    );
    module.exports.PageDataClass = DataItem;
    module.exports.PageClass = PageClass;
});









