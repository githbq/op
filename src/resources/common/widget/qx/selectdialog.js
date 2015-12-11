/*
*@ 发起对话弹窗
*/
define(function(require, exports, module){
	
	var Dialog = require('../dialog/dialog');

	var template = $(require('./selectdialog.html'));
	var selectdialogtpl = template.filter('#maintpl').html(),
		trtpl = template.filter('#trtpl').html();

	var $body = $('body');

	var SelectDialog = MClass( Dialog ).include({

		content: selectdialogtpl,

		trTpl:_.template(trtpl),
		defaultAttr:{
			'title': '发起新对话',
			'width': 870
		},
		events:{
			'click .beginsession' : 'sure',
			'click .btn-search': 'searchEve'
		},
		init: function(){
			SelectDialog.__super__.init.apply( this,arguments );
			
			var me = this;
			me.userList = null;     //用户列表缓存
			me.initDom();
		},
		
		initDom: function(){
			var me = this;

			me.$searchBtn = me.$view.find('.btn-search');

			me.$qymc = me.$view.find('.qymc');
			me.$qyzh = me.$view.find('.qyzh');

			me.$username = me.$view.find('.username');
			me.$userphone = me.$view.find('.userphone');

			me.$tbody = me.$view.find('tbody');

		},

		//搜索用户信息
		searchEve: function(e){
			var me = this;

			if( $(e.target).hasClass('disable') ) return;

			var username = me.$username.val(),
				userphone = me.$userphone.val(),
				qymc = me.$qymc.val(),
				qyzh = me.$qyzh.val();
			
			var tip=""
			if(qymc=="" && qyzh==""){
				tip = tip + '企业账号和企业名称 请至少选填一项  ';
			}
			if(userphone=="" && username==""){
				tip = tip + '用户名称和用户手机 请至少选填一项  ';
			}
			if( tip ){
				alert(tip);
				return false;
			}
			
			me.xhr = util.api({
				'type':'post',
				'url':'~/g/api/client/getclients',
				'data':{
					'enterpriseAccount': qyzh,
					'enterpriseName': qymc,
					'clientName': username,
					'mobile':userphone
				},
				'beforeSend': function(){
					me.$searchBtn.addClass('disable');
			        me.$tbody.html('<tr><td colspan="5"><p class="tip">加载中......</p></td></tr>');
			    },
				'success': function(data){
					if(data.success){

						data.value = data.value || {}
						me.userList = data.value.model.content || [];
						_.each(me.userList,function( item,index ){
							item.clientId = 'E.'+item.enterpriseAccount+'.'+item.xkId;
						})
						me.refreshUserList();
					}
				},
				'complete': function(){
					me.$searchBtn.removeClass('disable');
				}
			})

		},

		// 刷新搜索到的用户列表
		refreshUserList: function(){
			var me = this;
			
			var domStr;
			if(me.userList.length <= 0){
				domStr = '<tr><td colspan="5"><p class="tip">未查找到相关用户信息</p></td></tr>';
			}else{
				domStr = me.trTpl({'list':me.userList});
			}

			me.$tbody.html(domStr);
			me.resize();
		},

		//显示发起新对话弹窗
		show: function(info, id ){
			var me = this;
			SelectDialog.__super__.show.apply(this,arguments);
		},

		//发起对话
		sure: function(e){
			var me = this;

			var id = $(e.target).attr('data-id');
			
			util.api({
				'type': 'post',
				'url': '/message/createsession',
				'data': {
					'clientId':id
				},
				'success': function(info){
					if( info.success ){
						util.api({
			                type: 'post',
			                url: '/message/acceptsession',
			                data: { sessionId: info.value['model']['sessionId'] },
			                success: function( data ) {

			                    if ( data.success ) {
			                    	me.trigger('select',info.value['model']);
									me.hide();
			                    } 
			                }
		            	});
					}
				}
			});	
		},

		//隐藏同时清空数据
		hide: function(){
			var me = this;

			me.xhr && me.xhr.abort();
			me.$qymc.val('');
			me.$qyzh.val('');
			me.$username.val('');
			me.$userphone.val('');
			me.$tbody.html('<tr><td colspan="5"><p class="tip">暂无数据</p></td></tr>');
			
			SelectDialog.__super__.hide.apply(this,arguments);
		},

		//移除
		remove: function(){
			SelectDialog.__super__.remove.apply(this,arguments);
		}

	})

	module.exports = SelectDialog;
});

