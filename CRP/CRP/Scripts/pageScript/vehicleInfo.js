// /** carInfo ver1.0 */
// /* rent by hour */
	
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