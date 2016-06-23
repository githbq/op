define( function(require, exports, module){

    //订单列表——订单类型
    exports['ordermap'] = {
    	'1': '新购',
    	'2': '续费',
    	'3': '增购',
    	'5': '收尾款'
    }

    //订单列表——付费状态
    exports['paystatus'] = {
    	'1': '分期',
    	'2': '全部',
    	'3': '未付'
    }

    //订单列表———应用类型
    exports['apptype'] = {
    	'1': '培训服务费',
    	'2': 'CRM',
    	'3': 'PK助手',
    	'4': '会议助手',
    	'5': '战报助手',
    	'6':'自定义助手',
        '7': '考试助手',
        '8': '工资助手',
        '9': '项目管理',
        '10':'培训助手',
        '11':'培训助手流量',
        '12':'助手套餐'
    }
 
    //订单列表————订单状态
    exports['orderstatus'] = {
        '1': '待审核',
        '2': '已撤回',
        '3': '被驳回',
        '4': '已审核',
        '5': '申请退款',
        '6': '退款成功',
        '7': '退款驳回',
        '8': '退款撤回',
        '9': '待补充合同',
        '10':'补充合同待审核',
        '11':'补充合同驳回',
        '12':'补充合同撤回'
    }

    //订单列表————当前审批节点
    exports['approvalnode'] = {
        '1': '代理商节点',
        '2': '待小助手开通',
        '3': '到款认领',
        '4': '待数据中心审批'
    }

    //订单列表————到款认领状态
    exports['claimreceivedpaystatus'] = {
        '1': '未认领',
        '2': '认领中',
        '3': '已认领'
    }
})


