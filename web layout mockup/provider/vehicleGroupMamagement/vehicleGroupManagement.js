const mockupData = [
	{ "id": 1, "name": "Group A", "Max Rental Period": "2", "Price Group": "price a", "isActive": true },
	{ "id": 2, "name": "Group B", "Max Rental Period": "5", "Price Group": "price b", "isActive": false },
	{ "id": 10, "name": "Group C", "Max Rental Period": "6", "Price Group": "price c", "isActive": true }
];


$(document).ready(() => {
	// Render table
	$('#garages').DataTable({
		data: mockupData,
		columnDefs: [
			{
				// Render status label
				targets: 4,
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
				targets: 5,
				render: (data, type, row) => {
					return `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Actions <i class="caret"></i>
						</button>
						<ul class="dropdown-menu">
							<li><a href="./../carGroup/carGroup.html">Edit</a></li>
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
			{ title: 'Name', data: 'name', width: '30%' },
			{ title: 'Max Rental Period', data: 'Max Rental Period', width: '15%' },
            { title: 'Price Group', data: 'Price Group', width: '15%' },
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
	$('#confirmModal').on('show.bs.modal', (event) => {
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