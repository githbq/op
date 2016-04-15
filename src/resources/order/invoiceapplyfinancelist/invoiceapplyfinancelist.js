//hubq

define(function (require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');
    var InvoiceApplyList = require('../widget/invoiceapplylist/invoiceapplylist');
    var Slider = require('common/widget/slider/slider');
    var detail = require('../widget/invoiceapplydetail/invoiceapplydetail');


    var FinanceDetail = MClass( Slider ).include({

    	defaultAttr:{
    		'title': '发票信息',
    		'width': '600'
    	},

    	init: function(){

    		FinanceDetail.__super__.init.apply( this, arguments );
    	},
    	show: function(data){
    		var me = this;


    		detail.show( 1,{ $view: me.$view ,data:data },function( result ){
    			result.instance.on('close',function( boo ){
    				me.hide();
    			})
    		} );
    	}
    });

    exports.init = function ( param ) {
        var $el = exports.$el;

        var invoiceApplyList = new InvoiceApplyList( {'wrapper':$el ,'state':'finance'} );
        var financeDetail = new FinanceDetail();

        invoiceApplyList.on('detail',function( orderId, inid , approvalStatus ,info ){
            financeDetail.show(info);
        });
    }
});