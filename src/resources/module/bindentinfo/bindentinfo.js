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

	var contentStr = require('./bindentinfo.html');

    /////////////////
    //
    //  备案企业与自注册企业对比
    /////////////////
	var BindEntInfo = MClass( Slider ).include({

		view: contentStr,

		defaultAttr: {
			'title': '备案企业与自注册企业详情'
			
		},

		elements: {
			'.e-industry': 'industry',
			'.e-source': 'source',
			'.e-province': 'province',
	
			'.status-disabled': 'statusDisabled',
			'.start-time-ht':'startTimeHt',
			'.end-time-ht':'endTimeHt',
			'.visite-time':  'visiteTime',
			'.startTime': 'startTime',
            '.endTime': 'endTime',
			'.deviceamount': 'deviceamount',          //终端数量
			'.contractprice': 'contractprice',       //合同金额
			'.contract': 'contract',
			'.contractCopy': 'contractCopy',
			'.mtzhizhao': 'mtzhizhao',
			'.yyzhizhao': 'yyzhizhao',
			'.look-contractCopy':'lookContractCopy',
			'.contractCopy-link':'contractCopyLink',
			'.img-contractCopy' :'imgContractCopy',
			'.contractCopy-hide' :'contractCopyHide',
			'.look-contract':'lookContract',
			'.contract-hide':'contractHide',
			'.action-add': 'actionSave',
			'.money-date':'moneyDate',
			'.firm-status':  'firmStatus',
			'.personCount':'personCount',
			'.checkedDisable':'checkedDisable'
			
		},

		events:{
			'click .action-add': 'saveEntEve',
			'click .action-cancel':'cancelEve'
		},

		//获取枚举值
		getEnums: function(){
			var me = this;

			var state = {
				'i': false,
				'e': false,
				's': false,
				'm':false
			};

			//检查是否获取完毕
			function check(){
				if( state.i && state.e && state.s  ){
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

			//获取行业列表
			generate('INDUSTRY', me.$industry , 'i');

			//获取来源
			generate('ENT_LST_SOURCE', me.$source , 'e');
			//获取星级状态
			generate('LEADS_STATUS', me.$firmStatus , 's');
			//获取服务费   
			generate('OPEN_VERSION_NUM', me.$personCount , 'm');

		},
		getInfo:function(){
			var me = this;
			
			util.api({
				'url': '/enterprisefiling/getfiling',
				'data': {
					'enterpriseFilingId': me.attrs['entId']
				},
				'success': function( data ){
					console.warn(data);
					if( data.success ){

						me.model.load( data.value.model );
						me.model.set('region',data.value.model.regionName);
						me.model.set('creatorName', data.value.model.creator.name);
                        me.model.set('creatorUserName', data.value.model.creator.username);
						me.$firmStatus.val(data.value.model.status);
						me.model.set('kpPhone', data.value.model.representative_phone);
						var visitTime = data.value.model.visitTime?new Date( data.value.model.visitTime )._format('yyyy/MM/dd'):'';
						me.model.set('visitTime',visitTime)
					}
				}
			})
			
		},
		saveEntEve:function(){
			var  me = this;
			var entObj = {};
			entObj['enterpriseFilingId'] = me.attrs['entId'];
			entObj['enterpriseAccount'] = me.attrs['entAccount'];
			entObj['contract']=me.model.get('contract');
			entObj['contractFileName']=me.model.get('contractFileName');
			entObj['contractCopy']=me.model.get('contractCopy');
			entObj['contractCopyFileName']=me.model.get('contractCopyFileName');
			entObj['companyGatePicture']=me.model.get('companyGatePicture');
			entObj['companyGatePictureFileName']=me.model.get('companyGatePictureFileName');
			entObj['businessLicense']=me.model.get('businessLicense');
			entObj['businessLicenseFileName']=me.model.get('businessLicenseFileName');
			entObj['contractStartTime'] = me.$('.startTime').val() ? new Date( me.$('.startTime').val() ).getTime() :'';
			entObj['contractEndTime']= me.$('.endTime').val() ? new Date( me.$('.endTime').val() ).getTime() :'';
			entObj['presentOfficeEdition']=0;
			entObj['companyGateKeyword']=me.model.get('companyGateKeyword');
			entObj['companyGateRemark']=me.model.get('companyGateRemark');
			entObj['personCount']=me.model.get('personCount');
			entObj['serviceChargeAmount']=me.model.get('serviceChargeAmount');
			entObj['invoiceHead']=me.model.get('invoiceHead');
			entObj['payerName']=me.model.get('payerName');
			entObj['payDate']= me.$('.money-date').val() ? new Date( me.$('.money-date').val() ).getTime() :'';
			
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
			if( !entObj['payDate'] ){
				util.warnInput( $('.money-date') );
				state = false;
			}else{
				util.unWarnInput( $('.money-date') );
			}

			if( !entObj['contractStartTime'] ){
				util.warnInput( $('.startTime') );
				state = false;
			}else{
				util.unWarnInput( $('.startTime') );
			}

			if( !entObj['contractEndTime'] ){
				util.warnInput( $('.endTime') );
				state = false;
			}else{
				util.unWarnInput( $('.endTime'));
			}

			if( state == false ){
				util.showToast('信息填写不完整');
				return ;
			}
			
			
			util.api({
					'url': '/enterprisefiling/bindingenterprisefiling',
					'data': entObj,
					'button': {
						'el': me.$('.action-add'),
						'text':'提交中......'
					},
					'success': function( data ){
						if( data.success ){
							util.showTip('关联自注册企业成功！')
						 
							location.hash = '#agentsupport/entprisefiling'
						}
					}
				})
		},
		cancelEve:function(){
			location.hash = '#agentsupport/entprisefiling'
		},
		init: function(){
			BindEntInfo.__super__.init.apply( this,arguments );
			var me = this;
			
			//选择区域模块

            me.areaTree = new AreaTree();
            me.areaTree.on('selectarea',function( treenodes ){
                
                me.$filingRegion.val( treenodes[0]['name'] ).attr('data-code', treenodes[0]['code'] );
            });
			
			me.$startTime.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var maxDate = me.$endTime.val() ? me.$endTime.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            } );
            me.$endTime.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var minDate = me.$startTime.val() ? me.$startTime.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            } );
			me.$moneyDate.datetimepicker({'timepicker': false,'format':'Y/m/d'});
			

			 //初始化日期选择
            me.$visiteTime.datetimepicker({
                format: 'Y/m/d',
                timepicker: true
            });
			
			//服务费修改
			me.$personCount.on('change',function(){
				var serviceType = me.$personCount.val();
				
				switch(serviceType)
				{
					case '1':
					  me.model.set('serviceChargeAmount',2000);
					  break;
					case '2':
					  me.model.set('serviceChargeAmount',3000);
					  break;
					case '3':
					  me.model.set('serviceChargeAmount',6000);
					  break;
					case '4':
					  me.model.set('serviceChargeAmount',8000);
					  break;
					default:
					  me.model.set('serviceChargeAmount','');
				}
			});
			
			
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
							
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');

						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');

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
				
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							me.$actionResend.removeAttr('disabled');
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
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
							
						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');
	
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

							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');

						},
						'error':function(response){
							me.$actionSave.removeAttr('disabled');
							me.$actionSave.text('保存');

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

			me.getEnums();
			me.getInfo();
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

		
		//显示
		render: function(){
			var me = this;
			me.attrs['wrapper'].html( me.$view );

		},

		//重新发送
		hide: function(){
			var me = this;
			me.model.clear();
			me.$yyzhizhao.val('');
			me.$mtzhizhao.val('');
			me.$contract.val('');
			me.$contractCopy.val('');
			
            me.$('.state').hide();
		
			BindEntInfo.__super__.hide.apply( this,arguments );
		}
	});
        
	module.exports = BindEntInfo;
});
