define( function(require, exports, module){

	var Pagination = require('common/widget/pagination/pagination'),
		Slider = require('common/widget/slider/slider'),
		template = require('./template.html');

	var UserList = require('module/agentuserlist/agentuserlist'),
		UserDetail = require('module/agentuser/agentuser');

	var CITYMAP = {};


	/***
	 *
	 * 代理商列表
	 */
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

			me.attrs.isadmin = false;
			for( var i = 0; i < IBSS.FUNCTIONS.length ; i++ ){
				if( 'F011001' == IBSS.FUNCTIONS[i] ){
					me.attrs.isadmin = true;
				}
			}

			//
			me.refreshSelect();
		},
		events:{
			'click .btn-search':'searchEve',
			'click .recordEnt': 'entEve',
			'click .assign-ent': 'assignEnt',
			'click .setTarget': 'setTargetEve',
			'click .userlist': 'userlistEve'			
		},
		elements:{
			'tbody': 'tbody',
			'.select-city': 'selectCity'
		},

		//判断是不是渠道管理员 如果是显示目标
		setState: function(){
			var me = this;
			console.log( me.attrs.isadmin );
			if( me.attrs.isadmin ){
				me.$('.setTarget').show();
			}else{
				me.$('.setTarget').hide();
			}
		},

		// 查询数据 页数重置为第一页
		searchEve: function(){
			this.pagination.setPage( 0,false );
			this.getList();
		},

		//设置本月目标
		setTargetEve: function( e ){
			var id = $(e.currentTarget).attr('data-id'),
				number = $(e.currentTarget).attr('data-number');

			this.trigger('task',id ,number);
		},

		entEve: function( e ){
			var id = $(e.currentTarget).attr('data-id'),
				name = $(e.currentTarget).attr('data-name');

			this.trigger('ent',id,name);
		},

		// 查看用户列表
		userlistEve: function( e ){
			var $target = $( e.currentTarget );

			var id = $target.attr('data-id'),
				name = $target.attr('data-name');

			this.trigger('userlist', id , name );
		},

		assignEnt: function( e ){
            var id = $( e.currentTarget ).attr('data-id');

            this.trigger('assignEnt',id);
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
					console.warn( data );
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
			me.setState();
		} 
	})
	
	/**
     * 分配详情
     */
    var FilingInfo = MClass( Slider ).include({

        content: $(template).filter('#assignEntInfo').html(),
	
        defaultAttr:{
            'width': 616,
            'title': '代理商分配'
        },

        elements: {
            '.assign-ent-Info tbody': 'tbassginEntList',
			'.assign-ent-Info .agent-bind-channel': 'btnagentBindChannl',
			'#agentId':'agentId',
			'.search-qudao':'searchQuDao'
        },
		accountList:[],

        events: {
            'click .agent-bind-channel': 'agentBindChannel',
            'click .btn-search': 'searchEve'
        },
		tpassginEntList: _.template( $(template).filter('#trAssignEnt').html() ),

        init: function(){
            FilingInfo.__super__.init.apply( this,arguments );
			var me = this;
			me.$searchQuDao.on('keyup',function(){
				 var wd = $(this).val();
				if(wd == ''){
					$('.assign-ent-Info tbody tr').show();
				}else{
					$('.assign-ent-Info tbody tr').each(function(){
						var feed = me.getList($(this).attr('data-id'));
						if( feed.name.match(wd)){
							$(this).show();
						}else{
							$(this).hide();
						}
					});
				}
				return false;
			});
        },
		agentBindChannel:function(e){
			var me = this,
				$target = $( e.currentTarget ),
				assignAccount = $target.attr( 'data-id' ),
				vendorId = me.$agentId.attr('data-agent'),
				data = {
					vendorId: vendorId,
					assignAccount: assignAccount
				};
				if(confirm("确定要将代理商分配给该渠道吗？")){
					util.api({
						url: '/agent/assignagent',
						data: data,
						success: function( data ) {
							if ( data.success ) {
								util.showTip('绑定成功');
								me.trigger('success');
							}
						}
					}) ;
				}
				return false;	
			
		},
  		searchEve: function(){
  			var me = this;
  			util.api({
                'url': '/agent/getassignchannellist',
                'data': {
                	'name': me.model.get('name')
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        if ( data.model.length > 0 ) {
							me.$tbassginEntList.html(me.tpassginEntList( { content: data.model } ));
						} else {
							me.$tbassginEntList.html( '<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>' );
						}
                    }
                }
            })
  		},
        //显示备案企业详情
        show: function( id ){
            var me = this;
			me.agentId = id;
			me.$agentId.attr('data-agent',id);
		
            util.api({
                'url': '/agent/getassignchannellist',
                'data': {
                	'name': me.model.get('name')
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        if ( data.model.length > 0 ) {
							me.$tbassginEntList.html(me.tpassginEntList( { content: data.model } ));
							me.accountList = data.value.model;
						} else {
							me.accountList = [];
							me.$tbassginEntList.html( '<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>' );
						}
                    }
                }
            })
            FilingInfo.__super__.show.apply( this,arguments );
        },
		getList: function(id){
  			var me = this;
			var list = me.accountList;
  			for(var i=0; i<list.length; i++){
				if(list[i].id == id){
					return list[i];
				}
			}
			return null;
  		},

        hide: function(){
            this.model.clear();
			this.$agentId.attr('data-agent','');
			this.accountList = [];
            this.$('.state').hide();
            FilingInfo.__super__.hide.apply( this,arguments );
        }
    });
	
	/**
	 *
	 * 设置本月目标
	 */
	var Task = MClass( Slider ).include({
		
		defaultAttr:{
            'width': 400,
            'title': '设置代理商当月目标'
        },

        events: {
        	'click .btn-sure': 'sendEve'
        },

		content: $(template).filter('#task').html(),

		init: function(){
			Task.__super__.init.apply( this, arguments );
		},

		show: function( id ,number){
			var me = this;
			me.attrs.id = id;
			me.model.set('target', number);
			Task.__super__.show.apply( this, arguments );
		},

		hide: function(  ){
			var me = this;
			me.model.clear();

			Task.__super__.hide.apply( this, arguments );
		},

		sendEve: function(){
			var me = this;

			if( ! me.model.get('target') ){
				util.showToast('请输入当月目标金额');
				return false;
			}
			util.api({
				url:'/agent/setagenttarget',
				'data':{
					'target': me.model.get('target'),
					'vendorId': me.attrs.id
				},
				'success': function( data ){
					if( data.success ){
						me.hide();
						me.trigger('update');
					}
				}
			})
		}
	})

	exports.init = function(){
		var $el = exports.$el;

		var filingInfo = new FilingInfo();
		var agtList = new AgtList( {'view':$el.find('.m-agtlist')} );
		var userdetail = new UserDetail({'state':'channel'});        //用户详情 
		var userapproval = new UserDetail({'state':'channeldetect'});      //用户审批详情
		var task = new Task();
		
		//代理商用户列表
		var userlist = new UserList( {'state':'filing'} );


		agtList.on('ent',function( id,name ){
			location.hash = '#filing/entprisefiling/' + id + '/' + name ;
		});


		agtList.on('assignEnt',function( id ){

			 filingInfo.show( id );
		});
		
		agtList.on('userlist',function( id , name ){

			userlist.show( id , name );
		});

		//渠道用户 查看用户详情
		userlist.on('detail',function( id, agentId ){

			userdetail.show( id , agentId );
		});

		userlist.on('approval',function( id ){

			userapproval.show( id );
		});

		userdetail.on('update',function(){
			userlist.getList();
		})
		userapproval.on('update',function(){
			userlist.getList();
		})



		//设置目标
		agtList.on('task',function( id ,number){

			console.log('task');
			console.log( id );
			task.show( id ,number);
		});

		task.on('update',function(){
			agtList.getList();
		});

		filingInfo.on('success',function(){
			agtList.getList();
		})
	}
});
