                   
//mark all new messages as read
	$(document).on('click', '.markAllRead', function() {
		var id = $(this).attr("id");
		$.ajax({
			url: "operation/readAllText.php",
			method: "POST",
			data: {
				id: id
			},
			dataType: "json",
            success: function (data) {
                   if (data == 200) {
                $.toast({
                    heading: 'Success',
                    text: 'All Messages Marked as read.',
                    icon: 'success',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
                }
			}
		});
    });
    $(document).on('click', '.closetextnote', function() {
                    // $('#unreadtext').toggle("slow");
                    // $(".markAllRead").load(" .markAllRead > *");
                    // $("#unreadtext").load(" #unreadtext > *");
                    $("#navbarnotifications").load(" #navbarnotifications > *");
            });
    

    //mark all notifications as seen
    	$(document).on('click', '.readAll', function() {
            var id = $(this).attr("id");
		$.ajax({
			url: "operation/readAllNotifications.php",
			method: "POST",
			data: {
				id: id
			},
			dataType: "json",
            success: function (data) {
                   if (data == 200) {
                $.toast({
                    heading: 'Success',
                    text: 'All Notifications marked as seen.',
                    icon: 'success',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
                }
			}
        });    
        });
            $(document).on('click', '.readAll', function() {
                var timeoutID = window.setTimeout(function () {
                    // $('#notification').toggle("slow");
                    // $(".readAll").load(" .readAll > *");
                    $("#navbarnotifications").load(" #navbarnotifications > *");
                 }, 60000);
            });
//     $(document).ready(function() {
// 	var check_notifications = setInterval(function (){
//                     // $('#notification').toggle("slow");
//                     // $(".readAll").load(" .readAll > *");
//                     $("#navbarnotifications").load(" #navbarnotifications > *");
//                  },50000);
//     });

    //refresh navbar when message modal closes
    $(document).on("click", function(event){
        var $trigger = $(".markAllRead");
        if($trigger !== event.target && !$trigger.has(event.target).length){
            $("#navbarnotifications").load(" #navbarnotifications > *");
        }           
    });

    //refresh navbar when a the notification modal closes
     $(document).on("click", function(event){
        var $trigger = $(".readAll");
        if($trigger !== event.target && !$trigger.has(event.target).length){
            $("#navbarnotifications").load(" #navbarnotifications > *");
        }    
     });

    
//     //form hide and show
// const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// const phoneNumber = /^\d{10}$/;
// $("#btnshare").click(function () {
//     $("#shareForm").toggle("slow");
//     $("#stopsharebtn").toggle("slow");
//     $("#btnshare").toggle("slow");
//     $("#saveshare").toggle("slow");
//     $("#previewform").toggle("slow");
//     return false;
// });

// //form hide and show
// $("#stopsharebtn").click(function () {
//     $("#shareForm").toggle("slow");
//     $("#stopsharebtn").toggle("slow");
//     $("#btnshare").toggle("slow");
//     $("#saveshare").toggle("slow");
//     $("#previewform").toggle("slow");

//     return false;
// });

// //selecting share medial
// function selectMedia(that) {
//     if (that.value == "phone") {
//         document.getElementById("phoneshare").style.display = "block";
//         document.getElementById("emailshare").style.display = "none";
//     } else if (that.value == "email") {
//         document.getElementById("phoneshare").style.display = "none";
//         document.getElementById("emailshare").style.display = "block";

//     } else if (that.value == '') {
//         document.getElementById("phoneshare").style.display = "none";
//         document.getElementById("emailshare").style.display = "none";
//     }
// }

// //sharing feedback form
// $(document).on('submit', '#sendingFormShare', function (event) {
//     event.preventDefault();
//     $.ajax({
//         url: "operation/sendform.php",
//         method: 'POST',
//         data: new FormData(this),
//         contentType: false,
//         processData: false,
//         success: function (data) {
//             if (data == 200) {
//                 $.toast({
//                     heading: 'Success',
//                     text: 'Thank you! Your Form successfully shared.',
//                     icon: 'success',
//                     position: 'bottom-right',
//                     showHideTransition: 'slide'
//                 })
//                 $('#sendingFormShare')[0].reset();
//                 $('#formshare').modal('hide');
//                 $('#myFeedbackShareHistory').DataTable().ajax.reload();
//             } else {
//                 $.toast({
//                     heading: 'Error',
//                     text: 'Something went wrong, please try again.',
//                     icon: 'error',
//                     position: 'bottom-right',
//                     showHideTransition: 'slide'
//                 })
//             }
//         }
//     });
// });

// //viewing the feedback form
// $(document).ready(function () {
//     var doctor_id = $('#doctor_id').val();
//     $('#responsesTable').DataTable({
//         "ajax": {
//             data: { doctor_id: doctor_id },
//             url: "operation/getResponsesTable.php",
//             type: "POST"
//         },
//         responsive: {
//             details: {
//                 type: 'inline',
//                 target: 0
//             }
//         },
//         columnDefs: [{
//             className: 'control',
//             orderable: true,
//             targets: 0
//         }],
//         'pageLength': 10,
//         'searching': true,
//         'info': true,
//         'paging': true,
//         'lengthChange': true

//     });
// });


// //submitting feedback response
// $(document).on('submit', '#submittingFeedback', function (event) {
//     event.preventDefault();
//     (function($) {
//     $.fn.buttonLoader = function(action) {
//       var self = $(this);
//       //start loading animation
//       if (action == 'start') {
//         if ($(self).attr("disabled") == "disabled") {
//           e.preventDefault();
//         }
//         //disable buttons when loading state
//         $('.has-spinner').attr("disabled", "disabled");
//         $(self).attr('data-btn-text', $(self).text());
//         //binding spinner element to button and changing button text
//         $(self).html('<span class="spinner"><i class="fa fa-spinner fa-spin"></i></span>Loading');
//         $(self).addClass('active');
//       }
//       //stop loading animation
//       if (action == 'stop') {
//         $(self).html($(self).attr('data-btn-text'));
//         $(self).removeClass('active');
//         //enable buttons after finish loading
//         $('.has-spinner').removeAttr("disabled");
//       }
//     }
//   })(jQuery);
//     $.ajax({
//         url: "operation/submitResponse.php",
//         method: 'POST',
//         data: new FormData(this),
//         contentType: false,
//         processData: false,
//         success: function (data) {
//             if (data == 200) {
//                 $.toast({
//                     heading: 'Success',
//                     text: 'Thank you! Your response has been submitted successfully.',
//                     icon: 'success',
//                     position: 'bottom-right',
//                     showHideTransition: 'slide'
//                 })
//                 $('#submittingFeedback')[0].reset();
//                 $('#myFeedbackResponseHistory').DataTable().ajax.reload();
//                 $('#line_chart').DataTable().ajax.reload();
//             } else {
//                 $.toast({
//                     heading: 'Error',
//                     text: 'Something went wrong, please try again.',
//                     icon: 'error',
//                     position: 'bottom-right',
//                     showHideTransition: 'slide'
//                 })
//             }
//         }
//     });
// });

// //rating graph
// $(document).ready(function() {
//     var facility_id = $('#facility_id').val();
//     var feedback = 'feedback_stats';
//     var feed_count = [];
//     var gragh_labels = [];
//     $.ajax({
//         url: "operation/getRatingGraph.php",
//         method: "POST",
//         data: { facility_id: facility_id, operation: feedback },
//         dataType: "json",
//         success: function(result) {
//             for (var i in result) {
//                 feed_count.push(result[i].feedback_count);
//                 gragh_labels.push(result[i].feedback_month);
//             }
//             drawGraph()
//         }
//     });

//     function drawGraph() {
//         var color = Chart.helpers.color;
//         var barChartData = {
//             labels: gragh_labels,
//             datasets: [{
//                 label: 'Average rating',
//                 backgroundColor: color(window.chartColors.grey).alpha(0.5).rgbString(),
//                 borderColor: window.chartColors.grey,
//                 borderWidth: 1,
//                 data: feed_count
//             }]

//         };

//         var ctx = document.getElementById("line_chart").getContext("2d");
//         window.myBar = new Chart(ctx, {
//             type: 'bar',
//             data: barChartData,
//             options: {
//                 responsive: true,
//                 legend: {
//                     position: 'top',
//                 },
//                 title: {
//                     display: true,
//                     text: 'Patient Feedback Request in the last 1 year'
//                 },
//                 tooltips: {
//                     mode: 'index',
//                     intersect: false,
//                 },
//                 hover: {
//                     mode: 'nearest',
//                     intersect: true
//                 },
//                 scales: {
//                     xAxes: [{
//                         display: true,
//                         scaleLabel: {
//                             display: true,
//                             labelString: 'MONTH'
//                         }
//                     }],
//                     yAxes: [{
//                         display: true,
//                         scaleLabel: {
//                             display: true,
//                             labelString: 'AVERAGE RATING'
//                         }
//                     }]
//                 }
//             }
//         });
//     }

// });


// //view patient responses
// $(document).ready(function () {
//     var doctor_id = $('#doctor_id').val();
//     $('#myPatientResponsesTable').DataTable({
//         "ajax": {
//             data: { doctor_id: doctor_id },
//             url: "operation/getMyPatientResponses.php",
//             type: "POST"
//         },
//         responsive: {
//             details: {
//                 type: 'inline',
//                 target: 0
//             }
//         },
//         columnDefs: [{
//             className: 'control',
//             orderable: true,
//             targets: 0
//         }],
//         'pageLength': 10,
//         'searching': true,
//         'info': true,
//         'paging': true,
//         'lengthChange': true

//     });
// });
// //total feedback share count
// $(function () {
//     var doctor_id = $('#doctor_id').val();
//     $.ajax({
//         url: "operation/getMyFeedbackStatistics.php",
//         method: "POST",
//         data: { doctor_id: doctor_id },
//         dataType: "json",
//         success: function (result) {
//             $("#total_feedback_send").attr('disabled', false);
//             $.each(result, function (i) {
//                 $('#total_feedback_send').text(result[i].total_feedback_send);
//             });
//         },
//         failure: function () {
//             $.toast({
//                 heading: 'Error',
//                 text: 'Something went wrong, please try again.',
//                 icon: 'error',
//                 position: 'bottom-right',
//                 showHideTransition: 'slide'
//             })
//         }
//     });
// });

// //total feedback share count
// $(function () {
//     var doctor_id = $('#doctor_id').val();
//     $.ajax({
//         url: "operation/getMyFeedbackReplyStatistics.php",
//         method: "POST",
//         data: { doctor_id: doctor_id },
//         dataType: "json",
//         success: function (result) {
//             $("#reply_count_total").attr('disabled', false);
//             $.each(result, function (i) {
//                 $('#reply_count_total').text(result[i].reply_count_total);
//             });
//         },
//         failure: function () {
//             $.toast({
//                 heading: 'Error',
//                 text: 'Something went wrong, please try again.',
//                 icon: 'error',
//                 position: 'bottom-right',
//                 showHideTransition: 'slide'
//             })
//         }
//     });
// });

// //monthly feedback share count
// $(function () {
//     var doctor_id = $('#doctor_id').val();
//     $.ajax({
//         url: "operation/getMyMonthlyFeedbackStatistics.php",
//         method: "POST",
//         data: { doctor_id: doctor_id },
//         dataType: "json",
//         success: function (result) {
//             $.each(result, function (i) {
//                 $('#sharings').append('<span  class="info-box-text" style="font-size:13px">Last 30 days : ' + result[i].month_counting + '</span><br/>')
//                 $('#month').text();

//             });

//         },
//         failure: function () {
//             $.toast({
//                 heading: 'Error',
//                 text: 'Something went wrong, please try again.',
//                 icon: 'error',
//                 position: 'bottom-right',
//                 showHideTransition: 'slide'
//             })
//         }
//     });
// });


// //monthly feedback reply count
// $(function () {
//     var doctor_id = $('#doctor_id').val();
//     $.ajax({
//         url: "operation/getMyResponseFeedbackReplyStatistics.php",
//         method: "POST",
//         data: { doctor_id: doctor_id },
//         dataType: "json",
//         success: function (result) {
//             $.each(result, function (i) {
//                 $('#recieved_replies').append('<span  class="info-box-text" style="font-size:13px">Last 30 days: ' + result[i].reply_counting + '</span><br/>')
//                 $('#monthly').text();
//             });

//         },
//         failure: function () {
//             $.toast({
//                 heading: 'Error',
//                 text: 'Something went wrong, please try again.',
//                 icon: 'error',
//                 position: 'bottom-right',
//                 showHideTransition: 'slide'
//             })
//         }
//     });
// });

// //viewing the feedback form share history
// $(document).ready(function () {
//     var doctor_id = $('#doctor_id').val();
//     $('#myFeedbackShareHistory').DataTable({
//         "ajax": {
//             data: { doctor_id: doctor_id },
//             url: "operation/getFeedbackShareHistory.php",
//             type: "POST"
//         },
//         responsive: {
//             details: {
//                 type: 'inline',
//                 target: 0
//             }
//         },
//         columnDefs: [{
//             className: 'control',
//             orderable: true,
//             targets: 0
//         }],
//         'pageLength': 10,
//         'searching': true,
//         'info': true,
//         'paging': true,
//         'lengthChange': true

//     });
// });

// //viewing the feedback form patient responses
// $(document).ready(function () {
//     var doctor_id = $('#doctor_id').val();
//     $('#myFeedbackResponseHistory').DataTable({
//         "ajax": {
//             data: { doctor_id: doctor_id },
//             url: "operation/getFeedbackrResponseHistory.php",
//             type: "POST"
//         },
//         responsive: {
//             details: {
//                 type: 'inline',
//                 target: 0
//             }
//         },
//         columnDefs: [{
//             className: 'control',
//             orderable: true,
//             targets: 0
//         }],
//         'pageLength': 10,
//         'searching': true,
//         'info': true,
//         'paging': true,
//         'lengthChange': true

//     });

//     $(function() {
//         var table = $('#myFeedbackResponseHistory').DataTable();
//         var buttons = new $.fn.dataTable.Buttons(table, {
//             buttons: [
//                 { extend: 'pdfHtml5', exportOptions: {columns: [ 0, 1, 2, 3, 4]}},
//             ]
//         }).container().appendTo($('#exportToPDF'));
//     });

//     $(function() {
//         var table = $('#myFeedbackResponseHistory').DataTable();
//         var buttons = new $.fn.dataTable.Buttons(table, {
//             buttons: [
//                 { extend: 'excelHtml5', exportOptions: {columns: [ 0, 1, 2, 3, 4]}},
//             ]
//         }).container().appendTo($('#exportToExcel'));
//     });

//     $(function() {
//         var table = $('#myFeedbackResponseHistory').DataTable();
//         var buttons = new $.fn.dataTable.Buttons(table, {
//             buttons: [
//                 { extend: 'csvHtml5', exportOptions: {columns: [ 0, 1, 2, 3, 4]}},
//             ]
//         }).container().appendTo($('#exportToCSV'));
//     });

//     $(function() {
//         var table = $('#myFeedbackResponseHistory').DataTable();
//         var buttons = new $.fn.dataTable.Buttons(table, {
//             buttons: [
//                 { extend: 'csvHtml5', exportOptions: {columns: [ 0, 1, 2, 3, 4]}},
//             ]
//         }).container().appendTo($('#exportToPrint'));
//     });

//     $(function() {
//         var table = $('#myFeedbackResponseHistory').DataTable();
//         var buttons = new $.fn.dataTable.Buttons(table, {
//             buttons: [
//                 { extend: 'csvHtml5', exportOptions: {columns: [ 0, 1, 2, 3, 4]}},
//             ]
//         }).container().appendTo($('#exportToCopy'));
//     });

//         $('#daterange-btn').daterangepicker({
//             ranges: {
//                 'Today': [moment(), moment()],
//                 'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
//                 'Next 7 Days': [moment(), moment().add(6, 'days')],
//                 'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//                 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
//                 'This Month': [moment().startOf('month'), moment().endOf('month')],
//                 'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
//                 'Next 3 Months': [moment().add(1, 'month').startOf('month'), moment().add(3, 'month').endOf('month')]
//             }
//         },
//         function(start, end) {
//             $('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

//             [startDate, endDate] = $('#appointments_range').val().split(' - ');
//             $(this).find('input[name="start_date"]').val(startDate);
//             $(this).find('input[name="end_date"]').val(endDate);

//             $start = $('#start_date').val();
//             $end = $('#end_date').val();
//             start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
//             end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");

//             var doctorId = $('#doctorId').val();
//             var aff = $('#aff').val();
//             var role = $('#role').val();
    
//             $('#myFeedbackResponseHistory').DataTable().destroy();
//             fetch_data(doctorId, start_dateval, end_dateval, aff, role);

//         }
//     )

// });

// function goBack() {
//     window.history.back();
// }
// function printPage() {
//     var divContents = document.getElementById("responding").innerHTML;
//     var a = window.open('', '', 'height=1000, width=1000');
//     a.document.write('<html>');
//     a.document.write('<body >');
//     a.document.write(divContents);
//     a.document.write('</body></html>');
//     a.document.close();
//     a.print();
// }


// $(document).on('click', '.responseModalViewing', function () {
//     var token = $(this).attr("token");
//     var id = $(this).attr("id");
//     $.ajax({
//         url: "operation/viewResponseModal.php",
//         method: "POST",
//         data: { token: token,id:id },
//         dataType: "json",
//         success: function (data) {
//             $('#responseModalViewing').modal('show');
//             $('#username').html(data.username);
//             $('#remarks').html(data.comment);
//             if (data.rate == '5') {
//                 document.getElementById("rating1").style.display = 'block';
//                 document.getElementById("rating2").style.display = 'none';
//                 document.getElementById("rating3").style.display = 'none';
//                 document.getElementById("rating4").style.display = 'none';
//                 document.getElementById("rating5").style.display = 'none';
//             } else if (data.rate == '4') {
//                 document.getElementById("rating1").style.display = 'none';
//                 document.getElementById("rating2").style.display = 'block';
//                 document.getElementById("rating3").style.display = 'none';
//                 document.getElementById("rating4").style.display = 'none';
//                 document.getElementById("rating5").style.display = 'none';
//             } else if (data.rate == '3') {
//                 document.getElementById("rating1").style.display = 'none';
//                 document.getElementById("rating2").style.display = 'none';
//                 document.getElementById("rating3").style.display = 'block';
//                 document.getElementById("rating4").style.display = 'none';
//                 document.getElementById("rating5").style.display = 'none';
//             } else if (data.rate == '2') {
//                 document.getElementById("rating1").style.display = 'none';
//                 document.getElementById("rating2").style.display = 'none';
//                 document.getElementById("rating3").style.display = 'none';
//                 document.getElementById("rating4").style.display = 'block';
//                 document.getElementById("rating5").style.display = 'none';
//             } else if (data.rate == '1') {
//                 document.getElementById("rating1").style.display = 'none';
//                 document.getElementById("rating2").style.display = 'none';
//                 document.getElementById("rating3").style.display = 'none';
//                 document.getElementById("rating4").style.display = 'none';
//                 document.getElementById("rating5").style.display = 'block';
//             }
//         }
//     });
// });




// $(document).on('click', '.responseViewing', function () {
//     var token = $(this).attr("token");
//     var id = $(this).attr("id");
//     $.ajax({
//         url: "operation/viewShareResponseModal.php",
//         method: "POST",
//         data: { token: token},
//         dataType: "json",
//         success: function (data) {
//             $('#responseViewing').modal('show');
//             $('#username').html(data.username);
//             $('#remarks').html(data.comment);
//             if (data.rate == '5') {
//                 document.getElementById("rating11").style.display = 'block';
//                 document.getElementById("rating22").style.display = 'none';
//                 document.getElementById("rating33").style.display = 'none';
//                 document.getElementById("rating44").style.display = 'none';
//                 document.getElementById("rating55").style.display = 'none';
//             } else if (data.rate == '4') {
//                 document.getElementById("rating11").style.display = 'none';
//                 document.getElementById("rating22").style.display = 'block';
//                 document.getElementById("rating33").style.display = 'none';
//                 document.getElementById("rating44").style.display = 'none';
//                 document.getElementById("rating55").style.display = 'none';
//             } else if (data.rate == '3') {
//                 document.getElementById("rating11").style.display = 'none';
//                 document.getElementById("rating22").style.display = 'none';
//                 document.getElementById("rating33").style.display = 'block';
//                 document.getElementById("rating44").style.display = 'none';
//                 document.getElementById("rating55").style.display = 'none';
//             } else if (data.rate == '2') {
//                 document.getElementById("rating11").style.display = 'none';
//                 document.getElementById("rating22").style.display = 'none';
//                 document.getElementById("rating33").style.display = 'none';
//                 document.getElementById("rating44").style.display = 'block';
//                 document.getElementById("rating55").style.display = 'none';
//             } else if (data.rate == '1') {
//                 document.getElementById("rating11").style.display = 'none';
//                 document.getElementById("rating22").style.display = 'none';
//                 document.getElementById("rating33").style.display = 'none';
//                 document.getElementById("rating44").style.display = 'none';
//                 document.getElementById("rating55").style.display = 'block';
//             }
//         }
//     });
// });


// $(document).ready(function () {
//     $('.show-services-share, #select-age-share, #singler, .show-range, #singlesharing, .exceptions, .show-gender-filter, .show-app-filter, #select-gender, #select-age, .choose-recipients, .recipients_corner,  #saveAsTemplate, .check-time, #schedule-time,#advanced').hide();
// });


        
// $(document).ready(function () {
//     function selectedService() {
//         if (document.getElementById("services").checked) {
//              document.getElementById("all-contacts-share").checked = false;
//             $('.show-services-share').show(500);
//             $('.check-time').show(500);
//         } else {
//             $('.show-services-share').hide(500);
//             $('#facility_services_shared').val('');
//         }
//     }

//      function ageFeedback() {
//         if (document.getElementById("feedbackage").checked) {
//              document.getElementById("all-contacts-share").checked = false;
//             $('#select-age-share').show(500);
//             $('.check-time').show(500);
//         } else {
//             $('#select-age-share').hide(500);
//             $('#age_from_share').val('');
//             $('#age_to_share').val('');
//         }
//     }

//     function contactsFeedback() {
//         if (document.getElementById("contacts-by-time-share").checked) {
//              document.getElementById("all-contacts-share").checked = false;
//             $('.show-range').show(500);
//             $('.check-time').show(500);
//         } else {
//             $('.show-range').hide(500);
//         }
//     }

//      function scheduledSend() {
//          if (document.getElementById("scheduledSend").checked) {
//             document.getElementById("sendNow").checked = false;
//             $('#schedule-time').show(500);
//             $('.check-time').show(500);
//         } else {
//             $('#schedule-time').hide(500);
//         }
//     }

//      function nowSend() {
//          if (document.getElementById("sendNow").checked) {
//             document.getElementById("scheduledSend").checked = false;
//             $('#schedule-time').hide(500);
//             $('.check-time').show(500);
//         } else {
//             $('#schedule-time').hide(500);
//         }
//     }

//          function genderFilter() {
//              if (document.getElementById("genderFilter").checked) {
//              document.getElementById("all-contacts-share").checked = false;
//             $('.show-gender-filter').show(500);
//             $('.check-time').show(500);
//         } else {
//                  $('.show-gender-filter').hide(500);
//                  document.getElementById("maleGender").checked = false;
//                 document.getElementById("femaleGender").checked = false;
//         }
//     }
//          function appFilter() {
//              if (document.getElementById("appointmentFilter").checked) {
//              document.getElementById("all-contacts-share").checked = false;
//             $('.show-app-filter').show(500);
//             $('.check-time').show(500);
//         } else {
//             $('.show-app-filter').hide(500);
//              document.getElementById("pending_app").checked = false;
//              document.getElementById("confirmed_app").checked = false;
//              document.getElementById("complited_app").checked = false;
//         }
//     }

//      function sendToAll() {
//          if (document.getElementById("all-contacts-share").checked) {
//                 document.getElementById("singleshare").checked = false;
//                 document.getElementById("services").checked = false;
//                 document.getElementById("feedbackage").checked = false;
//                 document.getElementById("contacts-by-time-share").checked = false;
//                 document.getElementById("genderFilter").checked = false;
//              document.getElementById("appointmentFilter").checked = false;
//                 $('.show-range').hide(500);
//                 $('#filter').hide(500);
//                  $('#select-age-share').hide(500);
//                 $('.show-services-share').hide(500);
//                 $('.show-app-filter').hide(500);
//                 $('.show-gender-filter').hide(500);
//                 $('.check-time').show(500);
//                 $('#single').hide(500);
//                 $('#singlesharing').hide(500);
//             } else {
//                 $('.check-time').show(500);
//                 $('#filter').show(500);
//                 $('#single').show(500);
//             }
//     }
    
//      function sendToOne() {
//          if (document.getElementById("singleshare").checked) {
//                 document.getElementById("all-contacts-share").checked = false;
//                 document.getElementById("services").checked = false;
//                 document.getElementById("feedbackage").checked = false;
//                 document.getElementById("contacts-by-time-share").checked = false;
//                 document.getElementById("genderFilter").checked = false;
//              document.getElementById("appointmentFilter").checked = false;
//                 $('.show-range').hide(500);
//                 $('#filter').hide(500);
//                  $('#select-age-share').hide(500);
//                 $('.show-services-share').hide(500);
//                 $('.show-app-filter').hide(500);
//                 $('.show-gender-filter').hide(500);
//                 $('.check-time').show(500);
//                 $('#all').hide(500);
//                 $('#singlesharing').show(500);
//             } else {
//                 $('.check-time').show(500);
//                 $('#filter').show(500);
//                 $('#single').show(500);
//                 $('#all').show(500);
//                 $('#singlesharing').hide(500);
//             }
//         }

    

//      /*******************share feedback form *******************/
//     document.getElementById("all-contacts-share").onchange = sendToAll;
//     document.getElementById("singleshare").onchange = sendToOne;
//     document.getElementById("services").onchange = selectedService;
//     document.getElementById("feedbackage").onchange = ageFeedback;
//     document.getElementById("contacts-by-time-share").onchange = contactsFeedback;
//     document.getElementById("scheduledSend").onchange = scheduledSend;
//     document.getElementById("sendNow").onchange = nowSend;
//     document.getElementById("genderFilter").onchange = genderFilter;
//     document.getElementById("appointmentFilter").onchange = appFilter;
// });
// function showadvanced() {
//     $("#advanced").toggle("slow");
// }
// var form = $("#send_sms_form").show();
// form.steps({
//     headerTag: "h3",
//     bodyTag: "fieldset",
//     transitionEffect: "slideLeft",
//     onStepChanging: function (event, currentIndex, newIndex) {
//         // Allways allow previous action even if the current form is not valid!
//         if (currentIndex > newIndex) {
//             return true;
//         }
//         if (currentIndex === 0) {
//             return true;
//         } else if (currentIndex === 1) {
            
//              $('#rule_share_mode').val('new-rule');
//                     countShareRuleContacts();
//             if (document.getElementById('all-contacts-share').checked) {
//                 if (document.getElementById('sendNow').checked) {
//                             $.toast({
//                                 heading: 'Information',
//                                 text: 'This form will be sent immediately you submit it',
//                                 icon: 'info',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             });
//                             return true;
//                         } else if (document.getElementById('scheduledSend').checked) {
//                             var schedule_send_date = $('#sending_date_schedule').val();
//                             var schedule_send_time = $('#sending_time_schedule').val();
//                             if (schedule_send_date !== '' && schedule_send_time !== '') {
//                                 $.toast({
//                                     heading: 'Information',
//                                     text: 'This form will be scheduled for the chosen date and time',
//                                     icon: 'info',
//                                     position: 'bottom-right',
//                                     showHideTransition: 'slide'
//                                 });
//                                 return true;
//                             } else {
//                                 $.toast({
//                                     heading: 'Warning',
//                                     text: 'You have selected to shedule this form. Please select date and time',
//                                     icon: 'warning',
//                                     position: 'bottom-right',
//                                     showHideTransition: 'slide'
//                                 });
//                                 return false;
//                             }
//                         } else {
//                             $.toast({
//                                 heading: 'Warning',
//                                 text: 'You have not selected when you want this form to be sent',
//                                 icon: 'warning',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             });
//                             return false;
//                         }
                
//             } else {
//                 if (document.getElementById('services').checked) {
//                     if (document.getElementById('facility_services_shared').value !== '') {
//                         if (document.getElementById('sendNow').checked) {
//                             $.toast({
//                                 heading: 'Information',
//                                 text: 'This form will be sent immediately you submit it',
//                                 icon: 'info',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             });
//                             return true;
//                         } else if (document.getElementById('scheduledSend').checked) {
//                             var schedule_send_date = $('#sending_date_schedule').val();
//                             var schedule_send_time = $('#sending_time_schedule').val();
//                             if (schedule_send_date !== '' && schedule_send_time !== '') {
//                                 $.toast({
//                                     heading: 'Information',
//                                     text: 'This form will be scheduled for the chosen date and time',
//                                     icon: 'info',
//                                     position: 'bottom-right',
//                                     showHideTransition: 'slide'
//                                 });
//                                 return true;
//                             } else {
//                                 $.toast({
//                                     heading: 'Warning',
//                                     text: 'You have selected to shedule this form. Please select date and time',
//                                     icon: 'warning',
//                                     position: 'bottom-right',
//                                     showHideTransition: 'slide'
//                                 });
//                                 return false;
//                             }
//                         } else {
//                             $.toast({
//                                 heading: 'Warning',
//                                 text: 'You have not selected when you want this form to be sent',
//                                 icon: 'warning',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             });
//                             return false;
//                         }
//                     } else {
//                         $.toast({
//                             heading: 'Warning',
//                             text: 'Select service from the drop down to continue',
//                             icon: 'warning',
//                             position: 'bottom-right',
//                             showHideTransition: 'slide'
//                         });
//                         return false;
//                     }
//                 } else if (document.getElementById('singleshare').checked) {
//                    $('#recipients_count').hide(500);
//                     $('#singler').show(500);
                    

//                     if (document.getElementById('email').value !== '' || document.getElementById('phone').value !== '') {

//                         if (document.getElementById('sendNow').checked) {
//                             $.toast({
//                                 heading: 'Information',
//                                 text: 'This form will be sent immediately you submit it',
//                                 icon: 'info',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             });
//                             return true;
//                         } else if (document.getElementById('scheduledSend').checked) {
//                             var schedule_send_date = $('#sending_date_schedule').val();
//                             var schedule_send_time = $('#sending_time_schedule').val();
//                             if (schedule_send_date !== '' && schedule_send_time !== '') {
//                                 $.toast({
//                                     heading: 'Information',
//                                     text: 'This form will be scheduled for the chosen date and time',
//                                     icon: 'info',
//                                     position: 'bottom-right',
//                                     showHideTransition: 'slide'
//                                 });
//                                 return true;
//                             } else {
//                                 $.toast({
//                                     heading: 'Warning',
//                                     text: 'You have selected to shedule this form. Please select date and time',
//                                     icon: 'warning',
//                                     position: 'bottom-right',
//                                     showHideTransition: 'slide'
//                                 });
//                                 return false;
//                             }
//                         } else {
//                             $.toast({
//                                 heading: 'Warning',
//                                 text: 'You have not selected when you want this form to be sent',
//                                 icon: 'warning',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             });
//                             return false;
//                         }
//                     } else {
//                         $.toast({
//                             heading: 'Warning',
//                             text: 'Please fill the single recipient fileds to continue',
//                             icon: 'warning',
//                             position: 'bottom-right',
//                             showHideTransition: 'slide'
//                         });
//                         return false;
//                     }
//                 }else if (document.getElementById('feedbackage').checked) {
//                             var age_from_share = $('#age_from_share').val();
//                             var age_to_share = $('#age_to_share').val();
//                             if (age_from_share !== '' && age_to_share !== '') {
//                                 if (document.getElementById('sendNow').checked) {
//                                     $.toast({
//                                         heading: 'Information',
//                                         text: 'This form will be sent immediately you submit it.',
//                                         icon: 'info',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return true;
//                                 } else if (document.getElementById('scheduledSend').checked) {
//                                     var schedule_date_share = $('#sending_date_schedule').val();
//                                     var schedule_time_share = $('#sending_time_schedule').val();
//                                     if (schedule_date_share !== '' && schedule_time_share !== '') {
//                                         $.toast({
//                                             heading: 'Information',
//                                             text: 'This form will be scheduled for the chosen date and time.',
//                                             icon: 'info',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return true;
//                                     } else {
//                                         $.toast({
//                                             heading: 'Warning',
//                                             text: 'You have selected to shedule this form. Please select date and time',
//                                             icon: 'warning',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return false;
//                                     }
//                                 } else {
//                                     $.toast({
//                                         heading: 'Warning',
//                                         text: 'You have not selected when you want this form to be sent',
//                                         icon: 'warning',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return false;
//                                 }
//                             } else {
//                                 $.toast({
//                                     heading: 'Warning',
//                                     text: 'Please enter the age bracket of your target recipients to proceed',
//                                     icon: 'warning',
//                                     position: 'bottom-right',
//                                     showHideTransition: 'slide'
//                                 });
//                                 return false;
//                     }
//                         } else if (document.getElementById('contacts-by-time-share').checked) {
//                             var startShare = document.getElementById('date_start_share').value;
//                             var endShare = document.getElementById('date_end_share').value;
//                             if (startShare !== '' && endShare !== '') {
//                                 if (document.getElementById('sendNow').checked) {
//                                     $.toast({
//                                         heading: 'Information',
//                                         text: 'This form will be sent immediately you submit it.',
//                                         icon: 'info',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return true;
//                                 } else if (document.getElementById('scheduledSend').checked) {
//                                     var schedule_date_share = $('#sending_date_schedule').val();
//                                     var schedule_time_share = $('#sending_time_schedule').val();
//                                     if (schedule_date_share !== '' && schedule_time_share !== '') {
//                                         $.toast({
//                                             heading: 'Information',
//                                             text: 'This form will be scheduled for the chosen date and time.',
//                                             icon: 'info',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return true;
//                                     } else {
//                                         $.toast({
//                                             heading: 'Warning',
//                                             text: 'You have selected to shedule this form. Please select date and time',
//                                             icon: 'warning',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return false;
//                                     }
//                                 } else {
//                                     $.toast({
//                                         heading: 'Warning',
//                                         text: 'You have not selected when you want this form to be sent',
//                                         icon: 'warning',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return false;
//                                 }
//                             } else {
//                                 $.toast({
//                                     heading: 'Warning',
//                                     text: 'Choose time range to proceed',
//                                     icon: 'warning',
//                                     position: 'bottom-right',
//                                     showHideTransition: 'slide'
//                                 });
//                                 return false;
//                     }
                    
//                 }else if (document.getElementById('genderFilter').checked) {
//                             if (document.getElementById('maleGender').checked) {
//                                 if (document.getElementById('sendNow').checked) {
//                                     $.toast({
//                                         heading: 'Information',
//                                         text: 'This form will be sent immediately you submit it.',
//                                         icon: 'info',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return true;
//                                 } else if (document.getElementById('scheduledSend').checked) {
//                                     var schedule_date_share = $('#sending_date_schedule').val();
//                                     var schedule_time_share = $('#sending_time_schedule').val();
//                                     if (schedule_date_share !== '' && schedule_time_share !== '') {
//                                         $.toast({
//                                             heading: 'Information',
//                                             text: 'This form will be scheduled for the chosen date and time.',
//                                             icon: 'info',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return true;
//                                     } else {
//                                         $.toast({
//                                             heading: 'Warning',
//                                             text: 'You have selected to shedule this form. Please select date and time',
//                                             icon: 'warning',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return false;
//                                     }
//                                 } else {
//                                     $.toast({
//                                         heading: 'Warning',
//                                         text: 'You have not selected when you want this form to be sent',
//                                         icon: 'warning',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return false;
//                                 }
//                             }else if (document.getElementById('femaleGender').checked) {
//                                 if (document.getElementById('sendNow').checked) {
//                                     $.toast({
//                                         heading: 'Information',
//                                         text: 'This form will be sent immediately you submit it.',
//                                         icon: 'info',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return true;
//                                 } else if (document.getElementById('scheduledSend').checked) {
//                                     var schedule_date_share = $('#sending_date_schedule').val();
//                                     var schedule_time_share = $('#sending_time_schedule').val();
//                                     if (schedule_date_share !== '' && schedule_time_share !== '') {
//                                         $.toast({
//                                             heading: 'Information',
//                                             text: 'This form will be scheduled for the chosen date and time.',
//                                             icon: 'info',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return true;
//                                     } else {
//                                         $.toast({
//                                             heading: 'Warning',
//                                             text: 'You have selected to shedule this form. Please select date and time',
//                                             icon: 'warning',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return false;
//                                     }
//                                 } else {
//                                     $.toast({
//                                         heading: 'Warning',
//                                         text: 'You have not selected when you want this form to be sent',
//                                         icon: 'warning',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return false;
//                                 }
//                             }else {
//                                 $.toast({
//                                     heading: 'Warning',
//                                     text: 'Please select gender to continue',
//                                     icon: 'warning',
//                                     position: 'bottom-right',
//                                     showHideTransition: 'slide'
//                                 });
//                                 return false;
//                             }
//                         } else if (document.getElementById('appointmentFilter').checked) {
//                             if (document.getElementById('confirmed_app').checked) {
//                                 if (document.getElementById('sendNow').checked) {
//                                     $.toast({
//                                         heading: 'Information',
//                                         text: 'This form will be sent immediately you submit it.',
//                                         icon: 'info',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return true;
//                                 } else if (document.getElementById('scheduledSend').checked) {
//                                     var schedule_date_share = $('#sending_date_schedule').val();
//                                     var schedule_time_share = $('#sending_time_schedule').val();
//                                     if (schedule_date_share !== '' && schedule_time_share !== '') {
//                                         $.toast({
//                                             heading: 'Information',
//                                             text: 'This form will be scheduled for the chosen date and time.',
//                                             icon: 'info',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return true;
//                                     } else {
//                                         $.toast({
//                                             heading: 'Warning',
//                                             text: 'You have selected to shedule this form. Please select date and time',
//                                             icon: 'warning',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return false;
//                                     }
//                                 } else {
//                                     $.toast({
//                                         heading: 'Warning',
//                                         text: 'You have not selected when you want this form to be sent',
//                                         icon: 'warning',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return false;
//                                 }


//                             } else if (document.getElementById('pending_app').checked) {
//                                 if (document.getElementById('sendNow').checked) {
//                                     $.toast({
//                                         heading: 'Information',
//                                         text: 'This form will be sent immediately you submit it.',
//                                         icon: 'info',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return true;
//                                 } else if (document.getElementById('scheduledSend').checked) {
//                                     var schedule_date_share = $('#sending_date_schedule').val();
//                                     var schedule_time_share = $('#sending_time_schedule').val();
//                                     if (schedule_date_share !== '' && schedule_time_share !== '') {
//                                         $.toast({
//                                             heading: 'Information',
//                                             text: 'This form will be scheduled for the chosen date and time.',
//                                             icon: 'info',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return true;
//                                     } else {
//                                         $.toast({
//                                             heading: 'Warning',
//                                             text: 'You have selected to shedule this form. Please select date and time',
//                                             icon: 'warning',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return false;
//                                     }
//                                 } else {
//                                     $.toast({
//                                         heading: 'Warning',
//                                         text: 'You have not selected when you want this form to be sent',
//                                         icon: 'warning',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return false;
//                                 }
//                             } else if (document.getElementById('complited_app').checked) {
//                                 if (document.getElementById('sendNow').checked) {
//                                     $.toast({
//                                         heading: 'Information',
//                                         text: 'This form will be sent immediately you submit it.',
//                                         icon: 'info',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return true;
//                                 } else if (document.getElementById('scheduledSend').checked) {
//                                     var schedule_date_share = $('#sending_date_schedule').val();
//                                     var schedule_time_share = $('#sending_time_schedule').val();
//                                     if (schedule_date_share !== '' && schedule_time_share !== '') {
//                                         $.toast({
//                                             heading: 'Information',
//                                             text: 'This form will be scheduled for the chosen date and time.',
//                                             icon: 'info',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return true;
//                                     } else {
//                                         $.toast({
//                                             heading: 'Warning',
//                                             text: 'You have selected to shedule this form. Please select date and time',
//                                             icon: 'warning',
//                                             position: 'bottom-right',
//                                             showHideTransition: 'slide'
//                                         });
//                                         return false;
//                                     }
//                                 } else {
//                                     $.toast({
//                                         heading: 'Warning',
//                                         text: 'You have not selected when you want this form to be sent',
//                                         icon: 'warning',
//                                         position: 'bottom-right',
//                                         showHideTransition: 'slide'
//                                     });
//                                     return false;
//                                 }
//                             }else {
//                                 $.toast({
//                                     heading: 'Warning',
//                                     text: 'please select appointment status to continue',
//                                     icon: 'warning',
//                                     position: 'bottom-right',
//                                     showHideTransition: 'slide'
//                                 });
//                                 return false;
//                             }
//                 } else {
//                             $.toast({
//                                 heading: 'Error',
//                                 text: 'Choose the options available to filter your recipients',
//                                 icon: 'error',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             });
//                             return false;
//                         }
//             }

//         } else if (currentIndex === 2) {
//             if (document.getElementById('emailAdress').checked) {
//                             $.toast({
//                                 heading: 'Information',
//                                 text: 'This form will be shared via email',
//                                 icon: 'info',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             });
//                             return true;
//             } else if (document.getElementById('phoneAdress').checked) {
//                 $.toast({
//                                 heading: 'Information',
//                                 text: 'This form will be shared via phone numbers',
//                                 icon: 'info',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             });
//                             return true;
//             }  else if (document.getElementById('both').checked) {
//                 $.toast({
//                                 heading: 'Information',
//                                 text: 'This form will be shared via both phone numbers and email adress',
//                                 icon: 'info',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             });
//                             return true;
//             }else {
//                 $.toast({
//                      heading: 'Error',
//                     text: 'Plaese select a media to share you form through',
//                     icon: 'error',
//                     position: 'bottom-right',
//                     showHideTransition: 'slide'
//                             });
//                             return false;
//             }

            
//         }
//         if (currentIndex < newIndex) {
//             // To remove error styles
//             form.find(".body:eq(" + newIndex + ") label.error").remove();
//             form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
//         }
//             form.validate().settings.ignore = ":disabled,:hidden";
//             return form.valid();
//     },
//     onStepChanged: function (event, currentIndex, priorIndex) {
    
//     },
//     onFinishing: function (event, currentIndex) {
//             form.validate().settings.ignore = ":disabled";
//             return form.valid();
//     },
//     onFinished: function(event, currentIndex) {
//         event.preventDefault();
//             var facility_id = $('#facility_id').val();
//             if (facility_id !== '') {
//                 $.ajax({
//                     url: "operation/shareFeedbackFormOperation.php",
//                     method: 'POST',
//                     data: new FormData(this),
//                     contentType: false,
//                     processData: false,
//                     success: function(data) {
//                         if (data == 200) {
//                                $.toast({
//                                     heading: 'success',
//                                     text: 'You have successfully shared sentiment form.',
//                                     icon: 'warning',
//                                     position: 'bottom-right',
//                                     showHideTransition: 'slide'
//                                 })
                            
//                             $('#shareFeedbackModal').modal('hide');
//                             $('#send_sms_form')[0].reset();
//                         } else if (data == 250) {
//                                $.toast({
//                                 heading: 'success',
//                                 text: 'Your form has been scheduled to be send.',
//                                 icon: 'warning',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             })
                            
//                             $('#shareFeedbackModal').modal('hide');
//                             $('#send_sms_form')[0].reset();
//                         } else if (data == 300) {
//                              $.toast({
//                                 heading: 'Warning',
//                                 text: 'You have insuffitient to up to send your email.',
//                                 icon: 'warning',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             })
                            
//                             $('#shareFeedbackModal').modal('hide');
//                             $('#send_sms_form')[0].reset();
//                         } else if (data == 500) {
//                             $.toast({
//                                 title: "Error",
//                                 text: "An error occured while sending your request, please try again.",
//                                 icon: 'warning',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             });
//                             $('#shareFeedbackModal').modal('hide');
//                             $('#send_sms_form')[0].reset();
//                         } else if (data == 404) {
//                              $.toast({
//                                 heading: 'Warning',
//                                 text: 'Please add contacts to share form.',
//                                 icon: 'warning',
//                                 position: 'bottom-right',
//                                 showHideTransition: 'slide'
//                             })
//                         }
//                     }
//                 });
//             } else {
//                 $.toast({
//                     heading: 'Warning',
//                     text: 'Please fill all the required details.',
//                     icon: 'warning',
//                     position: 'bottom-right',
//                     showHideTransition: 'slide'
//                 })
//         }
//         //     if ((document.getElementById('singleshare').checked) == false) {
//         //       var rec_count = $("#hidden_rec_count").val();
//         //         if (rec_count == '0' || rec_count == '') {
//         //             $.toast({
//         //                 heading: 'Warning',
//         //                 text: 'You do not have any recipients for this message, please adjust your filters',
//         //                 icon: 'warning',
//         //                 position: 'bottom-right',
//         //                 showHideTransition: 'slide'
//         //             });
//         //             return false;
//         //         }
//         // } else if ((document.getElementById('singleshare').checked) == true) {
//         //             $.toast({
//         //                 heading: 'information',
//         //                 text: 'This form will be shared to your selected recipients',
//         //                 icon: 'info',
//         //                 position: 'bottom-right',
//         //                 showHideTransition: 'slide'
//         //             });
//         //             return false;
//         // } 
//         }
//     }).validate({
//         errorPlacement: function errorPlacement(error, element) { element.before(error); },
//         rules: {
//             confirm: {
//                 equalTo: "#password-2"
//             }
//         }
//     });

// function countShareRuleContacts() {
//         var rule_share_mode, facility_id, services, genderFilter,  contacts, age_from, age_to, start_date, end_date, appointmentFilter;
//         rule_share_mode = 'new-rule';
//         facility_id = $('#facility_id').val();
//         services = $('#facility_services_shared').val();
//         age_from = $('#age_from_share').val();
//         age_to = $('#age_to_share').val();
//         start_date = document.getElementById('date_start_share').value;
//         end_date = document.getElementById('date_end_share').value;
//         if (document.getElementById('maleGender').checked) {
//             genderFilter = 'Male';
//         } else if (document.getElementById('femaleGender').checked) {
//             genderFilter = 'Female';
//         } else genderFilter = '';
//         if (document.getElementById('confirmed_app').checked) {
//             appointmentFilter = 'confirmed';
//         } else if (document.getElementById('pending_app').checked) {
//             appointmentFilter = 'pending';
//         } else if ((document.getElementById('complited_app').checked)) {
//             appointmentFilter = 'complited';
            
//         }else appointmentFilter = '';
//         if (document.getElementById('all-contacts-share').checked) {
//             contacts = 'allcontacts';
//         } else contacts = '';
//         $.ajax({
//             url: "operation/getfeedbackShareContacts.php",
//             method: "POST",
//             data: { rule_share_mode: rule_share_mode, facility_id: facility_id, services: services, genderFilter: genderFilter, contacts: contacts, age_from: age_from, age_to: age_to, start_date: start_date, end_date: end_date, appointmentFilter: appointmentFilter},
//             dataType: "json",
//             success: function (data) {
//                 console.log(data);
//                 if (data !== '') {
//                     $('#recipients_count').text(data.count);
//                     $('#hidden_rec_count').val(data.count);
//                     $('#filtered_recipients').val('');
//                     var rec_list = [];
//                     var res = data.recipients;
//                     $.each(res, function(i) {
//                         var _list = res[i].first_name + ' ' + res[i].last_name + '_' + res[i].phone_number + '_' + res[i].email_adress;
//                         rec_list.push(_list);
//                         $('#filtered_recipients').val(rec_list);
//                     });
                    
//                 } else {
//                     $('#recipients_count').text('No recipients found');
//                     $('#hidden_rec_count').val('0');
//                 }
//             }
//         });
// }

// $(function() {
//         var facility_id = $('#facility_id').val();
//         var operation = 'get_services';
//         $.ajax({
//             url: "operation/shareFeedbackFormOperation.php",
//             method: "POST",
//             data: { operation: operation, facility_id: facility_id },
//             dataType: "json",
//             success: function(result) {
//                 if (result == '404') {
//                     var txt = 'No services found';
//                     $("#services").attr('disabled', false);
//                     $("#services").empty();
//                     $("#facility_services_shared").attr('disabled', false);
//                     $("#facility_services_shared").empty();
//                     $.each(result, function(i) {
//                         $('#facility_services_shared').append($('<option></option>').attr("value", '').text(txt));
//                     });
//                     $.each(result, function(i) {
//                         $('#services').append($('<option></option>').attr("value", '').text(txt));
//                     });
//                 } else {
//                     $("#services").attr('disabled', false);
//                     $("#services").empty();
//                     $("#facility_services_shared").attr('disabled', false);
//                     $("#facility_services_shared").empty();
//                     $.each(result, function(i) {
//                         $('#facility_services_shared').append($('<option></option>').attr("value", result[i].service).text(result[i].name));
//                     });
//                     $.each(result, function(i) {
//                         $('#services').append($('<option></option>').attr("value", result[i].service).text(result[i].name));
//                     });
//                 }
//             },
//             failure: function() {
//                 $.toast({
//                     heading: 'No Services',
//                     text: 'Could not find any services.',
//                     icon: 'error',
//                     position: 'bottom-right',
//                     showHideTransition: 'slide'
//                 })
//             }
//         });

// });
// $(function() {
//         var facility_id = $('#facility_id').val();
//         var operation = 'get_emails';
//         $.ajax({
//             url: "operation/shareFeedbackFormOperation.php",
//             method: "POST",
//             data: { operation: operation, facility_id: facility_id },
//             dataType: "json",
//             success: function (result) {
//                 console.log(result);
//                 if (result == '404') {
//                 } else {
//                     $.each(result, function(i) {
//                         $("#email").html(`${$("#email").html()} <option value="${result[i].email_address}" >${result[i].first_name} - ${result[i].email_address}</option>`);
//                     });
//                     $.each(result, function(i) {
//                       $("#phone").html(`${$("#phone").html()} <option value="${result[i].phone_number}" >${result[i].first_name} - ${result[i].phone_number}</option>`);
//                     });
//                 }
//             },
//             failure: function() {
//                 $.toast({
//                     heading: 'No Services',
//                     text: 'Could not find any emails.',
//                     icon: 'error',
//                     position: 'bottom-right',
//                     showHideTransition: 'slide'
//                 })
//             }
//         });

// });


//      $(document).ready(function() {
// 	var max_fields      = 50; 
// 	var wrapper   		= $("#emailing"); 
// 	var addEmail      = $("#addEmail"); 
	
// 	var x = 1; //initlal text box count
// 	$(addEmail).click(function(e){ 
// 		e.preventDefault();
// 		if(x < max_fields){ //max input box allowed
//             x++; //text box increment
// 			$(wrapper).append('<div><input type="email" class="form-control col-md-12 mb-2" name="email[]" id="email" /><a href="#" class="remove_field btn-circle btn-default" >Remove</a></div>'); //add input box
// 		}
// 	});
	
// 	$(wrapper).on("click",".remove_field", function(e){ //user click on remove text
// 		e.preventDefault(); $(this).parent('div').remove(); x--;
// 	})
// });


//     $(document).ready(function() {
// 	var max_fields      = 50; 
// 	var wrapper   		= $("#phoning"); 
// 	var addPhone      = $("#addPhone"); 
	
// 	var x = 1; //initlal text box count
// 	$(addPhone).click(function(e){ 
// 		e.preventDefault();
// 		if(x < max_fields){ //max input box allowed
//             x++; //text box increment
// 			$(wrapper).append('<div><input type="text" class="form-control col-md-12 mb-2" name="phone[]" id="phone" /><a href="#" class="remove_field btn-circle btn-default" >Remove</a></div>'); //add input box
// 		}
// 	});
	
// 	$(wrapper).on("click",".remove_field", function(e){ //user click on remove text
// 		e.preventDefault(); $(this).parent('div').remove(); x--;
// 	})
// });


// $('#email.select2').select2({
//     dropdownParent: $('#shareFeedbackModal'),
//     closeOnSelect: false,
//     tags: true,
//     allowClear: true,
//     // placeholder: "select receipients",
//     tokenSeparators: [',', ' ', ";"],
//     createTag: function (params) {
//         // Don't offset to create a tag if it is not a valid email address
//         return (emailRegExp.test(params.term) ? { id: params.term, text: params.term } : null);
//     },
// });

// $('#phone.select2').select2({
//     dropdownParent: $('#shareFeedbackModal'),
//     closeOnSelect: false,
//     tags: true,
//     allowClear: true,
//     // placeholder: "select receipients",
//     tokenSeparators: [',', ' ', ";"],
//     createTag: function (params) {
//         // Don't offset to create a tag if it is not a valid email address
//         return (phoneNumber.test(params.term) ? { id: params.term, text: params.term } : null);
//     },
// });
