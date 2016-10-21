const vehicleTableColumns = [
	{ name: 'ID', data: 'ID', visible: false, orderable: false, searchable: false }
	, { name: 'Name', title: 'Tên', data: 'Name' }
	, { name: 'LicenseNumber', title: 'Biển số', data: 'LicenseNumber' }
	, { name: 'VehicleGroupName', title: 'Nhóm', data: 'VehicleGroupName' }
	, { name: 'Year', title: 'Năm', data: 'Year' }
	, { name: 'NumOfSeat', title: 'Số chỗ', data: 'NumOfSeat' }
	, { name: 'Star', title: "Đánh giá", data: 'Star', width: '6.5em' }
	, { name: 'Action', title: "Action", orderable: false, searchable: false }
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
    info: "Đang hiển thị trang _PAGE_ trên tổng số _PAGES_ trang",
    infoEmpty: "không có dữ liệu",
    infoFiltered: "(được lọc ra từ _MAX_ dòng)"
}

$(document).ready(function () {
    $('.edit-control').css('display', 'none');
    $('#edit-btn').on('click', function () {
        $('.edit-control').css('display', 'inherit');
        $('.display-control').css('display', 'none');
    });
	// Render re/deactivate button
	let isActivateInput = $('#isActive');
	function renderActivationBtn(){
		let btn = $('#activationBtn')
		if(isActivateInput.val() == 'true'){
			btn.attr('data-action', 'deactivateGarage');
			btn.html('Đóng cửa Garage');
			btn.removeClass('btn-success');
			btn.addClass('btn-warning');
		} else {
			btn.attr('data-action', 'reactivateGarage');
			btn.html('Mở cửa Garage');
			btn.removeClass('btn-warning');
			btn.addClass('btn-success');
		}
	}
	renderActivationBtn();
	// Bind the change event of isActive input with rerendering the btn
	isActivateInput.on('change', renderActivationBtn);

	// Intialize location selector
	$('#locationID').chosen({
		width: "100%",
		no_results_text: "No result!"
	});

	// Render star-rating
	let starRatingDiv = $('#starRating'),
		star = starRatingDiv.data('star')
	starRatingDiv.html(renderStarRating(star));

	// ============================================
	// Vehicle table

	// set toogling dropdown event for filter dropdown buttons
	$('#multiFilter .filter-toggle').click(function(event){
		let dropdownContainer = $(this).parent();

		if(dropdownContainer.hasClass('open')){
			$('#multiFilter .filter-toggle').parent().removeClass('open');
		} else {
			$('#multiFilter .filter-toggle').parent().removeClass('open');
			dropdownContainer.addClass('open');
		}
	});

	let garageID = parseInt($('#garageID').val());
	// Load vehicles belonging to this garage
	let table = $(vehicles).DataTable({
	    dom: 'lrtip'
		, serverSide: true
		, ajax: {
		    url: queryApiUrl
			, data: (rawData) => {
			    console.log(rawData);
			    return {
			        Draw: rawData.draw,
			        GarageID: garageID
					, RecordPerPage: rawData.length
					, Page: rawData.start / rawData.length + 1
					, OrderBy: vehicleTableColumns[rawData.order[0].column].data
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
	    columns: vehicleTableColumns,
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

	// Custom modal's content renders dynamically
	$('#customModal').on('show.bs.modal', function(event) {
		let button = $(event.relatedTarget),
			action = button.data('action');

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
			break;case 'deactivateGarage':{
				renderConfirmModal('garage', 'deactivate', this, [{ id: $('#garageID').val(), name: $('#garageName').val() }]);
			}
			break;case 'reactivateGarage':{
				renderConfirmModal('garage', 'reactivate', this, [{ id: $('#garageID').val(), name: $('#garageName').val() }]);
			}
			break;case 'deleteGarage':{
				renderConfirmModal('garage', 'delete', this, [{ id: $('#garageID').val(), name: $('#garageName').val() }]);
			}
			break;
		}
	});
});