const mockupData = [
	{ "id": 1, "brand": "BMW", "model": "X5" "groupID": 1, "groupName": "BMW Group 1", "Type": "Hatchback", "NumOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 4.7,},
	{ "id": 2, "brand": "BMW", "model": "X6" "groupID": 1, "groupName": "BMW Group 1", "Type": "Hatchback", "NumOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 3.7,},
	{ "id": 3, "brand": "BMW", "model": "X2" "groupID": 1, "groupName": "BMW Group 1", "Type": "Hatchback", "NumOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 1.7,},
	{ "id": 4, "brand": "Audi", "model": "A7" "groupID": 2, "groupName": "Audi Group 1", "Type": "Hatchback", "NumOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 2,},
	{ "id": 5, "brand": "Audi", "model": "A8" "groupID": 2, "groupName": "Audi Group 1", "Type": "Hatchback", "NumOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 3.3,},
	{ "id": 6, "brand": "Audi", "model": "A9" "groupID": 2, "groupName": "Audi Group 1", "Type": "Hatchback", "NumOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 4.4,},
	{ "id": 7, "brand": "Ford", "model": "Fiesta ST" "groupID": 3, "groupName": "Ford Group 1", "Type": "Hatchback", "NumOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 5,}
];

// html star icons
const	fullStar = '<i class="fa fa-star"></i>',
		halfStar = '<i class="fa fa-star-half-o"></i>',
		emptyStar = '<i class="fa fa-star-o"></i>';

$(document).ready(function(){
	// Intialize location selector
	$('#locationID').chosen({
		width: "100%",
		no_results_text: "No result!"
	});

	// Render star-rating
	let starRatingDiv = $('#starRating'),
		starRating = starRatingDiv.data('star-rating')

	starRatingDiv.html(() => {
		for(var html = '', star = starRating, i = 0; i < 5; i++) {
			if(star >= 1) {
				html += fullStar;
				star--;
			} else if (star > 0) {
				html += halfStar;
				star--;
			} else {
				html += emptyStar;
			}
		}
		return html += `&nbsp;<span class="badge">${starRating}</span>`
	});

	// Intinialize open/close time-picker
	const timepickerConfig = {
		showMeridian: false,
		defaultTime: false
	};
	$('#openTimeMon').timepicker(timepickerConfig);
	$('#closeTimeMon').timepicker(timepickerConfig);
	$('#openTimeTue').timepicker(timepickerConfig);
	$('#closeTimeTue').timepicker(timepickerConfig);
	$('#openTimeWed').timepicker(timepickerConfig);
	$('#closeTimeWed').timepicker(timepickerConfig);
	$('#openTimeThur').timepicker(timepickerConfig);
	$('#closeTimeThur').timepicker(timepickerConfig);
	$('#openTimeFri').timepicker(timepickerConfig);
	$('#closeTimeFri').timepicker(timepickerConfig);
	$('#openTimeSat').timepicker(timepickerConfig);
	$('#closeTimeSat').timepicker(timepickerConfig);
	$('#openTimeSun').timepicker(timepickerConfig);
	$('#closeTimeSun').timepicker(timepickerConfig);

	// Load vehicles belonging to this garage

})