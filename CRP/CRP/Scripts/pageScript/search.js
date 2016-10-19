// Renderers
//==================================
let now, jQueryNodes, searchConditions;

function renderSearchResultGrid(domNode, searchResultList){
	domNode.removeClass('hidden');
	domNode.html(searchResultList.reduce((html, searchResult) => html + renderSearchResultItem(searchResult), ''))

	for(let searchResult of searchResultList){
		bindImageCarouselControls(searchResult)
	}

	domNode
	.addClass('animated fadeIn')
	.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
		domNode.removeClass('animated fadeIn')
	});
}

function renderSearchResultItem(searchResult){
	return `<div class="col-xs-6" >
		<div class="ibox ibox-content product-box search-result" id="vehicle${searchResult.ID}">
			<div class="vehicle-img-container">
				<div>
					<div class="vehicle-img"
							${searchResult.ImageList
								&& searchResult.ImageList.length != 0
								&& `style="background-image:url('${searchResult.ImageList[0]}');"`} >
					</div>
					<!-- Controls -->
					<a class="left carousel-control">
						<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
						<span class="sr-only">Previous</span>
					</a>
					<a class="right carousel-control">
						<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
						<span class="sr-only">Next</span>
					</a>
				</div>
				<div class="vehicle-price-tag" >
					${Math.ceil(Number.parseInt(searchResult.BestPossibleRentalPrice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<up>&#8363;</up>/<per>${searchResult.BestPossibleRentalPeriod}</per>
				</div>
			</div>
			<div class="vehicle-info row">
				<div class="col-xs-9">
				<div style="font-size:0.88em;">&nbsp;${searchResult.GarageName} · ${renderStarRating(searchResult.GarageRating, '#1ab394', false)}</div>
					<a href="${vehicleInfoUrl}/${searchResult.ID}" class="vehicle-name"> ${searchResult.Name} <b>(${searchResult.Year})</b></a>
					<div class="center-flex">${renderStarRating(searchResult.Star, '#1ab394')} · ${searchResult.NumOfComment} ${searchResult.NumOfComment > 1 ? 'reviews' : 'review' }</div>
				</div>
				<div class="col-xs-3 text-right vehicle-seat center-flex">${searchResult.NumOfSeat}<img src="/Content/img/icons/person.png"/></div>	
				<div class="col-xs-12">
				<hr>
				</div>
				<div class="col-xs-offset-1 col-xs-6"><i class="fa fa-gears"></i> ${searchResult.TransmissionTypeName}</div>
				<div class="col-xs-5"><i class="fa fa-tint"></i> ${searchResult.FuelTypeName}</div>
			</div>
		</div>
	</div>`;
}

function bindImageCarouselControls(searchResult){
	let index = 0,
		last = searchResult.ImageList.length - 1,
		resultNode = $(`#vehicle${searchResult.ID}`),
		imageNode = resultNode.find('.vehicle-img');

	function changeImg(){
		imageNode.addClass('animated fadeOut')
		.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
			imageNode.removeClass('animated fadeOut')
			.css('background-image', `url('${searchResult.ImageList[index]}')`)
			.addClass('animated fadeIn')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
				imageNode.removeClass('animated fadeIn')
			});
		});
	}

	resultNode.find('.left.carousel-control').click(() => {
		index = (index === 0) ? last : index - 1;
		changeImg();
	});

	resultNode.find('.right.carousel-control').click(() => {
		index = (index === last) ? 0 : index + 1;
		changeImg();
	});
}

function renderPaginator(domNode, data){
	domNode.data("twbs-pagination") && domNode.twbsPagination('destroy');
	domNode.removeClass('hidden');
	domNode.twbsPagination({
		startPage: data.CurrentPage,
		totalPages: data.TotalPage,
		visiblePages: 5,
		first: '<i class="fa fa-angle-double-left"></i>',
		prev: '<i class="fa fa-angle-left"></i>',
		next: '<i class="fa fa-angle-right"></i>',
		last: '<i class="fa fa-angle-double-right"></i>',
		onPageClick: function (event, page) {
			if(page != searchConditions.Page){
				searchConditions.Page = page;
				renderSearcher();
			}
		}
	});

	domNode
	.addClass('animated fadeIn')
	.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
		domNode.removeClass('animated fadeIn')
	});
}

