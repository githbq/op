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
    	show: function(data,type){
    		var me = this;
    		FinanceDetail.__super__.show.apply( this, arguments );

    		detail.show( type,{ $view: me.$view ,data:data },function( result ){
    			result.instance.on('close',function( boo ){
    				me.hide();
    			})
    		} );
    	},
    	hide: function(){
    		var me = this;
    		FinanceDetail.__super__.hide.apply( this, arguments );
    	}
    });

    exports.init = function ( param ) {
        var $el = exports.$el;

        var invoiceApplyList = new InvoiceApplyList( {'wrapper':$el ,'state':'finance'} );
        var financeDetail = new FinanceDetail();

        invoiceApplyList.on('detail',function( orderId, inid , approvalStatus ,info ,type){
            financeDetail.show(info,type);
        });
    }
});