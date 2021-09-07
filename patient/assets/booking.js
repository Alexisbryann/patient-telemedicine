var appointment_id, onboarding;
jQuery(document).ready(function() {
    'use strict';

    $('#callback-error, #reschedule-error, #concern-error, #concern-desc-error, #reports-error, #medication-error, #allergies-error').hide();
    appointment_id = $('#appointment_id').val();
    onboarding = $('#onboarding').val();
    if (onboarding == 1) {
        $('.telemed-step-one').hide();
        $('.telemed-step-two').show(500);
        countdown('countdown', 0, 5);
        setInterval(checkStatus, 5000);
    } else {
        $('.telemed-step-two').hide();
        $('.telemed-step-one').show(500);
    }

    $('#datetimepicker').datetimepicker({
        format: 'd/m/Y H:i',
        defaultDate: false,
        defaultTime: false,
        minDate: 0,
        maxDate: '+07-01-1970',
        validateOnBlur: true,
        maxTime: '18:30',
        allowTimes: [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00'
        ],
        roundTime: 'ceil'
    });

    $(document).on('click', '#request-callback', function() {
        $.ajax({
            url: "operation/psi/telemedicineOperations.php",
            method: "POST",
            data: { operation: 'request-callback', appointment_id: appointment_id },
            dataType: "json",
            success: function(result) {
                if (result == 200) {
                    $('.modal-header, .modal-body, .modal-footer').hide();
                    $('#message').html('');
                    $('#message').html('Call Back Requested');
                    $('.callback-success').show(500);
                    setInterval(function() {
                        $('#callback').modal('hide');
                        window.location.href = 'https://healthafrica.com';
                    }, 4000);
                } else {
                    document.getElementById('callback-error').innerHTML = '';
                    $('#callback-error').show(500);
                    document.getElementById('callback-error').innerHTML = 'Sorry. A problem occurred while sending your request, please try again.';
                }
            },
            failure: function() {
                document.getElementById('callback-error').innerHTML = '';
                $('#callback-error').show(500);
                document.getElementById('callback-error').innerHTML = 'Sorry. A problem occurred while sending your request, please try again.';
            }
        });
    });
    $(document).on('click', '#reschedule-appointment', function() {
        $('.waiting').hide(500);
        $('.reschedule-appointment').show(500);
    });
    $('.validate').change(function() {
        var chose_date = $('#datetimepicker').val();
        if (chose_date == '') {
            $('#reschedule').attr('disabled', 'disabled');
        } else {
            $('#reschedule').removeAttr('disabled');
        }
    });
    $('#reschedule').on('click', function() {
        var chose_date = $('#datetimepicker').val();
        if (chose_date !== '') {
            $.ajax({
                url: "operation/psi/telemedicineOperations.php",
                method: "POST",
                data: { operation: 'reschedule-appointment', appointment_id: appointment_id, chose_date: chose_date },
                dataType: "json",
                success: function(result) {
                    if (result == 200) {
                        $('.reschedule-appointment, .waiting .modal-body, .waiting .modal-footer').hide();
                        $('#message').html('');
                        $('#message').html('Your Appointment Has Been Rescheduled');
                        $('.waiting, .callback-success').show(500);
                    } else {
                        document.getElementById('reschedule-error').innerHTML = '';
                        $('#reschedule-error').show(500);
                        document.getElementById('reschedule-error').innerHTML = 'Sorry. A problem occurred while sending your request, please try again.';
                    }
                },
                failure: function() {
                    document.getElementById('reschedule-error').innerHTML = '';
                    $('#reschedule-error').show(500);
                    document.getElementById('reschedule-error').innerHTML = 'Sorry. A problem occurred while sending your request, please try again.';
                }
            });
        }
    });

    document.getElementById("now").onchange = appointmentNow;
    document.getElementById("schedule").onchange = appointmentSchedule;

    function appointmentNow() {
        if (document.getElementById("now").checked) {
            $('.uploads').show(500);
        } else {
            $('#medical-reports').val('');
            $('.uploads').hide(500);
        }
    }

    function appointmentSchedule() {
        if (document.getElementById("schedule").checked) {
            $('#medication').show(500);
        } else {
            $('#medication').val('');
            $('#medication').hide(500);
        }
    }
});

