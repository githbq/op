define( function(require, exports, module){

	var FunnelList = require('module/funneladdlist/funneladdlist');

	exports.init = function(){
		var $el = exports.$el;

		var funnelList = new FunnelList( { 'wrapper':$el, 'state':'agentsupport' } );
		funnelList.render();
	}
});
