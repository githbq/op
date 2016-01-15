define(function( require , exports , module ){

	var BindEntInfo = require('module/bindentinfo/bindentinfo');
	exports.init = function( param ){
		var $el = exports.$el;
		param = param || [];
		
		var bindEntInfo = new BindEntInfo( {'wrapper':$el} );
		
		bindEntInfo.render();
	}
})
