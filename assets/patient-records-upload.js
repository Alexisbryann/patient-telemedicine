// client-side upload file validation
$("#patient_file").on("change", function (e) {
    $("#file_type_error, #file_size_error").hide();
    const allowed_extensions = ['txt', 'pdf', "doc", "docx", "jpg", "jpeg", "png", "gif"];
    let extension = $(this).val().match(/\.([^\.]+)$/)[1].toLowerCase(), file_size = e.currentTarget.files[0].size / (1024 * 1024);

    if (!allowed_extensions.includes(extension)) {
        $("#file_type_error").show();
        $(this).val(null);
    }
    if (file_size > 5) {
        $("#file_size_error").show();
        $(this).val(null);
    }
});

// hide error messages when modal is closed
$("#modal-patient-file-upload").on("hidden.bs.modal", function () {
    $("#file_type_error, #file_size_error").hide();
});

// submit to server
$("#form_patient_file_upload").on("submit", function (e) {
    e.preventDefault();
    $("#patient_records_submit_btn").prop("disabled", true).html(' <strong>Saving...&nbsp;&nbsp;</strong> <div class="loader" role="status"></div>');
    const doctor_id = $("#doctorId").val(), patient_email = $("#p_email").text();

    // stop process if patient email or doctor ID not available
    if (!(doctor_id && patient_email)) {
        $.toast({
            heading: "Error",
            text: "Something went wrong. Please try again",
            position: 'bottom-right',
            showHideTransition: 'slide',
            timer: 3000,
        });

        return false;
    }

    let form_data = new FormData(this);
    form_data.append("patient_email", patient_email);
    form_data.append("doctor_id", doctor_id);

    // submit form
    $.ajax({
        url: "operation/patientRecordsUpload.php",
        method: "POST",
        data: form_data,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (response) {
            if (!response.error) {
                $("#modal-patient-file-upload").modal("hide");
                $("#form_patient_file_upload")[0].reset();
                $("#patient_records_submit_btn").html("Upload");
                swal({
                    title: "Saved",
                    text: "File saved successfuly",
                    type: "success",
                    timer: 3000,
                    showConfirmButton: true,
                    showCancelButton: true,
                });
            } else {
                $.toast({
                    heading: "Error",
                    text: "Something went wrong while saving your file. Please try again",
                    position: 'bottom-right',
                    showHideTransition: 'slide',
                    timer: 3000,
                });
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
});