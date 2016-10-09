// Renderers
//==================================
const NumRecordPerPage = 10;
let searchConditions = {
	OrderBy: "BestPossibleRentalPeriod",
	TransmissionTypeIDList: []
};
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
function renderSearchResultGrid(){
	function renderSearchResult(searchResult){
		return `<div class="col-md-6" >
			<a href="./../vehicleInfo/vehicleInfo.html">
				<div data-vehicle-id="${searchResult.ID}" class="ibox ibox-content product-box search-result" >
					<div class="vehicle-img" style="background-image: url('${searchResult.ImageList}');" >
						<div class="vehicle-price-tag" ><span class="vehicle-price" >
							<sup>&#8363;</sup>${searchResult.BestPossibleRentalPrice}/<sub>${searchResult.BestPossibleRentalPeriod}</sub></span>
						</div>
					</div>
					<div class="vehicle-info">
						<div class="vehicle-name">${searchResult.Name}</div>
						<div>${renderStarRating(searchResult.Star)}</div>
						<hr>
						<div><i class="fa fa-map-marker"></i> ${searchResult.Location}</div>
						<div><i class="fa fa-building"></i> ${searchResult.GarageName}</div>
						<hr>
						<div><i class="fa fa-gear"></i> ${searchResult.TransmissionTypeName}</div>
						<hr>
						<div class="license-number">${searchResult.LicenseNumber}</div>
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
	.done(function(data) {
		console.log(data);
		$('#lowestPriceDisplay').html(`₫&nbsp;${(Number.parseInt(data.LowestPrice) / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}k`);
		$('#averagePriceDisplay').html(`₫&nbsp;${(Number.parseInt(data.HighestPrice) / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}k`);
		$('#highestPriceDisplay').html(`₫&nbsp;${(Number.parseInt(data.HighestPrice) / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}k`);
		$('#searchResultGrid').html(
			data.SearchResultList.reduce((html, searchResult) => html + renderSearchResult(searchResult), '')
		);

		$('#recordInfo').html(`${(searchConditions.Page - 1) * NumRecordPerPage + 1} ${searchConditions.Page * NumRecordPerPage} of ${data.TotalResult} vehicle(s)`)

		// Render search result grid's paginator
		$('#paginatior').twbsPagination({
			startPage: searchConditions.Page,
			totalPages: data.TotalPage,
			visiblePages: 5,
			first: '<<',
			prev: '<',
			next: '>',
			last: '>>',
			onPageClick: function (event, page) {
				// Ajax here to load the next page's content
			}
		});
	})
	.fail(function(err) {
		console.log(err);
	});
}
//==================================

$(document).ready(() => {
	// Always set this to true to use traditional param serialization
	// http://api.jquery.com/jquery.ajax/
	jQuery.ajaxSettings.traditional = true;

	let filters = $('#filters');
	// Time range filter
	let now = moment();
	let startTimeFilter = $('#startTimeFilter').datetimepicker({
		useCurrent: false,
		defaultDate: now.clone().add(7, 'hours'),
		minDate: now.clone().add(6, 'hours'),
		maxDate: now.clone().add(30, 'days'),
		format: 'YYYY/MM/DD HH:mm',
		showClose: true,
		widgetParent: 'body',
	}).on('dp.show', function() {
		var datepicker = $('.bootstrap-datetimepicker-widget:last');
		datepicker.css({
			'top': `${$(this).offset().top + $(this).outerHeight()}px`,
			'bottom': 'auto',
			'left': `${$(this).offset().left}px`
		});
	}).on('dp.change', function(data){
	}).on('dp.hide', (data)=>{
		console.log(data);
		searchConditions.StartTime = data.date.toDate().toISOString();
		delete searchConditions.Page;

		renderSearchResultGrid();
	}).on('dp.error', (data)=>{
		console.log(data);
	});

	let endTimeFilter = $('#endTimeFilter').datetimepicker({
		useCurrent: false,
		defaultDate: now.clone().add(1, 'days').add(7, 'hours'),
		minDate: now.clone().add(6, 'hours'),
		format: 'YYYY/MM/DD HH:mm',
		widgetParent: 'body',
	}).on('dp.show', function() {
		var datepicker = $('.bootstrap-datetimepicker-widget:last');
		datepicker.css({
			'top': `${$(this).offset().top + $(this).outerHeight()}px`,
			'bottom': 'auto',
			'left': `${$(this).offset().left}px`
		});
	}).on('dp.change', (data)=>{
		console.log(data);
	}).on('dp.hide', (data)=>{
		searchConditions.EndTime = data.date.toDate().toISOString();
		delete searchConditions.Page;

		renderSearchResultGrid();
	}).on('dp.error', (data)=>{
		console.log(data);
	});

	$(endTimeFilter).data('DateTimePicker').date();

	// In case the filter section is scrolled, reupdate datetimepicker's position
	filters.scroll(function(event) {
		var datepicker = $('.bootstrap-datetimepicker-widget:last');
		datepicker.css({
			'top': `${$(startTimeFilter).offset().top + $(startTimeFilter).outerHeight()}px`,
		});
	});

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
	// Location
	$('#locationFilter').select2().on('change', (evt) => {
		searchConditions.LocationIDList = $(evt.currentTarget).val();
		delete searchConditions.Page;

		renderSearchResultGrid();
	});

	// Category
	$('#categoryFilter').select2().on('change', (evt) => {
		searchConditions.VehicleTypeList = $(evt.currentTarget).val();
		delete searchConditions.Page;

		renderSearchResultGrid();
	});

	// Seat
	$('#seatFilter').select2().on('change', (evt) => {
		searchConditions.LocationIDList = $(evt.currentTarget).val();
		delete searchConditions.Page;

		renderSearchResultGrid();
	});

	// Color
	const colorOptionFormat = (state) => {
		return $(`<span><i class="fa fa-car fa-${state.text.toLowerCase()}"></i>&nbsp;&nbsp;${state.text}</span>`);
	};

	$('#colorFilter').select2({
		templateSelection: colorOptionFormat,
		templateResult: colorOptionFormat
	}).on('change', function(evt){
		searchConditions.ColorIDList = $(evt.currentTarget).val();
		delete searchConditions.Page;

		renderSearchResultGrid();
	});

	// Fuel
	$('#fuelFilter').select2().on('change', (evt) => {
		searchConditions.NumberOfSeatList = $(evt.currentTarget).val();
		delete searchConditions.Page;

		renderSearchResultGrid();
	});

	// Price filter slider
	let priceSlider = noUiSlider.create(document.getElementById('priceFilter'), {
		connect: true,
		format: {
			to: value => `₫&nbsp;${(Number.parseInt(value) / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}k`,
			from: value => Number.parseInt(value.replace('₫&nbsp;', '').replace('k', '').replace(',', ''))
		},
		margin: 100000,
		start: [100000, 10000000],
		step: 100000,
		range: {
			'min': [100000],
			'max': [10000000]
		}
	});
	priceSlider.on('update', (values, handle, unencoded) => {
		$('#minPriceDisplay').html(values[0]);
		$('#maxPriceDisplay').html(values[1]);
	});
	priceSlider.on('set', (values, handle, unencoded) => {
		searchConditions.MaxPrice = Number.parseInt(unencoded[0]);
		searchConditions.MinPrice = Number.parseInt(unencoded[1]);
		delete searchConditions.Page;

		renderSearchResultGrid();
	});

	// Transmission's checkbox
	$('#transmissionFilter input[type=checkbox]').change(function(evt) {
		if(this.checked){
			searchConditions.TransmissionTypeIDList.push(this.value)
		} else {
			searchConditions.TransmissionTypeIDList = searchConditions.TransmissionTypeIDList.filter((el) => el != this.value)
		}
		delete searchConditions.Page;

		renderSearchResultGrid();
	});

	// ========================================================
	// Render search result grid
	renderSearchResultGrid();
});