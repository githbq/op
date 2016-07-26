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
    var CustomTree=require('module/customtree/customtree').getDialog();

    //转移企业
    //=============================
    var TransEnt = MClass( Dialog ).include({
        defaultAttr:{
            'title': '转移企业',
            'width': 575
        },
        events:{
            'click .action-submit': 'submitEve',
            'click .action-cancel': 'hide',
            'click input:radio[name=company]': 'changeType', 
            'click #dept': 'selectDeptEve'
        },
        elements:{
            '#departmentText': 'departmentText',
            '#dept': 'dept',
            '#sales': 'sales'
        },
        content: template.filter('#transfer').html(),
        show: function(aId){
            TransEnt.__super__.show.apply( this, arguments );
            this.aId = aId;
            this.$sales.prop('disabled',true);
        },
        init: function(){
            TransEnt.__super__.init.apply( this, arguments );
        },

        changeType: function(e){
            var me = this;
            if($(e.currentTarget).val() == me.type){
                return;
            }
            me.$departmentText.val('');
            me.$dept.val('');
            me.$sales.html('<option value="">--------</option>').prop('disabled',true);
        },

        //提交
        submitEve: function(){
            var me = this;
            var sales = me.$sales.val(),
                type = $("input[type=radio]:checked").val(),
                dept = me.$dept.val();
            if(!type){
                util.showToast('请选择代理商类型');
                return;
            }
            if(!dept){
                util.showToast('请选择部门');
                return;
            }
            if((type == 1)&&(!sales)){
                util.showToast('请选择销售人员');
                return;
            }
            //选择与提交type值不同
            if( type ==2 ){
                type = 1;
            }else if(type ==1){
                type = 2;
            }
         
            util.api({
                url: '~/op/api/a/enterprise/transferEnterprises',
                data: {
                    accountId: sales,
                    agentType: type,
                    vendorId: dept,
                    enterpriseIds: me.aId.join(',') 
                },
                success: function(data) {
                    if(data.success){
                        util.showTip('企业转移成功');
                        me.hide();
                        me.trigger('success');
                    }
                }
            });

        },

        //隐藏
        hide: function(){
            TransEnt.__super__.hide.apply( this, arguments );
            var me = this;
            me.aId = '';
            $("input[type=radio]").prop('checked', false);
            me.$departmentText.val('');
            me.$dept.val('');
            me.$sales.html('<option value="">--------</option>').prop('disabled',true);
        },
        //选择部门
        selectDeptEve:function(){
            var me = this;
            var type = $("input[type=radio]:checked").val()
            me.type = type;
            if(!type){
                util.showToast('请选择公司类型');
                return false;
            }
            me.deptTree= new CustomTree({ 
                'title': '转移企业-选择部门',
                searchOptions:{show:true,title:'部门名称'},
                ztreeOptions:{
                    expandAll:false,
                    check:{chkStyle: "radio",radioType: "all"},
                    checkStyle:"radio"
                },
                ajaxData:{
                    url:'~/op/api/s/enterprise/getSalesDepartment',
                    data: {
                        companyType: type
                    }
                }
            });
            me.deptTree.on('enter', function (  ) {
                me.deptObj = me.deptTree.getValue() ? me.deptTree.getValue()[0]: null;
                me.deptObjId = [me.deptObj.id];
                me.postObjId = [];
                me.postObj = null;
                me.deptObj ? me.$departmentText.val(me.deptObj.name ):me.$departmentText.val('');
                me.$dept.val(me.deptObjId[0]);
                util.api({
                    url: '~/op/api/s/enterprise/queryAccountByDeptId',
                    data: {
                        deptId: me.deptObjId[0]
                    },
                    success: function(res) {
                        if(res.success){
                            if(res.model.length > 0){
                                var options = '<option value="" disabled selected style="display: none;">请选择</option>';
                                var con = res.model;
                                $(con).each(function(index, item){
                                    options += '<option value="'+item.id+'">'+item.name+'</option>';
                                });
                                me.$sales.prop('disabled',false);
                                me.$sales.html(options);
                            }else{
                                me.$sales.html('<option value="">--------</option>');
                            }
                        }
                    }
                });
            });
            me.deptTree.show( [ me.$dept.val() ], {});
        }
    });

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
    });

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
            me.transEnt.on('success', function(){
                me.getList();
            });
            resetSelect( me.$view, 'entstatus');
            resetSelect( me.$view, 'enttype');

            me.setState();
            //初始化
            //me.initializeSelect();
            me.getList();
        },
        //打开转移企业弹窗
        transferEve: function(){
            var array = this.getSelect();
            if(array.length <= 0){
                util.showToast('请选择企业！');
                return;
            }
            this.transEnt.show( array );
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
                status = $(e.currentTarget).attr('data-status'),
                entname = $(e.currentTarget).attr('data-entname');

            this.trigger('detail', id, status, entname );
        },

        //企业跟踪记录
        traceEve: function(e) {
            var id = $(e.currentTarget).attr('data-id');
            this.trigger('trace', id);
        },

        //线索
        clueEve: function(e){
            var id = $(e.currentTarget).attr('data-clue');
            this.trigger('clue',id);
        },

        //增购 续费
        renewEve: function(e) {
            var me = this;
            var id = $(e.currentTarget).attr('data-id');
            var account = $(e.currentTarget).attr('data-account');
            var entName = $(e.currentTarget).attr('data-entname');

            me.trigger('renew',id,account,entName);
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
