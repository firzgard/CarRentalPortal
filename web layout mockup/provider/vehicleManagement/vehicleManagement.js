/** carManagement.js ver1.0 */
var data = [
        [
            "1",
            "59H-123.22",
            "ABC",
            "Group A",
            "Honda",
            "SUV",
            "2.5L",
            "Petrol",
            "Automatic",
            "5000 HP",
            "7",
            "3.5",
        ],
        [
            "2",
            "give",
            "me",
            "more",
            "times",
            "I",
            "will",
            "improve",
            "that",
            "is",
            "5",
            "5",
            ]
    ];
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

//            $('#table-magmt tfoot th').each( function (i) {
//                var title = $('#table-magmt tfoot th').eq( $(this).index() ).text();
//                $(this).html( '<input type="text" placeholder="Search '+title+'" data-index="'+i+'" />' );
//            } );

//            $('#table-magmt tfoot th').each( function () {
//                var title = $(this).text();
//                $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
//            } );

    let table = $('#table-magmt').DataTable({
        "dom" : 'lrtip',
        //"sDom": '<"top"if>rt<"bottom"lp><"clear">',
        "data" : data,
        //"bSort": false,
        "retrieve": true,
        //"bServerSide": true,
        "scrollCollapse": true,
        "processing": true,
        "select": {
            selector: 'td:not(:last-child)',
            style: 'multi+shift'
        },
        //"iDisplayLength": 10,
        //"aLengthMenu": [10, 25, 50],
        "columns" : [
            { visible: false },
            { name:"License", title: "License"},
            { title: "Garage"},
            { title: "Group"},
            { title: "Brand"},
            { title: "Type"},
            { title: "Engine", visible: false},
            { title: "Fuel"},
            { title: "Transmission"},
            { title: "Power", visible: false},
            { title: "Seat"},
            { title: "Rate"},
            { title: "Action"},
        ],
        "columnDefs": [
            {
                "targets": [11],
                "render": function(data, type, o) {
                    return renderStarRating(data);
                }
            },
            {
                "targets": [12],
                "render": function (data, type, o) {
                    var action = `<div class="btn-group" >
                <button data-toggle="dropdown" class="btn btn-primary btn-sm dropdown-toggle" aria-expanded="false">
                    <i class="fa fa-gear"></i> Actions <i class="caret"></i>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#" data-toggle="modal" class="font-bold" data-target="#customModal" data-action="duplicateVehicle" data-vehicle-id="${o[0]}">Duplicate</a></li>
                    <li><a href="./../car/car.html" class="font-bold">Edit</a></li>

                    <li><a href="#" data-toggle="modal" class="font-bold" data-target="#confirmModal" data-action="delete" data-name="${o[1]}" data-id="${o[0]}">Delete</a></li>
                </ul>
            </div>`;
                    var edit='<a class="btn btn-edit btn-primary btn-sm">Edit</a>'
                    var del='<a class="btn btn-edit btn-danger btn-sm">Delete</a>'
                    return action;
                },
                "sortable": false,
            },
        ],
    });
    
    // create column filter
    // vehicle license text filter
    createTextFilter(table, $('#vehicleLicense'), 'License');
    // garage checkbox filter
    createCheckboxFilter(table, $('#garageName'), 2);
    // group checkbox filter
    createCheckboxFilter(table, $('#groupName'), 3);
    // brand checkbox filter
    createCheckboxFilter(table, $('#brandName'), 4);
    // brand checkbox filter
    createCheckboxFilter(table, $('#carType'), 5);
    // fuel checkbox filter
    createCheckboxFilter(table, $('#fuel'), 7);
    // transmission checkbox filter
    createCheckboxFilter(table, $('#transmission'), 8);
    // seat range filter
    createIntRangeFilter(table, $('#seat'), 10);
    // rate range filter
    createFloatRangeFilter(table, $('#rate'), 11);
    

    $('#car-color').css("color", $('#color-name').text());

    Dropzone.options.myAwesomeDropzone = {

        autoProcessQueue: false,
        uploadMultiple: true,
        acceptedFiles: "image/jpeg,image/png,image/gif",
        parallelUploads: 20,
        maxFiles: 20,
        maxFilesize: 1,
        dictDefaultMessage: "Drop files here to upload (or click)",
        dictInvalidFileType: "Accept image only",
        addRemoveLinks: "dictRemoveFile",

        // Dropzone settings
        init: function() {
            var myDropzone = this;

            this.element.querySelector('input[name="submit-img"]').addEventListener("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                myDropzone.processQueue();
            });
            this.on("sendingmultiple", function() {
                alert("sending");
            });
            this.on("successmultiple", function(files, response) {
                alert("success");
            });
            this.on("errormultiple", function(files, response) {
                alert("fail");
            });
        }

    }

    //Render change modal
    $('#changeModal').on('show.bs.modal', function(e) {
        let button = $(e.relatedTarget),
            name = button.data('name');

        $(this).find('.modal-content').html(
            `<div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h2 class="modal-title">
                    Change ${name}
                </h2>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-4 text-right">
                        <label>Select a ${name}</label>
                    </div>
                    <div class="col-md-8">
                        <select class="form-control">
                            <option value="1">a</option>
                            <option value="2">b</option>
                            <option value="3">c</option>
                            <option value="4">d</option>
                            <option value="5">e</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success">OK</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>`
        );
    });

    // Render confirmation modal for actions
    $('#confirmModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget),
            action = button.data('action')
            id = button.data('id'),
            name = button.data('name');

        $(this).find('.modal-content').html(`<div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <h2 class="modal-title">
                Deletion Confirmation
            </h2>
        </div>
        <div class="modal-body">
            You are about to <b>delete</b> car <b>${name}</b>. Are you sure?
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">No</button>
            <button type="button" class="btn btn-danger">Yes</button>
        </div>`);
    });
    
    // Custom modal's content renders dynamically
	$('#customModal').on('show.bs.modal', function(event) {
		let button = $(event.relatedTarget),
			action = button.data('action');

		switch(action){
			case 'changeGarage':{
				renderSelectorModal('garage', this, [ button.data('vehicle-id') ]);
			}
			break;case 'changeGarageMulti':{
				let vehicles = [],
					data = table.rows({ selected: true }).data();
					
				for(let i = 0; i < data.length; i++){
					vehicles.push(data[i].id);
				}

				renderSelectorModal('garage', this, vehicles);
			}
			break;case 'changeGroup':{
				renderSelectorModal('group', this, [ button.data('vehicle-id') ]);
			}
			break;case 'changeGroupMulti':{
				let vehicles = [],
					data = table.rows({ selected: true }).data();
					
				for(let i = 0; i < data.length; i++){
					vehicles.push(data[i].id);
				}

				renderSelectorModal('group', this, vehicles);
			}
			break;case 'duplicateVehicle':{
				// Ajax to get the prototype vehicle's info using id: button.data('vehicle-id')
				let protoVehicle = {
					name: 'Audi A8ZR',
					modelID: 4,
					year: 2015,
					garageID: 1,
					groupID: 1,
					transmissionType: 1,
					transmissionDetail: '8-speed ZF 8HP tiptronic automatic',
					engine: '4.2 V8 TDI',
					fuel: 6,
					color: 'black',
					description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus, qui, temporibus. Eius, id iusto repellat fugiat. Quo adipisci sint natus magni facilis tempore, possimus, pariatur perferendis consequatur eum quas rerum.'
				}

				renderCreateVehicleModal(this, protoVehicle);
			}
			break;case 'createVehicle':{
				renderCreateVehicleModal(this, { });
			}
			break;case 'deleteVehicle':{
				renderConfirmModal('vehicle', 'delete', this, [{ id: button.data('vehicle-id'), name: button.data('vehicle-name') }]);
			}
			break;case 'deleteVehicleMulti':{
				let vehicles = [],
					data = table.rows({ selected: true }).data();

				for(let i = 0; i < data.length; i++){
					vehicles.push({ id: data[i].id, name: data[i].name });
				}

				renderConfirmModal('vehicle', 'delete', this, vehicles);
			}
			break;case 'deactivateGarage':{
				renderConfirmModal('garage', 'deactivate', this, [{ id: $('#garageID').val(), name: $('#garageName').val() }]);
			}
			break;case 'reactivateGarage':{
				renderConfirmModal('garage', 'reactivate', this, [{ id: $('#garageID').val(), name: $('#garageName').val() }]);
			}
			break;case 'deleteGarage':{
				renderConfirmModal('garage', 'delete', this, [{ id: $('#garageID').val(), name: $('#garageName').val() }]);
			}
			break;
		}
	});
    
});