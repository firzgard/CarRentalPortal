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
$(document).ready(() => {
    // Render table
    let table = $('#provider').DataTable({
        dom: "ltipr",
        //data: mockupData,
        language: viDatatables,
        ajax: {
            url: "/api/reportProvider",
            type: "GET",
        },
        columnDefs: [
            	{
            	    // Render status label
            	    targets: 5,
            	    render: (data, type) => {
            	        if (type === 'display') {
            	            return `<div class="status-label" >
							<p class ="label label-${data ? 'danger' : 'primary'}">${data ? 'Đang hoạt động' : 'Bị chặn'}</p>
						</div>`;
            	        }
            	        return data;
            	    }
            	},
        {
            // render action button
            targets: 6,
            render: (data, type, row) => {
                return `<div class="btn-group" >
            <button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
            <i class="fa fa-gear"></i> Hành động <i class="caret"></i>
            </button>
            <ul class ="dropdown-menu">
             ${row.status=== true ?
		    `<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="chan" data-id="${row.ID}">Chặn</a></li>`:
		    `<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="bochan" data-id="${row.ID}">Bỏ chặn</a></li>`}
            </ul>
            </div>`;
            }
        }
        ],
        columns: [
        { name: 'ID', data: 'ID', visible: false },
        { name: 'Provider', data: 'ProviderName', title: 'Tên nhà cung cấp', width: '15%' },
        { name: 'Money', data: 'money', title: 'Doanh thu', width: '15%' },
        { name: 'Compare', data: 'compare', title: 'So với tháng trước', width: '15%' },
        { name: 'Car', data: 'car', title: 'Số lượng xe', width: '15%' },
        { name: 'Status', data: 'status', title: 'Tình trạng', width: '15%' },
        {
            title: 'Action',
            width: '10%',
            orderable: false,
            searchable: false
        }
        ]
    });

    let table2 = $('#garages').DataTable({
     dom: "ltipr",
     //data: mockupData,
     language: viDatatables,
     ajax: {
     url: "/api/reportGarage",
     type: "GET",
     },
     columnDefs: [
         	{
         	    // Render status label
         	    targets: 6,
         	    render: (data, type) => {
         	        if (type === 'display') {
         	            return `<div class="status-label" >
							<p class ="label label-${data ? 'danger' : 'primary'}">${data ? 'Mở cửa' : 'Đóng cửa'}</p>
						</div>`;
         	        }
         	        return data;
         	    }
         	},
     {
     // render action button
     targets:7,
     render: (data, type, row) => {
     return `<div class="btn-group" >
     <button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
     <i class="fa fa-gear"></i> Hành động <i class="caret"></i>
     </button>
     <ul class ="dropdown-menu">
         ${row.status=== true ?
		`<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="dongcua" data-id="${row.ID}">Đóng cửa</a></li>` :
		`<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="mocua" data-id="${row.ID}">Mở cửa</a></li>`}
     </ul>
     </div>`;
     }
     }
     ],
     columns: [
     { name: 'ID', data: 'ID', visible: false },
     { name: 'Provider', data: 'GarageName', title: 'Tên garage', width: '15%' },
     { name: 'Money', data: 'money', title: 'Doanh thu', width: '15%' },
     { name: 'Compare', data: 'compare', title: 'So với tháng trước', width: '15%' },
     { name: 'Car', data: 'car', title: 'Số lượng xe', width: '15%' },
     { name: 'Owner', data: 'owner', title: 'Sở hữu', width: '15%' },
     { name: 'Status', data: 'status', title: 'Tình trạng', width: '15%' },
     {
     title: 'Action',
     width: '10%',
     orderable: false,
     searchable: false
     }
     ]
    });
    // Render confirmation modal for actions
    $('#mdModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget),
        action = button.data('action'),
        id = button.data('id');
        switch (action) {
            case 'bochan': {
                $(this).find('.modal-content').html(`<div class="modal-header">
            <button type="button" class ="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times; </span>
            </button>
            <h2 class="modal-title">
            Xác nhận thông tin
            </h2>
            </div>
            <div class="modal-body">
             Có phải bạn muốn <b>${action}</b> provider này?</b>. Bạn chắc chứ?
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Không</button>
            <button type="button" class ="btn btn-danger btn-yes">Đúng</button>
            </div>`);
            } break;

            case 'chan': {
            $(this).find('.modal-content').html(`<div class="modal-header">
            <button type="button" class ="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times; </span>
            </button>
            <h2 class="modal-title">
            ${action === 'delete' ? 'Deletion' : (action === 'deactivate' ? 'Deactivation' : 'Activation')} Confirmation
            </h2>
            </div>
            <div class="modal-body">
             Có phải bạn muốn <b>${action}</b> provider này?</b>. Bạn chắc chứ?
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Không</button>
            <button type="button" class ="btn btn-danger btn-yes">Đúng</button>
            </div>`);
            } break;

            case 'dongcua': {
                $(this).find('.modal-content').html(`<div class="modal-header">
            <button type="button" class ="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times; </span>
            </button>
            <h2 class="modal-title">
            Xác nhận
            </h2>
            </div>
            <div class="modal-body">
            Có phải bạn muốn <b>${action}</b> provider này?</b>. Bạn chắc chứ?
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Không</button>
            <button type="button" class="btn btn-danger btn-yes">Đúng</button>
            </div>`);
            }
                break;
            case 'mocua': {
                $(this).find('.modal-content').html(`<div class="modal-header">
            <button type="button" class ="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times; </span>
            </button>
            <h2 class="modal-title">
            Xác nhận
            </h2>
            </div>
            <div class="modal-body">
            Có phải bạn muốn <b>${action}</b> garage này?</b>. Bạn chắc chứ?
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Không</button>
            <button type="button" class="btn btn-danger btn-yes">Đúng</button>
            </div>`);
            }
                break;
        }

        $(document).on('click', '.btn-yes', function (event) {
            switch (action) {
                case 'chan': {
                }
                case 'bochan': {
                        $.ajax({
                            url: `/api/user/status`,
                            data: {
                                id: id,
                            },
                            type: "PATCH",
                            success: function (data) {
                                alert(data.message);
                                location.href = "/Admin/DashBoard/Index";
                            },
                            eror: function (data) {
                                alert("fail");
                            }
                        });
                } break;
                default: {
                $.ajax({
                url: `/api/garage/status/${id}`,
                type: "PATCH",
                success: function (data) {
                    alert(data.message);
                    location.href = "/Admin/DashBoard/Index";
                },
                eror: function (data) {
                    alert("fail");
                }
            });
                } break;
            }
        });
    });


    var data4 = [];

    var data2 = [[gd(2012, 1), 5], [gd(2012, 2), 6], [gd(2012, 3), 7], [gd(2012, 4), 12],
                [gd(2012, 5), 44], [gd(2012, 6), 3], [gd(2012, 7), 3], [gd(2012, 8), 4],
                [gd(2012, 9), 5], [gd(2012, 10), 6], [gd(2012, 11), 12], [gd(2012, 12), 4]];
    
    var data3 = [
        [gd(2012, 1), 800], [gd(2012, 2), 500], [gd(2012, 3), 600], [gd(2012, 4), 700],
        [gd(2012, 5), 500], [gd(2012, 6), 456], [gd(2012, 7), 800], [gd(2012, 8), 589],
        [gd(2012, 9), 467], [gd(2012, 10), 876], [gd(2012, 11), 0], [gd(2012, 12), 0]
    ];
    function onDataReceived(series) {
        data4 = [[gd(2012, 1, 1), 5], [gd(2012, 2, 1), 6], [gd(2012, 3, 2), 7], [gd(2012, 4, 4), 12],
                [gd(2012, 5, 5), 44], [gd(2012, 6, 6), 3], [gd(2012, 7, 7), 3], [gd(2012, 8, 8), 4],
                [gd(2012, 9, 9), 5], [gd(2012, 10, 10), 6], [gd(2012, 11, 11), 12], [gd(2012, 12, 12), 4]];
    }
    $.ajax({
        url: `/api/getProviderData1`,
        type: "GET",
        success: onDataReceived,
        eror: function (data) {
            alert("fail");
        }
    });

    //get data booking
    //$.ajax({
    //    type: "GET",
    //    url: '@Url.Action("GetTestData")',
    //    error: function () {
    //        alert("An error occurred.");
    //    },
    //    success: function (data) {
    //        data3 = [data]
    //    }
    //});
    var dataset = [
        {
            label: "Doanh thu",
            data: data3,
            color: "#1ab394",
            bars: {
                show: true,
                align: "center",
                barWidth: 200 * 200 * 100 * 300,
                lineWidth: 1
            }

        }, {
            label: "Lượt Booking",
            data: data2,
            yaxis: 2,
            color: "#1C84C6",
            lines: {
                lineWidth: 1,
                show: true,
                fill: true,
                fillColor: {
                    colors: [{
                        opacity: 0.2
                    }, {
                        opacity: 0.4
                    }]
                }
            },
            splines: {
                show: false,
                tension: 0.6,
                lineWidth: 1,
                fill: 0.1
            },
        }
    ];


    var options = {
        xaxis: {
            mode: "time",
            tickSize: [1, "month"],
            tickLength: 0,
            axisLabel: "month",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 4,
            axisLabelFontFamily: 'Arial',
            axisLabelPadding: 3,
            color: "#d5d5d5"
        },
        yaxes: [{
            position: "left",
            max: 1070,
            color: "#d5d5d5",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 2,
            axisLabelFontFamily: 'Arial',
            axisLabelPadding: 0
        }, {
            position: "right",
            clolor: "#d5d5d5",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 0,
            axisLabelFontFamily: ' Arial',
            axisLabelPadding: 12
        }
        ],
        legend: {
            noColumns: 1,
            labelBoxBorderColor: "#000000",
            position: "nw"
        },
        grid: {
            hoverable: false,
            borderWidth: 0
        }
    };

    function gd(year, month) {
        return new Date(year, month).getTime();
    }

    var previousPoint = null, previousLabel = null;

    $.plot($("#aa"), dataset, options);
});