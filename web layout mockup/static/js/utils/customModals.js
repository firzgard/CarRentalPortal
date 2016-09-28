function renderSelectorModal(type, modalNode, vehicles){
	// Ajax data
	const garages = [
		{id: 1, name: 'Garage Black'},
		{id: 2, name: 'Garage White'},
		{id: 3, name: 'Garage Red'},
		{id: 4, name: 'Garage Blue'},
		{id: 5, name: 'Garage Green'}
	], groups = [
		{id: 1, name: 'Group Alpha'},
		{id: 2, name: 'Group Beta'},
		{id: 3, name: 'Group Gamma'},
		{id: 4, name: 'Group Delta'},
		{id: 5, name: 'Group Epsilon'}
	];
	if(type === 'garage')
		options = garages;
	else if (type === 'group')
		options = groups;

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
					<select data-placeholder="Please choose a garage..." class="form-control" id="modalItemSelector" required>
						<option value></option>
						${options.reduce((html, option) => {
							return html + `<option value="${option.id}">${option.name}</option>`
						}, '')}
					</select>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
				<button type="button" class="btn btn-primary">OK</button>
			</div>
		</div>
	</div>`;

	$('#modalItemSelector').chosen({
		width: "100%",
		no_results_text: "No result!"
	});
}

function renderConfirmModal(type, action, modalNode, items){
	modalNode.innerHTML = `<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header red-bg">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true"><i class="fa fa-times-circle"></i></span>
				</button>
				<h2 class="modal-title">
					${action === 'delete' ? 'Deletion'
						: (action === 'deactivate' ? 'Deactivation'
						: (action === 'activate' ? 'Activation'
						: ''))} Confirmation
				</h2>
			</div>
			<div class="modal-body">
				You are about to delete following ${type}(s):
				<ul>${items.reduce((html, item) => {
					return html + `<li>${item.name}</li>`
				}, '')}</ul>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">No</button>
				<button type="button" class="btn btn-danger">Yes</button>
			</div>
		</div>
	</div>`;
}