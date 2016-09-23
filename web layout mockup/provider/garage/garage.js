const mockupData = [
	{ "id": 1, "brand": "BMW", "model": "X5", "groupID": 1, "groupName": "BMW Group 1", "type": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 4.7,},
	{ "id": 2, "brand": "BMW", "model": "X6", "groupID": 1, "groupName": "BMW Group 1", "type": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 3.7,},
	{ "id": 3, "brand": "BMW", "model": "X2", "groupID": 1, "groupName": "BMW Group 1", "type": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 1.7,},
	{ "id": 4, "brand": "Audi", "model": "A7", "groupID": 2, "groupName": "Audi Group 1", "type": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 2,},
	{ "id": 5, "brand": "Audi", "model": "A8", "groupID": 2, "groupName": "Audi Group 1", "type": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 3.3,},
	{ "id": 6, "brand": "Audi", "model": "A9", "groupID": 2, "groupName": "Audi Group 1", "type": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 4.4,},
	{ "id": 7, "brand": "Ford", "model": "Fiesta ST", "groupID": 3, "groupName": "Ford Group 1", "type": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel", "star": 5,}
];

// html star icons
const	fullStar = '<i class="fa fa-star"></i>',
		halfStar = '<i class="fa fa-star-half-o"></i>',
		emptyStar = '<i class="fa fa-star-o"></i>';

function renderStarRating(starRating){
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
}

$(document).ready(function(){
	// Intialize location selector
	$('#locationID').chosen({
		width: "100%",
		no_results_text: "No result!"
	});

	// Render star-rating
	let starRatingDiv = $('#starRating'),
		star = starRatingDiv.data('star')

	starRatingDiv.html(renderStarRating(star));

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
	$('#vehicles').DataTable({
		data: mockupData,
		columnDefs: [
			{
				// Render stars
				targets: 9,
				render: (data, type) => {
					if(type === 'display'){
						return renderStarRating(data);
					}
					return data;
				}
			},
			{
				// Render action button
				targets: 10,
				render: (data, type, row) => {
					return `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Actions <i class="caret"></i>
						</button>
						<ul class="dropdown-menu">
							<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="changeGarage" data-id="${row[0]}" >Change Garage</a></li>
							<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="changeGroup" data-id="${row[0]}" >Change Group</a></li>
							<li><a href="#" data-toggle="modal" data-target="#smModal" data-action="delete" data-id="${row[0]}" data-name="${row[1]}" >Delete</a></li>
							<li><a href="#" data-toggle="modal" data-target="#bgModal" data-action="duplicate" data-id="${row[0]}" >Duplicate</a></li>
							<li><a href="./../car/car.html">Edit</a></li>
						</ul>
					</div>`;
				}
			}
		],
		columns: [
			{ data: 'id', visible: false },
			{ data: 'groupID', visible: false },
			{ title: 'Brand', data: 'brand', width: '15%' },
			{ title: 'Model', data: 'model', width: '15%' },
			{ title: 'Group', data: 'groupName', width: '15%' },
			{ title: 'Type', data: 'type', width: '10%' },
			{ title: 'Seat', data: 'numOfSeat', width: '5%' },
			{ title: 'Transmission', data: 'transmission', width: '10%' },
			{ title: 'Fuel', data: 'fuel', width: '10%' },
			{ title: 'Rating', data: 'star', width: '10%' },
			{
				title: 'Action',
				width: '10%',
				orderable: false,
				searchable: false
			}
		]
	});
})