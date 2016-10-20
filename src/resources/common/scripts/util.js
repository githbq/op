/**
 *   公用工具类函数
 *   需要指定常量
 *
 *
 *   IBSS.API_PATH           // 后端数据请求路径             
 *   IBSS.COMMON_PATH        // commom模块前端路径
 */
;
(function($, _) {

    var win = this,
        doc = win.document,
        IBSS = win.IBSS,
        TIME_OUT = 300000; //请求超时时间


    var $body = $('body');

    //
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
    // 例子： 
    // (new Date())._format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
    // (new Date())._format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    //
    Date.prototype._format = function(fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "H+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    /********
     *  兼容array forEach
     *  array.forEach(function(value,index,array){
     *
     *  })
     *
     */
    if (typeof Array.prototype.forEach != "function") {
        Array.prototype.forEach = function(fn, context) {
            for (var k = 0, length = this.length; k < length; k++) {
                if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(this, k)) {
                    fn.call(context, this[k], k, this);
                }
            }
        };
    }

    /**
     *@desc 全局事件
     *for checkbox
     */
    $(doc).on('click', '.g-ck', function(e) {
        e.stopPropagation();
        $(this).toggleClass('g-ck-active');
    });

    /////////////////////
    //     预览图片    //
    /////////////////////
    var $preview = $('.g-preview');
    $preview.find('.preview-close').on('click', function() {
        $preview.find('.preview-img img').attr('src', '');
        $preview.hide();
    });

    //获取token信息
    var _token = $('#key').val();

    /**
     *@description工具类对象
     */
    var util = {

        /**
         * @desc confirm
         * @param {Object}
         * {
             el: '',
             title: '',
             msg: '',
             btnText: '',
             fn: ''
           }
         */
        showConfirm: function(opt) {
            var $el = $('.g-confirm');
            opt = _.extend({
                el: null,
                title: '提示',
                msg: '',
                btnText: '确定',
                btnfn: null,
                closefn: null
            }, opt || {});
            $('h3', $el).html(opt.title);
            $('.con', $el).html(opt.msg);
            $('.btn', $el).html(opt.btnText);
            if (opt.el.length > 0) {
                var offset = opt.el.offset();
                $el.css({
                    left: offset.left - ($el.width() / 2) + opt.el.width() / 2,
                    top: offset.top + opt.el.height() + 10
                });
                $('.arrow', $el).show();
            } else {
                var left = ($(win).width() - $el.width()) / 2;
                var top = ($(win).height() - $el.height()) / 2 + $(doc).scrollTop() - 35;
                if (top < 0) {
                    _top = 0;
                }
                $el.css({
                    left: left,
                    top: top
                });
                $('.arrow', $el).hide();
            }
            $el.show();
            $('.btn', $el).one('click', function() {
                opt.btnfn && opt.btnfn();
                $el.hide();
            });
            $('.close', $el).one('click', function() {
                opt.closefn && opt.closefn();
                $el.hide();
            });
            $(doc).one('click', function(e) {
                if ($(e.target).closest('.g-confirm').length == 0) {
                    opt.closefn && opt.closefn();
                    $el.hide();
                }
            });
        },

        /**
         * @desc 显示toast 
         *
         */
        showToast: function(msg) {
            var $toast = $('.g-toast'),
                timer = $toast[0].timer;

            $toast.removeClass('amt-toastin')
                .html(msg)
                .addClass('amt-toastin')
                .show();

            if (timer) {
                win.clearTimeout(timer);
            }
            $toast[0].timer = win.setTimeout(function() {
                $toast.fadeOut();
            }, 4000);
        },

        /**
         * 显示提示
         *
         */
        tipTemplate: $('#g-tip').html(),
        showTip: function(msg) {
            var me = this;

            var $tip = $(me.tipTemplate);
            var $content = $tip.find('p').text(msg);

            $body.append($tip);
            setTimeout(function() {
                $tip.fadeOut('fast', function() {
                    $tip.remove();
                })
            }, 4000)
        },

        //预览图片
        preview: function(src) {
            $preview.show();
            $preview.find('.preview-img').css({
                'lineHeight': $preview.height() + 'px'
            });
            $preview.find('.preview-img img').attr('src', src);
        },

        // 获取当前页面的hash
        getHash: function() {
            var href = location.href,
                hash = location.hash;

            if ('pushState' in history) {
                hash = href.replace(location.protocol + '//' + location.host + '/', '#');
            }
            return (hash === '#') ? '' : hash;
        },

        /**
         * @desc 点亮导航
         * 点亮当前元素下 所有连接为当前hash的元素
         * @param {jquery}
         */
        lightNav: function($el) {
            var $el = $el || $('nav'),
                hash = location.hash;

            //清除导航内 所有<li>元素的激活状态
            $el.find('li').each(function() {
                $(this).removeClass('active');
            });

            $el.find('li a').each(function() {
                var $this = $(this),
                    href = $this.attr('href'),
                    aHash = href.slice(href.indexOf('#'));

                //排除href为空的情况
                if (aHash.length <= 0) return;

                var $lis;
                //if( hash.indexOf(aHash) >= 0 ){
                if (hash == aHash) {
                    $lis = $this.parents('li');
                    $lis.addClass('active');
                }
            });
        },

        /**
         * @desc重新封装ajax
         * @param {Object} opt
         *
         */

        ajax: function(opt) {
            var me = this;

            opt = $.extend({
                keepLoading: true,
                hideLoading: true
            }, opt);

            var data = _.extend({
                '_t': new Date().getTime()
            }, opt.data || {});

            return $.ajax({
                type: opt.type || 'GET',
                url: opt.url || '',
                data: data,
                dataType: opt.dataType,
                timeout: TIME_OUT,
                success: function(data, status, xhr) {
                    opt.success && opt.success(data, status, xhr);
                },
                error: function() {
                    me.showToast('网络请求错误！');
                    opt.error && opt.error();
                }
            });
        },

        /**
         *
         * @desc数据请求接口
         * @param {Object} opt
         * @param bool     mask true时显示遮罩 false时不显示
         */

        api: function(opt, mask) {
            var that = this,
                beforeSend = opt.beforeSend,
                success = opt.success,
                complete = opt.complete,
                error = opt.error;

            //默认设置
            opt = _.extend({
                type: 'post',
                cache: false,
                timeout: TIME_OUT,
                dataType: 'json',
                button: {
                    'text': '提交中',
                    'el': null
                }
            }, opt || {});

            //添加token信息
            opt.data = opt.data || {};
            opt.data.token = _token;

            //
            // 按钮原始文本
            var btntext;
            if (opt.button.el) {
                btntext = opt.button.el.text();
            }


            /**
             *
             * 如果 url是 ~ 开头 则从根路径请求
             * 否则 从全局配置的api路径请求
             */
            if (opt.url.indexOf('~') == 0) {
                opt.url = opt.url.slice(1);
            } else {
                opt.url = IBSS.API_PATH + opt.url;
            }

            opt.beforeSend = function() {
                if (mask == true) {
                    util.showGlobalLoading();
                }
                opt.button.el && opt.button.el.attr('disabled', 'disabled').text(opt.button.text);
                return beforeSend && beforeSend.apply(this, arguments);
            };

            opt.success = function(data, status, xhr) {
                if (data.login == false) {
                    location.href = "/login?from=" + location.pathname;
                    return;
                }
                if (!data.success) {

                    //截取20位
                    if (data.message && data.message.length > 30) {
                        data.message = data.message.slice(0, 30);
                    }

                    that.showToast('请求错误  ' + data.message);
                }
                return success && success.apply(this, arguments);
            };
            opt.error = function(info) {
                if (info && info.statusText == "abort") return;
                that.showToast('网络错误' + '(' + info.status + ')' + '!');
                return error && error.apply(this);
            };
            opt.complete = function() {
                if (mask == true) {
                    util.hideGlobalLoading();
                }
                opt.button.el && opt.button.el.removeAttr('disabled').text(btntext);
                return complete && complete.apply(this, arguments);
            }
            return $.ajax(opt);
        },
        initIframe: function() {
            if ($('.formClass').length > 0) {
                $('.formClass').remove();
            }

            $('body').append(
                "<form  class='formClass' action=" + "/hda/bigactivity/mission/download?id=" + IBSS.model + "   " + "method='POST' enctype='multipart/form-data'  id='formdown' style='display:none;'>" +
                "<button type='submit' id='submit'></button>" +
                "</form>"
            );
        },

        $gloading: $('.g-loading'),

        /**
         *@ 显示全局遮罩
         */
        showGlobalLoading: function() {
            this.$gloading.show();
        },

        /**
         *@ 隐藏全局遮罩
         */
        hideGlobalLoading: function() {
            this.$gloading.hide();
        },

        /**
         * @desc 获取复选框的值
         * @param {Jquery}
         * @return {Array}
         */
        getCkVal: function(el) {
            if ($(el).hasClass('g-ck-b')) {
                var result = [];
                $('.g-ck-active', $(el)).each(function() {
                    result.push($(this).attr('data-val'));
                });
                return result;
            } else {
                return null;
            }
        },

        /**
         * @desc 设置复选框的值
         * @param {Jquery}
         * @param {Array} 需要重的值
         * @return {Array}
         */
        setCkVal: function(el, vals) {
            if (!$(el).hasClass('g-ck-b') || !_.isArray(vals)) {
                return;
            }
            $('.g-ck', $(el)).each(function() {
                var val = $(this).attr('data-val');
                if (_.contains(vals, val)) {
                    $(this).addClass('g-ck-active');
                }
            });
        },

        cutBadStr: function(text) {
            if (!text) return '';
            return text.replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, "'");
        },

        /**
         * @desc格式化时间对象
         * @param {Object} Object 时间对象
         * @param {String} String 时间格式 YYYY-MM-dd HH:mm:ss
         *
         */
        formatDate: function(ticks, f) {
            var date = new Date(ticks);
            var F = f.replace(/\W/g, ',').split(','),
                format = ['YYYY', 'MM', 'dd', 'HH', 'mm', 'ss', 'ww'];
            date = {
                Y: date.getFullYear(),
                M: date.getMonth() + 1,
                d: date.getDate(),
                H: date.getHours(),
                m: date.getMinutes(),
                s: date.getSeconds(),
                w: date.getDay()
            };

            for (var i = 0, num = F.length; i < num; i++) {
                var o = F[i];
                for (var j = 0; j < 7; j++) {
                    var S = format[j].slice(-1);
                    if (o.indexOf(S) != -1) {
                        if (S == 'w' && date[S] == 0) {
                            date[S] = 7;
                        }
                        if (o.indexOf(format[j]) != -1) {
                            f = f.replace(RegExp(format[j], 'g'), this.addZero(date[S]));
                        } else {
                            f = f.replace(RegExp(format[j].slice(format[j].length / 2), 'g'), date[S]);
                        }
                    }
                }
            }
            return f;
        },


        /**
         * @desc 数字补零
         * @param {Number}  数字
         * @return {Number} 补零位数
         *
         */
        addZero: function(num, n) {
            if (!n) n = 2;
            return Array(Math.abs(('' + num).length - (n + 1))).join(0) + num;
        },

        _convertStringToUnicodeCodePoints: function(str) {
            var surrogate1st = 0,
                unicodeCodes = [],
                i = 0,
                l = str.length;

            for (; i < l; i++) {
                var utf16Code = str.charCodeAt(i);
                if (surrogate1st != 0) {
                    if (utf16Code >= 0xDC00 && utf16Code <= 0xDFFF) {
                        var surrogate2nd = utf16Code,
                            unicodeCode = (surrogate1st - 0xD800) * (1 << 10) + (1 << 16) + (surrogate2nd - 0xDC00);
                        unicodeCodes.push(unicodeCode);
                    }
                    surrogate1st = 0;
                } else if (utf16Code >= 0xD800 && utf16Code <= 0xDBFF) {
                    surrogate1st = utf16Code;
                } else {
                    unicodeCodes.push(utf16Code);
                }
            }
            return unicodeCodes;
        },
        //编码转换
        _escapeToUtf32: function(str) {
            var escaped = [],
                unicodeCodes = util._convertStringToUnicodeCodePoints(str),
                i = 0,
                l = unicodeCodes.length,
                hex;

            for (; i < l; i++) {
                hex = unicodeCodes[i].toString(16);
                if (hex != 'fe0f' && hex != '20e3') {
                    escaped.push('0000'.substr(hex.length) + hex);
                }
            }
            return escaped.join('_');
        },

        /**
         * 文件大小格式化
         * @param  {[type]} byteSize [description]
         * @return {[type]}          [description]
         */
        getFileSize: function(byteSize) {
            var v = 0,
                unit = "BYTE";
            if (byteSize > 1073741824) { //1G=1073741824 BYTE
                v = (byteSize / 1073741824).toFixed(0);
                unit = "GB";
            } else if (byteSize > 1048576) { //1M=1048576 BYTE
                v = (byteSize / 1048576).toFixed(0);
                unit = "MB";
            } else if (byteSize > 1024) {
                v = (byteSize / 1024).toFixed(0);
                unit = "KB";
            } else {
                v = byteSize;
                unit = "B";
            }
            return v + unit;
        },

        replaceLink: function(content) {
            content = content || '';
            var HTTP_REG = new RegExp("((http[s]?|ftp)://|www\\.)[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?", "gi");
            return content.replace(HTTP_REG, function(c) {
                return '<a target="_blank" href="' + c + '">' + c + '</a>';
            });
        },

        ////////////////
        //
        //根据当前时间输出易读的时间
        ////////////////
        translateTime: function(time) {
            if (!time) {
                throw ('time 不能为空');
                return;
            }
            var now = new Date();
            var datetime = new Date(time);

            var str,
                timeSpace;

            if (now.getFullYear() != datetime.getFullYear()) {

                str = "yyyy年MM月dd日 hh:mm";
            } else {

                if (now.getMonth() != datetime.getMonth()) {

                    str = "MM月dd日 hh:mm";
                } else {

                    if (now.getDate() != datetime.getDate()) {

                        now.setHours(0, 0, 0, 0);
                        datetime.setHours(0, 0, 0, 0);
                        timeSpace = now.getTime() - datetime.getTime();
                        if (timeSpace <= (1000 * 60 * 60 * 24)) {
                            return ("昨天 " + new Date(time)._format("hh:mm"));
                        } else if ((timeSpace <= (1000 * 60 * 60 * 42))) {
                            return ("前天 " + new Date(time)._format("hh:mm"));
                        } else {
                            str = "MM月dd日 hh:mm";
                        }
                    } else {

                        str = "hh:mm";
                    }
                }
            }

            return new Date(time)._format(str);
        },

        //////////////
        //
        // 应用内跳转MAP
        /////////////
        getInAppName: function(key) {

            var MAP = {
                'tyzh': '体验帐号',
                'bsxt': '报数系统',
                'yqts': '邀请同事',
                'grzl': '个人资料',
                'xtsz': '系统设置',
                'sccwrz': '立即上传'
            };

            if (key) {
                return MAP[key];
            } else {
                return MAP;
            }
        },

        ////////////
        //
        //根据权限控制相关元素显示隐藏
        //////////////
        filterFunc: function() {

        },

        /**
         * 将textarea里的内容转换
         * 换行符替换为,并过滤空行
         */
        transArea: function(str) {
            var nstr = str.replace(/\n/g, ',').replace(/\s/g, '').replace(/[,]+/g, ',');
            return nstr;
        },

        /**
         * html 转义
         */
        html_encode: function(str) {
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&/g, "&gt;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            s = s.replace(/\n/g, "<br>");
            return s;
        },

        /**
         * html 反转义
         */
        html_decode: function(str) {
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            s = s.replace(/<br>/g, "\n");
            return s;
        },

        /**
         *
         * 获取枚举值
         * 如果已经获取到 直接取缓存
         */
        getEnums: function(name, callback) {
            IBSS.enums = IBSS.enums || {};

            if (IBSS.enums[name]) {
                callback && callback(IBSS.enums[name]);
                return;
            }

            var me = this,
                opt = {
                    url: '~/op/api/enums/getlist',
                    data: {
                        name: name
                    },
                    type: 'POST',
                    cache: false,
                    timeout: TIME_OUT,
                    dataType: 'json',
                    success: function(data) {
                        if (data.success) {
                            IBSS.enums[name] = data;
                            callback && callback(data);
                        }
                    }
                };
            return me.api(opt, false);
        },

        /**
         *
         * 获取行业 遍历为树状信息
         * 并赋值给select  for 实时3;
         */
        getClassIndustry: function(array, callback) {
            var me = this;
            //存储最终数据
            var INMAP = {};
            //存储缓存数据
            var items = {};
            //生成dom结构
            var str1 = "<option value=''>一级行业(全部)</option>";

            var str2 = "<option value=''>二级行业(全部)</option>";

            var str3 = "<option value=''>三级行业(全部)</option>";

            util.getEnums('INDUSTRY_NEW', function(data) {

                //第一次遍历缓存所有数据
                data.value.model.forEach(function(item, index) {
                    item.children = {};
                    items[item.value] = item;
                });

                //第二次遍历生成缓存map
                data.value.model.forEach(function(item, index) {
                    getNode(item.value);
                });

                var copyData = JSON.parse(JSON.stringify(INMAP)); //深拷贝一个对象;

                console.log(copyData);

                for (var key in copyData) {

                    item1 = copyData[key]; //分別获得三个级别的下拉框的选项;

                    str1 += ('<option value="' + item1.value + '" title="' + item1.text + '">' + item1.text + '</option>');
                }

                array[0].html(str1);

                array[1].html(str2);

                array[2].html(str3);


                array[0].change(function() { //绑定change事件，添加联动效果;

                    var str = "<option value=''>二级行业(全部)</option>";

                    if ($(this).val() != "") {

                        array[1].html("");
                        array[2].html("<option value=''>三级行业(全部)</option>");

                        if (!util.isOwnEmpty(copyData[$(this).val()].children)) {

                            for (var key in copyData[$(this).val()].children) {

                                item2 = copyData[$(this).val()].children[key];

                                str += ('<option value="' + item2.value + '" title="' + item2.text + '">' + item2.text + '</option>');

                            }
                        }

                        array[1].html(str);
                    }
                });

                array[1].change(function() { //绑定change事件，添加联动效果;

                    var str = "<option value=''>三级行业(全部)</option>";

                    if ($(this).val() != "") {

                        array[2].html("");

                        if (!util.isOwnEmpty(copyData[array[0].val()].children)) {

                            for (var key in copyData[array[0].val()].children) {
                                if (key == $(this).val()) {

                                    object = copyData[array[0].val()].children[key];

                                    if (!util.isOwnEmpty(object.children)) {

                                        for (var key in object.children) {

                                            item3 = object.children[key];

                                            str += ('<option value="' + item3.value + '" title="' + item3.text + '">' + item3.text + '</option>');
                                        }
                                    }

                                }
                            }
                        }

                        array[2].html(str);
                    }
                });
                callback && callback(data);
            })

            // 从无生成一个node 
            // 并返回node的详细信息
            // 如果node有父节点则插入父节点的children节点
            function getNode(value) {

                //如果有父节点 则挂载在父节点上
                if (items[value].parentValue && items[value].parentValue != '0') {
                    var parent = items[items[value].parentValue];
                    parent.children[value] = items[value];
                    return items[value];

                    //如果没父节点 则挂载在顶级对象上
                } else {

                    INMAP[value] = INMAP[value] || items[value];
                    return INMAP[value];
                }
            }

            function generateDom(node, zindex) {

                var item;
                var mstr = "|-";
                for (var i = 1; i <= zindex; i++) {
                    mstr = "&nbsp;&nbsp;&nbsp;" + mstr;
                }

                //console.log( mstr );
                for (var key in node) {

                    item = node[key];
                    str = str + '<option value="' + item.value + '" title="' + item.text + '">' + mstr + item.text + '</option>';
                    generateDom(item.children, zindex + 1);
                }
            }
        },
        /**
         *
         * 获取行业 遍历为树状信息
         * 并赋值给select
         */
        getIndustry: function($select, callback) {
            var me = this;


            //存储最终数据
            var INMAP = {};
            //存储缓存数据
            var items = {};
            //生成dom结构
            var str = "<option value=''>全部</option>";

            util.getEnums('INDUSTRY', function(data) {

                //第一次遍历缓存所有数据
                data.value.model.forEach(function(item, index) {
                    item.children = {};
                    items[item.value] = item;
                });

                //第二次遍历生成缓存map
                data.value.model.forEach(function(item, index) {
                    getNode(item.value);
                });

                console.log(items);
                console.log(INMAP);

                generateDom(INMAP, 0);
                $select.html(str);

                callback && callback(data);
            })


            // 从无生成一个node 
            // 并返回node的详细信息
            // 如果node有父节点则插入父节点的children节点
            function getNode(value) {

                //如果有父节点 则挂载在父节点上
                if (items[value].parentValue && items[value].parentValue != '0') {

                    var parent = items[items[value].parentValue];
                    parent.children[value] = items[value];
                    return items[value];

                    //如果没父节点 则挂载在顶级对象上
                } else {

                    INMAP[value] = INMAP[value] || items[value];
                    return INMAP[value];
                }
            }

            function generateDom(node, zindex) {
                var item;
                var mstr = "|-";
                for (var i = 1; i <= zindex; i++) {
                    mstr = "&nbsp;&nbsp;&nbsp;" + mstr;
                }

                //console.log( mstr );
                for (var key in node) {

                    item = node[key];
                    str = str + '<option value="' + item.value + '" title="' + item.text + '">' + mstr + item.text + '</option>';
                    generateDom(item.children, zindex + 1);
                }
            }
        },

        isOwnEmpty: function(obj) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    return false;
                }
            }
            return true;
        },
        /**
         *
         * 根据value
         * 获取相应enmus
         */
        findEnumsText: function(name, value) {

            var text = '';
            if (IBSS.enums[name]) {
                for (var i = 0; i < IBSS.enums[name]['model'].length; i++) {
                    if (IBSS.enums[name]['model'][i]['value'] == value) {
                        text = IBSS.enums[name]['model'][i]['text'];
                        break;
                    }
                }
            }
            return text;
        },

        /***********************
         *
         *重置select的值
         * @param $select
         * @param array [{'name':'XXX','value':'XXX'},{'name':'XXX','value':'XXX'},{'name':'XXX','value':'XXX'}] 或
         *              ['XXX','XXX','XXX']
         ***********************/
        resetSelect: function($select, array, selectvalue) {
            var optionStr = '';

            if (array.length <= 0) return;

            for (var i = 0; i < array.length; i++) {
                if (typeof array[i] == 'object') {
                    optionStr = optionStr + '<option value="' + array[i]['value'] + '">' + array[i]['name'] + '</option>'
                } else {
                    optionStr = optionStr + '<option value="' + array[i] + '">' + array[i] + '</option>'
                }
            }

            $select.html(optionStr);

            if (selectvalue) {
                $select.val(selectvalue);
            } else {
                $select[0].options[0].selected = true
            }
            //todo 默认选中第一个 并触发事件
            $select.trigger('change');
        },

        /**
         * 获取枚举值
         * 并重置入select元素内
         * @param name     {string}    枚举名称
         * @param $select  {jQuery}    select dom 元素
         * @param callback {function}  获取成功后的回调函数
         */
        getEnumsSelect: function(name, $select, callback) {

            var statusList = [{
                'name': '全部',
                'value': ''
            }];

            util.getEnums(name, function(data) {
                if (data.success) {

                    data.value.model.forEach(function(item, index) {
                        statusList.push({
                            'name': item.text,
                            'value': item.value
                        });
                    });


                    util.resetSelect($select, statusList);
                }

                callback && callback(data);
            })
        },

        /*
         *  计算日期
         *  @param AddDayCount {number}
         *  根据输入的 number 计算返回的日期  
         *  如 -1 返回昨天的日期
         */
        getDateStr: function(AddDayCount) {

            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1; //获取当前月份的日期
            var d = dd.getDate();
            return y + "/" + m + "/" + d;
        },

        /*
         *  判断一个对象属性是否为空
         *  @param obj {object}
         */
        isEmptyObject: function(obj) {
            var isEmpty = true;
            for (var key in obj) {
                isEmpty = false;
                break;
            }
            return isEmpty;
        },


        /*
         * input 错误提示
         * @param $input {jQuery}
         */
        warnInput: function($input) {
            $input.css({
                'border': '1px #c81623 solid',
                'box-shadow': '0 0 3px #c81623'
            });
        },

        /*
         * input 取消错误提示
         * @param $input {jQuery}
         */
        unWarnInput: function($input) {
            $input.removeAttr('style');
        },

        /**
         *
         * 各校验正则
         */
        regMap: {
            'phone': /^1\d{10}$/,
            'email': /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        }
    };


    win.util = util;

}(jQuery, _));