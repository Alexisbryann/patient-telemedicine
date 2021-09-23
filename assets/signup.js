////ONEMED PRO REGISTRATION  FORM


$(document).ready(function() {
    //Initialize Select2 Elements
    $('.select2').select2();

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

    //Submitting new location form
    $(document).on('submit', '#new-registration', function(event) {
        event.preventDefault();
        var title = $('#title').val();
        var firstname = $('#first_name').val();
        var lastname = $('#last_name').val();
        var email = $('#email_address').val();
        var phone = $('#phone_number').val();
        var speciality = $('#medical_speciality').val();
        var registration = $('#registering_as').val();
        var medical_name = $('#medical_practice_clinic_hospital_name').val();
        var certification = $('#certification_number').val();
        var location = $('#location').val();
        var country = $('#country').val();

        if (title !== '' && firstname !== '' && lastname !== '' && email !== '' && phone !== '' && speciality !== '' && registration !== '' && location !== '' && country !== '') {
            $.ajax({
                url: "operation/new-registration.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function(data) {
                    if (data == 200) {
                        $('#new-registration')[0].reset();
                        swal({
                            title: "Success",
                            text: "Thank you for showing an interest in getting listed on My Health Africa. As soon as we process your details, one of our business development executives will reach out to you through the contacts you submitted.",
                            type: "success",
                            timer: 5000,
                            showConfirmButton: false
                        });
                    } else {
                        swal({
                            title: "Error",
                            text: "There was a problem sending your form, please try again.",
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
                text: 'Kindly fill all the fields marked.',
                icon: 'warning',
                position: 'top-right',
                showHideTransition: 'slide'
            })
        }
    });

});