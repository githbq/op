define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
    
    var Pagination = require( 'common/widget/pagination/pagination' );
    var tpl = $( require( './template.html' ) );
    var Slider = require( 'common/widget/slider/slider' );
    var Dialog = require('common/widget/dialog/dialog');
    
    var CreatePolicy = MClass( Slider ).include({
        content: tpl.filter('#crPolicy').html(),
        defaultAttr:{
            'width': 900
        },
        events:{
            'click #preview': 'preview',
            'click #release': 'release',
            'click #cancel': 'hide'
        },
        
        elements:{
            '#title': 'title',
            '#sequence': 'sequence'
        },

        init: function(){
            CreatePolicy.__super__.init.apply( this, arguments );
            var me = this;
            //me.initializeEditor();
        },

        show: function(id){
            CreatePolicy.__super__.show.apply( this,arguments );
            var me = this;
            me.id = id;
            if(!me.editorInitialized){//只激活一次
                me.initializeEditor();
            }
            if(id){
                util.api({
                    url: '~/op/api/policy/getpolicy',
                    data: {
                        id: me.id
                    },
                    success: function(res) {
                        me.$title.val(res.model.title);
                        me.$sequence.val(res.model.sortKey);
                        KindEditor.html('#editor', res.model.content);
                    }
                });
                return;
            }
            me.$title.val(sessionStorage.title);
            me.$sequence.val(sessionStorage.sortKey);
            KindEditor.html('#editor', sessionStorage.content);
        },

        initializeEditor: function() {
            var me = this;
            KindEditor.options.filterMode = false;//不过滤html标签
            me.editor = KindEditor.create('#editor',{
                resizeType: 0,
                items: [
                 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste', 'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript', 'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'emoticons', 'pagebreak', '|', 'about'
                ]
            });
            me.editorInitialized = true;
        },
        
        hide: function() {
            CreatePolicy.__super__.hide.apply( this,arguments );
            var me = this;
            if(me.id){
                me.id = '';
                KindEditor.html('#editor','');
                return;
            }
            sessionStorage.title = me.$title.val();
            sessionStorage.sortKey = me.$sequence.val();
            (me.editor)&&(sessionStorage.content = me.editor.html());
        },

        preview: function(){
            var me = this;
            var title = me.$title.val(),
                sequence = me.$sequence.val(),
                content = me.editor.html();
            if(!title) {
                util.showToast('请输入标题');
                return;
            }

            if(!sequence ){
                util.showToast('请输入排序');
                return;
            }

            if(!content){
                util.showToast('请输入内容');
                return;
            }
            var newPolicy = {
                                'title': title, 
                                'sortKey': sequence, 
                                'con': content,
                                'id': me.id
                            };
            util.api({
                url: '~/op/api/policy/allpolicy',
                success: function( data ) {
                    if ( data.success ) {
                        var aCon = data.value.model.content;
                        if(me.id){
                            for(var i = 0, len = aCon.length; i < len; i++){
                                if(me.id == aCon[i].id){
                                    aCon.splice(i, 1);//若修改 删去原有
                                    break;
                                }
                            }
                        }
                        if(aCon.length > 0) {
                            for(var i = 0, len = aCon.length; i < len; i++){
                                
                                if(newPolicy.sortKey == aCon[i].sortKey){//判断重复排序
                                    util.showToast('排序重复');
                                    return;
                                }
                                if(newPolicy.sortKey < aCon[i].sortKey){//插入新政策
                                    aCon.splice(i,0,newPolicy);
                                    break;
                                }
                                if(i == aCon.length - 1){//没有比新政策排序大的，新政策放最后
                                    aCon.push(newPolicy);
                                    break;
                                }
                            }
                        }else{
                            aCon.push(newPolicy);
                        }
                        me.trigger('preview', aCon );
                    }
                },
            });
        },

        release: function(){
            var me = this;
            var url;
            var title = me.$title.val(),
                sequence = me.$sequence.val(),
                content = me.editor.html();
            if(!title) {
                util.showToast('请输入标题');
                return;
            }
            if(!sequence) {
                util.showToast('请输入排序');
                return;
            }
            if(!content) {
                util.showToast('请输入内容');
                return;
            }

            me.id? url = '~/op/api/policy/updatepolicy' : url = '~/op/api/policy/addpolicy';
            util.api({
                url: url,
                data: {
                    content: content,
                    sortKey: sequence,
                    title: title
                },
                success: function( res ){
                    if(res.success){
                        me.hide();
                        util.showTip('发布成功');
                        me.trigger('refresh');
                        KindEditor.html('#editor', '')
                        sessionStorage.clear();
                    }
                }
            });
        }
    });

     
    var Preview = MClass( Dialog ).include({
        content: tpl.filter('#preview').html(),
        defaultAttr:{
            'title': '',
            'width': 900,
        },
        events:{
            'click .accordian h4': 'showAccordian'
        },
        elements:{
            '.policyItems': 'policyItems'
        },
        init: function(){
            Preview.__super__.init.apply( this, arguments );
            var me = this;

        },
        show: function(aCon){
            Preview.__super__.show.apply( this,arguments );
            var me = this;
            me.load(aCon);
        },
        load: function(aCon) {
            var me = this;
            var list = '';
            $(aCon).each(function(i, item) {
                list += '<div class="accordian">'
                        +'<h4 data-id="'+item.id+'"><em class="dot"></em><span class="title">'+item.title+'</span><span class="arrow"></span></h4>'
                        +'<div class="content">'+(item.con||'')+'</div>'
                        +'</div>';
            });
            me.$policyItems.html(list);
                
        },
        showAccordian: function(e) {//展开一条
            var target = e.currentTarget,
                id = $(target).attr('data-id'),
                $parent = $(target).parent(),
                $content = $(target).next('.content');

            //进行显示隐藏切换
            if( $parent.hasClass('spread') ) {
                $parent.removeClass('spread');
                $content.slideUp(300);
                return;
            }
            if( !$content.html() ){
                util.api({
                    url: '~/op/api/policy/getpolicy',
                    data: {
                        id: id
                    },
                    beforeSend: function(){
                        $content.html('载入中...');
                    },
                    success: function(res){
                        $content.html(res.model.content);
                    },
                    error: function(){
                        $content.html('载入失败');
                    }
                });
            }
            $parent.addClass('spread');
            $content.slideDown(200);
          
        },
        hide: function(){
            Preview.__super__.hide.apply( this,arguments );
            this.$policyItems.html('');

        },
    });
   

    var PolicyList = MClass( M.Center ).include( {
        tplCode: _.template( tpl.filter( '#trPolicy' ).html() ),
        PAGESIZE: 20,
        elements: {
            '#title': 'title',
            'tbody': 'tbody'
        },
        events: {
            'click #create': 'create',
            'click #search': 'search',
            'click .check': 'check',
            'click .delete': 'delete'
        },
        init: function() {
            PolicyList.__super__.init.apply( this, arguments );
            var me = this;
            me.pagination = new Pagination({
                wrapper: me.$view.find('.list-pager'),
                pageSize: me.PAGESIZE,
                pageNumber: 0
            });
            me.pagination.render();
            me.pagination.onChange = function() {
                me.load();
            };
            
            me.collection = new M.Collection;
            me.load();
        },
        //新建活动
        create: function() {
            this.trigger('modify');
        },
        //查看活动
       
        check: function(e) {
            var id = $( e.currentTarget ).attr('data-id');
            var me = this;
            me.trigger('modify', id );
        },

        search: function() {
            this.pagination.setPage( 0, false);
            this.load();
        },

        load: function() {
            var me = this;
            util.api({
                url: '~/op/api/policy/policylist',
                data: {
                    title: me.$title.val(),
                    pageIndex: me.pagination.attr['pageNumber']+1,
                    pageSize: me.pagination.attr['pageSize']
                },
                beforeSend: function() {
                    me.$tbody.html( '<tr><td colspan="7"><p class="info">加载中...</p></td></tr>' );
                },
                success: function( data ) {
                    if ( data.success ) {
                        me.pagination.setTotalSize( data.value.model.itemCount );
                        me.collection.reload( data.value.model.content, function( item ) {
                        } );
                        var content = me.collection.all();
                        if ( content.length > 0 ) {
                            me.$tbody.html( me.tplCode( {'content':me.collection.all() } ) );
                            IBSS.tplEvent.setPermissions( me.$tbody );
                        } else {
                            me.$tbody.html( '<tr><td colspan="7"><p class="info">暂无数据</p></td></tr>' );
                        }
                    }
                },
                error: function() {
                    me.$tbody.html( '<tr><td colspan="7"><p class="info">数据加载失败</p></td></tr>' );
                }
            });
        },
        //删除
        delete: function(e){
            var id = $( e.curentTarget ).attr('data-id'),
                me = this;
                c = confirm('确认要删除吗？');
            if(!c){
                return;
            }
            util.api( {
                'url': '~/op/api/policy/deletepolicy',
                'data': {
                    id: id
                },
                success: function(res){
                    if(res.success){
                        util.showTip('删除成功');
                        me.load();
                    }
                }
            });
        }
    } );

    exports.init = function() {
        var $el = exports.$el;
        var policyList = new PolicyList( { 'view': $el.find( '.m-promote-policy' ) } );
        var createPolicy = new CreatePolicy({'title':'注意事项'});
        var preview = new Preview();

        policyList.on('modify', function( id ){
            createPolicy.show( id );

        }); 

        createPolicy.on('refresh', function(){
            policyList.load();
        });

        createPolicy.on('preview', function(aCon){
            preview.show(aCon);
        });

       

        

    }
} );