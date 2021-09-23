$(function() {
    var doctorId = $('#doctorId').val();
    //My Patients
    $('#myDiagnosticRecs').DataTable({
        "ajax": {
            data: { doctorId: doctorId },
            url: "operation/getMyDiagnosticRecs.php",
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
        var table = $('#myDiagnosticRecs').DataTable();
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
        var table = $('#myDiagnosticRecs').DataTable();
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
        var table = $('#myDiagnosticRecs').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'csvHtml5'
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function() {
        var table = $('#myDiagnosticRecs').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'printHtml5'
            ]
        }).container().appendTo($('#exportToPrint'));
    });

    $(function() {
        var table = $('#myDiagnosticRecs').DataTable();
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


$(function() {
    var doctorId = $('#doctorId').val();
    //My Patients
    $('#diagnosticsReports').DataTable({
        "ajax": {
            data: { doctorId: doctorId },
            url: "operation/getdiagnosticsreports.php",
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
        var table = $('#diagnosticsReports').DataTable();
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
        var table = $('#diagnosticsReports').DataTable();
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
        var table = $('#diagnosticsReports').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'csvHtml5'
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function() {
        var table = $('#diagnosticsReports').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'printHtml5'
            ]
        }).container().appendTo($('#exportToPrint'));
    });

    $(function() {
        var table = $('#diagnosticsReports').DataTable();
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


var start_dateval, end_dateval;
$(function() {

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
            $('#diagnosticsReports').DataTable().destroy();
            fetch_data(doctorId, start_dateval, end_dateval);
        }

    )

      $(document).on('click', '.applyBtn', function() {
        var doctorId = $('#doctorId').val();
        $('#diagnosticsReports').DataTable().destroy();
        fetch_data(doctorId, start_dateval, end_dateval);

    });

    function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
          $('#diagnosticsReports').DataTable({
            "ajax": {
                data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
                url: "operation/getfiltereddiagnosticsreports.php", //change to filter url
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
            var table = $('#diagnosticsReports').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'pdfHtml5'
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function() {
            var table = $('#diagnosticsReports').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'excelHtml5'
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function() {
            var table = $('#diagnosticsReports').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'csvHtml5'
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function() {
            var table = $('#diagnosticsReports').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'printHtml5'
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function() {
            var table = $('#diagnosticsReports').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'copyHtml5'
                ]
            }).container().appendTo($('#exportToCopy'));
        });


    }

});



 //View Pharmacist prescription modal
    $(document).on('click', '.view_diahnosticrsult', function() {
        var diagnostic_no = $(this).attr("id");
        $.ajax({
            url: "operation/getDiagnosticDetails.php",
            method: "POST",
            data: { diagnostic_no: diagnostic_no },
            dataType: "json",
            success: function(data) {
                $('#view_diahnosticrsult').modal('show');
                $('#diagnostic_number').html(data.dg_number);
                $('#date').html(data.date_added);
                $('#sent_by').html(data.access);
              //  $('#prescription_date').html(data.date_added);
               // $('#prescription_validity').html(data.validity);
            }

        });

        $('#RequestedTests').DataTable({
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
                data: { diagnostic_no: diagnostic_no },
                url: "operation/getPrescribedTestsResults.php",
                type: "POST"
            },
            aoColumns: [
                { sWidth: '30%' },
                { sWidth: '40%' },
                { sWidth: '40%' }

            ]
        });

    });

    
        $('#view_diahnosticrsult').on('hidden.bs.modal', function() {
        $('#RequestedTests').dataTable().fnDestroy();
    });
  