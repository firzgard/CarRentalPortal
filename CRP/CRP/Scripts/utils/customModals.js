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

        function renderCreateVehicleModal(modalNode, { name, modelID, year, garageID, groupID, transmissionType, transmissionDetail, engine, fuel, color, description }){
        // Ajax data here
        const garage = mockupGarages,
            group = mockupGroups;

        let jqModalNode = $(modalNode)

        jqModalNode.html(`<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true"><i class="fa fa-times-circle"></i></span>
				</button>
				<h2 class="modal-title">New Vehicle</h2>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-sm-6 form-group">
						<label>Vehicle's name*</label>
						<input type="text" placeholder="Vehicle's name" value="${name || ''}" id="newName" class="form-control" required>
					</div>
					<div class="col-sm-6 form-group">
						<label>License*</label>
						<input type="text" placeholder="Vehicle's license" id="newLicense" class="form-control" required>
					</div>
					<div class="col-sm-6 form-group">
						<label>Vehicle's model*</label>
						<select data-placeholder="Please select vehicle's model..." class="input-group chosen-select" required>
							${renderSelectorOptions('model', modelID)}
						</select>
					</div>
					<div class="col-sm-6 form-group">
						<label>Year*</label>
						<input type="number" placeholder="Production year" value="${year || ''}" class="form-control" required>
					</div>
					<div class="col-sm-6 form-group">
						<label>Garage*</label>
						<select data-placeholder="Please select fuel type..." class="input-group chosen-select" required>
							${renderSelectorOptions('garage', garageID)}
						</select>
					</div>
					<div class="col-sm-6 form-group">
						<label>Vehicle's group*</label>
						<select data-placeholder="Please select fuel type..." class="input-group chosen-select" required>
							${renderSelectorOptions('group', groupID)}
						</select>
					</div>
					<div class="col-sm-6 form-group">
						<label>Transmission type</label>
						<div class="btn-group btn-group-justified" data-toggle="buttons" >
							<label class="btn btn-success ${(transmissionType && (transmissionType == 1) && 'active') || ''}">
								<input type="radio" value="1" autocomplete="off" ${(transmissionType && (transmissionType == 1) && 'checked') || ''} >Automatic
							</label>
							<label class="btn btn-info ${(transmissionType && (transmissionType == 2) && 'active') || ''}">
								<input type="radio" value="2" autocomplete="off" ${(transmissionType && (transmissionType == 2) && 'checked') || ''} >Manual
							</label>
						</div>
					</div>
					<div class="col-sm-6 form-group">
						<label>Transmission detail</label>
						<input type="text" placeholder="Transmission detail" value="${transmissionDetail || ''}" class="form-control">
					</div>
					<div class="col-sm-6 form-group">
						<label>Engine</label>
						<input type="text" placeholder="Engine" value="${engine || ''}" class="form-control">
					</div>
					<div class="col-sm-6 form-group">
						<label>Fuel type</label>
						<select data-placeholder="Please select fuel type..." class="input-group chosen-select">
							${renderSelectorOptions('fuel', fuel)}
						</select>
					</div>
					<div class="col-sm-12 form-group">
						<label>Vehicle's color</label>
						<div class="btn-group btn-group-justified" data-toggle="buttons" >
							${renderColorOptions(color)}
						</div>
					</div>
					<div class="col-sm-12 form-group">
						<label>Description</label>
						<textarea type="text" placeholder="Please enter your vehicle's description" rows="20" maxlength="200" class="form-control">${description || ''}</textarea>
					</div>
					<div class="col-sm-12 form-group">
						<label>Car pictures</label>
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

        jqModalNode.find('.chosen-select').chosen({
            width: "100%",
            no_results_text: "No result!"
        });

        let imageDropzone = $("#imageDropzone").dropzone({
            url: '#'
            , autoProcessQueue: false
            , parallelUploads: 5
            , maxFilesize: 2
            , uploadMultiple: true
            , addRemoveLinks: "dictRemoveFile"
            , hiddenInputContainer: '.modal-body'
            , maxFiles: 5
            , acceptedFiles: "image/jpeg,image/png,image/gif"
            , init: function () {
                // this.element.querySelector('input[name="submit-img"]').addEventListener("click", function (e) {
                // 	e.preventDefault();
                // 	e.stopPropagation();
                // 	myDropzone.processQueue();
                // });
                this.on("sendingmultiple", () => {
                    alert("sending");
                });
                this.on("successmultiple", (files, response) => {
                    alert("success");
                });
                this.on("errormultiple", (files, response) => {
                    alert("fail");
                });
            }
        });
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
