define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    
	var Dialog = require('common/widget/dialog/dialog');
    var contentStr = require('./template.html');
    
	/**
     *
     * 回访详情
     */
    var EmployeeDetail = MClass( Dialog ).include({
        
        content: contentStr,
        defaultAttr:{
            'title': '回访员工详情',
            'width': 500
        },
        events: {
            'click .save-info': 'saveInfoEve'
		},
        elements:{
            '.save-info': 'stateSaveInfo'
        },
        
        init: function(){

            EmployeeDetail.__super__.init.apply( this,arguments );
            var me = this;
        
        },

        show: function( ea ,phone ){
            var me = this;

            me.attrs['ea'] = ea || '';
            me.attrs['phone'] = phone||'';

			util.api({
                'url': '/enterprise/getemployeecallbackdetail',
                'data': {
					'ea':ea,
					'mobile':phone
				},
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        
                        me.model.load( data.value.model );

						me.$stateSaveInfo.attr('data-id',data.value.model.id)
                        
						if(data.value.model.admin == '1'){
							me.model.set('admin','是');
						}else{
							me.model.set('admin','否');
						}

                        me.model.set('callbackTimeStr', new Date( data.value.model.callbackTime )._format('yyyy-MM-dd hh:mm') );
						me.model.set('appStartTime', new Date( data.value.model.appStartTime )._format('yyyy-MM-dd hh:mm'));

                        /*
						if(data.value.model.status == '2'){
							me.model.set('reason','无');
						}else if(data.value.model.status == '1'){
							me.model.set('reason',data.value.model.reason);
						}else{
							me.model.set('reason','');
						}
                        */
                    }
                }
            })

 
            EmployeeDetail.__super__.show.apply( this,arguments );
        },

        //提交
		saveInfoEve:function(e){
			var me = this;
			var id = $(e.currentTarget).attr('data-id');
			var dataObj = {};
            
            /*
			if(!me.model.get('status')){
				util.showToast('请选择回访结果是否存疑！');
				return false;
			}
			if(me.model.get('status') == '1' && !me.model.get('reason')){
				util.showToast('请填写存疑原因');
				return false;
			}
            */

			dataObj['id'] = id;
			dataObj['callBackDetail'] = me.model.get('callbackDetail');
			dataObj['visitStatus'] = me.model.get('visitStatus');
			dataObj['suspectStatus'] = me.model.get('suspectStatus');
            dataObj['reason'] = me.model.get('sreason');
			dataObj['storagePath'] = me.model.get('storagePath');

			util.api({
                'url': '/enterprise/updateemployeecallbackdetail',
                'data': dataObj,
				'button': {
						'el': me.$stateSaveInfo,
						'text':'提交中......'
					},
                'success': function( data ){
                    if( data.success ){
                       util.showTip('提交成功！');
					   me.trigger('editSuccess');
					   me.hide();  
                    } 
                }
            })
			
		},

        hide: function(){
            var me = this;
            
            me.model.clear();
           
            EmployeeDetail.__super__.hide.apply( this,arguments );
        }

	});
    
    module.exports = EmployeeDetail;
} );

