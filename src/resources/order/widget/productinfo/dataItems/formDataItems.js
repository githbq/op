define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var dataItems=module.exports=[];
    var dataItems=module.exports= [];
    dataItems.push(new DataItem({
        name: 'AAA',
        value: '我AAAcc',
        attr: {},
        validateOptions: {
            required: {
                enable: true, value: true, message: 'AAAAcc不能为空啊', handler: function (error, value, option, $ele) {
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
    dataItems.push(new DataItem({
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


});
