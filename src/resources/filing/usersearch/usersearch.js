define( function(require, exports, module){

	var Pagination = require('common/widget/pagination/pagination');
	var template = require('./agtTemplate.html');
	var UserList = require('module/agentuserlist/agentuserlist'),
		UserDetail = require('module/agentuser/agentuser');

    var auditStatusMap = {
        'WAIT': '待审核',
        'SUCCESS': '审核成功',
        'FALSE': '审核失败'
    };

	var AgtList = MClass( M.Center ).include({
		
		trTpl: _.template( $(template).filter('#trtpl').html() ),
		init: function(){
			AgtList.__super__.init.apply( this , arguments );

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

			me.collection = new M.Collection;
			me.collection.on('reload',function(){
				me.renderList();
			});
			me.getList();
		},
		events:{
			'click .btn-search':'searchEve',
			'click .user-detail': 'detailEve',
			'click .user-approval': 'approvalEve'		
		},
		elements:{
			'tbody': 'tbody'
		},
		searchEve: function(){
			this.pagination.setPage( 0,false );
			this.getList();
		},
		detailEve: function( e ){
			var $target = $( e.currentTarget );

			var id = $target.attr('data-id');

			this.trigger('detail', id );
		},
		approvalEve: function(e){
            var me = this;
            var $target = $(e.currentTarget);

            var id = $target.attr('data-id');
            this.trigger('approval',id );
        },
		//获取列表数据
		getList: function(){
			var me = this;
			util.api({
				'url':'/agent/queryallaccountpage',
				'data':{
					'agentId':me.model.get('promotionCode'),
					'agentName':me.model.get('agentName'),
					'name': me.model.get('name'),
					'role': me.model.get('role'),
					'pageIndex': me.pagination.attr['pageNumber'],
					'pageSize': me.pagination.attr['pageSize']
				},
				beforeSend: function(){
					me.$tbody.html( '<tr><td colspan="6"><p class="info">加载中...</p></td></tr>' );
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						
						me.collection.reload( data.value.model.content ,function( item ){
							var str="";
							_.each(item.roles,function(list,index){
								str += list.name+' ';
							});
							item.roles = str;
							if( item.auditStatus ){
                                item.auditStatusStr = auditStatusMap[item.auditStatus];
                            }
						});
						me.pagination.setTotalSize(data.value.model.itemCount);
					}
				}
			})
		},

		//渲染列表数据
		renderList: function(){
			var me = this;
			var collection = me.collection.all();
			if( collection.length > 0 ){
				me.$tbody.html( me.trTpl({'content':collection}) );
				IBSS.tplEvent.setPermissions( me.$tbody );
			}else{
				me.$tbody.html( '<tr><td colspan="6"><p class="info">暂无数据</p></td></tr>' );
			}
		} 
	});

	exports.init = function(){
		var $el = exports.$el;

		var agtList = new AgtList( {'view':$el.find('.u-tablelist')} );
		var userdetail = new UserDetail({'state':'channel'});        //用户详情 
		var userapproval = new UserDetail({'state':'channeldetect'});      //用户审批详情
		
		//代理商用户列表
		var userlist = new UserList( {'state':'filing'} );

		//渠道用户 查看用户详情
		agtList.on('detail',function( id, agentId ){

			userdetail.show( id , agentId );
		});
		agtList.on('approval',function( id, agentId ){

			userapproval.show( id , agentId );
		});
		
		userdetail.on('update',function(){
			agtList.getList();
		})
		userapproval.on('update',function(){
			agtList.getList();
		})
	}

});