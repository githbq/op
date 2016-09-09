//hubq
define(function (require, exports, module) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
    var Pagination = require('common/widget/pagination/pagination');
    var tpl = $(require('./template.html'));
    var Slider = require('common/widget/slider/slider');
    var ModelList = MClass(M.Center).include({
        events: {
            'click .search': 'search',
        },
        elements: {
            'tbody': 'tbody'
        },
        trTpl: _.template(tpl.filter('.trTpl').html()),
        init: function () {
            ModelList.__super__.init.apply(this, arguments);
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
            ModelList.__super__.hide.apply(this, arguments);
        },
        search: function () {
            this.pagination.setPage(0, false);
            this.getList();
        },
        getList: function () {
            var me = this;
            var data = {
                'pageIndex': me.pagination.attr['pageNumber'] + 1,
                'pageSize': me.pagination.attr['pageSize']
            };
            $.extend(data, me.model.all());
            util.api({
                'url': '/odr/receivedpay/queryList',
                'data': data,
                beforeSend: function () {
                    me.$tbody.html('<tr><td colspan="10"><p class="info">加载中...</p></td></tr>');
                },
                'success': function (data) {
                    console.warn(data);
                    if (data.success) {
                        me.pagination.setTotalSize(data.value.model.itemCount);
                        me.collection.reload(data.value.model.content, function (item) {
                            item.property_name = item.property == 1 ? "到款" : item.property == 2 ? "退款" : "";
                            item.claimStatus_name = item.claimStatus == 1 ? "未认领" : item.claimStatus == 2 ? "认领中(假状态)" : item.claimStatus == 3 ? "已认领" : ""
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
                htmlStr = me.trTpl({ 'content': collection });
            } else {
                htmlStr = "<tr><td colspan='10'><p class='info'>暂无数据</p></td></tr>";
            }
            me.$tbody.html(htmlStr);
        }
    });


    exports.init = function () {
        var $el = exports.$el;
        var modelList = new ModelList({ 'view': $el.find('.u-tablelist') });
    }
});