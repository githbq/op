define( function(require, exports, module){

	var FunnelList = require('module/funnellist/funnellist');

	exports.init = function(){
		var $el = exports.$el;

		var funnelList = new FunnelList( {'wrapper':$el} );
		funnelList.render();
	}
});
