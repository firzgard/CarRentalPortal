$(document).ready(function(){
	// Render star ratings
	$('.rating').each(function(){ $(this).html(renderStarRating($(this).data('rating'), '#1ab394')); })
	$('.rating-no-badge').each(function(){ $(this).html(renderStarRating($(this).data('rating'), '#1ab394', false)); })

	// Stick the bookingSection upon scrolling past it.
	new Waypoint.Sticky({
		element: $('#bookingSection'),
		offset: 50
	})

	// Display scrollspy upon scrolling past 1st infoSection
	new Waypoint({
		element: $('.info-section')[0],
		handler: function(direction) {
			$('#infoNavBar').toggleClass('hidden-info-nav');
		},
		offset: 71
	})

	// Scrolling handlers for scrollspy, scroll to 70px above a section
	$('#infoNavBar a').click(function (event) {
		var scrollPos = $('body > #wrapper').find($(this).attr('href')).offset().top - 70;
		$('body,html').animate({
			scrollTop: scrollPos
		}, 500);
		return false;
	});

	$('#infoModal').on('show.bs.modal', function (e) {
		let modalBodyContent = 
			`<div class="row" style="font-size:1.2em;">
				<label class="col-xs-12">Email</label>
				<div class="col-xs-12"><a class="btn btn-primary btn-block btn-outline" href="mailto:${EMAIL}">${EMAIL}</a></div>
				<label class="col-xs-12">Số điện thoại chính</label>
				<div class="col-xs-12"><a class="btn btn-primary btn-block btn-outline" href="callto:${PHONE1}">+${PHONE1}</a></div>
				${PHONE2
					? `<label class="col-xs-12">Số điện thoại thay thế</label>
						<div class="col-xs-12"><a class="btn btn-primary btn-block btn-outline" href="callto:${PHONE2}">+${PHONE2}</a></div>`
					: ''}
			</div>`

		$(this).find('.modal-body').html(modalBodyContent);
	})

	let now = moment();
	// StartTimePicker
	let soonestPossibleBookingStartTimeFromNow = now.clone().add(SOONEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_HOUR, 'hours').subtract(1, 'minutes'),
		latestPossibleBookingStartTimeFromNow = now.clone().add(LATEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_DAY, 'days').add(1, 'minutes');

	// Get the startTime from the search page to populate the booking section
	let sessionStartTime = sessionStorage.getItem('startTime');
	sessionStartTime = sessionStartTime && moment(sessionStartTime);

	if(!sessionStartTime || (sessionStartTime.isBefore(soonestPossibleBookingStartTimeFromNow) && sessionStartTime.isAfter(latestPossibleBookingStartTimeFromNow)))
		sessionStartTime = now.clone().add(1, 'days');

	$('#startTimePicker').datetimepicker({
		useCurrent: false,
		defaultDate: sessionStartTime,
		minDate: soonestPossibleBookingStartTimeFromNow,
		maxDate: latestPossibleBookingStartTimeFromNow,
		format: 'YYYY/MM/DD HH:mm',
		ignoreReadonly: true,
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
	.on('dp.error', (data)=>{
		console.log(data);
	});

	// In case the section is scrolled, reupdate datetimepicker's position
	$(window).scroll(function(event) {
		var datepicker = $('.bootstrap-datetimepicker-widget:last');
		datepicker.css({
			'top': `${$('#startTimePicker').offset().top + $('#startTimePicker').outerHeight()}px`,
		});
	});

	// ============================================
	// Image carousel rendering
	let imageIndex = 0,
		lastImageIndex = IMAGE_LIST.length - 1,
		$vehicleCarousel = $('#vehicleCarousel'),
		$carouselDisplay = $('#carouselDisplay');

	const changeImg = () =>{
		$carouselDisplay.addClass('animated fadeOut')
		.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
			$carouselDisplay.removeClass('animated fadeOut')
			.css('background-image', `url('${IMAGE_LIST[imageIndex]}')`)
			.addClass('animated fadeIn')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
				$carouselDisplay.removeClass('animated fadeIn')
			});
		});
	}
	changeImg();

	$('#vehiclePrimaryImage').click(() => {
		$vehicleCarousel.addClass('active');
		$('body').addClass('modal-open');
	})

	// bind the carousel's controllers
	$vehicleCarousel.find('.fa-times').click(()=>{
		$vehicleCarousel.removeClass('active');
		$('body').removeClass('modal-open');
	});
	$vehicleCarousel.find('.left.carousel-control').click(() => {
		imageIndex = (imageIndex === 0) ? lastImageIndex : imageIndex - 1;
		changeImg();
	});

	$vehicleCarousel.find('.right.carousel-control').click(() => {
		imageIndex = (imageIndex === lastImageIndex) ? 0 : imageIndex + 1;
		changeImg();
	});

	// bind esc button
	$(document).keyup(function(e){
		if(e.keyCode === 27){
			$vehicleCarousel.removeClass('active');
			$('body').removeClass('modal-open');
		}
	});
	// ============================================

	// Tooltip for booking section
	$("[data-toggle='tooltip']").tooltip();

	// Render the booking section info
	let $rentalType = $('#rentalType'),
		$rentalTypePrice = $('#rentalTypePrice')
		$rentalPrice = $('#rentalPrice'),
		$servicePrice = $('#servicePrice'),
		$totalPrice = $('#totalPrice'),
		$depositPrice = $('#depositPrice'),
		$numOfDay = $('#numOfDay');

	let rentalTypeValue
		, rentalUnitPrice
		, rentalPriceValue
		, servicePriceValue
		, numOfDayValue = Number.parseInt($numOfDay.val());

	renderBookingInfo = () =>{
		// Enable numOfDay input if it is perDay rental
		rentalTypeValue = Number.parseInt($rentalType.val());
		if(rentalTypeValue == 0)
			$numOfDay.prop('disabled', false);
		else
			$numOfDay.prop('disabled', true);

		// Render the price per unit display
		rentalUnitPrice = $rentalType.find('option:selected').data('price');
		$rentalTypePrice.html(`${rentalUnitPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫/${rentalTypeValue == 0 ? 'ngày' : `${rentalTypeValue} giờ`}`);

		rentalPriceValue = rentalTypeValue == 0 ? rentalUnitPrice * numOfDayValue : rentalUnitPrice
		$rentalPrice.html(`${rentalPriceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`);

		servicePriceValue = Number.parseInt(rentalPriceValue * 0.05);
		$servicePrice.html(`${servicePriceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`);

		$totalPrice.html(`${(rentalPriceValue + servicePriceValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`);
		$depositPrice.html(`${Number.parseInt(rentalPriceValue * DEPOSIT_PERCENTAGE).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`);
	}
	renderBookingInfo();

	// Also rerender on changes
	$rentalType.change(renderBookingInfo);

	$numOfDay.change(() => {
		if(Number.parseInt($numOfDay.val()) > Number.parseInt($numOfDay.prop('max'))) {
			$numOfDay.val($numOfDay.prop('max'));
		} else if (Number.parseInt($numOfDay.val()) < Number.parseInt($numOfDay.prop('min'))) {
			$numOfDay.val($numOfDay.prop('min'));
		}

		numOfDayValue = Number.parseInt($numOfDay.val());

		rentalPriceValue = rentalTypeValue == '0' ? rentalUnitPrice * numOfDayValue : rentalUnitPrice
		$rentalPrice.html(`${rentalPriceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`);

		servicePriceValue = Number.parseInt(rentalPriceValue * 0.05);
		$servicePrice.html(`${servicePriceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`);

		$totalPrice.html(`${(rentalPriceValue + servicePriceValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`);
		$depositPrice.html(`${Number.parseInt(rentalPriceValue * DEPOSIT_PERCENTAGE).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`);
	})
});
	
