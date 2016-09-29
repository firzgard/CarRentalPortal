const mockupData = [
	{ "id": 1, "name": "Garage1", "address": "13B Quang Trung, Go Vap District", "location": "Ho Chi Minh", "star": 4.7, "isActive": true},
	{ "id": 2, "name": "Garage2", "address": "209 Nguyen Tat Thanh, District 7", "location": "Ho Chi Minh", "star": 3.7, "isActive": false},
	{ "id": 3, "name": "Garage3", "address": "20 Thanh Thai, District 10", "location": "Ho Chi Minh", "star": 1.7, "isActive": false},
	{ "id": 4, "name": "Garage4", "address": "121A Nguyen Kiem, Go Vap District", "location": "Ho Chi Minh", "star": 2, "isActive": false},
	{ "id": 5, "name": "Garage5", "address": "22E Lu Gia, District 10", "location": "Ho Chi Minh", "star": 3.3, "isActive": false},
	{ "id": 6, "name": "Garage6", "address": "222 Huynh Tan Phat, District 7", "location": "Ho Chi Minh", "star": 4.4, "isActive": false},
	{ "id": 7, "name": "Garage7", "address": "23A Thanh Cong, Ba Dinh", "location": "Ha Noi", "star": 5, "isActive": true},
	{ "id": 8, "name": "Garage8", "address": "69 Nguyen Chi Thanh, Cau Giay", "location": "Ha Noi", "star": 1, "isActive": true},
	{ "id": 9, "name": "Garage9", "address": "456 Hoang Huy Giap, Cau Giay", "location": "Ha Noi", "star": 2, "isActive": true},
	{ "id": 10, "name": "Garage10", "address": "98 Hang Ngang", "location": "Ha Noi", "star": 4.7, "isActive": true}
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
				// Render stars
				targets: 4,
				render: (data, type) => {
					if(type === 'display'){
						return renderStarRating(data);
					}
					return data;
				}
			},
			{
				// Render status label
				targets: 5,
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
				targets: 6,
				render: (data, type, row) => {
					return `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Actions <i class="caret"></i>
						</button>
						<ul class="dropdown-menu">
							<li><a href="./../garage/garage.html">Edit</a></li>
							${row.isActive ?
								`<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="deactivate" data-id="${row.id}" data-name="${row.name}" >Deactivate</a></li>`
							:
								`<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="activate" data-id="${row.id}" data-name="${row.name}" >Activate</a></li>`
							}
							<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="delete" data-id="${row.id}" data-name="${row.name}" >Delete</a></li>
						</ul>
					</div>`;
				}
			}
		],
		columns: [
			{ name: 'ID', data: 'id', visible: false },
			{ name: 'Name', title: 'Name', data: 'name', width: '25%' },
			{ name: 'Address', title: 'Address', data: 'address', width: '30%' },
			{ name: 'Location', title: 'Location', data: 'location', width: '15%' },
			{ name: 'Stars', title: 'Stars', data: 'star', width: '10%' },
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
    createTextFilter(table, $('#garageName'), 'Name');
    // garage's address text filter
    createTextFilter(table, $('#garageAdress'), 'Address');
    // location checkbox filter
    createCheckboxFilter(table, $('#location'), 3);
    // rate range filter | datatype: float
    createFloatRangeFilter(table, $('#rate'), 4);
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
			You are about to <b>${action}</b> garage <b>${name}</b>. Are you sure?
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-default" data-dismiss="modal">No</button>
			<button type="button" class="btn btn-danger">Yes</button>
		</div>`);
	});
    
    $('#addGarage').on('show.bs.modal', function(event) {
        $(this).find('.modal-content').html(`
            <div class="modal-header modal-header-popup">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Add garage</h4> </div>
                <div class="modal-body">
                    <div class="input-group"> <span class="input-group-addon"><i class="fa fa-building-o"></i></span>
                        <input type="text" placeholder="Garage Name" value="Garage 3k" id="name" class="form-control input-lg" required> </div>
                    <div class="row">
                        <div class="col-md-6">
                            <label for="locationID">Location*</label>
                            <div class="form-group">
                                <select data-placeholder="Choose a model..." id="modalItemSelector" class="form-control" style="width:350px;">
                                    <option value></option>
                                    <option value="1" selected>Hồ Chí Minh</option>
                                    <option value="2">Hà Nội</option>
                                    <option value="3">Cà Mau</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="address">Address*</label>
                                <input type="text" placeholder="Address" value="666 Nguyen Hue" class="form-control" id="address" required> </div>
                            <div class="form-group">
                                <label for="email">Email*</label>
                                <input type="email" placeholder="Email Address" value="asdqlwkjd@3krental.com" class="form-control" id="email" required> </div>
                            <div class="form-group">
                                <label for="phone1">Phone 1*</label>
                                <input type="text" placeholder="Primary Phone Number" value="0912312032031" class="form-control" id="phone1" required> </div>
                            <div class="form-group">
                                <label for="phone2">Phone 2</label>
                                <input type="text" placeholder="Alternative Phone Number" value="" class="form-control" id="phone2"> </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Open Time</label>
                                <div class="input-group row">
                                    <label class="col-xs-2 control-label">Mon</label>
                                    <div class="input-group col-xs-10">
                                        <div class="input-group-addon">From</div>
                                        <input type="text" value="6:00" class="form-control" id="openTimeMon">
                                        <div class="input-group-addon">To</div>
                                        <input type="text" value="20:00" class="form-control" id="closeTimeMon"> </div>
                                </div>
                                <div class="input-group row">
                                    <label class="col-xs-2 control-label">Tue</label>
                                    <div class="input-group col-xs-10">
                                        <div class="input-group-addon">From</div>
                                        <input type="text" value="6:00" class="form-control" id="openTimeTue">
                                        <div class="input-group-addon">To</div>
                                        <input type="text" value="20:00" class="form-control" id="closeTimeTue"> </div>
                                </div>
                                <div class="input-group row">
                                    <label class="col-xs-2 control-label">Wed</label>
                                    <div class="input-group col-xs-10">
                                        <div class="input-group-addon">From</div>
                                        <input type="text" value="6:00" class="form-control" id="openTimeWed">
                                        <div class="input-group-addon">To</div>
                                        <input type="text" value="20:00" class="form-control" id="closeTimeWed"> </div>
                                </div>
                                <div class="input-group row">
                                    <label class="col-xs-2 control-label">Thu</label>
                                    <div class="input-group col-xs-10">
                                        <div class="input-group-addon">From</div>
                                        <input type="text" value="6:00" class="form-control" id="openTimeThur">
                                        <div class="input-group-addon">To</div>
                                        <input type="text" value="20:00" class="form-control" id="closeTimeThur"> </div>
                                </div>
                                <div class="input-group row">
                                    <label class="col-xs-2 control-label">Fri</label>
                                    <div class="input-group col-xs-10">
                                        <div class="input-group-addon">From</div>
                                        <input type="text" value="6:00" class="form-control" id="openTimeFri">
                                        <div class="input-group-addon">To</div>
                                        <input type="text" value="20:00" class="form-control" id="closeTimeFri"> </div>
                                </div>
                                <div class="input-group row">
                                    <label class="col-xs-2 control-label">Sat</label>
                                    <div class="input-group col-xs-10">
                                        <div class="input-group-addon">From</div>
                                        <input type="text" class="form-control" id="openTimeSat">
                                        <div class="input-group-addon">To</div>
                                        <input type="text" class="form-control" id="closeTimeSat"> </div>
                                </div>
                                <div class="input-group row">
                                    <label class="col-xs-2 control-label">Sun</label>
                                    <div class="input-group col-xs-10">
                                        <div class="input-group-addon">From</div>
                                        <input type="text" class="form-control" id="openTimeSun">
                                        <div class="input-group-addon">To</div>
                                        <input type="text" class="form-control" id="closeTimeSun"> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button class="btn btn-primary" type="submit">Save changes</button>
                </div>
        `);
        $('#modalItemSelector').chosen({
            width: "100%",
            no_results_text: "No result!"
        });
    });
});