define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TplEvent = IBSS.tplEvent;

    var Pagination = require('common/widget/pagination/pagination');
    //var Slider = require('common/widget/slider/slider');
    var DetailApproval = require('../detailapproval/detailapproval');
	var DetailPayment = require('../detailpayment/detailpayment');
	var CustomHelper = require('../widget/customhelper/customhelper');
	var BackMoney = require('../backmoney/backmoney');
	var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');

    var tem = $( require('./template.html') );

    var statusMap = {},industryMap = {},sourceMap = {};

    var statusAry = ['','待审核','已撤回','被驳回','已通过','申请退款','退款成功','退款驳回','退款撤回'];
	var isPayUpAry = ['——','已付清','未付清'];
    var payStatusAry = ['','全款','分期','未付'];
    var orderTypeAry = ['','办公版新购-普通','办公版新购-特批','营销版新购-普通','营销版新购-特批','办公版增购-普通',
                        '办公版增购-特批','营销版增购-普通','营销版增购-特批','办公版续费-普通','办公版续费-特批',
                        '营销版续费-普通','营销版续费-特批','关联自注册办公版-普通','关联自注册办公版-特批',
                        '关联自注册营销版-普通','关联自注册营销版-特批','收尾款'
                        ];
   /**
    *
    * 代理商用户
    * 备案企业列表
    */
    var OrderList = MClass( M.Center ).include({

    	init: function(){
    		OrderList.__super__.init.apply( this,arguments );

            var me = this;
    	    
            me.$putStartTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});
            me.$putEndTime.datetimepicker({'timepicker': false,'format':'Y/m/d'});
			
			me.$putStartTime.val( util.getDateStr(-30) );
            me.$putEndTime.val( util.getDateStr(1) );

            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function(){
                me.getList();
            };

            me.collection = new M.Collection;
            me.collection.on('reload',function(){
                me.renderList();
            });

            //me.getEnums();
			me.searchEve();
        },
        trTpl: _.template( tem.filter('#orderList').html() ),
        events: {
			'click .search':'searchEve',
            'click .order-detail':'orderDetailEve',
			'click .receive-money':'receiveMoneyEve',
			'click .order-detailPay':'orderDetailPayEve',
			'click .order-del':'orderDelEve',
			'click .exportOrder':'exportEve',
			'click .order-custom':'orderCustomEve',
			'click .order-backmoney':'orderBackmoneyEve',
			'click .order-invoice':'orderInvoiceEve'
        },
        elements:{
            'tbody': 'tbody',
            '.putStartTime': 'putStartTime',
            '.putEndTime': 'putEndTime'
        },

        searchEve: function(e){
            this.pagination.setPage( 0,false );
            this.getList();
        },
        //查看详情
       orderDetailEve:function( e ){
           var me = this;

           var id = $(e.currentTarget).attr('data-id');
           var enterpriseId = $(e.currentTarget).attr('data-enterpriseId');
           var orderType = $(e.currentTarget).attr('data-orderType');
           var opinion = $(e.currentTarget).attr('data-opinion');
           var isTp = $(e.currentTarget).attr('data-isTp');
           var ea = $(e.currentTarget).attr('data-ea');
		   
           me.trigger('orderDetail',{ 'id' :id ,'enterpriseId':enterpriseId, 'editFlag':false,'orderType':orderType,
               'person':'', 'opinion':opinion ,'isTp':isTp,'state':'','ea':ea,'processInstanceId':''} );
       },
	   //查看收尾款详情：
	   orderDetailPayEve:function( e ){
		   var me = this;

           var id = $(e.currentTarget).attr('data-id');
           var enterpriseId = $(e.currentTarget).attr('data-enterpriseId');
           var orderType = $(e.currentTarget).attr('data-orderType');
           var opinion = $(e.currentTarget).attr('data-opinion');
           var isTp = $(e.currentTarget).attr('data-isTp');
           var ea = $(e.currentTarget).attr('data-ea');
		   var contractNo = $(e.currentTarget).attr('data-contractNo');
		   
           me.trigger('orderDetailPayment',{ 'id' :id ,'enterpriseId':enterpriseId, 'editFlag':false,'orderType':orderType,
               'person':'', 'opinion':opinion ,'isTp':isTp,'state':'','ea':ea,'processInstanceId':'','contractNo':contractNo} );
	   },
	   //联合跟进人
	   orderCustomEve:function( e ){
		   var me = this;
		   var enterpriseId = $(e.currentTarget).attr('data-enterpriseId');
		   me.trigger('orderCustom',{'enterpriseId':enterpriseId});
	   },
	   //退款
	   orderBackmoneyEve:function( e ){
		   var me = this;
		   
		   var enterpriseId = $(e.currentTarget).attr('data-enterpriseId');
		   var id = $(e.currentTarget).attr('data-id');
           var enterpriseId = $(e.currentTarget).attr('data-enterpriseId');
           var orderType = $(e.currentTarget).attr('data-orderType');
           var opinion = $(e.currentTarget).attr('data-opinion');
           var isTp = $(e.currentTarget).attr('data-isTp');
           var ea = $(e.currentTarget).attr('data-ea');
		   var contractNo = $(e.currentTarget).attr('data-contractNo');
		   
           me.trigger('orderBackmoney',{ 'id' :id ,'enterpriseId':enterpriseId, 'editFlag':true,'orderType':orderType,
               'person':'', 'opinion':opinion ,'isTp':isTp,'state':'','ea':ea,'processInstanceId':'','contractNo':contractNo,'newFirst':'newFirst'} );
		   
	   },
	   //发票
	   orderInvoiceEve:function( e ){
		   var me = this;
		   
		   var id = $(e.currentTarget).attr('data-id');
         
		   
           me.trigger('orderInvoice', id );
		   
	   },
	   //收尾款
	   receiveMoneyEve:function( e ){
		   var me = this;
		   var id = $(e.currentTarget).attr('data-id')||'';
		   var enterpriseId = $(e.currentTarget).attr('data-enterpriseId')||'';
           var orderType = $(e.currentTarget).attr('data-orderType')||'';
           var opinion = '';
           var isTp = $(e.currentTarget).attr('data-isTp')||'';
           var ea = $(e.currentTarget).attr('data-ea')||'';
		   var contractNo = $(e.currentTarget).attr('data-contractNo')||'';
		  
           location.hash = '#order/payment/'+id+'/'+enterpriseId+'/'+orderType+'/'+opinion+'/'+isTp+'/'+ea+'/'+contractNo;
	   },
	   /**
		 * 删除订单
		 * @param request
		 * @param orderId  订单id
		 * @return
		*/
	   //删除自订单
	   orderDelEve:function(e){
		   var me = this;
		   var id = $(e.currentTarget).attr('data-id');
		   var bool = confirm('确定要删除该订单吗?');
		   if(bool){
			    util.api({
					'url':'/odr/deleteOrder',
					'data':{
						'orderId':id
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
						   util.showTip('订单删除成功！')
						   me.searchEve();
						}
					}
				});
		   }
	   },
        //导出excel
        exportEve: function(e){
            var me = this;

            var putStartTime = '',
                putEndTime = '';

            if( me.$putStartTime.val() ){
                putStartTime = new Date( me.$putStartTime.val() ).getTime();
            }
            if( me.$putEndTime.val() ){
                putEndTime = new Date( me.$putEndTime.val() ).getTime();
            }

            var queryData = {
                'orderId':  me.model.get('orderId'),
                'contractNo': me.model.get('contractNo'),
                'en': me.model.get('en'),
                'ea': me.model.get('ea'),
				'orderType': me.model.get('orderType'),
				'account': me.model.get('account'),
				'isTp': me.model.get('isTp'),
				'approveStatus': me.model.get('approveStatus'),
				'payStatus': me.model.get('payStatus'),
				'agent': me.model.get('agent'),
				'isPayUp':me.model.get('isPayUp'),
				'agentId': me.model.get('agentId'),
                'putStartTime': putStartTime,
                'putEndTime': putEndTime
				
            }
            
            window.open( IBSS.API_PATH + '/odr/exportOrder?' + $.param( queryData ) );
        },

        //获取备案企业列表
        getList: function(){
            var me = this;

            
            var putStartTime = '',
                putEndTime = '';

            if( me.$putStartTime.val() ){
                putStartTime = new Date( me.$putStartTime.val() ).getTime();
            }
            if( me.$putEndTime.val() ){
                putEndTime = new Date( me.$putEndTime.val() ).getTime();
            }

            var queryData = {
                'orderId':  me.model.get('orderId'),
                'contractNo': me.model.get('contractNo'),
                'en': me.model.get('en'),
                'ea': me.model.get('ea'),
				'orderType': me.model.get('orderType'),
				'account': me.model.get('account'),
				'isTp': me.model.get('isTp'),
				'approveStatus': me.model.get('approveStatus'),
				'payStatus': me.model.get('payStatus'),
				'agent': me.model.get('agent'),
				'agentId': me.model.get('agentId'),
                'putStartTime': putStartTime,
				'isPayUp':me.model.get('isPayUp'),
                'putEndTime': putEndTime,
				'hasProduct':me.model.get('hasProduct'),
				'pageIndex': me.pagination.attr['pageNumber']+1,
                'pageSize': me.pagination.attr['pageSize']
            }
            htmlStr = "<tr> <td colspan='14'><p class='info'>加载中...</p></td> </tr>"
            me.$tbody.html( htmlStr );
            util.api({
                'url':'/odr/querypage',
                'data':queryData,
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.collection.reload( data.value.model.content, function( item ){
							var approveStatus = item.approveStatus ? parseInt(item.approveStatus):0;
							//var approveStatus = item.approveStatus ? parseInt(item.approveStatus):0;
                            item.statusStr = statusAry[approveStatus] ;
                            item.payStatusStr = item.order.payStatus ? payStatusAry[item.order.payStatus] :'';
							item.isPayUpAryStr = item.order.isPayUp ? isPayUpAry[item.order.isPayUp]:'——';
							if(item.order.orderType==17){
								item.isPayUpAryStr = '——';
							}
                            item.createTimeStr = new Date( item.order.createTime )._format('yyyy/MM/dd');
                            item.orderTypeStr = orderTypeAry[item.order.orderType];

                        });

                        me.pagination.setTotalSize( data.value.model.itemCount );
                    }
                }
            })
        },

        //渲染列表
        renderList: function(){
            var me = this;
            var collection = me.collection.all();
            var htmlStr = '';

            if( collection.length > 0 ){
                htmlStr = me.trTpl( {'content': collection} );
            }else{
                htmlStr = "<tr> <td colspan='14'><p class='info'>暂无数据</p></td> </tr>"
            }

            me.$tbody.html( htmlStr );
            TplEvent.setPermissions( me.$tbody );
        }
    })

    exports.init = function() {
        var $el = exports.$el;

        var orderList = new OrderList( {'view': $el.find('.m-orderlist')} );
        var detailApproval = null;
		var detailPayment = null;
		var customHelper = null;
		var backMoney = null, invioceDetail = null;
		
        orderList.on('orderDetail', function( options ){
            detailApproval = new DetailApproval();
            detailApproval.show( options );
        });
		 orderList.on('orderDetailPayment', function( options ){
            detailPayment = new DetailPayment();
            detailPayment.show( options );
        });
		
		orderList.on('orderCustom', function( options ){
            customHelper = new CustomHelper();
            customHelper.show( options );
        });
		
		orderList.on('orderBackmoney', function( options ){
            backMoney = new BackMoney();
            backMoney.show( options );
        })
		orderList.on('orderInvoice', function( id ){
            invioceDetail = new InvoiceDetail();
            invioceDetail.show( id );
        });

    }
} );

