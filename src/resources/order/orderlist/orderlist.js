//
// 订单列表
// 代理商用 渠道用 小助手用
//=========================================
define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TplEvent = IBSS.tplEvent;

    var Pagination = require('common/widget/pagination/pagination');
    var Dialog = require('common/widget/dialog/dialog');

    var ENUMDATA = require('module/data/data').data;                    //枚举常量       
    var resetSelect = require('module/data/data').resetSelect;          //枚举常量

    var DetailApproval = require('../detailapproval/detailapproval');           //[订单详情]
    var OldDetailApproval = require('../olddetailapproval/detailapproval');     //[老订单详情]
	var DetailPayment = require('../detailpayment/detailpayment');              //[收尾款]

	var CustomHelper = require('../widget/customhelper/customhelper');     //联合跟进人
    var InvoiceDetail = require('../widget/invoicedetail/invoicedetail');  //发票
    var BackMoney = require('../detailbackmoney/detailbackmoney');         //退款
	
	var OnlinePay = require('../widget/onlinepay/onlinepay');              //线上支付订单

    var tem = $( require('./template.html') );
    
    var Map = {
        '1': '到款',
        '2': '退款'
    }

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
        //到款认领
        show: function( id , status ){ 
            Claim.__super__.show.apply( this, arguments );
            var me = this;          //0都不可以 1显示到款认领 2查看认领的到款

            me.orderId = id;
            if( status == 1 ){
                me.$('.claim-action').show();
                me.url = '/odr/getMatchedReceivedPay';
                me.searchEve( true );
            } else {
                me.$('.claim-action').hide();
                me.url = '/odr/getClaimedReceivedPay';
                me.searchEve( false );
            }
        },

        //搜寻到款列表
        searchEve: function( bool ){
            var me = this;

             util.api({
                'url': me.url,
                'data': {
                    'orderId': me.orderId
                },
                'beforeSend': function(){
                    me.$('tbody').html('<tr><td colspan="8"><p class="tip">加载中......</p></td></tr>');
                },
                'success': function( data ){
                    if( data.success ){
                        if( data.value.model.length <= 0 ){
                            me.$('tbody').html('<tr><td colspan="8"><p class="tip">暂未匹配到的数据</p></td></tr>');
                        }else{
                            if( bool ){
                                me.list.reload( data.value.model , function( item ){
                                    item.propertyStr = Map[item.property];
                                });
                            } else {
                                me.list.reload( [data.value.model] , function( item ){
                                    item.propertyStr = Map[item.property];
                                });
                            }
                        }
                    }
                }
            })
        },
        hide: function(){
            var me = this;
            me.$('.claim-action').hide();
            Claim.__super__.hide.apply( this, arguments );
        },
        //认领
        claimEve: function(){
            var me = this;
            console.log('认领');
            var id = me.$('[name="daokuan"]:checked').val();
            console.log(id);

            util.api({
                'url':'/odr/claimReceivedPay',
                'data':{
                    'orderId': me.orderId,
                    'receivedPayId': id
                },
                'success': function( data ){
                    if( data.success ){
                        util.showTip('认领成功');
                        me.trigger('success');
                        me.hide();
                    }
                }
            })
        },
        //重新匹配
        rematchEve: function(){
            var me = this;
            me.searchEve(true);
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
			if( me.attrs.orderId){
				me.$putStartTime.val('');
				me.$putEndTime.val('');
				me.jumpEve(me.attrs.orderId);
			}else{
				me.searchEve();
			}
			
            resetSelect( me.$view , "ordermap");
            resetSelect( me.$view , "paystatus");
            resetSelect( me.$view , "apptype");
            resetSelect( me.$view , "orderstatus");
        },
        events: {
			'click .search':'searchEve',                        //搜索
            'click .detail-revocation': 'revocationEve',        //撤回
            'click .detail-finalpay': 'finalPayEve',            //收尾款
            'click .detail-delete': 'deleteEve',                //删除订单
            'click .detail-info': 'infoEve',                    //查看详情
            'click .detail-supplement': 'supplyEve',            //补充合同
            'click .detail-daokuan': 'daokuanEve',              //到款认领
            'click .detail-invoice': 'invoiceEve',              //发票
            'click .detail-tuikuan': 'tuikuanEve',              //退款
            'click .detail-union': 'unionEve',                  //联合跟进人

            //'click .order-detail':'orderDetailEve',
			//'click .receive-money':'receiveMoneyEve',
			//'click .order-detailPay':'orderDetailPayEve',
			//'click .order-del':'orderDelEve',
			'click .exportOrder':'exportEve',
			'click .exportAgent':'exportAgentEve'
			//'click .order-custom':'orderCustomEve',
			//'click .order-backmoney':'orderBackmoneyEve', 
			//'click .order-onlinepay':'orderOnlinePay',         //查看线上支付情况
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
		jumpEve:function(orderId){
			var me = this;
			me.model.set('orderId',orderId);
			this.pagination.setPage( 0,false );
            this.getList();
		},
        //撤回订单事件
        revocationEve: function(e){
            var me = this;
            var id = $(e.currentTarget).attr('data-id');
            var bool = confirm('确认撤回改订单吗?');

            if( bool ){
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
            }
        },

        //收尾款
        finalPayEve: function(e){
            console.log('收尾款');
            var me = this;
            var id = $(e.currentTarget).attr('data-id');
            
            //todo
            var list = me.list.all();

            var item;
            for(var i=0; i<list.length; i++){
                if( list[i]['order']['id'] == id ){
                    item = list[i];
                    break;
                }
            }

            var enterpriseId = item.order.enterpriseId, 
                orderType = item.order.orderType,
                opinion = item.order.rejectReason ? item.order.rejectReason :'',
                isTp = item.order.isTp,
                ea = item.order.enterpriseAccount,
                contractNo = item.order.contractNo;

                location.hash = '#order/payment/' + id + '/' + enterpriseId + '/' + orderType + '/' + opinion + '/' + isTp + '/' + ea + '/' + contractNo;
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
        
        //删除订单
        deleteEve: function(e){
            console.log('删除订单');
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
                        if( data.success ){
                            util.showTip('订单删除成功! ');
                            me.searchEve();
                        }
                    }
                })
            }
        },

        //查看详情
        infoEve: function(e){
            console.log('查看详情');
            var me = this;

            var id = $(e.currentTarget).attr('data-id');
            var status = $(e.currentTarget).attr('data-status');
            var dstatus = $(e.currentTarget).attr('data-dstatus');
            var from = $(e.currentTarget).attr('data-from');
            var type = $(e.currentTarget).attr('data-type');

            //获取订单详情
            var list = me.list.all();
            var item;
            for( var i=0; i<list.length; i++ ){
                if( list[i]['order']['id'] == id ){
                    item = list[i];
                    break;
                }
            }

            var id = item.order.id;
            var enterpriseId = item.order.enterpriseId;
            var orderType = item.order.orderType;
            var opinion = item.order.rejectReason;
            var isTp = item.order.isTp;
            var ea = item.order.enterpriseAccount;
            var contractNo = item.order.contractNo;
            var processInstanceId = item.order.procInstId;
            //
            
            //收尾款
            if( type == 17 ){

                //
                //收尾款分两种情况
                //查看 和 编辑提交
                //======================

                var info;
                //已撤回和被驳回 可以编辑
                if( status == 2 || status == 3 ){
                    info = {'id':id,'enterpriseId':enterpriseId,'editFlag':true,'orderType':orderType,'person':'','opinion':opinion,'isTp':isTp,'state':'refuse','ea':ea,'processInstanceId':processInstanceId,'contractNo':contractNo}
                
                //其他仅可查看 
                }else{
                    
                    info = {'id':id,'enterpriseId':enterpriseId,'editFlag':false,'orderType':orderType,'person':'','opinion':opinion,'isTp':isTp,'state':'','ea':ea,'processInstanceId':processInstanceId,'contractNo':contractNo}
                }

                me.trigger('orderDetailPayment',info);

            //线上支付订单
            }else if( type == 18 ){
                me.trigger('orderOnlinePay',{ 'id' :id } );

            //普通订单( 判断新老订单 )
            } else {

                //新订单
                if( item.isNewOrder ){
                    me.trigger('detail', id , status , dstatus , orderType , enterpriseId , item.canEdit );
                //老订单
                } else {
                    me.trigger('olddetail', item );
                }
            }
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
            var me = this;

            var id = $(e.currentTarget).attr('data-id');
            var status = $(e.currentTarget).attr('data-status');
            var dstatus = $(e.currentTarget).attr('data-dstatus');
            var type = $(e.currentTarget).attr('data-type');
            var entId = $(e.currentTarget).attr('data-entid');

            me.trigger('supply', id , status , dstatus , type , entId );
        },
        //到款
        daokuanEve: function(e){
            console.log('到款认领');
            var me = this;
            var id = $(e.currentTarget).attr('data-id');                 //
            var status = $(e.currentTarget).attr('data-daokuan');        //0都不可以 1显示到款认领 2查看认领的到款
            
            me.trigger('daokuan', id , status );
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

            var enterpriseId = item.order.enterpriseId;
            var orderType = item.order.orderType;
            var opinion = item.order.rejectReason ? item.order.rejectReason :'';
            var isTp = item.order.isTp;
            var ea = item.order.enterpriseAccount;
            var contractNo = item.order.contractNo;
            //var newFirst = $(e.currentTarget).attr('data-newFirst');
            


            //
            // 点击时分三种情况  查看  第一次提交  驳回提交
            //=================================================
            var newFirst;
            
            //查看 退款待审核
            if( item.approveStatus == 5 || item.approveStatus == 6 ){

                me.trigger('orderBackmoney',{ 'id' :id ,'enterpriseId':enterpriseId, 'editFlag':false,'orderType':orderType,
               'person':'', 'opinion':opinion ,'isTp':isTp,'state':'','ea':ea,'processInstanceId':'','contractNo':contractNo} );

            //退款驳回 退款撤回 可编辑
            } else if( item.approveStatus == 7 || item.approveStatus == 8 ){

                me.trigger('orderBackmoney',{ 'id' :id ,'enterpriseId':enterpriseId, 'editFlag':true,'orderType':orderType,
               'person':'', 'opinion':opinion ,'isTp':isTp,'state':'refuse','ea':ea,'processInstanceId':'','contractNo':contractNo} );

            //第一次提交
            }else{

                me.trigger('orderBackmoney',{ 'id' :id ,'enterpriseId':enterpriseId, 'editFlag':true,'orderType':orderType,
               'person':'', 'opinion':opinion ,'isTp':isTp,'state':'newFirst', 'newFirst':'newFirst', 'ea':ea,'processInstanceId':'','contractNo':contractNo} );
            }

        },

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
            var queryData = me.model.all();
            queryData.putStartTime = putStartTime;
            queryData.putEndTime = putEndTime;

            window.open( IBSS.API_PATH + '/odr/exportOrder?' + $.param( queryData ) );
        },
		exportAgentEve:function(){
			 var me = this;

            var putStartTime = '',
                putEndTime = '';

            if( me.$putStartTime.val() ){
                putStartTime = new Date( me.$putStartTime.val() ).getTime();
            }
            if( me.$putEndTime.val() ){
                putEndTime = new Date( me.$putEndTime.val() ).getTime();
            }
            var queryData = me.model.all();
            queryData.putStartTime = putStartTime;
            queryData.putEndTime = putEndTime;

            window.open( IBSS.API_PATH + '/odr/exportSaleOrder?' + $.param( queryData ) );
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

            htmlStr = "<tr> <td colspan='17'><p class='info'>加载中...</p></td> </tr>"
            me.$tbody.html( htmlStr );
            console.log( queryData );
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
                                item.orderStatusStr = item.approveStatus ? ENUMDATA['orderstatus'][item.approveStatus]:'';
                                //付费状态
                                item.payStatusStr = item.order.payStatus ? ENUMDATA['paystatus'][item.order.payStatus]:'';
                                //提单日期
                                item.createTimeStr = new Date( item.order.createTime )._format('yyyy/MM/dd');
                                //当前审批节点
                                item.approvalNodeStr = ENUMDATA['approvalnode'][item.order.approvalNode];
                                //到款认领状态
                                item.claimReceivedPayStatusStr = ENUMDATA['claimreceivedpaystatus'][item.claimReceivedPayStatus]
                                //到款认领样式名
                                if(item.claimOrShowReceivedPay == 0 ){
                                    item.claimClass = 'disable';
                                }else{
                                    item.claimClass = 'detail-daokuan';
                                }
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
                            me.$tbody.html("<tr> <td colspan='17'><p class='info'>暂无数据</p></td> </tr>");
                        }
                        me.pagination.setTotalSize( data.value.model.itemCount );
                    }
                }
            })
            
        }
    })

    exports.init = function(param) {
        var $el = exports.$el;
		
		param = param || [];

        
		
		/*orderList.on('ceshi',function(orderId){
			orderList.jumpEve(orderId);
		})*/
		if(param.length>0){
			var orderList = new OrderList( {'view': $el.find('.m-orderlist'),'orderId':param[0]} );
			//orderList.trigger('ceshi',param[0]);
		}else{
			var orderList = new OrderList( {'view': $el.find('.m-orderlist')} );
		}
		
        var detailPayment = null;
		var customHelper = null;
		var backMoney = null, invioceDetail = null ,onlinePay = null;
		
        //收尾款[需要测试]
        orderList.on('orderDetailPayment', function( options ){
            detailPayment = new DetailPayment();
            detailPayment.show( options );
            detailPayment.on('saveSuccess',function(){
                orderList.getList();
            })
        });

        //在线支付
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

		//
        // 退款
        // 
        //==========================
		orderList.on('orderBackmoney', function( options ){
            
            backMoney = new BackMoney();
            backMoney.show( options );
			backMoney.on('saveSuccess', function( ){
				orderList.getList();
			})
        });

        //发票
		orderList.on('orderInvoice', function( id ){
            invioceDetail = new InvoiceDetail();
            invioceDetail.show( id,null,0 );
			invioceDetail.on('saveSuccess', function( ){
				orderList.getList();
			})
        });

        //到款认领
        orderList.on('daokuan', function( id , status ){
            var claim = new Claim();
            claim.show( id, status );
            claim.on('success',function(){
                orderList.getList();
            });
        });

        //补充合同
        orderList.on('supply', function( id , status , dstatus , orderType , enterpriseId ){
            console.log('补充合同');
            console.log( id );
            
            var detailApproval = new DetailApproval();  //订单详情

            //补充合同待审核的为只读状态
            if( status == 10 ){

                detailApproval.show( id , 'd' , status , dstatus , {'orderType': orderType,'enterpriseId': enterpriseId});
            
            //补充合同被驳回和撤回的可以补充合同
            } else {

                detailApproval.show( id , 'b' , status , dstatus , {'orderType': orderType,'enterpriseId': enterpriseId});
            }

            detailApproval.on('editSuccess',function(){
                orderList.getList();
            });
        });

        //查看
        orderList.on('detail', function( id , status , dstatus , orderType , enterpriseId ,canEdit){
            console.log('查看');
            console.log( id );
            console.log( status );
            
            var detailApproval = new DetailApproval();  //订单详情   
            
            if( canEdit ){
                detailApproval.show( id , 'a', status , dstatus , {'htshow':false, 'orderType': orderType , 'enterpriseId': enterpriseId });
            } else {
                detailApproval.show( id , 'd', status , dstatus , {'htshow':false, 'orderType': orderType , 'enterpriseId': enterpriseId });
            } 

            /*
            else {
                detailApproval.show( id , 'd', status , dstatus , {'htshow',false, 'orderType': orderType , 'enterpriseId': enterpriseId } );
            }
            */
            /*
            //被驳回和已撤回可编辑
            if( IBSS.API_PATH == '/op/api/a' ){
                
                if( status == '2' || status == '3' ){
                    detailApproval.show( id , 'a', status , dstatus , {'htshow':false, 'orderType': orderType , 'enterpriseId': enterpriseId });
                }else{
                    detailApproval.show( id , 'd', status , dstatus , {'htshow':false, 'orderType': orderType , 'enterpriseId': enterpriseId });
                }

            //其他只可以看详情
            } else {

                detailApproval.show( id , 'd', status , dstatus , {'orderType': orderType , 'enterpriseId': enterpriseId } );
            }
            */
            detailApproval.on('editSuccess',function(){
                orderList.getList();
            });
        });

        //
        //查看老订单
        //===============================
        orderList.on('olddetail',function( item ){
                /*
                var id = $(e.currentTarget).attr('data-id');
                var enterpriseId = $(e.currentTarget).attr('data-enterpriseId');
                var orderType = $(e.currentTarget).attr('data-orderType');
                var opinion = $(e.currentTarget).attr('data-opinion');
                var isTp = $(e.currentTarget).attr('data-isTp');
                var ea = $(e.currentTarget).attr('data-ea');
                */

                var oldDetailApproval = new OldDetailApproval(); //老订单

                var id = item.order.id;
                var enterpriseId = item.order.enterpriseId;
				//针对老订单新增类型字段
                var orderType = item.oldOrderType;
                var opinion = item.order.rejectReason || '';
                var isTp = item.order.isTp || '';
                var ea = item.order.enterpriseAccount;

                //被驳回或已撤回
                if( item.approveStatus == 2 || item.approveStatus == 3 ){
                    oldDetailApproval.show( { 'id' :id ,'enterpriseId':enterpriseId, 'editFlag':true,'orderType':orderType,
                    'person':'', 'opinion':opinion ,'isTp':isTp,'state':'refuse','ea':ea,'processInstanceId':''} );
                } else {
                    oldDetailApproval.show( { 'id' :id ,'enterpriseId':enterpriseId, 'editFlag':false,'orderType':orderType,
                    'person':'', 'opinion':opinion ,'isTp':isTp,'state':'','ea':ea,'processInstanceId':''} );
                };
                

        });
    }
} );

