var appointment_id, onboarding;
const global_settings = {
        screen_is_mobile: window.innerWidth < 758,
        date_now: new Date(),
        get current_time() { // return current time as an array of [hh,mm,ss]
            return this.date_now.toTimeString().split(" ").shift().split(":");
        },
        minimum_appointment_time: "08:00 AM",
    },
    datepicker_settings = {
        daysOfWeekDisabled: ["0"],
        autoclose: true,
        startDate: global_settings.current_time[0] <= 18 ? Date() : tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)), // if it's past 6pm, prevent selecting of today's date
        format: "dd/mm/yyyy",
        todayHighlight: true
    };

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
        // Always allow previous action even if the current form is not valid!
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
                if (validateInput(step = 1)) {
                    $("a[href$='previous']").show();
                    document.getElementById("appointment").checked = false;
                    document.getElementById("confirm").checked = true;
                    return true;
                }
            } else if (currentIndex === 1) {
                if (document.getElementById('now').checked) {
                    return true;
                } else if (document.getElementById('schedule').checked) {
                    if (validateInput(step = 2)) {
                        return true;
                    }
                }
            }
        } else {
            if (currentIndex === 0) {
                if (validateInput(step = 1)) {
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
    onStepChanged: function(event, currentIndex, priorIndex) {
        if (global_settings.screen_is_mobile) {
            const booking_form_progress = $("#booking-form-progress"),
                current_progress_value = booking_form_progress.val(),
                new_progress_value = priorIndex < currentIndex ? current_progress_value + 1 : current_progress_value - 1;

            booking_form_progress.val(new_progress_value);
            $("#booking-form-step-number").text(new_progress_value);
        }
    },
    onFinishing: function(event, currentIndex) {
        return true;
    },
    onFinished: function(event, currentIndex) {
        event.preventDefault();
        var btn = document.querySelectorAll('a[href="#finish"]');
        $(btn).html('<i class="sending fa fa-spinner fa-spin">&nbsp;&nbsp;</i>Sending...');
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
                } else if (response == 500) {
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

if (global_settings.screen_is_mobile) { // handler for mobile behavior
    // Add second step to booking form
    const booking_time_element = $(".booking-time").html();
    $(".booking-time").remove();

    if ($("#booking-form").length > 0) {
        $("#booking-form").steps("insert", 1, {
            title: "",
            content: `<div class="booking-time d-flex flex-column justify-content-start">${booking_time_element}</div>`,
        });
    }

    $("#confirm-appointment-cost").insertBefore("#confirm-appointment-patient");
    $("#confirm-appointment-details").insertBefore("#confirm-appointment-patient");

    // hide desktop screen elements
    $("[data-screen='desktop-only']").remove();
} else {
    // hide mobile screen elements
    $("[data-screen='mobile-only']").remove();

    $("#set-appointment-time").timepicker({
        explicitMode: true,
        icons: {
            up: 'fa fa-chevron-up',
            down: 'fa fa-chevron-down'
        },
        minuteStep: 20,
        snapToStep: true,
        defaultTime: global_settings.minimum_appointment_time, // show default time as 8 am if it is not yet 8 am, and show current time if it is past 8 am
    }).on("changeTime.timepicker", function(e) {
        if (e.time.meridian.toLowerCase() === "am" && e.time.hours < 8) $('#set-appointment-time').timepicker('setTime', '08:00 AM');
        if (e.time.meridian.toLowerCase() === "pm" && e.time.hours > 6) $('#set-appointment-time').timepicker('setTime', '06:00 PM');
    });
}

$("#set-appointment-time").on("focus", function() {
    $(this).closest(".timepicker").find(".input-group-addon").click();
});

$("[name='appointment-type']").on("change", function() {
    // toggling display of options to schedule appointment
    $("#date-time-picker-container").toggleClass("d-none");
});

$("#set-appointment-date").datepicker({
    ...datepicker_settings,
}).on("show", function(e) {
    if (!global_settings.screen_is_mobile) { // hack to position the datepicker in contact with the input box on desktop
        const date_picker_element = $(".datepicker.datepicker-dropdown.dropdown-menu.datepicker-orient-left.datepicker-orient-top"),
            datepicker_top = date_picker_element.css("top");

        date_picker_element.css("top", parseInt(datepicker_top) + 40);
    }
}).on("changeDate", function(e) {
    if (e.date.toDateString() == global_settings.date_now.toDateString()) {
        const current_hour = global_settings.current_time[0],
            meridian = current_hour > 12 ? "PM" : "AM",
            hour = current_hour > 12 ? current_hour - 12 : current_hour;

        global_settings.minimum_appointment_time = `${global_settings.current_time[1] > 40 ? parseInt(hour) + 1 : hour}:${global_settings.current_time[1]} ${meridian}`;
    } else {
        global_settings.minimum_appointment_time = "08:00 AM";
    }

    $('#set-appointment-time').timepicker('setTime', global_settings.minimum_appointment_time);
});

$(".datepicker .input-group-addon").on("click", function() {
    $(this).closest(".datepicker").find("input").focus();
});

function DPO_Payment(PaymentURL, name, email, phone, txRef, appointment_id) {
    var type;
    if (document.getElementById('now').checked) {
        type = 'now';
    } else if (document.getElementById('schedule').checked) {
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
        } else $('#name-error').hide(500);
        document.getElementById('email-error').innerHTML = '';
        if (email == null || email == '') {
            error++;
            document.getElementById('email-error').innerHTML = 'Kindly fill in your email address.';
            $('#email-error').show(500);
        } else $('#email-error').hide(500);
        document.getElementById('gender-error').innerHTML = '';
        if (gender == null || gender == '') {
            error++;
            document.getElementById('gender-error').innerHTML = 'Kindly fill in your gender.';
            $('#gender-error').show(500);
        } else $('#gender-error').hide(500);
        document.getElementById('dob-error').innerHTML = '';
        if (dob == null || dob == '') {
            error++;
            document.getElementById('dob-error').innerHTML = 'Kindly fill in your date of birth.';
            $('#dob-error').show(500);
        } else $('#dob-error').hide(500);
        document.getElementById('phone-error').innerHTML = '';
        if (phone == null || phone == '') {
            error++;
            document.getElementById('phone-error').innerHTML = 'Kindly input your phone number.';
            $('#phone-error').show(500);
        } else $('#phone-error').hide(500);
        document.getElementById('location-error').innerHTML = '';
        if (location == null || location == '') {
            error++;
            document.getElementById('location-error').innerHTML = 'Kindly select your location.';
            $('#location-error').show(500);
        } else $('#location-error').hide(500);
        if (!global_settings['screen_is_mobile']) {
            if (type == 'schedule') {
                document.getElementById('date-error').innerHTML = '';
                if (date == null || date == '') {
                    error++;
                    document.getElementById('date-error').innerHTML = 'Please enter your preferred appointment date.';
                    $('#date-error').show(500);
                } else $('#date-error').hide(500);
                document.getElementById('time-error').innerHTML = '';
                if (time == null || time == '') {
                    error++;
                    document.getElementById('time-error').innerHTML = 'Please enter preferred appointment time.';
                    $('#time-error').show(500);
                } else $('#time-error').hide(500);
            }
        }
    } else if (step == 2) {
        if (type == 'schedule') {
            document.getElementById('date-error').innerHTML = '';
            if (date == null || date == '') {
                error++;
                document.getElementById('date-error').innerHTML = 'Please enter your preferred appointment date.';
                $('#date-error').show(500);
            } else $('#date-error').hide(500);
            document.getElementById('time-error').innerHTML = '';
            if (time == null || time == '') {
                error++;
                document.getElementById('time-error').innerHTML = 'Please enter preferred appointment time.';
                $('#time-error').show(500);
            } else $('#time-error').hide(500);
        }
    }

    if (error > 0) {
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
        } else if (step == 2) {
            if (type == 'schedule') {
                document.getElementById('date-preview').innerHTML = date;
                document.getElementById('time-preview').innerHTML = time;
            }
        }
        return true;
    }
}

// in-person appointment booking
const in_person_settings = {
    facility_id: $("#book-inperson").data("facility_id"),
    time_slots: timeSlotsList(),
    time_slot_template: (time) => `<div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="${time}" id = "time-slot-${time}">
                                        <label class="form-check-label " for="time-slot-${time}">
                                            ${time}
                                        </label>
                                    </div>`,
};

$("#book-inperson").steps({
    bodyTag: "fieldset",
    transitionEffect: "slideLeft",
    headerTag: "h3",
    labels: {
        finish: "Proceed To Pay",
        next: "Next",
        previous: "Back",
    },
    onInit: function(event, current) {
        $("a[href$='previous']").hide();
    },
    onStepChanging: function(event, currentIndex, newIndex) {
        return true;

    },
    onStepChanged: function(event, currentIndex, priorIndex) {

    },
    onFinished: function (event, currentIndex) {
        event.preventDefault();
        var btn = document.querySelectorAll('a[href="#finish"]');
        $(btn).html('<i class="sending fa fa-spinner fa-spin">&nbsp;&nbsp;</i>Sending...');
        $('.btn-next').css("pointer-events", "none");

        $.ajax({
            url: "operation/bookingOperations.php",
            method: "POST",
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function (response) {
                var response = JSON.parse(response);
                if (response.response == 200) {
                    $(btn).html('');
                    $(btn).html('Submitted');
                    var appointment_id = response.id;
                    DPO_Payment(PaymentURL, name, email, phone, txRef, appointment_id);
                } else if (response == 500) {
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

$("#in-person-appointment-date").datepicker({
    ...datepicker_settings,
}).on("changeDate", function () {
    const selected_date = $('#in-person-appointment-date').datepicker('getFormattedDate');

    $('#appointment-date').val(selected_date);

    $.ajax({
        url: `operation/getTakenTimeSlots.php?operation=getTakenTimeSlots&facility_id=${in_person_settings.facility_id}&selected_date=${selected_date}`,
        dataType: "json",
        success: function (response) {
            if (response.error) {
                // time slots fetching error handling
                return false;
            }

            const available_time_slots = in_person_settings.time_slots.filter(x => !response.includes(x));

            $("#time-slots-container").empty();

            available_time_slots.forEach(time_slot => {
                $("#time-slots-container").append(in_person_settings.time_slot_template(time_slot));
            });
        },
        error: function (error) {

        }
    });
});

$("#medical-concern-description").closest(".form-group").hide();

$('[name="medical-concern"]').on("input", function () {
    $("#medical-concern-description").closest(".form-group").show(100);
});

$("#book-inperson #facility").on("change", function () {
    const facility_id = $(this).val();
    in_person_settings.facility_id = facility_id;
});

function timeSlotsList() {
    /**
     * Generates a list of facility time slots. Starts at 08:00 hrs and adds 20 min intervals until 17:00 hrs
     * 
     * @return string[] list of time slots.
     */
    const min_time = 8,
        max_time = 25;
    let time_slots = new Array(),
        counter = min_time;

    while (counter < max_time) {
        if (global_settings.current_time[0] < counter) {
            time_slots.push(`${counter}:00`);
            time_slots.push(`${counter}:20`);
            time_slots.push(`${counter}:40`);
        }
        counter++;
    }

    return time_slots.length > 0 ? time_slots.concat([`${max_time}:00`]) : time_slots;
}

// disable calendar on page load
$("#in-person-appointment-date").closest("div.size").addClass("disabled-element");

$(".disabled-element").on("click", function () {
    const error_message_container = $(this).find(".disabled-element-error"),
        target_element = $(this).find(".disabled-element-target");

    let error_message = "";

    switch (target_element[0].id) {
        case "in-person-appointment-date":
            error_message = "Please select your preferred facility";
            break;

        default:
            error_message = "Please fill the required fields.";
            break;
    }

    error_message_container.text(error_message);

    $(target_element.data("required_input")).focus();

    setTimeout(() => {
        error_message_container.text("");
    }, 3000);
});

$("#facility").on("change", function () {
    const facility = $(this).val();

    $(".disabled-element-error").text("");

    $("#in-person-appointment-date").closest(".disabled-element").removeClass("disabled-element").find(".disabled-element-error").remove();
});