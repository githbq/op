define( function( require, exports, module ) {
    var IBSS = window.IBSS;

    var tpl = $( require( './template.html' ) );

    var ExpLst = MClass( M.Center ).include( {
        tplSearch: _.template( tpl.filter( '#expCountResult' ).html() ),
        elements: {
            '#source': 'source',
            '#province': 'province',
            '#city': 'city',
            '#cst': 'cst',
            '#cet': 'cet',
            '#btnSearch': 'search',
            '.list-content': 'result'
        },
        events: {
            'click #btnSearch': 'search',
            'click #btnDownload': 'download'
        },
        init: function() {
            ExpLst.__super__.init.apply( this, arguments );
            var me = this;
            me.initializeDatepicker();
            me.collection = new M.Collection;
            me.initializeSelect();
        },
        initializeDatepicker: function() {
            var me = this;
            me.$cst.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var maxDate = me.$cet.val() ? me.$cet.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            } );
            me.$cet.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var minDate = me.$cst.val() ? me.$cst.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            } );
            me.$cst.val( me.getDateString( -8 ) );
            me.$cet.val( me.getDateString( -1 ) );
        },
        initializeSelect: function() {
            this.generateSelect( 'DEMO_SOURCE', this.$source );
        },
        generateSelect: function( name, $select, callback ) {
            util.getEnums( name, function( data ) {
                var items = data.model, options = '';
                $( items ).each( function( i, item ) {
                    options += '<option value="' + item.value + '" title="' + item.text + '">' + item.text + '</option>';
                });
                $select.append( options );
                callback && callback( items );
            });
        },
        search: function() {
            var me = this;
            var data = {
                source: me.$source.val(),
                province: me.$province.val(),
                city: me.$city.val()
            };
            if ( me.$cst.val() ) {
                data.startTime = new Date( me.$cst.val() ).getTime();
            }
            if ( me.$cet.val() ) {
                data.endTime = new Date( me.$cet.val() ).getTime();
            }
            me.$result.html( '' );
            me.$search.attr( 'disabled', 'disabled' );
            me.$search.addClass( 'disable' );
            util.api({
                url: '/query/getdemoaccountrecordcount',
                data: data,
                success: function( data ) {console.log(data);
                    if ( data.success ) {
                        var model = data.value.model;
                        model.dst = new Date( model.startTime )._format( 'yyyy-MM-dd hh:mm:ss' );
                        model.dct = new Date( model.completeTime )._format( 'yyyy-MM-dd hh:mm:ss' );
                        me.$result.html( me.tplSearch({ value: model }) );
                    }
                },
                complete: function() {
                    me.$search.removeClass( 'disable' );
                    me.$search.removeAttr( 'disabled' );
                }
            });
        },
        download: function( e ) {
            var me = this;
            var data = {
                source: me.$source.val(),
                province: me.$province.val(),
                city: me.$city.val()
            };
            if ( me.$cst.val() ) {
                data.startTime = new Date( me.$cst.val() ).getTime();
            }
            if ( me.$cet.val() ) {
                data.endTime = new Date( me.$cet.val() ).getTime();
            }
            var params = $.param( data );
            var url = location.protocol + '//' + location.host + IBSS.API_PATH + '/query/exportdemoaccountrecorddata?' + params;
            window.open( url );
        },
        getDateString: function( offset, base ) {
            var date = this.getDate( offset, base );
            return util.formatDate( date, 'YYYY-MM-dd' );
        },
        getDate: function( offset, base ) {
            if ( !base ) {
                base = new Date().getTime();
            }
            if ( offset ) {
                return base + offset * 24 * 3600 * 1000;
            }
            return base;
        }
    } );

    exports.init = function() {
        var $el = exports.$el;
        var expLst = new ExpLst( { 'view': $el.find( '.m-qry-exp' ) } );
    }
} );