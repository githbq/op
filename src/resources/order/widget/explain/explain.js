/**
 * 组件：h5 图片模块
 * @html h5.html
 */
define(function(require, exports, module){

	var contentStr = require('./explain.html');
		
	/* new 对象是传递的参数;
    this.data = opts.data || {}; //基本信息数据
    this.editFlag = opts.editFlag || false; //是否可编辑参数
	this.type = opts.type || 'common'; // common-普通审批，special-特殊审批*/;
    
	var View = MClass( M.Center ).include({
		view: contentStr,
		events:{

		},
		elements: {

		},
		init: function(){
			View.__super__.init.apply( this,arguments );
			var me = this;

			//显示基本信息模块
			me.render();

		},

		//显示
		render: function(){
			var me = this;
			me.attrs['wrapper'].html( me.$view );
			me.checkEdit(me.attrs.editFlag)
			if( (me.attrs.type%2) == 1 ){
				me.$('.approval-box').hide();
				me.model.set('approved_url','');
			}else{
				me.$('.approval-box').show();
				me.setValue();
			}
		},
		//数据渲染显示
		setValue:function(){
			var me = this;
			var approvedUrl = me.attrs.data.order ? me.attrs.data.order.approvedUrl:'';
			me.model.set('approvedUrl',approvedUrl);
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

			if(me.checkVaild()){
				return me.model.all()||{};
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
			return true;
		}
		
	});

	module.exports = View;

});