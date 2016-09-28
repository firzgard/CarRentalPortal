function renderDropDownListOptions(options){
	return `<option value></option>${options.reduce((html, option) => {
			return html + `<option value="${option.id}">${option.name}</option>`
		}, '')}`
}

function renderChangeGaragePopup(modalNode, vehicles){
	// Ajax data
	const garages = [
		{id: 1, name: 'Garage Black'},
		{id: 2, name: 'Garage White'},
		{id: 3, name: 'Garage Red'},
		{id: 4, name: 'Garage Blue'},
		{id: 5, name: 'Garage Green'}
	];

	modalNode.innerHTML =`<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h2 class="modal-title">Change Garage</h2>
			</div>
			<div class="modal-body">
				<div class="form-group">
					<select data-placeholder="Please choose a garage..." class="form-control" id="garageID" required>
						${renderDropDownListOptions(garages)}
					</select>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
				<button type="button" class="btn btn-primary">OK</button>
			</div>
		</div>
	</div>`;

	$('#garageID').chosen({
		width: "100%",
		no_results_text: "No result!"
	});
}

function renderChangeGroupPopup(modalNode, vehicles){
	// Ajax data
	const groups = [
		{id: 1, name: 'Group Alpha'},
		{id: 2, name: 'Group Beta'},
		{id: 3, name: 'Group Gamma'},
		{id: 4, name: 'Group Delta'},
		{id: 5, name: 'Group Epsilon'}
	];

	modalNode.innerHTML =`<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h2 class="modal-title">Change Group</h2>
			</div>
			<div class="modal-body">
				<div class="form-group">
					<select data-placeholder="Please choose a group..." class="form-control" id="groupID" required>
						<option value></option>
						${renderDropDownListOptions(groups)}
					</select>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
				<button type="button" class="btn btn-primary">OK</button>
			</div>
		</div>
	</div>`;

	$('#groupID').chosen({
		width: "100%",
		no_results_text: "No result!"
	});
}