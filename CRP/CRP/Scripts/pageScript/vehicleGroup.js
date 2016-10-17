let table1 = null;
$(document).ready(function () {
    const groupID = $('#groupID').val();
    table1 = $('#priceGroupItem').DataTable({
        dom: "ti",
        displayLength: 23,
        ordering: false,
        ajax: {
            url: `/api/priceGroup/${groupID}`,
            type: "GET",
        },
        columnDefs: [
            {
                // Render action button
                targets: 0,
                render: (data, type, row) => {
                    return `<button type="button" class ="btn btn-danger btn-circle btn-number minus-btn"  data-type="minus">
                                <i class="fa fa-minus"></i>
                            </button>`;
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<input type="number" min="1" max="23" class="max-time form-control" value="${row[0]}" />`;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<input type="number" class="price form-control" value="${row[1]}" />`;
                }
            }
        ],
        columns: [
            {
                searchable: false,
                sortable: false,
                width: '24%'
            },
            {
                title: 'Max time',
                width: '38%',
                data: "0"
            },
            {
                title: 'Price',
                width: '38%',
                data: "1"
            }

        ]
    });

	// Render re/deactivate button
    function renderActivationBtn() {
        let isActivateInput = ($('#isActive').val() === 'true');
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
	$('#isActive').on('change', renderActivationBtn);

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

	let filterConditions = {
	    VehicleGroupIDList: [groupID]
	}
	// Load vehicles belonging to this garage
	let table = $('#vehicles').DataTable({
		//data: mockupData,
	    dom: 'ltipr',
	    ajax: {
	        type: "GET",
	        url: `api/vehicles`,
	        data: filterConditions,
	    },
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
			{ name: 'ID', data: 'ID', type: 'num', visible: false },
			{ name: 'BrandID', data: 'BrandID', type: 'num', visible: false },
			{ name: 'ModelID', data: 'ModelID', type: 'num', visible: false },
			{ name: 'GarageID', data: 'GarageID', type: 'num', visible: false },
			{ name: 'Name', title: 'Name', data: 'Name', width: '20%' },
			{ name: 'Model', title: 'Model', data: 'ModelName', width: '15%' },
			{ name: 'Category', title: 'Category', data: 'category', width: '10%' },
			{ name: 'Year', title: 'Year', data: 'year', width: '5%' },
			{ name: 'Seat', title: 'Seat', data: 'NumOfSeat', width: '5%' },
			{ name: 'Transmission', title: 'Transmission', data: 'TransmissionTypeName', width: '10%' },
			{ name: 'Fuel', title: 'Fuel', data: 'FuelTypeName', width: '10%' },
			{ name: 'Garage', title: 'Garage', data: 'GarageName', width: '15%' },
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
	$('#customModal').on('show.bs.modal', function (event) {
		let button = $(event.relatedTarget),
			action = button.data('action'),
	        id = button.data('id'),
            name = button.data('name');

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
			    break;
			case 'deactivateCarGroup': {
			    renderConfirmModal('vehicle group', 'deactivate', this, [{ id: $('#groupID').val(), name: $('#groupName').val() }]);
			}
			    break;
			case 'reactivateCarGroup': {
			    renderConfirmModal('vehicle group', 'reactivate', this, [{ id: $('#groupID').val(), name: $('#groupName').val() }]);
			}
			break;
		}
	});

});

// display percent
$('#depositDisplay').val($('#deposit').val() * 100);

$('#depositDisplay').on('focusout', function () {
    $('#deposit').val(parseFloat($('#depositDisplay').val() / 100));
});

$(document).on('click','.plus-btn', function () {
    if (table1 == null) {
        table1 = $('#priceGroupItem').DataTable({
            dom: "ti",
            displayLength: 23,
            ordering: false,
            columnDefs: [
                {
                    // Render action button
                    targets: 0
                    , render: (data, type, row) => {
                        return `
    <button type="button" class ="btn btn-danger btn-circle btn-number minus-btn"  data-type="minus">
    <i class="fa fa-minus"></i>
    </button>`;
                    }
                }
            ],
            columns: [
                {
                    searchable: false,
                    sortable: false,
                    width: '24%'
                },
                {
                    title: 'Max time',
                    width: '38%',
                    data: "MaxTime"
                },
                {
                    title: 'Price',
                    width: '38%',
                    data: "Price"
                }

            ]
        });
    }
    // limit 23 row
    if ($('.max-time').length < 23) {
        table1.row.add({
            "MaxTime": `<input type="number" min="1" max="23" class="max-time form-control" value="" />`,
            "Price": `<input type="number" class="price form-control" value="" />`,
        }).draw();
    }
});

$(document).on('click', '.minus-btn', function () {
    table1.row($(this).parents('tr')).remove().draw();
    if ($('.max-time').length == 0) {
        table1.destroy();
        table1 = null;
        $('#priceGroupItem').empty();
    }
});