define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require( 'common/widget/pagination/pagination' );
    var tpl = $( require( './template.html' ) );
    var PartnerDataTable = MClass( M.Center ).include( {
        tplPartner: _.template( tpl.filter( '#trPartner' ).html() ),
        PAGESIZE: 20,
        elements: {
            '#dsName': 'name',
            '#dsMobile': 'mobile',
            '#dsStartTime': 'startTime',
            '#dsEndTime': 'endTime',
            '#dsTitle': 'title',
            '#dsCompany': 'company',
            '#dsProduct': 'product',
            '#dsIntention': 'intention',
            'tbody': 'tbody'
        },
        events: {
            'click #btnSearch': 'search',
            'click #btnExport': 'export'
        },
        init: function() {
            PartnerDataTable.__super__.init.apply( this, arguments );
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
            me.$startTime.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var maxDate = me.$endTime.val() ? me.$endTime.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            } );
            me.$endTime.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var minDate = me.$startTime.val() ? me.$startTime.val() : false;
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
        export: function() {
            var me = this;
            var startTime = me.$startTime.val();
            var endTime = me.$endTime.val();
            var sticks, eticks;
            if ( startTime ) {
                sticks = new Date( startTime ).getTime();
            }
            if ( endTime ) {
                eticks = new Date( endTime ).getTime() + 1000 * 60 * 60 * 24;
            }
            if ( sticks > eticks ) {
                alert( '开始时间大于结束时间, 请重新选择.' );
                return false;
            }
            var queryString = $.param({
                name: me.$name.val(),
                mobile: me.$mobile.val(),
                title: me.$title.val(),
                company: me.$company.val(),
                product: me.$product.val(),
                intention: me.$intention.val(),
                startTime: sticks,
                endTime: eticks
            });
            var url = location.protocol + '//' + location.host + IBSS.API_PATH + '/query/partner/export?' + queryString;
            window.open( url );
        },
        load: function() {
            var me = this;
            var startTime = me.$startTime.val();
            var endTime = me.$endTime.val();
            var sticks, eticks;
            if ( startTime ) {
                sticks = new Date( startTime ).getTime();
            }
            if ( endTime ) {
                eticks = new Date( endTime ).getTime() + 1000 * 60 * 60 * 24;
            }
            if ( sticks > eticks ) {
                alert( '开始时间大于结束时间, 请重新选择.' );
                return false;
            }
            util.api({
                url: '/query/partner/getpage',
                data: {
                    name: me.$name.val(),
                    mobile: me.$mobile.val(),
                    title: me.$title.val(),
                    company: me.$company.val(),
                    product: me.$product.val(),
                    intention: me.$intention.val(),
                    startTime: sticks,
                    endTime: eticks,
                    pageIndex: me.pagination.attr['pageNumber']+1,
                    pageSize: me.pagination.attr['pageSize']
                },
                beforeSend: function() {
                    me.$tbody.html( '<tr><td colspan="7"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {
                    if ( data.success ) {
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload( data.value.model.content, function( item ) {
                            item.displayCreateTime = new Date( item.createtime )._format( "yyyy-MM-dd hh:mm" );
                        } );
                        var content = me.collection.all();
                        if ( content.length > 0 ) {
                            me.$tbody.html( me.tplPartner( {'content':me.collection.all() } ) );
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
        var partnerDataTable = new PartnerDataTable( { 'view': $el.find( '.m-qry-partner' ) } );
    }
} );