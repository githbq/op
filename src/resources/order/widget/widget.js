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
            value: '我AAA',
            attr: {style: 'border:2px solid red;'},
            validateOptions: {
                required: {
                    enable: true, value: true, message: 'AAAA不能为空啊', handler: function (error, value, option, $ele) {
                        alert('handler');
                    }
                }
            },
            events: [
                {
                    key: 'click',
                    value: function (e) {
                        debugger
                        this.o_setValue({name: 'BBB', readonly: true});
                    }
                }, {
                    key: "blur",
                    value: function (e) {
                    }
                }
            ]
        }));
        DataItems.push(new DataItem({
            name: 'BBB',
            value: '我BBB',
            attr: {style: 'border:2px solid red;'},
            validateOptions: {
                required: {
                    enable: true, value: true, message: 'AAAA不能为空啊', handler: function (error, value, option, $ele) {
                        alert('handler');
                    }
                }
            },
            events: [
                {
                    key: 'click',
                    value: function (e) {
                        debugger
                        this.o_setValue({name: 'BBB', visible: false});
                    }
                }, {
                    key: "blur",
                    value: function (e) {
                    }
                }
            ]
        }));
        $('.test').click(function () {

            alert('test');
            terminalInfo.o_validate();

        });
        var terminalInfo = new TerminalInfo({view: $el.find('.panel1'), dataItems: DataItems});
        terminalInfo.on('validateError', function (value, option, $ele, me) {
            alert(12212)


        });
        //var tableInfo = new TableInfo({view: $el.find('.panel2')});
        //var formInfo = new FormInfo({view: $el.find('.panel3')});
    }
});









