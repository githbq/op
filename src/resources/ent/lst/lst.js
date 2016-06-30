define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
    
    //企业列表
    var EntList = require('module/enterpriselist/enterpriselist');

    //企业详情
    var EntDetail = require('module/enterprisedetail/enterprisedetail');
    //联合跟进人
	var CustomHelper = require('../../order/widget/customhelper/customhelper');
    //企业跟踪记录
    var EntTrace = require('module/enttrace/enttrace');
    //what??
    var EmployeeDetail = require('module/employeedetail/employeedetail'); 
    //线索
    var Clue = require('module/readclue/readclue');
    
    //var entDetail;
    exports.init = function( param ) {
        var $el = exports.$el;
        
        var entList = new EntList( {'wrapper':$el,'param': param && param[0],'state':'support'} );
        entList.render();
        
        //var entDetail = new EntDetail();

        var entTrace = new EntTrace();
        
        var employeeDetail = new EmployeeDetail();

        var clue = new Clue()
		var customHelper = null;

        //查看企业详情
        entList.on('detail',function( id , status ){
            entDetail.show( id,status );
        });

        //查看跟踪记录
        entList.on('trace',function( id ){
            console.log('trace' + id);
            entTrace.show( id );
        });
		//联合跟进人
		entList.on('orderCustom',function( options ){
            console.log('联合跟进人');
            customHelper = new CustomHelper();
            customHelper.on('refresh',function(){
                entList.search();
            });
            customHelper.show( options );
        });
        //线索
        entList.on('clue', function( clueID ){
            clue.show(clueID);
        })
		//增购续费
        entList.on('renew',function( id , entaccount ){
            location.hash = "/order/openenterprise/"+ id + "/" + entaccount;
        });
		//刷新列表
        /*
        entDetail.on('refresh',function(){
            entList.search();
        });
        */
        /*
        entDetail.on('employeeDetail',function(ea,phone){
            employeeDetail.show(ea,phone);
        });
        */
    }
} );
