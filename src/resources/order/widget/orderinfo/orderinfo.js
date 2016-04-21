/**
 * 组件：h5 图片模块
 * @html h5.html
 */
define(function(require, exports, module){

	var contentStr = require('./orderinfo.html');
		
	/* new 对象是传递的参数;
    this.data = opts.data || {}; //基本信息数据
    this.editFlag = opts.editFlag || false; //是否可编辑参数
	this.type = opts.type || 'common'; // common-普通审批，special-特殊审批*/;
    
	var View = MClass( M.Center ).include({
		view: contentStr,
		events:{

		},
		elements: {

		},
		init: function(){
			View.__super__.init.apply( this,arguments );
			var me = this;

			//显示基本信息模块
			me.render();

		},

		//显示
		render: function(){
			var me = this;
			me.attrs['wrapper'].html( me.$view );
			debugger;
			me.setValue();
		},
		//数据渲染显示
		setValue:function(){
			var me = this;
			var strDom = '';
			me.$('.ea').text(me.attrs.data.value.enterpriseAccount);
			me.$('.account').text(me.attrs.data.value.enterpriseName);

			_.map( me.attrs.data.model , function( obj ){

				switch( obj["code"] )
				{
					case "FX_Terminal":
						var strartTime = "",endTime = "";
						strartTime = obj['startDate'] ? new Date( obj['startDate']  )._format('yyyy/MM/dd'):'——';
						endTime = obj['endDate'] ? new Date( obj['endDate']  )._format('yyyy/MM/dd'):'——';
						strDom += " <tr> <td>"+obj['appName']+"(个)：</td><td>"+obj['quota']+"</td>" +
						" <td>开始时间：</td><td>"+ strartTime +"</td> <td>结束时间：</td><td >"+endTime+"</td> </tr>";

						break;
					case "CRM":
						var strartTime = "",endTime = "";
						strartTime = obj['startDate'] ? new Date( obj['startDate']  )._format('yyyy/MM/dd'):'——';
						endTime = obj['endDate'] ? new Date( obj['endDate']  )._format('yyyy/MM/dd'):'——';
						strDom += " <tr> <td>"+obj['appName']+"(个)：</td><td>"+obj['quota']+"</td>" +
						" <td>开始时间：</td><td>"+ strartTime +"</td> <td>结束时间：</td><td >"+endTime+"</td>" +
						" <td><input type='checkbox' name='baichuai' checked='checked' disabled='disabled' />捆绑纷享百川</td><td>" +
						"<input type='checkbox' name='system' checked='checked'   disabled='disabled' />捆绑报数系统</td> </tr>" +
						" <td><input type='checkbox' name='mingpian' checked='checked' disabled='disabled' />捆绑名片</td><td>" ;

						break;
					case "Service_Fee":
						
						strDom += " <tr> <td>"+obj['appName']+"(人)：</td><td>"+obj['quota']+"</td>" +
						" <td>开始时间：</td><td>——</td> <td>结束时间：</td><td >——</td>" +
						" </tr>";

						break;
					case "Number_System":case "FXBC":
					
						break;
					default:
						var strartTime = "",endTime = "";
						strartTime = obj['startDate'] ? new Date( obj['startDate']  )._format('yyyy/MM/dd'):'——';
						endTime = obj['endDate'] ? new Date( obj['endDate']  )._format('yyyy/MM/dd'):'——';
						strDom += " <tr> <td colspan='2'>"+obj['appName']+"：</td> <td>开始时间：</td><td>"+ strartTime +"</td> <td>结束时间：</td><td >"+endTime+"</td></tr>";
				}
			});
			me.$('.order-tab tbody').html(strDom);
		},
		//检测是否可编辑
		checkEdit:function(editFlag){
			var me = this;

		},
		//对外获取文本框值
		getValue:function(){
			var me = this;
			return {};
		},
		//检测数据有效和必填项
		checkVaild:function(){
			var me = this;
		}
		
	});

	module.exports = View;

});