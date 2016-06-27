//
// 新增 增购/续费
// 入口页面
//===================
define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TplEvent = IBSS.tplEvent;

    var Page = require('../../testng/enterprisedetail/enterprisedetailmodule');

    exports.init = function( param ) {
        var $el = exports.$el;
        var data;
        var page;

        //增购/续费
        if( param && param[0] ){
            data = {
                'enterpriseId': param[0]
            };
            page = new Page( {wrapper: $el,orderId:null,isNew:false,isAdd:true,readonly:false,data:data} );
            page.render();
        //新购
        }else{
            data = {
                'enterpriseFilingId': IBSS.tempEnterprise.id,
                'enterpriseName': IBSS.tempEnterprise.enterpriseName,
                'area': IBSS.tempEnterprise.regionName
            };
            page = new Page( {wrapper: $el,orderId:null,isNew:true,isAdd:false,readonly:false,data:data} );
            page.render();
        }
        
        //IBSS.tplEvent.trigger('order1.2Success');
        //IBSS.tplEvent.trigger('order1.2Close');
        
        //取消 
        IBSS.tplEvent.on('order1.2Close',function(){
            //location.hash = '';
            history.back();
        });

        //新增成功
        IBSS.tplEvent.on('order1.2Success',function(){
            //location.hash = '';
            history.back();
        });


        //setTimeout(function () {
        //    debugger
        //    //p.nextStep();//下一步
        //    //  p.prevStep();//上一步
        //    //  p.hideFootBtns();//隐藏底部按钮
        //    // p.hideTopBar();//隐藏头部第几步提示栏
        //}, 5000)
    }
} );
