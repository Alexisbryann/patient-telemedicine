$(function () {
    var doctorId = $('#doctorId').val();
    var aff = $('#aff').val();
    var role = $('#role').val();
    //Initialize Select2 Elements
    $('.select2').select2();

    //My Patients
    $('#myPatients').DataTable({
        "ajax": {
            data: { "token": csrf_token },
            url: "operation/getMyPatients.php",
            type: "POST"
        },
        responsive: window.innerWidth > 1025 ? false : true,
        columnDefs: [
            {
                className: 'control',
            },
            {
                orderable: false,
                targets: [2, 5,],
            }
        ],
        "searching": true,
        "searchDelay": 1000,
        order: [[3, "desc"]],
        'pageLength': 10,
        "processing": true,
        "serverSide": true,
    });

    $(function () {
        var table = $('#myPatients').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                {
                    extend: 'pdfHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                },
            ]
        }).container().appendTo($('#exportToPDF'));
    });

    $(function () {
        var table = $('#myPatients').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                },
            ]
        }).container().appendTo($('#exportToExcel'));
    });

    $(function () {
        var table = $('#myPatients').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'csvHtml5'
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function () {
        var table = $('#myPatients').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'printHtml5'
            ]
        }).container().appendTo($('#exportToPrint'));
    });

    $(function () {
        var table = $('#myPatients').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'copyHtml5'
            ]
        }).container().appendTo($('#exportToCopy'));
    });

    var today = new Date().toISOString().split('T')[0];
    var startDate = $("#start_date")[0].setAttribute('min', today);
    var endDate = $("#end_date")[0].setAttribute('min', today);
});

//departments drop down
$(function () {
    var facility_id = $('#userfacility').val();
    $.ajax({
        url: "operation/getFilteredDepartmentsDropDown.php",
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

$(document).ready(function () {
    $("#departments").change(function () {
        var doctorId = $('#doctorId').val();
        var aff = $('#aff').val();
        var role = $('#role').val();
        var department = $('#departments').val();
        $('#myPatients').DataTable().destroy();
        $('#myPatients').DataTable({
            "ajax": {
                data: { "token": csrf_token, "department": department },
                url: "operation/getMyPatients.php",
                type: "POST"
            },
            responsive: window.innerWidth > 1025 ? false : true,
            columnDefs: [
                {
                    className: 'control',
                },
                {
                    orderable: false,
                    targets: [2, 5,],
                }
            ],
            "searchDelay": 1000,
            order: [[3, "desc"]],
            'pageLength': 10,
            "processing": true,
            "serverSide": true,
            "initComplete": function (settings, json) {
                $('div.loading').remove();
            }
        });
        $(function () {
            var table = $('#myPatients').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'pdfHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function () {
            var table = $('#myPatients').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'excelHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function () {
            var table = $('#myPatients').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function () {
            var table = $('#myPatients').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function () {
            var table = $('#myPatients').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    { extend: 'csvHtml5', exportOptions: { columns: [0, 1, 2, 3, 4] } },
                ]
            }).container().appendTo($('#exportToCopy'));
        });
    });

});

//My patients view click event
$(document).on('click', '.view_patient', function () {
    var patientId = $(this).attr("id");
    var doctorId = $('#doctorId').val();
    localStorage.setItem("pat_id", patientId);
    localStorage.setItem("doc_id", doctorId);
    window.location = 'patient-profile';

});

var start_dateval, end_dateval;
$(function () {

    $('#daterange-btn').daterangepicker({
        maxDate: moment(),
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },

        startDate: moment().startOf('month'),
        endDate: moment().endOf('month')
        //startDate: moment().subtract(29, 'days'),
        // endDate: moment()
    },
        function (start, end) {
            $('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            [startDate, endDate] = $('#appointments_range').val().split(' - ');

            start_dateval = moment(start).format("YYYY-MM-DD");
            end_dateval = moment(end).format("YYYY-MM-DD");
            var doctorId = $('#doctorId').val();
            $('#myPatients').DataTable().destroy();
            fetch_data(start_dateval, end_dateval);
        }
    )

    $(document).on('click', '.applyBtn', function () {
        var doctorId = $('#doctorId').val();
        $('#myPatients').DataTable().destroy();
        fetch_data(start_dateval, end_dateval);

    });

    function fetch_data(start_dateval = '', end_dateval = '') {
        $('#myPatients').DataTable({
            "ajax": {
                data: { "token": csrf_token, "date_from": start_dateval, "date_to": end_dateval },
                url: "operation/getMyPatients.php",
                type: "POST"
            },
            responsive: window.innerWidth > 1025 ? false : true,
            columnDefs: [
                {
                    className: 'control',
                },
                {
                    orderable: false,
                    targets: [2, 5,],
                }
            ],
            "searchDelay": 1000,
            order: [[3, "desc"]],
            'pageLength': 10,
            "processing": true,
            "serverSide": true,
        });

        $(function () {
            var table = $('#myPatients').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'pdfHtml5'
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function () {
            var table = $('#myPatients').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'excelHtml5'
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function () {
            var table = $('#myPatients').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'csvHtml5'
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function () {
            var table = $('#myPatients').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'printHtml5'
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function () {
            var table = $('#myPatients').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'copyHtml5'
                ]
            }).container().appendTo($('#exportToCopy'));
        });
    }

    //Rebook patient for another appointment click
    $(document).on('click', '.rebook_patient', function () {
        var patientId = $(this).attr("id");
        $.ajax({
            url: "operation/getPatientData.php",
            method: "POST",
            data: { patientId: patientId },
            dataType: "json",
            success: function (data) {
                $('#rebookingModal').modal('show');
                $('.modal-title').text("Rebook an appointment for" + ' ' + data.first_name + ' ' + data.last_name);
                $('#p_firstname').val(data.first_name);
                $('#p_last_name').val(data.last_name);
                $('#p_email_address').val(data.email);
                $('#p_phone_number').val(data.phone);
                $('#p_date_of_birth').val(data.dob);
                $('#p_gender').val(data.gender);
            }

        })
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
                    console.log(result);
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
                        $("#services_dropdown").attr('disabled', false); rebookingForm
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
        $(this).find("[type='submit']").prop("disabled", true);
        event.preventDefault();
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
                        }); S
                    } else if (data == 500) {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 5000,
                            showConfirmButton: false
                        });
                    }
                    $(this).find("[type='submit']").prop("disabled", false);
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


});