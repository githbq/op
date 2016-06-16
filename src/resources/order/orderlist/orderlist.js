define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TplEvent = IBSS.tplEvent;

    var Pagination = require('common/widget/pagination/pagination');
    var Dialog = require('common/widget/dialog/dialog');

    //var Slider = require('common/widget/slider/slider');
    var ENUMDATA = require('module/data/data');
    
    var DetailApproval = require('../detailapproval/detailapproval');
	var DetailPayment = require('../detailpayment/detailpayment');

	var CustomHelper = require('../widget/customhelper/customhelper');     //联合跟进人
    var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');  //发票
    var BackMoney = require('../backmoney/backmoney');                     //退款
	
	var OnlinePay = require('../widget/onlinepay/onlinepay');

    var tem = $( require('./template.html') );

    //到款认领
    var Claim = MClass( Dialog ).include({

        defaultAttr:{
            'title': '到款认领',
            'width': 500
        },

        events: {
            'click .action-claim': 'claimEve',
            'click .action-rematch': 'rematchEve'
        },

        content: tem.filter('#claim').html(),

        init: function(){
            Claim.__super__.init.apply( this, arguments );
        },
        show: function(){
            Claim.__super__.show.apply( this, arguments );
        },
        hide: function(){
            Claim.__super__.hide.apply( this, arguments );
        },
        //认领
        claimEve: function(){
            console.log('认领');
        },
        //重新匹配
        rematchEve: function(){
            console.log('重新匹配');
        }
    });


    //
    // 订单列表
    // 
    var OrderList = MClass( M.Center ).include({
        //初始化
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
            //me.getEnums();
			me.searchEve();

            me.resetSelect("ordermap");
            me.resetSelect("paystatus");
            me.resetSelect("apptype");
            me.resetSelect("orderstatus");
        },
        //重置select
        resetSelect: function( name ){

            var me = this;

            var ele = me.$('[name="'+name+'"]');
            var values = ENUMDATA[name];

            var nv = [{'name': '全部','value':'' }];
            for( var key in values ){
                nv.push( {'name':values[key],'value':key} );
            }

            util.resetSelect( ele, nv );
        },
        events: {
			'click .search':'searchEve',
            'click .detail-revocation': 'revocationEve',
            'click .detail-finalpay': 'finalPayEve',
            'click .detail-delete': 'deleteEve',
            'click .detail-info': 'infoEve',
            'click .detail-supplement': 'supplyEve',
            'click .detail-daokuan': 'daokuanEve',
            'click .detail-invoice': 'invoiceEve',
            'click .detail-tuikuan': 'tuikuanEve',     //退款
            'click .detail-union': 'unionEve'          //联合跟进人

            //'click .order-detail':'orderDetailEve',
			//'click .receive-money':'receiveMoneyEve',
			//'click .order-detailPay':'orderDetailPayEve',
			//'click .order-del':'orderDelEve',
			//'click .exportOrder':'exportEve',
			//'click .order-custom':'orderCustomEve',
			//'click .order-backmoney':'orderBackmoneyEve', 
			//'click .order-onlinepay':'orderOnlinePay',  //查看线上支付情况
			//'click .order-invoice':'orderInvoiceEve'
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
        //撤回订单事件
        revocationEve: function(e){
            var me = this;
            var id = $(e.currentTarget).attr('data-id');
            util.api({
                'url':'/odr/withdrawOrderApproval',
                'data':{
                    'orderId': id
                },
                'success':function( data ){
                    if( data.success ){
                        util.showTip('订单撤回成功');
                        me.getList();
                    }
                }
            })
        },
        //收尾款
        finalPayEve: function(e){
            console.log('收尾款');
        },
        //收尾款
        /*
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
        */
        //删除
        deleteEve: function(e){
            console.log('删除订单');
        },
        //删除自订单
        /*
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
        */
        //查看详情
        infoEve: function(e){
            console.log('查看详情');
        },
        //查看详情
        /*
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
       */ 
        //补充合同
        supplyEve: function(e){
            console.log('补充合同');
        },
        //到款
        daokuanEve: function(e){
            console.log('到款认领');
        },
        //发票
        invoiceEve:function( e ){
            var me = this;
            var id = $(e.currentTarget).attr('data-id');
               
            me.trigger('orderInvoice', id );   
        },
        //退款
        tuikuanEve: function(e){
            var me = this;
            console.log('退款');
            var id = $(e.currentTarget).attr('data-id');
            var list = me.list.all();

            var item;
            for(var i=0; i<list.length; i++){
                if( list[i]['order']['id'] == id ){
                    item = list[i];
                    break;
                }
            }

            

            /*
            me.trigger('orderBackmoney',{ 'id' :id ,'enterpriseId':enterpriseId, 'editFlag':false,'orderType':orderType,
               'person':'', 'opinion':opinion ,'isTp':isTp,'state':'','ea':ea,'processInstanceId':'','contractNo':contractNo} );
            */
        },
        //退款
        /*
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
           var  newFirst = $(e.currentTarget).attr('data-newFirst');
           if( newFirst == 'newFirst' ){
                me.trigger('orderBackmoney',{ 'id' :id ,'enterpriseId':enterpriseId, 'editFlag':true,'orderType':orderType,
               'person':'', 'opinion':opinion ,'isTp':isTp,'state':'','ea':ea,'processInstanceId':'','contractNo':contractNo,'newFirst':'newFirst'} );
           }else{
              me.trigger('orderBackmoney',{ 'id' :id ,'enterpriseId':enterpriseId, 'editFlag':false,'orderType':orderType,
               'person':'', 'opinion':opinion ,'isTp':isTp,'state':'','ea':ea,'processInstanceId':'','contractNo':contractNo} );
           
           }
        },
        */
        //联合跟进人
        unionEve: function( e ){
            var me = this;
            console.log('联合跟进人');
            var enterpriseId = $(e.currentTarget).attr('data-entid'); 
            me.trigger('orderCustom',{'enterpriseId':enterpriseId});
        },
         //联合跟进人
        /*
        orderCustomEve:function( e ){
           var me = this;
           var enterpriseId = $(e.currentTarget).attr('data-enterpriseId');
           me.trigger('orderCustom',{'enterpriseId':enterpriseId});
        },
        */
	    //查看收尾款详情
        /*
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
	   //查看线上支付情况
	   orderOnlinePay:function( e ){
		   var me = this;

           var id = $(e.currentTarget).attr('data-id');
         
		   
           me.trigger('orderOnlinePay',{ 'id' :id } );
	   },
       */
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

        //获取订单列表
        getList: function(){
            var me = this;

            var queryData = me.model.all();


            var putStartTime = '',        //提单日期开始
                putEndTime = '';          //提单日期结束

            if( me.$putStartTime.val() ){
                putStartTime = new Date( me.$putStartTime.val() ).getTime();
            }
            if( me.$putEndTime.val() ){
                putEndTime = new Date( me.$putEndTime.val() ).getTime();
            }

            queryData.putStartTime = putStartTime;
            queryData.putEndTime = putEndTime;
            queryData.pageIndex = me.pagination.attr['pageNumber'] + 1;
            queryData.pageSize = me.pagination.attr['pageSize'];

            htmlStr = "<tr> <td colspan='14'><p class='info'>加载中...</p></td> </tr>"
            me.$tbody.html( htmlStr );
            util.api({
                'url':'/odr/querypage',
                'data':queryData,
                'success': function( data ){
                    console.warn( 'orderlist' );
                    console.warn( data );
                    if( data.success ){

                        if( data.value.model.content && data.value.model.content.length > 0 ){
                            me.list.reload( data.value.model.content, function( item ){

                                //订单类型
                                //?????
                                if( item.order.orderType == 17 ){

                                }
                                item.orderTypeStr = item.order.orderType ? ENUMDATA['ordermap'][item.order.orderType]:'';
                                //订单状态
                                item.orderStatusStr = item.order.status ? ENUMDATA['orderstatus'][item.order.status]:'';
                                //付费状态
                                item.payStatusStr = item.order.payStatus ? ENUMDATA['paystatus'][item.order.payStatus]:'';
                                //提单日期
                                item.createTimeStr = new Date( item.order.createTime )._format('yyyy/MM/dd');
                                //当前审批节点
                                item.approvalNodeStr = ENUMDATA['approvalnode'][item.order.approvalNode];
                                //到款认领状态
                                item.claimReceivedPayStatusStr = ENUMDATA['claimreceivedpaystatus'][item.claimReceivedPayStatus]
                                /*
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
                                */
                            });
                        }else{
                            me.$tbody.html("<tr> <td colspan='14'><p class='info'>暂无数据</p></td> </tr>");
                        }
                        me.pagination.setTotalSize( data.value.model.itemCount );
                    }
                }
            })
            
        }
    })

    exports.init = function() {
        var $el = exports.$el;

        var orderList = new OrderList( {'view': $el.find('.m-orderlist')} );
        var detailApproval = null;
		var detailPayment = null;
		var customHelper = null;
		var backMoney = null, invioceDetail = null ,onlinePay = null;
		

        var claim = new Claim();
        //claim.show();


        orderList.on('orderDetail', function( options ){
            detailApproval = new DetailApproval();
            detailApproval.show( options );
        });
		orderList.on('orderDetailPayment', function( options ){
            detailPayment = new DetailPayment();
            detailPayment.show( options );
        });
		orderList.on('orderOnlinePay', function( options ){
            onlinePay = new OnlinePay();
            onlinePay.show( options );
        });
		
        //联合跟进人
		orderList.on('orderCustom', function( options ){
            customHelper = new CustomHelper();
            customHelper.on('refresh',function(){
                orderList.searchEve();
            });
            customHelper.show( options );
        });
		//退款
		orderList.on('orderBackmoney', function( options ){
            backMoney = new BackMoney();
            backMoney.show( options );
			backMoney.on('saveSuccess', function( ){
				orderList.getList();
			})
        })
        //发票
		orderList.on('orderInvoice', function( id ){
            invioceDetail = new InvoiceDetail();
            invioceDetail.show( id,null,0 );
			invioceDetail.on('saveSuccess', function( ){
				orderList.getList();
			})
        });

    }
} );

