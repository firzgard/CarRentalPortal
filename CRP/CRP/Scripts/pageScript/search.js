// Renderers
//==================================
let now = moment();
let jQueryNodes;
let searchConditions = {
	StartTime: now.clone().add(1, 'days').toJSON()
	, EndTime: now.clone().add(2, 'days').toJSON()
	, BrandIDList: []
	, ModelIDList: []
	, TransmissionTypeIDList: []
	, OrderBy: "BestPossibleRentalPrice"
};


// MaxProductionYear
// MinProductionYear
// OrderBy:
// IsDescendingOrder:
// Page:

// MaxPrice:
// MinPrice:

function renderSearchResultGrid(domNode, searchResultList){
	domNode.html(searchResultList.reduce((html, searchResult) => html + renderSearchResultItem(searchResult), ''))

	$('.carousel').carousel()

	domNode
	.addClass('animated fadeIn')
	.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
		domNode.removeClass('animated fadeIn')
	});
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

	domNode
	.addClass('animated fadeIn')
	.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
		domNode.removeClass('animated fadeIn')
	});
}

function renderRecordInfo(domNode, data){
	let firstResultPosition = ((searchConditions.Page || 1) - 1) * NumRecordPerPage + 1
		, lastResultPosition = ((searchConditions.Page || 1) * NumRecordPerPage) < data.TotalResult
			? ((searchConditions.Page || 1) * NumRecordPerPage)
			: data.TotalResult
		, newHtml = `${firstResultPosition} - ${lastResultPosition} of ${data.TotalResult} vehicle(s)`;

	domNode.html(newHtml);

	domNode
	.addClass('animated fadeIn')
	.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
		domNode.removeClass('animated fadeIn')
	});
}

