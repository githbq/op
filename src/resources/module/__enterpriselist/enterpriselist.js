/**
 * index.html 支持人员企业列表
 * 企业列表
 */

define(function(require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');

    var viewStr = require('./enterpriselist.html');

    var EntStatusMap = IBSS.EntStatusMap;

    var EntLst = MClass(M.Center).include({

        PAGESIZE: 20,

        view: viewStr,

        elements: {
            '#OpenSTime': 'openstime', //开通开始时间
            '#OpenETime': 'openetime', //开通结束时间
            '#eiSource': 'source', //来源
            '#eiProvince': 'province', //省市
            '#eiIndustry': 'industry', //行业
            'tbody': 'tbody' //
        },

        events: {
            'click .export-file': function() {
                this.getList(true);
            },
            'click #btnSearch': 'search',
            'click .info-detail': 'detailEve',
            'click .info-trace': 'traceEve',
            'click .info-clue': 'readClue',
            'click .info-zengbangong': function(e) {
                this.trigger('zengbangong', $(e.currentTarget).attr('data-id'), $(e.currentTarget).attr('data-account'))
            }, //增购办公版
            'click .info-zengyingxiao': function(e) {
                this.trigger('zengyingxiao', $(e.currentTarget).attr('data-id'), $(e.currentTarget).attr('data-account'))
            }, //增购营销版
            'click .info-renewbangong': function(e) {
                this.trigger('renewbangong', $(e.currentTarget).attr('data-id'), $(e.currentTarget).attr('data-account'))
            }, //续费办公版
            'click .info-renewyingxiao': function(e) {
                this.trigger('renewyingxiao', $(e.currentTarget).attr('data-id'), $(e.currentTarget).attr('data-account'))
            }, //续费营销版
            'click .selectall': 'selectAllEve',
            'click .auth': 'authEve',
            'click .deauth': 'deauthEve',
            'click .info-custom': function(e) {
                this.trigger('orderCustom', { 'enterpriseId': $(e.currentTarget).attr('data-enterpriseId') })
            }//联合跟进人
        },

        init: function() {
            EntLst.__super__.init.apply(this, arguments);
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
            /*
             if( me.attrs['param'] && ( me.attrs['param'].length > 0 ) ){
             var param = me.attrs['param'];
             if( param.charAt(0) == 'p' ){
             param = param.slice(1);
             me.attrs['productId'] = param;
             //获取产品列表
             util.api({
             'url': '/product/querypage',
             'data':{
             'isPage': 1
             },
             'success': function( data ){
             console.warn( data );
             if( data.success ){
             var pStr = "";
             data.value.model.content.forEach(function(item){
             if( item.id == me.attrs['productId'] ){
             pStr = '(' + item.name + '(' + item.deviceMaxCount + '终端)：' + '终端' + item.deviceMaxCount + '个/一次性赠送短信' + item.textMessageCount + '条/' + item.storage + ')';
             }
             });
             me.$headerInfo.text( pStr );
             }
             }
             });
             } else {
             param = param.slice(1);
             me.model.set('agentId',param);
             }
             }
             */
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

        //授权
        authEve: function() {
            var me = this;
            var arrays = me.getSelect();

            if (arrays.length <= 0) {
                util.showToast('请选择企业');
                return false;
            }

            util.api({
                'url': '/accountprotectionwhitelist/changeenterpriseauth',
                'data': {
                    'enterpriseAccouts': arrays.join(','),
                    'isAuth': false
                },
                'success': function(data) {
                    console.warn(data);
                    if (data.success) {
                        util.showTip('授权成功');
                        me.getList();
                    }
                }
            });
        },

        //取消授权
        deauthEve: function() {
            var me = this;
            var arrays = me.getSelect();
            console.log('deauth');
            console.log(arrays);

            if (arrays.length <= 0) {
                util.showToast('请选择企业');
                return false;
            }

            util.api({
                'url': '/accountprotectionwhitelist/changeenterpriseauth',
                'data': {
                    'enterpriseAccouts': arrays.join(','),
                    'isAuth': true
                },
                'success': function(data) {
                    console.warn(data);
                    if (data.success) {
                        util.showTip('取消授权成功');
                        me.getList();
                    }
                }
            })
        },

        //默认置为第一页 搜索
        search: function() {
            this.pagination.setPage(0, false);
            this.getList();
        },

        //获取数据
        getList: function(exportFile) {
            var me = this;

            var fromAppStartTime = '';
            var endAppStartTime = '';

            if (me.$openstime.val()) {
                fromAppStartTime = new Date(me.$openstime.val()).getTime();
            }

            if (me.$openetime.val()) {
                endAppStartTime = new Date(me.$openetime.val()).getTime();
            }

            var accountName = "";
            if (me.attrs['param']) {
                accountName = me.attrs['param'];
            }
            var data = {
                pageIndex: me.pagination.attr['pageNumber'] + 1,
                pageSize: me.pagination.attr['pageSize'],
                ea: me.model.get('ea'),
                en: me.model.get('en'),
                enterpriseStatus: me.model.get('enterpriseStatus'),
                source: me.model.get('source'),
                industry: me.model.get('industry'),
                province: me.model.get('province'),
                city: me.model.get('city'),
                tel: me.model.get('tel'),
                'creatorName': me.model.get('creatorName'),
                'isLinkRegister': me.model.get('isLinkRegister'),
                'hasProduct': me.model.get('hasProduct'), //包含某种产品
                'vendorId': me.model.get('vendorId'), //优惠码
                'isPresent': me.model.get('isPresent'), //是否赠送办公版
                'isPay': me.model.get('isPay'), //是否付费
                'isCoupon': me.model.get('isCoupon'), //是否是优惠企业
                fromAppStartTime: fromAppStartTime,
                endAppStartTime: endAppStartTime,
                clueUpdateTimeType: $('#update').val(),
                'accountName': accountName
            };
            if (exportFile === true) {
                window.open(IBSS.API_PATH + '/enterprise/exportTrialData?' + $.param(data));
                return;
            }
            util.api({
                url: '/enterprise/querypage',
                data: data,
                beforeSend: function() {
                    me.$tbody.html('<tr><td colspan="10"><p class="info">加载中...</p></td></tr>');
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

        //查看线索
        readClue: function(e){
            var clueID = $(e.currentTarget).attr('data-clue');
            this.trigger('clue', clueID);
        },

        //渲染至页面
        render: function() {
            this.attrs['wrapper'].html(this.$view);
        }

    });

    module.exports = EntLst;
});
