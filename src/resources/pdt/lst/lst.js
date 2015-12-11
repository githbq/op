define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
    var ProductList = require('module/productlist/productlist');

    exports.init = function() {
        var $el = exports.$el;
        
        var productlist = new ProductList( {'wrapper':$el} );
        productlist.render();
        productlist.on( 'ent',function( id ){
        	location.hash = "#ent/lst/p"+id;
        })
    }

} );