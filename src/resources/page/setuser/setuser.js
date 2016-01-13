define( function(require, exports, module){

	var Pagination = require('common/widget/pagination/pagination'),
		AgentUser = require('module/agentuser/agentuser');
	var Dialog = require('common/widget/dialog/dialog');
	var Slider = require('common/widget/slider/slider');
	var SettingHighter = require('module/settinghighter/settinghighter');
		
    var Tem = $( require('./template.html') );
	var auditStatusMap = {
        'WAIT': '待审核',
        'SUCCESS': '审核成功',
        'FAILS': '审核失败'
    };

	//用户列表
	var UserList = MClass( M.Center ).include({
		events:{
			'click .adduser': 'addUserEve',
			'click .edituseractive': 'editUserActiveEve',
			'click .edituserdeactive': 'editUserDeactiveEve',
			'click .editself': 'editSelfEve',
			'click .userdetail': 'detailEve',
			'click .search': 'searchEve',
			'click .settinghighter': 'settingHighterEve',
			'click .change-status':'changeStatusEve'
		},
		elements:{
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

            //进行相关处理
            me.list.on('reload',function(){

            });

            me.getList();
		},
		addUserEve: function(){
			this.trigger('adduser');
		},
		editUserActiveEve: function(e){
			var id = $( e.currentTarget ).attr('data-id');
			this.trigger('edituseractive',id);
		},
		editUserDeactiveEve: function(e){
			var id = $( e.currentTarget ).attr('data-id');
			this.trigger('edituserdeactive',id);
		},
		editSelfEve: function(e){
			var id = $( e.currentTarget ).attr('data-id');
			this.trigger('editself',id);
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
					url: '/agent/changeaccountactive',
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
		settingHighterEve:function(e){
			var id = $( e.currentTarget ).attr('data-id');
			var name = $( e.currentTarget ).attr('data-name');
			this.trigger('settinghighter',id);
		},
		detailEve: function(e){
			var id = $( e.currentTarget ).attr('data-id');
			this.trigger('userdetail',id);
		},
		searchEve: function(){
			this.pagination.setPage(0,false);
			this.getList();
		},
		getList: function(){
			var me = this;

			util.api({
				'url':'/agent/queryaccountpage',
				'data':{
					'pageIndex': me.pagination.attr['pageNumber'],
					'pageSize': me.pagination.attr['pageSize'],
					'name': me.model.get('name'),
					'agentId': IBSS.role_vendorId
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						me.pagination.setTotalSize( data.value.model.itemCount );
						me.list.reload( data.value.model.content , function( item ){
							if( item.auditStatus ){
                                item.auditStatusStr = auditStatusMap[item.auditStatus];
                            }
                            if( item.agentAdmin ){

                            	//编辑自己的信息( 审核中 和 停用的状态的员工无法进入页面 所以自己的只可能是启用的状态 )
                            	if( item.mySelf ){ 

                            		item.status = 'self' ;
                            	
                            	//同级的代理商管理员不管什么状态 只可以看
                            	}else{

                            		item.status = 'detail';
                            	}

                            //其他普通用户 处于审核状态只可以看
                            }else{
                            	if( item.auditStatus == 'WAIT' ){

                            		item.status = 'userdetail';
                            	}else if( item.active ){

                            		item.status = 'editactive';
                            	}else{

                            		item.status = 'editdeactive';
                            	}
                            }
						});
					}
				}
			})
		}
	});
	

	exports.init = function(){
		var $el = exports.$el;
		var userList = new UserList({'view':$el[0]});

		var agentUser = new AgentUser({'state':'agentadd'});
		var editUserActive = new AgentUser({'state':'agenteditactive'});                    //编辑 启用的代理商用户
		var editUserDeactive = new AgentUser({'state':'agenteditdeactive'});                //编辑 停用的代理商用户
		var userDetail = new AgentUser({'state':'detail'});                                 //编辑 审核中的代理商用户
		var selfDetail = new AgentUser({'state':'editself'});
		var settingHighter = new SettingHighter({'state':'agent'});

		userList.on('adduser',function(){

			agentUser.show();
		});
		userList.on('edituseractive',function(id){

			editUserActive.show(id);
		});
		userList.on('edituserdeactive',function(id){

			editUserDeactive.show(id);
		});
		userList.on('settinghighter',function(id){

			settingHighter.show(id);
		});
		userList.on('userdetail',function(id){

			userDetail.show(id);
		});
		userList.on('editself',function(id){
			selfDetail.show(id);
		});
		agentUser.on('update',function(){
			
			userList.searchEve();
		});
		editUserActive.on('update',function(){

			userList.searchEve();
		});
		editUserDeactive.on('update',function(){

			userList.searchEve();
		})
	}
});
