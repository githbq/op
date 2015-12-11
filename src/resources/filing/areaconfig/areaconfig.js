define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    require('common/widget/ztree/ztree');
    var areacontent = require('./template.html');
    var Slider = require('common/widget/slider/slider');


    /**
     *
     * 增加区域节点
     */
    var AddArea = MClass( Slider ).include({
        content: areacontent,
        defaultAttr: {
            'width': 200,
            'title': '增加区域节点'
        },
        
        events: {
            'click .add': 'addEve'
        },

        init: function(){
            AddArea.__super__.init.apply( this , arguments );
        },
        
        //增加区域节点
        addEve: function(){
            var me = this;

            util.api({
                'url':'~/op/api/region/addregion',
                'data': {
                    'code': me.model.get('code'),
                    'parentCode': me.parentNod.code,
                    'name': me.model.get('name')
                },
                'success': function( data ){
                    console.warn( data );
                    if( data.success ){
                        
                        me.trigger('addNod', me.parentNod, data.value.model );
                        util.showTip("增加区域节点成功");
                        me.hide();
                    }
                }
            })
        },
        
        show: function( treeNode ){
            var me = this;

            me.parentNod = treeNode;
            AddArea.__super__.show.apply( this , arguments );
        },
        hide: function( ){
            var me = this;

            me.parentNod = null;
            AddArea.__super__.hide.apply( this , arguments );
        }
    });

    exports.init = function( param ){
    	var $el = exports.$el;

        //增加新的区域节点
        var addArea = new AddArea();

        addArea.on('addNod',function( parentNod,node ){

            treeArea.tree.addNodes( parentNod, node );
        });
        
        /**
         *
         * 区域树
         */
        var TreeArea = MClass( M.Event ).include({
            setting: {
                view: {
                    dblClickExpand: false,
                    showLine: true,
                    selectedMulti: false,
                    addHoverDom: function( treeId,treeNode ){
                        var sObj = $("#" + treeNode.tId + "_span");
                        if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
                        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                            + "' title='add node' onfocus='this.blur();'></span>";
                        sObj.after(addStr);
                        var btn = $("#addBtn_"+treeNode.tId);
                        if (btn) btn.bind("click", function(){
                            
                            addArea.show( treeNode );
                            /*
                            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                            zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
                            return false;
                            */
                        });
                    },
                    removeHoverDom: function( treeId,treeNode ){
                        $("#addBtn_"+treeNode.tId).unbind().remove();
                    },
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
                    enable: true,
                    editNameSelectAll: false,
                    showRemoveBtn: true,
                    showRenameBtn: false
                },
                callback: {
                    beforeRemove: function( treeId, treeNode ){

                        var bool = confirm( "是否删除"+ treeNode.name + "这个节点?" );
                        if( bool ){
                            util.api({
                                'url': '~/op/api/region/deleteregion',
                                'data': {
                                    'code': treeNode.code,
                                },
                                success: function( data ){
                                    if( data.success ){
                                        util.showTip("删除区域节点成功");
                                        treeArea.tree.removeNode( treeNode );
                                    }
                                }
                            })
                        }
                        return false;
                    },
                    onRemove: function(){
                        console.log('remove')
                        return false
                    }
                }
            },

            init: function( dom ){
                this.$tree = $( dom );
                this.getAllArea();
            },

            //获取所有区域数据
            getAllArea: function(){
                var me = this;

                util.api({
                    'url': '~/op/api/region/getall',
                    'success': function( data ){
                        if( data.success ){

                            me.tree = $.fn.zTree.init( me.$tree , me.setting , data.value.model );
                            me.tree.expandAll( true );
                        }
                    }
                })
            }
        });

        treeArea = new TreeArea( $el.find('#areatree')[0] );
        /*
        console.log('ztree')
        var t = $el.find(".m-ztree");
            t = $.fn.zTree.init(t, setting, zNodes);
            //var zTree = $.fn.zTree.getZTreeObj("tree");
            //zTree.selectNode(zTree.getNodeByParam("id", 101));
        */
    }
})
