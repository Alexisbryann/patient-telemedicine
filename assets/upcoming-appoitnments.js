$(function () {
    //Initialize Select2 Elements
    $('.select2').select2();

    const datatable_properties = {
        "searchDelay": 1500,
        "searching": true,
        responsive: window.innerWidth > 1025 ? false : true,
        columnDefs: [{
            className: 'control',
        },
        {
            orderable: false,
            targets: [0, 5],
        }
        ],

        order: [[1, "desc"]],
        'pageLength': 10,
        "processing": true,
        "serverSide": true,
    };

    var loading_img = '<center><img src="img/loading.gif" style="max-height: 150px;"></center>';
    // $(".loading").html(loading_img);
    var doctorId = $('#doctorId').val();
    var aff = $('#aff').val();
    var role = $('#role').val();
    $('#viewAction').val("viewConfirmed");
    var viewAction = $('#viewAction').val();
    $('#select_new_date').hide();
    $('#select_new_time').hide();

    $('.filter_dropdown').on('click', function (e) {
        e.stopPropagation();
        console.log(e);
    });

    //open appointment booking modal
    $(document).on('click', '#openBookingModal', function () {
        $('#manualBooking').modal('show');
        $('#initiator').val("Upcoming Appointments");
    });

    $(document).ready(function () {
        $('#upcomingAppointments').DataTable({
            "ajax": {
                data: { "appt_status": "confirmed", "appt_timing": "upcoming", "token": csrf_token }, // csrf_token: navbar.php
                url: "operation/getAppointments.php",
                type: "POST"
            },
            ...datatable_properties,
        });
    });

    $(function () {
        var table = $('#upcomingAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            ]
        }).container().appendTo($('#exportToPDF'));
    });

    $(function () {
        var table = $('#upcomingAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            ]
        }).container().appendTo($('#exportToExcel'));
    });

    $(function () {
        var table = $('#upcomingAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function () {
        var table = $('#upcomingAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            ]
        }).container().appendTo($('#exportToCopy'));
    });

    $(document).ready(function () {
        $("#departments").change(function () {
            var doctorId = $('#doctorId').val();
            var aff = $('#aff').val();
            var role = $('#role').val();
            var viewAction = $('#viewAction').val();
            var department = $('#departments').val();
            $('#upcomingAppointments').DataTable().destroy();
            $('#upcomingAppointments').DataTable({
                "ajax": {
                    data: { doctorId: doctorId, viewAction: viewAction, aff: aff, role: role, department: department },
                    url: "operation/getUpcomingAppointments.php",
                    type: "POST"
                },
                ...datatable_properties,
            });
            $(function () {
                var table = $('#upcomingAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                    ]
                }).container().appendTo($('#exportToPDF'));
            });
        
            $(function () {
                var table = $('#upcomingAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                    ]
                }).container().appendTo($('#exportToExcel'));
            });
        
            $(function () {
                var table = $('#upcomingAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                    ]
                }).container().appendTo($('#exportToCSV'));
            });
        
            $(function () {
                var table = $('#upcomingAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                    ]
                }).container().appendTo($('#exportToCopy'));
            });
        });

    });

    //View upcoming appointment modal
    $(document).on('click', '.view_appointment', function () {
        $('#viewAppointment').modal('show');
        $("#patient_email, #appointment_date, #patient_name, #appointment_time, #patient_phone, #service_type, #patient_insurance, #patient_note").html("fetching data...");
        $("#appt-details, #editAppDetails-Patient").show();
        $("#appt-edit, #save-details, #detail-saving").hide();
        var appointmentId = $(this).attr("id");
        $.ajax({
            url: "operation/getAppointmentDetails.php",
            method: "POST",
            data: { appointmentId: appointmentId },
            dataType: "json",
            success: function (data) {
                $('#viewAppointment .modal-title').text(data.first_name + ' ' + data.last_name + ' ' + "Appointment Details");
                $('#patient_email_address').html(data.email);
                $('#appointment_date').html(data.date);
                $('#patient_name').html(data.first_name + ' ' + data.last_name);
                $('#appointment_time').html(data.time);
                $('#patient_phone').html(data.phone);
                $('#service_type').html(data.service_type);
                $('#patient_insurance').html(data.insurance);
                $('#patient_note').html(data.patient_note);
                $('#updateAppointmentId').val(appointmentId);
                $('#edit_patient_fname').val(data.first_name);
                $('#edit_patient_lname').val(data.last_name);
                $('#edit_patient_email').val(data.email);
                $('#edit_patient_phone').val(data.phone);
                $('#edit_patient_insurance').val(data.insurance);
                $("#edit_patient_dob").val(data.date_of_birth);
                $("#edit_patient_gender").find(`option[value='${data.gender}']`).prop("selected", true);
            }

        });
    });


    //Editing upcoming appointment 
    $(document).on('submit', '#update-details', function (event) {
        event.preventDefault();
        var appointmentId = $('#updateAppointmentId').val();
        var first_name = $('#edit_patient_fname').val();
        var last_name = $('#edit_patient_lname').val();
        var email = $('#edit_patient_email').val();
        var phone = $('#edit_patient_phone').val();
        var insurance = $('#edit_patient_insurance').val();
        if (appointmentId !== '' && first_name !== '' && last_name !== '' && email !== '' && phone !== '') {
            $.ajax({
                url: "operation/updateUpcommingAppointment.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Patient Details Updated Successfully.',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                        $('#update-details')[0].reset();
                        $('#viewAppointment').modal('hide');
                        $('#upcomingAppointments').DataTable().ajax.reload();
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
                text: 'Please input the fields.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });

    $(document).on('click', '.view_confirmed', function () {
        var doctorId = $('#doctorId').val();
        var aff = $('#aff').val();
        var role = $('#role').val();
        $('#viewAction').val("viewConfirmed");
        var viewAction = $('#viewAction').val();
        document.getElementById('viewBtn').textContent = 'Confirmed Upcoming Appointments';

        let date_filter = get_appt_date_filter();

        $('#upcomingAppointments').DataTable().destroy();

        $('#upcomingAppointments').DataTable({
            "ajax": {
                data: { "appt_status": "confirmed", "appt_timing": "upcoming", "token": csrf_token, "date_from": date_filter[0], "date_to": date_filter[1] },
                url: "operation/getAppointments.php",
                type: "POST"
            },
            ...datatable_properties,
        });

        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPDF'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToExcel'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCSV'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCopy'));
        });

    });


    $(document).on('click', '.view_canceled', function () {
        var doctorId = $('#doctorId').val();
        var aff = $('#aff').val();
        var role = $('#role').val();
        $('#viewAction').val("viewCanceled");
        var viewAction = $('#viewAction').val();
        document.getElementById('viewBtn').textContent = 'Canceled Upcoming Appointments';

        let date_filter = get_appt_date_filter();

        $('#upcomingAppointments').DataTable().destroy();

        $('#upcomingAppointments').DataTable({
            "ajax": {
                data: { "appt_status": "canceled", "appt_timing": "upcoming", "token": csrf_token, "date_from": date_filter[0], "date_to": date_filter[1] },
                url: "operation/getAppointments.php",
                type: "POST"
            },
            ...datatable_properties,
        });

        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPDF'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToExcel'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCSV'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCopy'));
        });

    });

    $(document).on('click', '.view_all', function () {
        var doctorId = $('#doctorId').val();
        var aff = $('#aff').val();
        var role = $('#role').val();
        $('#viewAction').val("viewAll");
        var viewAction = $('#viewAction').val();
        document.getElementById('viewBtn').textContent = 'All Upcoming Appointments';

        let date_filter = get_appt_date_filter();

        $('#upcomingAppointments').DataTable().destroy();

        $('#upcomingAppointments').DataTable({
            "ajax": {
                data: {
                    "appt_status": "all",
                    "appt_timing": "upcoming",
                    "token": csrf_token,
                    "date_from": date_filter[0],
                    "date_to": date_filter[1]
                },
                url: "operation/getAppointments.php",
                type: "POST"
            },
            ...datatable_properties,
        });

        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPDF'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToExcel'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCSV'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCopy'));
        });

    });

    $(document).on('click', '.view_pending_action', function () {
        var doctorId = $('#doctorId').val();
        var aff = $('#aff').val();
        var role = $('#role').val();
        $('#viewAction').val("viewPendingAction");
        var viewAction = $('#viewAction').val();
        document.getElementById('viewBtn').textContent = 'Pending Action Appointments';

        let date_filter = get_appt_date_filter();

        $('#upcomingAppointments').DataTable().destroy();

        $('#upcomingAppointments').DataTable({
            "ajax": {
                data: { "appt_status": "pending", "appt_timing": "upcoming", "token": csrf_token, "date_from": date_filter[0], "date_to": date_filter[1] },
                url: "operation/getAppointments.php",
                type: "POST"
            },
            ...datatable_properties,
        });

        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPDF'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToExcel'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCSV'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCopy'));
        });

    });

    //patient profile link click event
    $(document).on('click', '.patient_profile', function () {
        var patientId = $(this).attr("id");
        var doctorId = $('#doctorId').val();
        localStorage.setItem("pat_id", patientId);
        localStorage.setItem("doc_id", doctorId);
        window.location = 'patient-profile';

    });

    //Reschedule upcoming appointment modal
    $(document).on('click', '.reschedule_appointment', function () {
        var appointmentId = $(this).attr("id");
        $.ajax({
            url: "operation/getAppointmentDetails.php",
            method: "POST",
            data: { appointmentId: appointmentId },
            dataType: "json",
            success: function (data) {
                $('#rescheduleBooking').modal('show');
                document.getElementById('appointmentId').value = appointmentId;
                $('#rescheduleBooking .modal-title').text(`Reschedule your appointment with ${data.first_name} ${data.last_name}`);
            }

        })
    });

    //Reschedule upcoming appointment form
    $(document).on('submit', '#rescheduleAppointmentBooking', function (event) {
        event.preventDefault();
        $("#btnReschedule").prop("disabled", true).html("Saving...&nbsp;&nbsp; <div class='loader' role='status'></div>");

        var doctorId = $('#rescheduleDoctorId').val();
        var appointmentId = $('#appointmentId').val();
        var appointmentStartTime = $('#shedulerTimePickerRescheduleAppoinment').val();
        var appointmentDate = $('#rescheduleDate').val();
        var doctorName = $('#docName').val();
        var doctorEmail = $('#docEmail').val();
        var operation = $('#operation').val('rescheduleBooking');

        if (doctorId !== '' && appointmentId !== '' && appointmentStartTime !== '' && appointmentDate !== '') {
            $.ajax({
                url: "operation/addRescheduleBooking.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == 200) {
                        $('#rescheduleAppointmentBooking')[0].reset();
                        $('#rescheduleBooking').modal('hide');
                        swal({
                            title: "Rescheduled",
                            text: "You have successfully rescheduled this appointment",
                            type: "success",
                            timer: 5000,
                            showConfirmButton: false
                        });
                        $('#upcomingAppointments').DataTable().ajax.reload();
                    } else if (data == 500) {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 5000,
                            showConfirmButton: false
                        });
                    }
                    $("#btnReschedule").prop("disabled", false).html("Reschedule");
                }

            });
        } else {
            $.toast({
                heading: 'Warning',
                text: 'Please fill all the required details.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });

    //Re-Allocate upcoming appointment form
    $(document).on('submit', '#reallocateAppointmentBooking', function (event) {
        event.preventDefault();
        var doctorId = $('#reallocation_doc').val();
        var appointmentId = $('#reallocationApptId').val();

        if (doctorId !== '' && appointmentId !== '') {
            $.ajax({
                url: "operation/reallocatebooking.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == 200) {
                        $('#reallocateAppointmentBooking')[0].reset();
                        $('#reallocateBooking').modal('hide');
                        swal({
                            title: "Reallocated",
                            text: "You have successfully reallocated this appointment",
                            type: "success",
                            timer: 5000,
                            showConfirmButton: false
                        });
                        $('#upcomingAppointments').DataTable().ajax.reload();
                    } else if (data == 500) {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 5000,
                            showConfirmButton: false
                        });
                    }
                }
            });
        } else {
            $.toast({
                heading: 'Warning',
                text: 'Please fill all the required details.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });

    //Re-allocate upcoming appointment modal
    //Get Department List
    $(document).on('click', '.reallocate_appointment', function () {
        var appointmentId = $(this).attr("id");
        var facility_id = $('#facility_id').val();
        $.ajax({
            url: "operation/getdepartmentlist.php", //get doctors in the hospital
            method: "POST",
            data: { appointmentId: appointmentId, facility_id: facility_id },
            dataType: "json",
            success: function (result) {
                $('#reallocateBooking').modal('show');
                document.getElementById('reallocationApptId').value = appointmentId;
                $("#facility_department").empty();
                $.each(result, function (i) {
                    $('#facility_department').append($('<option></option>').attr("value", result[i].id).text(result[i].department_name));

                });
            }

        })
    });

    //Automatically Change Docs according to department
    $(document).ready(function () {
        $("#facility_department").change(function () {
            var selectedDepartment = $(this).val();
            var facility_id = $("#facility_id").val();
            var appointmentId = $('#reallocationApptId').val();

            $.ajax({
                url: "operation/autofilldocdepartment.php",
                method: "POST",
                data: { selectedDepartment: selectedDepartment, facility_id: facility_id, appointmentId: appointmentId },
                dataType: "json",
                success: function (response) {
                    if (response == 404) {
                        $("#reallocation_doc").empty();
                        var val = 'No listed doctors for the selected department';
                        $("#reallocation_doc").append("<option>" + val + "</option>");
                    } else {
                        var len = response.length;
                        $("#reallocation_doc").empty();
                        for (var i = 0; i < len; i++) {
                            var val = response[i]['id'];
                            var name = response[i]['name'];
                            $("#reallocation_doc").append("<option value='" + val + "'>" + name + "</option>");
                        }
                    }
                }
            });
        });
    });

    //Automatically get doc services according to selected doctor
    $(document).ready(function () {
        $("#reallocation_doc").change(function () {
            var selected_doc = $(this).val();
            $.ajax({
                url: "operation/autofilldocservices.php",
                method: "POST",
                data: { selected_doc: selected_doc },
                dataType: "json",
                success: function (response) {
                    if (response == 404) {
                        $("#doc_services").empty();
                        var val = 'No services found for the selected doctor';
                        $("#doc_services").append("<option>" + val + "</option>");
                    } else {
                        var len = response.length;
                        $("#doc_services").empty();
                        for (var i = 0; i < len; i++) {
                            var val = response[i]['id'];
                            var name = response[i]['name'];
                            $("#doc_services").append("<option value='" + val + "'>" + name + "</option>");
                        }
                    }
                }
            });
        });
    });

    //cancel upcoming appointment
    $(document).on('click', '.cancel_appointment', function () {
        var appointmentId = $(this).attr("id");
        var doctorId = $('#doctorId').val();
        var doctorName = $('#docName').val();
        var doctorEmail = $('#docEmail').val();
        swal({
            title: "Are you sure?",
            text: "You are about to cancel this appointment",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, cancel it",
            cancelButtonText: "No",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: "operation/cancelUpcomingAppointment.php",
                    method: "POST",
                    data: { appointmentId: appointmentId, doctorId: doctorId, doctorName: doctorName, doctorEmail: doctorEmail },
                    dataType: "json",
                    success: function (data) {
                        if (data == 200) {
                            swal({
                                title: "Canceled",
                                text: "Appointment successfully canceled",
                                type: "success",
                                timer: 4000,
                                showConfirmButton: false
                            });
                            $('#upcomingAppointments').DataTable().ajax.reload();

                            // call to patient experience event handler after appointment has been successfuly cancelled
                            $.ajax({
                                url: "../../patientexperience/operation/oneMedProEventHandlers.php",
                                method: "POST",
                                data: { trigger: 'canceled', appointment_id: appointmentId, token: csrf_token }
                            });
                        } else if (data == 700) {
                            swal({
                                title: "Warning",
                                text: "Sorry, this appointment cannot be canceled. You can only cancel an appointment two or more hours before for this doctor. It is less than 2 hrs to the appointment time",
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

    //mark as complete upcoming appointment
    $(document).on('click', '.mark_complete', function () {
        var appointmentId = $(this).attr("id");
        var doctorId = $('#doctorId').val();
        var doctorName = $('#docName').val();
        var doctorEmail = $('#docEmail').val();
        swal({
            title: "Sure to Complete Appointment?",
            text: "This appointment will be marked complete",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Complete it",
            cancelButtonText: "No",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: "operation/markCompleteUpcomingAppointment.php",
                    method: "POST",
                    data: { appointmentId: appointmentId, doctorId: doctorId, doctorName: doctorName, doctorEmail: doctorEmail },
                    dataType: "json",
                    success: function (data) {
                        if (data == 200) {
                            swal({
                                title: "Completed",
                                text: "Appointment successfully marked complete",
                                type: "success",
                                timer: 4000,
                                showConfirmButton: false
                            });
                            $('#upcomingAppointments').DataTable().ajax.reload();

                            // call to patient experience event handler after appointment has been successfuly saved
                            $.ajax({
                                url: "../../patientexperience/operation/oneMedProEventHandlers.php",
                                method: "POST",
                                data: { trigger: 'confirmed', appointment_id: appointmentId, doctorId: doctorId, token: csrf_token }
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

    //mark as no show upcoming appointment
    $(document).on('click', '.no_show', function () {
        var appointmentId = $(this).attr("id");
        var doctorId = $('#doctorId').val();
        var doctorName = $('#docName').val();
        var doctorEmail = $('#docEmail').val();
        swal({
            title: "Sure It's a No Show?",
            text: "This appointment will be marked as no show",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, No Show",
            cancelButtonText: "No",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: "operation/markNoShowUpcomingAppointment.php",
                    method: "POST",
                    data: { appointmentId: appointmentId, doctorId: doctorId, doctorName: doctorName, doctorEmail: doctorEmail },
                    dataType: "json",
                    success: function (data) {
                        if (data == 200) {
                            swal({
                                title: "No Show",
                                text: "Appointment successfully marked no show",
                                type: "success",
                                timer: 4000,
                                showConfirmButton: false
                            });
                            $('#upcomingAppointments').DataTable().ajax.reload();

                            // call to patient experience event handler after appointment has been successfuly saved
                            $.ajax({
                                url: "../../patientexperience/operation/oneMedProEventHandlers.php",
                                method: "POST",
                                data: { trigger: 'noshow', appointment_id: appointmentId, token: csrf_token }
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

    $('#daterange-btn').daterangepicker({
        "minDate": moment(),
        "startDate": moment(),
        "endDate": moment().add(30, "days"),
        ranges: {
            'Today': [moment(), moment()],
            'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
            "This week": [moment(), moment().endOf("isoWeek")],
            'Next week': [moment().endOf("isoWeek"), moment().endOf("isoWeek").add(7, 'days')],
            'Next 30 days': [moment(), moment().add(30, "days")],
            'This month': [moment(), moment().endOf('month')],
            'Next month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
        }
    },
        function (start, end) {
            $('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            [startDate, endDate] = $('#appointments_range').val().split(' - ');
            $(this).find('input[name="start_date"]').val(startDate);
            $(this).find('input[name="end_date"]').val(endDate);

            $start = $('#start_date').val();
            $end = $('#end_date').val();
            start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
            end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");

            var doctorId = $('#doctorId').val();
            var aff = $('#aff').val();
            var role = $('#role').val();

            fetch_data(start_dateval, end_dateval);

        }
    )

    $(document).on('click', '.applyBtn', function () {
        $('#upcomingAppointments').DataTable().destroy();
        fetch_data(start_dateval, end_dateval);
    });

    function fetch_data(start_dateval = '', end_dateval = '') {
        $('#upcomingAppointments').DataTable().destroy();

        $('#upcomingAppointments').DataTable({
            "ajax": {
                url: "operation/getAppointments.php",
                type: "POST",
                data: { "appt_status": get_appointment_filter(), "appt_timing": "upcoming", "date_to": end_dateval, "date_from": start_dateval, "token": csrf_token },
            },
            ...datatable_properties,
        });

        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPDF'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToExcel'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCSV'));
        });
    
        $(function () {
            var table = $('#upcomingAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCopy'));
        });

    }

});

$(function () {
    $('#rescheduleDatepicker').datepicker({
        minDate: new Date(),
        firstDay: 1,
        dateFormat: 'yy-mm-dd',
        yearRange: "-0:+1",
        maxDate: '+12m',
        inline: true
    });

    $('#reallocationDatepicker').datepicker({
        minDate: new Date(),
        firstDay: 1,
        dateFormat: 'yy-mm-dd',
        yearRange: "-0:+1",
        maxDate: '+12m',
        inline: true
    });
});

$(document).ready(function () {

    $("#rescheduleDatepicker").change(function () {

        var doctorId = $('#rescheduleDoctorId').val();
        var appointmentId = $('#appointmentId').val();
        var chosenDate = $(this).val();
        document.getElementById('rescheduleDate').value = chosenDate;

        $.ajax({
            url: "operation/getDoctorBookingRescheduleTimeSlots.php",
            method: "POST",
            data: { doctorId: doctorId, chosenDate: chosenDate, appointmentId: appointmentId },
            dataType: "json",
            success: function (result) {
                if (result == 500) {
                    var message = 'No availability, please select another day.';
                    $("#shedulerTimePickerRescheduleAppoinment").empty();
                    $("#shedulerTimePickerRescheduleAppoinment").append("<option class='btn-error' >" + message + "</option>");

                } else {
                    var len = result.length;
                    $("#shedulerTimePickerRescheduleAppoinment").empty();
                    $.each(result, function (key, value) {
                        $('#shedulerTimePickerRescheduleAppoinment').append($('<option class="btn-circle btn btn-slot"></option>').text(value));
                    });
                }
            }
        });
    });

    $("#reallocationDatepicker").change(function () {
        var doctorId = $('#reallocation_doc').val();
        var appointmentId = $('#reallocationApptId').val();
        var chosenDate = $(this).val();
        document.getElementById('reallocationDate').value = chosenDate;

        $.ajax({
            url: "operation/getDoctorBookingRescheduleTimeSlots.php",
            method: "POST",
            data: { doctorId: doctorId, chosenDate: chosenDate, appointmentId: appointmentId },
            dataType: "json",
            success: function (result) {
                if (result == 500) {
                    var message = 'No availability, please select another date.';
                    $("#reallocationShedulerTimePicker").empty();
                    $("#reallocationShedulerTimePicker").append("<option class='btn-error' >" + message + "</option>");

                } else {
                    var len = result.length;
                    $("#reallocationShedulerTimePicker").empty();
                    $.each(result, function (key, value) {
                        $('#reallocationShedulerTimePicker').append($('<option class="btn-circle btn btn-slot"></option>').text(value));
                    });
                }
            }
        });
    });

});



//add case notes modal
$(document).on('click', '.diagnostic', function () {
    var appointment_id = $(this).attr("id");
    $('#diagnosticque').modal('show');
    $('#qtdappointment_id').val(appointment_id);

});

//editing the patient appointment modal form
function editDisplay() {
    var x = document.getElementById("appt-edit");
    if (x.style.display === "none") {
        x.style.display = "";
    } else {
        x.style.display = "none";
    }
    var x = document.getElementById("save-details");
    if (x.style.display === "none") {
        x.style.display = "";
    } else {
        x.style.display = "none";
    }
    var x = document.getElementById("appt-details");
    if (x.style.display === "none") {
        x.style.display = "";
    } else {
        x.style.display = "none";
    }
    var x = document.getElementById("detail-saving");
    if (x.style.display === "none") {
        x.style.display = "";
    } else {
        x.style.display = "none";
    }
    var x = document.getElementById("editAppDetails-Patient");
    if (x.style.display === "none") {
        x.style.display = "";
    } else {
        x.style.display = "none";
    }
    var x = document.forms["update-details"]["edit_patient_insurance"].value;
    if (x == "") {
        $(insure).hide();
    }
}

function get_appt_date_filter() {
    /**
     * checks if date filter has been set to pick date range values
     */
    return $("#telemed_appts_range").text() == "Filter by Date" ? ["", ""] : $("#telemed_appts_range").text().split(" - ");
}

function get_appointment_filter() {
    /**
     * checks appointment status filter button to determine the appointment status filter to be applied to the result set
     */
    const filter_button_text = $("#viewBtn").text();

    switch (filter_button_text) {
        case "Confirmed Past Appointments":
            return "confirmed";
        case "Canceled Past Appointments":
            return "canceled";
        case "No Show Past Appointments":
            return "no show";
        case "All Past Appointments":
            return "";
        default:
            return "confirmed";
    }
}
