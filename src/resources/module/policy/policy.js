define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;
    
    var tpl = $( require( './template.html' ) );
    var Dialog = require('common/widget/dialog/dialog');
    
    var Policy = MClass( Dialog ).include({
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
            Policy.__super__.init.apply( this, arguments );
            var me = this;
            me.collection = new M.Collection;

        },
        show: function(){
            Policy.__super__.show.apply( this,arguments );
            var me = this;
            me.load();
        },
        load: function() {
            var me = this;
            var list = '';
            util.api({
                url: '~/op/api/policy/policylist',
                success: function(data){
                    $(data.model.content).each(function(i, item) {
                        list += '<div class="accordian">'
                                +'<h4 data-id="'+item.id+'"><em class="dot"></em><span class="title">'+item.title+'</span><span class="arrow"></span></h4>'
                                +'<div class="content"></div>'
                                +'</div>';
                    });
                    me.$policyItems.html(list);  
                }
            });
        },
        showAccordian: function(e) {//展开一条
            var target = e.currentTarget,
                id = $(target).attr('data-id'),
                $parent = $(target).parent(),
                $content = $(target).next('.content');

            //进行显示隐藏切换
            if ($parent.hasClass('spread')) {
                $parent.removeClass('spread');
                $content.slideUp(300);
                return;
            }
            if (!($content.html())){
                util.api({
                    url: '~/op/api/policy/getpolicy',
                    data: {
                        id: id
                    },
                    beforeSend: function(){
                        $content.html('加载中...');
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
            $content.slideDown(300);
        },
        hide: function(){
            Policy.__super__.hide.apply( this,arguments );
            this.$policyItems.html('');
        }
    });
    module.exports = Policy;
} );