define( function( require, exports, module ) {
    var IBSS = window.IBSS,TPL = IBSS.tpl;

    exports.init = function() {
        var $el = exports.$el;
        
        $el.on('click','.export',function(){
            location.href="/op/api/s/query/export/agentaccounts";
        })

    }
} );
