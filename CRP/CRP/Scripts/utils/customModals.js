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

function renderCreateVehicleModal(modalNode, { name, modelID, year, garageID, groupID, transmissionType, transmissionDetail, engine, fuel, color, description } = {}){
	// Ajax data here
	let garageList, groupList;

	$.ajax({
		url: '/api/listGroup'
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	let jqModalNode = $(modalNode)

	jqModalNode.html(`<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header green-bg">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true"><i class="fa fa-times-circle"></i></span>
				</button>
				<h2 class="modal-title">Tạo xe mới</h2>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-sm-6">
						<div class="form-group">
							<label>Tên xe*</label>
							<input type="text" placeholder="Tên xe" value="${name || ''}" id="newName" class="form-control" required>
						</div>
						<div class="form-group">
							<label>Hãng xe*</label>
							<select id="newBrand" data-placeholder="Vui lòng chọn hãng xe..." class="input-group" required></select>
						</div>
						<div class="form-group">
							<label>Năm sản xuất*</label>
							<input id="newYear" type="number" placeholder="Năm sản xuất" value="${year || ''}" class="form-control" required>
						</div>
						<div class="form-group">
						</div>
						<div class="form-group">
						</div>
					</div>
					<div class="col-sm-6">
						<div class="form-group">
							<label>Biển số xe*</label>
							<input type="text" placeholder="Biển số xe" id="newLicense" class="form-control" required>
						</div>
						<div class="form-group">
							<label>Dòng xe*</label>
							<select id="newModel" data-placeholder="Vui lòng chọn dòng xe..." class="input-group" required></select>
						</div>
					</div>
					<div class="col-sm-6 form-group">
							
					</div>
					<div class="col-sm-6 form-group">
						<label>Garage*</label>
						<select id="newGarage" data-placeholder="Vui lòng chọn garage..." class="input-group" required>
						</select>
					</div>
					<div class="col-sm-6 form-group">
						<label>Nhóm xe*</label>
						<select id="newVehicleGroup" data-placeholder="Vui lòng chọn nhóm xe..." class="input-group" required>
						</select>
					</div>
					<div class="col-sm-6 form-group">
						<label>Loại hộp số*</label>
						<div class="btn-group btn-group-justified" data-toggle="buttons" >
							<label class="btn btn-primary ${(transmissionType && (transmissionType == 1) && 'active') || ''}">
								<input type="radio" value="1" autocomplete="off" ${(transmissionType && (transmissionType == 1) && 'checked') || ''} >Số tự động
							</label>
							<label class="btn btn-primary ${(transmissionType && (transmissionType == 2) && 'active') || ''}">
								<input type="radio" value="2" autocomplete="off" ${(transmissionType && (transmissionType == 2) && 'checked') || ''} >Số sàng
							</label>
						</div>
					</div>
					<div class="col-sm-6 form-group">
						<label>Chi tiết về loại hộp số</label>
						<input type="text" placeholder="Chi tiết về loại hộp số" value="${transmissionDetail || ''}" class="form-control">
					</div>
					<div class="col-sm-6 form-group">
						<label>Động cơ</label>
						<input type="text" placeholder="Chi tiết về động cơ xe" value="${engine || ''}" class="form-control">
					</div>
					<div class="col-sm-6 form-group">
						<label>Loại nhiên liệu</label>
						<select data-placeholder="Please select fuel type..." class="input-group">
						</select>
					</div>
					<div class="col-sm-12 form-group">
						<label>Màu xe</label>
						<div class="btn-group btn-group-justified" data-toggle="buttons" ></div>
					</div>
					<div class="col-sm-12 form-group">
						<label>Mô tả xe</label>
						<textarea type="text" ows="20" maxlength="200" class="form-control">${description || ''}</textarea>
					</div>
					<div class="col-sm-12 form-group">
						<label>Hình ảnh</label>
						<div id="imageDropzone" class="dropzone">
							<div class="dropzone-previews"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
				<button type="button" class="btn btn-primary">OK</button>
			</div>
		</div>
	</div>`);

	$('#newGarage').select2({
		width: "100%"
	})

	// let imageDropzone = $("#imageDropzone").dropzone({
	// 	url: '#'
	// 	, autoProcessQueue: false
	// 	, parallelUploads: 5
	// 	, maxFilesize: 2
	// 	, uploadMultiple: true
	// 	, addRemoveLinks: "dictRemoveFile"
	// 	, hiddenInputContainer: '.modal-body'
	// 	, maxFiles: 5
	// 	, acceptedFiles: "image/jpeg,image/png,image/gif"
	// 	, init: function () {
	// 		// this.element.querySelector('input[name="submit-img"]').addEventListener("click", function (e) {
	// 		// 	e.preventDefault();
	// 		// 	e.stopPropagation();
	// 		// 	myDropzone.processQueue();
	// 		// });
	// 		this.on("sendingmultiple", () => {
	// 			alert("sending");
	// 		});
	// 		this.on("successmultiple", (files, response) => {
	// 			alert("success");
	// 		});
	// 		this.on("errormultiple", (files, response) => {
	// 			alert("fail");
	// 		});
	// 	}
	// });
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