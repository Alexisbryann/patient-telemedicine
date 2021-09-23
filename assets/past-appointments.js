$(function () {
    $('.filter_dropdown').on('click', function (e) {
        e.stopPropagation();
        console.log(e);
    });

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
        "serverSide": true
    }

    $(document).ready(function () {
        $('#pastAppointments').DataTable({
            "ajax": {
                type: "POST",
                url: "operation/getAppointments.php",
                data: { "appt_status": "confirmed", "token": csrf_token, "appt_timing": "past" }, // csrf_token: navbar.php
            },
            ...datatable_properties,
        });
    });

    $(function () {
        var table = $('#pastAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            ]
        }).container().appendTo($('#exportToPDF'));
    });

    $(function () {
        var table = $('#pastAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            ]
        }).container().appendTo($('#exportToExcel'));
    });

    $(function () {
        var table = $('#pastAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function () {
        var table = $('#pastAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                { extend: 'printHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            ]
        }).container().appendTo($('#exportToPrint'));
    });

    $(function () {
        var table = $('#pastAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
            ]
        }).container().appendTo($('#exportToCopy'));
    });

    $(document).on('click', '.view_confirmed', function () {
        document.getElementById('viewBtn').textContent = 'Completed Past Appointments';

        let date_filter = get_appt_date_filter();

        $('#pastAppointments').DataTable().destroy();

        $('#pastAppointments').DataTable({
            "ajax": {
                data: { "appt_status": "confirmed", "token": csrf_token, "appt_timing": "past", "date_from": date_filter[0], "date_to": date_filter[1] }, // csrf_token: navbar.php
                url: "operation/getAppointments.php",
                type: "POST"
            },
            ...datatable_properties,
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'printHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCopy'));
        });

    });

    $(document).on('click', '.view_canceled', function () {
        document.getElementById('viewBtn').textContent = 'Canceled Past Appointments';
        $('#pastAppointments').DataTable().destroy();

        let date_filter = get_appt_date_filter();

        $('#pastAppointments').DataTable({
            "ajax": {
                url: "operation/getAppointments.php",
                type: "POST",
                data: { "appt_status": "canceled", "appt_timing": "past", "token": csrf_token, "date_from": date_filter[0], "datE_to": date_filter[1] },
            },
            ...datatable_properties,
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'printHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCopy'));
        });

    });

    $(document).on('click', '.view_all', function () {
        document.getElementById('viewBtn').textContent = 'All Past Appointments';
        $('#pastAppointments').DataTable().destroy();

        let date_filter = get_appt_date_filter();

        $('#pastAppointments').DataTable({
            "ajax": {
                url: "operation/getAppointments.php",
                type: "POST",
                data: {
                    "appt_status": "all",
                    "appt_timing": "past",
                    "token": csrf_token,
                    "date_from": date_filter[0],
                    "date_to": date_filter[1]
                },
            },
            ...datatable_properties,
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'printHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCopy'));
        });

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
                        { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                    ]
                }).container().appendTo($('#exportToPrint'));
            });

            $(function () {
                var table = $('#upcomingAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                    ]
                }).container().appendTo($('#exportToCopy'));
            });
        });

    });

    $(document).on('click', '.no_show', function () {
        document.getElementById('viewBtn').textContent = 'No Show Past Appointments';

        let date_filter = get_appt_date_filter();

        $('#pastAppointments').DataTable().destroy();

        $('#pastAppointments').DataTable({
            "ajax": {
                url: "operation/getAppointments.php",
                type: "POST",
                data: { "appt_status": "no show", "appt_timing": "past", "token": csrf_token, "date_from": date_filter[0], "datE_to": date_filter[1] },
            },
            ...datatable_properties,
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'printHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCopy'));
        });

    });

    //Initialize Select2 Elements
    $('.select2').select2();

    //departments drop down
    $(function () {
        var facility_id = $('#userfacility').val();
        $.ajax({
            url: "operation/getDepartmentsDropDown.php",
            method: "POST",
            data: { facility_id: facility_id },
            dataType: "json",
            success: function (result) {
                $("#departments").attr('disabled', false);
                $.each(result, function (i) {
                    $('#departments').append($('<option></option>').attr("value", result[i].id).text(result[i].department_name));
                });
            },
            failure: function () {
                alert("Error");
            }
        });
    });

    $('#daterange-btn').daterangepicker({
        maxDate: moment(),
        ranges: {
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "startDate": moment().subtract(29, 'days'),
        "endDate": moment(),
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
            fetch_data(start_dateval, end_dateval);
        }
    )

    // $(document).on('click', '.applyBtn', function() {
    //     var doctorId = $('#doctorId').val();
    //     $('#pastAppointments').DataTable().destroy();
    //     fetch_data(doctorId, start_dateval, end_dateval);

    // });

    function fetch_data(start_dateval = '', end_dateval = '') {
        $('#pastAppointments').DataTable().destroy();

        $('#pastAppointments').DataTable({
            "ajax": {
                url: "operation/getAppointments.php",
                type: "POST",
                data: { "appt_status": get_appointment_filter(), "appt_timing": "past", "date_to": end_dateval, "date_from": start_dateval, "token": csrf_token },
            },
            ...datatable_properties,
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'printHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function () {
            var table = $('#pastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'copyHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCopy'));
        });

    }

    //Past appointments patient profile link click event
    $(document).on('click', '.patient_profile', function () {
        var patientId = $(this).attr("id");
        var doctorId = $('#doctorId').val();
        localStorage.setItem("pat_id", patientId);
        localStorage.setItem("doc_id", doctorId);
        window.location = 'patient-profile';

    });
    //set appointment complete
    $(document).on('click', '.complete_appointment', function () {
        var completedAppointmentId = $(this).attr("id");
        swal({
            title: "Completed",
            text: "This appointment will be marked complete",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, mark complete!",
            cancelButtonText: "No",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: "operation/setAppointmentComplete.php",
                    method: "POST",
                    data: { completedAppointmentId: completedAppointmentId },
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
                                data: { trigger: 'canceled', appointment_id: completedAppointmentId, token: csrf_token }
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
    //Past appointments view click event
    $(document).on('click', '.view_patient', function () {
        var appointmentId = $(this).attr("id");
        $.ajax({
            url: "operation/getAppointmentDetails.php",
            method: "POST",
            data: { appointmentId: appointmentId },
            dataType: "json",
            success: function (data) {
                $('#viewPastAppointment').modal('show');
                $('.modal-title').text("Appointment details for" + ' ' + data.name);
                $('#patient_email').html(data.email);
                $('#appointment_date').html(data.date);
                $('#patient_name').html(data.name);
                $('#appointment_time').html(data.time);
                $('#patient_phone').html(data.phone);
                $('#service_type').html(data.service_type);
                $('#service_payment_mode').html(data.payment);
                $('#patient_note').html(data.patient_note);
            }

        });
    });

});

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
            $('#patient_email').html(data.email);
            $('#patient_dob').html(data.date_of_birth);
            $('#appointment_date').html(data.date);
            $('#patient_name').html(data.first_name + ' ' + data.last_name);
            $('#appointment_time').html(data.time);
            $('#patient_phone').html(data.phone);
            $('#service_type').html(data.service_type);
            $('#patient_insurance').html(data.insurance);
            $('#patient_note').html(data.booking_note);
            $('#service_payment_mode').html(data.payment_mode);
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
                    $('#pastAppointments').DataTable().ajax.reload();
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