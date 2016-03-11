/**
 * 组件：h5 图片模块
 * @html h5.html
 */
define(function(require, exports, module){

	var contentStr = require('./orderinfo.html');
		
	/* new 对象是传递的参数;
    this.data = opts.data || {}; //基本信息数据
    this.editFlag = opts.editFlag || false; //是否可编辑参数
	this.type = opts.type || 'common'; // common-普通审批，special-特殊审批*/;
    
	var View = MClass( M.Center ).include({
		view: contentStr,
		events:{

		},
		elements: {

		},
		init: function(){
			View.__super__.init.apply( this,arguments );
			var me = this;

			//显示基本信息模块
			me.render();

		},

		//显示
		render: function(){
			var me = this;
			me.attrs['wrapper'].html( me.$view );

		},
		//数据渲染显示
		setValue:function(){
			var me = this;
		},
		//检测是否可编辑
		checkEdit:function(editFlag){
			var me = this;

		},
		//对外获取文本框值
		getValue:function(){
			var me = this;
			return {};
		},
		//检测数据有效和必填项
		checkVaild:function(){
			var me = this;
		}
		
	});

	module.exports = View;

});