define( function( require, exports, module ) {
    var IBSS = window.IBSS,TPL = IBSS.tpl;
	var Pagination = require('common/widget/pagination/pagination');
	var Slider = require('common/widget/slider/slider');


    //企业日活跃详情
    var ActLst = MClass( M.Center ).include( {

        elements: {
            '#alAST': 'ast',                            //开通开始时间
            '#alAET': 'aet',                            //开通结束时间

            '#alCST': 'cst',                            //活跃开始时间
            '#alCET': 'cet',                            //活跃结束时间

			'.enterpriseAccount':'enterpriseAccount',    //企业账号
            '.alName':'alName',                          //销售人员

			'.list-content tbody': 'tbody'
        },

        events: {
            'click #btnSearch': 'search',
            'click .btn-exel': 'exportExel'
        },

        init: function() {
            ActLst.__super__.init.apply( this, arguments );
            var me = this;
			
			me.pagination = new Pagination( {
                'wrapper': me.$view.find('.act-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function(){
               me.getList();
            }
			me.on('empty:list',function(){
                me.$tbody.html("<tr><td colspan='15'><p class='info'>暂无数据</p></td></tr>");
            })


            me.$cst.val( util.getDateStr(-30) );
            me.$cet.val( util.getDateStr(-1) );

            me.$ast.val( util.getDateStr(-30) );
            me.$aet.val( util.getDateStr(-1) );

            me.initializeDatepicker();
            me.getList();
        },

        //初始化日期选择
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
			me.pagination.setPage( 0 ,false );
            me.getList();
        },

        //获取列表详情
        getList: function(){
            var me = this;

            var appTimeStart = '';
            if( me.$cst.val() ){
                appTimeStart = new Date( me.$cst.val() ).getTime();
            }else{
                util.showToast('请选择开通起始时间');
                return false;
            }

            var appTimeEnd = '';
            if( me.$cet.val() ){
                appTimeEnd = new Date( me.$cet.val() ).getTime();
            }else{
                util.showToast('请选择开通结束时间');
                return false;
            }

            var actTimeStart = '';
            if( me.$ast.val() ){
                actTimeStart = new Date( me.$ast.val() ).getTime();
            }else{
                util.showToast('请选择活跃起始时间');
                return false;
            }

            var actTimeEnd = '';
            if( me.$aet.val() ){
                actTimeEnd = new Date( me.$aet.val() ).getTime();
            }else{
                util.showToast('请选择活跃结束时间');
                return false;
            }

            util.api({
                'url':'~/op/api/activity/queryenterpriseactivitydetail',
                'data':{
                    'name': me.$alName.val()||'',
                    'account': me.$enterpriseAccount.val()||'',
                    'appTimeStart': appTimeStart,
                    'appTimeEnd': appTimeEnd,
                    'actTimeStart': actTimeStart,
                    'actTimeEnd': actTimeEnd,
                    'pageIndex': me.pagination.attr['pageNumber'],
                    'pageSize': me.pagination.attr['pageSize']
                },
                'success': function( data ){
                    if( data.success ){
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.list.reload( data.value.model.content );
                    }
                }
            });
        },

		//日活详情导出事件
		exportExel:function() {
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
				 //objdata['actStartTime'] = '';
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
			
			me.$('#btnQyrhyExel').attr( 'disabled', 'disabled' );
			me.$('#btnQyrhyExel').addClass( 'disable');
			me.$('#btnQyrhyExel').text('导出中...');

            var hrefStr = '/op/api/query/eaactimport/generate?' + $.param( objdata );
            location.href = hrefStr;

			me.$('#btnQyrhyExel').removeClass( 'disable' );
			me.$('#btnQyrhyExel').removeAttr( 'disabled' );
			me.$('#btnQyrhyExel').text('日活详情导出');  
        }

    } );

    exports.init = function() {
        var $el = exports.$el;
        var actLst = new ActLst( { 'view': $el.find( '.m-act-detail' ) } );
    }
} );