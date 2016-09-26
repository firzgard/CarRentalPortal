const mockupData = [
	{ "id": 1, "name": "BMW X5a", "brandID": 1, "modelID": 1, "modelName": "BMW X5", "groupID": 1, "groupName": "BMW Group 1", "year": "2014", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 2, "name": "BMW X6b", "brandID": 1, "modelID": 2, "modelName": "BMW X6", "groupID": 1, "groupName": "BMW Group 1", "year": "2015", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 3, "name": "BMW X2c", "brandID": 1, "modelID": 3, "modelName": "BMW X2", "groupID": 1, "groupName": "BMW Group 1", "year": "2016", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 4, "name": "Audi A7d", "brandID": 2, "modelID": 4, "modelName": "Audi A7", "groupID": 2, "groupName": "Audi Group 2", "year": "2014", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 5, "name": "Audi A8e", "brandID": 2, "modelID": 5, "modelName": "Audi A8", "groupID": 2, "groupName": "Audi Group 2", "year": "2015", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 6, "name": "Audi A9f", "brandID": 2, "modelID": 6, "modelName": "Audi A9", "groupID": 2, "groupName": "Audi Group 2", "year": "2016", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 7, "name": "Ford Fiesta STg", "brandID": 3, "modelID": 7, "modelName": "Ford Fiesta ST", "groupID": 3, "groupName": "Ford Group 3", "year": "2014", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"}
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

	// ============================================
	// Vehicle table

	// render model-tree selector
	$('#modelTree').jstree({
		core: {
			dblclick_toggle: false,
			themes: {
				icons: false,
				variant: "small"
			}
		},
		plugins: ["checkbox", "wholerow"]
	});

	// set toogling dropdown event for filter dropdown buttons
	$('#multiFilter .dropdown-toggle').on('click', function (event) {
		let dropdownContainer = $(this).parent();

		if(dropdownContainer.hasClass('open')){
			$('#multiFilter .dropdown-toggle').parent().removeClass('open');
		} else {
			$('#multiFilter .dropdown-toggle').parent().removeClass('open');
			dropdownContainer.addClass('open');
		}
		
		
	});

	// Load vehicles belonging to this garage
	$('#vehicles').DataTable({
		data: mockupData,
		dom: 'ltipr',
		lengthMenu: [ 10, 25, 50 ],
		processing: true,
		select: {
			style: 'multi+shift',

		},
		columnDefs: [
			{
				// Render action button
				targets: 12,
				render: (data, type, row) => {
					return `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info btn-block dropdown-toggle" aria-expanded="false">
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
			{ data: 'brandID', visible: false },
			{ data: 'modelID', visible: false },
			{ data: 'groupID', visible: false },
			{ title: 'Name', data: 'name', width: '20%' },
			{ title: 'Model', data: 'modelName', width: '15%' },
			{ title: 'Category', data: 'category', width: '10%' },
			{ title: 'Year', data: 'year', width: '5%' },
			{ title: 'Seat', data: 'numOfSeat', width: '5%' },
			{ title: 'Transmission', data: 'transmission', width: '10%' },
			{ title: 'Fuel', data: 'fuel', width: '10%' },
			{ title: 'Group', data: 'groupName', width: '15%' },
			{
				title: 'Action',
				width: '10%',
				orderable: false,
				searchable: false
			}
		]
	});
})