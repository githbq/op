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

        //增购办公
        entList.on('zengbangong',function( id , account ){
            console.log('zengbangong');
            console.log( id );
            location.hash = "order/newmarketying/addOffice/" + id + '/' + account;
        });
        //增购营销
        entList.on('zengyingxiao',function( id , account ){
            console.log('zengyingxiao');
            console.log( id );
            location.hash = "order/newmarketying/addMarkey/" + id + '/' + account;
        });
        //续费办公
        entList.on('renewbangong',function( id , account ){
            console.log('renewbangong');
            console.log( id );
            location.hash = "order/newmarketying/againOffice/" + id + '/' + account;
        });
        //续费营销
        entList.on('renewyingxiao',function( id , account ){
            console.log('renewyingxiao');
            console.log( id );
            location.hash = "order/newmarketying/againMarkey/" + id + '/' + account;
        });
		//刷新列表
        entDetail.on('refresh',function(){
            entList.search();
        });

       entDetail.on('employeeDetail',function(ea,phone){
            employeeDetail.show(ea,phone);
        });
    }
} );
