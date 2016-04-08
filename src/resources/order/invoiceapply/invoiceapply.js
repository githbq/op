define(function(require,exports,module){


	var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');

	exports.init = function( params ){
		var $el = exports.$el;

		var invoiceDetail = new InvoiceDetail({'wrapper':$el})
	} 
});