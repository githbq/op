/**
 * 
 * 快递模块
 */
define(function(require, exports, module){

	var contentStr = require('./express.html');
	var Dialog = require('common/widget/dialog/dialog');

	//快递详情
	var ExpressInfo = MClass( Dialog ).include({

		content: contentStr,
		
		defaultAttr:{
			'title': '快递信息',
			'width': '400'
		},

		init: function(){
			ExpressInfo.__super__.init.apply( this, arguments );
		},

		show: function( id ){
			var me = this;
			ExpressInfo.__super__.show.apply( this, arguments );
		
			console.log( id );
		}
	})

	module.exports = ExpressInfo;

});
