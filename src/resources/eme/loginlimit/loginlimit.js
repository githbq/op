define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require( 'common/widget/pagination/pagination' );
    var Slider = require( 'common/widget/slider/slider' );


    var tpl = $( require( './template.html' ) );

    
    var AccountDetail = MClass( Slider ).include({
        defaultAttr:{
            'title': '查看详情',
            'width': 600
        },
        content: tpl.filter('#accountDetail').html(),
		tplEme: _.template( tpl.filter( '#trloglist' ).html() ),
		tplStopLog: _.template( tpl.filter( '#trstoplist' ).html() ),
        elements: {
            '.operating-log tbody': 'operatingTbody',
			'.stop-log tbody': 'stopTbody'
        },
		events: {
            'click #saveLimit': 'saveLimeitEve'
        },
        init: function(){
            AccountDetail.__super__.init.apply( this, arguments );
            var me = this;
			
			me.operatingPagination = new Pagination({
                wrapper: me.$view.find('.operating-list-pager'),
                pageSize: 20,
                pageNumber:0
            });
            me.operatingPagination.render();
            me.operatingPagination.onChange = function() {
                me.load();
            };
            me.operatingaCollection = new M.Collection;
			
			me.stopPagination = new Pagination({
                wrapper: me.$view.find('.stop-list-pager'),
                pageSize: 20,
                pageNumber:0
            });
            me.stopPagination.render();
            me.stopPagination.onChange = function() {
                me.load();
            };
            me.stopCollection = new M.Collection;
          
        },
		saveLimeitEve:function(){
			var me = this;
			 util.api({
                'url': '/useraccount/updateregisterenterpriselimit',
                'data': {
                    'mobile': me.mobile,
					'registerLimit':me.$('.limit').val()
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        util.showTip( '可注册企业上限修改成功！' );
						me.load();
						me.trigger('updateLimit');
                    }
                }
            })
		},

        show: function( mobile, limit ,usedcount ){
            AccountDetail.__super__.show.apply( this, arguments );
            var me = this;
			me.mobile = mobile;
			me.model.set('mobile',mobile);
            me.model.set('limit',limit);
            me.model.set('usedcount',usedcount);
			me.load();
            
        },
		load:function(){
			var me = this;
			//操作日志
			util.api({
                url: '/useraccount/querypageregisterenterpriselog',
                data: {
                    mobile: me.mobile,
					pageIndex: me.operatingPagination.attr['pageNumber']+1,
                    pageSize: me.operatingPagination.attr['pageSize']
                },
                beforeSend: function() {
                    me.$operatingTbody.html( '<tr><td colspan="5"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {

                    if ( data.success ) {
                        me.operatingPagination.setTotalSize( data.value.model.itemCount );
						data.value.model.content.forEach( function( item ){
								item.createTimeStr = new Date( item.createTime )._format('yyyy-MM-dd hh:mm');
						});
                        me.operatingaCollection.init( data.value.model.content );

                        var content = me.operatingaCollection.all();
                        if ( content.length > 0 ) {
                            me.$operatingTbody.html( me.tplEme( {'content':me.operatingaCollection.all() } ) );
                        } else {
                            me.$operatingTbody.html( '<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>' );
                        }
                    }else{
						me.$operatingTbody.html( '<tr><td colspan="5"><p class="info">数据加载失败</p></td></tr>' );
					}
                },
                error: function() {
                    me.$operatingTbody.html( '<tr><td colspan="5"><p class="info">数据加载失败</p></td></tr>' );
                }
            });
			
			//拦截日志
			util.api({
                url: '/useraccount/querypageinterceptregisterenterpriselog',
                data: {
                    mobile: me.mobile,
					pageIndex: me.stopPagination.attr['pageNumber']+1,
                    pageSize: me.stopPagination.attr['pageSize']
                },
                beforeSend: function() {
                    me.$stopTbody.html( '<tr><td colspan="5"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {

                    if ( data.success ) {
                        me.stopPagination.setTotalSize( data.value.model.itemCount );
						data.value.model.content.forEach( function( item ){
								item.intercepttimeStr = new Date( item.intercepttime )._format('yyyy-MM-dd hh:mm');
						});
                        me.stopCollection.init( data.value.model.content );

                        var content = me.stopCollection.all();
                        if ( content.length > 0 ) {
                            me.$stopTbody.html( me.tplStopLog( {'content':me.stopCollection.all() } ) );
                        } else {
                            me.$stopTbody.html( '<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>' );
                        }
                    }else{
						me.$stopTbody.html( '<tr><td colspan="5"><p class="info">数据加载失败</p></td></tr>' );
					}
                },
                error: function() {
                    me.$stopTbody.html( '<tr><td colspan="5"><p class="info">数据加载失败</p></td></tr>' );
                }
            });
		},
        
        hide: function(){
            var me = this;
            me.model.clear();
            AccountDetail.__super__.hide.apply( this, arguments );
        }
    });


    var LoginLimitTable = MClass( M.Center ).include( {
        tplEme: _.template( tpl.filter( '#trEme' ).html() ),
        PAGESIZE: 20,
        elements: {
            '#elMobile': 'mobile',
            'tbody': 'tbody'
        },
        events: {
            'click #btnSearch': 'search',
            'click .accountdetail': 'accountDetailEve'
        },
        init: function() {
            LoginLimitTable.__super__.init.apply( this, arguments );
            var me = this;
            me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager'),
                pageSize: me.PAGESIZE,
                pageNumber:0
            });
            me.pagination.render();
            me.pagination.onChange = function() {
                me.load();
            };
            me.collection = new M.Collection;
			me.load();
        },


        accountDetailEve: function( e ){
            var me = this;

            var mobile = $( e.currentTarget ).attr('data-mobile'),
				limit = $( e.currentTarget ).attr('data-limit'),
				usedcount = $( e.currentTarget ).attr('data-usedcount');

            me.trigger('accountdetail', mobile, limit ,usedcount);
        },
        search: function() {
            this.pagination.attr['pageNumber'] = 0;
            this.load();
        },
        load: function() {
            var me = this;
		
            util.api({
                url: '/useraccount/querypageregisterenterprise',
                data: {
                    mobile: me.$mobile.val(),
                    pageIndex: me.pagination.attr['pageNumber']+1,
                    pageSize: me.pagination.attr['pageSize']
                },
                beforeSend: function() {
                    me.$tbody.html( '<tr><td colspan="6"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {

                    if ( data.success ) {
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.init( data.value.model.content );

                        var content = me.collection.all();
                        if ( content.length > 0 ) {
                            me.$tbody.html( me.tplEme( {'content':me.collection.all() } ) );
                        } else {
                            me.$tbody.html( '<tr><td colspan="6"><p class="info">暂无数据</p></td></tr>' );
                        }
                    }else{
						me.$tbody.html( '<tr><td colspan="6"><p class="info">数据加载失败</p></td></tr>' );
					}
                },
                error: function() {
                    me.$tbody.html( '<tr><td colspan="6"><p class="info">数据加载失败</p></td></tr>' );
                }
            });
        }
    } );

    exports.init = function() {
        var $el = exports.$el;
        var loginLimitTable = new LoginLimitTable( { 'view': $el.find( '.m-eme-joinlimit' ) } );
 
        var accountDetail = new AccountDetail();

        loginLimitTable.on('accountdetail',function( mobile, limit ,usedcount ){
            accountDetail.show( mobile, limit ,usedcount );
        });
		accountDetail.on('updateLimit',function(){
            loginLimitTable.load();
        });
    }
} );