/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){


    var Dialog = require('common/widget/dialog/dialog');
    var contentStr = require('./teamtree.html');
    var temStr = require('./template.html');

    /**
     * 选择区域
     */
    var AreaTree = MClass( Dialog ).include({
        
        content: contentStr,

        litpl: _.template( temStr ),

        defaultAttr: {
            'title': '选择团队',
            'width': 300
        },
        
        events: {
            'click .action-sure': 'sureEve',
            'click li': 'getChildrenEve',
            'click .select': 'selectEve'
        },

        elements: {
            '.tree-action': 'action'
        },

        //初始化
        init: function( attrs ){
            AreaTree.__super__.init.apply( this, arguments );
            
            var me = this; 
            me.list = null;
            console.log( temStr );
        },

        //确定
        sureEve: function(){
            var me = this;

            var nodes = me.tree.getCheckedNodes(true);
            me.trigger( 'selectarea', nodes );
            me.hide();
        },

        //
        getAll: function(){
            var me = this;

            util.api({
                'url':'/activity/getsubdept',
                'data':{
                    'companyId': me.companyId,
                    'parentId': 0
                },
                'success': function( data ){
                    if( data.success ){
                        me.list = data.value.model;
                        var contentstr;
                        if( data.value.model.length > 0 ){
                            contentstr = me.litpl({'content':data.value.model});
                        }else{
                            contentStr = "<p>暂无数据</p>"
                        }
                        me.$view.find('.m-teamtree').html(contentstr);
                    }
                }
            })
        },

        getChildrenEve: function(e){
            var me = this;
            var $li = $(e.currentTarget);

            e.stopPropagation();

            $li.toggleClass('active');
            me.resize();
            if( $li.hasClass('complete') ) return;

            util.api({
                'url':'/activity/getsubdept',
                'data':{
                    'companyId': me.companyId,
                    'parentId': $li.attr('data-id')
                },
                'success': function( data ){
                    if( data.success ){
                        me.list = me.list.concat( data.value.model );
                        var contentStr = me.litpl({'content':data.value.model});
                        $li.append(contentStr);
                        $li.addClass('complete');
                        me.resize();
                    }
                }
            })

        },
        selectEve: function(e){
            e.stopPropagation();

            var me = this;
            var id = $(e.currentTarget).attr('data-id');
            var data;

            for(var i =0; i<me.list.length;i++){
                if( id == me.list[i]['id']){
                    data = me.list[i];
                    break;
                }
            }
            me.trigger('select',data);
            me.hide();
        },
        //显示
        show: function( companyId ){
            var me = this;

            me.companyId = companyId;
            me.getAll();
            AreaTree.__super__.show.apply( this, arguments );
        },

        //隐藏
        hide: function(){
            var me = this;
            me.list = null;
            me.companyId = null;
            AreaTree.__super__.hide.apply( this, arguments );
        }
    })

	module.exports = AreaTree;
});
