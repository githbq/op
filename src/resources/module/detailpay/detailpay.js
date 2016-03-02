/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

	var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
	var Slider = require('common/widget/slider/slider');
	var uploader = require('common/widget/upload').uploader;
	 var AreaTree = require('module/areatree/areatree');

	var contentStr = require('./detailpay.html');

    /////////////////
    //
    //  付费企业审批
    /////////////////
	 var DetailPay = MClass( Slider ).include({
        
        content: contentStr,

        defaultAttr: {
            'title': '付费开通审批详情',
            'width': 700
        },

        elements: {
            '.e-industry': 'industry',
            '.e-source': 'source',
            '.e-province': 'province',
            '.e-group': 'group',
            '.e-knowsource': 'knowsource',
            '.e-motive': 'motive',
            '.contract': 'contract',
			'.contractCopy':'contractCopy',
			'.mtzhizhao': 'mtzhizhao',
			'.yyzhizhao': 'yyzhizhao',
            '.content-product': 'product',
            '.companyscale':'companyscale',
            '.saleteamscale':'saleteamscale',
			'.contractprice': 'contractprice',                   //合同金额
			'.deviceamount': 'deviceamount',                     //终端数量
			'.marketingAccountAmount':'marketingAccountAmount',
            '.endTime': 'endTime',
			'.status-disabled': 'statusDisabled',
			'.show-type':'showType',
			'.start-time-ht':'startTimeHt',
			'.end-time-ht':'endTimeHt',
			'.look-card':'lookCard',
			'.up-card':'upCard',
			'.look-contract':'lookContract',
			'.contract-hide':'contractHide',
			'.look-yyzhizhao':'lookYyzhizhao',
			'.yyzhizhao-hide':'yyzhizhaoHide',
			'.look-mtzhizhao':'lookMtzhizhao',
			'.mtzhizhao-hide':'mtzhizhaoHide',
			'.contract-link':'contractLink',
			'.img-contract' :'imgContract',
			'.yyzhizhao-link':'yyzhizhaoLink',
			'.img-yyzhizhao' :'imgYyzhizhao',
			'.mtzhizhao-link':'MtzhizhaoLink',
			'.img-mtzhizhao' :'imgMtzhizhao',
			'.look-contractCopy':'lookContractCopy',
			'.contractCopy-link':'contractCopyLink',
			'.img-contractCopy' :'imgContractCopy',
			'.contractCopy-hide' :'contractCopyHide',
			'.action-save':'actionSave',
			'.action-resend':'actionResend',
			'.useBusinessCard':'useBusinessCard',
			'.card-price':'cardPrice',
			'.action-backout':'actionBackout',
			'.action-save':'actionSave',
			'.useBusinessCard':'useBusinessCard',
			'.action-agree':'actionAgree',
			'.action-reject':'actionReject',
			'.action-submit':'actionSubmit',
        },

        events:{
            'click .action-cancel': 'cancelEve',     //取消审批
            'click .action-backout': 'backoutEve',   //撤销审批
            'click .action-resend': 'resendFreeBuyEve'  ,    //重新发送
			'click .action-save': 'saveFreeBuyEve' ,
			'click .action-submit':'submitEve',
			'click .action-reject': 'rejectEve',
            'click .action-agree': 'agreeEve',
			'click .action-by': 'byEve'      //重新发送
        },

        //获取枚举值
        getEnums: function(){
            var me = this;
            
            var state = {
                'i': false,
                'e': false,
                'p': false,
                'g': false,
                'k': false,
                'r': false,
                'c': false,
                's': false,
                'pr': false
                
            };

            //检查是否获取完毕
            function check(){
                if( state.i && state.e && state.p && state.g && state.k && state.r && state.c && state.s && state.pr ){
                    me.state = true;
                }
            }

            //获取枚举值 并赋值给select
            function generate( Ename , $select , str ){
                var list = [{'name':'请选择','value':''}];

                util.getEnums( Ename , function( data ){
                    data.value.model.forEach( function( item ){
                        list.push({'name':item.text,'value':item.value});
                    });
                    util.resetSelect($select,list);
                    if( str ){
                        state[ str ] = true;
                    }

                    check();
                })
            }

            if( me.attrs['isPay'] == true ){

            }
			
			//crm事件
			me.$('.crm-check').on('click',function(){
				if(me.$('.crm-check').is(':checked')){
					me.$('.crm-show').show();
					me.$('.crm-control').removeAttr('disabled');
				}else{
					me.$('.crm-show').hide();
					me.$('.crm-control').attr('disabled','disabled');
				}
			});
			
			//pk助手事件
			me.$('.pk-check').on('click',function(){
				if(me.$('.pk-check').is(':checked')){
					me.$('.pk-show').show();
					me.$('.pk-control').removeAttr('disabled');
				}else{
					me.$('.pk-show').hide();
					me.$('.pk-control').attr('disabled','disabled');
				}
			});
			
			//会议助手事件
			me.$('.meet-check').on('click',function(){
				if(me.$('.meet-check').is(':checked')){
					me.$('.meet-show').show();
					me.$('.meet-control').removeAttr('disabled');
				}else{
					me.$('.meet-show').hide();
					me.$('.meet-control').attr('disabled','disabled');
					me.$('.meet-control').val('');
				}
			});
			//Hr助手事件
			me.$('.hr-check').on('click',function(){
				if(me.$('.hr-check').is(':checked')){
					me.$('.hr-show').show();
					me.$('.hr-control').removeAttr('disabled');
				}else{
					me.$('.hr-show').hide();
					me.$('.hr-control').attr('disabled','disabled');
					me.$('.hr-control').val('');
				}
			});
			//工资助手事件
			me.$('.pay-check').on('click',function(){
				if(me.$('.pay-check').is(':checked')){
					me.$('.pay-show').show();
					me.$('.pay-control').removeAttr('disabled');
				}else{
					me.$('.pay-show').hide();
					me.$('.pay-control').attr('disabled','disabled');
					me.$('.pay-control').val('');
				}
			});
			
			//crm --时间--start
			me.$('.crm-startTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$('.crm-endTime').val() ? me.$('.crm-endTime').val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$('.crm-endTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$('.crm-startTime').val() ? me.$('.crm-startTime').val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			//crm --时间--end
			
			//pk --时间--start
			me.$('.pk-startTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$('.pk-endTime').val() ? me.$('.pk-endTime').val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$('.pk-endTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$('.pk-startTime').val() ? me.$('.pk-startTime').val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			//pk --时间--end
			
			//会议助手 --时间--start
			me.$('.meet-startTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$('.meet-endTime').val() ? me.$('.meet-endTime').val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$('.meet-endTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$('.meet-startTime').val() ? me.$('.meet-startTime').val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			//会议助手 --时间--end
			
				//hr助手 --时间--start
			me.$('.hr-startTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$('.hr-endTime').val() ? me.$('.hr-endTime').val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$('.hr-endTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$('.hr-startTime').val() ? me.$('.hr-startTime').val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			//hr助手 --时间--end
			
			//工资助手 --时间--start
			me.$('.pay-startTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$('.pay-endTime').val() ? me.$('.pay-endTime').val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$('.pay-endTime').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$('.pay-startTime').val() ? me.$('.pay-startTime').val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			//工资助手 --时间--end
			
			//crm开始时间
			me.$('.crm-startTime').on('focusout',function(){
				me.getdiscount();
			});

			//crm结束时间
			me.$('.crm-endTime').on('focusout',function(){
				me.getdiscount();
			});
			//crn金额改变
			me.$('.crm-money').on('focusout',function(){
	
				me.getdiscount();
			});
			//crn数量
			me.$('.crm-num').on('focusout',function(){
			
				me.getdiscount();
			});
			
			
			//是否使用名片
			me.$useBusinessCard.on('change',function(){
				me.getdiscount();
			});
			
			
			//是否使用名片
			me.$('.useBusinessCardAdd').on('change',function(){
				me.getdiscountAdd();
			});

            //获取行业列表
            generate('INDUSTRY', me.$industry , 'i');

            //获取来源
            generate('ENT_LST_SOURCE', me.$source , 'e');

            //获取省市
            generate('PROVINCE', me.$province , 'p');

            //获取团队类型
            generate('GROUP_TYPE', me.$group , 'g');

            //获取了解渠道
            generate('KNOW_SOURCE', me.$knowsource , 'k');

            //获取注册动机
            generate('REGISTER_MOTIVE', me.$motive , 'r');

            //获取公司规模
            generate('CAMPANY_SCALE', me.$companyscale , 'c');

            //获取销售团队规模
            generate('SALE_TEAM_SCALE', me.$saleteamscale ,'s');
			
        },
		//检测是否选中
		checkChecobox:function(strType){
			var me = this;
			if(me.$('.'+strType+'-check').is(':checked')){
				me.$('.'+strType+'-show').show();
				me.$('.'+strType+'-control').removeAttr('disabled');
			}else{
				me.$('.'+strType+'-show').hide();
				me.$('.'+strType+'-control').attr('disabled','disabled');
				me.$('.'+strType+'-control').val('');
			}
		},
        
		//获取赠送数量
		getFreeNum: function(){
			var me = this;

		},
		//获取折扣
		getdiscount: function(){
			var me = this;
			var crmNum = me.$('.crm-num').val(),
				crmMoney = me.$('.crm-money').val(),
				buyBusinessCard = me.model.get('useBusinessCard');

			var crmStartTime = '';  
			var crmEndTime = '';
				
			if( me.$('.crm-startTime').val() ){
				crmStartTime = new Date( me.$('.crm-startTime').val() ).getTime();
			}
			if( me.$('.crm-endTime').val() ){
				crmEndTime = new Date( me.$('.crm-endTime').val() ).getTime();
			}
			if( crmStartTime && crmEndTime && buyBusinessCard =='1'){
				util.api({
					'url':'/enterprise/getbusinesscardprice',
					'data':{
						'contractStartTime':crmStartTime,
						'contractEndTime':crmEndTime
					},
					'success': function( data ){
						if( data.success ){
							me.model.set('cardPrice', data.value.model);
							me.$cardPrice.show();
							console.log(data);
							return false;
						}
					}
				});
			}
			if(buyBusinessCard =='0'){
				me.$cardPrice.hide();
				me.model.set('cardPrice','');
			}

			if( crmNum && crmMoney && crmStartTime && crmEndTime && buyBusinessCard ){
				
				me.discountxhr && me.discountxhr.abort();
				me.discountxhr = util.api({
					url:'/enterprise/getdiscount',
					'data':{
						'accountAmount': crmNum,
						'contractStartTime': crmStartTime,
						'contractEndTime': crmEndTime,
						'contractPrice': crmMoney,
						'buyBusinessCard':buyBusinessCard
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							var tempDiscount = parseFloat(data.value.model).toFixed(1);
							if(tempDiscount<0){
								me.model.set('discount', '');
								util.showToast('计算所得折扣小于0,合同金额需大于等于名片金额！');
								return false;
							}
							me.model.set('discount', tempDiscount);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						}else{
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						}
					}
				})
			}
		},

        init: function(){
            DetailPay.__super__.init.apply( this,arguments );
            var me = this;
            
			me.$startTimeHt.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var maxDate = me.$endTimeHt.val() ? me.$endTimeHt.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            } );
            
            me.$endTimeHt.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var minDate = me.$startTimeHt.val() ? me.$startTimeHt.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            } );
			
			me.attrs.isPay = 0;

            me.getEnums();
			/**
			 *
			 * 合同上传'actionSave',
			'.action-resend':'actionResend',
			 * input[file]变更时 合同文件自动上传
			 */
			me.$contract.on('change',function(){
				var fileExtension =me.$contract[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$actionSave.attr('disabled','disabled');
					me.$actionSave.text('文件上传...');
					me.$actionResend.attr('disabled','disabled');
					me.$actionResend.text('文件上传...');
					console.log(me.$contract[0].files)
					console.log(333)
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$contract[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('contract', response.value.model.path );
							me.model.set('contractFileName', response.value.model.FileName );
							me.$lookContract.show();
							me.$contractHide.hide();
							me.$contractLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$imgContract.attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							me.$contract.val('');
							return false;
						}
					})
				}else{
					me.$contract.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			me.$contractCopy.on('change',function(){
				var fileExtension =me.$contractCopy[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$actionSave.attr('disabled','disabled');
					me.$actionSave.text('文件上传...');
					me.$actionResend.attr('disabled','disabled');
					me.$actionResend.text('文件上传...');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$contractCopy[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){	
							console.warn( response );
							me.model.set('contractCopy', response.value.model.path );
							me.model.set('contractCopyFileName', response.value.model.FileName );
							me.$lookContractCopy.show();
							me.$contractCopyHide.hide();
							me.$contractCopyLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$imgContractCopy.attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							me.$contractCopy.val('');
							return false;
						}
					})
				}else{
					me.$contractCopy.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			me.$mtzhizhao.on('change',function(){
				var fileExtension =me.$mtzhizhao[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$actionSave.attr('disabled','disabled');
					me.$actionSave.text('文件上传...');
					me.$actionResend.attr('disabled','disabled');
					me.$actionResend.text('文件上传...');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$mtzhizhao[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('companyGatePicture', response.value.model.path );
							me.model.set('companyGatePictureFileName', response.value.model.FileName );
							me.$lookMtzhizhao.show();
							me.$mtzhizhaoHide.hide();
							me.$MtzhizhaoLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$imgMtzhizhao.attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							me.$mtzhizhao.val('');
							return false;
						}
					})
				}else{
					me.$mtzhizhao.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			me.$yyzhizhao.on('change',function(){
				var fileExtension =me.$yyzhizhao[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$actionSave.attr('disabled','disabled');
					me.$actionSave.text('文件上传...');
					me.$actionResend.attr('disabled','disabled');
					me.$actionResend.text('文件上传...');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$yyzhizhao[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('businessLicense', response.value.model.path );
							me.model.set('businessLicenseFileName', response.value.model.FileName );
							me.$lookYyzhizhao.show();
							me.$yyzhizhaoHide.hide();
							me.$yyzhizhaoLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$imgYyzhizhao.attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存提交');
							me.$yyzhizhao.val('');
							return false;
						}
					})
				}else{
					me.$yyzhizhao.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
            
        },

        // 设置状态
        // show的时候根据参数 进行不同状态切换
        setState: function(){
            var me = this;

            me.$('.state').hide();
			me.$actionSubmit.hide();

            if( me.attrs.canCancel == 'true' ){
                me.$('.state-cancel').show()
				me.$statusDisabled.attr('disabled','disabled');
            }
			if( me.attrs.canCancel == 'false' ){
				me.$statusDisabled.attr('disabled','disabled');
            }
            if( me.attrs.isCurrentTask  == 'true' ){
				if( me.attrs.runStatus == '1' || me.attrs.runStatus == '0' ){
					me.$('.state-current').show();
					me.$statusDisabled.removeAttr('disabled');

					me.$upCard.show();
					
				}else{
					me.$actionSubmit.show();
					me.$upCard.hide();
				}
				
				me.checkChecobox('crm');
				me.checkChecobox('pk');
				me.checkChecobox('meet');
				me.checkChecobox('hr');
				me.checkChecobox('pay');
				
                
            }else{
				me.$statusDisabled.attr('disabled','disabled');

				me.$upCard.hide();
				me.$('.state-current').hide();

			}
			me.setType();
        },
        
		//根据申请类型不同显示不同的信息
        setType: function(){
            var me = this;
			me.attrs.orderId = '';
			me.attrs.freeIncreaseContractRequired ='';
            me.$showType.hide();
			
            //付费审批   
            me.$showType.show();
 
        },

        /**
         *
         *撤销审批
         */
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

		//免费开通付费开通的保存
		saveFreeBuyEve: function(){
            var me = this;
			//me.model.set('dealDays',parseInt(me.model.get('dealDays'))?parseInt(me.model.get('dealDays')):'');
			//me.model.set('storageTotalSpace',parseFloat(me.model.get('storageTotalSpace'))?parseFloat(me.model.get('storageTotalSpace')):'');
			/*var objDate = me.model.all();
			objDate['contract']=me.model.get('contract');
			objDate['contractFileName']=me.model.get('contractFileName');
			objDate['contractCopy']=me.model.get('contractCopy');
			objDate['contractCopyFileName']=me.model.get('contractCopyFileName');
			objDate['companyGatePicture']=me.model.get('companyGatePicture');
			objDate['companyGatePictureFileName']=me.model.get('companyGatePictureFileName');
			objDate['businessLicense']=me.model.get('businessLicense');
			objDate['businessLicenseFileName']=me.model.get('businessLicenseFileName');
			objDate['contractStartTime']=new Date( me.$startTimeHt.val() ).getTime();
			objDate['contractEndTime']=new Date( me.$endTimeHt.val() ).getTime();
			if( me.attrs.type  == 'payLaunchApproval' ){
                objDate['contractType'] = 1;
				objDate['contractPrice']=me.model.get('contractPrice');
				objDate['discount']=me.model.get('discount');
				objDate['useBusinessCard']=me.model.get('useBusinessCard');
				objDate['invoiceTitle']=me.model.get('invoiceTitle');
				objDate['isPaid']=me.model.get('isPaid');
				var countNum = me.model.get('accountTotalAmount')?parseInt(me.model.get('accountTotalAmount')):0;
		
				
				if(!objDate['contractPrice']|| !objDate['discount'] || !objDate['invoiceTitle']){
					util.showToast('信息填写不完整');
					return false;
				}
				
            }*/
			
			
			//调用获取提交的全部信息
			me.getAllInfo();
			
			
			me.$actionResend.text('提交中....');
			me.$actionResend.attr('disabled','disabled');
			me.$actionSave.text('提交中....');
			me.$actionSave.attr('disabled','disabled');
			me.$actionBackout.text('提交中....');
			me.$actionBackout.attr('disabled','disabled');
            
            util.api({
                url: '/enterprise/updateenterprise',
                data: me.model.all(),
                success: function( data ) {
                    
                    if ( data.success  ){
                        util.showTip('保存更新成功!');
                        me.trigger( 'sendsuccess' );
                        me.hide();  
                    };
                   
                },
				complete: function(){
					me.$actionResend.text('保存提交');
					me.$actionResend.removeAttr('disabled');
					me.$actionSave.text('保存');
					me.$actionSave.removeAttr('disabled');
					me.$actionBackout.text('撤销审批');
					me.$actionBackout.removeAttr('disabled');
				}
            });
            
        },
		//获取全部提交信息
		getAllInfo:function(){
			var me = this;
			me.model.set('contractType',1);
			me.model.set('payStatus',1);
			me.model.set('orderType',3);
			
			if(!me.$('.crm-check').is(':checked') && !me.$('.pk-check').is(':checked') && !me.$('.meet-check').is(':checked') && !me.$('.hr-check').is(':checked') && !me.$('.pay-check').is(':checked')){
				util.showTip('请至少选择一种助手产品');
				return false;
			}
			var tempArry = [];
			
			//检测必填项
			var state = true; 
			me.$('.required').each(function(){
				var $this = $( this );
				var attr = $this.attr('ce-model');
				if( !me.model.get(attr) ){
					util.warnInput( $this );
					state = false;
					
				}else{
					util.unWarnInput( $this );
				}
			});
			if( !me.model.get('contract')){
				util.warnInput( $('.contract') );
				state = false;
			}else{
				util.unWarnInput( $('.contract') );
			}

			$("input[type='checkbox']:checked").each(function(){ 
				var className = $(this).attr('data-type').split('-')[0];
				switch(className)
				{
					case 'crm':
						if( !me.$('.crm-num').val() ){
							util.warnInput( $('.crm-num') );
							state = false;
						}else{
							util.unWarnInput( $('.crm-num') );
						}
						if( !me.$('.crm-money').val() ){
							util.warnInput( $('.crm-money') );
							state = false;
						}else{
							util.unWarnInput( $('.crm-money') );
						}
						if( !me.$('.crm-startTime').val() ){
							util.warnInput( $('.crm-startTime') );
							state = false;
						}else{
							util.unWarnInput( $('.crm-startTime') );
						}
						if( !me.$('.crm-endTime').val() ){
							util.warnInput( $('.crm-endTime') );
							state = false;
						}else{
							util.unWarnInput( $('.crm-endTime') );
						}
						
						var tempCrm = {
							'productId':1,
							'purchaseAmount':me.model.get('crm-purchaseAmount'),
							'purchaseCount':me.model.get('crm-purchaseCount'),
							'productAmount':me.model.get('crm-purchaseAmount'),
							'subOrderId':me.model.get('crm-subOrderId') ? me.model.get('crm-subOrderId') : '',
							'startTime':new Date( me.$('.crm-startTime').val() ).getTime(),
							'endTime':new Date( me.$('.crm-endTime').val() ).getTime(),
							'discount':10
							
						}
						tempArry.push(tempCrm);
						var tempBaichuan = {
							'productId':2,
							'purchaseAmount':9999, //页面没有百川数量设置默认
							'purchaseCount':0,
							'productAmount':0,
							'subOrderId':me.model.get('baichuan-subOrderId') ? me.model.get('baichuan-subOrderId') : '',
							'startTime':new Date( me.$('.crm-startTime').val() ).getTime(),
							'endTime':new Date( me.$('.crm-endTime').val() ).getTime(),
							'discount':10
							
						}
						tempArry.push(tempBaichuan);
						var tempSystem = {
							'productId':3,
							'purchaseAmount':9999, //页面没有百川数量设置默认
							'purchaseCount':0,
							'productAmount':0,
							'subOrderId':me.model.get('system-subOrderId') ? me.model.get('system-subOrderId') : '',
							'startTime':new Date( me.$('.crm-startTime').val() ).getTime(),
							'endTime':new Date( me.$('.crm-endTime').val() ).getTime(),
							'discount':10
							
						}
						tempArry.push(tempSystem);
						me.model.set('contractStartTime',new Date( me.$('.crm-startTime').val() ).getTime());
						me.model.set('contractEndTime',new Date( me.$('.crm-endTime').val() ).getTime());
					  break;
					  
					case 'pk':
					
						tempArry.push(me.getProductInfo('pk',4));
					
					  break;
					  
					case 'meet':
						tempArry.push(me.getProductInfo('meet',5));

					  break;
					case 'hr':
						tempArry.push(me.getProductInfo('hr',6));

					  break;
					case 'pay':
					
						tempArry.push(me.getProductInfo('pay',7));

					  break;
					  
					default:
					  
				}
			});

			if( state == false ){
				util.showToast('信息填写不完整');
				return ;
			}
			//crm如果没有填默认折扣10
			if(!me.$('.crm-num').val()){
				me.model.set('discount',10);
				me.model.set('marketingAccountAmount',0);
			}else{
				me.model.set('marketingAccountAmount',me.$('.crm-num').val());
			}
			
			me.model.set('subOrderInfo',JSON.stringify( tempArry ));
		},
		getProductInfo:function(productStr,productId){
			var me = this;
			
			if( !me.$('.'+productStr+'-purchaseAmount').val() ){
				util.warnInput( $('.'+productStr+'-purchaseAmount') );
				state = false;
			}else{
				util.unWarnInput( $('.'+productStr+'-purchaseAmount') );
			}
			if( !me.$('.'+productStr+'-startTime').val() ){
				util.warnInput( $('.'+productStr+'-startTime') );
				state = false;
			}else{
				util.unWarnInput( $('.'+productStr+'-startTime') );
			}
			if( !me.$('.'+productStr+'-endTime').val() ){
				util.warnInput( $('.'+productStr+'-endTime') );
				state = false;
			}else{
				util.unWarnInput( $('.'+productStr+'-endTime') );
			}
			
			var temp = {
				'productId':productId,
				'purchaseAmount':me.model.get(productStr+'-purchaseAmount'),
				'purchaseCount':9999,
				'productAmount':me.model.get(productStr+'-purchaseAmount'),
				'subOrderId':me.model.get(productStr+'-subOrderId') ? me.model.get(productStr+'-subOrderId') : '',
				'startTime':new Date( me.$('.'+productStr+'-startTime').val() ).getTime(),
				'endTime':new Date( me.$('.'+productStr+'-endTime').val() ).getTime(),
				'discount':10
			}
			
			if(!me.model.get('contractStartTime')){
				me.model.set('contractStartTime',new Date( me.$('.'+productStr+'-startTime').val() ).getTime());
				me.model.set('contractEndTime',new Date( me.$('.'+productStr+'-endTime').val() ).getTime());
			}
			return temp;
		},
		
		//免费开通付费开通的保存提交
        resendFreeBuyEve: function(){
			var me = this;
			/*me.model.set('dealDays',parseInt(me.model.get('dealDays'))?parseInt(me.model.get('dealDays')):'');
			me.model.set('storageTotalSpace',parseFloat(me.model.get('storageTotalSpace'))?parseFloat(me.model.get('storageTotalSpace')):'');
			var objDate = me.model.all();
			objDate['contract']=me.model.get('contract');
			objDate['contractFileName']=me.model.get('contractFileName');
			objDate['contractCopy']=me.model.get('contractCopy');
			objDate['contractCopyFileName']=me.model.get('contractCopyFileName');
			objDate['companyGatePicture']=me.model.get('companyGatePicture');
			objDate['companyGatePictureFileName']=me.model.get('companyGatePictureFileName');
			objDate['businessLicense']=me.model.get('businessLicense');
			objDate['businessLicenseFileName']=me.model.get('businessLicenseFileName');
			objDate['contractStartTime']=new Date( me.$startTimeHt.val() ).getTime();
			objDate['contractEndTime']=new Date( me.$endTimeHt.val() ).getTime();
			if( me.attrs.type  == 'payLaunchApproval' ){
				
                objDate['contractType'] = 1;
				objDate['contractPrice']=me.model.get('contractPrice');
				objDate['discount']=me.model.get('discount');
				objDate['invoiceTitle']=me.model.get('invoiceTitle');
				objDate['useBusinessCard']=me.model.get('useBusinessCard');
				
				
				if(!objDate['contractPrice']|| !objDate['discount'] || !objDate['invoiceTitle']){
					util.showToast('信息填写不完整');
					return false;
				}
				
            }
			
			//检测必填项
			var state = true; 
			me.$('.required').each(function(){
				var $this = $( this );
				var attr = $this.attr('ce-model');

				if( !me.model.get(attr) ){
					util.warnInput( $this );
					state = false;
				}else{
					util.unWarnInput( $this );
				}
			});
			if( !me.model.get('contract')){
				util.warnInput( $('.contract') );
				state = false;
			}else{
				util.unWarnInput( $('.contract') );
			}

			
			if( state == false ){
				util.showToast('信息填写不完整');
				return ;
			}*/
			
			
            //移交至下一个节点
            function changeNode(){
                util.api({
                    'url':'~/op/api/approval/directapprove',
                    'data':{
                        'processInstanceId': me.attrs.id,
                        'approved': true,
                        'opinion':''
                    },
                    'success':function( data ){
                        if( data.success ){
                            util.showTip('保存提交发送成功');
							me.trigger( 'saveSuccess');
							me.$statusDisabled.attr('disabled','disabled');
                            me.hide();
                        }
                    }
                })
            };
			
			//调用获取提交的全部信息
			me.getAllInfo();

            //更新企业详情
			me.$actionResend.text('提交中....');
			me.$actionResend.attr('disabled','disabled');
			me.$actionSave.text('提交中....');
			me.$actionSave.attr('disabled','disabled');
			me.$actionBackout.text('提交中....');
			me.$actionBackout.attr('disabled','disabled');
			
            util.api({
                url: '/enterprise/updateenterprise',
                data: me.model.all(),
                success: function( data ) {

                    if ( data.success ) {
						changeNode();
                    }
                },
				complete: function(){
					me.$actionResend.text('保存提交');
					me.$actionResend.removeAttr('disabled');
					me.$actionSave.text('保存');
					me.$actionSave.removeAttr('disabled');
					me.$actionBackout.text('撤销审批');
					me.$actionBackout.removeAttr('disabled');
				}
            });
            
        },  
		/**
         *
         *提交到下一节点
         */
		submitEve:function(){
			var me = this;
			
			 util.api({
				'url':'~/op/api/approval/directapprove',
				'data':{
					'processInstanceId': me.attrs.id,
					'approved': true,
					'opinion':''
				},
				'success':function( data ){
					if( data.success ){
						util.showTip('提交发送成功');
						 me.trigger( 'saveSuccess');
						me.$statusDisabled.attr('disabled','disabled');
						me.hide();
					}
				}
			});
		},

        /**
         *
         * @param id   实例id
         * @param eid  企业id
         * @param type 类型
         */
        show: function( id , eid , type , canCancel , isCurrentTask,isCanEdit ,currentState ){
            var me = this;

            me.attrs.id = id;
            me.attrs.eid = eid;
            me.attrs.type = type||'false';
            me.attrs.canCancel = canCancel || 'false';
            me.attrs.isCurrentTask = isCurrentTask || 'false';
			me.attrs.isCanEdit = isCanEdit || 'false';
			me.attrs.runStatus = '';
			me.attrs.currentState = currentState;

            util.api({
                'url': '/enterprise/getenterprise',
                'data': {
                    'enterpriseId': me.attrs.eid
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
						//me.attrs.isPay = data.value.model.isPayed;
						me.downFile(data);
						me.getInfo( data, true );
                    }
                }
            })
           
            DetailPay.__super__.show.apply( this,arguments );
        },
		/**
         *
         * 支持，渠道查看审批
         */
        showInfo: function( id , eid , type , state, isCanEdit ){
            var me = this;

            me.attrs.id = id;
            me.attrs.eid = eid;
            me.attrs.type = type;
			me.attrs.isCanEdit = isCanEdit||'false';
			me.attrs.currentState = state;
			 //设置显示状态
            me.$('.state').hide();
            me.$('.state-'+state).show();
			debugger
            util.api({
                'url': '/enterprise/getenterprise',
                'data': {
                    'enterpriseId': me.attrs.eid
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
						
						me.downFile(data);
						me.getInfo(data , false);
						me.setStateCheck();
                    }
                }
            })
           
            DetailPay.__super__.show.apply( this,arguments );
        },
		//设置渠道等是否可以保持通过
		//设置状态
        setStateCheck: function(){
            var me = this;

            if( me.attrs.isCanEdit == 'true' ){
                me.$('.state-current').show();
				me.$statusDisabled.removeAttr('disabled');
				//me.$lookCard.hide()
				me.$upCard.show()
            }else{
				me.$('.state-current').hide();
				me.$statusDisabled.attr('disabled','disabled');
				//me.$lookCard.show()
				me.$upCard.hide()
			}
			//me.setType();
        },
		getInfo:function(data,showFlage){
			
			var me = this;
			
			function translateBool( key , value ){
                if(value){
                    me.model.set(key,'true');
                }else{
                    me.model.set(key,'false');
                }
            }
			me.model.load( data.value.model );
			me.model.set('accountTotalAmount',(data.value.model.accountTotalAmount ? data.value.model.accountTotalAmount:'0') );
			
			if( data.value.model.useBusinessCard){
				me.$cardPrice.show();
				me.model.set('useBusinessCard','1');
				me.model.set('cardPrice',data.value.model.businessCardPrice);
			}else{
				me.model.set('cardPrice','');
				me.model.set('useBusinessCard','0');
				me.$cardPrice.hide();
			}
			me.model.set('discount',(data.value.model.discount ? (data.value.model.discount.toFixed(1)):'0') );
			me.model.set('dealDays',(data.value.model.dealDays ? data.value.model.dealDays:'0') );
			me.model.set('city',(data.value.model.city ? data.value.model.city:'') );
			me.model.set('regionName',data.value.model.regionName?data.value.model.regionName:data.value.model.regionCode);
			
			//显示产品信息
			me.showProduct(data.value.model.odrSubOrderList);
			
			translateBool( 'isSaleTeam' , data.value.model['isSaleTeam'] );
			translateBool( 'isFirstmeetingSign' , data.value.model['isFirstmeetingSign'] );
			translateBool( 'isWillPin' , data.value.model['isWillPin'] );
			translateBool( 'isStrangerVisits', data.value.model['isStrangerVisits'] );
			translateBool( 'isFastSign' , data.value.model['isFastSign'] );
			translateBool( 'isAutoClave', data.value.model['isAutoClave'] );
			translateBool( 'isReferral', data.value.model['isReferral'] );
			me.attrs.runStatus = data.value.model.runStatus||'';
			if(showFlage){
				me.setState();
			}
			
		},
		showProduct:function(lists){
			var me = this; 
			_.each(lists, function(value,index){
				switch(lists[index].productId)
				{
					//crm  
					case 1:
						me.$('.crm-check:checkbox').attr("checked", true);
						me.showProductInfo('crm',lists[index]);
					  break;
					//分享百川
					case 2:
						me.showProductInfo('baichuan',lists[index]);
					  break;
					 //报数系统
					case 3:
						me.showProductInfo('system',lists[index])
					  break;
					//PK助手
					case 4:
						me.$('.pk-check:checkbox').attr("checked", true);
						me.showProductInfo('pk',lists[index]);
						
					  break;
					//会议助手
					case 5:
						me.$('.meet-check:checkbox').attr("checked", true);
						me.showProductInfo('meet',lists[index])
					  break;
					//HR助手
					case 6:
						me.$('.hr-check:checkbox').attr("checked", true);
						me.showProductInfo('hr',lists[index])
					  break;
					//工资助手
					case 7:
						me.$('.pay-check:checkbox').attr("checked", true);
						me.showProductInfo('pay',lists[index])
					  break;
					default:
					 
				}
			});
		},
		//显示产品详细信息：
		showProductInfo:function(productStr,data){
			var me = this;
			var tempStime =  new Date( data.startTime )._format('yyyy/MM/dd');
			var tempEtime =  new Date( data.endTime )._format('yyyy/MM/dd');
			me.model.set( productStr+'-purchaseCount',data.purchaseCount);
			me.model.set( productStr+'-productAmount',data.productAmount);
			me.model.set( productStr+'-purchaseAmount',data.purchaseAmount);
			me.model.set( productStr+'-startTime',tempStime);
			me.model.set( productStr+'-endTime',tempEtime);
			me.model.set( productStr+'-subOrderId',data.id);
		},
		/**
         *
         *显示文件
         */
		downFile: function(data){
            var me = this;
			var contractFilePath = data.value.model.contract||'';
			var contractCopyFilePath = data.value.model.contractCopy||'';
			var businessLicense = data.value.model.businessLicense||'';
			var companyGatePicture = data.value.model.companyGatePicture||'';
            //更新企业详情
			//var a = '~/op/api/file/previewimage ' + '?fileName=' + fileName ;
			//显示合同下载
            if(contractFilePath){
				me.$lookContract.show();
				me.$contractHide.hide();
				me.$contractLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
				me.$imgContract.attr('src', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
			}else{
				me.$lookContract.hide();
				me.$contractHide.show();
				me.$contractLink.attr('href', '');
				me.$imgContract.attr('src', '');
			}
			//显示合同副本
            if(contractCopyFilePath){
				me.$lookContractCopy.show();
				me.$contractCopyHide.hide();
				me.$contractCopyLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + contractCopyFilePath);
				me.$imgContractCopy.attr('src', '/op/api/file/previewimage' + '?filePath=' + contractCopyFilePath);
			}else{
				me.$lookContractCopy.hide();
				me.$contractCopyHide.show();
				me.$contractCopyLink.attr('href', '');
				me.$imgContractCopy.attr('src', '');
			}
			//显示营业执照下载
            if(businessLicense){
				me.$lookYyzhizhao.show();
				me.$yyzhizhaoHide.hide();
				me.$yyzhizhaoLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + businessLicense);
				me.$imgYyzhizhao.attr('src', '/op/api/file/previewimage' + '?filePath=' + businessLicense);
			}else{
				me.$lookYyzhizhao.hide();
				me.$yyzhizhaoHide.show();
				me.$yyzhizhaoLink.attr('href', '');
				me.$imgYyzhizhao.attr('src', '');
				
			}
			//显示门头执照下载
            if(companyGatePicture){
				me.$lookMtzhizhao.show();
				me.$mtzhizhaoHide.hide();
				me.$MtzhizhaoLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + companyGatePicture);
				me.$imgMtzhizhao.attr('src', '/op/api/file/previewimage' + '?filePath=' + companyGatePicture);
			}else{
				me.$lookMtzhizhao.hide();
				me.$mtzhizhaoHide.show();
				me.$MtzhizhaoLink.attr('href', '');
				me.$imgMtzhizhao.attr('src', '');
			}
        }, 
		//保存并提交
        byEve: function(){
			var me = this;
            
			me.model.set('dealDays', parseInt( me.model.get('dealDays') ) ? parseInt( me.model.get('dealDays') ) :'' );
			me.model.set('storageTotalSpace', parseFloat( me.model.get('storageTotalSpace') ) ? parseFloat(me.model.get('storageTotalSpace')):'' );
			
            //调用获取提交的全部信息
			me.getAllInfo();
            
            //保存后同意审批
            function changeNode(){
               util.api({
                    'url': '~/op/api/approval/directapprove',
                    'data':{
                        'processInstanceId': me.attrs.id,     //流程实例ID
                        'approved': true,                     //审批结果(通过/拒绝)
                        'opinion': me.model.get('comment')    //审批意见
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
						me.$actionReject.text('驳回');
						me.$actionReject.removeAttr('disabled');
						me.$actionResend.text('保存通过');
						me.$actionResend.removeAttr('disabled');
					}
                });
            };
            
			var bool = confirm("确认修改并同意此条审批吗?");
            if( bool ){
				//更新企业详情
				me.$actionAgree.text('提交中....');
				me.$actionAgree.attr('disabled','disabled');
				me.$actionReject.text('提交中....');
				me.$actionReject.attr('disabled','disabled');
				me.$actionResend.text('提交中....');
				me.$actionResend.attr('disabled','disabled');
				util.api({
					url: '/enterprise/updateenterprise',
					data: me.model.all(),
					success: function( data ) {

						if ( data.success ) {
							changeNode();
						}
					},
					complete: function(){
						me.$actionAgree.text('同意');
						me.$actionAgree.removeAttr('disabled');
						me.$actionReject.text('驳回');
						me.$actionReject.removeAttr('disabled');
						me.$actionResend.text('保存通过');
						me.$actionResend.removeAttr('disabled');
					}
				});
            
            }

           
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
                        'processInstanceId': me.attrs.id,   //流程实例ID
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
                        'processInstanceId': me.attrs.id,     //流程实例ID
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
           /* var me = this;
			me.model.clear();
			me.$contractLink.attr('href', '');
			me.$imgContract.attr('src', '');
			me.$MtzhizhaoLink.attr('href', '');
			me.$imgMtzhizhao.attr('src', '');
			me.$yyzhizhaoLink.attr('href', '');
			me.$('.free-box').hide();
			me.$('.buy-box').hide();
			me.$imgYyzhizhao.attr('src', '');
			me.$contractCopyLink.attr('href','');
			me.$imgContractCopy.attr('src', '');
			me.$('.contract-link-add').attr('href','');
			me.$('.img-contract-add').attr('src', '');
			me.$('.contractCopy-link-add').attr('href','');
			me.$('.img-contractCopy-add').attr('src', '');
			me.$('.contract-link-free').attr('href','');
			me.$('.img-contract-free').attr('src', '');
			me.$('.contractCopy-link-free').attr('href','');
			me.$('.img-contractCopy-free').attr('src', '');
            me.$('.state').hide();*/
			this.remove();
            DetailPay.__super__.hide.apply( this,arguments );
        }
    });
        
	module.exports = DetailPay;
});