// 	var booked = ['2016-09-29 19:00','2016-09-30 17:00','2016-09-28 13:00','2016-09-28 14:00'];
// 	var time = [];
	
// 	$('#rent-day').datetimepicker({
// 		defaultDate: new Date(),
// 		format: 'YYYY-MM-DD',
// 		minDate: new Date(),
// 	});
// //    $('#rent-time').datetimepicker({
// //        defaultDate: new Date(),
// //        format: 'HH:00',
// //        minDate: new Date(),
// //    });
	
// 	// define booked time in day has been chosen
// 	for(var i=0; i<booked.length; i++) {
// 		if(booked[i].substr(0,10) === $('#rent-day').val()) {
// 			time.push(booked[i].substr(11,5));
// 		}
// 	}
// //    $('#rent-time').data("DateTimePicker").enabledHours(allTime);
// //    $('#rent-time').data("DateTimePicker").disabledHours(time);
	
// 	$('#rent-day').on('dp.change', function() {
// 		time = [];
// 		today = moment(new Date()).format("YYYY-MM-DD");
		
// 		for(var i=0; i<booked.length; i++) {
// 			if(booked[i].substr(0,10) === $('#rent-day').val()) {            
// 				time.push(booked[i].substr(11,5));
// 			}
// 		}
// //        $('#rent-time').data("DateTimePicker").enabledHours(allTime);
// //        $('#rent-time').data("DateTimePicker").disabledHours(time);
// //        
// //        if($('#rent-day').val() !== today.toString()) {
// //            $('#rent-time').data("DateTimePicker").minDate(false);
// //        }
// //        if($('#rent-day').val() === today.toString()) {
// //            $('#rent-time').data("DateTimePicker").minDate(moment(new Date()).format("HH:00"));
// //        }
// 	});
	
