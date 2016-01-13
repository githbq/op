define( function( require, exports, module ) {
    var IBSS = window.IBSS,TPL = IBSS.tpl;
	 var Pagination = require('common/widget/pagination/pagination');
	 var Slider = require('common/widget/slider/slider');
    var tpl = $( require( './template.html' ) );
	var AutoSelect = require( 'common/widget/autoselect/autoselect' );
	var TeamTree = require( 'module/teamtree/teamtree' );

    var ActLst = MClass( M.Center ).include( {
       
        elements: {
			'#monthlabel': 'monthlabel',
            '#seasonlabel': 'seasonlabel',
    		'#yearselect': 'yearselect',
            '#monthselect': 'monthselect',
    		'#seasonselect': 'seasonselect',
			'.enterpriseAccount':'enterpriseAccount',
            '#btnSearch': 'search',
			'.list-content tbody': 'tbody'
        },
        events: {
            'click #btnSearch': 'search',
			'click .mselect b': 'selectEve'
        },
		trTpl: _.template( tpl.filter('#trTpl').html() ),
        init: function() {
            ActLst.__super__.init.apply( this, arguments );
            var me = this;
			
			me.autoSelect = new AutoSelect();
			me.autoSelect.resetSelect(me.$('.companyId'))

			var startYear = 2008,
                endYear = ( new Date() ).getFullYear(),
                array = [];
            me.selectstate = null;    //月份季度选择切换

            for( var i=startYear; i<=endYear; i++ ){
                array.push( {'name':i,'value':i} );
            }
            
            util.resetSelect( me.$yearselect,array,2015 );
            me.$('.mselect b').eq(0).trigger('click');
			
			me.teamTree = new TeamTree();
			me.teamTree.on('select',function(data){
				me.$('.deptId').val(data.name);
				me.$('.deptId').attr('data-deptid',data.id);
				
			});
			me.$('.companyId').on('change',function(){
				me.$('.deptId').val('');
				me.$('.deptId').attr('data-deptid',-1);
			});
			me.$('.deptId').on('focus',function(){
                
				if(!me.$('.companyId').val()){
					util.showToast('请先选择有效的公司！');
					return false;
				}

				var companyId = me.$('.companyId').attr('data-id');
				me.teamTree.show( companyId )	
			})
			
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
				
                htmlStr = "<tr><td colspan='39'><p class='info'>暂无数据</p></td></tr>"
            }
            me.$tbody.html( htmlStr );
            IBSS.tplEvent.setPermissions( me.$tbody );
    	},
		 selectEve: function( e ){
            var me = this;
            var $target = $( e.currentTarget );
            $target.addClass('active').siblings().removeClass('active');

            if( $target.attr('data-target') == 'month' ){
                
                me.selectstate = 1;
                me.$monthlabel.show();
                me.$seasonlabel.hide();
            }else{

                me.selectstate = 2;
                me.$monthlabel.hide();
                me.$seasonlabel.show();
            }
        },
        
        search: function() {
            var me = this;
			this.pagination.setPage( 0 ,false );
            this.getList();
        },
		// 获取企业列表数据
    	getList: function(){
             var me = this;
			 var month = '',
                quarter = '',
				objdata = {};

            if( me.selectstate == 1 ){
                month = me.model.get('year') + '-' + me.model.get('month');
            }else{
                quarter = me.model.get('year') + '-' + me.model.get('season'); 
            } 

			objdata['companyId'] = me.$('.companyId').attr('data-id')||-1;
			objdata['deptId'] = me.$('.deptId').attr('data-deptId')||-1;
            objdata['companyType'] = 0;
            objdata['enterpriseType'] = me.model.get('enterpriseType');
			objdata['month'] = month;
			objdata['quarter'] = quarter;
			objdata['employeeTpye'] = me.model.get('employeeTpye');
            objdata['pageIndex'] = me.pagination.attr['pageNumber']; 
            objdata['pageSize'] = me.pagination.attr['pageSize'];
			
            util.api({
                'url': '~/op/api/activity/queryteamactivityanalysisreport',
                'data': objdata,
                'beforeSend': function(){
                    me.$search.addClass('u-btn-disabled').attr('disabled','disabled').text('查询');
                    me.$tbody.html("<tr> <td colspan='39'><p class='info'>努力加载中....</p></td> </tr>");
                },
                'success': function( data ){
                    //console.warn( data );
                    if( data.success ){
						me.collection.reload( data.value.model.content, function( item ){
							if(me.model.get('employeeTpye')=='1'){
								item.employeeTpye = '月初满30天';
							}else if(me.model.get('employeeTpye')=='0'){
								item.employeeTpye = '月初未满30天';
							}else{
								item.employeeTpye = '';
							}
					
                        });

						//me.list.reload( data.value.model.content );
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        
                    }
                },
                'complete': function(){
                    me.$search.removeClass('u-btn-disabled').removeAttr('disabled').text('查询');
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