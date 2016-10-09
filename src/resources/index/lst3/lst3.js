define(function(require, exports, module) {
    var IBSS = window.IBSS;
    IBSS.model = "";

    var Pagination = require('common/widget/pagination/pagination');
    var tpl = $(require('./template.html'));

    function doDownFile(url, idData, $button, $tips, callback) {
        $button.addClass('disabled');
        $button.attr('disabled', 'disabled');
        $tips.text('正在生成文件...请耐心等待');

        function downFile() {
            callback && callback();
            util.api({
                type: 'POST',
                data: { id: idData.value.model },
                url: url,
                dataType: "json",
                success: function(result) {
                    console.log(result.value.model);
                    if (result.value.model) {
                        $tips.text('');
                        $button.removeClass('disabled');
                        $button.removeAttr('disabled');
                        IBSS.model = idData.value.model;
                        util.initIframe();
                        $('#submit').click();
                        console.log(2);
                    } else {
                        setTimeout(function() {
                            downFile();
                        }, 10000);
                    }
                }
            });
        }
        downFile();
    }

    var ActLst = MClass(M.Center).include({
        tplSearch: _.template(tpl.filter('#actCountResult').html()),
        tplGenerate: _.template(tpl.filter('#actGenerateResult').html()),
        elements: {
            '#clOneIndustry': 'clOneIndustry',
            '#clTwoIndustry': 'clTwoIndustry',
            '#clThreeIndustry': 'clThreeIndustry',
            '#entType': 'entType',
            '#isRegister': 'isRegister',
            '#agent': 'agent',
            '#entCount': 'entCount',
            '#entID': 'entID',
            '#alAST': 'ast',
            '#alAET': 'aet',
            '#alCST': 'cst',
            '#alCET': 'cet',
            '#btnSearch': 'search',
            '.result': 'result',
            '.tips': 'tips'
        },
        events: {
            'click #btnSearch': 'search',
            'click #btnClear': 'clear',
            'click #btnReset': 'reset',
            'click #btnGenerate': 'generate',
            'click #btnDownload': 'download'
        },
        init: function() {
            ActLst.__super__.init.apply(this, arguments);
            var me = this;
            me.initializeDatepicker();
            me.initializeSelect();
            me.getList();
            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function() {
                me.getList();
            };

            me.collection = new M.Collection;
        },
        initializeDatepicker: function() {
            var me = this;
            me.$ast.datetimepicker({
                format: 'Y/m/d',
                onShow: function() {
                    var maxDate = me.$aet.val() ? me.$aet.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            });
            me.$aet.datetimepicker({
                format: 'Y/m/d',
                onShow: function() {
                    var minDate = me.$ast.val() ? me.$ast.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            });
            me.$cst.datetimepicker({
                format: 'Y/m/d',
                onShow: function() {
                    var maxDate = me.$cet.val() ? me.$cet.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            });
            me.$cet.datetimepicker({
                format: 'Y/m/d',
                onShow: function() {
                    var minDate = me.$cst.val() ? me.$cst.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            });
            me.$ast.val(me.getDateString(-30));
            me.$aet.val(me.getDateString(-1));
        },
        initializeSelect: function() {
            util.getIndustry([this.$clOneIndustry, this.$clTwoIndustry, this.$clThreeIndustry]);
        },
        generateSelect: function(name, $select, callback) {
            util.getEnums(name, function(data) {
                var items = data.model,
                    options = '';
                $(items).each(function(i, item) {
                    options += '<option value="' + item.value + '" title="' + item.text + '">' + item.text + '</option>';
                });
                $select.append(options);
                callback && callback(items);
            });
        },
        clear: function() {
            this.$agent.val('');
            this.$ast.val('');
            this.$aet.val('');
            this.$cst.val('');
            this.$cet.val('');
            this.$entType.val('');
            this.$entID.val('');
            this.$entCount.val('');
            this.$result.html('');
        },
        reset: function() {
            this.$clOneIndustry.val('');
            this.$clTwoIndustry.val('');
            this.$clThreeIndustry.val('');
            this.$entType.val('');
            this.$isRegister.val('');
            this.$ast.val(this.getDateString(-8));
            this.$aet.val(this.getDateString(-1));
            this.$cst.val('');
            this.$cet.val('');
            this.$agent.val('');
            this.$entCount.val('');
            this.$entID.val('');
            this.$result.html('');
        },
        search: function() {
            var me = this;

            var data = {
                industry: '',
                enterpriseType: me.$entType.val(),
                isRegister: me.$isRegister.val(),
                department: me.$agent.val(),
                enterpriseAccounts: me.$entCount.val(),
                enterpriseIds: me.$entID.val(),
            };

            if (me.$clThreeIndustry.val() != "") {

                data.industry = me.$clThreeIndustry.val();
            } else {

                if (me.$clTwoIndustry.val() != "") {

                    data.industry = me.$clTwoIndustry.val();

                } else {

                    if (me.$clOneIndustry.val() != "") { //优先选择级别最高的行业;

                        data.industry = me.$clOneIndustry.val();

                    } else {

                        data.industry = "";
                    }
                }
            }

            if (me.$cst.val()) {
                data.appStart = new Date(me.$cst.val()).getTime(); //开通起始日期
            }
            if (me.$cet.val()) {
                data.appEnd = new Date(me.$cet.val()).getTime(); //开通结束日期
            }


            me.$result.html('');
            me.$search.attr('disabled', 'disabled');
            me.$search.addClass('disabled');
            var originData = data;
            util.api({
                url: '~/op/api/activity/big/eidskey', //第一次去请求model值
                data: data,
                success: function(data) {
                    if (data.success) {
                        if (data.value.model) {
                            util.api({
                                data: {
                                    "accountId": IBSS.accountId,
                                    "auth": 0,
                                    "start": new Date(me.$ast.val()).getTime(),
                                    "remark": '',
                                    "end": new Date(me.$aet.val()).getTime(),
                                    "uuid": data.value.model
                                },
                                url: '~/hda/bigactivity/mission/run', // 第二次同样是请求model值
                                success: function(data) {
                                    if (data.success) {
                                        doDownFile('~/hda/bigactivity/mission/state', data, me.$search, me.$tips, function() {
                                            me.$search.removeClass('disabled');
                                            me.$search.removeAttr('disabled');
                                            me.getList();
                                        });
                                    }
                                }
                            })
                        } else if (data.value.model < 0) {
                            me.$search.removeClass('disabled');
                            me.$search.removeAttr('disabled');
                            window.open('/op/api/s/query/act/generatebig3?' + $.param(originData), 'hideiframe');
                        }
                    }
                }
            });
        },
        generate: function() {
            var me = this;
            var data = {
                industryOne: me.$clOneIndustry.val(),
                industryTwo: me.$clTwoIndustry.val(),
                industryThree: me.$clThreeIndustry.val(),
                entType: me.$entType.val(),
                isRegister: me.$isRegister.val(),
                agent: me.$agent.val(),
                entCount: me.$entCount.val(),
                entID: me.$entID.val(),
            };

            if (me.$ast.val()) {
                data.ast = new Date(me.$ast.val()).getTime();
            }
            if (me.$aet.val()) {
                data.aet = new Date(me.$aet.val()).getTime();
            }
            if (me.$cst.val()) {
                data.cst = new Date(me.$cst.val()).getTime();
            }
            if (me.$cet.val()) {
                data.cet = new Date(me.$cet.val()).getTime();
            }

            var $generate = me.$result.find('#btnGenerate'),
                $download = me.$result.find('#btnDownload'),
                $console = me.$result.find('#console');
            $generate.addClass('disabled');
            if ($generate.is('[disabled]')) {
                return;
            }
            $generate.attr('disabled', 'disabled');
            $download.addClass('invisiable');
            util.api({
                url: '/query/act/generate',
                data: data,
                success: function(data) {
                    if (data.success) {
                        var model = data.value.model;
                        model.dst = new Date(model.startTime)._format('yyyy-MM-dd hh:mm:ss');
                        model.dct = new Date(model.completeTime)._format('yyyy-MM-dd hh:mm:ss');
                        $console.append(me.tplGenerate({
                            value: model
                        }));
                        $download.attr('data-path', $.parseJSON(model.gPath).path);
                        $download.removeClass('invisiable');
                    }
                },
                complete: function() {
                    $generate.removeClass('disabled');
                    $generate.removeAttr('disabled');
                }
            });

        },
        download: function(e) {
            var target = e.currentTarget,
                path = $(target).attr('data-path');
            var url = location.protocol + '//' + location.host + IBSS.API_PATH + '/query/act/download?path=' + path;
            window.open(url);
        },
        getDateString: function(offset, base) {
            var date = this.getDate(offset, base);
            return util.formatDate(date, 'YYYY-MM-dd');
        },
        getDate: function(offset, base) {
            if (!base) {
                base = new Date().getTime();
            }
            if (offset) {
                return base + offset * 24 * 3600 * 1000;
            }
            return base;
        },
        getList: function() {
            var me = this;
            me.$('.u-tablelist tbody tr').remove();
            $.extend(data, me.model.all());
            util.api({
                'url': '/query/act/sparktaskbig',
                'data': {},
                beforeSend: function() {
                    me.$('.u-tablelist tbody tr').html('<tr><td colspan="9"><p class="info">加载中...</p></td></tr>');
                },
                'success': function(data) {
                    console.warn(data);
                    if (data.success) {
                        me.pagination.setTotalSize(data.value.model.itemCount);
                        me.collection.reload(data.value.model.content, function(item) {

                        });
                        me.renderList();
                    }
                }
            })
        },
        trTpl: _.template(tpl.filter('.trTpl').html()),
        renderList: function() {
            var me = this;
            var collection = me.collection.all();
            var htmlStr = '';

            if (collection.length > 0) {
                htmlStr = me.trTpl({
                    'content': collection
                });
            } else {
                htmlStr = '<tr><td colspan="' + me.$('.list-content th').length + '"><p class="info">暂无数据</p></td></tr>';
            }
            me.$('.list-content tbody').html(htmlStr);
        }
    });

    exports.init = function() {
        var $el = exports.$el;
        var actLst = new ActLst({
            'view': $el.find('.m-act-lst')
        });
    }
});