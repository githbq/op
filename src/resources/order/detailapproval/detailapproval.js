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
	var DialogImg = require('./dialog');
	var template = require('./template.html');

	var ShowRemarkCard = require('../widget/showremarkcard/showremarkcard');     //审批备注图片
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
			'.savehetong': 'savehetong',     //保存合同按钮
			'#hetonglyl':'hetonglyl'        //审核合同照片
		},
		events:{
			'click .approval-title span': 'toggleEve',
			'click .action-agree': 'agreeEve',
			'click .action-refuse': 'refuseEve',
			'click .imgclose': 'imgCloseEve',
			'click .imgfbclose': 'imgFbCloseEve',
			'click .imgcheckclose':'imgCheckCloseEve',
			'click .action-save': 'saveEve',            //重新编辑保存
			'click .savehetong': 'saveHetongEve',        //补充合同
			'click .img-info':'imgInfoEve'              //查看审批备注照片
		},
		init: function(){
			DetailApproval.__super__.init.apply( this,arguments );
			var me = this;

			//me.contract = '';            	//合同图片
			//me.contractFileName = '';    	//合同图片文件名称

			//me.contractCopy = '';        	//合同图片副本
			//me.contractCopyFileName = '';   //合同图片副本文件名称

			me.contractId = '';             //合同ID

			me.contracts = [];  	//合同数组
			me.contractcopys = [];  //合同副本数组
			me.checkContracts = [];  	//审核合同数组


			if( me.attrs.isTop ){
				me.$view.css( {"z-index":3000} );
			}
			me.$hetong.on('change',function(){
				console.log('hetongchange');
				if( me.contracts.length >= 10 ){
					util.showToast('最多上传10张合同图片');
					me.$hetong.val('');
					return false;
				}

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
							//me.contract = response.value.model.path;
							//me.contractFileName = response.value.model.FileName;
							//me.$hetongimg.attr('src','/op/api/file/previewimage?filePath=' + response.value.model.path ).show();
							me.contracts.push( {'path':response.value.model.path,'fileName':response.value.model.FileName} );
							me.imghtlist.reload( me.contracts );
							me.$savehetong.removeAttr('disabled');
							me.$hetong.val('');
						},
						'error': function(){
							me.$savehetong.removeAttr('disabled');
						}
					})
				}
			});

			me.$hetongfb.on('change',function(){
				if( me.contractcopys.length >= 10 ){
					util.showToast('最多上传10张合同副本图片');
					me.$hetongfb.val('');
					return false;
				}
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
							//me.contractCopy = response.value.model.path;
							//me.contractCopyFileName = response.value.model.FileName;
							//me.$hetongfbimg.attr('src','/op/api/file/previewimage?filePath=' + response.value.model.path ).show();
							me.contractcopys.push( {'path':response.value.model.path,'fileName':response.value.model.FileName} );
							me.imghtfblist.reload( me.contractcopys );
							me.$savehetong.removeAttr('disabled');
							me.$hetongfb.val('');
						},
						'error': function(){
							me.$savehetong.removeAttr('disabled');
						}
					})
				}
			});
			
			me.$hetonglyl.on('change',function(){
				console.log('hetongchange');
				if( me.checkContracts.length >= 10 ){
					util.showToast('最多上传10张合同图片');
					me.$hetonglyl.val('');
					return false;
				}

				var fileExtension = me.$hetonglyl[0].files[0].name.split('.').pop().toLowerCase();
				if( fileExtension == 'jpg' || fileExtension == 'gif' || fileExtension == 'png' || fileExtension == 'jpeg' ){
					me.$('.action-agree').attr('disabled','disabled');
					me.$('.action-refuse').attr('disabled','disabled');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$hetonglyl[0].files,
						'options': {
							'limittype': 'IMAGE'
						},
						'success': function( response ){
							me.checkContracts.push( {'path':response.value.model.path,'fileName':response.value.model.FileName} );
							me.imghtlistlyl.reload( me.checkContracts );
							me.$('.action-agree').removeAttr('disabled');
							me.$('.action-refuse').removeAttr('disabled');
							me.$hetonglyl.val('');
						},
						'error': function(){
							me.$('.action-agree').removeAttr('disabled');
							me.$('.action-refuse').removeAttr('disabled');
						}
					})
				}else{
					
					util.showToast('图片格式不正确');
					me.$hetonglyl.val('');
					return false;
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
		//去除合同图片
		imgCloseEve: function(e){
			var me = this;
			var index = $(e.currentTarget).parent('span').index();
			me.contracts.splice(index,1);
			me.imghtlist.reload( me.contracts );
		},
		//去除合同副本图片
		imgFbCloseEve: function(e){
			var me = this;
			var index = $(e.currentTarget).parent('span').index();
			me.contractcopys.splice(index,1);
			me.imghtfblist.reload(me.contractcopys);
		},
		//去除审核合同照片
		imgCheckCloseEve:function(e){
			var me = this;
			var index = $(e.currentTarget).parent('span').index();
			me.checkContracts.splice(index,1);
			me.imghtlistlyl.reload(me.checkContracts);
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

			//
			// 在type为a的状态下
			// 只有点到第三个type才能提交
			if(index == 3 && me.type == 'a'){
				me.$('[data-state="a"]').show();
			} else {
				me.$('[data-state="a"]').hide();
			}
		},
		//
		// @param id   	订单id 
		// @param type  a 订单编辑查看 (可编辑内容)  
		//				b 补充合同     (可以补充合同)
		//				c 审批只读     (可进行审批同意或驳回) 
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
			if( status == 3 || status == 2 ){
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
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), isAdd: isAdd, orderId:id, readonly:true, isRefuse:isRefuse ,'data':{'enterpriseId':me.info.enterpriseId}} );
					me.approvalPage.hideTopBar();
					me.approvalPage.hideFootBtns();
				break;

				//审批只读 [小助手/财务](可进行审批同意或驳回);
				case 'c':
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), isAdd: isAdd, orderId:id, readonly:true, isRefuse:isRefuse,'data':{'enterpriseId':me.info.enterpriseId}} );
					me.approvalPage.hideTopBar();
					me.approvalPage.hideFootBtns();
					me.$('[data-state="c"]').show();
				break;

				//订单查看  [销售]  (可进行编辑提交)
				case 'a':
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), isAdd: isAdd, orderId:id, readonly:false, isRefuse:isRefuse,'data':{'enterpriseId':me.info.enterpriseId}} );
					me.approvalPage.hideTopBar();
					me.approvalPage.hideFootBtns();
					//me.$('[data-state="a"]').show();
				break;
				
				//补充合同  [销售]  (可以补充合同)
				case 'b':
					me.approvalPage = new Page( {wrapper: me.$view.find('.approval-content'), isAdd: isAdd, orderId:id, readonly:true, isRefuse:isRefuse,'data':{'enterpriseId':me.info.enterpriseId}} );
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
			//没有到款信息隐藏
			//有到款信息则显示
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
			//当额外信息htshow是不可看时 隐藏合同
			//
			if( (me.status == 10) || (me.status == 11) || (me.status == 12) ){
				util.api({
					'url':'/odr/getOdrContract',
					'data':{
						'orderId': me.orderId
					},
					'success': function( data ){
						if( data.success ){
							me.$('#showhetong').val(data.value.model.sealName);
							if( data.value.model.contractPic ){
								me.imghtlistview.reload( data.value.model.contractPic.split(',') );
								me.$('.approval-contractshow').show();
							}else{
								me.imghtlistview.reload( [] );
							}
							if( data.value.model.contractPicCopy ){
								me.imghtfblistview.reload( data.value.model.contractPicCopy.split(',') );
							}else{
								me.imghtfblistview.reload( [] );
							}
						}
					}
				})
				
				if( me.info.htshow == false ){
					me.$('.approval-contractshow').hide();
				}
				/*
				else{
					me.$('.approval-contractshow').show();
				}
				*/

				//同时隐藏合同审核选择
				me.$('.approval-hetongopinion').hide();
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
			var c = confirm('确认审批通过吗？');
			if(!c){
				return;
			}
			var me = this;

			
			var bool;
			if( me.status == 10 ){
				bool = true;
			}else{
				bool = me.verify();
			}
			
			//var bool = me.verify();
			
			var checkContracts = [];
			
			me.checkContracts.forEach(function(item){
				checkContracts.push( item.path );
			});

			if( bool ){
				util.api({
	                'url': '~/op/api/approval/directapprove',
	                'data':{
	                    'processInstanceId': me.info.processInstanceId, //流程实例ID
	                    'approved': true,                  				//审批结果(通过/拒绝)
	                    'opinion': me.model.get('comment'),  			//审批意见
	                    'contractState': me.model.get('contractState'), //是否合格
						'approvalOpinionPic':checkContracts.join(','),  //图片列表
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
			var c = confirm('确认审批驳回吗？');
			if(!c){
				return;
			}
			var me = this;
			if(!me.model.get('comment')){
				util.showToast('请填写审批意见');
				return false;
			}

			var bool;
			if( me.status == 10 ){
				bool = true;
			}else{
				bool = me.verify();
			}

			//var bool = me.verify();
			var checkContracts = [];
			
			me.checkContracts.forEach(function(item){
				checkContracts.push( item.path );
			});

			if( bool ){
				util.api({
	                'url': '~/op/api/approval/directapprove',
	                'data':{
	                    'processInstanceId': me.info.processInstanceId, //流程实例ID
	                    'approved': false,                  		    //审批结果(通过/拒绝)
	                    'opinion': me.model.get('comment'),  			//审批意见
	                    'contractState': me.model.get('contractState'), //是否合格
						'approvalOpinionPic':checkContracts.join(','),  //图片列表
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
					'url': '~/op/api/a/odr/update',
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
					'url': '~/op/api/a/odrDraft/updateDraftPaidInfo',
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
			
			if( !me.$('#httongzhang').val() ){
				util.showToast('请填写合同章');
				return false;
			}

			if( me.contracts.length <= 0 ){
				util.showToast('请选择合同照片');
				return false;
			}

			var contract = [],
				contractFileName = [];
			me.contracts.forEach(function(item){
				contract.push( item.path );
				contractFileName.push( item.fileName );
			});

			var contractCopy = [],
				contractCopyFileName = [];

			me.contractcopys.forEach(function(item){
				contractCopy.push( item.path );
				contractCopyFileName.push( item.fileName );
			});

			var data = me.approvalPage.getReturnData();

			//补充合同
			util.api({
				'url':'/odr/supContractSubmit',
				'contentType':'application/json',
				'data': JSON.stringify({
					'contract': contract.join(','),
					'contractCopy': contractCopy.join(','),
					'contractFileName': contractFileName.join(','),
					'contractCopyFileName': contractCopyFileName.join(','),
					'sealName':me.$('#httongzhang').val(),
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
		//查看审批备注图片
		imgInfoEve:function( e ){
			var me = this;
            var imgList = $(e.currentTarget).attr('data-imglist');
			imgList = imgList.split(',')||[];
			var objImgList = [];
			for(var i = 0; i<imgList.length;i++){
				objImgList.push( {'show':false,'src':imgList[i]} ) ;
			}
               
           // var showRemarkCard = new ShowRemarkCard();
			//showRemarkCard.show();
			var dialog = DialogImg.getInstance(null,
				{
					defaultAttr: {
						title: '查看审批备注图片',
						width: 800
					},
					content: require('./showremarkcard.html')
				}
			);

			dialog.bootstrap([], function (app) {
				app.controller('dialogController', ['$scope', function ($scope) {
					$scope.imgList = objImgList;
					$scope.objImg = {'show':false};
					$scope.showBig = function(showFlag ,index){
						$scope.imgList[index].show = true;
					}

				}]);
				app.directive('imagePreview',function(){
					return{
						replace: true,
						scope:{'src':'=','show':'=','deg':'='},
						template: $(template).filter('.image-preview')[0].outerHTML,
						link: function (scope, iElem, iAttrs) {
							//setRotate(iElem.find('img.preview')[0], iElem.find('.btn-rotate'));
							scope.close = function () {
								scope.deg = 0;
								scope.show = false;
							};
							scope.hrefClick = function ($event) {
								$event.stopPropagation();
							};
							scope.rotation = function(){
								elem = iElem.find('img.preview')[0];
								//iElem.find('.btn-rotate')
								if ((scope.deg + 90) > 360) {
									scope.deg = 90;
								} else {
									scope.deg += 90;
								}
								var element = elem;
								var styles = ['webkitTransform', 'MozTransform', 'msTransform', 'OTransform', 'transform'];
								for (var i = 0; i < styles.length; i++) {
									element.style[styles[i]] = "rotate(" + scope.deg + "deg)"
								}
								return false;
							}
						}
					}
				})

			});
			dialog.show();
		},
		//重新发送
		hide: function(){
			var me = this;
			me.$view.find('.approval-content').empty();
			me.$('[data-state]').hide();
			
			me.contracts = [];  	//合同数组
			me.contractcopys = [];  //合同副本数组

			DetailApproval.__super__.hide.apply( this,arguments );
			me.remove();
		}
	});
        
	module.exports = DetailApproval;
});
