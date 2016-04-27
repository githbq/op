/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

	var Slider = require('common/widget/slider/slider');
    var Dialog = require('common/widget/dialog/dialog');
    var Pagination = require('common/widget/pagination/pagination');
    var contentStr = require('./filinglog.html');
    var Tem = $( require('./template.html') );


    var logMap = {}    //记录类别枚举

    /**
     * 服务记录
     */
    var LogList = MClass( Slider ).include({
        content: contentStr,
        trTpl: _.template( Tem.filter('#trTpl').html() ),
        defaultAttr:{
            'width': 760,
            'title': '备案客户服务记录'
        },

        elements:{
            '.type': 'type',
            'tbody': 'tbody',
            '.stime': 'startTime',
            '.etime': 'endTime',
            '.serviceInfo': 'info',
            '.vendorLabel': 'vendorLabel'
        },

        events: {
            'click .search': 'searchEve',
            'click .detail': 'detailEve',
            'click .addLog': 'ishowEve',
            'click .iback': 'ibackEve',
            'click .isubmit': 'isubmitEve'
        },

        //初始化
        init: function(){
            LogList.__super__.init.apply( this, arguments );
            var me = this;

            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 10,
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

            me.$startTime.datetimepicker( {'timepicker': false,'format':'Y-m-d'} );
            me.$endTime.datetimepicker( {'timepicker': false,'format':'Y-m-d'} );
        },

        searchEve: function(){
            this.pagination.setPage(0,false);
            this.getList();
        },

        detailEve: function(e){
            var id = $( e.currentTarget ).attr('data-id');
            this.$info.show();
        },

        //显示
        ishowEve: function(e){
            console.log('show');
            this.$info.show();
        },

        //返回
        ibackEve: function(e){
            this.model.set('traceInfo','');
            this.$info.hide();
        },
        
        //提交 增加跟踪信息
        isubmitEve: function(e){
            var me = this;

            util.api({
                'url': '/enterprisefiling/tracefiling',
                'data':{
                    'vendorId': me.model.get('vendorId'),
                    'enterpriseFilingId': me.model.get('enterpriseFilingId'),
                    'remark': me.model.get('traceInfo')
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.ibackEve();
                        me.searchEve();
                    }
                }
            });
        },

        //获取类别枚举值
        getEnums: function( ){
            var me = this;

            var logList = [ {'name':'全部','value':''} ];
            util.getEnums('FILING_LOG_TYPE',function( data ){
                
                data.value.model.forEach(function(item){
                    logList.push( {'name':item.text, 'value':item.value} );
                    logMap[item.value] = item.text;
                });

                util.resetSelect( me.$type , logList );
                me.getList();
            });
        },

        //查询服务记录
        getList: function( ){
            var me = this;

            var startTime = '',
                endTime = '';

            if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() ).getTime();
            }

            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() ).getTime();
            }


            util.api({
                'url':'/enterprisefiling/queryfilinglog',
                'data':{
                    'enterpriseFilingId': me.model.get('enterpriseFilingId'),
                    'vendorId': me.model.get('vendorId'),
                    'type': me.model.get('type'),
                    'startTime': startTime,
                    'endTime': endTime,
                    'pageIndex': me.pagination.attr['pageNumber']+1,
                    'pageSize': me.pagination.attr['pageSize']
                },
                'success': function( data ){
                    console.warn( data );   
                    if( data.success ){
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload( data.value.model.content,function( item ){
                            item.typeStr = logMap[item.type];
                            item.createTimeStr =  item.creator.lastTryUpdatePswTime ? new Date( item.creator.lastTryUpdatePswTime)._format('yyyy-MM-dd hh:mm'):'';
                        });
                    }
                }
            })
        },

        //渲染
        renderList: function( id ){
            var me = this;

            var collection = me.collection.all();
            var htmlStr = '';
            
            if( collection.length > 0 ){
                htmlStr = me.trTpl( {'content': collection} );
            } else {
                htmlStr = "<tr><td colspan='7'><p class='info'>暂无数据</p></td></tr>";
            }
            me.$tbody.html( htmlStr );
        },

        // 查看详情
        // 获取企业ID enterpriseFilingId
        // 获取企业名称
        show: function( id , name , vendorId ){
            var me = this;

            //根据是否传入vendorId 进行状态切换
            if( vendorId ){
                me.model.set( 'vendorId', vendorId );
                me.$vendorLabel.hide();
            } else {
                me.$vendorLabel.show();
                me.model.set( 'vendorId', '' );
            }


            me.model.set('enterpriseFilingId', id );
            me.model.set('enterpriseName', name );
            me.getEnums();

            LogList.__super__.show.apply( this, arguments );
        },

        hide: function(){
            this.model.clear();
            this.$info.hide();
            LogList.__super__.hide.apply( this, arguments );
        }
    });

	module.exports = LogList;
});
