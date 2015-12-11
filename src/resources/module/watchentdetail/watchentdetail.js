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

		

			'click #btnPhoneCallbackEve': 'phoneCallbackEve',  //电话回访


			'click .callback-actionon': 'callbackOnEve',      //电话回访成功
			'click .callback-actionoff': 'callbackOffEve',    //电话回访失败
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

			me.trial = {
				isInitialized: false
			};

			me.operations = {
				isInitializes: false,
				pagination: null
			};

			me.modules = {
				isInitializes: false
			};
			
			me.jcf = {};
			
			me.jcflog = {
				isInitializes: false,
				pagination: null
			};
			me.log = {
				isInitializes: false,
				pagination: null
			};
			me.card = {
				isInitializes: false,
				pagination: null
			};
	

			
			me.setState();
		},

		show: function( id , status ){
			var me = this;

			//初始化日期选择
			me.initializeDatepickers();
			
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
				b: false,
			};

			function checkIsOk(){
				if( state.b ){
					me.getEnterprise( id );
				}
			};

			me.generateSelect( 'ENT_LST_SOURCE', me.$asource , function(){ state.b = true; checkIsOk() });     //来源信息
		},

		//重置select枚举值
		generateSelect: function( name , select , callback ){
			var me = this;
			//var list = [{'name':'请选择','value':''}];

			util.getEnums( name , function(data){

				switch( name ) {
					
					case 'ENT_LST_SOURCE':
						me.initializeSource( data, me.model.source );
						break;
					default: break;
				}
				callback && callback();
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


						if ( IBSS.enums[ 'ENT_LST_SOURCE' ] ) {
							me.initializeSource( IBSS.enums[ 'ENT_LST_SOURCE' ], model.source );
						}
						
						
						
					

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


						/**
						 * 进行状态显隐控制
						 */
						me.setVisibility();


						//先初始化显示试用配置
						//me.showTrialInfo();

						callback && callback();
					}
				}
			})
		},

		/**
		 *
		 *  进行状态切换控制 
		 *  dom元素内     含有 f1 f2 f3 f4 等类名的元素全部隐藏
		 *  根据权限信息相应类名显示 
		 *  f1待开通  f2已开通 f3已作废 f4已停用 
		 */
		setVisibility: function() {
			var me = this;
			var status = this.model.attrs.runStatus;
			me.$( '.f1,.f2,.f3,.f4' ).css( 'display', 'none' );

			switch( status ) {
				case 1: // 待开通
					me.$( '.ed' ).removeAttr( 'disabled' );
					me.$( '.f1' ).css( 'display', '' );
					break;
				case 2: // 已开通
					me.$( '.ed' ).removeAttr( 'disabled');
					me.$( '.f2' ).css( 'display', '' );
					break;
				case 3: // 已作废
					me.$( '.ed' ).attr( 'disabled', 'disabled' );
					me.$( '.f3' ).css( 'display', '' );
					break;
				case 4: // 已停用
					me.$( '.ed' ).attr( 'disabled', 'disabled' );
					me.$( '.f4' ).css( 'display', '' );
					break;
				default: 
					me.$( '.ed' ).removeAttr( 'disabled' );
					me.$( '.f1' ).css( 'display', '' );
					break;
			}
			this.setState();
		},

		setState: function(){
			var me = this;

			console.log( me.attrs.isAgent );
			/**
			 *
			 * 如果是代理商
			 * 只能查看各种企业信息
			 * 不能进行各种操作
			 * 
			 * .off 代理商状态    off隐藏
			 * .on  支持人员状态   on隐藏
			 *
			 * 如果是支持人员来源可编辑    
			 */
			if( me.attrs.isAgent === true ){

				me.$view.find('.off').hide();
				me.$view.find('input').attr('disabled','disabled');
				me.$view.find('select').attr('disabled','disabled');
				me.$view.find('textarea').attr('disabled','disabled');
			}else{
				me.$view.find('.on').hide();
				
			}
		},

		/**
		 *
		 * 初始化日期选择
		 */
		initializeDatepickers: function() {
	
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

				case 'verification':                    //资料审核
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

		initializeSelectValue: function( list, value, select ) {
			var l = [ { 'name': '请选择', 'value': '' } ];
			$.each( list.value.model, function( i, item ){
				l.push( { 'name': item.text, 'value': item.value } );
			} );
			util.resetSelect( select , l );
			if ( value ) {
				select.val( value );
			}
		},


		initializeSource: function( list, value ) {
			this.initializeSelectValue( list, value, this.$asource );
		},

		
		/**
		 *
		 * 显示资料审核
		 */
		showVerifiCation: function(changeBool){
			var me = this;
			var changeBool = changeBool||false;
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
						if( data.value.model && data.value.model.informationCheck == '1' ){

							me.$verification.find('#shenheresult input').val('审核成功');
						}else if( data.value.model && data.value.model.informationCheck=='0' ){
							
							me.$verification.find('#shenheresult input').val('审核失败');
						}else {
							me.$verification.find('#shenheresult input').val('暂无结果');
						}
						if(changeBool){
							me.trigger('changeStatus');
						}

						//审核意见
						me.$('.approvalinfo').val('');
						if( data.value.model && data.value.model.informationCheckRemark ){

							me.$('.approvalinfo').val( data.value.model.informationCheckRemark );
						}
						
					}
				}
			});

		},
		//资料审核成功
		veriOnEve: function(){
			var me = this;
			console.log('on');
			var changeBool = true;
			util.api({
				'url':'/enterprise/checkinformation',
				'data':{
					'enterpriseId': me.model.get('enterpriseId'),
					'isCheckPassed': 1,
					'informationCheckRemark': me.$('.approvalinfo').val()
				},
				'success': function( data ){
					console.warn( data );
					me.showVerifiCation(changeBool);
				}
			})
		},
		//资料审核失败
		veriOffEve: function(){
			var me = this;
			console.log('off');
			var changeBool = true;
			util.api({
				'url':'/enterprise/checkinformation',
				'data':{
					'enterpriseId': me.model.get('enterpriseId'),
					'isCheckPassed': 0,
					'informationCheckRemark': me.$('.approvalinfo').val()
				},
				'success': function( data ){
					console.warn( data );
					me.showVerifiCation(changeBool);
				}
			})
		},

		//电话回访查询
		phoneCallbackEve: function(){
			var me = this;
			me.phonecallback.pagination && me.phonecallback.pagination.setPage(0,true);
		},

		/**
		 *
		 * 电话回访
		 */
		showCallBack: function(changeBool){
			var me = this;
			var changeBool = changeBool||false;
			me.$phonecallback.find('.callback-name').val('');
			me.$phonecallback.find('.callback-phone').val('');

			me.$phonecallback.find('tbody').html('<tr><td colspan="4"><p class="info">加载中</p></td></tr>');
			
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
		 			console.warn( data );
					if(changeBool){
						me.trigger('changeStatus');
					}
		 			if( data.value.model && data.value.model.returnVisitCheck=='1' ){
		 				me.$phonecallback.find('.huifangresult b').text('回访成功');
		 			}else if(data.value.model && data.value.model.returnVisitCheck=='0'){
		 				me.$phonecallback.find('.huifangresult b').text('回访失败');
		 			}else{
		 				me.$phonecallback.find('.huifangresult b').text('暂无结果');
		 			}
		 		}
		 	})
			if( !me.attrs.isAgent ){
				me.phonecallback = me.phonecallback || {};

				if( me.phonecallback.pagination ){
					me.phonecallback.pagination.setPage(0,true);
				}else{
					me.phonecallback.pagination = new Pagination({
						wrapper: me.$phonecallback.find('.pager'),
						pageSize: 10,
						pageNumber: 0
					})
					me.phonecallback.pagination.render();
					me.phonecallback.pagination.onChange = function(){
						me.loadCallBackList();
					};
					me.loadCallBackList();
				}
			}
		},

		loadCallBackList: function(){

			var me = this;

			console.log( me.model.all() );
			util.api({
				'url': '/enterprise/getemployeessupervise',
				'data': {
					//'pageIndex': me.phonecallback.pagination.attr['pageNumber'],
					//'pageSize': '6',
					'enterpriseId': me.model.attrs.id,
					'name': me.$phonecallback.find('.callback-name').val(),
					'mobile': me.$phonecallback.find('.callback-phone').val()
				},
				'success': function( data ){
					//console.warn( data );
					if( data.success ){
						//me.phonecallback.pagination.setTotalSize( data.value.model.itemCount );
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
							me.$phonecallback.find('tbody').html('<tr><td colspan="4"><p class="info">暂无数据</p></td></tr>')
						}
					}
				}
			})
		},
		callbackOnEve: function(){
			var me = this;
			var changeBool = true;
			util.api({
				'url':'/enterprise/checkreturnvisit',
				'data':{
					'enterpriseId': me.model.attrs['enterpriseId'],
					'isCheckPassed': 1
				},
				'success': function( data ){
					if( data.success ){
						me.showCallBack(changeBool);
					}
				}
			})
		},
		callbackOffEve: function(){
			var me = this;
			var changeBool = true;
			util.api({
				'url':'/enterprise/checkreturnvisit',
				'data':{
					'enterpriseId': me.model.attrs['enterpriseId'],
					'isCheckPassed': 0
				},
				'success': function( data ){
					if( data.success ){
						me.showCallBack(changeBool);
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
