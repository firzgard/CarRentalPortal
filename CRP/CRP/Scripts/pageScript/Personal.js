$(document).ready(function () {
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

});