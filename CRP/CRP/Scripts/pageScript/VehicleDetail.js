$(document).ready(function () {
	// =============================================
	// Comments
	if(NUM_OF_COMMENT > 0){
		let $commentContainer = $('#commentContainer');

		function renderComment(data){
			return `<div class="comment-item">
				<div class="comment-user">
					${data.avatarURL
						? `<img src="${data.avatarURL}" alt="avatar" class="img-circle" />`
						: '<i class="fa fa-user-circle"></i>'
					}
					<p>${data.customer}</p>
				</div>
				<div class="comment-content">
					<p>${renderStarRating(data.star, '#388E3C', false)}</p>
					<p>${data.comment}</p>
				</div>
			</div>`;
		}

		function renderCommentContainer(page = 1){
			$.ajax({
				url: COMMENT_FETCHING_URL,
				dataType: 'json',
				data: {page: page},
			})
			.done(function(data) {
				$commentContainer.html(data.reduce((html, record) => {
					return html + renderComment(record);
				}, ''))
			})
			.fail(function(err, textStatus, errorThrown) {
				toastr.error("Có lỗi xảy ra. Phiền bạn reload trang web.")
			})
		}
		
		renderCommentContainer();

		$('#commentPaginator').twbsPagination({
			startPage: 1,
			totalPages: Math.ceil(NUM_OF_COMMENT / NUM_OF_COMMENT_PER_PAGE),
			visiblePages: 5,
			first: '<i class="fa fa-angle-double-left"></i>',
			prev: '<i class="fa fa-angle-left"></i>',
			next: '<i class="fa fa-angle-right"></i>',
			last: '<i class="fa fa-angle-double-right"></i>',
			onPageClick: (event, page) => {
				renderCommentContainer(page)
			}
		});
	}

	// =========================================================================================
	// Image section
	let imageIndex = 0,
		lastImageIndex = imageList.length - 1;

	function changeImg(){
		$smallCarouselDisplays.addClass('animated fadeOut')
		.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
			$smallCarouselDisplays.removeClass('animated fadeOut')
			.css('background-image', `url('${imageList[imageIndex].Url}')`)
			.addClass('animated fadeIn')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
				$smallCarouselDisplays.removeClass('animated fadeIn')
			});
		});
		
		$bigCarouselDisplay.addClass('animated fadeOut')
		.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
			$bigCarouselDisplay.removeClass('animated fadeOut')
			.css('background-image', `url('${imageList[imageIndex].Url}')`)
			.addClass('animated fadeIn')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
				$bigCarouselDisplay.removeClass('animated fadeIn')
			});
		});
	}

	// ===========================================
	// Small image carousel
	let $smallCarouselDisplays = $('.small-vehicle-carousel-display');

	// Left change img btn
	$('.small-vehicle-carousel .left.carousel-control').click(() => {
		imageIndex = (imageIndex === 0) ? lastImageIndex : imageIndex - 1;
		changeImg();
	});

	// Right change img btn
	$('.small-vehicle-carousel .right.carousel-control').click(() => {
		imageIndex = (imageIndex === lastImageIndex) ? 0 : imageIndex + 1;
		changeImg();
	});

	// ============================================
	// Big image carousel rendering
	var	$bigCarousel = $('#bigCarousel'),
		$bigCarouselDisplay = $('#bigCarouselDisplay');

	changeImg();

	// Open big carousel on clicking a small carousel
	$smallCarouselDisplays.click(() => {
		$bigCarousel.addClass('active');
		$('body').addClass('modal-open');
	})

	// bind the carousel's controllers
	$bigCarousel.find('.fa-times').click(()=>{
		$bigCarousel.removeClass('active');
		$('body').removeClass('modal-open');
	});
	$bigCarousel.find('.left.carousel-control').click(() => {
		imageIndex = (imageIndex === 0) ? lastImageIndex : imageIndex - 1;
		changeImg();
	});
	$bigCarousel.find('.right.carousel-control').click(() => {
		imageIndex = (imageIndex === lastImageIndex) ? 0 : imageIndex + 1;
		changeImg();
	});

	// bind esc button
	$(document).keyup(function(e){
		if(e.keyCode === 27){
			$bigCarousel.removeClass('active');
			$('body').removeClass('modal-open');
		}
	});






	$('#deleteImageBtn').click(() => {
		
	})

	Dropzone.options.dropzoneForm = {
		acceptedFiles: "image/jpeg,image/png,image/gif"
		, addRemoveLinks: "dictRemoveFile"
		, dictCancelUpload: 'Xóa'
		, dictDefaultMessage: "Thả ảnh hoặc nhấn vào đây để upload."
		, dictFileTooBig: 'Dung lượng ảnh phải dưới {{maxFilesize}} mb.'
		, dictInvalidFileType: 'Không phải file ảnh.'
		, maxFiles: (10 - MAX_IMG)
		, maxFilesize: 1
		, parallelUploads: 20
		, uploadMultiple: true

		, init: function () {
			var myDropzone = this;

			this.element.querySelector('input[name="submit-img"]').addEventListener("click", function (e) {
				e.preventDefault();
				e.stopPropagation();

				myDropzone.processQueue();
			});

			this.on("success", function (file, response) {
				file.serverId = response;
			});

			this.on("maxfilesexceeded", function (data) {

			});

			this.on("addedfile", function (file) {
				// Create the remove button
				var removeButton = Dropzone.createElement("<button>Xóa chọn</button>");
				// Capture the Dropzone instance as closure.
				var _this = this;

				// Listen to the click event
				removeButton.addEventListener("click", function (e) {
					// Make sure the button click doesn't submit the form:
					e.preventDefault();
					e.stopPropagation();
					// Remove the file preview.
					_this.removeFile(file);
					// If you want to the delete the file on the server as well,
					// you can do the AJAX request here.
					$.ajax({
						type: "DELETE",
						url: `/api/vehicles/deletepic`,
						data: {
							file: file.serverId,
						},
						async: true,
						success: function (data) {
							alert("Xóa chọn thành công");
							this.reload();
						},
						eror: function (data) {
							alert("Thất bại");
							this.reload();
						}
					});
				});

				// Add the button to the file preview element.
				file.previewElement.appendChild(removeButton);
			});
		}
	}
	
	$('#delete-btn').on('click', function () {
		$('#delete-car').modal('show');
	});

	$('#change-color').on('click', function () {
		$('#panel-color').show();
	});

	$('#edit-btn').on('click', function () {
		$('.justRead').hide();
		$('.editFiel').css('display', 'inline-block');
	});

	$('#edit-img').on('click', function () {
		$('#edit-img').hide();
		$('#img-div').hide();
		$('#dropzoneForm').show();
	});

	$('#cancel-img').on('click', function () {
		$('#edit-img').show();
		$('#img-div').show();
		$('#dropzoneForm').hide();
	});
	// =========================================================================================
});

