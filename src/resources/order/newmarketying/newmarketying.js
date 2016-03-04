define( function( require, exports, module ) {
    var IBSS = window.IBSS;

	var BasicInfo = require('../widget/basicinfo/basicinfo');
	var Explain = require('../widget/explain/explain');
	var OrderInfo = require('../widget/orderinfo/orderinfo');

    var NewMarketing = MClass( M.Center ).include( {
        
        elements: {
            '#tabs li'   :'tabsList'
        },
        events: {
			'click .action-cancel': 'cancelEve',
			'click .common-add' : 'getOrderInfo',
			'click .special-add' : 'specialAddEve'
        },
        init: function() {
            NewMarketing.__super__.init.apply( this, arguments );
            var me = this;
			//me.$view.find('.list-pager')
			me.$tabsList.on('click',function(){
				var $this = $(this);
				var $t = $this.index();
				me.$('#tabs li').removeClass('current');
				me.$(this).addClass('current');
				me.$('.content-box ').css('display','none');
				me.$('.content-box ').eq($t).css('display','block');
			})
		
			me.checkType();
        },
		//判断类型
		checkType:function(){
			var me = this;
			
			switch( me.attrs.typeFlag )
			{
				//新购办公版类型
				case 'newOffice':
					me.setNavTitle( '新购办公版', '新购办公版特批');
					
					if(!IBSS.tempEnterprise){
						location.hash = "#agentsupport/entprisefiling";
					}
					
					me.attrs.newBasicCommonOffice = new BasicInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.newBasicSpecialOffice = new BasicInfo( { 'wrapper':me.$view.find('.special-market-basic'),'data':{},'editFlag':true,'type':'special'} );
					me.attrs.newExplaincommonOffice = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.newExplainSpecialOffice = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':'special'} );
					
					break;
					
				//新购营销版类型
				case 'newMarket':
					me.setNavTitle( '新购营销版', '新购营销版特批');
					
					if(!IBSS.tempEnterprise){
						location.hash = "#agentsupport/entprisefiling";
					}
					
					me.attrs.newBasicCommonMarket = new BasicInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.newBasicSpecialMarket = new BasicInfo( { 'wrapper':me.$view.find('.special-market-basic'),'data':{},'editFlag':true,'type':'special'} );
					me.attrs.newExplaincommonMarket = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.newExplainSpecialMarket = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':'special'} );
					
					break;
				  
				 //增购办公版订单
				case 'addOffice':
					me.setNavTitle( '增购办公版', '增购办公版特批');
					
					me.attrs.addOrderCommonOffice = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.addOrderSpecialOffice = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.addExplaincommonOffice = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.addExplainSpecialOffice = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':'special'} );
					
					me.setOrderInfo();
					
					break;
					
				 //增购营销版订单
				case 'addMarkey':
					me.setNavTitle( '增购营销版', '增购营销版特批');
					
					me.attrs.addOrderCommonMarkey = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.addOrderSpecialMarkey= new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.addExplaincommonMarkey = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.addExplainSpecialMarkey = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':'special'} );
					
					me.setOrderInfo();
					
					break;
					
				//续费办公版订单
				case 'againOffice':
				
					me.setNavTitle( '续费办公版', '续费办公版特批');
					
					me.attrs.againOrderCommonOffice = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.againOrderSpecialOffice= new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.againExplaincommonOffice = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.againExplainSpecialOffice = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':'special'} );
					
					me.setOrderInfo();
					
					break;
					
				//续费营销版订单
				case 'againMarkey':
				
					me.setNavTitle( '续费营销版', '续费营销版特批');
					
					me.attrs.againOrderCommonMarkey = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.againOrderSpecialMarkey = new OrderInfo( { 'wrapper':me.$view.find('.common-market-basic'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.againExplaincommonMarkey = new Explain( { 'wrapper':me.$view.find('.common-market-explain'),'data':{},'editFlag':true,'type':'common'} );
					me.attrs.againExplainSpecialMarkey = new Explain( { 'wrapper':me.$view.find('.special-market-explain'),'data':{},'editFlag':true,'type':'special'} );
					
					me.setOrderInfo();
					
					break;	
				default:
				  
			}
		},
		//设置订单文字
		setNavTitle:function( common, special ){
			var me = this;
			me.$('.common-title').text( common )
			me.$('.special-title').text( special )
		},
		//渲染订单和产品基础信息：
		setOrderInfo:function(){
			var me = this;
			
		},
		//获取全部订单数据
		getOrderInfo:function(){
			var me = this,objData = {};
			var basicData = {}, productData = {}, invoiceData = {};
			
			
			switch( me.attrs.typeFlag )
			{
				//新购办公版类型
				case 'newOffice':
	
					
					break;
					
				//新购营销版类型
				case 'newMarket':
		
					
					break;
				  
				 //增购办公版订单
				case 'addOffice':
	
					
					break;
					
				 //增购营销版订单
				case 'addMarkey':
		
					
					break;
					
				//续费办公版订单
				case 'againOffice':
			
					
					break;
					
				//续费营销版订单
				case 'againMarkey':
				
					
					
					break;	
				default:
				  
			}
			
			
			//basicData = me.attrs.commonMarkey.getValue();
			$.extend(true, objData, basicData,productData,invoiceData);

		},
		cancelEve: function(){
			
			var me = this; 
			
			switch( me.attrs.typeFlag )
			{
				//新购返回
				case 'newOffice','newMarket':
					
					location.hash = "#agentsupport/entprisefiling";
					break;
				default:
				   location.hash = "#agentsupport/entprisefiling";
			}
		},
    } );

    exports.init = function(param) {
		var $el = exports.$el;
		param = param || [];
		console.log(param)
		if(param.length<1){
			
			return false;
		}
        var newMarketing = new NewMarketing( { 'view':$el,'typeFlag':param[0]} );
    }
} );