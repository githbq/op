define(function( require, exports , module ){

	var AddEnt = require('module/addenterprisebakk/addenterprise');

	exports.init = function( param ){
		var $el = exports.$el;
		param = param || [];

		var isLink = false;
		if( param[0] == 'link'){
			isLink = true;
		}

		var addEnt = new AddEnt( {'wrapper':$el,'isPay':true , 'isLink':isLink} );
		addEnt.render();
	}
})


