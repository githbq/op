define(function(require, exports, module) {

    var paginationTpl = require('./pagination.html');

    /**
     *@ 分页组件
     *  初始化的时候传入总页数
     *  todo list数量减少 点到一个不存在的超大页数时如何处理
     */
    var Pagination = function(attr) {
        this.init.apply(this, arguments)
    }
    Pagination.prototype = {

        view: paginationTpl,

        defaultAttr: {
            pageSize: 10, //每页显示条数
            totalSize: 0, //总条数
            pageNumber: 0 //当前页数
        },
        init: function(attr) {
            var me = this;

            me.attr = _.extend({}, me.defaultAttr, attr);
            me.$view = $(paginationTpl);
            me.initDom();
            me.initEvents();

            /*页数切换事件*/
            me.onChange = function(num) {

            };
        },

        //获取总页数
        getFullPage: function() {
            return Math.ceil(this.attr['totalSize'] / this.attr['pageSize']);
        },

        initDom: function() {
            var me = this;

            me.$pageMain = me.$view.find('.page-main');
            me.$frontBtn = me.$view.find('.page-frontbtn');
            me.$endBtn = me.$view.find('.page-endbtn');
            me.$totalSize = me.$view.find('.page-totalsize b');
        },

        //<o
        initEvents: function() {
            var me = this;

            me.$view.on('click', '.page-span', function(e) {
                var $target = $(e.target);
                if ($target.hasClass('disable')) return;
                var num = parseInt($target.attr('data-page'));
                me.setPage(num);
            });
            me.$view.on('click', '.page-frontbtn', function(e) {
                var $target = $(e.target);
                if ($target.hasClass('disable')) return;
                me.setPage(me.attr['pageNumber'] - 1);
            });
            me.$view.on('click', '.page-endbtn', function(e) {
                var $target = $(e.target);
                if ($target.hasClass('disable')) return;
                me.setPage(me.attr['pageNumber'] + 1);
            })
        },

        /**
         *@ 设置页数并触发事件
         *@param bool 如果为false
         *            不触发事件
         */
        setPage: function(num, bool) {
            var me = this,
                fullPage = me.getFullPage();

            //让num在范围中
            if (num <= 0) {
                num = 0;
            } else if (num >= (fullPage - 1)) {
                num = fullPage - 1;
            }

            me.attr['pageNumber'] = num;
            me.refresh();
            if (bool === false) {
                return;
            }

            me.onChange(num);
        },

        /**
         * 设置总条数 
         * 
         */
        setTotalSize: function(num) {
            var me = this;

            if (me.attr['totalSize'] == num) return;
            me.attr['totalSize'] = num;

            var pageNumber = me.attr['pageNumber'];
            if (pageNumber + 1 > me.getFullPage()) {

                me.setPage(me.getFullPage() - 1, false);
            } else {

                me.setPage(pageNumber, false);
            }
        },

        render: function() {

            this.attr['wrapper'] && this.attr['wrapper'].append(this.$view);
            this.refresh();
        },

        /**
         *@ 刷新展示
         */
        refresh: function() {
            var me = this;

            var fullPage = me.getFullPage(),
                totalSize = me.attr['totalSize'],
                pageNumber = me.attr['pageNumber'] + 1;

            //总数小于等于0 隐藏并返回
            if (me.attr['totalSize'] <= 0) {
                me.$view.hide();
                return;
            } else {
                me.$view.show();
            }

            me.$frontBtn.removeClass('disable');
            me.$endBtn.removeClass('disable');

            me.$totalSize.text(totalSize);

            //计算数据模型
            var arr = [];
            if (fullPage <= 11) {

                arr = _.range(1, fullPage + 1);
            } else {

                if (pageNumber <= 6) {

                    arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, fullPage]
                } else if (pageNumber >= (fullPage - 5)) {

                    arr = [1, 0, fullPage - 8, fullPage - 7, fullPage - 6, fullPage - 5, fullPage - 4, fullPage - 3, fullPage - 2, fullPage - 1, fullPage]
                } else {

                    arr = [1, 0, pageNumber - 3, pageNumber - 2, pageNumber - 1, pageNumber, pageNumber + 1, pageNumber + 2, pageNumber + 3, 0, fullPage]
                }

            }

            //生成dom
            var pageStr = '';
            var spanStr = '';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == pageNumber) {

                    spanStr = "<span class='page-span active' data-page='" + (arr[i] - 1) + "'>" + arr[i] + "</span>";
                } else if (arr[i] == 0) {

                    spanStr = "<span class='page-span disable' data-page='" + (arr[i] - 1) + "'>...</span>";
                } else {

                    spanStr = "<span class='page-span' data-page='" + (arr[i] - 1) + "'>" + arr[i] + "</span>";
                }

                pageStr = pageStr + spanStr;
            }
            me.$pageMain.html(pageStr);


            //前一页 后一页 
            if (pageNumber <= 1) {
                me.$frontBtn.addClass('disable');
            }
            if (pageNumber >= fullPage) {
                me.$endBtn.addClass('disable');
            }

        }

    }

    module.exports = Pagination;
});

