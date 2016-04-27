define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

   	var Pagination = require('common/widget/pagination/pagination');
    var Slider = require('common/widget/slider/slider');
    var AreaTree = require('module/areatree/areatree');

    var template = require('./template.html');

    var statusMap = TPL.statusMap = {},industryMap = {},sourceMap = {};  //备案企业状态
    var logMap = TPL.logMap = {};        //记录状态

    /**
     * 公开企业列表
     * 
     */
    var OpenList = MClass( M.Center ).include({

    	init: function(){
    		OpenList.__super__.init.apply( this,arguments );
    		var me = this;
            
            me.$startTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});
            me.$endTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});
    		
            me.pagination = new Pagination({
    			'wrapper': me.$view.find('.list-pager'),
    			'pageNumber': 0,
    			'pageSize': 10
    		});
    		me.pagination.render();
    		me.pagination.onChange = function(){
    			me.getList();
    		}

            me.areatree = new AreaTree();
            me.areatree.on('selectarea',function( nodes ){
                console.log( nodes );
                me.$region.val( nodes[0]['name'] ).attr('data-code', nodes[0]['code'] );
            })


            me.getList();
            me.on('empty:list',function(){
                me.$tbody.html("<tr><td colspan='7'><p class='info'>暂无数据</p></td></tr>");
            });
    	},

    	elements:{
            '.startTime': 'startTime',
            '.endTime': 'endTime',
            '.region': 'region',
            'tbody': 'tbody'
    	},

        events:{
            'click .search': 'searchEve',
            'click .detail': 'detailEve',
            'click .region': 'regionEve',
            'click .clear': 'clearEve',
			'click .bindall': 'bindEve',
			'click .public-ent-assgin':'publicEntAssginEve',
			 'click .selectEntAll': 'selectAllEve'
        },

        searchEve: function(){
            var me = this;

            me.pagination.setPage( 0,false );
            me.getList();
        },

        detailEve: function( e ){
            var me = this;

            var id = $( e.currentTarget ).attr('data-id');

            me.trigger('detail',id);
        },

        regionEve: function( e ){
            this.areatree.show();
        },
        clearEve: function( e ){
            this.$region.val('').attr('data-code','');
        },
		selectAllEve: function(e){
            var me = this;

            console.log( $(e.target).prop('checked') )
            if($(e.target).prop('checked')){
                me.$('tbody .selectEnt').prop('checked',true);
            }else{
                me.$('tbody .selectEnt').prop('checked',false);
            }

        },
		//单个分配
        publicEntAssginEve:function(e){
			 var id = $(e.currentTarget).attr('data-id');
			 this.trigger('assgin',[id]);
		},

        //批量分配
        bindEve:function(){
            var me = this;
            var ids = [];

            me.$('tbody .selectEnt:checked').each(function(){
                ids.push( $(this).val() );
            });

            if( ids.length <= 0 ){
                util.showToast('请勾选企业后再分配');
                return;
            }
            this.trigger('assgin',ids);
        },
        //获取列表
    	getList: function(){
    		var me = this;

            console.log('getList');
            var startTime ='',
                endTime ='',
                regionCode = '';

            if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() ).getTime();
            }

            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() ).getTime();
            }

            if( me.$region.val() ){
                regionCode = me.$region.attr('data-code').replace(/^\s+|\s+$/g,"");
            }
			var enterpriseName = me.model.get('enterpriseName').replace(/^\s+|\s+$/g,"")
			if(enterpriseName||regionCode||startTime||endTime){
				util.api({
					'url':'/enterprisefiling/queryfilingopen',
					'data':{
						'regionCode': regionCode,
						'enterpriseName': me.model.get('enterpriseName'),
						'startTime': startTime,
						'endTime': endTime,
						'pageIndex': me.pagination.attr['pageNumber']+1,
						'pageSize': '10'
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							me.list.reload( data.value.model.content ,function( item ){
								item.createTimeStr = new Date( item.createTime )._format('yyyy-MM-dd');
							});
							me.pagination.setTotalSize( data.value.model.itemCount );
						}
					}
				})
			}else{
				var obj = [];
				var itemCount = 0;
				me.list.reload( {'content':obj});
				me.pagination.setTotalSize( itemCount );
				me.$tbody.html("<tr><td colspan='7'><p class='info'>请输入查询条件</p></td></tr>");
			}
    		
    	},

        //
        detailEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');

            this.trigger('detail',id);
        }
    });
	 /**
    *
    * 渠道管理员分配
    */
    var PublicEntAssgin = MClass( Slider ).include({

         content: $(template).filter('#tabAssgin').html(),
        
        defaultAttr:{
            'width': 660,
            'title': '分配公开企业'
        },
		tpassginEntList: _.template( $(template).filter('#trAssignEnt').html() ),
        elements: {
            '#enterpriseId': 'enterpriseId',
			'.assign-ent-Info tbody':'assginList',
			'.search-name':'searchName',
			'tbody': 'tbody' 
        },
		accountList:[],
        events: {
            'click .ent-bind-person': 'entBindPersonEve',
			'click #btnSearch':'btnSearchEve'
        },

        init: function(){
			var me =this;
            PublicEntAssgin.__super__.init.apply( this,arguments );
			
			me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager'),
                pageSize: 10,
                pageNumber: 0
            });
            me.pagination.render();
            me.pagination.onChange = function() {
                me.getList();
            }
			
			me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });
			
        },
		
        //显示
        show: function( ids ){
            var me = this;

            me.ents = ids;
			me.getList();
			
            PublicEntAssgin.__super__.show.apply( this,arguments );
        },
		getList:function(){
			 var me = this;
			 
			 util.api({
                'url': '/agent/querypageforassginopenfiling',
                'data': {
					'id':me.$('#eiCode').val(),
					'name':me.$('#eiName').val(),
					'pageIndex': me.pagination.attr['pageNumber']+1,
                    'pageSize': me.pagination.attr['pageSize']
				},
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
						me.pagination.setTotalSize( data.value.model.itemCount );
						me.collection.reload( data.value.model.content);
                    }
                }
            })
		},
		//渲染数据
        renderList: function(){
            var me = this;

            var content = me.collection.all();
            if( content.length > 0 ){
                me.$tbody.html( me.tpassginEntList( {'content':content} ) );
            } else {
                me.$tbody.html( '<tr><td colspan="4"><p class="info">暂无数据</p></td></tr>' );
            }
        },
		btnSearchEve:function(){
			var me = this;
			me.getList();
		},
		entBindPersonEve:function(e){
			var me = this;

			var vendorId = $( e.currentTarget ).attr( 'data-id' );
			var openFilingIds =  me.ents.join(',');


			if(confirm("确定要将这些企业分配给此代理商吗？")){
				util.api({
					url: '/enterprisefiling/assignopenfiling',
					data: {
						'vendorId': vendorId,
						'openFilingIds': openFilingIds
					},
					success: function( data ) {
						if ( data.success ) {
							util.showTip('分配成功');
							me.trigger('success');
                            me.hide();
						}
					}
				}) ;
			}
			return false;	
		
		},
		
        hide: function(){
            this.model.clear();
			this.$('#eiCode').val(''),
			this.$('#eiName').val(''),
			this.ents = null;
            this.$('.state').hide();
            PublicEntAssgin.__super__.hide.apply( this,arguments );
        }
    });
    
    /**
     * 备案详情
     */
    var OpenInfo = MClass( Slider ).include({

        content: template,
        
        defaultAttr:{
            'width': 400,
            'title': '公开企业详情'
        },

        init: function(){
			var me =this;
            OpenInfo.__super__.init.apply( this,arguments );
			//me.getEnums();
        },
		//获取状态枚举值
        getEnums: function(){
            var me = this;
            var industryList=[{'name':'请选择','value':''}],sourceList=[{'name':'请选择','value':''}];

			util.getEnums('INDUSTRY',function(data){
                if( data.success ){

                    data.value.model.forEach(function( item, index){
                       industryList.push( {'name':item.text,'value':item.value} );
                    });
                    util.resetSelect( me.$industry, industryList );
                }
            })
			util.getEnums('FILING_SOURCE',function(data){
                if( data.success ){
					console.log(data)
                    data.value.model.forEach(function( item, index){
                       sourceList.push( {'name':item.text,'value':item.value} );
                    });
                    util.resetSelect( me.$source, sourceList );
                }
            })
        },
        //显示公开企业详情
        show: function( id ){
            var me = this;

            util.api({
                'url': '/enterprisefiling/getfilingopen',
                'data': {
                    'enterpriseFilingId': id
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.model.load( data.value.model );
                        if( me.model.get('createTime') ){
                            me.model.set('createTimeStr', new Date( me.model.get('createTime') )._format('yyyy-MM-dd') );
                        }
                    }
                }
            })
            OpenInfo.__super__.show.apply( this,arguments );
        },

        hide: function(){
            this.model.clear();
            OpenInfo.__super__.hide.apply( this,arguments );
        }
    });

    exports.init = function( param ){
    	var $el = exports.$el;

    	var openList = new OpenList( {'view':$el.find('.m-openlist') } ),
            openDetail = new OpenInfo();
		var publicEntAssgin = new PublicEntAssgin();

        openList.on('detail',function( id ){
            openDetail.show( id );
        })
		openList.on('assgin',function(ids){
            publicEntAssgin.show(ids);
        });
		publicEntAssgin.on('success',function(){
            openList.getList();
        });
    }
})
