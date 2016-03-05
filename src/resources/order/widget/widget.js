define(function (require, exports, module) {

    var TerminalInfo = require('./productinfo/terminalinfo');
    var TableInfo = require('./productinfo/tableinfo');
    var FormInfo = require('./productinfo/forminfo');


    var PageClass = MClass(M.Center).include({});

    var terminalDataItems=require('./productinfo/dataitems/terminaldataitems');
    var tableDataItems=require('./productinfo/dataitems/tabledataitems');
    var formDataItems=require('./productinfo/dataitems/formdataitems');
    exports.init = function () {
        var $el = exports.$el;

        $('.test').click(function () {

            alert('test');
            terminalInfo.o_validate();

        });
        var terminalInfo = new TerminalInfo({view: $el.find('.panel1'), dataItems: terminalDataItems});
        terminalInfo.on('validateError', function (value, option, $ele, me) {
        });
        var tableInfo = new TableInfo({view: $el.find('.panel2'),dataItems:tableDataItems});
        var formInfo = new FormInfo({view: $el.find('.panel3'),dataItems:formDataItems});
    }
});









