define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Pagination = require('common/widget/pagination/pagination');
	var Slider = require('common/widget/slider/slider');
    var uploader = require('common/widget/upload').uploader;
	

    /**
     * 企业列表
     */
    var QuestionBack = MClass( M.Center ).include({

    	init: function(){
    		QuestionBack.__super__.init.apply( this,arguments );
    		var me = this;
    		me.render();
    	},

        elements:{
			'.form-box .email-text':'emailText',
            '.form-box .suggest-text':'suggestText',
        },

        events:{
           'blur .form-box .email-text': 'emailEve',
		   'click .form-box .form-submit': 'submitEve',
        },
		emailEve:function(){	
			var me = this;
			var strEmail = me.$emailText.val();
			var  reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
			if(!reg.test(strEmail)){
				util.showToast('邮箱格式不对！');
				me.$emailText.val('');
			}
		},
		submitEve:function(){
			var me = this;
			var strEmail = me.$emailText.val();
			var strSuggest = me.$suggestText.val();
			var  reg = /^\s+$/;
			var objData ={};
			
			if(!strEmail){
				util.showToast('邮箱不能为空！');
				me.$emailText.val('');
				return false;
			}
		
			if(reg.test(strSuggest)||!strSuggest){
				util.showToast('请填写反馈意见后提交');
				return false;
			}
			objData['mail'] = me.model.get('emailValue');
			objData['content'] = me.model.get('suggestion');
			util.api({
				'url':'~/op/api/feedback/submit',
				'data':objData,
				'success': function( data ){
					if( data.success ){
						util.showTip( '反馈成功，我们会及时回信！' );
					}
				}
			});
		},
        render:function(){
			//this.attrs.wrapper.html(this.$view);
		}
        
    });
	
	
    exports.init = function( param ) {
        var $el = exports.$el;
		var questionBack = new QuestionBack({'view':$el.find('.m-questionlist')} );
        

    }
} );

