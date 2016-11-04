function renderSelectorOptions(type, selectedID, html = ''){
	// Ajax data
	switch(type){
		case 'model':{
			options = mockupModelTree;
			html += '<option></option>';
		}
			break;case 'fuel':{
				options = mockupFuelTypes;
				html += '<option></option>';
			}
				break;case 'garage':{
					options = mockupGarages;
					html += '<option></option>';
				}
					break;case 'group':{
						options = mockupGroups;
						html += '<option value="null">------ None ------</option>';
					}
						break;
	}

	if(type === 'model'){
		return options.reduce((html, brand) => {
			return html + `<optgroup label="${brand.name}">
				${brand.models.reduce((htmlLv2, model) => {
					return htmlLv2 + `<option value="${model.id}" ${((model.id == selectedID) && 'selected') || ''}>${model.name}</option>`
				}, '')}
			</optgroup>`
		}, html);
	}

	return options.reduce((html, option) => {
		return html + `<option value="${option.id}" ${((option.id == selectedID) && 'selected') || ''}>${option.name}</option>`
	}, html);
}

function renderColorOptions(selectedColor, html = ''){
	const colorOptions = mockupColor;

	return colorOptions.reduce((html, option) => {
		return html + `<label class="btn btn-default ${((selectedColor === option) && 'active') || ''}">
		<input type="radio" value="${option}" autocomplete="off" ${((selectedColor == option) && 'checked') || ''} >
		<div><i class="fa fa-car" style="font-weight:bold; color:${option}; text-shadow: 0 0 1px black;"></i></div>
		<div>${option}</div>
	</label>`
	}, html);
}

function renderSelectorModal(type, modalNode, vehicles){
	modalNode.innerHTML =`<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true"><i class="fa fa-times-circle"></i></span>
				</button>
				<h2 class="modal-title">Change ${type}</h2>
			</div>
			<div class="modal-body">
				<div class="form-group">
					<select data-placeholder="Please select ${type}..." class="form-control" id="modalItemSelector" required>
						${renderSelectorOptions(type)}
					</select>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
				<button type="button" class="btn btn-primary">OK</button>
			</div>
		</div>
	</div>`;

	$(modalNode).find('#modalItemSelector').chosen({
		width: "100%",
		no_results_text: "No result!"
	});
}