function renderRecordInfo(domNode, data){
	let firstResultPosition = (searchConditions.Page - 1) * NUM_RECORD_PER_PAGE + 1
		, lastResultPosition = (searchConditions.Page * NUM_RECORD_PER_PAGE) < data.TotalResult
			? (searchConditions.Page * NUM_RECORD_PER_PAGE)
			: data.TotalResult
		, newHtml = `${firstResultPosition} - ${lastResultPosition} of ${data.TotalResult} vehicle(s)`;

	domNode.html(newHtml);

	domNode
	.addClass('animated fadeIn')
	.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
		domNode.removeClass('animated fadeIn')
	});
}

function renderPriceSlider(data){
	priceFilter.noUiSlider.destroy();
	let priceSlider = noUiSlider.create(priceFilter, {
		behaviour: 'drag-tap',
		connect: true,
		format: {
			to: value => `${Number.parseInt(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`,
			from: value => Number.parseInt(value.replace('₫', '').replace(',', ''))
		},
		margin: 100000,
		pips: {
			mode: 'values',
			values: [ Number.parseInt(data.AveragePrice) ],
			density: Infinity,
			format: {
				to: value => `Trung&nbsp;bình:&nbsp;${Number.parseInt(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`,
				from: value => Number.parseInt(value.replace('₫', '').replace('Trung bình ', '').replace(',', ''))
			}
		},
		start: [searchConditions.MinPrice || 0, searchConditions.MaxPrice || priceSliderMax || 100000],
		range: {
			'min': [0],
			'max': [priceSliderMax || 100000]
		}
	});
	priceSlider.on('update', (values, handle, unencoded) => {
		$('#minPriceDisplay').html(values[0]);
		$('#maxPriceDisplay').html(values[1]);
	});
	priceSlider.on('set', (values, handle, unencoded) => {
		searchConditions.MinPrice = unencoded[0];
		searchConditions.MaxPrice = unencoded[1];

		delete searchConditions.Page;
		renderSearcher();
	});
}

function renderSearcher(){
	//console.log(searchConditions);
	jQueryNodes.searchResultGrid.addClass('hidden');
	jQueryNodes.paginator.addClass('hidden');
	jQueryNodes.recordInfo.html(`<div style="font-size:1.5em; text-align:center; padding: 3em 0">
		<div class="sk-spinner sk-spinner-three-bounce">
			<div class="sk-bounce1"></div>
			<div class="sk-bounce2"></div>
			<div class="sk-bounce3"></div>
		</div>
	</div>`);
console.log(searchConditions);
	$.ajax({
		url: queryApiUrl,
		type: 'GET',
		dataType: 'json',
		data: searchConditions
	})
	.done(function(data) {
		if(data.SearchResultList && data.SearchResultList.length > 0){
			searchConditions.Page = data.CurrentPage;

			renderSearchResultGrid(jQueryNodes.searchResultGrid, data.SearchResultList);
			renderPaginator(jQueryNodes.paginator, data);
			renderRecordInfo(jQueryNodes.recordInfo, data);
			renderPriceSlider(data);
		} else {
			jQueryNodes.recordInfo.html(`<div style="font-size:1.5em; text-align:center; padding: 3em 0">
				No vehicle fits your parameters. Please try again.
			</div>`);
		}
	})
	.fail(function(err, textStatus, errorThrown) {
		console.log(err, textStatus, errorThrown);
		jQueryNodes.recordInfo.html(`<div style="font-size:1.5em; text-align:center; padding: 3em 0">
			No vehicle fits your parameters. Please try again.
		</div>`);
	})
}
//==================================

