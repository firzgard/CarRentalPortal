const mockupGarages = [
	{id: 1, name: 'Garage Black'},
	{id: 2, name: 'Garage White'},
	{id: 3, name: 'Garage Red'},
	{id: 4, name: 'Garage Blue'},
	{id: 5, name: 'Garage Green'}
], mockupGroups = [
	{id: 1, name: 'Group Alpha'},
	{id: 2, name: 'Group Beta'},
	{id: 3, name: 'Group Gamma'},
	{id: 4, name: 'Group Delta'},
	{id: 5, name: 'Group Epsilon'}
], mockupModelTree = [
	{
		id: 1,
		name: 'Audi',
		models: [
			{ id: 1, name: 'A1' },
			{ id: 2, name: 'A6' },
			{ id: 3, name: 'A7' },
			{ id: 4, name: 'A8' }
		]
	},
	{
		id: 2,
		name: 'BMW',
		models: [
			{ id: 13, name: 'X3' },
			{ id: 14, name: 'X5' },
			{ id: 15, name: 'X6' }
		]
	},
	{
		id: 1,
		name: 'Ford',
		models: [
			{ id: 17, name: 'Fiesta Mk5' },
			{ id: 18, name: 'Fiesta Mk6' },
			{ id: 19, name: 'Focus Mk2' },
			{ id: 20, name: 'Focus Mk3' },
		]
	}
], mockupFuelTypes = [
	{ "id": 1, "name": "Amonia" },
	{ "id": 2, "name": "Bioalcohol" },
	{ "id": 3, "name": "Biodiesel" },
	{ "id": 4, "name": "Biogas" },
	{ "id": 5, "name": "Compressed Natural Gas" },
	{ "id": 6, "name": "Diesel" },
	{ "id": 7, "name": "Electric" },
	{ "id": 8, "name": "Flexible" },
	{ "id": 9, "name": "Hybrid Electric" },
	{ "id": 10, "name": "Hydrogen" },
	{ "id": 11, "name": "Liquefied Natural Gas" },
	{ "id": 12, "name": "Liquefied Petronleum Gas" },
	{ "id": 13, "name": "Petrol" },
	{ "id": 14, "name": "Plug-in Hybrid Electric" },
	{ "id": 15, "name": "Stream Wood Gas" }
];
function renderSelectorOptions(type, html = ''){
	// Ajax data
	switch(type){
		case 'garage':{
			options = mockupGarages;
			html += '<option></option>';
		}
		break;case 'group':{
			options = mockupGroups;
			html += '<option value="null">------ None ------</option>';
		}
		break;case 'model':{
			options = mockupModelTree;
			html += '<option></option>';
		}
		break;case 'fuel':{
			options = mockupFuelTypes;
			html += '<option></option>';
		}break;
	}

	return options.reduce((html, option) => {
		return html + `<option value="${option.id}">${option.name}</option>`
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
					<select data-placeholder="Please choose ${type}..." class="form-control" id="modalItemSelector" required>
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

	$('#modalItemSelector').chosen({
		width: "100%",
		no_results_text: "No result!"
	});
}

function renderCreateVehicleModal(modalNode, { name, modelID, year, garageID, groupID, transmission, engine, power, color, description }){
	// Ajax data here
	const garage = mockupGarages,
		group = mockupGroups;

	modalNode.innerHTML = `<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true"><i class="fa fa-times-circle"></i></span>
				</button>
				<h2 class="modal-title">New Vehicle</h2>
			</div>
			<div class="modal-body">
				<div class="form-group">
					<div class="input-group">
						<span class="input-group-addon"><i class="fa fa-car" style="font-size: 2em;"></i></span>
						<input type="text" placeholder="Vehicle's name" value="${name || ''}" id="newName" class="form-control input-lg" style="font-size: 2em; font-weight:bold;" required>
					</div>
				</div>
				<div class="row">
					<div class="col-sm-6 form-group">
						<label>Vehicle model*</label>
						<select data-placeholder="Please choose vehicle's model..." class="input-group chosen-select">
							<option></option>
						</select>
					</div>
					<div class="col-sm-6 form-group">
						<label>License*</label>
						<input type="text" class="form-control" required>
					</div>
					<div class="col-sm-6 form-group">
						<label>Fuel type</label>
						<select data-placeholder="Choose fuel type..." class="input-group chosen-select">
							${renderSelectorOptions('fuel')}
						</select>
					</div>
					<div class="col-sm-6 form-group">
						<label>Year*</label>
						<input type="number" placeholder="Production year" class="form-control">
					</div>
					<div class="col-sm-6 form-group">
						<label>Transmission type*</label>
						<div class="btn-group btn-group-justified" data-toggle="buttons" >
							<label class="btn btn-info ${transmission && (transmission == 1) && 'active'}">
								<input type="radio" value="1" autocomplete="off" ${transmission && (transmission == 1) && 'checked'} >Automatic
							</label>
							<label class="btn btn-info" ${transmission && (transmission == 2) && 'active'}>
								<input type="radio" value="2" autocomplete="off" ${transmission && (transmission == 2) && 'checked'} >Manual
							</label>
						</div>
					</div>
					<div class="col-sm-6 form-group">
						<label>Engine capacity</label>
						<div class="input-group">
							<input type="number" class="form-control">
							<span class="input-group-addon">l</span>
						</div>
					</div>
					<div class="col-sm-6 form-group">
						<label>Engine power</label>
						<div class="input-group">
							<input type="number" class="form-control">
							<span class="input-group-addon">hp</span>
						</div>
					</div>
					<div class="col-sm-12 form-group">
						<label>Vehicle's color</label>
						<div class="text-center">
							<div id="current-color" class="text-center" style="font-size: 30px;"> <span><i class="fa fa-lg fa-car"></i></span> </div>
							<div id="color-name"></div>
							<div class="panel-body">
								<a title="Beige" class="btn btn-lg btn-color" style="background-color: beige"></a>
								<a title="Black" class="btn btn-lg btn-color" style="background-color: black"></a>
								<a title="Blue" class="btn btn-lg btn-color" style="background-color: blue"></a>
								<a title="Brown" class="btn btn-lg btn-color" style="background-color: brown"></a>
								<a title="Gold" class="btn btn-lg btn-color" style="background-color: gold"></a>
								<a title="Green" class="btn btn-lg btn-color" style="background-color: green"></a>
								<a title="Orange" class="btn btn-lg btn-color" style="background-color: orange"></a>
								<a title="Purple" class="btn btn-lg btn-color" style="background-color: purple"></a>
								<a title="Red" class="btn btn-lg btn-color" style="background-color: red"></a>
								<a title="Silver" class="btn btn-lg btn-color" style="background-color: silver"></a>
								<a title="White" class="btn btn-lg btn-color" style="background-color: white"></a>
								<a title="Yellow" class="btn btn-lg btn-color" style="background-color: yellow"></a>
							</div>
						</div>
					</div>
					<div class="col-sm-12 form-group">
						<label>Description</label>
						<textarea rows="5" type="text" class="form-control input-lg"></textarea>
					</div>
					<div class="col-sm-12 form-group">
						<label>Car pictures</label>
						<form id="my-awesome-dropzone" class="dropzone" action="#">
							<div class="dropzone-previews"> </div>
						</form>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
				<button type="button" class="btn btn-primary">OK</button>
			</div>
		</div>
	</div>`;
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
				You are about to ${action} following ${type}(s):
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