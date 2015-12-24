define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
    
    //企业列表
    var EntList = require('module/enterpriselist/enterpriselist');

    //企业详情
    var EntDetail = require('module/enterprisedetail/enterprisedetail');

    //企业跟踪记录
    var EntTrace = require('module/enttrace/enttrace');

    var EmployeeDetail = require('module/employeedetail/employeedetail'); 
    
    //var entDetail;
    exports.init = function( param ) {
        var $el = exports.$el;
        
        var entList = new EntList( {'wrapper':$el,'param': param && param[0]} );
        entList.render();
        
        var entDetail = new EntDetail();
        var entTrace = new EntTrace();
        var employeeDetail = new EmployeeDetail();

        //查看企业详情
        entList.on('detail',function( id , status ){
            entDetail.show( id,status );
        });

        //查看跟踪记录
        entList.on('trace',function( id ){
            console.log('trace' + id);
            entTrace.show( id );
        });

       entDetail.on('employeeDetail',function(ea,phone){
            employeeDetail.show(ea,phone);
        });
    }
} );
