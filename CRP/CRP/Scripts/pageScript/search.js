// This mockup data is the model for future ajax-loaded searchResult json data.
const mockupSearchResult = {
	searchResults: [
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
	],
	currentPage: 2,
	totalPages: 20
};

// Renderers
//==================================
let searchConditions = {};
// StartTime: 
// EndTime:
// MaxPrice:
// MinPrice:
// LocationIDList:
// BrandIDList:
// ModelIDList:
// VehicleTypeList:
// NumberOfSeatList:
// TransmissionTypeIDList:
// ColorIDList:
// FuelTypeIDList:
// OrderBy:
// Page:
function renderSearchResultGrid(searchConditions = null){
	function renderSearchResult(searchResult){
		return `<div class="col-lg-4" >
			<a href="./../vehicleInfo/vehicleInfo.html">
				<div data-vehicle-id="${searchResult.id}" class="ibox ibox-content product-box search-result" >
					<div class="vehicle-img" style="background-image: url('${searchResult.imageURL}');" >
						<div class="vehicle-price-tag" ><span class="vehicle-price" >${searchResult.perDayPrice} <sup>&#8363;</sup>/<sub>day</sub></span></div>
					</div>
					<div class="vehicle-info">
						<div class="vehicle-name">${searchResult.name}</div>
						<div>${renderStarRating(searchResult.star)}</div>
						<hr>
						<div><i class="fa fa-map-marker"></i> ${searchResult.garageLocation}</div>
						<div><i class="fa fa-building"></i> ${searchResult.garageName}</div>
						<hr>
						<div class="license-number">${searchResult.licenseNumber}</div>
					</div>
				</div>
			</a>
		</div>`
	}

	$.ajax({
		url: $('#searchResultGrid').data('source'),
		type: 'GET',
		dataType: 'json',
		data: searchConditions
	})
	.done(function(searchResults) {
		$('#searchResultGrid').html(`${searchResults.reduce((html, searchResult) => html + renderSearchResult(searchResult), '')}`);
	})
	.fail(function(err) {
		console.log(err);
	});
}
//==================================

$(document).ready(() => {
	// Time range filter
	$('#startTimeFilter').datetimepicker();
	$('#endTimeFilter').datetimepicker();
	// $('#timeFilter').daterangepicker({
	// 	minDate: moment(),
	// 	maxDate: moment().add(30, 'days'),
	// 	dateLimit: { days: 30 }
	// 	applyClass: 'btn-primary',
	// 	cancelClass: 'btn-default',
	// 	opens: 'right',
	// 	drops: 'down',
	// 	buttonClasses: ['btn', 'btn-sm'],
	// 	locale: {
	// 		applyLabel: 'Apply',
	// 		cancelLabel: 'Cancel',
	// 		format: 'YYYY-MM-DD h:mm A',
	// 		fromLabel: 'From',
	// 		toLabel: 'To',
	// 		customRangeLabel: 'Custom',
	// 		daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
	// 		monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	// 		firstDay: 1
	// 	},
	// 	showDropdowns: true,
	// 	timePicker: true,
	// }, (start, end, label) => {
	// 	$('#startTimeDisplay').val(start.format('YYYY-MM-DD h:mm A'));
	// 	$('#endTimeDisplay').val(end.format('YYYY-MM-DD h:mm A'));
	// 	searchConditions.StartTime = start.toDate();
	// 	searchConditions.EndTime = end.toDate();
	// });

	// Chosen selector
	$('#locationFilter').select2();

	const colorOptionFormat = (state) => {
		return $(`<span><i class="fa fa-car fa-${state.text.toLowerCase()}"></i>&nbsp;&nbsp;${state.text}</span>`);
	};
	$('#colorFilter').select2({
		templateSelection: colorOptionFormat,
		templateResult: colorOptionFormat
	});

	$('#fuelFilter').select2().on('change', function(evt){
		searchConditions.FuelTypeIDList = $(evt.currentTarget).val());
		console.log(searchConditions.FuelTypeIDList);
	});

	// Price filter slider
	noUiSlider.create(document.getElementById('priceFilter'), {
		connect: true,
		format: {
			to: value => `₫ ${Number.parseInt(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
			from: value => Number.parseInt(value.replace('₫ ', '').replace(',', ''))
		},
		margin: 100000,
		start: [100000, 10000000],
		step: 100000,
		range: {
			'min': [100000],
			'max': [10000000]
		},
		tooltips: true
	})

	// Render search result grid
	renderSearchResultGrid(searchConditions)

	// Render search result grid's paginator
	$('#paginatior').twbsPagination({
		startPage: mockupSearchResult.currentPage,
		totalPages: mockupSearchResult.totalPages,
		visiblePages: 5,
		onPageClick: function (event, page) {
			// Ajax here to load the next page's content
		}
	});
});