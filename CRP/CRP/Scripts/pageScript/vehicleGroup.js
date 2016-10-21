const vehicleTableColumns = [
	{ name: 'ID', visible: false, orderable: false, searchable: false }
	, { name: 'Name', title: 'Tên' }
    , { name: 'LicenseNumber', title: 'Biển số' }
	, { name: 'Color', title: 'Màu' }
	, { name: 'Star', title: "Đánh giá", width: '6.5em' }
	, { name: 'Action', title: "Thao tác", orderable: false, searchable: false, width: '20em' }
]

const viDatatables = {
    lengthMenu: "Hiển thị _MENU_ dòng",
    search: "Tìm kiếm",
    paginate: {
        first: "Trang đầu",
        previous: "Trang trước",
        next: "Trang sau",
        last: "Trang cuối",
    },
    zeroRecords: "Không tìm thấy dữ liệu",
    info: "Đang hiển thị trang _PAGE_ trên tổng số _PAGES_ trang",
    infoEmpty: "không có dữ liệu",
    infoFiltered: "(được lọc ra từ _MAX_ dòng)"
}

let table1 = null;
$(document).ready(function () {
    $('#drpVehicle').select2({
        width: '100%',
    });
    $('#drpGroup').select2({
        width: '100%',
    });
    const groupID = $('#groupID').val();
    table1 = $('#priceGroupItem').DataTable({
        dom: "ti",
        displayLength: 23,
        ordering: false,
        ajax: {
            url: `/api/priceGroup/${groupID}`,
            type: "GET",
        },
        columnDefs: [
            {
                // Render action button
                targets: 0,
                render: (data, type, row) => {
                    return `<button type="button" class ="btn btn-danger btn-circle btn-number minus-btn"  data-type="minus">
                                <i class="fa fa-minus"></i>
                            </button>`;
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<input type="number" min="1" max="23" class="max-time form-control" value="${row[0]}" />`;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<input type="number" class="price form-control" value="${row[1]}" />`;
                }
            }
        ],
        language: viDatatables,
        columns: [
            {
                searchable: false,
                sortable: false,
                width: '24%'
            },
            {
                title: 'Thời gian (giờ)',
                width: '38%',
                data: "0"
            },
            {
                title: 'Giá tiền (VNĐ)',
                width: '38%',
                data: "1"
            }

        ]
    });

	// Render re/deactivate button
    function renderActivationBtn() {
        let isActivateInput = ($('#isActive').val() === 'true');
		let btn = $('#activationBtn')
		if(isActivateInput == true){
		    btn.attr('data-action', 'deactivateCarGroup');
			btn.html('Ngừng hoạt động');
			btn.removeClass('btn-success');
			btn.addClass('btn-warning');
		} else {
		    btn.attr('data-action', 'reactivateCarGroup');
			btn.html('Tái kích hoạt');
			btn.removeClass('btn-warning');
			btn.addClass('btn-success');
		}
	}
	renderActivationBtn();
	// Bind the change event of isActive input with rerendering the btn
	$('#isActive').on('change', renderActivationBtn);

	// Render star-rating
	let starRatingDiv = $('#starRating'),
		star = starRatingDiv.data('star')
	starRatingDiv.html(renderStarRating(star));

	// ============================================
	// Load vehicles belonging to this group
	let table = $(vehicles).DataTable({
		//data: mockupData,
	    dom: 'ltipr',
	    ajax: {
	        type: "GET",
	        url: `/api/vehiclesInGroup/${groupID}`,
	    },
		lengthMenu: [ 10, 25, 50 ],
		processing: true,
		select: {
			selector: 'td:not(:last-child)',
			style: 'multi+shift'
		},
        language: viDatatables,
        columnDefs: [
            {
                targets: -2
				, render: function (data, type, row) {
				    if (data) {
				        return renderStarRating(data);
				    }
				    return '-';
				}
            },
			{
				// Render action button
				targets: -1,
				render: (data, type, row) => {
				    var changeGroup = `<a data-toggle="modal" data-target="#changeGroup" data-vehicle-id="${row[0]}" class="btn btn-primary"><i class="fa fa-tag"></i> Đổi nhóm</a>`;
				    var delFromGroup = `<a data-toggle="modal" data-target="#deleteFromGroup" data-vehicle-id="${row[0]}" data-vehicle-name="${row[1]}" class="btn btn-warning"><i class="fa fa-times"></i> Xóa khỏi nhóm</a>`;
					return changeGroup + " " + delFromGroup;
				}
			}
		],
        columns: vehicleTableColumns
	});

	$('#listAdd').on('click', function () {
	    $.ajax({
	        url: `/api/vehicleList/${groupID}`,
	        type: "GET",
	        success: function (data) {
	            var options = "";
	            $.each(data.list, function (k, v) {
	                options += "<option value='" + v.Value + "'>" + v.Text + "</option>";
	            });
	            $("#drpVehicle").html(options);
	            $('#drpVehicle').select2({
	                width: '100%',
	            });
	        },
	        error: function () {
	            alert("error");
	        }
	    });
	});

	$('#btnAddVehicle').on('click', function () {
	    var vehicleID = $('#drpVehicle').val();

	    $.ajax({
	        url: `/api/vehicleGroup/updateVehicle/${vehicleID}/${groupID}`,
	        type: 'PATCH',
	        success: function (data) {
	            if (data.result) {
	                $('.modal').modal('hide');
	                table.ajax.reload();
	            } else {
	                alert("failed!");
	            }
	        },
	        error: function (e) {
                alert("error");
	        }
	    });
	});

	$('#btnChangeGroup').on('click', function () {
	    
	    var vehicleID = $('#v-id').val();
	    var oGroupID = $('#drpGroup').val();

	    $.ajax({
	        url: `/api/vehicleGroup/updateVehicle/${vehicleID}/${oGroupID}`,
	        type: 'PATCH',
	        success: function (data) {
	            if (data.result) {
	                $('.modal').modal('hide');
	                table.ajax.reload();
	            } else {
	                alert("failed!");
	            }
	        },
	        error: function (e) {
	            alert("error");
	        }
	    });
	});

	$('#btnDeleteVehicleFromGroup').on('click', function () {
	    var vehicleID = $('#v-id').val();
	    var oGroupID = 0;

	    $.ajax({
	        url: `/api/vehicleGroup/updateVehicle/${vehicleID}/${oGroupID}`,
	        type: 'PATCH',
	        success: function (data) {
	            if (data.result) {
	                $('.modal').modal('hide');
	                table.ajax.reload();
	            } else {
	                alert("failed!");
	            }
	        },
	        error: function (e) {
	            alert("error");
	        }
	    });
	});

	// Custom modal's content renders dynamically
	$('#customModal').on('show.bs.modal', function (event) {
		let button = $(event.relatedTarget),
			action = button.data('action'),
	        id = button.data('id'),
            name = button.data('name');

		switch(action){
			case 'changeGarage':{
				renderSelectorModal('garage', this, [ button.data('vehicle-id') ]);
			}
			break;case 'changeGarageMulti':{
				let vehicles = [],
					data = table.rows({ selected: true }).data();
					
				for(let i = 0; i < data.length; i++){
					vehicles.push(data[i].id);
				}

				renderSelectorModal('garage', this, vehicles);
			}
			break;case 'changeGroup':{
				renderSelectorModal('group', this, [ button.data('vehicle-id') ]);
			}
			break;case 'changeGroupMulti':{
				let vehicles = [],
					data = table.rows({ selected: true }).data();
					
				for(let i = 0; i < data.length; i++){
					vehicles.push(data[i].id);
				}

				renderSelectorModal('group', this, vehicles);
			}
			break;case 'duplicateVehicle':{
				// Ajax to get the prototype vehicle's info using id: button.data('vehicle-id')
				let protoVehicle = {
					name: 'Audi A8ZR',
					modelID: 4,
					year: 2015,
					garageID: 1,
					groupID: 1,
					transmissionType: 1,
					transmissionDetail: '8-speed ZF 8HP tiptronic automatic',
					engine: '4.2 V8 TDI',
					fuel: 6,
					color: 'black',
					description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, qui, temporibus. Eius, id iusto repellat fugiat. Quo adipisci sint natus magni facilis tempore, possimus, pariatur perferendis consequatur eum quas rerum.'
				}

				renderCreateVehicleModal(this, protoVehicle);
			}
			break;case 'createVehicle':{
				renderCreateVehicleModal(this, { });
			}
			break;case 'deleteVehicle':{
				renderConfirmModal('vehicle', 'delete', this, [{ id: button.data('vehicle-id'), name: button.data('vehicle-name') }]);
			}
			break;case 'deleteVehicleMulti':{
				let vehicles = [],
					data = table.rows({ selected: true }).data();

				for(let i = 0; i < data.length; i++){
					vehicles.push({ id: data[i].id, name: data[i].name });
				}

				renderConfirmModal('vehicle', 'delete', this, vehicles);
			}
			    break;
			case 'deactivateCarGroup': {
			    renderConfirmModal('vehicle group', 'deactivate', this, [{ id: $('#groupID').val(), name: $('#groupName').val() }]);
			}
			    break;
			case 'reactivateCarGroup': {
			    renderConfirmModal('vehicle group', 'reactivate', this, [{ id: $('#groupID').val(), name: $('#groupName').val() }]);
			}
			break;
		}
	});

	$('#changeGroup').on('show.bs.modal', function (event) {
	    let button = $(event.relatedTarget),
	        id = button.data('vehicle-id');
	    $('#v-id').val(id);
	});
	$('#deleteFromGroup').on('show.bs.modal', function (event) {
	    let button = $(event.relatedTarget),
            id = button.data('vehicle-id'),
	        name = button.data('vehicle-name');
	    $('#v-id').val(id);
	    $('#vehicle-name').text(name);
	});

});

