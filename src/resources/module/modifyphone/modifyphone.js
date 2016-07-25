/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

	var Dialog = require('common/widget/dialog/dialog');
    var Tem = $( require('./template.html') );

    /**
     * 修改手机号
     */
    var ModifyPhone = MClass( Dialog ).include({

        defaultAttr:{
            'title': '手机号码修改',
            'width': 700
        },
		elements: {
            '.oldPhone'   :'oldPhone',
			'.newPhone':'newPhone',
			'.code':'code'
        },

        events: {
          'click .save': 'saveEve',
		  'click .cancle':'cancleEve',
		  'click .getPhone': 'getPhoneEve'
        },

        content: Tem.filter('#modifyPhone').html(),

        init: function(){
            ModifyPhone.__super__.init.apply( this, arguments );
        },
        //到款认领
        show: function( id , status ){ 
            ModifyPhone.__super__.show.apply( this, arguments );
            var me = this;          //0都不可以 1显示到款认领 2查看认领的到款

        },
		saveEve:function(){
			var me = this;
			var oldPhone = me.$oldPhone.val().replace(/(^\s*)|(\s*$)/g, "");
			var newPhone = me.$newPhone.val().replace(/(^\s*)|(\s*$)/g, "");
			if(!oldPhone){
				util.showToast('请输入原手机号');
				return false;
			}
			var re = /^1\d{10}$/;
			
			if( !re.test(oldPhone) ){
				showToast('手机号格式不正确！');
				return false;
			}
			if(!newPhone){
				util.showToast('请输入新手机号');
				return false;
			}
			if(!me.$code.val()){
				util.showToast('请输入验证码');
				return false;
			}
			util.api({
				'url':'~/g/api/account/updateBindingMobile',
				'data':{
					'newMobile': me.$newPhone.val(),
					'oldMobile': me.$oldPhone.val(),
					'code':me.$code.val()
				},
				'success': function( data ){
					if( data.success ){
						util.showTip('修改成功！')
						me.hide();
					}
				}
			});
		},
		getPhoneEve:function(){
			var me = this;
			var re = /^1\d{10}$/;
			var strNum = me.$newPhone.val();
			var OldPhone = me.$oldPhone.val().replace(/(^\s*)|(\s*$)/g, "");
			if( re.test(strNum) && re.test(OldPhone)){
				me.checkPhon();
				
			}else{
				util.showToast('手机号格式不正确！');
				return false;
			}
		},
		changeShowInfo:function(){
			 var me = this;
			me.$('.getPhone').attr('disabled','disabled').css('color','#33aa33');
				me.$('.getPhone').html('<b class="time-s">60</b>后请重新获取');
				var initS = 60;
				var iCount = null;
				 iCount = setInterval(function(){
						if( initS >0){
							initS = initS -1;
							me.$('.time-s').html( initS );
						}else{
							 clearInterval(iCount);
							 iCount = null;
							 me.$('.getPhone').removeAttr('disabled').css('color','#33aa33');
							 me.$('.getPhone').html('重新获取验证码');
						} 
					 }, 1000);
		},
		//绑定验证新旧手机
		checkPhon:function(){
			var me = this;
			util.api({
				'url':'~/g/api/account/getCodeForUpdateBindingMobile',
				'data':{
					'newMobile': me.$newPhone.val(),
					'oldMobile': me.$oldPhone.val()
				},
				'success': function( data ){

					if( data.success ){
						me.changeShowInfo();
					}
				}
			});
		},
		cancleEve:function(){
			var me = this;
			me.hide();
		},
        hide: function(){
            var me = this;
			//me.$('.header-close').trigger("click")
            ModifyPhone.__super__.hide.apply( this, arguments );
        }
    });

	module.exports = ModifyPhone;
});
