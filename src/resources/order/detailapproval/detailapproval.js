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
			'.action-agree': 'agree',
			'.action-refuse': 'refuse'
		},
		events:{
			'click .approval-title span': 'toggleEve',
			'click .action-agree': 'agreeEve',
			'click .action-refuse': 'refuseEve'
		},
		init: function(){
			DetailApproval.__super__.init.apply( this,arguments );
			var me = this;
		},
		//状态变换
		setState: function(){
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
		// @param info  一些额外信息
		//==============================================
		show: function( id , type , info ){
			var me = this;
			DetailApproval.__super__.show.call( this,true );
			console.log('dododo');

			//缓存额外信息
			me.info = info;
			//审批只读
			if( type == 'c' ){

				me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), orderId:id, readonly:true} );
				me.approvalPage.hideTopBar();
				me.approvalPage.hideFootBtns();
			//订单查看
			}else if( type == 'a' ){

			//补充合同
			}else if( type == 'b' ){

			}
			me.approvalPage.render();
		},

		//校验 合同审核 审批意见
		verify: function(){
			var me = this;
			if(!me.model.get('contractState') && (me.model.get('contractState')!==0) ){
				util.showToast('请选择合同审核是否合格!');
				return false;
			}
			return true;
		},
		//同意
		agreeEve: function(){
			var me = this;
			if( me.verify() ){
				util.api({
	                'url': '~/op/api/approval/directapprove',
	                'data':{
	                    'processInstanceId': me.info.processInstanceId,   //流程实例ID
	                    'approved': true,                  				//审批结果(通过/拒绝)
	                    'opinion': me.model.get('comment'),  			//审批意见
	                    'contractState': me.model.get('contractState'), //是否合格
	                    'rejectReason': me.model.get('rejectReason')   	//不合格原因
	                },
					'beforeSend':function(){
						me.$agree.attr('disabled').text('提交中')
						me.$refuse.attr('disabled');
					},
	                success: function( data ){
	                    console.warn( data );
	                    if( data.success ){
	                        util.showTip('批复成功');
	                        me.hide();
	                        me.trigger('saveSuccess');
	                    }
	                },
					complete: function(){
						me.$agree.removeAttr('disabled').text('同意');
						me.$refuse.removeAttr('disabled');
					}
	            })
			}
		},
		//驳回
		refuseEve: function(){
			var me = this;
			if(!me.model.get('comment')){
				util.showToast('请填写审批意见');
				return false;
			}
			if( me.verify() ){
				util.api({
	                'url': '~/op/api/approval/directapprove',
	                'data':{
	                    'processInstanceId': me.info.processInstanceId, //流程实例ID
	                    'approved': false,                  		    //审批结果(通过/拒绝)
	                    'opinion': me.model.get('comment'),  			//审批意见
	                    'contractState': me.model.get('contractState'), //是否合格
	                    'rejectReason': me.model.get('rejectReason')   	//不合格原因
	                },
					'beforeSend':function(){
						me.$agree.attr('disabled');
						me.$refuse.attr('disabled').text('提交中');
					},
	                success: function( data ){
	                    console.warn( data );
	                    if( data.success ){
	                        util.showTip('批复成功');
	                        me.hide();
	                        me.trigger('saveSuccess');
	                    }
	                },
					complete: function(){
						me.$agree.removeAttr('disabled');
						me.$refuse.removeAttr('disabled').text('驳回');
					}
	            })
			}
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
