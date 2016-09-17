$(document).ready(function(){
	// Brand-tree selector
	$('#brandTree').jstree({
		core: {
			dblclick_toggle: false,
			themes: {
				icons: false,
				variant: "small"
			}
		},
		plugins: ["checkbox", "wholerow"]
	});

	// Location selector
	$('#locationSelector').chosen({
		width: "100%",
		no_results_text: "No result!"
	});

	// Time range selector
	$('#timerange #startTimeDisplay').val(moment().subtract(15, 'days').format('YYYY-MM-DD'));
	$('#timerange #endTimeDisplay').val(moment().format('YYYY-MM-DD'));

	$('#timerange').daterangepicker({
		format: 'YYYY-MM-DD',
		startDate: moment().subtract(15, 'days'),
		endDate: moment(),
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
	}, function(start, end, label) {
		$('#timerange #startTimeDisplay').val(start.format('YYYY-MM-DD'));
		$('#timerange #endTimeDisplay').val(end.format('YYYY-MM-DD'));
	});
});