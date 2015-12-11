define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        tpl = IBSS.tpl;

    var ProductList = require('module/productlist/productlist');
    var AddEnt = require('module/addenterprise/addenterprise');


    exports.init = function() {
        var $el = exports.$el;
		
		var addEnt = new AddEnt();
		var productlist = new ProductList( {'wrapper':$el,'showAdd':true} );
		
        productlist.render();
    	productlist.on('addEnt',function( info ){
    		addEnt.show( info );
    	});

        productlist.on('ent',function( id ){
            console.log( id );
            location.hash = '#agentsupport/entpriselist/' + id;
        });
    }
    
} );

