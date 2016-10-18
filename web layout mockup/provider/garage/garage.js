const mockupData = [
	{ "id": 1, "name": "BMW X5a", "brandID": 2, "modelID": 14, "modelName": "BMW X5", "groupID": 1, "groupName": "BMW Group 1", "year": "2014", "category": "SUV", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 2, "name": "BMW X6b", "brandID": 2, "modelID": 15, "modelName": "BMW X6", "groupID": 1, "groupName": "BMW Group 1", "year": "2015", "category": "SUV", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 3, "name": "BMW X3c", "brandID": 2, "modelID": 13, "modelName": "BMW X3", "groupID": 1, "groupName": "BMW Group 1", "year": "2016", "category": "SUV", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 4, "name": "Audi A7d", "brandID": 1, "modelID": 3, "modelName": "Audi A7", "groupID": 2, "groupName": "Audi Group 2", "year": "2014", "category": "Station Wagon", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 5, "name": "Audi A8e", "brandID": 1, "modelID": 4, "modelName": "Audi A8", "groupID": 2, "groupName": "Audi Group 2", "year": "2015", "category": "Station Wagon", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 6, "name": "Audi A8f", "brandID": 1, "modelID": 4, "modelName": "Audi A8", "groupID": 2, "groupName": "Audi Group 2", "year": "2016", "category": "Station Wagon", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 7, "name": "Ford Fiesta STg", "brandID": 3, "modelID": 18, "modelName": "Ford Fiesta Mk6", "groupID": 3, "groupName": "Ford Group 3", "year": "2014", "category": "Station Wagon", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"}
];

$(document).ready(function(){
	// Render re/deactivate button
	let isActivateInput = $('#isActive');
	function renderActivationBtn(){
		let btn = $('#activationBtn')
		if(isActivateInput.val() == 'true'){
			btn.attr('data-action', 'deactivateGarage');
			btn.html('Deactivate Garage');
			btn.removeClass('btn-success');
			btn.addClass('btn-warning');
		} else {
			btn.attr('data-action', 'reactivateGarage');
			btn.html('Reactivate Garage');
			btn.removeClass('btn-warning');
			btn.addClass('btn-success');
		}
	}
	renderActivationBtn();
	// Bind the change event of isActive input with rerendering the btn
	isActivateInput.on('change', renderActivationBtn);

	// Intialize location selector
	$('#locationID').chosen({
		width: "100%",
		no_results_text: "No result!"
	});

	// Render star-rating
	let starRatingDiv = $('#starRating'),
		star = starRatingDiv.data('star')
	starRatingDiv.html(renderStarRating(star));

	// ============================================
	// Vehicle table

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
	$('#multiFilter .filter-toggle').click(function(event){
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
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="changeGarage" data-vehicle-id="${row.id}" >Change Garage</a></li>
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="changeGroup" data-vehicle-id="${row.id}" >Change Group</a></li>
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="deleteVehicle" data-vehicle-id="${row.id}" data-vehicle-name="${row.name}" >Delete Vehicle</a></li>
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="duplicateVehicle" data-vehicle-id="${row.id}" >Duplicate Vehicle</a></li>
							<li><a href="./../car/car.html" target="_blank">Edit Vehicle</a></li>
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
			{ name: 'Group', title: 'Group', data: 'groupName', width: '15%' },
			{
				name: 'Action', 
				title: 'Action',
				width: '10%',
				orderable: false,
				searchable: false
			}
		]
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

	// Custom modal's content renders dynamically
	$('#customModal').on('show.bs.modal', function(event) {
		let button = $(event.relatedTarget),
			action = button.data('action');

		switch(action){
			case 'changeGarage':{
				renderSelectorModal('garage', this, [ button.data('vehicle-id') ]);
			}
			break;case 'changeGarageMulti':{
				let vehicles = [],
					data = table.rows({ selected: true }).data();
					
				for(let i = 0; i < data.length; i++){
					vehicles.push(data[i].id);
				}

				renderSelectorModal('garage', this, vehicles);
			}
			break;case 'changeGroup':{
				renderSelectorModal('group', this, [ button.data('vehicle-id') ]);
			}
			break;case 'changeGroupMulti':{
				let vehicles = [],
					data = table.rows({ selected: true }).data();
					
				for(let i = 0; i < data.length; i++){
					vehicles.push(data[i].id);
				}

				renderSelectorModal('group', this, vehicles);
			}
			break;case 'duplicateVehicle':{
				// Ajax to get the prototype vehicle's info using id: button.data('vehicle-id')
				let protoVehicle = {
					name: 'Audi A8ZR',
					modelID: 4,
					year: 2015,
					garageID: 1,
					groupID: 1,
					transmissionType: 1,
					transmissionDetail: '8-speed ZF 8HP tiptronic automatic',
					engine: '4.2 V8 TDI',
					fuel: 6,
					color: 'black',
					description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, qui, temporibus. Eius, id iusto repellat fugiat. Quo adipisci sint natus magni facilis tempore, possimus, pariatur perferendis consequatur eum quas rerum.'
				}

				renderCreateVehicleModal(this, protoVehicle);
			}
			break;case 'createVehicle':{
				renderCreateVehicleModal(this, { });
			}
			break;case 'deleteVehicle':{
				renderConfirmModal('vehicle', 'delete', this, [{ id: button.data('vehicle-id'), name: button.data('vehicle-name') }]);
			}
			break;case 'deleteVehicleMulti':{
				let vehicles = [],
					data = table.rows({ selected: true }).data();

				for(let i = 0; i < data.length; i++){
					vehicles.push({ id: data[i].id, name: data[i].name });
				}

				renderConfirmModal('vehicle', 'delete', this, vehicles);
			}
			break;case 'deactivateGarage':{
				renderConfirmModal('garage', 'deactivate', this, [{ id: $('#garageID').val(), name: $('#garageName').val() }]);
			}
			break;case 'reactivateGarage':{
				renderConfirmModal('garage', 'reactivate', this, [{ id: $('#garageID').val(), name: $('#garageName').val() }]);
			}
			break;case 'deleteGarage':{
				renderConfirmModal('garage', 'delete', this, [{ id: $('#garageID').val(), name: $('#garageName').val() }]);
			}
			break;
		}
	});
});