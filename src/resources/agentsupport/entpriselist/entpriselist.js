define(function(require, exports, module) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
    var Slider = require('common/widget/slider/slider');
    var EntDetail = require('module/enterprisedetail/enterprisedetail');        //企业详情Slider
    var EntTrace = require('module/enttrace/enttrace');                         //企业跟踪记录
    var uploader = require('common/widget/upload').uploader;                    //
    var InputHandler = require('common/widget/input-handler/inputhandler');     //
    var Select = require('common/widget/select/select');                        //
    var CustomHelper = require('../../order/widget/customhelper/customhelper'); //

    var tem = $( require('./template.html') );

    var Clue = require('module/readclue/readclue');

    var EntList = require('module/enterpriselist/enterpriselist');

    exports.init = function(param) {
        var $el = exports.$el;

        //企业列表
        var entList = new EntList({ 'productId': param && param[0] ,'wrapper': $el});

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

        enterpriseAssign.on('success', function() {
            entList.getList();
        });

        //刷新列表
        /*
        entDetail.on('refresh', function() {
            entList.getList();
        });
        */

        //增购办公
        entList.on('zengbangong', function(id, account) {
            console.log('zengbangong');
            console.log(id);
            location.hash = "order/newmarketying/addOffice/" + id + '/' + account;
        });
        //增购营销
        entList.on('zengyingxiao', function(id, account) {
            console.log('zengyingxiao');
            console.log(id);
            location.hash = "order/newmarketying/addMarkey/" + id + '/' + account;
        });
        //续费办公
        entList.on('renewbangong', function(id, account) {
            console.log('renewbangong');
            console.log(id);
            location.hash = "order/newmarketying/againOffice/" + id + '/' + account;
        });
        //续费营销
        entList.on('renewyingxiao', function(id, account) {
            console.log('renewyingxiao');
            console.log(id);
            location.hash = "order/newmarketying/againMarkey/" + id + '/' + account;
        });
        //联合跟进人
        entList.on('orderCustom', function(options) {

            customHelper = new CustomHelper();
            customHelper.show(options);
        });
        //线索
        entList.on('clue', function( clueID ){
            clue.show(clueID);
        })
    }
});
