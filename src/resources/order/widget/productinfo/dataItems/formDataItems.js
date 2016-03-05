define(function (require, exports, module) {
    var DataItem = require('../index').PageDataClass;
    var dataItems=module.exports=[];
    dataItems.push(new DataItem({
        name: 'checkAll',
        value:null,
        events: [
            {
                key: 'change',
                value: function (e) {
                    debugger
                    this.o_setValue({name: 'check', value:$(e.target).is(':checked')});
                }
            }, {
                key: "blur",
                value: function (e) {
                }
            }
        ]
    }));


});
