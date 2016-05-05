/**
 *
 * 我的审批列表
 *
 */
define( function(require, exports, module){

	var Pagination = require('common/widget/pagination/pagination');
	
	/**
	 *
	 * 代理商用户详情 
	 */
	var UserDetail = require('module/agentuser/agentuser');

	var auditStatusMap = {
        '0': '待审核',
        '1': '审核成功',
        '2': '审核失败'
    };

	/**
	 *
	 * 用户列表
	 */
	var UserList = MClass( M.Center ).include({
	     
	    elements:{
	        'tbody': 'tbody',
	        '.list-starttime': 'startTime',
	        '.list-endtime': 'endTime'
	    },
	    
	    events:{
	        'click .btn-search': 'searchEve',
	        'click .user-approval': 'approvalEve'
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
	        
	        me.on('empty:list',function(){
	            me.$tbody.html("<tr><td colspan='9'><p class='info'>暂无数据</p></td></tr>");
	        })

	        me.getList();
	    },

	    //查询
	    searchEve: function(){
	        this.pagination.setPage( 0,false );
	        this.getList();
	    },

	    approvalEve: function(e){
	        var me = this;
	        var $target = $(e.currentTarget);

	        var id = $target.attr('data-id');
	        this.trigger('approval',id );
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
	                'pageIndex': me.pagination.attr['pageNumber']+1,
	                'agentId': '',
	                'agentName': me.model.get('agentName'),
	                'name': me.model.get('name'),
	                'status': me.model.get('status'),
	                'loginName': me.model.get('loginName'),
	                'email': me.model.get('email'),
	                'startTime': startTime,
	                'auditStatus': 0,
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

	                        if( item.auditStatus != undefined){
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
	    }
	});

	exports.init = function(){
		var $el = exports.$el;

		var userList = new UserList( { 'view':$el.find('.m-approvalwaitlist') } );
		var userapproval = new UserDetail( {'state':'channeldetect'} );

		userList.on('approval',function( id ){

			userapproval.show( id );
		})

		userapproval.on('update',function(){

			userList.getList();
		})
	}
});
