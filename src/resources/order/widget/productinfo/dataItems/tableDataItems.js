define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var dataItems=module.exports=[];
    dataItems.push(new DataItem({
        name: 'checkAll',
        value:'all',
        events: [
            {
                key: 'change',
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
        name: 'check',
        value:'all',
        events: [
            {
                key: 'change',
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

});
