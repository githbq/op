define( function( require, exports, module ) {
    var IBSS = window.IBSS,TPL = IBSS.tpl;
    
	var Pagination = require('common/widget/pagination/pagination');
	var Slider = require('common/widget/slider/slider');
	var AutoSelect = require( 'common/widget/autoselect/autoselect' );
	var tem = $( require('./template.html') );
	var TeamTree = require( 'module/teamtree/teamtree' );

    var ActLst = MClass( M.Center ).include( {

        elements: {
			'.app-time-start':'appTimeStart',
			'.app-time-end':'appTimeEnd',
			'.account':'account',
			'.sellName':'sellName',
			'.activityCount':'activityCount',
			'tbody': 'tbody',
            '#btnSearch': 'search',
            '.companyType': 'companyType',
            '.companyId': 'companyId',
            '.deptId': 'deptId'
        },
        events: {
           'click .btn-search':'searchEve'
        },
		trTpl: _.template( tem.filter('#activeAnalyzeList').html() ),
        init: function() {
            ActLst.__super__.init.apply( this, arguments );
            var me = this;
			
			me.autoSelect = new AutoSelect();
			me.autoSelect.resetSelect(me.$('.companyId'))
			
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

			me.teamTree = new TeamTree();
			me.teamTree.on('select',function(data){
				me.$('.deptId').val(data.name);
				me.$('.deptId').attr('data-deptid',data.id);
			});
            me.teamTree.on('clear',function(data){
                me.$('.deptId').val('');
                me.$('.deptId').attr('data-deptid',-1);
            })

            me.$('.companyType').on('change',function(e){

                var type = $( this ).val();

                me.$companyId.val('').attr('data-type',type).attr('data-id',-1).attr('data-agentId',-1);
                me.$deptId.val('');
                me.$deptId.attr('data-deptid',-1);
            });

			me.$('.companyId').on('change',function(){
				me.$deptId.val('');
				me.$deptId.attr('data-deptid',-1);
			});

			me.$('.deptId').on('focus',function(){
				if(!me.$('.companyId').val()){
					util.showToast('请先选择有效的公司！');
					return false;
				}
				var companyId = me.$('.companyId').attr('data-id');
				me.teamTree.show( companyId )	
			})

            me.$appTimeStart.val( util.getDateStr(-30) );
            me.$appTimeEnd.val( util.getDateStr(-1) );
            me.initializeDatepicker();
           
        },
        initializeDatepicker: function() {
            var me = this;
			 //me.$appTimeStart.simpleCanleder();  
			
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
            var me = this;
			this.pagination.setPage( 0 ,false );
            this.getList();
        },

		// 获取企业列表数据
    	getList: function(){
            var me = this;

            var data = me.model.all();
			
			//代理商id
            data.agentId = me.$companyId.attr('data-agentId')||-1;	
			//部门id
            data.deptId = me.$deptId.attr('data-deptId')||-1;
            //类型
            data.companyType = 0;

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
                'url': '~/op/api/activity/queryteamenterpriseactivityperiodbasic',
                'data': data,
                'beforeSend': function(){
                    me.$search.addClass('u-btn-disabled').attr('disabled','disabled').text('查询');
                    me.$tbody.html("<tr> <td colspan='6'><p class='info'>努力加载中....</p></td> </tr>");
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
						me.collection.reload( data.value.model.content);
                        me.pagination.setTotalSize( data.value.model.itemCount );    
                    }
                },
                'complete': function(){
                    me.$search.removeClass('u-btn-disabled').removeAttr('disabled').text('查询');
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
                htmlStr = "<tr> <td colspan='6'><p class='info'>暂无数据</p></td> </tr>"
            }

            me.$tbody.html( htmlStr );
        }
    } );

    exports.init = function() {
        var $el = exports.$el;
        var actLst = new ActLst( { 'view': $el.find( '.m-active-analyze' ) } );
    }
} );