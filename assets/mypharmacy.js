$(function() {
    var doctorId = $('#doctorId').val();
    var start_dateval, end_dateval;
    //My Patients
    $('#myPharmacyRecs').DataTable({
        "ajax": {
            data: { doctorId: doctorId },
            url: "operation/getMyPharmacyRecs.php",
            type: "POST"
        },
        responsive: {
                details: {
                    type: 'inline',
                    target: 0
                }
            },
            columnDefs: [ {
                className: 'control',
                orderable: true,
                targets:   0
            } ],
            'pageLength': 25,
    });

    $(function() {
        var table = $('#myPharmacyRecs').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4,5 ]
                }
                },
            ]
        }).container().appendTo($('#exportToPDF'));
    });

    $(function() {
        var table = $('#myPharmacyRecs').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                 {
                extend: 'copyHtml5',
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4,5 ]
                }
                },
            ]
        }).container().appendTo($('#exportToExcel'));
    });

    $(function() {
        var table = $('#myPharmacyRecs').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'csvHtml5'
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function() {
        var table = $('#myPharmacyRecs').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'printHtml5'
            ]
        }).container().appendTo($('#exportToPrint'));
    });

    $(function() {
        var table = $('#myPharmacyRecs').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'copyHtml5'
            ]
        }).container().appendTo($('#exportToCopy'));
    });

    
    
       $('#daterange-pharmacy-btn').daterangepicker({
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
        function(start, end) {
            $('#daterange-pharmacy-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            [startDate, endDate] = $('#pharmacy_range').val().split(' - ');
            $(this).find('input[name="start_date"]').val(startDate);
            $(this).find('input[name="end_date"]').val(endDate);

            $start = $('#start_date').val();
            $end = $('#end_date').val();
            start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
            end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");
            var doctorId = $('#doctorId').val();
            $('#myPharmacyRecs').DataTable().destroy();
            fetch_data(doctorId, start_dateval, end_dateval);
            
            var doctorId = $('#doctorId').val();
            $('#myPharmacyRecs').DataTable().destroy();
            fetch_data(doctorId, start_dateval, end_dateval);
        }

    )

    function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
          $('#myPharmacyRecs').DataTable({
            "ajax": {
                data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
                url: "operation/getFilteredPharmacyRecs.php",
                type: "POST"
            },
           responsive: {
                details: {
                    type: 'inline',
                    target: 0
                }
            },
            columnDefs: [ {
                className: 'control',
                orderable: true,
                targets:   0
            } ],
            'pageLength': 25,
        });
        
        $(function() {
            var table = $('#myPharmacyRecs').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'pdfHtml5'
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function() {
            var table = $('#myPharmacyRecs').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'excelHtml5'
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function() {
            var table = $('#myPharmacyRecs').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'csvHtml5'
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function() {
            var table = $('#myPharmacyRecs').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'printHtml5'
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function() {
            var table = $('#myPharmacyRecs').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'copyHtml5'
                ]
            }).container().appendTo($('#exportToCopy'));
        });


    }
    
    
});

//My patients view click event
$(document).on('click', '.view_patient', function() {
    var patientId = $(this).attr("id");
    var doctorId = $('#doctorId').val();
    localStorage.setItem("pat_id", patientId);
    localStorage.setItem("doc_id", doctorId);
    window.location = 'patient-profile';

});


    //View Pharmacist prescription modal
    $(document).on('click', '.view_prescription', function() {
        var prescriptionNo = $(this).attr("id");
        $.ajax({
            url: "operation/getPrescriptionDetails.php",
            method: "POST",
            data: { prescriptionNo: prescriptionNo },
            dataType: "json",
            success: function(data) {
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
                { sWidth: '35%' },
                { sWidth: '15%' },
                { sWidth: '40%' },
                { sWidth: '10%' }

            ]
        });

    });
    
    
    
    	
 //Pharmacist Mark Prescription As fullfilled
    $(document).on('click', '.mark_administered', function() {
        var Prescriptionid = $(this).attr("id");
        
                $.ajax({
                    url: "operation/MarkPrescriptionFullfilled.php",
                    method: "POST",
                    data: { Prescriptionid: Prescriptionid},
					                  //	dataType: "json",

							success: function(response) {
								if (response = 200) {
									$.toast({
										//width:'100px';
										heading: 'Success',
										text: 'The Prescription has successfully been Fullfilled.',
										icon: 'success',
										position: 'bottom-right',
										showHideTransition: 'slide'
									})
                                    $('#prescribedDrugs').DataTable().ajax.reload();
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
                 

                })

    });
    
    
    
    $(function() {
    var doctorId = $('#doctorId').val();
    //My Patients
 $('#PharmacyReports').DataTable({
        "ajax": {
            data: { doctorId: doctorId },
            url: "operation/getMyPharmacyReports.php",
            type: "POST"
        },
        responsive: {
                details: {
                    type: 'inline',
                    target: 0
                }
            },
            columnDefs: [ {
                className: 'control',
                orderable: true,
                targets:   0
            } ],
            'pageLength': 25,
    });

    $(function() {
        var table = $('#PharmacyReports').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4,5 ]
                }
                },
            ]
        }).container().appendTo($('#exportToPDF'));
    });

    $(function() {
        var table = $('#PharmacyReports').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                 {
                extend: 'copyHtml5',
                exportOptions: {
                    columns: [ 0, 1, 2, 3, 4,5 ]
                }
                },
            ]
        }).container().appendTo($('#exportToExcel'));
    });

    $(function() {
        var table = $('#PharmacyReports').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'csvHtml5'
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function() {
        var table = $('#PharmacyReports').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'printHtml5'
            ]
        }).container().appendTo($('#exportToPrint'));
    });

    $(function() {
        var table = $('#PharmacyReports').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'copyHtml5'
            ]
        }).container().appendTo($('#exportToCopy'));
    });


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
            startDate: moment().subtract(29, 'days'),
            endDate: moment()
        },
        function(start, end) {
            $('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            [startDate, endDate] = $('#freports_range').val().split(' - ');
            $(this).find('input[name="start_date"]').val(startDate);
            $(this).find('input[name="end_date"]').val(endDate);

            $start = $('#start_date').val();
            $end = $('#end_date').val();
            start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
            end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");

        var doctorId = $('#doctorId').val();
        $('#PharmacyReports').DataTable().destroy();
        fetch_data(doctorId, start_dateval, end_dateval);
        }
    )


    function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
      
          $('#PharmacyReports').DataTable( {
             "ajax": {
                data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
                url: "operation/getFilteredPharmacyReports.php",
                type: "POST"
            },
            responsive: {
                details: {
                    type: 'inline',
                    target: 0
                }
            },
            columnDefs: [ {
                className: 'control',
                orderable: true,
                targets:   0
            } ],
            'pageLength': 25
        } );

        $(function() {
            var table = $('#PharmacyReports').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'pdfHtml5'
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function() {
            var table = $('#PharmacyReports').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'excelHtml5'
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function() {
            var table = $('#PharmacyReports').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'csvHtml5'
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function() {
            var table = $('#PharmacyReports').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'print'
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function() {
            var table = $('#PharmacyReports').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'copyHtml5'
                ]
            }).container().appendTo($('#exportToCopy'));
        });

    }

    
});


   
    
    
    $('#prescription_details').on('hidden.bs.modal', function() {
        $('#prescribedDrugs').dataTable().fnDestroy();
    });
    
     
    // $('#prescribedDrugs').on('hidden.bs.modal', function() {
    //     $('#prescribedDrugs').dataTable().fnDestroy();
    // });