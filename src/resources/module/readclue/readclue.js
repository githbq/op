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
            this.getClue(clueID);
        },

        getClue: function(clueID) {
            var me = this;
            var data = {
                enterpriseID: clueID
            };
            util.api({
                url: '~/csm/api/m/getcsmcluerecord',
                data: data,
                success: function(res) {
                    if( res.success ){
                        var time = res.model.opTime/1000.
                        time = new Date(time)._format( "yyyy-MM-dd hh:mm" );
                        $('#updateTime').html(time);
                        $('#clue').html(res.model.clueRemark);
                    }
                }
            });
        },



        hide: function() {
            ReadClue.__super__.hide.apply( this,arguments );
            $('#clue').html('');
        }

	});
    
    module.exports = ReadClue;
} );

