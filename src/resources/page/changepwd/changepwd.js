define( function(require, exports, module){

	exports.init = function(){
		var $el = exports.$el;

		var $cpwd = $el.find('.currentpwd'),
			$npwd = $el.find('.newpwd'),
			$rpwd = $el.find('.repeatpwd');

		var $submit = $el.find('.action-submit'),
			$return = $el.find('.action-return');

		

		$submit.on('click',function(){
			if( $rpwd.val() != $npwd.val() ){
				util.showToast('两次输入密码不一致 请重新输入');
				return;
			}

			util.api({
				'url': '~/op/api/password/updatepassword',
				'data': {
					'oldPassword': $cpwd.val(),
					'newPassword': $npwd.val(),
					'ensurePassword': $rpwd.val()
				},
				'success': function( data ){
					console.warn( data );
					if( data.success ){

						util.showTip('修改密码成功');

						$cpwd.val('');
						$npwd.val('');
						$rpwd.val('');
						history.back();
					}
				}
			});

		});

		$return.on('click',function(){
			history.back();
		});

	}
});
