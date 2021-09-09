var appointment_id,onboarding;
const global_settings = {
    screen_is_mobile: window.innerWidth < 758,
}
jQuery(document).ready(function () {
    'use strict';
    $('#datetimepicker').datetimepicker({
        format:'d/m/Y H:i',
        defaultDate: false,
        defaultTime:false,
        minDate:0,
        maxDate:'+07-01-1970',
        validateOnBlur:true,
        maxTime:'18:30',
        allowTimes:[
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
        roundTime:'ceil'
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

var form = $("#booking-form").show();
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
            } else if (currentIndex === 1) {
                $("a[href$='previous']").show();
            }
            return true;
        }
        if (global_settings['screen_is_mobile']) {
            if (currentIndex === 0) {
                if (validateInput(step=1)) {
                    $("a[href$='previous']").show();
                    document.getElementById("appointment").checked = false;
                    document.getElementById("confirm").checked = true;
                    return true;
                }
            } else if (currentIndex === 1) {
                if (document.getElementById('now').checked) {
                    return true;
                } else if (document.getElementById('schedule').checked) {
                    if (validateInput(step=2)) {
                        return true;  
                    }
                }
            }
        } else {
            if (currentIndex === 0) {
                if (validateInput(step=1)) {
                    $("a[href$='previous']").show();
                    document.getElementById("appointment").checked = false;
                    document.getElementById("confirm").checked = true;
                    return true;
                }
            } else if (currentIndex === 1) {
                return true;
            }
        }
        if (currentIndex < newIndex) {
            // To remove error styles
            form.find(".body:eq(" + newIndex + ") label.error").remove();
            form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
        }
    },
    onFinishing: function(event, currentIndex) {
        return true;
    },
    onFinished: function(event, currentIndex) {
        event.preventDefault();
        var btn = document.querySelectorAll('a[href="#finish"]');
        $(btn).html('<i class="sending fa fa-spinner fa-spin"></i>Sending...');
        $('.btn-next').css("pointer-events", "none");
        const txRef = '' + Math.floor((Math.random() * 1000000000) + 1);
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        //Direct Pay Online details
        const PaymentURL = 'https://secure.3gdirectpay.com/dpopayment.php?ID=';
        $.ajax({
            url: "operation/bookingOperations.php",
            method: "POST",
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(response) {
                var response = JSON.parse(response);
                if (response.response == 200) {
                    $(btn).html('');
                    $(btn).html('Submitted');
                    var appointment_id = response.id;
                    DPO_Payment(PaymentURL, name, email, phone, txRef, appointment_id);
                } else if(response == 500) {
                    $(btn).css("pointer-events", "auto");
                    $(btn).html('');
                    $(btn).html('Proceed To Pay');
                    document.getElementById('allergies-error').innerHTML = '';
                    document.getElementById('allergies-error').innerHTML = 'Sorry, there was a problem with sending your request, please try again.';
                    $('#allergies-error').show(500);
                } 
            },
            async: false
        });
    }
});

function DPO_Payment(PaymentURL, name, email, phone, txRef, appointment_id) {
    var type;
    if (document.getElementById('now').checked) {
        type = 'now';
    } else if (document.getElementById('schedule').checked){
        type = 'schedule';
    }
    $.ajax({
        url: "operation/DPO_API.php",
        method: "POST",
        data: {
            operation: 'createToken',
            id: appointment_id,
            type: type,
            txRef: txRef,
            name: name,
            email: email,
            phone: phone
        },
        dataType: "json",
        success: function(endpoint_response) {
            if (endpoint_response.Result == 000) {
                var TransactionToken = endpoint_response.TransToken;
                console.log(TransactionToken);
                window.location = PaymentURL + TransactionToken;
            } else {
                var tokenError = endpoint_response.ResultExplanation;
                swal({
                    title: "Transaction token creation failed",
                    text: tokenError,
                    type: "error",
                    timer: 5000,
                    showConfirmButton: false
                });
                $(btn).prop('disabled', false).html('Proceed To Pay');
            }
        }
    });
}

