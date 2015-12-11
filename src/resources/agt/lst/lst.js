define( function(require, exports, module){

	var Pagination = require('common/widget/pagination/pagination'),
		template = require('./template.html');

	var CITYMAP = {};

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
			//
			me.refreshSelect();
		},
		events:{
			'click .btn-search':'searchEve',
			'click .entdetail': 'entEve'			
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

		entEve: function( e ){
			var id = $(e.currentTarget).attr('data-id');
			this.trigger('ent',id);
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
					me.$tbody.html( '<tr><td colspan="6"><p class="info">加载中...</p></td></tr>' );
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

		//渲染列表数据
		renderList: function(){
			var me = this;
			var collection = me.collection.all();
			if( collection.length > 0 ){
				me.$tbody.html( me.trTpl({'content':collection}) );
			}else{
				me.$tbody.html( '<tr><td colspan="6"><p class="info">暂无数据</p></td></tr>' );
			}
		} 
	})

	exports.init = function(){
		var $el = exports.$el;

		var agtList = new AgtList( {'view':$el.find('.m-agtlist')} );
		agtList.on('ent',function(id){
			location.hash = '#ent/lst/a'+id;
		})
	}
});
