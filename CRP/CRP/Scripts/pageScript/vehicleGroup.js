const mockupData = [
	{ "id": 1, "name": "BMW X5a", "brandID": 2, "modelID": 14, "modelName": "BMW X5", "groupID": 1, "garage": "HCM garage", "year": "2014", "category": "SUV", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel"},
	{ "id": 2, "name": "BMW X6b", "brandID": 2, "modelID": 15, "modelName": "BMW X6", "groupID": 1, "garage": "HCM garage", "year": "2015", "category": "SUV", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" },
	{ "id": 3, "name": "BMW X3c", "brandID": 2, "modelID": 13, "modelName": "BMW X3", "groupID": 1, "garage": "HCM garage", "year": "2016", "category": "SUV", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" },
	{ "id": 4, "name": "Audi A7d", "brandID": 1, "modelID": 3, "modelName": "Audi A7", "groupID": 2, "garage": "Hanoi garage", "year": "2014", "category": "Station Wagon", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" },
	{ "id": 5, "name": "Audi A8e", "brandID": 1, "modelID": 4, "modelName": "Audi A8", "groupID": 2, "garage": "Hanoi garage", "year": "2015", "category": "Station Wagon", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" },
	{ "id": 6, "name": "Audi A8f", "brandID": 1, "modelID": 4, "modelName": "Audi A8", "groupID": 2, "garage": "Hanoi garage", "year": "2016", "category": "Station Wagon", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" },
	{ "id": 7, "name": "Ford Fiesta STg", "brandID": 3, "modelID": 18, "modelName": "Ford Fiesta Mk6", "groupID": 3, "garage": "Hanoi garage", "year": "2014", "category": "Station Wagon", "numOfSeat": 8, "transmission": "Automatic", "fuel": "Diesel" }
];

const mockupData3 = [
        {
            "class": 1
            , "time": "1"
            , "price": "100000"
        }
        , {
            "class": 2
            , "time": "2"
            , "price": "100000"
        }
        , {
            "class": 4
            , "time": "4"
            , "price": "100000"
        }

];

$(document).ready(function () {
    const groupID = $('#groupID').val();
    let table1 = $('#priceGroupItem').DataTable({
        dom: "ltipr",
        ajax: {
            url: `/api/priceGroup/1`,
            type: "GET",
        },
        columnDefs: [
            {
                // Render action button
                targets: 1
                , render: (data, type, row) => {
                    return `
        <button type="button" class ="btn btn-danger btn-circle btn-number minus-btn"  data-type="minus" data-field="quant[2]">
        <i class="fa fa-minus"></i>
        </button>
        <button type="button" class ="btn btn-primary btn-circle btn-number plus-btn" data-type="plus" data-field="quant[2]">
            <i class="fa fa-plus"></i>
        </button>`;
                }
            }
        ],
        columns: [
            {
                visible: false,
                data: "0"
            },
            {
                searchable: false,
                sortable: false,
                width: '24%'
            },
            {
                title: 'Max time',
                width: '38%',
                data: "1"
            },
            {
                title: 'Price',
                width: '38%',
                data: "2"
            }

        ]
    });

    function bindMinusBtn() {
        $('.minus-btn').unbind('click').click(function () {
            table1.row($(this).parents('tr')).remove().draw();
        });
    }
    bindMinusBtn();
    (function bindPlusBtn() {
        $('.plus-btn').unbind('click').click(function () {
            table1.row.add({
                "class": 0
                , "time": 0
                , "price": 0
            }).draw();
            bindPlusBtn();
            bindMinusBtn();
        });
    })();

	// Render re/deactivate button
	let isActivateInput = Boolean($('#isActive').val());
	function renderActivationBtn(){
		let btn = $('#activationBtn')
		if(isActivateInput == true){
			btn.attr('data-action', 'deactivateCarGroup');
			btn.html('Deactivate Car Group');
			btn.removeClass('btn-success');
			btn.addClass('btn-warning');
		} else {
			btn.attr('data-action', 'reactivateCarGroup');
			btn.html('Reactivate Car Group');
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
			{ name: 'Garage', title: 'Garage', data: 'garage', width: '15%' },
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
	// Vehicle Garage filter
	createCheckboxFilter(table, $('#garageFilter'), 3);

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
			break;case 'deactivateCarGroup':{
			    renderConfirmModal('carGroup', 'deactivate', this, [{ id: $('#groupID').val(), name: $('#groupName').val() }]);
			}
			break;case 'reactivateCarGroup':{
			    renderConfirmModal('carGroup', 'reactivate', this, [{ id: $('#groupID').val(), name: $('#groupName').val() }]);
			}
			break;
		}
	});
});