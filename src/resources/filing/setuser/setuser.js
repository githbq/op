define( function(require, exports, module){

	var Pagination = require('common/widget/pagination/pagination'),
		FilingUser = require('module/filinguser/filinguser');
		var SettingHighter = require('module/settinghighter/settinghighter');

	//用户列表
	var UserList = MClass( M.Center ).include({
		events:{
			'click .adduser': 'addUserEve',
			'click .edituser': 'editUserEve',
			'click .search': 'searchEve',
			'click .settinghighter': 'settinghighterEve',
			'click .change-status':'changeStatusEve'
		},
		elements:{
			'tbody':'tbody',
			'.change-status':'changeStatus'
			
		},
		init: function(){
			UserList.__super__.init.apply(this,arguments);
			var me = this;

			me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager'),
                pageSize: 20,
                pageNumber: 0
            });
            me.pagination.render();
            me.pagination.onChange = function() {
                me.getList();
            }

            me.on('empty:list',function(){
     	        me.$tbody.html("<tr><td colspan='8'><p class='info'>暂无数据</p></td></tr>");
     	    });

            me.getList();
		},
		addUserEve: function(){
			this.trigger('adduser');
		},
		editUserEve: function(e){
			var id = $( e.currentTarget ).attr('data-id');
			this.trigger('edituser',id);
		},
		changeStatusEve: function(e){
			var me = this;
			var accountId = $( e.currentTarget ).attr('data-id');
			var active = $( e.currentTarget ).attr('data-status');
			var bool = confirm("确定修改启用停用的状态吗?");
			if( bool ){
				//更新企业详情

				me.$changeStatus.attr('disabled','disabled');
				
				util.api({
					url: '/channel/changeaccountactive',
					data: {
						'accountId':accountId,
						'active':active
					},
					success: function( data ) {

						if ( data.success ) {
							me.getList();
							 util.showTip('状态更新成功！');
						}
					},
					complete: function(){	
						me.$changeStatus.removeAttr('disabled');
					}
				});
            
            }
			
		},
		searchEve: function(){
			this.pagination.setPage(0,false);
			this.getList();
		},
		settinghighterEve: function( e ){
			var id = $( e.currentTarget ).attr('data-id');
			this.trigger('setChannelHighter',id);
		},
		getList: function(){
			var me = this;

			util.api({
				'url':'/channel/querychannellist',
				'data':{
					'pageIndex': me.pagination.attr['pageNumber']+1,
					'pageSize': me.pagination.attr['pageSize'],
					'name': me.model.get('name')
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						me.pagination.setTotalSize( data.value.model.itemCount );
						me.list.reload( data.value.model.content );
					}
				}
			})
		}
	})

	exports.init = function(){
		var $el = exports.$el;
		var userList = new UserList({'view':$el[0]});

		var addUser = new FilingUser( {'state':'add'} ),
			editUser = new FilingUser( {'state':'edit'} );
		var settingHighter = new SettingHighter({'state':'channel'});

		userList.on('setChannelHighter',function( id ){

			settingHighter.show(id);
		});
		userList.on('adduser',function(){

			addUser.show();
		});

		userList.on('edituser',function( id ){

			editUser.show( id );
		});

		addUser.on('update',function(){
			userList.searchEve();
		});

		editUser.on('update',function(){
			userList.searchEve();
		});

	}
});
