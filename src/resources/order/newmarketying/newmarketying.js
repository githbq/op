define( function( require, exports, module ) {
    var IBSS = window.IBSS;

    var tpl = $( require( './template.html' ) );
	var BasicInfo = require('../widget/basicinfo/basicinfo');

    var NewMarketing = MClass( M.Center ).include( {
        
        elements: {
            
        },
        events: {
 
        },
        init: function() {
            NewMarketing.__super__.init.apply( this, arguments );
            var me = this;
			//me.$view.find('.list-pager')
           me.attrs.commonMarkey = new BasicInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':'common'} );
        }
    } );

    exports.init = function() {
		var $el = exports.$el;
		
        var newMarketing = new NewMarketing( { 'view':$el} );
		
    }
} );