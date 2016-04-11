/**
 * 
 * 查看审批详情
 * 用于 渠道人员 支持人员 查看 审批详情
 *
 */

define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./openapproval.html');
	var uploader = require('common/widget/upload').uploader;

    var OpenApproval = MClass( Slider ).include({
		content: contentStr,

        defaultAttr: {
            'title': '审批详情',
            'width': 700
        },

        events: {
            'click .action-reject': 'rejectEve',
            'click .action-agree': 'agreeEve',
			'click .action-resend': 'resendEve'      //重新发送
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
            '.endTime': 'endTime',
			'.start-time-ht':'startTimeHt',
			'.end-time-ht':'endTimeHt',
			'.contractprice': 'contractprice',       //合同金额
			'.deviceamount': 'deviceamount',          //终端数量
			'.marketingAccountAmount':'marketingAccountAmount',
			'.contract-link': 'contractLink',
			'.contract-hide': 'contractHide',
			'.show-type': 'showType',
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
			'.card-price':'cardPrice',
			'.up-card':'upCard',
			'.status-disabled': 'statusDisabled',
			'.action-save':'actionSave',
			'.action-resend':'actionResend',
			'.useBusinessCard':'useBusinessCard',
			'.action-agree':'actionAgree',
			'.action-reject':'actionReject',
			'.add-type':'addType',
			'.money-date':'moneyDate'
			
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
                'pr': false,
                'service': false
            };

            //检查是否获取完毕
            function check(){
                if( state.i && state.e && state.p && state.g && state.k && state.r && state.c && state.service ){
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

            //获取产品列表
            /*
            util.api({
                'url': '/product/querypage',
                'data': {
                    'isPage':1
                },
                'success': function( data ){
                    console.warn( data );
                    var list = [{'name':'请选择'}]
                    if( data.success ){
                        data.value.model.content.forEach( function( item ){
                            list.push( {'name':item.name,'value':item.id} );
                        });
                        util.resetSelect( me.$product,list );
                        state['pr'] = true;

                        check();
                    }
                }
            });
            */
			//合同金额改变
			me.$contractprice.on('focusout',function(){
				me.model.set('contractPrice',parseFloat(me.model.get('contractPrice'))?parseFloat(me.model.get('contractPrice')):'');
				me.getdiscount();
			});


			me.$deviceamount.on('focusout',function(){
				var buyCount = me.model.get('marketingAccountAmount')?parseInt(me.model.get('marketingAccountAmount')):0;
				me.model.set('accountTotalAmount',parseInt(me.model.get('accountTotalAmount'))?parseInt(me.model.get('accountTotalAmount')):'');
				if(buyCount>0){
					me.model.set('marketingAccountAmount',parseInt(me.model.get('marketingAccountAmount'))?parseInt(me.model.get('marketingAccountAmount')):'');
					me.getFreeNum();
				}
				
			});

			//营销版数量改变
			me.$marketingAccountAmount.on('focusout',function(){
				me.getFreeNum();
				me.getdiscount();
			});
			
			//合同开始时间
			me.$startTimeHt.on('focusout',function(){
				me.getdiscount();
			});
			//合同介绍时间
			me.$endTimeHt.on('focusout',function(){
				me.getdiscount();
			});
			//是否使用名片
			me.$useBusinessCard.on('change',function(){
				me.getdiscount();
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

            //培训服务费
            generate('OPEN_VERSION_NUM', me.$('.expenseType') ,'service');
        },
		getFreeNum: function(){
			var me = this;

			var buyCount = me.model.get('marketingAccountAmount')?parseInt(me.model.get('marketingAccountAmount')):0;
			var	sumNum =  me.$deviceamount.val()?parseInt(me.$deviceamount.val()):0;
			if(sumNum>0&&sumNum<buyCount){
				util.showToast('营销版数量不能大于逍客终端数量');
				me.model.set('marketingAccountAmount','');
				return false;
			}
            /*
			if(sumNum!=0&&(sumNum-buyCount)>15){
				util.showToast('终端赠送上限为15,请修改终端总量!');
				me.$deviceamount.val('');
				return false;
			}
            */
			if(buyCount>0 && me.attrs.type  == 'payLaunchApproval'){
				me.model.set('isPaid','1');
			}else{
				me.model.set('isPaid','0');
			}
		},
		//获取折扣
		getdiscount: function(){
			var me = this;
			var contractStartTime = new Date( me.$startTimeHt.val() ).getTime()||'' ,
				contractEndTime = new Date( me.$endTimeHt.val() ).getTime()||'',
				contractPrice = me.model.get('contractPrice'),
				accountAmount = me.model.get('marketingAccountAmount'),
				buyBusinessCard = me.model.get('useBusinessCard');
				
			if( contractStartTime && contractEndTime && buyBusinessCard =='1'){
				util.api({
					'url':'~/op/api/a/enterprise/getbusinesscardprice',
					'data':{
						'contractStartTime':contractStartTime,
						'contractEndTime':contractEndTime
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

			if( contractStartTime && contractEndTime && accountAmount && contractPrice && buyBusinessCard ){
				//me.$actionSave.attr('disabled','disabled');
				//me.$actionSave.text('折扣计算中...');
				
				me.discountxhr && me.discountxhr.abort();
				me.discountxhr = util.api({
					url:'/enterprise/getdiscount',
					'data':{
						'contractStartTime': contractStartTime,
						'contractEndTime': contractEndTime,
						'accountAmount': accountAmount,
						'contractPrice': contractPrice,
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
							//me.$actionSave.removeAttr('disabled');
							//me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存通过');
						}else{
							//me.$actionSave.removeAttr('disabled');
							//me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存通过');
						}
					}
				})
			}
		},

        init: function(){
            OpenApproval.__super__.init.apply( this,arguments );
            var me = this;
			me.$statusDisabled.attr('disabled','disabled');
			me.$startTimeHt.datetimepicker( {
				format: 'Y/m/d',
				timepicker: true
			} );
			me.$endTimeHt.datetimepicker( {
				format: 'Y/m/d',
				timepicker: true
			} );
			me.$moneyDate.datetimepicker( {
				format: 'Y/m/d',
				timepicker: true
			} );

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
					//me.$actionSave.attr('disabled','disabled');
					//me.$actionSave.text('文件上传...');
					me.$actionResend.attr('disabled','disabled');
					me.$actionResend.text('文件上传...');
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
							//me.$actionSave.removeAttr('disabled');
							//me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存通过');
						},
						'error':function(response){
							//me.$actionSave.removeAttr('disabled');
							//me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存通过');
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
					//me.$actionSave.attr('disabled','disabled');
					//me.$actionSave.text('文件上传...');
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
							//me.$actionSave.removeAttr('disabled');
							//me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存通过');
						},
						'error':function(response){
							//me.$actionSave.removeAttr('disabled');
							//me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存通过');
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
					//me.$actionSave.attr('disabled','disabled');
					//me.$actionSave.text('文件上传...');
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
							//me.$actionSave.removeAttr('disabled');
							//me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存通过');
							
						},
						'error':function(response){
							//me.$actionSave.removeAttr('disabled');
							//me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存通过');
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
					//me.$actionSave.attr('disabled','disabled');
					//me.$actionSave.text('文件上传...');
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
							//me.$actionSave.removeAttr('disabled');
							//me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存通过');
						},
						'error':function(response){
							//me.$actionSave.removeAttr('disabled');
							//me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
							me.$actionResend.text('保存通过');
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
		//设置状态
        setState: function(){
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
			me.setType();
        },
		//根据申请类型不同显示不同的信息
        setType: function(){
            var me = this;

            me.$showType.hide();
			me.$addType.hide();
			me.$('.show-service').hide();
            
            //付费审批
            //付费审批 showType的元素显示
            if( me.attrs.type  == 'payLaunchApproval' ){
                me.$showType.show();
            
            //免费审批
            //免费审批 showType的元素隐藏
            }else if( me.attrs.type  == 'freeLaunchApproval' ){
				me.$showType.hide();
                me.$('.show-service').show();
                
				if(me.attrs.currentState == 'end' || me.attrs.currentState == 'allEnd'){
					util.api({
						'url':'/order/getOrderDetailByEnterpriseId',
						'data':{
							'enterpriseId': me.attrs.eid
						},
						'success': function( data ){
							if( data.success ){
								if( data.value.model.invoice ){
									me.$('.amountService').val(data.value.model.invoice.amount);
									//me.$('.expenseType').val(data.value.model.invoice.expenseType);
									me.$('.expenseType').val( data.value.model.invoice.personCount );
                                    me.$('.invoiceHead').val(data.value.model.invoice.invoiceHead);
									me.$('.payerName').val(data.value.model.invoice.payerName);
				
									var payDate = data.value.model.invoice.payDate? new Date( data.value.model.invoice.payDate  )._format('yyyy/MM/dd'):'';
									me.$('.payDate').val(payDate);
									me.attrs.orderId = data.value.model.invoice.orderId;
									//me.$('.expenseType').val('1');
								}else{
									//me.model.set('expenseType', 0);
									//me.$('.expenseType').val('0');
								}
							}
						}
					});
				}else{
					util.api({
						'url':'/order/getOrderDetailByProcessInstanceId',
						'data':{
							'processInstanceId': me.attrs.id
						},
						'success': function( data ){
							if( data.success ){
								if( data.value.model.isPayServiceCharge ){
									me.$('.amountService').val(data.value.model.invoice.amount);
									//me.$('.expenseType').val(data.value.model.invoice.expenseType);
									me.$('.expenseType').val( data.value.model.invoice.personCount );
                                    me.$('.invoiceHead').val(data.value.model.invoice.invoiceHead);
									me.$('.payerName').val(data.value.model.invoice.payerName);
				
									var payDate = data.value.model.invoice.payDate? new Date( data.value.model.invoice.payDate  )._format('yyyy/MM/dd'):'';
									me.$('.payDate').val(payDate);
									me.attrs.orderId = data.value.model.invoice.orderId;
									//me.$('.expenseType').val('1')
								}else{
									//me.model.set('expenseType', 0);
									//me.$('.expenseType').val('0');
								}
							}
						}
					});
				}
				
			}else if( me.attrs.type  == 'addPurchaseApproval' || me.attrs.type  == 'addFreeApproval' ){
				me.$addType.show();
				me.$showType.hide();
			    //获取增购信息
				util.api({
					'url': '/enterprise/getIncreaseEnterpriseAccountDetail',
					'data':{
						'processInstanceId': me.attrs.id,
						'enterpriseId': me.attrs.eid
						
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							if(!data.value.model.isAddFree){
								me.$('.buy-box').show();
								var contractStartTimeAdd = data.value.model.contractStartTime ?new Date( data.value.model.contractStartTime  )._format('yyyy/MM/dd'):'';
								var contractEndTimeAdd =data.value.model.contractEndTime? new Date( data.value.model.contractEndTime  )._format('yyyy/MM/dd'):'';
								me.model.set('accountTotalAmountAdd',(data.value.model.accountTotalAmount ? data.value.model.accountTotalAmount:'0') );
								me.model.set('marketingAccountAmountAdd',(data.value.model.marketingAccountAmount ? data.value.model.marketingAccountAmount:'0') );
								
								me.model.set('storageTotalSpaceAdd',(data.value.model.storageTotalSpace ? data.value.model.storageTotalSpace:'0') );
								me.model.set('contractStartTimeAdd',(contractStartTimeAdd ? contractStartTimeAdd:'') );
								me.model.set('contractEndTimeAdd',(contractEndTimeAdd ? contractEndTimeAdd:'') );
								if(data.value.model.contract){
									me.$('.contract-link-add').show();
									me.$('.contract-hide-add').hide();
									me.$('.contract-link-add').attr('href', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contract);
									me.$('.img-contract-add').attr('src', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contract);
								}else{
									me.$('.contract-link-add').hide();
									me.$('.contract-hide-add').show();
									me.$('.contract-link-add').attr('href', '');
									me.$('.img-contract-add').attr('src', '');
								}
								//显示合同副本
								if(data.value.model.contractCopy){
									me.$('.contractCopy-link-add').show();
									me.$('.contractCopy-hide-add').hide();
									me.$('.contractCopy-link-add').attr('href', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contractCopy);
									me.$('.img-contractCopy-add').attr('src', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contractCopy);
								}else{
									me.$('.contractCopy-link-add').hide();
									me.$('.contractCopy-hide-add');
									me.$('.contractCopy-link-add').attr('href', '');
									me.$('.img-contractCopy-add').attr('src', '');
								}
								me.model.set('contractPriceAdd',(data.value.model.contractPrice ? data.value.model.contractPrice:'0') );
								me.model.set('discountAdd',(data.value.model.discount ? data.value.model.discount.toFixed(1):'0') );
								me.model.set('invoiceTitleAdd',(data.value.model.invoiceTitle ? data.value.model.invoiceTitle:'') );
								var marketingAccountAmountNum = data.value.model.marketingAccountAmount?parseInt(data.value.model.marketingAccountAmount):0;
								
								/*if( marketingAccountAmountNum > 0){
									me.model.set('isPaidAdd','1');
								}else{
									me.model.set('isPaidAdd','0');
								}*/
							
								if( data.value.model.useBusinessCard){
									me.$('.card-price-add').show();
									me.model.set('useBusinessCardAdd','1');
									//me.model.set('cardPriceAdd',data.value.model.businessCardPrice);
									util.api({
										'url':'~/op/api/a/enterprise/getbusinesscardprice',
										'data':{
											'contractStartTime':data.value.model.contractStartTime,
											'contractEndTime':data.value.model.contractEndTime
										},
										'success': function( data ){
											if( data.success ){
												me.model.set('cardPriceAdd', data.value.model);
											}
										}
									});
								}else{
									me.model.set('cardPriceAdd','');
									me.model.set('useBusinessCardAdd','0');
									me.$('.card-price-add').hide();
								}
							}else{
								me.$('.free-box').show();
								me.model.set('freeAccountTotalAmount',(data.value.model.accountTotalAmount ? data.value.model.accountTotalAmount:'0') );
								me.model.set('freeStorageTotalSpace',(data.value.model.storageTotalSpace ? data.value.model.storageTotalSpace:'0') );
								
								var contractStartTimeFree = data.value.model.contractStartTime ?new Date( data.value.model.contractStartTime  )._format('yyyy/MM/dd'):'';
								var contractEndTimeFree =data.value.model.contractEndTime? new Date( data.value.model.contractEndTime  )._format('yyyy/MM/dd'):'';
								me.model.set('contractStartTimeFree',(contractStartTimeFree ? contractStartTimeFree:'') );
								me.model.set('contractEndTimeFree',(contractEndTimeFree ? contractEndTimeFree:'') );
								
								if(data.value.model.contract){
									me.$('.contract-link-free').show();
									me.$('.contract-hide-free').hide();
									me.$('.contract-link-free').attr('href', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contract);
									me.$('.img-contract-free').attr('src', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contract);
								}else{
									me.$('.contract-link-free').hide();
									me.$('.contract-hide-free').show();
									me.$('.contract-link-free').attr('href', '');
									me.$('.img-contract-free').attr('src', '');
								}
								//显示合同副本
								if(data.value.model.contractCopy){
									me.$('.contractCopy-link-free').show();
									me.$('.contractCopy-hide-free').hide();
									me.$('.contractCopy-link-free').attr('href', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contractCopy);
									me.$('.img-contractCopy-free').attr('src', '/op/api/file/previewimage' + '?filePath=' + data.value.model.contractCopy);
								}else{
									me.$('.contractCopy-link-free').hide();
									me.$('.contractCopy-hide-free');
									me.$('.contractCopy-link-free').attr('href', '');
									me.$('.img-contractCopy-free').attr('src', '');
								}
								me.model.set('invoiceTitleFree',(data.value.model.invoiceTitle ? data.value.model.invoiceTitle:'') );
							}
							
						}
					}
				});
			}
			
        },
        show: function( id , eid , type , state, isCanEdit){
            var me = this;

            me.attrs.id = id;
            me.attrs.eid = eid;
            me.attrs.type = type;
			me.attrs.isCanEdit = isCanEdit||'false';
			me.attrs.currentState = state;

            //设置显示状态
            me.$('.state').hide();
            me.$('.state-'+state).show();
			me.$('.expenseType').val('0');

            util.api({
                'url': '/enterprise/getenterprise',
                'data': {
                    'enterpriseId': me.attrs.eid
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
						me.detailShow(type,data)
                        me.model.load( data.value.model );
						me.model.set('accountTotalAmount',(data.value.model.accountTotalAmount? data.value.model.accountTotalAmount:'0') );
						me.model.set('marketingAccountAmount',(data.value.model.marketingAccountAmount ? data.value.model.marketingAccountAmount:'0') );
						me.model.set('isPaid',(data.value.model.isPaid? data.value.model.isPaid:'0') );
						if(data.value.model.useBusinessCard){
							me.$cardPrice.show();
							me.model.set('cardPrice',data.value.model.businessCardPrice);
							me.model.set('useBusinessCard','1');
						}else{
							me.model.set('cardPrice','');
							me.model.set('useBusinessCard','0');
							me.$cardPrice.hide();
						}
						var contractStartTime = data.value.model.contractStartTime?new Date( data.value.model.contractStartTime)._format('yyyy/MM/dd'):'';
						var contractEndTime = data.value.model.contractEndTime?new Date( data.value.model.contractEndTime)._format('yyyy/MM/dd'):'';
						me.model.set('contractStartTime',contractStartTime );
						me.model.set('contractEndTime',contractEndTime );
						me.model.set('discount',(data.value.model.discount ? data.value.model.discount.toFixed(1):'0') );
						me.model.set('regionName',data.value.model.regionName?data.value.model.regionName:data.value.model.regionCode);
                    }
                }
            });
			me.setState();
			//me.setType();
            OpenApproval.__super__.show.apply( this,arguments );
        },
 
		//保存并提交
        resendEve: function(){
			var me = this;
            
			me.model.set('dealDays', parseInt( me.model.get('dealDays') ) ? parseInt( me.model.get('dealDays') ) :'' );
			me.model.set('storageTotalSpace', parseFloat( me.model.get('storageTotalSpace') ) ? parseFloat(me.model.get('storageTotalSpace')):'' );
			
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
			objDate['payStatus']=1;
            if( me.attrs.type  == 'payLaunchApproval' ){
                objDate['orderType']=3;
                objDate['contractType'] = 1;
				objDate['contractPrice']=me.model.get('contractPrice');
				objDate['discount']=me.model.get('discount')||10;
				objDate['invoiceTitle']=me.model.get('invoiceTitle');
				
				var countNum = me.model.get('accountTotalAmount')?parseInt(me.model.get('accountTotalAmount')):0;
				var singleNum = me.model.get('marketingAccountAmount')?parseInt(me.model.get('marketingAccountAmount')):0;
				if(countNum==0 && singleNum==0){
					util.showToast('逍客终端数量与营销版数量不能同时为零！');
					return false;
				}
				if(countNum!=0&&(countNum<singleNum)){
					
					util.showToast('营销版数量不能大于逍客终端数量');
					return false;
				}
				objDate['marketingAccountAmount']=me.model.get('marketingAccountAmount');
				if(countNum==0&&singleNum>0){
					//me.model.set('accountTotalAmount',me.model.get('marketingAccountAmount'));
					objDate['accountTotalAmount']=me.model.get('marketingAccountAmount');
				}
				if(!objDate['contractPrice']|| !objDate['discount'] || !objDate['invoiceTitle']){
					util.showToast('信息填写不完整');
					return false;
				}
				objDate['useBusinessCard']=me.model.get('useBusinessCard');
				
				objDate['isPaid']=me.model.get('isPaid');
				
            }else{
                
				objDate['contractType'] = 0;
				objDate['contractPrice']='';
				objDate['discount']=10;
				objDate['invoiceTitle']='';
				objDate['useBusinessCard'] = '0';
				objDate['orderType']=1;
				objDate['marketingAccountAmount'] = 0;
				objDate['accountTotalAmount']=me.model.get('accountTotalAmount')
				objDate['isPaid']='0';
				var countNum = me.model.get('accountTotalAmount')?parseInt(me.model.get('accountTotalAmount')):0;
				/*
                if(countNum==0||countNum>15){
					util.showToast('逍客终端数量不能为零且上限为15！');
					return false;
				}
                */
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
		
			if( !objDate['contractStartTime'] ){
				util.warnInput( $('.start-time-ht') );
				state = false;
			}else{
				util.unWarnInput( $('.start-time-ht') );
			}

			if( !objDate['contractEndTime'] ){
				util.warnInput( $('.end-time-ht') );
				state = false;
			}else{
				util.unWarnInput( $('.end-time-ht'));
			}
			if( state == false ){
				util.showToast('信息填写不完整');
				return ;
			}
            
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
					data: objDate,
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


        /**
         *
         *显示文件
         */
		detailShow: function( type,data){
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

        hide: function(){
            var me = this;
			me.$MtzhizhaoLink.attr('href', '');
			me.$imgMtzhizhao.attr('src', '');
			me.$yyzhizhaoLink.attr('href', '');
			me.$imgYyzhizhao.attr('src', '');
			me.$contractLink.attr('href', '');
			me.$imgContract.attr('src', '');
			me.$('.buy-box').hide();
			me.$('.free-box').hide();
			me.$contractCopyLink.attr('href', '');
			me.$imgContractCopy.attr('src', '');
			me.$('.contract-link-add').attr('href', '');
			me.$('.img-contract-add').attr('src', '');
			me.$('.contractCopy-link-add').attr('href', '');
			me.$('.img-contractCopy-add').attr('src', '');
			me.$('.contract-link-free').attr('href', '');
			me.$('.img-contract-free').attr('src', '');
			me.$('.contractCopy-link-free').attr('href', '');
			me.$('.img-contractCopy-free').attr('src', '');
			me.$actionResend.text('保存通过');
			me.$actionResend.removeAttr('disabled');
			me.$actionAgree.text('同意');
			me.$actionAgree.removeAttr('disabled');
			me.$actionReject.text('驳回');
			me.$actionReject.removeAttr('disabled');
            me.model.clear();
            OpenApproval.__super__.hide.apply( this,arguments );
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
        }
    });
    

	module.exports = OpenApproval;
});
