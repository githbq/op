/**
 * 组件：h5 图片模块
 * @html h5.html
 */
define(function(require, exports, module){
	
	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./invoicelist.html');
	var uploader = require('common/widget/upload').uploader;
	

	var AddEnt = MClass( M.Center ).include({
		view: contentStr,
		/*
		defaultAttr:{
			'title': '添加企业',
			'width': 680
		},
		*/
		events:{

		},
		elements: {
			'.payStatus-select':'payStatusSelect',
			'.stage-box':'stageBox',
			'.app-box':'appBox',
			'.sub-app':'subApp',
			'.payDate':'payDate'
		},
		init: function(){
			AddEnt.__super__.init.apply( this,arguments );
			var me = this;
			
			me.$view.on('click input:radio[name="invoicetype"]', function(){
				var val = me.$('input:radio[name="invoicetype"]:checked').val();
				if(val == 1){
					me.$('.nocheck').hide();
					me.$('.hascheck').show();
					me.model.set('redInvoiceInfo','');
					me.model.set('invoiceCopy','');
				}else if(val == 0){
					me.$('.hascheck').hide()
					me.$('.nocheck').show();
					me.model.set('invoiceOriginal','');
					me.model.set('rejectProof','')
				}
			});
			
			
			me.$('.invoiceOriginal').on('change',function(){
				var fileExtension =me.$('.invoiceOriginal')[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){

					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$('.invoiceOriginal')[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('invoiceOriginal', response.value.model.path );
							me.model.set('invoiceOriginalFileName', response.value.model.FileName );
							
							me.$('.invoiceOriginal-box').show();
							me.$('.invoiceOriginal-link').attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$('.invoiceOriginal-img').attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
			
						},
						'error':function(response){
						
							me.$('.invoiceOriginal').val('');
							return false;
						}
					})
				}else{
					me.$('.invoiceOriginal').val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			me.$('.rejectProof').on('change',function(){
				var fileExtension =me.$('.rejectProof')[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){

					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$('.rejectProof')[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('rejectProof', response.value.model.path );
							me.model.set('rejectProofFileName', response.value.model.FileName );
							
							me.$('.rejectProof-box').show();
							me.$('.rejectProof-link').attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$('.rejectProof-img').attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
			
						},
						'error':function(response){
						
							me.$('.rejectProof').val('');
							return false;
						}
					})
				}else{
					me.$('.rejectProof').val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			me.$('.redInvoiceInfo').on('change',function(){
				var fileExtension =me.$('.redInvoiceInfo')[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){

					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$('.redInvoiceInfo')[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('redInvoiceInfo', response.value.model.path );
							me.model.set('redInvoiceInfoFileName', response.value.model.FileName );
							
							me.$('.redInvoiceInfo-box').show();
							me.$('.redInvoiceInfo-link').attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$('.redInvoiceInfo-img').attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
			
						},
						'error':function(response){
						
							me.$('.redInvoiceInfo').val('');
							return false;
						}
					})
				}else{
					me.$('.redInvoiceInfo').val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});
			me.$('.invoiceCopy').on('change',function(){
				var fileExtension =me.$('.invoiceCopy')[0].files[0].name.split('.').pop().toLowerCase();
				if(fileExtension=='jpg'||fileExtension=='gif'||fileExtension=='png'||fileExtension=='jpeg'){

					uploader.send({
						'url': '/op/api/file/uploadsinglefileandcheck',
						'files': me.$('.invoiceCopy')[0].files,
						'options':{
							'limittype':'IMAGE'
						},
						'success': function( response ){
							console.warn( response );
							me.model.set('invoiceCopy', response.value.model.path );
							me.model.set('invoiceCopyFileName', response.value.model.FileName );
							
							me.$('.invoiceCopy-box').show();
							me.$('.invoiceCopy-link').attr('href', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
							me.$('.invoiceCopy-img').attr('src', '/op/api/file/previewimage' + '?filePath=' + response.value.model.path);
			
						},
						'error':function(response){
						
							me.$('.invoiceCopy').val('');
							return false;
						}
					})
				}else{
					me.$('.invoiceCopy').val('');
					util.showToast('请上传图片格式不正确(.jpg,.png,.gif)！');
					return false;
				}
				
			});


			//显示基本信息模块
			me.render();
		},

		//显示
		render: function(){
			var me = this;
			me.attrs['wrapper'].html( me.$view );
			me.checkEdit(me.attrs.editFlag)
			me.setValue();
			
			if(me.attrs.filedData){
				me.setFiledData();
			}else{
				me.$('.hashide').hide();
			}
			me.$('.hascheck').hide();
			me.$('.nocheck').hide();
			if( me.attrs.dataObj.invoiceType==1){
				me.$('.hascheck').show();
			}else if(me.attrs.dataObj.invoiceType==2){
				me.$('.nocheck').show();
			}
			
		},
		setFiledData:function(){
			var me = this;
			if( me.attrs.filedData.invoiceOriginal ){
				
				me.$('.invoiceOriginal-box').show();
				
				me.$('.invoiceOriginal-link').attr('href', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
				me.$('.invoiceOriginal-img').attr('src', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
			}else{
				me.$('.invoiceOriginal-box').hide();
				me.$('.invoiceOriginal-link').attr('href', '');
				me.$('.invoiceOriginal-img').attr('src', '');
			}
			//显示合同副本
			if( me.attrs.filedData.rejectProof ){
				me.$('.rejectProof-box').show();
				
				me.$('.rejectProof-link').attr('href', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
				me.$('.rejectProof-img').attr('src', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
			}else{
				me.$('.rejectProof-box').hide();
				me.$('.rejectProof-link').attr('href', '');
				me.$('.rejectProof-img').attr('src', '');
			}
			//显示合同副本
			if( me.attrs.filedData.redInvoiceInfo ){
				me.$('.redInvoiceInfo-box').show();
				
				me.$('.redInvoiceInfo-link').attr('href', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
				me.$('.redInvoiceInfo-img').attr('src', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
			}else{
				me.$('.redInvoiceInfo-box').hide();
				me.$('.redInvoiceInfo-link').attr('href', '');
				me.$('.redInvoiceInfo-img').attr('src', '');
			}
			//显示合同副本
			if( me.attrs.filedData.invoiceCopy ){
				me.$('.invoiceCopy-box').show();
				
				me.$('.invoiceCopy-link').attr('href', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
				me.$('.invoiceCopy-img').attr('src', '/op/api/file/previewimage' + '?filePath=' + contractFilePath);
			}else{
				me.$('.invoiceCopy-box').hide();
				me.$('.invoiceCopy-link').attr('href', '');
				me.$('.invoiceCopy-img').attr('src', '');
			}
		},
		setValue:function(){
			var me = this;
			me.model.load( me.attrs.dataObj );
			me.model.set('invoiceId', me.attrs.dataObj.id );
			if(me.attrs.dataObj.invoiceType==1){
				me.$('.check-box').hide();
				me.$('.invoiceType-common').show();
				me.$('.invoiceType-special').hide();
			}else{
				me.$('.check-box').show();
				me.$('.invoiceType-common').hide();
				me.$('.invoiceType-special').show();
			}
		},
		//检测是否可编辑
		checkEdit:function(editFlag){
			var me = this;
			if( editFlag ){
				me.$('.edit-flag').removeAttr('disabled');
				me.$('.check-edit').show();
			}else{
				me.$('.edit-flag').attr('disabled','disabled')
				me.$('.check-edit').hide();
			}
			
		},
		getValue:function(){
			var me = this;
			if(me.checkVaild()){
				return me.model.all();

			}
			return false;
		
		},
		
		//检测数据有效和必填项
		checkVaild:function(){
			var me = this;
			var state = true;
			//检测必填项
			var val = me.$('input:radio[name="invoicetype"]:checked').val();
			if( me.attrs.dataObj.invoiceType ==1 ){
				
				if( !me.model.get('invoiceOriginal') ){
					util.warnInput( $('.invoiceOriginal') );
					state = false;
				}else{
					util.unWarnInput( $('.minvoiceOriginal') );
				}
				if( !me.model.get('rejectProof') ){
					util.warnInput( $('.rejectProof') );
					state = false;
				}else{
					util.unWarnInput( $('.rejectProof') );
				}
			}else if( me.attrs.dataObj.invoiceType ==2 && val ==1 ){
				if( !me.model.get('redInvoiceInfo') ){
					util.warnInput( $('.redInvoiceInfo') );
					state = false;
				}else{
					util.unWarnInput( $('.redInvoiceInfo') );
				}
				if( !me.model.get('invoiceCopy') ){
					util.warnInput( $('.invoiceCopy') );
					state = false;
				}else{
					util.unWarnInput( $('.invoiceCopy') );
				}
				
			}else if( me.attrs.dataObj.invoiceType ==2 && val ==0 ){
				if( !me.model.get('invoiceOriginal') ){
					util.warnInput( $('.invoiceOriginal') );
					state = false;
				}else{
					util.unWarnInput( $('.minvoiceOriginal') );
				}
				if( !me.model.get('rejectProof') ){
					util.warnInput( $('.rejectProof') );
					state = false;
				}else{
					util.unWarnInput( $('.rejectProof') );
				}
			}
			if( state == false ){
				util.showToast('信息填写不完整');
				return  false;
			}
			return  {};
		}
		
	});

	module.exports = AddEnt;

});