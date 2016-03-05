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
        value:'22',
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
    dataItems.push(new DataItem({
        name: 'pk_type_11',
        value:'1'
    }));
    dataItems.push(new DataItem({
        name: 'hy_type_22',
        value:'2'
    }));
    dataItems.push(new DataItem({
        name: 'hr_type_33',
        value:'3'
    }));
    dataItems.push(new DataItem({
        name: 'gz_type_44',
        value:'1'
    }));
    dataItems.push(new DataItem({
        name: 'purchaseAmount_11',
        value:'1111'
    }));
    dataItems.push(new DataItem({
        name: 'purchaseAmount_22',
        value:'54555'
    }));
    dataItems.push(new DataItem({
        name: 'purchaseAmount_33',
        value:'777'
    }));
    dataItems.push(new DataItem({
        name: 'purchaseAmount_44',
        value:'6666'
    }));
});
