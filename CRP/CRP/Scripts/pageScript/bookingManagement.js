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
    info: "Đang hiển thị trang _PAGE_ trên tổng số _PAGES_ trang",
    infoEmpty: "không có dữ liệu",
    infoFiltered: "(được lọc ra từ _MAX_ dòng)"
}

$(document).ready( function () {
    let garageID = null;
    let isCanceled = false;
    let isSelfBooking = false;
    let isInThePast = null;

    if ($('#byGarage').is(':checked')) {
        garageID = parseInt($('#garageID').val());
    } else {
        garageID = null;
    }

    let table = $(bookings).DataTable({
        dom: "ltipr"
		, serverSide: true
		, ajax: {
		    url: queryApiUrl
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
				    if (data) {
                        return renderStarRating(data);
				    }
				    return '-';
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

    $('#byGarage').on('change', function () {
        if ($('#byGarage').is(':checked')) {
            $('#garageID').removeAttr("disabled");
            garageID = parseInt($('#garageID').val());
        } else {
            $('#garageID').attr('disabled', 'disabled');
            garageID = null;
        }
        table.ajax.reload();
    });

    $('#garageID').on('change', function () {
        garageID = parseInt($('#garageID').val());
        table.ajax.reload();
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
        table.ajax.reload();
    });
});