// display percent
$('#depositDisplay').val($('#deposit').val() * 100);

$('#depositDisplay').on('focusout', function () {
    $('#deposit').val(parseFloat($('#depositDisplay').val() / 100));
});

$(document).on('click','.plus-btn', function () {
    if (table1 == null) {
        table1 = $('#priceGroupItem').DataTable({
            dom: "ti",
            displayLength: 23,
            ordering: false,
            columnDefs: [
                {
                    // Render action button
                    targets: 0
                    , render: (data, type, row) => {
                        return `
    <button type="button" class ="btn btn-danger btn-circle btn-number minus-btn"  data-type="minus">
    <i class="fa fa-minus"></i>
    </button>`;
                    }
                }
            ],
            columns: [
                {
                    searchable: false,
                    sortable: false,
                    width: '24%'
                },
                {
                    title: 'Max time',
                    width: '38%',
                    data: "MaxTime"
                },
                {
                    title: 'Price',
                    width: '38%',
                    data: "Price"
                }

            ]
        });
    }
    // limit 23 row
    if ($('.max-time').length < 23) {
        table1.row.add({
            "MaxTime": `<input type="number" min="1" max="23" class="max-time form-control" value="" />`,
            "Price": `<input type="number" class="price form-control" value="" />`,
        }).draw();
    }
});

$(document).on('click', '.minus-btn', function () {
    table1.row($(this).parents('tr')).remove().draw();
    if ($('.max-time').length == 0) {
        table1.destroy();
        table1 = null;
        $('#priceGroupItem').empty();
    }
});