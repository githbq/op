define(function (require, exports, module) {
    $.fn.extend({
        recursiveSelect: function (options) {
            var me = this;
            new RecursiveSelect($.extend({ $selects: me }, options));


        }
    });
    //jquery版 递归下拉级联 暂未实现编辑时赋值功能
    function RecursiveSelect(options) {
        var me = this;
        var $selects = me.$selects = options.$selects;
        me.valueField = options.valueField || 'value';
        me.textField = options.textField || 'text';
        $selects.on('change', function () {
            var $dom = $(this);
            var value = $dom.val();
            var index = me.$selects.index($dom);
            var $nextDom = $selects.filter(':eq(' + (index + 1) + ')');

            //最后一个啥也不干
            if ($nextDom.length == 0) {
                return;
            }
            //如何选中的是请选择 后面的元素的option值非空部分全部删除
            me.$selects.filter(':gt(' + index + ')').each(function (i, n) {
                $(n).val('');
                $(n).find('option[value!=""]').remove();
            });
            if (index == 0 && $dom.children('[value!=""]').length == 0) {//如果是第一个下拉列表 且自身没有填内容 拉取一次内容
                me.getData().then(function (result) {
                    $dom.append(me.getOptionsStr(result));
                });
            }
            if (value) {
                me.getData(value).then(function (result) {
                    $nextDom.append(me.getOptionsStr(result));
                    $nextDom.change();
                });
            }

        });
        //取数据源
        me.getData = options.getData || function (parentValue) {
            var dtd = $.Deferred();
            dtd.resolve([]);
            return dtd.promise();
        }
        $selects.first().change();
    }
    RecursiveSelect.prototype = {
        getOptionsStr: function (arr) {
            var me = this;
            var str = '';
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                str += '<option value="' + item[me.valueField] + '">' + item[me.textField] + '</option>';
            }
            return str;
        }
    };
    module.exports = RecursiveSelect;
});