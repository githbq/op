define(function (require, exports, module) {

    var index = require('./index.js');
    var IndexPageDataClass = index.PageDataClass;
    var IndexPageClass = index.PageClass;


    var PageClass = MClass(IndexPageClass).include({
        selector:'#tableinfo',
        init:function(){
            var me=this;
            PageClass.__super__.init.apply( this, arguments );
        }

    });
    module.exports = PageClass;
});