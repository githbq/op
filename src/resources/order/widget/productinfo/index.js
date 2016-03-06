define(function (require, exports, module) {
    function DataItem(options) {
        this.name = "";
        this.events = [{
            key: "", value: function (e) {
            }
        }];
        this.data = [];
        this.type = "";
        //enable:true/false 是否启用本验证
        //this.validateOptions = {
        //    require: {
        //        enable: true, value: true, message: '', handler: function (error, value, option, $ele, me) {
        //        }
        //    }
        //};
        //this.visible = true;
        //this.disable = false;
        //this.readonly=false;
        //this.attr = {};
        this.init(options);
    }

    DataItem.prototype.init = function (options) {
        $.extend(this, options || {});
    };
    var PageClass = MClass(M.Center).include({
            i_getTemplateStr: function () {
                var me = this;
                return '<div></div>';
            },
            i_textFieldSelector: '.field_text',
            i_attrName: 'data-name',
            i_getSelectorByName: function (name) {
                return '[' + this.i_attrName + '=' + name + ']';
            },
            i_inject: function (data) {//被动注入
                var me = this;
                var $template = $(me.i_getTemplateStr());
                $template.find('[data-name]').each(function (i, n) {
                    var name = $(n).attr('data-name');
                    var findItem = _.findWhere(data.dataItems, {name: $(n).attr('data-name')})
                    if (!findItem) {
                        data.dataItems.push(new DataItem({name: name, __auto: true}));
                    }
                });
                data.view.html('').append($template);
            },
            i_initEventsAndElements: function (data) {
                var me = this;
                me.dataDic = {};//数据字典
                me.events = me.events || {};
                me.o_fields = [];
                $(data.dataItems).each(function (i, n) {
                    if (n.__enabled !== false) {
                        n.__index = i;
                        n.__guid = n.name;//name要保持唯一
                        me.dataDic[n.__guid] = n;
                        me.elements[me.i_getSelectorByName(n.name)] = n.name;

                        me.o_fields.push({key: '$' + n.name, value: n});
                        $(n.events || []).each(function (j, m) {
                            if (m && m.key) {
                                me.events[m.key + ' ' + me.i_getSelectorByName(n.name)] = m.value;
                            }
                        });
                    }
                });
            },
            events: {},
            elements: {},
            init: function (data) {
                //在初始化前做的事
                var me = this;
                me.i_inject(data);//数据处理
                me.i_initEventsAndElements(data);//核心对象处理
                PageClass.__super__.init.apply(this, arguments);//调用父类初始化
                me.i_init(data);//最终初始化
            },
            i_init: function (data) {
                var me = this;
                //元素与数据双向关联
                $(me.o_fields).each(function (i, n) {
                    var $field = me[n.key];
                    var fieldData = me.dataDic[n.value.__guid];
                    var config = $field.attr('data-config') && me.i_parseJSON($field.attr('data-config')) || {};
                    $.extend(config, fieldData);
                    me.dataDic[n.value.__guid] = config;
                    data.dataItems[config.__index] = config;
                });
                me.o_setValues(data.dataItems);
                me.i_initDatePicker();
            },
            i_toHighOrderFunction: function (func, context, args) {
                //转换为高阶函数
                return function () {
                    func.apply(context, args);
                }
            },
            i_initDatePicker: function () {
                var me = this;
                var option = {format: 'Y/m/d', timepicker: false};
                me.$('input[datecontrol]:not([readonly])').each(function (i, n) {
                    var config = $(n).attr('datecontrol') ? me.i_parseJSON($(n).attr('datecontrol')) : {};
                    $.extend(option, config);
                    $(n).datetimepicker(option);
                });
            },
            i_parseJSON: function (str) {
                var me = this;
                var data = {};
                if (str) {
                    str = str.replace(/[']/g, '"');
                    data = $.parseJSON(str);
                }
                return data;
            },
            i_dataItems: {},
            i_selector: '',
            o_fields: [{key: '', value: {}}],
            o_validate: function () {
                var me = this;
                var errors = me.errors = [];
                me.o_eachFields(function ($ele, data) {
                    var error = me.o_validateField($ele);
                    if (error) {
                        errors.push(error);
                    }
                });
                return errors.length == 0;
            },
            o_getValidateErrors: function () {
                //获取验证的错误信息
                return me.errors;
            },
            o_validateField: function ($ele) {
                var me = this;
                var data = me.o_field_getData($ele);
                var options = data.validateOptions;
                var value = me.o_getFieldValue(null, $ele);
                var wrapper = me.o_field_getWrapper($ele);
                var error = null;
                if (options) {
                    for (var i in options) {
                        var option = options[i];
                        if (options.hasOwnProperty(i) && option.enable) {
                            switch (i) {
                                case 'required':
                                {
                                    error = me.i_checkError(i, value, option, $ele, wrapper, function (value, option, $ele) {
                                        return !value;
                                    });
                                }
                                    break;
                                case 'maxlength':
                                {
                                    error = me.i_checkError(i, value, option, $ele, wrapper, function (value, option, $ele) {
                                        return value.length > option.value;

                                    });
                                }
                                    break;
                                default:
                                {   //自定义验证   拓展名规则为      i_fieldValidateXXXXXXX
                                    if (i.toString().length > 0) {
                                        var methodName = me.i_toWord('i_fieldValidate', i);
                                        var method = me[methodName];
                                        if (method) {
                                            error = me.i_checkError(method);
                                        }
                                    }
                                }
                                    ;
                                    break;
                            }
                            if (option.handler) { //错误代理
                                var result = option.handler.call(me, error, value, $ele);
                                if (result !== undefined) {
                                    error = result;
                                }
                            }
                        }
                    }
                }
                return error;
            },
            i_toWord: function (prefix, value) {//驼峰命名法
                return prefix + value.substr(0, 1).toUpperCase() + value.substr(1);
            },
            i_checkError: function (requireName, value, option, $ele, wrapper, callback) {
                var me = this;
                var error = null;
                if (callback && callback(value, option, $ele)) {
                    error = {field: $ele, name: requireName, option: option};
                }
                if ((!option.handler) || (option.handler && option.handler.call(me, error, value, option, $ele) !== false)) {
                    if (error) {
                        wrapper.addClass('required-error');
                        wrapper.find('.error').show().html(option.message);
                    } else {
                        wrapper.find('.error').hide().html('');
                        wrapper.removeClass('required-error');
                    }
                }
                me.trigger('validateError', value, option, $ele, me);
                return error;
            },
            o_getValues: function () {
                var me = this;
                var result = {};
                me.o_eachFields(function ($ele, data) {
                    result[data.name] = me.o_getFieldValue(data.name);

                });
                return result;
            },
            o_getFieldValue: function (name, $ele) {
                var me = this;
                var data = null;
                var $ele = $ele || me.o_findField(function ($ele, data) {
                        data = data;
                        return data.name == name;
                    });
                if ($ele.length == 0 && data) {//无DOM数据
                    return data;
                }
                var value = "";
                if ($ele) {
                    if ($ele.is('input[type=radio]') || $ele.is('input[type=checkbox]')) {
                        var arr = [];
                        $($ele.filter(':checked')).each(function (i, n) {
                            arr.push($(n).val());
                        });
                        value = arr.join(',');
                    }
                    else if ($ele.is('input[type=file]')) {
                        var index = name.indexOf('_file');
                        if (index > 0) {
                            var hiddenName = name.substring(0, index);
                            var hiddenField = me.o_findField(function ($ele, data) {
                                return data.name == hiddenName;
                            });
                            if (hiddenField) {
                                value = me.o_getFieldValue(hiddenName);
                            }
                        }
                        else {
                            console.warn(name + '文件标签必须data-name以_file结尾，且拥有一个对应的隐藏域data-name值为_file之前的部分');
                        }
                    }
                    else if ($ele.is('[datecontrol]') && typeof(value) == 'int') {
                        var configStr = $ele.attr('datecontrol');
                        var config = configStr && me.i_parseJSON(configstr) || {};
                        if (config.type == '1') {//0开始时间 1为结束时间
                            value = new Date($ele.val() + " 23:59:59").getTime();
                        } else {
                            value = new Date($ele.val() + " 00:00:00").getTime();
                        }
                    }
                    else if ($ele.is(me.i_textFieldSelector)) {
                        value = $ele.text();
                    }
                    else {
                        value = $ele.val();
                    }
                }
                return value;
            },
            o_setValues: function (value) {
                var me = this;
                if (value) {
                    var isArray = $.isArray(value);
                    for (var i in value) {
                        if (value[i].__enabled !== false) {
                            var data = null;
                            var field = null;
                            var valueObj = null;
                            if (isArray) { //数组传递复杂数据
                                me.o_setValue(value[i]);
                            } else {//对象传递简单值
                                me.o_setValue({name: i, value: value[i]});
                            }
                        }
                    }
                }
            },
            o_setValue: function (obj, silent) {//silent不触发事件
                var me = this;
                if (!obj.name) {
                    return;
                }
                var data = me.dataDic[obj.name];
                var $field = me.o_data_getField(data);//找到对应的$DOM
                if (!data) {
                    console.warn('未到找对应的数据=>data:' + JSON.stringify(obj));
                    return;
                }
                if ($field) {
                    //自动执行设置方法
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i) && i.toString().length > 1) {
                            var methodName = me.i_toWord('o_setField', i);
                            var method = me[methodName];
                            if (method) {
                                method.call(me, $field, obj[i], silent);
                            }
                        }
                    }
                } else {//无DOM的数据
                    $.extend(data, obj);
                }
            },
            o_setFieldValue: function ($ele, value, silent) {
                var me = this;
                if (value !== undefined && value !== null) {
                    var me = this;
                    var data = me.o_field_getData($ele);
                    if (!data) {
                        console.warn('未找到数据,值=>' + value);
                    }
                    //考虑复选框情况
                    if ($ele.is('input[type=radio]') || $ele.is('input[type=checkbox]')) {
                        if (typeof(value) == 'boolean') {
                            $ele.prop('checked', value).change();
                        } else {
                            var items = $.isArray(value) ? value : value.split(',');
                            $(items).each(function (i, n) {
                                $ele.filter('[value=' + n + ']').attr('data-checked', '1');
                            });
                            var excepts = $ele.filter(':not([data-checked])').prop('checked', false).attr('checked', false);
                            !silent && excepts.change();
                            var wants = $ele.filter('[data-checked]').prop('checked', true).attr('checked', true).removeAttr('data-checked');
                            !silent && wants.change();
                        }
                    }
                    else if ($ele.is('[datecontrol]') && typeof(value) == 'number') {
                        debugger
                        var configStr = $ele.attr('datecontrol');
                        var config = configStr && me.i_parseJSON(configStr) || {};
                        var format = config.format || "yyyy/MM/dd";
                        $ele.val(new Date(value)._format(format));
                    }
                    else if ($ele.is(me.i_textFieldSelector)) {
                        $ele.html(value);
                    }
                    else {
                        $ele.val(value);
                    }
                    !silent && $ele.change();
                    data.value = value;
                    me.trigger('setFieldValue', $ele, value);
                }
            },
            o_setFieldAttr: function ($ele, value) {
                var me = this;
                var data = me.o_field_getData($ele);
                if (value !== undefined && data) {
                    var me = this;
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
                    // if ($ele.length > 0) {//现在允许无dom的数据
                    callback && callback($ele, me.o_field_getData($ele));
                    //}
                });
            }
            ,
            o_field_getWrapper: function ($ele) {
                return $ele.parents('.field').length > 0 ? $ele.parents('.field') : $ele;
            }
            ,
            o_setFieldVisible: function ($ele, value) {
                var me = this;
                if (value != undefined) {
                    var wrapper = this.o_field_getWrapper($ele);
                    if (!value) {
                        wrapper.hide();
                    } else {
                        wrapper.show();
                    }
                    this.o_field_getData($ele).visible = value;
                }
            }
            ,
            o_setFieldReadonly: function ($ele, value) {
                var me = this;
                value = value === undefined ? false : true;
                this.o_field_getData($ele).readonly = value;
                if (value) {
                    $ele.addClass('readonly', 'readonly').attr('readonly', 'readonly');
                } else {
                    $ele.removeClass('readonly', 'readonly').removeAttr('readonly', 'readonly');
                }
                return $ele;
            }
            ,
            o_field_getData: function ($ele) {
                return me.dataDic[$ele.attr('data-name')];
            },
            o_data_getField: function (data) {
                var me=this;
                return me.$('[data-name=' + data.name + ']');
            }
        }
    );
    module.exports.PageDataClass = DataItem;
    module.exports.PageClass = PageClass;
})
;









