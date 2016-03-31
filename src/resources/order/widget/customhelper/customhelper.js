/**
 *  部门树 模块 
 *  
 *
 */

define( function(require, exports, module){
	
	var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Dialog = require( 'common/widget/dialog/dialog' );

	var contentStr = require('./customhelper.html');
	
	var CustomHelper = MClass( Dialog ).include({
        defaultAttr:{
            'title': '联合跟进人',
            'width': 650
        },
        elements:{
			'.custom-helper':'customHelper'
        },
        events:{
			'click .action-add':'actionAdd',
			'click .action-cancel':'actionCancelEve',
			'click .action-save':'actionSaveEve'
        },
        content:contentStr,
        init: function(){
            CustomHelper.__super__.init.apply(this,arguments);
            var me = this;
			me.attrs.listObjet = [];
			
			me.$('.list').on('click','li',function(){
				var tempPerson = $(this).find('a').text();
				me.$customHelper.val(tempPerson);
				var tempId = $(this).attr('data-id')
				me.$customHelper.attr('data-id',tempId);
				me.$('.list').empty();
				me.$('.list').hide();
			});
			
			me.$view.on('click', function (e) {
				
				var target = $(e.target);

					if(target.closest(".list").length == 0){
						me.$('.list').empty();
						me.$('.list').hide();
					}
			});

			me.$customHelper.on('blur', function () {
                var tempName = me.$customHelper.val(),
                    flag = false;
                me.attrs.listObjet.length > 0 && me.attrs.listObjet.forEach(function (item) {
                   if (item.name == tempName) {
                        flag = true;
                        return false;
                    }
                })
                if (flag) {
                    return false;
                }
                me.$customHelper.val('');
                me.$customHelper.attr({
                    'data-id': '-1'
                });
				
            });

			me.$customHelper.on('input',function(){
				var customer = me.$customHelper.val();
				util.api({
					'url': '~/op/api/s/activity/getcompanys',
					'data': {
						'companyName': customer,
						'companyType': 0,
						'pageIndex': 0,
						'pageSize': 10
					},
					'success': function (data) {
						console.warn(data);
						if (data.success) {
							
							var strDom =''; 
							me.$('.list').show();
							me.$('.list').empty();
							me.attrs.listObjet = data.value.model.content;
							data.value.model.content.forEach(function (item) {
								strDom += '<li class="list-item" data-id="'+item.id+'"><a>'+item.name+'</a></li>'
								
							});
							me.$('.list').html( strDom );
						}
					}
				})
			});
			
			//删除跟进人：
			me.$view.on('click', 'a.badge', function(){
				var id = $(this).attr('data-id');
				$(this).remove();
				me.delCustomHelper(id);
			})
        },
        show: function(opitons){
            
            CustomHelper.__super__.show.apply(this,arguments);
			
			var me = this;
			me.attrs.list= [];
			me.getCustomHelper();
          
        },
		//获取现有跟进人信息：
		getCustomHelper:function(){
			var me = this;
			
			util.api({
				'url': '~/op/api/order/enterprise/getEnterprisePartners',
				'data': {
					'enterpriseId': me.attrs.options.enterpriseId
				},
				'success': function (data) {
					console.warn(data);
					if (data.success) {
						
					
					}
				}
			})
			
			me.showCustomHelper();
			
		},
		//展示现有跟进人：
		showCustomHelper:function(){
			var me = this;
			 me.$view.find('.custom-box').empty();
			var obj = me.attrs.list;
			for(var i=0;i<obj.length;i++){
				me.$view.find('.custom-box').append(' <a class="badge" data-id="'+obj[i].id+'" >'+obj[i].name+' x </a>');
			}
		},
		//删除跟进人：
		delCustomHelper:function( id ){
			var me = this;
			
			for(var i=0;i< me.attrs.list.length;i++){
				if( me.attrs.list[i].id == id){
					me.attrs.list.splice(i,1)
					return false;
				}
			} 
		},
		//添加跟进人：
		actionAdd:function( e ){
			var me = this;
			if(me.$customHelper.val() && me.attrs.list.length<5){
				var personObj={};
				var id = me.$customHelper.attr('data-id');
				for(var i=0;i<me.attrs.list.length;i++){
					if(me.attrs.list[i].id==id){
						util.showToast('跟进人已存在');
						return false;
					}
				}
				personObj.id=id;
				personObj.name=me.$customHelper.val();
				me.$view.find('.custom-box').append(' <a class="badge" data-id="'+id+'" >'+me.$customHelper.val()+' x </a>');
				me.attrs.list.push(personObj);
			}
		},
		actionCancelEve:function(){
			var me = this;
			me.hide();
		},
		//保存联合跟进人
		actionSaveEve:function(){
			var me = this;
			
		},

        hide: function(){
			var me = this;
			me.remove();
            CustomHelper.__super__.hide.apply(this,arguments);

        }
       
	})

        
	module.exports = CustomHelper;
});
