$(function() {
    //Beginning of appointments reffered to me by other Docts
    $('#getRefAppointments').DataTable({
        "ajax": {
            url: "operation/GetReferralAppointments.php",
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
        var table = $('#getRefAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'pdfHtml5'
            ]
        }).container().appendTo($('#exportToPDF'));
    });

    $(function() {
        var table = $('#getRefAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'excelHtml5'
            ]
        }).container().appendTo($('#exportToExcel'));
    });

    $(function() {
        var table = $('#getRefAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'csvHtml5'
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function() {
        var table = $('#getRefAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'printHtml5'
            ]
        }).container().appendTo($('#exportToPrint'));
    });

    $(function() {
        var table = $('#getRefAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'copyHtml5'
            ]
        }).container().appendTo($('#exportToCopy'));
    });

	
var start_dateval, end_dateval;
$(function() {

    $('#daterange-referral-btn').daterangepicker({
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        },
        function(start, end) {
            $('#daterange-referral-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            [startDate, endDate] = $('#referral_range').val().split(' - ');
            $(this).find('input[name="start_date"]').val(startDate);
            $(this).find('input[name="end_date"]').val(endDate);

            $start = $('#start_date').val();
            $end = $('#end_date').val();
            start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
            end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");
            var doctorId = $('#doctorId').val();
            $('#getRefAppointments').DataTable().destroy();
            fetch_data(doctorId, start_dateval, end_dateval);
        }
    )


    function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
        $('#getRefAppointments').DataTable({
            "ajax": {
                data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
                url: "operation/include/filterReferral/filteredreferral.php",
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
            var table = $('#getRefAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'pdfHtml5'
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function() {
            var table = $('#getRefAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'excelHtml5'
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function() {
            var table = $('#getRefAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'csvHtml5'
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function() {
            var table = $('#getRefAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'printHtml5'
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function() {
            var table = $('#getRefAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'copyHtml5'
                ]
            }).container().appendTo($('#exportToCopy'));
        });

}
	
});   	
    
    
    
	    //Beginning of rejected Referrals
    $('#getRejects').DataTable({
        "ajax": {
            url: "operation/Getrejects.php",
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
        var table = $('#getRejects').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'pdfHtml5'
            ]
        }).container().appendTo($('#exportToPDF'));
    });

    $(function() {
        var table = $('#getRejects').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'excelHtml5'
            ]
        }).container().appendTo($('#exportToExcel'));
    });

    $(function() {
        var table = $('#getRejects').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'csvHtml5'
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function() {
        var table = $('#getRejects').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'printHtml5'
            ]
        }).container().appendTo($('#exportToPrint'));
    });

    $(function() {
        var table = $('#getRejects').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'copyHtml5'
            ]
        }).container().appendTo($('#exportToCopy'));
    });


var start_dateval, end_dateval;
$(function() {

    $('#daterange-rejected-btn').daterangepicker({
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        },
        function(start, end) {
            $('#daterange-rejected-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            [startDate, endDate] = $('#rejected_range').val().split(' - ');
            $(this).find('input[name="start_date"]').val(startDate);
            $(this).find('input[name="end_date"]').val(endDate);

            $start = $('#start_date').val();
            $end = $('#end_date').val();
            start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
            end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");
            var doctorId = $('#doctorId').val();
            $('#getRejects').DataTable().destroy();
            fetch_data(doctorId, start_dateval, end_dateval);
        }
    )


    function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
        $('#getRejects').DataTable({
            "ajax": {
                data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
                url: "operation/include/filterReferral/filteredrejects.php",
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
            var table = $('#getRejects').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'pdfHtml5'
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function() {
            var table = $('#getRejects').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'excelHtml5'
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function() {
            var table = $('#getRejects').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'csvHtml5'
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function() {
            var table = $('#getRejects').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'printHtml5'
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function() {
            var table = $('#getRejects').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'copyHtml5'
                ]
            }).container().appendTo($('#exportToCopy'));
        });

}
	
});   
    
	    //Beginning of appointments referred to other docs by me
    $('#getOthersAppointments').DataTable({
        "ajax": {
            url: "operation/GetOtherdocReferralAppointments.php",
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
        var table = $('#getOthersAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'pdfHtml5'
            ]
        }).container().appendTo($('#exportToPDF'));
    });

    $(function() {
        var table = $('#getOthersAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'excelHtml5'
            ]
        }).container().appendTo($('#exportToExcel'));
    });

    $(function() {
        var table = $('#getOthersAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'csvHtml5'
            ]
        }).container().appendTo($('#exportToCSV'));
    });

    $(function() {
        var table = $('#getOthersAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'printHtml5'
            ]
        }).container().appendTo($('#exportToPrint'));
    });

    $(function() {
        var table = $('#getOthersAppointments').DataTable();
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'copyHtml5'
            ]
        }).container().appendTo($('#exportToCopy'));
    });


