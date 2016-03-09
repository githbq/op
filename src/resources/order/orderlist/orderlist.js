define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
        TplEvent = IBSS.tplEvent;

    var Pagination = require('common/widget/pagination/pagination');
    var Slider = require('common/widget/slider/slider');
    var tem = $( require('./template.html') );

    var statusMap = {},industryMap = {},sourceMap = {};

    var statusAry = ['','已通过','待审核','已过期','撤回'];
    var payStatusAry = ['','分期','全款','未付'];
    var orderTypeAry = ['','办公版新购-普通','办公版新购-特批','营销版新购-普通','营销版新购-特批','办公版增购-普通',
                        '办公版增购-特批','营销版增购-普通','营销版增购-特批','办公版续费-普通','办公版续费-特批',
                        '营销版续费-普通','营销版续费-特批','关联自注册办公版-普通','关联自注册办公版-特批',
                        '关联自注册营销版-普通','关联自注册营销版-特批','收尾款'
                        ];
    
   /**
    *
    * 代理商用户
    * 备案企业列表
    */
    var OrderList = MClass( M.Center ).include({

    	init: function(){
    		OrderList.__super__.init.apply( this,arguments );

            var me = this;
    	    
            me.$putStartTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});
            me.$putEndTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});
			
			 me.$putStartTime.val( util.getDateStr(-30) );
            me.$putEndTime.val( util.getDateStr(0) );

            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function(){
                me.getList();
            };

            me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });

            //me.getEnums();
			me.searchEve();
        },
        trTpl: _.template( tem.filter('#orderList').html() ),
        events: {
			'click .search':'searchEve'
            
        },

        elements:{
            'tbody': 'tbody',
            '.putStartTime': 'putStartTime',
            '.putEndTime': 'putEndTime',
        },

        searchEve: function(e){
            this.pagination.setPage( 0,false );
            this.getList();
        },

        //导出excel
        exportEve: function(e){
            var me = this;

            var putStartTime = '',
                putEndTime = '';

            if( me.$putStartTime.val() ){
                putStartTime = new Date( me.$putStartTime.val() ).getTime();
            }
            if( me.$putEndTime.val() ){
                putEndTime = new Date( me.$putEndTime.val() ).getTime();
            }

            var queryData = {
                'orderId':  me.model.get('orderId'),
                'contractNo': me.model.get('contractNo'),
                'en': me.model.get('en'),
                'ea': me.model.get('ea'),
				'orderType': me.model.get('orderType'),
				'account': me.model.get('account'),
				'isTp': me.model.get('isTp'),
				'approveStatus': me.model.get('approveStatus'),
				'payStatus': me.model.get('payStatus'),
				'agent': me.model.get('agent'),
				'agentId': me.model.get('agentId'),
                'putStartTime': putStartTime,
                'putEndTime': putEndTime
				
            }
            
            window.open( IBSS.API_PATH + '/enterprisefiling/exportfiling?' + $.param( queryData ) );
        },

        //获取备案企业列表
        getList: function(){
            var me = this;

            
            var putStartTime = '',
                putEndTime = '';

            if( me.$putStartTime.val() ){
                putStartTime = new Date( me.$putStartTime.val() ).getTime();
            }
            if( me.$putEndTime.val() ){
                putEndTime = new Date( me.$putEndTime.val() ).getTime();
            }

            var queryData = {
                'orderId':  me.model.get('orderId'),
                'contractNo': me.model.get('contractNo'),
                'en': me.model.get('en'),
                'ea': me.model.get('ea'),
				'orderType': me.model.get('orderType'),
				'account': me.model.get('account'),
				'isTp': me.model.get('isTp'),
				'approveStatus': me.model.get('approveStatus'),
				'payStatus': me.model.get('payStatus'),
				'agent': me.model.get('agent'),
				'agentId': me.model.get('agentId'),
                'putStartTime': putStartTime,
                'putEndTime': putEndTime,
				'pageIndex': me.pagination.attr['pageNumber']+1,
                'pageSize': me.pagination.attr['pageSize']
            }

            util.api({
                'url':'/odr/querypage',
                'data':queryData,
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.collection.reload( data.value.model.content, function( item ){

                            item.statusStr = item.order.status ? statusAry[item.order.status] :'';
                            item.payStatusStr = item.order.payStatus ? payStatusAry[item.order.payStatus] :'';
                            item.createTimeStr = new Date( item.order.createTime )._format('yyyy/MM/dd');
                            item.orderTypeStr = orderTypeAry[item.order.orderType];

                        });

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
                htmlStr = "<tr> <td colspan='14'><p class='info'>暂无数据</p></td> </tr>"
            }

            me.$tbody.html( htmlStr );
            TplEvent.setPermissions( me.$tbody );
        }
    })

    exports.init = function() {
        var $el = exports.$el;

        var orderList = new OrderList( {'view': $el.find('.m-orderlist')} );

    }
} );

