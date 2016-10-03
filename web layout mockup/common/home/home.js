
$(document).ready(function(){
	// Chosen
	// Location selector
	$('#locationSelector').chosen({
		width: "200px",
		no_results_text: "No result!"
	});

	// Time range selector
	$('#timerange').daterangepicker({
		format: 'YYYY-MM-DD h:mm A',
		timePicker: true,
		showDropdowns: true,
		ranges: {
			'Today': [moment(), moment()],
			'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
			'Next 7 Days': [moment(), moment().add(6, 'days')],
			'Next 30 Days': [moment(), moment().add(29, 'days')]
		},
		opens: 'right',
		drops: 'down',
		buttonClasses: ['btn', 'btn-sm'],
		applyClass: 'btn-primary',
		cancelClass: 'btn-default',
		separator: ' to ',
		locale: {
			applyLabel: 'Apply',
			cancelLabel: 'Cancel',
			fromLabel: 'From',
			toLabel: 'To',
			customRangeLabel: 'Custom',
			daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
			monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			firstDay: 1
		}
	}, (start, end, label) => {
		$('#timerange #startTimeDisplay').val(start.format('YYYY-MM-DD h:mm A'));
		$('#timerange #endTimeDisplay').val(end.format('YYYY-MM-DD h:mm A'));
	});
});