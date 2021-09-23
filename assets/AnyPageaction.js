$(function () {
    var loading_img = '<center><img src="img/loading.gif" style="max-height: 150px;"></center>';
    // $(".loading").html(loading_img);
    var doctorId = $('#doctorId').val();
    $('#viewAction').val("viewConfirmed");
    var viewAction = $('#viewAction').val();

    var selectOptions = document.getElementById('shedulerTimePickerAddNewAppoinment');
    selectOptions.style.visibility = 'hidden';

    //Submitting new appointment form
    $(document).on('submit', '#newAppointment', function(event) {
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
        //var intlNumber = $("#phone").intlTelInput("getNumber");
        var patientPhoneNumber = $('#phone_number').val();
        var appontmentDate = $('#appointmentDate').val();
        var bookingNote = $('#booking_note').val();
        var operation = $('#operation').val('newManualBooking');

        if (docLocation !== '' && doctorId !== '' && docService !== '' && appointmentStartTime !== '' && patientGender !== '' && patientDateOfBirth !== '' && patientEmail !== '' && patientFirstName !== '' && patientLastName !== '' && patientPhoneNumber !== '' && appontmentDate !== '') {
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
                            url: "../../patientexperience/operation/oneMedProEventHanders.php",
                            method: "POST",
                            data: { trigger: 'pending', facility_id: facility_id, token: csrf_token }
                        });
                    } else if (data == 500) {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 5000,
                            showConfirmButton: false
                        });
                    }
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
	
	
$(function() {
    var input = document.querySelector("#phone_number");
    window.intlTelInput(input, {
        allowDropdown: true,
        // autoHideDialCode: true,
        // autoPlaceholder: "off",
        //dropdownContainer: document.body,
        //excludeCountries: ["us"],
        formatOnDisplay: true,
        geoIpLookup: function(callback) {
            $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        //hiddenInput: "full_number",
        initialCountry: "KE",
        //localizedCountries: { 'de': 'Deutschland' },
        nationalMode: false,
        //onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
        placeholderNumberType: "MOBILE",
        preferredCountries: ['KE', 'UG', 'TZ', 'SO', 'RW'],
        separateDialCode: true,
        utilsScript: "assets/bundles/countrycode/build/js/utils.js",
    });
});

//Services drop down
$(function() {
    var doctorId = $('#doctorId').val();
    $.ajax({
        url: "operation/getDoctorServices.php",
        method: "POST",
        data: { doctorId: doctorId },
        dataType: "json",
        success: function(result) {
            $("#service").attr('disabled', false);
            $.each(result, function(i) {
                $('#service').append($('<option></option>').attr("value", result[i].service).text(result[i].name));
            });
        },
        failure: function() {
            alert("Error");
        }
    });
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
            $("#location").attr('disabled', false);
            $.each(result, function(i) {
                $('#location').append($('<option></option>').attr("value", result[i].location).text(result[i].name));
            });
        },
        failure: function() {
            alert("Error");
        }
    });
});

$(document).ready(function() {
    $("#service").change(function() {
        var doctorId = $('#doctorId').val();
        var selectedService = $(this).val();
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
    changeYear: true
});

$(document).ready(function() {

    $("#appointmentDatepicker").change(function() {

        var doctorId = $('#doctorId').val();
        var serviceId = $('#service').val();
        var chosenDate = $(this).val();
        document.getElementById('appointmentDate').value = chosenDate;

        $.ajax({
            url: "operation/getDoctorTimeSlots.php",
            method: "POST",
            data: { doctorId: doctorId, chosenDate: chosenDate, serviceId: serviceId },
            dataType: "json",
            success: function(result) {
                if (result == 500) {
                    var message = 'No availability, please select another day.';
                    $("#shedulerTimePickerAddNewAppoinment").empty();
                    $("#shedulerTimePickerAddNewAppoinment").append("<option class='btn-error' >" + message + "</option>");

                } else {

                    var selectOptions = document.getElementById('shedulerTimePickerAddNewAppoinment');
                    selectOptions.style.visibility = 'visible';

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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	});