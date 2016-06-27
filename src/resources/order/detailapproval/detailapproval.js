//
// 新购 增购/续费 合同审批
// 调用slider
//============================================
define( function(require, exports, module){

	var IBSS = window.IBSS,
        TPL = IBSS.tpl;
		
	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./detailapproval.html');
	var Page = require('../../testng/enterprisedetail/enterprisedetailmodule');


    ///////////////////////
    //
    //  新购 增购/续费
    //  审批详情
    ///////////////////////
	var DetailApproval = MClass( Slider ).include({

		content: contentStr,

		defaultAttr: {
			'width': 1100,
			'title': '订单详情'
		},
		elements: {
		},
		events:{
			'click .approval-title span': 'toggleEve'
		},
		init: function(){
			DetailApproval.__super__.init.apply( this,arguments );
			var me = this;
		},
		
		//切换内部页面
		toggleEve: function(e){
			var me = this;
			var $target = $(e.currentTarget);
			$target.addClass('active').siblings().removeClass('active');

			var index = $target.attr('data-index');
			console.log( index );

			me.approvalPage.goToStep(index);
		},
		//
		// @param id   	订单id 
		// @param type  a 订单查看  b 补充合同  c 审批只读
		//==============================================
		show: function( id , type ){
			var me = this;
			DetailApproval.__super__.show.call( this,true );
			console.log('dododo');
			me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), orderId:id, readonly:false} );
			me.approvalPage.render();
		},
		//重新发送
		hide: function(){
			var me = this;
			me.$view.find('.approval-content').empty();
			DetailApproval.__super__.hide.apply( this,arguments );
		}
	});
        
	module.exports = DetailApproval;
});
