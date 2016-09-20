const searchResultTemplate = $('#searchResultTemplate').html();
Mustache.parse(searchResultTemplate); // Parse template before-hand. speeds up future uses

$(document).ready(function(){
	// This mockup data is the model for future ajax-loaded searchResult json data.
	let mockupSearchResult = { searchResults: [
		{
			id: 1,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-6666',
			perDayPrice: '666,666',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 1
		},
		{
			id: 2,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-9999',
			perDayPrice: '999,999',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 2
		},
		{
			id: 3,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-6666',
			perDayPrice: '666,666',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 3
		},
		{
			id: 4,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-9999',
			perDayPrice: '999,999',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 4
		},
		{
			id: 5,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-6666',
			perDayPrice: '666,666',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 5
		},
		{
			id: 6,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-9999',
			perDayPrice: '999,999',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 1
		},
		{
			id: 7,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-6666',
			perDayPrice: '666,666',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 2
		},
		{
			id: 8,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-9999',
			perDayPrice: '999,999',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 3
		},
		{
			id: 9,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-6666',
			perDayPrice: '666,666',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 4
		},
		{
			id: 10,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-9999',
			perDayPrice: '999,999',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 5
		},
		{
			id: 11,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-6666',
			perDayPrice: '666,666',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 1
		},
		{
			id: 12,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-9999',
			perDayPrice: '999,999',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 2
		},
		{
			id: 13,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-6666',
			perDayPrice: '666,666',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 3
		},
		{
			id: 14,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-9999',
			perDayPrice: '999,999',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 4
		},
		{
			id: 15,
			name: 'Koenigsegg Agera R',
			licenseNumber: '29LD-6666',
			perDayPrice: '666,666',
			garageLocation: 'Ho Chi Minh',
			garageName: 'AO Hoàng Hoa Thám',
			imageURL: './../../static/img/vehicle/1/1.jpg',
			vehicleURL: '#',
			star: 5
		},
	]};

	// Render search results
	$('#searchResultList').html(
		Mustache.render(searchResultTemplate, mockupSearchResult)
	);

	// Render star-rating
	for (searchResult of mockupSearchResult.searchResults) {
		$(`.search-result[data-vehicle-id="${searchResult.id}"] .star-rating`).barrating({
			theme: 'fontawesome-stars',
			initialRating: searchResult.star,
			readonly: true
		});
	}

	// =========================
	// Render filters

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
	$('#timerange #startTimeDisplay').val(moment().format('YYYY-MM-DD'));
	$('#timerange #endTimeDisplay').val(moment().add(13, 'days').format('YYYY-MM-DD'));

	$('#timerange').daterangepicker({
		format: 'YYYY-MM-DD',
		startDate: moment(),
		endDate: moment().add(13, 'days'),
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