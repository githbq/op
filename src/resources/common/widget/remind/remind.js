define(function(require, exports, module){

	var tem = require('./remind.html');

	var $body = $('body');

	var REMIND_MAP={
		'1': {
			text:'报备审核通过',
			url: '/op/a#agentsupport/entprisefiling'
		},
		'2': {
			text:'报备审核驳回',
			url:'/op/a#agentsupport/entprisefiling'
		},
		'3': {
			text:'新增代理商用户审核',
			url:'/op/c#filing/approvalwait'
		},
		'4': {
			text:'企业资料审核驳回',
			url:'/op/a#agentsupport/entpriselist'
		},
		'5': {
			text:'普通审批被驳回',
			url:'/op/index#order/orderlist'  //'/op/a#agentsupport/renewlist'
		},
		'6': {
			text:'普通审批被驳回',
			url:'/op/a#order/orderlist'  //'/op/a#agentsupport/renewlist'
		},
        '7': {
            text: "小助手退款被驳回",
            url: "/op/index#order/orderlist"
        },
        '8': {
            text: "代理商退款被驳回",
            url: "/op/a#order/orderlist"
        },
        '9': {
            text: "发票申请被驳回",//小助手
            url: "/op/index#order/invoiceapplyagentlist/refuse"
        },
        '10': {
            text: "发票申请被驳回",
            url: "/op/a#order/invoiceapplyagentlist/refuse"
        }
	}

	var Remind = MClass( M.Center ).include({
		view: tem,
		timespace: 15000,
		init: function(){
			var me = this;
			Remind.__super__.init.apply(this,arguments);
				
			//轮询时间句柄
			me.timeHandler = null;

			me.getRemind();
		},

		events: {
			'click .remind-go': 'goEve'
		},

		getRemind: function(){
			var me = this;

			me.timeHandler && clearTimeout( me.timeHandler );

			util.api({
				'url': '~/g/api/message/getall',
				'success': function( data ){
					//console.warn( data );
					if( data.success ){

						if( data.value.model.length > 0 ){
							me.list.reload( data.value.model, function( item ){
								if(REMIND_MAP[item.type]){
									item.content = REMIND_MAP[item.type]['text'];
									me.show();
								}else{
									me.hide();
									var titleInfo = REMIND_MAP[item.type] ? REMIND_MAP[item.type]['text']:'未找到类型为：'+item.type+ ' 的信息提示';
									console.log(titleInfo)
								}
							});
						}else{
							me.hide();
						}
					}
				},
				'complete': function(){
					me.timeHandler = setTimeout( function(){ me.getRemind() } , me.timespace );
				} 
			})
		},

		//跳转
		goEve: function( e ){
			var me = this;

			var $target = $( e.currentTarget );

			var id = $target.attr('data-id'),
				type = $target.attr('data-type'),
				url = REMIND_MAP[type]['url'];

			//发送标识
			util.api({
				'url': '~/g/api/message/read',
				'data': {
					'id': id
				},
				'success':function(){
					me.getRemind();
					location.href = url;
				}
			});
			
		},

		show: function(){
			$body.append( this.$view );
		},
		hide: function(){
			this.$view.detach();
		}
	})

	module.exports = Remind;
});



