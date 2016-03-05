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

    var zhushous=[
        {id:11,name:'PK助手'},
        {id:22,name:'会议助手'},
        {id:33,name:'HR助手'},
        {id:44,name:'工资助手',options:{discount:{value:'options->工资助手折扣'}}}
    ];
    $(zhushous).each(function(i,n){
        n.options= n.options||{};

        //PK助手开始时间
        dataItems.push(new DataItem($.extend({
            name: 'startDate_'+ n.id,
            value: n.name+'日期开始',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }, n.options.startDate)));
        //PK助手结束时间
        dataItems.push(new DataItem($.extend({
            name: 'endDate_'+ n.id,
            value: n.name+'日期结束',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }, n.options.endDate)));

        //pk助手原价
        dataItems.push(new DataItem($.extend({
            name: 'productAmount_'+ n.id,
            value: n.name+'合同金额',
            validateOptions: {
                required: {
                    enable: true, value: true, message: '', handler: function (error, value, option, $ele) {
                    }
                }
            }
        }, n.options.productAmount)));

        //pk助手合同金额
        dataItems.push(new DataItem($.extend({
            name: 'purchaseAmount_'+ n.id,
            value: n.name+'合同金额'
        }, n.options.purchaseAmount)));

        //pk助手折扣
        dataItems.push(new DataItem($.extend({
            name: 'discount_'+ n.id,
            value: n.name+'折扣'
        }, n.options.discount)));


    });






});
