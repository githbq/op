/**
 *  部门树 模块 
 *  
 *
 */

define( function(require, exports, module){
	
	var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Dialog = require( 'common/widget/dialog/dialog' );
    var Ztree = require( 'common/widget/ztree/ztree' );
	
	var contentStr = require('./departmentmodel.html');
	
	var DepartmentModel = MClass( Dialog ).include({
        defaultAttr:{
            'class':'rolesDialog',
            'title': '分配部门',
            'width': 650
        },
        elements:{

        },
        events:{
            "click .enter": 'enterEve',
            'click .cancel': 'cancel'
        },
        content:contentStr,
        init: function(){
            DepartmentModel.__super__.init.apply(this,arguments);
            this.rTree = null;
        },
        show: function(functions,opitons,urls){
            var me = this;
            DepartmentModel.__super__.show.apply(this,arguments);
            /*if(oldname){
                $('.editRole #rolename').val(oldname);
                this.oldname = oldname;
                this.id = id;
                this.functions = functions;
            }*/
			me.functions = functions ? functions:[];
            me.objData = opitons||{};
			me.urls = urls || '';
			util.api({
				url:urls,
				data:me.objData,
				success:function(data){
					me.$('.z-tree').empty();
					if(data.success){
						//var $data = data.model.content;
						me.data = data.value.model || [];
						me.data.forEach(function(item,index){
							item.name = item.name + '  ( ' + item.code + ' )';
						});
						me.rTree = new Ztree({
							elem:me.$('.z-tree'),
							data:me.data,
							showCheck: true,
							showEditeBtn: false,
							checkStyle: me.attrs.checkStyle,
							chkboxType:{ "Y": "", "N": "" }
						});
						me.resize();
						me.rTree.setChecked(me.functions);
						me.rTree.ztreeObj.expandAll(true);
					}else{
						me.$('.z-tree').html('<p style="text-align:center; margin:10px 0px;font-size: 20px;">未加载到部门</p>');
					}
				},
				error:function(){
					me.$('.z-tree').html('<p style="text-align:center; margin:10px 0px;font-size: 20px;">加载失败!</p>');
				}
			});
			
        },
        enterEve: function(){
			var me = this;
            //me.getValue();
			me.trigger('assginSuccess');
			me.hide();	
        },

        getValue:function(){
            var me = this;
            var result =  me.rTree.getCheckedListNodes();
			console.log(result)
		   return result;
        },
        cancel:function(){
            this.hide();
        },
        hide: function(){
			var me = this;
			if(me.rTree){
				me.rTree.destroy();
			}
			//me.$('.z-tree').empty();
			me.rTree=null;
            DepartmentModel.__super__.hide.apply(this,arguments);

        },
        remove:function(){
            DepartmentModel.__super__.remove.apply(this,arguments);
        }
	})

        
	module.exports = DepartmentModel;
});
