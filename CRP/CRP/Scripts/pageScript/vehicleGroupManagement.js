const vehicleGroupTableColumns = [
			{ name: 'ID', visible: false },
			{ name: 'Name', title: 'Tên nhóm', width: '20%' },
			{ name: 'Maxrent', title: 'Kỳ hạn thuê tối đa</br>(có tài xế)', width: '20%', defaultContent: "-" },
			{ name: 'Deposit', title: 'Đặt cọc</br>(có tài xế)', width: '10%' },
            { name: 'PerDayPrice', title: 'Giá theo ngày</br>(có tài xế)', width: '15%' },
            { name: 'Maxrent', title: 'Kỳ hạn thuê tối đa</br>(tự lái)', width: '20%', defaultContent: "-", visible: false },
			{ name: 'Deposit', title: 'Đặt cọc</br>(tự lái)', width: '10%', visible: false },
            { name: 'PerDayPrice', title: 'Giá theo ngày</br>(tự lái)', width: '15%', visible: false },
			{ name: 'NumOfCar', title: 'Số lượng xe', width: '10%' },
			{ name: 'Status', title: 'Trạng thái', width: '15%' },
			{
			    title: 'Thao tác',
			    width: '10%',
			    orderable: false,
			    searchable: false
			}
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
$(document).ready(() =>{
	// Render table
	table = $('#garages').DataTable({
        dom: "ltipr",
        ajax: {
            url: "/api/vehicleGroups",
            type: "GET",
        },
        language: viDatatables,
        order: [[ 1, "asc" ]],
        columnDefs: [
			{
				// Render status label
				targets: -2,
				render: (data, type, row) => {
					return `<div class="status-label" >
						<p class="label label-${data ? 'primary': 'danger'}">${data ? 'đang hoạt động': 'ngưng hoạt động'}</p>
					</div>`;
				}
			},
			{
				// Render action button
				targets: -1,
				render: (data, type, row) => {
				    return `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Thao tác <i class="caret"></i>
						</button>
						<ul class="dropdown-menu">
							<li><a href="/management/vehicleGroupManagement/${row[0]}">Thông tin chi tiết</a></li>
                        ${row[6] === true?
                        `<li><a data-toggle="modal" data-target="#mdModal" data-action="deactivate" data-id="${row[0]}" data-name="${row[1]}" >Ngừng hoạt động</a></li>`:
                        `<li><a data-toggle="modal" data-target="#mdModal" data-action="activate" data-id="${row[0]}" data-name="${row[1]}" >Tái kích hoạt</a></li>`
							}
                        <li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="delete" data-id="${row[0]}" data-name="${row[1]}" >Xóa</a></li>
						</ul>
					</div>`;
				}
			}
		],
		columns: vehicleGroupTableColumns,
	});

	$('input[name="includeDriver"]').on('change', function () {
	    yDriverCols = table.columns([2, 3, 4]);
	    nDriverCols = table.columns([5, 6, 7]);
	    if ($('input[name="includeDriver"]:checked').val() === 'yes') {
	        yDriverCols.visible(true);
	        nDriverCols.visible(false);
	    } else {
	        yDriverCols.visible(false);
	        nDriverCols.visible(true);
	    }
	});
    
	// Render confirmation modal for actions
	$('#mdModal').on('show.bs.modal', function(event) {
		let button = $(event.relatedTarget),
			action = button.data('action')
			id = button.data('id'),
			name = button.data('name');
			switch (action) {
			    case "activate": {
			        renderConfirmModal(table, 'vehicle group', 'reactivate', this, [{ id: button.data('id'), name: button.data('name') }]);
			    } break;
			    case "deactivate": {
			        renderConfirmModal(table, 'vehicle group', 'deactivate', this, [{ id: button.data('id'), name: button.data('name') }]);
			    } break;
			    case "delete": {
			        renderConfirmModal(table, 'vehicle group', 'delete', this, [{ id: button.data('id'), name: button.data('name') }]);
			    } break;
			}
	});
    

    $('#btnAddVehiclePopup').on('click', function () {
        $.ajax({
            type: "GET",
            url: "/management/vehicleGroupManagement/create",
            success: function (data) {
                $('#myModal').html(data);
                let table1 = null;
                let table2 = null;

                function bindMinusBtn() {
                    $('.minus-btn').unbind('click').click(function () {
                        table1.row($(this).parents('tr')).remove().draw();
                        if ($('.max-time').length == 0) {
                            table1.destroy();
                            $('#groupPop').empty();
                            table1 = null;
                        }
                    });
                }
                bindMinusBtn();
                (function bindPlusBtn() {
                    $('.plus-btn').unbind('click').click(function () {
                        if (table1 == null) {
                            table1 = $('#groupPop').DataTable({
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
                                        searchable: false,
                                        sortable: false,
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
                        if($('.max-time').length < 23) {
                            table1.row.add({
                                "MaxTime": `<input type="number" min="1" max="23" class="max-time form-control" value="" />`,
                                "Price": `<input type="number" class="price form-control" value="" />`,
                                "MaxDistance": `<input type="number" class="max-distance form-control" value="" />`,
                            }).draw();
                            bindMinusBtn();
                        }
                    });
                })();

                function bindMinusBtnN() {
                    $('.minus-btn-n').unbind('click').click(function () {
                        table2.row($(this).parents('tr')).remove().draw();
                        if ($('.max-time-n').length == 0) {
                            table2.destroy();
                            $('#groupPop-n').empty();
                            table2 = null;
                        }
                    });
                }
                bindMinusBtnN();
                (function bindPlusBtnN() {
                    $('.plus-btn-n').unbind('click').click(function () {
                        if (table2 == null) {
                            table2 = $('#groupPop-n').DataTable({
                                dom: "ti",
                                displayLength: 23,
                                ordering: false,
                                columnDefs: [
                                    {
                                        // Render action button
                                        targets: 0
                                        , render: (data, type, row) => {
                                            return `
        <button type="button" class ="btn btn-danger btn-circle btn-number minus-btn-n"  data-type="minus">
        <i class="fa fa-minus"></i>
        </button>`;
                                        }
                                    }
                                ],
                                language: viDatatables,
                                columns: [
                                    {
                                        searchable: false,
                                        sortable: false,
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
                        if ($('.max-time-n').length < 23) {
                            table2.row.add({
                                "MaxTime": `<input type="number" min="1" max="23" class="max-time-n form-control" value="" />`,
                                "Price": `<input type="number" class="price-n form-control" value="" />`,
                                "MaxDistance": `<input type="number" class="max-distance-n form-control" value="" />`,
                            }).draw();
                            bindMinusBtnN();
                        }
                    });
                })();

                $('#myModal').modal('show');
            },
            eror: function (e) {
            }
        });
    });
});

$(document).on('focusout', '#depositDisplay', function () {
    $('#deposit').val(parseFloat($('#depositDisplay').val() / 100));
});

// add to object priceGroupItem
$(document).on('click', "#btnCreate", function () {
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
            if (item.MaxTime < 1 || item.MaxTime > 23) {
                alert("so gio bi sai");
            } else {
                if (jQuery.inArray(item.MaxTime,checkTimeArray) >= 0) {
                    alert("trung gio");
                } else {
                    if (item.Price < 0) {
                        alert("so tien bi am");
                    } else {
                        priceGroupItemList.push(item);
                        checkTimeArray.push(item.MaxTime);
                    }
                }
            }
        }
    }

    let priceGroupItemListN = [];
    let checkTimeArrayN = [];
    for (var i = 0; i < $('.max-time-n').length; i++) {
        if ($(`.max-time-n:eq(${i})`).val() && !$(`.price-n:eq(${i})`).val()) {
            alert("chua nhap tien");
        }
        if (!$(`.max-time-n:eq(${i})`).val() && $(`.price-n:eq(${i})`).val()) {
            alert("chua nhap gio");
        }
        if ($(`.max-time-n:eq(${i})`).val() && $(`.price-n:eq(${i})`).val()) {
            var item = {};
            item.MaxTime = parseInt($(`.max-time-n:eq(${i})`).val());
            item.Price = parseInt($(`.price-n:eq(${i})`).val());
            item.
            if (item.MaxTime < 1 || item.MaxTime > 23) {
                alert("so gio bi sai");
            } else {
                if (jQuery.inArray(item.MaxTime,checkTimeArrayN) >= 0) {
                    alert("trung gio");
                } else {
                    if (item.Price < 0) {
                        alert("so tien bi am");
                    } else {
                        priceGroupItemListN.push(item);
                        checkTimeArrayN.push(item.MaxTime);
                    }
                }
            }
        }
    }



    let model = {};
    model.Name = null;

    model.PriceGroup = {};
    model.PriceGroup.DepositPercentage = null;
    model.PriceGroup.PerDayPrice = null;
    model.PriceGroup.MaxRentalPeriod = null;
    model.PriceGroup.MaxDistancePerDay = null;
    model.PriceGroup.ExtraChargePerKm = null;
    
    model.PriceGroup.PriceGroupItems = {};
    model.PriceGroup.PriceGroupItems = priceGroupItemListN;

    if (!$('#group-name').val()) {
        alert("Name is required!");
        return false;
    } else if ($('#group-name').val().length > 50) {
        alert("Name's length is over");
        return false;
    } else {
        model.Name = $('#group-name').val();
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
        model.MaxRentalPeriod = parseInt($('#max-rent').val());
        if (model.MaxRentalPeriod < 0) {
            alert("not allow negative number");
            return false;
        }
    }
    //if (model.PriceGroup.PriceGroupItems.length == 0) {
    //    alert("request input price rental");
    //    return false;
    //}


    $.ajax({
        type: "POST",
        url: "/api/vehicleGroups",
        data: JSON.stringify(model),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            if (data.result) {
                $('.modal').modal('hide');
                table.ajax.reload();
            } else {
                alert("fail");
            }
        },
        error: function (e) {
            alert("error");
        }
    });
});