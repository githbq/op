/**
 * 
 * 企业详情
 */
define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
	
	var contentStr = require('./enterprisedetail.html');
	var Pagination = require( 'common/widget/pagination/pagination' );
	var Dialog = require('common/widget/dialog/dialog');
	var tpl = $( require( './template.html' ) );
	var uploader = require('common/widget/upload').uploader;


	var LOGTYPE = {};    //日志类别
	var buyMap = new Object({'1':'赠送','2':'购买充值'});
	var carMap = new Object({'0':'未开通服务','1':'限量购买','2':'不限量使用'});

	//添加编辑培训信息
	var TrainingDialog = MClass( Dialog ).include({

		defaultAttr: {
			'title': '培训详情',
			'width': 420
		},
		content: tpl.filter('#training').html(),
		events:{
			'click .submit': 'addEve',
			'click .save': 'saveEve'
		},
		elements:{
			'.trainingDate': 'trainingDate'
		},
		init: function(){
			var me = this;

			TrainingDialog.__super__.init.apply(this,arguments);

			me.$trainingDate.datetimepicker( {'timepicker':false,'format':'Y/m/d'} );

			me.setState();
		},

		setState: function(){
			var me = this;

			if( me.attrs.state ){

				me.$('[data-state="'+me.attrs.state+'"]').show();
			}
		},

		addEve: function(){
			var me = this;

			//各种校验
			if( !me.verify() ){
				return false;
			}

			var data = me.model.all();

			data.trainingDate = '';
			if( me.$trainingDate.val() ){
				data.trainingDate = new Date( me.$trainingDate.val() ).getTime();
			}

			util.api({
				'url':'/enterprise/addtraining',
				'data': data,
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						me.hide();
						console.log('triggeraddsuccess')
						me.trigger('addsuccess');
					}
				}
			})
		},

		verify: function(){
			var me = this;

			if( !me.model.get('trainingName') ){
				util.showToast('请填写培训名称');
				return false;
			}
			if( !me.model.get('trainer') ){
				util.showToast('请填写培训师');
				return false;
			}
			if( !me.model.get('trainingNumber') ){
				util.showToast('请填写参训人数');
				return false;
			}
			if( !me.$trainingDate.val() ){
				util.showToast('请填写培训时间');
				return false;
			}

			return true;
		},

		saveEve: function(){
			var me = this;

			//各种校验
			if( !me.verify() ){
				return false;
			}
			
			var data = me.model.all();

			data.trainingDate = '';
			if( me.$trainingDate.val() ){
				data.trainingDate = new Date( me.$trainingDate.val() ).getTime();
			}


			util.api({
				'url':'/enterprise/updatetraining',
				'data': data,
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						me.hide();
						console.log('updatesuccess')
						me.trigger('updatesuccess');
					}
				}
			})
		},

		show: function( enterpriseId , id ){
			var me = this;


			me.model.set( 'enterpriseId',enterpriseId );
			
			if( id ){
				util.api({
					'url': '/enterprise/gettraining',
					'data': {
						'id': id
					},
					'success': function( data ){
						if( data.success ){
							me.model.load( data.value.model );
							if( me.model.get('trainingDate') ){
								me.$trainingDate.val( new Date( me.model.get('trainingDate') )._format('yyyy/MM/dd') );
							}
						}
					}
				})
			}

			TrainingDialog.__super__.show.apply(this,arguments);
		},	
		
		hide: function(){
			var me = this;

			me.$trainingDate.val('');
			me.model.clear();
			TrainingDialog.__super__.hide.apply(this,arguments);
		}
	});

	//企业详情
	var EntDetail = MClass( Slider ).include({
		
		content: contentStr,

		defaultAttr:{
			title:'企业产品单',
			width: 680
		},
		
		elements: {
			'#actStartTime': 'actStartTime',
			'#actEndTime': 'actEndTime',
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
			'#yingxiaoSum': 'yingxiaoSum',
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
			'#yingyezhizhaoinfo': 'yingyezhizhaoinfo',         //营业执照显示信息a标签

			'#hetongzhaopian': 'hetongzhaopian',        // 合同input
			'#hetonginfo': 'hetonginfo',                // 合同图片显示a标签
			'#hetongnone': 'hetongnone',
			
			'#hetongfbzhaopian': 'hetongfbzhaopian',    // 合同副本input
			'#hetongfbinfo': 'hetongfbinfo',            // 合同副本
			'#hetongfbnone': 'hetongfbnone',            // 

			'#mentou': 'mentou',
			'#mentouinfo': 'mentouinfo',                // 门头信息显示a标签

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
			'#createTime':'createTime',
			'#tabs li'   :'tabsList'
		},
		events: {
			'click .accordian h4': 'showAccordian',
			'click #btnSaveBasic': 'saveBasicEve',
			'click #tbProduct em': 'changeProductEve',
			'click #tbAgent em': 'changeAgentEve',
			'click #btnSBAgentSearch': 'loadAgents',
			'click #sBtnChangeTrial': 'changeTrial',

			'click #sBtnChangeStatistics': 'changeStatistics',
			'click #sBtnChangeStatisticsagent': 'changeStatisticsagent',

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
			'click .modifySmsName': 'modifySmsName',
			'click #actDownload': 'actDownloadEve' ,   		   //活跃度下载
			'click #btnCardList': 'searchCardList',
			'click #btnCardBuy': 'btnCardBuy',
			'click #btnCardSend': 'btnCardSend',
			'click #btnSBAgentSearch': 'agentSearchEve',       //回访列表

			'click #btnPhoneCallbackEve': 'phoneCallbackEve',  //电话回访

			'click .uploadzz': 'uploadzzEve',  					//上传执照
			'click .uploadmt': 'uploadmtEve',   				//上传门头信息

			'click .callback-actionon': 'callbackOnEve',      //电话回访成功
			'click .callback-actionoff': 'callbackOffEve',    //电话回访失败
			//'click .verificationaction-on': 'veriOnEve',      //资料审核成功
			//'click .verificationaction-off': 'veriOffEve',	  //资料审核失败

			'click .upload':'saveFn',				  //资料审核提交
			'click .fn-buy':'fnBuyEve',

			'click .addTraining': 'addTrainingEve',             //添加培训记录
			'click .edittraining': 'editTrainingEve',           //编辑培训记录
			'click .searchTraining': 'searchTraining',

			'click .callback-actionon': 'callbackOnEve',      	//电话回访成功
			'click .callback-actionoff': 'callbackOffEve',    	//电话回访失败
			'click .verificationaction-on': 'veriOnEve',      	//资料审核成功
			'click .verificationaction-off': 'veriOffEve',	  	//资料审核失败
			'click .fn-buy-free':'fnBuyFreeEve',                       //营销版办公版增购tab切换

			'click .employee-detail':'employeeDetailEve'
		}, 

		uploadzzEve: function(){
			var me = this;

			if( me.$yingyezhizhao[0].files.length <= 0 ){
				util.showToast('请选择营业执照');
				return false;
			}
			uploader.send({
				'url': '/op/api/file/uploadsinglefile',
                'files': me.$yingyezhizhao[0].files,
                'success': function( response ){
                    console.warn( response );
                   	if( response.success ){

                   		sendInfo( response.value.model.path , response.value.model.FileName );
                   	}
                }
			});
			function sendInfo( path , filename ){
				util.api({
					'url':'/enterprise/addenterpriselicense',
					'data':{
						'enterpriseId': me.model.attrs['enterpriseId'],
						'licensePath': path,
						'licenseName': filename
					},
					'success': function( data ){
						if( data.success ){
							util.showTip('上传成功 请等待审核');
							me.showVerifiCation();
						}
					}
				})
			}
		},
		uploadmtEve: function(){
			var me = this;

			if( me.$mentou[0].files.length <= 0 ){
				util.showToast('请选择门头照片');
				return false;
			}
			uploader.send({
				'url': '/op/api/file/uploadsinglefile',
                'files': me.$mentou[0].files,
                'success': function( response ){
                    console.warn( response );
                   	if( response.success ){

                   		sendInfo( response.value.model.path , response.value.model.FileName );
                   	}
                }
			})
			function sendInfo( path , filename ){
				util.api({
					'url':'/enterprise/addenterprisedoorhead',
					'data':{
						'enterpriseId': me.model.attrs['enterpriseId'],
						'doorheadPath': path,
						'doorheadName': filename
					},
					'success': function( data ){
						if( data.success ){
							util.showTip('上传成功 请等待审核');
							me.showVerifiCation();
						}
					}
				})
			}
		},
		saveFn: function(){

			var me = this;
			var objData = {};

			/***
			 *
			 * 如果以前没有合同 这次也没上传 则提示必须选择合同照片
			 */
			if( !me.model.get('contract') && me.$hetongzhaopian[0].files.length <= 0 ){
				
				util.showTip('请选择合同照片');
				return false;
			}

			objData['enterpriseId'] = me.model.attrs['enterpriseId'];
			objData['contract'] = me.model.get('contract') || '';
			objData['contractFileName'] = me.model.get('contractFileName') || '';

			objData['contractType'] = me.model.get('contractType') || 3;
			objData['extraId'] = me.model.get('extraId');

			objData['businessLicense'] = me.model.get('businessLicense') || '';
			objData['businessLicenseFileName'] = me.model.get('businessLicenseFileName') || '';
			objData['companyGatePicture'] = me.model.get('companyGatePicture' )|| '';
			objData['companyGatePictureFileName'] = me.model.get('companyGatePictureFileName' )|| '';
			objData['contractCopy'] = me.model.get('contractCopy' )|| '';
			objData['contractCopyFileName'] = me.model.get('contractCopyFileName' )|| '';
			objData['companyGateKeyword'] = me.model.get('companyGateKeyword');
			objData['companyGateRemark'] = me.model.get('companyGateRemark');
			
			util.api({
                'url': '/enterprise/saveenterpriseextend',
                'data': objData,
                'button': {
                	'el': me.$saveEve,
                	'text':'提交中......'
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                       util.showTip('保存成功 请等待审核');
                       me.getEnterprise( objData['enterpriseId'] ,function(){
                       		me.showVerifiCation();
                       });
                    }
                },
                'complete': function( ){
                	me.$saveEve.removeAttr('disabled');
                	me.$saveEve.text('保存');
                }
            });
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

		tplProduct: _.template( tpl.filter( '#trProduct' ).html() ),
		tplAgent: _.template( tpl.filter( '#trAgent' ).html() ),
		tplOperation: _.template( tpl.filter( '#trOperation' ).html() ),
		tplJCFLog: _.template( tpl.filter( '#trJCFLog' ).html() ),
		tplLog: _.template( tpl.filter('#trLog').html() ),
		tpCardList: _.template( tpl.filter('#trCardList').html() ),
		tplCallBackList: _.template( tpl.filter('#callBackList').html() ),

		init: function(attrs){
			EntDetail.__super__.init.apply( this,arguments );

			var me = this;

			me.product = {
				isInitialized: false,
				list: [],
				name: '',
				status: '',
				pagination: null
			};

			me.agent = {
				isInitialized: false,
				list: [],
				name: '',
				status: '',
				pagination: null
			};

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

			/**
			 *
			 *  培训信息
			 */
			me.training = {
				isInitializes: false,
				pagination: null,
				addDialog: new TrainingDialog({'state':'add'}),       //添加弹窗
				editDialog: new TrainingDialog({'state':'edit'})	   //编辑弹窗
			};
			me.training.addDialog.on('addsuccess',function(){
				console.log('addsuccess');
				me.loadTraining();
			});
			me.training.editDialog.on('updatesuccess',function(){
				console.log('updatesuccess');
				me.loadTraining();
			});

			//初始化日期选择
			me.initializeDatepickers();
			
			//门头照片
			me.$mentou.on('change',function(){
				var fileExtension =me.$mentou[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					
					me.$saveEve.attr('disabled','disabled');
					me.$saveEve.text('文件上传...');
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$mentou[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('companyGatePicture', response.value.model.path );
							me.model.set('companyGatePictureFileName', response.value.model.FileName );
							
							me.$saveEve.removeAttr('disabled');
							me.$saveEve.text('保存');
							
						},
						'error':function(response){
							me.$saveEve.removeAttr('disabled');
							me.$saveEve.text('保存');
							me.$mentou.val('');
							return false;
						}
					})
				}else{
					me.$mentou.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});

			//营业执照
			me.$yingyezhizhao.on('change',function(){
				var fileExtension =me.$yingyezhizhao[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$saveEve.attr('disabled','disabled');
					me.$saveEve.text('文件上传...');
					 uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$yingyezhizhao[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('businessLicense', response.value.model.path );
							me.model.set('businessLicenseFileName', response.value.model.FileName );
							me.$saveEve.removeAttr('disabled');
							me.$saveEve.text('保存');
						},
						'error':function(response){
							me.$saveEve.removeAttr('disabled');
							me.$saveEve.text('保存');
							me.$mentou.val('');
							return false;
						}
					})
				}else{
					me.$yingyezhizhao.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			
			//合同照片
			me.$hetongzhaopian.on('change',function(){
				var fileExtension =me.$hetongzhaopian[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$saveEve.attr('disabled','disabled');
					me.$saveEve.text('文件上传...');
					 uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$hetongzhaopian[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('contract', response.value.model.path );
							me.model.set('contractFileName', response.value.model.FileName );
							me.$saveEve.removeAttr('disabled');
							me.$saveEve.text('保存');
						},
						'error':function(response){
							me.$saveEve.removeAttr('disabled');
							me.$saveEve.text('保存');
							me.$mentou.val('');
							return false;
						}
					})
				}else{
					me.$hetongzhaopian.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
			});
	
			//合同副本照片
			me.$hetongfbzhaopian.on('change',function(){
				var fileExtension =me.$hetongfbzhaopian[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$saveEve.attr('disabled','disabled');
					me.$saveEve.text('文件上传...');
					 uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$hetongfbzhaopian[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('contractCopy', response.value.model.path );
							me.model.set('contractCopyFileName', response.value.model.FileName );
							me.$saveEve.removeAttr('disabled');
							me.$saveEve.text('保存');
						},
						'error':function(response){
							me.$saveEve.removeAttr('disabled');
							me.$saveEve.text('保存');
							me.$mentou.val('');
							return false;
						}
					})
				}else{
					me.$hetongfbzhaopian.val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
			});

			me.setState();
		},

		/**
		 *
		 * 初始化日期选择
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

			me.$actStartTime.datetimepicker({
				format: 'Y/m/d',
				onShow: function(){
					var maxDate = me.$actEndTime.val() ? me.$actEndTime.val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			});
			
			me.$actEndTime.datetimepicker({
				format: 'Y/m/d',
				onShow: function(){
					var minDate = me.$actStartTime.val() ? me.$actStartTime.val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			});
			me.$cardStartTime.datetimepicker( {
				format: 'Y/m/d',
				onShow: function(){
					var maxDate = me.$cardEndTime.val() ? me.$cardEndTime.val() : false;
					this.setOptions({
						maxDate: maxDate
					});
				},
				timepicker: false
			} );
			me.$cardEndTime.datetimepicker( {
				format: 'Y/m/d',
				onShow: function(){
					var minDate = me.$cardStartTime.val() ? me.$cardStartTime.val() : false;
					this.setOptions({
						minDate: minDate
					});
				},
				timepicker: false
			} );

			me.$yxEndInput.datetimepicker({
				format: 'Y/m/d',
				timepicker: false
			});

			me.$('#trainstarttime').datetimepicker({
				format:'Y/m/d',
				timepicker: false
			});

			me.$('#trainendtime').datetimepicker({
				format:'Y/m/d',
				timepicker:false
			})
		},

		//每次显示时清空一下缓存信息
		clearinfo: function(){
			var me = this;

			//
			me.$hetongnone.hide();
			me.$hetonginfo.hide();
			
			//
			me.$hetongfbnone.hide();
			me.$hetongfbinfo.hide();
		},

		show: function( id , status ){
			var me = this;

			me.clearinfo();
			
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

			var state = {
				a: false,
				b: false,
				c: false,
				d: false,
				e: false,
				f: false,
				g: false,
				h: false,
				i: false,
				j: false,
				k: false
			};

			function checkIsOk(){
				if( state.a && state.b && state.c && state.d && state.e && state.f && state.g && state.h && state.i && state.j && state.k ){
					me.getEnterprise( id );
				}
			};

			me.generateSelect( 'INDUSTRY', me.$aindustry , function(){ state.a = true; checkIsOk() });  		//行业信息
			me.generateSelect( 'ENT_LST_SOURCE', me.$asource , function(){ state.b = true; checkIsOk() });      //来源信息
			me.generateSelect( 'PROVINCE', me.$aprovince ,function(){ state.c = true; checkIsOk() });           //省和直辖市
			me.generateSelect( 'GROUP_TYPE', me.$agroup ,function(){ state.d = true; checkIsOk() } );			//团队类型
			me.generateSelect( 'KNOW_SOURCE', me.$aknow ,function(){ state.e = true; checkIsOk() });            //了解渠道
			me.generateSelect( 'REGISTER_MOTIVE', me.$aregister ,function(){ state.f = true; checkIsOk() });    //注册动机
			me.generateSelect( 'CAMPANY_SCALE', me.$acompany ,function(){ state.g = true; checkIsOk() } );      //公司规模
			me.generateSelect( 'SALE_TEAM_SCALE', me.$asales ,function(){ state.h = true; checkIsOk() });       //销售团队规模
			me.generateSelect( 'ENTERPRISE_LOG_TYPE', me.$sbLogType ,function(){ state.i = true; checkIsOk() }); //日志类型
			
			me.generateSelect( 'RETURN_VISIT_CHECK', me.$('#phonecallbackselect'), function(){ state.j = true; checkIsOk() });       //电话回访状态
			me.generateSelect( 'ENTERPRISE_CHEAT_TYPE', me.$('#cheatstatus'), function(){state.k = true; checkIsOk() });             //作弊情况
			util.getEnums('INFORMATION_CHECK_STATUS');
		},

		//重置select枚举值
		generateSelect: function( name , $select , callback ){
			var me = this;
			//var list = [{'name':'请选择','value':''}];
			var list = [{ 'name': '请选择', 'value': '' }];

			util.getEnums( name , function( data ){
				var items = data.model, options ='';
				items.forEach( function( item,index ){
					options += '<option value="' + item.value + '" title="' + item.text + '">' + item.text + '</option>';
				})
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
						me.attrs.runStatus = data.value.model.runStatus;
						var model = data.value.model;
						me.product.isInitialized = false;
						me.model.load( model );
						me.$name.val( model.enterpriseName );
						me.$account.val( model.enterpriseAccount );
						me.$address.val( model.address );
						me.$aindustry.val( model.industry );
						me.$asource.val( model.source );
						me.$aprovince.val( model.province );
						me.$agroup.val( model.groupType );
						me.$aknow.val( model.knowSource );
						me.$aregister.val( model.registerMotive );
						me.$acompany.val( model.companyScale );
						me.$asales.val( model.saleTeamScale );

						switch( model.activity ){
							case 1:
								model.activityStr = "无登录";
								break;
							case 2:
								model.activityStr = "有登录";
								break;
							case 3:
								model.activityStr = "有互动";
								break;
							case 4:
								model.activityStr = "活跃";
								break;
							default:
								model.activityStr = "无";
								break;
						}

						me.$('#presentOfficeEdition').val(model.presentOfficeEdition);
						me.$hasSales.val( model.isSaleTeam ? 'true' : 'false' );
						me.$isMettingSale.val( model.isWillPin ? 'true' : 'false' );
						me.$isFirstView.val( model.isFirstmettingSign ? 'true': 'false' );
						me.$isStranger.val( model.isStrangerVisits ? 'true': 'false' );
						me.$city.val( model.city );
						//me.$isFastSign.val( model.isFastSign ? 'true': 'false' );
						me.$dealDays.val( model.dealDays );
						//me.$hp.val( model.isAutoclave ? 'true' : 'false' );
						//me.$hpDays.val( model.autoclaveDays );
						me.$isIntro.val( model.isReferral ? 'true': 'false' );
						//me.$isPayed.val( model.isPayed ? 'true': 'false' );
						me.$cName.val( model.contactName );
						me.$cMobile.val( model.contactPhone );
						me.$cEmail.val( model.contactEmail );
						me.$cQQ.val( model.contactIM );
						me.$kcName.val( model.keyContactName );
						me.$kcMobile.val( model.keyContactPhone );
						me.$kcEmail.val( model.keyContactEmail );
						me.$remark.val( model.remark );
						me.$sProductName.val( model.productName );
						me.$spstatus.val( util.findEnumsText('ENT_LST_PSTS', model.runStatus) );
						me.$sAgentId.val( model.agentId );
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
						me.$sdXKET.val(endtimestr);

						//营销版到期时间
						if( model.paidVersionExpireTime ){

							if( new Date().getTime() > parseInt( model.paidVersionExpireTime ) ){
								me.$('#yxEndTime').val('');								
							}else{
								me.$('#yxEndTime').val( new Date( model.paidVersionExpireTime )._format( 'yyyy-MM-dd' ) );
							}

						}

						me.$sdPayImd.val( model.firstPayTime ? new Date( model.firstPayTime )._format( 'yyyy-MM-dd' ) : '未知' );
						me.$sdXKDC.val( model.accountTotalAmount );
						me.$sdXKDUC.val( model.accountUsedAmount + '/' + model.accountAvailableAmount || '' );

						me.$yingxiaoSum.val( model.marketingAccountAmount );
						me.$yingxiaoUsed.val( model.marketingAccountUsedAmount + '/' + model.marketingAccountAvailableAmount );

						me.$sdBCET.val( model.baichuanEndTime ? new Date( model.baichuanEndTime )._format( 'yyyy-MM-dd' ) : '永久' );
						me.$sdBCDC.val( model.baichuanTotalAmount || 0 );
						me.$sdBCDUC.val( model.baichuanUsedAmount || 0 );
						me.$sdSmC.val( model.smsTotalAmount );
						me.$sdSmUC.val( model.smsUsedAmount );
						me.$sdSC.val( model.storageTotalSpace );
						me.$sdSUC.val( model.storageUsedSpace );
						me.$sActivity.val( model.activityStr );
						me.$sdProductModule.val( util.findEnumsText('PRODUCT_MODULE', model.modules ) );
						me.$sdMarketingStatus.val( model.isMarketingStimulationEnabled ? '开通' : '停止' );
						me.$sdCustom.val( model.isLoginPagePersonalization ? '开通' : '停止' );
						me.$sdActiveTime.val( model.appStartTime ? new Date( model.appStartTime )._format( 'yyyy-MM-dd hh:mm' ) : '' );
						me.$sdCreater.val( model.createrName );
						me.$sdCreateTime.val( new Date( model.createTime )._format( 'yyyy-MM-dd hh:mm' ) );
						me.$sdContact.val( model.creatorContcat );
						me.$sdAgentName.val( model.creatorAgentName );
						me.$sdUpdater.val( model.updater );
						me.$sdUpdateTime.val( model.updateTime ? new Date( model.updateTime )._format( 'yyyy-MM-dd hh:mm' ) : '' );
						me.$sdUpdaterMobile.val( model.updaterContact );					
						me.$smsName.val( model.enterpriseShortName );
						me.$smsWh.val( model.smsSubPort );
						me.$cardType.val( carMap[model.businessCardUseType] );
						me.$cardCount.val( model.businessCardTotalAmount ? model.businessCardTotalAmount:0 );
						me.$cardUseNum.val( model.businessCardUsedAmount ? model.businessCardUsedAmount:0 );
						
						//提交人
						me.$creatorName.val( model.createrName );

						//开通时间
						me.$createTime.val( model.createTime ? new Date( model.createTime )._format('yyyy-MM-dd hh:mm') : '' );


						/**
						 *
						 * 审核成功的 不显示资料审核相关页面
						 */
						if( ( model.informationCheck == 2 )  ){

							me.$('#verificationupload').hide();
						}else if( me.attrs.isAgent == true ){

							me.$('#verificationupload').show();
						};

						/**
						 *
						 * 如果有合同显示合同信息
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
							
		    				//
						}else{
							me.$hetongnone.show();
							me.$hetonginfo.hide();
						}

						/**
						 *
						 * 如果有合同副本显示合同副本信息 否则隐藏合同副本
						 */
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
				me.$asource.removeAttr('disabled');
			}
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
				case 'product':
					console.log('product');
					this.showProductInfo();
					break;
				case 'verification':                    //资料审核
					this.showVerifiCation();
					break;
				case 'agent':
					console.log('agent');
					this.showAgentInfo();
					break;
				case 'trial':
					console.log('trial');
					this.showTrialInfo();
					break;
				case 'operations':
					console.log('operations');
					this.showOperations();
					break;
				case 'modules':
					console.log('modules');
					this.showModules();
					break;
				case 'functions':
					console.log('functions');
					this.showFunctions();
					break;
				case 'jcf':
					console.log('jcf');
					this.showJCF();
					break;
				case 'activeness':
					this.showActiveNess();
					break;
				case 'jcflog':
					console.log('jcflog');
					this.showJCFLog();
					break;
				case 'market':
					console.log('market');
					this.showMarketing();
					break;
				case 'custom':
					console.log('custom');
					this.showCustom();
					break;
				case 'log':
					console.log('log');
					this.showLog();
					break;
				case 'card':
					console.log('card');
					this.showCardList();
					break;
				case 'callback':
					this.showCallBack();  //电话回访
					break;
				case 'training':
					this.showTraining();  //显示培训详情
					break;
				default:
					break;
			}
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
				presentOfficeEdition:this.$('#presentOfficeEdition').val(),
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
				//isFastSign: this.$isFastSign.val(),
				dealDays: this.$dealDays.val(),
				//isAutoClave: this.$hp.val(),
				//autoclaveDays: this.$hpDays.val(),
				isReferral: this.$isIntro.val(),
				isPayed: this.$isPayed.val(),
				keyContactName: this.$kcName.val(),
				keyContactPhone: this.$kcMobile.val(),
				keyContactEmail: this.$kcEmail.val(),
				contactName: this.$cName.val(),
				contactPhone: this.$cMobile.val(),
				ContactEmail: this.$cEmail.val(),
				contactIm: this.$cQQ.val(),
				contractType: me.model.get('contractType'),
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

		/**
		 *
		 * 显示产品信息
		 */
		showProductInfo: function() {
			var me = this;
			/*
			if ( me.product.isInitialized ) {
				return;
			}
			*/
			if ( me.model.attrs.runStatus > 2 || me.attrs.isAgent == true) {
				$('#tbProduct').css( 'display', 'none' );
				return;
			}
			$('#tbProduct').css( 'display', 'block' );

			if( me.product.pagination ){

				me.product.pagination.setPage(0,true);
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

		/**
		 *
		 * 显示资料审核
		 */
		showVerifiCation: function(changeBool){
			var me = this;
			var changeBool = changeBool || false;
			//清空上传组件信息
			me.$yingyezhizhao.removeAttr('disabled');
			me.$yingyezhizhao[0].value = '';

			me.$mentou.removeAttr('disabled');
			me.$mentou[0].value = '';
			
			me.$hetongzhaopian.removeAttr('disabled');
			me.$hetongzhaopian[0].value = '';
			
			me.$hetongfbzhaopian.removeAttr('disabled');
			me.$hetongfbzhaopian[0].value = '';

			me.$setcompanyGatekeyword.removeAttr('disabled');
			me.$setcompanyGateRemark.removeAttr('disabled');

			//清空input信息
			me.model.set('companyGateKeyword','');
			me.model.set('companyGateRemark','');
			me.$verification.find('#shenheresult input').val('');
			me.$('.approvalinfo').val('');


			//先清空营业执照和门头信息的照片src
			me.$yingyezhizhaoinfo.attr('href','');
			me.$yingyezhizhaoinfo.find('img').attr('src','');
			me.$mentouinfo.attr('href','');
			me.$mentouinfo.find('img').attr('src','');

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
						me.$verification.find('#shenheresult input').val( util.findEnumsText( 'INFORMATION_CHECK_STATUS', data.value.model.informationCheck ) );
					
						//审核意见
						if( data.value.model && data.value.model.informationCheckRemark ){

							me.$('.approvalinfo').val( data.value.model.informationCheckRemark );
						}

						//操作人 操作时间
						me.model.set('informationCheckName', data.value.model.informationCheckAccount && data.value.model.informationCheckAccount['name']);
						me.model.set('informationCheckTimeStr', data.value.model.informationCheckTime && new Date( data.value.model.informationCheckTime )._format('yyyy-MM-dd hh:mm') );
					}
				}
			});
		},
		//资料审核成功
		veriOnEve: function(){
			var me = this;
			console.log('on');
			util.api({
				'url':'/enterprise/checkinformation',
				'data':{
					'enterpriseId': me.model.get('enterpriseId'),
					'isCheckPassed': 2,
					'informationCheckRemark': me.$('.approvalinfo').val()
				},
				'success': function( data ){
					console.warn( data );
					me.showVerifiCation(true);
				}
			})
		},
		//资料审核失败
		veriOffEve: function(){
			var me = this;
			console.log('off');
			util.api({
				'url':'/enterprise/checkinformation',
				'data':{
					'enterpriseId': me.model.get('enterpriseId'),
					'isCheckPassed': 3,
					'informationCheckRemark': me.$('.approvalinfo').val()
				},
				'success': function( data ){
					console.warn( data );
					me.showVerifiCation();
				}
			})
		},
		//
		agentSearchEve: function(){
			var me = this;

			me.agent.pagination && me.agent.pagination.setPage(0,true);
		},

		/**
		 *
		 * 电话回访
		 */
		showCallBack: function(){
			var me = this;
			
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
						
		 				me.$('#phonecallbackselect').val(data.value.model['returnVisitCheck']);
		 				me.$('#cheatstatus').val(data.value.model['cheatType']);
		 				me.$('#returnVisitCheckName').val( data.value.model['returnVisitCheckAccount'] && data.value.model['returnVisitCheckAccount']['name'] );
		 				me.$('#returnVisitCheckTimeStr').val( data.value.model['returnVisitCheckTime'] && new Date( data.value.model['returnVisitCheckTime'] )._format('yyyy-MM-dd hh:mm') );
		 				me.$('#returnVisitCheckStr').text( util.findEnumsText( 'RETURN_VISIT_CHECK',data.value.model['returnVisitCheck'] ) );
		 			}
		 		}
		 	})
			if( !me.attrs.isAgent ){
				me.loadCallBackList();
			}
		},

		loadCallBackList: function(){

			var me = this;
			me.$phonecallback.find('tbody').html('<tr><td colspan="4"><p class="info">加载中</p></td></tr>');

			util.api({
				'url': '/enterprise/getemployeessupervise',
				'data': {
					'enterpriseId': me.model.attrs['enterpriseId']
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						if( data.value.model.length > 0 ){
							data.value.model.forEach( function( item ){
								if(item.admin == '1'){
									item.adminStr = '是';
								}else{
									item.adminStr = '否';
								}
							});
							me.$phonecallback.find('tbody').html( me.tplCallBackList( {'content':data.value.model} ) );
						}else{
							me.$phonecallback.find('tbody').html('<tr><td colspan="4"><p class="info">暂无数据</p></td></tr>')
						}
					}
				}
			})
		},
		callbackOnEve: function(){
			var me = this;

			util.api({
				'url':'/enterprise/checkreturnvisit',
				'data':{
					'enterpriseId': me.model.attrs['enterpriseId'],
					'cheatType': me.$('#cheatstatus').val(),
					'returnVisitCheck': me.$('#phonecallbackselect').val()
				},
				'success': function( data ){
					if( data.success ){
						me.showCallBack();
					}
				}
			})
		},
		
		employeeDetailEve: function(e){
			var ea = $(e.currentTarget).attr('data-ea');
			var phone = $(e.currentTarget).attr('data-phone');
			this.trigger('employeeDetail',ea,phone);
		},

		/**
		 *
		 * 显示代理商信息
		 */
		showAgentInfo: function() {
			var me = this;
			
			/*
			if ( me.agent.isInitialized ) {
				return;
			}
			*/
			if ( me.model.attrs.runStatus > 2 || me.attrs.isAgent == true) {
				$('#tbAgent').css( 'display', 'none' );
				return;
			}
			$('#tbAgent').css( 'display', 'block' );
			me.$('#sbAgentId').val('');
			me.$('#sbAgentName').val('');


			if( me.agent.pagination ){
				me.agent.pagination.setPage(0,true);
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
							item.provinceName = util.findEnumsText( 'PROVINCE', item.province );
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
		 * 显示培训详情
		 */
		showTraining: function(){
			var me = this;


			me.$('#training input').removeAttr('disabled').val('');


			if( me.training.pagination ){
				me.training.pagination.setPage(0,true);
			}else{
				me.training.pagination = new Pagination({
					wrapper: me.$view.find('#training .pager'),
					pageSize: 10,
					pageNumber: 0
				});
				me.training.pagination.render();
				me.training.pagination.onChange = function(){
					me.loadTraining();
				};
				me.loadTraining();
			}
		},

		//添加培训详情
		addTrainingEve: function(){
			var me = this;
			
			me.training.addDialog.show( me.model.get('enterpriseId') );
		},

		//编辑培训详情
		editTrainingEve: function( e ){
			var me = this;

			var id = $(e.currentTarget).attr('data-id');

			me.training.editDialog.show( me.model.get('enterpriseId') , id );
		},

		searchTraining: function(){
			var me = this;
			me.training.pagination.setPage(0,true);
		},

		loadTraining: function(){
			var me = this;
			
			var starttime = '',
				endtime = '';

			if( me.$('#trainstarttime').val() ){
				starttime = new Date( me.$('#trainstarttime').val() ).getTime(); 
			}
			if( me.$('#trainendtime').val() ){
				endtime = new Date( me.$('#trainendtime').val() ).getTime();
			}
			
			util.api({
				'url':'/enterprise/querytraining',
				'data':{
					'pageIndex': me.training.pagination.attr['pageNumber'], 
					'pageSize': me.training.pagination.attr['pageSize'], 
					'trainingName': me.$('#trainname').val(), 
					'trainingStrartDate': starttime,
					'trainingEndDate': endtime,
					'trainer': me.$('#trainer').val(), 
					'trainingEffect': '',
					'trainingDescription:': me.$('#traindes').val(),
					'enterpriseId': me.model.get('enterpriseId')
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						me.training.pagination.setTotalSize( data.value.model.itemCount );
						me.traininglist.reload( data.value.model.content, function( item ){
							item.trainingDateStr = new Date( item.trainingDate )._format('yyyy-MM-dd');
						});
						if( data.value.model.content.length <= 0 ){
							me.$('#training tbody').html('<tr><td colspan="6"><p class="info">暂无数据</p></td></tr>')
						}
					}
				}
			})
			
		},

		/**
		 *
		 * 活跃度下载
		 */
		actDownloadEve: function( e ){
			var me = this;

			var startTime = '',
				endTime = '';

			if( me.$actStartTime.val() ){
				startTime = new Date( me.$actStartTime.val() ).getTime();
			}
			if( me.$actEndTime.val() ){
				endTime = new Date( me.$actEndTime.val() ).getTime();
			}
			var url = IBSS.API_PATH + '/query/act/detail/generate?' + $.param({'enterpriseId':me.model.attrs.enterpriseId,'timeStart':startTime,'timeEnd':endTime})
			window.open( url );
		},

		/**
		 *
		 * 使用情况
		 */
		showOperations: function() {
			var me = this;
			
			
			me._usestatus = 0;     //状态值
			
			//判断是否开通来显示增购部分是否可以显示
			if(me.attrs.runStatus==2){
				me.$('.approval-box').show();
			}else{
				me.$('.approval-box').hide();
			}

			/***
			 *
			 * 签约到期时间( 付费版 )   如果是 9999-12-31   则显示永久
			 * 营销版到期时间( 免费版 ) 如果是 小于当前日期 则不显示
			 * 
			 * 设置的时候
			 * 服务支持人员         可以设置 签约到期时间 也可以设置 营销版到期时间
			 * 代理商内部管理员   只可以设置 签约到期时间
			 */

			/*
			* 代理商用户
			* 根据是否是管理员 显示相关信息
			*/
			function checkIsAdmin(){

				if( me.attrs.isAgent == true ){
					
					for( var i = 0; i < IBSS.FUNCTIONS.length; i++ ){
						if( 'F009001' == IBSS.FUNCTIONS[i] ){
							return true;
						}
					}
					return false;
				}else{

					return false;
				}
			};

			if( checkIsAdmin() ){
				me.$('#tbOperation .isadmin').show();
				me.$('#tbOperation input').removeAttr('disabled');
			}


			/**
			 *
			 * 清空数据
			 */
			me.$('#tbOperation input').val('');

			if( me.operations.pagination ){

				me.operations.pagination.setPage(0,true);

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
			//代理商普通员工可操作增购扩容
			me.addBuyDataInit();
			
			
		},
		addBuyDataInit:function(){
			var me = this;
			
			me.$statusDisabled.removeAttr('disabled');
			me.$statusDisabled.val('');
			me.$stateCurrent.show();
			me.$('.useBusinessCard').removeAttr('disabled');
			
			me.$contractCopyHide.show();
			me.$contractCopyLink.hide();
			me.$cardPrice.hide();
			me.$contractCopyLink.attr('href', '');
			me.$imgContractCopy.attr('src', '');
			me.$contractHide.show();
			me.$contractLink.hide();
			me.$contractLink.attr('href', '');
			me.$imgContract.attr('src', '');
			me.model.set('discountAdd','');
			//me.model.set('isPaidAdd','0');
			me.model.set('useBusinessCardAdd','0');

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
			
			
			me.$tabsList.on('click',function(){
				var $this = $(this);
				var $t = $this.index();
				me.$('#tabs li').removeClass();
				me.$(this).addClass('current');
				me.$('.content-box .content-info').css('display','none');
				me.$('.content-box .content-info').eq($t).css('display','block');
			});
			//var me = this;
	
			
			//合同金额改变
			me.$contractprice.on('focusout',function(){
				me.model.set('cardPriceAdd',parseFloat(me.model.get('cardPriceAdd'))?parseFloat(me.model.get('cardPriceAdd')):'');
				me.getdiscount();
			});


			me.$deviceamount.on('focusout',function(){
				var buyCount = me.model.get('marketingAccountAmountAdd')?parseInt(me.model.get('marketingAccountAmountAdd')):0;
				me.model.set('accountTotalAmountAdd',parseInt(me.model.get('accountTotalAmountAdd'))?parseInt(me.model.get('accountTotalAmountAdd')):'');
				//if(buyCount>0){
					me.model.set('marketingAccountAmountAdd',parseInt(me.model.get('marketingAccountAmountAdd'))?parseInt(me.model.get('marketingAccountAmountAdd')):'');
					me.getFreeNum();
				//}
				
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
			
			me.$contract.on('change',function(){
				var fileExtension =me.$contract[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){
					me.$fnBuy.attr('disabled','disabled');
					me.$fnBuy.text('文件上传...');
				
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$contract[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							
							me.model.set('contractAdd', response.value.model.path );
							me.model.set('contractFileNameAdd', response.value.model.FileName );
							me.$contractLink.show();
							me.$contractHide.hide();
							me.$contractLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$imgContract.attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$fnBuy.removeAttr('disabled');
							me.$fnBuy.text('申请增购');
							
						},
						'error':function(response){
							me.$fnBuy.removeAttr('disabled');
							me.$fnBuy.text('申请增购');
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
					me.$fnBuy.attr('disabled','disabled');
					me.$fnBuy.text('文件上传...');
					
					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$contractCopy[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){	
							console.warn( response );
							me.model.set('contractCopyAdd', response.value.model.path );
							me.model.set('contractCopyFileNameAdd', response.value.model.FileName );
							me.$contractCopyLink.show();
							me.$contractCopyHide.hide();
							me.$contractCopyLink.attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$imgContractCopy.attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$fnBuy.removeAttr('disabled');
							me.$fnBuy.text('申请增购');
						},
						'error':function(response){
							me.$fnBuy.removeAttr('disabled');
							me.$fnBuy.text('申请增购');
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

			
		},
		//获取赠送数量
		getFreeNum: function(){
			var me = this;

			var buyCount = me.model.get('marketingAccountAmountAdd')?parseInt(me.model.get('marketingAccountAmountAdd')):0;
			var	sumNum =  me.$deviceamount.val()?parseInt(me.$deviceamount.val()):0;
			if(sumNum>0&&sumNum<buyCount){
				util.showToast('营销版数量不能大于销客终端数量');
				me.model.set('marketingAccountAmountAdd','');
				return false;
			}
 
			/*if(buyCount>0){
				me.model.set('isPaidAdd','1');
			}else{
				me.model.set('isPaidAdd','0');
			})*/
		},
		//获取折扣
		getdiscount: function(){
			var me = this;
			var contractStartTime = new Date( me.$startTimeHt.val() ).getTime()||'' ,
				contractEndTime = new Date( me.$endTimeHt.val() ).getTime()||'',
				contractPrice = me.model.get('contractPriceAdd'),
				accountAmount = accountAmount = me.model.get('marketingAccountAmountAdd')?parseInt(me.model.get('marketingAccountAmountAdd')):0,
				buyBusinessCard = me.model.get('useBusinessCardAdd');
			me.model.set('discountAdd', '0');
			if( contractStartTime && contractEndTime && buyBusinessCard =='1'){
				util.api({
					'url':'/enterprise/getbusinesscardprice',
					'data':{
						'contractStartTime':contractStartTime,
						'contractEndTime':contractEndTime
					},
					'success': function( data ){
						if( data.success ){
							
							me.model.set('cardPriceAdd', data.value.model);
							me.$cardPrice.show();
							console.log(data);
							return false;
						}
					}
				});
			}

			if( contractStartTime && contractEndTime && accountAmount && contractPrice && buyBusinessCard ){
				me.$fnBuy.attr('disabled','disabled');
				me.$fnBuy.text('折扣计算中...');
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
							me.model.set('discountAdd', (data.value.model.toFixed(1)));
							me.$fnBuy.removeAttr('disabled');
							me.$fnBuy.text('申请增购');
							
						}else{
							me.$fnBuy.removeAttr('disabled');
							me.$fnBuy.text('申请增购');
						}
					}
				})
			}
		},		
		
		//增购扩容
		fnBuyEve:function(){
			var  me = this;
			var objDate = {};
			
			var state = true;
			me.$('.check-empty').each(function(){
				var $this = $( this );
				var attr = $this.attr('ce-model');
				if( !me.model.get(attr) ){
					util.warnInput( $this );
					state = false;
				}else{
					util.unWarnInput( $this );
				}
			});
			if( !me.model.get('contractAdd')){
				util.warnInput( $('.contract') );
				state = false;
			}else{
				util.unWarnInput( $('.contract') );
			}

			if( !me.$startTimeHt.val() ){
				util.warnInput( $('.start-time-ht') );
				state = false;
			}else{
				util.unWarnInput( $('.start-time-ht') );
			}

			if( !me.$endTimeHt.val() ){
				util.warnInput( $('.end-time-ht') );
				state = false;
			}else{
				util.unWarnInput( $('.end-time-ht'));
			}
			if( !state ){
				util.showToast('填写信息不完整！');
				return false;
			}
			objDate['enterpriseId'] = me.model.attrs.enterpriseId;
			objDate['accountTotalAmount']=me.model.get('accountTotalAmountAdd');
			objDate['marketingAccountAmount']=me.model.get('marketingAccountAmountAdd');
			var tempNum = me.model.get('marketingAccountAmountAdd')?parseInt(me.model.get('marketingAccountAmountAdd')):0;
			if(tempNum == 0){
				me.model.set('discountAdd', '1');
				me.model.set('contractPriceAdd','0');
			}else{
				if( !me.model.get('invoiceTitleAdd')){
					util.warnInput( $('.invoiceTitleAdd') );
					state = false;
				}else{
					util.unWarnInput( $('.invoiceTitleAdd') );
				}
			}
			
			objDate['storageTotalSpace']=me.model.get('storageTotalSpaceAdd');
			objDate['contract']=me.model.get('contractAdd')||'';
			objDate['contractFileName']=me.model.get('contractFileNameAdd')||'';
			objDate['contractCopy']=me.model.get('contractCopyAdd')||'';
			objDate['contractCopyFileName']=me.model.get('contractCopyFileNameAdd')||'';
			objDate['contractPrice'] = me.model.get('contractPriceAdd')||'';
			objDate['discount'] = me.model.get('discountAdd')||'';
			objDate['invoiceTitle'] = me.model.get('invoiceTitleAdd')||'';
			objDate['useBusinessCard'] = me.model.get('useBusinessCardAdd')||'';
			
			if(objDate['marketingAccountAmount']){
				objDate['contractType'] = 1;
			}else{
				objDate['contractType'] = 0;
			}
			//objDate['contractPrice'] = me.model.get('contractPriceAdd')||'';
			objDate['contractStartTime'] = new Date( me.$startTimeHt.val() ).getTime()||'';
			objDate['contractEndTime'] = new Date( me.$endTimeHt.val() ).getTime();
			
			util.api({
                    'url':'/enterprise/increaseenterpriseaccount',
                    'data':objDate,
					'button': {
						'el': me.$fnBuy,
						'text':'提交中......'
					},
                    'success':function( data ){
                        if( data.success ){
                            util.showTip('申请提交成功！');
                            me.hide();
                        }
                    }
                })
			
		},
		//增购办公版
		fnBuyFreeEve:function(){
			var  me = this;
			var objDate = {};
		
			if(!parseInt(me.model.get('freeAccountTotalAmount')) || parseInt(me.model.get('freeAccountTotalAmount'))<1){
				util.showToast('增购办公版数量不能小于等于0！');
				return false;
			}
			if(!parseFloat(me.model.get('freeStorageTotalSpace')) || parseFloat(me.model.get('freeStorageTotalSpace'))<0){
				util.showToast('增购空间数量不能小于等于0！');
				return false;
			}
			objDate['enterpriseId'] = me.model.attrs.enterpriseId;
			objDate['accountTotalAmount'] = me.model.get('freeAccountTotalAmount');
			objDate['storageTotalSpace'] = me.model.get('freeStorageTotalSpace');
			
			util.api({
				'url': '/enterprise/increaseenterpriseaccountfree',
				'data': objDate,
				'button': {
					'el': me.$('.fn-buy-free'),
					'text':'提交中......'
				},
				'success': function( data ) {

					if ( data.success ) {
						util.showTip('申请提交成功！');
						me.hide();
					}
				}
			});
			
		},
		loadOperations: function() {
			var me = this;
			var data = {
				pageIndex: me.operations.pagination.attr['pageNumber'],
				pageSize: me.operations.pagination.attr['pageSize'],
				enterpriseId: me.model.attrs.enterpriseId
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
			/*
			if ( this.modules.isInitialized ) {
				return;
			}
			*/
			if ( this.model.attrs.runStatus == 2 ) {
				$( '#tbProductModule' ).css( 'display', 'block' );
				this.generateSelect( 'PRODUCT_MODULE', this.$sProductModule );
				this.modules.isInitialized = true;
			} else {
				$( '#tbProductModule' ).css( 'display', 'none' );
			}
		},

		/**
		 * 显示功能限制 并拉取相应的数据
		 *
		 *
		 */
		showFunctions: function() {
			var me = this;

			//设置默认设置
			me.$sELC.val(100);
			me.$sEFC.val(100);
			me.$sECC.val(100);
			me.$sEMWC.val(100);
			me.$sEAC.val(100);

			

			if( me.model.get('productFree') ){
				me.$sUFS.val('50');
			} else {
				me.$sUFS.val('100');
			}
			
			util.api({
				url: '/enterprise/queryenterpriseitemconfig',
				data: { enterpriseId: this.model.attrs.id },
				success: function( data ) {
					if ( data.success ) {
						var model = data.value.model;
						console.warn( model );
						me.$sdELC.val( model['Config.ExportAmountLocation']);
						me.$sdELUC.val( model['Used.ExportAmountLocation']);
						me.$sdEFC.val( model['Config.ExportAmountPlan']);         //导出日志次数
						me.$sdEFUC.val( model['Used.ExportAmountPlan']);          //导出日志已用次数
						me.$sdECC.val( model['Config.ExportAmountFeedWork']);     //导出指令次数
						me.$sdECUC.val( model['Used.ExportAmountFeedWork']);      //导出指令已用次数
						me.$sdEMWC.val( model['Config.ExportAmountLeaveApplication']);  //导出月度考勤次数
						me.$sdEMWUC.val( model['Used.ExportAmountLeaveApplication'] );  //导出月度考勤已用
						me.$sdEAC.val( model['Config.ExportAmountFeedApprove'] );       //导出审批汇总次数
						me.$sdEAUC.val( model['Used.ExportAmountFeedApprove'] );        //导出审批汇总已用
						me.$sdUFS.val( model['Config.UploadFileSizeLimit'] );           //上传文件大小限制
						console.warn( model['Config.isAllowDangerOperate'] );
						me.$sdActionDanger.val( model['Config.isAllowDangerOperate'] );  //是否允许危险操作
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
		
		/**
		 *
		 * 打开活跃度标签
		 */
		showActiveNess: function(){
			var me = this;

			me.$actStartTime.val('').removeAttr('disabled');
			me.$actEndTime.val('').removeAttr('disabled');
		},

		showJCFLog: function() {
			var me = this;

			me.$sbJCFCST.val('').removeAttr('disabled');
			me.$sbJCFCET.val('').removeAttr('disabled');

			if( me.jcflog.pagination ){

				me.jcflog.pagination.setPage(0,true);
			} else {
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
			}
		},
		showCardList: function() {
			var me = this;

			me.$cardStartTime.val('').removeAttr('disabled');
			me.$cardEndTime.val('').removeAttr('disabled');

			if( me.card.pagination ){

				me.card.pagination.setPage(0,true);
			} else {
				me.card.pagination = new Pagination({
					wrapper: me.$view.find('#cardList .pager'),
					pageSize: 10,
					pageNumber: 0
				});
				me.card.pagination.render();
				me.card.pagination.onChange = function() {
					me.loadCardList();
				};
				me.loadCardList();
			}
		},
		loadCardList: function() {
			var me = this,
				data = {
					pageIndex: me.card.pagination.attr['pageNumber'],
					pageSize: me.card.pagination.attr['pageSize'],
					enterpriseId: me.model.attrs.id
				};
			if ( me.$cardStartTime.val() ) {
				data.timeBegin = new Date( me.$cardStartTime.val() ).getTime();
			}
			if ( me.$cardEndTime.val() ) {
				data.timeEnd = new Date( me.$cardEndTime.val() ).getTime();
			}
			if(me.$searchCardType.val()){
				data.rechargeType = me.$searchCardType.val();
			}
			util.api({
				url: '/enterprise/querypagebusinesscardrecharge',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						me.card.pagination.setTotalSize( data.model.itemCount );
						if ( data.model.content.length > 0 ) {
							var content = me.dataFormat(data.model.content)
							me.$tbCardList.html( me.tpCardList( { content: content } ) );
						} else {
							me.$tbCardList.html( '<tr><td colspan="7"><p class="info">暂无数据</p></td></tr>' );
						}
					}
				}
			});
		},
		dataFormat:function(dataList){
			for(var i=0;i<dataList.length;i++){
				var item = dataList[i];
				item.expireTime = new Date( item.expireTime )._format( 'yyyy-MM-dd' );
				item.rechargeTime = new Date( item.rechargeTime )._format( 'yyyy-MM-dd' );
				item.rechargeType = buyMap[item.rechargeType];
			}
			return dataList;
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
							data.model.content.forEach(function(item){
								item.timeStr = new Date( item.rechargeTime )._format('yyyy-MM-dd hh:mm');
							});
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

		/***
		 *
		 * 显示日志信息
		 */
		showLog: function() {
			var me = this;

			me.$sbLogType.val('');
			me.$sbLogST.val('').removeAttr('disabled');
			me.$sbLogET.val('').removeAttr('disabled');

			if( me.log.pagination ){

				me.log.pagination.setPage(0,true);
			} else {
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
			}
		},
		loadLog: function() {

			console.log('log log log');
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

					console.warn( data );
					if ( data.success ) {
						me.log.pagination.setTotalSize( data.model.itemCount );
						if ( data.model.content.length > 0 ) {
							data.model.content.forEach( function( item ){
								item.createTimeStr = new Date( item.createTime )._format('yyyy-MM-dd hh:mm');
								item.typeStr = LOGTYPE[item.type];
							});
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

		/**
		 *@ 变更产品信息
		 */
		changeProductEve: function( e ) {
			var me = this,
				$target = $( e.currentTarget ),
				pid = $target.attr( 'data-id' ),
				data = {
					enterpriseId: this.model.attrs.enterpriseId,
					productId: pid
				};

			if( confirm('是否确认修改产品信息?') ){
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
			}
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

			if( confirm("是否确认修改代理商") ){
				util.api({
					url: '/enterprise/changevendor',
					data: data,
					success: function(data ) {
						if ( data.success ) {
							util.showTip( '修改成功' );
							var agent = me.findAgent( vid );
							me.$sAgentId.val( agent.id );me.$sAgentName.val( agent.name );}
					}
				});
			}
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
			//this.$sXKDC.val( '' );
			this.$sXKET.val( '' );
			this.$yxEndInput.val( '' );
			this.$sBCDC.val( '' );
			this.$sBCET.val( '' );
			this.$sSms.val( '' );
			this.$sStorage.val( '' );
			//this.$sDevice.val( '' );

			this.$sXKDC.val('');
			this.$sDevice.val('');
			this.$yingxiao.val('');	
			this.$yingxiaoAdd.val('');	
			
			this.$cardStartTime.val('');
			this.$cardEndTime.val('');

		},

		//修改使用情况信息
		changeStatistics: function() {
			var me = this;

			if( me.$sXKDC.val() && me.$sDevice.val() ){
				util.showToast('销客终端总量 和 销客终端扩容信息仅能填写一个!');
				return false;
			}
			
			if( me.$yingxiao.val() && me.$yingxiaoAdd.val() ){
				util.showToast('营销终端总量 和 营销终端扩容信息仅能填写一个');
				return false;
			}
			

			var data = {
				enterpriseId: me.model.attrs.id,
				accountAmount:  me.$sXKDC.val(),				//销客终端总量
				increaseAmount:	me.$sDevice.val(),				//销客终端扩容
				marketingAccountAmount: me.$yingxiao.val(),		//营销终端总量
				increaseMarketingAmount: me.$yingxiaoAdd.val(), //营销终端扩容
				baichuanAccountAmount: me.$sBCDC.val(), 		//百川终端总量
				rechargeSmsAmount: me.$sSms.val(),      		//短信充值条数
				expandStorageSpace: me.$sStorage.val() 			//存储扩容
			};
			if ( me.$sXKET.val() ) {
				data.productEndTime = new Date( me.$sXKET.val() ).getTime();
			}
			if ( me.$sBCET.val() ) {
				data.baichuanEndTime = new Date( me.$sBCET.val() ).getTime();
			}
			if ( me.$yxEndInput.val() ){
				data.marketingEndTime = new Date( me.$yxEndInput.val() ).getTime();
			}
			
			/**
			 *    第一层判断
			 *    me._usestatus
			 *    1   已确定不同步
			 *	
			 * 
			 *    如果设置了[营销版到期时间] 且 [签约到期时间] 未设置
			 *			如果[签约到期时间] 是9999-1-1
			 *	  			则提醒 是否 同步到签约到期时间 是 则 同步并提交  否 则 自行设置后提交
			 *	  		如果[签约到期时间] 已有值
			 *				则提醒 是否 同步到签约到期时间 是 则 同步并提交  否 则 直接提交
			 *
			 */
			 /*
			if( data.marketingEndTime && !data.productEndTime ){

				if( me.$sdXKET.val() == '永久' ){
					if( confirm('是否将签约到期时间和营销版到期时间设置成相同值?') ){
						
						data.productEndTime = data.marketingEndTime;
					}else{

						me._usestatus = 1;
						return false;
					}

				}else{
					if( confirm('是否将签约到期时间和营销版到期时间设置成相同值?') ){

						data.productEndTime = data.marketingEndTime;
					}
				}
			}

			if( data.marketingEndTime && data.productEndTime ){

				if( (data.marketingEndTime != data.productEndTime) && (me._usestatus != 1 )  ){
					if( confirm('是否将签约到期时间和营销版到期时间设置成相同值?') ){
						data.productEndTime = data.marketingEndTime;
					}
				}

			}
			*/
		 	/*
			 if( data.marketingEndTime ){
			 	data.productEndTime = data.marketingEndTime;
			 }
			*/


			/**
			 *
			 *   第二层判断
			 */
			if( data.marketingEndTime && ( me.$yingxiaoSum.val() == 0 ) && (data.marketingAccountAmount == '') && (data.increaseMarketingAmount == '') ){
				util.showTip('请填写营销版终端总量或营销版终端扩容个数');
				return false;
			}

			if( (data.marketingAccountAmount || data.increaseMarketingAmount) && ( me.$('#yxEndTime').val() == '' ) && (!data.marketingEndTime) ){
				util.showTip('请选择营销版到期时间');
				return false;
			}


			/**
			 *
			 * 营销版本 和 营销版增购 有值时 判断是否是永久试用版
			 * 如果是进行提示
			 *
			 */
			 
			function checkCancel( callback ){
				
				if( data.marketingAccountAmount || data.increaseMarketingAmount ){

					if( me.model.get('permanentTrial') == 1 ){
						if( confirm("是否取消永久试用的资格?") ){
							callback && callback();
						}else{
							return;
						}
					}else{
						callback && callback();
					}
				}else{ 

					callback && callback();
				}
			}
			
			
			//发送变更信息
			function sendChange(){
				me.$schangeStatis.attr('disabled','disabled').addClass('disabled').text('保存中');

				util.api({
					url: '/enterprise/changeconfig',
					data: data,
					success: function( data ) {
						if( data.success ) {
							util.showTip( '修改成功' );
						}
					},
					complete: function(){
						me.$schangeStatis.removeAttr('disabled').removeClass('disabled').text('保存');
						me.clearStatisticsForm();
						me.getEnterprise( me.model.attrs.enterpriseId ,function(){
							me.showOperations();
						});
					}
				});
			}

			checkCancel( sendChange );
		},
		changeStatisticsagent: function(){
			var me = this;

			if( me.$sXKDC.val() && me.$sDevice.val() ){
				util.showToast('销客终端总量 和 销客终端扩容信息仅能填写一个!');
				return false;
			}
			

			var data = {
				enterpriseId: me.model.attrs.id,
				accountAmount:  me.$sXKDC.val(),				//销客终端总量
				increaseAmount:	me.$sDevice.val(),				//销客终端扩容
				baichuanAccountAmount: me.$sBCDC.val(), 		//百川终端总量
				rechargeSmsAmount: me.$sSms.val(),      		//短信充值条数
				expandStorageSpace: me.$sStorage.val() 			//存储扩容
			};
			if ( me.$sXKET.val() ) {
				data.productEndTime = new Date( me.$sXKET.val() ).getTime();
			}
			if ( me.$sBCET.val() ) {
				data.baichuanEndTime = new Date( me.$sBCET.val() ).getTime();
			}
			
			//发送变更信息
			function sendChange(){
				me.$schangeStatis.attr('disabled','disabled').addClass('disabled').text('保存中');

				util.api({
					url: '/enterprise/changeconfig',
					data: data,
					success: function( data ) {
						if( data.success ) {
							util.showTip( '修改成功' );
						}
					},
					complete: function(){
						me.$schangeStatis.removeAttr('disabled').removeClass('disabled').text('保存');
						me.clearStatisticsForm();
						me.getEnterprise( me.model.attrs.enterpriseId ,function(){
							me.showOperations();
						});
					}
				});
			}
			sendChange();
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

			if( confirm('是否确定开通此企业!') ){
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
			}
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

			if( confirm('是否确定作废此企业!') ){
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
			}
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
			var me = this;
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
						me.$sdELC.val( me.$sELC.val() );
						me.$sdEFC.val( me.$sEFC.val() );
						me.$sdECC.val( me.$sECC.val() );
						me.$sdEMWC.val( me.$sEMWC.val() );
						me.$sdEAC.val( me.$sEAC.val() );
						me.$sdUFS.val( me.$sUFS.val() );
						me.$sdActionDanger.val( me.$sActionDanger.val() == '1' ? '是' : '否' );
						me.clearFunctions();
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
		searchCardList: function() {
			this.loadCardList();
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
		btnCardBuy: function() {
			var me = this,
				data = {
					year: me.$cardBuyYear.val( ),
					enterpriseId: me.model.attrs.id
				};
				var  oldModifyTime  = me.model.attrs.updateTime;
				data.oldModifyTime = oldModifyTime;
			util.api({
				url: '/enterprise/buybusinesscard',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '购买成功' );
						me.getEnterprise( me.model.attrs.enterpriseId );
						
					}
				}
			}) ;
		},
		btnCardSend: function() {
			var me = this,
				data = {
					cardCount: me.$cardBuyNum.val(),
					year: me.$cardBuyYear.val(),
					enterpriseId: me.model.attrs.id
				};
				if(!me.$cardBuyNum.val()){
					util.showToast( '请填写赠送张数！' );
					return false;
				}
				var  oldModifyTime  = me.model.attrs.updateTime;
				data.oldModifyTime = oldModifyTime;
			util.api({
				url: '/enterprise/giftbusinesscard',
				data: data,
				success: function( data ) {
					if ( data.success ) {
						util.showTip( '赠送成功' );
						me.getEnterprise( me.model.attrs.enterpriseId );
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
