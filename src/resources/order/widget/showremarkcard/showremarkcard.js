/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){

    var DialogImg = require('./dialog');
    var Tem = $( require('./template.html') );

    /**
     * 查看审批备注图片
     */
 /*   var ShowRemarkCard = MClass( Dialog ).include({

        defaultAttr:{
          'title': '查看审批备注图片',
           'width': 800
        },
		elements: {
           
        },

        events: {
          
        },

        content: Tem.filter('#modifyPhone').html(),

        init: function(){
            ShowRemarkCard.__super__.init.apply( this, arguments );
        },
        //到款认领
        show: function( imgList ){ 
            ShowRemarkCard.__super__.show.apply( this, arguments );
            var me = this;          

        },
		
        hide: function(){
            var me = this;
			//me.$('.header-close').trigger("click")
            ShowRemarkCard.__super__.hide.apply( this, arguments );
        }
    });*/
    var dialog = DialogImg.getInstance(null,
        {
            defaultAttr: {
                title: '查看审批备注图片',
                width: 800
            },
            content: require('./dialogtemplate.html')
        }
    );

    dialog.bootstrap([], function (app) {
        app.controller('dialogController', ['$scope', '$timeout', 'select2Query', function ($scope, $timeout, select2Query) {

        }]);
    });

	module.exports = dialog;
});