// 	/* rent by day */
// 	// start
// 	$('#start-day').datetimepicker({
// 		defaultDate: new Date(),
// 		format: 'YYYY-MM-DD',
// 		minDate: new Date(),
// 	});
// 	//end
// 	$('#end-day').datetimepicker({
// 		//defaultDate: new Date(),
// 		format: 'YYYY-MM-DD',
// 		minDate: new Date(),
// 		useCurrent: false,
// 	});
// //    // start
// //    $('#start-time').datetimepicker({
// //        defaultDate: new Date(),
// //        format: 'HH:00',
// //        minDate: new Date(),
// //    });
// //    // end
// //    $('#end-time').datetimepicker({
// //        //defaultDate: new Date(),
// //        format: 'HH:00',
// //        minDate: new Date(),
// //        useCurrent: false,
// //    });
	
// 	$('#start-day').on('dp.change',function(e) {
// 		$('#end-day').data("DateTimePicker").minDate(e.date);
// 	})
// 	$('#end-day').on('dp.change',function(e) {
// 		$('#start-day').data("DateTimePicker").maxDate(e.date);
// 	})
	
// 	$(document).ready(function(){
		
// 		$('#rent-time').on('keyup', function() {
// 			hour = parseInt(($('#rent-time').val()).substr(0,2));
// 			if(hour > 23) {
// 				$('#rent-time').val("");
// 				alert("00:00 ~ 24:00");
// 			}
			
// 			if(jQuery.inArray($('#rent-time').val(), time) >= 0) {
// 				$('#rent-time').val("");
// 				alert("that day has been booked by someone else");
// 			}
// 		});
		
// 		$('.product-images').slick({
// 			dots: true
// 		});

// 		$('#phone-view').on('click', function() {
// 			$('#phone-view').html('<i class="fa fa-phone"></i> ');
// 			$('#phone-view').append(' 01687548624');
			
// 		});
// 		$('#email-view').on('click', function() {
// 			$('#email-view').html('<i class="fa fa-envelope"></i> ');
// 			$('#email-view').append(' thanh@gmail.com');
// 		});
		
// //        // test
// //        $('#end-time').change(function() {
// ////            var s = $('#end-time').val();
// ////            var st = moment(s).format("YYYY-MM-DD HH:mm");
// ////            $('#start-time').datetimepicker('setEndDate', st);
// //        });
// //        $('#start-time').change(function() {
// //            var s = $('#start-time').val();
// //            var e = $('#end-time').val();
// //            
// //            var st = moment(s).format("YYYY-MM-DD HH:mm");
// //            var et = moment(e).format("YYYY-MM-DD HH:mm");
// //            if(e) {
// //                
// //                if(st > et) {
// //                    et = moment(s).add(1, 'days').format("YYYY-M-D HH:mm");
// //                    $('#end-time').val(et);
// //                }
// //            }
// //            $('#end-time').datetimepicker('setStartDate', st);
// //        });
		
		
// 		// total hour price
// 		var total = parseInt($('#hour-price').val()) + parseInt($('#h-fee').text().replace(",",""));
// 		total = total.toString();
// 		if (total.length >= 4) {
// 			total = total.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
// 		}
// 		$('#h-total-price').text(total);
		
