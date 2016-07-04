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
			'#hetongfbimg': 'hetongfbimg',  //合同副本img展示
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

			if( me.attrs.isTop ){
				me.$view.css( {"z-index":3000} );
			}
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
							me.$hetongimg.attr('src','/op/api/file/previewimage?filePath=' + response.value.model.path ).show();
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
							me.$hetongfbimg.attr('src','/op/api/file/previewimage?filePath=' + response.value.model.path ).show();
							me.$savehetong.removeAttr('disabled');
						},
						'error': function(){
							me.$savehetong.removeAttr('disabled');
						}

					})
				}
			});

			me.$('#contractstate').on('change',function(e){

				var value = $(e.currentTarget).val();
				if( value == 1 ){
					me.$('#rejectReason').val('').attr('disabled','disabled');
				}else{
					me.$('#rejectReason').removeAttr('disabled');
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
			if(index == 3 && me.type == 'a'){
				me.$('[data-state="a"]').show();
			} else {
				me.$('[data-state="a"]').hide();
			}
		},
		//
		// @param id   	订单id 
		// @param type  a 订单编辑查看(可编辑内容)  
		//				b 补充合同(可以补充合同)
		//				c 审批只读(可进行审批同意或驳回) 
		//				d 完全只读状态 
		//              
		// @param status  订单状态        []
		// @param dstatus 到款认领状态    []
		// @param info    一些额外信息
		//
		// show       为第一层状态控制
		// getInfo    为第二层状态控制
		//==============================================
		show: function( id , type , status , dstatus, info ){
			var me = this;
			DetailApproval.__super__.show.call( this,true );
			console.log('dododo');
			console.log( status );
			//缓存额外信息


			me.orderId = id;
			me.type = type;  //slider类型
			me.status = status || '';
			me.dstatus = dstatus || '';
			me.info = info || {};


			//判断是否是订单的驳回状态
			var isRefuse = false;  //是否是驳回状态
			if( status == 3 ){
				isRefuse = true;
			}

			//判断是否是增购续费
			//如果是增购续费 将参数传给订单详情页面
			//
			var isAdd = false;
			if( me.info.orderType && (me.info.orderType == 2 || me.info.orderType == 3 || me.info.orderType == 4 ) ){
				isAdd = true;
			}
			me.isAdd = isAdd;
			//var isAdd = false;  //是否是增购续费
			//if( )



			switch( type ){

				//只读状态  [小助手/财务/销售] (仅可查看)
				case 'd':
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), isAdd: isAdd, orderId:id, readonly:true, isRefuse:isRefuse} );
					me.approvalPage.hideTopBar();
					me.approvalPage.hideFootBtns();
				break;

				//审批只读 [小助手/财务](可进行审批同意或驳回);
				case 'c':
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), isAdd: isAdd, orderId:id, readonly:true, isRefuse:isRefuse} );
					me.approvalPage.hideTopBar();
					me.approvalPage.hideFootBtns();
					me.$('[data-state="c"]').show();
				break;

				//订单查看  [销售]  (可进行编辑提交)
				case 'a':
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), isAdd: isAdd, orderId:id, readonly:false, isRefuse:isRefuse} );
					me.approvalPage.hideTopBar();
					me.approvalPage.hideFootBtns();
					//me.$('[data-state="a"]').show();
				break;
				
				//补充合同  [销售]  (可以补充合同)
				case 'b':
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), isAdd: isAdd, orderId:id, readonly:true, isRefuse:isRefuse} );
					me.approvalPage.hideTopBar();
					me.approvalPage.hideFootBtns();
					me.$('[data-state="b"]').show();
				break;
				
				//
			}

			//增购续费不显示企业信息
			me.info.orderType = me.info.orderType || '';
			if( (me.info.orderType == 2) || (me.info.orderType == 3) || (me.info.orderType == 4) ){
				me.$('.approval-title [data-index="1"]').hide();
				me.$('.approval-title [data-index="2"]').trigger('click');
			}


			me.approvalPage.render();
			me.getInfo();
		},
		//



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
						me.$('#opinionlist').html('<tr><td colspan="6"><p class="tip">暂无数据</p></td></tr>');
					}
				}
			});
			
			//获取到款信息
			//if( me.dstatus == 3 ){
				util.api({
					'url':'/odr/getClaimedReceivedPayForDetail',
					'data':{
						'orderId': me.orderId
					},
					'success': function( data ){
						console.log('到款信息');
						console.log( data );
						if( data.value.model ){
							me.dklist.reload([data.value.model]);
							me.$('.approval-daokuan').show();
						}else{
							me.$('.approval-daokuan').hide();
							//me.$('#daokuanlist').html('<tr><td colspan="3"><p class="tip">暂无数据</p></td></tr>');
						}	
					}
				});
				
			//}
			

			//获取补充合同信息
			//如果是补充合同待审核 补充合同驳回 补充合同撤回 都显示补充合同
			//则显示合同图片的同时 隐藏合同审核选择
			//
			//当额外信息是不可看时 隐藏合同
			//
			if( (me.status == 10) || (me.status == 11) || (me.status == 12) ){
				util.api({
					'url':'/odr/getOdrContract',
					'data':{
						'orderId': me.orderId
					},
					'success': function( data ){
						if( data.success ){

							if( data.value.model.contractPic ){
								me.$('.htshow').attr('src','/op/api/file/previewimage?filePath='+data.value.model.contractPic);
								me.$('.htshow').parent().attr('href','/op/api/file/previewimage?filePath='+data.value.model.contractPic);
							}else{
								me.$('.htshow').hide();
							}

							if( data.value.model.contractPicCopy ){
								me.$('.htfbshow').attr('src','/op/api/file/previewimage?filePath='+data.value.model.contractPicCopy);
								me.$('.htfbshow').parent().attr('href','/op/api/file/previewimage?filePath='+data.value.model.contractPicCopy);
							}else{
								me.$('.htfbshow').hide();
							}
						}
					}
				})
				
				if( me.info.htshow == false ){
					me.$('.approval-contractshow').hide();
				}else{
					me.$('.approval-contractshow').show();
				}

				//同时隐藏合同审核选择
				//me.$('.approval-hetongopinion').hide();
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

			/*
			var bool;
			if( me.status == 10 ){
				bool = true;
			}else{
				bool = me.verify();
			}
			*/
			var bool = me.verify();

			if( bool ){
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

			var bool = me.verify();

			if( bool ){
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
				'odrDraftOrder': data.getProductInfo()['odrDraftOrder'],
				'odrDraftPaidInfo': data.payInfo,
				'orderId': me.orderId
			}
			if( me.isAdd ){
				postData = {
					'odrDraftOrder': data.getProductInfo()['odrDraftOrder'],
					'odrDraftPaidInfo': data.payInfo,
					'orderId': me.orderId
				}
			}


			var rejectFrom = data.rejectFrom;

			console.log( data );

			// 小助手驳回
			// 新购             则提交三个类型的信息
			// 增购续费         则提交产品信息和付款信息
			if( rejectFrom && rejectFrom == 1 ){

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

			// 财务驳回
			// 则只保存付款信息
			}else if( rejectFrom && rejectFrom == 2 ){

				//保存
				util.api({
					'url': '/odrDraft/updateDraftPaidInfo',
					'contentType': 'application/json',
					'data': JSON.stringify( data.payInfo ),
					'success': function( data ){
						console.warn(data);
						if(data.success){
							util.showTip('保存成功');
							me.trigger('editSuccess');
							me.hide();
						}
					}
				})
			}

			
			console.log(data);
		},
		//保存合同
		saveHetongEve: function(){
			var me = this;

			if( !me.contract ){
				util.showToast('请选择合同照片');
				return false;
			}

			console.log('savehetong');
			var data = me.approvalPage.getReturnData();

			//补充合同
			util.api({
				'url':'/odr/supContractSubmit',
				'contentType':'application/json',
				'data': JSON.stringify({
					'contract': me.contract,
					'contractCopy': me.contractCopy,
					'contractFileName': me.contractFileName,
					'contractCopyFileName': me.contractCopyFileName,
					'contractId': data.payInfo.contractId
				}),
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
