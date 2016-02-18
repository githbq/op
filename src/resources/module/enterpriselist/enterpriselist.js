/**
 * index.html 支持人员企业列表
 * 企业列表
 */
 
define( function(require, exports, module){

    var Pagination = require( 'common/widget/pagination/pagination' );
    
    var tpl = $( require( './template.html' ) );
    var viewStr = require('./enterpriselist.html');

    //产品状态
    var PSTATUS_MAP = {};

    //付费状态
    var PAYED_MAP = {
        '0': '否',
        '1': '是'
    };

    //活跃度
    var ACTIVITY_MAP = {};

    var EntLst = MClass( M.Center ).include( {
        
        tplPartner: _.template( tpl.filter( '#trEntLst' ).html() ),
        
        PAGESIZE: 20,

        view: viewStr,

        elements: {
            '#eiSource': 'source',       //来源
            '#eiProvince': 'province',   //省市
            '#eiPStatus': 'pstatus',     //产品状态
            '#eiIndustry': 'industry',   //行业
            '#eiActivity': 'activity',   //活跃度
            '.header-info': 'headerInfo',
            'tbody': 'tbody'             //
        },
        
        events: {
            'click #btnSearch': 'search',
            'click .info-detail': 'detailEve',
            'click .info-trace': 'traceEve'
        },
        
        init: function() {
            EntLst.__super__.init.apply( this, arguments );
            var me = this;

            me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager'),
                pageSize: me.PAGESIZE,
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

            if( me.attrs['param'] && ( me.attrs['param'].length > 0 ) ){
                var param = me.attrs['param'];
                if( param.charAt(0) == 'p' ){
                    param = param.slice(1);
                    me.attrs['productId'] = param;
                                    //获取产品列表
                    util.api({
                        'url': '/product/querypage',
                        'data':{
                            'isPage': 1
                        },
                        'success': function( data ){
                            console.warn( data );
                            if( data.success ){
                                var pStr = "";
                                data.value.model.content.forEach(function(item){
                                    if( item.id == me.attrs['productId'] ){
                                        pStr = '(' + item.name + '(' + item.deviceMaxCount + '终端)：' + '终端' + item.deviceMaxCount + '个/一次性赠送短信' + item.textMessageCount + '条/' + item.storage + ')';
                                    }
                                });
                                me.$headerInfo.text( pStr );     
                            }
                        }
                    });
                } else {
                    param = param.slice(1);
                    me.model.set('agentId',param);
                }
            }

            //初始化
            me.initializeSelect();
        },

        initializeSelect: function() {
            var me = this;

            var state = 0;


            generateSelect( 'ENT_LST_SOURCE', this.$source );
            generateSelect( 'PROVINCE', this.$province );
            generateSelect( 'ENT_LST_PSTS', this.$pstatus );
            generateSelect( 'INDUSTRY', this.$industry );
            generateSelect( 'ENT_LST_ACTIVITY', this.$activity );
            generateSelect( 'OPEN_VERSION_NUM', this.$('#servicecost'));


            function generateSelect( name , $select ){
                util.getEnums( name, function( data ) {
                    var items = data.model, options = '';
                    items.forEach( function( item , index){
                        options += '<option value="' + item.value + '" title="' + item.text + '">' + item.text + '</option>';
                        switch( name ){
                            case 'ENT_LST_PSTS':
                                PSTATUS_MAP[item.value] = item.text;
                                break;
                            case 'ENT_LST_ACTIVITY':
                                ACTIVITY_MAP[item.value] = item.text;
                                break;
                        }

                    });

                    $select.append( options );
                    state = state + 1;
                    if( state > 5 ){

                        me.getList();
                    }
                });
            }
        },

        //默认置为第一页 搜索
        search: function() {
            this.pagination.attr['pageNumber'] = 0;
            this.getList();
        },

        //获取数据
        getList: function() {
            var me = this;

            util.api({
                url: '/enterprise/querypage',
                data: {
                    ea: me.model.get('ea'),
                    ename: me.model.get('ename'),
                    mobile: me.model.get('mobile'),
                    city: me.model.get('city'),
                    pstatus: me.model.get('pstatus'),
                    fstatus: me.model.get('fstatus'),
                    province: me.model.get('province'),
                    industry: me.model.get('industry'),
                    source: me.model.get('source'),
                    activity: me.model.get('activity'),
                    productId: me.model.get('productId'),
                    agentId: me.model.get('agentId'),
					accountName:me.model.get('accountName'),
                    personCount: me.model.get('personCount'),
                    productId: me.attrs['productId'],
                    pageIndex: me.pagination.attr['pageNumber'],
                    pageSize: me.pagination.attr['pageSize']
                },
                beforeSend: function() {
                    me.$tbody.html( '<tr><td colspan="11"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {

                    if ( data.success ) {
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload( data.value.model.content, function( item ) {
                            item.runStatusStr = PSTATUS_MAP[item.runStatus];
                            item.isPayedStr = PAYED_MAP[item.isPayed];
                            item.activityStr = ACTIVITY_MAP[item.activity] || '无';
                        });
                    }
                },
                error: function() {
                    me.$tbody.html( '<tr><td colspan="11"><p class="info">数据加载失败</p></td></tr>' );
                }
            });
        },

        //渲染数据
        renderList: function(){
            var me = this;

            var content = me.collection.all();
            if( content.length > 0 ){
                me.$tbody.html( me.tplPartner( {'content':content} ) );
            } else {
                me.$tbody.html( '<tr><td colspan="11"><p class="info">暂无数据</p></td></tr>' );
            }
        },

        //查看详情
        detailEve: function(e){
            var id = $( e.currentTarget ).attr('data-id'),
                status = $( e.currentTarget ).attr('data-status');
            this.trigger( 'detail', id , status);
        },

        //企业跟踪记录
        traceEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');

            this.trigger( 'trace', id );
        },

        //渲染至页面
        render: function(){
            this.attrs['wrapper'].html( this.$view );
        }

    } );

    module.exports = EntLst;
});
