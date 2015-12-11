define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require( 'common/widget/pagination/pagination' );
    var tpl = $( require( './template.html' ) );
    var CycDataTable = MClass( M.Center ).include( {
        tplCyc: _.template( tpl.filter( '#trCyc' ).html() ),
        PAGESIZE: 20,
        elements: {
            '#eaccount': 'eaccount',
            '#ename': 'ename',
            '#usc': 'usc',
            '#uec': 'uec',
            '#eename': 'eename',
            '#ust': 'ust',
            '#uet': 'uet',
            'tbody': 'tbody'
        },
        events: {
            'click #btnSearch': 'search',
            'click #btnDetail': 'detail'
        },
        init: function() {
            CycDataTable.__super__.init.apply( this, arguments );
            var me = this;
            me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager'),
                pageSize: me.PAGESIZE,
                pageNumber: 0
            });
            me.pagination.render();
            me.pagination.onChange = function() {
                me.load();
            };
            me.$ust.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var maxDate = me.$uet.val() ? me.$uet.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            } );
            me.$uet.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var minDate = me.$ust.val() ? me.$ust.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            } );
            me.collection = new M.Collection;
            me.load();
        },
        search: function() {
            this.pagination.attr['pageNumber'] = 0;
            this.load();
        },
        load: function() {
            var me = this;
            var data = {
                enterpriseAccount: me.$eaccount.val(),
                enterpriseName: me.$ename.val(),
                employeeName: me.$eename.val(),
                startCount: me.$usc.val(),
                endCount: me.$uec.val(),
                pageIndex: me.pagination.attr['pageNumber'],
                pageSize: me.pagination.attr['pageSize']
            };
            var startTime = me.$ust.val();
            var endTime = me.$uet.val();
            if ( startTime ) {
                data.startTime = new Date( startTime ).getTime();
            }
            if ( endTime ) {
                data.endTime = new Date( endTime ).getTime() + 1000 * 60 * 60 * 24;
            }
            util.api({
                url: '/query/querystatistice',
                data: data,
                beforeSend: function() {
                    me.$tbody.html( '<tr><td colspan="9"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {
                    if ( data.success ) {
                        console.log( data );
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload( data.value.model.content, function( item ) {
                            item.displayFirstQueryTime = new Date( item.firstQueryTime )._format( "yyyy-MM-dd hh:mm" );
                            item.displayLastQueryTime = new Date( item.lastQueryTime )._format( 'yyyy-MM-dd hh:mm' );
                        } );
                        var content = me.collection.all();
                        if ( content.length > 0 ) {
                            me.$tbody.html( me.tplCyc( {'content':me.collection.all() } ) );
                        } else {
                            me.$tbody.html( '<tr><td colspan="9"><p class="info">暂无数据</p></td></tr>' );
                        }
                    }
                },
                error: function() {
                    me.$tbody.html( '<tr><td colspan="9"><p class="info">数据加载失败</p></td></tr>' );
                }
            });
        }
    } );

    exports.init = function() {
        var $el = exports.$el;
        var cycDataTable = new CycDataTable( { 'view': $el.find( '.m-qry-cyc' ) } );
    }
} );