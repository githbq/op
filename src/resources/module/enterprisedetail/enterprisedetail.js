/**
 *
 * 企业详情
 */
define(function (require, exports, module) {

    var Slider = require('common/widget/slider/slider');

    var contentStr = require('./enterprisedetail.html');
    var Pagination = require('common/widget/pagination/pagination');
    var tpl = $(require('./template.html'));
    var uploader = require('common/widget/upload').uploader;

    var buyMap = new Object({ '1': '赠送', '2': '购买充值' });
    var carMap = new Object({ '0': '未开通服务', '1': '限量购买', '2': '不限量使用' });
	var orderMap = new Object({ '1': '新购', '2': '增购', '3': '续费','4':'增购续费','5':'关联自助册','6':'开源','17':'收尾款订单','18':'线上支付订单' });
	var payStatusMap = {1:'全款',2:'分期',3:'未付'}
	var statusTimeMap = {1:'有效',2:'过期',0:'——'}

    //
    // 企业详情
    //=============================================
    var EntDetail = MClass(Slider).include({

        content: contentStr,

        defaultAttr: {
            title: '企业产品单',
            width: 840
        },

        elements: {
            '#actStartTime': 'actStartTime',  //*活跃度开始时间
            '#actEndTime': 'actEndTime',      //*活跃度结束时间
            '#tSource': 'asource',        //*来源
            '#tCompanySize': 'acompany',  //*公司规模
            '#tSalesSize': 'asales',      //*销售团队规模
            '#tGroupType': 'agroup',      //*使用对象类型
            '#remark': 'remark',          //*
            '#tbProduct': 'tbProduct',    //*
			'#tbProductHistory tbody': 'tbProductList',    //*
			'#orderList tbody': 'tbOrderList',    //订单信息
			'#tryOut tbody': 'tbTryOut',    //试用信息
            '#tbOperation tbody': 'tbOperation', //*
            '#sdXKDC': 'sdXKDC',                //*逍客终端总量
            '#sdXKDUC': 'sdXKDUC',              //*逍客终端 已用量/未用量
            '#yingxiaoSum': 'yingxiaoSum',      //*CRM总量
            '#yingxiaoUsed': 'yingxiaoUsed',    //*CRM已用量/未用量
            '#sdSC': 'sdSC',                    //*空间总量
            '#sdSUC': 'sdSUC',                  //*空间已用量/未用量
            '#sActivity': 'sActivity',          //*??
            '#sdUFS': 'sdUFS',     //*??
            '#sdActionDanger': 'sdActionDanger', //*??
            '#sUFS': 'sUFS',    //*??
            '#sActionDanger': 'sActionDanger',  //*??

            '#sbLogType': 'sbLogType',          //*??
            '#sbLogST': 'sbLogST',              //* 日志信息操作时间
            '#sbLogET': 'sbLogET',              //* 日志信息操作时间到
            '#tbLog tbody': 'tbLog',            //* 日志信息
            '#sbLogType': 'sbLogType',          //* 日志信息类别
            '#sBtnChangeStatistics': 'schangeStatis',     //*使用情况 保存

            '#phonecallback': 'phonecallback',  //电话回访按钮
            '#verification': 'verification',    //资料审核按钮


            '#yingyezhizhao': 'yingyezhizhao',                  //*营业执照图片input
            '#yingyezhizhaonone': 'yingyezhizhaonone',          //*营业执照无图提示
            '#yingyezhizhaoinfo': 'yingyezhizhaoinfo',          //*营业执照显示信息a标签

            '#hetongzhaopian': 'hetongzhaopian',                //*合同input
            '#hetonginfo': 'hetonginfo',                        //*合同图片显示a标签
            '#hetongnone': 'hetongnone',                        //*合同图片无图提示

            '#hetongfbzhaopian': 'hetongfbzhaopian',            //*合同副本input
            '#hetongfbinfo': 'hetongfbinfo',                    //*合同副本显示a标签
            '#hetongfbnone': 'hetongfbnone',                    //*合同副本无图提示

            '#mentou': 'mentou',                                //*门头input
            '#mentouinfo': 'mentouinfo',                        //*门头信息显示a标签
            '#mentounone': 'mentounone',                        //*门头无图提示

            '#companyGateKeyword': 'getcompanyGatekeyword',     //*只读门头照片关键字 
            '#companyGateRemark': 'getcompanyGateRemark',       //*只读门头照片备注
            '.companyGateKeyword': 'setcompanyGatekeyword',     //*设置门头照片关键字
            '.companyGateRemark': 'setcompanyGateRemark',       //*设置门头照片备注

            '#shenheresult': 'shenheresult',
            '#huifangresult': 'huifangresult',

            '#tagSetting': 'tagSetting',
            '.upload': 'saveEve',
            '.notice': 'notice'
        },
        events: {
            'click .accordian h4': 'showAccordian',      //模块的展示隐藏
            'click #btnSaveBasic': 'saveBasicEve',
            'click #tbAgent em': 'changeAgentEve',
            //-'click #btnSBAgentSearch': 'loadAgents',
            'click #sBtnChangeTrial': 'changeTrial',

            'click #sBtnChangeStatistics': 'changeStatistics',
            'click #sBtnChangeStatisticsagent': 'changeStatisticsagent',

            'click #sBtnChangeFunctions': 'changeFunctions',

            'click #sBtnMarketingStop': 'stopMarketing',
            'click #sBtnCustomChange': 'changeCustomStatus',
            'click #sBtnLogSearch': 'searchLog',
            'click #btnResetAdminPassword': 'resetAdminPassword',
            'click #btnStopService': 'stopService',
            'click #btnStartService': 'startService',
            'click .rebackSms': 'rebackSms',
            'click .disSms': 'disSms',
            'click #actDownload': 'actDownloadEve',             //活跃度下载
            'click #btnCardList': 'searchCardList',
            'click #btnCardBuy': 'btnCardBuy',
            'click #btnCardSend': 'btnCardSend',
            'click #btnSBAgentSearch': 'agentSearchEve',        //回访列表
            'click #btnSaveTag': 'saveTag',        //保存企业标签

            'click .upload': 'saveFn',                      //*资料审核提交
            'click .verificationaction-on': 'veriOnEve',    //*资料审核成功
            'click .verificationaction-off': 'veriOffEve',  //*资料审核失败

            'click .callbackaction': 'callbackEve',         //*电话回访记录保存

            'click .savemonitoring': 'saveMonitoringEve',   //保存监控信息

            'click .employee-detail': 'employeeDetailEve',
			'click .detail-order':'detailOrderEve',
            ///'click #crmInfoChange':'crmInfoChangeEve'

            'click .prooff': 'prooffEve',
            'click .proon': 'proonEve',

            'click #openproduct': function () {
                this.toggleProduct(1)
            }, //开启产品
            'click #closeproduct': function () {
                this.toggleProduct(2)
            } //关闭产品                                                        
        },

        tplProduct: _.template(tpl.filter('#trProduct').html()),
        tplAgent: _.template(tpl.filter('#trAgent').html()),
        tplOperation: _.template(tpl.filter('#trOperation').html()),
        tplLog: _.template(tpl.filter('#trLog').html()),
		tbProductTem:_.template(tpl.filter('#trProductList').html()),
		tPOrderList:_.template(tpl.filter('#trOrderList').html()),   //订单信息列表
		tPTryOut:_.template(tpl.filter('#trTryOut').html()),   //试用信息
        tpCardList: _.template(tpl.filter('#trCardList').html()),
        tplCallBackList: _.template(tpl.filter('#callBackList').html()),
        tplMonitorList: _.template(tpl.filter('#monitoringList').html()), //监控列表

        init: function (attrs) {
            EntDetail.__super__.init.apply(this, arguments);

            var me = this;

            //主要记录pagination是否已经初始化 
            //如果已经初始化 就不再初始化

            //使用情况
            me.operations = {
                isInitializes: false,
                initialInfo: {},
                pagination: null
            };
			 //产品历史信息
            me.product = {
                isInitializes: false,
                pagination: null
            };
			//订单信息
            me.orderList = {
                isInitializes: false,
                pagination: null
            };
			//试用列表
            me.tryOut = {
                isInitializes: false,
                pagination: null
            };
            //日志信息
            me.log = {
                isInitializes: false,
                pagination: null
            };
            //
            me.card = {
                isInitializes: false,
                pagination: null
            };

            me.attrs.isPay = 0;

            me.initializeDatepickers();
            me.setState();
        },

        //
        // 初始化日期选择
        //=================================
        initializeDatepickers: function () {
            var me = this;

            //企业日志开始时间
            me.$sbLogST.datetimepicker({
                format: 'Y/m/d',
                onShow: function () {
                    var maxDate = me.$sbLogET.val() ? me.$sbLogET.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            });

            //企业日志结束时间
            me.$sbLogET.datetimepicker({
                format: 'Y/m/d',
                onShow: function () {
                    var minDate = me.$sbLogST.val() ? me.$sbLogST.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            });

            //活跃度开始时间
            me.$actStartTime.datetimepicker({
                format: 'Y/m/d',
                onShow: function () {
                    var maxDate = me.$actEndTime.val() ? me.$actEndTime.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            });

            //活跃度结束时间
            me.$actEndTime.datetimepicker({
                format: 'Y/m/d',
                onShow: function () {
                    var minDate = me.$actStartTime.val() ? me.$actStartTime.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            });

            /*
             me.$cardStartTime.datetimepicker({
             format: 'Y/m/d',
             onShow: function() {
             var maxDate = me.$cardEndTime.val() ? me.$cardEndTime.val() : false;
             this.setOptions({
             maxDate: maxDate
             });
             },
             timepicker: false
             });
             me.$cardEndTime.datetimepicker({
             format: 'Y/m/d',
             onShow: function() {
             var minDate = me.$cardStartTime.val() ? me.$cardStartTime.val() : false;
             this.setOptions({
             minDate: minDate
             });
             },
             timepicker: false
             });
             */

            me.$('#trainstarttime').datetimepicker({
                format: 'Y/m/d',
                timepicker: false
            });

            me.$('#trainendtime').datetimepicker({
                format: 'Y/m/d',
                timepicker: false
            });

            me.$('#monitoringSTime').datetimepicker({
                format: 'Y/m/d',
                timepicker: false
            })

            me.$('#monitoringETime').datetimepicker({
                format: 'Y/m/d',
                timepicker: false
            })
        },

        //每次显示时清空一下缓存信息
        clearinfo: function () {
            var me = this;

            //
            me.$hetongnone.hide();
            me.$hetonginfo.hide();

            //
            me.$hetongfbnone.hide();
            me.$hetongfbinfo.hide();
        },

        //显示
        //@param id       企业id
        //@param status   
        show: function (id, status) {
            var me = this;
            me.enterpriseAccount = '';

            me.clearinfo();

            //获取枚举值 获取完毕后 获取企业信息
            //me.getEnums(id);
            me.initMselect(function () {
                me.getEnums(id);
            });
            EntDetail.__super__.show.apply(this, arguments);
        },

        //
        // 获取省市区信息和行业信息
        //==============================
        initMselect: function (cb) {
            var me = this;

            var state = {
                'a': false,
                'b': false
            };

            //检测是否ok
            function checkOk() {
                if (state.a && state.b) {
                    cb && cb();
                }
            }

            //初始化地区
            function getlist(type, parentValue, el, text, callback) {

                var url, name;
                if (type == 'area') {
                    url = '~/op/api/district/getListByParent';
                    name = 'parentValue';
                } else {
                    url = '~/op/api/enums/getlistByParent';
                    name = 'INDUSTRY_NEW';
                }
                //发送请求
                util.api({
                    'url': url,
                    'data': {
                        'name': name,
                        'parentValue': parentValue
                    },
                    'success': function (data) {
                        if (data.success) {
                            if (type == 'industry') {
                                data.value.model.forEach(function (item) {
                                    item.name = item.text;
                                })
                                console.log(data.value.model);
                            }
                            data.value.model.unshift({'name': text, 'value': ''})
                            util.resetSelect(el, data.value.model);
                            callback && callback();
                        }
                    }
                })
            }

            getlist('area', 0, me.$('#sprovince'), '请选择省', function () {
                state.a = true;
                checkOk();
            });

            me.$('#sprovince').on('change', function () {
                var val = me.$('#sprovince').val();
                if (val) {
                    getlist('area', val, me.$('#scity'), '请选择市', function () {
                        //
                        if (me.attrs.mstate.a2 == false) {
                            me.$('#scity').val(me.model.get('city'));
                            me.$('#scity').trigger('change');
                            me.attrs.mstate.a2 = true;
                        }
                    });
                }
            })

            me.$('#scity').on('change', function () {
                var val = me.$('#scity').val();
                if (val) {
                    getlist('area', val, me.$('#sarea'), '请选择地区', function () {
                        //
                        if (me.attrs.mstate.a3 == false) {
                            me.$('#sarea').val(me.model.get('county'));
                            me.attrs.mstate.a3 = true;
                        }
                    });
                }
            })

            getlist('industry', 0, me.$('#sinsone'), '请选择一级行业', function () {
                state.b = true;
                checkOk();
            });

            me.$('#sinsone').on('change', function () {
                var val = me.$('#sinsone').val();
                if (val) {
                    getlist('industry', val, me.$('#sinstwo'), '请选择二级行业', function () {
                        //
                        console.log('二级行业变化');
                        console.log(me.model.get('industrySecond'));
                        if (me.attrs.mstate.b2 == false) {
                            me.$('#sinstwo').val(me.model.get('industrySecond'));
                            me.$('#sinstwo').trigger('change');
                            me.attrs.mstate.b2 = true;
                        }
                    });
                }
            })
            me.$('#sinstwo').on('change', function () {
                var val = me.$('#sinstwo').val();
                if (val) {
                    getlist('industry', val, me.$('#sinsthree'), '请选择三级行业', function () {
                        //
                        console.log('三级行业变化');
                        console.log(me.model.get('industryThird'));
                        if (me.attrs.mstate.b3 == false) {
                            me.$('#sinsthree').val(me.model.get('industryThird'));
                            me.attrs.mstate.b3 = true;
                        }
                    });
                }
            })

        },

        /**
         *
         * 隐藏slider
         */
        hide: function () {
            var me = this;
            me.model.clear();
            me.$('.accordian').addClass('collapse');
            me.$('.accordian .content').removeAttr('style');

            me.$('.sectiona input').val('');
            me.$('.sectiona select').val('');
            me.$('.sectiona textarea').val('');

            EntDetail.__super__.hide.apply(this, arguments);
        },

        //
        //  获取枚举值
        //  获取完枚举值后
        //  获取企业信息
        //===========================
        getEnums: function (id) {
            var me = this;

            var state = {
                a: false,
                b: false,
                c: false,
                d: false,
                e: false,
                f: false,
                g: false
            };

            function checkIsOk() {
                if (state.a && state.b && state.c && state.d && state.e && state.f && state.g) {
                    me.getEnterprise(id);
                }
            };

            //
            me.generateSelect('ENT_LST_SOURCE', me.$asource, function () {
                state.a = true;
                checkIsOk()
            }); //来源信息

            //缺少使用对象类型
            me.generateSelect('CAMPANY_SCALE', me.$acompany, function () {
                state.b = true;
                checkIsOk()
            }); //公司规模

            me.generateSelect('SALE_TEAM_SCALE', me.$asales, function () {
                state.c = true;
                checkIsOk()
            }); //销售团队规模

            me.generateSelect('RETURN_VISIT_CHECK', me.$('#returnvisitCheck'), function () {
                state.d = true;
                checkIsOk()
            }); //电话回访状态

            me.generateSelect('ENTERPRISE_CHEAT_TYPE', me.$('#cheatType'), function () {
                state.e = true;
                checkIsOk()
            }); //作弊情况

            me.generateSelect('GROUP_TYPE', me.$agroup, function () {
                state.f = true;
                checkIsOk()
            }); //团队类型

            me.generateSelect('ENTERPRISE_LOG_TYPE', me.$sbLogType, function () {
                state.g = true;
                checkIsOk()
            }); //日志类型
        },

        //重置select枚举值
        generateSelect: function (name, $select, callback) {
            var me = this;
            //var list = [{'name':'请选择','value':''}];
            var list = [{'name': '请选择', 'value': ''}];

            util.getEnums(name, function (data) {
                var items = data.model,
                    options = '<option value="">请选择</option>';
                items.forEach(function (item, index) {
                    options += '<option value="' + item.value + '" title="' + item.text + '">' + item.text + '</option>';
                })
                $select.html(options);
                callback && callback(items);
            });
        },

        //获取企业详情
        //================
        getEnterprise: function (id, callback) {
            var me = this;

            //获取企业详情 兼容
            //
            /*
             util.api({
             'url': '/odrDraft/getDraftEnterpriseById',
             'data':{
             'id': id
             },
             'success':function( data ){

             }
             })
             */
            console.log('getenterprise!!!!!');

            //获取企业详情
            util.api({
                'url': '/enterprise/getenterprise',
                'data': {
                    'enterpriseId': id
                },
                'success': function (data) {

                    if (data.success) {
                        me.attrs.runStatus = data.value.model.runStatus;
                        var model = data.value.model;
                        ///me.product.isInitialized = false;

                        //转换一些数据
                        model.isSaleTeam = model.isSaleTeam ? '1' : '0';
                        model.isReferral = model.isReferral ? '1' : '0';

                        //装载数据 主要给企业基本信息赋值
                        //缓存数据
                        var updateTime = model.updateTime;
                        model = $.extend(model, model.odrDraftEnterprise);
                        //重新加载
                        model.updateTime = updateTime;
                        if (model.contractEnterpriseName) {
                            me.$('.contractEnterpriseName-wrapper').show();
                        } else {
                            me.$('.contractEnterpriseName-wrapper').hide();
                        }
                        me.model.load(model);

                        //
                        //兼容二三级地址和二三级行业
                        //===========================================================
                        me.attrs.mstate = {'a2': false, 'a3': false, 'b2': false, 'b3': false}
                        me.$('#sprovince').val(me.model.get('province'));
                        me.$('#sinsone').val(me.model.get('industryFirst'));
                        me.$('#sprovince').trigger('change');
                        me.$('#sinsone').trigger('change');
                        //============================================================


                        //
                        //开通时间显示
                        //===================================================
                        if (me.model.get('appStartTime')) {
                            me.$('.openTime').show().find('.content').text(new Date(me.model.get('appStartTime'))._format('yyyy年MM月dd日'));
                        }

                        //控制续费显隐
                        if (me.model.get('runStatus') == 2) {
                            me.$notice.show();
                        } else {
                            me.$notice.hide();
                        }
                        //初始化 使用情况的缓存
                        me.operations.initialInfo = {
                            'accountTotalAmount': model.accountTotalAmount,         //逍客终端总量
                            'groupNumLimit': model.groupNumLimit,                   //
                            'videoNumLimit': model.videoNumLimit,                   //
                            'crmVisibleRange': model.crmVisibleRange,               //
                            'editCustomerName': model.editCustomerName,             //
                            'setPersonalGoal': model.setPersonalGoal,               //
                            'discountAutoCalculated': model.discountAutoCalculated, //
                            'webSanCodeAuth': model.webSanCodeAuth                  //
                        };

                        //给使用情况赋值
                        me.$sdXKDUC.val(model.accountUsedAmount + '/' + model.accountAvailableAmount || '');
                        var tempmarketingAccountAmount = model.marketingAccountAmount

                        //if (model.marketingAccountAmount && parseInt(model.marketingAccountAmount) > parseInt(model.accountTotalAmount)) {
                        //    me.$sdXKDC.val(model.marketingAccountAmount);
                        //} else {
                        me.$sdXKDC.val(model.accountTotalAmount);
                        //}

                        me.$yingxiaoSum.val(model.marketingAccountAmount);
                        me.$yingxiaoUsed.val(model.marketingAccountUsedAmount + '/' + model.marketingAccountAvailableAmount);

                        me.$sdSC.val(model.storageTotalSpace);
                        me.$sdSUC.val(model.storageUsedSpace);
                        me.enterpriseAccount = model.enterpriseAccount;
                        me.attrs.isPay = model.isPayed;


                        me.$asource.val(model.source);
                        //me.$aknow.val(model.knowSource);
                        //me.$aregister.val(model.registerMotive);
                        me.$acompany.val(model.companyScale);
                        me.$asales.val(model.saleTeamScale);

                        switch (model.activity) {
                            case 1:
                                model.activityStr = "无登录";
                                break;
                            case 2:
                                model.activityStr = "有登录";
                                break;
                            case 3:
                                model.activityStr = "有互动";
                                break;
                            case 4:
                                model.activityStr = "活跃";
                                break;
                            default:
                                model.activityStr = "无";
                                break;
                        }

                        me.$('#presentOfficeEdition').val(model.presentOfficeEdition);
                        if (model.crmVersion == 2) {
                            me.$('#crmVersion').attr('disabled', 'disabled');
                        } else {
                            me.$('#crmVersion').removeAttr('disabled');
                        }
                        //me.$hasSales.val(model.isSaleTeam ? 'true' : 'false');
                        //me.$isMettingSale.val(model.isWillPin ? 'true' : 'false');
                        //me.$isFirstView.val(model.isFirstmeetingSign ? 'true' : 'false');
                        //me.$isStranger.val(model.isStrangerVisits ? 'true' : 'false');
                        //me.$city.val(model.city);
                        //me.$dealDays.val(model.dealDays);
                        //me.$isIntro.val(model.isReferral ? 'true' : 'false');

                        me.$remark.val(model.remark);
                        //me.$sAgentId.val(model.agentId);
                        //me.$sAgentName.val(model.agentName);

                        //给活跃度赋值
                        me.$sActivity.val(model.activityStr);

                        /**
                         * 进行状态显隐控制
                         */
                        me.setVisibility();

                        //启用停用备注赋值
                        me.$('#switchRemark').val(model.switchRemark)
                        //me.$('#switchRemark').val('hhhhhhhhh')
                        callback && callback();
                    }
                }
            })
        },

        /*
         *
         * 整个显隐控制共分为三层
         * 第一层 权限层  由 data-permissions 属性确定  初始化时 不符合的移除元素
         * 第二层 由初始化的参数确定 支持 代理商 打开企业详情时根据isAgent参数 确定某些元素的显隐 
         * 第三层 由企业开通状态决定 根据企业开通的不同状态 对不同元素进行显隐控制
         */

        /**
         *
         *  进行状态切换控制
         *  dom元素内     含有 f1 f2 f3 f4 等类名的元素全部隐藏
         *  根据状态信息相应类名显示
         *  f1待开通  f2已开通 f3已作废 f4已停用
         */
        setVisibility: function () {
            var me = this;
            var status = this.model.attrs.runStatus;
            me.$('.f1,.f2,.f3,.f4').css('display', 'none');

            switch (status) {
                case 1: // 待开通
                    me.$('.ed').removeAttr('disabled');
                    me.$('.f1').css('display', '');
                    break;
                case 2: // 已开通
                    me.$('.ed').removeAttr('disabled');
                    me.$('.f2').css('display', '');
                    me.$('.off24').css('display', '');
                    break;
                case 3: // 已作废
                    me.$('.ed').attr('disabled', 'disabled');
                    me.$('.f3').css('display', '');
                    break;
                case 4: // 已停用
                    me.$('.ed').attr('disabled', 'disabled');
                    me.$('.f4').css('display', '');
                    me.$('.off24').css('display', '');
                    break;
                default:
                    me.$('.ed').removeAttr('disabled');
                    me.$('.f1').css('display', '');
                    break;
            }
            this.setState();
        },

        //设置 dom 元素的显隐状态
        //
        setState: function ($el) {
            var me = this;

            //console.log(me.attrs.isAgent);
            var $view = $el || me.$view;

            /**
             *
             * 如果是代理商
             * 只能查看各种企业信息
             * 不能进行各种操作
             *
             * .off 代理商状态    off隐藏
             * .on  支持人员状态   on隐藏
             *
             * 如果是支持人员来源可编辑
             */
            if (me.attrs.isAgent === true) {

                $view.find('.off').hide();
                $view.find('input').attr('disabled', 'disabled');
                $view.find('select').attr('disabled', 'disabled');
                $view.find('textarea').attr('disabled', 'disabled');
            } else {
                $view.find('.on').hide();
                me.$asource.removeAttr('disabled');
            }
        },

        showNumber: function () {
            var me = this;
            var eId = me.model.attrs.enterpriseId

            console.log(eId);
            var url = '/enterprise/' + eId + '/yesterdaylogincount';
            util.api({
                url: url,
                type: 'POST',
                dataType: "json",
                success: function (resp) {
                    if (resp.success) {
                        $('#peopleNumber').html(resp.model);
                    }
                }
            });
        },

        //
        //显示隐藏子菜单 同时执行模块开启函数
        //==================================
        showAccordian: function (e) {
            var target = e.currentTarget,
                $parent = $(target).parent();
            $content = $(target).next('.content');

            //进行显示隐藏切换
            if ($parent.hasClass('collapse')) {
                $parent.removeClass('collapse');
                $content.slideDown(300);
            } else {
                $parent.addClass('collapse');
                $content.slideUp(300);
                return;
            }

            //var index = $parent.index( '.accordian' );
            var target = $parent.attr('data-target');
            switch (target) {
                case 'product':
                    console.log('product');
                    this.showProductInfo();      //产品信息
                    break;
				case 'productHistory':
                    console.log('productHistory');
                    this.showProductHistoryInfo();      //产品历史信息
                    break;
				case 'orderList':
					console.log('orderList');
                    this.showOrderList();      //订单信息
                    break;
				case 'tryOut':
					console.log('tryOut');
                    this.showTryOut();      //试用信息
                    break;
                case 'operations':                //使用情况
                    console.log('operations');
                    this.showOperations();
                    break;
                case 'functions':                 //功能限制
                    console.log('functions');
                    this.showFunctions();
                    break;
                case 'activeness':                //活跃度
                    this.showActiveNess();
                    break;
                case 'log':                       //显示日志信息
                    console.log('log');
                    this.showLog();
                    break;
                case 'peopleNumber':               //数据统计
                    this.showNumber();
                    break;
                default:
                    break;
            }
        },

        //
        // 保存企业信息
        //=========================
        saveBasicEve: function (e) {

            // disable buttons
            var me = this;
            var $target = $(e.currentTarget);
            $target.attr('disabled', 'disabled');
            $target.addClass('disable');

            function generateData(array) {

                var data = {};
                array.forEach(function (item) {
                    data[item] = me.model.get(item);
                })
                return data;
            }

            var postData = generateData([
                'address',
                'area',
                //'city',
                'companyScale',
                'contactEmail',
                'contactIm',
                'contactName',
                'contactPhone',
                //'county',
                'enterpriseAccount',
                //'enterpriseFilingId',   //备案企业id
                'enterpriseName',
                'groupType',
                //'industryFirst',
                //'industrySecond',
                //'industryThird',
                'isReference',
                'isReferral',
                'isSaleTeam',
                'keyContactEmail',
                'keyContactName',
                'keyContactPhone',
                //'province',
                'saleTeamScale'
            ]);

            postData.enterpriseFilingId = me.model.get('enterpriseFilingId');
            //省市区信息
            postData.province = me.$('#sprovince').val();
            postData.city = me.$('#scity').val();
            postData.county = me.$('#sarea').val();

            //三级行业信息
            postData.industryFirst = me.$('#sinsone').val();
            postData.industrySecond = me.$('#sinstwo').val();
            postData.industryThird = me.$('#sinsthree').val();

            postData.id = me.model.get('id');
            //修改企业信息
            util.api({
                'url': '/enterprise/uptEnterprise',
                'contentType': 'application/json',
                'data': JSON.stringify(postData),
                'success': function (data) {
                    if (data.success) {

                        console.warn('企业修改提交');
                        console.warn(data);
                        util.showTip('企业修改成功');
                    }
                },
                'complete': function () {
                    $target.removeAttr('disabled');
                    $target.removeClass('disable');
                }
            });
        },

        //显示产品信息
        showProductInfo: function () {
            var me = this;
            console.log('product');
			 
            util.api({
                'url': '/odr/queryProductVOList',
                'data': {
                    'ea': me.model.get('enterpriseAccount')
                },
                'beforeSend': function () {
                    me.$tbProduct.find('.container').html('<p class="info">加载中...</p>');
                },
                'success': function (data) {
                    console.warn(data);
                    if (data.success) {
                        if (data.value.model.length > 0) {

                            var strDom = "";
                            _.map(data.value.model, function (obj) {
                                var startTime = "——",
                                    endTime = "——";

                                if (obj['startDate']) {
                                    startTime = new Date(obj['startDate'])._format('yyyy/MM/dd');
                                }
                                if (obj['endDate']) {
                                    endTime = new Date(obj['endDate'])._format('yyyy/MM/dd');
                                }

                                var enablestatus = "";
                                if (obj["isEnable"] == 1) {
                                    enablestatus = "已开启";
                                } else if (obj["isEnable"] == 2) {
                                    enablestatus = "已关闭";
                                }

                                switch (obj["code"]) {
                                    case "FX_Terminal":
                                        break;
                                    case "Train_Hepler_Capacity":
                                        break;
                                    //报数系统
                                    //case "Number_System":
                                    //  break;
                                    //纷享百川
                                    case "FXBC":
                                        break;
                                    //
                                    case "CRM":
                                        strDom += " <p> <span class='title'><b>" + obj['appName'] + ":</b>&nbsp;总量" + obj['quota'] + "&nbsp;已用" + obj['usedQuota'] + "</span>" +
                                        " <span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span><i>" + enablestatus + "</i>&nbsp;<button class='prooff off u-btn-blue' name='product' typeid='" + obj["quotaType"] + "' value='" + obj["appId"] + "'>开启</button><button class='proon off' name='product' typeid='" + obj["quotaType"] + "' value='" + obj["appId"] + "'>关闭</button> </p>";
                                        break;
                                    //培训人数
                                    case "Service_Fee":
                                        strDom += " <p> <span class='title'><b>" + obj['appName'] + ":</b>" + obj['quota'] + "</span>" +
                                        "</p>";
                                        break;
                                    case "HR_Helper":
                                        strDom += " <p> <span class='title'><b>" + obj['appName'] + ":</b></span> <span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span> </p>";
                                        break;
                                    case "Business_Card":
                                        strDom += " <p> <span class='title'><b>" + obj['appName'] + ":</b></span> <span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span> </p>";
                                        break;
                                    case "Custom_Helper":
                                        strDom += " <p> <span class='title'><b>" + obj['appName'] + ":</b>&nbsp;总量" + obj['quota'] + "&nbsp;已用" + obj['usedQuota'] + "</span>" + "<span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span> </p>";
                                        break;
                                    case "StorageSpace":
                                        break;
                                    default:
                                        strDom += " <p> <span class='title'><b>" + obj['appName'] + ":</b>&nbsp;总量" + obj['quota'] + "&nbsp;已用" + obj['usedQuota'] + "</span>" + "<span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span><i>" + enablestatus + "</i>&nbsp;<button class='prooff off u-btn-blue' name='product' typeid='" + obj["quotaType"] + "' value='" + obj["appId"] + "'>开启</button><button class='proon off' name='product' typeid='" + obj["quotaType"] + "' value='" + obj["appId"] + "'>关闭</button> </p>";
                                }
                            });

                            me.$tbProduct.find('.container').html(strDom);
                            me.setState(me.$tbProduct);
                        } else {
                            me.$tbProduct.find('.container').html('<p class="info">暂无数据</p>');
                        }
                    }
                }
            })
        },
		 //显示产品信息
        showProductHistoryInfo: function() {
            var me = this;
            console.log('product');
			 if (me.product.pagination) {

                me.product.pagination.setPage(0, true);
            } else {
                me.product.pagination = new Pagination({
                    wrapper: me.$view.find('#tbLog .pager'),
                    pageSize: 10,
                    pageNumber: 0
                });
                me.product.pagination.render();
                me.product.pagination.onChange = function() {
                    me.loadProdectList();
                };
                me.loadProdectList();
            }
        },
		loadProdectList: function() {

            console.log('productlist');
            var me = this,
                data = {
                   ea: me.model.get('enterpriseAccount')
                };
       
            util.api({
                url: '/odr/queryProductHistoryVOList',
                data: data,
                success: function(data) {

                    console.warn(data);
                    if (data.success) {
                       me.product.pagination.setTotalSize(data.model.itemCount);
                        if (data.model.length > 0) {
                            data.model.forEach(function(item) {
                                
                                item.statusStr = statusTimeMap[item.status];
                            });
                            me.$tbProductList.html(me.tbProductTem({ content: data.model }));
                        } else {
                            me.$tbProductList.html('<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>');
                        }
                    }
                }
            });
        },
		//订单信息
        showOrderList: function() {
            var me = this;
            console.log('product');
			 if (me.orderList.pagination) {

                me.orderList.pagination.setPage(0, true);
            } else {
                me.orderList.pagination = new Pagination({
                    wrapper: me.$view.find('#tbLog .pager'),
                    pageSize: 10,
                    pageNumber: 0
                });
                me.orderList.pagination.render();
                me.orderList.pagination.onChange = function() {
                    me.loadOrderList();
                };
                me.loadOrderList();
            }
        },
		loadOrderList: function() {

            console.log('productlist');
            var me = this,
                data = {
                    pageIndex: me.orderList.pagination.attr['pageNumber'] + 1,
                    pageSize: me.orderList.pagination.attr['pageSize'],
                    enterpriseId: me.model.attrs.enterpriseId
                };
       
            util.api({
                url: '~/op/api/enterprise/getEnterpriseOrder',
                data: data,
                success: function(data) {

                    console.warn(data);
                    if (data.success) {
                       //me.orderList.pagination.setTotalSize(data.model.itemCount);
                        if (data.model.length > 0) {
                            data.model.forEach(function(item) {
                                item.typeStr = orderMap[item.orderType];
								item.payStatusStr = payStatusMap[item.payStatus];
								 item.createTimeStr = new Date(item.createTime)._format('yyyy-MM-dd hh:mm');
                            });
                            me.$tbOrderList.html(me.tPOrderList({ content: data.model }));
							IBSS.tplEvent.setPermissions( me.$tbOrderList );
                        } else {
                            me.$tbOrderList.html('<tr><td colspan="8"><p class="info">暂无数据</p></td></tr>');
                        }
                    }
                }
            });
        },
		detailOrderEve:function(e){
			var me = this;
			var orderId = $(e.currentTarget).attr('data-id');
			window.location='#order/orderlist/'+orderId;
			me.hide();
		},
		showTryOut: function() {
            var me = this;
            console.log('product');
			 if (me.tryOut.pagination) {

                me.tryOut.pagination.setPage(0, true);
            } else {
                me.tryOut.pagination = new Pagination({
                    wrapper: me.$view.find('#tbLog .pager'),
                    pageSize: 10,
                    pageNumber: 0
                });
                me.tryOut.pagination.render();
                me.tryOut.pagination.onChange = function() {
                    me.loadTryOut();
                };
                me.loadTryOut();
            }
        },
		loadTryOut: function() {

            console.log('productlist');
            var me = this,
                data = {
                    pageIndex: me.tryOut.pagination.attr['pageNumber'] + 1,
                    pageSize: me.tryOut.pagination.attr['pageSize'],
                    ea: me.model.get('enterpriseAccount')
                };
       
            util.api({
                url: '~/op/api/enterprise/getEnterpriseTrial',
                data: data,
                success: function(data) {

                    console.warn(data);
                    if (data.success) {
                       //me.orderList.pagination.setTotalSize(data.model.itemCount);
                        if (data.model.length > 0) {
                            data.model.forEach(function(item) {
                                item.typeStr = orderMap[item.orderType];
								 item.trialStartTimeStr = new Date(item.trialStartTime)._format('yyyy-MM-dd hh:mm');
                            });
                            me.$tbTryOut.html(me.tPTryOut({ content: data.model }));
                        } else {
                            me.$tbTryOut.html('<tr><td colspan="2"><p class="info">暂无数据</p></td></tr>');
                        }
                    }
                }
            });
        },

        //新开启或关闭产品
        proonEve: function (e) {
            var $target = $(e.currentTarget);
            var me = this;

            var arrTypeOne = [], arrTypeTwo = [];
            if ($target.attr('typeid') == 1) {
                arrTypeOne.push($target.val());
            } else if ($target.attr('typeid') == 2) {
                arrTypeTwo.push($target.val());
            }

            var objOne = {}, objTwo = {}, arrList = [];
            if (arrTypeOne.length > 0) {
                //var tempOne ={};
                objOne.quotaType = 1;
                objOne.appIds = arrTypeOne.join(',');
                arrList.push(objOne);
            }
            if (arrTypeTwo.length > 0) {
                //var tempOne ={};
                objTwo.quotaType = 2;
                objTwo.appIds = arrTypeTwo.join(',');
                arrList.push(objTwo);
            }
            //console.log(ids);

            util.api({
                'url': "/app/setappsenablestatus",
                'data': {
                    'fsEa': me.model.get('enterpriseAccount'),
                    'json': JSON.stringify(arrList),
                    'isEnable': 2
                },
                'success': function (data) {
                    if (data.success) {
                        util.showTip('操作成功');
                        me.showProductInfo();
                    }
                }
            })
        },

        prooffEve: function (e) {
            var $target = $(e.currentTarget);
            var me = this;

            var arrTypeOne = [], arrTypeTwo = [];
            if ($target.attr('typeid') == 1) {
                arrTypeOne.push($target.val());
            } else if ($target.attr('typeid') == 2) {
                arrTypeTwo.push($target.val());
            }

            var objOne = {}, objTwo = {}, arrList = [];
            if (arrTypeOne.length > 0) {
                //var tempOne ={};
                objOne.quotaType = 1;
                objOne.appIds = arrTypeOne.join(',');
                arrList.push(objOne);
            }
            if (arrTypeTwo.length > 0) {
                //var tempOne ={};
                objTwo.quotaType = 2;
                objTwo.appIds = arrTypeTwo.join(',');
                arrList.push(objTwo);
            }
            //console.log(ids);

            util.api({
                'url': "/app/setappsenablestatus",
                'data': {
                    'fsEa': me.model.get('enterpriseAccount'),
                    'json': JSON.stringify(arrList),
                    'isEnable': 1
                },
                'success': function (data) {
                    if (data.success) {
                        util.showTip('操作成功');
                        me.showProductInfo();
                    }
                }
            })
        },

        //使用情况显示使用情况 ??培训助手流量总量 和已用量/未用量 如何赋值
        showOperations: function () {
            var me = this;


            ///me._usestatus = 0;     //状态值

            me.attrs.freeIncreaseContractRequired = '';

            /***
             *
             * 签约到期时间( 付费版 )   如果是 9999-12-31   则显示永久
             * 营销版到期时间( 免费版 ) 如果是 小于当前日期 则不显示
             *
             * 设置的时候
             * 服务支持人员         可以设置 签约到期时间 也可以设置 营销版到期时间
             * 代理商内部管理员   只可以设置 签约到期时间
             */

            /*
             * 代理商用户
             * 根据是否是管理员 显示相关信息
             */
            /*
             function checkIsAdmin(){

             if( me.attrs.isAgent == true ){

             for( var i = 0; i < IBSS.FUNCTIONS.length; i++ ){
             if( 'F009001' == IBSS.FUNCTIONS[i] ){
             return true;
             }
             }
             return false;
             }else{

             return false;
             }
             };

             if( checkIsAdmin() ){
             me.$('#tbOperation .isadmin').removeAttr('disabled');
             //me.$('#tbOperation input').removeAttr('disabled');
             } else {
             me.$('#tbOperation .isadmin').attr('disabled','disabled');
             }
             */

            /**
             *
             * 清空数据
             */
                ///me.$('#tbOperation input').val('');

            me.model.load(me.operations.initialInfo);
            me.$('#expandStorageSpace').val('');

            //给培训助手流量总量 和 培训助手流量赋值
            /*
             if (me.operations.trainHelperTotalCapacity !== undefined) {
             me.model.set('trainHelperUsedCapacityStr', me.operations.trainHelperTotalCapacity + '/' + (me.operations.trainHelperTotalCapacity - me.operations.trainHelperTotalCapacity))
             }
             */
            if (me.model.get('trainHelperTotalCapacity')) {
                me.$('#trainHelperTotalCapacity').val(parseFloat(me.model.get('trainHelperTotalCapacity')));

                if (me.model.get('trainHelperUsedCapacity')) {
                    me.$('#trainHelperUsedCapacityStr').val( parseFloat( me.model.get('trainHelperUsedCapacity') ) + '/' + ( parseFloat( me.model.get('trainHelperTotalCapacity') ) - parseFloat( me.model.get('trainHelperUsedCapacity') ) ).toFixed(2) )
                }
            }

            /**
             *
             * 加载列表数据
             */
            if (me.operations.pagination) {

                me.operations.pagination.setPage(0, true);

            } else {
                me.operations.pagination = new Pagination({
                    wrapper: me.$view.find('#tbOperation .pager'),
                    pageSize: 10,
                    pageNumber: 0
                });
                me.operations.pagination.render();
                me.operations.pagination.onChange = function () {
                    me.loadOperations();
                };
                me.loadOperations();
            }
        },

        //加载使用情况列表
        loadOperations: function () {
            var me = this;
            var data = {
                pageIndex: me.operations.pagination.attr['pageNumber'],
                pageSize: me.operations.pagination.attr['pageSize'],
                enterpriseId: me.model.attrs.enterpriseId
            };

            util.api({
                url: '/enterprise/querypageenterpriseaccountincrement',
                data: data,
                success: function (data) {

                    if (data.success) {
                        me.operations.pagination.setTotalSize(data.model.page.itemCount);
                        data.model.page && $(data.model.page.content).each(function (i, item) {
                            item.ncreaseTime = new Date(item.ncreased)._format('yyyy-MM-dd hh:mm');
                        });
                        me.attrs.freeIncreaseContractRequired = data.model.freeIncreaseContractRequired;

                        if (me.attrs.isPay == 1 && me.attrs.freeIncreaseContractRequired) {

                            me.$('.check-hide').show();
                        } else {
                            me.$('.check-hide').hide();
                        }
                        if (data.model.page && data.model.page.content && data.model.page.content.length > 0) {
                            me.$tbOperation.html(me.tplOperation({content: data.model.page.content}));
                        } else {
                            me.$tbOperation.html('<tr><td colspan="4"><p class="info">暂无数据</p></td></tr>');
                        }
                        me.operations.isInitialized = true;
                    }
                }
            });
        },

        //
        //修改使用情况信息
        //
        //===========================================
        changeStatistics: function () {
            var me = this;
            var temAccout = 0;

            console.log('changeStatistics');

            if (parseInt(me.model.get('groupNumLimit')) > 1000) {
                util.showToast('群人数上限最多为1000');
                return false;
            }

            if (me.$('#yingxiaoSum').val() && parseInt(me.$('#yingxiaoSum').val()) > parseInt(me.$sdXKDC.val())) {
                util.showToast('逍客终端总量不能小于CRM总量');
                return false;
                //temAccout = me.$('#yingxiaoSum').val();
            } else {
                temAccout = me.$sdXKDC.val();
            }

            var data = {
                'accountAmount': temAccout, //逍客终端总量
                'expandStorageSpace': me.$('#expandStorageSpace').val(), //存储扩容
                'groupNumLimit': me.model.get('groupNumLimit'), //群人数上限
                'videoNumLimit': me.model.get('videoNumLimit'), //视频参与人数上限
                //'crmVisibleRange': me.model.get('crmVisibleRange'), //CRM上级可见数据范围
                //'editCustomerName': me.model.get('editCustomerName'), //允许负责人修改客户名称
                //'setPersonalGoal': me.model.get('setPersonalGoal'), //允许个人设置目标
                //'discountAutoCalculated': me.model.get('discountAutoCalculated'), //折扣是否自动计算
                //'webSanCodeAuth': me.model.get('webSanCodeAuth'), //WEB扫码授权
                'enterpriseId': me.model.get('enterpriseId')
            }

            util.api({
                'url': '/enterprise/changeconfig',
                'data': data,
                'success': function (data) {
                    if (data.success) {
                        util.showTip('修改成功!');
                        me.getEnterprise(me.model.attrs.enterpriseId);
                        me.trigger('refresh');
                    }
                },
                'complete': function (data) {
                    me.getEnterprise(me.model.attrs.enterpriseId);
                    me.$('#expandStorageSpace').val('');
                }
            });
        },


        //活跃度下载
        actDownloadEve: function (e) {
            var me = this;

            function GetDateStr(AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
                return dd.getTime();
            }

            var startTime = GetDateStr(-91);
            var endTime = GetDateStr(-1);

            if (me.$actStartTime.val()) {
                startTime = new Date(me.$actStartTime.val()).getTime();
            }
            if (me.$actEndTime.val()) {
                endTime = new Date(me.$actEndTime.val()).getTime();
            }
            var url = IBSS.API_PATH + '/query/act/detail/generate?' + $.param({'enterpriseId': me.model.attrs.enterpriseId, 'timeStart': startTime, 'timeEnd': endTime})
            window.open(url);
        },

        //
        //显示功能限制 并拉取相应的数据
        //
        //=============================
        showFunctions: function () {
            var me = this;

            //设置默认设置
            //me.$sELC.val(100);
            //me.$sEFC.val(100);
            //me.$sECC.val(100);
            //me.$sEMWC.val(100);
            //me.$sEAC.val(100);
            if (me.model.get('marketingAccountAmount') == 0) {

                me.$('.crmvisible').hide();
            } else {

                me.$('.crmvisible').show();
            }

            if (me.model.get('productFree')) {
                me.$sUFS.val('50');
            } else {
                me.$sUFS.val('100');
            }

            if (this.model.attrs.runStatus == 2) {
                $('#tbFunctions').css('display', 'block');
            } else {
                $('#tbFunctions').css('display', 'none');
            }

            util.api({
                url: '/enterprise/queryenterpriseitemconfig',
                data: {enterpriseId: this.model.attrs.enterpriseId},
                success: function (data) {
                    if (data.success) {
                        var model = data.value.model;
                        console.warn(model);
                        //me.$sdELC.val(model['Config.ExportAmountLocation']);
                        //me.$sdELUC.val(model['Used.ExportAmountLocation']);
                        //me.$sdEFC.val(model['Config.ExportAmountPlan']); //导出日志次数
                        //me.$sdEFUC.val(model['Used.ExportAmountPlan']); //导出日志已用次数
                        //me.$sdECC.val(model['Config.ExportAmountFeedWork']); //导出指令次数
                        //me.$sdECUC.val(model['Used.ExportAmountFeedWork']); //导出指令已用次数
                        //me.$sdEMWC.val(model['Config.ExportAmountLeaveApplication']); //导出月度考勤次数
                        //me.$sdEMWUC.val(model['Used.ExportAmountLeaveApplication']); //导出月度考勤已用
                        // me.$sdEAC.val(model['Config.ExportAmountFeedApprove']); //导出审批汇总次数
                        //me.$sdEAUC.val(model['Used.ExportAmountFeedApprove']); //导出审批汇总已用
                        me.$sdUFS.val(model['Config.UploadFileSizeLimit']); //上传文件大小限制
                        console.warn(model['Config.isAllowDangerOperate']);
                        var temp = model['Config.IsAllowDangerOperate'] == '1' ? '是' : '否'
                        me.$sdActionDanger.val(temp);
                    }
                }
            });
        },

        //打开活跃度标签
        showActiveNess: function () {
            var me = this;

            me.$actStartTime.val('').removeAttr('disabled');
            me.$actEndTime.val('').removeAttr('disabled');
        },
        dataFormat: function (dataList) {
            for (var i = 0; i < dataList.length; i++) {
                var item = dataList[i];
                item.expireTime = new Date(item.expireTime)._format('yyyy-MM-dd');
                item.rechargeTime = new Date(item.rechargeTime)._format('yyyy-MM-dd');
                item.rechargeType = buyMap[item.rechargeType];
            }
            return dataList;
        },

        //显示日志信息
        showLog: function () {
            var me = this;

            me.$sbLogType.val('');
            me.$sbLogST.val('').removeAttr('disabled');
            me.$sbLogET.val('').removeAttr('disabled');

            if (me.log.pagination) {

                me.log.pagination.setPage(0, true);
            } else {
                me.log.pagination = new Pagination({
                    wrapper: me.$view.find('#tbLog .pager'),
                    pageSize: 10,
                    pageNumber: 0
                });
                me.log.pagination.render();
                me.log.pagination.onChange = function () {
                    me.loadLog();
                };
                me.loadLog();
            }
        },
        loadLog: function () {

            console.log('log log log');
            var me = this,
                data = {
                    pageIndex: me.log.pagination.attr['pageNumber'] + 1,
                    pageSize: me.log.pagination.attr['pageSize'],
                    enterpriseId: me.model.attrs.enterpriseId,
                    type: me.$sbLogType.val()
                };
            if (me.$sbLogST.val()) {
                data.timeBegin = new Date(me.$sbLogST.val()).getTime();
            }
            if (me.$sbLogET.val()) {
                data.timeEnd = new Date(me.$sbLogET.val()).getTime();
            }

            util.api({
                url: '/enterprise/querypageenterpriselog',
                data: data,
                success: function (data) {

                    console.warn(data);
                    if (data.success) {
                        me.log.pagination.setTotalSize(data.model.itemCount);
                        if (data.model.content.length > 0) {
                            data.model.content.forEach(function (item) {
                                item.createTimeStr = new Date(item.createtime)._format('yyyy-MM-dd hh:mm');
                                item.typeStr = util.findEnumsText('ENTERPRISE_LOG_TYPE', item.type);
                            });
                            me.$tbLog.html(me.tplLog({content: data.model.content}));
                        } else {
                            me.$tbLog.html('<tr><td colspan="5"><p class="info">暂无数据</p></td></tr>');
                        }
                    }
                }
            });
        },
        searchLog: function () {
            this.loadLog();
        },

        //??
        changeTrial: function () {
            var data = {
                enterpriseId: this.model.attrs.enterpriseId,
                endDay: new Date(this.$sTrialTime.val()).getTime(),
                trialEndAmount: this.$sTrialAmount.val()
            };
            util.api({
                url: '/enterprise/changetrialconfig',
                data: data,
                success: function (data) {
                    if (data.success) {
                        util.showTip('修改成功');
                    }
                }
            });
        },
        //??
        clearStatisticsForm: function () {
            this.$cardStartTime.val('');
            this.$cardEndTime.val('');

        },
        //??
        clearFunctions: function () {
            var me = this;
            me.$sELC.val('');
            me.$sEFC.val('');
            me.$sECC.val('');
            me.$sEMWC.val('');
            me.$sEAC.val('');
            me.$sUFS.val('');
            me.$sActionDanger.val('0');
        },
        //??
        changeFunctions: function () {
            var me = this;
            var data = {
                enterpriseId: this.model.attrs.enterpriseId,
                newUploadFileSizeLimit: me.$sUFS.val(),
                newIsAllowDangerOperate: me.$sActionDanger.val(),
                'webSanCodeAuth': me.model.get('webSanCodeAuth'), //WEB扫码授权
                'crmVisibleRange': me.model.get('crmVisibleRange'), //CRM上级可见数据范围
                'setPersonalGoal': me.model.get('setPersonalGoal'),
                'crmVersion': me.model.get('crmVersion'),  //CRM版本设置
                'discountAutoCalculated': me.model.get('discountAutoCalculated'),
                'editCustomerName': me.model.get('editCustomerName'),
                'isPhoneDeviceAuth': me.model.get('isPhoneDeviceAuth')
            };


            util.api({
                url: '/enterprise/changefunctionNew',
                data: data,
                success: function (data) {
                    if (data.success) {
                        util.showTip('更新成功');
                        //me.$sdELC.val(me.$sELC.val());
                        //me.$sdEFC.val(me.$sEFC.val());
                        //me.$sdECC.val(me.$sECC.val());
                        //me.$sdEMWC.val(me.$sEMWC.val());
                        //me.$sdEAC.val(me.$sEAC.val());
                        //me.$sdUFS.val(me.$sUFS.val());
                        //me.$sdActionDanger.val(me.$sActionDanger.val() == '1' ? '是' : '否');
                        //me.clearFunctions();
                        me.showFunctions();
                        me.getEnterprise(me.model.attrs.enterpriseId)
                    }
                }
            });
        },
        //??
        searchCardList: function () {
            this.loadCardList();
        },
        //??
        stopMarketing: function () {
            util.api({
                url: '/enterprise/disablemarketingstimulation',
                data: {enterpriseId: this.model.attrs.enterpriseId},
                success: function (data) {
                    if (data.success) {
                        util.showTip('更新成功');
                        this.$sdMarketingStatus.val('停止');
                    }
                }
            });
        },
        btnCardBuy: function () {
            var me = this,
                data = {
                    year: me.$cardBuyYear.val(),
                    enterpriseId: me.model.attrs.enterpriseId
                };
            var oldModifyTime = me.model.attrs.updateTime;
            data.oldModifyTime = oldModifyTime;
            util.api({
                url: '/enterprise/buybusinesscard',
                data: data,
                success: function (data) {
                    if (data.success) {
                        util.showTip('购买成功');
                        me.getEnterprise(me.model.attrs.enterpriseId);

                    }
                }
            });
        },
        btnCardSend: function () {
            var me = this,
                data = {
                    cardCount: me.$cardBuyNum.val(),
                    year: me.$cardBuyYear.val(),
                    enterpriseId: me.model.attrs.enterpriseId
                };
            if (!me.$cardBuyNum.val()) {
                util.showToast('请填写赠送张数！');
                return false;
            }
            var oldModifyTime = me.model.attrs.updateTime;
            data.oldModifyTime = oldModifyTime;
            util.api({
                url: '/enterprise/giftbusinesscard',
                data: data,
                success: function (data) {
                    if (data.success) {
                        util.showTip('赠送成功');
                        me.getEnterprise(me.model.attrs.enterpriseId);
                    }
                }
            });
        },
        changeCustomStatus: function () {
            var me = this;
            util.api({
                url: '/enterprise/enableloginpagepersonalization',
                data: {enterpriseId: this.model.attrs.id, isLoginPagePersonalization: !this.model.attrs.isLoginPagePersonalization},
                success: function (data) {
                    if (data.success) {
                        util.showTip('更新成功');
                        me.model.attrs.isLoginPagePersonalization = !me.model.attrs.isLoginPagePersonalization;
                        me.$sdCustom.val(me.model.attrs.isLoginPagePersonalization ? '启用' : '停止');
                    }
                }
            });
        },
        resetAdminPassword: function () {
            if (!window.confirm('是否确认重置企业管理员密码?\r\n' + this.generateConfirmMsg())) {
                return;
            }
            util.api({
                url: '/',
                data: {enterpriseId: this.model.attrs.enterpriseId},
                success: function (data) {
                    if (data.success) {
                        util.showTip('密码重置成功');
                    }
                }
            });
        },
        stopService: function () {
            var me = this;

            if (!window.confirm('是否确认停用企业?\r\n' + this.generateConfirmMsg())) {
                return;
            }
            util.api({
                url: '/enterprise/enableenterprise',
                data: {
                    enterpriseId: this.model.attrs.enterpriseId,
                    oldModifyTime: me.model.attrs.updateTime,
                    switchRemark: me.$('#switchRemark').val(),
                    isEnabled: false
                },
                success: function (data) {
                    if (data.success) {
                        util.showTip('企业已停用.');
                        me.trigger('updatesuccess');
                        me.hide();
                    }
                }
            });
        },
        startService: function () {
            var me = this;
            if (!window.confirm('是否确认启用企业?\r\n' + this.generateConfirmMsg())) {
                return;
            }
            util.api({
                url: '/enterprise/enableenterprise',
                data: {
                    enterpriseId: this.model.attrs.enterpriseId,
                    oldModifyTime: me.model.attrs.updateTime,
                    switchRemark: me.$('#switchRemark').val(),
                    isEnabled: true
                },
                success: function (data) {
                    if (data.success) {
                        util.showTip('企业已启用');
                        me.trigger('updatesuccess');
                        me.hide();
                    }
                }
            });
        },
        generateConfirmMsg: function () {
            return '企业: ' + this.model.attrs.enterpriseName + '\r\n产品: ' + this.model.attrs.productName + '\r\n代理商: ' + this.model.attrs.agentName + '( ' + this.model.attrs.agentId + ' )';
        },

        saveTag: function () {
            var me = this;
            var label = me.$tagSetting.val();
            if (!label) {
                util.showToast('请选择标签');
                return;
            }
            util.api({
                url: '/enterprise/setEnterpriseLabel',
                data: {
                    enterpriseId: me.model.attrs.enterpriseId,
                    enterpriseLabel: label
                },
                success: function (data) {
                    if (data.success) {
                        util.showTip('企业标签设置成功');
                    }
                }
            });
        }
    });

    module.exports = EntDetail;
});
