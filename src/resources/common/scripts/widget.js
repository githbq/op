/**
 *
 * 	所有widget的父类
 * 	Class -> Event -> Center
 * 	一个模块可能在不同的场景中都会使用
 * 	有些元素可能会进行显隐 相关元素都可写
 * 	data-state属性 默认隐藏
 * 	在初始化时根据传入的state属性 进行显隐控制
 *  数据驱动
 */

;(function(_, Backbone){

	var win = this,
		IBSS = win.IBSS,
		Widget;


	/**
	 * @Consturctor
     * Widget类父类为Backbone.view
	 */
	Widget = win.Widget = Backbone.View.extend({

		/**
 		 * @type {String}
		 * 页面每个widget 都会带的样式
		 */
		_cls: 'ibss-widget',


		/**
		 * @desc Backbone.View初始化函数
		 * 组件不允许调用initialize初始化
		 */
		initialize: function(options) {

			// 保存默认值
			this.defaults = _.clone(_.result(this, 'attrs') || {});

			// 组件所有属性的松散列表
			// 组件集成中 用set方法扩展此项的值
			this.attrs = _.extend(this.defaults, options || {});

			// 组件添加统一样式
			this.$el.addClass(this._cls);

			// 记录每个页面中用到widget
			// 用于切换页面时清除
			IBSS.trigger('_addWidget', this);

			this.setup.apply(this, arguments);
		},


		/**
		 * @desc 每个组件外部调用的初始化函数
		 */
		setup: function() {
			return this;
		},

		/**
		 * @desc 获取组件中制定name的值
		 */
		get: function(name) {
		  return this.attrs[name];
		},

		/**
		 * @desc 设置组件中属性的值
		 */
		set: function(key, value) {
			if (_.isObject(key)) {
				_.extend(this.attrs, key);
			}
			else {
				this.attrs[key] = value;
			}
		},


		/**
		 * @desc 显示组件
		 */
		show: function() {
			this.$el.show();
			return this;
		},

		/**
		 * @desc 渲染组件
		 */
		render: function() {
		},

		/**
		 * @desc 隐藏组件
		 */
		hide: function() {
			this.$el.hide();
			return this;
		},

		/**
		 * @desc 销毁组件
		 */
		destroy: function() {
			this.remove();
		}

	});

	/////////////////
	//
	// 类函数
	/////////////////
	var MClass = function(parent){

	     function klass(){
			this.init.apply(this,arguments);
		};

		//如果有父函数
		//klass的原型链指向parent.prototype
		if(parent){
			var subclass = function(){ };
			subclass.prototype = parent.prototype;
			klass.prototype = new subclass;
			klass.prototype.constructor=klass;
			//暴露__super__属性便于调取父类的函数
			klass.__super__ = parent.prototype;

		}

		klass.prototype.init = function(){};
		klass.fn = klass.prototype;
		klass.fn.parent = klass;

		//给类添加属性
		//todo  extended函数的作用?
		klass.extend = function(obj){
			var extended = obj.extended;
			for(var i in obj){
				if( obj.hasOwnProperty(i) )
				klass[i] = obj[i];
			}
			if(extended) extended(klass);
			return klass;
		}

		//给实例添加属性
		//做好只在初始化的时候调用
		//todo include函数的作用?
		klass.include = function(obj){
			var included = obj.included;
			for(var i in obj){
				if( obj.hasOwnProperty(i) )
				klass.fn[i] = obj[i];
			}
			if(included) included(klass);
			return klass;
		}

		/*
		* 工具类函数 todo要不要删除
		* 浅复制
		* 将其他对象中的属性合并至第0个对象 会覆盖原有属性
		*/
		klass.merge = function(obj) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];
				if (!source)
					continue;
				for (var prop in source) {
					if (source.hasOwnProperty(prop))
						obj[prop] = source[prop];
				}
			};
			return obj;
		}

		return klass;
	}

	/**
	 * @Class 事件
	 */
	var Event = MClass().include({

		/**
		 * 注册事件
		 * 事件对象存储函数对象和环境(默认为me)
		 */
		'on': function(name, callback, context) {
			var me = this;

			//如果没有传入事件函数 返回调用对象方便链式调用
			if (!callback)
				return me;
			me._events || (me._events = {});

			var events = me._events[name] || (me._events[name] = []);

			//context参数默认为me
			events.push({
				callback: callback,
				context: context || me
			});
			return me;
		},

		/**
		 *  trigger 触发事件
		 * 如果事件库里有all
		 * 同时会触发all库里的事件
		 */
		'trigger': function(name) {
			var me = this;

			if (!me._events)
				return me;

			var slice = [].slice;
			var args = slice.call(arguments, 1);

			var i = 0,
				ev, events = me._events[name],
				allEvents = me._events['all'];

			if (events) {
				for (i = 0; i < events.length; i++) {
					ev = events[i];
					ev.callback.apply(ev.context, args);
				}
			}


			/**
			 * allevents
			 * 第一个参数需要获取 事件名
			 */
			if (allEvents) {
				for (i = 0; i < allEvents.length; i++) {
					ev = allEvents[i];
					ev.callback.apply(ev.context, arguments);
				}
			}

			return me;
		},

		/**
		 *  off
		 *  构建新事件队列
		 */
		'off': function(name, callback, context) {
			var me = this;
			var names;

			if (!me._events)
				return me;
			if (!name && !callback && !context) {
				me._events = null;
				return me;
			}

			/**
			 * 更新事件队列
			 * 如果callback context均为空 则清空队列
			 * 如果有值 筛选出其他的 push入队列
			 */
			var events = me._events[name],
				ev, i;

			me._events[name] = [];
			if (callback || context) {
				for (i = 0; i < events.length; i++) {
					ev = events[i];
					if ((callback && callback !== ev.callback) || (context && context !== ev.context)) {
						me._events[name].push(ev);
					}
				}
				if (!me._events[name].length)
					delete me._events[name];

			}

			return me;
		},

		/**
		 *
		 *只触发一次事件
		 */
		'once': function(name, callback, context) {
			var me = this;
			var oncefunc = function() {
				callback.apply(this, arguments);
				me.off(name, oncefunc, context);
			}
			me.on(name, oncefunc, context);
			return me;
		}
	})

	/**
	 * 数据层
	 */
	var Model = MClass(Event).include({

		init: function( attrs ){
			this.attrs = {};
			if( attrs ) this.load( attrs );
		},

		//添加属性
		load: function( attrs ){
			for( var name in attrs){
				if( attrs.hasOwnProperty(name) ){
					this.set( name , attrs[name] );
				}
			}
		},

		//获取所有数据
		all: function(){
			return this.clone( this.attrs );
		},

		//深度复制
		clone: function( attrs ){
			return JSON.parse( JSON.stringify(attrs) )
		},

		get: function( key ){
			return this.attrs[key];
		},

		//todo 校验当前value 和 原始value
		//     如果相同则不触发change事件
		//对model的所有赋值都走这个函数
		set: function( key , value ){

			var originalValue = this.attrs[key];
			if( originalValue !== value ){
				this.attrs[key] = value;
				this.trigger('change', key , value);
				this.trigger('change:'+ key, key , value);
			}
            return this;
        },

		clear: function(){
			var attrs = this.attrs;
			for( var name in attrs ){
				if( attrs.hasOwnProperty(name) ){
					this.set( name , null );
				}
			}
			return this;
		}
	});

	/**
	 * 集合
	 */
	var Collection = MClass(Event).include({

		init: function( records ){
			this.records = records || [];
		},

		//重新加载集合
		reload: function( records , func ){
			records = records || [];

            if( func ){ this.replaceRecords( records , func ); }
            this.records = records;
            this.trigger('reload');
		},

		//对集合里的记录 进行replace
		replaceRecords: function( records , func ){
			for( var i=0; i < records.length; i++ ){
				func( records[i] );
			}
		},

		find: function( name,value){
			var records = this.records;
			for( var i=0; i<records.length; i++){
				if( records[i][name] == value ){
					return records[i];
				}
			}
			return false;
		},
        // 插入文档
        // 长度必须大于0
        insert: function( records , func ){
            if( records.length <= 0){
                console.error("插入文档不能为空");
                return;
            }

            if( func ){ this.replaceRecords( records , func ); }
            this.records = this.records.concat( records );;
            this.trigger( 'insert',records );
        },

        // 更新单条数据
        // 默认 item进行extend 
        // properties 进行 === 辨别 所以 '23' 和 23 是不一样的
        // 如果 bool == true item进行全局替换 
        update: function( properties , item , bool ){
            var records = this.records;
            var index = _.findIndex( records , properties );

            if( index == -1){
                //console.error("查找不到指定条件的数据");
                return false;
            }

            var newItem;
            if(!bool){
                newItem = _.extend( {}, records[index], item )
            }
            records[index] = newItem;

            this.trigger('update', index , newItem , item );
        },

		all: function(){
			return this.records;
		},

		clear: function(){
			this.records = [];
			this.trigger('clear');
			return this;
		}
	})

	/*
	 * Class Center
	 * 数据驱动
	 */
	var Center = MClass(Event).include({
		init: function(attrs) {
			this.attrs = attrs || {};

			//初始化时有view 则覆盖类默认的view
			if( this.attrs['view'] ){
				this.view = this.attrs['view'];
			}

			this._initView();
			this._initElements();
			this._initEvents();
			this._initDuplexing();
		},

		//初始化dom元素
		_initView: function() {
			var me = this;
			var view = this.view || '<div>';
			me.$view = $(view);
		},

		//绑定dom元素
		_initElements: function() {
			var me = this;

			var elements = me.elements;
			if(!elements) return me;

			for(var key in elements){
				me['$' + me.elements[key]] = me.$(key);
			}
		},

		//绑定View dom事件
		_initEvents: function() {
			var me = this;
			var events = me.events;

			var eventSplitter = /^(\w+)\s*(.*)$/;

			if (!events) return me;

			for (var key in events) {

				var method = events[key];
				if ((typeof method) != 'function')
					method = me[method];
				if (!method)
					continue;

				/**
				 * method为循环外层的引用
				 * 循环中的函数取method会取到最终的值
				 * 将method以参数形式传入 能保存为临时值
				 * todo why?
				 */
				/**
                 @试试这种写法
				var bindMethod=(function(){
					var temp=method;
					return function(){temp.apply(me,arguments)};
				})()
				*/

				//防止冒泡到body
				var bindMethod = (function(method) {
					var temp=method
					return function(){temp.apply(me, arguments)};
				})(method);

				var match = key.match( eventSplitter );
				var eventName = match[1],
					selector = match[2];

				if (selector === '') {
					me.$view.on(eventName, bindMethod);
				} else {
					me.$view.on(eventName, selector, bindMethod);
				}
			}

			//防止事件冒泡到body
			me.$view.on('click',function(e){
				e.stopPropagation();
			})
		},

		//////////////////
		//
		//   双向绑定
		//	 初始化一个model
		//   view -> model 的起始主要是 各input的 change事件
		//   model -> view 的起始 是 model的set 事件
        //   初始扫描各input dom 并将input的值传递入model   
        //
        ///////////////////////

		_initDuplexing: function(){
			var me = this;

			if ( !me.model ) {
				me.model = new Model;
			};
			me.$doms = me.$view.find('[ce-model]');

			//有双向绑定声明的 进行双向绑定
			if( me.$doms.length > 0 ){


				//遍历元素并注册事件
				//遍历到的元素会将初始值set入model
				//当发生 用户触发的改变事件时 会触发inputchange model.set(key,value)
				me.$doms.each(function(){
					var element = this,
						$element = $(element),
						key = $element.attr('ce-model');

					//file类型 直接返回
					if( element.type == 'file' ){
						return;
					}


					me.model.set( key, me._getValue( element ) );

					//toto blur事件可以去掉
					//input  监听input的变化
					//change 监听select的变化
					$element.on('input change blur',function(){
						me.model.set( key, me._getValue( element ) );
					});

					//IE9下input事件不支持 回退 和 粘贴
					//通过监听keyup事件 支持回退 但是依然不支持粘贴
					//todo 如何支持粘贴???????????
					if(document.documentMode === 9 ){

						$element.on('keyup',function(){
							me.model.set( key, me._getValue( element ) );
						});
					}
				});



				//model change的时候改变dom的值
				// todo dom改变时 model -> dom 的更新已经完成
				// dom的改变 最好不要触发change等事件 以防再次set model
				me.model.on('change',function( key,value ){
					var $targets = me.$doms.filter('[ce-model="'+key+'"]');



					$targets.each(function(){
						var element = this,
							$element = $(element);

						var oldvalue = me._getValue( element );
						if( value !== oldvalue ){
							me._setValue(element,value);
						};
					})
				});
			}


			//进行数组绑定 数组是单向绑定的
			//对collection进行的数组层面的改变 都会反应到视图层面
			me.$_arraydoms = me.$view.find('[ce-collection]');
			if( me.$_arraydoms.length > 0 ){
				me.$_arraydoms.each(function(){
					var $this = $(this);

					var key = $this.attr('ce-collection'),      //  数组名字
						html =  $this.html(),              	    //  页面模板
						//htmlTem = _.template( "<%=item.accountName%>" );  			//  编译后的模板
						htmlTem = _.template( util.html_decode( html ) );

					$this.empty();  							//  清除模板数据
					$this.css({'visibility':'visible'});

					//根据名字生成一个collection
					me[key] = new M.Collection;

					//重新加载
					me[key].on('reload',function(){
						var content = me[key].all();
						var htmlstr = ''

						//为空时触发事件
						if( content.length > 0 ){
							content.forEach(function( item ){
								htmlstr = htmlstr + htmlTem({'item':item});
							})
							$this.html( htmlstr );
						}else{
							$this.html( htmlstr );
							me.trigger('empty:' + key );
						}
					});

					//清空
					me[key].on('clear',function(){
						$this.empty();
					})

				});
			}
		},

		/**
		 *
		 * 扫描view中需要双向绑定的dom元素
		 *
		 *
		 *
		 */
		_registerBingdings: function( el ){

			var me = this;
			var el = el || me.$view;
			var selector = "[ce-model]";
			me._bindings = {};

			var elements = el.find( selector );
			for(var i=0; i<elements.length; i++){
				var element = elements[i];
				//todo todo
				//todo todo
			}
		},

		//todo
		_getOptions: function( element ){
			var me = this;

			//todo
			//todo
			//todo
			//todo
			//todo
		},

		/**
		 *
		 * 获取当前element元素的scope链
		 * 如果父节点有[ce-scope-break]属性 不往上查找
		 * 如果本身含有[ce-scope-break]则没有scope链
		 */
		_getScope: function( element ){
			var me = this;

			var $element = $(element),
				scopeAttr = "ce-scope",
				scopeBreakAttr = "ce-scope-break",
				scopes = [],
				scope = "";

			var parentsSelector = "[" + scopeBreakAttr + "],[" + scopeAttr + "]";
			var $parents = $element.parents(parentsSelector);

			//遍历查找父元素的scope属性
			for(var i=0;i<$parents.length;i++){
				var $el = $parents.eq(i);
				if( $el.attr( scopeBreakAttr ) ){ break; }
				var attr = $el.attr(scopeAttr);
				scopes.unshift(attr);
			}

			if( $element.attr(scopeAttr) ){ scopes.push( $(element).attr(scopeAttr) ) }
			if( $element.attr(scopeBreakAttr) ){ scopes = []; }

			scope = _.compact(scopes).join('.');

			return scope;
		},


		/**
		 *
		 * 给相关dom元素 赋值或属性
		 * 如果 value 和 原来的value 一样
		 * 则不赋值
		 */
		_setValue: function( element , value ){
			var $element = $( element );
			var tagName = element.tagName;

			switch ( tagName ){
				case 'SELECT':
					$element.val( value );
				break;
				case 'TEXTAREA':
					$element.val( value );
				break;
				case 'INPUT':
					var type = element.type;
					if( type == 'text' || type == 'password' ){
						$element.val( value );
					}else if( type == 'checkbox' || type == 'radio' ){

						//todo
						//改为和wayjs一样的写法
						element.checked = value;
					//其他类型 如 number date
					}else if( type == 'file' ){
						//
					}else{
						$elemnt.val( value );
					}
				break;
				default:
					$element.text( value );
				break;
			}
		},

		/**
		 *
		 * 获取相关dom元素绑定的值
		 *
		 */
		_getValue: function( element ){
			var $element = $( element );
			var tagName = element.tagName;

			switch( tagName ){
				case 'SELECT':
					return $element.val();
				break;
				case 'INPUT':
					var type = element.type;
					if( type == 'text' || type == 'password'){
						return $element.val();
					}else if( type == 'checkbox' || type == 'radio' ){

						//todo
						return element.checked;
					}else if( type == 'file'){
						//
					}else{
						return $element.val();
					}
				break;
				case 'TEXTAREA':
					return $element.val();
				break;
				default:
					return $element.text();
				break;
			}
		},

		//view内查找元素
		$: function(selector) {
			return this.$view.find(selector);
		},

		//留给子类覆盖 渲染至wrapper函数
		render: function() {},

		//NULL 移除窗口中的View
		//todo 清除注册的事件
		remove: function() {
			this.$view.remove();
		},

		//显示
		show: function() {
			this.$view.show();
		},
		//隐藏
		hide: function() {
			this.$view.hide();
		},
		//获取属性值
		get: function( key ){
			return this.attrs[key];
		},
		//设置属性值
		set: function( key,value ){
			this.attrs[key] = value;
			return this;
		}
	})



	////////////////////////////////////////
	//
	// json操作函数
	// key传 以.分割的字符串
	//
	//
	////////////////////////////////////////
	var deepJSON = function (obj, key, value, remove) {

		//???第一个正则的意义???
		var keys = key.replace(/\[(["']?)([^\1]+?)\1?\]/g, '.$2').replace(/^\./, '').split('.'),
				root,
				i = 0,
				n = keys.length;

		// Set deep value
		// 姐妹元素不影响 只影响当前元素的各子元素
		if (arguments.length > 2) {

			root = obj;
			n--;

			//如果要设置的key不存在 则创建新的object
			while (i < n) {
				key = keys[i++];
				obj = obj[key] = _w.isObject(obj[key]) ? obj[key] : {};
			}

			if (remove) {
				if (_w.isArray(obj)) {
					obj.splice(keys[i], 1);
				} else {
					delete obj[keys[i]];
				}
			} else {
				obj[keys[i]] = value;
			}

			value = root;

		// 获取值???????
		// Get deep value
		} else {
			while ((obj = obj[keys[i++]]) != null && i < n) {};
			value = i < n ? void 0 : obj;
		}

		return value;
	}


	/***
	 *
	 * __json
	 */
	var _json = {}

	_json.VERSION = '0.1.0';
	_json.debug = true;

	/***
	 *
	 * 抛出异常
	 * 非调试情况下直接返回
	 */
	_json.exit = function(source, reason, data, value) {

		if (!_json.debug) return;

		var messages = {};
		messages.noJSON = "Not a JSON";
		messages.noString = "Not a String";
		messages.noArray = "Not an Array";
		messages.missing = "Missing argument";

		var error = { source: source, data: data, value: value };
		error.message = messages[reason] ? messages[reason] : "No particular reason";
		console.log("Error", error);
		return;

	}

	/***
	 *
	 * 判断是否是json对象
	 */
	_json.is = function(json) {

		return (toString.call(json) == "[object Object]");

	}

	_json.isStringified = function(string) {

		var test = false;
		try {
			test = /^[\],:{}\s]*$/.test(string.replace(/\\["\\\/bfnrtu]/g, '@').
			replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
			replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
		} catch (e) {}
		return test;

	}

	//get
	_json.get = function(json, selector) {

		if (json == undefined) return _json.exit("get", "missing", "json", json);
		if (selector == undefined) return _json.exit("get", "missing", "selector", selector);
		if (!_w.isString(selector)) return _json.exit("get", "noString", "selector", selector);
		return deepJSON(json, selector);

	};

	//set value 如果value为空 则移除
	_json.set = function(json, selector, value) {

		if (json == undefined) return _json.exit("set", "missing", "json", json);
		if (selector == undefined) return _json.exit("set", "missing", "selector", selector);
		if (!_w.isString(selector)) return _json.exit("set", "noString", "selector", selector);
		return value ? deepJSON(json, selector, value) : _json.remove(json, selector);
		// return deepJSON(json, selector, value); // Now removes the property if the value is empty. Maybe should keep it instead?

	};

	//删除 key 上的值
	_json.remove = function(json, selector) {

		if (json == undefined) return _json.exit("remove", "missing", "json", json);
		if (selector == undefined) return _json.exit("remove", "missing", "selector", selector);
		if (!_w.isString(selector)) return _json.exit("remove", "noString", "selector", selector);
		return deepJSON(json, selector, null, true);

	}

	//array push
	_json.push = function(json, selector, value, force) {

		if (json == undefined) return _json.exit("push", "missing", "json", json);
		if (selector == undefined) return _json.exit("push", "missing", "selector", selector);
		var array = _json.get(json, selector);
		if (!_w.isArray(array)) {
			if (force) {
				array = [];
			} else {
				return _json.exit("push", "noArray", "array", array);
			}
		}
		array.push(value);
		return _json.set(json, selector, array);

	}

	//array unshift
	_json.unshift = function(json, selector, value) {

		if (json == undefined) return _json.exit("unshift", "missing", "json", json);
		if (selector == undefined) return _json.exit("unshift", "missing", "selector", selector);
		if (value == undefined) return _json.exit("unshift", "missing", "value", value);
		var array = _json.get(json, selector);
		if (!_w.isArray(array)) return _json.exit("unshift", "noArray", "array", array);
		array.unshift(value);
		return _json.set(json, selector, array);

	}

	//??
	_json.flatten = function(json) {

		if (json.constructor.name != "Object") return _json.exit("flatten", "noJSON", "json", json);

		var result = {};
		function recurse (cur, prop) {
			if (Object(cur) !== cur) {
				result[prop] = cur;
			} else if (Array.isArray(cur)) {
				for (var i = 0, l = cur.length; i < l; i++) {
					recurse(cur[i], prop ? prop + "." + i : "" + i);
					if (l == 0) result[prop] = [];
				}
			} else {
				var isEmpty = true;
				for (var p in cur) {
					isEmpty = false;
					recurse(cur[p], prop ? prop + "." + p : p);
				}
				if (isEmpty) result[prop] = {};
			}
		}
		recurse(json, "");
		return result;

	}

	//??
	_json.unflatten = function(data) {

		if (Object(data) !== data || Array.isArray(data))
			return data;
		var result = {}, cur, prop, idx, last, temp;
		for (var p in data) {
			cur = result, prop = "", last = 0;
			do {
				idx = p.indexOf(".", last);
				temp = p.substring(last, idx !== -1 ? idx : undefined);
				cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
				prop = temp;
				last = idx + 1;
			} while(idx >= 0);
			cur[prop] = data[p];
		}
		return result[""];

	}

	//通过字符串打印json对象
	_json.prettyprint = function(json) {

		return JSON.stringify(json, undefined, 2);
	}

	win.MClass = MClass;
	win.M = {
		'Event': Event,
		'Model': Model,
		'Collection': Collection,
		'Center': Center
	}

}.call(this, _, Backbone));