//hubq

define(function (require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');
    var InvoiceApplyList = require('../widget/invoiceapplylist/invoiceapplylist');
    var Slider = require('common/widget/slider/slider');
    var detail = require('../widget/invoiceapplydetail/invoiceapplydetail');
    var ExpressDetail = require('../widget/express/express');



    var FinanceDetail = MClass( Slider ).include({
        content:"<div style='padding:20px;overflow:auto;' id='content'></div>",
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

    		detail.show( type,{ $view: me.$view.find('#content') ,data:data },function( result ){
    			result.instance.on('doClose',function( boo ){
                    me.trigger('editsuccess');
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

        var invoiceApplyList = new InvoiceApplyList( {'wrapper':$el ,'state':'finance'} );  //发票审批列表
        var financeDetail = new FinanceDetail();   //发票详情
        var expressDetail = new ExpressDetail({'state':'finance'});   //快递详情        
		invoiceApplyList.refresh();
        invoiceApplyList.on('detail',function( orderId, inid , approvalStatus ,info ,type){

            if( type == 2 && info.notRefundStatus == false ){
                type = 4;
            }

            financeDetail.show(info,type);
        });

        financeDetail.on('editsuccess',function(){
            invoiceApplyList.refresh();
        });

        //
        invoiceApplyList.on('expressdetail',function( id ){
            expressDetail.show( id );
        })
    }
});