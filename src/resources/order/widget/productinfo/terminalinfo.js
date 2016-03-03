define(function (require, exports, module) {

    var index = require('./index.js');
    var IndexPageDataClass = index.PageDataClass;
    var IndexPageClass = index.PageClass;


    var PageClass = MClass(IndexPageClass).include({
        selector:'#terminalinfo',
        init:function(){
            var me=this;
            debugger
            PageClass.__super__.init.apply( this, arguments );
        }

    });
    module.exports = PageClass;
});