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
    //订单列表——付费状态
    data['paystatus'] = {
    	'1': '分期',
    	'2': '全部',
    	'3': '未付'
    }
    //订单列表———应用类型
    data['apptype'] = {
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
        '1': '代理商节点',
        '2': '待小助手开通',
        '3': '到款认领',
        '4': '待数据中心审批'
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
        '3': '已作废',
        '4': '已停用',
        '5': '已删除'
    }
    //企业列表——企业类型
    data['enttype'] = {
        '1': '付费',
        '2': '开源',
        '3': '自注册'
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


