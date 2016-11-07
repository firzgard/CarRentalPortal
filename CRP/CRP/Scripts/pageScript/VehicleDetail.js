Dropzone.autoDiscover = false;

$(document).ready(function () {
	// =============================================
	// Comment section

	// Render star ratings
	$('.rating').each(function(){ $(this).html(renderStarRating($(this).data('rating'), '#388E3C')); })
	
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

	// ==============================================================================================================
	// Image section
	let imageIndex = 0;

	function changeImg(){
		$smallCarouselDisplay.addClass('animated fadeOut')
		.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
			$smallCarouselDisplay.removeClass('animated fadeOut')
			.css('background-image', `url('${imageList[imageIndex].Url}')`)
			.addClass('animated fadeIn')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=>{
				$smallCarouselDisplay.removeClass('animated fadeIn')
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
	let $smallCarouselDisplay = $('#smallCarouselDisplay');

	// Left change img btn
	$('#smallCarousel .left.carousel-control').click(() => {
		imageIndex = (imageIndex === 0) ? imageList.length -1 : imageIndex - 1;
		changeImg();
	});

	// Right change img btn
	$('#smallCarousel .right.carousel-control').click(() => {
		imageIndex = (imageIndex === imageList.length -1) ? 0 : imageIndex + 1;
		changeImg();
	});

	// ============================================
	// Big image carousel rendering
	var	$bigCarousel = $('#bigCarousel'),
		$bigCarouselDisplay = $('#bigCarouselDisplay');

	changeImg();

	// Open big carousel on clicking a small carousel
	$smallCarouselDisplay.click(() => {
		$bigCarousel.addClass('active');
		$('body').addClass('modal-open');
	})

	// bind the carousel's controllers
	$bigCarousel.find('.fa-times').click(()=>{
		$bigCarousel.removeClass('active');
		$('body').removeClass('modal-open');
	});
	$bigCarousel.find('.left.carousel-control').click(() => {
		imageIndex = (imageIndex === 0) ? imageList.length -1 : imageIndex - 1;
		changeImg();
	});
	$bigCarousel.find('.right.carousel-control').click(() => {
		imageIndex = (imageIndex === imageList.length -1) ? 0 : imageIndex + 1;
		changeImg();
	});

	// bind esc button
	$(document).keyup(function(e){
		if(e.keyCode === 27){
			$bigCarousel.removeClass('active');
			$('body').removeClass('modal-open');
		}
	});


	// ==============================================================================================================
	// Edit vehicle's info section

	// Button to toggle between display mode and edit mode
	$('#editInfoBtn').click(function () {
		$('.display-control').css('display', 'none');
		$('.edit-control').css('display', 'inherit');
	});

	// Cancel change. Reset all inputs
	$('#cancelChangeBtn').click(function () {
		$('.edit-control').css('display', 'none');
		$('.display-control').css('display', 'inherit');

		$('#vehicleNameInput').val($('#vehicleNameInput').data('default'));
		$('#licenseNumberInput').val($('#licenseNumberInput').data('default'));
		$('#engineInput').val($('#engineInput').data('default'));
		$('#transmissionDetailInput').val($('#transmissionDetailInput').data('default'));
		$('#yearInput').val($('#yearInput').data('default'));
		$('#descriptionInput').val($('#descriptionInput').data('default'));

		$('#modelIDInput').val($('#modelIDInput').data('default')).trigger("change");
		$('#garageIDInput').val($('#garageIDInput').data('default')).trigger("change");
		$('#vehicleGroupIDInput').val($('#vehicleGroupIDInput').data('default')).trigger("change");
		$('#fuelTypeInput').val($('#fuelTypeInput').data('default')).trigger("change");

		$('input[name="transmissionTypeInput"][data-default="True"]').parent().click();
		$('input[name="colorInput"][data-default="True"]').prop('checked', true)
	});

	$('#saveChangeBtn').click(() => {
		if (!$("#vehicleNameInput")[0].checkValidity()) // Check Name : required
			return toastr.warning('Tên xe không được để trống.');
		
		if (!$("#licenseNumberInput")[0].checkValidity()) // Check License: required
			return toastr.warning('Biển số xe không được để trống');

		let updateModel = {
			Name: $('#vehicleNameInput').val()
			, LicenseNumber: $('#licenseNumberInput').val()
			, GarageID: $('#garageIDInput').val()
			, VehicleGroupID: $('#vehicleGroupIDInput').val()
			, ModelID: $('#modelIDInput').val()
			, Year: $('#yearInput').val()
			, Engine: $('#engineInput').val()
			, FuelType: $('#fuelTypeInput').val()
			, TransmissionType: $('input[name="transmissionTypeInput"]:checked').val()
			, TransmissionDetail: $('#transmissionDetailInput').val()
			, Color: $('input[name="colorInput"]:checked').val()
			, Description: $('#descriptionInput').val()
		};

		$.ajax({
			type: "PATCH",
			url: `/api/vehicles/${VEHICLE_ID}`,
			data: updateModel,
			success: () => {
				location.reload();
			},
			eror: () => {
				toastr.error("Chỉnh sửa thất bại. Vui lòng thử lại sau");
			}
		});
	});

	// =====================================
	// Validate on change
	$('#vehicleNameInput').focusout(function(){
		if(!$(this)[0].checkValidity())
			toastr.warning('Tên xe không được để trống.');
	})

	$('#licenseNumberInput').focusout(function(){
		if(!$(this)[0].checkValidity())
			toastr.warning('Biển số xe không được để trống.');
	})

	$('#yearInput').focusout(function(){
		let value = Number.parseInt($(this).val());
		// To ensure that it is integer
		$(this).val(value);

		if(!value) {
			toastr.warning('Năm sản xuất của xe không được để trống.');
		} else if(value > MAX_YEAR) {
			$(this).val(MAX_YEAR);
		} else if (value < MIN_YEAR) {
			$(this).val(MIN_YEAR);
		}
	})

	// =====================================
	// Initiate select2
	$('#modelIDInput').select2({
		placeholder: "Vui lòng chọn dòng xe..."
		, matcher: function(term, data) {
			return data.id == '0' ? data : $.fn.select2.defaults.defaults.matcher.apply(this, arguments);
		}
		, width: '100%'
	})
	.on('select2:close', () => {
		$('#modelIDInput')[0].checkValidity() || toastr.warning('Dòng xe không được để trống.');
	})

	$('#garageIDInput').select2({
		placeholder: "Vui lòng chọn garage..." 
		, width: '100%'
	})
	.on('select2:close', () => {
		$('#garageIDInput')[0].checkValidity() || toastr.warning('Garage không được để trống.');
	})

	$('#vehicleGroupIDInput').select2({
		allowClear: true
		, placeholder: "Vui lòng chọn nhóm xe..."
		, width: '100%'
	})

	$('#fuelTypeInput').select2({
		allowClear: true
		, placeholder: "Vui lòng chọn loại nhiên liệu..."
		, width: '100%'
	})

	// ==============================================================================================================
	// Image uploading

	$('#dropzoneForm').dropzone({
		acceptedFiles: "image/jpeg,image/png,image/gif"
		, dictDefaultMessage: "Thả ảnh hoặc nhấn vào đây để upload."
		, dictFileTooBig: 'Dung lượng ảnh phải dưới {{maxFilesize}} mb.'
		, dictInvalidFileType: 'Không phải file ảnh.'
		, dictMaxFilesExceeded: 'Chỉ được upload tối đa 10 ảnh.'
		, dictRemoveFile: 'Xóa'
		, maxFiles: 10
		, maxFilesize: 1
		, parallelUploads: 1
		, uploadMultiple: false

		, init: function () {
			var myDropzone = this;

			this.on('success', function (file, response) {
				// The id for deleting img by clicking delete btn
				file.Id = response.Id;

				// Add it into img list
				imageList.push(response);
			});

			this.on('addedfile', (file) => {
				// Create the remove button
				var removeButton = Dropzone.createElement('<div class="text-center m-t"><button class="btn btn-danger">Xóa</button></div>');

				// Listen to the click event
				removeButton.addEventListener('click',(e) => {
					e.preventDefault();
					e.stopPropagation();

					// At least leave 4 img behind
					if(imageList.length > 4){
						if(file.Id) {
							$.ajax({
								type: "DELETE",
								url: `/api/vehicles/images/${file.Id}`,
								success: (data) => {
									this.removeFile(file);

									// Remove it from img list
									imageList = imageList.filter(img => img.Id != file.Id );

									// Increase maxFiles if the deleted file has already existed beforehand
									if(file.isSenpai)
										this.options.maxFiles++;

									// Change the img displayed on carousels
									changeImg();

									toastr.success('Xóa ảnh thành công.')
								},
								eror: function (data) {
									toastr.error('Xóa ảnh thất bại. Vui lòng thử lại sau.')
								}
							});
						} else {
							this.removeFile(file);
						}
					} else {
						toastr.warning('Bạn phải có ít nhất 4 ảnh cho mỗi xe.')
					}
				});

				// Add the button to the file preview element.
				file.previewElement.appendChild(removeButton);
			});

			// Add existed imgs into review
			imageList.map(image => {
				image.isSenpai = true;
				this.emit("addedfile", image);

				this.createThumbnailFromUrl(image, image.Url, undefined, true);

				// Make sure that there is no progress bar, etc...
				this.emit("complete", image);

				// Reduce the allowed num of uploading img
				this.options.maxFiles--;

				return image;
			})
		}
	})


	// =========================================================================================
	// Delete vehicle

	$('#deleteVehicleBtn').click(() => $.ajax({
		type: "DELETE",
		url: `/api/vehicles/${VEHICLE_ID}`,
		success: () => {
			window.location.pathname = "/management/vehicleManagement";
		},
		eror: () => {
			toastr.warning('Xoá thất bại. Bạn vui lòng thử lại sau.')
		}
	}));
});