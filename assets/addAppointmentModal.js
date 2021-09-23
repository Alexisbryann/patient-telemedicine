$(document).ready(function () {
    
 //Initialize Select2 Elements
    $('.select2').select2();
    
    $("#doctor_select").hide();
    
     $('#service').select2({
    dropdownParent: $('#manualBooking')
    });
    
     $('#facility_doctors').select2({
        dropdownParent: $('#manualBooking')
    });
    
     $('#gender').select2({
        dropdownParent: $('#manualBooking')
    });
    
     $('#payment_method').select2({
        dropdownParent: $('#manualBooking')
    });
    
     $('#service').select2({
        dropdownParent: $('#manualBooking')
    });

 //open appointment booking modal
    $(document).on('click', '#openAppointmentBookingModal', function() {
        $('#manualBooking').modal('show');
        $('#initiator').val("Navbar");
    });
    
    var input = document.querySelector("#phone_number"),
        errorMsg = document.querySelector("#error-msg"),
        validMsg = document.querySelector("#valid-msg");
    var errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
    var iti = window.intlTelInput(input, {
        allowDropdown: true,
        formatOnDisplay: true,
        geoIpLookup: function(callback) {
            $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        hiddenInput: "full_number",
        nationalMode: true,
        placeholderNumberType: "MOBILE",
        preferredCountries: ['KE', 'UG', 'TZ', 'SO', 'RW'],
        separateDialCode: true,
        utilsScript: "assets/bundles/countrycode/build/js/utils.js?1603274336113",
    });

    var reset = function() {
        input.classList.remove("error");
        errorMsg.innerHTML = "";
        errorMsg.classList.add("hide");
        validMsg.classList.add("hide");
    };

    // on blur: validate
    input.addEventListener('blur', function() {
        reset();
        if (input.value.trim()) {
            if (iti.isValidNumber()) {
                validMsg.classList.remove("hide");
            } else {
                input.classList.add("error");
                var errorCode = iti.getValidationError();
                errorMsg.innerHTML = errorMap[errorCode];
                errorMsg.classList.remove("hide");
            }
        }
    });

    // on keyup / change flag: reset
    input.addEventListener('change', reset);
    input.addEventListener('keyup', reset);
    
    var role = $('#role').val();
    
    if (role == 'S.Admin' || role == 'Admin'){
        $('#doctor_select').show();
    }else{
        $('#doctor_select').hide();
    }

    //Submitting new appointment form
    $(document).on('submit', '#newAppointment', function(event) {
        
        $('#newAppointment [type="submit"]').prop('disabled', true).html(' <strong>Saving...&nbsp;&nbsp;</strong> <div class="loader" role="status"></div>');
    
        event.preventDefault();
        var doctorId = $('#bookingDoctorId').val();
        var doctorName = $('#docName').val();
        var doctorEmail = $('#docEmail').val();
        var docLocation = $('#location').val();
        var docService = $('#service').val();
        var appointmentStartTime = $('#shedulerTimePickerAddNewAppoinment').val();
        var patientGender = $('#gender').val();
        var patientDateOfBirth = $('#dateOfBirth').val();
        var patientEmail = $('#patient_email').val();
        var patientFirstName = $('#patient_firstname').val();
        var patientLastName = $('#patient_lastname').val();
        var patientPhoneNumber = $('#phone_number').val();
        var butn_used = $('#butn_used').val();
        var facility_id = $('#facility_id').val();
        var appointmentDate = $('#appointmentDate').val();
        var bookingNote = $('#booking_note').val();
        var operation = $('#operation').val('newManualBooking');
        var invite_doctor_email = $('#invite_doctor_email').val();
        var invite_doctor_phone = $('#invite_doctor_phone').val();
        var invite_patient_email = $('#invite_patient_email').val();
        var invite_patient_phone = $('#invite_patient_phone').val();

        if (docLocation !== '' && doctorId !== '' && docService !== '') {
            $.ajax({
                url: "operation/addRescheduleBooking.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function(data) {
                    if (data == 200) {
                        $('#manualBooking').modal('hide');
                        $('#newAppointment')[0].reset();
                        swal({
                            title: "Success",
                            text: "A new appointment has been successfully added to your list.",
                            type: "success",
                            timer: 5000,
                            showConfirmButton: false
                        });
                        $('#upcomingAppointments').DataTable().ajax.reload();

                        // call to patient experience event handler after appointment has been successfuly saved
                        $.ajax({
                            url: "../../patientexperience/operation/oneMedProEventHandlers.php",
                            method: "POST",
                            data: { trigger: 'pending', facility_id: facility_id, token: csrf_token }
                        });
                    } else {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 5000,
                            showConfirmButton: false
                        });
                    }
                    
                    $('#newAppointment [type="submit"]').html('Add Appointment').prop('disabled', false);
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

});

    
$(document).ready(function() {
    
    $("#more_participants").hide(500);
    $("#telemedicine_disclaimer").hide();
    $("#patient_email_controls").hide();
    $("#doctor_email_controls").hide();
    $("#insurancePolicy").hide();
    $("#insuranceName").hide();
    $('.shedulerTimePickerAddNewAppoinment').hide();
    $('#manualBooking').on('hidden.bs.modal', function() {
        $('#phone_number').empty();
        $('#dateOfBirth').empty();
        $('#patient_email').empty();
        $('#patient_firstname').empty();
        $('#appointmentDate').empty();
        $('#shedulerTimePickerAddNewAppoinment').empty();
        $('#patient_lastname').empty();
    });

    $('#payment_method').on('change', function() {
        if (this.value == 'Insurance') {
            $("#insuranceName").show(500);
            $("#insurancePolicy").show(500);
        } else {
            $("#insurancePolicy").hide(500);
            $("#insuranceName").hide(500);
        }
    });
    
   // display disclaimer when telemedicine service selected
    $('#service').on('change', function() {
        var location = $('#service option[value="'+ $(this).val() +'"]').attr('data-location');
        
        if (location == 130) {
            $("#telemedicine_disclaimer").show(500);
           $("#more_participants").show(500);
        } else {
            $("#telemedicine_disclaimer").hide(500);
            $("#more_participants").hide(500);
            $("#patient_email_controls").hide();
            $("#doctor_email_controls").hide();

        }
    });

});
  //CHECK IF DOCTOR WANTS TO ADD PARTICIPANTS ON THE CALL
   function Add_telemed_invites() {
                if (document.getElementById("add_participant_request").checked){
                    $("#patient_email_controls").show();
                    $("#doctor_email_controls").show();
        
                    
                } else {
                       $("#patient_email_controls").hide();
                       $("#doctor_email_controls").hide();

        
                } 
        } 
//Services drop down
$(function() {
    var doctorId = $('#doctorId').val();
    var role = $('#role').val();
    var facility_id = $('#userfacility').val();
    if (role == 'Sec' || role == 'S.Admin' || role == 'Admin'){
        $.ajax({
            url: "operation/getDoctorServices.php",
            method: "POST",
            data: { facility_id: facility_id },
            dataType: "json",
            success: function(result) {
                if (result == '404') {
                    var txt = 'No services found';
                    $("#service").attr('disabled', false);
                    $("#service").empty();
                    $.each(result, function(i) {
                        $('#service').append($('<option></option>').attr("value", '').text(txt));
                    });
                } else {
                    $("#service").attr('disabled', false);
                    $("#service").empty();
                    $.each(result, function(i) {
                        // attach location data to service option
                        $('#service').append($('<option></option>').attr({value: result[i].service, "data-location": result[i].location}).text(result[i].name));
                    });
                }
            },
            failure: function() {
                alert("Error");
            }
        });
    } else {
        $.ajax({
            url: "operation/getDoctorServices.php",
            method: "POST",
            data: { doctorId: doctorId },
            dataType: "json",
            success: function(result) {
                if (result == '404') {
                    var txt = 'No services found';
                    $("#service").attr('disabled', false);
                    $("#service").empty();
                    $.each(result, function(i) {
                        $('#service').append($('<option></option>').attr("value", '').text(txt));
                    });
                } else {
                    $("#service").attr('disabled', false);
                    $("#service").empty();
                    $.each(result, function(i) {
                        // attach location data to service option
                        $('#service').append($('<option></option>').attr({value: result[i].service, "data-location": result[i].location}).text(result[i].name));
                    });
                }
            },
            failure: function() {
                alert("Error");
            }
        });
    }
});

//Locations drop down
$(function() {
    var doctorId = $('#doctorId').val();
    $.ajax({
        url: "operation/getDoctorLocations.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            if(result !== '' || result !== 'No Services found'){
                $("#location").attr('disabled', false);
                $.each(result, function(i) {
                    $('#location').append($('<option></option>').attr("value", result[i].location).text(result[i].name));
                });
            }
        },
        failure: function() {
            alert("Error");
        }
    });
});

//Doctors drop down
$(document).ready(function() {
    $("#service").change(function() {
        var doctorId = $('#doctorId').val();
        var selectedService = $(this).val();
        var facility_id = $('#userfacility').val();
        var role = $('#role').val();
        $.ajax({
            url: "operation/getFilteredDoctorLocation.php",
            method: "POST",
            data: { doctorId: doctorId, selectedService: selectedService },
            dataType: "json",
            success: function(response) {
                var len = response.length;
                $("#location").empty();
                for (var i = 0; i < len; i++) {
                    var val = response[i]['location'];
                    var name = response[i]['name'];
                    $("#location").append("<option value='" + val + "'>" + name + "</option>");
                }
            }
        });
        $.ajax({
            url: "operation/getFacilityDoctors.php",
            method: "POST",
            data: { facility_id: facility_id, doctorId: doctorId, selectedService: selectedService, role: role },
            dataType: "json",
            success: function(result) {
                if (result == '404') {
                    var txt = 'No doctor found for the selected service';
                    $("#facility_doctors").attr('disabled', false);
                    $("#facility_doctors").empty();
                    $.each(result, function(i) {
                        $('#facility_doctors').append($('<option></option>').attr("value", '').text(txt));
                    });
                } else {
                    $("#facility_doctors").attr('disabled', false);
                    $("#facility_doctors").empty();
                    $.each(result, function(i) {
                        $('#facility_doctors').append($('<option></option>').attr("value", result[i].id).text(result[i].name));
                    });
                }
            },
            failure: function() {
                alert("Error");
            }
        });
    });
});

$(function() {
    $('#appointmentDatepicker').datepicker({
        minDate: new Date(),
        firstDay: 1,
        dateFormat: 'yy-mm-dd',
        yearRange: "-0:+1",
        maxDate: '+12m',
        inline: true,
    });
});

$(function() {
    $('#rescheduleDatepicker').datepicker({
        minDate: new Date(),
        firstDay: 1,
        dateFormat: 'yy-mm-dd',
        yearRange: "-0:+1",
        maxDate: '+12m',
        inline: true
    });
});

$("#dateOfBirth").datepicker({
    maxDate: new Date(),
    minDate: new Date() - 100,
    dateFormat: 'yy-mm-dd',
    allowInputToggle: true,
    changeMonth: true,
    yearRange: "-100:+0",
    yearRange: "-100:+0",
    changeYear: true
});

$(document).ready(function() {

    $("#appointmentDatepicker").change(function() {

        var doctorId = $('#doctorId').val();
        var serviceId = $('#service').val();
        var selectedDoc = $('#facility_doctors').val();
        var chosenDate = $(this).val();
        document.getElementById('appointmentDate').value = chosenDate;

        $.ajax({
            url: "operation/getFacilityDoctorTimeSlots.php", 
            method: "POST",
            data: { doctorId: doctorId, chosenDate: chosenDate, serviceId: serviceId, selectedDoc: selectedDoc },
            dataType: "json",
            success: function(result) {
                if (result == 500) {
                    var message = 'No availability, please select another day.';
                    $('.shedulerTimePickerAddNewAppoinment').show();
                    $("#shedulerTimePickerAddNewAppoinment").empty();
                    $("#shedulerTimePickerAddNewAppoinment").append("<option class='btn-error' >" + message + "</option>");

                } else {
                    $('.shedulerTimePickerAddNewAppoinment').show();
                    var len = result.length;
                    $("#shedulerTimePickerAddNewAppoinment").empty();
                    $.each(result, function(key, value) {
                        $('#shedulerTimePickerAddNewAppoinment').append($('<option class="btn-circle btn btn-slot"></option>')
                            .attr("value", value)
                            .text(value));
                    });
                }
            }
        });
    });

});

