define( function( require, exports, module ) {
    var IBSS = window.IBSS;
	 var Pagination = require('common/widget/pagination/pagination');
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
			'#btnDownExel':'btnDownExel',
            '#downloaddayactive': 'downloaddayactive'
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
  
        },
        initializeSelect: function() {
			
            this.generateSelect( 'INDUSTRY', this.$industry );
            this.generateSelect( 'PRODUCT_MODULE', this.$pModule );
            this.generateSelect( 'ENT_LST_SOURCE', this.$source );
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
           
			this.pagination.setPage( 0 ,false );
            
        },
		//日活列表导出
		downExel:function() {
            var me = this;
            var objdata = {};
            
            if ( me.$cst.val() ) {
                objdata['appTimeStart'] = new Date( me.$cst.val() ).getTime();
            }else{
                objdata['appTimeStart'] = '';
            }
            if ( me.$cet.val() ) {
               objdata['appTimeEnd'] = new Date( me.$cet.val() ).getTime();
            }else{
                objdata['appTimeEnd'] ='';
            }
            if ( me.$ast.val() ) {
                objdata['actStartTime'] = new Date( me.$ast.val() ).getTime();
            }else{
                util.showToast('请填写活跃时间');
                return false;
            }
            if ( me.$aet.val() ) {
                objdata['actEndTime'] = new Date( me.$aet.val() ).getTime();
            }else{
                util.showToast('请填写活跃时间');
                return false;
            }
            objdata['name'] = me.$alName.val()||'';
            objdata['enterAccount'] = me.$enterpriseAccount.val()||'';
            
            var filepath = '';
            util.api({
                'url': '~/op/api/query/eadayimport/generate',
                'data': objdata,
                'beforeSend': function(){
                    me.$('#btnDownExel').attr('disabled','disabled').text('导出中......');
                    me.$downloaddayactive.hide()
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                       filepath = data.value.model;
                       me.$('#btnDownExel').text('生成中 稍等几分钟...').attr('disabled','disabled');
                       checkExport();
                    }else{
                        reset();
                    }   
                },
                'error': function(){
                    reset();
                }
            })
            
            /**
             * 返回初始状态
             */
            function reset(){
                me.$('#btnDownExel').removeAttr('disabled').text('日活列表导出');
                me.$downloaddayactive.hide();
            }
            
            /**
             *
             * 轮询获取列表是否生成成功
             */
            function checkExport(){
                $.ajax({
                    'url':'/op/api/file/downloadeadayimport',
                    'type':'get',
                    'data':{
                        'filePath': filepath
                    },
                    'complete': function( xhr, status ){

                        if( xhr.status === 200 ){

                            setTimeout( function(){
                                reset();
                                me.$downloaddayactive.show().find('a').attr('href','/op/api/file/downloadeadayimport?filePath='+filepath);
                            },5000);
                        }else if( xhr.status === 404 ){

                            setTimeout(function(){ checkExport() },5000 );
                        }else{

                            reset();
                            util.showToast('生成失败');
                        }
                    }
                })
            }
        },
		//日活详情导出
		QyrhyExel:function() {
            var me = this;
            var objdata = {};

			if ( me.$cst.val() ) {
                objdata['appTimeStart'] = new Date( me.$cst.val() ).getTime();
            }else{
				objdata['appTimeStart'] = '';
				
			}
            if ( me.$cet.val() ) {
               objdata['appTimeEnd'] = new Date( me.$cet.val() ).getTime();
            }else{
				objdata['appTimeEnd'] ='';
				
			}
            if ( me.$ast.val() ) {
                objdata['actStartTime'] = new Date( me.$ast.val() ).getTime();
            }else{
				
				 util.showToast('请完善活跃时间');
				return false;
			}
            if ( me.$aet.val() ) {
                objdata['actEndTime'] = new Date( me.$aet.val() ).getTime();
            }else{
				
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