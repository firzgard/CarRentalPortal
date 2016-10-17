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
	    //data: mockupData,
	    ajax: {
	        url: "/api/garages",
	        type: "GET",
	        //data: searchCondition
	    },
	    columnDefs: [
			{
			    // Render stars
			    targets: 4,
			    render: (data, type) => {
			        if (type === 'display') {
			            return renderStarRating(data);
			        }
			        return data;
			    }
			},
			{
			    // Render status label
			    targets: 5,
			    render: (data, type) => {
			        if (type === 'display') {
			            return `<div class="status-label" >
							<p class="label label-${data ? 'primary' : 'danger'}">${data ? 'Active' : 'Inactive'}</p>
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
								`<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="activate" data-id="${row.id}" data-name="${row.name}" >Activate</a></li>`}
							<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="delete" data-id="${row.id}" data-name="${row.name}" >Delete</a></li>
						</ul>
					</div>`;
			    }
			}
	    ],
	    columns: [
			{ name: 'ID', data: '0', visible: false },
			{ name: 'Name', title: 'Name', data: '1', width: '25%' },
			{ name: 'Address', title: 'Address', data: '2', width: '30%' },
			{ name: 'Location', title: 'Location', data: '3', width: '15%' },
			{ name: 'Stars', title: 'Stars', data: '4', width: '10%' },
			{ name: 'Status', title: 'Status', data: '5', width: '10%' },
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
});