$(document).ready(() => {
	now = moment();

	jQueryNodes = {
		resultContainer: $('#resultContainer')
		, filters: $('#filters')
		, startTimeFilter: $('#startTimeFilter')
		, endTimeFilter: $('#endTimeFilter')
		, sorter: $('#sorter')
		, locationFilter : $('#locationFilter')
		, brandFilter: $('#brandFilter')
		, modelFilter: $('#modelFilter')
		, searchResultGrid: $('#searchResultGrid')
		, paginator: $('#paginatior')
		, recordInfo: $('#recordInfo')
	}

	searchConditions = {
		BrandIDList: []
		, ModelIDList: []
		, TransmissionTypeIDList: []
		, OrderBy: jQueryNodes.sorter.val()
		, IsDescendingOrder: jQueryNodes.sorter.find(":selected").data('is-descending')
	};

	let soonestPossibleBookingStartTimeFromNow = now.clone().add(SOONEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_HOUR, 'hours').subtract(1, 'minutes'),
		latestPossibleBookingStartTimeFromNow = now.clone().add(LATEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_DAY, 'days').add(1, 'minutes'),
		soonestPossibleBookingEndTimeFromNow = now.clone().add(SOONEST_POSSIBLE_BOOKING_END_TIME_FROM_NOW_IN_HOUR, 'hours').subtract(1, 'minutes');

	let sessionStartTime = sessionStorage.getItem('startTime');
	sessionStartTime = sessionStartTime && moment(sessionStartTime);

	if(!sessionStartTime || (sessionStartTime.isBefore(soonestPossibleBookingStartTimeFromNow) && sessionStartTime.isAfter(latestPossibleBookingStartTimeFromNow)))
		sessionStartTime = now.clone().add(1, 'days');

	let sessionEndTime = sessionStorage.getItem('endTime');
	sessionEndTime = sessionEndTime && moment(sessionEndTime);

	if(!sessionEndTime || sessionEndTime.isBefore(soonestPossibleBookingEndTimeFromNow))
		sessionEndTime = now.clone().add(2, 'days');

	searchConditions.StartTime = sessionStartTime.toJSON()
	searchConditions.EndTime = sessionEndTime.toJSON()

	sessionStorage.setItem('startTime', sessionEndTime.toJSON());
	sessionStorage.setItem('endTime', sessionEndTime.toJSON());

	let sessionLocationID = sessionStorage.getItem('locationID');
	if(sessionLocationID){
		jQueryNodes.locationFilter.val(JSON.parse(sessionLocationID));
		searchConditions.LocationID = jQueryNodes.locationFilter.val();
	}

	// Sort
	jQueryNodes.sorter.on('change', function() {
		searchConditions.OrderBy = $(this).val();
		searchConditions.IsDescendingOrder = $(this).find(":selected").data('is-descending');

		delete searchConditions.Page;
		renderSearcher();
	});

	// ============================================================
	// Time range filter
	// Start time
	jQueryNodes.startTimeFilter.datetimepicker({
		useCurrent: false,
		defaultDate: sessionStartTime,
		minDate: soonestPossibleBookingStartTimeFromNow,
		maxDate: latestPossibleBookingStartTimeFromNow,
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
	.on('dp.hide', (data)=>{
		searchConditions.StartTime = data.date.toJSON();
		sessionStorage.setItem('startTime', searchConditions.StartTime);

		if(data.date.isAfter(jQueryNodes.endTimeFilter.data('DateTimePicker').date().clone().subtract(1, 'hours'))){
			let newEndTime = data.date.clone().add(1, 'hours')
			jQueryNodes.endTimeFilter.data('DateTimePicker').date(newEndTime);
			searchConditions.EndTime = newEndTime.toJSON();
			sessionStorage.setItem('endTime', searchConditions.EndTime);
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
		defaultDate: sessionEndTime,
		minDate: soonestPossibleBookingEndTimeFromNow,
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
	.on('dp.hide', (data)=>{
		searchConditions.EndTime = data.date.toJSON();
		sessionStorage.setItem('endTime', searchConditions.EndTime);

		if(data.date.isBefore(jQueryNodes.startTimeFilter.data('DateTimePicker').date().clone().add(1, 'hours'))){
			let newStartTime = data.date.clone().subtract(1, 'hours')
			jQueryNodes.startTimeFilter.data('DateTimePicker').date(newStartTime);
			searchConditions.StartTime = newStartTime.toJSON();
			sessionStorage.setItem('startTime', searchConditions.StartTime);
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

	// ============================================================
	// Select2 selectors
	// Location
	
	jQueryNodes.locationFilter.select2({
		allowClear: true,
		placeholder: 'Bạn muốn thuê xe ở đâu?'
	})
	.on('change', function() {
		searchConditions.LocationID = $(this).val();
		sessionStorage.setItem('locationID', searchConditions.LocationID);

		delete searchConditions.Page;
		renderSearcher();
	});

	// // Brand
	// jQueryNodes.brandFilter
	// .select2({
	// 	placeholder: 'Vui lòng chọn hiệu xe...'
	// })
	// .on('change', function() {
	// 	// Remove modelFilter before regenerate it
	// 	jQueryNodes.modelFilter.select2("destroy");

	// 	// Enable all model options before
	// 	// disabling only model options belonged to selected brands
	// 	jQueryNodes.modelFilter.find('option').each((i, el) => {
	// 		el.disabled = false
	// 	});

	// 	// Get the brandIdList
	// 	searchConditions.BrandIDList = $(this).val();

	// 	let disabledModelIDList = [];
	// 	for(let brandID of searchConditions.BrandIDList){
	// 		let optgroup = jQueryNodes.modelFilter.find(`optgroup[data-brand="${brandID}"]`)
			
	// 		optgroup.find('option').each((i, el) => {
	// 			// Disable only model options belonged to selected brands
	// 			el.selected = false;
	// 			el.disabled = true;

	// 			disabledModelIDList.push(el.value.toString());
	// 		});
	// 	}
	// 	// Filter out models belonged to selected brands in searchConditions
	// 	searchConditions.ModelIDList = searchConditions.ModelIDList.filter((el) => !disabledModelIDList.includes(el.toString()));

	// 	// Regenerate modelFilter
	// 	jQueryNodes.modelFilter.select2();

	// 	delete searchConditions.Page;
	// 	renderSearcher();
	// });

	// Model
	jQueryNodes.modelFilter
	.select2({
		placeholder: 'Vui lòng chọn dòng xe...'
	})
	.on('change', function() {
		searchConditions.ModelIDList = $(this).val();

		delete searchConditions.Page;
		renderSearcher();
	});

	// Category
	$('#categoryFilter')
	.select2({
		placeholder: 'Vui lòng chọn loại xe...'
	})
	.on('change', function() {
		searchConditions.CategoryIDList = $(this).val();
		delete searchConditions.Page;

		renderSearcher();
	});

	// // Seat
	// $('#seatFilter')
	// .select2({
	// 	placeholder: 'Please select...'
	// })
	// .on('change', function() {
	// 	searchConditions.NumberOfSeatList = $(this).val();
	// 	delete searchConditions.Page;

	// 	renderSearcher();
	// });

	$('#colorFilter')
	// .select2({
	// 	placeholder: 'Please select...',
	// 	templateSelection: colorOptionFormat,
	// 	templateResult: colorOptionFormat
	// })
	// .on('change', function(){
	// 	searchConditions.ColorIDList = $(this).val();
	// 	delete searchConditions.Page;

	// 	renderSearcher();
	// });

	// Fuel
	$('#fuelFilter')
	.select2({
		placeholder: 'Vui lòng chọn loại nhiên liệu...'
	})
	.on('change', function() {
		searchConditions.FuelTypeIDList = $(this).val();
		delete searchConditions.Page;

		renderSearcher();
	});

	//=================================================
	// Sliders
	// Price filter slider
	let priceSlider = noUiSlider.create(priceFilter, {
		behaviour: 'drag-tap',
		connect: true,
		format: {
			to: value => `₫${Number.parseInt(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
			from: value => Number.parseInt(value.replace('₫', '').replace(',', ''))
		},
		margin: 100000,
		start: [0, priceSliderMax || 100000],
		range: {
			'min': [0],
			'max': [priceSliderMax || 100000]
		}
	});
	priceSlider.on('update', (values, handle, unencoded) => {
		$('#minPriceDisplay').html(values[0]);
		$('#maxPriceDisplay').html(values[1]);
	});
	priceSlider.on('set', (values, handle, unencoded) => {
		searchConditions.MinPrice = unencoded[0];
		searchConditions.MaxPrice = unencoded[1];

		delete searchConditions.Page;
		renderSearcher();
	});

	// Year filter slider
	let yearSlider = noUiSlider.create(document.getElementById('yearFilter'), {
		connect: true,
		start: [yearSliderMin || 1888, yearSliderMax || now.year()],
		step: 1,
		range: {
			'min': [yearSliderMin || 1888],
			'max': [yearSliderMax || now.year()]
		}
	});
	yearSlider.on('update', (values, handle, unencoded) => {
		$('#minYearDisplay').html(unencoded[0]);
		$('#maxYearDisplay').html(unencoded[1]);
	});
	yearSlider.on('set', (values, handle, unencoded) => {
		searchConditions.MinProductionYear = unencoded[0];
		searchConditions.MaxProductionYear = unencoded[1];

		delete searchConditions.Page;
		renderSearcher();
	});

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

	// Vehicle rating filter slider
	let vehicleRatingSlider = noUiSlider.create(document.getElementById('vehicleRatingFilter'), {
		connect: true,
		direction: 'rtl',
		orientation: 'vertical',
		pips: {
			density: Infinity,
			format: {
				to: value => renderStarRating(Number.parseInt(value), '#1ab394', false, false)
			},
			mode: 'count',
			values: 6
		},
		start: [0, 5],
		step: 1,
		range: {
			'min': [0],
			'max': [5]
		}
	});
	vehicleRatingSlider.on('set', (values, handle, unencoded) => {
		searchConditions.MinVehicleRating = unencoded[0];
		searchConditions.MaxVehicleRating = unencoded[1];

		delete searchConditions.Page;
		renderSearcher();
	});

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