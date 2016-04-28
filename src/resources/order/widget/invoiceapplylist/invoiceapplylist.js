//
define(function (require, exports, module) {

    var Pagination = require('common/widget/pagination/pagination');
    var template = require('./invoiceapplylist.html');

    //付费状态map
    var PayStatusMap = {
        '1': '全款',
        '2': '分期',
        '3': '未付'
    };

    //发票类型
    var InvoiceTypeMap = {
        '1':'普通增值税发票',
        '2':'增值税专用发票'
    }

    //发票性质
    var InvoicePropMap = {
        '1':'到款开票',
        '2':'预开发票'
    }

    //代理商发票申请列表
    var InvoiceApplyList = MClass( M.Center ).include({
        
        view: template,

        init: function(){
            InvoiceApplyList.__super__.init.apply( this, arguments );
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

            if( me.attrs.wrapper ){
                me.attrs.wrapper.html( me.$view );
            }

            console.log( me.attrs.state );
            me.refresh();
        },

        //
        //  第一层 根据当前模块状态 相应元素显示
        //  第二层 根据当前内部状态 进行显隐控制
        //  
        setState: function(){
            var me = this;

            me.$('[data-state]').hide();

            me.$('[data-state="' + me.attrs.state + '"]').show();
            
            var currentType = me.$('.toggle b.active').attr('data-type');
            if( currentType == "end" ){
                me.$('.expressdetail').show();
            } else {
                me.$('.expressdetail').hide();
            }
        },

        events:{
            'click .toggle b': 'switchEve',
            'click .btn-search': 'searchEve',
            'click .detail': 'detailEve',
            'click .expressdetail': 'expressDetailEve',
            'click .revoke': 'revokeEve'
        },
        
        switchEve: function( e ){

            console.log('switchEve');

            $( e.currentTarget ).addClass('active').siblings().removeClass('active');
            this.pagination.setPage(0,false);

            this.refresh( );
        },

        //搜寻列表
        searchEve: function(){
            this.pagination.setPage(0,false);
            this.refresh();
        },
		jumpEve:function(jump){
			var me = this;
			me.$view.find('.toggle b[data-type="'+jump+'"]').trigger("click");
			me.refresh('refuse');
		},

        //查看发票详情
        detailEve: function( e ){
            var me = this;

            var inid = $( e.currentTarget ).attr('data-inid');

            var info = me.list.find('invoiceId',inid);
            console.log( info );

            var type = me.$('.toggle b.active').attr('data-type');
            var typestatus;

            switch( type ){
                
                //待审核发票列表
                case 'wait':
                    typestatus = 1;
                    break;
                //已审核发票列表
                case 'end':
                    typestatus = 2;
                    break;
                //被驳回审核发票列表
                case 'refuse':
                    typestatus = 3;
                    break;
                default:
                    break;
            }


            me.trigger('detail' , info.orderId , inid , info.approvalStatus , info , typestatus );
        },

        //快递详情
        expressDetailEve: function( e ){
            var me = this;

            var inid = $( e.currentTarget ).attr('data-inid');

            me.trigger( 'expressdetail', inid , me.attrs.state );
        },

        //信息撤回
        revokeEve: function( e ){
            var me = this;

            var $target = $( e.currentTarget );
            var insid = $target.attr('data-insid');

            var bool = confirm("是否确认撤销此条审批?");

            if( bool ){
                util.api({
                    'url': '~/op/api/approval/withdrawapproval',
                    'data':{
                        'processInstanceId': insid
                    },
                    'success': function( data ){
                        console.warn( data );
                        if( data.success ){
                            util.showTip('撤销成功');
                            me.refresh();
                        }
                    }
                });
            }
        },

        //刷新审批列表
        refresh: function( param ){
        	var me = this;
            
			if( param ){
				var type = param;
			}else{
				 var type = me.$('.toggle b.active').attr('data-type');
			}
           
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

            //提单日期开始
            if( me.$('#startTime').val() ){
                applyDateStart = new Date( me.$('#startTime').val() ).getTime();
            }

            //提单日期结束
            if( me.$('#endTime').val() ){
                applyDateEnd = new Date( me.$('#endTime').val() ).getTime();
            }


            var data = me.model.all();
            data.pageIndex = me.pagination.attr['pageNumber']; 
            data.pageSize = me.pagination.attr['pageSize'];
            data.applyDateStart = applyDateStart;
            data.applyDateEnd = applyDateEnd;

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
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        if( data.value.model.content.length > 0 ){
                            me.list.reload( data.value.model.content , function( item ){
                                item.payStatusStr = PayStatusMap[item.payStatus];
                                item.invoiceTypeStr = InvoiceTypeMap[item.invoiceType];
                                item.invoicePropStr = InvoicePropMap[item.invoiceProp];
                                item.applyTimeStr = new Date( item.applyTime )._format('yyyy/MM/dd hh:mm:ss');
                            });
                            me.setState();
                        } else {
                            me.$('tbody').html("<tr><td colspan='12'><p class='info'>暂无数据</p></td></tr>");
                        }
                    }
                }
            });
        }
    });
	
	module.exports = InvoiceApplyList;
});


