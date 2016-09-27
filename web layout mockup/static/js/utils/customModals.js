function renderChangeGaragePopup(garages, modalNode){
	$(modalNode).find('.modal-content').html(`<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		<h2 class="modal-title">Change Garage</h2>
	</div>
	<div class="modal-body">
		<div class="form-group">
			<label for="locationID">Location*</label>
			<select data-placeholder="Please choose a garage..." class="form-control" id="garageID" required>
				<option value></option>
				${garages.reduce((html, garage) => {
					return html + `<option value="${garage.id}">${garage.name}</option>`
				}, '')}
			</select>
		</div>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
		<button type="button" class="btn btn-primary">OK</button>
	</div>`);

	$('#locationID').chosen({
		width: "100%",
		no_results_text: "No result!"
	});
}