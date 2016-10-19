const bookingTableColumns = [
	{ name: 'ID', data: 'ID', visible: false, orderable: false, searchable: false }
	, { name: 'CustomerName', title: 'Tên khách hàng', data: 'CustomerName' }
	, { name: 'CustomertEmail', data: 'CustomertEmail', visible: false, orderable: false, searchable: false }
	, { name: 'VehicleID', data: 'VehicleID', visible: false, orderable: false, searchable: false }
	, { name: 'VehicleName', title: 'Tên xe', data: 'VehicleName' }
	, { name: 'LicenseNumber', title: 'Biển số', data: 'LicenseNumber' }
    , { name: 'RentalPrice', title: 'Giá thuê', data: 'RentalPrice' }
    , { name: 'StartTime', title: 'Thuê từ ngày', data: 'StartTime' }
    , { name: 'EndTime', title: 'Thuê đến ngày', data: 'EndTime' }
	, { name: 'Star', title: "Đánh giá", data: 'Star', width: '6.5em' }
    , { name: 'Comment', data: 'Comment', visible: false, orderable: false, searchable: false }
    , { name: 'Type', title: "Phân loại", orderable: false, searchable: false }
	, { name: 'Action', title: "Thoa tác", orderable: false, searchable: false }
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
    let garageID = parseInt($('#garageID').val());
    let isCanceled = false;
    let isSelfBooking = false;
    let isInThePast = null;

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

    if ($('#isInThePast').is(':checked')) {
        if ($('#isInFuture').is(':checked')) {
            isInThePast = null;
        } else {
            isInThePast = true;
        }
    } else {
        if ($('#isInFuture').is(':checked')) {
            isInThePast = false;
        } else {
            isInThePast = null;
        }
    }

    let table = $(bookings).DataTable({
        dom: "lftipr"
		, serverSide: true
		, ajax: {
		    url: queryApiUrl
			, data: (rawData) => {
			    console.log(rawData);
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
			    targets: -2
				, render: function (data, type, row) {
				    return renderStarRating(data);
				}
			},
			{
			    targets: -1
				, render: function (data, type, row) {
				    var action = `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info btn-block dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Actions <i class="caret"></i>
						</button>
						<ul class="dropdown-menu">
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="changeGarage" data-vehicle-id="${row.id}" >Change Garage</a></li>
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="changeGroup" data-vehicle-id="${row.id}" >Change Group</a></li>
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="deleteVehicle" data-vehicle-id="${row.id}" data-vehicle-name="${row.name}" >Delete Vehicle</a></li>
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="duplicateVehicle" data-vehicle-id="${row.id}" >Duplicate Vehicle</a></li>
							<li><a href="./../car/car.html" target="_blank">Edit Vehicle</a></li>
						</ul>
					</div>`;
				    var edit = '<a class="btn btn-edit btn-primary btn-sm">Edit</a>'
				    var del = '<a class="btn btn-edit btn-danger btn-sm">Delete</a>'
				    return action;
				}
			}
        ]
    });

});