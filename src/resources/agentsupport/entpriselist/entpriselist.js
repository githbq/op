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

    var tem = $( require('./template.html') );

    var Clue = require('module/readclue/readclue');

    var EntList = require('module/enterpriselist/enterpriselist');

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
        var entList = new EntList({ 'productId': param && param[0] ,'wrapper': $el});

        entList.render();
        //企业详情
        //var entDetail = new EntDetail({ 'isAgent': true });

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
        /*
        entDetail.on('refresh', function() {
            entList.getList();
        });
        */

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
