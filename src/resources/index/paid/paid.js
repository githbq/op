define( function( require, exports, module ) {
    var IBSS = window.IBSS;

    var tpl = $( require( './template.html' ) );

    var ActPaid = MClass( M.Center ).include( {
        tplSearch: _.template( tpl.filter( '#actCountResult' ).html() ),
        tplGenerate: _.template( tpl.filter( '#actGenerateResult' ).html() ),
        elements: {
            '#alIndustry': 'industry',
            '#alPModule': 'pModule',
            '#alSource': 'source',
            '#alCode': 'code',
            '#alCST': 'cst',
            '#alCET': 'cet',
            '#alListType': 'listType',
            '#alList': 'list',
            '#btnSearch': 'search',
            '.list-content': 'result'
        },
        events: {
            'click #btnSearch': 'search',
            'click #btnClear': 'clear',
            'click #btnReset': 'reset',
            'click #btnGenerate': 'generate',
            'click #btnDownload': 'download'
        },
        init: function() {
            ActPaid.__super__.init.apply( this, arguments );
            var me = this;
            me.initializeDatepicker();
            me.collection = new M.Collection;
            me.initializeSelect();

            me.$cst.val( util.getDateStr(-30) );
            me.$cet.val( util.getDateStr(-1) );
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
        },
        initializeSelect: function() {
            util.getIndustry( this.$industry );
            this.generateSelect( 'PRODUCT_MODULE', this.$pModule );
            this.generateSelect( 'ENT_LST_SOURCE', this.$source );
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
        clear: function() {
            this.$code.val( '' );
            this.$cst.val( '' );
            this.$cet.val( '' );
            this.$list.val( '' );
            this.$result.html( '' );
        },
        reset: function() {
            this.$industry.val( '' );
            this.$pModule.val( '' );
            this.$source.val( '' );
            this.$code.val( '' );
            this.$cst.val( '' );
            this.$cet.val( '' );
            this.$listtype.val( '1' );
            this.$list.val( '' );
            this.$result.html( '' );
        },
        search: function() {
            var me = this;
            var data = {
                industry: me.$industry.val(),
                pm: me.$pModule.val(),
                code: me.$code.val(),
                source: me.$source.val()
            };
            if ( me.$cst.val() ) {
                data.cst = new Date( me.$cst.val() ).getTime();
            }
            if ( me.$cet.val() ) {
                data.cet = new Date( me.$cet.val() ).getTime();
            }
            if ( me.$list.val() ) {
                data.listType = me.$listType.val();
                data.list = me.$list.val();
            }
            me.$result.html( '' );
            me.$search.attr( 'disabled', 'disabled' );
            me.$search.addClass( 'disable' );
            util.api({
                url: '/query/paid/count',
                data: data,
                success: function( data ) {
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
        generate: function() {
            var me = this;
            var data = {
                industry: me.$industry.val(),
                pm: me.$pModule.val(),
                code: me.$code.val(),
                source: me.$source.val()
            };
            if ( me.$cst.val() ) {
                data.cst = new Date( me.$cst.val() ).getTime();
            }
            if ( me.$cet.val() ) {
                data.cet = new Date( me.$cet.val() ).getTime();
            }
            if ( me.$list.val() ) {
                data.listType = me.$listType.val();
                data.list = me.$list.val();
            }
            var $generate = me.$result.find( '#btnGenerate' ),
                $download = me.$result.find( '#btnDownload' ),
                $console = me.$result.find( '#console' );
            $generate.addClass( 'disable' );
            $generate.attr( 'disabled', 'disabled' );
            $download.addClass( 'invisiable' );
            util.api({
                url: '/query/paid/generate',
                data: data,
                success: function( data ) {
                    if ( data.success ) {
                        var model = data.value.model;
                        model.dst = new Date( model.startTime )._format( 'yyyy-MM-dd hh:mm:ss' );
                        model.dct = new Date( model.completeTime )._format( 'yyyy-MM-dd hh:mm:ss' );
                        $console.append( me.tplGenerate({ value: model }) );
                        $download.attr( 'data-path', $.parseJSON( model.gPath ).path );
                        $download.removeClass( 'invisiable' );
                    }
                },
                complete: function() {
                    $generate.removeClass( 'disable' );
                    $generate.removeAttr( 'disabled' );
                }
            });

        },
        download: function( e ) {
            var target = e.currentTarget,
                path = $( target ).attr( 'data-path' );
            var url = location.protocol + '//' + location.host + IBSS.API_PATH + '/query/paid/download?path=' + path;
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
        var actPaid = new ActPaid( { 'view': $el.find( '.m-act-paid' ) } );
    }
} );