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
	info: "\_START\_ - \_END\_ của \_TOTAL\_ kết quả",
	infoEmpty: "không có dữ liệu",
	infoFiltered: "(được lọc ra từ _MAX_ dòng)"
}

$(document).ready(() => {
	// Render table
	let table = $('#bookingHistory').DataTable({
		dom: "ltipr"
		, orderFixed: [ 3, 'desc' ]
		, processing: true
		, language: viDatatables
		, scrollCollapse: true
		, serverSide: true
		, retrieve: true
		, ajax: {
			url: GetBookingHistoryUrl
			, data: (rawData) => {
				return {
					draw: rawData.draw
					, recordPerPage: rawData.length
					, page: rawData.start / rawData.length + 1
				};
			}
		}
		, columnDefs: [
			 {
				 // Render start time
				 targets: 3,
				 render: (data) => {
					 return moment(data).local().format('ddd, DD/MM/YYYY, HH:mm');
				 }

			 },

			{
				// Render end time
				targets: 4,
				render: (data) => {
					return moment(data).local().format('ddd, DD/MM/YYYY, HH:mm');
				}
				
			},

			{
				// Render status label
				targets: 5,
				render: (data, type) => {
					if (type === 'display') {
						return `<div class="status-label" >
							<p class ="label label-${data ? 'danger' : 'primary'}">${data ? 'Đã hủy': 'Đang thuê'}</p>
						</div>`;
					}
					return data;
				}
			},
			{
				// Render action button
				targets: 6,
				render: (data, type, row) => {
					return `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Hành động <i class="caret"></i>
						</button>
						<ul class ="dropdown-menu">
							<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="detail" data-id="${row[0]}" >Chi tiết</a></li>
							${row[4] ? '' : `<li><a href="#" data-toggle="modal" data-target="#mdModal" data-action="cancle" data-id="${row[0]}">Hủy đặt xe</a></li>`
							}
						</ul>
					</div>`;
				}
			}
		]
		, columns: [
			{ name: 'ID', data: 'ID', visible: false },
			{ name: 'VehicleName', title: 'Tên xe', data: 'VehicleName', orderable: false, width: '20%' },
			{ name: 'GarageName', title: 'Cửa hàng', data: 'GarageName', orderable: false, width: '20%' },
			{ name: 'StartTime', title: 'Bắt đầu', data: 'StartTime', orderable: false, width: '20%' },
			{ name: 'EndTime', title: 'Kết thúc', data: 'EndTime', orderable: false, width: '20%' },
			{ name: 'Status', title: 'Tình trạng', data: 'IsCanceled', orderable: false, width: '10%' },
			{ title: 'Thao tác', width: '10%', orderable: false }
		]
	});

	// Render confirmation modal for actions
	$('#mdModal').on('show.bs.modal', function (event) {
		let button = $(event.relatedTarget),
			action = button.data('action'),
			id = button.data('id'),
			VehicleName = button.data('name'),
			starTime = button.data('starttime'),
			star = button.data('star'),
			endTime = button.data('endtime'),
			RentalPrice = button.data('rentalprice'),
			BookingFee = button.data('bookingfee'),
			GarageName = button.data('garage'),
			GarageAddress = button.data('garageadd'),
			Color = button.data('color'),
			Model = button.data('model');
		switch (action) {
			case 'detail': {
				$(this).find('.modal-content').html(`<div class="row" style="text-align:center; margin-top:10px">
											<h3 style="font-size:200%;">Chi tiết đặt xe ${VehicleName}</h3>
											  <div class="col-sm-6 b-r" style="float: left">
												<div class ="form-group"><label>Tổng tiền thuê</label><p>${RentalPrice}</p></div>
												<div class ="form-group"><label>Phí thuê xe</label><p>${BookingFee}</p></div>
												<div class ="form-group"><label>Xếp hạng</label><p>${renderStarRating(star)}</p></div>
												<div class ="form-group"><label>Thời gian bắt đầu</label><p>${Date(starTime).toString()}</p></div>
												<div class ="form-group"><label>Thời gian kết thúc</label><p>${Date(endTime).toString()}</p></div>
											  </div>
											  <div class ="col-sm-6" style="float: right">
											   <div class ="form-group"><label>Tên xe</label><p>${VehicleName}</p></div>
											   <div class ="form-group"><label>Model</label><p>${Model}</p></div>
											   <div class ="form-group"><label>Màu sắc</label><p>${Color}</p></div>
											   <div class ="form-group"><label>Thuộc garage</label><p>${GarageName}</p></div>
											   <div class ="form-group"><label>Địa chỉ garage</label><p>${GarageAddress}</p></div>
											  </div>
											   <button type="button" class ="btn btn-success" data-dismiss="modal">Đóng</button>
												<label></label>	<br/>`);
			}
			break;
			case 'comment': {
				$(this).find('.modal-content').html(`<div class="row" style="text-align:center; margin-top:30px">
											<h3 style="font-size:200%;">Nhận xét và đánh giá ${VehicleName}</h3>
								  
											<div class="col-sm-12" style="text-align: center">
												<label>Comment</label>
												<input type="text" class="form-control" id="comment">
												<input type="hidden" class ="form-control" value="${id}" id="id" />
												<label>Rate</label>
											 <div class ="stars stars-example-bootstrap">
												  <div class ="br-wrapper br-theme-bootstrap-stars">
													<select id="star" name="star" autocomplete="off">
														<option value="1">1</option>
														<option value="2">2</option>
														<option value="3">3</option>
														<option value="4">4</option>
														<option value="5">5</option>
														</select>
												   </div>
											</div>
											  </div>
											   <label></label>	<br/>
											  <button type="button" class ="btn btn-default" data-dismiss="modal">Đóng</button>
											  <button type="button" class ="btn btn-success btn-yeah">Gửi</button>
												<label></label>	<br/>`);
				$(function () {
					$('#star').barrating({
						theme: 'fontawesome-stars'
					});
				});
			   
				}
			break;
			case 'cancle': {
				$(this).find('.modal-content').html(`<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			<h2 class="modal-title">
				${action === 'delete' ? 'Deletion' : (action === 'deactivate' ? 'Deactivation' : 'Activation')} Confirmation
			</h2>
			</div>
			<div class="modal-body">
			Có phải bạn muốn <b>${action}</b> booking này?</b>. Bạn chắc chứ?
			</div>
			<div class="modal-footer">
			<button type="button" class="btn btn-default" data-dismiss="modal">Không</button>
			<button type="button" class="btn btn-danger btn-yes">Đúng</button>
			</div>`);
			}
			break;   
			}
			$(document).on('click', '.btn-yes', function (event) {
			$.ajax({
				url: `/api/booking/status/${id}`,
				type: "DELETE",
				success: function (data) {
					alert(data.message);
					location.href = "/management/bookingHistory";
				},
				eror: function (data) {
					alert(data.message);
					location.href = "/management/bookingHistory";
				}
				});
			});
			
			$(document).on('click', '.btn-yeah', function (event) {
				$("#error").html("");
				var id = $('#id').val();
				var comment = $('#comment').val();
				var star = $('#star').val();
				$.ajax({
					url: '/api/CommentBooking',
					data: {
						id: id,
						comment: comment,
						star: star,
					},
					error: function (data) {
						alert(data.message);
						location.href = "/management/bookingHistory";
					},
					success: function (data) {
						alert(data.message);
						location.href = "/management/bookingHistory";
					},
					type: 'POST'
				});
			});
	});
});