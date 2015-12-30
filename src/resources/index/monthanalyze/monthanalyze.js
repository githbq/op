define( function( require, exports, module ) {
    var IBSS = window.IBSS,TPL = IBSS.tpl;
	 var Pagination = require('common/widget/pagination/pagination');
	 var Slider = require('common/widget/slider/slider');
    var tpl = $( require( './template.html' ) );

    var ActLst = MClass( M.Center ).include( {
       
        elements: {
            '#alCode': 'code',
            '#alAST': 'ast',
            '#alAET': 'aet',
            '#alCST': 'cst',
            '#alCET': 'cet',
			'.enterpriseAccount':'enterpriseAccount',
            '#btnSearch': 'search',
			'.list-content tbody': 'tbody',
			'.alName':'alName'
        },
        events: {
            'click #btnSearch': 'search',
        },
		trTpl: _.template( tpl.filter('#trTpl').html() ),
        init: function() {
            ActLst.__super__.init.apply( this, arguments );
            var me = this;
			
			me.pagination = new Pagination( {
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function(){
               me.getList();
            }
            me.$cst.val( util.getDateStr(-30) );
            me.$cet.val( util.getDateStr(-1) );

            me.$ast.val( util.getDateStr(-30) );
            me.$aet.val( util.getDateStr(-1) );

            me.initializeDatepicker();
            me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });
           // me.initializeSelect();
			//me.renderList();
			me.getList();
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
        
		//渲染企业列表数据
    	renderList: function(){
            var me = this;
            var collection = me.collection.all();
            var htmlStr = '';
            if( collection.length > 0){
                htmlStr = me.trTpl( {'content': collection} );
            } else {
				
                htmlStr = "<tr><td colspan='15'><p class='info'>暂无数据</p></td></tr>"
            }
            me.$tbody.html( htmlStr );
            IBSS.tplEvent.setPermissions( me.$tbody );
    	},
        
        search: function() {
            var me = this;
			this.pagination.setPage( 0 ,false );
            this.getList();
        },
		// 获取企业列表数据
    	getList: function(){
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
            objdata['account'] = me.$enterpriseAccount.val()||'';
            
            objdata['pageIndex'] = me.pagination.attr['pageNumber']; 
            objdata['pageSize'] = me.pagination.attr['pageSize'];
			
            util.api({
                'url': '~/op/api/activity/queryenterpriseactivitysummary',
                'data': objdata,
                'success': function( data ){
                    //console.warn( data );
                    if( data.success ){
						me.collection.reload( data.value.model.content, function( item ){
							if(item.firstPeriodActivityOppo){
								item.firstPeriodActivityOppoStr = 'Y'
							}else{
								item.firstPeriodActivityOppoStr = 'N'
							}
                        });

						//me.list.reload( data.value.model.content );
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        
                    }
                }
            })
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