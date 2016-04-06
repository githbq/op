define(function( require , exports , module ){

	var Invoice = require('../widget/invoice/invoice');
	var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');

	exports.init = function(){

		var $el = exports.$el;

		
		var invoice = new Invoice( {'wrapper':$el.find('.invoicewrapper')} );

		$el.on('click #getinfo', function(){

			console.log( invoice.getInfo() );
		});
	}
})
