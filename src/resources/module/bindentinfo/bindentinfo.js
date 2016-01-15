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
	 var AreaTree = require('module/areatree/areatree');

	var contentStr = require('./bindentinfo.html');

    /////////////////
    //
    //  备案企业与自注册企业对比
    /////////////////
	var BindEntInfo = MClass( Slider ).include({

		view: contentStr,

		defaultAttr: {
			'title': '备案企业与自注册企业详情',
			'width': 730
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
			'.yearlimit': 'yearlimit',               //合同年限
			'.contractprice': 'contractprice',       //合同金额
			'.deviceamount': 'deviceamount',          //终端数量
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
			'.add-type':'addType',
			'.up-card-add':'upCardAdd',
			'.status-disabled-add':'statusDisabledAdd',
			'.contractCopyAdd':'contractCopyAdd',
			'.contractAdd':'contractAdd',
			'.firm-status':  'firmStatus',
			'.visite-time':  'visiteTime',
			'.filing-region': 'filingRegion',
			'.action-agree':'actionAgree',
			'.action-reject':'actionReject',
			'.state-visite': 'stateVisite',
			'.checked-email':'checkedEmail',
			'.right-info':'rightInfo'
		},

		events:{
			'click .action-cancel': 'cancelEve',     //取消审批
			'click .action-backout': 'backoutEve',   //撤销审批
			'click .action-resend': 'resendEve'  ,    //重新发送
			'click .action-save': 'saveEve',
			'click .filing-region': 'regionEve',     //选择区域
			 'click .action-reject': 'rejectEve',
            'click .action-agree': 'agreeEve'
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
			
			//获取销售团队规模
			generate('LEADS_STATUS', me.$firmStatus ,'');
		},
		
		init: function(){
			BindEntInfo.__super__.init.apply( this,arguments );
			var me = this;
			
			//选择区域模块

            me.areaTree = new AreaTree();
            me.areaTree.on('selectarea',function( treenodes ){
                
                me.$filingRegion.val( treenodes[0]['name'] ).attr('data-code', treenodes[0]['code'] );
            });
			
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
			me.$('.start-time-ht-add').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDateAdd = me.$('.end-time-ht-add').val() ? me.$('.end-time-ht-add').val() : false;
					this.setOptions({
						maxDateAdd: maxDateAdd
					});
				},
				timepicker: false
			} );
			me.$('.end-time-ht-add').datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDateAdd = me.$('.start-time-ht-add').val() ? me.$('.start-time-ht-add') : false;
					this.setOptions({
						minDateAdd: minDateAdd
					});
				},
				timepicker: false
			} );
			
			 //初始化日期选择
            me.$visiteTime.datetimepicker({
                format: 'Y/m/d',
                timepicker: true
            });
			
			me.$checkedEmail.on('focusout',function(){
	
				var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/ ;
				if(!reg.test( me.$checkedEmail.val())){
					util.showToast('邮箱格式不正确！');
					me.$checkedEmail.val('');
					return false;
				}
			});


			me.getEnums();
			
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
			if( me.attrs.isCurrentTask  == 'true' && me.attrs.type  != 'addPurchaseApproval' ){
				me.$('.state-current').show();
				me.$statusDisabled.removeAttr('disabled');
				util.api({
					'url': '~/op/api/approval/getenterpriseaccount  ',
					'data': {
						'processInstanceId': me.attrs.id
					},
					'success': function( data ){
						
						if( data.success ){
							me.model.set('enterpriseAccountRecord',data.value.enterpriseAccount);
						}
					}
				});
				
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
				//me.$lookCard.show()
				me.$upCard.hide();
				me.$upCardAdd.hide();
				me.$('.state-current').hide();
				me.$statusDisabledAdd.attr('disabled','disabled');
			}
			me.setType();
		},
		//根据申请类型不同显示不同的信息
		setType: function(){
			var me = this;

			me.$showType.hide();
			me.$addType.hide();

			if( me.attrs.type  == 'payLaunchApproval' ){
				me.$showType.show();
			}else if( me.attrs.type  == 'freeLaunchApproval' ){
				me.$showType.hide();
			}else if( me.attrs.type  == 'addPurchaseApproval' ){
				me.$addType.show();
			}
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
			var objDate = {};
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
			if( state == false ){
				util.showToast('信息填写不完整');
				return ;
			}
			objDate['enterpriseName'] = me.model.get('enterpriseNameRecord');
			objDate['address'] = me.model.get('addressRecord');
			objDate['remark'] = me.model.get('remarkRecord');
			objDate['contactPhone'] = me.model.get('contactPhoneRecord');
			objDate['contactName'] = me.model.get('contactNameRecord');
			objDate['contactPost'] = me.model.get('contactPostRecord');
			objDate['contactEmail'] = me.model.get('contactEmailRecord');
			objDate['cardPath'] = '';
			objDate['card2Path'] = '';
			objDate['region'] = me.$filingRegion.attr('data-code');
			objDate['source'] = me.model.get('sourceRecord');
			objDate['industry'] = me.model.get('industryRecord');
			objDate['representative'] = me.model.get('agentPersonRecord');
			objDate['enterpriseFilingId'] = me.attrs.enterpriseFilingId;
			objDate['employeeNumber'] = me.model.get('companyNumRecord');
			objDate['accountAmount'] = me.model.get('clientNumRecord');
			objDate['representativePhone'] = me.model.get('kpPhoneRecord');
			objDate['visitTime'] = me.$visiteTime.val()?new Date( me.$visiteTime.val() ).getTime():'';
			objDate['enterpriseAccount'] = me.model.get('enterpriseAccountRecord');
			objDate['processInstanceId'] = me.attrs.id;
			objDate['opinion'] = '';
			util.api({
                    'url': '/enterprisefiling/saveandbindenterprisefiling',
                    'data':objDate,
					'button': {
						'el': me.$actionResend,
						'text':'提交中......'
					},
                    success: function( data ){
                        console.warn( data );
                        if( data.success ){
							util.showTip('批复成功');
                            me.hide();
                            me.trigger('sendsuccess');
                        }
                    }
                })
		},
		//显示
		render: function(){
			var me = this;
			me.attrs['wrapper'].html( me.$view );

		},
		
		/**
		 *
		 * @param id   实例id
		 * @param eid  企业id
		 * @param type 类型
		 */
		show: function( id , eid , type , canCancel , isCurrentTask,isCanEdit ,activeStatus ){
			var me = this;
			me.attrs.id = id;
			me.attrs.eid = eid;
			me.attrs.type = type||'false';
			me.attrs.canCancel = canCancel || 'false';
			me.attrs.isCurrentTask = isCurrentTask || 'false';
			me.attrs.isCanEdit = isCanEdit || 'false';
			me.attrs.activeStatus = activeStatus || '';
			me.attrs.enterpriseFilingId = '';

			function translateBool( key , value ){
				if(value){
					me.model.set(key,'true');
				}else{
					me.model.set(key,'false');
				}
			}
			me._setWidth('450');
			if( me.attrs.activeStatus != 'end'){
				util.api({
					'url': '/enterprise/getbyprocessinstanceid',
					'data': {
						'processInstanceId': me.attrs.id
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){

							//me.getRegistrationEnterprise(data);
							me.getRecordEnterprise( data );
							//me.downFile(data);
							
							//translateBool( 'isSaleTeam' , data.value.model['isSaleTeam'] );
							//translateBool( 'isFirstmeetingSign' , data.value.model['isFirstmeetingSign'] );
							//translateBool( 'isWillPin' , data.value.model['isWillPin'] );
							//translateBool( 'isStrangerVisits', data.value.model['isStrangerVisits'] );
							//translateBool( 'isFastSign' , data.value.model['isFastSign'] );
							//translateBool( 'isAutoClave', data.value.model['isAutoClave'] );
							//translateBool( 'isReferral', data.value.model['isReferral'] );
							
						}
					}
				})
			}else{
				util.api({
					'url': '/enterprise/getenterpriseandfiling',
					'data': {
						'enterpriseId': me.attrs.eid
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){

							//me.getRegistrationEnterprise(data);
							me.getRecordEnterprise( data );
							//me.downFile(data);
							
							/*translateBool( 'isSaleTeam' , data.value.model['isSaleTeam'] );
							translateBool( 'isFirstmeetingSign' , data.value.model['isFirstmeetingSign'] );
							translateBool( 'isWillPin' , data.value.model['isWillPin'] );
							translateBool( 'isStrangerVisits', data.value.model['isStrangerVisits'] );
							translateBool( 'isFastSign' , data.value.model['isFastSign'] );
							translateBool( 'isAutoClave', data.value.model['isAutoClave'] );
							translateBool( 'isReferral', data.value.model['isReferral'] );*/
							
						}
					}
				})
			}
			me.setState();
			//me.setType();
			BindEntInfo.__super__.show.apply( this,arguments );
		},
		showInfo: function(id , eid , type , state, isCanEdit ){
			var me = this;
			me.$rightInfo.show();
			me.$statusDisabled.attr('disabled','disabled');
			//设置显示状态
			me.attrs.processInstanceId = id;
			me.attrs.enterpriseId = eid
            me.$('.state').hide();
            me.$('.state-'+state).show();
			me.$('.wait-other').hide();
			me._setWidth('730');
			function translateBool( key , value ){
				if(value){
					me.model.set(key,'true');
				}else{
					me.model.set(key,'false');
				}
			}
			if( state != 'end'){
				util.api({
					'url': '/enterprise/getbyprocessinstanceid',
					'data': {
						'processInstanceId': me.attrs.processInstanceId
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){

							me.getRegistrationEnterprise(data);
							me.getRecordEnterprise( data );
							me.downFile(data);
							
							translateBool( 'isSaleTeam' , data.value.model['isSaleTeam'] );
							translateBool( 'isFirstmeetingSign' , data.value.model['isFirstmeetingSign'] );
							translateBool( 'isWillPin' , data.value.model['isWillPin'] );
							translateBool( 'isStrangerVisits', data.value.model['isStrangerVisits'] );
							translateBool( 'isFastSign' , data.value.model['isFastSign'] );
							translateBool( 'isAutoClave', data.value.model['isAutoClave'] );
							translateBool( 'isReferral', data.value.model['isReferral'] );
							
						}
					}
				})
			}else if(state == 'end'||state == 'allEnd'){
				util.api({
					'url': '/enterprise/getenterpriseandfiling',
					'data': {
						'enterpriseId': me.attrs.enterpriseId
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){

							me.getRegistrationEnterprise(data);
							me.getRecordEnterprise( data );
							me.downFile(data);
							
							translateBool( 'isSaleTeam' , data.value.model['isSaleTeam'] );
							translateBool( 'isFirstmeetingSign' , data.value.model['isFirstmeetingSign'] );
							translateBool( 'isWillPin' , data.value.model['isWillPin'] );
							translateBool( 'isStrangerVisits', data.value.model['isStrangerVisits'] );
							translateBool( 'isFastSign' , data.value.model['isFastSign'] );
							translateBool( 'isAutoClave', data.value.model['isAutoClave'] );
							translateBool( 'isReferral', data.value.model['isReferral'] );
							
						}
					}
				})
			}
			//me.setState();
			BindEntInfo.__super__.show.apply( this,arguments );
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
		/**
		 *
		 *获取备案企业信息
		 */
		 getRecordEnterprise:function(data){
			var me = this;
			me.model.set('enterpriseNameRecord',data.value.enterpriseFiling.enterpriseName );
			me.model.set('addressRecord',data.value.enterpriseFiling.address );
			me.model.set('regionRecord', data.value.enterpriseFiling.regionName );
			me.$filingRegion.attr('data-code',data.value.enterpriseFiling.region);
			me.model.set('agentPersonRecord',data.value.enterpriseFiling.representative );
			me.model.set('industryRecord',data.value.enterpriseFiling.industry );
			me.model.set('sourceRecord',data.value.enterpriseFiling.source );
			me.model.set('contactNameRecord',data.value.enterpriseFiling.contactName );
			me.model.set('contactPostRecord',data.value.enterpriseFiling.contactPost );
			me.model.set('contactPhoneRecord',data.value.enterpriseFiling.contactPhone );
			me.model.set('contactEmailRecord',data.value.enterpriseFiling.contactEmail );
			me.model.set('remarkRecord',data.value.enterpriseFiling.remark );
			me.model.set('creatorNameRecord',data.value.enterpriseFiling.creator.name );
			me.model.set('creatorUserNameRecord',data.value.enterpriseFiling.creator.username );	
			me.$firmStatus.val(data.value.enterpriseFiling.status);
			me.model.set('clientNumRecord',data.value.enterpriseFiling.accountAmount );
			me.model.set('companyNumRecord',data.value.enterpriseFiling.employeeNumber );
			me.model.set('kpPhoneRecord',data.value.enterpriseFiling.representative_phone );
			var visiteTime = data.value.enterpriseFiling.visitTime?new Date( data.value.enterpriseFiling.visitTime)._format('yyyy/MM/dd'):'';
			me.model.set('visiteTimeRecord',visiteTime);
			me.attrs.enterpriseFilingId = data.value.enterpriseFiling.id;
		 },
		 /*
		 *获取自注册企业信息
		 */
		 getRegistrationEnterprise:function(data){
			var me = this; 
			data.value.model = data.value.enterpriseQueryInfo;
			me.model.load( data.value.model );
			var contractStartTime = data.value.model.contractStartTime ?new Date( data.value.model.contractStartTime  )._format('yyyy/MM/dd'):'';
			var contractEndTime =data.value.model.contractEndTime? new Date( data.value.model.contractEndTime  )._format('yyyy/MM/dd'):'';
			me.model.set('accountTotalAmount',(data.value.model.accountTotalAmount ? data.value.model.accountTotalAmount:'0') );
			me.model.set('marketingAccountAmount',(data.value.model.marketingAccountAmount ? data.value.model.marketingAccountAmount:'0') );
			me.model.set('isPaid',(data.value.model.isPaid ? data.value.model.isPaid:'0') );

			if( data.value.model.useBusinessCard){
				me.$cardPrice.show();
				me.model.set('useBusinessCard','1');
				me.model.set('cardPrice',data.value.model.businessCardPrice);
			}else{
				me.model.set('cardPrice','');
				me.model.set('useBusinessCard','0');
				me.$cardPrice.hide();
			}
			//me.model.set('autoclaveDays',(data.value.model.autoclaveDays ? data.value.model.autoclaveDays:'0') );
			me.model.set('dealDays',(data.value.model.dealDays ? data.value.model.dealDays:'0') );
			me.model.set('city',(data.value.model.city ? data.value.model.city:'') );
			me.model.set('contractStartTime',(contractStartTime ? contractStartTime:'') );
			me.model.set('regionName',data.value.model.regionName?data.value.model.regionName:data.value.model.regionCode);
			me.model.set('contractEndTime',(contractEndTime ? contractEndTime:'') );
			
			 
		 },
		
		/**
		 *
		 *显示文件
		 */
		downFile: function(data){
			var me = this;
			data.value.model = data.value.enterpriseQueryInfo;
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
		//重新发送
		hide: function(){
			var me = this;
			me.model.clear();
			me.$rightInfo.hide();
			me.$contractLink.attr('href', '');
			me.$imgContract.attr('src', '');
			me.$MtzhizhaoLink.attr('href', '');
			me.$imgMtzhizhao.attr('src', '');
			me.$yyzhizhaoLink.attr('href', '');
			me.$imgYyzhizhao.attr('src', '');
			me.$contractCopyLink.attr('href','');
			me.$statusDisabled.attr('disabled','disabled');
			me.$imgContractCopy.attr('src', '');
			me.$('.contract-link-add').attr('href','');
			me.$('.img-contract-add').attr('src', '');
			me.$('.contractCopy-link-add').attr('href','');
			me.$('.img-contractCopy-add').attr('src', '');
			me.$('.state').hide();
			me.$('.state-wait').hide();
			me.$('.wait-other').show();
			BindEntInfo.__super__.hide.apply( this,arguments );
		}
	});
        
	module.exports = BindEntInfo;
});