var start_dateval, end_dateval;
$(function() {

    $('#daterange-referred-btn').daterangepicker({
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        },
        function(start, end) {
            $('#daterange-referred-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            [startDate, endDate] = $('#referred_range').val().split(' - ');
            $(this).find('input[name="start_date"]').val(startDate);
            $(this).find('input[name="end_date"]').val(endDate);

            $start = $('#start_date').val();
            $end = $('#end_date').val();
            start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
            end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");
            var doctorId = $('#doctorId').val();
            $('#getOthersAppointments').DataTable().destroy();
            fetch_data(doctorId, start_dateval, end_dateval);
        }
    )


    function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
        $('#getOthersAppointments').DataTable({
            "ajax": {
                data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
                url: "operation/include/filterReferral/filteredreferred.php",
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
            var table = $('#getOthersAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'pdfHtml5'
                ]
            }).container().appendTo($('#exportToPDF'));
        });

        $(function() {
            var table = $('#getOthersAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'excelHtml5'
                ]
            }).container().appendTo($('#exportToExcel'));
        });

        $(function() {
            var table = $('#getOthersAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'csvHtml5'
                ]
            }).container().appendTo($('#exportToCSV'));
        });

        $(function() {
            var table = $('#getOthersAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'printHtml5'
                ]
            }).container().appendTo($('#exportToPrint'));
        });

        $(function() {
            var table = $('#getOthersAppointments').DataTable();
            var buttons = new $.fn.dataTable.Buttons(table, {
                buttons: [
                    'copyHtml5'
                ]
            }).container().appendTo($('#exportToCopy'));
        });

}
	
});   	
	
	
	//Referal Appointment || Fetching
		$(document).on('click', '.view_Referal_details', function() { 
			var referral_id = $(this).attr("id");
			$.ajax({
				url: "operation/get_referalAppointmentDetails.php",
				method: "POST",
				data: { referral_id: referral_id },
				dataType: "json",
				success: function(data) {
					$('#Modal_ref_details').modal('show');
					$('.modal-title').text("Referral Appointment Details For"+ ' ' +data.name );
					$('#patient_email').html(data.email);
					//$('#dob').html(data.date);
					$('#patient_name').html(data.name);
					$('#patient_phone').html(data.phone);
					$('#gender').html(data.gender);
					$('#patient_note').html(data.patient_note);
					$('#ref_doc').html(data.ref_doc);
					$('#case_description').html(data.case_description);
				}

			})
			
						
		   //$('#getPatientPrescription').dataTable().fnDestroy();	
			
		});
	
	
 //Accept Patient Referral
    $(document).on('click', '.AcceptRefrl', function() {
        var refrl_id = $(this).attr("id");
        
        
            
                $.ajax({
                    url: "operation/AcceptReferralRequest.php",
                    method: "POST",
                    data: { refrl_id: refrl_id},
					      //contentType: false,
						//	processData: false,
							success: function(response) {
								if (response = 200) {
									$.toast({
										//width:'100px';
										heading: 'Success',
										text: 'Your referral Appointment has been successfully Accepted.',
										icon: 'success',
										position: 'bottom-right',
										showHideTransition: 'slide'
									})
									//$('#doctor_note_form')[0].reset();
									$('#getRefAppointments').DataTable().ajax.reload();
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

	
 //Decline Patient Referral
    $(document).on('click', '.DeclnRefrl', function() {
        var refrl_id = $(this).attr("id");
        
                $.ajax({
                    url: "operation/DeclideReferralRequest.php",
                    method: "POST",
                    data: { refrl_id: refrl_id},
					     // contentType: false,
						///	processData: false,
							success: function(response) {
								if (response = 200) {
									$.toast({
										//width:'100px';
										heading: 'Success',
										text: 'Your referral Appointment has been Declined.',
										icon: 'danger',
										position: 'bottom-right',
										showHideTransition: 'slide'
									})
									//$('#doctor_note_form')[0].reset();
									$('#getRefAppointments').DataTable().ajax.reload();
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

	
	
	
	
	   //Invite Doct ro join MHA doctors Network
    $(document).on('submit', '#InvitationForm', function(event) {
        event.preventDefault();
        var invitee_name = $('#invitee_name').val();
        var invitee_specialty = $('#invitee_specialty').val();
        var invitee_location = $('#invitee_location').val();
        var invitee_email = $('#invitee_email').val();
        var invitee_phone = $('#invitee_phone').val();
        var invited_by = $('#invited_by').val();
        var inv_note = $('#inv_note').val();
        if (invitee_email !== '') {
            $.ajax({
                url: "operation/SendInvitationRequest.php",
                method: 'POST',
                data: {invitee_name: invitee_name, invitee_specialty: invitee_specialty, invitee_location: invitee_location, invitee_email: invitee_email,
                invitee_phone: invitee_phone, invited_by: invited_by, inv_note: inv_note},
              	dataType: "json",
                success: function(result) {
                    if (result = 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Your invitation has been successfully Sent.',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                         setTimeout(function() {
                            location.reload();
                        }, 4000)
                       	

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


	
 //Remove Doctor From My Referal Network
    $(document).on('click', '.remove', function() {
        var refrl_id = $(this).attr("id");
        
                $.ajax({
                    url: "operation/RemoveDocFromNetwrk.php",
                    method: "POST",
                    data: { refrl_id: refrl_id},
					                  //	dataType: "json",

							success: function(response) {
								if (response = 200) {
									$.toast({
										//width:'100px';
										heading: 'Success',
										text: 'The Contact has been Removed From Your Network.',
										icon: 'success',
										position: 'bottom-right',
										showHideTransition: 'slide'
									})
									location.reload();
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

	
//Pin Doctor in My Top Referal Network
    $(document).on('click', '.pin', function() {
        var refrl_id = $(this).attr("id");
        
                $.ajax({
                    url: "operation/AddPinOnDocnetwork.php",
                    method: "POST",
                    data: { refrl_id: refrl_id},
					                  //	dataType: "json",

							success: function(response) {
								if (response = 200) {
									$.toast({
										//width:'100px';
										heading: 'Success',
										text: 'The Contact has been successfully pinned on the top of your network.',
										icon: 'success',
										position: 'bottom-right',
										showHideTransition: 'slide'
									})
									location.reload();
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


//Accept Doctor's invitation in My Top Referal Network
    $(document).on('click', '.pinada', function() {
        var refrl_id = $(this).attr("id");
        
                $.ajax({
                    url: "operation/AcceptNetworkInvitation.php",
                    method: "POST",
                    data: { refrl_id: refrl_id},
					                  //	dataType: "json",

							success: function(response) {
								if (response = 200) {
									$.toast({
										//width:'100px';
										heading: 'Success',
										text: 'The Contact has been successfully Unpinned.',
										icon: 'success',
										position: 'bottom-right',
										showHideTransition: 'slide'
									})
									//$('#doctor_note_form')[0].reset();
									location.reload();
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

    
//Unpin Doctor in My Top Referal Network
    $(document).on('click', '.unpin', function() {
        var refrl_id = $(this).attr("id");
        
                $.ajax({
                    url: "operation/RemovePinOnDocnetwork.php",
                    method: "POST",
                    data: { refrl_id: refrl_id},
					                  //	dataType: "json",

							success: function(response) {
								if (response = 200) {
									$.toast({
										//width:'100px';
										heading: 'Success',
										text: 'The Contact has been successfully Unpinned.',
										icon: 'success',
										position: 'bottom-right',
										showHideTransition: 'slide'
									})
									//$('#doctor_note_form')[0].reset();
									location.reload();
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

	

//Location Drop Down
$(function() {
    var doctorId = $('#network_id').val();
    $.ajax({
        url: "operation/getdoctorsLocation.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#doc_loc").attr('disabled', false);
            $.each(result, function(i) {
                $('#doc_loc').append($('<option></option>').attr("value", result[i].location).text(result[i].location));
            });
        },
        failure: function() {
            alert("Error");
        }
    });
});	
//Location Drop Down GROUP
// $(function() {
//     var doctorId = $('#network_id').val();
//     $.ajax({
//         url: "operation/getdoctorsLocation.php",
//         method: "POST",
//         data: { doctorId: doctorId },
//         dataType: "json",
//         success: function(result) {
//             $("#group_loc").attr('disabled', false);
//             $.each(result, function(i) {
//                 $('#group_loc').append($('<option></option>').attr("value", result[i].location).text(result[i].location));
//             });
//         },
//         failure: function() {
//             alert("Error");
//         }
//     });
// });	

//Specialties Drop Down
// $(function() {
//     var doctorId = $('#network_id').val();
//     $.ajax({
//         url: "operation/GetdoctorSpecialties.php",
//         method: "POST",
//         data: { doctorId: doctorId },
//         dataType: "json",
//         success: function(result) {
//             $("#specialty").attr('disabled', false);
//             $.each(result, function(i) {
//                 $('#specialty').append($('<option></option>').attr("value", result[i].slug).text(result[i].slug));
//             });
//         },
//         failure: function() {
//             alert("Error");
//         }
//     });
// });

//Get Filtered Docs By Specialty

// $(document).ready(function() {
//     $("#specialty").change(function() {
//         //var doctorId = $('#doctorId').val();
//         var fetchedspec = $(this).val();
//         $.ajax({
//             url: "operation/GetNetworkFilteredbySpecialty.php",
//             method: "POST",
//             data: { fetchedspec: fetchedspec },
//             dataType: "json",
//             success: function(response) {
//                 var len = response.length;
//                 $("#admin_doc").empty();
//                 for (var i = 0; i < len; i++) {
//                     var val = response[i]['name'];
//                     var name = response[i]['name'];
//                     $("#admin_doc").append("<option value='" + val + "'>" + name + "</option>");
//                 }
//             }
//         });
//     });
// });


//Specialties Drop Down GROUP
// $(function() {
//     var doctorId = $('#network_id').val();
//     $.ajax({
//         url: "operation/GetdoctorSpecialties.php",
//         method: "POST",
//         data: { doctorId: doctorId },
//         dataType: "json",
//         success: function(result) {
//             $("#group_specialty").attr('disabled', false);
//             $.each(result, function(i) {
//                 $('#group_specialty').append($('<option></option>').attr("value", result[i].slug).text(result[i].slug));
//             });
//         },
//         failure: function() {
//             alert("Error");
//         }
//     });
// });	


//Add Network Doctors drop down
$(function() {
    var doctorId = $('#network_id').val();
    $.ajax({
        url: "operation/getnetworkDoctorS.php",
        method: "POST",
        data: {doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#admin_doc").attr('disabled', false);
            $.each(result, function(i) {
                $('#admin_doc').append($('<option></option>').attr("value", result[i].dr_post_id).text(result[i].name+' - '+result[i].slug));
            });
        },
        failure: function() {
            alert("Error");
        }
    });
});

// //Add Network Doctors drop down GROUP
// $(function() {
//     var doctorId = $('#network_id').val();
//     $.ajax({
//         url: "operation/getnetworkDoctorS.php",
//         method: "POST",
//         data: {doctorId: doctorId },
//         dataType: "json",
//         success: function(result) {
//             $("#group_doc").attr('disabled', false);
//             $.each(result, function(i) {
//               // $('#group_doc').append($('<option></option>').attr("value", result[i].dr_post_id).text(result[i].name));
// 				$('#group_doc').append($('<option></option>').attr("value", result[i].dr_post_id).text(result[i].name+' - '+result[i].slug));

//             });
//         },
//         failure: function() {
//             alert("Error");
//         }
//     });
// });

//Get Filtered Docs By Location  GROUP
$(document).ready(function() {
    $("#group_loc").change(function() {
        //var doctorId = $('#doctorId').val();
        var fetcheddoc = $(this).val();
        $.ajax({
            url: "operation/GetNetworkFiltereddoctors.php",
            method: "POST",
            data: { fetcheddoc: fetcheddoc },
            dataType: "json",
            success: function(response) {
                var len = response.length;
                $("#group_doc").empty();
                for (var i = 0; i < len; i++) {
                    var val = response[i]['dr_post_id'];
                    var name = response[i]['name'];
                    $("#group_doc").append("<option value='" + val + "'>" + name + "</option>");
                }
            }
        });
    });

});
//Get Filtered Docs By Location
$(document).ready(function() {
    $("#doc_loc").change(function() {
        var fetcheddoc = $(this).val();
        $.ajax({
            url: "operation/GetNetworkFiltereddoctors.php",
            method: "POST",
            data: { fetcheddoc: fetcheddoc },
            dataType: "json",
            success: function(response) {
                if(response == 404){
                    var res = 'No available doctors';
                    $("#admin_doc").empty();
                    $("#admin_doc").append("<option>" + res + "</option>");
                } else {
                    var len = response.length;
                    $("#admin_doc").empty();
                    for (var i = 0; i < len; i++) {
                        var val = response[i]['dr_post_id'];
                        var name = response[i]['name'];
                        $("#admin_doc").append("<option value='" + val + "'>" + name + "</option>");
                    }
                }
            }
        });
    });
});
//Get Filtered Docs By Specialty
// $(document).ready(function() {
//     $("#doc_loc").change(function() {
//         var doctorId = $(this).val();
//         $.ajax({
//             url: "operation/getnetworkDoctorS.php",
//             method: "POST",
//             data: { doctorId: doctorId },
//             dataType: "json",
//             success: function(response) {
//                 var len = response.length;
//                 $("#admin_doc").empty();
//                 for (var i = 0; i < len; i++) {
//                     var val = response[i]['dr_post_id'];
//                     var name = response[i]['name'];
//                     $("#admin_doc").append("<option value='" + val + "'>" + name + "</option>");
//                 }
//             }
//         });
//     });
// });

  //Invite Doct ro join MHA doctors Network
    $(document).on('submit', '#MymedicalCommunity', function(event) {
        event.preventDefault();
              var network_id = $('#network_id').val();
			var admin_doc = $('#admin_doc').val();
			//var specialty = $('#specialty').val();
			var category = $('#category').val();
			var note = $('#note').val();
			if (admin_doc !== '') {
            $.ajax({
                url: "operation/SendNetworkRequest.php",
                method: 'POST',
                data: {network_id: network_id, admin_doc: admin_doc, category: category, note: note},
                dataType: "json",
                success: function(result) {
                    if (result = 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Doctor Successfully Added To Your Network.',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                        $('#MymedicalCommunity')[0].reset();
						location.reload();

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
	
	
	
	
	   //Create A New Group
    $(document).on('submit', '#AdditionalGroups', function(event) {
        event.preventDefault();
        var grpadmin = $('#grpadmin').val();
        var grpname = $('#grpname').val();
        var notes = $('#notes').val();
        if (grpadmin != '') {
            $.ajax({
                url: "operation/CreateGroup.php",
                method: 'POST',
                data: {grpadmin: grpadmin, grpname: grpname, notes: notes},
              	dataType: "json",
                success: function(result) {
                    if (result = 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Your Network Group Has Been Successfully Created.',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                        //$('#doctor_note_form')[0].reset();
									location.reload();
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





})

