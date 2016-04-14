define(function( require , exports , module ){

	var Invoice = require('../widget/invoice/invoice');
	var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');
	var InvoiceInfo = require('../widget/invoicedetail/invoiceinfo');
	var Express = require('../widget/express/express');



	exports.init = function(){

		var $el = exports.$el;

		var invoicedetail = new InvoiceDetail();
		var invoiceinfo = new InvoiceInfo();
		var express = new Express();
		
		$el.find('#getinfo').on('click',function(){
			invoicedetail.show();
		});

		$el.find('#express').on('click',function(){
			express.show();
		});
		/*
		var invoice = new Invoice( {'wrapper':$el.find('.invoicewrapper')} );

		$el.on('click #getinfo', function(){

			console.log( invoice.getInfo() );
		});
		*/
		//invoiceinfo.show();
	}
})
