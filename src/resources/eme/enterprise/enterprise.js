define(function (require, exports, module) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
    var Slider = require('common/widget/slider/slider');


    var tpl = $(require('./template.html'));


    var AccountDetail = MClass(Slider).include({

        defaultAttr: {
            'title': '企业详情',
            'width': 720
        },

        content: tpl.filter('#accountDetail').html(),

        events: {
            'click .accordian h4': 'showAccordian'
        },
        elements: {
            '#elEA': 'elEA',
            '#elEN': 'elEN',
			'#sdXKDC': 'sdXKDC',                //*销客终端总量
            '#sdXKDUC': 'sdXKDUC',              //*销客终端 已用量/未用量
            '#yingxiaoSum': 'yingxiaoSum',      //*CRM总量
            '#yingxiaoUsed': 'yingxiaoUsed',    //*CRM已用量/未用量
            '#sdSC': 'sdSC',                    //*空间总量
            '#sdSUC': 'sdSUC',                  //*空间已用量/未用量
            '#sActivity': 'sActivity',          //*??
            '#sdUFS': 'sdUFS',     //*??
            '#sdActionDanger': 'sdActionDanger', //*??
            '#yingxiaoSum': 'yingxiaoSum',
            '#yingxiaoUsed': 'yingxiaoUsed',
            '#sdSC': 'sdSC',
            '#sdSUC': 'sdSUC'
        },

        //
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
                    this.showProductInfo();
                    break;
                case 'operations':
                    this.showOperations();
                    break;
                default:
                    break;
            }
        },

        showProductInfo: function () {
            var me = this;

            console.log('product');
            util.api({
                'url': '/odr/queryProductVOList',
                'data': {
                    'ea': me.attrs.ea
                },
                'beforeSend': function () {
                    me.$('#tbOperation').find('.container').html('<p class="info">加载中...</p>');
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
                                        strDom += " <p> <span>" + obj['appName'] + "(个)：" + obj['quota'] + "</span>" +
                                        " <span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span></p>";
                                        break;
                                    case "CRM":
                                        strDom += " <p> <span>" + obj['appName'] + "(个)：" + obj['quota'] + "</span>" +
                                        " <span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span>" + enablestatus + "</p>";
                                        //  " <span>开始时间："+ startTime +"</span> <span>结束时间："+endTime+"</span>" + enablestatus + "   <input class='off' type='checkbox' name='product' value='"+obj["appId"]+"'> </p>";
                                        break;
                                    case "Service_Fee":
                                        strDom += " <p> <span>" + obj['appName'] + "(人)：" + obj['quota'] + "</span>" +
                                        " <span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span></p>";
                                        break;
                                    case "HR_Helper":
                                        strDom += " <p> <span>" + obj['appName'] + "：</span> <span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span> </p>";
                                        break;
                                    case "Business_Card":
                                        strDom += " <p> <span>" + obj['appName'] + ":</span> <span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span> </p>";
                                        break;
                                    case "Custom_Helper":
                                        strDom += " <p> <span>" + obj['appName'] + ":</span> <span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span> </p>";
                                        break;
                                    //default:
                                    //    strDom += " <p> <span>"+obj['appName']+":</span> <span>开始时间："+ startTime +"</span> <span>结束时间："+endTime+"</span>"+ enablestatus + "   <input class='off' type='checkbox' name='product' value='"+obj["appId"]+"'> </p>";
                                    default:
                                        strDom += " <p> <span>" + obj['appName'] + ":</span> <span>开始时间：" + startTime + "</span> <span>结束时间：" + endTime + "</span>" + enablestatus + " </p>";
                                }
                            });

                            me.$('#tbProduct').find('.container').html(strDom);
                        } else {
                            me.$('#tbProduct').find('.container').html('<p class="info">暂无数据</p>');
                        }
                    }
                }
            })
        },


        showOperations: function () {
            var me = this;

            me.getEnterprise(function () {
                ///me._usestatus = 0;     //状态值
                me.attrs.freeIncreaseContractRequired = '';

                if (me.model.get('marketingAccountAmount') == 0) {

                    me.$('.crmvisible').hide();
                } else {

                    me.$('.crmvisible').show();
                }
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
            });

        },
        //获取企业详情
        getEnterprise: function (id, callback) {
            var me = this;


            util.api({
                'url': '/enterprise/getenterprise',
                'data': {
                    'enterpriseId': me.attrs.enterpriseId
                },
                'success': function (data) {
                    console.warn('enterpriseinfo');
                    console.warn(data);
                    if (data.success) {
                        me.attrs.runStatus = data.value.model.runStatus;
                        var model = data.value.model;
                        ///me.product.isInitialized = false;
                        me.model.load(model);

                        me.$sdXKDC.val(model.accountTotalAmount);
                        me.$sdXKDUC.val(model.accountUsedAmount + '/' + model.accountAvailableAmount || '');
                        me.$yingxiaoSum.val(model.marketingAccountAmount);
                        me.$yingxiaoUsed.val(model.marketingAccountUsedAmount + '/' + model.marketingAccountAvailableAmount);
                        me.$sdSC.val(model.storageTotalSpace);
                        me.$sdSUC.val(model.storageUsedSpace);


                        //初始化 使用情况的缓存
                        me.operations.initialInfo = {
                            'accountTotalAmount': model.accountTotalAmount,
                            'groupNumLimit': model.groupNumLimit,
                            'videoNumLimit': model.videoNumLimit,
                            'crmVisibleRange': model.crmVisibleRange,
                            'editCustomerName': model.editCustomerName,
                            'setPersonalGoal': model.setPersonalGoal,
                            'discountAutoCalculated': model.discountAutoCalculated,
                            'webSanCodeAuth': model.webSanCodeAuth
                        };
						
						if (me.model.get('trainHelperTotalCapacity')) {
							me.$('#trainHelperTotalCapacity').val(parseFloat(me.model.get('trainHelperTotalCapacity')).toFixed(2));

							if (me.model.get('trainHelperUsedCapacity')) {
								me.$('#trainHelperUsedCapacityStr').val(parseFloat(me.model.get('trainHelperUsedCapacity')).toFixed(2) + '/' + (parseFloat(me.model.get('trainHelperTotalCapacity')).toFixed(2) - parseFloat(me.model.get('trainHelperUsedCapacity')).toFixed(2)).toFixed(2))
							}
						}


                        //调用回调
                        callback && callback();

                    }
                }
            })
        },

        /*
         *
         * 加载使用情况列表
         */
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
            })

        },

        init: function () {
            AccountDetail.__super__.init.apply(this, arguments);
            var me = this;
            me.on('empty:trylist', function () {
                me.$('.trybox').html('<b>无</b>');
            })

            me.operations = {
                isInitialized: false,
                initialInfo: {},
                pagination: null
            };
        },

        show: function (enterpriseId,ea) {
            AccountDetail.__super__.show.apply(this, arguments);
            var me = this;
			me.attrs.enterpriseId = enterpriseId||'';
			me.attrs.ea = ea||'';

            util.api({
                'url': '/enterprise/getenterprise',
                'data': {
                    'enterpriseId': me.attrs.enterpriseId
                },
                'success': function (data) {
                    console.warn(data);
                    if (data.success) {
						me.attrs.objData = data.value.model;
                        me.model.set('enterpriseName', data.value.model.enterpriseName);
                        me.model.set('enterpriseType', data.value.model.enterpriseType);
						me.model.set('enterpriseAccount', data.value.model.enterpriseAccount);
						me.model.set('contactName', data.value.model.odrDraftEnterprise.contactName);
						me.model.set('contactPhone', data.value.model.odrDraftEnterprise.contactPhone);
						me.model.set('contactEmail', data.value.model.odrDraftEnterprise.contactEmail);
						me.model.set('contactIm', data.value.model.odrDraftEnterprise.contactIm);
						
						if (data.value.model.appStartTime) {
                            me.$('.openTime').show().find('.content').text(new Date(data.value.model.appStartTime)._format('yyyy年MM月dd日'));
                        }
                      
                    }
                }
            });
        },

        hide: function () {
            var me = this;
            me.model.clear();
            me.$('.accordian').addClass('collapse');
            me.$('.accordian .content').removeAttr('style');

            me.$('.sectiona input').val('');
            me.$('.sectiona select').val('');
            me.$('.sectiona textarea').val('');

            me.$('.trybox').empty();
            AccountDetail.__super__.hide.apply(this, arguments);
        }
    });


    var EmployeeDataTable = MClass(M.Center).include({
        tplEme: _.template(tpl.filter('#trEme').html()),
        PAGESIZE: 20,
        elements: {
            '#elEA': 'ea',
            '#elEN': 'en',
            '#elName': 'name',
            '#elMobile': 'mobile',
            'tbody': 'tbody'
        },
        events: {
            'click #btnSearch': 'search',
            'click .accountdetail': 'accountDetailEve'
        },
        init: function () {
            EmployeeDataTable.__super__.init.apply(this, arguments);
            var me = this;
            me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager'),
                pageSize: me.PAGESIZE,
                pageNumber: 0
            });
            me.pagination.render();
            me.pagination.onChange = function () {
                me.load();
            };
            me.collection = new M.Collection;
            //me.load();
        },


        accountDetailEve: function (e) {
            var me = this;

            var enterpriseId = $(e.currentTarget).attr('data-enterpriseId');
			var ea = $(e.currentTarget).attr('data-ea');

            me.trigger('accountdetail', enterpriseId, ea);
        },
        search: function () {
            this.pagination.attr['pageNumber'] = 0;
            this.load();
        },
        load: function () {
            var me = this;
            if (!me.$en.val() && !me.$ea.val() && !me.$name.val() && !me.$mobile.val() ) {
                util.showToast('请输入查询条件！');
                return false;
            }
            util.api({
                url: '~/op/api/enterprise/querycustomerenterprise ',
                data: {
					en: me.$en.val(),
                    ea: me.$ea.val(),
                    accountName: me.$name.val(),
                    mobile: me.$mobile.val(),
                    pageIndex: me.pagination.attr['pageNumber'] + 1,
                    pageSize: me.pagination.attr['pageSize']
                },
                beforeSend: function () {
                    me.$tbody.html('<tr><td colspan="10"><p class="info">加载中...</p></td></tr>');
                },
                success: function (data) {

                    console.warn(data);

                    if (data.success) {
                        me.pagination.setTotalSize(data.value.model.itemCount);
                        me.collection.init(data.value.model.content);
                        //me.collection.reload( data.value.model.content, function( item ) {
                        //    item.displayCreateTime = new Date( item.createTime )._format( "yyyy-MM-dd hh:mm" );
                        //} );
                        var content = me.collection.all();
                        if (content.length > 0) {
                            me.$tbody.html(me.tplEme({'content': me.collection.all()}));
                            IBSS.tplEvent.setPermissions(me.$tbody);
                        } else {
                            me.$tbody.html('<tr><td colspan="10"><p class="info">暂无数据</p></td></tr>');
                        }
                    }
                },
                error: function () {
                    me.$tbody.html('<tr><td colspan="10"><p class="info">数据加载失败</p></td></tr>');
                }
            });
        }
    });

    exports.init = function () {
        var $el = exports.$el;

        var employeeDataTable = new EmployeeDataTable({'view': $el.find('.m-eme-lst')});

        var accountDetail = new AccountDetail();

        employeeDataTable.on('accountdetail', function (enterpriseId,ea) {
            accountDetail.show(enterpriseId,ea);
        });
    }
});