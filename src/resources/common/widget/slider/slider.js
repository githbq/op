define(function(require, exports, module){
	
	var sliderTpl = require('./slider.html');
	
	var $window = $(window);

	/*
	*@ Slider基类 
	*
	*/
	
	var Slider = MClass(M.Center).include({
		
		view: sliderTpl,
		content:'',            //内容html字符串
		defaultAttr:{
			'title':'',
			'width':500
		},
		
		init: function(attrs){
			var me = this;

			me.attrs = Slider.merge( {} , me.defaultAttr ,attrs );

			me.$view = $(me.view);
			me.$view.find('.slider-body').html( me.content );
			me.$view.find('.header-title').text(me.attrs['title']);
			me.$view.css({'width':me.attrs['width']});

			/**
			 *
			 * 向全局变量传递信息   页面switch时 会主动调用组件的destroy方法
			 * 同时对当前页面内元素进行权限校验
			 * 模板元素中涉及到权限的元素 如果可以显示 写行内样式让其显示
			 */
			IBSS && IBSS.trigger && IBSS.trigger('_addWidget', me);
			
			Slider.__super__._initElements.apply( this , arguments );
			Slider.__super__._initEvents.apply( this , arguments );
			Slider.__super__._initDuplexing.apply( this , arguments );

			me.isRender = false;
			me.isShow = false;

			me._initSliderEvents();
		},

		_initSliderEvents: function(){
			var me = this;
			me.$view.on('click','.header-close',function(){me.hide()});

			//body 事件注册
			//body 点击时会隐藏slider
			//$('body').on('click',function(e){
			//	if ($(e.target).closest('.m-slider').length == 0) {
			//		me.hide();
			//	}
			//});
		},

		//设置标题
		_setTitle: function( title ){
			this.$view.find('.header-title').text( title );
		},

		render: function(){
			var me = this;

			$('body').append(me.$view);
			me.isRender = true;
		},

		//显示 滑动效果
		show: function(){
			var me = this;
			if(!me.isRender){
				me.render();
			}

			if( me.isShow === true ) return;

			me.$view.show();
			var width = parseInt( me.attrs['width'] );
			me.isShow = true;
			me.$view.css('right', -width).animate({'right':0},200);
		},

		//隐藏 滑动效果
		hide: function(){
			var me = this;

			if( me.isShow === false ) return;

			var width = parseInt( me.attrs['width'] );
			me.isShow = false;
			me.$view.animate({'right':-width},200,function(){
				me.$view.hide();
			});
		},

		// 移除
		remove: function(){
			Slider.__super__.remove.apply(this,arguments);
		},

		destroy: function(){
			this.remove();
		}

	});

	module.exports = Slider;
});

