define( function(require, exports, module){

	var Dialog = require('common/widget/dialog/dialog');
	var tem = require('./template.html');


	//选择上级
	var SetLeader = MClass( Dialog ).include({
		content: tem,
		defaultAttr:{
			width: 625,
			title: '选择上级'
		},
		events:{
			'click .person-detail': 'selectEve',
			'click .search': 'getlist'
		},
		init: function(){
			SetLeader.__super__.init.apply(this,arguments);
			var me = this;
		},

		show: function(){
			var me = this;


			me.getlist();
			SetLeader.__super__.show.apply( this,arguments );
		},
		
		hide: function(){
			var me = this;
			me.list.clear();
			SetLeader.__super__.hide.apply( this,arguments );
		},

		//获取列表
		getlist: function(){
			var me = this;

			util.api({
				'url': '/channel/getchannelaccountsuperior',
				'data':{
					'name': me.model.get('name')
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){
						me.list.reload( data.value.model );
					}
				}
			})
		},

		//选择上级
		selectEve: function( e ){
			var me = this;
			var $target = $(e.currentTarget);
				$target.addClass('active').siblings().removeClass('active');

			var id = $target.attr('data-id'),
				name = $target.attr('data-name');

			var bool = confirm( "是否设置"+name+"为你的上级?" );
			if( bool ){
				util.api({
					'url': '/channel/setsuperior',
					'data': {
						'accountId': id
					},
					'success': function( data ){
						console.warn( data );
						if( data.success ){
							util.showTip('设置成功');
							me.trigger('setsuccess');
							me.hide();
						}	
					}
				})
			}
		}
	})



	exports.init = function(){
		var $el = exports.$el;

		var setLeader = new SetLeader();

		$el.find('.setleader').on('click',function(){
			setLeader.show();
		})
		setLeader.on('setsuccess',function(){
			searchLeader();
		});

		//查询当前上级
		function searchLeader(){
			util.api({
				'url': '/channel/getchannelsuperior',
				'success': function( data ){
					console.warn( data );
					if( data.success && data.value.model ){
						$el.find('.content-name').text( data.value.model.name);
						$el.find('.content-email').text( data.value.model.email);
						$el.find('.content-mobile').text( data.value.model.mobile);
						$el.find('.content-phone').text( data.value.model.phone);
					}
				}
			})
		}
		searchLeader();

		console.log('设置上级');
	}
});
