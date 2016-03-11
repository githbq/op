define(function (require, exports, module) {

    var productInfo = require('./productinfo/productinfo');

    exports.init = function () {
        var me = this;
        var $el = exports.$el;
        var result = null;
        $('.test').click(function () {
            var type = $('#inputtype').val();
            if (type && parseInt(type))
                result = productInfo.showProductInfo({
                    terminalInfo: {$view: $el.find('.panel1')},
                    tableInfo: {$view: $el.find('.panel2')},
                    formInfo: {$view: $el.find('.panel3')}
                }, parseInt(type));
        });
        $('#changeType').change(function () {
            if (!$(this).val()) {
                return;
            }
            result = productInfo.showProductInfo({
                terminalInfo: {$view: $el.find('.panel1')},
                tableInfo: {$view: $el.find('.panel2')},
                formInfo: {$view: $el.find('.panel3')}
            }, parseInt($(this).val()));

        });
        $('.test2').click(function () {
            alert('结果')
            debugger
            var aaa = result.getData();
            console.log('显示结果');
            console.warn(aaa);
            debugger
        });
        $('#testValidate').click(function () {

            debugger
            var aaa = result.terminalInfo.o_validate();
            var bbb = result.tableInfo.o_validate();
            var ccc = result.formInfo.o_validate();
            debugger
        });

        //result.data
    }
});









