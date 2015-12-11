define( function( require, exports, module ) {
    var IBSS = window.IBSS,TPL = IBSS.tpl;
	 var Pagination = require('common/widget/pagination/pagination');
	 var Slider = require('common/widget/slider/slider');

    var ActLst = MClass( M.Center ).include( {

        elements: {
            '#alIndustry': 'industry',
            '#alPModule': 'pModule',
            '#alSource': 'source',
            '#alFStatus': 'fstatus',
            '#alCode': 'code',
            '#alAST': 'ast',
            '#alAET': 'aet',
            '#alCST': 'cst',
            '#alCET': 'cet',
            '#alListType': 'listType',
            '#alList': 'list',
            '#btnSearch': 'search',
            '.list-exel': 'result',
			'.list-content tbody': 'tbody',
			'.alName':'alName',
			'.alDay':'alDay',
			'#btnQyrhyExel':'btnQyrhyExel',
        },
        events: {
            'click #btnSearch': 'search',
            'click #btnClear': 'clear',
            'click #btnReset': 'reset',
            'click #btnGenerate': 'generate',
			'click #btnQyrhyExel': 'RyhysExel',
        },
        init: function() {
            ActLst.__super__.init.apply( this, arguments );
            var me = this;
			
            me.$ast.val( util.getDateStr(-30) );
            me.$aet.val( util.getDateStr(-1) );
            me.initializeDatepicker();
           
        },
        initializeDatepicker: function() {
            var me = this;
            me.$ast.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var maxDate = me.$aet.val() ? me.$aet.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            } );
            me.$aet.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var minDate = me.$ast.val() ? me.$ast.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            } );
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
       
   
        search: function() {
            var me = this;
			this.pagination.setPage( 0 ,false );
            this.getList();
        },

		//人员活跃企业数exel
		RyhysExel:function() {
            var me = this;
            var objdata = {};
		
            if ( me.$ast.val() ) {
                objdata['actStartTime'] = new Date( me.$ast.val() ).getTime();
				
            }else{
				 //objdata['actStartTime'] = '';
				 util.showToast('请填写活跃时间');
				return false;
			}
            if ( me.$aet.val() ) {
                objdata['actEndTime'] = new Date( me.$aet.val() ).getTime();
            }else{
				//objdata['actEndTime'] ='';
				util.showToast('请填写活跃时间');
				return false;
			}
			objdata['name'] = me.$alName.val()||'';
    
			$('#btnRyhysExel').attr( 'disabled', 'disabled' );
			$('#btnRyhysExel').addClass( 'disable');
  
			$('#btnRyhysExel').text('导出中...');
			window.open('/op/api/query/peodayimport/generate?' + $.param( objdata ) );
			$('#btnRyhysExel').removeClass( 'disable' );

			$('#btnRyhysExel').removeAttr( 'disabled' );
			$('#btnRyhysExel').text('个人汇总导出');  
        },
        generate: function() {
            var me = this;
            var data = {
                industry: me.$industry.val(),
                pm: me.$pModule.val(),
                code: me.$code.val(),
                fStatus: me.$fstatus.val(),
                source: me.$source.val()
            };
            if ( me.$ast.val() ) {
                data.ast = new Date( me.$ast.val() ).getTime();
            }
            if ( me.$aet.val() ) {
                data.aet = new Date( me.$aet.val() ).getTime();
            }
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
                url: '/query/act/generate',
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
            var url = location.protocol + '//' + location.host + IBSS.API_PATH + '/query/act/download?path=' + path;
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
        var actLst = new ActLst( { 'view': $el.find( '.m-act-lst' ) } );
    }
} );