/**
 * 组件：h5 图片模块
 * @html h5.html
 */
define(function(require, exports, module){
	
	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./getmoney.html');
	var AutoSelect = require('common/widget/autoselect/autoselect');
	var banks = require('./banks');
    
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

			me.$payDate.datetimepicker({'timepicker': false,'format':'Y/m/d'});

			me.$payStatusSelect.on('change',function(){
				var temp = me.$payStatusSelect.val();
				if(temp == 1){
					me.$stageBox.hide();
					me.model.set("currPayAmount",me.attrs.data.noChargeAmount);
				}else{
					me.$stageBox.show();
					me.model.set("currPayAmount",'');
					me.setSubers();
				}
			})

			me.autoSelect = new AutoSelect({data: banks});
			me.autoSelect.resetSelect(me.$('.bankno'));
			//计算子菜单金额；
			me.$view.on('focusout','.sub-app',function(){
				me.getAccount();
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
		},
		//数据渲染显示
		setValue:function(){
			var me = this;
			me.model.load( me.attrs.data )
			if(me.attrs.showType){
				me.model.set("currPayAmount",me.attrs.data.noChargeAmount);
			}
		},
		//渲染显示子产品：
		setSubers:function(){
			var me = this;
			var strDom = '';
			me.$appBox.empty();
			_.map( me.attrs.data.items , function( obj ){
				if(obj.noChargeAmount > 0){
					strDom +="<div class='field_row'> <div class='field_row_head'> </div> " +
					"<div class='field_wrapper'> <div class='field'> <label> " +
					"<span class='label'>"+obj.productName+"(未收"+obj.noChargeAmount+")</span> </label> " +
					"<input  type='text' data-productId='"+obj.productId+"' class='sub-app' /> </div> </div> </div>"
				}
			});
			me.$appBox.html(strDom);
		},
		//计算分期时本次付款金额
		getAccount:function(){
			var me = this;
			var temp = me.$payStatusSelect.val();

			if(temp == 2){
				var sum = 0;
				me.$view.find('.sub-app').each(function(){
					if($(this).val()){
						sum +=parseInt($(this).val());
					}
				});
				me.model.set("currPayAmount",sum);
			}
		},
		//检测是否可编辑
		checkEdit:function(editFlag){
			var me = this;
			if(editFlag){
				me.$('.edit-flag').removeAttr('disabled');
				me.$('.check-edit').show();
			}else{
				me.$('.edit-flag').attr('disabled','disabled')
				me.$('.check-edit').hide();
			}
			
		},
		//对外获取文本框值
		getValue:function(){
			var me = this;
			var objData = {'order':{}};
			var tempArry = [];
			if(me.checkVaild()){
				var temp = me.$payStatusSelect.val();
				if(temp == 2){
					var sum = 0;
					me.$view.find('.sub-app').each(function(){
						var temp = {};
						temp.productId = $(this).attrs('data-productId');
						temp.currPayAmount = $(this).val() ? $(this).val():0;
						tempArry.push({'subOrder':temp});
					});
				}else{
					_.map( me.attrs.data.items , function( obj ){
						if(obj.noChargeAmount > 0){
							var temp = {};
							temp.productId = obj.productId;
							temp.currPayAmount = obj.noChargeAmount;
							tempArry.push({'subOrder':temp});
						}
					});
				}
				objData.order['payStatus'] = me.$('.payStatus-select').val();
				objData.order['payDate'] = new Date( me.$payDate.val() ).getTime();
				objData.order['currPayAmount'] = me.model.get('currPayAmount');
				objData.order['receiptsAccount'] = me.model.get('receiptsAccount');
				objData.order['payerName'] = me.model.get('payerName');
				objData.subOrders = tempArry;
				return objData;
			}
			return false;
		},
		//检测数据有效和必填项
		checkVaild:function(){
			var me = this;
			//检测必填项
			var state = true; 
			me.$('.required-basic').each(function(){
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
				return  false;
			}
			return  true;
		}
		
	});

	module.exports = AddEnt;

});