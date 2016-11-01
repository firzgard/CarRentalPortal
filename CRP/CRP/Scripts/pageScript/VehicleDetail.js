$(document).ready(function () {

    $('.btn-edit').on('click', function () {
        $('#edit-car').modal('show');
    });
    $('#delete-btn').on('click', function () {
        $('#delete-car').modal('show');
    });

    $('#change-color').on('click', function () {
        $('#panel-color').show();
    });

    $('#edit-btn').on('click', function () {
        $('.justRead').hide();
        $('.editFiel').css('display', 'inline-block');
    });

    $('.btn-color').on('click', function () {
        $('#car-color').html('<i class="fa fa-lg fa-car"></i>');
        $('#car-color').css('color', this.title);
        if (this.title === 'Beige' || this.title === 'Silver' || this.title === 'White') {
            $('#car-color').css('background-color', '#1a001a');
        } else {
            $('#car-color').css('background-color', 'transparent');
        }
        $('#color-name').text(this.title);
    });

    $('#close-color-panel').on('click', function () {
        $('#panel-color').hide();
    });

    $('#edit-img').on('click', function () {
        $('#edit-img').hide();
        $('#img-div').hide();
        $('#my-awesome-dropzone').show();
    });
    $('#cancel-img').on('click', function () {
        $('#edit-img').show();
        $('#img-div').show();
        $('#my-awesome-dropzone').hide();
    });
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
        //previewTemplate: '<div class="dz-preview dz-file-preview"><div class="dz-details"><div class="dz-filename"><span data-dz-name></span></div><div class="dz-size" data-dz-size></div><img data-dz-thumbnail /></div><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-success-mark"><span>✔</span></div><div class="dz-error-mark"><span>✘</span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div><img src="removebutton.png" alt="Click me to remove the file." data-dz-remove />',

        // Dropzone settings
        init: function () {
            var myDropzone = this;

            this.element.querySelector('input[name="submit-img"]').addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                myDropzone.processQueue();
            });
            this.on("sendingmultiple", function () {
                alert("sending");
            });
            this.on("successmultiple", function (files, response) {
                alert("success");
            });
            this.on("errormultiple", function (files, response) {
                alert("fail");
            });
        }

    }
});

$(document).on('click', "#agreed-delete", function () {
    let id = $('#vehicleID').val();
    $.ajax({
        type: "DELETE",
        url: `/api/vehicles/${id}`,
        async: true,
        success: function (data) {
            //alert("ok");
            window.location.pathname = "/management/vehicleManagement";
        },
        eror: function (data) {
            alert("fail");
        }
    });
});
$(document).on('click', "#save-btn", function () {
    let model = {};
    model.ID = $('#vehicleID').val();
    model.Name = $('#name').val();
    model.GarageID = $('#garageID').val();
    model.VehicleGroupID = $('#groupID').val();
    model.BrandID = $('#brandID').val();
    model.ModelID = '41';
    //model.Model.Name = ModelName;
    model.LicenseNumber = $('#licenseNumber').val();
    model.Engine = $('#engine').val();
    model.FuelType = $('#fuelFilter').val();
    model.TransmissionType = $('input[name=TransName]:checked').val();
    model.Star = '4.1';
    model.Color = $('input[name=group]:checked').val();
    model.Year = $('#year').val();
    model.Description = null;

    $.ajax({
        type: "PATCH",
        url: '/api/vehicles',
        data: model,
        async: true,
        success: function (data) {
            alert("ok");
        },
        eror: function (data) {
            alert("fail");
        }
    });
});
$(function () {
    $("#year").keydown(function () {
        // Save old value.
        $(this).data("old", $(this).val());
    });
    $("#year").keyup(function () {
        // Check correct, else revert back to old value.
        if (parseInt($(this).val()) <= 2016 && parseInt($(this).val()) >= 1988)
            ;
        else
            $(this).val($(this).data("old"));
    });
});
//$("#brandID").change(function () {
//    var model = '@Html.Raw(Json.Encode(Model.VehicleDetailInfoModel))';
//    if($(this).val() == model.lstModel.BrandID)

        
//})
