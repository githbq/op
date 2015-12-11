/**
 *
 * 企业详情
 */

 //todo isInitialized 机制是否去除
define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./enterprisedetail.html');
	var Pagination = require( 'common/widget/pagination/pagination' );
	var tpl = $( require( './template.html' ) );

	//
	var EntDetail = MClass( Slider ).include({
		
		content: contentStr,

		defaultAttr:{
			title:'企业产品单',
			width: 680
		},
		
		elements: {
			'#bName': 'name',
			'#bAccount': 'account',
			'#bAddress': 'address',
			'#tIndustry':'aindustry',
			'#tSource': 'asource',
			'#tProvince': 'aprovince',
			'#tGroupType': 'agroup',
			'#tChannel': 'aknow',
			'#tIntention': 'aregister',
			'#tCompanySize': 'acompany',
			'#tSalesSize': 'asales',
			'#tHasSales': 'hasSales',
			'#tFirstView': 'isFirstView',
			'#tMettingSale': 'isMettingSale',
			'#tIsStranger': 'isStranger',
			'#tCity': 'city',
			'#tIsFastSign': 'isFastSign',
			'#tDealDays': 'dealDays',
			'#tHighPressure': 'hp',
			'#tHPDays': 'hpDays',
			'#tIsIntro': 'isIntro',
			'#tIsPayed': 'isPayed',
			'#cName': 'cName',
			'#cMobile': 'cMobile',
			'#cEmail': 'cEmail',
			'#kcName': 'kcName',
			'#kcMobile': 'kcMobile',
			'#kcEmail': 'kcEmail',
			'#cQQ': 'cQQ',
			'#remark': 'remark',
			'#tbProduct tbody': 'tbProduct',
			'#sProductName': 'sProductName',
			'#sProductStatus': 'spstatus',
			'#tbAgent tbody': 'tbAgent',
			'#sAgentId': 'sAgentId',
			'#sAgentName': 'sAgentName',
			'#tbTrial': 'tbTrial',
			'#sTrialTime': 'sTrialTime',
			'#sTrialAmount': 'sTrialAmount',
			'#tbOperation tbody': 'tbOperation',
			'#sdXKET': 'sdXKET',
			'#sdPayImd': 'sdPayImd',
			'#sdXKDC': 'sdXKDC',
			'#sdXKDUC': 'sdXKDUC',
			'#sdBCET': 'sdBCET',
			'#sdBCDC': 'sdBCDC',
			'#sdBCDUC': 'sdBCDUC',
			'#sdSmC': 'sdSmC',
			'#sdSmUC': 'sdSmUC',
			'#sdSC': 'sdSC',
			'#sdSUC': 'sdSUC',
			'#sXKDC': 'sXKDC',
			'#sXKET': 'sXKET',
			'#sBCDC': 'sBCDC',
			'#sBCET': 'sBCET',
			'#sSms': 'sSms',
			'#sStorage': 'sStorage',
			'#sDevice': 'sDevice',
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
			//''
			'#vcStartTime': 'vcStartTime',    // 名片开始时间
			'#vcEndTime': 'vcEndTime',        // 名片结束时间
			'#vcType': 'vcType',              // 名片类别
			'.sms-name': 'smsName',
			'.sms-wh': 'smsWh',
			'.sms-newname': 'smsNewName'
		},

		events: {
			'click .accordian h4': 'showAccordian',
			'click #btnSaveBasic': 'saveBasicEve',
			'click #tbProduct em': 'changeProductEve',
			'click #tbAgent em': 'changeAgentEve',
			'click #btnSBAgentSearch': 'loadAgents',
			'click #sBtnChangeTrial': 'changeTrial',
			'click #sBtnChangeStatistics': 'changeStatistics',
			'click #sBtnActive': 'active',
			'click #sBtnRemove': 'uninstall',
			'click #sBtnChangeModule': 'changeModule',
			'click #sBtnChangeFunctions': 'changeFunctions',
			'click #sBtnJCFBuy': 'chargeJCF',
			'click #sBtnJCFSync': 'syncJCF',
			'click #btnSBJCFLogSearch': 'searchJCFLog',
			'click #sBtnMarketingStop': 'stopMarketing',
			'click #sBtnCustomChange': 'changeCustomStatus',
			'click #sBtnLogSearch': 'searchLog',
			'click #btnResetAdminPassword': 'resetAdminPassword',
			'click #btnStopService': 'stopService',
			'click #btnStartService': 'startService',
			'click .rebackSms': 'rebackSms',
			'click .disSms': 'disSms',
			'click .modifySmsName': 'modifySmsName'
		},

		//分配短信尾号
		disSms: function(){
			var me = this;

			util.api({
				'url':'/enterprise/assignsmsnumber',
				'data': {
					'enterpriseId': me.model.attrs.enterpriseId,
					'oldModifyTime': me.model.attrs.updateTime
				},
				'success': function( data ){
					console.warn( data )
					if( data.success ){
						util.showTip('分配成功');
					}
				}
			})
		},

		//收回短信尾号
		rebackSms: function(){
			var me = this;

			util.api({
				'url':'/enterprise/recyclesmsnumber',
				'data':{
					'enterpriseId': me.model.attrs.enterpriseId
				},
				'success': function( data ){
					console.warn( data )
					if( data.success ){
						util.showTip('回收成功');
					}
				}
			})
		},

		//修改企业简称
		modifySmsName: function(){
			var me = this;
			var value = me.$('.sms-newname').val();

			util.api({
				'url':'/enterprise/changeshortname',
				'data':{
					'enterpriseId': me.model.attrs.enterpriseId ,
					'shortName': value
				},
				'success': function( data ){
					if( data.success ){
						util.showTip('修改成功')
					}
				}
			})

		},


		product: {
			isInitialized: false,
			list: [],
			name: '',
			status: '',
			pagination: null
		},

		agent: {
			isInitialized: false,
			list: [],
			name: '',
			status: '',
			pagination: null
		},

		trial: {
			isInitialized: false
		},

		operations: {
			isInitializes: false,
			pagination: null
		},

		visitingcard: {
			isInitializes: false,    //名片购买信息
			pagination: null         //页数
		},

		modules: {
			isInitializes: false
		},
		jcf: {},
		jcflog: {
			isInitializes: false,
			pagination: null
		},
		log: {
			isInitializes: false,
			pagination: null
		},

		tplProduct: _.template( tpl.filter( '#trProduct' ).html() ),
		tplAgent: _.template( tpl.filter( '#trAgent' ).html() ),
		tplOperation: _.template( tpl.filter( '#trOperation' ).html() ),
		tplJCFLog: _.template( tpl.filter( '#trJCFLog' ).html() ),

		init: function(attrs){
			EntDetail.__super__.init.apply( this,arguments );
		},

		show: function( id , status ){
			var me = this;
			me.getEnums();
			me.getEnterprise( id );

			//console.log( status )
			/*
			if( status == 2 ){
				me.$('.state-deactive').show();
			} else if( status == 4 ){
				me.$('.state-active').hide();
			}
			*/

			EntDetail.__super__.show.apply( this,arguments );
		},

		hide: function() {
			$( '.accordian' ).addClass( 'collapse' );
			$( '.accordian .content' ).removeAttr( 'style' );

			EntDetail.__super__.hide.apply( this, arguments );
		},

		//获取枚举值
		getEnums: function(){
			var me = this;
			
			me.generateSelect( 'INDUSTRY', me.$aindustry );  		//行业信息
			me.generateSelect( 'ENT_LST_SOURCE', me.$asource );     //来源信息
			me.generateSelect( 'PROVINCE', me.$aprovince );         //省和直辖市
			me.generateSelect( 'GROUP_TYPE', me.$agroup );			//团队类型
			me.generateSelect( 'KNOW_SOURCE', me.$aknow );          //了解渠道
			me.generateSelect( 'REGISTER_MOTIVE', me.$aregister );  //注册动机
			me.generateSelect( 'CAMPANY_SCALE', me.$acompany);      //公司规模
			me.generateSelect( 'SALE_TEAM_SCALE', me.$asales);      //销售团队规模
			me.generateSelect( 'ENTERPRISE_LOG_TYPE', me.$sbLogType ); //日志类型
		},

		//重置select枚举值
		generateSelect: function( name , select ){
			var me = this;
			//var list = [{'name':'请选择','value':''}];
			util.getEnums( name , function(data){
				switch( name ) {
					case 'INDUSTRY':
						me.initializeIndustry( data, me.model.industry );
						break;
					case 'ENT_LST_SOURCE':
						me.initializeSource( data, me.model.source );
						break;
					case 'PROVINCE':
						me.initializeSource( data, me.model.province );
						break;
					case 'GROUP_TYPE':
						me.initializeSource( data, me.model.groupType );
						break;
					case 'KNOW_SOURCE':
						me.initializeSource( data, me.model.knowSource );
						break;
					case 'REGISTER_MOTIVE':
						me.initializeSource( data, me.model.registerMotive );
						break;
					case 'CAMPANY_SCALE':
						me.initializeSource( data, me.model.companyScale );
						break;
					case 'SALE_TEAM_SCALE':
						me.initializeSource( data, me.model.saleTeamScale );
						break;
					case 'ENTERPRISE_LOG_TYPE':
						me.initializeLogTypes( data, me.$sbLogType );
					defaul: break;
				}
			});
		},

		//获取企业详情
		getEnterprise: function( id ){
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
						me.product.isInitialized = false;
						me.model.load( model );
						me.$name.val( model.enterpriseName );
						me.$account.val( model.enterpriseAccount );
						me.$address.val( model.address );
						if ( IBSS.enums[ 'INDUSTRY' ] ) {
							me.initializeIndustry( IBSS.enums[ 'INDUSTRY' ], model.industry );
						}
						if ( IBSS.enums[ 'ENT_LST_SOURCE' ] ) {
							me.initializeSource( IBSS.enums[ 'ENT_LST_SOURCE' ], model.source );
						}
						if ( IBSS.enums[ 'PROVINCE' ] ) {
							me.initializeProvince( IBSS.enums[ 'PROVINCE' ], model.province );
						}
						if ( IBSS.enums[ 'GROUP_TYPE' ] ) {
							me.initializeGroup( IBSS.enums[ 'GROUP_TYPE' ], model.groupType );
						}
						if ( IBSS.enums[ 'KNOW_SOURCE' ] ) {
							me.initializeChannel( IBSS.enums[ 'KNOW_SOURCE' ], model.knowSource );
						}
						if ( IBSS.enums[ 'REGISTER_MOTIVE' ] ) {
							me.initializeIntention( IBSS.enums[ 'REGISTER_MOTIVE' ], model.registerMotive );
						}
						if ( IBSS.enums[ 'CAMPANY_SCALE' ] ) {
							me.initializeCompanySize( IBSS.enums[ 'CAMPANY_SCALE' ], model.companyScale );
						}
						if ( IBSS.enums[ 'SALE_TEAM_SCALE' ] ) {
							me.initializeSalesSize( IBSS.enums[ 'SALE_TEAM_SCALE' ], model.saleTeamScale );
						}
						me.$hasSales.val( model.saleTeam ? 'true' : 'false' );
						me.$isMettingSale.val( model.willPin ? 'true' : 'false' );
						me.$isFirstView.val( model.isFirstmettingSign ? 'true': 'false' );
						me.$isStranger.val( model.strangerVisits ? 'true': 'false' );
						me.$city.val( model.city );
						me.$isFastSign.val( model.fastSign ? 'true': 'false' );
						me.$dealDays.val( model.dealDays );
						me.$hp.val( model.autoclave ? 'true' : 'false' );
						me.$hpDays.val( model.autoclaveDays );
						me.$isIntro.val( model.referral ? 'true': 'false' );
						me.$isPayed.val( model.payed ? 'true': 'false' );
						me.$cName.val( model.contactName );
						me.$cMobile.val( model.contactPhone );
						me.$cEmail.val( model.contactEmail );
						me.$cQQ.val( model.contactIM );
						me.$kcName.val( model.keyContactName );
						me.$kcMobile.val( model.keyContactPhone );
						me.$kcEmail.val( model.keyContactEmail );
						me.$remark.val( model.remark );
						me.$sProductName.val( model.productName );
						me.$spstatus.val( me.findEnumValue(IBSS.enums['ENT_LST_PSTS'], model.runStatus) );
						me.$sAgentId.val( model.agentId );
						me.$sAgentName.val( model.agentName );
						me.$sdXKET.val( model.endTime ? new Date( model.endTime )._format( 'yyyy-MM-dd' ) : '永久' );
						me.$sdPayImd.val( model.firstPayTime ? new Date( model.firstPayTime )._format( 'yyyy-MM-dd' ) : '未知' );
						me.$sdXKDC.val( model.accountTotalAmount );
						me.$sdXKDUC.val( model.accountUsedAmount );
						me.$sdBCET.val( model.baichuanEndTime ? new Date( model.baichuanEndTime )._format( 'yyyy-MM-dd' ) : '永久' );
						me.$sdBCDC.val( model.baichuanTotalAmount || 0 );
						me.$sdBCDUC.val( model.baichuanUsedAmount || 0 );
						me.$sdSmC.val( model.smsTotalAmount );
						me.$sdSmUC.val( model.smsUsedAmount );
						me.$sdSC.val( (model.storageTotalSpace / 1024).toFixed(1) );
						me.$sdSUC.val( (model.storageUsedSpace / 1024).toFixed(1) );
						me.$sActivity.val( me.findEnumValue( IBSS.enums['ENT_LST_ACTIVITY'], model.activity ) );
						me.$sdProductModule.val( me.findEnumValue( IBSS.enums['PRODUCT_MODULE'], model.modules ) );
						me.$sdMarketingStatus.val( model.isMarketingStimulationEnabled ? '开通' : '停止' );
						me.$sdCustom.val( model.isLoginPagePersonalization ? '开通' : '停止' );
						me.$sdActiveTime.val( model.appStartTime ? new Date( model.appStartTime )._format( 'yyyy-MM-dd hh:mm' ) : '' );
						me.$sdCreater.val( model.creator );
						me.$sdCreateTime.val( new Date( model.createTime )._format( 'yyyy-MM-dd hh:mm' ) );
						me.$sdContact.val( model.creatorContcat );
						me.$sdAgentName.val( model.creatorAgentName );
						me.$sdUpdater.val( model.updater );
						me.$sdUpdateTime.val( model.updateTime ? new Date( model.updateTime )._format( 'yyyy-MM-dd hh:mm' ) : '' );
						me.$sdUpdaterMobile.val( model.updaterContact );
						me.setVisibility();
						me.initializeDatepickers();
						me.$smsName.val( model.enterpriseShortName );
						me.$smsWh.val( model.smsSubPort );
						console.log( model )
					}
				}
			})
		},

		/**
         *
         *  权限设置
		 *  dom元素内     含有 f1 f2 f3 f4 等类名的元素全部隐藏
		 *  根据权限信息相应类名显示
		 */
		setVisibility: function() {
			var status = this.model.attrs.runStatus;
			$( '.f1,.f2,.f3,.f4' ).css( 'display', 'none' );
			switch( status ) {
				case 1: // 待开通
					$( '.ed' ).removeAttr( 'disabled' );
					$( '.f1' ).css( 'display', '' );
					break;
				case 2: // 已开通
					$( '.ed' ).removeAttr( 'disabled' );
					$( '.f2' ).css( 'display', '' );
					break;
				case 3: // 已作废
					$( '.ed' ).attr( 'disabled', 'disabled' );
					$( '.f3' ).css( 'display', '' );
					break;
				case 4: // 已停用
					$( '.ed' ).attr( 'disabled', 'disabled' );
					$( '.f4' ).css( 'display', '' );
					break;
				default: break;
			}

			/**
			 *
			 * 如果是代理商
			 * 只能查看各种企业信息
			 * 不能进行各种操作
			 */
			if( this.attrs.isAgent === true ){

				this.$view.find('.off').hide();
				this.$view.find('input').attr('disabled','disabled');
				this.$view.find('select').attr('disabled','disabled');
				this.$view.find('textarea').attr('disabled','disabled');
			}
		},

		/**
         *
         *  初始化日期选择
         */
		initializeDatepickers: function() {
			var me = this;
			me.$sXKET.datetimepicker( {
				format: 'Y/m/d',
				timepicker: false
			} );
			me.$sBCET.datetimepicker( {
				format: 'Y/m/d',
				timepicker: false
			} );
			me.$sbJCFCST.datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$sbJCFCET.val() ? me.$sbJCFCET.val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$sbJCFCET.datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$sbJCFCST.val() ? me.$sbJCFCST.val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			me.$sbLogST.datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var maxDate = me.$sbLogET.val() ? me.$sbLogET.val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$sbLogET.datetimepicker( {
				format: 'Y/m/d',
				onShow: function() {
					var minDate = me.$sbLogST.val() ? me.$sbLogST.val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );
			me.$vcStartTime.datetimepicker({
				format: 'Y/m/d',
				onShow: function(){
					var maxDate = me.$vcEndTime.val() ? me.$vcEndTime.val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			});
			me.$vcEndTime.datetimepicker({
				format: 'Y/m/d',
				onShow: function(){
					var minDate = me.$vcStartTime.val() ? me.$vcStartTime.val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			});
		},

		generateSelect: function( name, $select ) {
			util.getEnums( name, function( data ) {
				var items = data.model, options = '';
				items.forEach( function( item , index){
					options += '<option value="' + item.value + '" title="' + item.text + '">' + item.text + '</option>';
				});
				if ( $select ) {
					$select.append( options );
				}
			});
		},

		//??
		findEnumValue: function( list, value ) {
			/*
			var result = '';
			$.each( list.value.model, function( i, item ){
				if ( item.value == value ) {
					result = item.text;
					return;
				}
			} );
			return result;
			*/
		},

		showAccordian: function( e ) {
			var target = e.currentTarget,
				$parent = $( target ).parent();
				$content = $( target ).next( '.content' );
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
				case 'product':
					this.showProductInfo();
					break;
				case 'agent':
					this.showAgentInfo();
					break;
				case 'trial':
					this.showTrialInfo();
					break;
				case 'operations':
					this.showOperations();
					break;
				case 'modules':
					this.showModules();
					break;
				case 'functions':
					this.showFunctions();
					break;
				case 'jcf':
					this.showJCF();
					break;
				case 'visitingcard':
					this.showVisitingCard();
					break;
				case 'jcflog':
					this.showJCFLog();
					break;
				case 'market':
					this.showMarketing();
					break;
				case 'custom':
					this.showCustom();
					break;
				case 'log':
					this.showLog();
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

		initializeIndustry: function( list, value ) {
			this.initializeSelectValue( list, value, this.$aindustry );
		},

		initializeSource: function( list, value ) {
			this.initializeSelectValue( list, value, this.$asource );
		},

		initializeProvince: function( list, value ) {
			this.initializeSelectValue( list, value, this.$aprovince );
		},

		initializeGroup: function( list, value ) {
			this.initializeSelectValue( list, value, this.$agroup );
		},

		initializeChannel: function( list, value ) {
			this.initializeSelectValue( list, value, this.$aknow );
		},

		initializeIntention: function( list, value ) {
			this.initializeSelectValue( list, value, this.$aregister );
		},

		initializeCompanySize: function( list, value ) {
			this.initializeSelectValue( list, value, this.$acompany );
		},

		initializeSalesSize: function( list, value ) {
			this.initializeSelectValue( list, value, this.$asales );
		},

		initializeLogTypes: function( list, select ) {
			var l = [];
			$.each( list.value.model, function( i, item ){
				l.push( { 'name': item.text, 'value': item.value } );
			} );
			util.resetSelect( select , l );
		},

		saveBasicEve: function( e ) {

			// disable buttons
			var me = this;
			var $target = $( e.currentTarget );
			$target.attr( 'disabled', 'disabled' );
			$target.addClass( 'disable' );
			
			var data = {
				enterpriseId: this.model.attrs.enterpriseId,
				enterpriseName: this.$name.val(),
				address: this.$address.val(),
				industry: this.$aindustry.val(),
				source: this.$asource.val(),
				province: this.$aprovince.val(),
				groupType: this.$agroup.val(),
				knowSource: this.$aknow.val(),
				registerMotive: this.$aregister.val(),
				companyScale: this.$acompany.val(),
				isSaleTeam: this.$hasSales.val(),
				saleTeamScale: this.$asales.val(),
				isFirstMeetingSign: this.$isFirstView.val(),
				isWillPin: this.$isMettingSale.val(),
				isStrangerVisits: this.$isStranger.val(),
				city: this.$city.val(),
				isFastSign: this.$isFastSign.val(),
				dealDays: this.$dealDays.val(),
				isAutoClave: this.$hp.val(),
				autoclaveDays: this.$hpDays.val(),
				isReferral: this.$isIntro.val(),
				isPayed: this.$isPayed.val(),
				keyContactName: this.$kcName.val(),
				keyContactPhone: this.$kcMobile.val(),
				keyContactEmail: this.$kcEmail.val(),
				contactName: this.$cName.val(),
				contactPhone: this.$cMobile.val(),
				ContactEmail: this.$cEmail.val(),
				contactIm: this.$cQQ.val(),
				remark: this.$remark.val()
			};
			util.api({
				url: '/enterprise/updateenterprise',
				data: data,
				success: function( data ) {

					console.warn( data );
					if ( data.success ) {
						me.model.attrs.updateTime = data.value.model.modifyTime;
						util.showTip( '更新成功' );
					}
				},
				complete: function() {
					$target.removeAttr( 'disabled' );
					$target.removeClass( 'disable' );
				}
			});
		},

		showProductInfo: function() {
			var me = this;
			if ( me.product.isInitialized ) {
				return;
			}
			if ( me.model.attrs.runStatus > 2 ) {
				$('#tbProduct').css( 'display', 'none' );
				return;
			}
			$('#tbProduct').css( 'display', 'block' );

			if( me.product.pagination ){

				me.product.pagination.setPage(0,false);
				me.product.pagination.setTotalSize(0);
			}else{
				me.product.pagination = new Pagination({
					wrapper: me.$view.find('#tbProduct .pager'),
					pageSize: 10,
					pageNumber: 0
				});
				me.product.pagination.render();
				me.product.pagination.onChange = function() {
					me.loadProducts();
				};
				me.loadProducts();
			}
		},
		loadProducts: function() {
			var me = this, data = {
				pageIndex: me.product.pagination.attr['pageNumber'],
				pageSize: me.product.pagination.attr['pageSize']
				//isPage:1
			};
			util.api({
				url: '/product/querypage',
				data: data,
				success: function( data ) {
					console.warn( data );
					if( data.success ) {
						me.product.pagination.setTotalSize( data.value.model.itemCount );
						if ( data.value.model.content.length > 0 ) {
							me.$tbProduct.html( me.tplProduct( { content: data.value.model.content } ) );
						} else {
							me.$tbProduct.html( '<tr><td colspan="3"><p class="info">暂无数据</p></td></tr>' );
						}
						me.product.isInitialized = true;
						me.product.list = data.value.model.content;
					}
				}
			});
		},
		showAgentInfo: function() {
			var me = this;
			
			/*
			if ( me.agent.isInitialized ) {
				return;
			}
			*/
			
			if ( me.model.attrs.runStatus > 2 ) {
				$('#tbAgent').css( 'display', 'none' );
				return;
			}
			$('#tbAgent').css( 'display', 'block' );
			me.$('#sbAgentId').val('');
			me.$('#sbAgentName').val('');


			if( me.agent.pagination ){
				me.agent.pagination.setPage(0,false);
				me.agent.pagination.setTotalSize(0);
			}else{
				me.agent.pagination = new Pagination({
					wrapper: me.$view.find('#tbAgent .pager'),
					pageSize: 10,
					pageNumber: 0
				});
				me.agent.pagination.render();
				me.agent.pagination.onChange = function() {
					me.loadAgents();
				};
				me.loadAgents();
			}
		},
		loadAgents: function() {
			var me = this, data = {
				id: me.$('#sbAgentId').val(),
				name: me.$('#sbAgentName').val(),
				pageIndex: me.agent.pagination.attr['pageNumber'],
				pageSize: me.agent.pagination.attr['pageSize']
			};
			util.api({
				url: '/agent/querypage',
				data: data,
				success: function( data ) {
					if( data.success ) {
						me.agent.pagination.setTotalSize( data.model.itemCount );
						$( data.model.content ).each( function( i, item ) {
							item.provinceName = me.findEnumValue( IBSS.enums['PROVINCE'], item.province );
						} );
						if ( data.model.content.length > 0 ) {
							me.$tbAgent.html( me.tplAgent( { content: data.model.content } ) );
						} else {
							me.$tbAgent.html( '<tr><td colspan="4"><p class="info">暂无数据</p></td></tr>' );
						}
						me.agent.isInitialized = true;
						me.agent.list = data.model.content;
					}
				}
			});
		},
		
		/**
		 * 
		 * 试用配置
		 */
		showTrialInfo: function() {
			var me = this;
			if( me.trial.isInitialized ) {
				return;
			}
			if ( me.model.attrs.runStatus > 2 ) {
				$( '#tbTrial' ).parent().find( 'input' ).attr( 'disabled', 'disabled' );
				$('#tbTrial').css( 'display', 'none' );
				return;
			}
			$( '#tbTrial' ).parent().find( 'input' ).removeAttr( 'disabled' );
			$('#tbTrial').css( 'display', 'block' );
			util.api({
				url: '/enterprise/getenterprisetrialconfig',
				data: { enterpriseId: me.model.attrs.id },
				success: function( data ) {
					var time = '永久';
					var count = 20;
					if ( data.success ) {
						if ( data.model ) {
							time = new Date( data.model.endDay )._format( 'yyyy-MM-dd' );
							count = data.model.trialEndAmount;
						}
						me.$sTrialTime.val( time );
						me.$sTrialAmount.val( count );
						me.trial.isInitialized = true;
					}
				}
			});
		},
		

		/**
		 *
		 * 使用情况
		 */
		showOperations: function() {
			var me = this;
			if ( me.operations.isInitializes ) {
				return;
			}
			if ( me.model.attrs.runStatus > 2 ) {
				$( '#tbOperation' ).css( 'display', 'none' );
				return;
			}
			$( '#tbOperation' ).css( 'display', 'block' );

			console.log( me.operations.pagination )
			if( me.operations.pagination ){

				me.operations.pagination.setPage(0,false);
				me.operations.pagination.setTotalSize(0);

			} else {
				me.operations.pagination = new Pagination({
					wrapper: me.$view.find('#tbOperation .pager'),
					pageSize: 10,
					pageNumber: 0
				});
				me.operations.pagination.render();
				me.operations.pagination.onChange = function() {
					me.loadOperations();
				};
				me.loadOperations();
			}
		},
		loadOperations: function() {
			var me = this;
			var data = {
				pageIndex: me.operations.pagination.attr['pageNumber'],
				pageSize: me.operations.pagination.attr['pageSize']
			};
			util.api({
				url: '/enterprise/querypageenterpriseaccountincrement',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						me.operations.pagination.setTotalSize( data.model.itemCount );
						$( data.model.content ).each( function ( i, item ) {
							item.ncreaseTime = new Date( item.ncreased )._format( 'yyyy-MM-dd hh:mm' );
						} );
						if ( data.model.content.length > 0 ) {
							me.$tbOperation.html( me.tplOperation( { content: data.model.content } ) );
						} else {
							me.$tbOperation.html( '<tr><td colspan="4"><p class="info">暂无数据</p></td></tr>' );
						}
						me.operations.isInitialized = true;
					}
				}
			});
		},
		showModules: function() {
			if ( this.modules.isInitialized ) {
				return;
			}
			if ( this.model.attrs.runStatus == 2 ) {
				$( '#tbProductModule' ).css( 'display', 'block' );
				this.generateSelect( 'PRODUCT_MODULE', this.$sProductModule );
				this.modules.isInitialized = true;
			} else {
				$( '#tbProductModule' ).css( 'display', 'none' );
			}
		},
		showFunctions: function() {
			var me = this;
			me.$sELC.val(100);
			me.$sEFC.val(100);
			me.$sECC.val(100);
			me.$sEMWC.val(100);
			me.$sEAC.val(100);
			me.$sUFS.val(50);
			util.api({
				url: '/enterprise/queryenterpriseitemconfig',
				data: { enterpriseId: this.model.attrs.id },
				success: function( data ) {
					if ( data.success ) {
						var model = data.model;
					}
				}
			});

			if ( this.model.attrs.runStatus == 2 ) {
				$( '#tbFunctions' ).css( 'display', 'block' );
			} else {
				$( '#tbFunctions' ).css( 'display', 'none' );
			}
		},
		showJCF: function() {
			var me = this;
			console.log('showJCF');
			util.api({
				url: '/enterprise/getenterprisestatistics',
				data: { enterpriseId: this.model.attrs.id },
				success: function( data ) {
					if ( data.success ) {
						var model = data.model || {};
						me.$sdJCFCompanyName.val( me.model.attrs.enterpriseShortName );
						me.$sdJCFActive.val( me.model.attrs.isJiuCiFang ? '是' : '否' );
						me.$sdJCFTotal.val( model.rechargeAmount || 0 );
						me.$sdJCFUsed.val( model.consumeAmount || 0 );
						me.$sdJCFLeft.val( model.surplusAmount || 0 );
						me.jcf.model = model;
					}
				}
			});
			if ( this.model.attrs.runStatus == 2 ) {
				$( '#tbJCF' ).css( 'display', 'block' );
			} else {
				$( '#tbJCF' ).css( 'display', 'none' );
			}
		},
		showJCFLog: function() {
			var me = this;
			console.log('showJCFLog');
			if ( !me.jcflog.isInitialized ) {
				me.jcflog.pagination = new Pagination({
					wrapper: me.$view.find('#tbJCFLog .pager'),
					pageSize: 10,
					pageNumber: 0
				});
				me.jcflog.pagination.render();
				me.jcflog.pagination.onChange = function() {
					me.loadJCFLog();
				};
				me.loadJCFLog();
				me.jcflog.isInitialized = true;
			}
		},
		loadJCFLog: function() {
			var me = this,
				data = {
					pageIndex: me.jcflog.pagination.attr['pageNumber'],
					pageSize: me.jcflog.pagination.attr['pageSize'],
					enterpriseId: me.model.attrs.id
				};
			if ( me.$sbJCFCST.val() ) {
				data.timeBegin = new Date( me.$sbJCFCST.val() ).getTime();
			}
			if ( me.$sbJCFCET.val() ) {
				data.timeEnd = new Date( me.$sbJCFCET.val() ).getTime();
			}
			util.api({
				url: '/enterprise/querypagejiucifangrecharge',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						me.jcflog.pagination.setTotalSize( data.model.itemCount );
						if ( data.model.content.length > 0 ) {
							me.$tbJCFLog.html( me.tplJCFLog( { content: data.model.content } ) );
						} else {
							me.$tbJCFLog.html( '<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>' );
						}
					}
				}
			});
		},
		showMarketing: function() {
			if ( this.model.attrs.runStatus == 2 ) {
				$( '#tbMarketing' ).css( 'display', 'block' );
			} else {
				$( '#tbMarketing' ).css( 'display', 'none' );
			}
		},
		showCustom: function() {
			if ( this.model.attrs.runStatus == 2 ) {
				$( '#tbCustom' ).css( 'display', 'block' );
			} else {
				$( '#tbCustom' ).css( 'display', 'none' );
			}
		},
		showLog: function() {
			var me = this;
			if ( !this.log.isInitialized ) {
				me.log.pagination = new Pagination({
					wrapper: me.$view.find('#tbLog .pager'),
					pageSize: 10,
					pageNumber: 0
				});
				me.log.pagination.render();
				me.log.pagination.onChange = function() {
					me.loadLog();
				};
				me.loadLog();
				this.log.isInitialized = true;
			}
		},
		loadLog: function() {
			var me = this,
				data = {
					pageIndex: me.log.pagination.attr['pageNumber'],
					pageSize: me.log.pagination.attr['pageSize'],
					enterpriseId: me.model.attrs.id,
					type: me.$sbLogType.val()
				};
			if ( me.$sbLogST.val() ) {
				data.timeBegin = new Date( me.$sbLogST.val() ).getTime();
			}
			if ( me.$sbLogET.val() ) {
				data.timeEnd = new Date( me.$sbLogET.val() ).getTime();
			}
			util.api({
				url: '/enterprise/querypageenterpriselog',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						me.log.pagination.setTotalSize( data.model.itemCount );
						if ( data.model.content.length > 0 ) {
							me.$tbLog.html( me.tplLog( { content: data.model.content } ) );
						} else {
							me.$tbLog.html( '<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>' );
						}
					}
				}
			});
		},
		searchLog: function() {
			this.loadLog();
		},

		searchAgent: function( e ) {
			this.loadAgents();
		},
		changeProductEve: function( e ) {
			var me = this,
				$target = $( e.currentTarget ),
				pid = $target.attr( 'data-id' ),
				data = {
					enterpriseId: this.model.attrs.enterpriseId,
					productId: pid
				};

			util.api({
				url: '/enterprise/changeproduct',
				data: data,
				success: function(data ) {
					if ( data.success ) {
						util.showTip( '修改成功' );
						var product = me.findProduct( pid );
						me.$sProductName.val( product.name );
					}
				}
			});
		},
		findProduct: function( id ) {
			var me = this;
			var result = null;
			$( me.product.list ).each( function( i, item ) {
				if ( item.id == id ) {
					result = item;
					return false;
				}
			} );
			return result;
		},
		changeAgentEve: function( e ) {
			var me = this,
				$target = $( e.currentTarget ),
				vid = $target.attr( 'data-id' ),
				data = {
					enterpriseId: this.model.attrs.enterpriseId,
					vendorId: vid
				};

			util.api({
				url: '/enterprise/changevendor',
				data: data,
				success: function(data ) {
					if ( data.success ) {
						util.showTip( '修改成功' );
						var agent = me.findAgent( vid );
						me.$sAgentId.val( agent.id );
						me.$sAgentName.val( agent.name );
					}
				}
			});
		},
		findAgent: function( id ) {
			var me = this;
			var result = null;
			$( me.agent.list ).each( function( i, item ) {
				if ( item.id == id ) {
					result = item;
					return false;
				}
			} );
			return result;
		},

		changeTrial: function() {
			var data = {
				enterpriseId: this.model.attrs.id,
				endDay: new Date( this.$sTrialTime.val() ).getTime(),
				trialEndAmount: this.$sTrialAmount.val()
			};
			util.api({
				url: '/enterprise/changetrialconfig',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '修改成功' );
					}
				}
			});
		},
		clearStatisticsForm: function() {
			this.$sXKDC.val( '' );
			this.$sXKET.val( '' );
			this.$sBCDC.val( '' );
			this.$sBCET.val( '' );
			this.$sSms.val( '' );
			this.$sStorage.val( '' );
			this.$sDevice.val( '' );
		},
		changeStatistics: function() {
			var me = this;
			var data = {
				enterpriseId: me.model.attrs.id,
				accountAmount: me.$sXKDC.val(),
				increaseAmount: me.$sDevice.val(),
				baichuanAccountAmount: me.$sBCDC.val(),
				rechargeSmsAmount: me.$sSms.val(),
				expandStorageSpace: me.$sStorage.val()
			};
			if ( me.$sXKET.val() ) {
				data.productEndTime = new Date( me.$sXKET.val() ).getTime();
			}
			if ( me.$sBCET.val() ) {
				data.baichuanEndTime = new Date( me.$sBCET.val() ).getTime();
			}
			util.api({
				url: '/enterprise/changeconfig',
				data: data,
				success: function() {
					if( data.success ) {
						util.showTip( '修改成功' );
						me.clearStatisticsForm();
					}
				}
			});
		},

		/**
         *
         * 开通企业
         */
		active: function() {
			var me = this,
				data = {
					enterpriseId: me.model.attrs.id,
					oldModifyTime: me.model.attrs.updateTime,
					comments: me.$sActiveRemark.val()
				};
			util.api({
				url: '/enterprise/launchenterprise',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '正在开通企业,稍后请重新查询开通状态.' );
						me.$sActiveRemark.val( '' );
					}
				}
			});
		},
		
		/**
		 *
		 * 作废企业
		 */
		uninstall: function() {
			var me = this,
				data = {
					enterpriseId: me.model.attrs.id,
					oldModifyTime: me.model.attrs.updateTime,
					comments: me.$sActiveRemark.val()
				};
			util.api({
				url: '/enterprise/cancelproductforenterprise',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '企业已作废.' );
						me.$sActiveRemark.val( '' );
					}
				}
			});
		},

		/**
		 *
		 * 显示名片购买信息 
		 */
		showVisitingCard: function() {
			var me = this;

			me.$vcType.val('');
			me.$vcStartTime.val('');
			me.$vcEndTime.val('');


			if( me.visitingcard.pagination ){

				me.visitingcard.pagination.setPage(0,false);
				me.visitingcard.pagination.setTotalSize(0);
			}else{
				me.visitingcard.pagination = new Pagination({
					wrapper: me.$view.find('#visitingcard .pager'),
					pageSize: 10,
					pageNumber: 0
				});
				me.visitingcard.pagination.render();
				me.visitingcard.pagination.onChange = function() {
					me.loadVistingCard();
				};
				me.loadVistingCard();
			}
		},

		//加载名片购买信息
		loadVistingCard: function(){
			var me = this;

			util.api({
				'url': '/enterprise/querypagebusinesscardrechange',
				'data': {
					'pageIndex': me.visitingcard.pagination.attr['pageNumber'],
					'pageSize': me.visitingcard.pagination.attr['pageSize'],
					'enterpriseId': '',
					'rechargeType': '',
					'timeBegin': '',
					'timeEnd': '',
				},
				'success': function(){

				}
			})
			
		},

		changeModule: function() {
			var me = this,
				data = {
					enterpriseId: me.model.attrs.id,
					modules: me.$sProductModule.val()
				};
			util.api({
				url: '/enterprise/changeproductmodules',
				data: data,
				success: function( data ) {
					if( data.success ) {
						util.showTip( '更新成功.' );
						me.$sdProductModule.val( me.$sProductModule.find("option:selected").text() );
					}
				}
			});
		},
		clearFunctions: function() {
			me.$sELC.val( '' );
			me.$sEFC.val( '' );
			me.$sECC.val( '' );
			me.$sEMWC.val( '' );
			me.$sEAC.val( '' );
			me.$sUFS.val( '' );
			me.$sActionDanger.val( '0' );
		},
		changeFunctions: function() {
			var me = this, data = {
				enterpriseId: this.model.attrs.id,
				newExportAmountLocation: me.$sELC.val(),
				newExportAmountPlan: me.$sEFC.val(),
				newExportAmountFeedWork: me.$sECC.val(),
				newExportAmountLeaveApplication: me.$sEMWC.val(),
				newExportAmountFeedApprove: me.$sEAC.val(),
				newUploadFileSizeLimit: me.$sUFS.val(),
				newIsAllowDangerOperate: me.$sActionDanger.val()
			};
			util.api({
				url: '/enterprise/changefunction',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '更新成功' );
						me.clearFunctions();
						me.$sdELC.val( me.$sELC.val() );
						me.$sdEFC.val( me.$sEFC.val() );
						me.$sdECC.val( me.$sECC.val() );
						me.$sdEMWC.val( me.$sEMWC.val() );
						me.$sdEAC.val( me.$sEAC.val() );
						me.$sdUFS.val( me.$sUFS.val() );
						me.$sdActionDanger.val( me.$sActionDanger.val() == '1' ? '是' : '否' );
					}
				}
			});
		},
		chargeJCF: function() {
			var me = this, data = {
				enterpriseId: me.model.attrs.id,
				count: me.$sJCFCount.val(),
				oldModifyTime: me.model.attrs.updateTime
			};
			util.api({
				url: '/enterprise/buyjiucifangrecharge',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '更新成功' );
						console.log( data );
					}
				}
			});
		},
		syncJCF: function() {
			var me = this, data = {
				enterpriseId: me.model.attrs.id,
				consumeAmount: me.jcf.model.consumeAmount,
				surplusAmount: me.jcf.model.surplusAmount,
				oldModifyTime: me.model.attrs.updateTime
			};
			util.api({
				url: '/enterprise/synchronizejiucifang',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '更新成功' );
						console.log( data );
					}
				}
			});
		},
		searchJCFLog: function() {
			this.loadJCFLog();
		},
		stopMarketing: function() {
			util.api({
				url: '/enterprise/disablemarketingstimulation',
				data: { enterpriseId: this.model.attrs.id },
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '更新成功' );
						this.$sdMarketingStatus.val( '停止' );
					}
				}
			}) ;
		},
		changeCustomStatus: function() {
			var me = this;
			util.api({
				url: '/enterprise/enableloginpagepersonalization',
				data: { enterpriseId: this.model.attrs.id, isLoginPagePersonalization: !this.model.attrs.isLoginPagePersonalization },
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '更新成功' );
						me.model.attrs.isLoginPagePersonalization = !me.model.attrs.isLoginPagePersonalization;
						me.$sdCustom.val( me.model.attrs.isLoginPagePersonalization ? '启用' : '停止' );
					}
				}
			}) ;
		},
		resetAdminPassword: function() {
			if ( !window.confirm( '是否确认重置企业管理员密码?\r\n' + this.generateConfirmMsg() ) ) {
				return;
			}
			util.api({
				url: '',
				data: { enterpriseId: this.model.attrs.id },
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '密码重置成功' );
					}
				}
			});
		},
		stopService: function() {
			var me = this;
			if ( !window.confirm( '是否确认停用企业?\r\n' + this.generateConfirmMsg() ) ) {
				return;
			}
			util.api({
				url: '/enterprise/enableenterprise',
				data: { 
					enterpriseId: this.model.attrs.id,
					oldModifyTime: me.model.attrs.updateTime,
					isEnabled: false 
				},
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '企业已停用.' );
						me.hide();
					}
				}
			});
		},
		startService: function() {
			var me = this;
			if ( !window.confirm( '是否确认启用企业?\r\n' + this.generateConfirmMsg() ) ) {
				return;
			}
			util.api({
				url: '/enterprise/enableenterprise',
				data: {
					enterpriseId: this.model.attrs.id,
					oldModifyTime: me.model.attrs.updateTime,
					isEnabled: true 
				},
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '企业已启用' );
						me.hide();
					}
				}
			});
		},
		generateConfirmMsg: function() {
			return '企业: ' + this.model.attrs.enterpriseName + '\r\n产品: ' +  this.model.attrs.productName + '\r\n代理商: ' + this.model.attrs.agentName + '( ' + this.model.attrs.agentId + ' )';
		}
	});

	module.exports = EntDetail;
});