$(document).on('click', "#agreed-delete", function () {
	let id = $('#vehicleID').val();
	$.ajax({
		type: "DELETE",
		url: `/api/vehicles/${id}`,
		async: true,
		success: function (data) {
			//alert("ok");
			window.location.pathname = "/management/vehicleManagement";
		},
		eror: function (data) {
			alert("fail");
		}
	});
});

$(document).on('click', ".DeleteImage", function () {

	let id = $('#vehicleID').val();
	var index = $('.DeleteImage').index(this);
	let url = $(`.imgUrl:eq(${index})`).val();
	//alert(url);
	$.ajax({
		type: "DELETE",
		url: `/api/vehicles/deletepic/${id}`,
		data:{id:id,
			url2:url
		},
		async: true,
		success: function (data) {
			alert("Xóa thành công");
			location.reload();
		},
		eror: function (data) {
			alert("Thất bại");
			location.reload();
		}
	});
});

$(document).on('click', "#save-btn", function () {
	let model = {};
	model.ID = $('#vehicleID').val();
	model.Name = $('#name').val();
	model.LicenseNumber = $('#licenseNumber').val();
	model.GarageID = $('#garageID').val();
	model.VehicleGroupID = $('#groupID').val();
	model.ModelID = $('#modelFilter').val();
	model.Year = $('#year').val();
	model.Engine = $('#engine').val();
	model.FuelType = $('#fuelFilter').val();
	model.TransmissionType = $('input[name=TransName]:checked').val();
	model.Color = $('input[name=newColor]:checked').val();
	model.Description = $('#description').val();

	$.ajax({
		type: "PATCH",
		url: '/api/vehicles',
		data: model,
		async: true,
		success: function (data) {
			alert("Tất cả đã được lưu");
			location.reload();
		},
		eror: function (data) {
			toastr.error("Chỉnh sửa thất bại. Vui lòng thử lại sau");
		}
	});
});

$(function () {
	$("#year").keydown(function () {
		// Save old value.
		$(this).data("old", $(this).val());
	});
	$("#year").keyup(function () {
		// Check correct, else revert back to old value.
		if (parseInt($(this).val()) <= 2016 && parseInt($(this).val()) >= 1988)
			;
		else
			$(this).val($(this).data("old"));
	});
});
