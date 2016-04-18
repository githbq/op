/**
 * 
 * 快递模块
 */
define(function(require, exports, module){

	var contentStr = require('./express.html');
	var Dialog = require('common/widget/dialog/dialog');

	//快递详情
	var ExpressInfo = MClass( Dialog ).include({

		content: contentStr,
		
		defaultAttr:{
			'title': '快递信息',
			'width': '400'
		},

		events:{
			'click .submit': 'saveEve'
		},

		init: function(){
			ExpressInfo.__super__.init.apply( this, arguments );
		},

		show: function( id ){
			var me = this;
			ExpressInfo.__super__.show.apply( this, arguments );
		
			console.log( id );

			util.api({
				'url': '/odr/invoice/' + id,
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						me.model.load( data.value.model );
					}
				}  
			})
		},

		//保存快递信息
		saveEve: function(){
			var me = this;

			console.log('saveEve');

			if( !me.model.get('expressName') ){
				util.showToast('请填写快递公司');
				return false;
			}

			if( !me.model.get('expressNo') ){
				util.showToast('请填写快递单号');
				return false;
			}


			//
			/*
			util.api({
				'url': '/odr/invoice/updateExpress',
				'data': {
					'id': me.model.get('id'),
					'expressStatus': me.model.get('expressStatus'),
					'expressName': me.model.get('expressName'),
					'expressNo': me.model.get('expressNo')
				},
				'success': function( data ){
					
				}
			});
			*/
		}
	})

	module.exports = ExpressInfo;

});
