define(function (require, exports, module) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
    var listDic = {};
    var Pagination = require('common/widget/pagination/pagination');
    var tpl = $(require('./template.html'));
    var Slider = require('common/widget/slider/slider');
    var RecorrectList = MClass(M.Center).include({
        events: {
            'click .add': 'add',
            'click .search': 'search',
            'click .detail': 'edit',
            'click .delete': 'delete'
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
        add: function () {
            this.trigger('edit');
        },
        edit: function (e) {
            var id = $(e.currentTarget).attr('data-id');
            this.trigger('edit', id);
        },
        delete: function (e) {
            var me = this;
            var id = $(e.currentTarget).attr('data-id');
            if (confirm('确定删除?')) {
                util.api({
                    'url': '/ba/delete',
                    'data': {id: id},
                    'success': function (data) {
                        console.warn(data);
                        if (data.success) {
                            me.getList();
                        }
                    }
                });
            }
        },
        getList: function () {
            var me = this;
            var data = {
                'pageIndex': me.pagination.attr['pageNumber'] + 1,
                'pageSize': me.pagination.attr['pageSize']
            };
            $.extend(data, me.model.all());
            util.api({
                'url': '/ba/querypage',
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
                htmlStr = "<tr><td colspan='9'><p class='info'>暂无数据</p></td></tr>";
            }
            me.$tbody.html(htmlStr);
        }
    });


    var EditPanel = MClass(Slider).include({
        content: tpl.filter('#editPayAccount').html(),
        defaultAttr: {
            'title': '账户信息',
            'width': 500
        },
        elements: {},
        events: {
            'click .action-cancel': 'hide',
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
                    if (data.success) {
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
        save: function () {
            this.update();
        },
        update: function () {
            var me = this;
            if (!me.checkField()) {
                return;
            } else {
                if (confirm('确定提交?')) {
                    var data = me.model.all();
                    data.createTime = undefined;
                    data.updateTime=undefined;
					me.$('.action-save').text('提交中....');
					me.$('.action-save').attr('disabled','disabled');
                    util.api({
                        'url': me.model.get('id') ? '/ba/update' : '/ba/add',
                        'data': $.extend({isDeleted: 0}, data),
                        'success': function (data) {
                            console.warn(data);
                            if (data.success) {
                                util.showTip('操作成功');
								me.trigger('parentRefresh');
								me.hide();
                                
                            }
                        },
						'complete': function(){
							me.$('.action-save').text('确定');
							me.$('.action-save').removeAttr('disabled');
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
                if (!$(n).val()) {
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
        var recorrectList = new RecorrectList({'view': $el.find('.u-tablelist')});
        recorrectList.search();
        var editPanel = null;
        recorrectList.on('edit', function (id) {
            editPanel = new EditPanel();
            editPanel.show(id);
            editPanel.on('parentRefresh', function () {
                recorrectList.search();
            });
        });
    }
});