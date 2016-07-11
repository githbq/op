define( function(require, exports, module){



    var data = {};

    //订单列表——订单类型
    data['ordermap'] = {
    	'1': '新购',
    	'2': '增购',
    	'3': '续费',
    	'4': '增购续费',
        '5': '关联自注册',
        '6': '开源',
        '17': '收尾款订单',
        '18': '线上支付订单'
    }
    //订单列表/审批列表——付费状态
    data['paystatus'] = {
    	'1': '全款',
    	'2': '分期',
    	'3': '未付'
    }
    //订单列表———应用类型
    data['apptype'] = {
        '1': 'CRM',
        '2': '逍客终端',
        '3': '培训费',
        '4': 'PK助手',
        '5': '会议助手',
        '6': 'HR助手',
        '7': '工资助手',
        '8': '使用名片',
        '10': '报数系统',
        '11': '纷享百川',
        '12': '自定义助手',
        '13': '培训助手',
        '14': '战报助手',
        '15': '考试助手',
        '16': '培训助手课时',
        '17': '项目管理',
        '18': '空间',
        '19': '助手套餐'
    }
    //订单列表————订单状态
    data['orderstatus'] = {
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
    data['approvalnode'] = {
        '1':'代理商节点',
        '2':'小助手节点',
        '3':'到款认领节点',
        '4':'数据中心节点'
    }

    //审批列表——当前审批节点map映射
    data['approvalnodemap'] = {
        'agent':'代理商节点',
        'support':'小助手节点',
        'support2': '待小助手最后确认',
        'claimReceivedPay':'到款认领节点',
        'finance':'数据中心节点'
    }


    //订单列表————到款认领状态
    data['claimreceivedpaystatus'] = {
        '1': '未认领',
        '2': '认领中',
        '3': '已认领'
    }


    //企业列表——企业状态
    data['entstatus'] = {
        '1': '待开通',
        '2': '已开通',
        //'3': '已作废',
        '4': '已停用'
        //'5': '已删除'
    }
    //企业列表——企业类型
    data['enttype'] = {
        '1': '付费',
        '2': '开源'
    }

    //重设select的值
    function resetSelect( $el, name ){


        var ele = $el.find('[name="'+name+'"]');
        var values = data[name];

        var nv = [{'name': '全部','value':'' }];
        for( var key in values ){
            nv.push( {'name':values[key],'value':key} );
        }

        util.resetSelect( ele, nv );
    }

    module.exports = {
        'data': data,
        'resetSelect': resetSelect
    }
});


