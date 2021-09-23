$(function() {

    var doctorPostId = $('#doctorPostId').val();
    var aff = $('#aff').val();
    var role = $('#role').val();


    $('#ePrescriptions').DataTable({
        "ajax": {
            data: { doctorPostId: doctorPostId, aff: aff, role: role },
            url: "operation/getEPrescriptions.php",
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
    });

    $(function() {
        var table = $('#ePrescriptions').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'pdfHtml5'
            ]
        }).container().appendTo($('#exportToPDF'));
    });

    $(function() {
        var table = $('#ePrescriptions').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'excelHtml5'
            ]
        }).container().appendTo($('#exportToExcel'));
    });

    $(function() {
        var table = $('#ePrescriptions').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'csvHtml5'
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function() {
        var table = $('#ePrescriptions').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'printHtml5'
            ]
        }).container().appendTo($('#exportToPrint'));
    });

    $(function() {
        var table = $('#ePrescriptions').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'copyHtml5'
            ]
        }).container().appendTo($('#exportToCopy'));
    });
    
    //View prescription modal
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
        "ajax": {
            data: { prescriptionNo: prescriptionNo },
            url: "operation/getPrescribedDrug.php",
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
                orderable: false,
                targets:   0
            } ],
            'pageLength': 10,
            'paging': false,
            'lengthChange': false,
            'searching': false,
            'ordering': false,
            'info': false,
            'autoWidth': false
    });

 });

$('#prescription_details').on('hidden.bs.modal', function() {
    $('#prescribedDrugs').dataTable().fnDestroy();
});

// prevent unauthorized users from viewing prescriptions
$(document).ready(function(){
    
    $('#unauthorized').width($('.table-scrollable').outerWidth()).height($(window).height() - $('.card-body').offset().top - 25);

    $.ajax({
        url: "operation/getDoctorPrescriptionAuthorizationStatus.php",
        method: 'POST',
        data: { doctorPostId: doctorPostId },
        dataType: "json",
		success: function(data) {
		    if (data == "unauthorized") {
                $('html, body').css('overflow', 'hidden');
                $('#unauthorized').css('display', 'flex');
		    }
		},
		error: function(error) {
		    console.log(error);
		}

	});
});

$(window).on('resize', function() {
    $('#unauthorized').width($('.table-scrollable').outerWidth()).height($(window).height() - $('.card-body').offset().top - 25);
});

});


$(function() {
var start_dateval, end_dateval;

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

            [startDate, endDate] = $('#eprescription_range').val().split(' - ');
            $(this).find('input[name="start_date"]').val(startDate);
            $(this).find('input[name="end_date"]').val(endDate);

            $start = $('#start_date').val();
            $end = $('#end_date').val();
            start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
            end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");

        var doctorPostId = $('#doctorPostId').val();
        $('#ePrescriptions').DataTable().destroy();
        fetch_data(doctorPostId, start_dateval, end_dateval);
        }
    )


    function fetch_data(doctorPostId, start_dateval = '', end_dateval = '') {
      
          $('#ePrescriptions').DataTable( {
             "ajax": {
                data: { doctorPostId: doctorPostId, start_dateval: start_dateval, end_dateval: end_dateval },
                url: "operation/getFilteredePrescriptions.php",
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
            var table = $('#ePrescriptions').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'pdfHtml5'
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function() {
            var table = $('#ePrescriptions').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'excelHtml5'
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function() {
            var table = $('#ePrescriptions').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'csvHtml5'
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function() {
            var table = $('#ePrescriptions').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'print'
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function() {
            var table = $('#ePrescriptions').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'copyHtml5'
                ]
            }).container().appendTo($('#exportToCopy'));
        });

    }
    
});