function renderPriceSlider(lowestPriceDisplay, averagePriceDisplay, highestPriceDisplay, data){
	lowestPriceDisplay.html(`₫&nbsp;${Number.parseInt(data.LowestPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
	averagePriceDisplay.html(`₫&nbsp;${Number.parseInt(data.AveragePrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
	highestPriceDisplay.html(`₫&nbsp;${Number.parseInt(data.HighestPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`);
}

function renderSearcher(){
	console.log(searchConditions);

	jQueryNodes.resultContainer.scrollTop(0);
	$.ajax({
		url: $('#searchResultGrid').data('source'),
		type: 'GET',
		dataType: 'json',
		data: searchConditions
	})
	.done(function(data) {
		if(data.SearchResultList.length){
			jQueryNodes.searchResultGrid.removeClass('hidden');
			renderSearchResultGrid(jQueryNodes.searchResultGrid, data.SearchResultList);

			jQueryNodes.paginator.removeClass('hidden');
			renderPaginator(jQueryNodes.paginator, data);

			renderRecordInfo(jQueryNodes.recordInfo, data);

			renderPriceSlider(jQueryNodes.lowestPriceDisplay, jQueryNodes.averagePriceDisplay, jQueryNodes.highestPriceDisplay, data);
		} else {
			jQueryNodes.recordInfo.html(`<div style="font-size:1.5em; text-align:center; padding: 3em 0">
					No vehicle fits your parameters. Please try again.
				</div>`);
			jQueryNodes.searchResultGrid.addClass('hidden');
			jQueryNodes.paginator.addClass('hidden');
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

	jQueryNodes = {
		resultContainer: $('#resultContainer')
		, filters: $('#filters')
		, startTimeFilter: $('#startTimeFilter')
		, endTimeFilter: $('#endTimeFilter')
		, brandFilter: $('#brandFilter')
		, modelFilter: $('#modelFilter')
		, searchResultGrid: $('#searchResultGrid')
		, paginator: $('#paginatior')
		, recordInfo: $('#recordInfo')
		, lowestPriceDisplay: $('#lowestPriceDisplay')
		, averagePriceDisplay: $('#averagePriceDisplay')
		, highestPriceDisplay: $('#highestPriceDisplay')
	}

	// Time range filter
	// Start time
	jQueryNodes.startTimeFilter.datetimepicker({
		useCurrent: false,
		defaultDate: now.clone().add(1, 'days'),
		minDate: now.clone().add(SoonestPossibleBookingStartTimeFromNowInHour, 'hours').subtract(1, 'minutes'),
		maxDate: now.clone().add(LatestPossibleBookingStartTimeFromNowInDay, 'days').add(1, 'minutes'),
		format: 'YYYY/MM/DD HH:mm',
		ignoreReadonly: true,
		showClose: true,
		widgetParent: 'body',
	})
	// This on is for rendering the popup at the correct position
	.on('dp.show', function() {
		let datepicker = $('.bootstrap-datetimepicker-widget:last');
		datepicker.css({
			'top': `${$(this).offset().top + $(this).outerHeight()}px`,
			'bottom': 'auto',
			'left': `${$(this).offset().left}px`
		});
	})
	.on('dp.change', (data)=>{
	})
	.on('dp.hide', (data)=>{
		searchConditions.StartTime = data.date.toJSON();

		if(data.date.isAfter(jQueryNodes.endTimeFilter.data('DateTimePicker').date())){
			let newEndTime = data.date.clone().add(1, 'hours')
			jQueryNodes.endTimeFilter.data('DateTimePicker').date(newEndTime);
			searchConditions.EndTime = newEndTime.toJSON();
		}

		delete searchConditions.Page;
		renderSearcher();
	})
	.on('dp.error', (data)=>{
		console.log(data);
	});

	// End time
	jQueryNodes.endTimeFilter.datetimepicker({
		useCurrent: false,
		defaultDate: now.clone().add(2, 'days'),
		minDate: now.clone().add(SoonestPossibleBookingEndTimeFromNowInHour, 'hours').subtract(1, 'minutes'),
		format: 'YYYY/MM/DD HH:mm',
		ignoreReadonly: true,
		widgetParent: 'body',
	})
	// This on is for rendering the popup at the correct position
	.on('dp.show', function() {
		var datepicker = $('.bootstrap-datetimepicker-widget:last');
		datepicker.css({
			'top': `${$(this).offset().top + $(this).outerHeight()}px`,
			'bottom': 'auto',
			'left': `${$(this).offset().left}px`
		});
	})
	.on('dp.change', (data)=>{
	})
	.on('dp.hide', (data)=>{
		searchConditions.EndTime = data.date.toJSON();

		if(data.date.isBefore(jQueryNodes.startTimeFilter.data('DateTimePicker').date())){
			let newStartTime = data.date.clone().subtract(1, 'hours')
			jQueryNodes.startTimeFilter.data('DateTimePicker').date(newStartTime);
			searchConditions.StartTime = newStartTime.toJSON();
		}

		delete searchConditions.Page;
		renderSearcher();
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

	// Chosen selectors
	// Location
	$('#locationFilter')
	.select2()
	.on('change', function() {
		searchConditions.LocationIDList = $(this).val();
		delete searchConditions.Page;

		renderSearcher();
	});

	// Brand filter
	jQueryNodes.brandFilter
	.select2()
	.on('change', function() {
		// Remove modelFilter before regenerate it
		jQueryNodes.modelFilter.select2("destroy");

		// Enable all model options before
		// disabling only model options belonged to selected brands
		jQueryNodes.modelFilter.find('option').each((i, el) => {
			el.disabled = false
		});

		// Get the brandIdList
		searchConditions.BrandIDList = $(this).val();

		let disabledModelIDList = [];
		for(let brandID of searchConditions.BrandIDList){
			let optgroup = jQueryNodes.modelFilter.find(`optgroup[data-brand="${brandID}"]`)
			
			optgroup.find('option').each((i, el) => {
				// Disable only model options belonged to selected brands
				el.selected = false;
				el.disabled = true;

				disabledModelIDList.push(el.value.toString());
			});
		}
		// Filter out models belonged to selected brands in searchConditions
		searchConditions.ModelIDList = searchConditions.ModelIDList.filter((el) => !disabledModelIDList.includes(el.toString()));

		// Regenerate modelFilter
		jQueryNodes.modelFilter.select2();

		delete searchConditions.Page;
		renderSearcher();
	});

	// Model filter
	jQueryNodes.modelFilter
	.select2()
	.on('change', function() {
		searchConditions.ModelIDList = $(this).val();

		delete searchConditions.Page;
		renderSearcher();
	});

	// Category
	$('#categoryFilter')
	.select2()
	.on('change', function() {
		searchConditions.CategoryIDList = $(this).val();
		delete searchConditions.Page;

		renderSearcher();
	});

	// Seat
	$('#seatFilter')
	.select2()
	.on('change', function() {
		searchConditions.NumberOfSeatList = $(this).val();
		delete searchConditions.Page;

		renderSearcher();
	});

	// Color
	const colorOptionFormat = (state) => {
		return $(`<span><i class="fa fa-car fa-${state.text.toLowerCase()}"></i>&nbsp;&nbsp;${state.text}</span>`);
	};

	$('#colorFilter')
	.select2({
		templateSelection: colorOptionFormat,
		templateResult: colorOptionFormat
	})
	.on('change', function(){
		searchConditions.ColorIDList = $(this).val();
		delete searchConditions.Page;

		renderSearcher();
	});

	// Fuel
	$('#fuelFilter')
	.select2()
	.on('change', function() {
		searchConditions.FuelTypeIDList = $(this).val();
		delete searchConditions.Page;

		renderSearcher();
	});

	//=================================================
	// Price filter slider
	let priceSlider = noUiSlider.create(document.getElementById('priceFilter'), {
		connect: true,
		format: {
			to: value => `₫&nbsp;${Number.parseInt(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
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

		renderSearcher();
	});

	// Year filter slider
	// let yearSlider = noUiSlider.create(document.getElementById('yearFilter'), {
	// 	connect: true,
	// 	margin: 1,
	// 	start: [MinProductionYear, now.year()],
	// 	step: 1,
	// 	range: {
	// 		'min': [MinProductionYear],
	// 		'max': [now.year()]
	// 	}
	// });
	// yearSlider.on('update', (values, handle, unencoded) => {
	// 	$('#minYearDisplay').html(values[0]);
	// 	$('#maxYearDisplay').html(values[1]);
	// });
	// yearSlider.on('set', (values, handle, unencoded) => {
	// 	searchConditions.MinPrice = Number.parseInt(unencoded[0]);
	// 	searchConditions.MaxPrice = Number.parseInt(unencoded[1]);
	// 	delete searchConditions.Page;

	// 	renderSearcher();
	// });

	// Transmission's checkbox
	$('#transmissionFilter input[type=checkbox]').change(function(evt) {
		if(this.checked){
			searchConditions.TransmissionTypeIDList.push(this.value)
		} else {
			searchConditions.TransmissionTypeIDList = searchConditions.TransmissionTypeIDList.filter((el) => el != this.value)
		}
		delete searchConditions.Page;

		renderSearcher();
	});

	// ========================================================
	// Render search result grid
	renderSearcher();
});