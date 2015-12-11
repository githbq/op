/**
 * @file
 * 所有组件遵循cmd规范
 * 所有组件都应扩展子widget
 */
define('common/widget/slider/slider', function(require, exports, module) {
	
	var win = window,
		doc = win.document;

	var Slider = Widget.extend({
		
		attrs: {
			width: 	 460,
			title: 	 '',
			content: '',
			cls:     '',
			btns:    ['确定', '取消']
		},
		
		events: {
			'click .enter': '_enter',
			'click .cancel': '_cancel',
			'click .close': '_close'
		},

		_enter: function() {
			this.trigger('enter');
			return false;
		},
		
		_close: function() {
			this.trigger('close');
			this.hide();
			return false;
		},

		_cancel: function() {
			this.trigger('cancel');
			this.hide();
			return false;
		},
		
		sliderShow: function(callBack) {
			var $el = this.$el;
			if ($el.hasClass('amt-sliderightout')) {
				$el.hide().removeClass('amt-sliderightout');
				clearTimeout($el[0].tmd);
			}
			console.log( 'show' );
			$el.addClass('amt-sliderightin').show();
			$el[0].tms = setTimeout(function() {
				$el.removeClass('amt-sliderightin');
				callBack && callBack();
			}, 400);
		},
		
		sliderHide: function(callBack) {
			var $el = this.$el;
			console.log( 'hide' );
			if ($el.hasClass('amt-sliderightin')) {
				$el.removeClass('amt-sliderightin');
				clearTimeout($el[0].tms);
			}		
			$el.addClass('amt-sliderightout');
			$el[0].tmd = setTimeout(function() {
				$el.hide().removeClass('amt-sliderightout');
				callBack && callBack();
			}, 300);	
		},
		
		show: function() {
			var that = this;
			if (this.$el.is(':hidden')) {
				that.sliderShow();
				return;
			}
			that.sliderHide(function() {
				that.sliderShow();
			});
		},
		
		hide: function() {
			this.sliderHide();
		},
		
		/**
		 * @desc 设置内容
		 */
		setCon: function(html) {
			this.$el.find('.con').html(html);
			return this;
		},

		/**
		 * @desc 创建弹框元素
		 */
		_creatDom: function() {
			var attrs = this.attrs;
			var $dom = $([
					'<div class="inner">',
						'<h3>' + attrs.title + '</h3>',
						'<div class="con-b">',
							'<div class="con">' + attrs.content + '</div>',
							'<div class="btns-b"></div>',
						'</div>',
						'<span class="close">×</span>',
					'</div>'
				].join(''));

			_.each(attrs.btns, function(btn, index) {
				var cls = (index == 0) ? 'g-btn enter' : 'g-btn2 cancel';
				var $btn = $('<a class="' + cls + '">'+ btn +'</a>');
				$dom.find('.btns-b').append($btn);
			});
			
			return $dom;
		},
		

		/**
		 * @desc 初始化
		 */		
		setup: function() {
			var cls = 'ui-slider';
			if (this.attrs.cls) {
				cls += ' ' + this.attrs.cls;
			}
			this.$el.addClass(cls);
			
			this.render();
		},
		
		/**
		 * @desc 添加弹框到页面中去
		 */			
		render: function () {
			var that = this,
				$el = this.$el,
				attrs = this.attrs
				$dom = this._creatDom();
				
			if (attrs.title == '') {
				$dom.find('h3').remove();
				$el.addClass('ui-slider-notit');
			}
			
			$el.css('width', attrs.width);
			$el.append($dom);
			$el.appendTo($('body'));
			
			$(doc).on('click', function(e) {
				if ($(e.target).closest('.ui-slider').length == 0) {
					that.hide();
				}
			});			
		}
	});
	
	module.exports = Slider;
});
