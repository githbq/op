define(function( require , exports , module ){

	var BindEntInfo = require('module/bindentinfo/bindentinfo');
	exports.init = function( param ){
		var $el = exports.$el;
		param = param || [];
		console.log(param)
		if(param.length<2){
			return false;
		}
		
		var bindEntInfo = new BindEntInfo( {'wrapper':$el,'entId':param[0],'entAccount':param[1]} );
		
		bindEntInfo.render();
	}
})
