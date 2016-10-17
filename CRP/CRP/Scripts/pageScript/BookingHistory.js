
$(document).ready(() => {
    // set toogling dropdown event for filter dropdown buttons
    $('#multiFilter .filter-toggle').on('click', function (event) {
        let dropdownContainer = $(this).parent();

        if (dropdownContainer.hasClass('open')) {
            $('#multiFilter .filter-toggle').parent().removeClass('open');
        } else {
            $('#multiFilter .filter-toggle').parent().removeClass('open');
            dropdownContainer.addClass('open');
        }
    });

    var searchCondition = {

    };
    // Render table
    let table = $('#garages').DataTable({
        dom: "ltipr",
        //data: mockupData,
        ajax: {
            url: "/api/BookingHistorys",
            type: "GET",
            //data: searchCondition
        },
        columnDefs: [
             {
                 // Render status label
                 targets: 2,
                 render: (data, type) => {
                     return Date(data).toString();
                 }

             },

            {
                // Render status label
                targets: 3,
                render: (data, type) => {
                    return Date(data).toString();
                }
                
            },

			{
			    // Render status label
			    targets: 4,
			    render: (data, type) => {
			        if (type === 'display') {
			            return `<div class="status-label" >
							<p class ="label label-${data ? 'danger' : 'primary'}">${data ? 'Cancle or Done': 'During'}</p>
						</div>`;
			        }
			        return data;
			    }
			},
            {
                // Render stars
                targets: 5,
                render: (data, type) => {
                    if (type === 'display') {
                        return renderStarRating(data);
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
						<ul class ="dropdown-menu">
                        	<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="detail" data-id="${row[0]}">Detail</a></li>
							${row[4] === true ?
								`<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="comment" data-id="${row[0]}">Comment</a></li>`
                                :
								`<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="cancle" data-id="${row[0]}">Cancle</a></li>`}
						</ul>
					</div>`;
			    }
			}
        ],
        columns: [
			{ name: 'ID', visible: false },
			{ name: 'VehicleName', title: 'VehicleName', width: '30%' },
			{ name: 'Start Time', title: 'Start Time', width: '15%' },
			{ name: 'End Time', title: 'End Time', width: '15%' },
            { name: 'Status', title: 'Status',  width: '15%' },
			{ name: 'Star', title: 'Star', width: '10%' },
			{
			    title: 'Action',
			    width: '10%',
			    orderable: false,
			    searchable: false
			}
        ]
    });

    // garage's name text filter
    createTextFilter(table, $('#VehicleName'), 'VehicleName');
    // garage's name text filter
    createTextFilter(table, $('#StartTime'), 'Start Time');
    // garage's address text filter
    createTextFilter(table, $('#EndTime'), 'End Time');
    // garage's name text filter
    createTextFilter(table, $('#Status'), 'Status');
    // garage's name text filter
    createTextFilter(table, $('#Star'), 'Star');

    // Render confirmation modal for actions
    $('#mdModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget),
			action = button.data('action')
        id = button.data('id')
        switch (action) {
            case 'detail': {
               
            }
            break;
            case 'comment': {

                }
            break;
            case 'cancle': {
                $(this).find('.modal-content').html(`<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			<h2 class="modal-title">
				${action === 'delete' ? 'Deletion' : (action === 'deactivate' ? 'Deactivation' : 'Activation')} Confirmation
			</h2>
		    </div>
		    <div class="modal-body">
			You are about to <b>${action}</b> this booking?</b>. Are you sure?
		    </div>
		    <div class="modal-footer">
			<button type="button" class="btn btn-default" data-dismiss="modal">No</button>
			<button type="button" class="btn btn-danger">Yes</button>
		    </div>`);
            }
            break;
              
        }
      
    });
});