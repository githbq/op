define(function (require, exports, module) {

    var productInfo = require('./productinfo/productinfo');

    exports.init = function () {
        var me = this;
        var $el = exports.$el;
        var result=null;
        $('.test').click(function () {
            var type=$('#inputtype').val();
            if(type && parseInt(type))
                var result = productInfo.showProductInfo({
                    terminalInfo: {$view: $el.find('.panel1')},
                    tableInfo: {$view: $el.find('.panel2')},
                    formInfo: {$view: $el.find('.panel3')}
                },parseInt(type));
            debugger
            var aaa = result.getData();
            debugger
        });
        $('.test2').click(function () {
            alert('结果')
            debugger
            var aaa = result.getData();
            console.log('显示结果');
            console.warn(aaa);
            debugger
        });

        //result.data
    }
});









