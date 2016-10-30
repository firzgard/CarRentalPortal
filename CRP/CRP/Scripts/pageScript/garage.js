const vehicleTableColumns = [
	{ name: 'ID', visible: false, orderable: false, searchable: false }
	, { name: 'Name', title: 'Tên' }
    , { name: 'LicenseNumber', title: 'Biển số' }
    , { name: 'NumOfSeat', title: 'Số chỗ' }
	, { name: 'Color', title: 'Màu' }
	, { name: 'Star', title: "Đánh giá", width: '6.5em' }
	, { name: 'Action', title: "Thao tác", orderable: false, searchable: false, width: '20em' }
]

const bookingTableColumns = [
	{ name: 'ID', data: 'ID', visible: false, orderable: false, searchable: false }
	, { name: 'CustomerName', title: 'Tên khách hàng', data: 'CustomerName' }
	, { name: 'CustomertEmail', data: 'CustomertEmail', visible: false, orderable: false, searchable: false }
	, { name: 'VehicleID', data: 'VehicleID', visible: false, orderable: false, searchable: false }
	, { name: 'VehicleName', title: 'Tên xe', data: 'VehicleName' }
	, { name: 'LicenseNumber', title: 'Biển số', data: 'LicenseNumber' }
    , { name: 'RentalPrice', title: 'Giá thuê', data: 'RentalPrice' }
    , { name: 'StartTime', title: 'Thuê từ', data: 'StartTime' }
    , { name: 'EndTime', title: 'Thuê đến', data: 'EndTime' }
	, { name: 'Star', title: "Đánh giá", data: 'Star', width: '6.5em' }
    , { name: 'Comment', data: 'Comment', visible: false, orderable: false, searchable: false }
    , { name: 'IsInThePast', data: 'IsInThePast', visible: false, orderable: false, searchable: false }
    , { name: 'IsCanceled', data: 'IsCanceled', visible: false, orderable: false, searchable: false }
    , { name: 'IsSelfBooking', data: 'IsSelfBooking', visible: false, orderable: false, searchable: false }
    , { name: 'Type', title: "Tình trạng", orderable: false, searchable: false }
	, { name: 'Action', title: "Thao tác", orderable: false, searchable: false }
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

let table = null;

$(document).on('click', '#btnEditGarage', function () {
    $('.display-control').css('display', 'none');
    $('.edit-control').css('display', 'inherit');
});

$(document).on('click', '#cancelChange', function () {
    $('.display-control').css('display', 'inherit');
    $('.edit-control').css('display', 'none');
    renderActivation();
});

$(document).ready(function () {
    $('#locationID').select2({
        width: '100%',
    });

    $('#btnEditGarage').on('click', function () {
        $('.edit-control').css('display', 'inherit');
        $('.display-control').css('display', 'none');
    });
    renderActivation();

	// Render star-rating
	let starRatingDiv = $('#starRating'),
		star = starRatingDiv.data('star')
	starRatingDiv.html(renderStarRating(star));

	// ============================================
	// Vehicle table

	let garageID = parseInt($('#garageID').val());

	renderWorkingTime(garageID, false);
	renderWorkingTime(garageID, true);

	// Load vehicles belonging to this garage
	table = $(vehicles).DataTable({
	    dom: 'lftipr',
	    ajax: {
	        url: `/api/vehicleInGarage/${garageID}`,
	        type: 'GET',
	    },
        language: viDatatables,
	    select: {
	        selector: 'td:not(:last-child)',
	        style: 'multi+shift'
	    },
	    //"iDisplayLength": 10,
	    columns: vehicleTableColumns,
	    columnDefs: [
            {
                targets: 1,
                render: function (data, type, row) {
                    return `<a href="/management/vehicleManagement/${row[0]}">${data}</a>`;
                }
            },
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
				    var changeGarage = `<a data-toggle="modal" data-target="#changeGarage" data-vehicle-id="${row[0]}" class="btn btn-primary"><i class="fa fa-tag"></i> Đổi garage</a>`;
					return changeGarage;
				}
			}
		],
	});

	let isCanceled = false;
	let isSelfBooking = false;
	let isInThePast = null;

	let tableBooking = $(bookings).DataTable({
	    dom: "ltipr"
		, serverSide: true
		, ajax: {
		    url: queryBookingApiUrl
			, data: (rawData) => {
			    return {
			        Draw: rawData.draw,
			        GarageID: garageID,
			        IsCanceled: isCanceled,
			        IsSelfBooking: isSelfBooking,
			        IsInThePast: isInThePast
					, RecordPerPage: rawData.length
					, Page: rawData.start / rawData.length + 1
					, OrderBy: bookingTableColumns[rawData.order[0].column].data
					, IsDescendingOrder: rawData.order[0].dir == 'desc'
			    };
			}
		},
	    language: viDatatables,
	    retrieve: true,
	    scrollCollapse: true,
	    processing: true,
	    select: {
	        selector: 'td:not(:last-child)',
	        style: 'multi+shift'
	    },
	    //"iDisplayLength": 10,
	    columns: bookingTableColumns,
	    columnDefs: [
			{
			    targets: -7
				, render: function (data, type, row) {
				    return renderStarRating(data);
				}
			},
            {
                targets: -2
				, render: function (data, type, row) {
				    var timeReceipt = "";
				    var status = "";
				    if (row.IsInThePast) {
				        timeReceipt = `<div class="status-label" >
							<p class ="label label-lg label-success">Đã qua</p>
						</div>`;
				    } else {
				        timeReceipt = `<div class="status-label" >
							<p class ="label label-lg label-warning">Sắp đến</p>
						</div>`;
				    }
				    if (row.IsCanceled) {
				        status = `<div class="status-label" >
							<p class ="label label-lg label-danger">Đã hủy</p>
						</div>`;
				    } else {
				        if (row.IsSelfBooking) {
				            status = `<div class="status-label" >
							<p class ="label label-lg label-info">Tự đặt</p>
						</div>`;
				        } else {
				            status = `<div class="status-label" >
							<p class ="label label-lg label-primary">Thành công</p>
						</div>`;
				        }
				    }
				    return timeReceipt +" "+ status;
				}
            },
			{
			    targets: -1
				, render: function (data, type, row) {
				    var action = `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info btn-block dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Thao tác <i class="caret"></i>
						</button>
						<ul class="dropdown-menu">
							<li><a href="#" data-toggle="modal" data-target="#customModal">Chi tiết</a></li>
                            ${row.IsSelfBooking && !row.IsInThePast? `<li><a href="#" data-toggle="modal" data-target="#customModal">Hủy tự đặt</a></li>`: ''}
							
						</ul>
					</div>`;
				    var info = '<a class="btn btn-success btn-sm"><i class="fa fa-info-circle"></i><span> Chi tiết</span></a>';
				    var del = '';
				    if (row.IsSelfBooking && !row.IsInThePast) {
				        del = '<a class="btn btn-danger btn-sm"><i class="fa fa-trash"></i><span> Hủy</span></a>';
				    }
				    return info +" "+ del;
				}
			}
	    ]
	});

	$('#listAdd').on('click', function () {
	    $.ajax({
	        url: `/api/vehicleListGarage/${garageID}`,
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
	        url: `/api/garage/updateVehicle/${vehicleID}/${garageID}`,
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

	$('#changeGarage').on('show.bs.modal', function (event) {
	    let button = $(event.relatedTarget),
	        id = button.data('vehicle-id');
	    $('#v-id').val(id);

	    $.ajax({
	        url: `/api/listOtherGarage/${garageID}`,
	        type: "GET",
	        success: function (data) {
	            var options = "";
	            $.each(data.list, function (k, v) {
	                options += "<option value='" + v.Value + "'>" + v.Text + "</option>";
	            });
	            $("#drpGarage").html(options);
	            $('#drpGarage').select2({
	                width: '100%',
	            });
	        },
	        error: function () {
	            alert("error");
	        }
	    });
	});

	$('#btnChangeGarage').on('click', function () {

	    var vehicleID = $('#v-id').val();
	    var oGarageID = $('#drpGarage').val();

	    $.ajax({
	        url: `/api/garage/updateVehicle/${vehicleID}/${oGarageID}`,
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

	$('#customModal').on('show.bs.modal', function (event) {
	    let button = $(event.relatedTarget),
			action = button.data('action');

	    switch (action) {
	        case 'deactivateGarage': {
	            renderConfirmModal('', 'garage', 'deactivate', this, [{ id: garageID, name: $('#garageNameD').val() }]);
	        }
	            break;
	        case 'reactivateGarage': {
	            renderConfirmModal('', 'garage', 'reactivate', this, [{ id: garageID, name: $('#garageNameD').val() }]);
	        }
	            break;
	        case 'deleteGarage': {
	            renderConfirmModal('', 'garage', 'delete', this, [{ id: garageID, name: $('#garageNameD').val() }]);
	        }
	    }
	});

	$('#isCanceled, #isSelfBooking, input[name="bookingTime"]').on('change', function () {
	    if ($('#isCanceled').is(':checked')) {
	        isCanceled = true;
	    } else {
	        isCanceled = false;
	    }
	    if ($('#isSelfBooking').is(':checked')) {
	        isSelfBooking = true;
	    } else {
	        isSelfBooking = false;
	    }

	    if ($('input[name="bookingTime"]:checked').val() === "past") {
	        isInThePast = true;
	    } else if ($('input[name="bookingTime"]:checked').val() === "future") {
	        isInThePast = false;
	    } else {
	        isInThePast = null;
	    }
	    tableBooking.ajax.reload();
	});

	$('#saveChange').on('click', function () {
	    let workTable = [];

	    for (var i = 0; i < 7; i++) {
	        if (!$(`.work-start:eq(${i})`).val() && $(`.work-end:eq(${i})`).val()) {
	            alert('chua nhap thoi gian mo cua');
	        }
	        if ($(`.work-start:eq(${i})`).val() && !$(`.work-end:eq(${i})`).val()) {
	            alert('chua nhap thoi gian dong cua');
	        }
	        if ($(`.work-start:eq(${i})`).val() && $(`.work-end:eq(${i})`).val()) {
	            var item = {};
	            item.DayOfWeek = i;
	            item.OpenTimeInMinute = $(`.work-start:eq(${i})`).val();
	            item.CloseTimeInMinute = $(`.work-end:eq(${i})`).val();
                workTable.push(item);
	        }
	    }

	    let model = {};
	    model.ID = garageID;
	    model.Name = null;
	    model.LocationID = null;
	    model.Address = null;
	    model.Email = null;
	    model.Phone1 = null;
	    model.Phone2 = null;
	    model.Description = null;
	    model.Policy = null;
	    model.GarageWorkingTimes = workTable;

	    if (!$('#garageName').val()) {
	        alert("Vui long nhap ten garage");
	    } else if (!$('#garageName').val().length > 100) {
	        alert("chieu dai chuoi vuot qua gioi han");
	    } else {
	        model.Name = $('#garageName').val();
	    }

	    model.LocationID = $('#locationID').val();

	    if (!$('#gAddress').val()) {
	        alert("vui long nhap dia chi");
	    } else {
	        model.Address = $('#gAddress').val();
	    }

	    if (!$('#gEmail').val()) {
	        alert("Vui long nhap email");
	    } else {
	        model.Email = $('#gEmail').val();
	    }

	    if (!$('#gPhone1').val()) {
	        alert("Vui long nhap so dien thoai");
	    } else {
	        model.Phone1 = $('#gPhone1').val();
	    }

	    if ($('#gPhone2').val()) {
	        model.Phone2 = $('#gPhone2').val();
	    }

	    if ($('#gDescription').val()) {
	        model.Description = $('#gDescription').val();
	    }

	    if ($('#gPolicy').val()) {
	        model.Policy = $('#gPolicy').val();
	    }

	    $.ajax({
	        url: `/api/garages`,
	        type: 'PATCH',
	        data: JSON.stringify(model),
	        contentType: "application/json",
	        dataType: "json",
	        success: function (data) {
	            if (data.result) {
	                window.location.pathname = `management/garageManagement/${garageID}`;
	            } else {
	                alert(data.message);
	            }
	        },
	        error: function () {
	            alert('error');
	        }
	    });
        
	});
});

function renderActivation() {
    let isActivateInput = ($('#isActive').val() === 'True');
    let btn = $('#activationBtn');
    let name = $('#displayGarageName');
    let dName = $('#garageNameD').val();
    if (isActivateInput == true) {
        name.removeClass('bg-danger');
        name.addClass('bg-success');
        name.html(`
                <div class ="col-md-6 m-t m-l m-b" style="font-size: 25px;">
                    <span>${dName}</span>
                    <label class ="label label-primary label-lg">đang hoạt động</label>
                </div>
                <div class ="col-md-2 pull-right m-t m-r-lg">
                    <a id="btnEditGarage" class ="btn btn-success"><i class ="fa fa-pencil-square-o"></i><span> Chỉnh sửa thông tin</span></a>
                </div>`);
        btn.attr('data-action', 'deactivateGarage');
        btn.html('Ngừng hoạt động');
        btn.removeClass('btn-success');
        btn.addClass('btn-warning');
    } else {
        name.removeClass('bg-success');
        name.addClass('bg-danger');
        name.html(`
                <div class ="col-md-6 m-t m-l m-b" style="font-size: 25px;">
                    <span>${dName}</span>
                    <label class ="label label-danger label-lg">ngưng hoạt động</label>
                </div>
                <div class ="col-md-2 pull-right m-t m-r-lg">
                    <a id="btnEditGarage" class ="btn btn-success"><i class ="fa fa-pencil-square-o"></i><span> Chỉnh sửa thông tin</span></a>
                </div>`);
        btn.attr('data-action', 'reactivateGarage');
        btn.html('Tái kích hoạt');
        btn.removeClass('btn-warning');
        btn.addClass('btn-success');
    }
}

function renderWorkingTime(id, isEditable) {
    $.ajax({
        url: `/api/workingTime/${id}`,
        type: 'GET',
        success: function (data) {
            let workingTimeTable = '';
            for (var i = 0; i < 7; i++) {
                workingTimeTable += workDay(searchArray(i, data.list), isEditable);
            }
            if(isEditable) {
                $('#working-time-edit').html(workingTimeTable)
            } else {
                $('#working-time').html(workingTimeTable);
            }
            
        },
        error: function(e) {
            alert("error");
        }
    });
}

function searchArray(value, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][0] === value) {
            return array[i];
        }
    }
    return [value,'',''];
}

function workDay(workArray, isEditable) {

    let textDOW = '';
    if (workArray[0] === 0) {
        textDOW = 'Thứ hai';
    } else if (workArray[0] === 1) {
        textDOW = 'Thứ ba';
    } else if (workArray[0] === 2) {
        textDOW = 'Thứ tư';
    } else if (workArray[0] === 3) {
        textDOW = 'Thứ năm';
    } else if (workArray[0] === 4) {
        textDOW = 'Thứ sáu';
    } else if (workArray[0] === 5) {
        textDOW = 'Thứ bảy';
    } else if (workArray[0] === 6) {
        textDOW = 'Chủ nhật';
    }
    if (workArray[1] != '' && workArray[2] != '') {
        if (isEditable) {
            return `
                <div class="input-group">
                    <div class="input-group-addon gray-bg">${textDOW}</div>
                    <div class="input-group-addon">Từ</div>
                    <input type="text" data-mask="99:99" value="${workArray[1]}" class ="work-start form-control">
                    <div class="input-group-addon">Đến</div>
                    <input type="text" data-mask="99:99" value="${workArray[2]}" class ="work-end form-control">
                </div>`;
        } else {
            return `
                <div class="input-group">
                    <div class="input-group-addon gray-bg">${textDOW}</div>
                    <div class ="input-group-addon">Từ</div>
                    <div class ="input-group-addon">${workArray[1]}</div>
                    <div class ="input-group-addon">Đến</div>
                    <div class ="input-group-addon">${workArray[2]}</div>
                </div>`;
        }
    } else {
        if (isEditable) {
            return `<div class="input-group">
                        <div class="input-group-addon gray-bg">${textDOW}</div>
                        <div class="input-group-addon">Từ</div>
                        <input type="text" data-mask="99:99" value="" class ="work-start form-control">
                        <div class="input-group-addon">Đến</div>
                        <input type="text" data-mask="99:99" value="" class ="work-end form-control">
                    </div>`;
        } else {
            return `<div class="input-group">
                <div class ="input-group-addon gray-bg">${textDOW}</div>
                <div class ="input-group-addon">Nghỉ</div>
            </div>`;
        }
    }
}