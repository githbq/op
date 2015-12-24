/**
 *
 * 企业详情
 */
define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./watchentdetail.html');
	var Pagination = require( 'common/widget/pagination/pagination' );
	var tpl = $( require( './template.html' ) );
	var uploader = require('common/widget/upload').uploader;


	var LOGTYPE = {};    //日志类别
	var buyMap = new Object({'1':'赠送','2':'购买充值'});
	var carMap = new Object({'0':'未开通服务','1':'限量购买','2':'不限量使用'});

	//企业产品单
	var EntDetail = MClass( Slider ).include({
		
		content: contentStr,

		defaultAttr:{
			title:'企业产品单',
			width: 680
		},
		
		elements: {

			'#bName': 'name',
			'#bAccount': 'account',

			'#tSource': 'asource',
			'#sAgentName': 'sAgentName',
			'#riskInfo':'riskInfo',
			'.cheat-rule':'cheatRule',
	
			'#yingxiaoUsed': 'yingxiaoUsed',
			'#sdXKDUC': 'sdXKDUC',
			'#sdBCET': 'sdBCET',
			'#sdBCDC': 'sdBCDC',
			'#sdBCDUC': 'sdBCDUC',
			'#sdSmC': 'sdSmC',
			'#sdSmUC': 'sdSmUC',
			'#sdSC': 'sdSC',
			'#sdSUC': 'sdSUC',
			
			'#sXKDC': 'sXKDC',         		//销客终端总量
			'#sXKET': 'sXKET',         		//签约到期时间
			'#yxEndInput': 'yxEndInput',    //营销版到期时间
			'#sBCDC': 'sBCDC',
			'#sBCET': 'sBCET',
			'#sSms': 'sSms',
			'#sStorage': 'sStorage',
			
			'#sDevice': 'sDevice',     //销客终端扩容

			'#yingxiao': 'yingxiao',             //营销版终端总量
			'#yingxiaoAdd': 'yingxiaoAdd',	     //营销版终端扩容
			
			'#sActivity': 'sActivity',
			'#sActiveRemark': 'sActiveRemark',
			'#sdProductModule': 'sdProductModule',
			'#sProductModule': 'sProductModule',
			'#sdELC': 'sdELC',
			'#sdELUC': 'sdELUC',
			'#sdEFC': 'sdEFC',
			'#sdEFUC': 'sdEFUC',
			'#sdECC': 'sdECC',
			'#sdECUC': 'sdECUC',
			'#sdEMWC': 'sdEMWC',
			'#sdEMWUC': 'sdEMWUC',
			'#sdEAC': 'sdEAC',
			'#sdEAUC': 'sdEAUC',
			'#sdUFS': 'sdUFS',
			'#sdActionDanger': 'sdActionDanger',
			'#sELC': 'sELC',
			'#sEFC': 'sEFC',
			'#sECC': 'sECC',
			'#sEMWC': 'sEMWC',
			'#sEAC': 'sEAC',
			'#sUFS': 'sUFS',
			'#sActionDanger': 'sActionDanger',
			'#sdJCFCompanyName': 'sdJCFCompanyName',
			'#sdJCFActive': 'sdJCFActive',
			'#sdJCFTotal': 'sdJCFTotal',
			'#sdJCFUsed': 'sdJCFUsed',
			'#sdJCFLeft': 'sdJCFLeft',
			'#sJCFCount': 'sJCFCount',
			'#sbJCFCST': 'sbJCFCST',
			'#sbJCFCET': 'sbJCFCET',
			'#tbJCFLog tbody': 'tbJCFLog',
			'#sdMarketingStatus': 'sdMarketingStatus',
			'#sdCustom': 'sdCustom',
			'#sdActiveTime': 'sdActiveTime',
			'#sdCreater': 'sdCreater',
			'#sdCreateTime': 'sdCreateTime',
			'#sdContact': 'sdContact',
			'#sdAgentName': 'sdAgentName',
			'#sbLogType': 'sbLogType',
			'#sbLogST': 'sbLogST',
			'#sbLogET': 'sbLogET',
			'#sdUpdater': 'sdUpdater',
			'#sdUpdateTime': 'sdUpdateTime',
			'#sdUpdaterMobile': 'sdUpdaterMobile',
			'#tbLog tbody': 'tbLog',
			'#sbLogType': 'sbLogType',
			'#sBtnChangeStatistics': 'schangeStatis',
			'.sms-name': 'smsName',
			'.sms-wh': 'smsWh',
			'.sms-newname': 'smsNewName',
			'.card-type': 'cardType',
			'.card-count': 'cardCount',
			'.card-useNum': 'cardUseNum',
			'.card-startTime':'cardStartTime',
			'.card-endTime':'cardEndTime',
			'#cardList tbody': 'tbCardList',
			'#searchCardType': 'searchCardType',
			'.card-buyYear': 'cardBuyYear',
			'.card-buyNum': 'cardBuyNum',

			'#phonecallback': 'phonecallback',  //电话回访按钮
			'#verification': 'verification',    //资料审核按钮
			
			'#yingyezhizhao': 'yingyezhizhao',
			'#yingyezhizhaoinfo': 'yingyezhizhaoinfo',

			'#hetongzhaopian': 'hetongzhaopian',        // 合同input
			'#hetonginfo': 'hetonginfo',                // 合同图片
			'#hetongnone': 'hetongnone',
			
			'#hetongfbzhaopian': 'hetongfbzhaopian',    // 合同副本input
			'#hetongfbinfo': 'hetongfbinfo',            // 合同副本
			'#hetongfbnone': 'hetongfbnone',            // 

			'#mentou': 'mentou',
			'#mentouinfo': 'mentouinfo',
			'#shenheresult': 'shenheresult',
			'#huifangresult': 'huifangresult',
			'#yingyezhizhaonone': 'yingyezhizhaonone',
			'#mentounone': 'mentounone',
			'#companyGateKeyword':'getcompanyGatekeyword',
			'#companyGateRemark':'getcompanyGateRemark',
			'.companyGateKeyword':'setcompanyGatekeyword',
			'.companyGateRemark':'setcompanyGateRemark',
			'.upload':'saveEve',
			'.status-disabled':'statusDisabled',
			'.contractCopy-link':'contractCopyLink',
			'.img-contractCopy' :'imgContractCopy',
			'.contractCopy-hide' :'contractCopyHide',
			'.contract-link':'contractLink',
			'.img-contract' :'imgContract',
			'.contract-hide' :'contractHide',
			'.select-disabled':'selectDisabled',
			'.state-current':'stateCurrent',
			'.start-time-ht':'startTimeHt',
			'.end-time-ht':'endTimeHt',
			'.contractprice': 'contractprice',       //合同金额
			'.deviceamount': 'deviceamount',          //终端数量
			'.marketingAccountAmount':'marketingAccountAmount',
			'.useBusinessCard':'useBusinessCard',
			'.card-price':'cardPrice',
			'.fn-buy':'fnBuy',
			'.show-type':'showType',
			'.contract': 'contract',
			'.contractCopy':'contractCopy',

			'#creatorName':'creatorName',
			'#createTime':'createTime'
		},
		events: {
			'click .accordian h4': 'showAccordian',


			'click #sBtnChangeStatistics': 'changeStatistics',
			'click #sBtnChangeStatisticsagent': 'changeStatisticsagent',

			'click #sBtnActive': 'active',
			'click #sBtnRemove': 'uninstall',
			'click #sBtnChangeModule': 'changeModule',
			'click #sBtnChangeFunctions': 'changeFunctions',

			'click #sBtnLogSearch': 'searchLog',

			'click #btnStopService': 'stopService',

			'click .rebackSms': 'rebackSms',
			'click .disSms': 'disSms',
			'click .modifySmsName': 'modifySmsName',
			'click #actDownload': 'actDownloadEve' ,   		   //活跃度下载

			'click .callback-actionon': 'callbackOnEve',      //电话回访保存
			'click .verificationaction-on': 'veriOnEve',      //资料审核成功
			'click .verificationaction-off': 'veriOffEve',	  //资料审核失败
			'click .upload':'saveFn'	,				  //资料审核提交
			'click .fn-buy':'fnBuyEve',
			'click .employee-detail':'employeeDetailEve',
		}, 
		employeeDetailEve:function(e){
			var ea = $(e.currentTarget).attr('data-ea');
			var phone = $(e.currentTarget).attr('data-phone');
			this.trigger('employeeDetail',ea,phone);
		},

		tplCallBackList: _.template( tpl.filter('#callBackList').html() ),
		tplRiskInfoList: _.template( tpl.filter('#riskInfoList').html() ),
		init: function(attrs){
			EntDetail.__super__.init.apply( this,arguments );

			var me = this;
		},

		show: function( id , status ){
			var me = this;

			//获取枚举值 获取完毕后 获取企业信息
			me.getEnums( id );
			
			EntDetail.__super__.show.apply( this,arguments );
		},

		/**
		 *
		 * 隐藏slider
		 */
		hide: function() {
			var me = this;
			me.model.clear();
			me.$( '.accordian' ).addClass( 'collapse' );
			me.$( '.accordian .content' ).removeAttr( 'style' );

			me.$('.sectiona input').val('');
			me.$('.sectiona select').val('');
			me.$('.sectiona textarea').val('');

			EntDetail.__super__.hide.apply( this, arguments );
		},

		/**
		 *  获取枚举值
		 *  获取完枚举值后
		 *  获取企业信息
		 */
		getEnums: function( id ){
			var me = this;
			me.model.attrs.id = id;

			var state = {
				a: false,
				b: false,
				c: false
			};

			function checkIsOk(){
				if( state.a && state.b && state.c ){
					me.getEnterprise( id );
				}
			};

			me.generateSelect( 'ENT_LST_SOURCE', me.$asource , function(){ state.a = true; checkIsOk() });     //来源信息
			me.generateSelect( 'RETURN_VISIT_CHECK', me.$('#phonecallbackselect'), function(){ state.b = true; checkIsOk() });       //电话回访状态
			me.generateSelect( 'ENTERPRISE_CHEAT_TYPE', me.$('#cheatstatus'), function(){state.c = true; checkIsOk() });             //作弊情况

		},

		//重置select的值
		generateSelect: function( name , $select , callback ){
            var me = this;

            util.getEnums( name, function( data ) {
                var items = data.model, options = '<option value="">全部</option>';
                items.forEach( function( item ){
                    options += '<option value="' + item.value + '" title="' + item.text + '">' + item.text + '</option>';
                });
                $select.html( options );
                callback && callback( items );
            });
        },

		//获取企业详情
		getEnterprise: function( id ,callback ){
			var me = this;
			util.api({
				'url':'/enterprise/getenterprise',
				'data':{
					'enterpriseId': id
				},
				'success': function( data ){
					
					console.warn( data );
					if( data.success ){
						var model = data.value.model;
						me.model.load( model );
						me.$name.val( model.enterpriseName );
						me.$account.val( model.enterpriseAccount );
						me.$sAgentName.val( model.agentName );

						//签约到期时间
						var endtimestr;
						if( model.endTime){
							endtimestr = new Date( model.endTime )._format( 'yyyy-MM-dd' );
							if( endtimestr == '9999-12-31'){
								endtimestr = '永久';
							}
						}else{
							endtimestr = '永久';
						}

						//营销版到期时间
						if( model.paidVersionExpireTime ){

							if( new Date().getTime() > parseInt( model.paidVersionExpireTime ) ){
								me.$('#yxEndTime').val('');								
							}else{
								me.$('#yxEndTime').val( new Date( model.paidVersionExpireTime )._format( 'yyyy-MM-dd' ) );
							}

						}

						//提交人
						me.$creatorName.val( model.createrName );

						//开通时间
						me.$createTime.val( model.createTime ? new Date( model.createTime )._format('yyyy-MM-dd hh:mm') : '' );

						/**
						 *
						 * 如果有合同显示合同信息 同时隐藏合同上传按钮
						 */
						if( model.contract ){

							me.$hetongnone.hide();
							me.$hetonginfo.attr('href','/op/api/file/previewimage'+'?filePath='+model.contract).show();

							if( /(jpeg|jpg|gif|png)/i.test( model.contract ) ){

								var str = '<img src="'+'/op/api/file/previewimage'+'?filePath='+model.contract+'"style="width:350px; height:200px;">';
							}else{

								var str = '下载合同';
							}
							me.$hetonginfo.empty().html( str );

							me.$('.hetong').hide();
							me.$('.hetongfb').hide();
		    				//
						}else{
							me.$hetongnone.show();
							me.$hetonginfo.hide();

							me.$('.hetong').show();
							me.$('.hetongfb').show();
						}

						if( model.contractCopy ){

							me.$hetongfbnone.hide();
							me.$hetongfbinfo.attr('href','/op/api/file/previewimage'+'?filePath='+model.contractCopy).show();

							if( /(jpeg|jpg|gif|png)/i.test( model.contractCopy ) ){

								var str = '<img src="'+'/op/api/file/previewimage'+'?filePath='+model.contractCopy+'"style="width:350px; height:200px;">';
							}else{

								var str = '下载合同副本';
							}
							me.$hetongfbinfo.empty().html( str );

							
						}else{
							me.$hetongfbnone.show();
							me.$hetongfbinfo.hide();
						}

						//先初始化显示试用配置
						//me.showTrialInfo();

						callback && callback();
					}
				}
			})
		},

		/**
		 *
		 * 显示隐藏子菜单
		 */
		showAccordian: function( e ) {
			var target = e.currentTarget,
				$parent = $( target ).parent();
				$content = $( target ).next( '.content' );

			//进行显示隐藏切换
			if ( $parent.hasClass( 'collapse' ) ) {
				$parent.removeClass( 'collapse' );
				$content.slideDown( 300 );
			} else {
				$parent.addClass( 'collapse' );
				$content.slideUp( 300 );
				return;
			}

			//var index = $parent.index( '.accordian' );
			var target = $parent.attr('data-target');
			switch( target ){

				case 'verification':      //资料审核
					this.showVerifiCation();
					break;
				case 'callback':
					this.showCallBack();  //电话回访
					break;
				case 'riskInfo':
					this.showRiskInfo();  //显示培训详情
					break;
				default:
					break;
			}
		},

		/**
		 *
		 * 显示资料审核
		 * @param changeBool 是否触发事件
		 */
		showVerifiCation: function( changeBool ){
			var me = this;

			var changeBool = changeBool || false;
			
			me.$yingyezhizhao.removeAttr('disabled');
			me.$yingyezhizhao[0].value = '';
			me.$mentou.removeAttr('disabled');
			me.$hetongzhaopian.removeAttr('disabled');
			me.$hetongzhaopian[0].value = '';
			me.$hetongfbzhaopian.removeAttr('disabled');
			me.$hetongfbzhaopian[0].value = '';

			me.$setcompanyGatekeyword.removeAttr('disabled');
			me.$setcompanyGateRemark.removeAttr('disabled');
			me.$mentou[0].value = '';
			me.$yingyezhizhaoinfo.attr('src','');
			me.$mentouinfo.attr('src','');
			me.model.set('companyGateKeyword','');
			me.model.set('companyGateRemark','');
			util.api({
				'url': '/enterprise/getinfoandvisitcheck',
				'data': {
					'enterpriseId': me.model.attrs['enterpriseId']
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						//营业执照
						if( data.value.model && data.value.model.businessLicense ){
							console.log(111);
							me.$yingyezhizhaoinfo.attr('href','/op/api/file/previewimage' + '?filePath=' + data.value.model.businessLicense);
							me.$yingyezhizhaoinfo.find('img').attr('src','/op/api/file/previewimage' + '?filePath=' + data.value.model.businessLicense);
							me.$yingyezhizhaonone.hide();
							me.$yingyezhizhaoinfo.show();
						}else{
							me.$yingyezhizhaoinfo.attr('href','');
							me.$yingyezhizhaoinfo.find('img').attr('src','');
							me.$yingyezhizhaoinfo.hide();
							me.$yingyezhizhaonone.show();
						}

						//门头信息
						if( data.value.model && data.value.model.companyGatePicture ){
							console.log(222);
							me.$mentouinfo.attr('href','/op/api/file/previewimage' + '?filePath=' + data.value.model.companyGatePicture );
							me.$mentouinfo.find('img').attr('src','/op/api/file/previewimage' + '?filePath=' + data.value.model.companyGatePicture )
							me.$mentouinfo.show();
							me.$mentounone.hide();
						}else{
							me.$mentouinfo.attr('href','');
							me.$mentouinfo.find('img').attr('src','');
							me.$mentouinfo.hide()
							me.$mentounone.show();
						} 
						
						if( data.value.model && data.value.model.companyGateKeyword){
							me.$getcompanyGatekeyword.val(data.value.model.companyGateKeyword);
						}else{
							me.$getcompanyGatekeyword.val('');
						}
						if( data.value.model && data.value.model.companyGateRemark ){
							me.$getcompanyGateRemark.val(data.value.model.companyGateRemark);
						}else{
							me.$getcompanyGateRemark.val('');
						}

						//审核结果
						me.model.set('checkresult', util.findEnumsText( 'INFORMATION_CHECK_STATUS', data.value.model.informationCheck ) );

						if(changeBool){
							me.trigger('changeStatus');
						}

						//审核意见
						me.$('.approvalinfo').val('');
						if( data.value.model && data.value.model.informationCheckRemark ){

							me.$('.approvalinfo').val( data.value.model.informationCheckRemark );
						}
						
						me.model.set('informationCheckName', data.value.model.informationCheckAccount && data.value.model.informationCheckAccount['name']);
						me.model.set('informationCheckTimeStr', data.value.model.informationCheckTime && new Date( data.value.model.informationCheckTime )._format('yyyy-MM-dd hh:mm') );
					}
				}
			});
		},
		
		//资料审核成功
		veriOnEve: function(){
			var me = this;

			util.api({
				'url':'/enterprise/checkinformation',
				'data':{
					'enterpriseId': me.model.get('enterpriseId'),
					'isCheckPassed': 2,
					'informationCheckRemark': me.$('.approvalinfo').val()
				},
				'success': function( data ){
					console.warn( data );
					me.showVerifiCation( true );
				}
			})
		},
		
		//资料审核失败
		veriOffEve: function(){
			var me = this;

			util.api({
				'url':'/enterprise/checkinformation',
				'data':{
					'enterpriseId': me.model.get('enterpriseId'),
					'isCheckPassed': 3,
					'informationCheckRemark': me.$('.approvalinfo').val()
				},
				'success': function( data ){
					console.warn( data );
					me.showVerifiCation( true );
				}
			})
		},


		/**
		 *
		 * 电话回访
		 */
		showCallBack: function( changeBool ){
			var me = this;
			var changeBool = changeBool || false;

		   /**
		 	*
		 	* 查询电话回访结果
		 	*/
		 	util.api({
		 		'url':'/enterprise/getinfoandvisitcheck',
		 		'data':{
		 			'enterpriseId': me.model.attrs['enterpriseId']
		 		},
		 		'success': function( data ){

		 			if( data.success ){
		 				me.model.load( data.value.model );
		 				me.model.set('returnVisitCheckName', data.value.model['returnVisitCheckAccount'] && data.value.model['returnVisitCheckAccount']['name']);
		 				me.model.set('returnVisitCheckTimeStr', data.value.model['returnVisitCheckTime'] && new Date( data.value.model['returnVisitCheckTime'] )._format('yyyy-MM-dd hh:mm') );
		 				me.model.set('returnVisitCheckStr', util.findEnumsText( 'RETURN_VISIT_CHECK',data.value.model['returnVisitCheck'] ) );
		 			}
					if(changeBool){
						me.trigger('changeStatus');
					}
		 		}
		 	})
			me.loadCallBackList();
		},

		//加载回访列表
		loadCallBackList: function(){

			var me = this;

			console.log( me.model.all() );

			me.$phonecallback.find('tbody').html('<tr><td colspan="4"><p class="info">加载中</p></td></tr>');
			util.api({
				'url': '/enterprise/getemployeessupervise',
				'data': {
					'enterpriseId': me.model.attrs.id
				},
				'success': function( data ){
					//console.warn( data );
					if( data.success ){
						if( data.value.model.length > 0 ){
							console.log(data.value.model)
							data.value.model.forEach( function( item ){
								if(item.admin == '1'){
									item.adminStr = '是';
								}else{
									item.adminStr = '否';
								}
							});
							me.$phonecallback.find('tbody').html( me.tplCallBackList( {'content':data.value.model }) );
						}else{
							me.$phonecallback.find('tbody').html('<tr><td colspan="4"><p class="info">暂无数据</p></td></tr>');
						}
					}
				}
			})
		},

		//回访成功
		callbackOnEve: function(){
			var me = this;

			util.api({
				'url':'/enterprise/checkreturnvisit',
				'data':{
					'enterpriseId': me.model.attrs['enterpriseId'],
					'cheatType': me.model.get('cheatType'),
 					'returnVisitCheck': me.model.get('returnVisitCheck')
				},
				'success': function( data ){
					if( data.success ){
						me.showCallBack(true);
					}
				}
			})
		},
		
		showRiskInfo:function(){
			var me = this;
			me.$riskInfo.find('tbody').html('<tr><td colspan="9"><p class="info">加载中</p></td></tr>');
			me.riskInfo = me.riskInfo || {};
			me.riskInfo.pagination && me.riskInfo.pagination.setPage(0,true);
			me.loadCheatRule();

			if( me.riskInfo.pagination ){
				me.riskInfo.pagination.setPage(0,true);
			}else{
				me.riskInfo.pagination = new Pagination({
					wrapper: me.$riskInfo.find('.pager'),
					pageSize: 10,
					pageNumber: 0
				})
				me.riskInfo.pagination.render();
				me.riskInfo.pagination.onChange = function(){
					me.loadRiskInfoList();
				};
				me.loadRiskInfoList();
			}
			
		},


		loadRiskInfoList:function(){
			var me = this;
			util.api({
				'url':'/enterprise/getenterprisecheatdeteail',
				'data':{
					'pageIndex': me.riskInfo.pagination.attr['pageNumber'],
					'pageSize': me.riskInfo.pagination.attr['pageSize'],
					'enterpriseId': me.model.attrs.id
				},
				'success': function( data ){
					if( data.success ){
						me.riskInfo.pagination.setTotalSize( data.value.model.itemCount );
						if( data.value.model.content.length > 0 ){
							me.$riskInfo.find('tbody').html( me.tplRiskInfoList( data.value.model) );
						}else{
							me.$riskInfo.find('tbody').html('<tr><td colspan="9"><p class="info">暂无数据</p></td></tr>')
						}
					}
				}
			})
		},


		loadCheatRule:function(){
			var me = this;
			util.api({
				'url':'/enterprise/getcheatrole',
				'data':'',
				'success': function( data ){
					if( data.success ){
						me.$cheatRule.html(data.model);
					}
				}
			})
		},

	});

	module.exports = EntDetail;
});
