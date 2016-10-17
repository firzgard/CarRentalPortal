const vehicleTableColumns = [
	{ name: 'ID', data: 'ID', visible: false, orderable: false, searchable: false }
	, { name: 'Name', title: 'Name', data: 'Name' }
	, { name: 'LicenseNumber', title: 'License', data: 'LicenseNumber' }
	, { name: 'GarageName', title: 'Garage', data: 'GarageName' }
	, { name: 'VehicleGroupName', title: 'Group', data: 'VehicleGroupName' }
	, { name: 'Location', title: 'Location', data: 'Location' }
	, { name: 'Year', title: 'Year', data: 'Year' }
	, { name: 'NumOfSeat', title: 'Seat', data: 'NumOfSeat' }
	, { name: 'Star', title: "Rating", data: 'Star', width: '6.5em' }
	, { name: 'Action', title: "Action", orderable: false, searchable: false }
]

$(document).ready(function() {
	// set toogling dropdown event for filter dropdown buttons
	$('#multiFilter .filter-toggle').on('click', function (event) {
		let dropdownContainer = $(this).parent();

		if(dropdownContainer.hasClass('open')){
			$('#multiFilter .filter-toggle').parent().removeClass('open');
		} else {
			$('#multiFilter .filter-toggle').parent().removeClass('open');
			dropdownContainer.addClass('open');
		}
	});

	let table = $(vehicleTable).DataTable({
		dom: "ltipr"
		, serverSide: true
		, ajax: {
			url: queryApiUrl
			, data: (rawData) => {
				console.log(rawData);
				return {
					Draw: rawData.draw
					, RecordPerPage: rawData.length
					, Page: rawData.start / rawData.length + 1
					, OrderBy: vehicleTableColumns[rawData.order[0].column].data
					, IsDescendingOrder: rawData.order[0].dir == 'desc'
				};
			}
		}
		, retrieve: true
		, scrollCollapse: true
		, processing: true
		, select: {
			selector: 'td:not(:last-child)',
			style: 'multi+shift'
		}
		//"iDisplayLength": 10,
		, columns : vehicleTableColumns
		, columnDefs: [
			{
				targets: -2
				, render: function(data, type, row) {
					return renderStarRating(data);
				}
			},
			{
				targets: -1
				, render: function (data, type, row) {
					var action = `<div class="btn-group" >
						<button data-toggle="dropdown" class="btn btn-info btn-block dropdown-toggle" aria-expanded="false">
							<i class="fa fa-gear"></i> Actions <i class="caret"></i>
						</button>
						<ul class="dropdown-menu">
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="changeGarage" data-vehicle-id="${row.id}" >Change Garage</a></li>
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="changeGroup" data-vehicle-id="${row.id}" >Change Group</a></li>
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="deleteVehicle" data-vehicle-id="${row.id}" data-vehicle-name="${row.name}" >Delete Vehicle</a></li>
							<li><a href="#" data-toggle="modal" data-target="#customModal" data-action="duplicateVehicle" data-vehicle-id="${row.id}" >Duplicate Vehicle</a></li>
							<li><a href="./../car/car.html" target="_blank">Edit Vehicle</a></li>
						</ul>
					</div>`;
					var edit='<a class="btn btn-edit btn-primary btn-sm">Edit</a>'
					var del='<a class="btn btn-edit btn-danger btn-sm">Delete</a>'
					return action;
				}
			}
		]
	});

	// Dropzone.options.myAwesomeDropzone = {

	// 	autoProcessQueue: false,
	// 	uploadMultiple: true,
	// 	acceptedFiles: "image/jpeg,image/png,image/gif",
	// 	parallelUploads: 20,
	// 	maxFiles: 20,
	// 	maxFilesize: 1,
	// 	dictDefaultMessage: "Drop files here to upload (or click)",
	// 	dictInvalidFileType: "Accept image only",
	// 	addRemoveLinks: "dictRemoveFile",

	// 	// Dropzone settings
	// 	init: function() {
	// 		var myDropzone = this;

	// 		this.element.querySelector('input[name="submit-img"]').addEventListener("click", function(e) {
	// 			e.preventDefault();
	// 			e.stopPropagation();
	// 			myDropzone.processQueue();
	// 		});
	// 		this.on("sendingmultiple", function() {
	// 			alert("sending");
	// 		});
	// 		this.on("successmultiple", function(files, response) {
	// 			alert("success");
	// 		});
	// 		this.on("errormultiple", function(files, response) {
	// 			alert("fail");
	// 		});
	// 	}

	// }
});