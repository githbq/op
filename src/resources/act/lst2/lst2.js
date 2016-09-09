define(function (require, exports, module) {
    var IBSS = window.IBSS;
    var Pagination = require('common/widget/pagination/pagination');
    var tpl = $(require('./template.html'));

    function doDownFile(url, $button, $tips, callback) {
        $button.addClass('disabled');
        $button.attr('disabled', 'disabled');
        $tips.text('正在生成文件...请耐心等待');
        function downFile() {
            callback && callback();
            $.ajax({ type: 'POST', url: url })
                .success(function (result) {
                    if (result.success) {
                        $tips.text('');
                        $button.removeClass('disabled');
                        $button.removeAttr('disabled');
                        window.open(url, 'hideiframe');
                    } else {
                        setTimeout(function () {
                            downFile();
                        }, 10000);
                    }
                });
        }
        downFile();
    }

    var ActLst = MClass(M.Center).include({
        tplSearch: _.template(tpl.filter('#actCountResult').html()),
        tplGenerate: _.template(tpl.filter('#actGenerateResult').html()),
        elements: {
            '#alIndustry': 'industry',
            '#alPModule': 'pModule',
            '#alSource': 'source',
            '#alFStatus': 'fstatus',
            '#alCode': 'code',
            '#alAST': 'ast',
            '#alAET': 'aet',
            '#alCST': 'cst',
            '#alCET': 'cet',
            '#alListType': 'listType',
            '#alList': 'list',
            '#btnSearch': 'search',
            '.result': 'result',
            '.tips': 'tips',
            '#downloaddayactive': 'downloaddayactive'
        },
        events: {
            'click #btnSearch': 'search',
            'click #btnClear': 'clear',
            'click #btnReset': 'reset',
            'click #btnGenerate': 'generate',
            'click #btnDownload': 'download',
            'click #btnQyrhyExel': 'downExel'
        },
        init: function () {
            ActLst.__super__.init.apply(this, arguments);
            var me = this;
            me.initializeDatepicker();
            me.initializeSelect();
            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function () {
                me.getList();
            };

            me.collection = new M.Collection;
        },
        initializeDatepicker: function () {
            var me = this;
            me.$ast.datetimepicker({
                format: 'Y/m/d',
                onShow: function () {
                    var maxDate = me.$aet.val() ? me.$aet.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            });
            me.$aet.datetimepicker({
                format: 'Y/m/d',
                onShow: function () {
                    var minDate = me.$ast.val() ? me.$ast.val() : false;
                    this.setOptions({
                        minDate: minDate
                    });
                },
                timepicker: false
            });
            me.$cst.datetimepicker({
                format: 'Y/m/d',
                onShow: function () {
                    var maxDate = me.$cet.val() ? me.$cet.val() : false;
                    this.setOptions({
                        maxDate: maxDate
                    });
                },
                timepicker: false
            });
            me.$cet.datetimepicker({
                format: 'Y/m/d',
                onShow: function () {
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
        initializeSelect: function () {
            //this.generateSelect( 'INDUSTRY', this.$industry );
            util.getIndustry(this.$industry);
            this.generateSelect('PRODUCT_MODULE', this.$pModule);
            this.generateSelect('ENT_LST_SOURCE', this.$source);
        },
        generateSelect: function (name, $select, callback) {
            util.getEnums(name, function (data) {
                var items = data.model, options = '';
                $(items).each(function (i, item) {
                    options += '<option value="' + item.value + '" title="' + item.text + '">' + item.text + '</option>';
                });
                $select.append(options);
                callback && callback(items);
            });
        },
        clear: function () {
            this.$code.val('');
            this.$ast.val('');
            this.$aet.val('');
            this.$cst.val('');
            this.$cet.val('');
            this.$list.val('');
            this.$result.html('');
        },
        reset: function () {
            this.$industry.val('');
            this.$pModule.val('');
            this.$source.val('');
            this.$code.val('');
            this.$ast.val(this.getDateString(-8));
            this.$aet.val(this.getDateString(-1));
            this.$cst.val('');
            this.$cet.val('');
            this.$listtype.val('1');
            this.$fstatus.val('');
            this.$list.val('');
            this.$result.html('');
        },
        search: function () {
            var me = this;
            var data = {
                industry: me.$industry.val(),
                pm: me.$pModule.val(),
                code: me.$code.val(),
                fStatus: me.$fstatus.val(),
                source: me.$source.val()
            };
            if (me.$ast.val()) {
                data.ast = new Date(me.$ast.val()).getTime();
            } else {
                util.showToast('请填写活跃开始时间');
                return false;
            }
            if (me.$aet.val()) {
                data.aet = new Date(me.$aet.val()).getTime();
            } else {
                util.showToast('请填写活跃结束时间');
                return false;
            }
            if (me.$cst.val()) {
                data.cst = new Date(me.$cst.val()).getTime();
            }
            if (me.$cet.val()) {
                data.cet = new Date(me.$cet.val()).getTime();
            }
            if (me.$list.val()) {
                data.listType = me.$listType.val();
                data.list = me.$list.val();
            }
            me.$result.html('');
            me.$search.attr('disabled', 'disabled');
            me.$search.addClass('disabled');
            var originData = data;
            var url = location.protocol + '//' + location.host + IBSS.API_PATH + '/query/act/generate3?' + $.param(originData);
            window.open(url);
            //window.open('/query/act/generate3?' + $.param(originData));
            me.$search.removeClass('disabled');
            me.$search.removeAttr('disabled');
            /*util.api({
                url: '/query/act/count2',
                data: data,
                success: function (data) {
                    if (data.success) {
                        if (data.value.model > 10000) {

                            util.api({
                                data: originData,
                                url: '/query/act/generate2',
                                success: function (data) {
                                    if (data.success) {
                                        doDownFile('/op/api/s/query/act/downloadhdfs?path=' + data.model.gPath,me.$search,me.$tips,function(){
                                            me.$search.removeClass('disabled');
                                            me.$search.removeAttr('disabled');
                                            me.getList();
                                        });
                                    }
                                }
                            })
                        } else if (data.value.model <= 10000) {
                            me.$search.removeClass('disabled');
                            me.$search.removeAttr('disabled');
                            window.open('/op/api/s/query/act/generate3?' + $.param(originData),'hideiframe');
                        }
                    }
                }
            });*/
        },
        generate: function () {
            var me = this;
            var data = {
                industry: me.$industry.val(),
                pm: me.$pModule.val(),
                code: me.$code.val(),
                fStatus: me.$fstatus.val(),
                source: me.$source.val()
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
            if (me.$list.val()) {
                data.listType = me.$listType.val();
                data.list = me.$list.val();
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
                success: function (data) {
                    if (data.success) {
                        var model = data.value.model;
                        model.dst = new Date(model.startTime)._format('yyyy-MM-dd hh:mm:ss');
                        model.dct = new Date(model.completeTime)._format('yyyy-MM-dd hh:mm:ss');
                        $console.append(me.tplGenerate({ value: model }));
                        $download.attr('data-path', $.parseJSON(model.gPath).path);
                        $download.removeClass('invisiable');
                    }
                },
                complete: function () {
                    $generate.removeClass('disabled');
                    $generate.removeAttr('disabled');
                }
            });

        },
        download: function (e) {
            var target = e.currentTarget,
                path = $(target).attr('data-path');
            var url = location.protocol + '//' + location.host + IBSS.API_PATH + '/query/act/download?path=' + path;
            window.open(url);
        },
        getDateString: function (offset, base) {
            var date = this.getDate(offset, base);
            return util.formatDate(date, 'YYYY-MM-dd');
        },
        getDate: function (offset, base) {
            if (!base) {
                base = new Date().getTime();
            }
            if (offset) {
                return base + offset * 24 * 3600 * 1000;
            }
            return base;
        },
        getList: function () {
            var me = this;
            me.$('.u-tablelist tbody tr').remove();
            $.extend(data, me.model.all());
            util.api({
                'url': '/query/act/sparktask',
                'data': {},
                beforeSend: function () {
                    me.$('.u-tablelist tbody tr').html('<tr><td colspan="9"><p class="info">加载中...</p></td></tr>');
                },
                'success': function (data) {
                    console.warn(data);
                    if (data.success) {
                        me.pagination.setTotalSize(data.value.model.itemCount);
                        me.collection.reload(data.value.model.content, function (item) {

                        });
                        me.renderList();
                    }
                }
            })
        },
        trTpl: _.template(tpl.filter('.trTpl').html()),
        renderList: function () {
            var me = this;
            var collection = me.collection.all();
            var htmlStr = '';

            if (collection.length > 0) {
                htmlStr = me.trTpl({ 'content': collection });
            } else {
                htmlStr = '<tr><td colspan="' + me.$('.list-content th').length + '"><p class="info">暂无数据</p></td></tr>';
            }
            me.$('.list-content tbody').html(htmlStr);
        },
        //日活详情导出----------------------------------------------
        downExel: function () {
            var me = this;
            var data = {
                industry: me.$industry.val(),
                pm: me.$pModule.val(),
                code: me.$code.val(),
                fStatus: me.$fstatus.val(),
                source: me.$source.val()
            };
            if (me.$ast.val()) {
                data.ast = new Date(me.$ast.val()).getTime();
            } else {
                util.showToast('请填写活跃开始时间');
                return false;
            }
            if (me.$aet.val()) {
                data.aet = new Date(me.$aet.val()).getTime();
            } else {
                util.showToast('请填写活跃结束时间');
                return false;
            }
            if (me.$cst.val()) {
                data.cst = new Date(me.$cst.val()).getTime();
            }
            if (me.$cet.val()) {
                data.cet = new Date(me.$cet.val()).getTime();
            }
            if (me.$list.val()) {
                data.listType = me.$listType.val();
                data.list = me.$list.val();
            }
            me.$result.html('');
            me.$search.attr('disabled', 'disabled');
            me.$search.addClass('disabled');
            var originData = data; 
            var filepath = '';
            util.api({
                'url': '/query/act/generate3',
                'data': originData,
                'beforeSend': function () {
                    me.$('#btnQyrhyExel').attr('disabled', 'disabled').text('导出中......');
                    me.$downloaddayactive.hide()
                },
                'success': function (data) {
                    console.warn(data);
                    if (data.success) {
                        filepath = data.value.model;
                        me.$('#btnQyrhyExel').text('生成中 稍等几分钟...').attr('disabled', 'disabled');
                        checkExport();
                    } else {
                        reset();
                    }
                },
                'error': function () {
                    reset();
                }
            })

            /**
             * 返回初始状态
             */
            function reset() {
                me.$('#btnQyrhyExel').removeAttr('disabled').text('日活详情导出');
                me.$downloaddayactive.hide();
            }

            /**
             *
             * 轮询获取列表是否生成成功
             */
            function checkExport() {
                $.ajax({
                    'url': '/op/api/file/downloadeaactimport',
                    'type': 'get',
                    'data': {
                        'filePath': filepath
                    },
                    'complete': function (xhr, status) {

                        if (xhr.status == 200) {

                            console.log('status:200');
                            setTimeout(function () {
                                reset();
                                me.$downloaddayactive.show().find('a').attr('href', '/op/api/file/downloadeaactimport?filePath=' + filepath);
                            }, 5000);
                        } else if (xhr.status == 404) {

                            console.log('status:404');
                            setTimeout(function () { checkExport() }, 5000);
                        } else {

                            console.log('status:undefined');
                            reset();
                            util.showToast('生成失败');
                        }
                    }
                })
            }
        },

        //日活详情导出事件
        exportExel: function () {
            var me = this;
            var objdata = {};

            if (me.$cst.val()) {
                objdata['appTimeStart'] = new Date(me.$cst.val()).getTime();
            } else {
                objdata['appTimeStart'] = '';

            }
            if (me.$cet.val()) {
                objdata['appTimeEnd'] = new Date(me.$cet.val()).getTime();
            } else {
                objdata['appTimeEnd'] = '';

            }
            if (me.$ast.val()) {
                objdata['actStartTime'] = new Date(me.$ast.val()).getTime();
            } else {
                //objdata['actStartTime'] = '';
                util.showToast('请完善活跃时间');
                return false;
            }
            if (me.$aet.val()) {
                objdata['actEndTime'] = new Date(me.$aet.val()).getTime();
            } else {

                util.showToast('请完善活跃时间');
                return false;
            }
            objdata['name'] = me.$alName.val() || '';
            objdata['enterAccount'] = me.$enterpriseAccount.val() || '';
            objdata['enterpriseType'] = me.$('#enterpriseType').val();

            me.$('#btnQyrhyExel').attr('disabled', 'disabled');
            me.$('#btnQyrhyExel').addClass('disable');
            me.$('#btnQyrhyExel').text('导出中...');

            var hrefStr = '/op/api/query/eaactimport/generate?' + $.param(objdata);
            location.href = hrefStr;

            me.$('#btnQyrhyExel').removeClass('disable');
            me.$('#btnQyrhyExel').removeAttr('disabled');
            me.$('#btnQyrhyExel').text('日活详情导出');
        }
    });

    exports.init = function () {
        var $el = exports.$el;
        var actLst = new ActLst({ 'view': $el.find('.m-act-lst') });
    }
});