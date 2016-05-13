define(function (require, exports, module) {
    //模型参照
    //function DataItem(options) {
    //    this.name = "";
    //    this.events = [{
    //        key: "", value: function (e) {
    //        }
    //    }];
    //    this.data = [];
    //    this.type = "";q  ``
    //    //enable:true/false 是否启用本验证
    //    //this.validateOptions = {
    //    //    require: {
    //    //        enable: true, value: true, message: '', handler: function (error, value, option, $ele, me) {
    //    //        }
    //    //    }
    //    //};
    //    //this.visible = true;
    //    //this.disable = false;
    //    //this.readonly=false;
    //    //this.attr = {};
    //    this.init(options);
    //}
    var DataItem = MClass(M.Event).include({
        init: function (options) {
            $.extend(this, options || {});
            DataItem.__super__.init.apply(this, arguments);
        }
    });
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
                var nameDic = {};
                $template.find('[' + me.i_attrName + ']').each(function (i, n) {
                    var $dom = $(n);
                    var name = $dom.attr(me.i_attrName);
                    me.i_init_FieldConvert($dom);//控件格式转换
                    if (name && !nameDic[name]) {//排除只有属性无值的情况
                        var findItem = _.findWhere(data.dataItems, {name: $dom.attr(me.i_attrName)});
                        if (!findItem) {
                            data.dataItems.push(new DataItem({name: name, __auto: true}));
                        }
                        nameDic[name] = 1;
                    }
                });
                //注入数据项时事件
                data.i_on_injectDataItem && data.i_on_injectDataItem.call(me, data.dataItems);
                me.wrapperView = data.wrapperView;
                me.$view = me.view = $('<div>');
                me.$view.html('').append($template);
            },
            i_inject_validate: function ($ele) {
                var options = {};
                //注入验证
                var me = this;
                if ($ele.is('[data-validate]') && $ele.attr('data-validate')) {
                    options = me.i_parseJSON($ele.attr('data-validate'));
                }
                return options;
            },
            render: function () {
                var me = this;
                me.i_init(me.attrs);//最终初始化
                me.wrapperView.html('').append(me.$view);
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
            i_convertFieldWhereDatetime: function (next, $ele) {
                if ($ele.is('input[datecontrol]:not([readonly])')) {
                    var me = this;
                    var option = {dateFmt: 'yyyy/MM/dd'};
                    if ($ele.is('[maxdate]') && $ele.attr('maxdate')) {
                        option.maxDate = $ele.attr('maxdate');
                    }
                    if ($ele.is('[mindate]') && $ele.attr('mindate')) {
                        option.minDate = $ele.attr('mindate');
                    }
                    var config = $ele.attr('datecontrol') ? me.i_parseJSON($ele.attr('datecontrol')) : {};
                    $.extend(option, config);
                    //option.onClose=function(time,$ele){
                    //    $ele.change();
                    //    return true;
                    //};
                    $ele.off('click').on('click', function () {
                        WdatePicker($.extend(option, config));
                    });
                    return true;
                }
                return next && next($ele);
            },
            i_convertFieldWhereNumber: function (next, $ele) {

                if ($ele.is('[data-type=number]')) {
                    $ele.on('change', function (e) {
                        var $dom = $(e.target);
                        $dom.val($dom.val().replace(/[^\.\d]/g, ''));
                        $dom.val($dom.val().match(/^[+-]?\d+(\.\d+)?$/) ? $dom.val() : '');
                    })
                }
                return next($ele);
            },
            i_convertFieldWhereInt: function (next, $ele) {

                if ($ele.is('[data-type=int]')) {
                    $ele.on('change', function (e) {
                        var $dom = $(e.target);
                        $dom.val($dom.val().replace(/[^\d]/g, ''));
                    })
                }
                return next($ele);
            },
            events: {},
            elements: {},
            i_silent: false,//安静.不触发事件
            init: function (data) {
                //在初始化前做的事
                var me = this;
                me.i_inject(data);//数据处理
                me.i_initEventsAndElements(data);//核心对象处理
                PageClass.__super__.init.apply(this, arguments);//调用父类初始化
            },
            i_initInnerEvent: function ($ele) {
                //var me = this;
                //if ($ele && $ele.length > 0) {
                //    $ele.on('change', function (e) {
                //        var data = me.o_field_getData($(e.target));
                //        if (data.__inited && !data.__silent && !$ele.attr('novalidate')) {
                //            me.o_validate();
                //        }
                //    });
                //    //$ele.on('focus', function (e) {
                //    //    var data = me.o_field_getData($(e.target));
                //    //
                //    //    me.o_validate();
                //    //});
                //}
            },
            i_init: function (data) {
                var me = this;
                var newDataItems = [];
                //元素与数据初始化
                $(me.o_fields).each(function (i, n) {
                    var $field = me[n.key];
                    me.i_initInnerEvent($field);
                    var fieldData = me.dataDic[n.value.__guid];
                    var config = $field && $field.length > 0 && $field.attr('data-config') && me.i_parseJSON($field.attr('data-config')) || {};
                    config.validateOptions = me.i_inject_validate($field);
                    $.extend(config, fieldData);
                    me.dataDic[n.value.__guid] = config;
                    data.dataItems[config.__index] = config;
                });
                me.o_setValues(data.dataItems, me.i_silent, true);
            },
            i_init_FieldConvert: function ($ele) {//控件转换  比如日期 类型 数字类型
                this.i_getFunctionPipe('i_convertFieldWhere', 'Default')[0]($ele);
            },
            i_toHighOrderFunction: function (func, context, args) {
                //转换为高阶函数
                return function () {
                    var newArgs = args.concat([].slice.apply(arguments));
                    return func.apply(context, newArgs);
                }
            },
            i_parseJSON: function (str) {
                var me = this;
                var data = {};
                try {
                    if (str) {
                        str = str.replace(/[']/g, '"');
                        data = $.parseJSON(str);
                    }
                } catch (e) {
                    console.warn(e);
                }
                return data;
            },
            i_dataItems: {},
            i_selector: '',//模板选择器
            o_fields: [{key: '', value: {}}],
            o_validate: function () {
                var me = this;
                me.errors = [];
                me.o_eachFields(function ($ele, data) {
                    if ($ele && $ele.length > 0 && data.visible !== false && $ele.is(':visible')) { //可见且dom存在
                        var tempErrors = me.o_validateField($ele);
                        if (tempErrors && tempErrors.length > 0) {
                            me.errors = me.errors.concat(tempErrors);
                        }
                    }
                });
                return me.errors.length == 0;
            },
            o_getValidateErrors: function () {
                var me = this;
                //获取验证的错误信息
                return me.errors;
            },
            o_validateField: function ($ele) {
                if (!$ele || $ele.length == 0) {
                    return null;
                }
                var me = this;
                var data = me.o_field_getData($ele);
                var options = data.validateOptions;
                var value = me.o_getFieldValue(null, $ele);
                var wrapper = me.o_field_getWrapper($ele);
                var errors = [];
                var defaultAction = me['i_checkFieldForDefault'];
                if (options) {
                    for (var i in options) {
                        var error = null;
                        var option = options[i];
                        //allowHidden允许隐藏状态的控件参与验证 为false为不允许
                        if (option.allowHidden === false && data.visible === false) {
                            continue;
                        }
                        if (options.hasOwnProperty(i) && option.enable) {
                            var action = me[me.i_toWord('i_checkFieldFor', i)];
                            if (!action) {
                                action = defaultAction;
                            }
                            error = action.call(me, i, value, option, $ele, wrapper);
                            if (error) {
                                errors.push(error);
                            }
                        }
                    }
                }
                return errors;
            },
            i_checkFieldForRequired: function (name, value, option, $ele, wrapper) {
                var me = this;
                var error = me.i_checkError(name, value, option, $ele, function (value, option, $ele) {
                    return !value;
                });
                return error;
            }
            ,
            i_checkFieldForMaxlength: function (name, value, option, $ele, wrapper) {
                var me = this;
                var error = me.i_checkError(name, value, option, $ele, function (value, option, $ele) {
                    return value.length > option.value;

                });
                return error;
            }
            ,

            i_checkFieldForDefault: function (name, value, option, $ele, wrapper) {
                return null;
            }
            ,
            i_toWord: function (prefix, value) {//驼峰命名法
                return prefix + value.substr(0, 1).toUpperCase() + value.substr(1);
            },
            i_checkError: function (validateName, value, option, $ele, callback) {
                var me = this;
                var error = null;
                if (callback && callback(value, option, $ele)) {
                    error = {field: $ele, name: validateName, option: option};
                }
                if (option.handler) { //错误代理
                    var result = option.handler.call(me, error, value, option, $ele);
                    if (result !== undefined) {
                        error = result;
                    }
                }

                me.trigger('validateError', value, error, option, $ele, me);
                error ? me.o_addValidateError($ele, option.message, validateName) : me.o_removeValidateError($ele, validateName);
                return error;
            },
            o_addValidateError: function ($ele, message, validateName) {
                var me = this;
                var wrapper = me.o_field_getWrapper($ele);
                wrapper.addClass('wrapper-validate-error');
                $ele.addClass('validate-error');
                wrapper.find('.error').addClass(validateName + '-error').show().html(message);
            },
            o_removeValidateError: function ($ele, validateName) {
                var me = this;
                var wrapper = me.o_field_getWrapper($ele);
                wrapper.find('.error').removeClass(validateName + '-error').hide().html('');
                wrapper.removeClass('wrapper-validate-error');
                $ele.removeClass('validate-error');
            },
            o_getValues: function (callback) {
                var me = this;
                var result = {};
                me.o_eachFields(function ($ele, data) {
                    result[data.name] = me.o_getFieldValue(data.name);
                    callback && callback($ele, data, result);
                });
                return result;
            },
            o_getFieldData: function (name) {
                var me = this;
                return me.dataDic[name];
            },
            o_getFieldValue: function (name, $ele) {
                var me = this;
                var data = null;
                var $ele = $ele || me.o_findField(function ($ele, _data) {
                        if (_data && _data.name == name) {
                            data = _data;
                            return true;
                        }
                    });
                if ((!$ele || $ele.length == 0) && data) {//无DOM数据
                    return data.value;
                }
                var value = "";
                if ($ele) {
                    value = me.i_getFunctionPipe('i_getValueWhere', 'Default')[0]($ele);
                }
                return value;
            },
            i_getFunctionPipe: function (actionPrefix, defaultName) {//actionPrefix方法前缀名   //默认名defaultName
                //将方法转换成管道流式调用
                var me = this;
                if (me['__highFunctions' + '_' + actionPrefix]) {
                    return me['__highFunctions' + '_' + actionPrefix];
                }
                var args = [].slice.call(arguments, 2);
                defaultName = defaultName || 'Default';
                var actions = [];
                for (var i in me) {
                    var i = i.toString();
                    if (i.indexOf(actionPrefix) == 0 && i.indexOf(defaultName) == -1) {
                        actions.push(me[i]);
                    }
                }
                var defaultAction = me[actionPrefix + defaultName] || function () {
                    };
                var highFunctions = [];
                for (var j = actions.length; j >= 0; j--) {
                    if (j == actions.length) {
                        highFunctions.push(me.i_toHighOrderFunction(defaultAction, me, args));
                    } else {
                        highFunctions.push(me.i_toHighOrderFunction(actions[j], me, [highFunctions[highFunctions.length - 1]].concat(args)));
                    }
                }
                return me['__highFunctions_' + actionPrefix] = highFunctions.reverse();//数组反转入口放在第一个
            },
            i_getValueWhereRadioOrCheckBox: function (next, $ele) {
                var me = this;
                var value = null;
                if ($ele.is('input[type=radio]') || $ele.is('input[type=checkbox]')) {
                    var arr = [];
                    $($ele.filter(':checked')).each(function (i, n) {
                        arr.push($(n).val());
                    });
                    value = arr.join(',');
                    return value;
                }
                return next($ele);
            }
            ,
            i_getValueWhereInputFile: function (next, $ele) {
                var me = this;
                var value = null;
                if ($ele.is('input[type=file]')) {
                    var index = $ele.attr(me.i_attrName).indexOf('_file');
                    if (index > 0) {
                        var hiddenName = name.substring(0, index);
                        var hiddenField = me.o_findField(function ($ele, data) {
                            return data.name == hiddenName;
                        });
                        if (hiddenField) {
                            value = me.o_getFieldValue(hiddenName);
                        }
                        return value;
                    }
                    else {
                        console.warn(name + '文件标签必须data-name以_file结尾，且拥有一个对应的隐藏域data-name值为_file之前的部分');
                    }
                }
                return next($ele);
            }
            ,
            i_getValueWhereDateControl: function (next, $ele) {
                var me = this;
                var value = null;
                if ($ele.is('[datecontrol]')) {
                    if (!$ele.val()) {
                        value = '';
                    } else {
                        try {
                            var configStr = $ele.attr('datecontrol');
                            var config = configStr && me.i_parseJSON(configStr) || {};
                            if (config.type == '1') {//0开始时间 1为结束时间
                                value = new Date($ele.val() + " 23:59:59").getTime();
                            } else {
                                value = new Date($ele.val() + " 00:00:00").getTime();
                            }
                        } catch (e) {
                            value = '';
                        }
                    }
                    return value;
                }
                return next($ele);
            }
            ,
            i_getValueWhereTextField: function (next, $ele) {
                var me = this;
                var value = null;
                if ($ele.is(me.i_textFieldSelector)) {
                    value = $ele.text();
                    return value;
                }
                return next($ele);
            }
            ,
            i_getValueWhereDefault: function ($ele) {
                return $ele.val();
            },
            o_setValues: function (value, silent, first) {
                var me = this;
                if (value) {
                    var isArray = $.isArray(value);
                    for (var i in value) {
                        if ((value[i] !== null && value[i] !== undefined) && value[i].__enabled === false) {
                            break;
                        }
                        var data = null;
                        var field = null;
                        var valueObj = null;
                        if (isArray) { //数组传递复杂数据
                            me.o_setValue(value[i], silent, first);
                        } else {//对象传递简单值
                            me.o_setValue({name: i, value: value[i]});
                        }

                    }
                }
            },
            o_setValue: function (obj, silent, first) {//silent不触发事件
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

                if ($field && $field.length > 0) {
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
                if (silent !== true) {
                    me.trigger('setValue', $field, data);
                    data.trigger('setValue', $field, data);
                }
                if (first) {
                    data.__inited = true;
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
                    value = me.i_getFunctionPipe('i_setValueWhere', 'Default')[0]($ele, value);
                    //!silent && $ele.change();
                    data.value = value;
                    if (silent !== true) {
                        me.trigger('setFieldValue', $ele, value, data, me);
                        data.trigger('setFieldValue', $ele, value, data, me);
                    }
                }
            },
            i_setValueWhereInputRadio: function (next, $ele, value) {
                var me = this;
                //考虑复选框情况
                if ($ele.is('input[type=radio]') || $ele.is('input[type=checkbox]')) {
                    if (typeof(value) == 'boolean') {
                        $ele.prop('checked', value);
                        //!silent && $ele.change();
                    } else {
                        var items = $.isArray(value) ? value : value.split(',');
                        $(items).each(function (i, n) {
                            $ele.filter('[value=' + n + ']').attr('data-checked', '1');
                        });
                        var excepts = $ele.filter(':not([data-checked])').prop('checked', false).attr('checked', false);
                        //!silent && excepts.change();
                        var wants = $ele.filter('[data-checked]').prop('checked', true).attr('checked', true).removeAttr('data-checked');
                        //!silent && wants.change();
                    }
                    return value;
                }
                return next($ele, value);
            },
            i_setValueWhereDateControl: function (next, $ele, value) {
                var me = this;
                if ($ele.is('[datecontrol]')) {
                    if (typeof(value) == 'number') {
                        var configStr = $ele.attr('datecontrol');
                        var config = configStr && me.i_parseJSON(configStr) || {};
                        var format = config.format || "yyyy/MM/dd";
                        var str = new Date(value)._format(format);
                        if ($ele.is('input')) {
                            $ele.val(str);
                        } else {
                            $ele.text(str)
                        }
                    } else {
                        value = value || '';
                        if ($ele.is('input')) {
                            $ele.val(value);
                        } else {
                            $ele.text(value)
                        }
                    }

                    var data = me.o_field_getData($ele);
                    if (data.maxDate) {
                        $ele.attr('maxdate', new Date(data.maxDate)._format(format));
                    }
                    if (data.minDate) {
                        $ele.attr('mindate', new Date(data.minDate)._format(format));
                    }
                    me.i_convertFieldWhereDatetime(null, $ele);
                    return value;
                }
                return next($ele, value);
            },
            i_setValueWhereTextField: function (next, $ele, value) {
                var me = this;
                if ($ele.is(me.i_textFieldSelector)) {
                    $ele.text(value);
                    return value;
                }
                return next($ele, value);
            },
            i_setValueWhereDefault: function ($ele, value) {
                if ($ele.is('select,input,textarea')) {
                    $ele.val(value);
                } else {
                    $ele.html(value);
                }
                return value;
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
                for (var i in me.dataDic) {
                    if (me.dataDic.hasOwnProperty(i)) {
                        callback && callback(me.o_data_getField(me.dataDic[i]), me.dataDic[i]);
                    }
                }
            }
            ,
            o_field_getWrapper: function ($ele) {
                return $ele.is('.field') ? $ele : $ele.parents('.field').length > 0 ? $ele.parents('.field:first') : $ele;
            }
            ,
            o_setFieldVisible: function ($ele, value) {
                var me = this;
                if (value != undefined) {
                    $ele.each(function(i,n){
                    var wrapper = me.o_field_getWrapper($(n));
                    if (!value) {
                        wrapper.hide();
                    } else {
                        wrapper.show();
                    }
                    me.o_field_getData($(n)).visible = value;
                    })
                }
            }
            ,
            o_setFieldReadonly: function ($ele, value) {
                var me = this;
                value = value === undefined ? false : value;
                this.o_field_getData($ele).readonly = value;
                if (!$ele.is('.field_text')) {
                    if (value) {
                        $ele.addClass('readonly', 'readonly').attr('readonly', 'readonly').attr('disabled', 'disabled');
                    } else {
                        $ele.removeClass('readonly').removeAttr('readonly').removeAttr('disabled');
                    }
                }
                return $ele;
            }
            ,
            o_field_getData: function ($ele) {
                var me = this;
                return me.dataDic[$ele.attr(me.i_attrName)];
            },
            o_data_getField: function (data) {
                var me = this;
                return data && me.$(me.i_getSelectorByName(data.name)) || undefined;
            }
        }
    );
    module.exports.PageDataClass = DataItem;
    module.exports.PageClass = PageClass;
})
;









