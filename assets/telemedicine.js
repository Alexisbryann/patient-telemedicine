var start_dateval, end_dateval;
$(function () {
    const datatable_options = {
        responsive: window.innerWidth > 1025 ? false : true,
        columnDefs: [
            {
                className: 'control',
            },
            {
                orderable: false,
                targets: [0, 4, 5],
            }
        ],
        searchDelay: 1500,
        order: [[1, "desc"]],
        pageLength: 10,
        processing: true,
        serverSide: true,
        language: {
            emptyTable: "No data available in table",
            zeroRecords: "No data available in table",
        },
    },
        daterangepicker_ranges = {
            ranges: {
                past: {
                    "Yesterday": [moment().subtract(1, "days"), moment().subtract(1, "days")],
                    "This Week": [moment().startOf("week"), moment()],
                    "Last Week": [moment().startOf("week").subtract(8, "days"), moment().startOf("week").subtract(1, "days")],
                    "This Month": [moment().startOf("month"), moment()],
                    "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
                    "Last 3 Months": [moment().subtract(3, "months").startOf("month"), moment().subtract(1, "months").endOf("month")],
                },
                upcoming: {
                    'Today': [moment(), moment()],
                    'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
                    "This Week": [moment(), moment().endOf("isoWeek")],
                    "Next Week": [moment().endOf("isoWeek"), moment().endOf("isoWeek").add(1, "Week")],
                    'This Month': [moment(), moment().endOf('month')],
                    'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                    'Next 3 Months': [moment().add(1, 'month').startOf('month'), moment().add(3, 'month').endOf('month')]
                },
                get missed() {
                    return this.past;
                },
                get pending() {
                    return this.past;
                },
            },
            limits: {
                past: {
                    min: "",
                    max: moment()._d,
                },
                upcoming: {
                    min: moment()._d,
                    max: "",
                },
                get missed() {
                    return this.past;
                },
                get pending() {
                    return this.past;
                }
            }
        };
    var doctorId = $('#doctorId').val();

    //Beginning of upcoming Telemedicine appointments
    $(document).ready(function () {
        $('#getTelemedAppointments').DataTable({
            "ajax": {
                type: "POST",
                url: "operation/getTelemedicineAppointments.php",
                data: { "appointments_status": "upcoming", "token": csrf_token },
            },
            ...datatable_options,
        });
    });


    $(function () {
        var table = $('#getTelemedAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'pdfHtml5'
            ]
        }).container().appendTo($('#exportToPDF'));
    });

    $(function () {
        var table = $('#getTelemedAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'excelHtml5'
            ]
        }).container().appendTo($('#exportToExcel'));
    });

    $(function () {
        var table = $('#getTelemedAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'csvHtml5'
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function () {
        var table = $('#getTelemedAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'printHtml5'
            ]
        }).container().appendTo($('#exportToPrint'));
    });

    $(function () {
        var table = $('#getTelemedAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'copyHtml5'
            ]
        }).container().appendTo($('#exportToCopy'));
    });


    //Telemedicine View Details || Fetching
    $(document).on('click', '.view_telemed_details', function () {
        $('#Telemed_View_Details').modal('show');
        $("#patient_email, #date, #patient_name, #patient_phone, #patient_gender, #patient_insurance, #patient_note").html("Fetching data...");
        $("#Telemed_View_Details .modal-title").text("Fetching Appointment Details...");

        var appointmentId = $(this).attr("id");
        $.ajax({
            url: "operation/getTelemedAppDetails.php",
            method: "POST",
            data: { appointmentId: appointmentId },
            dataType: "json",
            success: function (data) {
                $('#Telemed_View_Details .modal-title').text(`Appointment Details For ${data.name}`);
                $('#patient_email').html(data.email);
                $('#date').html(data.dob);
                $('#patient_name').html(data.name);
                $('#patient_phone').html(data.phone);
                $('#patient_gender').html(data.gender);
                $('#patient_insurance').html(data.insurance);
                $('#patient_note').html(data.patient_note);
            }

        })

        $('#getPatientPrescription').DataTable({
            dom: 'Bfrtip',

            'paging': false,
            'pageLength': 10,
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
                url: "operation/getTelemedPatientPrescriptions.php",
                type: "POST",
                data: { appointmentId: appointmentId },
                dataType: "json",
            },
            aoColumns: [
                { sWidth: '15%' },
                { sWidth: '25%' },
                { sWidth: '20%' },
                { sWidth: '20%' },
                { sWidth: '15%' },
                { sWidth: '5%' }
            ]
        });

        $('#getPatientPrescription').dataTable().fnDestroy();

        $.ajax({
            method: "POST",
            url: "operation/getDoctorNotesDetails.php",
            data: { "noteId": appointmentId, "column": "appointment_id" },
            dataType: "json",
            success: function (response) {
                const note_date = (date) => `<b class="row col-12">${date}</b>`,
                    doctor_note = (note) => `<span class="row col-12">${note}</span>`;
                $("#doctors-notes-content").empty();

                if (Object.hasOwnProperty.call(response, "date_added") && Object.hasOwnProperty.call(response, "doctor_notes")) {
                    $("#doctors-notes-content").append(note_date(response["date_added"].split(" ").shift()));

                    response["doctor_notes"].forEach(note => {
                        $("#doctors-notes-content").append(doctor_note(note));
                    });
                } else {
                    $("#doctors-notes-content").html(`<p>No notes available</p>`);
                }

            },
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

    //Telemedicine View Prescription || Fetching
    $(document).on('click', '.submit', function () {
        var appointmentId = $(this).attr("id");
        $.ajax({
            url: "operation/getTelemedAppDetails.php",
            method: "POST",
            data: { appointmentId: appointmentId },
            dataType: "json",
            success: function (data) {
                $('#Telemed_View_Details').modal('show');
                $('.modal-title').text("Appointment Details For" + ' ' + data.name);
                $('#patient_email').html(data.email);
                $('#dob').html(data.date);
                $('#patient_name').html(data.name);
                $('#patient_phone').html(data.phone);
                $('#gender').html(data.gender);
                $('#patient_insurance').html(data.insurance);
                $('#patient_note').html(data.patient_note);
            }

        })

        $('#getPatientPrescription').DataTable({
            dom: 'Bfrtip',

            'paging': false,
            'pageLength': 10,
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
                url: "operation/getTelemedPatientPrescriptions.php",
                type: "POST",
                data: { appointmentId: appointmentId },
                dataType: "json",
            },
            aoColumns: [
                { sWidth: '15%' },
                { sWidth: '25%' },
                { sWidth: '20%' },
                { sWidth: '20%' },
                { sWidth: '15%' },
                { sWidth: '5%' }
            ]
        });

        $('#getPatientPrescription').dataTable().fnDestroy();

    });



    //Telemedicine Add Prescriptions

    $('#myModal').modalSteps();

    $(document).on('click', '.add_prescription', function () {
        var appointmentId = $(this).attr("id");
        $.ajax({
            url: "operation/getTelemedCasereviewDetails.php",
            method: "POST",
            data: { appointmentId: appointmentId },
            dataType: "json",
            success: function (data) {
                $('#myModal').modal('show');
                $('.modal-title').text("Add Patient Prescriptions");
                $('#appointment_id').html(data.appointment_id);


            }

        })



        $('#getTelemedCaseReviewAppDetail').dataTable().fnDestroy();

    });


    /*   $('#myModal').modalSteps();

       //add prescription modal
       $(document).on('click', '.add_prescription', function() {
       $('#myModal').modal('show');
       });
        */






    //Beginning of Telemedicine appointments Pending Review

    $(document).ready(function () {
        $(document).ready(function () {
            $('#getTelemedPendingReview').DataTable({
                "ajax": {
                    type: "POST",
                    url: "operation/getTelemedicineAppointments.php",
                    data: { "appointments_status": "pending", "token": csrf_token },
                },
                ...datatable_options,
            });
        });

        $(function () {
            var table = $('#getTelemedPendingReview').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'pdfHtml5'
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function () {
            var table = $('#getTelemedPendingReview').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'excelHtml5'
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function () {
            var table = $('#getTelemedPendingReview').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'csvHtml5'
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function () {
            var table = $('#getTelemedPendingReview').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'printHtml5'
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function () {
            var table = $('#getTelemedPendingReview').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'copyHtml5'
                ]
            }).container().appendTo($('#exportToCopy'));
        });

        $('#daterangepending-btn').daterangepicker({
            ranges: {
                'Today': [moment(), moment()],
                'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
                'Next 7 Days': [moment(), moment().add(6, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Next 3 Months': [moment().add(1, 'month').startOf('month'), moment().add(3, 'month').endOf('month')]
            }
        },
            function (start, end) {
                $('#daterangepending-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

                [startDate, endDate] = $('#pending_range').val().split(' - ');
                $(this).find('input[name="start_date"]').val(startDate);
                $(this).find('input[name="end_date"]').val(endDate);

                $start = $('#start_date').val();
                $end = $('#end_date').val();
                start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
                end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");

                var doctorId = $('#doctorId').val();
                $('#getTelemedPendingReview').DataTable().destroy();
                fetch_data(doctorId, start_dateval, end_dateval);
            }
        )


        function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
            $('#getTelemedPendingReview').DataTable({
                "ajax": {
                    data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
                    url: "operation/filterTelemed/filterpendingReviewTelemed.php",
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
                'pageLength': 25
            });


            $(function () {
                var table = $('#getTelemedPendingReview').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'pdfHtml5'
                    ]
                }).container().appendTo($('#exportToPDF'));
            });

            $(function () {
                var table = $('#getTelemedPendingReview').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'excelHtml5'
                    ]
                }).container().appendTo($('#exportToExcel'));
            });

            $(function () {
                var table = $('#getTelemedPendingReview').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'csvHtml5'
                    ]
                }).container().appendTo($('#exportToCSV'));
            });

            $(function () {
                var table = $('#getTelemedPendingReview').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'print'
                    ]
                }).container().appendTo($('#exportToPrint'));
            });

            $(function () {
                var table = $('#getTelemedPendingReview').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'copyHtml5'
                    ]
                }).container().appendTo($('#exportToCopy'));
            });

        }
    });

    //Beginning of Missed Telemedicine appointments 
    $(document).ready(function () {
        $('#getTelemedMissedAppointments').DataTable({
            "ajax": {
                type: "POST",
                url: "operation/getTelemedicineAppointments.php",
                data: { "appointments_status": "missed", "token": csrf_token },
            },
            ...datatable_options,
        });

        $(function () {
            var table = $('#getTelemedMissedAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'pdfHtml5'
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function () {
            var table = $('#getTelemedMissedAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'excelHtml5'
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function () {
            var table = $('#getTelemedMissedAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'csvHtml5'
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function () {
            var table = $('#getTelemedMissedAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'printHtml5'
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function () {
            var table = $('#getTelemedMissedAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'copyHtml5'
                ]
            }).container().appendTo($('#exportToCopy'));
        });


        $('#daterangemissed-btn').daterangepicker({
            ranges: {
                'Today': [moment(), moment()],
                'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
                'Next 7 Days': [moment(), moment().add(6, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Next 3 Months': [moment().add(1, 'month').startOf('month'), moment().add(3, 'month').endOf('month')]
            }
        },
            function (start, end) {
                $('#daterangemissed-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

                [startDate, endDate] = $('#missed_range').val().split(' - ');
                $(this).find('input[name="start_date"]').val(startDate);
                $(this).find('input[name="end_date"]').val(endDate);

                $start = $('#start_date').val();
                $end = $('#end_date').val();
                start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
                end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");

                var doctorId = $('#doctorId').val();
                $('#getTelemedMissedAppointments').DataTable().destroy();
                fetch_data(doctorId, start_dateval, end_dateval);
            }
        )


        function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
            $('#getTelemedMissedAppointments').DataTable({
                "ajax": {
                    data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
                    url: "operation/filterTelemed/filterMissedTelemedappointments.php",
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
                'pageLength': 25
            });


            $(function () {
                var table = $('#getTelemedMissedAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'pdfHtml5'
                    ]
                }).container().appendTo($('#exportToPDF'));
            });

            $(function () {
                var table = $('#getTelemedMissedAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'excelHtml5'
                    ]
                }).container().appendTo($('#exportToExcel'));
            });

            $(function () {
                var table = $('#getTelemedMissedAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'csvHtml5'
                    ]
                }).container().appendTo($('#exportToCSV'));
            });

            $(function () {
                var table = $('#getTelemedMissedAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'print'
                    ]
                }).container().appendTo($('#exportToPrint'));
            });

            $(function () {
                var table = $('#getTelemedMissedAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'copyHtml5'
                    ]
                }).container().appendTo($('#exportToCopy'));
            });

        }

    });


    //Beginning of Past Telemedicine appointments 
    $(document).ready(function () {
        $('#getTelemedPastAppointments').DataTable({
            "ajax": {
                type: "POST",
                url: "operation/getTelemedicineAppointments.php",
                data: { "appointments_status": "past", "token": csrf_token },
            },
            ...datatable_options,
        });


        $(function () {
            var table = $('#getTelemedPastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'pdfHtml5'
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function () {
            var table = $('#getTelemedPastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'excelHtml5'
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function () {
            var table = $('#getTelemedPastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'csvHtml5'
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function () {
            var table = $('#getTelemedPastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'printHtml5'
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function () {
            var table = $('#getTelemedPastAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'copyHtml5'
                ]
            }).container().appendTo($('#exportToCopy'));
        });


        $('#daterangepast-btn').daterangepicker({
            ranges: {
                'Today': [moment(), moment()],
                'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
                'Next 7 Days': [moment(), moment().add(6, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Next 3 Months': [moment().add(1, 'month').startOf('month'), moment().add(3, 'month').endOf('month')]
            }
        },
            function (start, end) {
                $('#daterangepast-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

                [startDate, endDate] = $('#past_range').val().split(' - ');
                $(this).find('input[name="start_date"]').val(startDate);
                $(this).find('input[name="end_date"]').val(endDate);

                $start = $('#start_date').val();
                $end = $('#end_date').val();
                start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
                end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");

                var doctorId = $('#doctorId').val();
                $('#getTelemedPastAppointments').DataTable().destroy();
                fetch_data(doctorId, start_dateval, end_dateval);
            }
        )


        function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
            $('#getTelemedPastAppointments').DataTable({
                "ajax": {
                    data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
                    url: "operation/filterTelemed/filterPastTelemedAppointments.php",
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
                'pageLength': 25
            });


            $(function () {
                var table = $('#getTelemedPastAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'pdfHtml5'
                    ]
                }).container().appendTo($('#exportToPDF'));
            });

            $(function () {
                var table = $('#getTelemedPastAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'excelHtml5'
                    ]
                }).container().appendTo($('#exportToExcel'));
            });

            $(function () {
                var table = $('#getTelemedPastAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'csvHtml5'
                    ]
                }).container().appendTo($('#exportToCSV'));
            });

            $(function () {
                var table = $('#getTelemedPastAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'print'
                    ]
                }).container().appendTo($('#exportToPrint'));
            });

            $(function () {
                var table = $('#getTelemedPastAppointments').DataTable();
                var buttons = new $.fn.dataTable.Buttons(table, {
                    buttons: [
                        'copyHtml5'
                    ]
                }).container().appendTo($('#exportToCopy'));
            });

        }
    });


    //Beginning of Second Opinion Records 
    $('#getSecondMedicalOpinion').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        'paging': true,
        'pageLength': 10,
        'lengthChange': false,
        'searching': true,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "language": {
            "emptyTable": "No data available in table",
            "zeroRecords": "No matching records found"
        },
        "ajax": {
            url: "operation/GetSecondMedopinions.php",
            type: "POST"
        },
        aoColumns: [
            { sWidth: '15%' },
            { sWidth: '10%' },
            { sWidth: '10%' },
            { sWidth: '15%' },
            { sWidth: '15%' },
            { sWidth: '15%' },
            { sWidth: '10%' },
            { sWidth: '5%' }
        ]
    });

    //Beginning of Second Opinion Records 
    $('#getMyNetworkMembers').DataTable({
        'paging': false,
        'lengthChange': false,
        'searching': false,
        'ordering': false,
        'info': false,
        'autoWidth': false,
        "ajax": {
            url: "operation/getMyNetworkMembers.php",
            type: "POST"
        },
        aoColumns: [
            { sWidth: '1000' },
        ]
    });


    //Adding Patient Prescription

    $(document).on('submit', '#AddPatientPresc', function (event) {
        event.preventDefault();

        var appointment_id = $('#appointment_id').val();
        var doctor_id = $('#doctorId').val();
        var doc_notes = $('#doc_notes').val();
        var call_notes = $('#call_notes').val();
        var drug_name = $('#drug_name').val();
        var dosage = $('#dosage').val();
        var prescription = $('#prescription').val();
        if (doc_notes !== '') {
            $.ajax({
                url: "operation/InsertPatientPresc.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function (response) {
                    $('#AddPatientPresc')[0].reset();

                    if (response = 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Your Prescription has been successfully saved.',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                        $('#AddPatientPresc')[0].reset();
                        $('#AddPatientPresc').DataTable().ajax.reload();
                    } else {
                        $('#AddPatientPresc')[0].reset();

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
                text: 'Write a note first.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });


    /*      $(document).on('submit', '#AddPatientPresc', function(event) {

            event.preventDefault();



            var appointment_id = $('#appointment_id').val();
            var doctor_id = $('#doctorId').val();
            var doc_notes = $('#doc_notes').val();
            var call_notes = $('#call_notes').val();
            var drug_name = $('#drug_name').val();
            var dosage = $('#dosage').val();
            var prescription = $('#prescription').val();
            if (doc_notes !== '') {
                $.ajax({
                    url: "operation/SaveePatientPresc.php",
                    method: 'POST',
                    data: new FormData(this),
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        if (response = 200) {
                            $.toast({
                                heading: 'Success',
                                text: 'Your Prescription has been successfully saved.',
                                icon: 'success',
                                position: 'bottom-right',
                                showHideTransition: 'slide'
                            })
                            $('#AddPatientPresc')[0].reset();
                            $('#AddPatientPresc').DataTable().ajax.reload();
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
                    text: 'Write a note first.',
                    icon: 'warning',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
            }
        }); */




    //Update Patient Prescription
    $(document).on('submit', '#UpdatePatientPresc', function (event) {
        event.preventDefault();
        var appointment_id1 = $('#appointment_id1').val();
        var prescription_id1 = $('#prescription_id1').val();
        var doctor_id1 = $('#doctorId1').val();
        var doc_notes1 = $('#doc_notes1').val();
        var call_notes1 = $('#call_notes1').val();
        var drug_name1 = $('#drug_name1').val();
        var dosage1 = $('#dosage1').val();
        var prescription1 = $('#prescription1').val();
        if (doc_notes1 !== '') {
            $.ajax({
                url: "operation/UpdatePatientPresc.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response = 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Your Prescription has been successfully Sent.',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                        $('#UpdatePatientPresc')[0].reset();
                        $('#UpdatePatientPresc').DataTable().ajax.reload();
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
                text: 'Write a note first.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });

    //cancel upcoming appointment
    $(document).on('click', '.mark_paid', function () {
        var teleapp_id = $(this).attr("id");
        //var doctorId = $('#doctorId').val();
        // var doctorName = $('#docName').val();
        // var doctorEmail = $('#docEmail').val();
        swal({
            title: "Are You Sure?",
            text: "You Are About To Mark This Appointment As Paid, Please Note MHA Hasn't received any upfront payment on your behalf! . ",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#169815",
            confirmButtonText: "Yes, Mark As Paid",
            cancelButtonText: "Not Paid",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: "operation/markpaid_telemed_app.php",
                    method: "POST",
                    data: { teleapp_id: teleapp_id },
                    dataType: "json",
                    success: function (data) {
                        if (data == 200) {
                            swal({
                                title: "Confirmed",
                                text: "Appointment Successfully Marked As Paid!",
                                type: "success",
                                timer: 4000,
                                showConfirmButton: false
                            });
                            $('#getTelemedAppointments').DataTable().ajax.reload();

                        } else if (data == 700) {
                            swal({
                                title: "Warning",
                                text: "Sorry, the appointment has already been marked as paid.",
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


    //cancel upcoming appointment
    $(document).on('click', '.session_mark_paid', function () {
        var teleapp_id = $(this).attr("id");
        //var doctorId = $('#doctorId').val();
        // var doctorName = $('#docName').val();
        // var doctorEmail = $('#docEmail').val();
        swal({
            title: "Payment Made?",
            text: "Please note My Health Africa hasn't received any payments for this appointment on your behalf. ",

            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#169815",
            confirmButtonText: "Yes, Mark As Paid",
            cancelButtonText: "Not Paid",
            closeOnConfirm: false,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: "operation/markpaid_telemed_app.php",
                    method: "POST",
                    data: { teleapp_id: teleapp_id },
                    dataType: "json",
                    success: function (data) {
                        if (data == 200) {
                            swal({
                                title: "Confirmed",
                                text: "Appointment Successfully Marked As Paid!",
                                type: "success",
                                timer: 4000,
                                showConfirmButton: false
                            });
                            $('#getTelemedAppointments').DataTable().ajax.reload();

                        } else if (data == 700) {
                            swal({
                                title: "Warning",
                                text: "Sorry, the appointment has already been marked as paid.",
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


    //Update Patient Prescription
    $(document).on('submit', '#manual_telemed', function (event) {
        event.preventDefault();
        var doctor_id = $('#doctor_id').val();
        var service = $('#service').val();
        var first_name = $('#first_name').val();
        var last_name = $('#last_name').val();
        var patient_email = $('#patient_email').val();
        var phone_number = $('#phone_number').val();
        var app_date = $('#app_date').val();
        var app_time = $('#app_time').val();;
        if (doctor_id !== '') {
            $.ajax({
                url: "operation/manually_book_telemed_appointment.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response = 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Telemedicine Appointment Has Been Successfully Created.',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                        $('#manual_telemed')[0].reset();
                        $('#getTelemedAppointments').DataTable().ajax.reload();
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
                text: 'Input Data First.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });

    $("#telemed_daterange_btn").daterangepicker({
        ranges: daterangepicker_ranges.ranges[$("#appt_status_filter_btn_text").attr("data-filter")],
        maxDate: daterangepicker_ranges.limits[$("#appt_status_filter_btn_text").attr("data-filter")].max,
        minDate: daterangepicker_ranges.limits[$("#appt_status_filter_btn_text").attr("data-filter")].min,
    }, function (start, end) {
        $('#telemed_appts_range').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        const start_date = start.format("YYYY-MM-DD"), end_date = end.format("YYYY-MM-DD");

        fetch_data(start_date, end_date);
    });

    function fetch_data(start, end) {
        const appointment_status_filter = $("#appt_status_filter_btn_text").attr("data-filter");
        $("#getTelemedAppointments").DataTable().destroy();

        $("#getTelemedAppointments").DataTable({
            ajax: {
                url: "operation/getTelemedicineAppointments.php",
                method: "POST",
                data: { "appointments_status": appointment_status_filter, "token": csrf_token, "date_from": start, "date_to": end },
            },
            ...datatable_options,
        });
    }

    $(".filter-by-appt-status").on("click", function () {
        const appointments_status = $(this).attr("data-status"),
            [date_from, date_to] = get_appt_date_filter();

        $("#appt_status_filter_btn_text").attr("data-filter", appointments_status).text(`${$(this).text()} telemedicine appointments`);
        $("#page_header").text(`${$(this).text()} Telemedicine Appointments`);

        $("#telemed_daterange_btn").daterangepicker({
            ranges: daterangepicker_ranges.ranges[appointments_status],
            maxDate: daterangepicker_ranges.limits[appointments_status].max,
            minDate: daterangepicker_ranges.limits[appointments_status].min,
        }, function (start, end) {
            $('#telemed_appts_range').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            const start_date = start.format("YYYY-MM-DD"), end_date = end.format("YYYY-MM-DD");

            fetch_data(start_date, end_date);
        });

        fetch_data(date_from, date_to);
    });

    function get_appt_date_filter() {
        /**
         * checks if date filter has been set to pick date range values
         */
        return $("#telemed_appts_range").text() == "Filter by Date" ? ["", ""] : $("#telemed_appts_range").text().split(" - ");
    }
});
