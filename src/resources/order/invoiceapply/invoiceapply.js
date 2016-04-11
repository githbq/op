//hubq

define(function (require, exports, module) {

    var sform = require('common/widget/sform/sform');

    var PageClass = MClass(sform.PageClass).include({
        i_getTemplateStr: function () {
            var me = this;
            return  me.templateStr;
        },
        init: function (data) {
            var me = this;
            me.templateStr = data.templateStr;
            PageClass.__super__.init.apply(this, arguments);
        }
    });


    var listDic = {};
    var Pagination = require('common/widget/pagination/pagination');
    var tpl = $(require('./template.html'));
    var ListPage = MClass(M.Center).include({
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
            ListPage.__super__.init.apply(this, arguments);
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
            ListPage.__super__.hide.apply(this, arguments);
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
                    debugger
                    me.$tbody.html('<tr><td colspan="'+me.$view.find('th').length+'"><p class="info">加载中...</p></td></tr>');
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
                htmlStr = '<tr><td colspan="'+me.$view.find('th').length+'"><p class="info">暂无数据</p></td></tr>';
            }
            me.$tbody.html(htmlStr);
        }
    });

    exports.init = function () {
        var DataItem = require('common/widget/sform/sform').PageDataClass;
        var dataItems=[];
        dataItems.push(new DataItem({
            name:'ea',
            value:'ea123'
        }));
        var me = this;
        var $el = exports.$el;
        var templateStr=$el.find('.list-main').html();
        var page = new PageClass({templateStr:templateStr,dataItems:dataItems,wrapperView: $el.find('.list-main')});
        page.render();
        var listPage = new ListPage({'view': $el.find('.u-tablelist')});
        listPage.search();
        listPage.on('edit', function (id) {
            //editPanel = new EditPanel();
            //editPanel.show(id);
            //editPanel.on('parentRefresh', function () {
            //    listPage.search();
            //});
        });

    }
});