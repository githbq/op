define(function (require, exports, module) {

    var productInfo = require('./productinfo/productinfo');

    exports.init = function () {
        var me=this;
        var $el = exports.$el;
        $('.test').click(function () {
            alert('test');
          //  alert(JSON.stringify(result.tableInfo.o_getValues()));
            //result.terminalInfo.o_validate();
            debugger
            result.getData();
        });
        var result = productInfo.showProductInfo({terminalInfo: {$view: $el.find('.panel1')}, tableInfo: {$view: $el.find('.panel2')}, formInfo: {$view: $el.find('.panel3')}});
        //result.data
    }
});