function validateInput(step) {
    var error = 0,
        name = document.forms["booking-form"]["name"].value,
        email = document.forms["booking-form"]["email"].value,
        phone = document.forms["booking-form"]["phone"].value,
        gender = document.forms["booking-form"]["gender"].value,
        dob = document.forms["booking-form"]["dob"].value,
        location = document.forms["booking-form"]["location"].value,
        type = document.forms["booking-form"]["appointment-type"].value,
        date = document.forms["booking-form"]["appointment-date"].value,
        time = document.forms["booking-form"]["appointment-time"].value;

    if (step == 1) {
        document.getElementById('name-error').innerHTML = '';
        if (name == null || name == '') {
            error++;
            document.getElementById('name-error').innerHTML = 'Kindly fill in your full name.';
            $('#name-error').show(500);
        }else $('#name-error').hide(500);
        document.getElementById('email-error').innerHTML = '';
        if (email == null || email == '') {
            error++;
            document.getElementById('email-error').innerHTML = 'Kindly fill in your email address.';
            $('#email-error').show(500);
        }else $('#email-error').hide(500);
        document.getElementById('gender-error').innerHTML = '';
        if (gender == null || gender == '') {
            error++;
            document.getElementById('gender-error').innerHTML = 'Kindly fill in your gender.';
            $('#gender-error').show(500);
        }else $('#gender-error').hide(500);
        document.getElementById('dob-error').innerHTML = '';
        if (dob == null || dob == '') {
            error++;
            document.getElementById('dob-error').innerHTML = 'Kindly fill in your date of birth.';
            $('#dob-error').show(500);
        }else $('#dob-error').hide(500);
        document.getElementById('phone-error').innerHTML = '';
        if (phone == null || phone == '') {
            error++;
            document.getElementById('phone-error').innerHTML = 'Kindly input your phone number.';
            $('#phone-error').show(500);
        }else $('#phone-error').hide(500);
        document.getElementById('location-error').innerHTML = '';
        if (location == null || location == '') {
            error++;
            document.getElementById('location-error').innerHTML = 'Kindly select your location.';
            $('#location-error').show(500);
        }else $('#location-error').hide(500);
        if (!global_settings['screen_is_mobile']) {
            if (type == 'schedule') {
                document.getElementById('date-error').innerHTML = '';
                if (date == null || date == '') {
                    error++;
                    document.getElementById('date-error').innerHTML = 'Please enter your preferred appointment date.';
                    $('#date-error').show(500);
                }else $('#date-error').hide(500);
                document.getElementById('time-error').innerHTML = '';
                if (time == null || time == '') {
                    error++;
                    document.getElementById('time-error').innerHTML = 'Please enter preferred appointment time.';
                    $('#time-error').show(500);
                }else $('#time-error').hide(500);
            }
        } 
    } else if (step == 2) {
        if (type == 'schedule') {
            document.getElementById('date-error').innerHTML = '';
            if (date == null || date == '') {
                error++;
                document.getElementById('date-error').innerHTML = 'Please enter your preferred appointment date.';
                $('#date-error').show(500);
            }else $('#date-error').hide(500);
            document.getElementById('time-error').innerHTML = '';
            if (time == null || time == '') {
                error++;
                document.getElementById('time-error').innerHTML = 'Please enter preferred appointment time.';
                $('#time-error').show(500);
            }else $('#time-error').hide(500);
        }
    }

    if(error>0) {
        return false;
    } else {
        if (step == 1) {
            document.getElementById('name-preview').innerHTML = name;
            document.getElementById('gender-preview').innerHTML = gender;
            document.getElementById('dob-preview').innerHTML = dob;
            document.getElementById('phone-preview').innerHTML = phone;
            document.getElementById('email-preview').innerHTML = email;
            document.getElementById('location-preview').innerHTML = location;
            if (!global_settings['screen_is_mobile']) {
                if (type == 'schedule') {
                    document.getElementById('date-preview').innerHTML = date;
                    document.getElementById('time-preview').innerHTML = time;
                }
            } 
        } else if (step == 2){
            if (type == 'schedule') {
                document.getElementById('date-preview').innerHTML = date;
                document.getElementById('time-preview').innerHTML = time;
            }
        }
        return true;
    } 
}