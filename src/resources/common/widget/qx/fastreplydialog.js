define(function(require, exports, module){
	
	var Dialog = require('../dialog/dialog');
	var fastReplyTpl = require('./fastreplydialog.html');

	/*
	 * 快捷回复
	 */
	var FastReplyDialog = MClass( Dialog ).include({

		content:fastReplyTpl,
		
		defaultAttr:{
			'title':'添加快捷回复',
			'width':500
		},

		events:{
			'click .content-del': 'deleteMsg',
			'click .content-edit': 'editMsg',
			'click .content-save': 'saveMsg',
			'click .content-cancel': 'cancelMsg',
			'click .dialog-cancel': 'hide',
			'click .dialog-save': 'addMsg'
		},

		init: function(){
			FastReplyDialog.__super__.init.apply(this,arguments);
			this.initDom();
			this.getList();
		},

		initDom: function(){
			var me = this;

			me.$content = me.$view.find('.dialog-content');
			me.$textarea = me.$view.find('#dialog-textarea');
		},

		/*
		 *@ 添加快捷回复
		 */
		addMsg: function(){
			var me = this;

			var text = me.$textarea.val();

			if( text.length <= 0){
				alert('内容不能为空');
			} else {
				util.api({
					'type': 'post',
					'url': '/quickmessage/add',
					'data': {
						'content':text
					},
					'success': function( data ){
						if(data.success){
							util.showToast('添加成功');
							me.$textarea.val('');
							me.getList();
						}
					}
				})
			}
		},

		/*
		 *@ 删除快捷回复
		 */
		deleteMsg: function(e){
			var me = this;

			var id = $(e.target).parents('section').attr('data-id');

			util.api({
				'type': 'post',
				'url': '/quickmessage/delete',
				'data':{
					'id':id,
				},
				'success': function(info){
					if(info.success){
						me.getList();
					}
				}
			})
		},

		// 保存快捷回复
		saveMsg: function(e){
			var me = this;

			var $section = $(e.target).parents('section');
			var id = $section.attr('data-id'),
				content = $section.find('input').val();
			if( content.length < 0){
				alert("编辑的内容不能为空");
			}else{
				util.api({
					'type': 'post',
					'url': '/quickmessage/update',
					'data':{
						'id':id,
						'content': content
					},
					'success': function(info){
						if(info.success){
							util.showTip('保存成功');
							me.getList();
						}
					}
				})
			}
		},

		//编辑信息
		editMsg: function(e){
			var $section = $(e.target).parents('section');
			$section.addClass('active').siblings().removeClass('active');
		},

		//取消编辑
		cancelMsg: function(e){
			var $section = $(e.target).parents('section');
			$section.removeClass('active');
		},

		/*
		 *@ 快捷回复排序
		 */
		sortMsg: function(){
			var me = this;

			util.api({
				'type': 'post',
				'url': '/quickmessage/sort',
				'data':{
					'id':'',
					'newOrderCode':''
				},
				'success': function(data){
					
				}
			})
		},

		/*
		 *@ 获取所有信息
		 *  并刷新列表
		 */
		getList: function(){
			var me = this;

			util.api({
				'type': 'post',
				'url': '/quickmessage/getall',
				'success': function( data ){
					var listStr = '';

					_.each(data.value.model,function(val){
						var pStr= "<section data-id="+val['id']+" data-order="+ val['orderCode'] +">"
								 +  "<p class='section-show'>" 
								 +      "<span class='content-info'>" + val.content + "</span>"
								 + 		"<span class='content-edit'>编辑</span>"
								 + 		"<span class='content-del'>删除</span>"
								 +  "</p>"
								 +  "<p class='section-edit'>"
								 +		"<input type='text' value='"+val.content+"' maxlength='30'>"
								 +  	"<span class='content-cancel'>取消</span>"
								 +  	"<span class='content-save'>保存</span>" 		
								 +  "</p>"
								 + "</section>"
						listStr = listStr + pStr;
					})
					me.$content.html(listStr);
					me.resize();
				}
			})
		},
		show: function(){
			FastReplyDialog.__super__.show.apply(this,arguments);
			this.getList();
		}
	})

	module.exports = FastReplyDialog;
	
});

