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
    $(document).on('submit', '#webinar', function(event) {
        event.preventDefault();
      ///  var title = $('#title').val();
        var doc_name = $('#doc_name').val();
        var doc_country = $('#doc_country').val();
        var doctor_email = $('#doctor_email').val();
        var phone_number = $('#phone_number').val();
        var specialty = $('#specialty').val();

        if (doc_name !== '' && doctor_email !== '' ) {
            $.ajax({
                url: "operation/addwebinarequest.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function(data) {
                    if (data == 200) {
                        $('#webinar')[0].reset();
                        swal({
                            title: "Success",
                            text: "Webinar Requset Succesfully Sent.",
                            type: "success",
                            timer: 5000,
                            showConfirmButton: false
                        });
                    } else if (data == 500) {
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