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
    // set toogling dropdown event for filter dropdown buttons
    $('#multiFilter .filter-toggle').on('click', function (event) {
        let dropdownContainer = $(this).parent();

        if (dropdownContainer.hasClass('open')) {
            $('#multiFilter .filter-toggle').parent().removeClass('open');
        } else {
            $('#multiFilter .filter-toggle').parent().removeClass('open');
            dropdownContainer.addClass('open');
        }
    });

    var searchCondition = {

    };
    // Render table
    let table = $(garages).DataTable({
        dom: "lftipr",
        //data: mockupData,
        language: viDatatables,
        ajax: {
            url: "/api/garages",
            type: "GET",
            //data: searchCondition
        },
        columnDefs: [
			{
			    // Render stars
			    targets: -3,
			    render: (data, type) => {
			        if (type === 'display') {
			            return renderStarRating(data);
			        }
			        return data;
			    }
			},
			{
			    // Render status label
			    targets: -2,
			    render: (data, type) => {
			        if (type === 'display') {
			            return `<div class="status-label" >
							<p class="label label-${data ? 'primary' : 'danger'}">${data ? 'Đang mở cửa' : 'Đã đóng cửa'}</p>
						</div>`;
			        }
			        return data;
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
					    <ul class ="dropdown-menu">
						<li><a href="/management/garageManagement/${row[0]}">Thông tin chi tiết</a></li>

                        ${row[6] === true ?
                        `<li><a data-toggle="modal" data-target="#mdModal" data-action="deactivate" data-id="${row[0]}" data-name="${row[1]}" >Đóng cửa garage</a></li>` :
                        `<li><a data-toggle="modal" data-target="#mdModal" data-action="activate" data-id="${row[0]}" data-name="${row[1]}" >Mở cửa garage</a></li>`}
                        <li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="delete" data-id="${row[0]}" data-name="${row[1]}" >Xóa</a></li>
						</ul>
					</div>`;
			    }
			}
        ],
        columns: [
			{ name: 'ID', visible: false },
			{ name: 'Name', title: 'Tên', width: '15%' },
			{ name: 'Address', title: 'Địa chỉ', width: '25%' },
			{ name: 'Location', title: 'Vị trí', width: '10%' },
            { name: 'NumOfVehicle', title: 'Số lượng xe', width: '10%' },
			{ name: 'Stars', title: 'Xếp Hạng',  width: '15%' },
			{ name: 'Status', title: 'Trạng thái', width: '15%' },
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
			action = button.data('action')
        id = button.data('id'),
        name = button.data('name');
        switch (action) {
            case "activate": {
                renderConfirmModal(table, 'garage', 'reactivate', this, [{ id: id, name: name }]);
            } break;
            case "deactivate": {
                renderConfirmModal(table, 'garage', 'deactivate', this, [{ id: id, name: name }]);
            } break;
            case "delete": {
                renderConfirmModal(table, 'garage', 'delete', this, [{ id: id, name: name }]);
            } break;
        }

        $(document).on('click', '.btn-yeah', function (event) {
            $("#error").html("");
            var comment = $('#comment').val();
            if (comment == "") {
                $("#error").html("PC name must not be blank!");
                return;
            }
            $.ajax({
                url: '/api/CommentBooking',
                data: {
                    id: id,
                    comment: comment,
                    star: star,
                },
                error: function () {
                    alert("Problem")
                    location.href = "/management/bookingHistory";
                },
                success: function (data) {
                    alert("Comment successfully");
                    location.href = "/management/bookingHistory";
                },
                type: 'POST'
            });
        });
    });

});
