/**
 * 
 * 查看 企业开通审批详情
 * 用于 渠道人员 支持人员 查看 审批列表
 *
 * 支持人员(小助手) 用审批列表 
 * 财务人员 用审批列表
 */

define( function(require, exports, module){

    var Pagination = require('common/widget/pagination/pagination');
	var contentStr = require('./openapprovallist.html');

    var ApprovalList = MClass( M.Center ).include({
        
        init: function(){
            ApprovalList.__super__.init.apply( this , arguments );
            var me = this;

			me.attrs.state = 'wait';
            
            me.pagination = new Pagination({
                'wrapper': me.$view.find('.list-pager'),
                'pageSize': 20,
                'pageNumber': 0
            });
			

            //是否显示 系统全部审批列表
			if(me.attrs.limits){
				me.$limitsShow.css({'display':'inline-block'});
			}else{
				//$('.limits-show').hide();
				me.$limitsShow.hide();
			}
			


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
                }else if( me.attrs.state =="going" ){
                    trlength = 16;
                }else if( me.attrs.state =="end" ){
                    trlength = 15;
                }else if( me.attrs.state =="allGoing" ){
                    trlength = 16;
                }else if( me.attrs.state =="allEnd" ){
                    trlength = 15;
                }else if( me.attrs.state =="allReject" ){
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

        view: contentStr,

        elements:{
            '.applytype': 'applytype',      //
            '.starttime': 'starttime',      //开始时间
			'.limits-show': 'limitsShow',   //
            '.endtime': 'endtime',          //结束时间
            'tbody': 'tbody'                //
        },

        events: {
            'click .btn-search': 'searchEve',       //查询
            'click .detail': 'detailEve',           //详情
            'click .revoke': 'revokeEve',           //撤销审批
            'click .toggle span': 'toggleEve'          //切换
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

        //渲染至页面
        render: function(){
            this.attrs.wrapper.html( this.$view );
        },

        // 设置状态
        //  
        //
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
        //
		jumpEve:function(jump){
			var me = this;
			me.$view.find('.toggle b[data-state="'+jump+'"]').trigger("click");
		},
        // 切换事件
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
                'applicantName': me.model.get('applicantname'),
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
            /*
            if( state == "end" ){
                data.endTimeStart = me.model.get('endTimeStart');
                data.endTimeEnd = me.model.get('endTimeEnd');
            }
            */
            var url;
            switch ( state ){
                case 'wait':
                    url = "/approval/getongoingapprovalpage";
                break;
                case 'going':
                    url = "/approval/getapprovedongoingapprovalpage";
                break;
                case 'end':
                    url = "/approval/getcompletedapprovalpage";
                break;
                case 'refuse':
                    url = "/approval/getrefusedapprovalpage";
                break;
                case 'allReject':
                    url = "/approval/getallrefusedapprovalpage";
                break;
				case 'allGoing':
                    url = "/approval/getallongoingapprovalpage";
                break;
				case 'allEnd':
                    url = "/approval/getallcompletedapprovalpage";
                break;
                case 'mygoing':
                    url = "/approval/getongoingapprovalbyapplicant";
                break;
            };

            me.xhr && me.xhr.abort();

            me.xhr = util.api({
                'url': url,
                'data': data,
                'beforeSend': function(){
                    me.$tbody.html('<tr><td colspan="15"><p class="info">努力加载中...</p></td></tr>');
                },
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
                                item.isCooperationStr = "";
                            }
                        });
                    }
                }
            })
        }
    });
    

	module.exports = ApprovalList;
});
