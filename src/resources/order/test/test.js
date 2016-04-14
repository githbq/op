define(function( require , exports , module ){

	var Invoice = require('../widget/invoice/invoice');
	var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');
	var InvoiceInfo = require('../widget/invoicedetail/invoiceinfo');



	exports.init = function(){

		var $el = exports.$el;

		var invoicedetail = new InvoiceDetail();
		var invoiceinfo = new InvoiceInfo();
		
		$el.find('#getinfo').on('click',function(){
			invoicedetail.show();
		})
		/*
		var invoice = new Invoice( {'wrapper':$el.find('.invoicewrapper')} );

		$el.on('click #getinfo', function(){

			console.log( invoice.getInfo() );
		});
		*/
		//invoiceinfo.show();
	}
})
