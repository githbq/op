/**
 * 
 * 销售漏斗
 * 渠道查看有分页 
 * 内部管理员查看没有分页
 */

define( function(require, exports, module){

    var Pagination = require('common/widget/pagination/pagination');
    var contentStr = require('./funnellist.html');
    
    //
    var FunnelList = MClass( M.Center ).include({
        
        'view': contentStr,
        init: function(){
            var me = this;
            FunnelList.__super__.init.apply( this , arguments );

            me.$starttime.datetimepicker( {'timepicker': false,'format':'Y/m/d'} );
            me.$endtime.datetimepicker( {'timepicker': false,'format':'Y/m/d'} );

            if( me.attrs.state != 'agentsupport'){
                me.pagination = new Pagination({
                    wrapper: me.$view.find('.list-pager'),
                    pageSize: 10,
                    pageNumber: 0
                });
                me.pagination.render();
                me.pagination.onChange = function() {
                    me.getList();
                }
            }
            me.getList();
        },
        render: function(){
            var me = this;

            me.attrs.wrapper.html( me.$view );
        },
        elements:{
            '.starttime': 'starttime',
            '.endtime': 'endtime'
        },
        events:{
            'click .export': 'exportEve',
            'click .funnel-search': 'getList'
        },

        exportEve: function( e ){

            if( me.$starttime.val() ){
                starttime = new Date( me.$starttime.val() + ' 00:00' ).getTime();
            }
            if( me.$endtime.val() ){
                endtime = new Date( me.$endtime.val() + ' 23:59').getTime();
            }

            var param = $.param({'startTime':starttime,'endTime':endtime});

            window.open( IBSS.API_PATH + '/enterprisefiling/downloadreport' + param);
        },

        //获取销售漏斗数据
        getList: function(){
            var me = this;

            var data={};

            var starttime = '',
                endtime = '';

            if( me.$starttime.val() ){
                starttime = new Date( me.$starttime.val()+ ' 00:00').getTime();
            }
            if( me.$endtime.val() ){
                endtime = new Date( me.$endtime.val()+ ' 23:59').getTime();
            }

            data.startTime = starttime;
            data.endTime = endtime;

            if( me.attrs.state != 'agentsupport'){

                data.pageIndex = me.pagination.attr['pageNumber'];
                data.pageSize = me.pagination.attr['pageSize'];
            }
            util.api({
                'url': '/enterprisefiling/getreport',
                'data': data,
                'success': function( data ){
                    console.warn( data );

                    if( data.success ){
                        me.pagination && me.pagination.setTotalSize( data.value.model.itemCount );
                        if( me.attrs.state != 'agentsupport'){
                            me.list.reload( data.value.model.content );
                        }else{
                             me.list.reload( data.value.model);
                        }
                    }
                } 
            })
        }
    })

	module.exports = FunnelList;
});
