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
					    <ul class ="dropdown-menu">
						<li><a href="/management/vehicleGroupManagement/${row[0]}">Edit</a></li>
                        <li><a data-toggle="modal" data-target="#mdModal" data-action="test" >tesst</a></li>
                        ${row[5] === true ?
                        `<li><a data-toggle="modal" data-target="#mdModal" data-action="deactivate" data-id="${row[0]}" data-name="${row[1]}" >Deactivate</a></li>` :
                        `<li><a data-toggle="modal" data-target="#mdModal" data-action="activate" data-id="${row[0]}" data-name="${row[1]}" >Reactivate</a></li>`}
                        <li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="delete" data-id="${row[0]}" data-name="${row[1]}" >Delete</a></li>
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
    $('#mdModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget),
			action = button.data('action')
        id = button.data('id'),
        name = button.data('name');
        switch (action) {
            case "activate": {
                renderConfirmModal('garage', 'reactivate', this, [{ id: button.data('id'), name: button.data('name') }]);
            } break;
            case "deactivate": {
                renderConfirmModal('garage', 'deactivate', this, [{ id: button.data('id'), name: button.data('name') }]);
            } break;
            case "delete": {
                renderConfirmModal('garage', 'delete', this, [{ id: button.data('id'), name: button.data('name') }]);
            } break;
            case "test": {
                $(this).find('.modal-content').html(`<div class="row" style="text-align:center; margin-top:30px">
											<h3 style="font-size:200%;">Comment And Rate</h3>
                                              <p id="error" style="color:red"></p>
											  <div class="col-sm-12" style="text-align: center">
												<label>Comment</label>
                                                <input type="text" class="form-control" id="comment">
                                              </div>
                                               <label></label>	<br/>
                                              <button type="button" class ="btn btn-default" data-dismiss="modal">Close</button>
                                              <button type="button" class ="btn btn-success btn-yeah">Submit</button>
									            <label></label>	<br/>`);
            } break;
        }

        $(document).on('click', '.btn-yeah', function (event) {
            $("#error").html("");
            var comment = $('#comment').val();
            if (comment == "") {
                $("#error").html("PC name must not be blank!");
                return;
            }
            $.ajax({
                url: '/api/CommentBooking',
                data: {
                    id: id,
                    comment: comment,
                    star: star,
                },
                error: function () {
                    alert("Problem")
                    location.href = "/management/bookingHistory";
                },
                success: function (data) {
                    alert("Comment successfully");
                    location.href = "/management/bookingHistory";
                },
                type: 'POST'
            });
        });
    });

});
