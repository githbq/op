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
            'class':'rolesDialog',
            'title': '分配部门',
            'width': 650
        },
        elements:{

        },
        events:{
        
        },
        content:contentStr,
        init: function(){
            CustomHelper.__super__.init.apply(this,arguments);
            this.rTree = null;
        },
        show: function(functions,opitons,types){
            var me = this;
            CustomHelper.__super__.show.apply(this,arguments);
          
        },

        hide: function(){
			var me = this;
			me.remove();
            CustomHelper.__super__.hide.apply(this,arguments);

        }
       
	})

        
	module.exports = CustomHelper;
});
