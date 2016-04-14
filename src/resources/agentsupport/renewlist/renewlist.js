define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;


    var Pagination = require('common/widget/pagination/pagination');
    var DetailApproval = require('../../order/detailapproval/detailapproval');
	var BackMoney = require('../../order/backmoney/backmoney');
    var DetailPayment = require('../../order/detailpayment/detailpayment');

    /**
     *
     * 代理商审批列表
     */
    var OpenApprovalList = MClass( M.Center ).include({
        
        init: function(){
            OpenApprovalList.__super__.init.apply( this , arguments );
            var me = this;

            me.attrs.state = 'wait';
            
            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
            me.pagination.render();
            me.pagination.onChange = function(){
                me.getList();
            };

            me.$starttime.datetimepicker( {'timepicker': false,'format':'Y/m/d'} );
            me.$endtime.datetimepicker( {'timepicker': false, 'format':'Y/m/d'} );

            //me.getEnums();
            me.getList();

            me.setState();

            me.on('empty:list',function(){
                if( me.attrs.state == "wait" ){
                    trlength = 15;
                }else if( me.attrs.state =="refuse" ){
                    trlength = 16;
                }else if( me.attrs.state =="end" ){
                    trlength = 15;
                }else{
                    trlength = 15;
                }
                me.$tbody.html("<tr><td colspan='" + trlength + "'><p class='info'>暂无数据</p></td></tr>");
            });

            me.list.on('reload',function(){
                me.setState();
            });
        },

        elements:{
            '.applytype': 'applytype',      //
            '.starttime': 'starttime',      //开始时间
            '.endtime': 'endtime',          //结束时间
            'tbody': 'tbody'                //
        },

        events: {
            'click .btn-search': 'searchEve',       //查询
            'click .detail': 'detailEve',           //详情
            'click .revoke': 'revokeEve',           //撤销审批
            'click .toggle b': 'toggleEve'          //切换
        },

        /**
         *
         * 获取需要的枚举值
         */
        getEnums: function(){
            var me = this;

            util.getEnumsSelect('APPROVAL_TYPE',me.$applytype,function( data ){
                me.getList();
            });
            
        },

        //设置状态
        setState: function( element ){
            var me = this;

            var $parent = element || me.$view;

            $parent.find('.state').hide();

            if( me.attrs.state ){
                $parent.find( '.state-' + me.attrs.state ).show();
                $parent.find( '.' + me.attrs.state+'-approve' ).show();
            }
        },
        
        //设置状态
        setNum: function( state,data){
            var me = this;
            var listNum = data.value.model.itemCount||0;
            $('.' + state+'-approve').text(listNum);
        },

        //撤销审批
        revokeEve: function( e ){
            var me = this;

            var $target = $( e.currentTarget );
            var inid = $target.attr('data-inid');

            var bool = confirm("是否确认撤销此条审批?");

            if( bool ){
                util.api({
                    'url': '~/op/api/approval/withdrawapproval',
                    'data':{
                        'processInstanceId': inid
                    },
                    'success': function( data ){
                        console.warn( data );
                        if( data.success ){
                            util.showTip('撤销成功');
                            me.getList();
                        }
                    }
                });
            }
        },

        //搜索列表
        searchEve: function(){
            var me = this;
            me.pagination.setPage( 0,false );
            me.getList();
        },

        /**
         * 
         * 触发函数
         * id     实例id  
         * eid    企业id
         * type   类型
         */
        detailEve: function( e ){
            var me = this;

            var $target = $( e.currentTarget );

            var inid = $target.attr('data-inid');

            var detail = me.list.find('processInstanceId',inid);
         
            me.trigger( 'detail', detail, me.attrs['state'] );
        },
        
        detailBindEve:function(e){
             var me = this;

            var $target = $( e.currentTarget );

            var id = $target.attr('data-id');
            var eid = $target.attr('data-eid');
            var type = $target.attr('data-type');
            var isCanEdit = $target.attr('data-edit')||'false';
            me.trigger( 'detailBind', id , eid , type , me.attrs.state,isCanEdit );
        },
		jumpEve:function(jump){
			var me = this;
			me.$view.find('.toggle b[data-state="'+jump+'"]').trigger("click");
		},
        toggleEve: function( e ){
            var $target = $( e.currentTarget );
            $target.addClass('active').siblings().removeClass('active');


            var state = $target.attr('data-state');

            if( state == this.attrs.state ){
                return;
            }

            this.attrs.state = state;
            this.setState();
            this.searchEve();
        },

        /**
         *
         * 根据不同状态
         * 拉取不同列表
         */
        getList: function(){
            var me = this;

            var appTimeStart = '',
                appTimeEnd = '';

            if( me.$('.starttime').val() ){

                appTimeStart = new Date( me.$('.starttime').val() ).getTime();
            }   
            
            if( me.$('.endtime').val() ){

                appTimeEnd = new Date( me.$('.endtime').val() ).getTime();
            }

            var data = {
                'orderId': me.model.get('orderId'),
                'contractNo': me.model.get('contractNo'),
                'ea': me.model.get('ea'),
                'en': me.model.get('en'),
                'orderType': me.model.get('orderType'),
                'isTp': me.model.get('isTp'),
                'payStatus': me.model.get('payStatus'),
                'appTimeStart': appTimeStart, 
                'appTimeEnd': appTimeEnd,
                'agentName': me.model.get('agentName'),
                'agentId': me.model.get('agentId'),
                'pageIndex': me.pagination.attr['pageNumber'],
                'pageSize': me.pagination.attr['pageSize']
            }

            var state = me.attrs.state;
            var url;

            switch ( state ){
                case 'wait':
                    url = "/approval/getongoingapprovalpage";
                break;
                case 'refuse':
                    url = "/approval/getrefusedapprovalpage";
                break;
                case 'end':
                    url = "/approval/getcompletedapprovalpage";
                break;
            };

            me.$tbody.html('<tr><td colspan="15"><p class="info">加载中...</p></td></tr>');
            
            me.xhr && me.xhr.abort();

            me.xhr = util.api({
                'url': url,
                'data': data,
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        me.setNum(me.attrs.state,data);
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.list.reload( data.value.model.content , function( item ){
                            item.applyTimeStr = new Date( item.applyTime )._format('yyyy-MM-dd hh:mm');

                            if( item.isCooperation == "1" ){
                                item.isCooperationStr = "是";
                            }else if( item.isCooperation == "0" ){
                                item.isCooperationStr = "否"
                            }else{
                                item.isCooperationStr = "--";
                            }
                        });
                    }
                }
            })
        }
    });

    exports.init = function( param ) {
        var $el = exports.$el;
		
		param = param || [];
		console.log(param)
        //审批列表
        var renewList = new OpenApprovalList( { 'view':$el.find('.m-approvallist') } );    //

        var detailApproval,
            detailPayment;
		renewList.on('ceshi',function(jump){
			renewList.jumpEve(jump);
		})
		if(param.length>0){
			renewList.trigger('ceshi',param[0]);
		}
		

        renewList.on('detail',function( detail , state ){
            
            if( state == 'wait' ){
                state = 'agentwait';
            }

            console.log( detail )

            detailApproval = new DetailApproval();
            var data = {
                'id' : detail.orderId,
                'enterpriseId': detail.enterpriseId, 
                'editFlag': detail.canEdit,
                'orderType': detail.orderType,
                'opinion': detail.lastAssigneeOpinion,
                'isTp': detail.isTp,
                'state': state,
                'ea': detail.enterpriseAccount,
                'currentTask': detail.currentTask,
                'processInstanceId': detail.processInstanceId,
                'contractNo': detail.contractNo,
                'rejectsFrom': detail.rejectsFrom
            }
			if( detail.approvalTypeId =='refundApproval' ){
				detailApproval = new BackMoney();
                detailApproval.show( data );
                detailApproval.on('saveSuccess',function(){
                    renewList.getList();
                })
				return false;
			}

            if( data.orderType != 17 ){

                detailApproval = new DetailApproval();
                detailApproval.show( data );
                detailApproval.on('saveSuccess',function(){
                    renewList.getList();
                })
            } else {

                detailPayment = new DetailPayment();
                detailPayment.show( data );
                detailPayment.on('saveSuccess',function(){
                    renewList.getList();
                });
            }

        });
    }
} );

