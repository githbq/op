define( function(require, exports, module){

	var Pagination = require('common/widget/pagination/pagination'),
		Dialog = require('common/widget/dialog/dialog'),
		tem = require('./template.html');

	//客户企业列表
	var ClientList = MClass( M.Center ).include({
		init: function(){
			ClientList.__super__.init.apply( this,arguments );
			var me = this;

			me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager'),
                pageSize: 20,
                pageNumber: 0
            });
            me.pagination.render();
            me.pagination.onChange = function() {
                me.getList();
            };

            console.log( 'client' );
            me.filtercloseEve();
			me.on('empty:list',function(){
				me.$tbody.html("<tr><td colspan='7'><p class='info'>暂无数据</p></td></tr>");
			})
		},
		events:{
			'click .select': 'selectEve',
			'click .filterclose': 'filtercloseEve'
		},
		elements:{
			'.bar-filter': 'filter',
			'.filtername': 'filtername',
			'tbody':'tbody'
		},
		agentSearch: function( id , name ){
			var me = this;

			me.attrs['agentId'] = id;
			me.$filtername.text( name );
			me.$filter.show();

			me.getList();
		},

		//取消筛选
		filtercloseEve: function(){
			console.log('filterclose');

			var me = this;
			me.$filter.hide();
			me.attrs['agentId'] = '';
			me.getList();
		},

		//获取列表
		getList: function(){
			var me = this;

			util.api({
				'url': '/agent/querypagechannelagententerprise',
				'data': {
					'pageIndex': me.pagination.attr['pageNumber'],
					'pageSize': me.pagination.attr['pageSize'],
					'agentId': me.attrs['agentId']
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						me.pagination.setTotalSize( data.value.model.itemCount );
						me.list.reload( data.value.model.content );
					}
				}
			})
		},
		
		//选择事件
		selectEve: function(){
			this.trigger('select');
		}
	});

	
	//选择代理商
	var SelectAgent = MClass( Dialog ).include({
		content: tem,
		defaultAttr:{
			'title': '选择代理商',
			'width': 460
		},
		events: {
			'click .search': 'getList',
			'click .agentdetail': 'detailEve'
		},
		init: function(){
			
			SelectAgent.__super__.init.apply( this, arguments );
		},

		//显示
		show: function(){
			this.getList();
			SelectAgent.__super__.show.apply( this, arguments );
		},
		hide: function(){
			this.list.clear();
			SelectAgent.__super__.hide.apply( this, arguments );
		},
		//选中代理商
		detailEve: function(e){
			var $target = $(e.currentTarget);

			var id = $target.attr('data-id'),
				name = $target.attr('data-name'); 

			this.trigger('selectagent', id , name);
			this.hide();
		},

		//获取所有代理商
		getList: function(){
			var me = this;

			util.api({
				'url':'/agent/listchannelagent',
				'data': {
					'name': me.model.get('name')
				},
				'button': {
					'el': me.$('.search'),
					'text':'获取信息......'
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						me.list.reload( data.value.model );
					}
				}
			})
		}
	});

	exports.init = function(){
		var $el = exports.$el;

		var clientList = new ClientList( {'view':$el.find('.m-clientlist')} );
		var selectAgent = new SelectAgent();

		clientList.on('select',function(){
			selectAgent.show();
		});

		selectAgent.on('selectagent',function( id , name ){
			clientList.agentSearch( id , name );
		});
	}
});
