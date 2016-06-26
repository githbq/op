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

        console.log( param );
        var data;
        var page;

        //增购/续费
        if( param[0] ){
            data = {
                'enterpriseId': param[0]
            };
            page = new Page( {wrapper: $el,isNew:false,isAdd:true,readonly:false,type:'',data:data} );
            page.render();
        //新购
        }else{
            data = {
                'enterpriseFilingId': IBSS.tempEnterprise.id,
                'enterpriseName': IBSS.tempEnterprise.enterpriseName,
                'area': IBSS.tempEnterprise.regionName
            };
            page = new Page( {wrapper: $el,isNew:true,isAdd:false,readonly:false,type:'',data:data} );
            page.render();
        }
        
        //setTimeout(function () {
        //    debugger
        //    //p.nextStep();//下一步
        //    //  p.prevStep();//上一步
        //    //  p.hideFootBtns();//隐藏底部按钮
        //    // p.hideTopBar();//隐藏头部第几步提示栏
        //}, 5000)
    }
} );
