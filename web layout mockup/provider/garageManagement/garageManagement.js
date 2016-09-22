const mockupData = [
	{ "id": 1, "name": "Garage1", "location": "Ho Chi Minh", "star": 4.7, "isActive": true},
	{ "id": 2, "name": "Garage2", "location": "Ho Chi Minh", "star": 3.7, "isActive": false},
	{ "id": 3, "name": "Garage3", "location": "Ho Chi Minh", "star": 1.7, "isActive": false},
	{ "id": 4, "name": "Garage4", "location": "Ho Chi Minh", "star": 2, "isActive": false},
	{ "id": 5, "name": "Garage5", "location": "Ho Chi Minh", "star": 3.3, "isActive": false},
	{ "id": 6, "name": "Garage6", "location": "Ho Chi Minh", "star": 4.4, "isActive": false},
	{ "id": 7, "name": "Garage7", "location": "Ha Noi", "star": 5, "isActive": true},
	{ "id": 8, "name": "Garage8", "location": "Ha Noi", "star": 1, "isActive": true},
	{ "id": 9, "name": "Garage9", "location": "Ha Noi", "star": 2, "isActive": true},
	{ "id": 10, "name": "Garage10", "location": "Ha Noi", "star": 4.7, "isActive": true}
];

// html star icons
const	fullStar = '<i class="fa fa-star"></i>',
		halfStar = '<i class="fa fa-star-half-o"></i>',
		emptyStar = '<i class="fa fa-star-o"></i>';

$(document).ready(function() {
	// Render table
	$('#garages').DataTable({
		data: mockupData,
		columnDefs: [
			{
				// Render stars
				targets: 3,
				render: function(data, type) {
					if(type === 'display'){
						for(var html = '', star = data, i = 0; i < 5; i++) {
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
						return html += `&nbsp;&nbsp;<span class="badge">${data}</span>`;
					}
					return data;
				}
			},
			{
				// Render status label
				targets: 4,
				render: function(data, type) {
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
				targets: 5,
				render: function(data, type, row) {
					return `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Actions <i class="caret"></i>
						</button>
						<ul class="dropdown-menu">
							<li><a href="./../garage/garage.html">Edit</a></li>
							${row[4] ?
								`<li><a href="#" data-toggle="modal" data-target="#confirmModal" data-action="deactivate" data-id="${row[0]}" data-name="${row[1]}" >Deactivate</a></li>`
							:
								`<li><a href="#" data-toggle="modal" data-target="#confirmModal" data-action="activate" data-id="${row[0]}" data-name="${row[1]}" >Activate</a></li>`
							}
							<li><a href="#" data-toggle="modal" data-target="#confirmModal" data-action="delete" data-id="${row[0]}" data-name="${row[1]}" >Delete</a></li>
						</ul>
					</div>`;
				}
			}
		],
		columns: [
			{ data: 'id', visible: false },
			{ title: 'Name', data: 'name', width: '55%' },
			{ title: 'Location', data: 'location', width: '15%' },
			{ title: 'Stars', data: 'star', width: '10%' },
			{ title: 'Status', data: 'isActive', width: '10%' },
			{
				title: 'Action',
				width: '10%',
				orderable: false,
				searchable: false
			}
		]
	});

	// Render confirmation modal for actions
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
	})
});