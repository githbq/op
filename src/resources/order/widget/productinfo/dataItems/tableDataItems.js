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

    dataItems.push(new DataItem({
        name: 'check',
        value:'44',
        events: [
            {
                key: 'change',
                value: function (e) {
                }
            }
        ]
    }));
    dataItems.push(new DataItem({
        name: 'origin_price_11',
        value:'产品原价11值'
    }));
    dataItems.push(new DataItem({
        name: 'origin_price_22',
        value:'产品原价22值'
    }));
    dataItems.push(new DataItem({
        name: 'origin_price_33',
        value:'产品原价33值'
    }));
    dataItems.push(new DataItem({
        name: 'origin_price_44',
        value:'产品原价44值'
    }));
});
