$(document).ready(function () {

    //Initialize Select2 Elements
    $('.select2').select2();


    $('#prescriptionModal').modalSteps();

    $('#patientId').val(localStorage.getItem("pat_id"));
    var patientId = $('#patientId').val();
    var doctorId = $('#doctorId').val();
    var doctorPostId = $('#doctorPostId').val();

    var aff = $('#aff').val();
    var role = $('#role').val();

    $.ajax({
        url: "operation/getPatientProfile.php",
        method: "POST",
        data: { patientId: patientId, doctorId: doctorId },
        dataType: "json",
        success: function (data) {
            $('#p_email').html(data.patient_email);
            $('#p_phone').html(data.patient_phone);
            $('#p_name').html(data.patient_name);
            $('#patientEmail').val(data.patient_email);
            $('#patientEmailId').val(data.patient_email);

            var check = data.shared_data; //shared_with according to appointment
            var docid = data.worker_data; //worker
            var doctor = data.doctor; //logged in doctor

            // get patient's file uploads
            $.ajax({
                url: `operation/getPatientFiles.php?doctor_id=${doctorId}&patient_email=${data.patient_email}`,
                method: "GET",
                dataType: "json",
                success: function (response) {
                    const file_extensions_type_map = { jpeg: "images", png: "images", jpg: "images", gif: "images", pdf: "documents", txt: "documents", doc: "documents", docx: "documents" };
                    let file_uploads_table_data = [];
                    for (const upload_index in response) {
                        if (Object.hasOwnProperty.call(response, upload_index)) {
                            const upload_data = response[upload_index],
                                upload_date = upload_data.date_created ? upload_data.date_created.split("-").reverse().join("/") : upload_data.date_added.split(" ").shift().split("-").reverse().join("/"),

                                open_file_btn = `
                                    <span class="open_file label label-sm" data-upload = "${upload_data.upload_id}" data-file_type="${file_extensions_type_map[upload_data.file_extension]}" title="Open file" style="background-color:#fff !important; color:#000; cursor: pointer">
                                        <i class="fa fa-eye"></i> View
                                    </span>`,

                                delete_file_btn = `
                                    <span class="delete_file label label-sm btn-danger" data-upload = "${upload_data.upload_id}" data-file_type="${file_extensions_type_map[upload_data.file_extension]}" data-extension = ${upload_data.file_extension} data-timestamp = ${upload_data.upload_timestamp} data-upload_title="${upload_data.upload_title}" title="Open file" style="color:#fff; cursor:pointer">
                                        <i class="fa fa-trash"></i> Delete
                                    </span>`,

                                action_button = `
                                    <div class="btn-group">
                                        <button class="btn btn-xs gray-bgcolor dropdown-toggle no-margin" type="button" data-toggle="dropdown" aria-expanded="false">
                                            Actions <i class="fa fa-angle-down"></i>
                                        </button>
                                        <ul class="dropdown-menu pull-left" role="menu" x-placement="bottom-start" style="position: absolute; transform: translate3d(0px, 23px, 0px); top: 0px; left: 0px; will-change: transform;">
                                            <li style="margin:10px">
                                                ${open_file_btn}
                                            </li>
                                            <li style="margin:10px;">
                                                ${delete_file_btn}
                                            </li>
                                        </ul>
                                    </div>`

                            file_uploads_table_data.unshift([upload_data.upload_title, upload_date, upload_data.file_category, action_button]);
                        }
                    }
                    $("#patient_files_table").DataTable({
                        data: file_uploads_table_data,
                        "pageLength": 5,
                        'paging': true,
                        'lengthChange': false,
                        'searching': true,
                        'ordering': false,
                        'info': false,
                        'autoWidth': false,
                        "language": {
                            "emptyTable": `No uploaded files found.`,
                            "zeroRecords": `No uploaded files found.`
                        },
                    });
                },
                error: function (error) {
                    $.toast({
                        heading: 'Error',
                        text: "Something went wrong while fetching the patient's file uploads. Please refresh the page and try again",
                        icon: 'error',
                        position: 'bottom-right',
                        showHideTransition: 'slide'
                    });
                }
            });
        }

    });

    $('#appointmentHistory').DataTable({
        "ajax": {
            data: { patientId: patientId, doctorId: doctorId, aff: aff, role: role },
            url: "operation/getPatientAppointmentHistory.php",
            type: "POST"
        },
        responsive: {
            details: {
                type: 'inline',
                target: 0
            }
        },
        columnDefs: [{
            className: 'control',
            orderable: true,
            targets: 0
        }],
        'pageLength': 5,
    });

    $('#patientPrescription').DataTable({
        'paging': true,
        'lengthChange': false,
        'pageLength': 10,
        'searching': false,
        'ordering': true,
        'info': true,
        'autoWidth': false,
        "language": {
            "emptyTable": "No data available in table",
            "zeroRecords": "No matching records found"
        },
        "ajax": {
            data: { patientId: patientId, doctorPostId: doctorPostId, aff: aff, role: role },
            url: "operation/getPatientPrescription.php",
            type: "POST"
        },
        responsive: {
            details: {
                type: 'inline',
                target: 0
            }
        },
        columnDefs: [{
            className: 'control',
            orderable: true,
            targets: 0
        }],
        // aoColumns: [
        //     { sWidth: '30%' },
        //     { sWidth: '30%' },
        //     { sWidth: '15%' },
        //     { sWidth: '15%' }
        // ]
    });

    $('#doctorNotes').DataTable({
        'paging': true,
        'lengthChange': false,
        'pageLength': 10,
        'searching': false,
        'ordering': true,
        'info': true,
        'autoWidth': false,
        "language": {
            "emptyTable": "No data available in table",
            "zeroRecords": "No matching records found"
        },
        "ajax": {
            data: { patientId: patientId, doctorPostId: doctorPostId },
            url: "operation/getDoctorPatientNotes.php",
            type: "POST"
        },
        responsive: {
            details: {
                type: 'inline',
                target: 0
            }
        },
        columnDefs: [{
            className: 'control',
            orderable: true,
            targets: 0
        }],
    });

    $('#Diagnostic_Results').DataTable({
        'paging': true,
        'lengthChange': false,
        'pageLength': 10,
        'searching': false,
        'ordering': true,
        'info': true,
        'autoWidth': false,
        "language": {
            "emptyTable": "No data available in table",
            "zeroRecords": "No matching records found"
        },
        "ajax": {
            data: { patientId: patientId, doctorId: doctorId },
            url: "operation/getDoctorPatientDiagnostics.php",
            type: "POST"
        },
        aoColumns: [
            { sWidth: '20%' },
            { sWidth: '35%' },
            { sWidth: '35%' },
            { sWidth: '10%' }
        ]
    });

    $.ajax({
        url: "operation/getMyReferralDoctors.php",
        method: "POST",
        data: { doctorPostId: doctorPostId },
        dataType: "json",
        success: function (response) {
            var len = response.length;
            $("#referral_doctor").attr('disabled', false);
            for (var i = 0; i < len; i++) {
                var val = response[i]['dr_post_id'];
                var name = response[i]['name'];
                $("#referral_doctor").append("<option value='" + val + "'>" + name + "</option>");
            }
        }

    });

    //View prescription modal
    $(document).on('click', '.view_prescription', function () {
        var prescriptionNo = $(this).attr("id");
        $.ajax({
            url: "operation/getPrescriptionDetails.php",
            method: "POST",
            data: { prescriptionNo: prescriptionNo },
            dataType: "json",
            success: function (data) {
                $('#prescription_details').modal('show');
                $('#prescription_number').html(data.presc_number);
                $('#patient_case_diagnosis').html(data.diagnosis);
                $('#doc_notes').html(data.doc_notes);
                $('#prescription_date').html(data.date_added);
                $('#prescription_validity').html(data.validity);
            }

        });

        $('#prescribedDrugs').DataTable({
            'paging': false,
            'lengthChange': false,
            'searching': false,
            'ordering': false,
            'info': false,
            'autoWidth': false,
            "language": {
                "emptyTable": "No data available in table",
                "zeroRecords": "No matching records found"
            },
            "ajax": {
                data: { prescriptionNo: prescriptionNo },
                url: "operation/getPrescribedDrug.php",
                type: "POST"
            },
            aoColumns: [
                { sWidth: '40%' },
                { sWidth: '30%' },
                { sWidth: '30%' }
            ]
        });

    });

    //View Diagnostic Details
    $(document).on('click', '.view_dg', function () {
        var diagnostic_no = $(this).attr("id");
        $.ajax({
            url: "operation/getview_DgDetails.php",
            method: "POST",
            data: { diagnostic_no: diagnostic_no },
            dataType: "json",
            success: function (data) {
                $('#diagnostic_details').modal('show');
                $('#diagnostic').html(data.diagnostic);
                $('#diagnostic_no').html(data.diagnostic_no);

                $('#test_results').html(data.test_results);
                $('#result_remarks').html(data.result_remarks);
                //$('#viewNoteDate1').html(data.created_at);
            }

        });

    });

    //Open prescription modal loaded with patient data
    $(document).on('click', '#openPrescModal', function () {
        $.ajax({
            url: "operation/getPatientData.php",
            method: "POST",
            data: { patientId: patientId },
            dataType: "json",
            success: function (data) {
                $('#addEPrescriptionModal').modal('show');
                $('#patient_firstname').val(data.first_name);
                $('#patient_lastname').val(data.last_name);
                $('#patient_gender').val(data.gender);
                $('#patient_dob').val(data.dob);
                $('#patient_email').val(data.email);
                $('#patient_phone').val(data.phone);
            }

        });

    });

    //Open referral modal loaded with patient data
    $(document).on('click', '#openReferModal', function () {
        $.ajax({
            url: "operation/getPatientData.php",
            method: "POST",
            data: { patientId: patientId },
            dataType: "json",
            success: function (data) {
                $('#referralModal').modal('show');
                $('#referralModal .modal-title').text("Refer" + ' ' + data.first_name + ' ' + data.last_name);
                $('#referred_patient_firstname').val(data.first_name);
                $('#referred_patient_lastname').val(data.last_name);
                $('#referred_patient_gender').val(data.gender);
                $('#referred_patient_dob').val(data.dob);
                $('#referred_patient_email').val(data.email);
                $('#referred_patient_phone').val(data.phone);
            }

        });

    });

    //Rebook patient for another appointment click
    $(document).on('click', '#openRebookModal', function () {
        $.ajax({
            url: "operation/getPatientData.php",
            method: "POST",
            data: { patientId: patientId },
            dataType: "json",
            success: function (data) {
                $('#rebookingModal').modal('show');
                $('#rebookingModal .modal-title').text("Rebook an appointment for" + ' ' + data.first_name + ' ' + data.last_name);
                $('#p_firstname').val(data.first_name);
                $('#p_last_name').val(data.last_name);
                $('#p_email_address').val(data.email);
                $('#p_phone_number').val(data.phone);
                $('#p_date_of_birth').val(data.dob);
                $('#p_gender').val(data.gender);
            }

        })
    });

    //Open patient share modal loaded with facility doctors
    $(document).on('click', '#openShareRecord', function () {
        var patientId = $('#patientId').val();
        var doctorId = $('#doctorId').val();
        $('#patient_id').val = patientId;
        $.ajax({
            url: "operation/getdoctorslist.php", //switch to get doctor list
            method: "POST",
            data: { doctorId: doctorId, patientId: patientId },
            dataType: "json",
            success: function (result) {
                $('#shareRecordModule').modal('show');
                //               $('.modal-title').text("Refer" + ' ' + data.first_name + ' ' + data.last_name);
                $("#share_doc").empty();
                $.each(result, function (i) {
                    $('#share_doc').append($('<option></option>').attr("value", result[i].id).text(result[i].name));
                });
            }

        });

    });

    //Download prescription 
    $(document).on('click', '.download_prescription', function () {
        var appointmentId = $(this).attr("id");
        window.location.href = 'operation/downloadPrescription.php';

    });

    $('#prescription_details').on('hidden.bs.modal', function () {
        $('#prescribedDrugs').dataTable().fnDestroy();
    });

    $('#addEPrescriptionModal').on('hidden.bs.modal', function () {
        $('#addNewPrescription')[0].reset();
        $('#btnShowReviewDiv').show();
    });

    $('#referralModal').on('hidden.bs.modal', function () {
        $('#referralForm')[0].reset();
        $('#referralModal .modal-title').text('');
    });

    //add prescription modal
    $(document).on('click', '.add_prescription', function () {
        var appointmentId = $(this).attr("id");

        if (document.getElementById('appointment_id')) {
            document.getElementById('appointment_id').value = appointmentId;
        }

        // error-message pop-up when unauthorized user try to make prescription
        $.ajax({
            url: "operation/getDoctorPrescriptionAuthorizationStatus.php",
            method: 'POST',
            data: { appointmentId: appointmentId },
            dataType: "json",
            success: function (data) {
                if (data == "unauthorized") {
                    $('#addPrescription .modal-body').html('<div class="prescription-unauthorized d-flex align-items-center justify-content-center m-3"> <span class = "d-flex justify-content-center align-items-center flex-column flex-md-row"> <!--<i class = "fa fa-exclamation-circle mb-4 mb-md-0" style = "font-size: 2.5em"></i>--><span class="ml-md-3 p-5">Kindly note that the e-Prescription feature has not been activated for your account. To activate this, please contact your Business Development Executive or <a class="text-light" href="mailto:support@myhealthafrica.com">support@myhealthafrica.com.</a> Please note this feature is only accessible if you are a registered medical professional legally allowed to prescribe medication in your country. <br><br>There are a number of benefits for activating this feature which include:<br><ul><li>Save time - it takes less time to send an e-Prescription than to find your prescription pad, write the prescription and give it to your patient. Quickly fill in the e-Prescription fields and send a professional e-Prescription in seconds.</li><li> Keep a secure record of all prescriptions.</li><li>Increase patient safety and reduce errors when writing prescriptions.</li><li>Reconcile medication history quickly for any patient.</li> <li>Reduce lost prescriptions for your patients, as all e-Prescriptions are sent to the patients email.</li> <li>Spend less time on prescription refills.</li> <li>Provide a better experience to your patients and allow them to easily order medication online.</li> </ul></span> </span> </div>');
                    $('#prescriptionModal .modal-title').text('e-Prescription Form').removeClass('js-title-step');
                }
            }

        });

        $('#prescriptionModal').modal('show');
    });

    //que to diagnostics modal
    $(document).on('click', '.diagnostic', function () {
        var appointment_id = $(this).attr("id");
        $('#qtdappointment_id').val(appointment_id);
        $('#diagnosticque').modal('show');
        $('#pp-sendiagnosis').html('Send To Diagnostics').prop('disabled', false);
        $(this).attr('data-appt_id', appointment_id);

    });

    //add case notes modal
    $(document).on('click', '.add_casenotes', function () {
        var appointmentId = $(this).attr("id");
        
        if ($(this).hasClass("blocked")) {
            $.toast({
                heading: 'Blocked',
                text: 'Only the doctor who saw the patient can edit the case notes.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        }

        $('#addCaseNotes').modal('show');
        $("#addCaseNotes .cn-patient-details-data").text("fetching...");
        $("#newCaseNotes")[0].reset();

        // remove added input fields from DOM
        $(".multiple-inputs-container").each(function (i) {
            let child_inputs = $(this).find(".input-item"),
                child_count = child_inputs.length - 1;
            while (child_count > 0) {
                child_inputs[child_count].remove();
                child_count--;
            }
        });

        $.ajax({
            method: "POST",
            url: "operation/getAppointmentDetails.php",
            data: { appointmentId: appointmentId },
            dataType: "json",
            success: function (response) {

                if (response.error) {
                    $(".cn-patient-details-data").text("Error getting patient data");
                } else {
                    for (const detail in response) {
                        if (Object.hasOwnProperty.call(response, detail)) {
                            const detail_obj = response[detail];
                            if (detail_obj == "") response[detail] = "Data not found";
                        }
                    }
                    $("#addCaseNotes #case-notes-patient-name").text(`${response.first_name} ${response.last_name}`);
                    $("#addCaseNotes #case-notes-patient-email").text(response.email);
                    $("#addCaseNotes #case-notes-patient-tel").text(response.phone);
                    $("#addCaseNotes #case-notes-patient-age").text(response.age);
                    $("#addCaseNotes #case-notes-patient-gender").text(response.gender);
                    $("#addCaseNotes #case-notes-appt-date").text(response.date);
                    $("#addCaseNotes #case-notes-booking-note").text(response.booking_note);
                    $("#newCaseNotes").attr("data-patient_email", response.email);
                }
                $("#newCaseNotes").attr("data-appointment_id", appointmentId);
            },
            error: function (error) {
                $.toast({
                    heading: 'Error',
                    text: 'There was a problem getting appointment data. Please refresh the page and try again.',
                    icon: 'error',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                });
                $(".cn-patient-details-data").text("Error getting patient data");
            }
        });

        // check if there are existing case notes for the appointment and dispalay them also
        $.ajax({
            method: "POST",
            url: `operation/getDoctorNotesDetails.php`,
            dataType: "json",
            data: { "noteId": appointmentId, "column": "appointment_id" },
            success: function (response) {
                for (const key in response) {
                    if (Object.hasOwnProperty.call(response, key)) {
                        const case_data = response[key];
                        if (!case_data) continue;
                        switch (key) {
                            case "id":
                                $("#save_notes_operation").val("update"); // add note id to submit button
                                $("#save_notes_note_id").val(case_data); // add note id to submit button
                                break;
                            case 'patient_handedness':
                                $("#handedness").val(case_data);
                                break;
                            case "patient_occupation":
                                $("#patient_occupation").val(case_data);
                                break;
                            case "drug_use_history":
                                let drugs = case_data;
                                const first_drug = drugs.shift();
                                $("#drug_use_history .input-item:first-child input").val(first_drug.value).attr("data-meta_id", first_drug.id);
                                drugs.forEach(drug => {
                                    $("#drug_use_history").append(input_item(drug.value, drug.id));
                                });
                                break;
                            case "underlying_conditions":
                                let underlying_conditions = case_data;
                                const first_inderlying = underlying_conditions.shift();
                                $("#underlying_conditions .input-item:first-child input").val(first_inderlying.value).attr("data-meta_id", first_inderlying.id);
                                underlying_conditions.forEach(underlying_condition => {
                                    $("#underlying_conditions").append(input_item(underlying_condition.value, underlying_condition.id));
                                });
                                break;
                            case "chronic_illnesses":
                                let chronic_conditions = case_data;
                                const first_chronic = chronic_conditions.shift();
                                $("#chronic_conditions .input-item:first-child input").val(first_chronic.value).attr("data-meta_id", first_chronic.id);
                                chronic_conditions.forEach(chronic_condition => {
                                    $("#chronic_conditions").append(input_item(chronic_condition.value, chronic_condition.id));
                                });
                                break;
                            case "medical_history":
                                let medical_history = case_data;
                                const first_history = medical_history.shift();
                                $("#medical_history .input-item:first-child input").val(first_history.value).attr("data-meta_id", first_history.id);
                                medical_history.forEach(history_entry => {
                                    $("#medical_history").append(input_item(history_entry.value, history_entry.id));
                                });
                                break;
                            case "reasons_for_consultation":
                                let reasons_for_consultation = case_data;
                                const first_reason = reasons_for_consultation.shift();
                                $("#reasons_for_consultation .input-item:first-child input").val(first_reason.value).attr("data-meta_id", first_reason.id);
                                reasons_for_consultation.forEach(reason => {
                                    $("#reasons_for_consultation").append(input_item(reason.value, reason.id));
                                });
                                break;
                            case "clinical_examinations":
                                let clinical_examinations = case_data;
                                const first_examination = clinical_examinations.shift();
                                $("#clinical_examinations .input-item:first-child input").val(first_examination.value).attr("data-meta_id", first_examination.id);
                                clinical_examinations.forEach(examination => {
                                    $("#clinical_examinations").append(input_item(examination.value, examination.id));
                                });
                                break;
                            case "doctor_notes":
                                $("#conclusion").val(case_data.join(".\n")).attr("rows", case_data.length);
                                break;
                            case "recommendations":
                                let recommendations = case_data;
                                const first_recommendation = recommendations.shift();
                                $("#recommendations .input-item:first-child input").val(first_recommendation.value).attr("data-meta_id", first_recommendation.id);
                                recommendations.forEach(recommendation => {
                                    $("#recommendations").append(input_item(recommendation.value, recommendation.id));
                                });
                                break;
                            case "date_of_next_visit":
                                $("#next_visit_date").val(case_data);
                                break;
                            case "file_attachments":
                                let file_attachments = case_data;

                                file_attachments.forEach(file_attachment => {
                                    $("#cn-attached-files").append(input_item(file_attachment.value, file_attachment.id, "true", "readonly"));
                                });
                                break;
                            default:
                                break;
                        }
                    }
                }
            },
            error: function (error) {
                $.toast({
                    heading: 'Error',
                    text: 'Something went wrong while fetching case note data. Please refresh the page and try again',
                    icon: 'error',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
            }
        });
    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("valid_until").setAttribute("min", today);

    //Submitting prescription form
    $(document).on('submit', '#addPrescription', function (event) {
        event.preventDefault();
        var prescValidity = $('#valid_until').val();
        var prescDrugOne = $('#drug_name1').val();
        var prescDosageOne = $('#dosage1').val();
        var prescDrugRemarksOne = $('#drug_remarks1').val();
        var doctorPostId = $('#doctorPostId').val();
        var appointment_id = $('#appointment_id').val();

        if (prescDrugOne !== '' && prescDosageOne !== '' && prescDrugRemarksOne !== '' && prescValidity !== '') {
            $.ajax({
                url: "operation/storePatientPrescription.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'e-Prescription has been successfully added',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                        var doc = $('#doctorPostId').val();
                        var appt = $('#appointment_id').val();
                        $.ajax({
                            url: "operation/patientPrescription.php",
                            method: 'POST',
                            data: { doctorPostId: doc, appointment_id: appt },
                            dataType: "json",
                            success: function (data) {
                                if (data == 200) {
                                    $.toast({
                                        heading: 'Success',
                                        text: 'An e-Prescription pdf document has been sent to patient email, the patient will receive it in a moment.',
                                        icon: 'success',
                                        position: 'bottom-right',
                                        showHideTransition: 'slide'
                                    })
                                }
                            }
                        });
                        $('#addPrescription')[0].reset();
                        $('#prescriptionModal').modal('hide');
                        $('#patientPrescription').DataTable().ajax.reload();
                        $('#appointmentHistory').DataTable().ajax.reload();
                    } else if (data == 403) { //error when unauthorized user tries to make prescription
                        $.toast({
                            heading: 'Error',
                            text: 'This account is not authorized to make prescriptions.',
                            icon: 'error',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })

                    } else if (data == 700) {
                        $.toast({
                            heading: 'Error',
                            text: 'You have not fully filled the prescription form.',
                            icon: 'error',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                    } else {
                        $.toast({
                            heading: 'Error',
                            text: 'Something went wrong, please try again.',
                            icon: 'error',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                    }
                }
            });
        } else {
            $.toast({
                heading: 'Warning',
                text: 'Kindly fill atleast one drug prescription ie drug name, dosage and remarks.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }

    });

    //Submitting referral form
    $(document).on('submit', '#referralForm', function (event) {
        event.preventDefault();
        var reason = $('#referral_reason').val();
        var recipient = $('#referral_doctor').val();
        var case_desc = $('#referral_case_description').val();

        if (reason !== '' && recipient !== '' && case_desc !== '') {
            $.ajax({
                url: "operation/addPatientReferral.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Referral has been successfully sent',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        });
                        $('#referral_case_description')[0].reset();
                        $('#referralModal').modal('hide');
                    } else {
                        $.toast({
                            heading: 'Error',
                            text: 'Something went wrong, please try again.',
                            icon: 'error',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                    }
                }
            });
        } else {
            $.toast({
                heading: 'Warning',
                text: 'Kindly fill all the fields and try again.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }

    });

});


//Submitting share patient records form
$(document).ready(function () {
    $(document).on('submit', '#shareRecordForm', function (event) {
        event.preventDefault();
        var patientId = $('#patientId').val();
        var doctorId = $('#doctorId').val();
        var selectedDoc = $('#share_doc').val();

        if (doctorId !== '' && patientId !== '') {
            $.ajax({
                url: "operation/sharepatientrecords.php",
                method: 'POST',
                data: { doctorId: doctorId, patientId: patientId, selectedDoc: selectedDoc },
                dataType: "json",
                success: function (response) {
                    if (response == 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Patient Record has been successfully shared',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        });
                        $('#shareRecordModule').modal('hide');
                        $("#share_doc").empty();
                        setTimeout(function () {
                            window.location.reload(1);
                        }, 3000);
                    } else {
                        $.toast({
                            heading: 'Error',
                            text: 'Something went wrong, please try again.',
                            icon: 'error',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                    }
                }
            });
        } else {
            $.toast({
                heading: 'Warning',
                text: 'Kindly fill all the fields and try again.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }

    });

});

//send patient prescription to pharmacy
$(document).on('click', '.send_pharmacy', function () {
    var Prescriptionid = $(this).attr("id");
    //var doctorId = $('#doctorId').val();
    // var doctorName = $('#docName').val();
    // var doctorEmail = $('#docEmail').val();
    swal({
        title: "Are you sure?",
        text: "You are about to share this prescription with the pharmacy department. ",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#169815",
        confirmButtonText: "Yes",
        cancelButtonText: "No, Don't Share",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function (isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: "operation/sendPrescriptionToPharmacy.php",
                method: "POST",
                data: { Prescriptionid: Prescriptionid },
                dataType: "json",
                success: function (data) {
                    if (data == 200) {
                        swal({
                            title: "Sent",
                            text: "Prescription Successfully Sent To The Pharmacy",
                            type: "success",
                            timer: 4000,
                            showConfirmButton: false
                        });
                        $('#patientPrescription').DataTable().ajax.reload();
                    } else if (data == 700) {
                        swal({
                            title: "Warning",
                            text: "Sorry, The prescription has already been shared with the pharmacy!",
                            type: "warning",
                            timer: 8000,
                            showConfirmButton: false
                        });
                    } else {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 4000,
                            showConfirmButton: false
                        });
                    }

                }

            })
        }
    });

});

//Doctor services drop down
$(function () {
    var doctorId = $('#doctorId').val();
    var role = $('#role').val();
    var facility_id = $('#facility_id').val();
    if (role == 'Sec' || role == 'S.Admin' || role == 'Admin') {
        $.ajax({
            url: "operation/getDoctorServices.php",
            method: "POST",
            data: { facility_id: facility_id },
            dataType: "json",
            success: function (result) {
                if (result == 404) {
                    var txt = 'No services found';
                    $("#services_dropdown").attr('disabled', false);
                    $("#services_dropdown").empty();
                    $.each(result, function (i) {
                        $('#services_dropdown').append($('<option></option>').attr("value", '').text(txt));
                    });
                } else {
                    $("#services_dropdown").attr('disabled', false);
                    $("#services_dropdown").empty();
                    $.each(result, function (i) {
                        $('#services_dropdown').append($('<option></option>').attr("value", result[i].service).text(result[i].name));
                    });
                }
            },
            failure: function () {
                alert("Error");
            }
        });
    } else {
        $.ajax({
            url: "operation/getDoctorServices.php",
            method: "POST",
            data: { doctorId: doctorId },
            dataType: "json",
            success: function (result) {
                if (result == 404) {
                    var txt = 'No services found';
                    $("#services_dropdown").attr('disabled', false);
                    $("#services_dropdown").empty();
                    $.each(result, function (i) {
                        $('#services_dropdown').append($('<option></option>').attr("value", '').text(txt));
                    });
                } else {
                    $("#services_dropdown").attr('disabled', false);
                    $("#services_dropdown").empty();
                    $.each(result, function (i) {
                        $('#services_dropdown').append($('<option></option>').attr("value", result[i].service).text(result[i].name));
                    });
                }
            },
            failure: function () {
                alert("Error");
            }
        });
    }
});

//Doctors drop down
$(document).ready(function () {
    $("#services_dropdown").change(function () {
        var doctorId = $('#doctorId').val();
        var selectedService = $(this).val();
        var facility_id = $('#userfacility').val();
        var role = $('#role').val();
        $.ajax({
            url: "operation/getFilteredDoctorLocation.php",
            method: "POST",
            data: { doctorId: doctorId, selectedService: selectedService },
            dataType: "json",
            success: function (response) {
                var len = response.length;
                $("#locations_dropdown").empty();
                for (var i = 0; i < len; i++) {
                    var val = response[i]['location'];
                    var name = response[i]['name'];
                    $("#locations_dropdown").append("<option value='" + val + "'>" + name + "</option>");
                }
            }
        });
        $.ajax({
            url: "operation/getFacilityDoctors.php",
            method: "POST",
            data: { facility_id: facility_id, doctorId: doctorId, selectedService: selectedService, role: role },
            dataType: "json",
            success: function (result) {
                if (result == 404) {
                    var txt = 'No doctor found for the selected service';
                    $("#facility_doctors_dropdown").attr('disabled', false);
                    $("#facility_doctors_dropdown").empty();
                    $.each(result, function (i) {
                        $('#facility_doctors_dropdown').append($('<option></option>').attr("value", '').text(txt));
                    });
                } else {
                    $("#facility_doctors_dropdown").attr('disabled', false);
                    $("#facility_doctors_dropdown").empty();
                    $.each(result, function (i) {
                        $('#facility_doctors_dropdown').append($('<option></option>').attr("value", result[i].id).text(result[i].name));
                    });
                }
            },
            failure: function () {
                alert("Error");
            }
        });
    });
});

//Locations drop down
$(function () {
    var doctorId = $('#doctorId').val();
    $.ajax({
        url: "operation/getDoctorLocations.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function (result) {
            $("#locations_dropdown").attr('disabled', false);
            $.each(result, function (i) {
                $('#locations_dropdown').append($('<option></option>').attr("value", result[i].location).text(result[i].name));
            });
        },
        failure: function () {
            alert("Error");
        }
    });
});

$(function () {
    $('#rebookingDatepicker').datepicker({
        minDate: new Date(),
        firstDay: 1,
        dateFormat: 'yy-mm-dd',
        yearRange: "-0:+1",
        maxDate: '+12m',
        inline: true,
    });
});

$(document).ready(function () {

    $("#rebookingDatepicker").change(function () {
        var doctorId = $('#facility_doctors_dropdown').val();
        var chosenDate = $(this).val();
        var serviceId = $('#services_dropdown').val();
        document.getElementById('rebookedDate').value = chosenDate;
        if (serviceId !== '' && doctorId !== '') {
            $.ajax({
                url: "operation/getDoctorTimeSlots.php",
                method: "POST",
                data: { doctorId: doctorId, chosenDate: chosenDate, serviceId: serviceId },
                dataType: "json",
                success: function (result) {
                    if (result == 500) {
                        var message = 'No availability, please select another day.';
                        $("#shedulerTimePickerRebookAppoinment").empty();
                        $("#shedulerTimePickerRebookAppoinment").append("<option class='btn-error' >" + message + "</option>");

                    } else {
                        var len = result.length;
                        $("#shedulerTimePickerRebookAppoinment").empty();
                        $.each(result, function (key, value) {
                            $('#shedulerTimePickerRebookAppoinment').append($('<option class="btn-circle btn btn-slot"></option>').text(value));
                        });
                    }
                }
            });
        } else {
            $.toast({
                heading: 'Warning',
                text: 'Select service to proceed.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }

    });

});

//Rebook patient for another appointment form
$(document).on('submit', '#rebookingForm', function (event) {
    event.preventDefault();
    $("#rebookingForm [type='submit']").prop("disabled", true).html('<strong>Saving...&nbsp;&nbsp;</strong> <div class="loader" role="status"></div>')
    var doctorId = $('#facility_doctors_dropdown').val();
    var appointmentStartTime = $('#shedulerTimePickerRebookAppoinment').val();
    var appointmentDate = $('#rebookedDate').val();
    var doctorName = $('#docName').val();
    var doctorEmail = $('#docEmail').val();
    var docLocation = $('#locations_dropdown').val();
    var docService = $('#services_dropdown').val();
    var patientGender = $('#p_gender').val();
    var patientDateOfBirth = $('#p_date_of_birth').val();
    var patientEmail = $('#p_email_address').val();
    var patientFirstName = $('#patient_firstname').val();
    var patientLastName = $('#patient_lastname').val();
    var patientPhoneNumber = $('#phone_number').val();
    var facility_id = $('#facility_id').val();
    var paymentMode = $('#payment').val();
    var bookingNote = $('#rebooking_note').val();
    var operation = $('#operation').val('appointmentRebooking');
    $("#appointment_id").val(localStorage.getItem(`pat_id`));

    if (doctorId !== '' && appointmentStartTime !== '' && appointmentDate !== '' && docLocation !== '' && docService !== '' && bookingNote !== '' && paymentMode !== '') {
        $.ajax({
            url: "operation/addRescheduleBooking.php",
            method: 'POST',
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function (data) {
                if (data == 200) {
                    $('#rebookingForm')[0].reset();
                    $('#rebookingModal').modal('hide');
                    swal({
                        title: "Rebooked",
                        text: "You have successfully rebooked this patient, check your upcoming appointments",
                        type: "success",
                        timer: 5000,
                        showConfirmButton: false
                    });

                    // call to patient experience event handler after appointment has been successfuly saved
                    $.ajax({
                        url: "../../patientexperience/operation/oneMedProEventHandlers.php",
                        method: "POST",
                        data: { trigger: 'pending', facility_id: facility_id, token: csrf_token }
                    });
                } else if (data == 500) {
                    swal({
                        title: "Error",
                        text: "Something went wrong, please try again.",
                        type: "error",
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
                $("#rebookingForm [type='submit']").prop("disabled", false).html("Rebook patient");
            }
        });
    } else {
        $.toast({
            heading: 'Warning',
            text: 'Please fill all the mandory fields.',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});

$(document).ready(function () {
    $('#patientCaseReview').hide();
    $('#patientCaseDiagnosis').hide();

    $(document).on('click', '#btnShowReview', function () {
        $('#patientCaseReview').slideToggle("slow");
        $('#patientCaseDiagnosis').slideToggle("slow");
    });

    $('#addPrescForm2').hide();
    $('#addPrescForm3').hide();
    $('#addPrescForm4').hide();
    $('#addPrescForm5').hide();
    $('#addPrescForm6').hide();
    $('#addPrescForm7').hide();
    $('#addPrescForm8').hide();
    $('.btnShowPrescForm3').hide();
    $('.btnShowPrescForm4').hide();
    $('.btnShowPrescForm5').hide();
    $('.btnShowPrescForm6').hide();
    $('.btnShowPrescForm7').hide();
    $('.btnShowPrescForm8').hide();

    $('#no2').hide();
    $('#no3').hide();
    $('#no4').hide();
    $('#no5').hide();
    $('#no6').hide();
    $('#no7').hide();
    $('#no8').hide();

    $('#confirm_drug_name2').hide();
    $('#confirm_drug_name3').hide();
    $('#confirm_drug_name4').hide();
    $('#confirm_drug_name5').hide();
    $('#confirm_drug_name6').hide();
    $('#confirm_drug_name7').hide();
    $('#confirm_drug_name8').hide();

    $('#confirm_dosage2').hide();
    $('#confirm_dosage3').hide();
    $('#confirm_dosage4').hide();
    $('#confirm_dosage5').hide();
    $('#confirm_dosage6').hide();
    $('#confirm_dosage7').hide();
    $('#confirm_dosage8').hide();

    $('#confirm_drug_remarks2').hide();
    $('#confirm_drug_remarks3').hide();
    $('#confirm_drug_remarks4').hide();
    $('#confirm_drug_remarks5').hide();
    $('#confirm_drug_remarks6').hide();
    $('#confirm_drug_remarks7').hide();
    $('#confirm_drug_remarks8').hide();

    var btnNext = $(".btn-next");
    $(btnNext).click(function () {
        var valid_until = $('#valid_until').val();

        var drug1 = $('#drug_name1').val();
        var drug2 = $('#drug_name2').val();
        var drug3 = $('#drug_name3').val();
        var drug4 = $('#drug_name4').val();
        var drug5 = $('#drug_name5').val();
        var drug6 = $('#drug_name6').val();
        var drug7 = $('#drug_name7').val();
        var drug8 = $('#drug_name8').val();

        var dosage1 = $('#dosage1').val();
        var dosage2 = $('#dosage2').val();
        var dosage3 = $('#dosage3').val();
        var dosage4 = $('#dosage4').val();
        var dosage5 = $('#dosage5').val();
        var dosage6 = $('#dosage6').val();
        var dosage7 = $('#dosage7').val();
        var dosage8 = $('#dosage8').val();

        var drug_remarks1 = $('#drug_remarks1').val();
        var drug_remarks2 = $('#drug_remarks2').val();
        var drug_remarks3 = $('#drug_remarks3').val();
        var drug_remarks4 = $('#drug_remarks4').val();
        var drug_remarks5 = $('#drug_remarks5').val();
        var drug_remarks6 = $('#drug_remarks6').val();
        var drug_remarks7 = $('#drug_remarks7').val();
        var drug_remarks8 = $('#drug_remarks8').val();

        document.getElementById('confirm_drug_name1').innerHTML = drug1;
        document.getElementById('confirm_drug_name2').innerHTML = drug2;
        document.getElementById('confirm_drug_name3').innerHTML = drug3;
        document.getElementById('confirm_drug_name4').innerHTML = drug4;
        document.getElementById('confirm_drug_name5').innerHTML = drug5;
        document.getElementById('confirm_drug_name6').innerHTML = drug6;
        document.getElementById('confirm_drug_name7').innerHTML = drug7;
        document.getElementById('confirm_drug_name8').innerHTML = drug8;

        document.getElementById('confirm_dosage1').innerHTML = dosage1;
        document.getElementById('confirm_dosage2').innerHTML = dosage2;
        document.getElementById('confirm_dosage3').innerHTML = dosage3;
        document.getElementById('confirm_dosage4').innerHTML = dosage4;
        document.getElementById('confirm_dosage5').innerHTML = dosage5;
        document.getElementById('confirm_dosage6').innerHTML = dosage6;
        document.getElementById('confirm_dosage7').innerHTML = dosage7;
        document.getElementById('confirm_dosage8').innerHTML = dosage8;

        document.getElementById('confirm_drug_remarks1').innerHTML = drug_remarks1;
        document.getElementById('confirm_drug_remarks2').innerHTML = drug_remarks2;
        document.getElementById('confirm_drug_remarks3').innerHTML = drug_remarks3;
        document.getElementById('confirm_drug_remarks4').innerHTML = drug_remarks4;
        document.getElementById('confirm_drug_remarks5').innerHTML = drug_remarks5;
        document.getElementById('confirm_drug_remarks6').innerHTML = drug_remarks6;
        document.getElementById('confirm_drug_remarks7').innerHTML = drug_remarks7;
        document.getElementById('confirm_drug_remarks8').innerHTML = drug_remarks8;
        document.getElementById('confirm_valid_until').innerHTML = valid_until;

        if ($('#drug_name1').val() != '') {
            $('#confirm_drug_name1').show();
            $('#confirm_dosage1').show();
            $('#confirm_drug_remarks1').show();
            $('#no1').show();
        }
        if ($('#drug_name2').val() != '') {
            $('#confirm_drug_name2').show();
            $('#confirm_dosage2').show();
            $('#confirm_drug_remarks2').show();
            $('#no2').show();
        }
        if ($('#drug_name3').val() != '') {
            $('#confirm_drug_name3').show();
            $('#confirm_dosage3').show();
            $('#confirm_drug_remarks3').show();
            $('#no3').show();
        }
        if ($('#drug_name4').val() != '') {
            $('#confirm_drug_name4').show();
            $('#confirm_dosage4').show();
            $('#confirm_drug_remarks4').show();
            $('#no4').show();
        }
        if ($('#drug_name5').val() != '') {
            $('#confirm_drug_name5').show();
            $('#confirm_dosage5').show();
            $('#confirm_drug_remarks5').show();
            $('#no5').show();
        }
        if ($('#drug_name6').val() != '') {
            $('#confirm_drug_name6').show();
            $('#confirm_dosage6').show();
            $('#confirm_drug_remarks6').show();
            $('#no6').show();
        }
        if ($('#drug_name7').val() != '') {
            $('#confirm_drug_name7').show();
            $('#confirm_dosage7').show();
            $('#confirm_drug_remarks7').show();
            $('#no7').show();
        }
        if ($('#drug_name8').val() != '') {
            $('#confirm_drug_name8').show();
            $('#confirm_dosage8').show();
            $('#confirm_drug_remarks8').show();
            $('#no8').show();
        }

    });

    var add_button2 = $(".add_prescform2");
    var add_button3 = $(".add_prescform3");
    var add_button4 = $(".add_prescform4");
    var add_button5 = $(".add_prescform5");
    var add_button6 = $(".add_prescform6");
    var add_button7 = $(".add_prescform7");
    var add_button8 = $(".add_prescform8");
    $(add_button2).click(function () { //on add input button click
        $('#addPrescForm2').show(1000);
        $('.btnShowPrescForm3').show(1000);

    });
    $(add_button3).click(function () { //on add input button click
        $('#addPrescForm3').show(1000);
        $('.btnShowPrescForm4').show(1000);

    });
    $(add_button4).click(function () { //on add input button click
        $('#addPrescForm4').show(1000);
        $('.btnShowPrescForm5').show(1000);

    });
    $(add_button5).click(function () { //on add input button click
        $('#addPrescForm5').show(1000);
        $('.btnShowPrescForm6').show(1000);

    });
    $(add_button6).click(function () { //on add input button click
        $('#addPrescForm6').show(1000);
        $('.btnShowPrescForm7').show(1000);

    });
    $(add_button7).click(function () { //on add input button click
        $('#addPrescForm7').show(1000);
        $('.btnShowPrescForm8').show(1000);

    });
    $(add_button8).click(function () { //on add input button click
        $('#addPrescForm8').show(1000);

    });
    $('.remove_prescform1').click(function () {
        $('#addPrescForm1').hide(1000);
        $('.btnShowForm2').hide(1000);
        $('input[name=drug_name1').val('');
        $('input[name=dosage1').val('');
        $('input[name=drug_remarks1').val('');
    });
    $('.remove_prescform2').click(function () {
        $('#addPrescForm2').hide(1000);
        $('.btnShowForm3').hide(1000);
        $('input[name=drug_name2').val('');
        $('input[name=dosage2').val('');
        $('input[name=drug_remarks2').val('');
    });
    $('.remove_prescform3').click(function () {
        $('#addPrescForm3').hide(1000);
        $('.btnShowForm4').hide(1000);
        $('input[name=drug_name3').val('');
        $('input[name=dosage3').val('');
        $('input[name=drug_remarks3').val('');
    });
    $('.remove_prescform4').click(function () {
        $('#addPrescForm4').hide(1000);
        $('.btnShowForm5').hide(1000);
        $('input[name=drug_name4').val('');
        $('input[name=dosage4').val('');
        $('input[name=drug_remarks4').val('');
    });
    $('.remove_prescform5').click(function () {
        $('#addPrescForm5').hide(1000);
        $('.btnShowForm6').hide(1000);
        $('input[name=drug_name5').val('');
        $('input[name=dosage5').val('');
        $('input[name=drug_remarks5').val('');
    });
    $('.remove_prescform6').click(function () {
        $('#addPrescForm6').hide(1000);
        $('.btnShowForm7').hide(1000);
        $('input[name=drug_name6').val('');
        $('input[name=dosage6').val('');
        $('input[name=drug_remarks6').val('');
    });
    $('.remove_prescform7').click(function () {
        $('#addPrescForm7').hide(1000);
        $('.btnShowForm8').hide(1000);
        $('input[name=drug_name7').val('');
        $('input[name=dosage7').val('');
        $('input[name=drug_remarks7').val('');
    });
    $('.remove_prescform8').click(function () {
        $('#addPrescForm8').hide(1000);
        $('input[name=drug_name8').val('');
        $('input[name=dosage8').val('');
        $('input[name=drug_remarks8').val('');
    });

    // handlers for control buttons & display in #addNewdiagnostic
    $('.addForm').hide();

    // adding additional forms
    $('.add_form2').click(function () { //on add input button click
        $('.addForm2').show(1000);
    });
    $('.add_form3').click(function () { //on add input button click
        $('.addForm3').show(1000);
    });
    $('.add_form4').click(function () { //on add input button click
        $('.addForm4').show(1000);
    });
    $('.add_form5').click(function () { //on add input button click
        $('.addForm5').show(1000);
    });
    $('.add_form6').click(function () { //on add input button click
        $('.addForm6').show(1000);
    });
    $('.add_form7').click(function () { //on add input button click
        $('.addForm7').show(1000);
    });
    $('.add_form8').click(function () { //on add input button click
        $('.addForm8').show(1000);
    });

    // removing added forms
    $('.remove_form2').click(function () {
        $('.addForm2').hide(1000);
        $('input[name=ediagnostic2').val('');
        $('input[name=edgremarks2').val('');
    });
    $('.remove_form3').click(function () {
        $('.addForm3').hide(1000);
        $('input[name=ediagnostic3').val('');
        $('input[name=edgremarks3').val('');
    });
    $('.remove_form4').click(function () {
        $('.addForm4').hide(1000);
        $('input[name=ediagnostic4').val('');
        $('input[name=edgremarks4').val('');
    });
    $('.remove_form5').click(function () {
        $('.addForm5').hide(1000);
        $('input[name=ediagnostic5').val('');
        $('input[name=edgremarks5').val('');
    });
    $('.remove_form6').click(function () {
        $('.addForm6').hide(1000);
        $('input[name=ediagnostic6').val('');
        $('input[name=edgremarks6').val('');
    });
    $('.remove_form7').click(function () {
        $('.addForm7').hide(1000);
        $('input[name=ediagnostic7').val('');
        $('input[name=edgremarks7').val('');
    });
    $('.remove_form8').click(function () {
        $('.addForm8').hide(1000);
        $('input[name=ediagnostic8').val('');
        $('input[name=edgremarks8').val('');
    });

});

// change #addNewdiagnostic submit button to loader after it's clicked once
$('#pp-sendiagnosis').on('click', function () {
    $('#addNewdiagnostic').submit();
    $(this).prop('disabled', true).html(' <strong>Saving...&nbsp;&nbsp;</strong> <div class="loader" role="status"></div>');

    setTimeout(function () {
        $('#pp-sendiagnosis').html('Send to Diagnostics').prop('disabled', false);
    }, 2000);
});

// change #addPrescription submit button to loader after it's clicked once
$('#confirmPresc').on('click', function () {
    $('#addPrescription').submit();
    $(this).prop('disabled', true).html(' <strong>Saving...&nbsp;&nbsp;</strong> <div class="loader" role="status"></div>');

    setTimeout(function () {
        $('#confirmPresc').html('Confirm').prop('disabled', false);
    }, 2000);
});

// change referral button to loader after it's clicked once
$('#referralForm [type="submit"]').on("click", function () {
    $('#referralForm').submit();

    $(this).prop('disabled', true).html(' <strong>Saving...&nbsp;&nbsp;</strong> <div class="loader" role="status"></div>');

    setTimeout(function () {
        $('#referralForm [type="submit"]').html('Request Referral').prop('disabled', false);
    }, 2000);
});

// combined handlers for deleting and viewing uploaded files
$(document).on("click", ".open_file, .delete_file", function () {
    const file_type = $(this).attr("data-file_type"),
        upload_id = $(this).attr("data-upload");

    if ($(this).hasClass("open_file")) {
        window.open(`view-patient-file?fid=${upload_id}&type=${file_type}&token=${csrf_token}`);
    } else {
        const upload_data = $(this)[0].dataset,
            file_type = upload_data.file_type,
            timestamp = upload_data.timestamp,
            extension = upload_data.extension,
            patient_email = $("#p_email").text();

        swal({
            title: "Confirm",
            text: "Proceed to delete this file? This action is not reversible, and the file will be gone forever.",
            type: "warning",
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: "Close",
            confirmButtonText: "Delete",
            confirmButtonColor: "#BE8E79"
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: "operation/deleteUploadedFile.php",
                    method: "POST",
                    data: { token: csrf_token, upload_id: upload_id, patient_email: patient_email, file_type: file_type, timestamp: timestamp, ext: extension },
                    dataType: "json",
                    success: function (response) {
                        if (!response.error) {
                            swal({
                                title: "Deleted",
                                text: "File deleted successfuly",
                                type: "success",
                                timer: 3000,
                                showConfirmButton: false,
                                showCancelButton: true,
                                cancelButtonText: "Close"
                            }, function (isConfirm) {
                                location.reload();
                            });
                        } else {
                            $.toast({
                                heading: "Error",
                                text: "Something went wrong while deleting your file. Please try again",
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
            } else {
                return false;
            }
        });
    }
});

const input_item = (value = "", meta_id = "", is_file = "", readonly = "") =>
    `<div class="input-item">
        <div class="d-flex align-items-end">
            <input type="text" class="form-control border-bottom-only"
                placeholder="type here" value = "${value}" data-meta_id = "${meta_id}" ${readonly} required>
            <span class="cn-remove-input" data-is_file = "${is_file}" title="Remove">&times;</span>
        </div>
    </div>`;

$(document).on("click", ".cn-add-input", function () {
    $(this).siblings(".multiple-inputs-container").append(input_item());
});

$(document).on("click", ".cn-remove-input", function () {
    let parent_container = $(this).closest(".multiple-inputs-container");

    if (parent_container.find(".input-item").length > 1 || $(this).attr("data-is_file") == "true") {
        const meta_id = $(this).siblings("input").attr("data-meta_id");
        if (meta_id) {
            $.ajax({
                method: "POST",
                url: "operation/deleteNoteMeta.php",
                data: { "meta_id": meta_id, "token": csrf_token },
                error: function (error) {
                    console.log(error);
                }
            });
        }

        if ($(this).attr("data-is_file") == "true") {
            const patient_email = $("#newCaseNotes").attr("data-patient_email"),
                appointment_id = $("#newCaseNotes").attr("data-appointment_id"),
                file_name = $(this).siblings("input")[0].value;

            $.ajax({
                method: "POST",
                url: "operation/deleteCaseNotesAttachment.php",
                data: { "token": csrf_token, "patient_email": patient_email, "appointment_id": appointment_id, "file_name": file_name },
            });
            $(this).closest(".input-item").remove();
        }

        $(this).closest(".input-item").remove();
    }
});

// submitting case notes
$(document).on("click", "#save_case_notes", function (event) {
    /**
     * perform validation of fields
     * 
     * get all reasons for consultation
     * get all allergies
     * get all conditions
     * get all recommendations
     * get all drug usage
     * get all medical history
     * get all clinical examinations
     * get all file attachments
     * 
     * send entered data to server
     */
    event.preventDefault();

    $("#save_case_notes").html('<strong>Saving...&nbsp;&nbsp;</strong> <div class="loader" role="status"></div>').prop("disabled", true);

    let reasons_for_consultation = [],
        underlying_conditions = [],
        chronic_conditions = [],
        recommendations = [],
        drug_use_history = [],
        medical_history = [],
        clinical_examinations = [];

    $("#reasons_for_consultation input").each(function (i) {
        if ($(this).val().length > 0) {
            if ($(this).attr("data-meta_id")) {
                reasons_for_consultation.push([$(this).val().replaceAll("&comma;", ","), $(this).attr("data-meta_id")]);
            } else {
                reasons_for_consultation.push($(this).val().replaceAll("&comma;", ","));
            }
        }
    });

    $("#underlying_conditions input").each(function (i) {
        if ($(this).val().length > 0) {
            if ($(this).attr("data-meta_id")) {
                underlying_conditions.push([$(this).val().replaceAll("&comma;", ","), $(this).attr("data-meta_id")]);
            } else {
                underlying_conditions.push($(this).val().replaceAll("&comma;", ","));
            }
        }
    });

    $("#chronic_conditions input").each(function (i) {
        if ($(this).val().length > 0) {
            if ($(this).attr("data-meta_id")) {
                chronic_conditions.push([$(this).val().replaceAll("&comma;", ","), $(this).attr("data-meta_id")]);
            } else {
                chronic_conditions.push($(this).val().replaceAll("&comma;", ","));
            }
        }
    });

    $("#recommendations input").each(function (i) {
        if ($(this).val().length > 0) {
            if ($(this).attr("data-meta_id")) {
                recommendations.push([$(this).val().replaceAll("&comma;", ","), $(this).attr("data-meta_id")]);
            } else {
                recommendations.push($(this).val().replaceAll("&comma;", ","));
            }
        }
    });

    $("#drug_use_history input").each(function (i) {
        if ($(this).val().length > 0) {
            if ($(this).attr("data-meta_id")) {
                drug_use_history.push([$(this).val().replaceAll("&comma;", ","), $(this).attr("data-meta_id")]);
            } else {
                drug_use_history.push($(this).val().replaceAll("&comma;", ","));
            }
        }
    });

    $("#medical_history input").each(function (i) {
        if ($(this).val().length > 0) {
            if ($(this).attr("data-meta_id")) {
                medical_history.push([$(this).val().replaceAll("&comma;", ","), $(this).attr("data-meta_id")]);
            } else {
                medical_history.push($(this).val());
            }
        }
    });

    $("#clinical_examinations input").each(function (i) {
        if ($(this).val().length > 0) {
            if ($(this).attr("data-meta_id")) {
                clinical_examinations.push([$(this).val().replaceAll("&comma;", ","), $(this).attr("data-meta_id")]);
            } else {
                clinical_examinations.push($(this).val().replaceAll("&comma;", ","));
            }
        }
    });

    const conclusion = $("#conclusion").val(),
        next_visit_date = $("#next_visit_date").val(),
        handedness = $("#handedness").val(),
        operation = $("#save_notes_operation").val(),
        note_id = $("#save_notes_note_id").val(),
        patient_occupation = $("#patient_occupation").val(),
        file_attachments = $("#case_notes_attachment")[0].files,
        appointment_id = $("#newCaseNotes").attr("data-appointment_id"),
        patient_email = $("#newCaseNotes").attr("data-patient_email"),
        case_note_obj = {
            "appointment_id": appointment_id,
            "patient_email": patient_email,
            "patient_occupation": patient_occupation,
            "reasons_for_consultation": reasons_for_consultation,
            "underlying_conditions": underlying_conditions,
            "chronic_conditions": chronic_conditions,
            "recommendations": recommendations,
            "drug_use_history": drug_use_history,
            "medical_history": medical_history,
            "clinical_examinations": clinical_examinations,
            "file_attachments": file_attachments,
            "conclusion": conclusion,
            "next_visit_date": next_visit_date,
            "handedness": handedness,
            "operation": operation,
            "note_id": note_id,
        };

    let case_note_data = new FormData();

    console.log({ case_note_obj });
    for (const field_name in case_note_obj) {
        if (Object.hasOwnProperty.call(case_note_obj, field_name)) {
            const field_value = case_note_obj[field_name];

            if (field_name == "file_attachments") {
                [...field_value].forEach(file => {
                    case_note_data.append(`${field_name}[]`, file, file.name);
                });
            } else if (Array.isArray(field_value)) {
                field_value.forEach(value => {
                    case_note_data.append(`${field_name}[]`, value);
                });
            } else {
                case_note_data.append(field_name, field_value);
            }
        }
    }

    $.ajax({
        method: "POST",
        url: "operation/addCaseNotes.php",
        data: case_note_data,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            $("#save_case_notes").html('Save').prop("disabled", false);
            if (!response.error) {
                $("#newCaseNotes")[0].reset();

                swal({
                    title: "Saved",
                    text: "Your notes were saved successfuly",
                    type: "success",
                    timer: 4000,
                    showCloseButton: true,
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "Continue",
                }, function (isConfirm) {
                    $("#addCaseNotes").modal("hide");
                    $("#doctorNotes").DataTable().ajax.reload();
                    close();
                });

                // remove added input fields from DOM
                $(".multiple-inputs-container").each(function (i) {
                    let child_inputs = $(this).find(".input-item"),
                        child_count = child_inputs.length - 1;
                    while (child_count > 0) {
                        child_inputs[child_count].remove();
                        child_count--;
                    }
                });
            } else {
                $.toast({
                    heading: "Error",
                    icon: "error",
                    text: "Something went wrong while saving your notes. Please ensure all fields are filled correctly and try again",
                    position: 'bottom-right',
                    showHideTransition: 'slide',
                    timer: 10000,
                });
            }
        },
        error: function (error) {
            $("#save_case_notes").html('Save').prop("disabled", false);
            $.toast({
                heading: "Error",
                icon: "error",
                text: "Something went wrong while saving your notes. Please try again",
                position: 'bottom-right',
                showHideTransition: 'slide',
                timer: 10000,
            });
        }
    });
});

$("#case_notes_attachment").on("change", function (e) {
    $("#file_type_error, #file_size_error").hide();
    const allowed_extensions = ['txt', 'pdf', "doc", "docx", "jpg", "jpeg", "png", "gif"], files = $(this)[0].files;
    let total_file_size = 0, extensions_valid = true;

    [...files].forEach(file => {
        let extension = file.name.match(/\.([^\.]+)$/)[1].toLowerCase(), file_size = file.size / (1024 * 1024);
        total_file_size += file_size;

        if (!allowed_extensions.includes(extension)) {
            extensions_valid = false;
            return false;
        }
    });

    if (!extensions_valid) {
        $("#case_notes_attachment ~ #file_type_error").show();
        $(this).val(null);
    }
    if (total_file_size > 3) {
        $("#case_notes_attachment ~ #file_size_error").show();
        $(this).val(null);
    }
});

//View notes modal
$(document).on('click', '.view_notes', function () {
    const noteId = $(this).attr("id"), appointmentId = $(this).attr("data-appointment_id");
    let patient_data = {};
    $("#download_notes").attr("data-note", noteId);

    $('#notes_details').modal('show');
    $("#notes_details .cn-patient-details-data").text("fetching...");
    $("vcn_medical_history_list, #vcn_clinical_examinations_list, #vcn_uploaded_files_list, #vcn_reasons_for_consultation_list, #vcn_recommendations_list").empty();

    $.ajax({
        method: "POST",
        url: "operation/getAppointmentDetails.php",
        data: { appointmentId: appointmentId },
        dataType: "json",
        success: function (response) {
            if (response.error) {
                $("#notes_details .cn-patient-details-data").text("Error getting patient data");
            } else {
                patient_data = response;
                for (const detail in response) {
                    if (Object.hasOwnProperty.call(response, detail)) {
                        const detail_obj = response[detail];
                        if (detail_obj == "") response[detail] = "Data not found";
                    }
                }

                $("#notes_details #case-notes-patient-name").text(`${response.first_name} ${response.last_name}`);
                $("#notes_details #case-notes-patient-email").text(response.email);
                $("#notes_details #case-notes-patient-tel").text(response.phone);
                $("#notes_details #case-notes-patient-age").text(response.age);
                $("#notes_details #case-notes-patient-gender").text(response.gender);
                $("#notes_details #case-notes-appt-date").text(response.date);
                $("#notes_details #case-notes-booking-note").text(response.booking_note);

                $.ajax({
                    url: "operation/getDoctorNotesDetails.php",
                    method: "POST",
                    data: { noteId: noteId },
                    dataType: "json",
                    success: function (response) {
                        if (response.underlying_conditions) {
                            $("#vcn_underlying_conditions").text(response.underlying_conditions.join(`, `));
                        } else {
                            $("#vcn_underlying_conditions").text("No underlying conditions.");
                        }
                        if (response.chronic_illnesses) {
                            $("#vcn_chronic_illnesses").text(response.chronic_illnesses.join(`, `));
                        } else {
                            $("#vcn_chronic_illnesses").text("No chronic illnesses.");
                        }
                        if (response.medical_history) {
                            $("#vcn_medical_history").html("<ol id='vcn_medical_history_list'></ol>");
                            response.medical_history.forEach(history => {
                                $("#vcn_medical_history_list").append(`<li>${history}</li>`);
                            });
                        } else {
                            $("#vcn_medical_history").text("No medical history.");
                        }
                        if (response.drug_use_history) {
                            $("#vcn_drug_use").text(response.drug_use_history.join(`, `));
                        } else {
                            // note_obj.note_data["drug_use_history"] = [];
                            $("#vcn_drug_use").text("No history of drug use.");
                        }
                        if (response.clinical_examinations) {
                            $("#vcn_clinical_examinations").html("<ol id='vcn_clinical_examinations_list'></ol>");
                            response.clinical_examinations.forEach(examination => {
                                $("#vcn_clinical_examinations_list").append(`<li>${examination}</li>`);
                            });
                        } else {
                            // note_obj.note_data['clinical_examinations'] = [];
                            $("#vcn_clinical_examinations").text("No clinical examinations.");
                        }
                        if (response.file_attachments) {
                            $("#vcn_uploaded_files").html("<ol id='vcn_uploaded_files_list'></ol>");
                            response.file_attachments.forEach(file_attachment => {
                                const file_link = `<a href = 'case-notes-attachment?fn=${file_attachment}&pid=${patient_data.email}&aid=${appointmentId}&token=${csrf_token}' target='_blank'>${file_attachment}</a>`; // csrf_token => navbar.php
                                $("#vcn_uploaded_files_list").append(`<li>${file_link}</li>`);
                            });
                        } else {
                            $("#vcn_uploaded_files").text("No file attachments.");
                        }
                        if (response.reasons_for_consultation) {
                            $("#vcn_reasons_for_consultation").html("<ol id='vcn_reasons_for_consultation_list'></ol>");
                            response.reasons_for_consultation.forEach(reason => {
                                $("#vcn_reasons_for_consultation_list").append(`<li>${reason}</li>`);
                            });
                        } else {
                            $("#vcn_reasons_for_consultation").text("No reasons for consultation.");
                        }
                        if (response.recommendations) {
                            $("#vcn_recommendations").html("<ol id='vcn_recommendations_list'></ol>");
                            response.recommendations.forEach(recommendation => {
                                $("#vcn_recommendations_list").append(`<li>${recommendation}</li>`);
                            });
                        } else {
                            $("#vcn_recommendations").text("No recommendations.");
                        }
                        if (response.doctor_notes) {
                            $("#vcn_conclusions").text(response.doctor_notes);
                        } else {
                            $("#vcn_conclusions").text("No conclusions.");
                        }
                        if (response.date_of_next_visit) {
                            $("#case-notes-next-visit").text(response.date_of_next_visit);
                        } else {
                            $("#case-notes-next-visit").text("Unknown");
                        }
                        if (response.patient_occupation) {
                            $("#case-notes-patient-occupation").text(response.patient_occupation);
                        } else {
                            $("#case-notes-patient-occupation").text("Unknown");
                        }
                        if (response.patient_handedness) {
                            $("#case-notes-patient-handedness").text(response.patient_handedness);
                        } else {
                            $("#case-notes-patient-handedness").text("Unknown");
                        }
                    }
                });
            }
        },
        error: function (error) {
            $("#notes_details .cn-patient-details-data").text("Error getting patient data");
        }
    });
});

// downloading notes pdf
$(document).on("click", ".download_notes", function () {
    const note = $(this).attr("data-note");
    window.open(`download-case-notes?note=${note}&token=${csrf_token}`);
});