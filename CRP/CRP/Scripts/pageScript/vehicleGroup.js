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
    info: "Đang hiển thị _START_ đến _END_ trên tổng cộng _TOTAL_ dòng",
    infoEmpty: "không có dữ liệu",
    infoFiltered: "(được lọc ra từ _MAX_ dòng)"
}

let table1 = null;
const groupID = $('#groupID').val();
const priceGroupID = $('#priceGroupID').val();

$(document).ready(function () {
    $('#drpVehicle').select2({
        width: '100%',
    });
    $('#drpGroup').select2({
        width: '100%',
    });

    $('#priceGroupItemD').DataTable({
        dom: "ti",
        ordering: false,
        ajax: {
            url: `/api/priceGroup/${priceGroupID}`,
            type: "GET",
        },
        language: viDatatables,
        columns: [
            {
                title: 'Thời gian (giờ)',
                width: '30%',
                data: "0"
            },
            {
                title: 'Giá tiền (VNĐ)',
                width: '40%',
                data: "1"
            },
            {
                title: 'Số Km tối đa (Km)',
                width: '30%',
                data: "2"
            }
        ]
    });


    table1 = $('#priceGroupItem').DataTable({
        dom: "ti",
        displayLength: 23,
        ordering: false,
        ajax: {
            url: `/api/priceGroup/${priceGroupID}`,
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
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    return `<input type="number" min="1" max="2400" class="max-distance form-control" value="${row[2]}" />`;
                }
            }
        ],
        language: viDatatables,
        columns: [
            {
                width: '10%'
            },
            {
                title: 'Thời gian (giờ)',
                width: '30%',
                data: "0"
            },
            {
                title: 'Giá tiền (VNĐ)',
                width: '30%',
                data: "1"
            },
            {
                title: 'Số Km tối đa (Km)',
                width: '30%',
                data: "2"
            }
        ]
    });
	renderActivation();

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
			action = button.data('action');
		switch(action){
			
			case 'deactivateCarGroup': {
			    renderConfirmModal('','vehicleGroupDetail', 'deactivate', this, [{ id: $('#groupID').val(), name: $('#groupNameD').val() }]);
			}
			    break;
			case 'reactivateCarGroup': {
			    renderConfirmModal('','vehicleGroupDetail', 'reactivate', this, [{ id: $('#groupID').val(), name: $('#groupNameD').val() }]);
			}
			    break;
		    case 'deleteVehicleGroup': {
		        renderConfirmModal('', 'vehicleGroupDetail', 'delete', this, [{ id: $('#groupID').val(), name: $('#groupNameD').val() }]);
		    }
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

$(document).on('click', '#btnEditGroup', function () {
    $('.display-control').css('display', 'none');
    $('.edit-control').css('display', 'inherit');
});

$(document).on('click', '#cancelChange', function () {
    $('.display-control').css('display', 'inherit');
    $('.edit-control').css('display', 'none');
    renderActivation();
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
            language: viDatatables,
            columns: [
                {
                    width: '10%'
                },
                {
                    title: 'Thời gian (giờ)',
                    width: '30%',
                    data: "MaxTime"
                },
                {
                    title: 'Giá tiền (VNĐ)',
                    width: '30%',
                    data: "Price"
                },
                {
                    title: 'Số Km tối đa (Km)',
                    width: '30%',
                    data: "MaxDistance"
                }
            ]
        });
    }
    // limit 23 row
    if ($('.max-time').length < 23) {
        table1.row.add({
            "MaxTime": `<input type="number" min="1" max="23" class="max-time form-control" value="" />`,
            "Price": `<input type="number" class="price form-control" value="" />`,
            "MaxDistance": `<input type="number" min="1" max="2400" class="max-distance form-control" value="" />`,
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

$(document).on('click', '#saveChange', function () {
    let priceGroupItemList = [];
    let checkTimeArray = [];
    for (var i = 0; i < $('.max-time').length; i++) {
        if ($(`.max-time:eq(${i})`).val() && !$(`.price:eq(${i})`).val()) {
            alert("chua nhap tien");
        }
        if (!$(`.max-time:eq(${i})`).val() && $(`.price:eq(${i})`).val()) {
            alert("chua nhap gio");
        }
        if ($(`.max-time:eq(${i})`).val() && $(`.price:eq(${i})`).val()) {
            var item = {};
            item.MaxTime = parseInt($(`.max-time:eq(${i})`).val());
            item.Price = parseInt($(`.price:eq(${i})`).val());
            if ($(`.max-distance:eq(${i})`).val()) {
                item.MaxDistance = parseInt($(`.max-distance:eq(${i})`).val());
            } else {
                item.MaxDistance = null;
            }

            if (item.MaxTime < 1 || item.MaxTime > 23) {
                alert("số giờ bị sai");
            } else {
                if (jQuery.inArray(item.MaxTime, checkTimeArray) >= 0) {
                    alert("trùng giờ");
                } else {
                    if (item.Price < 0) {
                        alert("số tiền bị âm");
                    } else {
                        priceGroupItemList.push(item);
                        checkTimeArray.push(item.MaxTime);
                    }
                }
            }
        }
    }

    let model = {};
    model.ID = parseInt(groupID);
    model.Name = null;
    model.IsActive = ($('#isActive').val() === 'True');
    model.WithDriverPriceGroupID = parseInt(priceGroupID);
    model.PriceGroup = {};
    model.PriceGroup.ID = parseInt(priceGroupID);
    model.PriceGroup.DepositPercentage = null;
    model.PriceGroup.PerDayPrice = null;
    model.PriceGroup.MaxRentalPeriod = null;
    model.PriceGroup.MaxDistancePerDay = null;
    model.PriceGroup.ExtraChargePerKm = null;

    model.PriceGroup.PriceGroupItems = {};
    model.PriceGroup.PriceGroupItems = priceGroupItemList;

    if (!$('#groupName').val()) {
        alert("Name is required!");
        return false;
    } else if ($('#groupName').val().length > 50) {
        alert("Name's length is over");
        return false;
    } else {
        model.Name = $('#groupName').val();
    }

    if (!$('#deposit').val()) {
        alert("Deposit is required!");
        return false;
    } else if (parseFloat($('#deposit').val()) < 0 || parseFloat($('#deposit').val()) > 100) {
        alert("Deposit must in range 0~100");
        return false;
    } else {
        model.PriceGroup.DepositPercentage = parseFloat($('#deposit').val());
    }

    if (!$('#per-day-price').val()) {
        alert("Per day price is required");
        return false;
    } else if (parseInt($('#per-day-price').val()) < 0) {
        alert("not allow negative number");
        return false;
    } else {
        model.PriceGroup.PerDayPrice = parseInt($('#per-day-price').val());
    }

    if ($('#max-rent').val()) {
        model.PriceGroup.MaxRentalPeriod = parseInt($('#max-rent').val());
        if (model.PriceGroup.MaxRentalPeriod < 0) {
            alert("not allow negative number");
            return false;
        }
    }
    if ($('#max-distance-day').val()) {
        model.PriceGroup.MaxDistancePerDay = parseInt($('#max-distance-day').val());
        if (model.PriceGroup.MaxDistancePerDay < 0) {
            alert("not allow negative number");
            return false;
        }
    }
    if ($('#extra-charge-day').val()) {
        model.PriceGroup.ExtraChargePerKm = parseInt($('#extra-charge-day').val());
        if (model.PriceGroup.ExtraChargePerKm < 0) {
            alert("not allow negative number");
            return false;
        }
    }

    $.ajax({
        url: `/api/vehicleGroups`,
        type: 'PATCH',
        data: model,
        success: function (data) {
            if (data.result) {

            } else {
                alert('fail');
            }
        },
        error: function () {
            alert('error');
        }
    });
});

// Render re/deactivate button
function renderActivation() {
    let isActivateInput = ($('#isActive').val() === 'True');
    let btn = $('#activationBtn');
    let name = $('#displayGroupName');
    let dName = $('#groupNameD').val();
    if (isActivateInput == true) {
        name.removeClass('bg-danger');
        name.addClass('bg-success');
        name.html(`
                <div class ="col-md-6 text-left m-t m-l m-b" style="font-size: 25px;">
                    <span>${dName}</span>
                    <label class ="label label-primary label-lg">đang hoạt động</label>
                </div>
                <div class ="col-md-2 pull-right m-t m-r-lg">
                    <a id="btnEditGroup" class ="btn btn-success"><i class ="fa fa-pencil-square-o"></i><span> Chỉnh sửa thông tin</span></a>
                </div>`);
        btn.attr('data-action', 'deactivateCarGroup');
        btn.html('Ngừng hoạt động');
        btn.removeClass('btn-success');
        btn.addClass('btn-warning');
    } else {
        name.removeClass('bg-success');
        name.addClass('bg-danger');
        name.html(`
                <div class ="col-md-6 text-left m-t m-l m-b" style="font-size: 25px;">
                    <span>${dName}</span>
                    <label class ="label label-danger label-lg">ngưng hoạt động</label>
                </div>
                <div class ="col-md-2 pull-right m-t m-r-lg">
                    <a id="btnEditGroup" class ="btn btn-success"><i class ="fa fa-pencil-square-o"></i><span> Chỉnh sửa thông tin</span></a>
                </div>`);
        btn.attr('data-action', 'reactivateCarGroup');
        btn.html('Tái kích hoạt');
        btn.removeClass('btn-warning');
        btn.addClass('btn-success');
    }
}