/*****************PATIENT ON BOARDING*****************/
var form = $("#booking_form").show();
form.steps({
    headerTag: "h3",
    bodyTag: "fieldset",
    transitionEffect: "slideLeft",
    onInit: function(event, current) {
        $("a[href$='previous']").hide();
    },
    labels: {
        finish: "Proceed To Pay",
        next: "Next",
        previous: "Back",
    },
    onStepChanging: function(event, currentIndex, newIndex) {
        // Allways allow previous action even if the current form is not valid!
        if (currentIndex > newIndex) {
            if (currentIndex === 0) {
                $("a[href$='previous']").hide();
                document.getElementById("appointment").checked = true;
                document.getElementById("confirm").checked = false;
            } else if (currentIndex === 1) {
                $("a[href$='previous']").hide();
            }
            return true;
        }
        if (currentIndex === 0) {
            $("a[href$='previous']").show();
            document.getElementById("appointment").checked = false;
            document.getElementById("confirm").checked = true;
            return true;
        } else if (currentIndex === 1) {
            return true;
        } else if (currentIndex === 2) {
            if (document.getElementById("reports-yes").checked || document.getElementById("reports-no").checked) {
                if (document.getElementById("reports-yes").checked) {
                    if ($('#medical-reports').val() !== '') {
                        return true;
                    } else {
                        document.getElementById('reports-error').innerHTML = '';
                        document.getElementById('reports-error').innerHTML = 'You\'ve selected to upload medical reports, kindly upload them.';
                        $('#reports-error').show(500);
                        return false;
                    }
                } else if (document.getElementById("reports-no").checked) {
                    return true;
                }
            } else {
                document.getElementById('reports-error').innerHTML = '';
                document.getElementById('reports-error').innerHTML = 'Kindly select an option to continue.';
                $('#reports-error').show(500);
                return false;
            }
        } else if (currentIndex === 3) {
            if (document.getElementById("medication-yes").checked) {
                if ($('#medication').val() !== '') {
                    return true;
                } else {
                    document.getElementById('medication-error').innerHTML = '';
                    document.getElementById('medication-error').innerHTML = 'Kindly give a brief description of the medication you\'re under.';
                    $('#medication-error').show(500);
                    return false;
                }
            } else if (document.getElementById("medication-no").checked) {
                return true;
            } else {
                document.getElementById('medication-error').innerHTML = '';
                document.getElementById('medication-error').innerHTML = 'Kindly select an option to continue.';
                $('#medication-error').show(500);
                return false;
            }
        }
        if (currentIndex < newIndex) {
            // To remove error styles
            form.find(".body:eq(" + newIndex + ") label.error").remove();
            form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
        }
    },
    onFinishing: function(event, currentIndex) {
        if (document.getElementById("allergies-yes").checked) {
            if ($('#allergies').val() !== '') {
                return true;
            } else {
                document.getElementById('allergies-error').innerHTML = '';
                document.getElementById('allergies-error').innerHTML = 'Kindly specify your allergens.';
                $('#allergies-error').show(500);
                return false;
            }
        } else if (document.getElementById("allergies-no").checked) {
            return true;
        } else {
            document.getElementById('allergies-error').innerHTML = '';
            document.getElementById('allergies-error').innerHTML = 'Kindly select an option to continue.';
            $('#allergies-error').show(500);
            return false;
        }
    },
    onFinished: function(event, currentIndex) {
        event.preventDefault();
        $.ajax({
            url: "operation/updatePatientInfo.php",
            method: "POST",
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(response) {
                if (response == 200) {
                    setInterval(checkStatus, 5000);
                    $('.telemed-step-one').hide();
                    $('.telemed-step-two').show(500);
                    countdown('countdown', 0, 5);
                } else if (response == 400) {
                    document.getElementById('allergies-error').innerHTML = '';
                    document.getElementById('allergies-error').innerHTML = 'Sorry, one or more files you uploaded in the medical reports section is not of a valid expected file type.';
                    $('#allergies-error').show(500);
                } else if (response == 405) {
                    document.getElementById('allergies-error').innerHTML = '';
                    document.getElementById('allergies-error').innerHTML = 'Sorry, one or more files you uploaded in the medical reports section is too large. Maximum allowed size is 10MB';
                    $('#allergies-error').show(500);
                } else if (response == 404) {
                    document.getElementById('allergies-error').innerHTML = '';
                    document.getElementById('allergies-error').innerHTML = 'Sorry, one or more files you uploaded in the medical reports section not allowed.';
                    $('#allergies-error').show(500);
                }
            },
            async: false
        });
    }
});

function checkStatus() {
    $.ajax({
        url: "operation/checkStatus.php",
        method: "POST",
        data: { id: appointment_id },
        dataType: 'json',
        success: function(response) {
            if (response.status == 200) {
                window.location = response.redirect_url;
            }
        }
    });
}