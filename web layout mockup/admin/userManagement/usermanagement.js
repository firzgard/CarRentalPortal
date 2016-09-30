const mockupData = [
	{ "id": 1, "username": "ppap", "fullname": "ppap", "email": "ppap@gmail.com", "phone": 546821384, "utildate": '9-2-1992', "isActive": true },
	{ "id": 2, "username": "asdasd", "fullname": "asdasd", "email": "asdasd@gmail.com", "phone": 546123, "utildate": '20-5-1223', "isActive": false },
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
	let table = $('#userMana').DataTable({
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
							${row.isActive ?
								`<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="deactivate" data-id="${row.id}" data-name="${row.username}" >Deactivate</a></li>`
							:
								`<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="activate" data-id="${row.id}" data-name="${row.username}" >Activate</a></li>`
							}
						</ul>
					</div>`;
				}
			}
		],
		columns: [
			{ name: 'ID', data: 'id', visible: false },
			{ name: 'User Name', title: 'User Name', data: 'username', width: '25%' },
			{ name: 'Full Name', title: 'Full Name', data: 'fullname', width: '30%' },
			{ name: 'Email', title: 'Email', data: 'email', width: '15%' },
			{ name: 'Phone', title: 'Phone', data: 'phone', width: '10%' },
            { name: 'Util Date', title: 'Util Date', data: 'utildate', width: '40%' },
			{ name: 'Status', title: 'Status', data: 'isActive', width: '10%' },
			{
				title: 'Action',
				width: '10%',
				orderable: false,
				searchable: false
			}
		]
	});


	createTextFilter(table, $('#username'), 'User Name');
   
	createTextFilter(table, $('#fullname'), 'Full Name');

	createTextFilter(table, $('#email'), 'Email');

	createTextFilter(table, $('#phone'), 'Phone');

    createTextFilter(table, $('#utildate'), 'Address');

    createCheckboxFilter(table, $('#status'), 7);

    // Render confirmation modal for actions
    $('#mdModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget),
			action = button.data('action')
        id = button.data('id'),
        name = button.data('name');

        $(this).find('.modal-content').html(`<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			<h2 class="modal-title">
				${action === 'delete' ? 'Deletion' : (action === 'deactivate' ? 'Deactivation' : 'Activation')} Confirmation
			</h2>
		</div>
		<div class="modal-body">
			You are about to <b>${action}</b> user <b>${name}</b>. Are you sure?
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-default" data-dismiss="modal">No</button>
			<button type="button" class="btn btn-danger">Yes</button>
		</div>`);
    });
});