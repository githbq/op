/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

	var IBSS = window.IBSS,
        TPL = IBSS.tpl;
		
	var Slider = require('common/widget/slider/slider');
	 var AreaTree = require('module/areatree/areatree');

	var contentStr = require('./detailapproval.html');

    /////////////////
    //
    //  查看审批详情
    /////////////////
	var DetailApproval = MClass( Slider ).include({

		content: contentStr,

		defaultAttr: {
			'width': 730
		},

		elements: {
		
		},

		events:{
			
		},

		
		init: function(){
			DetailApproval.__super__.init.apply( this,arguments );
			var me = this;
			
			//选择区域模块

            me.areaTree = new AreaTree();
            me.areaTree.on('selectarea',function( treenodes ){
                
                me.$filingRegion.val( treenodes[0]['name'] ).attr('data-code', treenodes[0]['code'] );
            });

		},

		//设置状态
		setState: function(){
			var me = this;

			me.$('.state').hide();
			

			if( me.attrs.canCancel == 'true' ){
				me.$('.state-cancel').show()
				me.$statusDisabled.attr('disabled','disabled');
			}
			if( me.attrs.canCancel == 'false' ){
				me.$statusDisabled.attr('disabled','disabled');
			}
			if( me.attrs.isCurrentTask  == 'true' ){
				me.$('.state-current').show();
				me.$statusDisabled.removeAttr('disabled');
				
				
				//me.$lookCard.hide()
				me.$upCard.show();
				me.$upCardAdd.hide();
			}else if( me.attrs.isCurrentTask  == 'true' && me.attrs.type  == 'addPurchaseApproval' ){
				me.$statusDisabled.attr('disabled','disabled');
				me.$statusDisabledAdd.removeAttr('disabled');
				me.$('.state-current').show();
				me.$upCardAdd.show();
				me.$upCard.hide();
			}else{
				me.$statusDisabled.attr('disabled','disabled');
		
				me.$statusDisabledAdd.attr('disabled','disabled');
			}
			if( me.attrs.isCurrentTask  == 'true'){
				me.$refuseDisabled.removeAttr('disabled');
				
			}
			me.setType();
		},
		//根据申请类型不同显示不同的信息
		setType: function(){
			var me = this;

		},

		/**
		 *
		 *撤销审批
		 */
		 //选择区域
        regionEve: function(){
            var me = this;
            me.areaTree.show();
        },

		backoutEve: function(){
			var me = this;

			me.$actionResend.text('提交中....');
			me.$actionResend.attr('disabled','disabled');
			me.$actionSave.text('提交中....');
			me.$actionSave.attr('disabled','disabled');
			me.$actionBackout.text('提交中....');
			me.$actionBackout.attr('disabled','disabled');
			util.api({
				'url': '~/op/api/approval/withdrawapproval',
				'data':{
					'processInstanceId': me.attrs.id
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						util.showTip('撤销成功');
						me.trigger( 'saveSuccess');
						me.$statusDisabled.removeAttr('disabled');
						me.attrs.canCancel = 'false';
						me.attrs.isCurrentTask = 'true';
						me.setState();
					}
				},
				'complete': function(){
					me.$actionResend.text('保存提交');
					me.$actionResend.removeAttr('disabled');
					me.$actionSave.text('保存');
					me.$actionSave.removeAttr('disabled');
					me.$actionBackout.text('撤销审批');
					me.$actionBackout.removeAttr('disabled');
				}
			})
		},

		/**
		 *
		 *保存提交
		 */
		resendEve:function(){
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
			me.attrs.options = options||{};

			
			DetailApproval.__super__.show.apply( this,arguments );
		},
		//根据定单类型区分设置
		sortType:function(){
			var me = this;
			switch( me.attrs.options )
			{
				case 1: case 13:

					break;
				case 2: case 14:

					break;
				case 3:case 15:

					break;
				case 4:case 16:

					break;
				case 5:

					break;
				case 6:

					break;
				case 7:

					break;
				case 8:

					break;
				case 9:

					break;
				case 10:

					break;
				case 11:

					break;
				case 12:

					break;
				default:
			}
		},
		//根据不同类型获取数据
		getData:function(){
			var me = this; 
			
		},
		//判断审批类型
		judgeType:function(){
			
			var me = this;
		},
		//判断是否可以编辑状态：
		checkEdit:function(){
			
		},
		//设置自己部分的显示和隐藏：
		setState:function(){
			
			
		},

		//驳回
        rejectEve: function(){
            var me = this;

            if( !me.model.get('comment') ){
                util.showToast('请填写意见');
                return;
            }
            var bool = confirm("确认驳回此条审批吗?");
            if( bool ){
				me.$actionAgree.text('提交中....');
				me.$actionAgree.attr('disabled','disabled');
				me.$actionResend.text('提交中....');
				me.$actionResend.attr('disabled','disabled');
                util.api({
                    'url': '~/op/api/approval/directapprove',
                    'data':{
                        'processInstanceId': me.attrs.processInstanceId,   //流程实例ID
                        'approved': false,                  //审批结果(通过/拒绝)
                        'opinion': me.model.get('comment')  //审批意见
                    },
					'button': {
						'el': me.$actionReject,
						'text':'提交中......'
					},
                    success: function( data ){
                        console.warn( data );
                        if( data.success ){
                            util.showTip('批复成功');
                            me.hide();
                            me.trigger('success');
                        }
                    },
					complete: function(){
						me.$actionAgree.text('同意');
						me.$actionAgree.removeAttr('disabled');
						me.$actionResend.text('保存通过');
						me.$actionResend.removeAttr('disabled');
					}
                })
            }
        },

        //同意
        agreeEve: function(){
            var me = this;

            if( !me.model.get('comment') ){
               // util.showToast('请填写意见');
                //return;
            }
            var bool = confirm("确认同意此条审批吗?");
            if( bool ){
				me.$actionReject.text('提交中....');
				me.$actionReject.attr('disabled','disabled');
				me.$actionResend.text('提交中....');
				me.$actionResend.attr('disabled','disabled');
                util.api({
                    'url': '~/op/api/approval/directapprove',
                    'data':{
                        'processInstanceId': me.attrs.processInstanceId,     //流程实例ID
                        'approved': true,                     //审批结果(通过/拒绝)
                        'opinion': me.model.get('comment')    //审批意见
                    },
					'button': {
						'el': me.$actionAgree,
						'text':'提交中......'
					},
                    success: function( data ){
                        console.warn( data );
                        if( data.success ){
                            util.showTip('批复成功');
                            me.hide();
                            me.trigger('success');
                        }
                    },
					complete: function(){
						me.$actionReject.text('驳回');
						me.$actionReject.removeAttr('disabled');
						me.$actionResend.text('保存通过');
						me.$actionResend.removeAttr('disabled');
					}
                })
            }
        },
		
		//重新发送
		hide: function(){
			var me = this;
			this.remove();
			DetailApproval.__super__.hide.apply( this,arguments );
		}
	});
        
	module.exports = DetailApproval;
});
