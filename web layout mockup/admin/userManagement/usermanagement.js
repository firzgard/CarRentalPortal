const testData = [
	[1, 'Garage1', 'Garage1', 'sss@gmail.com', 0177477, 'User', '11:05 19/09/1995', true],
	[2, 'Garage1', 'Garage1', 'sss@gmail.com', 0177477, 'User', '11:05 19/09/1995', false]
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
			    targets: 7,
			    render: function (data, type) {
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
				targets: 8,
				render: function(data, type, row) {
					return `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Actions <i class="caret"></i>
						</button>
						<ul class="dropdown-menu">
							${row[7] ?
								`<li><a href="#" data-toggle="modal" data-target="#confirmModal" data-action="deactivate" data-id="${row[0]}" data-name="${row[1]}" >Deactivate</a></li>`
							:
								`<li><a href="#" data-toggle="modal" data-target="#confirmModal" data-action="activate" data-id="${row[0]}" data-name="${row[1]}" >Activate</a></li>`
							}
						</ul>
					</div>`;
				}
			}
		],
		columns: [
			{ visible: false },
			{ title: 'User name', width: '10%' },
			{ title: 'Full Name', width: '15%' },
			{ title: 'Email', width: '10%' },
            { title: 'Phone', width: '15%' },
			{ title: 'Role', width: '10%' },
            { title: 'Until Date', width: '15%' },
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