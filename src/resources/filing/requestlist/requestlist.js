define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

   	var Pagination = require('common/widget/pagination/pagination');
    var Slider = require('common/widget/slider/slider');
    var Tem = $( require('./template.html') );



    var requestMap = {};       //申请状态map
        filingStatusMap = {};  //备案企业状态

    var RequestList = MClass( M.Center ).include({
    	
        trTpl: _.template( Tem.filter('#requesttr').html() ),
        init: function(){
    		RequestList.__super__.init.apply( this,arguments );
    		var me = this;

            if( me.attrs['name'] ){
                me.model.set('enterpriseFilingName', me.attrs['name'])
                me.$headerTitle.text( '(' + me.attrs['name'] +')' ); 
            };

            if( me.attrs['id'] ){
                me.model.set('enterpriseFilingId', me.attrs['id']);
            };



    		me.pagination = new Pagination({
    			'wrapper': me.$view.find('.list-pager'),
    			'pageNumber': 0,
    			'pageSize': 20
    		});
    		me.pagination.render();
    		me.pagination.onChange = function(){
    			me.getList();
    		}


    		me.collection = new M.Collection;
    		me.collection.on('reload',function(){
    			me.renderList();
    		});

    		me.getEnums();
            me.$startTime.datetimepicker({'timepicker': false,'format':'Y-m-d'});
            me.$endTime.datetimepicker({'timepicker': false,'format':'Y-m-d'});
    	},
    	elements:{
    		'tbody': 'tbody',
            '.reqStatus': 'reqStatus',
            '.startTime': 'startTime',
            '.endTime': 'endTime',
            '.header-title': 'headerTitle'
    	},
        events:{
            'click .search': 'searchEve',
            'click .detail': 'detailEve'
        },

        //查看申请详情
        detailEve: function(e){
            var id = $( e.currentTarget ).attr('data-id');
            this.trigger( 'detail',id );
        },

        searchEve: function(){
            this.pagination.setPage(0,false);
            this.getList();
        },

        //获取申请状态
        getEnums: function(){
            var me = this;
            
            var reqList = [ {'name':'全部','value': ''} ];
            var state = {
                'a': false,
                'b': false
            };
            function check(){
                if( state.a && state.b ){
                    me.getList();
                }
            }


            util.getEnums('FILING_REQUEST_STATUS',function( data ){
                data.value.model.forEach( function( item ){
                    
                    reqList.push( {'name':item.text,'value':item.value} );
                    requestMap[ item.value ] = item.text;
                })
                util.resetSelect( me.$reqStatus, reqList );
                state.a = true;
                check();
            });

            util.getEnums('FILING_STATUS',function( data ){

                data.value.model.forEach( function( item ){
                    filingStatusMap[ item.value ] = item.text;
                })
                state.b = true;
                check();
            });
        },

    	getList: function(){
    		var me = this;

            var startTime = '',
                endTime = '';

            if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() ).getTime();
            }
            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() ).getTime();
            }

    		util.api({
    			'url':'/enterprisefiling/queryrequest',
    			'data':{
                    'vendorId': me.model.get('vendorId'),
                    'enterpriseFilingId': me.model.get('enterpriseFilingId'),
                    'enterpriseFilingName': me.model.get('enterpriseFilingName'),
                    'status': me.model.get('status'),
                    'startTime': startTime,
                    'endTime': endTime,
                    'openBatch': me.model.get('openBatch'),
    				'pageIndex': me.pagination.attr['pageNumber']+1,
    				'pageSize': me.pagination.attr['pageSize']
    			},
    			'success': function( data ){
    				console.warn( data );
                    if( data.success ){
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload( data.value.model.content ,function(item){
                            item.createTimeStr = new Date( item.createTime )._format('yyyy-MM-dd hh:mm');
                            item.statusStr = requestMap[item.status];
                        });
                    }
    			}
    		})
    	},

    	renderList: function(){
    		var me = this;

            var collection = me.collection.all();
            var htmlStr = '<tr><td colspan="8"><p class="info">暂无数据</p></td></tr>';

            if( collection.length > 0 ){
                htmlStr = me.trTpl( {'content':collection} );
            }
            me.$tbody.html( me.trTpl({'content':collection}) );
            IBSS.tplEvent.setPermissions( me.$tbody );
    	}
    });
    
    /** 
     * 申请详情
     */
    var ReqDetail = MClass( Slider ).include({
        init: function(){
            var me = this;
            ReqDetail.__super__.init.apply( this, arguments );


            me.$startTime.datetimepicker( {'timepicker': false,'format':'Y-m-d'} );
            me.$endTime.datetimepicker( {'timepicker': false,'format':'Y-m-d'} );

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

        },

        content: Tem.filter('#reqdetail').html(),
        
        trTpl: _.template( Tem.filter('#reqTr').html() ),
        
        defaultAttr: {
            'title': '公开备案企业申请详情',
            'width': 600
        },
        
        elements: {
            'tbody': 'tbody',
            '.startTime': 'startTime',
            '.endTime': 'endTime'
        },
        
        events: {
            'click .search': 'searchEve',
            'click .attachement': 'downloadAttacheMentEve',
            'click .action-return': 'hide',
            'click .action-beian': 'beianEve',
            'click .action-bohui': 'bohuiEve',
            'click .beian-submit': 'beianSubmitEve',
            'click .bohui-submit': 'bohuiSubmitEve'
        },
        
        //查询附件列表
        searchEve: function(){
            this.pagination.setPage( 0,false );
            this.getList();
        },

        //备案
        beianEve: function(){
            var me = this;
            me.$('.state').hide();
            me.$('.state-beian').show();
        },
        beianSubmitEve: function(){
            var me = this;
            util.api({
                'url': '/enterprisefiling/passrequest',
                'data': {
                    'enterpriseFilingRequestId': me.model.get('id'),
                    'comments': me.model.get('beianRemark')
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        util.showTip('备案成功');
                        me.hide();
                        me.trigger('update');
                    }
                }
            })
        },

        //驳回
        bohuiEve: function(){
            var me = this;
            me.$('.state').hide();
            me.$('.state-bohui').show();
        },
        bohuiSubmitEve: function(){
            var me = this;
            util.api({
                'url': '/enterprisefiling/rejectrequest',
                'data': {
                    'enterpriseFilingRequestId': me.model.get('id'),
                    'comments': me.model.get('bohuiRemark')
                },
                success: function( data ){
                    console.warn( data );
                    if( data.success ){
                        util.showTip('驳回成功');
                        me.hide();
                        me.trigger('update');
                    }
                }
            })
        },

        getList: function(){
            var me = this;

            var startTime = '',
                endTime = '';

            if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() ).getTime();
            }

            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() ).getTime();
            }

            util.api({
                'url':'/enterprisefiling/queryattachment',
                'data':{
                    'enterpriseFilingRequestId': me.model.get('id'),
                    'attachmentName': me.model.get('search-name'),
                    'startTime': startTime,
                    'endTime': endTime,
                    'pageIndex': me.pagination.attr['pageNumber'],
                    'pageSize': me.pagination.attr['pageSize']
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload(data.value.model.content,function(item){
                            item.createTimeStr = new Date( item.createTime )._format('yyyy-MM-dd hh:mm');
                            item.attachmentSizeStr = util.getFileSize( item.attachmentSize );
                        });
                    }
                }
            })
        },

         //下载附件
        downloadAttacheMentEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            window.open( IBSS.API_PATH + '/enterprisefiling/downloadattachement?attachementId=' + id );
        },

        renderList: function(){
            var me = this;
            var collection = me.collection.all();

            me.$tbody.html( me.trTpl( {'content': collection} ) );
        },

        show: function( id ){

            var me = this;
            me.model.set('id',id);
            util.api({
                'url': '/enterprisefiling/getrequest',
                'data': {
                    'enterpriseFilingRequestId': id
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.model.load( data.value.model );
                        me.model.set('statusStr', requestMap[ me.model.get('status')] );
                        me.model.set('enterpriseFilingStatusStr', filingStatusMap[ me.model.get('enterpriseFilingStatus') ] );
                        me.model.set('checkPerson', me.model.get('approver').name );
                        me.model.set('checkTime', new Date( me.model.get('approveTime') )._format('yyyy-MM-dd hh:mm') );

                        me.searchEve();
                        if( me.model.get('status') == 1 ){
                            me.$('.action-beian').show();
                            me.$('.action-bohui').show();
                        } else {
                            me.$('.detail-check').show();
                        }
                    }
                }
            });

            ReqDetail.__super__.show.apply( this,arguments );
        },

        hide: function(){

            var me = this;
            me.model.clear();
            me.$('.state').hide();
            ReqDetail.__super__.hide.apply( this,arguments );
        }
    })

    exports.init = function( param ){
    	var $el = exports.$el;

    	var requestList = new RequestList( { 'view':$el.find('.m-requestlist'), 'id': param && param[0] ,'name': param && param[1] } );
        var reqDetail = new ReqDetail();

        requestList.on('detail',function( id ){
            reqDetail.show( id );
        });

        reqDetail.on('update',function(){
            requestList.searchEve();
        });
    }
})
