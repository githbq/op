define( function( require, exports, module ) {
    var IBSS = window.IBSS,
        TPL = IBSS.tpl;

    
	var Dialog = require('common/widget/dialog/dialog');
    var contentStr = require('./readclue.html');
    
	//分配
    var ReadClue = MClass( Dialog ).include({
        
        content: contentStr,
        defaultAttr: {
            'title': '线索',
            'width': 500
        },


        
        init: function() {
            ReadClue.__super__.init.apply( this,arguments );
        },

       show: function( clueID ) {
            ReadClue.__super__.show.apply( this,arguments );
            this.clueID = clueID
            this.getClue();
        },

        getClue: function() {
            var me = this;
            util.api({
                url: '~/csm/api/m/getcsmcluerecord',
                data: {
                    csmClueRecordID: me.clueID
                },
                success: function(res) {
                    if( res.success ){
                        var time = res.model.opTime;
                        time = new Date(time)._format( "yyyy-MM-dd hh:mm" );
                        $('#updateTime').html(time);
                        $('#clue').html(res.model.clueRemark);
                        (res.model.id)&&(me.clueID = res.model.id);
                    }
                }
            });
        },



        hide: function() {
            ReadClue.__super__.hide.apply( this,arguments );
            this.clueId = '';
            $('#clue').html('');
        }

	});
    
    module.exports = ReadClue;
} );