// 		$('#hour-price').on('change', function() {
// 			var total = parseInt($('#hour-price').val()) + parseInt($('#h-fee').text().replace(",",""));
// 			total = total.toString();
// 			if (total.length >= 4) {
// 				total = total.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
// 			}
			
// 			$('#h-total-price').text(total);
// 		});
		
// 		// total day price
// 		$('#start-day, #end-day').on('dp.change', function() {
// 			if($('#start-day').val()) {
// 				if($('#end-day').val()) {
// 					var s = $('#start-day').val();
// 					s = moment(s);
					
// 					var e = $('#end-day').val();
// 					e = moment(e);
					
// 					var duration = moment.duration(e.diff(s));
// 					var days = duration.asDays() + 1;
// 					days = parseInt(days);
// 					var total = parseInt($('#day-price').text().replace(",",""))*days + parseInt($('#d-fee').text().replace(",",""));
// 					total = total.toString();
// 					if (total.length >= 4) {
// 						total = total.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
// 					}
// 					$('#d-total-price').text(total);
// 				}
// 			}
// 		});
		
// 		$('#checkout-day').on('click', function() {
// 			alert();
// 		});
		
// 		// Fullcalendar
// 		$('#schedule').fullCalendar({
// 			header: {
// 				left: 'prev,next today',
// 				center: 'title',
// 				right: 'month,agendaWeek,agendaDay,listWeek'
// 			},
// 			editable: false,
// 			droppable: true, // this allows things to be dropped onto the calendar
// //            drop: function() {
// //                // is the "remove after drop" checkbox checked?
// //                if ($('#drop-remove').is(':checked')) {
// //                    // if so, remove the element from the "Draggable Events" list
// //                    $(this).remove();
// //                }
// //            },
// 			eventLimit: true,
// 			views: {
// 				month: {
// 					eventLimit: 4,
// 				},
// 			},
// 			//eventBackgroundColor: '#ff0000',
// 			events: [
// 				{
// 					id: 1,
// 					title: 'ABC',
// 					start: new Date("2016-09-12 18:00"),
// 					end: new Date("2016-09-30 12:00"),
// 					allDay: false
// 				},
// 				{
// 					id: 2,
// 					title: 'ASA',
// 					start: new Date("2016-09-30 14:00"),
// 					end: new Date("2016-09-30 17:00"),
// 					color: '#ff0000',
// 					allDay: false
// 				},
// 				{
// 					id: 3,
// 					title: 'AHHH',
// 					start: new Date("2016-09-30 18:00"),
// 					end: new Date("2016-09-30 19:00"),
// 					color: '#0000ff',
// 					allDay: false
// 				},
// 				{
// 					id: 4,
// 					title: 'DR',
// 					start: new Date("2016-09-30 20:00"),
// 					end: new Date("2016-09-30 22:00"),
// 					color: '#ff0000',
// 					allDay: false,
// 				},
// 				{
// 					id: 5,
// 					title: 'AHHH',
// 					start: new Date("2016-10-01 06:00"),
// 					end: new Date("2016-10-01 09:00"),
// 					color: '#00ff00',
// 					allDay: false
// 				},
				
// 				{
// 					id: 6,
// 					title: 'SSS',
// 					start: new Date("2016-10-01 12:00"),
// 					end: new Date("2016-10-01 17:00"),
// 					color: '#778811',
// 					allDay: false
// 				},
// 				{
// 					id: 7,
// 					title: 'DR',
// 					start: new Date("2016-09-30 22:00"),
// 					end: new Date("2016-10-01 06:00"),
// 					color: '#ff0000',
// 					allDay: false,
// 					rendering: 'background',
// 				},
// 				{
// 					id: 8,
// 					title: 'DR',
// 					start: new Date("2016-09-08 06:00"),
// 					end: new Date("2016-09-10 06:00"),
// 					color: '#ff0000',
// 					rendering: 'background',
// 				},
// 			],
// //            eventRender: function(event, element) {
// //                element.append("<span class='closeon'><i class='fa fa-times'></i></span>");
// //                element.find(".closeon").click(function() {
// //                   $('#schedule').fullCalendar('removeEvents',event._id);
// //                });
// //            },
// 		});
		
// 	});