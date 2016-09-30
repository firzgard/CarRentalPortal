const mockupData = [
	{ "id": 1, "name": "BMW X5a", "brandID": 1, "modelID": 1, "modelName": "BMW X5", "groupID": 1, "Garage": "HCM garage", "year": "2014", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" },
	{ "id": 2, "name": "BMW X6b", "brandID": 1, "modelID": 2, "modelName": "BMW X6", "groupID": 1, "Garage": "Hanoi garage", "year": "2015", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" },
	{ "id": 3, "name": "BMW X2c", "brandID": 1, "modelID": 3, "modelName": "BMW X2", "groupID": 1, "Garage": "HCM Garage 2", "year": "2016", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" },
	{ "id": 4, "name": "Audi A7d", "brandID": 2, "modelID": 4, "modelName": "Audi A7", "groupID": 2, "Garage": "Ha Noi Garage 2", "year": "2014", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" },
	{ "id": 5, "name": "Audi A8e", "brandID": 2, "modelID": 5, "modelName": "Audi A8", "groupID": 2, "Garage": "Hanoi Garage 4 2", "year": "2015", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" },
	{ "id": 6, "name": "Audi A9f", "brandID": 2, "modelID": 6, "modelName": "Audi A9", "groupID": 2, "Garage": "ahihi", "year": "2016", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" },
	{ "id": 7, "name": "Ford Fiesta STg", "brandID": 3, "modelID": 7, "modelName": "Ford Fiesta ST", "groupID": 3, "Garage": "ppap", "year": "2014", "category": "Hatchback", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" }
];

$(document).ready(function(){
	// Intialize location selector
	$('#locationID').chosen({
		width: "100%",
		no_results_text: "No result!"
	});
	// render model-tree selector
	let modelTree = $.jstree.create('#modelTree', {
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
	$('#multiFilter .filter-toggle').on('click', function (event) {
		let dropdownContainer = $(this).parent();

		if(dropdownContainer.hasClass('open')){
			$('#multiFilter .filter-toggle').parent().removeClass('open');
		} else {
			$('#multiFilter .filter-toggle').parent().removeClass('open');
			dropdownContainer.addClass('open');
		}
	});

	// Load vehicles belonging to this garage
	let table = $('#vehicles').DataTable({
		data: mockupData,
		dom: 'ltipr',
		lengthMenu: [ 10, 25, 50 ],
		processing: true,
		select: {
			selector: 'td:not(:last-child)',
			style: 'multi+shift'
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
							<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="changeGarage" data-id="${row.id}" >Change Garage</a></li>
							<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="changeGroup" data-id="${row.id}" >Change Group</a></li>

							<li><a href="#" data-toggle="modal" class ="font-bold" data-target="#confirmModal" data-action="delete" data-name="${row.name}" data-id="${row.id}">Delete</a></li>

							<li><a href="#" data-toggle="modal" data-target="#bgModal" data-action="duplicate" data-id="${row.id}" >Duplicate</a></li>
							<li><a href="./../car/car.html">Edit</a></li>
						</ul>
					</div>`;
				}
			}
		],
		columns: [
			{ name: 'ID', data: 'id', type: 'num', visible: false },
			{ name: 'BrandID', data: 'brandID', type: 'num', visible: false },
			{ name: 'ModelID', data: 'modelID', type: 'num', visible: false },
			{ name: 'GroupID', data: 'groupID', type: 'num', visible: false },
			{ name: 'Name', title: 'Name', data: 'name', width: '20%' },
			{ name: 'Model', title: 'Model', data: 'modelName', width: '15%' },
			{ name: 'Category', title: 'Category', data: 'category', width: '10%' },
			{ name: 'Year', title: 'Year', data: 'year', width: '5%' },
			{ name: 'Seat', title: 'Seat', data: 'numOfSeat', width: '5%' },
			{ name: 'Transmission', title: 'Transmission', data: 'transmission', width: '10%' },
			{ name: 'Fuel', title: 'Fuel', data: 'fuel', width: '10%' },
			{ name: 'Garage', title: 'Garage', data: 'Garage', width: '15%' },
			{
				name: 'Action', 
				title: 'Action',
				width: '10%',
				orderable: false,
				searchable: false
			}
		]
	});

	$('#confirmModal').on('show.bs.modal', function (event) {
	    let button = $(event.relatedTarget),
            action = button.data('action')
	    id = button.data('id'),
        name = button.data('name');

	    $(this).find('.modal-content').html(`<div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <h2 class="modal-title">
                Deletion Confirmation
            </h2>
        </div>
        <div class="modal-body">
            You are about to <b>delete</b> car group <b>${name}</b>. Are you sure?
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">No</button>
            <button type="button" class="btn btn-danger">Yes</button>
        </div>`);
	});
	// Bind the filters with table

	// Vehicle's name filter
	createTextFilter(table, $('#vehicleNameFilter'), 'Name');
	// Model filter
	createTreeFilter(table, $('#modelFilter'), [1, 2], modelTree);
	// Category filter
	createCheckboxFilter(table, $('#categoryFilter'), 6);
	// Year filter
	createIntRangeFilter(table, $('#yearFilter'), 7);
	// Seat filter
	createIntRangeFilter(table, $('#seatFilter'), 8);
	// Transmission filter
	createCheckboxFilter(table, $('#transmissionFilter'), 9);
	// Fuel filter
	createCheckboxFilter(table, $('#fuelFilter'), 10);
	// Vehicle Group filter
	createCheckboxFilter(table, $('#groupFilter'), 3);
});