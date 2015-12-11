define(function(require, exports, module){

    var InputHandler = MClass(M.Center).include({
        target: null,

        events:{
            'click .ih-clear': 'onClear',
            'click .ih-select': 'onSelectToggle',
            'click section': 'onSelectClick'
        },

        elements:{
            '.select-list': 'selectList',
            '.ih-clear': 'clear',
            '.ih-select': 'select'
        },

        init: function( arg ){
            InputHandler.__super__.init.apply( this, arguments );
            var me = this;
            me.target = arg.target;
            $('body').on('click',function(e){
                if ($(e.target).closest('.m-ih').length == 0) {
                    me.$view.removeClass('active');
                }
            });
        },

        onSelectToggle: function(){
            var me = this;
            me.$view.toggleClass('active');
        },

        //选择事件
        onSelectClick: function(e){
            var me = this;
            var $target = $( e.currentTarget );

            var name = $target.text(),
                value = $target.attr('data-value');

            $( me.target ).val( value );

            //me.$text.text( name ).attr('data-value', value);
            //me.trigger('select', name , value);
            me.$view.removeClass('active');
        },

        onClear: function() {
            var me = this;
            $( me.target ).val( '' );
        }
    });

    module.exports = InputHandler;
});

