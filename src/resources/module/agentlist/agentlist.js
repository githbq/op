/**
 *
 * 代理商列表
 * 代理商超级管理员用
 */
define( function(require, exports, module){

	var Pagination = require('common/widget/pagination/pagination'),
		viewStr = require('./agentlist.html'),
		template = require('./template.html');

	var CITYMAP = {};

	var AgtList = MClass( M.Center ).include({
		trTpl: _.template( $(template).filter('#trtpl').html() ),
		view: viewStr,
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
			//
			me.refreshSelect();
		},
		events:{
			'click .btn-search': 'searchEve',
			'click .addAgent': function(){ this.trigger('add') },
			'click .agent-edit': 'editEve',
			'click .agent-detail': 'detailEve'			
		},
		elements:{
			'tbody': 'tbody',
			'.select-city': 'selectCity'
		},

		// 查询数据 页数重置为第一页
		searchEve: function(){
			this.pagination.setPage( 0,false );
			this.getList();
		},


		/**
		 * 编辑代理商信息
		 */
		editEve: function( e ){
			var me = this;
			var $target = $(e.currentTarget);

			var id = $target.attr('data-id');
			me.trigger( 'editagent', id );
		},

		/**
		 * 查看用户详细信息
		 */
		detailEve: function( e ){
			var me = this;
			var $target = $(e.currentTarget);

			var id = $target.attr('data-id'),
				name = $target.attr('data-name');

			me.trigger( 'userdetail', id , name );
		},

		//渲染
		render: function(){
			this.attrs['wrapper'].html( this.$view );
		},

		//刷新
		refreshSelect: function(){
			var me = this;

			var list = [{'name':'全部','value':''}];
            
            util.getEnums( 'PROVINCE', function( data ) {
          		data.value.model.forEach(function(item ){
          			list.push({'name':item.text,'value':item.value});
          			CITYMAP[item.value] = item.text;
          		});
          		util.resetSelect( me.$selectCity, list );
          		me.getList();
            });
		},

		//获取列表数据
		getList: function(){
			var me = this;
			util.api({
				'url':'/agent/querypage',
				'data':{
					'id': me.model.get('promotionCode'),
					'province': me.model.get('city'),
					'name': me.model.get('name'),
					'status': me.model.get('status'),
					'pageIndex': me.pagination.attr['pageNumber'],
					'pageSize': me.pagination.attr['pageSize']
				},
				beforeSend: function(){
					me.$tbody.html( '<tr><td colspan="7"><p class="info">加载中...</p></td></tr>' );
				},
				'success': function( data ){
					if( data.success ){
						me.collection.reload( data.value.model.content ,function( item ){
							item.cityStr = CITYMAP[item.province];
							if(item.status == 0){
								item.statusStr = "已停用";
							} else {
							    item.statusStr = "已启用";
							}
						});
						me.pagination.setTotalSize(data.value.model.itemCount);
					}
				}
			})
		},
		renderList: function(){
			var me = this;
			var collection = me.collection.all();
			if( collection.length > 0 ){
				me.$tbody.html( me.trTpl({'content':collection}) );
				IBSS.tplEvent.setPermissions( me.$tbody );
			}else{
				me.$tbody.html( '<tr><td colspan="7"><p class="info">暂无数据</p></td></tr>' );
			}
		} 
	})

	module.exports = AgtList;
});
