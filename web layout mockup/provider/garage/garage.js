let openTime = new Date(2000, 1, 1, 6, 0, 0),
	closeTime = new Date(2000, 1, 1, 20, 0, 0),
	data = {
	id: 1,
	name: 'Garage 3k',
	locationID: 1,
	address: '666 Nguyen Hue',
	email: 'asdqlwkjd@3krental.com',
	phone1: '0912312032031',
	star: 3.2,
	isActive: true,
	openTimeMon: openTime,
	closeTimeMon: closeTime,
	openTimeTue: openTime,
	closeTimeTue: closeTime,
	openTimeWed: openTime,
	closeTimeWed: closeTime,
	openTimeThur: openTime,
	closeTimeThur: closeTime,
	openTimeFri: openTime,
	closeTimeFri: closeTime,
	openTimeSat: openTime,
	closeTimeSat: closeTime,
	openTimeSun: openTime,
	closeTimeSun: closeTime
}

$(document).ready(function(){
	// Intialize location selector
	$('#locationID').chosen({
		width: "100%",
		no_results_text: "No result!"
	});
})