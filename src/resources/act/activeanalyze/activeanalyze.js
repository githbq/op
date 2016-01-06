define( function( require, exports, module ) {
	
	var Pagination = require('common/widget/pagination/pagination');
	var tem = $( require('./template.html') );

    var ActLst = MClass( M.Center ).include( {

        elements: {
			'.app-time-start':'appTimeStart',
			'.app-time-end':'appTimeEnd',
			'.account':'account',
			'.sellName':'sellName',
			'.activityCount':'activityCount',
			'tbody': 'tbody'
        },
        events: {
           'click .btn-search':'searchEve'
        },
		trTpl: _.template( tem.filter('#activeAnalyzeList').html() ),
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
			me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });

			
            me.$appTimeStart.val( util.getDateStr(-30) );
            me.$appTimeEnd.val( util.getDateStr(-1) );
            me.initializeDatepicker();
           
        },
        initializeDatepicker: function() {
            var me = this;
            me.$appTimeStart.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var maxDate = me.$appTimeEnd.val() ? me.$appTimeEnd.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            } );
            me.$appTimeEnd.datetimepicker( {
                format: 'Y/m/d',
                onShow: function() {
                    var minDate = me.$appTimeStart.val() ? me.$appTimeStart.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            } );
			 me.getList();
       
        },

        searchEve: function() {
			this.pagination.setPage( 0 ,false );
            this.getList();
        },
		// 获取企业列表数据
    	getList: function(){
            var me = this;

            var data = me.model.all();
			
			//企业账号
            if ( me.$account.val() ){
                data.account = me.$account.val(); 
            }

            //销客人员姓名
            if ( me.$sellName.val() ){
                data.name = me.$sellName.val();
            }

            //开通时间开始
            if ( me.$appTimeStart.val() ) {
                data.appTimeStart = new Date( me.$appTimeStart.val() ).getTime();
            }

            //开通时间结束
            if ( me.$appTimeEnd.val() ) {
                data.appTimeEnd = new Date( me.$appTimeEnd.val() ).getTime();
            }
			
			//达到活跃天数
            if ( me.$activityCount.val() ) {
                data.activityCount = me.$activityCount.val();;
            }else{
				data.activityCount = '0';
			}
            
            data.pageIndex = me.pagination.attr['pageNumber']; 
            data.pageSize = me.pagination.attr['pageSize'];
			
            util.api({
                'url': '~/op/api/activity/queryenterpriseactivityperiodbasic',
                'data': data,
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
						me.collection.reload( data.value.model.content);
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        
                    }
                }
            })
    	},
		 //渲染列表
        renderList: function(){
            var me = this;
            var collection = me.collection.all();
            var htmlStr = '';

            if( collection.length > 0 ){
                htmlStr = me.trTpl( {'content': collection} );
            }else{
                htmlStr = "<tr> <td colspan='7'><p class='info'>暂无数据</p></td> </tr>"
            }

            me.$tbody.html( htmlStr );
        }
    } );

    exports.init = function() {
        var $el = exports.$el;
        var actLst = new ActLst( { 'view': $el.find( '.m-active-analyze' ) } );
    }
} );