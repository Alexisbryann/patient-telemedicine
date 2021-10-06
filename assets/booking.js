var appointment_id, onboarding;
const global_settings = {
    window_width: window.innerWidth,
    get screen_is_mobile() {
        // return this.window_width < 768
        return false;
    },
    date_now: new Date(),
    get current_time() { // return current time as an array of [hh,mm,ss]
        return this.date_now.toTimeString().split(" ").shift().split(":");
    },
    minimum_appointment_time: "08:00 AM",
    booking_for: "self",
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
    onInit: function (event, current) {
        $("a[href$='previous']").hide();
    },
    labels: {
        finish: "Proceed To Pay",
        next: "Next",
        previous: "Back",
    },
    onStepChanging: function (event, currentIndex, newIndex) {
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
                    $(`input[name='radio-button'][value='${currentIndex}']`).addClass("visited-step");
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
    onStepChanged: function (event, currentIndex, priorIndex) {
        $(`input[name='radio-button'][value='${currentIndex}']`).removeClass("visited-step");
        $(`input[name='radio-button'][value='${currentIndex}']`).click();
        const step_titles = {
            0: "Patient Details",
            1: "Appointment Details",
            2: "Confirm Details"
        };
        // if (global_settings.screen_is_mobile) {
        const booking_form_progress = $("#booking-form-progress"),
            current_progress_value = booking_form_progress.val(),
            new_progress_value = priorIndex < currentIndex ? current_progress_value + 1 : current_progress_value - 1;

        booking_form_progress.val(new_progress_value);
        $("#booking-form-step-number").text(new_progress_value);
        $("#step-title").text(step_titles[currentIndex]);
        // }
    },
    onFinishing: function (event, currentIndex) {
        return true;
    },
    onFinished: function (event, currentIndex) {
        event.preventDefault();

        if (!$(`[name="terms-conditions-consent"]`).prop("checked")) {
            $(`[name="terms-conditions-consent"]`).closest(".form-check").siblings(".error").text("Please confirm that you have read and agreed to our consent form.");

            setTimeout(() => {
                $(`[name="terms-conditions-consent"]`).closest(".form-check").siblings(".error").empty();
            }, 3000);
            return false;
        }

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
            success: function (response) {
                var response = JSON.parse(response);
                if (response.response == 200) {
                    $(btn).html('Submitted').css({ "pointer-events": "none" });
                    var appointment_id = response.id;
                    DPO_Payment(PaymentURL, name, email, phone, txRef, appointment_id, btn);
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
    }).on("changeTime.timepicker", function (e) {
        if (e.time.meridian.toLowerCase() === "am" && e.time.hours < 8) $('#set-appointment-time').timepicker('setTime', '08:00 AM');
        if (e.time.meridian.toLowerCase() === "pm" && e.time.hours > 6) $('#set-appointment-time').timepicker('setTime', '06:00 PM');
    });
}

$("#set-appointment-time").on("focus", function () {
    $(this).closest(".timepicker").find(".input-group-addon").click();
});

$("[name='appointment-type']").on("change", function () {
    // toggling display of options to schedule appointment
    $("#date-time-picker-container").toggleClass("d-none");
});

$("#set-appointment-dates").datepicker({
    ...datepicker_settings,
}).on("show", function (e) {
    if (!global_settings.screen_is_mobile) { // hack to position the datepicker in contact with the input box on desktop
        const date_picker_element = $(".datepicker.datepicker-dropdown.dropdown-menu.datepicker-orient-left.datepicker-orient-top"),
            datepicker_top = date_picker_element.css("top");

        date_picker_element.css("top", parseInt(datepicker_top) + 40);
    }
}).on("changeDate", function (e) {
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

$("#set-appointment-date").on("change", function () {
    const date = new Date($(this).val());

    if (date.toDateString() == global_settings.date_now.toDateString()) {
        const current_hour = global_settings.current_time[0],
            meridian = current_hour > 12 ? "PM" : "AM",
            hour = current_hour > 12 ? current_hour - 12 : current_hour;

        global_settings.minimum_appointment_time = `${global_settings.current_time[1] > 40 ? parseInt(hour) + 1 : hour}:${global_settings.current_time[1]} ${meridian}`;
    } else {
        global_settings.minimum_appointment_time = "08:00 AM";
    }

    $('#set-appointment-time').timepicker('setTime', global_settings.minimum_appointment_time);
});

$(".datepicker .input-group-addon").on("click", function () {
    $(this).closest(".datepicker").find("input").focus();
});

function DPO_Payment(PaymentURL, name, email, phone, txRef, appointment_id, btn) {
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
        success: function (endpoint_response) {
            if (endpoint_response.Result == 000) {
                var TransactionToken = endpoint_response.TransToken;
                window.top.location = PaymentURL + TransactionToken;
            } else {
                var tokenError = endpoint_response.ResultExplanation;
                swal({
                    title: "Transaction token creation failed",
                    text: tokenError,
                    type: "error",
                    timer: 5000,
                    showConfirmButton: false
                });
                $(btn).html('Proceed To Pay').css({ "pointer-events": "all" });
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
                    document.getElementById('date-time-preview').style.display = "flex";
                    document.getElementById('date-preview').innerHTML = date;
                    document.getElementById('time-preview').innerHTML = time;
                } else {
                    document.getElementById('date-time-preview').style.display = "none";
                }
            }
        } else if (step == 2) {
            if (type == 'schedule') {
                document.getElementById('date-time-preview').style.display = "flex";
                document.getElementById('date-preview').innerHTML = date;
                document.getElementById('time-preview').innerHTML = time;
            } else {
                document.getElementById('date-time-preview').style.display = "none";
            }
        }
        return true;
    }
}

// in-person appointment booking
const in_person_settings = {
    facility_id: $("#book-inperson").data("facility_id"),
    time_slot_template: (time, display) => `<div class="form-check radio-css-slots align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="appointment-time" value="${time}" id = "time-slot-${time}" >
                                        <label class="form-check-label " for="time-slot-${time}">
                                            ${display}
                                        </label>
                                    </div>`,
    disclaimer_text: `<span id="disclaimer-text">
                        <span id="account-creation-info">Please note that a My Health Africa account will be created for you after completing this form to help you better manage your appointments.</span>
                        <span>By proceeding to book an appointment, you agree with our <strong><a href='https://www.myhealthafrica.com/terms-of-use/' target='_blank'>terms of use.</a><strong></span>
                    </span>`,
};

// in person form steps wizard
$("#book-inperson").steps({
    bodyTag: "fieldset",
    headerTag: "h3",
    labels: {
        finish: "Confirm Booking",
        next: "Next",
        previous: "Back",
    },
    onInit: function (event, current) {
        $("a[href$='previous']").hide();
    },
    onStepChanging: function (event, currentIndex, newIndex) {
        newIndex > 0 ? $("a[href$='previous']").show() : $("a[href$='previous']").hide();
        if (newIndex < currentIndex) {
            $(`a[href="#finish"]`).html("Confirm Booking");
            return true;
        }

        const validation_options = {
            medical_condition_validity: {
                validity: $("[name='medical-concern']:checked").length > 0,
                error_message: "Please select a medical concern from the list.",
                value: $(`[name='medical-concern']:checked`).val(),
                element: $("#medical-conditions-container"),
                preview_element: $(`#concern-preview`),
                step: 0,
            },
            medical_condition_description_validity: {
                validity: $("#medical-concern-description")[0].checkValidity(),
                value: $(`#medical-concern-description`).val(),
                error_message: "Please enter a valid medical condition.",
                element: $("#medical-concern-description"),
                preview_element: $(`#concern-description-preview`),
                step: 0,
            },
            facility_validity: {
                validity: $("#facility").val(),
                error_message: "Please select the facility for the appointment.",
                value: $(`option[value='${$(`#facility`).val()}'`).text(),
                element: $("#facility"),
                preview_element: $(`#facility-preview`),
                step: 0,
            },
            appointment_type_validity: {
                validity: $("[name='appointment-type']")[0].checkValidity,
                error_message: "Please select the type of appointment you wish to book.",
                value: $(`[name='appointment-type']`).val() == "in_person_service" ? "In person" : "Telemedicine",
                element: $("#appointment-type-container"),
                preview_element: $(`#appointment-type-preview`),
                step: 0,
            },
            date_validity: {
                validity: $("#appointment-date").val(),
                error_message: "Please select the date for the appointment.",
                value: $(`#appointment-date`).val(),
                element: $("#in-person-appointment-date"),
                preview_element: $(`#date-preview`),
                step: 0,
            },
            time_validity: {
                validity: $("input[name='appointment-time']:checked").length > 0,
                value: $(`input[name='appointment-time']:checked`).val(),
                error_message: "Please select the time for the appointment.",
                element: $("#time-slots-container"),
                preview_element: $(`#time-preview`),
                step: 0,
            },
            patient_name: {
                validity: $("#name")[0].checkValidity(),
                error_message: "Please enter the name",
                value: $(`#name`).val(),
                element: $("#name"),
                preview_element: $(`#name-preview`),
                step: 1
            },
            patient_dob: {
                validity: $("#dob")[0].checkValidity(),
                error_message: "Please select the date of birth",
                value: $(`#dob`).val().split("-").reverse().join("/"),
                element: $("#dob"),
                preview_element: $(`#dob-preview`),
                step: 1
            },
            patient_email: {
                validity: $("#email")[0].checkValidity(),
                error_message: "Please enter a valid email address",
                value: $(`#email`).val(),
                element: $("#email"),
                preview_element: $(`#email-preview`),
                step: 1
            },
            patient_gender: {
                validity: $("#gender")[0].checkValidity(),
                error_message: "Please enter the gender",
                value: $(`#gender`).val(),
                element: $("#gender"),
                preview_element: $(`#gender-preview`),
                step: 1
            },
            patient_phone: {
                validity: validatePhoneNumber($("#phone").val(), $("#phone")),
                error_message: "Please enter a valid phone number",
                value: $(`#phone`).val(),
                element: $("#phone"),
                preview_element: $(`#phone-preview`),
                step: 1
            },
        }

        for (const key in validation_options) {
            if (Object.hasOwnProperty.call(validation_options, key)) {
                const validation_element = validation_options[key];

                if (validation_element.step !== currentIndex || validation_element.element.prop("disabled")) continue;

                if (!validation_element.validity) {
                    all_elements_valid = false;

                    setTimeout(() => {
                        $("#step-0-error-display").text("");
                    }, 2000);

                    $("#step-0-error-display").insertAfter(validation_element.element).text(validation_element.error_message);

                    $("body").animate({
                        scrollTop: validation_element.element[0].offsetTop,
                    }, 2);

                    validation_element.element.focus();

                    return false;
                }

                validation_element.preview_element.html(validation_element.value);
            }
        }

        const medical_condition_description = validation_options.medical_condition_description_validity;

        if (medical_condition_description.value.length == 0) {
            medical_condition_description.preview_element.closest(".preview-details-container").hide();
        } else {
            description_words = medical_condition_description.value.split(' ');
            word_count = description_words.length;

            if (word_count > 10) {
                medical_condition_description.preview_element.html(description_words.splice(0, 10).join(" ").concat("..."));
                $("#show-more-link").show();
            } else {
                $("#show-more-link").hide();
            }

            medical_condition_description.preview_element.closest(".preview-details-container").show();
        }

        $("#medical-condition-description .modal-body").text(medical_condition_description.value);

        $("#appointment-cost-display").text(new Intl.NumberFormat().format(in_person_settings.appointment_cost));

        $(`input[name='radio-button'][value='${currentIndex}']`).addClass("visited-step");

        if (in_person_settings.appointment_type == "telemedicine_service") {
            $("#payment-disclaimer").removeClass("d-flex").hide();
        } else {
            $("#payment-disclaimer").addClass("d-flex").show();
        }
        return true;
    },
    onStepChanged: function (event, currentIndex, priorIndex) {
        $(`input[name='radio-button'][value='${currentIndex}']`).click();
        $(`input[name='radio-button'][value='${currentIndex}']`).removeClass("visited-step");
        const step_titles = {
            0: "Appointment Details",
            1: "Patient Details",
            2: "Confirm Details"
        };
        // if (global_settings.screen_is_mobile) {
        const booking_form_progress = $("#booking-form-progress"),
            current_progress_value = booking_form_progress.val(),
            new_progress_value = priorIndex < currentIndex ? current_progress_value + 1 : current_progress_value - 1;

        booking_form_progress.val(new_progress_value);
        $("#booking-form-step-number").text(new_progress_value);
        $("#step-title").text(step_titles[currentIndex]);
        // }
    },
    onFinished: function (event, currentIndex) {
        event.preventDefault();

        if (!$(`[name="terms-conditions-consent"]`).prop("checked")) {
            $(`[name="terms-conditions-consent"]`).closest(".form-check").siblings(".error").text("Please confirm that you have read and agreed to our consent form.");

            setTimeout(() => {
                $(`[name="terms-conditions-consent"]`).closest(".form-check").siblings(".error").empty();
            }, 3000);
            return false;
        }

        var btn = document.querySelectorAll('a[href="#finish"]');
        $(btn).html('<i class="sending fa fa-spinner fa-spin"></i>&nbsp;&nbsp;Sending...');
        $(`a[href="#finish"]`).css("pointer-events", "none");

        const in_person_form_data = new FormData(this);
        in_person_form_data.append("location", "");
        in_person_form_data.append("manual-booking", 1);


        $.ajax({
            url: "operation/bookingOperations.php",
            method: "POST",
            data: in_person_form_data,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                if (response.response == 200) {
                    if (in_person_settings.appointment_type == "telemedicine_service") {
                        flutterWavePayment(response.id, $("#name").val(), $("#phone").val(), $("#email").val(), 1);
                    } else {
                        swal({
                            title: "Booked",
                            text: "Your appointment has been booked successfully.",
                            type: "success",
                            timer: 4000,
                            showCloseButton: true,
                            showConfirmButton: false,
                            showCancelButton: true,
                            cancelButtonText: "Close"
                        });

                        $("#book-inperson")[0].reset();
                        $("#facility").val(in_person_settings.facility_id);
                        $("#book-inperson").steps("reset");
                    }
                } else {
                    swal({
                        title: "Failed",
                        text: "There was a problem saving your appointment. Please refresh the page and try again",
                        type: "error",
                        timer: 4000,
                        showCloseButton: true,
                        showConfirmButton: false,
                        showCancelButton: true
                    });
                }
                $(btn).html("Confirm Appointment");
            },
        });
    }
});

// handler for selecting date on calendar
$("#in-person-appointment-date").datepicker({
    ...datepicker_settings,
}).on("changeDate", function () {
    const selected_date = $('#in-person-appointment-date').datepicker('getFormattedDate'),
        appointment_type = $(`[name="appointment-type"]`).val();

    $('#appointment-date').val(selected_date);


    $.ajax({
        url: `operation/getServiceDetails.php?operation=getServiceDetails&facility_id=${in_person_settings.facility_id}&selected_date=${selected_date}&appointment_type=${appointment_type}`,
        dataType: "json",
        success: function (response) {
            if (response.error) {
                // time slots fetching error handling
                return false;
            }

            const available_time_slots = Object.values(response.time_slots);

            in_person_settings["appointment_cost"] = response.service_details.price;

            if (available_time_slots.length == 0) {
                $("#time-slots-container")
                    .empty()
                    .closest("section").addClass("d-none");

                $("#time-slots-disabled").addClass("d-flex").removeClass("d-none");
                $("#time-slots-disabled h5").text("No time slots available.");
                return false;
            }

            $("#time-slots-container")
                .empty()
                .closest("section").removeClass("d-none");

            $("#time-slots-disabled").removeClass("d-flex").addClass("d-none");

            $("#appointment-date-time-display-container").addClass("d-none");
            $("#appointment-time-unset").addClass("d-flex").removeClass("d-none")

            available_time_slots.forEach(time_slot => {
                const time_slot_exploded = time_slot.split(" "),
                    time = time_slot_exploded[0].split(":"),
                    meridian = time_slot_exploded[1],
                    hour = (meridian == "PM" && parseInt(time[0]) !== 12) ? parseInt(time[0]) + 12 : time[0],
                    full_time = `${hour}:${time[1]}`;

                $("#time-slots-container").append(in_person_settings.time_slot_template(full_time, time_slot));
            });
        },
        error: function (error) {

        }
    });
});

// hide medical concern description input when page loads
$("#medical-concern-description").closest(".form-group").hide();

// display medical concern description input when a medical concern is selected
$('[name="medical-concern"]').on("input", function () {
    $("#medical-concern-description").closest(".form-group").show(100);
});

// set the facility id when a facility is selected
$("#book-inperson #facility").on("change", function () {
    const facility_id = $(this).val();
    in_person_settings.facility_id = facility_id;
});

function timeSlotsList(today) {
    /**
     * Generates a list of facility time slots. Starts at 08:00 hrs and adds 20 min intervals until 17:00 hrs
     * 
     * @param boolean today whether the appointment date is same as current date
     *
     * @return string[] list of time slots.
     */
    const min_time = 8,
        max_time = 18,
        current_hour = global_settings.current_time[0],
        current_minutes = global_settings.current_time[1];

    let time_slots = new Array(),
        counter = min_time;

    while (counter < max_time) {
        const meridian = counter >= 12 ? "PM" : "AM";
        let display_hour = counter > 12 ? counter - 12 : counter;

        if (`${display_hour}`.length == 1) display_hour = `0${display_hour}`;

        if (today) {
            if (current_hour <= counter) {
                if (current_hour == counter) {
                    if (current_minutes < 20) {
                        time_slots.push(`${display_hour}:20 ${meridian}`);
                    } else if (current_minutes < 40) {
                        time_slots.push(`${display_hour}:40 ${meridian}`);
                    }
                } else {
                    time_slots.push(`${display_hour}:00 ${meridian}`);
                    time_slots.push(`${display_hour}:20 ${meridian}`);
                    time_slots.push(`${display_hour}:40 ${meridian}`);
                }
            }
        } else {
            time_slots.push(`${display_hour}:00 ${meridian}`);
            time_slots.push(`${display_hour}:20 ${meridian}`);
            time_slots.push(`${display_hour}:40 ${meridian}`);
        }
        counter++;
    }

    return time_slots;
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
    $(".disabled-element-error").text("");

    $("#in-person-appointment-date")
        .datepicker("clearDates")
        .closest(".disabled-element").removeClass("disabled-element")
        .find(".disabled-element-error").remove();
});

// display appointment time when a time slot is selected
$(document).on("change", `[name=appointment-time]`, function () {
    const appointment_date = $("#appointment-date").val().split("/"),
        appointment_date_obj = new Date(appointment_date[2], parseInt(appointment_date[1]) - 1, appointment_date[0]),
        date_options = {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        },
        appointment_date_string = appointment_date_obj.toLocaleDateString(undefined, date_options),
        appointment_time = $(this).val();

    $("#appointment-time-unset").removeClass("d-flex").addClass("d-none");
    $("#appointment-date-time-display-container").removeClass("d-none");

    $("#appointment-date-display").text(appointment_date_string);
    $("#appointment-time-display").text(`${appointment_time} hrs`);
});

$("[name=medical-concern]").on("change", function () {
    $.each($("[name=medical-concern]"), function () {
        $(this).removeClass("selected");
    });
    $(this).addClass("selected");
});

function validatePhoneNumber(input, element) {
    /**
     * Validates phone number.
     * Allows input starting with +, starting with 254, starting with 0, starting with 1, starting with 7, longer than 10 characters.
     * Sanitizes value of input parameter if parent element is provided.
     *
     * @param string input input phone number string
    * @param jQuery element input element whose value is to be updated
     *
     * @return string formatted phone number
     */
    let input_sanitized = input.replace(/[\s-]/g, ""); // sanitize input

    if (input_sanitized.startsWith(0)) input_sanitized = input_sanitized.slice(1);
    if (input_sanitized.startsWith(7) || input_sanitized.startsWith(1)) input_sanitized = `+254${input_sanitized}`;

    if (input_sanitized.length < 10
        || !input_sanitized.match(/^\+[0-9]{10,14}$/)
    ) return false;

    element.val(input_sanitized);

    return input_sanitized;
}

$(`.booking-step.in-person-steps [name="radio-button"]`).on("change", function () {
    let step = $(this).val(),
        current_step = $("#book-inperson").steps("getCurrentIndex");

    if (current_step == step) {
        return false;
    } else if (current_step < step) {
        while (current_step < step) {
            $("#book-inperson").steps("next");
            current_step++;
        }
    } else if (current_step > step) {
        while (current_step > step) {
            $("#book-inperson").steps("previous");
            current_step--;
        }
    }
    $(`.booking-step [name="radio-button"][value='${step}']`).prop("checked", true);
});

$(`.booking-step.telemed-steps [name="radio-button"]`).on("change", function () {
    let step = $(this).val(),
        current_step = $("#booking-form").steps("getCurrentIndex");

    if (current_step == step) {
        return false;
    } else if (current_step < step) {
        while (current_step < step) {
            $("#booking-form").steps("next");
            current_step++;
        }
    } else if (current_step > step) {
        while (current_step > step) {
            $("#booking-form").steps("previous");
            current_step--;
        }
    }
    $(`.booking-step.telemed-steps [name="radio-button"][value='${step}']`).prop("checked", true);
});

// hide facilities dropdown if facility id is set in the url, for individual hospitals booking forms
if (in_person_settings.facility_id) {
    $("#facility").val(in_person_settings.facility_id).trigger("change").closest(".form-group").hide();
} else {
    $("#appointment-type-container")
        .removeClass("d-flex")
        .hide();

    $("input#in-person-appointment").prop("checked", true);
}

// set app setting appointment type, clear time slots, clear calendar date
$(`[name="appointment-type"]`).on("change", function () {
    in_person_settings["appointment_type"] = $(this).val();
    $("#in-person-appointment-date").datepicker("clearDates");
    $("#time-slots-disabled").toggleClass("d-none");
    $("#time-slots-container").closest("section").toggleClass("d-none");
});

function flutterWavePayment(
    appointment_id,
    patient_name,
    patient_phone,
    patient_email,
    cost
) {
    const API_publicKey = "FLWPUBK-59c70a34288d4c9337bc3a8ad22db9e7-X";

    var flutter_wave = getpaidSetup({
        PBFPubKey: API_publicKey,
        customer_firstname: patient_name.split(" ").shift(),
        customer_lastname: patient_name.split(" ").pop(),
        customer_phone: patient_phone,
        customer_email: patient_email,
        currency: "KES",
        amount: cost,
        country: "KE",
        txref: appointment_id,

        callback: function (response) {
            let wave = response.hasOwnProperty("tx") ? response.tx : response.data;

            if (wave.paymentType == "card") {
                wave["customer.phone"] = flutter_wave.customer_phone;
                wave["customer.email"] = flutter_wave.customer_email;
            }

            // saves all transactions, even failed/cancelled ones
            $.ajax({
                url: "operation/flutterwavePayment.php",
                method: "POST",
                data: { wave: wave, appointment_id: appointment_id },
                dataType: "json",
                success: function (response) {
                    if (response.error) {
                        alert(response.error);
                    }
                },
                error: function (error) {
                    $.toast({
                        heading: "Error",
                        text: 'There was a problem processing your payment. Please try again or contact <a href="mailto:billing@myhealthafrica.com">billing@myhealthafrica.com</a> for assistance.',
                        position: 'bottom-right',
                        showHideTransition: 'slide',
                        timer: 3000,
                    });
                }
            });
        },
    });
}

$(in_person_settings.disclaimer_text).insertAfter(`.actions.clearfix`);

function ageLessThanEighteenYears(date_of_birth_value) {
    /**
     * Checks if age is less than eighteen years
     * 
     * @param Date date_of_birth date of birth
     * 
     * @return boolean. true if age is less than 18, false otherwise
     */

    const today = new Date(),
        date_of_birth = new Date(date_of_birth_value),
        dates_difference = today.getTime() - date_of_birth.getTime();

    return dates_difference / (365.25 * 24 * 60 * 60 * 1000) < 18;
}

$(`[name="booking-for"]`).on("change", function () {
    const booking_for_option = $(this).val(),
        eighteen_years_birth_date = dateMinusEighteenYears(global_settings.date_now).toISOString().split("T").shift();
    if ($(this).prop("checked")) {
        global_settings.booking_for = booking_for_option;
    }

    switch (booking_for_option) {
        case "self":
            $(`[name="dob"]`).attr("max", eighteen_years_birth_date).trigger("change");
            $(`[name="name"]`).val(null).siblings("label").text("Your full name");
            $(`[name="dob"]`).val(null).siblings("label").text("Your date of birth");
            $(`[name="email"]`).val(null).siblings("label").text("Your email address");
            $(`[name="phone"]`).val(null).siblings("label").text("Your phone number");
            $(`[name="gender"]`).val(null).siblings("label").text("Your gender");
            $(`[name="location"]`).val(null).siblings("label").text("Your location");
            break;
        case "other":
            $(`[name="dob"]`).attr("max", global_settings.date_now.toISOString().split("T").shift());
            $(`[name="name"]`).val(null).siblings("label").text("Patient's full name");
            $(`[name="dob"]`).val(null).siblings("label").text("Patient's date of birth");
            $(`[name="email"]`).val(null).siblings("label").text("Patient's email address");
            $(`[name="phone"]`).val(null).siblings("label").text("Patient's phone number");
            $(`[name="gender"]`).val(null).siblings("label").text("Patient's gender");
            $(`[name="location"]`).val(null).siblings("label").text("Patient's location");
            break;
    }
});

function dateMinusEighteenYears(date) {
    /**
     * Finds the date that is 18 years ago from input date
     * 
     * @param Date date date to get 18 years ago from
     * 
     * @return string date if input date sub 18 years
     */

    const date_timestamp = date.getTime() / 1000, // timestamp of input date in seconds
        eighteen_years_seconds = 18 * 365.25 * 24 * 60 * 60,
        eighteen_years_ago_timestamp = date_timestamp - eighteen_years_seconds,
        eighteen_years_ago_date = new Date(eighteen_years_ago_timestamp * 1000);
    return eighteen_years_ago_date;
}

$(`[name="dob"]`).on("change", function () {
    const date_object = new Date($(this).val());
    if (new Date($(this).val()) > dateMinusEighteenYears(global_settings.date_now)) { // if entered patient age is below 18 years
        if (global_settings.booking_for == "self") {
            $(this).val(null);
            $("#dob-error").text("Only users 18 years and above are allowed to book an appointment for themselves.").show();
            return false;
        } else {
            $("#dob-error").text("");
            $(`[name="email"]`).val(null).siblings("label").text("Guardian's email address");
            $(`[name="phone"]`).val(null).siblings("label").text("Guardian's phone number");
        }
    } else {
        $(`[name="email"]`).siblings("label").text("Patient's email address");
        $(`[name="phone"]`).siblings("label").text("Patient's phone number");
        $("#dob-error").text("");
    }
});