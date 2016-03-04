define(function (require, exports, module) {


    function DataItem(options) {
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
        this.init(options);
    }

    DataItem.prototype.init = function (options) {
        $.extend(this, options || {});
    };

    var tplStr = require('./template.html');
    var PageClass = MClass(M.Center).include({
            getTemplateStr: function () {
                var me = this;
                return $(tplStr).filter(me.selector).html();
            },
            i_attrName: 'data-name',
            i_getSelectorByName: function (name) {
                return '[' + this.i_attrName + '=' + name + ']';
            },
            events: {},
            elements: {},
            init: function (data) {
                //在初始化前做的事
                var me = this;
                me.dataDic = {};//数据字典
                me.events = me.events || {};
                me.o_fields = [];
                $(data.dataItems).each(function (i, n) {
                    n.__guid = n.name;//name要保持唯一
                    me.dataDic[n.__guid] = n;
                    me.elements[me.i_getSelectorByName(n.name)] = n.name;

                    me.o_fields.push({key: '$' + n.name, value: n});
                    $(n.events || []).each(function (j, m) {
                        if (m && m.key) {
                            me.events[m.key + ' ' + me.i_getSelectorByName(n.name)] = m.value;
                        }
                    });
                });
                data.view.html(me.getTemplateStr());
                PageClass.__super__.init.apply(this, arguments);
                //元素与数据双向关联
                $(me.o_fields).each(function (i, n) {
                    var field = me[n.key];
                    var fieldData = me.dataDic[n.value.__guid];
                    $(field).data('data', fieldData);
                    fieldData.$ele = field;
                });
                me.$('input[datecontrol]').datetimepicker({format: 'Y/m/d'});
                me.o_setValues(data.dataItems);

            },
            i_dataItems: {},
            i_selector: '',
            o_fields: [{key: '', value: {}}],
            o_validate: function () {
            },
            o_getValues: function () {
                var me = this;
                var result = {};
                me.o_eachFields(function ($ele, data) {
                    result[data.name] = me.o_getFieldValue(data.name);

                });
                return result;
            },
            o_getFieldValue: function (name) {
                //
                var me = this;
                var $ele = me.o_findField(function ($ele, data) {
                    return data.name == name;
                });
                var value = "";
                if ($ele) {
                    if ($ele.is('input[type=radio]') || $ele.is('input[type=checkbox]')) {
                        var arr = [];
                        $($ele.filter(':checked')).each(function (i, n) {
                            arr.push($(n).val());
                        });
                        value = arr.join(',');
                    }
                } else {
                    value = $ele.val();
                }
                return value;
            },
            o_setValues: function (value) {
                debugger
                var me = this;
                if (value) {
                    var isArray = $.isArray(value);
                    for (var i in value) {
                        var data = null;
                        var field = null;
                        var valueObj = null;
                        if (isArray) { //数组传递复杂数据
                            debugger
                            me.o_setValue(value[i]);
                        } else {//对象传递简单值
                            me.o_setValue({name: i, value: value[i]});
                        }
                    }
                }
            },
            o_setValue: function (obj) {
                var me = this;
                if (!obj.name) {
                    return;
                }
                var $field = me.dataDic[obj.name].$ele;//找到对应的$DOM
                if ($field) {
                    //自动执行设置方法
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i) && i.toString().length > 1) {
                            var methodName = 'o_setField' + i.substr(0, 1).toUpperCase() + i.substring(1);
                            var method = me[methodName];
                            if (method) {
                                method.call(me, $field, obj[i]);
                            }
                        }
                    }
                }
            },
            o_setFieldValue: function ($ele, value) {
                if (value !== undefined) {
                    var me = this;
                    var data = me.o_field_getData($ele);
                    //考虑复选框情况
                    if ($ele.is('input[type=radio]') || $ele.is('input[type=checkbox]')) {
                        $ele.attr('checked', false).filter('[value=' + value + ']').attr('checked', true).change();
                    } else {
                        $ele.val(value);
                    }
                    data.value = value;
                }
            },
            o_setFieldAttr: function ($ele, value) {
                if (value !== undefined) {
                    debugger
                    var me = this;
                    var data = me.o_field_getData($ele);
                    $ele.attr(value);
                    data.attr = value;
                }
            }
            ,
            o_findField: function (callback) {
                var me = this;
                var results = me.o_findFields(callback);
                return results.length > 0 ? results[0] : null;
            }
            ,
            o_findFields: function (callback) {
                var me = this;
                var finds = [];
                me.o_eachFields(function ($ele, data) {
                    if (typeof(callback) == 'boolean' || (callback && callback($ele, data))) {
                        finds.push($ele);
                    }
                });
                return finds;
            }
            ,
            o_eachFields: function (callback) {
                var me = this;
                $(me.o_fields).each(function (i, n) {
                    n.value.attr = n.value.attr || {};
                    var $ele = me[n.key];
                    callback && callback($ele, $ele.data('data'));
                });
            }
            ,
            o_field_getWrapper: function ($ele) {
                return $ele.parents('.wrapper');
            }
            ,
            o_setFieldVisible: function ($ele, value) {
                if (value !== undefined) {
                    value = value || true;
                    var wrapper = this.o_field_getWrapper($ele);
                    if (value) {
                        wrapper.hide();
                    } else {
                        wrapper.show();
                    }
                    this.o_field_getData($ele).visible = value;
                }
            }
            ,
            o_setFieldReadonly: function ($ele, value) {
                value = value || false;
                this.o_field_getData($ele).readonly = value;
                if (value) {
                    $ele.addClass('readonly', 'readonly').attr('readonly', 'readonly');
                } else {
                    $ele.removeClass('readonly', 'readonly').removeClass('readonly', 'readonly');
                }
                return $ele;
            }
            ,
            o_field_getData: function ($ele) {
                return $ele.data('data');
            }
        }
    );
    module.exports.PageDataClass = DataItem;
    module.exports.PageClass = PageClass;
})
;









