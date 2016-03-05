define(function (require, exports, module) {

    var TerminalInfo = require('./terminalinfo');
    var TableInfo = require('./tableinfo');
    var FormInfo = require('./forminfo');
    var terminalDataItems = require('./dataitems/terminaldataitems');
    var tableDataItems = require('./dataitems/tabledataitems');
    var formDataItems = require('./dataitems/formdataitems');
//{terminalInfo:{$view:xx,dataItems},tableInfo:{$view:xx,dataItems},formInfo:{$view:xx,dataItems},}
    exports.showProductInfo = function (data) {
        var terminalInfo,tableInfo,formInfo=null;
        if(data.terminalInfo &&data.terminalInfo.$view){
           terminalInfo = new TerminalInfo({view:data.terminalInfo.$view, dataItems: data.terminalInfo.dataItems||terminalDataItems});
        }
        if(data.tableInfo &&data.tableInfo.$view){
            tableInfo = new TableInfo({view:data.tableInfo.$view, dataItems: data.tableInfo.dataItems||tableDataItems});
        }
        if(data.formInfo &&data.formInfo.$view){
            formInfo = new FormInfo({view:data.formInfo.$view, dataItems: data.formInfo.dataItems||formDataItems});
        }
        return {terminalInfo:terminalInfo,tableInfo:tableInfo,formInfo:formInfo};
    }
});