function renderCreateVehicleModal(modalNode, table, vehicleID){
	let jqModalNode = $(modalNode),
		data;

	if (vehicleID) {
		$.ajax({
			url: '/api/vehicles/' + vehicleID,
		})
		.done(function(data) {
			renderModal(data);
		})
		.fail(function() {
			console.log("error");
		})
	} else {
		renderModal();
	}

	function renderModal(data = {}){
		jqModalNode.html(`<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header green-bg">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true"><i class="fa fa-times-circle"></i></span>
					</button>
					<h2 class="modal-title">Tạo xe mới</h2>
				</div>
				<div class="modal-body">
					<form method="post" id="newVehicleForm" class="dropzone" style="border: 0; padding: 0;">
						<div class="row">
							<div class="col-sm-6">
								<div class="form-group">
									<label>Tên xe*</label>
									<input id="Name" name="Name" type="text" placeholder="Tên xe" maxlength="100" value="${data.Name || ''}" class="form-control" required>
								</div>
								<div class="form-group">
									<label>Dòng xe*</label>
									<select id="ModelID" name="ModelID" class="input-group" required>
										${modelOptions.innerHTML}
									</select>
								</div>
								<div class="form-group">
									<label>Garage*</label>
									<select id="GarageID" name="GarageID" class="input-group" required>
										${garageOptions.innerHTML}
									</select>
								</div>
								<div class="form-group">
									<label>Loại hộp số*</label>
									<div class="btn-group btn-group-justified" data-toggle="buttons" >
										<label class="btn btn-primary ${(data.TransmissionType && (data.TransmissionType == 1) && 'active') || ''}">
											<input name="TransmissionType" type="radio" required value="1" autocomplete="off" ${(data.TransmissionType && (data.TransmissionType == 1) && 'checked') || ''} >Số tự động
										</label>
										<label class="btn btn-primary ${(data.TransmissionType && (data.TransmissionType == 2) && 'active') || ''}">
											<input name="TransmissionType" type="radio" value="2" autocomplete="off" ${(data.TransmissionType && (data.TransmissionType == 2) && 'checked') || ''} >Số sàng
										</label>
									</div>
								</div>
								<div class="form-group">
									<label>Loại nhiên liệu</label>
									<select class="input-group" id="FuelType" name="FuelType">
										${fuelOptions.innerHTML}
									</select>
								</div>
							</div>
							<div class="col-sm-6">
								<div class="form-group">
									<label>Biển số xe*</label>
									<input id="LicenseNumber" name="LicenseNumber" type="text" maxlength="50" placeholder="Biển số xe" class="form-control" required>
								</div>
								<div class="form-group">
									<label>Năm sản xuất*</label>
									<input id="Year" name="Year" type="number" step="1" placeholder="Năm sản xuất" value="${data.Year || ''}" class="form-control" required>
								</div>
								<div class="form-group">
									<label>Nhóm xe</label>
									<select id="VehicleGroupID" name="VehicleGroupID" class="input-group">
										${groupOptions.innerHTML}
									</select>
								</div>
								<div class="form-group">
									<label>Chi tiết về hộp số</label>
									<input id="TransmissionDetail" name="TransmissionDetail" type="text" maxlength="100" placeholder="Chi tiết về loại hộp số" value="${data.TransmissionDetail || ''}" class="form-control">
								</div>
								<div class="form-group">
									<label>Đặc tả động cơ</label>
									<input id="Engine" name="Engine" type="text" maxlength="100" placeholder="Chi tiết về động cơ xe" value="${data.Engine || ''}" class="form-control">
								</div>
							</div>
							<label class="col-sm-12">Màu xe*</label>
							<div class="col-sm-12">
								${colorOptions.innerHTML}
							</div>
							<hr>
							<div class="col-sm-12 form-group">
								<label>Mô tả xe</label>
								<textarea id="Description" name="Description" type="text" rows="20" maxlength="1000" class="form-control">${data.Description || ''}</textarea>
							</div>
							<hr>
							<div class="col-sm-12 form-group">
								<label>Hình ảnh*</label>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Thoát</button>
					<button type="button" id="createNewBtn" class="btn btn-primary">OK</button>
				</div>
			</div>
		</div>`);

		$('#Year').change(function(){
			if(Number.parseInt($(this).val()) > MAX_YEAR) {
				$(this).val(MAX_YEAR);
			} else if (Number.parseInt($(this).val()) < MIN_YEAR) {
				$(this).val(MIN_YEAR);
			}
		})

		$('#ModelID').select2({
			placeholder: "Vui lòng chọn dòng xe..."
			, width: '100%'
		})
		data.ModelID && $('#ModelID').val(data.ModelID).trigger("change")

		$('#GarageID').select2({
			placeholder: "Vui lòng chọn garage..." 
			, width: '100%'
		})
		data.GarageID && $('#GarageID').val(data.GarageID).trigger("change")

		$('#VehicleGroupID').select2({
			allowClear: true
			, placeholder: "Vui lòng chọn nhóm xe..."
			, width: '100%'
		})
		data.VehicleGroupID && $('#VehicleGroupID').val(data.VehicleGroupID).trigger("change")

		$('#FuelType').select2({
			allowClear: true
			, placeholder: "Vui lòng chọn loại nhiên liệu..."
			, width: '100%'
		})
		data.FuelType && $('#FuelType').val(data.FuelType).trigger("change")

		data.Color && $(`input[name="Color"][value="${data.Color}"]`).prop('checked',true);

		$('#newVehicleForm').dropzone({
			acceptedFiles: "image/jpeg,image/png,image/gif"
			, autoProcessQueue: false
			, addRemoveLinks: "dictRemoveFile"
			, dictCancelUpload: 'Xóa'
			, dictDefaultMessage: "Thả ảnh hoặc nhấn vào đây để upload."
			, dictFileTooBig: 'Dung lượng ảnh phải dưới {{maxFilesize}} mb.'
			, dictInvalidFileType: 'Không phải file ảnh.'
			, dictMaxFilesExceeded: ''
			, maxFiles: 10
			, parallelUploads: 10
			, maxFilesize: 1
			, uploadMultiple: true
			, url: "/api/vehicles"
			, init: function () {
				let noResponse = true;

				this.on("completemultiple", (files, a) => {
					var response = JSON.parse(files[0].xhr.response);

					if(noResponse) {
						noResponse = false;

						setTimeout(()=>{
							jqModalNode.modal('hide');
							table.ajax.reload();

							if(files[0].xhr.status == 200)
								toastr.success(response.message);
							else 
								toastr.error(response.message);
						}, 2000)
					}
				});

				$('#createNewBtn').click((evt) => {
					evt.preventDefault();
					evt.stopPropagation();

					// Validation
					if (!$("#Name").val()) { // Check Name : required
						toastr.warning('Tên xe không được để trống.');
					} else if (!$("#Name")[0].checkValidity()) { // Check Name : max 100
						toastr.warning('Tên xe phải dưới 100 ký tự.');
					} else if (!$("#LicenseNumber").val()) { // Check License: required
						toastr.warning('Biển số xe không được để trống');
					} else if (!$("#LicenseNumber")[0].checkValidity()) { // Check License: max 100
						toastr.warning('Biển số xe phải dưới 50 ký tự.');
					} else if (!$("#ModelID")[0].checkValidity()) { // Check model: required
						toastr.warning('Vui lòng chọn dòng xe.');
					} else if (!$("#Year")[0].checkValidity()) { // Check Year: required
						toastr.warning('Năm sản xuất của xe không được để trống.');
					} else if (!$("#GarageID")[0].checkValidity()) { // Check garage: required
						toastr.warning('Vui lòng chọn garage xe.');
					} else if ($('input[name="TransmissionType"]:checked').length == 0) {
						toastr.warning('Vui lòng chọn loại hộp số');
					} else if ($('input[name="Color"]:checked').length == 0) { // Check Color: required
						toastr.warning('Vui lòng chọn màu xe.');
					} else if (this.getQueuedFiles().length < 4) { // Check num of image: required, min 4
						toastr.warning('Bạn phải upload ít nhất 4 hình.');
					} else if (this.getQueuedFiles().length > 10){
						toastr.warning('Bạn chỉ được upload nhiều nhất 10 hình.');		
					} else if ($("#newVehicleForm")[0].checkValidity()) { // Valid? Up u go
						this.processQueue();
					}
				});
			}
		});
	}
}

