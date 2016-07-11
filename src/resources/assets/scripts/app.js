define('common/app', function(require, exports, module){
	
	var win = window,
		doc = win.document,
		location = win.location,
		util = win.util,
		IBSS = win.IBSS;
	
	var Remind = require('common/widget/remind/remind');
	var DownFile = require('module/downfile/downfile');

	
    /**
	 * @type contructor
	 * @desc spa设计主流程
	 *
	 */
    var Spa = Backbone.Router.extend({
		
		
		/**
		 * @type {Number}
		 * 记录页面一共切换的次数
		 * 作用: 页面点击50次， 强制刷新一次页面
		 */
		loadNum: 0,

		
		/**
		 * @type {Boolean}
		 * 标记是否在当前页面
		 * 用于异步加载成功时判断 当前页面是否还存在
		 * 作用： 已经离开了当前页面，但请求的当前页面的依赖 还未载入完成， 不在执行依赖文件 
		 */
		singn: false,
		
		
		/**
 		 * @type {Object}
		 * @desc 当前页面信息
		 * 作用： 记录在全局对象IBSS.tpls属性中
		 * 继承了 Backbone.Events
		 * 事件： switch当前页面中的切换  start当前页面载入成功  close关闭当前页面
		 *  
		 */
		curPage: _.extend({
			path:  '',            // 模块文件路径
			$el:   null,          // 当前页面最外层元素
			cache: false,         // 是否设置了缓存
			widget: [],           // 当前页面用到的组件集合
			_needDeps: false,     // 是否需要依赖 加载js css
			_depsComplete: false  // 依赖是否加载完成 js css 是否加载完成了
		}, Backbone.Events),
		
		
		/**
		 * @type {Array}
		 * @desc 缓存页面列表
		 * 作用： 记录所有缓存页面列表， 切换页面时， 如果当前页面（curPage）的path已经存在
		 * cacheList中 不在做请求 直接获取curPage.$el 显示
		 */
		cacheList: [],
		
		
		/**
		 * @desc 匹配路由
		 * 每个大模块都要做一次手动添加
		 * 作用： 路由分发
		 * ''(空路由)， 直接定位到manage/index 下
		 * @example 路由 manage/:module(/*param)
		 *  manage  大的模块目录
		 * :module  匹配manage下的子模块
		 * /*param  参数
		 * manage/index/11/222/333
		 * 或请求manage目录下的index目录中index.html index.css index.js
		 * 会在index.js 出口函数中传入 （[11,222,333]）参数
		 * 
		 */
        routes: {
			'': 'index',
            ':path/:module(/*param)': 'path',
			'*action': 'index'  // 所有不匹配router都转到首页
        },
		
		/**
		 *
		 * @desc 获取当前hash
		 * 如果location的hash为空 则取nav中可见且有href属性的a标签的href值
		 */
		_getCurrentHash: function(){

			return location.hash || this._getIndexHash();
		},

		/**
		 *
		 * @desc 获取首个hash
		 */
		_getIndexHash: function(){

			return $('nav li a[href]').eq(0).attr('href');
		},

		/**
		 * @desc 重新刷新页面
		 * 作用： 页面点击（loadNum）大于50次 或者缓存（cacheList）了大于20次 强制刷新页面
		 */		
		_reload: function() {
			if (this.loadNum >= 50 || this.cacheList >= 20) {
				location.reload();
			}
		},

		/**
		 *
		 * @desc 载入nav首个链接地址
		 * 同时不改变当前hash
		 * 以防返回时报错
		 */
		index: function() {
			//location.hash = $('nav li:visible a').eq(0).attr('href');
			var me = this;

			var hash = me._getCurrentHash() || '';
				hash = hash.slice(1);
			var hasharray = hash.split('/');


			if ( hash ){
				me.loadModule (hasharray[0], hasharray[1], hasharray[2]);
			}else{
				util.showToast('无可用模块');
			}
		},

        path: function( path, module, param ) {
            this.loadModule( path , module, param )
        },

		/**
		 * @desc 主逻辑
		 * 作用： 每个路由都会调用此函数
		 * 根据路由载入相应模块文件
		 */
        loadModule: function(path, module, param) {
			
			// 拼接请求的url地址 BASE_PATH + '大的模块' + 加子模块 + 子模块下的文件名
			// localhost/manage/index/index
			this.path  = [IBSS.BASE_PATH, path, module, module].join('/'),  // for curPage key 
			this.param = param ? param.split('/') : undefined;
			this._reload();
			
			// 当前页面中切换
			// 不刷新页面
			
			/*if (this.curPage.path == this.path) {
				this._swtich(this.param);
				return;
			}*/
			
			this._start();
			this.singn = false;
        },
		
		/**
		 * @desc 处理switch流程
		 */
		_swtich: function(param) {
			$(win).scrollTop(0);
			this.curPage.trigger('switch', param);
			this.loadNum = this.loadNum + 1;
			IBSS.trigger('switched');   // 全局执行switched 事件
		},

		/**
		 * @desc 关闭当前页面
		 * 作用： 当前页面缓存 直接隐藏当前页面， 负责移除当前页面 清空组件
		 */
		_close: function() {
			var curPage = this.curPage,
				$el = curPage.$el;
				
			// 第一次载入
			// 无需关闭页面
			if (this.loadNum == 0) {
				return;
			}

			if (curPage.cache) {
				$el.hide();
			}
			else {
				$el.off();
				$el.removeData();
				$el.remove();

				// 清除页面组件
				if (curPage.widget.length) {
					_.each(curPage.widget, function(item) {
						item.destroy();
					});
					curPage.widget.length = 0;
				}
				
				// if (IS_DEVELOP && !curPage._events.close) {
					// console.log(curPage.path + ' 页面，没有缓存， 请检查页面中是否有需要要清除的元素');
				// }			
			}
			curPage.trigger('close');
		},
		
		/**
		 * @desc 开始处理流程
		 * 作用: 请求下一个页面
		 */
		_start: function() {
			var that = this;
			
			that.xhr && that.xhr.abort();    // cancel掉正在请求的页面
			
			// 关闭当前页面
			that._close();

			// cacheList是否为是否存在
			// 从缓存中读取当前页面数据 
			// 判断需要依赖但依赖未加载完成			
			var cachePage = _.find(that.cacheList, function(item) {
				return item.path == that.path;
			});
			
			// 请求的页面存在缓存中
			if (cachePage) {
			
				_.extend(that.curPage, cachePage);  // 把缓存中的当前页面信息读取过来
				cachePage.$el.show();               // 显示页面
				that.loadNum = that.loadNum + 1;
				
				// 上次打开这个页面时， 依赖的js css 文件是否加载完成
				// 如果没有加载完成， 重新加载一次
				if (cachePage._needDeps && !cachePage._depsComplete) { 
					that._getDeps(cachePage.$el);
				} else {
					that.curPage.trigger('start');
					that.curPage.trigger('switch', that.param);	
					IBSS.trigger('switched');   // 全局执行switched 事件
				}

				return false;
			}
			
			// 不存在缓存中
			// 获取html内容
			that._getHtml();
		},

		
		/**
		 * @desc 获取html内容
		 */		
		_getHtml: function() {
			var that = this;

			// 页面载入中
			// 只用于请求html 文件的全局loading ui展现
			IBSS.trigger('load');
			require.async(that.path+'.html',function(response){
				var $el = $(response);
					
					that.singn = true;  // 已经存在于当前页面了

					// 内容添加到页面中去
					$('#con').empty().append($el);

					// 重新记录当前页面
					// undersorce 不支持深复制， 手动清空events
					that.curPage._events = null;
					_.extend(that.curPage, {
						path: that.path,
						$el: $el,
						cache: ($el.attr('cache') == 'true'),   // 页面缓存
						_needDeps: false,
						_depsComplete: false,
						widget: []
						// lightNav: ($el.attr('lightnav') == 'true')
					}, Backbone.Events);
					
					// 页面载入结束
					// 清空载入效果ui
					IBSS.trigger( 'loaded', $el );
					IBSS.trigger('switched');   // 全局执行switched 事件
					
					// 请求依赖文件
					that._getDeps($el);	
			})
			/*
			that.xhr = util.ajax({
				url:      that.path + '.html',
				dataType: 'html',
				success:  function(response) {
					
					var $el = $(response);
					
					that.singn = true;  // 已经存在于当前页面了

					// 内容添加到页面中去
					$('#con').append($el);

					// 重新记录当前页面
					// undersorce 不支持深复制， 手动清空events
					that.curPage._events = null;
					_.extend(that.curPage, {
						path: that.path,
						$el: $el,
						cache: ($el.attr('cache') == 'true'),   // 页面缓存
						_needDeps: false,
						_depsComplete: false,
						widget: []
						// lightNav: ($el.attr('lightnav') == 'true')
					}, Backbone.Events);
					
					// 页面载入结束
					// 清空载入效果ui
					IBSS.trigger( 'loaded', $el );
					IBSS.trigger('switched');   // 全局执行switched 事件
					
					// 请求依赖文件
					that._getDeps($el);					
				},
				// 不存在路由
				// 404 处理
				error: function() {
					// TODO 404 page
				}
			});	
			*/	
		},
		
		/**
		 * @desc 获取依赖的脚本和样式
		 * 载入 依赖的js 文件 和css 文件
		 * 根据 载入的html 元素中js css属性
		 */
		_getDeps: function($el) {
			var that = this,
				deps = [];
				
			// IBSS.ASYNCCSS 全局配置
			// 是否异步加载页面中css
			if ($el.attr('css') == 'true' && IBSS.ASYNCCSS) {
				deps.push(that.path + '.css');
			}
			if ($el.attr('js') == 'true') {
				deps.push(that.path + '.js');
			}

			if (deps.length) {
				that.curPage._needDeps = true;  // 需要依赖 重置依赖属性_needDeps
				
				require.async(deps, function(css, exports) {
					if (typeof exports == 'undefined') {
						exports = css;
					}
					if (exports) {
					
						// singn 防止异步加载未完成切换页面
						// _depsComplete 为了判断页面缓存了但是依赖未加载完成
						if (that.singn) {             			
							exports.$el = $el;
							exports.init(that.param);
							
							that.curPage._depsComplete = true;   // 依赖加载完成
							IBSS.trigger('_depsComplete');
							that.curPage.trigger('start');
							that.curPage.trigger('switch', that.param);
						}
					}
				});
			}
		},

		/**
		 * 开始提醒轮询
		 */
		_startRemind: function(){
			IBSS.remind = new Remind();
		},

		/**
		 * 获取用户信息
		 */
		getAccount: function( bool , callback ){
			var me = this;

			util.api({
                url: '~/g/api/account/getloginaccount',
                async: false,
                success: function (data) {
                	
                    if (data.success) {
                    	
                        $('#accountname').text(data.value.model.name);

                        IBSS.role = data.value.model;
						
                        IBSS.FUNCTIONS = data.value.model.moduleCodes;
                        IBSS.MODULES = data.value.model.moduleCodes;
 

                        //开始提醒轮询
                        me._startRemind();
                        me.setPermissions();
                        //me.setModuleCode();
                        callback && callback();
                    }
                }
            });
			/*
			if( bool ){
				//获取代理商ID
				util.api({
					url: '/enterprisefiling/getvendorid',
					success: function( data ){
						if( data.success ){
							IBSS.role_vendorId = data.value.model
						}
					} 
				});
			}
			*/
		},
		

		/**
         * 
         * 遍历所有含有 [data-permissons] 属性的元素
         * 如果其所含的 code 在 IBSS.FUNCTIONS 内存在
         * 则显示
         */
		setPermissions: function( $el ){
			var $el = $el || $('body');
			
			$el.find('[data-permissions]').each(function(){
				var $this = $( this ),

				    codes = $this.attr('data-permissions').split(/[\s,]+/);
				
				var bool = false;
				for( var i = 0; i < IBSS.FUNCTIONS.length ; i++ ){

					for( var j = 0; j < codes.length ; j++ ){
						if( codes[j] == IBSS.FUNCTIONS[i] ){
							//$this.show(); 默认不做任何处理
							bool = true;
							break;
						}

					}
					if(bool == true){
						break;
					}
				}
				if(bool == false){
					$this.remove();
				}
			});
			
			//特殊处理
			/*
			 *for( var i = 0; i < IBSS.FUNCTIONS.length ; i++ ){
			 *	if( 'F008002' == IBSS.FUNCTIONS[i] ){
			 *		if( $('nav .zhichinav').length >0 ){
			 *			$('nav .zhichinav').hide();
			 *		}
			 *	}
			 *}
			 */
		},

		/**
		 *
		 * 初始化菜单显隐
		 */
		setModuleCode: function(){
			var $nav = $('nav');


			$nav.find('li[data-permissions]').each(function(){
				var $this = $( this ),

					codes = $this.attr('data-permissions').split(/[\s,]+/);

				var bool = false;
				for( var i=0; i < IBSS.MODULES.length ; i++ ){

					for( var j = 0; j<codes.length; j++ ){
						if( codes[j] == IBSS.MODULES[i] ){
							$this.show();
							bool = true;
							break;
						}
					}
					if( bool === true ){
						break;
					}
				}

				//循环结束后如果依然没有匹配的则remove此元素
				if( bool === false ){
					$this.remove();
				}
			});
		},

		/**
         * @desc 点亮导航
		 * 点亮当前元素下 所有连接为当前hash的元素
         * @param {jquery}
         */
        lightNav: function($el) {
			var $el = $el || $('nav'),
				hash = this._getCurrentHash();

            //清除导航内 所有<li>元素的激活状态
            $el.find('li').each(function(){
                $(this).removeClass('active');
            });
            
        	$el.find('li a[href]').each(function(){
                var $this = $(this),
                    href = $this.attr('href') || '';

                if( hash == href ){
                    $this.parents('li').addClass('active');
                }
            });
        },		

		/**
		 *
		 * @desc 初始化
		 * 绑定载入效果
		 */
		initialize: function() {
			var that = this;

			// 每次切换页面时执行的函数
			IBSS.on('switched', function() {
				var hash = location.hash || '';

				//点亮nav中的相应图标
				that.lightNav( $('.nav-main') );
				
				//全局提醒
				//每次切换页面 都主动调用
				IBSS.remind.getRemind();

			});
			
			/**
   			 * 全局loading 状态
			 */
			IBSS.on('load', function( $el ) {
				$('.g-loading').show();
			});
			
			/**** 
			 * 结束全局loading 状态
			 * 记录一次页面载入数
			 * 如果当前页面需要缓存
			 * 把当前页面中还没有获取依赖的数据 先写入cacheList中
			 * ps: 当前只是 html中数据， 还未知依赖是否载入成功
			 * @param $el 当前页面元素 
			 */ 
			IBSS.on('loaded', function( $el ) {
				$('.g-loading').hide();
				
				//执行permission权限过滤
				that.setPermissions( $el );
				that.loadNum = that.loadNum + 1;
				if (that.curPage.cache) {
					that.cacheList.push(_.extend({}, that.curPage));
				}
			});	
			
			// 页面需要依赖
			// 依赖载入完成 重新更新cachelist
			IBSS.on('_depsComplete', function() {
				if (that.curPage.cache) {
					var cacheList = that.cacheList;
					for (var i = 0, len = cacheList.length; i < len; i++) {
						if (cacheList[i].path == that.path) {
							cacheList.splice(i, 1);
							break;
						}
					}
					cacheList.push(_.extend({}, that.curPage));
				}
			});
			
			// 添加当前页面依赖的组件widget
			// 当实例化 组件式 执行  详见 widget.js
			IBSS.on('_addWidget', function(widget) {
				if (that.curPage._depsComplete) {
					// 是否为缓存页面
					var cachePage = _.find(that.cacheList, function(item) {
						return item.path == that.path;
					});
					if (cachePage) {
						cachePage.widget.push(widget);
					}
				} else {
					that.curPage.widget.push(widget);
				}

				/**
				 *
				 * 对widget 进行权限验证 页面内元素符合权限的显示
				 */
				 that.setPermissions( widget.$view );
			});
			
			IBSS.on('_initCenter', function(center) {

				that.setPermissions( center.$view );
			});
			
			// 兼容pushState需要手动调用路由
			// 连接中包含#的直接作为hash处理
			// 否则作为普通连接处理
			// 暂时关闭pushStatus
			// $(doc).on('click', function(e) {
				// var $target = $(e.target);
				// if ($target[0].nodeName.toUpperCase() == 'A') {
					// var href = $target.attr('href');
					// if (href.indexOf('#') != -1) {
						// var aHash = href.slice(href.indexOf('#'));
						// if (aHash.length > 0) {
							// that.navigate(aHash, true);
							// return false;
						// }						
					// }
				// }
			// });
			that._initEvent();
		},
		/**
		 *
		 * 初始化一些全局事件
		 */
		_initEvent: function(){
			var me = this;

			//类名为nav-root 的a标签点击时 如果没有href属性 会寻找同组内第一个有href属性的a标签的href 并赋值到location.href中
			$('nav .nav-branch').on('click',function(e){
				var $this = $(e.target);
				if( !$this.attr('href') ){
					location.href = $this.parent('li').find('li a[href]').eq(0).attr('href');
				}
			});
			
			//
			$('.down-file').on('click',function(e){
				me.trigger('downFile');
			});
		}
    });

	
    var app = IBSS.app = {

    	/**
    	 * @param bool 如果为真
    	 *  获取agentId
    	 */
		init: function( bool ) {
			var spa = new Spa();
			IBSS.tpl = spa.curPage;     // 当前页面信息
            IBSS.tplEvent = spa;        // 页面路由
			var downFile = null;
			
			if (IBSS.IS_DEVELOP) {
				IBSS.loadNum = spa.loadNum + 1;    // 便与开发模式下查看信息
				IBSS.cacheList = spa.cacheList;    // 便与开发模式下查看信息
			}

			spa.getAccount( bool ,function(){
				Backbone.history.start();   // 开启路由
			});
			
			spa.on('downFile',function(){
				downFile = new DownFile();
				downFile.show( );
			})
		}
    };
	
	exports.run = app.init;
});
