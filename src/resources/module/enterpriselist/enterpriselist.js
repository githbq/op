//
// 支持人员(小助手) 代理商用 企业列表
//====================================

define(function(require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');
    var Dialog = require('common/widget/dialog/dialog');

    var viewStr = require('./enterpriselist.html');
    var template = $( require('./template.html') );

    var EntStatusMap = IBSS.EntStatusMap;
    var enumdata = require('module/data/data').data;
    var resetSelect = require('module/data/data').resetSelect;


    //转移企业
    //=============================
    var TransEnt = MClass( Dialog ).include({
        defaultAttr:{
            'title': '转移企业',
            'width': 330
        },
        events:{
            'click .action-submit': 'submitEve',
            'click .action-cancel': 'hide'
        },
        content: template.filter('#transfer').html(),
        init: function(){
            TransEnt.__super__.init.apply( this, arguments );
        },

        //提交
        submitEve: function(){
            var me = this;
            console.log('this is submit');
        },

        //隐藏
        hide: function(){
            TransEnt.__super__.hide.apply( this, arguments );
        }
    })

    //沙盒设置
    //==================================
    var SandBox = MClass( Dialog ).include({
        defaultAttr:{
            'title':'沙盒设置',
            'width':530
        },
        content: template.filter('#sandbox').html(),
        init: function(){
            SandBox.__super__.init.apply( this, arguments );
            var me = this;

            me.model.on('change:state',function( key , value ){

                console.log( 'changestate' );
                console.log( value );
                
                value = ( value == null )? '':value;

                switch( value ){
                    
                    case '':
                        me.$('.state-open').hide();
                        me.$('.state-close').hide();
                        break;
                    case 'open':
                        me.$('.state-open').show();
                        me.$('.state-close').hide();
                        break;
                    case 'close':
                        me.$('.state-open').hide();
                        me.$('.state-close').show();
                        break;
                }
            });
        },
        hide: function(){
            var me = this;
            me.model.clear();
            SandBox.__super__.hide.apply( this, arguments );
        }
    })

    //
    // 企业列表
    //===================================
    var EntLst = MClass(M.Center).include({

        PAGESIZE: 20,

        view: viewStr,

        elements: {
            'tbody': 'tbody'            //
        },

        events: {
            'click .export-file': function() {
                this.getList(true);
            },
            'click #btnSearch': 'search',         // 查询
            'click .info-detail': 'detailEve',    // 查看详情
            'click .info-trace': 'traceEve',      // 跟踪记录
            'click .info-clue': 'clueEve',        // 线索
            'click .info-renew': 'renewEve',      // 增购/续费
            'click .info-custom': function(e) {
                console.log('do do do');
                this.trigger('orderCustom', { 'enterpriseId': $(e.currentTarget).attr('data-enterpriseId') })
            }, //联合跟进人

            'click .selectall': 'selectAllEve',     //全选
            'click .btn-transfer': 'transferEve',   //转移
            'click .btn-sandbox': 'sandboxEve'      //沙盒
        },

        init: function() {
            EntLst.__super__.init.apply(this, arguments);
            var me = this;

            me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager .pages'),
                pageSize: me.PAGESIZE,
                pageNumber: 0
            });
            me.pagination.render();
            me.pagination.onChange = function() {
                me.getList();
            }

            me.transEnt = new TransEnt();
            me.sandBox = new SandBox();

            resetSelect( me.$view, 'entstatus');
            resetSelect( me.$view, 'enttype');

            me.setState();
            //初始化
            //me.initializeSelect();
            me.getList();
        },
        //打开转移企业弹窗
        transferEve: function(){
            this.transEnt.show();
        },
        //打开沙盒设置弹窗
        sandboxEve: function(){
            this.sandBox.show();
        },
        
        //设置状态
        setState: function(){
            var me = this;
            me.$('[data-state]').hide();
            me.$('[data-state="' + me.attrs.state + '"]').show();
        },
        //初始化枚举选择
        /*
        initializeSelect: function() {
            var me = this;

            var state = 0;


            //
            util.getIndustry(me.$industry, function() {

                state = state + 1;
                if (state >= 3) {
                    me.getList();
                }
            });
            generateSelect('ENT_LST_SOURCE', this.$source); //来源
            generateSelect('PROVINCE', this.$province); //省市


            function generateSelect( name, $select ) {
                util.getEnums(name, function(data) {

                    var items = data.value.model;
                    var options = "";

                    items.forEach(function(item, index) {
                        options += '<option value="' + item.value + '" title="' + item.text + '">' + item.text + '</option>';
                    });

                    $select.append(options);
                    state = state + 1;

                    if (state >= 3) {
                        me.getList();
                    }
                });
            }
        },
        */
        //选择全部
        selectAllEve: function(e) {
            var me = this;

            var bool = $(e.currentTarget).prop('checked');

            me.$('.selectitem').each(function(index, item) {
                item.checked = bool
            });
        },

        //清除所有选择
        clearSelect: function() {
            this.$('.selectitem').each(function(index, item) {
                item.checked = false;
            });
            this.$('.selectall').prop('checked', false);
        },

        //获取选中的数组
        getSelect: function() {
            var me = this
            var array = [];
            me.$('.selectitem').each(function(index, item) {
                if (item.checked) {
                    array.push($(item).val());
                }
            });
            return array;
        },

        //默认置为第一页 搜索
        search: function() {
            this.pagination.setPage(0, false);
            this.getList();
        },

        //获取数据
        getList: function( exportFile ) {
            var me = this;

            /*
            var accountName = "";
            if (me.attrs['param']) {
                accountName = me.attrs['param'];
            }
            */
            var data = me.model.all();
            data.pageIndex = me.pagination.attr['pageNumber'] + 1;
            data.pageSize = me.pagination.attr['pageSize'];

            if (exportFile === true) {
                window.open(IBSS.API_PATH + '/enterprise/exportTrialData?' + $.param(data));
                return;
            }
            util.api({
                url: '/enterprise/querypage',
                data: data,
                beforeSend: function() {
                    me.$tbody.html('<tr><td colspan="14"><p class="info">加载中...</p></td></tr>');
                },
                success: function(data) {
                    if (data.success) {
                        me.pagination.setTotalSize(data.value.model.itemCount);
                        if (data.value.model.content.length > 0) {
                            me.list.reload(data.value.model.content, function( item ) {
                                item.entTypeStr = enumdata['enttype'][item.enterpriseType];
                                item.entStatusStr = enumdata['entstatus'][item.csmEnterprise.runStatus];

                                if( item.isOverLimitWarn ){
                                    item.isOverLimitWarnStr = '是';
                                } else {
                                    item.isOverLimitWarnStr = '否';
                                }
                            });
                            me.setState();
                            me.clearSelect();
                        } else {
                            me.pagination.setPage(0, false);
                            me.$tbody.html("<tr><td colspan='10'><p class='info'>暂无数据</p></td></tr>")
                        }
                    }
                },
                error: function() {
                    me.$tbody.html('<tr><td colspan="11"><p class="info">数据加载失败</p></td></tr>');
                }
            });
        },

        //查看详情
        detailEve: function(e) {
            var id = $(e.currentTarget).attr('data-id'),
                status = $(e.currentTarget).attr('data-status');
            this.trigger('detail', id, status);
        },

        //企业跟踪记录
        traceEve: function(e) {
            var id = $(e.currentTarget).attr('data-id');
            this.trigger('trace', id);
        },

        //线索
        clueEve: function(e){
            var id = $(e.currentTarget).attr('data-id');
            console.log('clue');
            this.trigger('clue',id);
        },

        //增购 续费
        renewEve: function(e) {
            var me = this;
            var id = $(e.currentTarget).attr('data-id');
            var account = $(e.currentTarget).attr('data-account');

            me.trigger('renew',id,account);
        },

        //联合跟进人
        followup: function(e) {
            var me = this;
            var id = $(e.currentTarget)
        },

        //渲染至页面
        render: function() {
            this.attrs['wrapper'].html(this.$view);
        }

    });

    module.exports = EntLst;
});
