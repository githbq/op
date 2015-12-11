define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var QryCmpList = require('module/query/query');

    exports.init = function() {
        var $el = exports.$el;

        var qryList = new QryCmpList( {'wrapper':$el} );
            qryList.render( true );
    }
} );