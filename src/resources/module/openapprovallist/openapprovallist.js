/**
 * 
 * 查看 企业开通审批详情
 * 用于 渠道人员 支持人员 查看 审批详情
 *
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

            me.getEnums();
           
            me.setState();

            me.on('empty:list',function(){
                if( me.attrs.state == "wait" ){
                    trlength = 10;
                }else if( me.attrs.state =="going" ){
                    trlength = 11;
                }else if( me.attrs.state =="end" ){
                    trlength = 10;
                }else if( me.attrs.state =="allGoing" ){
                    trlength = 11;
                }else if( me.attrs.state =="allEnd" ){
                    trlength = 10;
                }

                me.$tbody.html("<tr><td colspan='" + trlength + "'><p class='info'>暂无数据</p></td></tr>");
            });

            me.list.on('reload',function(){
                me.setState();
            });
        },

        view: contentStr,

        elements:{
            '.applytype': 'applytype',
            '.starttime': 'starttime',
			'.limits-show': 'limitsShow',
            '.endtime': 'endtime',
            'tbody': 'tbody'
        },

        events: {
            'click .btn-search': 'searchEve',
            'click .detail': 'detailEve',
            'click .toggle b': 'toggleEve',
			'click .detail-bind':'detailBindEve'
        },

        /**
         *
         * 获取审批类型 枚举值
         */
        getEnums: function(){
            var me = this;

            util.getEnumsSelect('APPROVAL_TYPE',me.$applytype,function( data ){
                me.getList();
            })
        },

        //渲染至页面
        render: function(){
            this.attrs.wrapper.html( this.$view );
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

            var id = $target.attr('data-id');
            var eid = $target.attr('data-eid');
            var type = $target.attr('data-type');
			var isCanEdit = $target.attr('data-edit')||'false';
            me.trigger( 'detail', id , eid , type , me.attrs.state,isCanEdit );
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


            var applyTimeStart = '',
                applyTimeEnd = '',
                endTimeStart = '',
                endTimeEnd = '';

            if( me.model.get('applyTimeStart') ){
                applyTimeStart = new Date( me.model.get('applyTimeStart') ).getTime();
            }
            if( me.model.get('applyTimeEnd') ){
                applyTimeEnd = new Date( me.model.get('applyTimeEnd') ).getTime();
            }
            if( me.model.get('endTimeStart') ){
                endTimeStart = new Date( me.model.get('endTimeStart') ).getTime();
            }
            if( me.model.get('endTimeEnd') ){
                endTimeEnd = new Date( me.model.get('endTimeEnd') ).getTime();
            }

            var data = {
                'applicantName': me.model.get('applicantName'),
                'approvalType': me.model.get('approvalType'),
                'enterpriseName': me.model.get('enterpriseName'),
                'enterpriseAccount': me.model.get('enterpriseAccount'),
                'enterpriseShortName': me.model.get('enterpriseShortName'),
                'applyTimeStart': me.model.get('applyTimeStart'),
                'applyTimeEnd': me.model.get('applyTimeEnd'),
                'pageIndex': me.pagination.attr['pageNumber'],
                'pageSize': me.pagination.attr['pageSize']
            }

            var state = me.attrs.state;
            if( state == "end" ){
                data.endTimeStart = me.model.get('endTimeStart');
                data.endTimeEnd = me.model.get('endTimeEnd');
            }
            var url;
            switch ( state ){
                case 'wait':
                    url = "/approval/getongoingapprovalbyapprover";
                break;
                case 'going':
                    url = "/approval/getapprovedongoingapprovalbyapprover";
                break;
                case 'end':
                    url = "/approval/getcompletedapprovalbyapprover";
                break;
				case 'allGoing':
                    url = "/approval/getallongoingapproval";
                break;
				case 'allEnd':
                    url = "/approval/getallcompletedapproval";
                break;
            };

            me.$tbody.html('<tr><td colspan="11"><p class="info">加载中...</p></td></tr>');
            
            me.xhr && me.xhr.abort();

            me.xhr = util.api({
                'url': '~/op/api' + url,
                'data': data,
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
						me.setNum(me.attrs.state,data);
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.list.reload( data.value.model.content , function( item ){
                            item.applyTimeStr = new Date( item.applyTime )._format('yyyy-MM-dd hh:mm');
                            if( item.endDate ){
                                item.endDateStr = new Date( item.endDate )._format('yyyy-MM-dd hh:mm');
                            }
                        });
                    }
                }
            })
        }
    });
    

	module.exports = ApprovalList;
});
