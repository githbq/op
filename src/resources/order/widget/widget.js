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
            value: '我工工工工BBBBB',
            attr: {style: 'border:2px solid red;'},
            validateOptions:{required: {
                enable: true, value: true, message: 'AAAA不能为空啊', handler: function (error, value, option, $ele) {
                    alert('handler');
                }
            }},
            events: [
                {
                    key: 'click',
                    value: function (e) {
                        this.setValue({name: 'b', visible: false});
                    }
                }]
        }));
        $('.test').click(function () {

            alert('test');
            terminalInfo.o_validate();

        });
        var terminalInfo = new TerminalInfo({view: $el.find('.panel1'), dataItems: DataItems});
        terminalInfo.on('validateError',function( value, option, $ele,me){
            alert(12212)


        });
        //var tableInfo = new TableInfo({view: $el.find('.panel2')});
        //var formInfo = new FormInfo({view: $el.find('.panel3')});
    }
});









