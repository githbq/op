define(function (require, exports, module) {

    var TerminalInfo = require('./productinfo/terminalinfo');
    var TableInfo = require('./productinfo/tableinfo');
    var FormInfo = require('./productinfo/forminfo');
    var DataItem = require('./productinfo/index').PageDataClass;

    var PageClass = MClass(M.Center).include({});

    exports.init = function () {
        var $el = exports.$el;
        var DataItems = [];
        DataItems.push(new DataItem({
            name: 'AAA',
            events: [
                {
                    key: 'click',
                    value: function (e) {
                        debugger
                        alert('click了')
                    }
                }]
        }));

        var terminalInfo = new TerminalInfo({view: $el.find('.panel1'), dataItems: DataItems});
        //var tableInfo = new TableInfo({view: $el.find('.panel2')});
        //var formInfo = new FormInfo({view: $el.find('.panel3')});
    }
});









