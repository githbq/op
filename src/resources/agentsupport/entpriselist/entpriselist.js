define(function(require, exports, module) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
    var Slider = require('common/widget/slider/slider');
    var EntDetail = require('module/enterprisedetail/enterprisedetail');        //企业详情Slider
    var EntTrace = require('module/enttrace/enttrace');                         //企业跟踪记录
    var uploader = require('common/widget/upload').uploader;                    //
    var InputHandler = require('common/widget/input-handler/inputhandler');     //
    var Select = require('common/widget/select/select');                        //
    var CustomHelper = require('../../order/widget/customhelper/customhelper'); //

    var Clue = require('module/readclue/readclue');

    var tem = $(require('./template.html'));

    var pMap = {}, //产品状态
        industryMap = {}, //行业
        activityMap = {}; //活跃度

    /**
     *
     * 企业列表
     */
    var EntStatusMap = IBSS.EntStatusMap;

    var EntList = MClass(M.Center).include({

        PAGESIZE: 20,

        elements: {
            '#OpenSTime': 'openstime', //开通开始时间
            '#OpenETime': 'openetime', //开通结束时间
            '#eiSource': 'source', //来源
            '#eiProvince': 'province', //省市
            '#eiIndustry': 'industry', //行业
            'tbody': 'tbody' //
        },

        events: {
            'click #btnSearch': 'search',
            'click .info-detail': 'detailEve',
            'click .info-clue': 'readClue',
            'click .info-zengbangong': function(e) { this.trigger('zengbangong', $(e.currentTarget).attr('data-id'), $(e.currentTarget).attr('data-account')) }, //增购办公版
            'click .info-zengyingxiao': function(e) { this.trigger('zengyingxiao', $(e.currentTarget).attr('data-id'), $(e.currentTarget).attr('data-account')) }, //增购营销版
            'click .info-renewbangong': function(e) { this.trigger('renewbangong', $(e.currentTarget).attr('data-id'), $(e.currentTarget).attr('data-account')) }, //续费办公版
            'click .info-renewyingxiao': function(e) { this.trigger('renewyingxiao', $(e.currentTarget).attr('data-id'), $(e.currentTarget).attr('data-account')) }, //续费营销版
            'click .info-trace': 'traceEve',
            'click .info-enterpriseAssign': 'assignEve',
            'click .info-custom': function(e) { this.trigger('orderCustom', { 'enterpriseId': $(e.currentTarget).attr('data-enterpriseId') }) }, //联合跟进人
        },

        init: function() {
            EntList.__super__.init.apply(this, arguments);
            var me = this;

            me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager'),
                pageSize: me.PAGESIZE,
                pageNumber: 0
            });
            me.pagination.render();
            me.pagination.onChange = function() {
                me.getList();
            }

            //初始化时间控件
            me.$openstime.datetimepicker({ format: 'Y/m/d', timepicker: false });
            me.$openetime.datetimepicker({ format: 'Y/m/d', timepicker: false });

            if (me.attrs['param'] && (me.attrs['param'].length > 0)) {
                var param = me.attrs['param'];
                if (param.charAt(0) == 'p') {
                    param = param.slice(1);
                    me.attrs['productId'] = param;
                    //获取产品列表
                    util.api({
                        'url': '/product/querypage',
                        'data': {
                            'isPage': 1
                        },
                        'success': function(data) {
                            console.warn(data);
                            if (data.success) {
                                var pStr = "";
                                data.value.model.content.forEach(function(item) {
                                    if (item.id == me.attrs['productId']) {
                                        pStr = '(' + item.name + '(' + item.deviceMaxCount + '终端)：' + '终端' + item.deviceMaxCount + '个/一次性赠送短信' + item.textMessageCount + '条/' + item.storage + ')';
                                    }
                                });
                                me.$headerInfo.text(pStr);
                            }
                        }
                    });
                } else {
                    param = param.slice(1);
                    me.model.set('agentId', param);
                }
            }

            //初始化
            me.initializeSelect();
        },

        //初始化枚举选择
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


            function generateSelect(name, $select) {
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

        //默认置为第一页 搜索
        search: function() {
            this.pagination.setPage(0, false);
            this.getList();
        },

        //获取数据
        getList: function() {
            var me = this;

            var fromAppStartTime = '';
            var endAppStartTime = '';

            if (me.$openstime.val()) {
                fromAppStartTime = new Date(me.$openstime.val()).getTime();
            }

            if (me.$openetime.val()) {
                endAppStartTime = new Date(me.$openetime.val()).getTime();
            }

            util.api({
                url: '/enterprise/querypage',
                data: {
                    pageIndex: me.pagination.attr['pageNumber'] + 1,
                    pageSize: me.pagination.attr['pageSize'],
                    ea: me.model.get('ea'),
                    en: me.model.get('en'),
                    enterpriseStatus: me.model.get('enterpriseStatus'),
                    source: me.model.get('source'),
                    industry: me.model.get('industry'),
                    province: me.model.get('province'),
                    isLinkRegister: me.model.get('isLinkRegister'),
                    creatorName: me.model.get('creatorName'),
                    city: me.model.get('city'),
                    tel: me.model.get('tel'),
                    'isCoupon': me.model.get('isCoupon'), //是否是优惠企业

                    'hasProduct': me.model.get('hasProduct'), //包含某种产品
                    'vendorId': me.model.get('vendorId'), //优惠码
                    'isPresent': me.model.get('isPresent'), //是否赠送办公版
                    'isPay': me.model.get('isPay'),
                    'clueUpdateTimeType': $('#update').val(),

                    fromAppStartTime: fromAppStartTime,
                    endAppStartTime: endAppStartTime
                },
                beforeSend: function() {
                    me.$tbody.html('<tr><td colspan="9"><p class="info">加载中...</p></td></tr>');
                },
                success: function(data) {

                    if (data.success) {
                        me.pagination.setTotalSize(data.value.model.itemCount);

                        if (data.value.model.content.length > 0) {
                            me.list.reload(data.value.model.content, function(item) {

                                if (item.csmEnterprise.appStartTime) {
                                    item.createtimestr = new Date(item.csmEnterprise.appStartTime)._format("yyyy-MM-dd");
                                } else {
                                    item.createtimestr = "——";
                                }

                                item.runstatusstr = EntStatusMap[item.csmEnterprise.runStatus];

                                if (item.protectionWhiteListStatus == 0) {
                                    item.authStr = "全部授权"
                                } else if (item.protectionWhiteListStatus == 1) {
                                    item.authStr = "未授权"
                                } else if (item.protectionWhiteListStatus == 2) {
                                    item.authStr = "部分授权"
                                }

                                if (!item.cRMVisible) {
                                    item.crmvisible = "——";
                                } else if (item.cRMVisible == 1) {
                                    item.crmvisible = "所有下级可见";
                                } else if (item.cRMVisible == 2) {
                                    item.crmvisible = "直属下级可见";
                                }

                            });
                        } else {
                            me.$tbody.html("<tr><td colspan='9'><p class='info'>暂无数据</p></td></tr>")
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

        //查看线索
        readClue: function(e){
            var clueID = $(e.currentTarget).attr('data-clue');
            this.trigger('clue', clueID);
        },

        //分配
        assignEve: function(e) {
            var id = $(e.currentTarget).attr('data-id');

            this.trigger('assign', id);
        },

        //渲染至页面
        render: function() {
            this.attrs['wrapper'].html(this.$view);
        }

    });

    /**
     * 分配详情
     */
    var EnterpriseAssign = MClass(Slider).include({

        content: tem.filter('#enterpriseAssignTem').html(),

        defaultAttr: {
            'width': 616,
            'title': '企业分配详情'
        },
        accountList: [],
        elements: {
            '.enterprise-assign-Info tbody': 'tbenterpriseAssList',
            '#entAssgin': 'entAssginId',
            '.search-name': 'searchName'
        },

        events: {
            'click .sale-bind-enterprise': 'saleBindEnterprise',
            'click .btn-search': 'searchEve'
        },
        tpassginEntList: _.template(tem.filter('#trenterpriseAssign').html()),

        init: function() {
            EnterpriseAssign.__super__.init.apply(this, arguments);
            var me = this;
            me.$searchName.on('keyup', function() {
                var wd = $(this).val();
                if (wd == '') {
                    $('.enterprise-assign-Info tbody tr').show();
                } else {
                    $('.enterprise-assign-Info tbody tr').each(function() {
                        var feed = me.getList($(this).attr('data-id'));
                        if (feed.name.match(wd)) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });
                }
                return false;
            });
        },
        saleBindEnterprise: function(e) {
            var me = this,
                $target = $(e.currentTarget),
                accountId = $target.attr('data-id'),
                enterpriseId = me.$entAssginId.attr('data-enterprise'),
                data = {
                    accountId: accountId,
                    enterpriseId: enterpriseId
                };
            if (confirm("确定要将企业分配给该销售人员吗？")) {
                util.api({
                    url: '/enterprise/assignenterprise',
                    data: data,
                    success: function(data) {
                        if (data.success) {
                            util.showTip('绑定成功');
                            me.trigger('success');
                            me.hide();
                        }
                    }
                });
            }
            return false;
        },
        searchEve: function() {
            var me = this;
            util.api({
                'url': '/agent/getassignchannellist',
                'data': {
                    'name': me.model.get('name')
                },
                'success': function(data) {
                    console.warn(data);
                    if (data.success) {
                        if (data.model.length > 0) {
                            me.$tbenterpriseAssList.html(me.tpassginEntList({ content: data.model }));
                        } else {
                            me.$tbenterpriseAssList.html('<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>');
                        }
                    }
                }
            })
        },
        getList: function(id) {
            var me = this;
            var list = me.accountList;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    return list[i];
                }
            }
            return null;
        },
        //显示代理商列表
        show: function(id) {
            var me = this;
            me.$entAssginId.attr('data-enterprise', id);

            util.api({
                'url': '/agent/querysalesaccount',
                'data': {
                    'name': ''
                },
                'success': function(data) {
                    console.warn(data);
                    if (data.success) {
                        if (data.value.model.length > 0) {
                            me.accountList = data.value.model;
                            me.$tbenterpriseAssList.html(me.tpassginEntList({ content: data.value.model }));
                        } else {
                            me.accountList = [];
                            me.$tbenterpriseAssList.html('<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>');
                        }
                    }
                }
            })
            EnterpriseAssign.__super__.show.apply(this, arguments);
        },

        hide: function() {
            this.model.clear();
            this.$entAssginId.attr('data-enterprise', '');
            this.accountList = [];
            this.$('.state').hide();
            EnterpriseAssign.__super__.hide.apply(this, arguments);
        }
    });

    exports.init = function(param) {
        var $el = exports.$el;

        //企业列表
        var entList = new EntList({ 'view': $el.find('.m-ent-lst'), 'productId': param && param[0] });

        //企业详情
        var entDetail = new EntDetail({ 'isAgent': true });

        //分配详情
        var enterpriseAssign = new EnterpriseAssign();

        var customHelper = null;

        //企业跟踪记录
        var entTrace = new EntTrace();

        //线索
        var clue = new Clue()


        //企业分配
        entList.on('assign', function(id) {
            enterpriseAssign.show(id);
        });

        //企业详情
        entList.on('detail', function(id) {
            entDetail.show(id);
        });

        //企业跟踪记录
        entList.on('trace', function(id) {

            console.warn('trace');
            console.warn(id);
            entTrace.show(id);
        });

        enterpriseAssign.on('success', function() {
            entList.getList();
        });

        //刷新列表
        entDetail.on('refresh', function() {
            entList.getList();
        });

        //增购办公
        entList.on('zengbangong', function(id, account) {
            console.log('zengbangong');
            console.log(id);
            location.hash = "order/newmarketying/addOffice/" + id + '/' + account;
        });
        //增购营销
        entList.on('zengyingxiao', function(id, account) {
            console.log('zengyingxiao');
            console.log(id);
            location.hash = "order/newmarketying/addMarkey/" + id + '/' + account;
        });
        //续费办公
        entList.on('renewbangong', function(id, account) {
            console.log('renewbangong');
            console.log(id);
            location.hash = "order/newmarketying/againOffice/" + id + '/' + account;
        });
        //续费营销
        entList.on('renewyingxiao', function(id, account) {
            console.log('renewyingxiao');
            console.log(id);
            location.hash = "order/newmarketying/againMarkey/" + id + '/' + account;
        });
        //联合跟进人
        entList.on('orderCustom', function(options) {

            customHelper = new CustomHelper();
            customHelper.show(options);
        });
        //线索
        entList.on('clue', function( clueID ){
            clue.show(clueID);
        })
    }
});
