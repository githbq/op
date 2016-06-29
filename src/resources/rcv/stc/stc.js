define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
    
    var Pagination = require( 'common/widget/pagination/pagination' );
    var tpl = $( require( './template.html' ) );
    
    // 到款列表
    var StatisticList = MClass( M.Center ).include( {
        tplCode: _.template( tpl.filter( '#stcList' ).html() ),
        PAGESIZE: 20,
        elements: {
            '#startTime': 'startTime',
            '#endTime': 'endTime',
            '#departmentName': 'departmentName',
            'tbody': 'tbody'
        },
        events: {
            'click #export': 'export',
            'click #search': 'search',
            'keydown .timepicker': 'keydown'
        },
        init: function() {
            StatisticList.__super__.init.apply( this, arguments );
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
            });
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
            //me.$startTime.val( me.getDateString( -31 ) ); 
            //me.$endTime.val( me.getDateString( -1 ) );
            me.load();
        },
        search: function() {
            this.pagination.setPage( 0, false);
            this.load();
        },
        export: function() {
            var me = this;
            var data = me.getData();            
            var url = location.protocol + '//' + location.host + '/op/api/a/odr/receivedpay/exportReceivedPayStatistics?' + $.param( data );
            //location.protocol + '//' + location.host + '/op/api/a/odr/receivedpay/exportReceivedPay?' + $.param( data )
            window.open( url, '_self' );
        },
        keydown: function(e) {//只能删除不能输入
            if(e.keyCode == 46||e.keyCode == 8){
                $(e.currentTarget).attr('readOnly',false);
            }else{
                $(e.currentTarget).attr('readOnly','readOnly');
            }
        },
        getData: function(){
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
            return {
                departmentName: me.$departmentName.val(),
                startTime: sticks,
                endTime: eticks,
                // pageIndex: me.pagination.attr['pageNumber']+1,
                // pageSize: me.pagination.attr['pageSize']
            }
        },
        load: function() {
            var me = this;
            
            
            var data = $.extend(me.getData(),{
                pageIndex: me.pagination.attr['pageNumber']+1,
                pageSize: me.pagination.attr['pageSize']
            });
            util.api({
                url: '~/op/api/a/odr/receivedpay/queryStatistics',
                data: data,
                beforeSend: function() {
                    me.$tbody.html( '<tr><td colspan="7"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {
                    if ( data.success ) {

                        me.pagination.setTotalSize( data.value.model.page.itemCount );
                        me.collection.reload( data.value.model.page.content, function( item ) {
                        } );
                        var content = me.collection.all();
                        if ( content.length > 0 ) {
                            var total = data.value.model.total;
                            var tr = '<tr><td>' + total.departmentName
                            + '</td><td>' + total.totalAmount
                            + '</td><td>' + total.claimedAmount                        
                            + '</td><td>' + total.unclaimedAmount
                            + '</td></tr>';
                            me.$tbody.html( tr + me.tplCode( {'content':me.collection.all() } ) );
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
    });

    exports.init = function() {
        var $el = exports.$el;
        var statisticList = new StatisticList( { 'view': $el.find( '.m-received-statistic' ) } );
    }
} );