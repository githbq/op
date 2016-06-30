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

	var uploader = require('common/widget/upload').uploader;

	var getRejectReason = require('module/data/commonfunction').getRejectReason;

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
			'.action-refuse': 'refuse',

			'#hetong': 'hetong',			//合同input
			'#hetongfb': 'hetongfb',        //合同副本input
			'#hetongimg': 'hetongimg',      //合同img展示
			'#hetongfbimg': 'hetongfbimg',  //合同父辈img展示
			'.savehetong': 'savehetong'     //保存合同按钮
		},
		events:{
			'click .approval-title span': 'toggleEve',
			'click .action-agree': 'agreeEve',
			'click .action-refuse': 'refuseEve',
			'click .action-save': 'saveEve',            //重新编辑保存
			'click .savehetong': 'saveHetongEve'        //补充合同
		},
		init: function(){
			DetailApproval.__super__.init.apply( this,arguments );
			var me = this;

			me.contract = '';            	//合同图片
			me.contractFileName = '';    	//合同图片文件名称

			me.contractCopy = '';        	//合同图片副本
			me.contractCopyFileName = '';   //合同图片副本文件名称

			me.contractId = '';             //合同ID

			me.$hetong.on('change',function(){
				console.log('hetongchange');
				var fileExtension = me.$hetong[0].files[0].name.split('.').pop().toLowerCase();
				if( fileExtension == 'jpg' || fileExtension == 'gif' || fileExtension == 'png' || fileExtension == 'jpeg' ){
					me.$savehetong.attr('disabled','disabled');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$hetong[0].files,
						'options': {
							'limittype': 'IMAGE'
						},
						'success': function( response ){
							me.contract = response.value.model.path;
							me.contractFileName = response.value.model.FileName;
							me.$hetongimg.attr('src','/op/api/file/previewimage?filePath=' + response.value.model.path );
							me.$savehetong.removeAttr('disabled');
						},
						'error': function(){
							me.$savehetong.removeAttr('disabled');
						}
					})
				}

			});

			me.$hetongfb.on('change',function(){
				var fileExtension = me.$hetongfb[0].files[0].name.split('.').pop().toLowerCase();
				if( fileExtension == 'jpg' || fileExtension == 'gif' || fileExtension == 'png' || fileExtension == 'jpeg' ){
					me.$savehetong.attr('disabled','disabled');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$hetongfb[0].files,
						'options': {
							'limittype':'IMAGE'
						},
						'success': function( response ){
							me.contractCopy = response.value.model.path;
							me.contractCopyFileName = response.value.model.FileName;
							me.$hetongfbimg.attr('src','/op/api/file/previewimage?filePath=' + response.value.model.path );
							me.$savehetong.removeAttr('disabled');
						},
						'error': function(){
							me.$savehetong.removeAttr('disabled');
						}

					})
				}
			});

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
		// @param type  a 订单编辑查看(可编辑内容)  
		//				b 补充合同(可以补充合同)
		//				b1 补充合同(可审核);
		//				b2 补充合同(仅可查看); 
		//				c 审批只读(可进行审批同意或驳回) 
		//				d 完全只读状态 
		// @param info  一些额外信息
		//==============================================
		show: function( id , type , status , info ){
			var me = this;
			DetailApproval.__super__.show.call( this,true );
			console.log('dododo');

			//缓存额外信息
			me.orderId = id;
			me.status = status;
			me.info = info;

			switch( type ){

				//审批只读 [小助手/财务](可进行审批同意或驳回);
				case 'c':
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), orderId:id, readonly:true} );
					me.approvalPage.hideTopBar();
					me.approvalPage.hideFootBtns();
					me.$('[data-state="c"]').show();
				break;
				//订单查看  [销售]  (可进行编辑提交)
				case 'a':
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), orderId:id, readonly:false} );
					me.approvalPage.hideTopBar();
					me.approvalPage.hideFootBtns();
					me.$('[data-state="a"]').show();
				break;
				//补充合同  [销售]  (可以补充合同)
				case 'b':
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), orderId:id, readonly:true} );
					me.approvalPage.hideTopBar();
					me.approvalPage.hideFootBtns();
					me.$('[data-state="b"]').show();
				break;
				//只读状态  [小助手/财务/销售] (仅可查看)
				case 'd':
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), orderId:id, readonly:true} );
					me.approvalPage.hideTopBar();
					me.approvalPage.hideFootBtns();
				break;
			}

			me.approvalPage.render();
			me.getInfo();
		},
		//获取基本信息
		getInfo: function(){
			var me = this;
			
			//获取审批意见
			util.api({
				'url':'/odr/getRejectReason',
				'data':{
					'orderId': me.orderId
				},
				//'orderId': me.orderId,
				'success': function( data ){
					if( data.value.model ){
						me.$('#opinionlist').html( getRejectReason( data.value.model ) );
					}else{
						me.$('#opinionlist').html('<tr><td colspan="4"><p class="tip">暂无数据</p></td></tr>');
					}
				}
			});
			
			//获取到款信息
			util.api({
				'url':'/odr/getClaimedReceivedPay',
				'data':{
					'orderId': me.orderId
				},
				'success': function( data ){
					console.log('到款信息');
					console.log( data );
					if( data.value.model.length > 0 ){
						//me.daokuanlist.reload()
						me.$('#daokuanlist').html('<tr><td colspan="4"><p class="tip">暂无数据</p></td></tr>');
					}else{
						me.$('#daokuanlist').html('<tr><td colspan="4"><p class="tip">暂无数据</p></td></tr>');
					}	
				}
			});

			//获取补充合同信息
			if( me.status == 10 ){
				util.api({
					'url':'',
					'data':{
						'orderId': me.orderId
					},
					'success': function( data ){
						if( data.success ){
							me.$('.htshow').attr('src','/op/api/file/previewimage?filePath='+data.value.model.contract);
							me.$('.htfbshow').attr('src','/op/api/file/previewimage?filePath='+data.value.model.contractCopy);
						}
					}
				})
				me.$('.approval-contractshow').show();
			}
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
	                    'processInstanceId': me.info.processInstanceId, //流程实例ID
	                    'approved': true,                  				//审批结果(通过/拒绝)
	                    'opinion': me.model.get('comment'),  			//审批意见
	                    'contractState': me.model.get('contractState'), //是否合格
	                    'rejectReason': me.model.get('rejectReason')   	//不合格原因
	                },
					'beforeSend':function(){
						me.$agree.attr('disabled','disabled').text('提交中')
						me.$refuse.attr('disabled','disabled');
					},
	                success: function( data ){
	                    console.warn( data );
	                    if( data.success ){
	                        util.showTip('批复成功');
	                        me.hide();
	                        me.trigger('approvalSuccess');
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
						me.$agree.attr('disabled','disabled');
						me.$refuse.attr('disabled','disabled').text('提交中');
					},
	                success: function( data ){
	                    console.warn( data );
	                    if( data.success ){
	                        util.showTip('批复成功');
	                        me.hide();
	                        me.trigger('approvalSuccess');
	                    }
	                },
					complete: function(){
						me.$agree.removeAttr('disabled');
						me.$refuse.removeAttr('disabled').text('驳回');
					}
	            })
			}
		},
		//重新编辑保存
		saveEve: function(){
			var me = this;
			var data = me.approvalPage.getReturnData();

			var postData = {
				'odrDraftEnterprise': data.entInfo,
				'odrDraftOrder': data.productInfo,
				'odrDraftPaidInfo': data.payInfo,
				'orderId': me.orderId
			}

			//保存
			util.api({
				'url': '/odr/update',
				'data': {
					'vo': JSON.stringify( postData )
				},
				'success': function( data ){
					console.warn(data);
					if(data.success){
						util.showTip('保存成功');
						me.trigger('editSuccess');
						me.hide();
					}
				}
			})
			console.log(data);
		},
		//保存合同
		saveHetongEve: function(){
			var me = this;

			if( !me.contract ){
				util.showToast('请选择合同照片');
				return false;
			}
			if( !me.contractCopy ){
				util.showToast('请选择合同副本照片');
				return false;
			}

			console.log('savehetong');
			var data = me.approvalPage.getReturnData();

			//补充合同
			util.api({
				'url':'/odr/supContractSubmit',
				'data':{
					'contract': me.contract,
					'contractCopy': me.contractCopy,
					'contractFileName': me.contractFileName,
					'contractCopyFileName': me.contractCopyFileName,
					'contractId': data.payInfo.contractId
				},
				'success': function( data ){
					if( data.success ){
						util.showTip('提交成功');
						me.trigger('editSuccess');
						me.hide();
					}
				}
			})
			console.log( data );
		},
		//重新发送
		hide: function(){
			var me = this;
			me.$view.find('.approval-content').empty();
			me.$('[data-state]').hide();
			DetailApproval.__super__.hide.apply( this,arguments );
			me.remove();
		}
	});
        
	module.exports = DetailApproval;
});
