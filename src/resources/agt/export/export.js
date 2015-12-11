define( function(require, exports, module){

	exports.init = function(){
		var $el = exports.$el;

		var $startTime = $el.find('.startTime'),
			$endTime = $el.find('.endTime'),
			$download = $el.find('.download');

		$startTime.datetimepicker( {timepicker: false,format:'Y-m-d'} );
		$endTime.datetimepicker( {timepicker: false,format:'Y-m-d'} );

		$download.on('click',function(){

			var startTime = '',
				endTime = '';

			if( $startTime.val() ){
				startTime = new Date( $startTime.val() ).getTime();
			}
			if( $endTime.val() ){
				endTime = new Date( $endTime.val()+' 23:59' ).getTime();
			}

			var param = $.param( {
					'timeBegin': startTime,
					'timeEnd': endTime
				} );

			window.open( IBSS.API_PATH + '/agent/exporttoexcel?' + param );
		});
	}
});
