define(function (require, exports, module) {

    var refundinfo = require('./refundinfo/refundinfo');

    exports.init = function () {
        var me = this;
        var $el = exports.$el;
        var result = null;
        $('.test').click(function () {
            var type = $('#inputtype').val();
            if (type && parseInt(type)) {
                debugger
                result = refundinfo.show( {$view: $el.find('.panel1')});
            }
        });
        $('#changeType').change(function () {
            if (!$(this).val()) {
                return;
            }
            result = refundinfo.show(parseInt(type), {$view: $el.find('.panel1')});

        });
        $('.test2').click(function () {
            var aaa = result.getData();
            console.log('显示结果');
            console.warn(aaa);
            debugger
        });
        $('#testValidate').click(function () {

            debugger
            var aaa = result.validate();
            debugger
        });

        //result.data
    }
});


//
//
//
//
//define(function (require, exports, module) {
//
//    var productInfo = require('./productinfo/productinfo');
//
//    exports.init = function () {
//        var me = this;
//        var $el = exports.$el;
//        var result = null;
//        $('.test').click(function () {
//            var type = $('#inputtype').val();
//            if (type && parseInt(type))
//                result = productInfo.showProductInfo({
//                    terminalInfo: {$view: $el.find('.panel1')},
//                    tableInfo: {$view: $el.find('.panel2')},
//                    formInfo: {$view: $el.find('.panel3')}
//                }, parseInt(type));
//        });
//        $('#changeType').change(function () {
//            if (!$(this).val()) {
//                return;
//            }
//            result = productInfo.showProductInfo({
//                terminalInfo: {$view: $el.find('.panel1')},
//                tableInfo: {$view: $el.find('.panel2')},
//                formInfo: {$view: $el.find('.panel3')}
//            }, parseInt($(this).val()));
//
//        });
//        $('.test2').click(function () {
//            alert('结果')
//            debugger
//            var aaa = result.getData();
//            console.log('显示结果');
//            console.warn(aaa);
//            debugger
//        });
//        $('#testValidate').click(function () {
//
//            debugger
//            var aaa = result.validate();
//            debugger
//        });
//
//        //result.data
//    }
//});
//
//
//
//
//
//
//
//
//
