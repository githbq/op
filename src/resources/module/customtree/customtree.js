/**
 * 通用树 模块
 *    var Ztree = me.Ztree = new Ztree({
				elem: me.$view.find('.Ztree-b'),
				btns: [
					{'name':'添加','event':'add','permissions':'F1021003'},
					{'name':'修改','event':'rm','permissions':'F1021004'},
					{'name':'删除','event':'remove','permissions':'F1021005'},
					{'name':'部门详情','event':'detailInfo','permissions':'F1021002'}
				],
				data: me.data,
				fontCss:me.getFontCss,
				addDiyDom:'addDiyDom'
				});



 用例
 var CustomTree=require('module/CustomTree/CustomTree').getDialog();//新增getNormal  getDialog
 me.CustomTree= new CustomTree({ 'title': 'xxxxx',searchOptions:{show:true,title:'abc'},ztreeOptions:{expandAll:true },ajaxData:{url:'/authrole/getallmodules'}});
 me.CustomTree.on('enter', function (me) {
                    alert(111);

                });
 me.selectModule.show(selecteds, {})
 *
 */

define(function (require, exports, module) {

    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    var Dialog = require('common/widget/dialog/dialog');
    var contentStr = require('./customtree.html');
    var Ztree = require('common/widget/ztree/ztree');
    var Pagination = require('common/widget/pagination/pagination');
    exports.getDialog = function () {
        return getClass(Dialog);
    };
    exports.getNormal = function (inCloudOptions) {

        return getClass(M.Center, inCloudOptions);
    };
    exports.getDialog = function (inCloudOptions) {
        return getClass(Dialog, inCloudOptions);
    };
    function getClass(parent, inCloudOptions) {
        var defaultOptions = {
            defaultAttr: {
                'class': 'rolesDialog',
                'title': '',
                'width': 650
            },
            elements: {
				'.no-data':'noData',
                '.name': 'name',
                '.panel-content': 'content'
			},
            events: {
                "click .enter": 'onEnter',
                'click .cancel': 'onCancel',
                'click .search': 'onSearchTree'
            },
            content: contentStr,
            init: function () {
                var me = this;
                CustomTree.__super__.init.apply(this, arguments);
                if (parent === M.Center) {
                    var treeContent = me.$view.find('.tree-content');
                    if (treeContent.length > 0) {
                        treeContent.empty().append(me.content);
                    } else {
                        me.$view.empty().append(me.content);
                    }
                }
            },
            onGetData: function (data) {//ajax请求完成后
                var me = this;
				
                me.data = data.value.model.content ? data.value.model.content : (data.value.model || []);
				if ( me.data.length == 0) {
					me.$view.find('.no-data').show();
					me.$noData.html('未加载到数据！');
				}
                if (me.pagination) {
                    me.pagination.setTotalSize(data.value.model.itemCount);
                }
                return me.data;
            },
            onRenderData: function () {//渲染数据转换
                var me = this;
                $(me.data).each(function (index, item) {
                    return item.name; //= item.name + '  ( ' + item.code + ' )';
                });
                return me.data;
            },
            /**
             * @desc 查询部门树取得查询条件
             */
            onSearchTree: function (e) {
                var me = this;
                var name = $.trim(me.$name.val());
                if(!name){
                    return;
                }
                var target = $(".panel-content li a[title="+ name +"]");
                if( target.length > 0 ){
                    var distance = -200;
                    target.parentsUntil(".m-ztree").filter("li").each(function(index,item){
                        distance += this.offsetTop;
                    });
                    $(".panel-content li a").removeClass('curSelectedNode');
                    target.addClass('curSelectedNode');
                    me.$content.scrollTop(distance); 
                }
                
            }, 

            updateNodes: function (highlight) {
                var me = this;
                var treeObj = me.tree.ztreeObj;
                for (var i = 0; i < me.nodeList.length; i++) {
                    me.nodeList[i].highlight = highlight;
                    treeObj.updateNode(me.nodeList[i]);
                }
            },

            getFontCss: function (treeId, treeNode) {
                //console.log(3)
                if (treeNode.highlight) {
                    return {color: "#A60000", "font-weight": "bold"};
                } else {
                    return {color: "#333", "font-weight": "normal"};
                }
            },

            show: function (selecteds, options, nodialog) {
                var me = this;
                me.attrs = me.attrs || {};
                var defaults = {searchOptions: {}, ztreeOptions: {}, ajaxData: {}};
                me.newOptions = $.extend(defaults, me.attrs, options);
                me.selecteds = selecteds ? selecteds : [];

                if (me.newOptions.noDialog === true) {
                    me.$('.panel-footer').hide();
                }
                if (parent === Dialog) {
                    CustomTree.__super__.show.apply(this, arguments);
                }
                //搜索栏可用   show用来配置是否显示搜索栏 title文件框的名称  key搜索时加入的KEY
                if (me.newOptions.searchOptions && me.newOptions.searchOptions.show && me.newOptions.searchOptions.title) {
                    me.$('.tree-panel-header').show();
                    me.$('.search-title').text(me.newOptions.searchOptions.title);
                } else {
                    me.$('.tree-panel-header').hide();
                }
                if (me.newOptions.searchOptions && me.newOptions.searchOptions.showPager) {//显示分页
                    me.pagination = new Pagination({
                        'wrapper': me.$view.find('.list-pager'),
                        'pageSize': 20,
                        'pageNumber': 1
                    });
                    me.pagination.render();
                    me.pagination.onChange = function () {
                        me.getList();
                    };
                } else {
                    me.newOptions.searchOptions = {};//补全
                }
                me.ajaxSearch();
            },
            ajaxSearch: function () {
                if (this.pagination) {
                    this.pagination.setPage(0, false);
                }
                this.getList();

            },
            getList: function () {
                var me = this;
                if (me.pagination) {//显示分页
                    var data = {
                        'pageIndex': me.pagination.attr['pageNumber'],
                        'pageSize': me.pagination.attr['pageSize']
                    };
                    if (me.newOptions.searchOptions.searchKeys) {
                        $(me.newOptions.searchOptions.searchKeys).each(function (i, n) {
                            data[n] = me.model.get(n);
                        })
                    }
                    me.newOptions.ajaxData.data = me.newOptions.ajaxData.data || {};
                    $.extend(me.newOptions.ajaxData.data, data);
                }
                var defaultAjaxData = {
                    url: '',
                    data: me.newOptions.ajaxData.data || {},
                    success: function (data) {
                        if (data.success) {

                            me.data = me.onGetData(data);
                            me.$('.loading').hide();
                            var willRenderData = me.onRenderData();
                            me.willRenderData = willRenderData;
                            if (!me.tree) {
                                var ztreeOptions = {
                                    elem: me.$('.z-tree'),
                                    data: willRenderData,
                                    showCheck: true,
                                    showEditeBtn: false,
                                    chkStyle: 'checkbox',
                                    chkboxType: {"Y": "", "N": ""},
                                    expandAll: true,
                                    fontCss: me.getFontCss,
                                    callback: {
                                        onCheck: function zTreeOnCheck(event, treeId, treeNode) {
                                            if (treeNode.checked && $.inArray(treeNode.id, me.selecteds) < 0) {
                                                me.selecteds.push(treeNode.id);
                                            } else {
                                                var newSelecteds = [];
                                                for (var i = 0; i < me.selecteds.length; i++) {
                                                    if (me.selecteds[i] != treeNode.id) {
                                                        newSelecteds.push(me.selecteds[i].id);
                                                    }
                                                }
                                                me.selecteds = newSelecteds;
                                            }

                                        }
                                    }
                                };
                                me.newOptions.ztreeOptions.callback = $.extend(ztreeOptions.callback, me.newOptions.ztreeOptions.callback);
                                me.newOptions.ztreeOptions = $.extend(ztreeOptions, me.newOptions.ztreeOptions);
                                var CTree = Ztree.extend({id: Math.random().toString().substr(2, 5)});
                                me.tree = new CTree(ztreeOptions);
                            } else {
                                $(me.tree.ztreeObj.getNodes()).each(function (i, n) {
                                    me.tree.ztreeObj.removeNode(n);
                                });
                                me.tree.ztreeObj.addNodes(null, willRenderData);
                            }
                            !me.newOptions.noDialog && me.resize();

                            me.tree.setChecked(me.selecteds);

                            me.tree.ztreeObj.expandAll(me.newOptions.ztreeOptions.expandAll);

                            me.trigger('afterTreeRender', me);
                        }
                    },
					error:function(){
						me.$noData.html('加载失败!')
					}
                };

                me.newOptions.ajaxData = $.extend({}, defaultAjaxData, me.newOptions.ajaxData);
                util.api(me.newOptions.ajaxData);
            },
            onEnter: function () {
                var me = this;

                var result = !me.tree?null: me.tree.getCheckedListNodes();
                if( result && result.length > 0){
                    me.trigger('enter', me);
                    me.hide();
                }else{
                    util.showToast('请选择部门');
                }
            },
            getSelectedIds: function () {
                var me = this;
                return me.selecteds;
            },
            getValue: function () {
                var me = this;
                var result =!me.tree?null: me.tree.getCheckedListNodes();
                console.log(result);
                return result;
            },
            onCancel: function () {
                var me = this;
                me.trigger('cancel', me);
                this.hide();
            },
            hide: function () {

                this.remove();
            },
            remove: function () {
                this.tree && this.tree.ztreeObj.destroy();
                CustomTree.__super__.remove.apply(this, arguments);
            }
        };
        if (inCloudOptions) {
            var oldProps = ['defaultAttr', 'elements', 'events'];
            $(oldProps).each(function (i, n) {
                if (inCloudOptions.defaultAttr) {
                    $.extend(defaultOptions[n], inCloudOptions[n]);
                    inCloudOptions[n] = undefined;
                }
            });
            $.extend(defaultOptions, inCloudOptions);
        }
        var CustomTree = MClass(parent).include(defaultOptions);
        return CustomTree;
    }
});
