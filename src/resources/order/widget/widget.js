define( function( require, exports, module ) {

    var TerminalInfo=require('./productinfo/terminalinfo');
    var TableInfo=require('./productinfo/tableinfo');
    var FormInfo=require('./productinfo/forminfo');


    var PageClass=MClass(M.Center).include({





    });

    exports.init = function() {
        var $el = exports.$el;
        var terminalInfo=new TerminalInfo({view:$el.find('.panel1')});
        var tableInfo=new TableInfo({view:$el.find('.panel2')});
        var formInfo=new FormInfo({view:$el.find('.panel3')});
    }
} );









