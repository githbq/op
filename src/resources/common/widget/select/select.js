define(function(require, exports, module){
	

	/*
	*@ Select 插件
	*/
	var Select = MClass(M.Center).include({

		events:{
			'click .content-text': 'clearEve',
			'click .content-bar': 'barEve',
			'click section': 'selectEve'
		},

		elements:{
			'.select-list': 'selectList',
			'.content-text': 'text'
		},
		
		init: function(){
			Select.__super__.init.apply( this, arguments );
			var me = this;

			
			$('body').on('click',function(e){
				if ($(e.target).closest('.m-select').length == 0) {
					me.$view.removeClass('active');	
				}
			});
		},

		//list显隐切换事件
		barEve: function(){
			var me = this;
			me.$view.toggleClass('active');
		},

		//选择事件
		selectEve: function(e){
			var me = this;
			var $target = $( e.currentTarget );

			var name = $target.text(),
				value = $target.attr('data-id');


			//me.$text.text( name ).attr('data-value', value);
			me.trigger('select', value);
			me.$view.removeClass('active');
		},

		clearEve: function(e){
			var me = this;
			var $target = $( e.currentTarget );

			var name = $target.text(),
				value = $target.attr('data-id');


			//me.$text.text( name ).attr('data-value', value);
			me.trigger('select', value);
			me.$view.removeClass('active');
		}

	});

	module.exports = Select;
});

