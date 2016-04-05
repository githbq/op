define(function (require, exports, module) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
    var listDic = {};
    var Pagination = require('common/widget/pagination/pagination');
    var tpl = $(require('./template.html'));
    var Slider = require('common/widget/slider/slider');
    var RecorrectList = MClass(M.Center).include({
        events: {
            'click .search': 'search',
            'click .detail': 'showDetail',
            'click .delete': 'deleteDetail'
        },
        elements: {
            'tbody': 'tbody'
        },
        trTpl: _.template(tpl.filter('.trTpl').html()),
        init: function () {
            RecorrectList.__super__.init.apply(this, arguments);
            var me = this;
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
            me.collection.on('reload', function () {
                me.renderList();
            });
        },
        hide: function () {
            var me = this;
            me.model.clear();
            RecorrectList.__super__.hide.apply(this, arguments);
        },
        search: function () {
            this.pagination.setPage(0, false);
            this.getList();
        },
        showDetail: function (e) {
            var id = $(e.currentTarget).attr('data-id');
            this.trigger('detail', id);
        },
        deleteDetail: function (e) {
            var me = this;
            var id = $(e.currentTarget).attr('data-id');
            util.api({
                'url': '/ba/delete',
                'data': data,
                'success': function (data) {
                    console.warn(data);
                    if (data.success) {
                        me.getList();
                    }
                }
            });
        },
        getList: function () {
            var me = this;
            var data = {
                'pageIndex': me.pagination.attr['pageNumber'] + 1,
                'pageSize': me.pagination.attr['pageSize']
            };
            $.extend(data, me.model.all());
            debugger
            util.api({
                'url': '/ba/querylist',
                'data': data,
                beforeSend: function () {
                    me.$tbody.html('<tr><td colspan="9"><p class="info">加载中...</p></td></tr>');
                },
                'success': function (data) {
                    console.warn(data);
                    if (data.success) {
                        me.pagination.setTotalSize(data.value.model.itemCount);
                        me.collection.reload(data.value.model.content, function (item) {
                            listDic[item.id] = item;
                        });
                    }
                }
            })
        },
        renderList: function () {
            var me = this;
            var collection = me.collection.all();
            var htmlStr = '';

            if (collection.length > 0) {
                htmlStr = me.trTpl({'content': collection});
            } else {
                htmlStr = "<tr><td colspan='10'><p class='info'>暂无数据</p></td></tr>";
            }
            me.$tbody.html(htmlStr);
        }
    });


    var EditPanel = MClass(Slider).include({
        content: tpl.filter('#editPayAccount').html(),
        defaultAttr: {
            'title': '账户信息',
            'width': 900
        },
        elements: {},
        events: {
            'click .action-cancel': 'cancel',
            'click .action-save': 'save'
        },
        getInfoEve: function () {
            var me = this;
            if (!me.model.get('id')) {
                return;
            }
            util.api({
                'url': '/ba/getdetail',
                'data': {
                    'id': me.model.get('id')
                },
                'success': function (data) {
                    if (!isNullObj(data.value.model)) {
                        me.model.load(data.value.model);
                    } else {
                        util.showToast('未获取到相关信息，请手动补全！');
                        return;
                    }
                }
            })
        },
        init: function () {
            EditPanel.__super__.init.apply(this, arguments);
        },
        saveRecorrect: function () {
            this.update();
        },
        update: function () {
            var me = this;
            if (!me.checkField()) {
                return;
            } else {
                if (confirm('确定提交?')) {
                    var data = me.model.all();
                    util.api({
                        'url': me.model.get('id') ? '/ba/update' : '/ba/add',
                        'data': data,
                        'success': function (data) {
                            console.warn(data);
                            if (data.success) {
                                util.showTip('操作成功');
                                setTimeout(function () {
                                    me.trigger('parentRefresh');
                                    me.hide();
                                }, 1000);
                            }
                        }
                    })
                }
            }
        },
        //获取企业详情
        show: function (id) {
            var me = this;
            me.model.set('id', id);
            me.getInfoEve();
            EditPanel.__super__.show.apply(this, arguments);
        },
        hide: function () {
            this.remove();
        },
        checkField: function () {
            var me = this;
            var arr = [];
            me.$("input[data-required],textarea[data-required]").each(function (i, n) {
                if (!n.value) {
                    arr.push($(n).attr('data-required'));
                }
            });
            if (arr.length > 0) {
                util.showToast(arr.join(','));
            }
            return arr.length == 0;
        }
    });


    exports.init = function () {
        var $el = exports.$el;
        var recorrectList = new RecorrectList({'view': $el.find('.list-content')});
        recorrectList.search();
        var editPanel = null;
        recorrectList.on('detail', function (id, status) {
            editPanel = new EditPanel();
            editPanel.show(id, status, true);
            editPanel.on('parentRefresh', function () {
                recorrectList.search();
            });
        });
    }
});