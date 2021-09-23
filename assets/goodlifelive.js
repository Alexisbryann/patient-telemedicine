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


    
    
//Goodlife Patient Coutry Drop Down
$(function() {
    var appointment_id = $('#appointment_id').val();
    $.ajax({
        url: "operation/GetGoodlifeCountry.php",
        method: "POST",
        data: { appointment_id: appointment_id },
        dataType: "json",
        success: function(result) {
            $("#country").attr('disabled', false);
            $.each(result, function(i) {
                $('#country').append($('<option></option>').attr("value", result[i].country).text(result[i].country));
            });
        },
        failure: function() {
            alert("Error");
        }
    });
});	

         

//Get Goodlife Pharmacy City Based on Country
$(document).ready(function() {

    $("#delivery_cost_div").hide();
    $("#delivery_location_div").hide();
    //$("#delivery_cost_div").show();
    $("#insuarance_div").hide();
    $('#delivery_type').on('change', function() {
        if (this.value == 'Delivery') {
            $("#delivery_cost_div").hide(500);
            $("#delivery_location_div").show(500);
        } else {
            $("#delivery_cost_div").hide(500);
            $("#delivery_location_div").hide(500);
        }
    });
    $('#payment_mode').on('change', function() {
        if (this.value == 'Insuarance') {
            $("#insuarance_div").show(500);
        } else {
            $("#insuarance_div").hide(500);
        }
    });
});



//Get Goodlife Pharmacy City Based on Country
$(document).ready(function() {
    $("#country").change(function() {
        var fetchedcountry = $(this).val();
        $.ajax({
            url: "operation/GetGoodlifeCity.php",
            method: "POST",
            data: { fetchedcountry: fetchedcountry },
            dataType: "json",
            success: function(response) {
                $("#select_city").attr('disabled', false);
                if(response == 404)
                {
                    var txt = 'No available city';

                    $.each(response, function(i) {
                        $('#select_city').append($('<option></option>').attr("value", '').text(txt));
                    });
                }else
                
                {
                    $.each(response, function(i) {
                         $('#select_city').append($('<option></option>').attr("value", response[i].region).text(response[i].region));
                    });
                }
                
               
            }
        });
    });
});


//Get Goodlife Pharmacy District Based on Region
$(document).ready(function() {
    $("#select_city").change(function() {
        var fetchedregion = $(this).val();
        $.ajax({
            url: "operation/GetGoodlifeRegion.php",
            method: "POST",
            data: { fetchedregion: fetchedregion },
            dataType: "json",
            success: function(response) {
            $("#location").attr('disabled', false);

                if(response == 404)
                {
                    var txt = 'No available Location';

                    $.each(response, function(i) {
                        $('#location').append($('<option></option>').attr("value", '').text(txt));
                    });
                }else
                
                {
                    $.each(response, function(i) {
                         $('#location').append($('<option></option>').attr("value", response[i].district).text(response[i].district));
                    });
                }
                
                
            }
        });
    });
});



//Get Goodlife Pharmacy Branch Based on District
            $(document).ready(function() {
                $("#location").change(function() {
                    var fetchedStore = $(this).val();
                    $.ajax({
                        url: "operation/GetGoodlifeStore.php",
                        method: "POST",
                        data: { fetchedStore: fetchedStore },
                        dataType: "json",
                        success: function(response) {
                         $("#store").attr('disabled', false);

                            if(response == 404)
                            
                             {
                    var txt = 'No available Stores';

                    $.each(response, function(i) {
                        $('#store').append($('<option></option>').attr("value", '').text(txt));
                    });
                    }else
                    
                    {
                        $.each(response, function(i) {
                             $('#store').append($('<option></option>').attr("value", response[i].pharmacy_id).text(response[i].location));
                        });
                    }
                           
                        }
                    });
                });
            });




//Get Goodlife Pharmacy Email
            $(document).ready(function() {
                $("#store").change(function() {
                    var fetchedEmail = $(this).val();
                    $.ajax({
                        url: "operation/GetGoodlifeStoreEmail.php",
                        method: "POST",
                        data: { fetchedEmail: fetchedEmail },
                        dataType: "json",
                        success: function(response) {
                            if(response == 404){
                                var res = 'No Email Added';
                                $("#pharm_mail").empty();
                                $("#pharm_mail").append("<option>" + res + "</option>");
                            } else {
                                var len = response.length;
                                $("#pharm_mail").empty();
                                for (var i = 0; i < len; i++) {
                                    var val = response[i]['email'];
                                    var name = response[i]['email'];
                                    $("#pharm_mail").append("<option value='" + val + "'>" + name + "</option>");
                                }
                            }
                        }
                    });
                });
            });
});