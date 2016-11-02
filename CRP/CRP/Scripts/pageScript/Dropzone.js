﻿Dropzone.options.dropzoneForm = {
    maxFiles: 4,
    minFiles: 1,
    maxFilesize: 1,
    dictInvalidFileType: "Chỉ chấp nhận file hình ảnh!",
    dictDefaultMessage: "Kéo hoặc click để up ảnh nhé",
    acceptedFiles: "image/jpeg,image/png,image/gif",
    init: function () {
        this.on("success", function (file, response) {
            file.serverId = response;
        });
        this.on("maxfilesexceeded", function (data) {
            var res = eval('(' + data.xhr.responseText + ')');

        });
        this.on("addedfile", function (file) {
            // Create the remove button
            var removeButton = Dropzone.createElement("<button>Xóa chọn</button>");
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
                $.ajax({
                    type: "DELETE",
                    url: `/api/vehicles/deletepic`,
                    data: {
                        file: file.serverId,
                    },
                    async: true,
                    success: function (data) {
                        alert("Xóa chọn thành công");
                        this.reload();
                    },
                    eror: function (data) {
                        alert("Thất bại");
                        this.reload();
                    }
                });
            });

            // Add the button to the file preview element.
            file.previewElement.appendChild(removeButton);
        });
    }
};