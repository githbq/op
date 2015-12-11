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
    			'pageSize': 20
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
            'click .clear': 'clearEve'
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
						'pageIndex': me.pagination.attr['pageNumber'],
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

        openList.on('detail',function( id ){
            openDetail.show( id );
        })
    }
})
