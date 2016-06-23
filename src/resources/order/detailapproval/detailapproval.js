//
// 新购 增购/续费 
// 调用slider
//============================================
define( function(require, exports, module){

	var IBSS = window.IBSS,
        TPL = IBSS.tpl;
		
	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./detailapproval.html');

    ///////////////////////
    //
    //  新购 增购/续费
    //  审批详情
    ///////////////////////
	var DetailApproval = MClass( Slider ).include({

		content: contentStr,

		defaultAttr: {
			'width': 1300
		},
		elements: {
		},
		events:{
		},
		init: function(){
			DetailApproval.__super__.init.apply( this,arguments );
			var me = this;
		},

		/**
		 *
		 * @param id   实例id
		 * @param eid  企业id
		 * @param type 类型
		 */
		show: function( options ){
			var me = this;
			DetailApproval.__super__.show.call( this,true );
		},
		//重新发送
		hide: function(){
			var me = this;
			DetailApproval.__super__.hide.apply( this,arguments );
		}
	});
        
	module.exports = DetailApproval;
});
