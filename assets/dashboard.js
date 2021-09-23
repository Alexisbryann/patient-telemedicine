$(function() {

    var doctorId = $('#doctorId').val();
    var doctorPostId = $('#doctorPostId').val();
	var aff = $('#aff').val();
	var role = $('#role').val();
	var loggedin_user = $('#loggedin_user').val();
	var facility_id = $('#aff').val();
	
	    //Dashboard upcoming appointments
    $('#dashboardUpcomingAppointments').DataTable({
        "ajax": {
            data: { doctorId: doctorId, aff: aff , role: role },
            url: "operation/getDashboardUpcomingAppointments.php",
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
             'pageLength': 10
    });


    //Pharmacy Dashboard upcoming appointments
    $('#dashboardUpcomingPharmacy').DataTable({
        "ajax": {
            data: { doctorId: doctorId, aff: aff , role: role },
            url: "operation/getDashboardPharmacyUpcomingPrescriptions.php",
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
             'pageLength': 10,
             'searching': false,
             'info': false,
             'paging': false,
             'lengthChange': false
    });
    
    
    //Diagnostic Dashboard upcoming appointments
    $('#dashboardUpcomingDiagnostcs').DataTable({
        "ajax": {
            data: { doctorId: doctorId, aff: aff , role: role },
            url: "operation/getDashboardDgUpcomingPrescriptions.php",
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
             'pageLength': 10,
             'searching': false,
             'info': false,
             'paging': false,
             'lengthChange': false
    });

    //Dashboard to do list
    $('#sortable-todo').DataTable({
        "pageLength": 10,
        'paging': false,
        'lengthChange': false,
        'searching': false,
        'ordering': false,
        'info': false,
        'autoWidth': false,
        "ajax": {
            data: { doctorId: doctorId },
            url: "operation/getMyToDoNotes.php",
            type: "POST"
        },
        aoColumns: [
            { sWidth: '85%' },
            { sWidth: '15%' }
        ]
    });



    //Upcoming appointments stats
    $.ajax({
        url: "operation/getDashboardDiagnosticPends.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#upcoming_appointmentsDiagnostics").attr('disabled', false);
            $.each(result, function(i) {
                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                const d = new Date();
                    //$('#upcoming_appointments').text(monthNames[d.getMonth()] + ' - ' + result[i].upcoming_appoitnments);
                    $('#upcoming_appointmentsDiagnostics').text(result[i].upcoming_appointmentsDG);
                    // $('#upcoming_telemedicine').text(result[i].telemedicine);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    
    
    //Upcoming appointments stats
    $.ajax({
        url: "operation/getDashboardUpcomingAppointmentsStats.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#upcoming_appointments").attr('disabled', false);
            $.each(result, function(i) {
                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                const d = new Date();
                $('#upcoming_appointments').text(monthNames[d.getMonth()] + ' - ' + result[i].upcoming_appoitnments);
                $('#upcoming_in_person').text(result[i].in_person);
                $('#upcoming_telemedicine').text(result[i].telemedicine);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });

    //Incomplete appointments stats
    $.ajax({
        url: "operation/getDashboardIncompleteAppointments.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#incomplete_appointments").attr('disabled', false);
            $.each(result, function(i) {
                $('#incomplete_appointments').text(result[i].incomplete_appoitnments);
                $('#incomplete_in_person').text(result[i].in_person);
                $('#incomplete_telemedicine').text(result[i].telemedicine);
                // }
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });


    // <!----------------------------------START OF DASHBOARD DIAGNOSTIC STATS--------------------------------------->

    
     //Total Diagnostics Pending Statistics
    $.ajax({
        url: "operation/getPendingDiagnostics.php",
        method: "POST",
        data: { loggedin_user: loggedin_user },
        dataType: "json",
        success: function(result) {
            $("#pending_diagnostics").attr('disabled', false);
            $.each(result, function(i) {
                $('#pending_diagnostics').text(result[i].pending_diagnostics);
                //   $('#upcoming_appointmentsDiagnostics').text(0);
                //     $('#upcoming_appointmentsDiagnostics').text(0);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Could not get statistics.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    
        $.ajax({
        url: "operation/getCompleteDiagnostics.php",
        method: "POST",
        data: { loggedin_user: loggedin_user },
        dataType: "json",
        success: function(result) {
            $("#complete_diagnostics").attr('disabled', false);
            $.each(result, function(i) {
                $('#complete_diagnostics').text(result[i].complete_diagnostics);
                //   $('#upcoming_appointmentsDiagnostics').text(0);
                //     $('#upcoming_appointmentsDiagnostics').text(0);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Could not get statistics.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    
        $.ajax({
        url: "operation/getTotalDiagnostics.php",
        method: "POST",
        data: { loggedin_user: loggedin_user },
        dataType: "json",
        success: function(result) {
            $("#total_diagnostics").attr('disabled', false);
            $.each(result, function(i) {
                $('#total_diagnostics').text(result[i].total_diagnostics);
                //   $('#upcoming_appointmentsDiagnostics').text(0);
                //     $('#upcoming_appointmentsDiagnostics').text(0);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Could not get statistics.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    
        $.ajax({
        url: "operation/getDiagnosticsTotalPatients.php",
        method: "POST",
        data: { loggedin_user: loggedin_user },
        dataType: "json",
        success: function(result) {
            $("#total_patients").attr('disabled', false);
            $.each(result, function(i) {
                $('#total_patients').text(result[i].patients_diagnostics);
                //   $('#upcoming_appointmentsDiagnostics').text(0);
                //     $('#upcoming_appointmentsDiagnostics').text(0);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Could not get statistics.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    
    
          // <!----------------------------END OF DASHBOARD DIAGNOSTIC STATS--------------------------------------->

// <!--------------------------------------START OF DASHBOARD PHARMACY STATS--------------------------------------->

    
    //Total Pending Prescription Statistics
    $.ajax({
        url: "operation/getDashboardPhmacyPendingPrec.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#upcoming_appointmentsPharmacy").attr('disabled', false);
            $.each(result, function(i) {
                $('#upcoming_appointmentsPharmacy').text(result[i].upcoming_appointmentsPharmacy);
               // $('#total_in_person_appointments').text(result[i].total_in_person);
               // $('#total_telemedicine_appointments').text(result[i].total_telemedicine);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    
     
    
    //Total Prescription Statistics
    $.ajax({
        url: "operation/getDashboardPhmacyTotalPrec.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#Total_Pharmacy").attr('disabled', false);
            $.each(result, function(i) {
                $('#Total_Pharmacy').text(result[i].Total_Pharmacy);
               // $('#total_in_person_appointments').text(result[i].total_in_person);
               // $('#total_telemedicine_appointments').text(result[i].total_telemedicine);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    
    
        
    //Total Fullfilled Prescription Statistics
    $.ajax({
        url: "operation/getDashboardPhmacyFullfiled.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#Totalfullfilled_Pharmacy").attr('disabled', false);
            $.each(result, function(i) {
                $('#Totalfullfilled_Pharmacy').text(result[i].Totalfullfilled_Pharmacy);
               // $('#total_in_person_appointments').text(result[i].total_in_person);
               // $('#total_telemedicine_appointments').text(result[i].total_telemedicine);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    
        //Total Pharmacy Prescription Patients Statistics
    $.ajax({
        url: "operation/getDashboardPatients.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#pharmacy_patient").attr('disabled', false);
            $.each(result, function(i) {
                $('#pharmacy_patient').text(result[i].pharmacy_patient);
               // $('#total_in_person_appointments').text(result[i].total_in_person);
               // $('#total_telemedicine_appointments').text(result[i].total_telemedicine);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    
    
   // <!--------------------------------------END OF DASHBOARD PHARMACY STATS--------------------------------------->

// <!--------------------------------------START OF DASHBOARD MARKETING STATS--------------------------------------->
    
    $.ajax({
        url: "operation/getBookingStats.php",
        method: "POST",
        data: { facility_id: facility_id },
        dataType: "json",
        success: function(data) {
            console.log(data);
            var labels = [];
            var bookings = [];
            var patients = [];
            for (var i in data) {
                labels.push(data[i].months);
                bookings.push(data[i].total_bookings);
                patients.push(data[i].total_patients);
            }
            var chartdata = {
                labels: labels,
                datasets: [{
                    label: "Total Bookings",
                    data: bookings,
                    borderColor: 'rgba(0, 188, 212, 0.75)',
                    backgroundColor: 'rgba(0, 188, 212, 0.3)',
                    pointBorderColor: 'rgba(0, 188, 212, 0)',
                    pointBackgroundColor: 'rgba(0, 188, 212, 0.9)',
                    pointBorderWidth: 1
                }, {
                    label: "Total Patients",
                    data: patients,
                    borderColor: 'rgba(233, 30, 99, 0.75)',
                    backgroundColor: 'rgba(233, 30, 99, 0.3)',
                    pointBorderColor: 'rgba(233, 30, 99, 0)',
                    pointBackgroundColor: 'rgba(233, 30, 99, 0.9)',
                    pointBorderWidth: 1
                }]
            };
            var graphTarget = $("#line_chart");
            var barGraph = new Chart(graphTarget, {
                type: 'line',
                data: chartdata
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    
    //Total appointments stats
    $.ajax({
        url: "operation/getMarketingTotalAppointments.php",
        method: "POST",
        data: { facility_id: facility_id },
        dataType: "json",
        success: function(result) {
            $("#marketing_total_appointments").attr('disabled', false);
            $.each(result, function(i) {
                $('#marketing_total_appointments').text(result[i].total_appointments);
                $('#marketing_total_in_person_appointments').text(result[i].total_in_person);
                $('#marketing_total_telemedicine_appointments').text(result[i].total_telemedicine);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    //Marketing total patients stats
    $.ajax({
        url: "operation/getMarketingTotalPatients.php",
        method: "POST",
        data: { facility_id: facility_id },
        dataType: "json",
        success: function(result) {
            if (result == 500) {
                $("#patients_stats").attr('disabled', false);
                var res = 0;
                $('#patients_stats').text(res);
            } else {
                $("#patients_stats").attr('disabled', false);
                $.each(result, function(i) {
                    $('#patients_stats').text(result[i].total_patients);
                });
            }
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    //Marketing patient engagement stats
    $.ajax({
        url: "operation/getMarketingPatientEngagement.php",
        method: "POST",
        data: { facility_id: facility_id },
        dataType: "json",
        success: function(result) {
            $("#patient_engagement").attr('disabled', false);
            $.each(result, function(i) {
                $('#patient_engagement').text(result[i].total_engagements);
                $('#patient_emails').text(result[i].emails);
                $('#patient_sms').text(result[i].sms);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    //Marketing financial stats
    $.ajax({
        url: "operation/getMarketingFinanceStatus.php",
        method: "POST",
        data: { facility_id: facility_id },
        dataType: "json",
        success: function(result) {
            $("#marketing_finance_stats").attr('disabled', false);
            $.each(result, function(i) {
                $('#marketing_finance_stats').text(result[i].my_finances_stats);
                $('#marketing_total_in_person').text(result[i].in_person);
                $('#marketing_total_telemedicine').text(result[i].telemedicine);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });

// <!--------------------------------------END OF DASHBOARD MARKETING STATS--------------------------------------->
    
    //Total Appointments Statistics
    $.ajax({
        url: "operation/getDashboardTotalAppointments.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#total_appointments").attr('disabled', false);
            $.each(result, function(i) {
                $('#total_appointments').text(result[i].total_appointments);
                $('#total_in_person_appointments').text(result[i].total_in_person);
                $('#total_telemedicine_appointments').text(result[i].total_telemedicine);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    
    
    //My e-prescriptions
    $.ajax({
        url: "operation/getDashboardEprescriptions.php",
        method: "POST",
        data: { doctorPostId: doctorPostId },
        dataType: "json",
        success: function(result) {
            $("#my_e_prescriptions").attr('disabled', false);
            $.each(result, function(i) {
                $('#my_e_prescriptions').text(result[i].e_prescriptions);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    //My network stats
    $.ajax({
        url: "operation/getDashboardMyNetwork.php",
        method: "POST",
        data: { doctorPostId: doctorPostId },
        dataType: "json",
        success: function(result) {
            $("#my_network_stats").attr('disabled', false);
            $.each(result, function(i) {
                $('#my_network_stats').text(result[i].my_network_stats);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    //My referrals stats
    $.ajax({
        url: "operation/getDashboardMyReferrals.php",
        method: "POST",
        data: { doctorPostId: doctorPostId },
        dataType: "json",
        success: function(result) {
            $("#total_referrals").attr('disabled', false);
            $.each(result, function(i) {
                $('#total_referrals').text(result[i].all_referrals);
                $('#outgoing_referrals').text(result[i].outgoing_referrals);
                $('#incoming_referrals').text(result[i].incoming_referrals);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });
    //My financial status stats
    $.ajax({
        url: "operation/getDashboardMyFinancialStatus.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#my_finances_stats").attr('disabled', false);
            $.each(result, function(i) {
                $('#my_finances_stats').text(result[i].my_finances_stats);
                $('#total_in_person').text(result[i].in_person);
                $('#total_telemedicine').text(result[i].telemedicine);
            });
        },
        failure: function() {
            $.toast({
                heading: 'Error',
                text: 'Something went wrong, please try again.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }
    });

    //Submitting doctor to do note
    $(document).on('submit', '#doctor_note_form', function(event) {
        event.preventDefault();
        var doctorId = $('#doctorId').val();
        var docNote = $('#doctorNote').val();
        if (docNote !== '' && doctorId !== '') {
            $.ajax({
                url: "operation/storeMyToDoNotes.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function(data) {
                    if (data == 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Your note has been added successfully to your list.',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                        $('#doctor_note_form')[0].reset();
                        $('#sortable-todo').DataTable().ajax.reload();
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

    //Incomplete appointments link click event
    $(".incompleteAppointmentsDiv").click(function() {
        window.location = 'upcoming-appointments';
    });

    //Deleting doctor note
    $(document).on('click', '.remove-note', function() {
        var noteId = $(this).attr("id");
        var doctorId = $(this).attr("urs");
        $.ajax({
            url: "operation/deleteDoctorNote.php",
            method: "POST",
            data: { 
			doctorId: doctorId,noteId: noteId
			},
            dataType: "json",
            success: function(response) {
                if (response == 200) {
                    $.toast({
                        heading: 'Success',
                        text: 'Note successfully removed from your list.',
                        icon: 'success',
                        position: 'bottom-right',
                        showHideTransition: 'slide'
                    })
                    $('#doctor_note_form')[0].reset();
                    $('#sortable-todo').DataTable().ajax.reload();
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

});

//View upcoming appointment modal
$(document).on('click', '.view_appointment', function() {
    var appointmentId = $(this).attr("id");
    $('#mTopRight').modal('show');
    $("#patient_email, #appointment_date, #patient_name, #appointment_time, #patient_phone, #service_type, #patient_insurance, #patient_note").html("fetching data...");
    $("#appt-details, #editAppDetails-Patient").show();
    $("#appt-edit, #save-details, #detail-saving").hide();
    $.ajax({
        url: "operation/getAppointmentDetails.php",
        method: "POST",
        data: { appointmentId: appointmentId },
        dataType: "json",
        success: function(data) {
            $('#mTopRight .modal-title').text(data.first_name + ' ' + data.last_name + ' ' + "Appointment Details");
            $('#patient_email').html(data.email);
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
    $(document).on('submit', '#update-details', function(event) {
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
                success: function(data) {
                    if (data == 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Patient Details Updated Successfully.',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                        $('#update-details')[0].reset();
                        $('#mTopRight').modal('hide');
                        $('#dashboardUpcomingAppointments').DataTable().ajax.reload();
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

//Submitting doctor feedback(technical issue) form
$(document).on('submit', '#tech_feedback_form', function(event) {
    event.preventDefault();
    var techIssueTitle = $('#tech_issue_title').val();
    var techIssueDescription = $('#tech_issue_desc').val();
    var doctorEmail = $('#docEmail').val();
    var doctorName = $('#docName').val();
    $('#operation').val("technical");
    var extension = $('#uploaded_file').val().split('.').pop().toLowerCase();
    if (extension !== '') {
        if (jQuery.inArray(extension, ['gif', 'png', 'jpg', 'jpeg']) === -1) {
            $.toast({
                heading: 'Error',
                text: 'The uploaded file is not supported file type. Only the following file types are supported: gif, png, jpg &.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            $('#uploaded_file').val('');
            return false;
        }
    }
    if (techIssueTitle !== '' && techIssueDescription !== '') {
        $.ajax({
            url: "operation/sendDoctorFeedback.php",
            method: 'POST',
            data: $('form').serialize(),
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(response) {
                if (response == 200) {
                    $.toast({
                        heading: 'Success',
                        text: 'Thank you! Your message has been successfully sent to My Health Africa.',
                        icon: 'success',
                        position: 'bottom-right',
                        showHideTransition: 'slide'
                    })
                    $('#tech_feedback_form')[0].reset();
                } else {
                    $.toast({
                        heading: 'Error',
                        text: 'Sorry! There is a problem sending your message to My Health Africa, please try again.',
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
            text: 'Fill all the fields.',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});

//Submitting doctor feedback (suggestions) form
$(document).on('submit', '#suggestions_feedback_form', function(event) {
    event.preventDefault();
    var suggestionTitle = $('#sugestion_title').val();
    var suggestionDescription = $('#suggestion_desc').val();
    var doctorEmail = $('#docEmail').val();
    var doctorName = $('#docName').val();
    $('#operation').val("suggestion");
    if (suggestionTitle !== '' && suggestionDescription !== '' && doctorEmail !== '') {
        $.ajax({
            url: "operation/sendDoctorFeedback.php",
            method: 'POST',
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(response) {
                if (response == 200) {
                    $.toast({
                        heading: 'Success',
                        text: 'Thank you! Your message has been successfully sent to My Health Africa.',
                        icon: 'success',
                        position: 'bottom-right',
                        showHideTransition: 'slide'
                    })
                    $('#suggestions_feedback_form')[0].reset();
                } else {
                    $.toast({
                        heading: 'Error',
                        text: 'Sorry! There is a problem sending your message to My Health Africa, please try again.',
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
            text: 'Fill all the fields.',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});



$(function() {
var start_dateval, end_dateval;
    $('#daterange-doc-btn').daterangepicker({
            minDate: moment(),
            ranges: {
                'Today': [moment(), moment()],
                'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
                'Next 7 Days': [moment(), moment().add(6, 'days')],
                'Next 30 Days': [moment(), moment().add(29, 'days')],
                'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
                'Next 3 Months': [moment().add(1, 'month').startOf('month'), moment().add(3, 'month').endOf('month')]
            },
            startDate: moment(),
            endDate: moment().add(29, 'days')
        },
        function(start, end) {
            $('#daterange-doc-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            [startDate, endDate] = $('#doctor_range').val().split(' - ');
            $(this).find('input[name="start_date"]').val(startDate);
            $(this).find('input[name="end_date"]').val(endDate);

            $start = $('#start_date').val();
            $end = $('#end_date').val();
            start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
            end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");
            var doctorId = $('#doctorId').val();
            fetch_data(doctorId, start_dateval, end_dateval);
        }

    )
    
    function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
        $.ajax({
            url: "operation/getFilteredDashboardUpcomingAppointments.php",
            method: "POST",
            data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
            dataType: "json",
            success: function(result) {
                document.getElementById("upcoming_appointments").value = ""
                document.getElementById("upcoming_in_person").value = ""
                document.getElementById("upcoming_telemedicine").value = ""
                document.getElementById("incomplete_appointments").value = ""
                document.getElementById("incomplete_in_person").value = ""
                document.getElementById("incomplete_telemedicine").value = ""
                
                document.getElementById("my_finances_stats").value = ""
                document.getElementById("total_in_person").value = ""
                document.getElementById("total_telemedicine").value = ""
                document.getElementById("my_e_prescriptions").value = ""
                $("#upcoming_appointments").attr('disabled', false);
                $.each(result, function(i) {
                    $('#upcoming_appointments').text(result[i].upcoming_appoitnments);
                    $('#upcoming_in_person').text(result[i].in_person);
                    $('#upcoming_telemedicine').text(result[i].telemedicine);
                    
                    $('#incomplete_appointments').text(0);
                    $('#incomplete_in_person').text(0);
                    $('#incomplete_telemedicine').text(0);
                    
                    $('#my_finances_stats').text(0);
                    $('#total_in_person').text(0);
                    $('#total_telemedicine').text(0);
                    $('#my_e_prescriptions').text(0);
                });
            },
            failure: function() {
                $.toast({
                    heading: 'Error',
                    text: 'Something went wrong.',
                    icon: 'error',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
            }
        });
        
        $.ajax({
            url: "operation/getFilteredTotalAppointments.php",
            method: "POST",
            data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
            dataType: "json",
            success: function(result) {
                document.getElementById("total_appointments").value = ""
                document.getElementById("total_in_person_appointments").value = ""
                document.getElementById("total_telemedicine_appointments").value = ""
                
                $("#total_appointments").attr('disabled', false);
                $.each(result, function(i) {
                    $('#total_appointments').text(result[i].total_appointments);
                    $('#total_in_person_appointments').text(result[i].total_in_person);
                    $('#total_telemedicine_appointments').text(result[i].total_telemedicine);
                });
            },
            failure: function() {
                $.toast({
                    heading: 'Error',
                    text: 'Something went wrong.',
                    icon: 'error',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
            }
        });

    }

});


$(function() {
var start_dateval, end_dateval;
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
            startDate: moment().subtract(29, 'days'),
            endDate: moment()
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
            fetch_data(doctorId, start_dateval, end_dateval);
        }

    )

    function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
        $.ajax({
            url: "operation/getFilteredPendingPrescriptions.php",
            method: "POST",
            data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
            dataType: "json",
            success: function(result) {
                     $("#upcoming_appointmentsPharmacy").attr('disabled', false);
                     $.each(result, function(i){
                    $('#upcoming_appointmentsPharmacy').text(result[i].upcoming_appointmentsPharmacy);
                     });
            },
        });
        
        $.ajax({
            url: "operation/getFilteredFulfilledPrescriptions.php",
            method: "POST",
            data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
            dataType: "json",
            success: function(result) {
                $("#Totalfullfilled_Pharmacy").attr('disabled', false);
                $.each(result, function(i) {
                    $('#Totalfullfilled_Pharmacy').text(result[i].Totalfullfilled_Pharmacy);
                });
            },
        });
        
         $.ajax({
            url: "operation/getFilteredTotalPrescriptions.php",
            method: "POST",
            data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
            dataType: "json",
            success: function(result) {
                $("#Total_Pharmacy").attr('disabled', false);
                $.each(result, function(i) {
                    $('#Total_Pharmacy').text(result[i].Total_Pharmacy);
                });
            },
        });
        
         $.ajax({
            url: "operation/getFilteredTotalPatientsPrescriptions.php",
            method: "POST",
            data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
            dataType: "json",
            success: function(result) {
                $("#pharmacy_patient").attr('disabled', false);
                $.each(result, function(i) {
                    $('#pharmacy_patient').text(result[i].pharmacy_patient);
                });
            },
        });

    }

});


$(function() {
var start_dateval, end_dateval;
    $('#daterange-diag-btn').daterangepicker({
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
            $('#daterange-diag-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            [startDate, endDate] = $('#diagnostics_range').val().split(' - ');
            $(this).find('input[name="start_date"]').val(startDate);
            $(this).find('input[name="end_date"]').val(endDate);

            $start = $('#start_date').val();
            $end = $('#end_date').val();
            start_dateval = moment(start, 'MMMM D, YYYY').format("YYYY-MM-DD");
            end_dateval = moment(end, 'MMMM D, YYYY').format("YYYY-MM-DD");
            var doctorId = $('#doctorId').val();
            fetch_data(doctorId, start_dateval, end_dateval);
        }

    )

    // function fetch_data(doctorId, start_dateval = '', end_dateval = '') {
    //     $.ajax({
    //         url: "operation/getFilteredPendingPrescriptions.php",
    //         method: "POST",
    //         data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
    //         dataType: "json",
    //         success: function(result) {
    //                  $("#upcoming_appointmentsPharmacy").attr('disabled', false);
    //                  $.each(result, function(i){
    //                 $('#upcoming_appointmentsPharmacy').text(result[i].upcoming_appointmentsPharmacy);
    //                  });
    //         },
    //     });
        
    //     $.ajax({
    //         url: "operation/getFilteredFulfilledPrescriptions.php",
    //         method: "POST",
    //         data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
    //         dataType: "json",
    //         success: function(result) {
    //             $("#Totalfullfilled_Pharmacy").attr('disabled', false);
    //             $.each(result, function(i) {
    //                 $('#Totalfullfilled_Pharmacy').text(result[i].Totalfullfilled_Pharmacy);
    //             });
    //         },
    //     });
        
    //      $.ajax({
    //         url: "operation/getFilteredTotalPrescriptions.php",
    //         method: "POST",
    //         data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
    //         dataType: "json",
    //         success: function(result) {
    //             $("#Total_Pharmacy").attr('disabled', false);
    //             $.each(result, function(i) {
    //                 $('#Total_Pharmacy').text(result[i].Total_Pharmacy);
    //             });
    //         },
    //     });
        
    //      $.ajax({
    //         url: "operation/getFilteredTotalPatientsPrescriptions.php",
    //         method: "POST",
    //         data: { doctorId: doctorId, start_dateval: start_dateval, end_dateval: end_dateval },
    //         dataType: "json",
    //         success: function(result) {
    //             $("#pharmacy_patient").attr('disabled', false);
    //             $.each(result, function(i) {
    //                 $('#pharmacy_patient').text(result[i].pharmacy_patient);
    //             });
    //         },
    //     });

    // }

});


 //View Pharmacist prescription modal
    $(document).on('click', '.diagnostic_details', function() {
        var diagnostic_no = $(this).attr("id");
        $.ajax({
            url: "operation/getDiagnosticDetails.php",
            method: "POST",
            data: { diagnostic_no: diagnostic_no },
            dataType: "json",
            success: function(data) {
                $('#diagnostic_details').modal('show');
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
                url: "operation/getPrescribedTests.php",
                type: "POST"
            },
            aoColumns: [
                { sWidth: '40%' },
                { sWidth: '50%' },
                { sWidth: '10%' }

            ]
        });

    });
    
        $('#diagnostic_details').on('hidden.bs.modal', function() {
        $('#RequestedTests').dataTable().fnDestroy();
    });
    
        

    // //View Pharmacist prescription modal
    // $(document).on('click', '.upload_dg', function() {
    //     var prescriptionNo = $(this).attr("id");
    //     $.ajax({
    //         //url: "operation/FullfillDiagnostic.php",
    //       // method: "POST",
    //         data: { prescriptionNo: prescriptionNo},
    //         dataType: "json",
    //         success: function(data) {
    //             $('#upload_dg').modal('show');
    //             //$('#diagnostic_number').html(data.dg_number);

               
    //         }

    //     });


    // });
    //View Pharmacist prescription modal
    $(document).on('click', '.upload_dg', function() {
        var prescriptionNo = $(this).attr("id");
        document.getElementById('prescriptionNo').value = prescriptionNo;
        $('#upload_dg').modal('show');
        $('#prescriptionNo').val(prescriptionNo);

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
        
    $('#prescription_details').on('hidden.bs.modal', function() {
        $('#prescribedDrugs').dataTable().fnDestroy();
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



    //Submitting new location form
    $(document).on('submit', '#FullfillDiagnosis', function(event) {
        event.preventDefault();
       /// var title = $('#title').val();
        var prescriptionNo = $('#prescriptionNo').val();
        var results = $('#results').val();
        var dg_notes = $('#dg_notes').val();
        
        //var upload = $('#upload').val();
        if (prescriptionNo !== '') {
            $.ajax({
                url: "operation/FullfillDiagnostic.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function(data) {
                    if (data = 200) {
									$.toast({
										//width:'100px';
										heading: 'Success',
										text: 'The diagnostic has been successfully sent to the doctor.',
										icon: 'success',
										position: 'bottom-right',
										showHideTransition: 'slide'
									})
                                     $('#FullfillDiagnosis')[0].reset();
                                     $('#upload_dg').modal('hide');
                                     $('#RequestedTests').DataTable().ajax.reload();




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
                text: 'Kindly fill all the fields marked.',
                icon: 'warning',
                position: 'top-right',
                showHideTransition: 'slide'
            })
        }
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
                      }else
                      $(insure).show();
                    }

       
                    
				




    
    