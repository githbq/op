//
// 新增 增购/续费
// 入口页面
//===================
define(function (require, exports, module) {
    var IBSS = window.IBSS,
        TplEvent = IBSS.tplEvent;

    var Page = require('../../testng/enterprisedetail/enterprisedetailmodule');

    exports.init = function (param) {
        var $el = exports.$el;
        var data;
        var page;

        //增购/续费
        if (param && param[0]) {

            //新购
            if (param[0] == 'a') {

                data = {
                    'enterpriseFilingId': IBSS.tempEnterprise.id,
                    'enterpriseName': IBSS.tempEnterprise.enterpriseName,
                    'area': IBSS.tempEnterprise.regionName
                };
                page = new Page({wrapper: $el, orderId: null, isNew: true, isAdd: false, isRef: false, readonly: false, data: data});
                page.render();

                //关联自注册
            } else if (param[0] == 'b') {

                data = {
                    'enterpriseFilingId': IBSS.tempEnterprise.id,
                    'enterpriseName': IBSS.tempEnterprise.enterpriseName,
                    'area': IBSS.tempEnterprise.regionName,
                    'enterpriseAccount': IBSS.tempEnterprise.enterpriseaccount
                };
                page = new Page({wrapper: $el, orderId: null, isNew: false, isAdd: false, isRef: true, readonly: false, data: data});
                page.render();

                //增购续费
            } else {

                data = {
                    'enterpriseId': param[0]
                };
                page = new Page({wrapper: $el, orderId: null, isNew: false, isAdd: true, isRef: false, readonly: false, data: data});
                page.render();
                page.goToStep(2);
            }
        }

        //IBSS.tplEvent.trigger('order1.2Success');
        //IBSS.tplEvent.trigger('order1.2Close');

        IBSS.tplEvent.off('order1.2Close');
        IBSS.tplEvent.off('order1.2Success');

        //取消
        IBSS.tplEvent.on('order1.2Close', function () {
            //location.hash = '';
            history.back();
        });

        //新增成功
        IBSS.tplEvent.on('order1.2Success', function () {
            location.hash = '#order/orderlist';
            //history.back();
        });


        //setTimeout(function () {
        //    debugger
        //    //p.nextStep();//下一步
        //    //  p.prevStep();//上一步
        //    //  p.hideFootBtns();//隐藏底部按钮
        //    // p.hideTopBar();//隐藏头部第几步提示栏
        //}, 5000)
    }
});
