const testData = [
	[1, 'Garage1', 'Ho Chi Minh', 4.7, true],
	[2, 'Garage2', 'Ho Chi Minh', 3.7, false],
	[3, 'Garage3', 'Ho Chi Minh', 1.7, false],
	[4, 'Garage4', 'Ho Chi Minh', 2, false],
	[5, 'Garage5', 'Ho Chi Minh', 3.3, false],
	[6, 'Garage6', 'Ho Chi Minh', 4.4, false],
	[7, 'Garage7', 'Ha Noi', 5, true],
	[8, 'Garage8', 'Ha Noi', 1, true],
	[9, 'Garage9', 'Ha Noi', 2, true],
	[10, 'Garage10', 'Ha Noi', 4.7, true]
]

// html star icons
const	fullStar = '<i class="fa fa-star"></i>',
		halfStar = '<i class="fa fa-star-half-o"></i>',
		emptyStar = '<i class="fa fa-star-o"></i>';

$(document).ready(function() {
	// Render table
	$('#garages').DataTable({
		data: testData,
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
			{ visible: false },
			{ title: 'Name', width: '55%' },
			{ title: 'Province', width: '15%' },
			{ title: 'Stars', width: '10%' },
			{ title: 'Status', width: '10%' },
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