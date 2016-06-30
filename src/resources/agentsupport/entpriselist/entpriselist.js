define(function(require, exports, module) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var EntDetail = require('module/enterprisedetail/enterprisedetail');        //企业详情Slider
    var EntTrace = require('module/enttrace/enttrace');                         //企业跟踪记录
    var CustomHelper = require('../../order/widget/customhelper/customhelper'); //联合跟进人

    var tem = $( require('./template.html') );

    var Clue = require('module/readclue/readclue');

    var EntList = require('module/enterpriselist/enterpriselist');

    exports.init = function(param) {
        var $el = exports.$el;

        //企业列表
        var entList = new EntList({ 'productId': param && param[0] ,'wrapper': $el , 'state': 'agent'});

        entList.render();
        //企业详情
        //var entDetail = new EntDetail({ 'isAgent': true });

        var customHelper = null;

        //企业跟踪记录
        var entTrace = new EntTrace();

        //线索
        var clue = new Clue()

        //企业详情
        entList.on('detail', function(id) {
            entDetail.show(id);
        });

        //企业跟踪记录
        entList.on('trace', function(id) {

            console.warn('trace');
            console.warn(id);
            entTrace.show(id);
        });
        
        //刷新列表
        /*
        entDetail.on('refresh', function() {
            entList.getList();
        });
        */
        
        //联合跟进人
        entList.on('orderCustom', function(options) {

            console.log('orderCustom');
            customHelper = new CustomHelper();
            customHelper.show(options);
        });
        //线索
        entList.on('clue', function( clueID ){
            console.log('clue clue');
            clue.show(clueID);
        });
        //增购续费
        entList.on('renew',function( id, entaccount ){
            location.hash = "/order/openenterprise/"+id+"/"+entaccount;
        });
    }
});
