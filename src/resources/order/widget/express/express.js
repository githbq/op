/**
 * 
 * 快递模块
 */
define(function(require, exports, module){

	var contentStr = require('./express.html');
	var Dialog = require('common/widget/dialog/dialog');

	var ExpressInfo = MClass( Dialog ).include({
		init: function(){
			ExpressInfo.__super__.init.apply( this, arguments );
		}
	})

	module.exports = ExpressInfo;

});