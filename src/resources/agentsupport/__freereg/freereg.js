define(function( require , exports , module ){

	var AddEnt = require('module/enterprisereg/enterprisereg');

	exports.init = function( param ){
		var $el = exports.$el;
		param = param || [];
		
		var isLink = false;
		if( param[0] == 'link'){
			isLink = true;
		}

		var addEnt = new AddEnt( {'wrapper':$el, 'isLink':isLink} );
		addEnt.render();
	}
})
