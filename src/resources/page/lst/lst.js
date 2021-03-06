define( function( require, exports, module ) {
    var IBSS = window.IBSS,TPL = IBSS.tpl;
	 var Pagination = require('common/widget/pagination/pagination');
	 var Slider = require('common/widget/slider/slider');
    var tpl = $( require( './template.html' ) );

    var ActLst = MClass( M.Center ).include( {
        tplSearch: _.template( tpl.filter( '#actCountResult' ).html() ),
        tplGenerate: _.template( tpl.filter( '#actGenerateResult' ).html() ),
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
			'.enterpriseAccount':'enterpriseAccount',
            '#alListType': 'listType',
            '#alList': 'list',
            '#btnSearch': 'search',
            '.list-exel': 'result',
			'.list-content tbody': 'tbody',
			'.alName':'alName',
			'.alDay':'alDay',
			'#btnDownExel':'btnDownExel'
        },
        events: {
            'click #btnSearch': 'search',
            'click #btnClear': 'clear',
            'click #btnReset': 'reset',
            'click #btnGenerate': 'generate',
            'click #btnDownload': 'download',
			'click #btnDownExel': 'downExel',
			'click #btnQyrhyExel': 'QyrhyExel',
			'click #btnRyhysExel': 'RyhysExel'
        },
		trTpl: _.template( tpl.filter('#trTpl').html() ),
        init: function() {
            ActLst.__super__.init.apply( this, arguments );
            var me = this;
			
			/*me.pagination = new Pagination( {
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function(){
               me.getList();
            }*/
            me.$cst.val( util.getDateStr(-30) );
            me.$cet.val( util.getDateStr(-1) );

            me.$ast.val( util.getDateStr(-30) );
            me.$aet.val( util.getDateStr(-1) );
            me.initializeDatepicker();
            me.collection = new M.Collection;
			me.collection.on('reload',function(){
                me.renderList();
            });
            me.initializeSelect();
			me.renderList();
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
            //me.$ast.val( me.getDateString( -8 ) );
            //me.$aet.val( me.getDateString( -1 ) );
        },
        initializeSelect: function() {
			var me = this;
            this.generateSelect( 'INDUSTRY', this.$industry );
            this.generateSelect( 'PRODUCT_MODULE', this.$pModule );
            this.generateSelect( 'ENT_LST_SOURCE', this.$source );
			me.getList();
        },
		//渲染企业列表数据
    	renderList: function(){
            var me = this;
            var collection = me.collection.all();
            var htmlStr = '';
            if( collection.length > 0){
                htmlStr = me.trTpl( {'content': collection} );
            } else {
				
                htmlStr = "<tr><td colspan='9'><p class='info'>暂无数据</p></td></tr>"
            }
            me.$tbody.html( htmlStr );
            IBSS.tplEvent.setPermissions( me.$tbody );
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
			this.pagination.setPage( 0 ,false );
            this.getList();
        },
		// 获取企业列表数据
    	getList: function(){
           /* var me = this;
            var timeStart='',timeEnd='',alName='';
            if ( me.$ast.val() ) {
                data.ast = new Date( me.$ast.val() ).getTime();
            }
            if ( me.$aet.val() ) {
                data.aet = new Date( me.$aet.val() ).getTime();
            }
            if ( me.$cst.val() ) {
                timeStart = new Date( me.$cst.val() ).getTime();
            }
            if ( me.$cet.val() ) {
                timeEnd = new Date( me.$cet.val() ).getTime();
            }
			alName = me.$alName.val()||'';
            /*if ( me.$list.val() ) {
                data.listType = me.$listType.val();
                data.list = me.$list.val();
            }
			
            me.$result.html( '' );
            me.$search.attr( 'disabled', 'disabled' );
            me.$search.addClass( 'disable' );
            util.api({
                url: '/query/eaact/generate',
                data: {
					'pageIndex': me.pagination.attr['pageNumber'],
                    'pageSize': me.pagination.attr['pageSize'],
					'name':alName,
					'timeStart':timeStart,
					'timeEnd' :timeEnd
				},
                success: function( data ) {
                    if ( data.success ) {
                        var model = data.value.model;
						me.pagination.setTotalSize( data.value.model.itemCount );
						me.collection.reload( data.value.model.content);
                        
                    }
                },
                complete: function() {
                    me.$search.removeClass( 'disable' );
                    me.$search.removeAttr( 'disabled' );
                }
            });*/
    	},
		//日活列表导出
		downExel:function() {
            var me = this;
			var objdata = {};
			
            if ( me.$cst.val() ) {
                objdata['appTimeStart'] = new Date( me.$cst.val() ).getTime();
            }else{
				objdata['appTimeStart'] = '';
				//util.showToast('请填写开通时间');
				//return false;
			}
            if ( me.$cet.val() ) {
               objdata['appTimeEnd'] = new Date( me.$cet.val() ).getTime();
            }else{
				objdata['appTimeEnd'] ='';
				//util.showToast('请填写开通时间');
				//return false;
			}
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
			objdata['enterAccount'] = me.$enterpriseAccount.val()||'';
			
            $('#btnDownExel').addClass( 'disable');
            $('#btnDownExel').attr( 'disabled', 'disabled' );
			$('#btnQyrhyExel').attr( 'disabled', 'disabled' );
			$('#btnRyhysExel').attr( 'disabled', 'disabled' );
			$('#btnQyrhyExel').addClass( 'disable');
			$('#btnRyhysExel').addClass( 'disable');
			$('#btnDownExel').text('导出中...');
			window.open('/op/api/query/eadayimport/generate?' + $.param( objdata ) );
			$('#btnDownExel').removeClass( 'disable' );
			$('#btnQyrhyExel').removeClass( 'disable' );
			$('#btnRyhysExel').removeClass( 'disable' );
			$('#btnDownExel').removeAttr( 'disabled' );
			$('#btnQyrhyExel').removeAttr( 'disabled' );
			$('#btnRyhysExel').removeAttr( 'disabled' );
			$('#btnDownExel').text('日活列表导出');  
        },
		//日活详情导出
		QyrhyExel:function() {
            var me = this;
            var objdata = {};

			if ( me.$cst.val() ) {
                objdata['appTimeStart'] = new Date( me.$cst.val() ).getTime();
            }else{
				objdata['appTimeStart'] = '';
				//util.showToast('请完善开通时间');
				//return false;
			}
            if ( me.$cet.val() ) {
               objdata['appTimeEnd'] = new Date( me.$cet.val() ).getTime();
            }else{
				objdata['appTimeEnd'] ='';
				//util.showToast('请完善开通时间');
				//return false;
			}
            if ( me.$ast.val() ) {
                objdata['actStartTime'] = new Date( me.$ast.val() ).getTime();
            }else{
				 //objdata['actStartTime'] = '';
				 util.showToast('请完善活跃时间');
				return false;
			}
            if ( me.$aet.val() ) {
                objdata['actEndTime'] = new Date( me.$aet.val() ).getTime();
            }else{
				//objdata['actEndTime'] ='';
				util.showToast('请完善活跃时间');
				return false;
			}
			objdata['name'] = me.$alName.val()||'';
			objdata['enterAccount'] = me.$enterpriseAccount.val()||'';
			
            $('#btnDownExel').addClass( 'disable');
            $('#btnDownExel').attr( 'disabled', 'disabled' );
			$('#btnQyrhyExel').attr( 'disabled', 'disabled' );
			$('#btnQyrhyExel').addClass( 'disable');
			$('#btnQyrhyExel').text('导出中...');
			window.open( '/op/api/query/eaactimport/generate?' + $.param( objdata ) );
			$('#btnDownExel').removeClass( 'disable' );
			$('#btnQyrhyExel').removeClass( 'disable' );

			$('#btnDownExel').removeAttr( 'disabled' );
			$('#btnQyrhyExel').removeAttr( 'disabled' );

			$('#btnQyrhyExel').text('日活详情导出');  
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