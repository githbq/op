define( function( require, exports, module ) {
    var IBSS = window.IBSS;

    var tpl = $( require( './template.html' ) );

    var EnterpriseReportTable = MClass( M.Center ).include( {
        tplReport: _.template( tpl.filter( '#trReport' ).html() ),
        elements: {
            'tbody': 'tbody'
        },
        events: {
            'click #btnExport': 'export'
        },
        init: function() {
            EnterpriseReportTable.__super__.init.apply( this, arguments );
            var me = this;
            me.collection = new M.Collection;
            me.load();
        },
        generate: function( e ) {
            var me = this,
                target = e.currentTarget,
                month = $( target ).attr( 'data-id' );
            util.api({
                url: '/enterprise/monthreport/generate',
                data: { month: month },
                success: function( data ) {
                    if ( data.success ) {
                        me.load();
                    }
                }
            });
        },
        load: function() {
            var me = this;
            util.api({
                url: '/query/act/getmonth',
                data: { },
                beforeSend: function() {
                    me.$tbody.html( '<tr><td colspan="8"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {
                    if ( data.success ) {
                        me.collection.init( data.model );
                        var content = me.collection.all();
                        if ( content.length > 0 ) {
                            me.$tbody.html( me.tplReport( {'content':me.collection.all() } ) );
                        } else {
                            me.$tbody.html( '<tr><td colspan="8"><p class="info">暂无数据</p></td></tr>' );
                        }
                    } else {
                        me.$tbody.html( '<tr><td colspan="8"><p class="info">数据加载失败</p></td></tr>' );
                    }
                },
                error: function() {
                    me.$tbody.html( '<tr><td colspan="8"><p class="info">数据加载失败</p></td></tr>' );
                }
            });
        },

        generateCollection: function( collection ) {
            var result = [], me = this;
            var time = Date.parse( me.firstMonth + '/01 00:00:01' );
            for( var i = this.getMaxMonth(); i > time; ) {
                var d = new Date( i );
                result.push( { month: d._format( 'yyyyMM' ) } );
                d.setMonth( d.getMonth() - 1 );
                i = d.getTime();
            }
            $( collection ).each( function( i, item ) {
                $.extend( me.getListItem( result, item.month ), item );
            } );
            return result;
        },

        getListItem: function( list, key ) {
            var result;
            $( list ).each( function( i, item ) {
                if ( item.month == key ) { result = item; return result; }
            } );
            return result;
        },

        getMaxMonth: function() {
            var d = new Date();
            d.setMonth( d.getMonth() - 1 );
            return d.getTime();
        }
    } );

    exports.init = function() {
        var $el = exports.$el;
        new EnterpriseReportTable( { 'view': $el.find( '.m-act-rpt' ) } );
    }
} );