define(function (require, exports, module) {

    var refundinfo = require('./refundinfo/refundinfo');

    exports.init = function () {
        var $el = exports.$el;
        $el.find('#modulename').on('change', function () {
            $el.find('.panel_test').empty();
            setTimeout(function () {
                $('.test').click();
            }, 100);
            switch ($(this).val()) {
                case '1':
                {
                    testInvoiceDetail()
                }
                    ;
                    break;
                case '2':
                {
                    testRefundInfo()
                }
                    ;
                    break;
                case '3':
                {
                    testProductInfo()
                }
                    ;
                    break;
            }
        });
        $el.find('#modulename').change();
    };


    function testInvoiceDetail() {
        var invoiceapplydetail = require('./invoiceapplydetail/invoiceapplydetail');
        var me = this;
        var $el = exports.$el;
        var result = null;
        $('.test').off().click(function () {
            var type = $('#inputtype').val();
            if (type && parseInt(type)) {
                var data = {
                    invoiceId: 66,
                    processInstanceId: "1110326"
                };
                result = invoiceapplydetail.show(type,{$view: $el.find('.panel1'),data:data});
            }
        });
        $('#changeType').off().change(function () {
            var type = $('#inputtype').val();
            if (!$(this).val()) {
                return;
            }
            var data = {
                invoiceId: 66,
                processInstanceId: "1110326"
            };
            result = invoiceapplydetail.show(type,{$view: $el.find('.panel1'),data:data});

        });
        $('.test2').off().click(function () {
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


    function testRefundInfo() {
        var refundinfo = require('./refundinfo/refundinfo');
        var me = this;
        var $el = exports.$el;
        var result = null;
        $('.test').off().click(function () {
            var type = $('#inputtype').val();
            if (type && parseInt(type)) {
                debugger
                result = refundinfo.show({$view: $el.find('.panel1')}, {});
            }
        });
        $('#changeType').off().change(function () {
            if (!$(this).val()) {
                return;
            }
            result = refundinfo.show(parseInt(type), {$view: $el.find('.panel1')});

        });
        $('.test2').off().click(function () {
            var aaa = result.getData();
            console.log('显示结果');
            console.warn(aaa);
            debugger
        });
        $('#testValidate').off().click(function () {

            debugger
            var aaa = result.validate();
            debugger
        });

        //result.data
    }


    function testProductInfo() {
        var productInfo = require('./productinfo/productinfo');
        var me = this;
        var $el = exports.$el;
        var result = null;
        $('.test').off().click(function () {
            var type = $('#inputtype').val();
            if (type && parseInt(type))
                result = productInfo.showProductInfo({
                    terminalInfo: {$view: $el.find('.panel1')},
                    tableInfo: {$view: $el.find('.panel2')},
                    formInfo: {$view: $el.find('.panel3')}
                }, parseInt(type));
        });
        $('#changeType').off().change(function () {
            if (!$(this).val()) {
                return;
            }
            result = productInfo.showProductInfo({
                terminalInfo: {$view: $el.find('.panel1')},
                tableInfo: {$view: $el.find('.panel2')},
                formInfo: {$view: $el.find('.panel3')}
            }, parseInt($(this).val()));

        });
        $('.test2').off().click(function () {
            alert('结果')
            debugger
            var aaa = result.getData();
            console.log('显示结果');
            console.warn(aaa);
            debugger
        });
        $('#testValidate').off().click(function () {

            debugger
            var aaa = result.validate();
            debugger
        });
    }


});










