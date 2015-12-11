define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        tpl = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
    var ReqDetail = require('module/reqdetail/reqdetail');
    var tem = $( require('./template.html') );

    var filingStatusMap = tpl.filingStatusMap = {},   //企业状态
        requestStatusMap = tpl.requestStatusMap = {};  //申请状态

    /**
     * 公开企业申请记录
     *
     */
    var EntpriseReq = MClass( M.Center ).include({

        trTpl: _.template( tem.filter('#reqlist').html() ),
    	init: function(){
    		EntpriseReq.__super__.init.apply( this,arguments );
    		var me = this;

            me.$startTime.datetimepicker( {'timepicker': false,'format':'Y-m-d'} );
            me.$endTime.datetimepicker( {'timepicker': false,'format':'Y-m-d'} );

            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            })
    		me.pagination.render();
            me.pagination.onChange = function(){
                me.getList();
            }

            me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });

            me.getEnums();
    	},
        
        elements:{
            'tbody': 'tbody',
            '.status': 'status',
            '.requeststatus': 'requeststatus',
            '.filingstatus': 'filingstatus',
            '.startTime': 'startTime',
            '.endTime': 'endTime'
        },

        events:{
            'click .requestdetail': 'detailEve',
            'click .search': 'searchEve'
        },

        //查询
        searchEve: function( e ){
            this.pagination.setPage( 0,false );
            this.getList();
        },

        //获取枚举值
        getEnums: function(){
            var me = this;

            var state = {
                'a': false,
                'b': false
            }

            function check(){
                if( state['a'] && state['b'] ){
                    me.getList();
                }
            }

            var filingStatusList = [{'name':'全部','value':''}];
            util.getEnums('FILING_STATUS',function(data){
                if( data.success ){

                    state['a'] = true;
                    data.value.model.forEach(function( item, index){
                       filingStatusMap[ item.value ] = item.text;
                       filingStatusList.push( {'name':item.text,'value':item.value} );
                    });


                    util.resetSelect( me.$filingstatus, filingStatusList );
                    check();
                }
            });

            var requestStatusList = [{'name':'全部','value':''}];

            util.getEnums('FILING_REQUEST_STATUS',function(data){
                if( data.success ){

                    state['b'] = true;
                    data.value.model.forEach(function( item, index){
                       requestStatusMap[ item.value ] = item.text;
                       requestStatusList.push( {'name':item.text,'value':item.value} );
                    });


                    util.resetSelect( me.$requeststatus, requestStatusList );
                    check();
                }
            });
        },
        
        //获取列表
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
                    'vendorId': IBSS.role_vendorId,
                    'enterpriseFilingName': me.model.get('enterpriseFilingName'),
                    'status': me.model.get('requestStatus'),
                    'enterpriseFilingStatus': me.model.get('filingStatus'),
                    'startTime': startTime,
                    'endTime': endTime,
                    'pageIndex': me.pagination.attr['pageNumber'],
                    'pageSize': me.pagination.attr['pageSize']
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload( data.value.model.content ,function( item ){

                            item.requestStatusStr = requestStatusMap[item.status];
                            item.filingStatusStr = filingStatusMap[item.enterpriseFilingStatus];
                            item.createTimeStr = new Date( item.createTime )._format('yyyy-MM-dd hh:mm');
                        });
                    }
                }
            })
    	},
    	renderList: function(){
            var me = this;

            var collection = me.collection.all();
            var htmlStr;

            if( collection.length > 0 ){

                htmlStr = me.trTpl( {'content': me.collection.all()} );
            }else{

                htmlStr = '<tr><td colspan="6"><p class="info">暂无数据</p></td></tr>'
            }

            me.$tbody.html( htmlStr );
    	},

        //查看申请记录详情
        detailEve: function(e){
            
            var id = $( e.currentTarget ).attr('data-id');
            this.trigger( 'detail', id );
        }
    });
    
    exports.init = function() {
        var $el = exports.$el;
		
        var entpriseReq = new EntpriseReq( {'view': $el.find('.m-entprisereq')} );
        var reqDetail = new ReqDetail();

        entpriseReq.on('detail',function( id ){
            reqDetail.show( id );
        });
    }
} );

