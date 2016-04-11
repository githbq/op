/**
 * 组件：h5 图片模块
 * @html h5.html
 */
define(function(require, exports, module){
	
	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./cotractmoney.html');
	
	var AddEnt = MClass( M.Center ).include({
		view: contentStr,
		/*
		defaultAttr:{
			'title': '添加企业',
			'width': 680
		},
		*/
		events:{

		},
		elements: {
			'.payStatus-select':'payStatusSelect',
			'.stage-box':'stageBox',
			'.app-box':'appBox',
			'.sub-app':'subApp',
			'.payDate':'payDate'
		},
		init: function(){
			AddEnt.__super__.init.apply( this,arguments );
			var me = this;


			//显示基本信息模块
			me.render();
		},

		//显示
		render: function(){
			var me = this;
			me.attrs['wrapper'].html( me.$view );
			
		}
		
		
	});

	module.exports = AddEnt;

});