/**
 *
 * 综合查询
 */
define( function(require, exports, module){

	var Pagination = require( 'common/widget/pagination/pagination' );
    var InputHandler = require('common/widget/input-handler/inputhandler');
    var Select = require('common/widget/select/select');

    var viewStr = require('./query.html');
    var tpl = $( require( './template.html' ) );

    var QryCmpList = MClass( M.Center ).include( {
        tplSearch: _.template( tpl.filter( '#cmpCountResult' ).html() ),
        tplGenerate: _.template( tpl.filter( '#cmpGenerateResult' ).html() ),
        elements: {
            '#qcIndustry': 'industry',
            '#qcPModule': 'pModule',
            '#qcSource': 'source',
            '#qcFStatus': 'fstatus',
            '#qcAct': 'activity',
            '#qcSb': 'sb',
            '#qcCode': 'code',
            '#qcATBegin': 'atBegin',
            '#qcATEnd': 'atEnd',
            '#qcOTBegin': 'otBegin',
            '#qcOTEnd': 'otEnd',
            '#qcACBegin': 'acBegin',
            '#qcACEnd': 'acEnd',
            '#qcBCOTBegin': 'bcOTBegin',
            '#qcBCOTEnd': 'bcOTEnd',
            '#qcBCACBegin': 'bcACBegin',
            '#qcBCACEnd': 'bcACEnd',
            '#qcListType': 'listType',
            '#qcList': 'list',
            '#pStatus': 'pstatus',
            '#btnSearch': 'search',
            '.list-content': 'result'
        },
        view: viewStr,
        events: {
            'click #btnSearch': 'search',
            'click #btnClear': 'clear',
            'click #btnReset': 'clear',
            'click #btnGenerate': 'generate',
            'click #btnDownload': 'download'
        },
        
        init: function() {
            QryCmpList.__super__.init.apply( this, arguments );
            var me = this;
            //me.$startTime.datetimepicker( { timepicker: false, format: 'Y-m-d' } );
            //me.$endTime.datetimepicker( { timepicker: false, format: 'Y-m-d' } );

            //条数选择
            //me.select = new Select({'view': me.$view.find('.m-select') });
            //me.select.on('select',function( name, value ){
            //    console.log( name );
            //    console.log( value );
            //});
            
            me.$atBegin.datetimepicker( { timepicker: false, format: 'Y-m-d' } );
            me.$atEnd.datetimepicker( { timepicker: false, format: 'Y-m-d' } );

            me.$otBegin.datetimepicker( { timepicker: false, format: 'Y-m-d' } );
            me.$otEnd.datetimepicker( {timepicker: false, format: 'Y-m-d'} );

            me.$bcOTBegin.datetimepicker( {timepicker: false, format: 'Y-m-d'} );
            me.$bcOTEnd.datetimepicker( {timepicker: false, format: 'Y-m-d'} );

            var ih2 = new InputHandler({ view: me.$view.find('.m-ih-space'), target: me.$view.find('#qcSb')  });

            var ih3 = new Select({'view': me.$view.find('.select-kt') });
            var ih4 = new Select({'view': me.$view.find('.select-dq') });
            var ih5 = new Select({'view': me.$view.find('.select-zl') });
            var ih6 = new Select({'view': me.$view.find('.select-bcdq') });
            var ih7 = new Select({'view': me.$view.find('.select-bczl') });

            ih3.on('select',function( value ){
                var beginTime = '',
                    endTime = '';

                switch( value ){
                    case '1':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(0);
                    break;
                    case '2':
                        beginTime = util.getDateStr(-1);
                        endTime = util.getDateStr(-1);
                    break;
                    case '3':
                        beginTime = util.getDateStr(-2);
                        endTime = util.getDateStr(-2);
                    break;
                }
                
                me.$atBegin.val( beginTime );
                me.$atEnd.val( endTime );

            })

            ih4.on('select',function( value ){
                var beginTime = '',
                    endTime = '';
                switch( value ){
                    case '1':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(7);
                    break;
                    case '2':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(15);
                    break;
                    case '3':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(30);
                    break;
                    case '4':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(60);
                    break;
                }
                me.$otBegin.val( beginTime );
                me.$otEnd.val( endTime );
            })

            ih5.on('select',function( value ){
                var beginCount = '',
                    endCount = '';

                switch( value ){
                    case '1':
                        beginCount = 0,
                        endCount = 20;
                    break;
                    case '2':
                        beginCount = 0,
                        endCount = 100;
                    break;
                    case '3':
                        beginCount = 0,
                        endCount = 200;
                    break;
                    case '4':
                        beginCount = 0,
                        endCount = 500;
                    break;
                }

                me.$acBegin.val( beginCount );
                me.$acEnd.val( endCount );
            })

            ih6.on('select',function( value ){
                var beginTime = '',
                    endTime = '';
                switch( value ){
                    case '1':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(7);
                    break;
                    case '2':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(15);
                    break;
                    case '3':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(30);
                    break;
                    case '4':
                        beginTime = util.getDateStr(0);
                        endTime = util.getDateStr(60);
                    break;
                }
                me.$bcOTBegin.val( beginTime );
                me.$bcOTEnd.val( endTime );
            })

            ih7.on('select',function( value ){
                var beginCount = '',
                    endCount = '';

                switch( value ){
                    case '1':
                        beginCount = 0,
                        endCount = 20;
                    break;
                    case '2':
                        beginCount = 0,
                        endCount = 100;
                    break;
                    case '3':
                        beginCount = 0,
                        endCount = 200;
                    break;
                    case '4':
                        beginCount = 0,
                        endCount = 500;
                    break;
                }

                me.$bcACBegin.val( beginCount );
                me.$bcACEnd.val( endCount );
            })

            me.collection = new M.Collection;
            me.initializeSelect();
        },
        
        initializeSelect: function() {
            this.generateSelect( 'INDUSTRY', this.$industry );
            this.generateSelect( 'PRODUCT_MODULE', this.$pModule );
            this.generateSelect( 'ENT_LST_SOURCE', this.$source );
            this.generateSelect( 'ENT_LST_ACTIVITY', this.$activity );
            this.generateSelect( 'ENT_LST_PSTS', this.$pstatus );
            //this.generateSelect( '', this.$)
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
            this.$industry.val( '' );
            this.$pModule.val( '' );
            if( this.attrs['vendorId'] == undefined ){
                this.$code.val( '' );
            }
            this.$fstatus.val( '' );
            this.$source.val( '' );
            this.$activity.val( '' );
            this.$sb.val( '' );
            this.$acBegin.val( '' );
            this.$acEnd.val( '' );
            this.$bcACBegin.val( '' );
            this.$bcACEnd.val( '' );
            this.$listType.val( '1' );
            this.$list.val( '' );
            this.$result.html( '' );
            this.$atBegin.val( '' );
            this.$atEnd.val( '' );
            this.$otBegin.val( '' );
            this.$otEnd.val( '' );
            this.$bcOTBegin.val( '' );
            this.$bcOTEnd.val( '' );
            this.$pstatus.val( '' );
        },
        search: function() {
            var me = this;
            var data = {
                runStatus: me.$pstatus.val(),
                industry: me.$industry.val(),
                modules: me.$pModule.val(),
                promotionCode: me.$code.val(),
                isPayed: me.$fstatus.val(),
                source: me.$source.val(),
                activity: me.$activity.val(),
                smsUnUsedAmount:'',
                StorageUnUsedSpace: me.$sb.val(),
                fromAccountTotalAmount: me.$acBegin.val(),
                toAccountTotalAmount: me.$acEnd.val(),
                fromPartnerAccountTotalAmount: me.$bcACBegin.val(),
                toPartnerAccountTotalAmount: me.$bcACEnd.val()
            };
            if ( me.$atBegin.val() ) {
                data.fromAppStartTime = new Date( me.$atBegin.val() ).getTime();
            }
            if ( me.$atEnd.val() ) {
                data.toAppStartTime = new Date( me.$atEnd.val() ).getTime();
            }
            if ( me.$otBegin.val() ) {
                data.fromEndTime = new Date( me.$otBegin.val() ).getTime();
            }
            if ( me.$otEnd.val() ) {
                data.toEndTime = new Date( me.$otEnd.val() ).getTime();
            }
            if ( me.$bcOTBegin.val() ) {
                data.fromPartnerEndTime = new Date( me.$bcOTBegin.val() ).getTime();
            }
            if ( me.$bcOTEnd.val() ) {
                data.toPartnerEndTime = new Date( me.$bcOTEnd.val() ).getTime();
            }
            if ( me.$list.val() ) {
                data.idOrName = me.$listType.val();
                data.idsOrNames = me.$list.val();
            }
			if($('#excessFlag').is(':checked')){
				data['excessFlag'] = true;
			}else{
				data['excessFlag'] = false;
			}
			data['excessType'] = me.$('#excessType').val();
            me.$result.html( '' );
            me.$search.attr( 'disabled', 'disabled' );
            me.$search.addClass( 'disable' );
            util.api({
                url: '/query/cmp/count',
                data: data,
                success: function( data ) {
                    if ( data.success ) {
                        var model = data.value.model;
                        model.dst = new Date( model.startTime )._format( 'yyyy-MM-dd hh:mm:ss' );
                        model.dct = new Date( model.completeTime )._format( 'yyyy-MM-dd hh:mm:ss' );
                        me.$result.html( me.tplSearch({ value: model }) );
                        IBSS.tplEvent.setPermissions( me.$result );
                    }
                },
                complete: function() {
                    me.$search.removeClass( 'disable' );
                    me.$search.removeAttr( 'disabled' );
                }
            });
        },

        render: function( bool ){
            
            this.attrs['wrapper'].html( this.$view );

            if( bool === true ){
                this.attrs['vendorId'] = IBSS.role_vendorId;
                this.$code.val( this.attrs['vendorId'] ).attr('disabled','disabled');
            }
        },
        generate: function() {
            var me = this;
            var data = {
                industry: me.$industry.val(),
                runStatus: me.$pstatus.val(),
                modules: me.$pModule.val(),
                promotionCode: me.$code.val(),
                isPayed: me.$fstatus.val(),
                source: me.$source.val(),
                activity: me.$activity.val(),
                smsUnUsedAmount: '',
                StorageUnUsedSpace: me.$sb.val(),
                fromAccountTotalAmount: me.$acBegin.val(),
                toAccountTotalAmount: me.$acEnd.val(),
                fromPartnerAccountTotalAmount: me.$bcACBegin.val(),
                toPartnerAccountTotalAmount: me.$bcACEnd.val()
            };
            if ( me.$atBegin.val() ) {
                data.fromAppStartTime = new Date( me.$atBegin.val() ).getTime();
            }
            if ( me.$atEnd.val() ) {
                data.toAppStartTime = new Date( me.$atEnd.val() ).getTime();
            }
            if ( me.$otBegin.val() ) {
                data.fromEndTime = new Date( me.$otBegin.val() ).getTime();
            }
            if ( me.$otEnd.val() ) {
                data.toEndTime = new Date( me.$otEnd.val() ).getTime();
            }
            if ( me.$bcOTBegin.val() ) {
                data.fromPartnerEndTime = new Date( me.$bcOTBegin.val() ).getTime();
            }
            if ( me.$bcOTEnd.val() ) {
                data.toPartnerEndTime = new Date( me.$bcOTEnd.val() ).getTime();
            }
            if ( me.$list.val() ) {
                data.idOrName = me.$listType.val();
                data.idsOrNames = me.$list.val();
            }
			if($('#excessFlag').is(':checked')){
				data['excessFlag'] = true;
			}else{
				data['excessFlag'] = false;
			}
			data['excessType'] = me.$('#excessType').val();
            var $generate = me.$result.find( '#btnGenerate' ),
                $download = me.$result.find( '#btnDownload' ),
                $console = me.$result.find( '#console' );
            $generate.addClass( 'disable' );
            $generate.attr( 'disabled', 'disabled' );
            $download.addClass( 'invisiable' );
            util.api({
                url: '/query/cmp/generate',
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
            var url = location.protocol + '//' + location.host + IBSS.API_PATH + '/query/cmp/download?path=' + path;
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

	module.exports = QryCmpList;
});
