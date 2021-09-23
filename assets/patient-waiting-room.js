var appointment_id,onboarding, interval;
jQuery(document).ready(function () {
    'use strict';

    $('#callback-error, #reschedule-error, #concern-error, #concern-desc-error, #reports-error, #medication-error, #allergies-error').hide();
    appointment_id = $('#appointment_id').val();
    onboarding = $('#onboarding').val();
    if (onboarding == 1) {
        $('.telemed-step-one,.telemed-step-two').hide();
        $('.telemed-step-three').show(500);
        interval = setInterval(function(){
            checkStatus();
        }, 5000);
        countdown('countdown', 10, 0);
    } else {
        $('.telemed-step-two,.telemed-step-three').hide();
        $('.telemed-step-one').show(500);
    }
    $('.btn-proceed #no').click( function () {
        updatePatientStatus();
    });
    $('.btn-proceed #yes').click( function () {
        $('.telemed-step-one,.logo').hide();
        $('.telemed-step-two').show(500);
    });

    $('#datetimepicker').datetimepicker({
        format:'d/m/Y H:i',
        defaultDate: false,
        defaultTime:false,
        minDate:0,
        maxDate:'+1970/01/07',
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

    $(document).on('click', '#continue-waiting', function () {
        $('#callback').modal('hide');
        //setInterval(checkStatus,5000);
        interval = setInterval(function(){
            checkStatus();
        }, 5000);
        countdown('countdown', 10, 0);
    });

    $(document).on('click', '#request-callback', function () {
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
                    setInterval(function () {
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
    $(document).on('click', '#reschedule-appointment', function () {
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
    $('#reschedule').on('click', function () {
        var chosen_date = $('#datetimepicker').val();
        if (chosen_date !== '') {
            $.ajax({
                url: "operation/bookingOperations.php",
                method: "POST",
                data: { operation: 'reschedule-appointment', appointment_id: appointment_id, chosen_date: chosen_date },
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
    
    function updatePatientStatus() {
        $.ajax({
            url: "operation/updatePatientInfo.php",
            method: 'POST',
            data: { operation: 'update-status', id: appointment_id },
            dataType: "json",
            success: function(response) {
                if (response == 200) {
                    $('.telemed-step-one').hide();
                    $('.telemed-step-three').show(500);
                    setInterval(function(){
                        checkStatus();
                    }, 5000);
                    countdown('countdown', 10, 0);
                }
            },
            async: false
        });
    }

    function checkStatus() {
        $.ajax({
            url: "operation/checkStatus.php",
            method: "POST",
            data: {id: appointment_id},
            dataType: 'json',
            success: function(response) {
                if (response.status == 200) {
                    window.location = response.redirect_url;
                } 
            }
        });
    }
    
    // Defining the set Cookie method
    function setCookie(cname,cvalue,exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    // Defining get cookie function
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
});



    // Function that will call when document loaded.
    window.onload = function () {
        // Get the time stored in the cookie if available
        var oldTime = parseInt(getCookie(appointment_id), 10);
        if(isNaN(oldTime) == false){
                // Reset the date or time we're counting down to by
                //adding the Cookie time to the present for continous countdown
                var countDownDate = new Date().getTime() + oldTime;

                // Update the count down every 1 second    
                var x = setInterval(function() {
                    // Get todays date and time
                    var now = new Date().getTime();
                        // Find the distance between now an the count down date
                    var distance = countDownDate - now;
                    setCookie(appointment_id, distance, 30);
                    // Update the count down every 1 second
                }, 1000);
        } else{
            // Set the date or time we're counting down to
            var countDownDate = new Date().getTime() + ((1)*60*60*1000);
            console.log(countDownDate);
            // Update the count down every 1 second
            var x = setInterval(function() {
                // Get todays date and time
                var now = new Date().getTime();
                // Find the distance between now an the count down date
                var distance = countDownDate - now;

                setCookie(appointment_id, distance, 30);
                // Find the distance between now an the count down date

                // If the count down is over, notification alert and automatically submits the exam
                if (distance < 0) {
                    clearInterval(x);
                    document.getElementById("timer");
                    timer.value= "EXPIRED";
                    alert("Hello! Exam is over");
                    location = "http://localhost:81/aquaexam/exam_complete.php?id=1";
                }
            }, 1000);
        }
    }
