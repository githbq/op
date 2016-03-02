define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
    var EntInfo = require('module/entinfo/entinfo');
    var Tem = $( require('./template.html') );

    var sMap = TPL.sMap = {},     //来源
        pMap = TPL.pMap = {},     //省市
        uMap = TPL.uMap = {};     //状态

    var RegList = MClass( M.Center ).include({
        trTpl: _.template( Tem.filter('.trTpl').html() ),
        init: function(){
            RegList.__super__.init.apply( this, arguments );

            var me = this;
            me.pagination = new Pagination({
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

            me.$startTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});
            me.$endTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});


            me.getEnums();
        },

        elements:{
            'tbody': 'tbody',
            '.sourceEnum': 'sourceEnum',
            '.provinceEnum': 'provinceEnum',
            '.statusEnum': 'statusEnum',
            '.startTime': 'startTime',
            '.endTime': 'endTime'
        },

        events:{
            'click .search': 'searchEve',
            'click .detail': 'detailEve'
        },

        //获取枚举值
        getEnums: function(){
            var me = this;

            //来源
            var sList = [ {'name':'全部','value':''} ];
            var state = {
                's': false,
                'p': false,
                'u': false
            }
            function check(){
                if( state.s && state.p && state.u ){
                    me.getList();
                }
            }

            util.getEnums('ENT_IND_SOURCE',function( data ){
                data.value.model.forEach(function( item ){
                    sList.push({ 'name':item.text, 'value':item.value });
                    sMap[item.value] = item.text;
                });
                util.resetSelect( me.$sourceEnum , sList );
                state.s = true;
                check();
            });

            //省市
            var pList = [ {'name':'全部','value':''} ];

            util.getEnums('PROVINCE',function( data ){
                data.value.model.forEach(function( item ){
                    pList.push({ 'name':item.text, 'value':item.value });
                    pMap[item.value] = item.text;
                });
                util.resetSelect( me.$provinceEnum, pList );
                state.p = true;
                check();
            });

            //状态
            var uList = [{'name':'全部','value':''}];

            util.getEnums('ENT_IND_PSTS',function( data ){
                data.value.model.forEach(function( item ){
                    uList.push({ 'name':item.text, 'value':item.value });
                    uMap[item.value] = item.text;
                });
                util.resetSelect( me.$statusEnum , uList);
                state.u = true;
                check();
            });
        },

        searchEve: function(){
            this.pagination.setPage( 0,false );
            this.getList();
        },

        detailEve: function( e ){
            var id = $( e.currentTarget ).attr('data-id');
            this.trigger('detail',id);
        },

        getList: function(){
            var me = this;

            var startTime = '',
                endTime = '';

            if( me.$startTime.val() ){
                startTime = new Date( me.$startTime.val() + " 00:00:00" ).getTime();
            }
            if( me.$endTime.val() ){
                endTime = new Date( me.$endTime.val() + " 23:59:59" ).getTime();
            }

            util.api({
                'url':'/enterprise/queryindpage',
                'data':{
                    'pageIndex': me.pagination.attr['pageNumber'],
                    'pageSize': me.pagination.attr['pageSize'],
                    'enterpriseName': me.model.get('enterpriseName'),
                    'enterpriseAccount': me.model.get('enterpriseAccount'),
                    'vendorId': me.model.get('vendorId'),
                    'province': me.model.get('province'),
                    'source': me.model.get('source'),
                    'status': me.model.get('status'),
                    'timeBegin': startTime,
                    'timeEnd': endTime
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload( data.value.model.content, function( item ){
                            item.sourceStr = sMap[item.source];
                            item.provinceStr = pMap[item.province];
                            item.statusStr = uMap[item.status];
                            item.registerTimeStr = new Date( item.registerTime )._format('yyyy-MM-dd hh:mm');
                        });
                    }
                }
            })
        },

        renderList: function(){
            var me = this;

            var collection = me.collection.all();
            var htmlStr = '';

            if( collection.length > 0 ){
                htmlStr = me.trTpl( {'content': collection} );
            } else {
                htmlStr = "<tr><td colspan='10'><p class='info'>暂无数据</p></td></tr>";
            }

            me.$tbody.html( htmlStr );
        }
    });



    exports.init = function() {
        var $el = exports.$el;

        var regList = new RegList( {'view':$el.find('.m-regList')} );
        var entInfo = new EntInfo();

        regList.on('detail',function( id ){
            entInfo.show( id ,true);
        });
    }
} );