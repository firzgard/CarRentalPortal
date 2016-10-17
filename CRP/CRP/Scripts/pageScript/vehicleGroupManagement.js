$(document).ready(()=>{
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
    
	var searchCondition = {
	    
	};
	// Render table
	let table = $('#garages').DataTable({
        dom: "ltipr",
	    //data: mockupData,
        ajax: {
            url: "/api/vehicleGroups",
            type: "GET",
            //data: searchCondition
        },
		columnDefs: [
			{
				// Render status label
				targets: 6,
				render: (data, type) => {
					if(type === 'display'){
						return `<div class="status-label" >
							<p class="label label-${data ? 'primary': 'danger'}">${data ? 'Active': 'Inactive'}</p>
						</div>`;
					}
					return data;
				}
			},
			{
				// Render action button
				targets: 7,
				render: (data, type, row) => {
				    return `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Actions <i class="caret"></i>
						</button>
						<ul class="dropdown-menu">
							<li><a href="/management/vehicleGroupManagement/${row[0]}">Edit</a></li>
                        ${row[6] === true?
                        `<li><a data-toggle="modal" data-target="#mdModal" data-action="deactivate" data-id="${row[0]}" data-name="${row[1]}" >Deactivate</a></li>`:
                        `<li><a data-toggle="modal" data-target="#mdModal" data-action="activate" data-id="${row[0]}" data-name="${row[1]}" >Reactivate</a></li>`
							}
                        <li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="delete" data-id="${row[0]}" data-name="${row[1]}" >Delete</a></li>
						</ul>
					</div>`;
				}
			}
		],
		columns: [
			{ name: 'ID', visible: false },
			{ name: 'Name', title: 'Name', width: '30%' },
			{ name: 'Maxrent', title: 'Max rental period', width: '10%', defaultContent: "N/A" },
			{ name: 'Deposit', title: 'Deposit',  width: '15%' },
            { name: 'PerDayPrice', title: 'Per day price', width: '15%' },
			{ name: 'NumOfCar', title: 'Number of car', width: '10%' },
			{ name: 'Status', title: 'Status', width: '10%' },
			{
				title: 'Action',
				width: '10%',
				orderable: false,
				searchable: false
			}
		]
	});

    // garage's name text filter
	createTextFilter(table, $('#name'), 'Name');
    // garage's name text filter
	createTextFilter(table, $('#maxrent'), 'Maxrent');
    // garage's address text filter
	createTextFilter(table, $('#deposit'), 'Deposit');
    // garage's name text filter
	createTextFilter(table, $('#perday'), 'Per day price');
    // garage's name text filter
	createTextFilter(table, $('#price'), 'Price');
    // status checkbox filter
    createCheckboxFilter(table, $('#status'), 5);
    
	// Render confirmation modal for actions
	$('#mdModal').on('show.bs.modal', function(event) {
		let button = $(event.relatedTarget),
			action = button.data('action')
			id = button.data('id'),
			name = button.data('name');
			switch (action) {
			    case "activate": {
			        renderConfirmModal('vehicle group', 'reactivate', this, [{ id: button.data('id'), name: button.data('name') }]);
			    } break;
			    case "deactivate": {
			        renderConfirmModal('vehicle group', 'deactivate', this, [{ id: button.data('id'), name: button.data('name') }]);
			    } break;
			    case "delete": {
			        renderConfirmModal('vehicle group', 'delete', this, [{ id: button.data('id'), name: button.data('name') }]);
			    } break;
			}
	});
    
    $('#addGarage').on('show.bs.modal', function(event) {
        $(this).find('.modal-content').html(`
           <div class ="modal-content">
                <div class ="modal-header modal-header-popup">
                    <button type="button" class ="close" data-dismiss="modal">&times; </button>
                    <h4 class ="modal-title">Add vehicle group</h4> </div>
                <div class ="modal-body">
                    <div class ="row">
                        <div class ="col-md-6">
                            <label>Name</label>
                            <input type="text" class ="form-control required input-lg">
                            <label>Deposit</label>
                            <div class ="input-group m-b boxForm text-center">
                                <input type="number" class ="form-control"> <span class ="input-group-addon">&#8363; </span></div>
                        </div>
                        <div class ="col-md-6">
                            <label>Max rental period</label>
                            <div class ="input-group m-b boxForm text-center">
                                <input type="number" class ="form-control"> <span class ="input-group-addon">day</span></div>
                            <label>Per day price</label>
                            <div class ="input-group m-b boxForm text-center">
                                <input type="number" class ="form-control"> <span class ="input-group-addon">&#8363; </span></div>
                        </div>
                    </div>
                    <div class ="ibox-content">
                        <label>Price rental</label>
                        <!--                        <div class ="ibox ibox-content float-e-margins">-->
                        <table class ="table table-striped table-bordered table-hover " id="garages"></table>
                        <!--                        </div>-->
                    </div>
                </div>
                <div class ="modal-footer">
                    <button type="button" class ="btn btn-default" data-dismiss="modal">Close</button>
                    <button class ="btn btn-primary" type="submit">Save changes</button>
                </div>
            </div>
        `);
        $('#modalItemSelector').chosen({
            width: "100%",
            no_results_text: "No result!"
        });
    });

    $('#btnAddVehiclePopup').on('click', function () {
        $.ajax({
            type: "GET",
            url: "/management/vehicleGroupManagement/create",
            success: function (data) {
                $('#myModal').html(data);
                let table1 = null;

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
                                //data: mockupData3,
                                /*ajax: {
                                    url: `/api/priceGroup/${groupID}`,
                                    type: "GET",
                                },*/
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
                        if($('.max-time').length < 23) {
                            table1.row.add({
                                "MaxTime": `<input type="number" min="1" max="23" class="max-time form-control" value="" />`,
                                "Price": `<input type="number" class="price form-control" value="" />`,
                            }).draw();
                            bindMinusBtn();
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

    let model = {};
    model.Name = null;
    model.MaxRentalPeriod = null;
    model.PriceGroup = {};
    model.PriceGroup.DepositPercentage = null;
    model.PriceGroup.PerDayPrice = null;
    model.PriceGroup.PriceGroupItems = {};
    model.PriceGroup.PriceGroupItems = priceGroupItemList;

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
            alert("ok");
        },
        error: function (e) {
            alert("fail");
        }
    });
});