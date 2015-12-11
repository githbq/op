define(function(require, exports, module){
	
	var dialogTpl = require('./dialog.html');
	
	var $window = $(window);

	/*
	*@ 对话框基类
	*  生成一个dialog实例 会在body中增加dom元素 所以一定要执行remove函数 及时清除冗余数据
	*/
	var Dialog = MClass(M.Center).include({
		
		view: dialogTpl,
		content:'',            //内容html字符串
		defaultAttr:{
			'title':'',
			'width':500
		},
		
		init: function(attrs){
			var me = this;

			me.attrs = Dialog.merge( {} , me.defaultAttr ,attrs );

			me.$view = $(me.view);
			me.$view.find('.dialog-body').html( me.content );
			me.$view.find('.header-title').text(me.attrs['title']);
				
			me.$title = me.$view.find('.header-title');
			me.$main = me.$view.find('.m-dialog');
			me.$main.css({'width':me.attrs['width']});

			/**
			 *
			 * 向全局变量传递信息   页面switch时 会主动调用组件的destroy方法
			 * 同时对当前页面内元素进行权限校验
			 * 模板元素中涉及到权限的元素 如果可以显示 写行内样式让其显示
			 */
			IBSS && IBSS.trigger && IBSS.trigger('_addWidget', me);
			
			Dialog.__super__._initElements.apply( this , arguments );
			Dialog.__super__._initEvents.apply( this , arguments );
			Dialog.__super__._initDuplexing.apply( this , arguments );


			me.isRender = false;
			me._initDialogEvents(); 
		},

		_initDialogEvents: function(){
			var me = this;

			me.onResize = function(){
				me.resize();
			},

			$window.on('resize', me.onResize);
			me.$view.on('click','.header-close',function(){me.hide()});

			//点击遮罩不会隐藏
			/*
			me.$view.on('click',function(e){
				
				var $target = $(e.target);
				if($target[0] == me.$view[0]){

					me.hide();
				}
			})
			*/
		},

		//设置标题
		_setTitle: function( str ){
			this.$title.text( str );
		},

		//渲染
		render: function(){
			var me = this;

			$('body').append(me.$view);
			me.resize();
			me.isRender = true;
		},

		//显示
		show: function(){
			var me = this;
			if(!me.isRender){
				me.render();
			}
			me.$view.show();
		},

		//重新定位
		resize: function(){ 
			var me = this;

			var top  = ($window.height() - me.$main.height()) /3;

			top = (top < 0)? 0:top;
			me.$main.css({'top':top});
		},

		// 移除
		remove: function(){
			var me = this;

			Dialog.__super__.remove.apply(this,arguments);
			$window.off('resize',me.onResize);
		},

		destroy: function(){
			var me = this;

			this.remove();
		}

	});

	module.exports = Dialog;
});

