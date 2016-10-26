const vehicleTableColumns = [
	{ name: 'ID', data: 'ID', visible: false, orderable: false, searchable: false }
	, { name: 'Name', title: 'Tên', data: 'Name' }
	, { name: 'LicenseNumber', title: 'Biển số', data: 'LicenseNumber' }
	, { name: 'VehicleGroupName', title: 'Nhóm', data: 'VehicleGroupName', defaultContent: '-chưa có nhóm-' }
	, { name: 'Year', title: 'Năm', data: 'Year' }
	, { name: 'NumOfSeat', title: 'Số chỗ', data: 'NumOfSeat' }
	, { name: 'Star', title: "Đánh giá", data: 'Star', width: '6.5em' }
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
    select: {
        rows: {
            _: "%d dòng đang được chọn",
            0: "",
        }
    },
    zeroRecords: "Không tìm thấy dữ liệu",
    info: "Đang hiển thị _START_ đến _END_ trên tổng cộng _TOTAL_ dòng",
    infoEmpty: "không có dữ liệu",
    infoFiltered: "(được lọc ra từ _MAX_ dòng)"
}

$(document).ready(function () {
    let garageID = parseInt($('#garageID').val());
    
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

	let table = $(vehicleTable).DataTable({
		dom: "lftipr"
		, serverSide: true
		, ajax: {
			url: queryApiUrl
			, data: (rawData) => {
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
				, render: function(data, type, row) {
				    if (data) {
				        return renderStarRating(data);
				    }
				    return '-';
				}
			},
			{
				targets: -1
				, render: function (data, type, row) {
				    var action = `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info btn-block dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Thao tác <i class="caret"></i>
						</button>
						<ul class ="dropdown-menu">
                            <li><a data-toggle="modal" data-target="#customModal" data-action="duplicateVehicle" data-vehicle-id="${row.ID}" >Thêm xe tương tự</a></li>
							<li><a data-toggle="modal" data-target="#changeGarage" data-vehicle-id="${row.ID}" >Chuyển garage</a></li>
							<li><a data-toggle="modal" data-target="#customModal" data-action="deleteVehicle" data-vehicle-id="${row.ID}" data-vehicle-name="${row.Name}" >Xóa</a></li>
						</ul>
					</div>`;
				    var duplicate = `<a class="btn btn-primary" data-toggle="modal" data-target="#customModal" data-vehicle-id="${row.ID}" ><i class="fa fa-copy"></i><span> Thêm xe tương tự</span></a>`;
				    var del = `<a class="btn btn-danger" data-toggle="modal" data-target="#customModal" data-action="deleteVehicle" data-vehicle-id="${row.ID}" data-name="${row.Name}" ><i class="fa fa-trash"></i><span> Xóa</span></a>`;

					return duplicate + " " + del;
				}
			}
		]
	});

	var arrayVehicle = [];
    table.on('select', function () {
        arrayVehicle = [];
	    table.rows('.selected').every(function (rowIdx) {
	        arrayVehicle.push(table.row(rowIdx).data())
	    });
	}).on('deselect', function () {
	    arrayVehicle = [];
	    table.rows('.selected').every(function (rowIdx) {
	        arrayVehicle.push(table.row(rowIdx).data())
	    });
	});

	$('#customModal').on('show.bs.modal', function (event) {
	    let button = $(event.relatedTarget),
            action = button.data('action'),
            id = button.data('vehicle-id'),
            name = button.data('name');

	    if (action === "deleteVehicle") {
            renderConfirmModal(table, 'vehicle', 'delete', this, [{ id: id, name: name }]);
	    }
	});

	$('#garageID').change(function () {
	    garageID = parseInt($('#garageID').val());
	    table.ajax.reload();
	});

	$('#changeGarage').on('show.bs.modal', function (event) {

	    var listVehicle = '';
        
	    for (var i = 0; i < arrayVehicle.length; i++) {
	        listVehicle += `<li>${arrayVehicle[i].Name}</li>`;
	    }

	    $('#list-car-name').html(listVehicle);

	    $.ajax({
	        url: `/api/listOtherGarage/${garageID}`,
	        type: 'GET',
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
	        error: function (e) {
	            alert('fail to load');
	        }
	    });
	});

	$('#changeGroup').on('show.bs.modal', function (event) {

	    var listVehicle = '';

	    for (var i = 0; i < arrayVehicle.length; i++) {
	        listVehicle += `<li>${arrayVehicle[i].Name}</li>`;
	    }

	    $('#list-car-name-group').html(listVehicle);

	    $.ajax({
	        url: `/api/listGroup`,
	        type: 'GET',
	        success: function (data) {
	            var options = "";
	            $.each(data.list, function (k, v) {
	                options += "<option value='" + v.Value + "'>" + v.Text + "</option>";
	            });
	            $("#drpGroup").html(options);
	            $('#drpGroup').select2({
	                width: '100%',
	            });
	        },
	        error: function (e) {
	            alert('fail to load');
	        }
	    });
	});

	$('#btnChangeGarage').on('click', function () {
	    targetGarageID = $('#drpGarage').val();
	    var fail = false;

	    for (var i = 0; i < arrayVehicle.length; i++) {
	        $.ajax({
	            url: `/api/garage/updateVehicle/${arrayVehicle[i].ID}/${targetGarageID}`,
	            type: 'PATCH',
	            success: function (data) {
	                if (!data.result) {
	                    fail = true;
	                }
	            },
	            error: function (e) {
	                alert('error');
	            }
	        });
	    }

	    $('.modal').modal('hide');
	    if (fail) {
	        alert('fail');
	    } else {
	        table.ajax.reload();
	    }
	});

	$('#btnChangeGroup').on('click', function () {
	    targetGroupID = $('#drpGroup').val();
	    var fail = false;

	    for (var i = 0; i < arrayVehicle.length; i++) {
	        $.ajax({
	            url: `/api/vehicleGroup/updateVehicle/${arrayVehicle[i].ID}/${targetGroupID}`,
	            type: 'PATCH',
	            success: function (data) {
	                if (!data.result) {
	                    fail = true;
	                }
	            },
	            error: function (e) {
	                alert('error');
	            }
	        });
	    }

	    $('.modal').modal('hide');
	    if (fail) {
	        alert('fail');
	    } else {
	        table.ajax.reload();
	    }
	});

	// Dropzone.options.myAwesomeDropzone = {

	// 	autoProcessQueue: false,
	// 	uploadMultiple: true,
	// 	acceptedFiles: "image/jpeg,image/png,image/gif",
	// 	parallelUploads: 20,
	// 	maxFiles: 20,
	// 	maxFilesize: 1,
	// 	dictDefaultMessage: "Drop files here to upload (or click)",
	// 	dictInvalidFileType: "Accept image only",
	// 	addRemoveLinks: "dictRemoveFile",

	// 	// Dropzone settings
	// 	init: function() {
	// 		var myDropzone = this;

	// 		this.element.querySelector('input[name="submit-img"]').addEventListener("click", function(e) {
	// 			e.preventDefault();
	// 			e.stopPropagation();
	// 			myDropzone.processQueue();
	// 		});
	// 		this.on("sendingmultiple", function() {
	// 			alert("sending");
	// 		});
	// 		this.on("successmultiple", function(files, response) {
	// 			alert("success");
	// 		});
	// 		this.on("errormultiple", function(files, response) {
	// 			alert("fail");
	// 		});
	// 	}

	// }
});