function renderConfirmModal(table, type, action, modalNode, items){
	modalNode.innerHTML = `<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header red-bg">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true"><i class="fa fa-times-circle"></i></span>
				</button>
				<h2 class="modal-title">
				Xác nhận
					${action === 'delete' ? 'xóa'
							: (action === 'deactivate' ? 'hủy kích hoạt'
							: (action === 'reactivate' ? 'kích hoạt'
							: ''))}
				</h2>
			</div>
			<div class="modal-body">
                Bạn có chắc chắn ${action === 'delete' ? 'xóa'
                            : (action === 'deactivate' ? 'hủy kích hoạt'
                            : (action === 'reactivate' ? 'kích hoạt lại'
                            : ''))} ${type === 'vehicle group' || type === 'vehicleGroupDetail' ? 'nhóm giá'
                                    : (type === 'garage' ? 'garage'
                                    : (type === 'vehicle' ? 'xe'
                                    : '')) } này?
				<ul>${items.reduce((html, item) => {
					return html + `<li>${item.name}</li>`
				}, '')}</ul>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Không</button>
				<button type="button" id="btn-yes" class="btn btn-danger btn-yes">Có</button>
			</div>
		</div>
	</div>`;

    $(document).one('click', '#btn-yes', function(event) {
        switch(type) {
            case 'vehicle group':{
                if (action === "deactivate" || action === "reactivate") {
                    for(var i=0; i< items.length; i++) {
                        var id = items[i].id;
                        $.ajax({
                            url: `/api/vehicleGroups/status/${id}`,
                            type: "PATCH",
                            success: function (data) {
                                if(data.result) {
                                    $('.modal').modal('hide');
                                    table.ajax.reload();
                                } else {
                                    toastr.error("Cập nhật không thành công. Xin vui lòng thử lại");
                                }
                            },
                            eror: function (data) {
                                toastr.error("Đã có lỗi xảy ra. Xin vui lòng thử lại sau");
                            }
                        });
                    }
                }
                if (action === "delete") {
                    for(var i=0; i< items.length; i++) {
                        var id = items[i].id;
                        $.ajax({
                            url: `/api/vehicleGroups/${id}`,
                            type: "DELETE",
                            success: function (data) {
                                $('.modal').modal('hide');
                                if(data.result) {
                                    table.ajax.reload();
                                } else {
                                    toastr.error(data.message);
                                }
                            },
                            eror: function (e) {
                                toastr.error("Đã có lỗi xảy ra. Xin vui lòng thử lại sau");
                            }
                        });
                    }
                }
            } break;
            case 'vehicleGroupDetail':{
                if (action === "deactivate" || action === "reactivate") {
                    for(var i=0; i< items.length; i++) {
                        var id = items[i].id;
                        $.ajax({
                            url: `/api/vehicleGroups/status/${id}`,
                            type: "PATCH",
                            success: function (data) {
                                if(data.result) {
                                    $('.modal').modal('hide');
                                    if($('#isActive').val() === 'True') {
                                        $('#isActive').val('False');
                                    } else {
                                        $('#isActive').val('True');
                                    }
                                    renderActivation();
                                } else {
                                    toastr.error("Cập nhật không thành công. Xin vui lòng thử lại");
                                }
                            },
                            eror: function (e) {
                                toastr.error("Đã có lỗi xảy ra. Xin vui lòng thử lại sau");
                            }
                        });
                    }
                }
                if (action === "delete") {
                    for(var i=0; i< items.length; i++) {
                        var id = items[i].id;
                        $.ajax({
                            url: `/api/vehicleGroups/${id}`,
                            type: "DELETE",
                            success: function (data) {
                                if(data.result) {
                                    window.location.pathname = "/management/vehicleGroupManagement";
                                } else {
                                    $('.modal').modal('hide');
                                    toastr.error(data.message);
                                }
                            },
                            eror: function (data) {
                                toastr.error("Đã có lỗi xảy ra. Xin vui lòng thử lại sau");
                            }
                        });
                    }
                }
            } break;

            case 'garage':{
                if (action === "deactivate" || action === "reactivate") {
                    for(var i=0; i< items.length; i++) {
                        var id = items[i].id;
                        $.ajax({
                            url: `/api/garage/status/${id}`,
                            type: "PATCH",
                            success: function (data) {
                                $('.modal').modal('hide');
                                if(data.result) {
                                    if(table != '') {
                                        table.ajax.reload();
                                    } else {
                                        if($('#isActive').val() === 'True') {
                                            $('#isActive').val('False');
                                        } else {
                                            $('#isActive').val('True');
                                        }
                                        renderActivation();
                                    }
                                } else {
                                    toastr.error("Cập nhật không thành công. Xin vui lòng thử lại");
                                }
                            },
                            eror: function (data) {
                                toastr.error("Đã có lỗi xảy ra. Xin vui lòng thử lại sau");
                            }
                        });
                    }
                }
                if (action === "delete") {
                    for(var i=0; i< items.length; i++) {
                        var id = items[i].id;
                        $.ajax({
                            url: `/api/deleteGarage/${id}`,
                            type: "DELETE",
                            success: function (data) {
                                $('.modal').modal('hide');
                                if(data.result) {
                                    if(table != '') {
                                        table.ajax.reload();
                                    } else {
                                        window.location.pathname = "/management/garageManagement";
                                    }
                                    
                                } else {
                                    toastr.error(data.message);
                                }
                            },
                            eror: function (data) {
                                toastr.error("Đã có lỗi xảy ra. Xin vui lòng thử lại sau");
                            }
                        });
                    }
                }
            } break;
            case 'vehicle':{
                if(action === "delete") {
                    for(var i=0; i< items.length; i++) {
                        var id = items[i].id;
                        $.ajax({
                            url: `/api/vehicles/${id}`,
                            type: "DELETE",
                            success: function (data) {
                                $('.modal').modal('hide');
                                table.ajax.reload();
                            },
                            eror: function (data) {
                                toastr.error("Đã có lỗi xảy ra. Xin vui lòng thử lại sau");
                            }
                        });
                    }
                }
            } break;
        }
    });
}