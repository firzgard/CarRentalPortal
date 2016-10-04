const mockupData = [
	{ "id": 1, "name": "Garage1", "Max rental period": 4, "deposit": "500k", "per day price": "5000", "price": "5000", "isActive": true },
	{ "id": 2, "name": "Garage2", "Max rental period": 4.7, "deposit": "500k", "per day price": "5000", "price": "5000", "isActive": false },
	{ "id": 3, "name": "Garage3", "Max rental period": 4.7, "deposit": "500k", "per day price": "5000", "price": "5000", "isActive": false },
	{ "id": 4, "name": "Garage4", "Max rental period": 4.7, "deposit": "500k", "per day price": "5000", "price": "5000", "isActive": false },
	{ "id": 5, "name": "Garage5", "Max rental period": 4.7, "deposit": "500k", "per day price": "5000", "price": "5000", "isActive": false },
	{ "id": 6, "name": "Garage6", "Max rental period": 4.7, "deposit": "500k", "per day price": "5000", "price": "5000", "isActive": false },
];
const mockupData2 = [
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
$(document).ready(() => {
    
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
    
	// Render table
	let table = $('#garages').DataTable({
        dom: "ltipr",
		data: mockupData,
		columnDefs: [
			{
				// Render status label
				targets: 6,
				render: (data, type) => {
					if(type === 'display'){
						return `<div class="status-label" >
							<p class="label label-${data ? 'primary': 'danger'}">${data ? 'Active': 'Inactive'}</p>
						</div>`;
					}
					return data;
				}
			},
			{
				// Render action button
				targets: 7,
				render: (data, type, row) => {
					return `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Actions <i class="caret"></i>
						</button>
						<ul class="dropdown-menu">
							<li><a href="./../vehicleGroup/vehicleGroup.html">Edit</a></li>
						</ul>
					</div>`;
				}
			}
		],
		columns: [
			{ name: 'ID', data: 'id', visible: false },
			{ name: 'Name', title: 'Name', data: 'name', width: '25%' },
			{ name: 'Maxrent', title: 'Maxrent', data: 'Max rental period', width: '30%' },
			{ name: 'Deposit', title: 'Deposit', data: 'deposit', width: '15%' },
            { name: 'Per day price', title: 'Per day price', data: 'per day price', width: '30%' },
			{ name: 'Price', title: 'Price', data: 'price', width: '15%' },
			{ name: 'Status', title: 'Status', data: 'isActive', width: '10%' },
			{
				title: 'Action',
				width: '10%',
				orderable: false,
				searchable: false
			}
		]
	});

    // garage's name text filter
	createTextFilter(table, $('#name'), 'Name');
    // garage's name text filter
	createTextFilter(table, $('#maxrent'), 'Maxrent');
    // garage's address text filter
	createTextFilter(table, $('#deposit'), 'Deposit');
    // garage's name text filter
	createTextFilter(table, $('#perday'), 'Per day price');
    // garage's name text filter
	createTextFilter(table, $('#price'), 'Price');
    // status checkbox filter
    createCheckboxFilter(table, $('#status'), 5);
    
    
	// Render confirmation modal for actions
	$('#mdModal').on('show.bs.modal', function(event) {
		let button = $(event.relatedTarget),
			action = button.data('action')
			id = button.data('id'),
			name = button.data('name');

		$(this).find('.modal-content').html(`<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			<h2 class="modal-title">
				${action === 'delete' ? 'Deletion' : (action === 'deactivate' ? 'Deactivation': 'Activation')} Confirmation
			</h2>
		</div>
		<div class="modal-body">
			You are about to <b>${action}</b> car group <b>${name}</b>. Are you sure?
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-default" data-dismiss="modal">No</button>
			<button type="button" class="btn btn-danger">Yes</button>
		</div>`);
	});



    
    $('#addGarage').on('show.bs.modal', function(event) {
        $(this).find('.modal-content').html(`
           <div class ="modal-content">
                <div class ="modal-header modal-header-popup">
                    <button type="button" class ="close" data-dismiss="modal">&times; </button>
                    <h4 class ="modal-title">Add vehicle group</h4> </div>
                <div class ="modal-body">
                    <div class ="row">
                        <div class ="col-md-6">
                            <label>Name</label>
                            <input type="text" class ="form-control required input-lg">
                            <label>Deposit</label>
                            <div class ="input-group m-b boxForm text-center">
                                <input type="number" class ="form-control"> <span class ="input-group-addon">&#8363; </span></div>
                        </div>
                        <div class ="col-md-6">
                            <label>Max rental period</label>
                            <div class ="input-group m-b boxForm text-center">
                                <input type="number" class ="form-control"> <span class ="input-group-addon">day</span></div>
                            <label>Per day price</label>
                            <div class ="input-group m-b boxForm text-center">
                                <input type="number" class ="form-control"> <span class ="input-group-addon">&#8363; </span></div>
                        </div>
                    </div>
                    <div class ="ibox-content">
                        <label>Price rental</label>
                        <!--                        <div class ="ibox ibox-content float-e-margins">-->
                        <table class ="table table-striped table-bordered table-hover " id="garages"></table>
                        <!--                        </div>-->
                    </div>
                </div>
                <div class ="modal-footer">
                    <button type="button" class ="btn btn-default" data-dismiss="modal">Close</button>
                    <button class ="btn btn-primary" type="submit">Save changes</button>
                </div>
            </div>
        `);
        $('#modalItemSelector').chosen({
            width: "100%",
            no_results_text: "No result!"
        });
    });
});