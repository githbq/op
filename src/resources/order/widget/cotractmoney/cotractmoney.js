/**
 * 组件：h5 图片模块
 * @html h5.html
 */
define(function(require, exports, module){
	
	var Slider = require('common/widget/slider/slider');
	var contentStr = require('./cotractmoney.html');
	
	var productIdDic = {
            '1': 'CRM',
            '2': '逍客终端',
            '3': '培训服务费',
            '4': 'PK助手',
            '5': '会议助手',
            '6': 'HR助手',
            '7': '工资助手',
            '8':'名片',
			'12':'自定义助手'	
        }; 
	
	var AddEnt = MClass( M.Center ).include({
		view: contentStr,
		/*
		defaultAttr:{
			'title': '添加企业',
			'width': 680
		},
		*/
		events:{

		},
		elements: {
			'.payStatus-select':'payStatusSelect',
			'.stage-box':'stageBox',
			'.app-box':'appBox',
			'.sub-app':'subApp',
			'.payDate':'payDate'
		},
		init: function(){
			AddEnt.__super__.init.apply( this,arguments );
			var me = this;
			me.attrs.dataObj = {};
			me.attrs.data = {};


			//显示基本信息模块
			me.render();
		},

		//显示
		render: function(){
			var me = this;
			me.attrs['wrapper'].html( me.$view );
			//获取合同等展示信息
			$.when( me.getOrderDetail()).done(function(){
				me.showData();
				me.showSubers();
				
			});
			
		},
		//获取订单详情
		getOrderDetail:function( ){
			var me = this;

			return  util.api({
				'url':'/odr/getOrderDetail',
				'data':{'orderId':me.attrs.orderId },
				'success': function( data ){
					if( data.success ){
						me.attrs.data = data.value.model;
						me.attrs.dataObj = data.value.model.contract||{};
						me.attrs.dataObj.payerName = data.value.model.orderEntity.order.payerName;
						me.attrs.dataObj.payDate = data.value.model.orderEntity.order.payDate;//打款日期
						me.attrs.dataObj.receivedPayDate = data.value.model.orderEntity.order.receivedPayDate;//实际到款日期
						me.attrs.dataObj.receiptsAccount = data.value.model.orderEntity.order.receiptsAccount;//收款账户
						me.attrs.dataObj.payStatus = data.value.model.orderEntity.order.payStatus;//付费状态
						me.attrs.dataObj.reciviedAmount = data.value.model.odrMnyVO.reciviedAmount  //财务确认收款
						me.attrs.dataObj.hasInvoice =  me.attrs.hasInovice //是否开发票
					}
				}
			})

		},
		//子产品退款和使用
		showSubers:function(){
			var me = this;
			
			var sublist = me.attrs.data.odrMnyVO.subOdrMnyVOs, strDom = '',serviceDom=''; usedAmound = 0,tempSublist = [];
			me.attrs.refundVO={};
			for(var i = 0; i<sublist.length; i++ ){
				var tempId = parseInt(sublist[i].productId);
				switch( tempId ){
					case 3:
						
						serviceDom+=" <tr> <td>"+productIdDic[tempId]+"合同金额：</td><td class='money-box'>"+sublist[i].contractAmount+"</td>" +
						" <td>非退款项</td><td></td></tr>"
						break;
					case 10: case 11: case 2:
						break;
					default:
						strDom+=" <tr> <td>"+productIdDic[tempId]+"合同金额：</td><td class='money-box'>"+sublist[i].contractAmount+"</td>" +
						" <td>已使用金额：</td><td class='money-box'>"+sublist[i].usedAmount+"</td></tr>"
						usedAmound+=parseFloat(sublist[i].usedAmount);
						var backAmount = {};
						var tempMoney  = parseFloat(sublist[i].contractAmount) - parseFloat(sublist[i].usedAmount);
						if( tempMoney>0 ){
							backAmount = {'productId':sublist[i].productId,'amount':tempMoney,'refundAmount':0};
							tempSublist.push( backAmount );
						}
						
				}
			}
			//组合传给退款的数据
			me.attrs.refundVO.subRefunds = tempSublist;
			me.attrs.refundVO.refund= {
				'refundAmount':0
			};
			strDom = serviceDom + strDom;
			me.attrs.dataObj.usedAmount = usedAmound.toFixed(2);
			me.model.set('usedAmount',me.attrs.dataObj.usedAmount );
			me.$('.sub-tab tbody').html(strDom);
			
			me.trigger('successData');
			
		},
		getVauel:function(){
			var me = this;
			return me.attrs.refundVO;
		},
		//展示订单内容
		showData:function(){
			var me = this;
			me.model.load( me.attrs.dataObj );
			var payDate = me.attrs.dataObj.payDate?new Date( me.attrs.dataObj.payDate)._format('yyyy/MM/dd'):'';
			var receivedPayDate = me.attrs.dataObj.receivedPayDate?new Date( me.attrs.dataObj.receivedPayDate )._format('yyyy/MM/dd'):'';
			
			me.model.set('payDate',payDate );
			me.model.set('receivedPayDate',receivedPayDate );
			if(me.attrs.dataObj.contract){
				me.$('.contract-info').hide();
				me.$('.contract-img').attr('src', '/op/api/file/previewimage' + '?filePath=' + me.attrs.dataObj.contract);
				me.$('.contract-link').attr('href', '/op/api/file/previewimage' + '?filePath=' + me.attrs.dataObj.contract)
			}else{
				me.$('.contract-box').hide();
			}
			if(me.attrs.dataObj.contractCopy){
				me.$('.contractCopy-info').hide();
				me.$('.contractCopy-img').attr('src', '/op/api/file/previewimage' + '?filePath=' + me.attrs.dataObj.contract);
				me.$('.contractCopy-link').attr('href', '/op/api/file/previewimage' + '?filePath=' + me.attrs.dataObj.contract)
			}else{
				me.$('.contractCopy-box').hide();
			}
		}
		
		
	});

	module.exports = AddEnt;

});