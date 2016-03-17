/**
*   公用工具类函数
*   需要指定常量
*
*
*   IBSS.API_PATH           // 后端数据请求路径             
*   IBSS.COMMON_PATH        // commom模块前端路径
*/
;(function($, _){
	
	var win = this,
		doc = win.document,
		IBSS = win.IBSS,
        
        TIME_OUT = 300000;   //请求超时时间



        cookieItems = {
        '004f_004b': {
            id: 'ok',
            name: 'OK'
        },
        '4e0d_597d': {
            id: 'buhao',
            name: '不好'
        },
        '8d5e': {
            id: 'zan',
            name: '赞'
        },
        '62cd_624b': {
            id: 'paishou',
            name: '拍手'
        },
        '8036': {
            id: 'ye',
            name: '耶'
        },
        '63e1_624b': {
            id: 'woshou',
            name: '握手'
        },
        '62dc_6258': {
            id: 'baituo',
            name: '拜托'
        },
        '5fae_7b11': {
            id: 'weixiao',
            name: '微笑'
        },
        '6487_5634': {
            id: 'piezui',
            name: '撇嘴'
        },
        '8272': {
            id: 'se',
            name: '色'
        },
        '53d1_5446': {
            id: 'fadai',
            name: '发呆'
        },
        '5f97_610f': {
            id: 'deyi',
            name: '得意'
        },
        '6d41_6cea': {
            id: 'liulei',
            name: '流泪'
        },
        '5bb3_7f9e': {
            id: 'haixiu',
            name: '害羞'
        },
        '95ed_5634': {
            id: 'bizui',
            name: '闭嘴'
        },
        '7761': {
            id: 'shui',
            name: '睡'
        },
        '5927_54ed': {
            id: 'daku',
            name: '大哭'
        },
        '5c34_5c2c': {
            id: 'ganga',
            name: '尴尬'
        },
        '6124_6012': {
            id: 'fennu',
            name: '愤怒'
        },
        '8c03_76ae': {
            id: 'tiaopi',
            name: '调皮'
        },
        '5472_7259': {
            id: 'ciya',
            name: '呲牙'
        },
        '60ca_8bb6': {
            id: 'jingya',
            name: '惊讶'
        },
        '96be_8fc7': {
            id: 'nanguo',
            name: '难过'
        },
        '9177': {
            id: 'ku',
            name: '酷'
        },
        '51b7_6c57': {
            id: 'lenghan',
            name: '冷汗'
        },
        '6293_72c2': {
            id: 'zhuakuang',
            name: '抓狂'
        },
        '5410': {
            id: 'tu',
            name: '吐'
        },
        '5077_7b11': {
            id: 'touxiao',
            name: '偷笑'
        },
        '6109_5feb': {
            id: 'yukuai',
            name: '愉快'
        },
        '767d_773c': {
            id: 'baiyan',
            name: '白眼'
        },
        '50b2_6162': {
            id: 'aoman',
            name: '傲慢'
        },
        '9965_997f': {
            id: 'jie',
            name: '饥饿'
        },
        '56f0': {
            id: 'kun',
            name: '困'
        },
        '60ca_6050': {
            id: 'jingkong',
            name: '惊恐'
        },
        '6d41_6c57': {
            id: 'liuhan',
            name: '流汗'
        },
        '61a8_7b11': {
            id: 'hanxiao',
            name: '憨笑'
        },
        '60a0_95f2': {
            id: 'youxian',
            name: '悠闲'
        },
        '594b_6597': {
            id: 'fendou',
            name: '奋斗'
        },
        '5492_9a82': {
            id: 'zhouma',
            name: '咒骂'
        },
        '7591_95ee': {
            id: 'yiwen',
            name: '疑问'
        },
        '5618': {
            id: 'xu',
            name: '嘘'
        },
        '6655': {
            id: 'yun',
            name: '晕'
        },
        '75af_4e86': {
            id: 'fengle',
            name: '疯了'
        },
        '8870': {
            id: 'shuai',
            name: '衰'
        },
        '9ab7_9ac5': {
            id: 'kulou',
            name: '骷髅'
        },
        '6572_6253': {
            id: 'qiaoda',
            name: '敲打'
        },
        '518d_89c1': {
            id: 'zaijian',
            name: '再见'
        },
        '64e6_6c57': {
            id: 'cahan',
            name: '擦汗'
        },
        '62a0_9f3b': {
            id: 'koubi',
            name: '抠鼻'
        },
        '9f13_638c': {
            id: 'guzhang',
            name: '鼓掌'
        },
        '7cd7_5927_4e86': {
            id: 'qiudale',
            name: '糗大了'
        },
        '574f_7b11': {
            id: 'huaixiao',
            name: '坏笑'
        },
        '5de6_54fc_54fc': {
            id: 'zuohengheng',
            name: '左哼哼'
        },
        '53f3_54fc_54fc': {
            id: 'youhengheng',
            name: '右哼哼'
        },
        '54c8_6b20': {
            id: 'haqian',
            name: '哈欠'
        },
        '9119_89c6': {
            id: 'bishi',
            name: '鄙视'
        },
        '59d4_5c48': {
            id: 'weiqu',
            name: '委屈'
        },
        '5feb_54ed_4e86': {
            id: 'kuaikule',
            name: '快哭了'
        },
        '9634_9669': {
            id: 'yinxian',
            name: '阴险'
        },
        '4eb2_4eb2': {
            id: 'qinqin',
            name: '亲亲'
        },
        '5413': {
            id: 'xia',
            name: '吓'
        },
        '53ef_601c': {
            id: 'kelian',
            name: '可怜'
        },
        '5927_4fbf': {
            id: 'dabian',
            name: '大便'
        }
        },
        //cookieItems = require('base-cookieitems').items;
	
	$body = $('body');

	//
    // 对Date的扩展，将 Date 转化为指定格式的String
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
	// 例子： 
	// (new Date())._format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	// (new Date())._format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    //
	Date.prototype._format = function (fmt) { //author: meizz 
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
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
        Array.prototype.forEach = function (fn, context) {
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
	$preview.find('.preview-close').on('click',function(){
        $preview.find('.preview-img img').attr('src','');
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
                var left = ($(win).width()- $el.width()) / 2;
                var top =  ($(win).height()- $el.height()) / 2 + $(doc).scrollTop() - 35;
                if (top < 0) { _top = 0; }
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
        showTip: function( msg ){
            var me = this;

            var $tip=$( me.tipTemplate );
            var $content=$tip.find('p').text( msg );

            $body.append($tip);
            setTimeout(function(){
                $tip.fadeOut('fast',function(){
                    $tip.remove();
                })
            },4000)
        },

        //预览图片
        preview: function(src) {
        	$preview.show();
        	$preview.find('.preview-img').css({'lineHeight':$preview.height()+'px'});
            $preview.find('.preview-img img').attr('src',src);
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
            $el.find('li').each(function(){
                $(this).removeClass('active');
            });
            
            $el.find('li a').each(function(){
                var $this = $(this),
                    href = $this.attr('href'),
                    aHash = href.slice( href.indexOf('#') );

                //排除href为空的情况
                if( aHash.length <= 0 ) return;

                var $lis;
                //if( hash.indexOf(aHash) >= 0 ){
                if( hash == aHash ){
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
                url:  opt.url  || '',
                data: data,
                dataType: opt.dataType,
                timeout:   TIME_OUT,
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
             
        api: function( opt,mask ) {
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
				dataType:'json',
                button:{
                    'text': '提交中',
                    'el': null
                }
			},opt||{});

            //添加token信息
            opt.data = opt.data || {};
            opt.data.token = _token;

			//
            // 按钮原始文本
            var btntext;
            if( opt.button.el ){    
                btntext = opt.button.el.text();
            }


            /**
             *
             * 如果 url是 ~ 开头 则从根路径请求
             * 否则 从全局配置的api路径请求
             */
            if( opt.url.indexOf('~') == 0 ){
                opt.url = opt.url.slice(1);
            }else{
                opt.url = IBSS.API_PATH + opt.url;
            }

            opt.beforeSend = function(){
                if( mask == true ){
                    util.showGlobalLoading();
                }
                opt.button.el && opt.button.el.attr('disabled','disabled').text( opt.button.text );
                return beforeSend && beforeSend.apply( this,arguments );
            };

			opt.success = function(data,status,xhr){
				if(data.login == false){
					location.href="/login?from=" + location.pathname;
					return;
				}
				if (!data.success) {

                    //截取20位
                    if( data.message.length > 30 ){
                        data.message = data.message.slice(0,30); 
                    }
					
                    that.showToast('请求错误  ' + data.message);
				}
				return success && success.apply( this,arguments );
			};
            opt.error = function( info ){
                if( info && info.statusText == "abort" ) return;
				that.showToast('网络错误'+'(' + info.status + ')' + '!');
                return error && error.apply( this );
			};
			opt.complete = function(){
                if( mask == true ){
                    util.hideGlobalLoading();
                }
                opt.button.el && opt.button.el.removeAttr('disabled').text( btntext );
                return complete && complete.apply( this,arguments );
            }
			return $.ajax(opt);
        },
		
        $gloading:$('.g-loading'),
		
		/**
		 *@ 显示全局遮罩
		 */
		showGlobalLoading: function(){
			this.$gloading.show();
		},

		/**
		 *@ 隐藏全局遮罩
		 */
		hideGlobalLoading: function(){
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
			}
			else {
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

        cutBadStr: function(text){
            if(!text) return '';
            return text.replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, "'");
        },

        /**
         * @desc格式化时间对象
         * @param {Object} Object 时间对象
         * @param {String} String 时间格式 YYYY-MM-dd HH:mm:ss
         *
         */
        formatDate : function(ticks, f) {
            var date = new Date( ticks );
            var F = f.replace(/\W/g, ',').split(','),
                format = ['YYYY','MM','dd','HH','mm','ss','ww'];
            date = {
                Y : date.getFullYear(),
                M : date.getMonth() + 1,
                d : date.getDate(),
                H : date.getHours(),
                m : date.getMinutes(),
                s : date.getSeconds(),
                w : date.getDay()
            };

            for (var i = 0, num = F.length; i < num; i++) {
                var o = F[i];
                for (var j = 0;j < 7;j++) {
                    var S = format[j].slice(-1);
                    if (o.indexOf(S) != -1) {
                        if (S == 'w' && date[S] == 0) {
                            date[S] = 7;
                        }
                        if (o.indexOf(format[j]) != -1) {
                            f = f.replace(RegExp(format[j], 'g'), this.addZero(date[S]));
                        } else {
                            f = f.replace(RegExp(format[j].slice(format[j].length/2), 'g'), date[S]);
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
        addZero : function(num,n) {
            if (!n) n = 2;
            return Array(Math.abs(('' + num).length - (n + 1))).join(0) + num;
        },

        _convertStringToUnicodeCodePoints: function (str) {
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
        _escapeToUtf32: function (str) {
            var escaped = [],
                unicodeCodes = util._convertStringToUnicodeCodePoints(str),
                i = 0,
                l = unicodeCodes.length,
                hex;

            for (; i < l; i++) {
                hex = unicodeCodes[i].toString(16);
                if(hex != 'fe0f' && hex != '20e3') {
                    escaped.push('0000'.substr(hex.length) + hex);
                }
            }
            return escaped.join('_');
        },

        /**
         * emoji表情
         */
        emoji :(function(){
            var // _reg = /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g,
                _reg = /\u2049\uFE0F|\u2049|\u2122|\u2139\uFE0F|\u2139|\u2194\uFE0F|\u2194|\u2195\uFE0F|\u2195|\u2196\uFE0F|\u2196|\u2197\uFE0F|\u2197|\u2198\uFE0F|\u2198|\u2199\uFE0F|\u2199|\u2600\uFE0F|\u2600|\u2601\uFE0F|\u2601|\u2611\uFE0F|\u2611|\u2614\uFE0F|\u2614|\u2615\uFE0F|\u2615|\u2648\uFE0F|\u2648|\u2649\uFE0F|\u2649|\u2650\uFE0F|\u2650|\u2651\uFE0F|\u2651|\u2652\uFE0F|\u2652|\u2653\uFE0F|\u2653|\u2660\uFE0F|\u2660|\u2663\uFE0F|\u2663|\u2665\uFE0F|\u2665|\u2666\uFE0F|\u2666|\u2668\uFE0F|\u2668|\u2693\uFE0F|\u2693|\u2702\uFE0F|\u2702|\u2705|\u2708\uFE0F|\u2708|\u2709\uFE0F|\u2709|\u2712\uFE0F|\u2712|\u2714\uFE0F|\u2714|\u2716\uFE0F|\u2716|\u2728|\u2733\uFE0F|\u2733|\u2734\uFE0F|\u2734|\u2744\uFE0F|\u2744|\u2747\uFE0F|\u2747|\u2753|\u2754|\u2755|\u2757\uFE0F|\u2757|\u2764\uFE0F|\u2764|\u2795|\u2796|\u2797|\u2934\uFE0F|\u2934|\u2935\uFE0F|\u2935|\u3030|\u3297\uFE0F|\u3297|\u3299\uFE0F|\u3299|\u00A9|\u00AE|\u203C\uFE0F|\u203C|\u21A9\uFE0F|\u21A9|\u21AA\uFE0F|\u21AA|\u231A\uFE0F|\u231A|\u231B\uFE0F|\u231B|\u23E9|\u23EA|\u23EB|\u23EC|\u23F0|\u23F3|\u24C2\uFE0F|\u24C2|\u25AA\uFE0F|\u25AA|\u25AB\uFE0F|\u25AB|\u25B6\uFE0F|\u25B6|\u25C0\uFE0F|\u25C0|\u25FB\uFE0F|\u25FB|\u25FC\uFE0F|\u25FC|\u25FD\uFE0F|\u25FD|\u25FE\uFE0F|\u25FE|\u260E\uFE0F|\u260E|\u261D\uFE0F|\u261D|\u263A\uFE0F|\u263A|\u264A\uFE0F|\u264A|\u264B\uFE0F|\u264B|\u264C\uFE0F|\u264C|\u264D\uFE0F|\u264D|\u264E\uFE0F|\u264E|\u264F\uFE0F|\u264F|\u267B\uFE0F|\u267B|\u267F\uFE0F|\u267F|\u26A0\uFE0F|\u26A0|\u26A1\uFE0F|\u26A1|\u26AA\uFE0F|\u26AA|\u26AB\uFE0F|\u26AB|\u26BD\uFE0F|\u26BD|\u26BE\uFE0F|\u26BE|\u26C4\uFE0F|\u26C4|\u26C5\uFE0F|\u26C5|\u26CE|\u26D4\uFE0F|\u26D4|\u26EA\uFE0F|\u26EA|\u26F2\uFE0F|\u26F2|\u26F3\uFE0F|\u26F3|\u26F5\uFE0F|\u26F5|\u26FA\uFE0F|\u26FA|\u26FD\uFE0F|\u26FD|\u270A|\u270B|\u270C\uFE0F|\u270C|\u270F\uFE0F|\u270F|\u274C|\u274E|\u27A1\uFE0F|\u27A1|\u27B0|\u27BF|\u2B05\uFE0F|\u2B05|\u2B06\uFE0F|\u2B06|\u2B07\uFE0F|\u2B07|\u2B1B\uFE0F|\u2B1B|\u2B1C\uFE0F|\u2B1C|\u2B50\uFE0F|\u2B50|\u2B55\uFE0F|\u2B55|\u303D\uFE0F|\u303D|\uD83C\uDC04\uFE0F|\uD83C\uDC04|\uD83C\uDCCF|\uD83C\uDD70|\uD83C\uDD71|\uD83C\uDD7E|\uD83C\uDD7F\uFE0F|\uD83C\uDD7F|\uD83C\uDD8E|\uD83C\uDD91|\uD83C\uDD92|\uD83C\uDD93|\uD83C\uDD94|\uD83C\uDD95|\uD83C\uDD96|\uD83C\uDD97|\uD83C\uDD98|\uD83C\uDD99|\uD83C\uDD9A|\uD83C\uDE01|\uD83C\uDE02|\uD83C\uDE1A\uFE0F|\uD83C\uDE1A|\uD83C\uDE2F\uFE0F|\uD83C\uDE2F|\uD83C\uDE32|\uD83C\uDE33|\uD83C\uDE34|\uD83C\uDE35|\uD83C\uDE36|\uD83C\uDE37|\uD83C\uDE38|\uD83C\uDE39|\uD83C\uDE3A|\uD83C\uDE50|\uD83C\uDE51|\uD83C\uDF00|\uD83C\uDF01|\uD83C\uDF02|\uD83C\uDF03|\uD83C\uDF04|\uD83C\uDF05|\uD83C\uDF06|\uD83C\uDF07|\uD83C\uDF08|\uD83C\uDF09|\uD83C\uDF0A|\uD83C\uDF0B|\uD83C\uDF0C|\uD83C\uDF0D|\uD83C\uDF0E|\uD83C\uDF0F|\uD83C\uDF10|\uD83C\uDF11|\uD83C\uDF12|\uD83C\uDF13|\uD83C\uDF14|\uD83C\uDF15|\uD83C\uDF16|\uD83C\uDF17|\uD83C\uDF18|\uD83C\uDF19|\uD83C\uDF1A|\uD83C\uDF1B|\uD83C\uDF1C|\uD83C\uDF1D|\uD83C\uDF1E|\uD83C\uDF1F|\uD83C\uDF20|\uD83C\uDF30|\uD83C\uDF31|\uD83C\uDF32|\uD83C\uDF33|\uD83C\uDF34|\uD83C\uDF35|\uD83C\uDF37|\uD83C\uDF38|\uD83C\uDF39|\uD83C\uDF3A|\uD83C\uDF3B|\uD83C\uDF3C|\uD83C\uDF3D|\uD83C\uDF3E|\uD83C\uDF3F|\uD83C\uDF40|\uD83C\uDF41|\uD83C\uDF42|\uD83C\uDF43|\uD83C\uDF44|\uD83C\uDF45|\uD83C\uDF46|\uD83C\uDF47|\uD83C\uDF48|\uD83C\uDF49|\uD83C\uDF4A|\uD83C\uDF4B|\uD83C\uDF4C|\uD83C\uDF4D|\uD83C\uDF4E|\uD83C\uDF4F|\uD83C\uDF50|\uD83C\uDF51|\uD83C\uDF52|\uD83C\uDF53|\uD83C\uDF54|\uD83C\uDF55|\uD83C\uDF56|\uD83C\uDF57|\uD83C\uDF58|\uD83C\uDF59|\uD83C\uDF5A|\uD83C\uDF5B|\uD83C\uDF5C|\uD83C\uDF5D|\uD83C\uDF5E|\uD83C\uDF5F|\uD83C\uDF60|\uD83C\uDF61|\uD83C\uDF62|\uD83C\uDF63|\uD83C\uDF64|\uD83C\uDF65|\uD83C\uDF66|\uD83C\uDF67|\uD83C\uDF68|\uD83C\uDF69|\uD83C\uDF6A|\uD83C\uDF6B|\uD83C\uDF6C|\uD83C\uDF6D|\uD83C\uDF6E|\uD83C\uDF6F|\uD83C\uDF70|\uD83C\uDF71|\uD83C\uDF72|\uD83C\uDF73|\uD83C\uDF74|\uD83C\uDF75|\uD83C\uDF76|\uD83C\uDF77|\uD83C\uDF78|\uD83C\uDF79|\uD83C\uDF7A|\uD83C\uDF7B|\uD83C\uDF7C|\uD83C\uDF80|\uD83C\uDF81|\uD83C\uDF82|\uD83C\uDF83|\uD83C\uDF84|\uD83C\uDF85|\uD83C\uDF86|\uD83C\uDF87|\uD83C\uDF88|\uD83C\uDF89|\uD83C\uDF8A|\uD83C\uDF8B|\uD83C\uDF8C|\uD83C\uDF8D|\uD83C\uDF8E|\uD83C\uDF8F|\uD83C\uDF90|\uD83C\uDF91|\uD83C\uDF92|\uD83C\uDF93|\uD83C\uDFA0|\uD83C\uDFA1|\uD83C\uDFA2|\uD83C\uDFA3|\uD83C\uDFA4|\uD83C\uDFA5|\uD83C\uDFA6|\uD83C\uDFA7|\uD83C\uDFA8|\uD83C\uDFA9|\uD83C\uDFAA|\uD83C\uDFAB|\uD83C\uDFAC|\uD83C\uDFAD|\uD83C\uDFAE|\uD83C\uDFAF|\uD83C\uDFB0|\uD83C\uDFB1|\uD83C\uDFB2|\uD83C\uDFB3|\uD83C\uDFB4|\uD83C\uDFB5|\uD83C\uDFB6|\uD83C\uDFB7|\uD83C\uDFB8|\uD83C\uDFB9|\uD83C\uDFBA|\uD83C\uDFBB|\uD83C\uDFBC|\uD83C\uDFBD|\uD83C\uDFBE|\uD83C\uDFBF|\uD83C\uDFC0|\uD83C\uDFC1|\uD83C\uDFC2|\uD83C\uDFC3|\uD83C\uDFC4|\uD83C\uDFC6|\uD83C\uDFC7|\uD83C\uDFC8|\uD83C\uDFC9|\uD83C\uDFCA|\uD83C\uDFE0|\uD83C\uDFE1|\uD83C\uDFE2|\uD83C\uDFE3|\uD83C\uDFE4|\uD83C\uDFE5|\uD83C\uDFE6|\uD83C\uDFE7|\uD83C\uDFE8|\uD83C\uDFE9|\uD83C\uDFEA|\uD83C\uDFEB|\uD83C\uDFEC|\uD83C\uDFED|\uD83C\uDFEE|\uD83C\uDFEF|\uD83C\uDFF0|\uD83D\uDC00|\uD83D\uDC01|\uD83D\uDC02|\uD83D\uDC03|\uD83D\uDC04|\uD83D\uDC05|\uD83D\uDC06|\uD83D\uDC07|\uD83D\uDC08|\uD83D\uDC09|\uD83D\uDC0A|\uD83D\uDC0B|\uD83D\uDC0C|\uD83D\uDC0D|\uD83D\uDC0E|\uD83D\uDC0F|\uD83D\uDC10|\uD83D\uDC11|\uD83D\uDC12|\uD83D\uDC13|\uD83D\uDC14|\uD83D\uDC15|\uD83D\uDC16|\uD83D\uDC17|\uD83D\uDC18|\uD83D\uDC19|\uD83D\uDC1A|\uD83D\uDC1B|\uD83D\uDC1C|\uD83D\uDC1D|\uD83D\uDC1E|\uD83D\uDC1F|\uD83D\uDC20|\uD83D\uDC21|\uD83D\uDC22|\uD83D\uDC23|\uD83D\uDC24|\uD83D\uDC25|\uD83D\uDC26|\uD83D\uDC27|\uD83D\uDC28|\uD83D\uDC29|\uD83D\uDC2A|\uD83D\uDC2B|\uD83D\uDC2C|\uD83D\uDC2D|\uD83D\uDC2E|\uD83D\uDC2F|\uD83D\uDC30|\uD83D\uDC31|\uD83D\uDC32|\uD83D\uDC33|\uD83D\uDC34|\uD83D\uDC35|\uD83D\uDC36|\uD83D\uDC37|\uD83D\uDC38|\uD83D\uDC39|\uD83D\uDC3A|\uD83D\uDC3B|\uD83D\uDC3C|\uD83D\uDC3D|\uD83D\uDC3E|\uD83D\uDC40|\uD83D\uDC42|\uD83D\uDC43|\uD83D\uDC44|\uD83D\uDC45|\uD83D\uDC46|\uD83D\uDC47|\uD83D\uDC48|\uD83D\uDC49|\uD83D\uDC4A|\uD83D\uDC4B|\uD83D\uDC4C|\uD83D\uDC4D|\uD83D\uDC4E|\uD83D\uDC4F|\uD83D\uDC50|\uD83D\uDC51|\uD83D\uDC52|\uD83D\uDC53|\uD83D\uDC54|\uD83D\uDC55|\uD83D\uDC56|\uD83D\uDC57|\uD83D\uDC58|\uD83D\uDC59|\uD83D\uDC5A|\uD83D\uDC5B|\uD83D\uDC5C|\uD83D\uDC5D|\uD83D\uDC5E|\uD83D\uDC5F|\uD83D\uDC60|\uD83D\uDC61|\uD83D\uDC62|\uD83D\uDC63|\uD83D\uDC64|\uD83D\uDC65|\uD83D\uDC66|\uD83D\uDC67|\uD83D\uDC68|\uD83D\uDC69|\uD83D\uDC6A|\uD83D\uDC6B|\uD83D\uDC6C|\uD83D\uDC6D|\uD83D\uDC6E|\uD83D\uDC6F|\uD83D\uDC70|\uD83D\uDC71|\uD83D\uDC72|\uD83D\uDC73|\uD83D\uDC74|\uD83D\uDC75|\uD83D\uDC76|\uD83D\uDC77|\uD83D\uDC78|\uD83D\uDC79|\uD83D\uDC7A|\uD83D\uDC7B|\uD83D\uDC7C|\uD83D\uDC7D|\uD83D\uDC7E|\uD83D\uDC7F|\uD83D\uDC80|\uD83D\uDC81|\uD83D\uDC82|\uD83D\uDC83|\uD83D\uDC84|\uD83D\uDC85|\uD83D\uDC86|\uD83D\uDC87|\uD83D\uDC88|\uD83D\uDC89|\uD83D\uDC8A|\uD83D\uDC8B|\uD83D\uDC8C|\uD83D\uDC8D|\uD83D\uDC8E|\uD83D\uDC8F|\uD83D\uDC90|\uD83D\uDC91|\uD83D\uDC92|\uD83D\uDC93|\uD83D\uDC94|\uD83D\uDC95|\uD83D\uDC96|\uD83D\uDC97|\uD83D\uDC98|\uD83D\uDC99|\uD83D\uDC9A|\uD83D\uDC9B|\uD83D\uDC9C|\uD83D\uDC9D|\uD83D\uDC9E|\uD83D\uDC9F|\uD83D\uDCA0|\uD83D\uDCA1|\uD83D\uDCA2|\uD83D\uDCA3|\uD83D\uDCA4|\uD83D\uDCA5|\uD83D\uDCA6|\uD83D\uDCA7|\uD83D\uDCA8|\uD83D\uDCA9|\uD83D\uDCAA|\uD83D\uDCAB|\uD83D\uDCAC|\uD83D\uDCAD|\uD83D\uDCAE|\uD83D\uDCAF|\uD83D\uDCB0|\uD83D\uDCB1|\uD83D\uDCB2|\uD83D\uDCB3|\uD83D\uDCB4|\uD83D\uDCB5|\uD83D\uDCB6|\uD83D\uDCB7|\uD83D\uDCB8|\uD83D\uDCB9|\uD83D\uDCBA|\uD83D\uDCBB|\uD83D\uDCBC|\uD83D\uDCBD|\uD83D\uDCBE|\uD83D\uDCBF|\uD83D\uDCC0|\uD83D\uDCC1|\uD83D\uDCC2|\uD83D\uDCC3|\uD83D\uDCC4|\uD83D\uDCC5|\uD83D\uDCC6|\uD83D\uDCC7|\uD83D\uDCC8|\uD83D\uDCC9|\uD83D\uDCCA|\uD83D\uDCCB|\uD83D\uDCCC|\uD83D\uDCCD|\uD83D\uDCCE|\uD83D\uDCCF|\uD83D\uDCD0|\uD83D\uDCD1|\uD83D\uDCD2|\uD83D\uDCD3|\uD83D\uDCD4|\uD83D\uDCD5|\uD83D\uDCD6|\uD83D\uDCD7|\uD83D\uDCD8|\uD83D\uDCD9|\uD83D\uDCDA|\uD83D\uDCDB|\uD83D\uDCDC|\uD83D\uDCDD|\uD83D\uDCDE|\uD83D\uDCDF|\uD83D\uDCE0|\uD83D\uDCE1|\uD83D\uDCE2|\uD83D\uDCE3|\uD83D\uDCE4|\uD83D\uDCE5|\uD83D\uDCE6|\uD83D\uDCE7|\uD83D\uDCE8|\uD83D\uDCE9|\uD83D\uDCEA|\uD83D\uDCEB|\uD83D\uDCEC|\uD83D\uDCED|\uD83D\uDCEE|\uD83D\uDCEF|\uD83D\uDCF0|\uD83D\uDCF1|\uD83D\uDCF2|\uD83D\uDCF3|\uD83D\uDCF4|\uD83D\uDCF5|\uD83D\uDCF6|\uD83D\uDCF7|\uD83D\uDCF9|\uD83D\uDCFA|\uD83D\uDCFB|\uD83D\uDCFC|\uD83D\uDD00|\uD83D\uDD01|\uD83D\uDD02|\uD83D\uDD03|\uD83D\uDD04|\uD83D\uDD05|\uD83D\uDD06|\uD83D\uDD07|\uD83D\uDD08|\uD83D\uDD09|\uD83D\uDD0A|\uD83D\uDD0B|\uD83D\uDD0C|\uD83D\uDD0D|\uD83D\uDD0E|\uD83D\uDD0F|\uD83D\uDD10|\uD83D\uDD11|\uD83D\uDD12|\uD83D\uDD13|\uD83D\uDD14|\uD83D\uDD15|\uD83D\uDD16|\uD83D\uDD17|\uD83D\uDD18|\uD83D\uDD19|\uD83D\uDD1A|\uD83D\uDD1B|\uD83D\uDD1C|\uD83D\uDD1D|\uD83D\uDD1E|\uD83D\uDD1F|\uD83D\uDD20|\uD83D\uDD21|\uD83D\uDD22|\uD83D\uDD23|\uD83D\uDD24|\uD83D\uDD25|\uD83D\uDD26|\uD83D\uDD27|\uD83D\uDD28|\uD83D\uDD29|\uD83D\uDD2A|\uD83D\uDD2B|\uD83D\uDD2C|\uD83D\uDD2D|\uD83D\uDD2E|\uD83D\uDD2F|\uD83D\uDD30|\uD83D\uDD31|\uD83D\uDD32|\uD83D\uDD33|\uD83D\uDD34|\uD83D\uDD35|\uD83D\uDD36|\uD83D\uDD37|\uD83D\uDD38|\uD83D\uDD39|\uD83D\uDD3A|\uD83D\uDD3B|\uD83D\uDD3C|\uD83D\uDD3D|\uD83D\uDD50|\uD83D\uDD51|\uD83D\uDD52|\uD83D\uDD53|\uD83D\uDD54|\uD83D\uDD55|\uD83D\uDD56|\uD83D\uDD57|\uD83D\uDD58|\uD83D\uDD59|\uD83D\uDD5A|\uD83D\uDD5B|\uD83D\uDD5C|\uD83D\uDD5D|\uD83D\uDD5E|\uD83D\uDD5F|\uD83D\uDD60|\uD83D\uDD61|\uD83D\uDD62|\uD83D\uDD63|\uD83D\uDD64|\uD83D\uDD65|\uD83D\uDD66|\uD83D\uDD67|\uD83D\uDDFB|\uD83D\uDDFC|\uD83D\uDDFD|\uD83D\uDDFE|\uD83D\uDDFF|\uD83D\uDE00|\uD83D\uDE01|\uD83D\uDE02|\uD83D\uDE03|\uD83D\uDE04|\uD83D\uDE05|\uD83D\uDE06|\uD83D\uDE07|\uD83D\uDE08|\uD83D\uDE09|\uD83D\uDE0A|\uD83D\uDE0B|\uD83D\uDE0C|\uD83D\uDE0D|\uD83D\uDE0E|\uD83D\uDE0F|\uD83D\uDE10|\uD83D\uDE11|\uD83D\uDE12|\uD83D\uDE13|\uD83D\uDE14|\uD83D\uDE15|\uD83D\uDE16|\uD83D\uDE17|\uD83D\uDE18|\uD83D\uDE19|\uD83D\uDE1A|\uD83D\uDE1B|\uD83D\uDE1C|\uD83D\uDE1D|\uD83D\uDE1E|\uD83D\uDE1F|\uD83D\uDE20|\uD83D\uDE21|\uD83D\uDE22|\uD83D\uDE23|\uD83D\uDE24|\uD83D\uDE25|\uD83D\uDE26|\uD83D\uDE27|\uD83D\uDE28|\uD83D\uDE29|\uD83D\uDE2A|\uD83D\uDE2B|\uD83D\uDE2C|\uD83D\uDE2D|\uD83D\uDE2E|\uD83D\uDE2F|\uD83D\uDE30|\uD83D\uDE31|\uD83D\uDE32|\uD83D\uDE33|\uD83D\uDE34|\uD83D\uDE35|\uD83D\uDE36|\uD83D\uDE37|\uD83D\uDE38|\uD83D\uDE39|\uD83D\uDE3A|\uD83D\uDE3B|\uD83D\uDE3C|\uD83D\uDE3D|\uD83D\uDE3E|\uD83D\uDE3F|\uD83D\uDE40|\uD83D\uDE45|\uD83D\uDE46|\uD83D\uDE47|\uD83D\uDE48|\uD83D\uDE49|\uD83D\uDE4A|\uD83D\uDE4B|\uD83D\uDE4C|\uD83D\uDE4D|\uD83D\uDE4E|\uD83D\uDE4F|\uD83D\uDE80|\uD83D\uDE81|\uD83D\uDE82|\uD83D\uDE83|\uD83D\uDE84|\uD83D\uDE85|\uD83D\uDE86|\uD83D\uDE87|\uD83D\uDE88|\uD83D\uDE89|\uD83D\uDE8A|\uD83D\uDE8B|\uD83D\uDE8C|\uD83D\uDE8D|\uD83D\uDE8E|\uD83D\uDE8F|\uD83D\uDE90|\uD83D\uDE91|\uD83D\uDE92|\uD83D\uDE93|\uD83D\uDE94|\uD83D\uDE95|\uD83D\uDE96|\uD83D\uDE97|\uD83D\uDE98|\uD83D\uDE99|\uD83D\uDE9A|\uD83D\uDE9B|\uD83D\uDE9C|\uD83D\uDE9D|\uD83D\uDE9E|\uD83D\uDE9F|\uD83D\uDEA0|\uD83D\uDEA1|\uD83D\uDEA2|\uD83D\uDEA3|\uD83D\uDEA4|\uD83D\uDEA5|\uD83D\uDEA6|\uD83D\uDEA7|\uD83D\uDEA8|\uD83D\uDEA9|\uD83D\uDEAA|\uD83D\uDEAB|\uD83D\uDEAC|\uD83D\uDEAD|\uD83D\uDEAE|\uD83D\uDEAF|\uD83D\uDEB0|\uD83D\uDEB1|\uD83D\uDEB2|\uD83D\uDEB3|\uD83D\uDEB4|\uD83D\uDEB5|\uD83D\uDEB6|\uD83D\uDEB7|\uD83D\uDEB8|\uD83D\uDEB9|\uD83D\uDEBA|\uD83D\uDEBB|\uD83D\uDEBC|\uD83D\uDEBD|\uD83D\uDEBE|\uD83D\uDEBF|\uD83D\uDEC0|\uD83D\uDEC1|\uD83D\uDEC2|\uD83D\uDEC3|\uD83D\uDEC4|\uD83D\uDEC5|\uD83C\uDDE8\uD83C\uDDF3|\uD83C\uDDE9\uD83C\uDDEA|\uD83C\uDDEA\uD83C\uDDF8|\uD83C\uDDEB\uD83C\uDDF7|\uD83C\uDDEC\uD83C\uDDE7|\uD83C\uDDEE\uD83C\uDDF9|\uD83C\uDDEF\uD83C\uDDF5|\uD83C\uDDF0\uD83C\uDDF7|\uD83C\uDDF7\uD83C\uDDFA|\uD83C\uDDFA\uD83C\uDDF8|\u0023\uFE0F\u20E3|\u0023\u20E3|\u0030\uFE0F\u20E3|\u0030\u20E3|\u0031\uFE0F\u20E3|\u0031\u20E3|\u0032\uFE0F\u20E3|\u0032\u20E3|\u0033\uFE0F\u20E3|\u0033\u20E3|\u0034\uFE0F\u20E3|\u0034\u20E3|\u0035\uFE0F\u20E3|\u0035\u20E3|\u0036\uFE0F\u20E3|\u0036\u20E3|\u0037\uFE0F\u20E3|\u0037\u20E3|\u0038\uFE0F\u20E3|\u0038\u20E3|\u0039\uFE0F\u20E3|\u0039\u20E3/g,
                _default = {
                    path: IBSS.COMMON_PATH + '/images/kf' + '/emoji/',
                    imgPrefix: 'emoji_',
                    imgExtension: '.png'
                };
            return function (text, opt) {
                opt = _.extend(_default, opt);
                return text.replace(_reg, function(v) {
                    return '<img class="emoji" style="vertical-align:middle" src="' + opt.path + opt.imgPrefix + util._escapeToUtf32(v) + opt.imgExtension + '" />';
                })
            }
        })(),

        /**
         * 获取饼干表情id
         */
        getEmojiCookieId: function(name){
            return cookieItems[util._escapeToUtf32(name)].id;
        },

        /**
         * emoji表情
         */
        emojiCookie :(function(){
            var _regEmojiCookie = /\[微笑\]|\[撇嘴\]|\[色\]|\[发呆\]|\[得意\]|\[流泪\]|\[害羞\]|\[闭嘴\]|\[睡\]|\[大哭\]|\[尴尬\]|\[愤怒\]|\[调皮\]|\[呲牙\]|\[惊讶\]|\[难过\]|\[酷\]|\[冷汗\]|\[抓狂\]|\[吐\]|\[偷笑\]|\[愉快\]|\[白眼\]|\[傲慢\]|\[饥饿\]|\[困\]|\[惊恐\]|\[流汗\]|\[憨笑\]|\[悠闲\]|\[奋斗\]|\[咒骂\]|\[疑问\]|\[嘘\]|\[晕\]|\[疯了\]|\[衰\]|\[骷髅\]|\[敲打\]|\[再见\]|\[擦汗\]|\[抠鼻\]|\[鼓掌\]|\[糗大了\]|\[坏笑\]|\[左哼哼\]|\[右哼哼\]|\[哈欠\]|\[鄙视\]|\[委屈\]|\[快哭了\]|\[阴险\]|\[亲亲\]|\[吓\]|\[可怜\]|\[OK\]|\[不好\]|\[赞\]|\[拍手\]|\[耶\]|\[握手\]|\[拜托\]|\[大便\]/g,
                _default = {
                    path: IBSS.COMMON_PATH + '/images/kf' + '/cookie/',
                    imgPrefix: 'cookie_',
                    imgExtension: '.png'
                };
            return function (text, opt) {
                text = text || '';
                opt = _.extend(_default, opt);
                return text.replace(_regEmojiCookie, function(v) {
                    return '<img width=25 height=25 class="emoji-cookie" style="vertical-align:middle" src="' + opt.path + opt.imgPrefix + util.getEmojiCookieId(v.substring(1, v.length-1)) + opt.imgExtension + '" />';
                })
            }
        })(),

        /**
         * 同时转换emoji和emojicookie
         * 无opt参数，即opt均采用默认
         */
        emojiAll: function(text){
            text = text || '';
            return util.emojiCookie(util.emoji(text));
        },

        /**
         * 文件大小格式化
         * @param  {[type]} byteSize [description]
         * @return {[type]}          [description]
         */
        getFileSize: function (byteSize) {
            var v = 0, unit = "BYTE";
            if (byteSize > 1073741824) {   //1G=1073741824 BYTE
                v = (byteSize / 1073741824).toFixed(0);
                unit = "GB";
            }else if (byteSize > 1048576) {   //1M=1048576 BYTE
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

        replaceLink: function( content ) {
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
        translateTime: function(time){
            if( !time ){
                throw('time 不能为空');
                return;
            }
            var now = new Date();
            var datetime = new Date(time);

            var str,
                timeSpace;

            if( now.getFullYear() != datetime.getFullYear() ){
                
                str = "yyyy年MM月dd日 hh:mm";
            } else {

                if( now.getMonth() != datetime.getMonth() ){
                    
                    str = "MM月dd日 hh:mm";
                }else{

                    if( now.getDate() != datetime.getDate() ){

                        now.setHours(0,0,0,0);
                        datetime.setHours(0,0,0,0);
                        timeSpace = now.getTime() - datetime.getTime();
                        if( timeSpace <= (1000*60*60*24) ){
                            return ("昨天 " + new Date(time)._format("hh:mm"));
                        }else if( (timeSpace <= (1000*60*60*42)) ){
                            return ("前天 " + new Date(time)._format("hh:mm"));
                        }else{
                            str = "MM月dd日 hh:mm";
                        }
                    }else{

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
        getInAppName: function(key){

            var MAP = {
                'tyzh': '体验帐号',
                'bsxt': '报数系统',
                'yqts': '邀请同事',
                'grzl': '个人资料',
                'xtsz': '系统设置',
                'sccwrz': '立即上传'
            };

            if(key){
                return MAP[key];
            }else{
                return MAP;
            }
        },

        ////////////
        //
        //根据权限控制相关元素显示隐藏
        //////////////
        filterFunc: function(){
            
        },

        /**
         * 将textarea里的内容转换
         * 换行符替换为,并过滤空行
         */
        transArea: function( str ){
            var nstr = str.replace(/\n/g,',').replace(/\s/g,'').replace(/[,]+/g,',');
            return nstr;
        },

        /**
         * html 转义
         */
        html_encode: function( str ){ 
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
        html_decode: function( str ){
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
        getEnums: function( name, callback ) {
            IBSS.enums = IBSS.enums || {};

            if ( IBSS.enums[ name  ] ) {
                callback && callback( IBSS.enums[ name ] );
                return;
            }
            
            var me = this,
                opt = {
                    url: '~/op/api/enums/getlist',
                    data: { name: name },
                    type: 'POST',
                    cache: false,
                    timeout: TIME_OUT,
                    dataType:'json',
                    success: function( data ) {
                        if ( data.success ) {
                            IBSS.enums[ name ] = data;
                            callback && callback( data );
                        }
                    }
                };
            return me.api( opt, false );
        },

        /**
         *
         * 获取行业 遍历为树状信息
         * 并赋值给select
         */
        getIndustry: function( $select, callback ){
            var me = this;

            
            //存储最终数据
            var INMAP = {};
            //存储缓存数据
            var items = {};
            //生成dom结构
            var str = "<option value=''>全部</option>";

            util.getEnums('INDUSTRY',function( data ){

                //第一次遍历缓存所有数据
                data.value.model.forEach(function( item, index ){
                    item.children = {};
                    items[item.value] = item;
                });

                //第二次遍历生成缓存map
                data.value.model.forEach(function( item, index ){
                    getNode( item.value );
                });

                console.log( items );
                console.log( INMAP );

                generateDom( INMAP ,0 );
                $select.html( str );

                callback && callback( data );
            })


            // 从无生成一个node 
            // 并返回node的详细信息
            // 如果node有父节点则插入父节点的children节点
            function getNode( value ){

                //如果有父节点 则挂载在父节点上
                if( items[value].parentValue && items[value].parentValue!='0' ){

                    var parent =items[items[value].parentValue];
                    parent.children[value] = items[value];
                    return items[value];

                //如果没父节点 则挂载在顶级对象上
                }else{

                    INMAP[value] = INMAP[value] || items[value];
                    return INMAP[value];
                }
            }

            function generateDom( node , zindex ){
                var item;
                var mstr = "|-";
                for( var i=1; i<=zindex; i++ ){
                    mstr = "&nbsp;&nbsp;&nbsp;"+mstr;
                }

                //console.log( mstr );
                for( var key in node ){
                    
                    item = node[key];
                    str = str + '<option value="' + item.value + '" title="' + item.text + '">' + mstr + item.text + '</option>';
                    generateDom( item.children , zindex+1 );
                }
            }
        },

        /**
         *
         * 根据value
         * 获取相应enmus
         */ 
        findEnumsText: function( name,value ){
            
            var text = '';
            if( IBSS.enums[name] ){
                for( var i = 0; i<IBSS.enums[name]['model'].length; i++ ){
                    if ( IBSS.enums[name]['model'][i]['value'] == value ){
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
        resetSelect: function( $select, array , selectvalue ){
            var optionStr = '';

            if( array.length <=0 ) return;

            for(var i=0; i<array.length; i++){
                if( typeof array[i] == 'object' ){
                    optionStr = optionStr + '<option value="' + array[i]['value'] + '">' + array[i]['name'] + '</option>' 
                }else{
                    optionStr = optionStr + '<option value="' + array[i] + '">' + array[i] + '</option>' 
                }
            }

            $select.html(optionStr);

            if( selectvalue ){
                $select.val( selectvalue );
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
        getEnumsSelect: function( name, $select ,callback ){
            
            var statusList = [{'name':'全部','value':''}];

            util.getEnums( name, function( data ){
                if( data.success ){

                    data.value.model.forEach(function( item, index){
                       statusList.push( {'name':item.text,'value':item.value} );
                    });


                    util.resetSelect( $select, statusList );
                }

                callback && callback( data );
            })
        },

        /*
        *  计算日期
        *  @param AddDayCount {number}
        *  根据输入的 number 计算返回的日期  
        *  如 -1 返回昨天的日期
        */
        getDateStr: function( AddDayCount ) {

            var dd = new Date();
            dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth()+1;//获取当前月份的日期
            var d = dd.getDate();
            return y+"/"+m+"/"+d;
        },

        /*
        *  判断一个对象属性是否为空
        *  @param obj {object}
        */
        isEmptyObject: function( obj ){
            var isEmpty = true;
            for( var key in obj){
                isEmpty = false;
                break;
            }
            return isEmpty;
        },


        /*
        * input 错误提示
        * @param $input {jQuery}
        */
        warnInput: function( $input ){
            $input.css({'border':'1px #c81623 solid','box-shadow':'0 0 3px #c81623'});
        },

        /*
        * input 取消错误提示
        * @param $input {jQuery}
        */
        unWarnInput: function( $input ){
            $input.removeAttr('style');
        },

        /**
         *
         * 各校验正则
         */
        regMap: {
            'phone': /^1\d{10}$/ ,
            'email': /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        }
    }; 
    
    
    win.util = util;

}(jQuery, _));
