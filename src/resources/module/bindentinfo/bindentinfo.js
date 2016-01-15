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
			'.money-date':'moneyDate'
			
		},

		events:{
			
		},

		//获取枚举值
		getEnums: function(){
			var me = this;

			var state = {
				'i': false,
				'e': false
			};

			//检查是否获取完毕
			function check(){
				if( state.i && state.e  ){
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
