define( function( require, exports, module ) {
    var IBSS = window.IBSS,TPL = IBSS.tpl;
	var Pagination = require('common/widget/pagination/pagination');

    var TeamTree = require('module/teamtree/teamtree');

	/**
	 *
	 * 季度数据分析
	 */
    var SeasonTable = MClass( M.Center ).include({
    	
    	elements:{
            '#monthlabel': 'monthlabel',
            '#seasonlabel': 'seasonlabel',
    		'#yearselect': 'yearselect',
            '#monthselect': 'monthselect',
    		'#seasonselect': 'seasonselect'
    	},

        events: {
            'click .mselect b': 'selectEve',
            'click .search': 'getList'
        },

        selectEve: function( e ){
            var me = this;
            var $target = $( e.currentTarget );
            $target.addClass('active').siblings().removeClass('active');

            if( $target.attr('data-target') == 'month' ){
                
                me.selectstate = 1;
                me.$monthlabel.show();
                me.$seasonlabel.hide();
            }else{

                me.selectstate = 2;
                me.$monthlabel.hide();
                me.$seasonlabel.show();
            }
        },

    	init: function(){
    		SeasonTable.__super__.init.apply( this,arguments );
    		var me = this;

            var startYear = 2008,
                endYear = ( new Date() ).getFullYear(),
                array = [];
            
            me.selectstate = null;    //月份季度选择切换

            for( var i=startYear; i<=endYear; i++ ){
                array.push( {'name':i,'value':i} );
            }
            
            util.resetSelect( me.$yearselect,array,2015 );
            me.$('.mselect b').eq(0).trigger('click');
    		me.getList();
    	},

    	getList: function(){
    		var me = this;

            var month = '',
                quarter = '';

            if( me.selectstate == 1 ){

                month = me.model.get('year') + '-' + me.model.get('month');
            }else{

                quarter = me.model.get('year') + '-' + me.model.get('season'); 
            }   

    		util.api({
    			'url':'/activity/queryactivityanalysisreport',
    			'data':{
    				'month': month,
    				'quarter': quarter,
    				'enterpriseType': me.model.get('enterpriseType')
    			},
    			'success': function( data ){
    				console.warn( data );
                    if( data.success ){
                        me.listinfo.reload([data.value.model]);
                    }
    			}
    		})
    	}
    })

    exports.init = function() { 
        var $el = exports.$el;
        var seasonTable = new SeasonTable( { 'view': $el.find( '.m-seasonactive' ) } );
        var teamTree = new TeamTree();

        //teamTree.show(349);
        //teamTree.on('select',function(data){
        //    console.log(data);
        //})
    }
} );