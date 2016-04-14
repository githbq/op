//hubq

define(function (require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');
    var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');

    //付费状态map
    var PayStatusMap = {
        '1': '分期',
        '2': '未付',
        '3': '全款'
    };

    //发票类型
    var InvoiceTypeMap = {
        '1':'普通增值税发票',
        '2':'增值税专用发票'
    }

    //发票性质
    var InvoicePropMap = {
        '1':'到款发票',
        '2':'预开发票'
    }

    //代理商发票申请列表
    var InvoiceApplyAgent = MClass( M.Center ).include({
        
        init: function(){
            InvoiceApplyAgent.__super__.init.apply( this, arguments );
            var me = this;
            
            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function(){
                me.refresh();
            }

            me.refresh();
        },
        events:{
            'click .toggle b': 'switchEve',
            'click .btn-search': 'searchEve',
            'click .detail': 'detailEve'
        },
        switchEve: function( e ){

            console.log('switchEve');

            $( e.currentTarget ).addClass('active').siblings().removeClass('active');
            this.refresh();
        },

        //搜寻列表
        searchEve: function(){
            this.pagination.setPage(0,false);
            this.refresh();
        },

        //查看发票详情
        detailEve: function(e){
            var me = this;

            var inid = $(e.currentTarget).attr('data-inid');

            var info = me.list.find('invoiceId',inid);
            console.log( info );

            me.trigger('detail' , info.orderId , inid , info.approvalStatus );
        },

        //刷新审批列表
        refresh: function(){
        	var me = this;
            
            var type = me.$('.toggle b.active').attr('data-type');
            var url;

            switch( type ){
                
                //待审核发票列表
                case 'wait':
                    url = '/odr/invoice/approval/todoList';
                    break;
                //已审核发票列表
                case 'end':
                    url = '/odr/invoice/approval/doneList';
                    break;
                //被驳回审核发票列表
                case 'refuse':
                    url = '/odr/invoice/approval/returnList';
                    break;
                default:
                    break;
            }

            var applyDateStart = '';
            var applyDateEnd = '';

            var data = me.model.all();
            data.pageIndex = me.pagination.attr['pageNumber']; 
            data.pageSize = me.pagination.attr['pageSize'];
            data.applyDateStart = applyDateStart;
            data.applyDateEnd =  applyDateEnd;

            //刷新审批列表
            util.api({
                'url': url,
                'data': data,
                'beforeSend': function( data ){
                    me.$('tbody').html("<tr><td colspan='12'><p class='info'>加载中......</p></td></tr>");
                },
                'success': function( data ){
                    if( data.success ){
                        console.warn( data );
                        me.pagination.setTotalSize( data.value.model.pageCount );
                        if( data.value.model.content.length > 0 ){
                            me.list.reload( data.value.model.content , function( item ){
                                item.payStatusStr = PayStatusMap[item.payStatus];
                                item.invoiceTypeStr = InvoiceTypeMap[item.invoiceType];
                                item.invoicePropStr = InvoicePropMap[item.invoiceProp];
                            });
                        } else {
                            me.$('tbody').html("<tr><td colspan='12'><p class='info'>暂无数据</p></td></tr>");
                        }
                    }
                }
            });
        }
    });

    exports.init = function ( param ) {
        var $el = exports.$el;

        var invoiceApplyAgent = new InvoiceApplyAgent( {'view':$el.find('.m-invoiceapplyagent')} );

        //发票模块
        var invoiceDetail = new InvoiceDetail();

        invoiceApplyAgent.on('detail',function( orderId, inid , approvalStatus ){
            invoiceDetail.show( orderId, inid, approvalStatus );
        })
    }
});