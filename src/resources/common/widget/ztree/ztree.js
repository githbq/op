/**
 * @file common/widget/ztree/ztree.js
 * @desc 渲染树形列表
 * 依赖jquery ztree插件
 */
define(function(require, exports, module) {
	
	// 引入ztree插件
	var zTreeFn = require('./ztree.origin.js');

	// 重新封装 供外部调用
	var ZTree = Widget.extend({
		
		tagName: 'ul',
		
		className: 'm-ztree',
		
		id: 'ztree',
		
		attrs: {
			elem: null,
			showCheck: false,         //是否显示勾选框
			showEditeBtn: true,       //是否显示编辑[新增 编辑 删除]
			data: []
		},
		
		events: {
			'click .edite': '_editeHandle',
			'dblclick .curSelectedNode':'_showNodeHandle',
			'mousedown .rename-inp': '_mouseHandle',
			'keypress .rename-inp': '_enterHandle',
			'click .cancel-nm': 'cancelRename',
			'click .save-nm': '_saveNm'
		},
		//attrsList:{},

		/**
		 * 初始化
		 *
		 *	{
	     *    
		 *	}
		 *
		 *
		 */
		setup: function() {
			var attrs = this.attrs;
			//attrsList = this.attrs;

			//默认setting 配置
			this.setting = {
				data: {
					simpleData: {
						enable: true,
						pIdKey: 'parentId',
						rootPId: 0
					}
				},
				
				check: {
					chkStyle: 'checkbox',
					enable: false,
					radioType: "all"
				},
				
				edit: {
				   enable: true,
				   showRenameBtn: false,
				   showRemoveBtn: false,
				   editNameSelectAll: true
				},
				
				/*
				 * 显示配置
				 */
				view: {
					showIcon: false,
					showLine: false,
					selectedMulti: false,
					dblClickExpand: false
				},
				
				callback: {
					beforeDrag: function() {
						return false;
					},
					onClick: function(e, treeId, treeNode) {
						var treeObj = zTreeFn.getZTreeObj(treeId),
							cls = $(e.target)[0].className,
							clses = 'rename-inp|edite-add|edite-rm|edite-del';
						if (clses.indexOf(cls) == -1) {
							treeObj.expandNode(treeNode);
						}
					}
				}		
			};
			this.setting.attrs = this.attrs;
			if(attrs.addDiyDom=='addDiyDom'){
				if (attrs.showEditeBtn) {
					this.setting.view.addHoverDom = this._addHoverDomHide;
					this.setting.view.removeHoverDom = this._removeHoverDom;
				} else {
					this.setting.view.addHoverDom = null;
					this.setting.view.removeHoverDom = null;				
				}
				this.setting.view.addDiyDom = this._addDiyDom;
			}else{
				if (attrs.showEditeBtn) {
					this.setting.view.addHoverDom = this._addHoverDom;
					this.setting.view.removeHoverDom = this._removeHoverDom;
				} else {
					this.setting.view.addHoverDom = null;
					this.setting.view.removeHoverDom = null;				
				}
			}
			

			if (attrs.showCheck) {
				this.setting.check.enable = true;
			} else {
				this.setting.check.enable = false;
			}
			if (attrs.fontCss) {
				this.setting.view.fontCss = attrs.fontCss;
			}

			//是checkbox 还是 radio
			if(attrs.checkStyle){
				this.setting.check.chkStyle = attrs.checkStyle;
			}
			if(attrs.chkboxType){
				this.setting.check.chkboxType = attrs.chkboxType;
			}

			this.render();
			

			//将attr的一些属性放到 ztreeObj 上
			this.ztreeObj.attrs = attrs;
		},
		
		_mouseHandle: function(e) {
			e.stopPropagation();
			return true;		
		},
		
		_enterHandle: function(e) {
			if (e.keyCode == 13) {
				$('.save-nm', this.$el)[0].click();
			}
		},
		
		_saveNm: function() {
			var curTreeNode = this.getCurTreeNode();
			var newName = $('.rename-inp', this.$el).val();
			if (newName == curTreeNode.name) {
				this.cancelRename();
				return false;
			}
			this.trigger('rm', curTreeNode, newName);
			return false;
		},

		getCurTreeNode: function() {
			return this.ztreeObj.curTreeNode || this.ztreeObj.getSelectedNodes()[0];
		},
		
		
		 /** 
		 * @desc 重新封装编辑接口
		 */
		_doRename: function(curTreeNode) {
			var tId = curTreeNode.tId,
				$input = $('<input type="text" class="rename-inp" data-default="'+ curTreeNode.name +'" value="'+ curTreeNode.name +'"/>');
			
			var html = [
				'<input type="text" class="rename-inp" data-default="'+ curTreeNode.name +'" value="'+ curTreeNode.name +'"/>',
				'<em class="save-nm">保存</em>',
				'<em class="cancel-nm">取消</em>'
			].join('');
			
			$('#' + tId + '_a').addClass('curSelectedNode_Edit');
			$('#' + tId + '_span').html(html);
		},
		
		/**
		 * @desc 取消编辑
		 */
		cancelRename: function() {
			var $input = this.$el.find('.rename-inp');
			if ($input.length > 0) {
				var val = $input.attr('data-default');
				$input.off();
				$input.closest('.curSelectedNode_Edit').removeClass('curSelectedNode_Edit');
				$input.parent().html(val);
			}
		},
		
		/**
		 * @desc 获取勾选集合
		 */		
		getCheckedCodes: function() {
			if (this.attrs.showCheck) {
				var nodes = this.ztreeObj.getCheckedNodes(true),
					result = [];
				_.each(nodes, function(item) {
					result.push(item.code);
				});
				return result;
			}
			return null;
		},


		/**
		 * 获取选中的ids集合
		 */
		getCheckedIds: function() {
			if (this.attrs.showCheck) {
				var nodes = this.ztreeObj.getCheckedNodes(true),
					result = [];
				_.each(nodes, function(item) {
					result.push(item.id);
				});
				return result;
			}
			return null;
		},
		/**
		 * @desc 获取勾选node集合
		 */		
		getCheckedListNodes: function() {
			if (this.attrs.showCheck) {
				var nodes = this.ztreeObj.getCheckedNodes(true),
					result = [];
				_.each(nodes, function(item) {
					result.push(item);
				});
				return result;
			}
			return null;
		},


		/**
		 * @desc 设置勾选
		 */		
		setChecked: function(ids) {
			if (this.attrs.showCheck) {
				var treeObj = this.ztreeObj;
				_.each(ids, function(id) {
					var node = treeObj.getNodeByParam('id', id, null);
					node && treeObj.checkNode(node, true);
				});
			}
		},		
		
		/**
		 *
		 * 编辑时触发各种事件
		 */
		_editeHandle: function(evt) {
			var curTreeNode = this.getCurTreeNode();
			//this.cancelRename();
			this.ztreeObj.curTreeNode = curTreeNode;
			this.ztreeObj.selectNode(curTreeNode);
			//console.log($(evt.target)[0]);
			var event = $(evt.target)[0].getAttribute('data-event');
			/*
			if (event == 'rm') {
				this._doRename(curTreeNode);
				return true;
			}
			*/
			this.trigger(event, curTreeNode);
			
			/*
			if (event == 'del') {
				return false;
			}
			*/			
		},
		_showNodeHandle:function(e){
			var curTreeNode = this.getCurTreeNode();
			//console.log(curTreeNode);
			e.stopPropagation();
			this.trigger('detailInfo', curTreeNode);
		},
		
		_addDiyDom:function(treeId, treeNode) {
							
			/*var aObj = $("#" + treeNode.tId + "_a");
		if ($("#ztree_"+treeNode.id).length>0) return;
		
		var editStr = "<span id='diyBtn_space_" +treeNode.id+ "' > </span>"
			+ "<button type='button' class='diyBtn1' id='ztree_" + treeNode.id
			+ "' title='"+treeNode.name+"' onfocus='this.blur();'></button>";
		aObj.append(editStr);
		var btn = $("#ztree_"+treeNode.id);
	if (btn) btn.bind("click", function(){alert("diy Button for " + treeNode.name);});*/
	
	
		var me = this,
				$a = $('#' + treeNode.tId + '_a'),
				domId = 'ztree_' + treeNode.id;
				
			if ( $('#' + domId).length > 0 ) {
				return; 
			}
			
			var html = '';

			var attrs = me.getZTreeObj(treeId).setting.attrs || {};	
			if( attrs && attrs.btns && attrs.btns.length > 0 ){
				html = '<span id="' + domId + '" class="edite-b">';

				for( var i=0; i<attrs.btns.length; i++ ){
					html = html + '<em class="edite" data-event ="'+ attrs.btns[i]['event'] + '"  data-permissions ="'+ attrs.btns[i]['permissions'] + '">  ' + attrs.btns[i]['name']+'</em>';
				}
				html = html + '</span>';
			}
			zTreeFn.getZTreeObj(treeId).curTreeNode = treeNode;
			$a.append(html);
			IBSS.tplEvent.setPermissions($a);
	
			/*var me = this,
				$a = $('#' + treeNode.tId + '_a'),
				domId = 'ztree_' + treeNode.id;
				
			if ( $('#' + domId).length > 0 ) {
				return; 
			}
			
			var html = '',
				i;
				//var temp = zTreeFn.getZTreeObj(treeId);
			//console.log(zTreeFn.getZTreeObj(treeId))
			var attrs = me.getZTreeObj(treeId).attrs || {};
			if( attrs && attrs.btns && attrs.btns.length > 0 ){
				html = '<span id="' + domId + '" class="edite-b">';

				for( var i=0; i<attrs.btns.length; i++ ){
					html = html + '<em class="edite" data-event ="'+ attrs.btns[i]['event'] + '"  data-permissions ="'+ attrs.btns[i]['permissions'] + '">  ' + attrs.btns[i]['name']+'</em>';
				}
				html = html + '</span>';
			}
			zTreeFn.getZTreeObj(treeId).curTreeNode = treeNode;
			$a.append(html);
			IBSS.tplEvent.setPermissions($a);*/
		},
		
		/**
		*
		* hover in 时触发当前节点，单是不显示自定义控件
		* @desc 添加编辑按钮
		* @param treeNode  当前hover过的treeNode信息
		*/
		_addHoverDomHide: function(treeId, treeNode) {
			
			var me = this,
				$a = $('#' + treeNode.tId + '_a'),
				domId = 'edite-b-' + treeNode.id;
			
			if ( $('#' + domId).length > 0 ) {
				return; 
			}
			
			var attrs = me.getZTreeObj(treeId).attrs || {};
			zTreeFn.getZTreeObj(treeId).curTreeNode = treeNode;
			//$a.append(html);
			IBSS.tplEvent.setPermissions($a);
		},

	   /**
		*
		* hover in 时触发
		* @desc 添加编辑按钮
		* @param treeNode  当前hover过的treeNode信息
		*/
		_addHoverDom: function(treeId, treeNode) {
			
			var me = this,
				$a = $('#' + treeNode.tId + '_a'),
				domId = 'edite-b-' + treeNode.id;
			
			if ( $('#' + domId).length > 0 ) {
				return; 
			}
			
			var html = '',
				i;

			var attrs = me.getZTreeObj(treeId).attrs || {};
			
			if( attrs && attrs.btns && attrs.btns.length > 0 ){
				html = '<span id="' + domId + '" class="edite-b">';

				for( var i=0; i<attrs.btns.length; i++ ){
					html = html + '<em class="edite" data-event ="'+ attrs.btns[i]['event'] + '"  data-permissions ="'+ attrs.btns[i]['permissions'] + '">  ' + attrs.btns[i]['name']+'</em>';
				}
				html = html + '</span>';
			}
			zTreeFn.getZTreeObj(treeId).curTreeNode = treeNode;
			$a.append(html);
			IBSS.tplEvent.setPermissions($a);
			

		},
		
		/**
		 *
		 * hover out 时触发
		 * @desc 删除编辑按钮  同时注销事件
		 */
		_removeHoverDom: function(treeId, treeNode) {

			zTreeFn.getZTreeObj(treeId).curTreeNode = null;
			$('#edite-b-' + treeNode.id).unbind().remove(); 
		},		

		/****
		 *
		 * 渲染同时初始化ztree
		 */
		render: function() {
			var $el = $(this.attrs.elem);
			if ($el && $el.length > 0) {
				$el.append(this.$el);
				this.ztreeObj = zTreeFn.init(this.$el, this.setting, this.attrs.data);
			}
		},
		
		/***
		 *
		 * 销毁ztree
		 */
		destroy: function() {
			this.ztreeObj.destroy();
			this.remove();
		}

	});
	
	module.exports = ZTree;	
});