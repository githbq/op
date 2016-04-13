//hubq

define(function (require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');

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
            'click .toggle b': 'switchEve'
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
                'success': function( data ){
                    if( data.success ){
                        console.warn( data );
                        me.pagination.setTotalSize( data.value.model.pageCount );
                        if( data.value.model.content.length > 0 ){
                            me.list.reload( data.value.model.content );
                        } else {
                            me.$('tbody').html("<tr><td colspan='12'><p class='info'>暂无数据</p></td></tr>")
                        }
                    }
                }
            });
        }
    });

    exports.init = function ( param ) {
        var $el = exports.$el;

       var invoiceApplyAgent = new InvoiceApplyAgent( {'view':$el.find('.m-invoiceapplyagent')} )
    }
});