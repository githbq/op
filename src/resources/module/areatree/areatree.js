/**
 *  备案企业 模块 
 *  详情或增加
 *
 */

define( function(require, exports, module){


    var Dialog = require('common/widget/dialog/dialog');
    var contentStr = require('./areatree.html');

    require('common/widget/ztree/ztree');


    /**
     * 选择区域
     */
    var AreaTree = MClass( Dialog ).include({
        
        content: contentStr,

        defaultAttr: {
            'title': '选择区域',
            'width': 300
        },
        
        events: {
            'click .action-sure': 'sureEve'
        },

        elements: {
            '.tree-action': 'action'
        },

        init: function( attrs ){
            AreaTree.__super__.init.apply( this, arguments );
            
            var me = this;
            ///默认配置
            var setting = {
                view: {
                    dblClickExpand: false,
                    showLine: true,
                    selectedMulti: false
                },
                data: {
                    simpleData: {
                        enable:true,
                        idKey: "code",
                        pIdKey: "parentCode",
                        rootPId: ""
                    }
                },
                edit: {
                    enable: false,
                    editNameSelectAll: false,
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                check: {
                    autoCheckTrigger : false,
                    chkboxType : {"Y": "", "N": ""},
                    enable: true,
                    chkStyle: "radio",
                    radioType: "all"
                },
                callback: {
                    'onClick': function( event, treeId , treeNode ){
                        me.tree.checkNode( treeNode ,'', false , true );
                    }
                }
            };
            if( me.attrs.multiSelect === true ){
                setting.check.chkStyle = "checkbox";
                me.$action.show();
            }else{
                me.$action.hide();
            }
            me.setting = setting;
            me.$tree = me.$view.find('#areatree');

            me.getAllArea();
        },

        //确定
        sureEve: function(){
            var me = this;

            var nodes = me.tree.getCheckedNodes(true);
            me.trigger( 'selectarea', nodes );
            me.hide();
        },

        show: function(){
            var me = this;

            me.getAllArea();
            AreaTree.__super__.show.apply( this, arguments );
        },

        hide: function(){
            var me = this;

            me.tree.destroy();
            AreaTree.__super__.hide.apply( this, arguments );
        },

        renderArea: function(){
            var me = this;

            me.tree = $.fn.zTree.init( me.$tree , me.setting , me.areamodel );
            if ( me.attrs.multiSelect === true ) {

            } else {
                
                me.tree.setting.callback.onCheck = function( event, treeId , treeNode ){
                    var bool = confirm( '是否选定区域' + treeNode.name + '?' );
                    if( bool ){
                        me.trigger( 'selectarea', [treeNode] );
                        me.hide();
                    }
                };
            }
            me.tree.expandAll( true );
        },

        //获取所有区域数据
        getAllArea: function(){
            var me = this;

            if ( me.areamodel ){
                me.renderArea();
            }else{
                util.api({
                    'url': '~/op/api/region/getall',
                    'success': function( data ){
                        if( data.success ){
                            me.areamodel = data.value.model;
                            me.renderArea();
                        }
                    }
                })
            }
        }
    })

	module.exports = AreaTree;
});
