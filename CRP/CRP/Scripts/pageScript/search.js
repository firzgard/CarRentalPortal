// Renderers
//==================================
const NumRecordPerPage = 10;
let now = moment();
let searchConditions = {
	StartTime: now.clone().add(1, 'days').toJSON()
	, EndTime: now.clone().add(2, 'days').toJSON()
	, OrderBy: "BestPossibleRentalPrice"
	, TransmissionTypeIDList: []
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
// IsAscOrder:
// Page:

function renderSearchResultGrid(domNode, searchResultList){
	domNode.html(searchResultList.reduce((html, searchResult) => html + renderSearchResultItem(searchResult), ''))

	$('.carousel').carousel()
}

function renderSearchResultItem(searchResult){
	return `<div class="col-xs-6" >
		<div data-vehicle-id="${searchResult.ID}" class="ibox ibox-content product-box search-result" >
			<div class="vehicle-img-container">
				${renderSearchResultImageCarousel(searchResult)}
				<div class="vehicle-price-tag" ><span class="vehicle-price" >
					<sup>&#8363;</sup>
					${searchResult.BestPossibleRentalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/
					<sub>${searchResult.BestPossibleRentalPeriod}</sub></span>
				</div>
			</div>
			<div class="vehicle-info">
				<a href="/vehicleInfo/${searchResult.ID}">
					<div class="vehicle-name">${searchResult.Name}</div>
					<div>${renderStarRating(searchResult.Star)}</div>
				</a>
				<hr>
				<div class="row">
					<div class="col-xs-6"><i class="fa fa-map-marker"></i>&nbsp;${searchResult.Location}</div>
					<div class="col-xs-6"><i class="fa fa-building"></i>&nbsp;${searchResult.GarageName}</div>
				</div>
				<hr>
				<div><i class="fa fa-gear"></i> ${searchResult.TransmissionTypeName}</div>
				<hr>
				<div class="license-number">${searchResult.LicenseNumber}</div>
			</div>
		</div>
	</div>`;
}

function renderSearchResultImageCarousel(searchResult){
	return `<div id="vehicleCarousel${searchResult.ID}" class="carousel slide" data-ride="carousel">
		<div class="carousel-inner" role="listbox">
			${searchResult.ImageList.reduce((html, image, index) => {
				return html
					+ `<div class="item vehicle-img ${index === 0 && 'active'}"
							style="background-image: url('${image}');" >
					</div>`
			}, '')}
		</div>
		<!-- Controls -->
		<a class="left carousel-control" href="#vehicleCarousel${searchResult.ID}" role="button" data-slide="prev">
			<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
			<span class="sr-only">Previous</span>
		</a>
		<a class="right carousel-control" href="#vehicleCarousel${searchResult.ID}" role="button" data-slide="next">
			<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>
	</div>`;
}

function renderPaginator(domNode, data){
	// Render search result grid's paginator
	domNode.twbsPagination({
		startPage: searchConditions.Page || 1,
		totalPages: data.TotalPage,
		visiblePages: 5,
		first: '<i class="fa fa-angle-double-left"></i>',
		prev: '<i class="fa fa-angle-left"></i>',
		next: '<i class="fa fa-angle-right"></i>',
		last: '<i class="fa fa-angle-double-right"></i>',
		onPageClick: function (event, page) {
			// Ajax here to load the next page's content
		}
	});
}

function renderRecordInfo(domNode, data){
	let firstResultPosition = ((searchConditions.Page || 1) - 1) * NumRecordPerPage + 1
		, lastResultPosition = ((searchConditions.Page || 1) * NumRecordPerPage) < data.TotalResult
			? ((searchConditions.Page || 1) * NumRecordPerPage)
			: data.TotalResult
		, newHtml = `${firstResultPosition} - ${lastResultPosition} of ${data.TotalResult} vehicle(s)`;

	domNode.html(newHtml);
}

function renderPriceSlider(lowestPriceDisplay, averagePriceDisplay, highestPriceDisplay, data){
	lowestPriceDisplay.html(`₫&nbsp;${data.LowestPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
	averagePriceDisplay.html(`₫&nbsp;${data.AveragePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
	highestPriceDisplay.html(`₫&nbsp;${data.HighestPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
}

function renderSearcher({
		searchResultGrid
		, paginator
		, recordInfo
		, lowestPriceDisplay
		, averagePriceDisplay
		, highestPriceDisplay
	} = jqueryNodes)
{
	$.ajax({
		url: $('#searchResultGrid').data('source'),
		type: 'GET',
		dataType: 'json',
		data: searchConditions
	})
	.done(function(data) {
		if(data.SearchResultList.length){
			searchResultGrid.removeClass('hidden');
			renderSearchResultGrid(searchResultGrid, data.SearchResultList);

			paginator.removeClass('hidden');
			renderPaginator(paginator, data);

			renderRecordInfo(recordInfo, data);

			renderPriceSlider(lowestPriceDisplay, averagePriceDisplay, highestPriceDisplay, data);
		} else {
			recordInfo.html(`<div style="font-size:1.5em; text-align:center; padding: 3em 0">
					No vehicle fits your parameters. Please try again.
				</div>`);
			searchResultGrid.addClass('hidden');
			paginator.addClass('hidden');
		}
		console.log(data);
	})
	.fail(function(err) {
		console.log(err);
	});
}

function changePage(){

}
//==================================

$(document).ready(() => {
	// Always set this to true to use traditional param serialization
	// http://api.jquery.com/jquery.ajax/
	jQuery.ajaxSettings.traditional = true;

	let jQueryNodes = {
		filters: $('#filters')
		, searchResultGrid: $('#searchResultGrid')
		, paginator: $('#paginatior')
		, recordInfo: $('#recordInfo')
		, lowestPriceDisplay: $('#lowestPriceDisplay')
		, averagePriceDisplay: $('#averagePriceDisplay')
		, highestPriceDisplay: $('#highestPriceDisplay')
	}

	// Time range filter
	let startTimeFilter = $('#startTimeFilter').datetimepicker({
		useCurrent: false,
		defaultDate: now.clone().add(1, 'days'),
		minDate: now.clone().add(6, 'hours'),
		maxDate: now.clone().add(30, 'days'),
		format: 'YYYY/MM/DD HH:mm',
		showClose: true,
		widgetParent: 'body',
	})
	.on('dp.show', function() {
		var datepicker = $('.bootstrap-datetimepicker-widget:last');
		datepicker.css({
			'top': `${$(this).offset().top + $(this).outerHeight()}px`,
			'bottom': 'auto',
			'left': `${$(this).offset().left}px`
		});
	})
	.on('dp.change', function(data){
	})
	.on('dp.hide', (data)=>{
		console.log(data);
		searchConditions.StartTime = data.date.toJSON();
		delete searchConditions.Page;

		renderSearcher(jQueryNodes);
	})
	.on('dp.error', (data)=>{
		console.log(data);
	});

	let endTimeFilter = $('#endTimeFilter').datetimepicker({
		useCurrent: false,
		defaultDate: now.clone().add(2, 'days'),
		minDate: now.clone().add(6, 'hours'),
		format: 'YYYY/MM/DD HH:mm',
		widgetParent: 'body',
	})
	.on('dp.show', function() {
		var datepicker = $('.bootstrap-datetimepicker-widget:last');
		datepicker.css({
			'top': `${$(this).offset().top + $(this).outerHeight()}px`,
			'bottom': 'auto',
			'left': `${$(this).offset().left}px`
		});
	})
	.on('dp.change', (data)=>{
		console.log(data);
	})
	.on('dp.hide', (data)=>{
		searchConditions.EndTime = data.date.toJSON();
		delete searchConditions.Page;

		renderSearcher(jQueryNodes);
	})
	.on('dp.error', (data)=>{
		console.log(data);
	});

	$(endTimeFilter).data('DateTimePicker').date();

	// In case the filter section is scrolled, reupdate datetimepicker's position
	jQueryNodes.filters.scroll(function(event) {
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

		renderSearcher(jQueryNodes);
	});

	// Brand + model filter
	const brandModelOptionFormat = (state, container) => {
		console.log(state);
		console.log(container);
		if(state.element.dataset.lvl == 0)
			return $(`<span><i class="fa fa-building}"></i>&nbsp;&nbsp;${state.text}</span>`);
		else
			return $(`<span><i class="fa fa-car}"></i>&nbsp;&nbsp;${state.text}</span>`);
	};

	$('#modelFilter').select2({
		templateSelection: brandModelOptionFormat,
		templateResult: brandModelOptionFormat
	}).on('change', (evt) => {
		//searchConditions.LocationIDList = $(evt.currentTarget).val();
		delete searchConditions.Page;

		renderSearcher(jQueryNodes);
	});

	// Category
	$('#categoryFilter').select2().on('change', (evt) => {
		searchConditions.VehicleTypeList = $(evt.currentTarget).val();
		delete searchConditions.Page;

		renderSearcher(jQueryNodes);
	});

	// Seat
	$('#seatFilter').select2().on('change', (evt) => {
		searchConditions.NumberOfSeatList = $(evt.currentTarget).val();
		delete searchConditions.Page;

		renderSearcher(jQueryNodes);
	});

	// Color
	const colorOptionFormat = (state) => {
		return $(`<span><i class="fa fa-car fa-${state.text.toLowerCase()}"></i>&nbsp;&nbsp;${state.text}</span>`);
	};

	$('#colorFilter').select2({
		templateSelection: colorOptionFormat,
		templateResult: colorOptionFormat
	})
	.on('change', function(evt){
		searchConditions.ColorIDList = $(evt.currentTarget).val();
		delete searchConditions.Page;

		renderSearcher(jQueryNodes);
	});

	// Fuel
	$('#fuelFilter').select2().on('change', (evt) => {
		searchConditions.FuelTypeIDList = $(evt.currentTarget).val();
		delete searchConditions.Page;

		renderSearcher(jQueryNodes);
	});

	//=================================================
	// Price filter slider
	let priceSlider = noUiSlider.create(document.getElementById('priceFilter'), {
		connect: true,
		format: {
			to: value => `₫&nbsp;${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
			from: value => Number.parseInt(value.replace('₫&nbsp;', '').replace(',', ''))
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
		searchConditions.MinPrice = Number.parseInt(unencoded[0]);
		searchConditions.MaxPrice = Number.parseInt(unencoded[1]);
		delete searchConditions.Page;

		renderSearcher(jQueryNodes);
	});

	// Transmission's checkbox
	$('#transmissionFilter input[type=checkbox]').change(function(evt) {
		if(this.checked){
			searchConditions.TransmissionTypeIDList.push(this.value)
		} else {
			searchConditions.TransmissionTypeIDList = searchConditions.TransmissionTypeIDList.filter((el) => el != this.value)
		}
		delete searchConditions.Page;

		renderSearcher(jQueryNodes);
	});

	// ========================================================
	// Render search result grid
	renderSearcher(jQueryNodes);
});