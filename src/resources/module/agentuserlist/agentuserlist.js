/**
 *
 * 代理商用户列表
 * 代理商超级管理员用
 * 渠道用户用
 */

define( function(require, exports, module){

    var Slider = require("common/widget/slider/slider");
    var Pagination = require("common/widget/pagination/pagination");
	var contentStr = require('./agentuserlist.html');


    var auditStatusMap = {
        'WAIT': '待审核',
        'SUCCESS': '审核成功',
        'FALSE': '审核失败'
    };
    
   /**
     *
     * 用户列表
     */
    var UserList = MClass( Slider ).include({
        
        content: contentStr,

        //trTpl: _.template( template.filter('#usertr').html() ),
        
        elements:{
            'tbody': 'tbody',
            '.list-starttime': 'startTime',
            '.list-endtime': 'endTime',
			'.change-status':'changeStatus',
        },
        
        events:{
            'click .btn-search': 'searchEve',
            'click .user-detail': 'detailEve',
            'click .user-reset': 'resetEve',
            'click .user-approval': 'approvalEve',
            'click .addUser': 'addEve',
			'click .change-status':'changeStatusEve'
        },

        defaultAttr:{
            'title': '用户列表',
            'width': 760
        },

        init: function(){
            UserList.__super__.init.apply( this,arguments );
            var me = this;
          
            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function(){
                me.getList();
            };

            me.$startTime.datetimepicker({timepicker: false,format:'Y/m/d'});
            me.$endTime.datetimepicker({timepicker: false,format: 'Y/m/d'});

            me.setStatus();
            me.list && me.list.on('reload',function(){ me.setStatus() });
            me.on('empty:list',function(){
                me.$tbody.html("<tr><td colspan='9'><p class='info'>暂无数据</p></td></tr>");
            })
        },

        //设置状态显示
        setStatus: function(){
            var me = this;

            var state = me.attrs.state;

            if( state ){
                me.$( '.state-'+state ).show();
            }
        },

        //查询
        searchEve: function(){
            this.pagination.setPage( 0,false );
            this.getList();
        },

        //查看用户详情
        detailEve: function(e){
            var me = this;
            var $target = $(e.currentTarget);

            var id = $target.attr('data-id');
            var agentId = me.model.get('agentId');
            this.trigger('detail', id , agentId );
        },
        approvalEve: function(e){
            var me = this;
            var $target = $(e.currentTarget);

            var id = $target.attr('data-id');
            this.trigger('approval',id );
        },
		//修改启用停用
		changeStatusEve:function(e){
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
        //重置
        resetEve: function( e ){
            var $target = $(e.currentTarget);

            var id = $target.attr('data-id'),
                name = $target.attr('data-name');
            var bool = confirm("确认重置用户  " + name + "  的密码?");
            if( bool ){
                util.api({
                    'url':'/agent/resetpassword',
                    'data':{
                        'accountId': id
                    },
                    'success': function( data ){
                        if( data.success ){
                            util.showTip('重置成功');
                        }
                    }
                })
            }
        },

        //添加用户
        addEve: function(e){
            var me = this;

            var agentId = me.model.get('agentId');
            this.trigger('add', agentId );
        },

        //获取用户列表
        getList: function( id ){
            var me = this;
            
            var startTime,
                endTime;

            if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() ).getTime();
            }
            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() ).getTime();
            }

            util.api({
                'url': '/agent/queryaccountpage',
                'data': {
                    'pageSize': me.pagination.attr['pageSize'],
                    'pageIndex': me.pagination.attr['pageNumber'],
                    'agentId': me.model.get('agentId'),
                    'name': me.model.get('name'),
                    'status': me.model.get('status'),
                    'loginName': me.model.get('loginName'),
                    'email': me.model.get('email'),
                    'startTime': startTime,
                    'auditStatus': me.model.get('auditStatus'),
                    'endTime': endTime
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.list.reload( data.value.model.content ,function( item ){
                            

                            if(item.active == 0){
                                item.statusStr = "已停用";
                            } else {
                                item.statusStr = "已启用";
                            }

                            if( item.auditStatus ){
                                item.auditStatusStr = auditStatusMap[item.auditStatus];
                            }
                            if( me.attrs.state && me.attrs.state == 'am'){
                                item.auditStatus = '';
                            }
                            
                            if( item.lastLoginTime ){
                                item.lastLoginTimeStr = new Date( item.lastLoginTime )._format('yyyy-MM-dd hh:mm');
                            }
                        });
                        me.pagination.setTotalSize(data.value.model.itemCount);
                    }
                }
            })
        },

        //显示
        show: function( id , name ){
            var me = this;

            me.model.set( 'agentId', id );
            me.model.set( 'agentName', name );
            me.getList();
            UserList.__super__.show.apply( this , arguments );
        }
    })
    
    module.exports = UserList;  
});
