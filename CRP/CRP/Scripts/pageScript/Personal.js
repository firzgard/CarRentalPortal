$(document).ready(function(){
    Dropzone.options.dropzoneForm = {
        maxFiles: 2,
        init: function () {
            this.on("maxfilesexceeded", function (data) {
                var res = eval('(' + data.xhr.responseText + ')');

            });
            this.on("addedfile", function (file) {

                // Create the remove button
                var removeButton = Dropzone.createElement("<button>Remove file</button>");
                // Capture the Dropzone instance as closure.
                var _this = this;

                // Listen to the click event
                removeButton.addEventListener("click", function (e) {
                    // Make sure the button click doesn't submit the form:
                    e.preventDefault();
                    e.stopPropagation();
                    // Remove the file preview.
                    _this.removeFile(file);
                    // If you want to the delete the file on the server as well,
                    // you can do the AJAX request here.
                });

                // Add the button to the file preview element.
                file.previewElement.appendChild(removeButton);
            });
        }
    };
});

    function saveProfileImage() {
        updateProfile(profileImage);
    }

    function chooseProfile() {
        $("#uploadEditorImage").click();
    }
    function progessBar(isShow) {
        if (isShow == true) {
            $("#progressBar").removeAttr("hidden");
        } else {
            $("#progressBar").attr("hidden", "hidden");
        }
    }
    function updateProfile(newUrl) {
        var userid = 1;
        $.ajax({
            url: "/Home/saveProfileImage/",
            type: "POST",
            data: {
                userid: userid,
                url: newUrl,
            },
            success: function (successData) {
                location.reload();
            },
            error: function (er) {
                alert(er);
            } });
    }
    function cancelChangeImg() {
        $("#profilePreview").prop("src", oldProfileImage);
        $("#changeImgRow").removeClass("hide");
        $("#confirmChangeImgRow").addClass("hide");
    }
    $(document).ready(function() {
        $("#uploadEditorImage").change(function () {
            var data = new FormData();
            var files = $("#uploadEditorImage").get(0).files;
            if (files.length > 0) {
                data.append("image", files[0]);
                data.append("height", 530);
                data.append("width", 530);
            }
            progessBar(true);
            $.ajax({
                url: "/Management/Image/Upload",
                type: "POST",
                processData: false,
                contentType: false,
                data: data,
                success: function (successData) {
                    profileImage = successData;
                    $("#profilePreview").attr("src", successData);
                    document.getElementById("newUrl").value = successData;
                    $("#changeImgRow").addClass("hide");
                    $("#confirmChangeImgRow").removeClass("hide");
                    progessBar(false);
                },
                error: function (er) {
                    alert(er);
                    progessBar(false);
                }
            });
        });
    });