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
                url: "operation/saveNewListing.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function(data) {
                    let result = JSON.parse(data);
                    
                    if (!(result.error || result.input_error)) {
                        swal({
                            title: "Success",
                            text: "Information successfully sent to My Health Africa.",
                            type: "success",
                            timer: 5000,
                            showConfirmButton: false
                        });
                        $('#new-registration')[0].reset();
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
    
    $('#selected-procedures-cntnr, #selected-conditions-cntnr, .specialty-details').hide();

});

$.ajax({
    url: 'operation/getAllSpecialties.php',
    method: 'GET',
    processData: false,
    contentType: false,
    success: function (response) {
        let result = JSON.parse(response);
        
        if(!result.error) {
            $(result).each(function(i){
                $("#specialty").html(`${$("#specialty").html()}
                <option value="${result[i]['Acupuncturist']}">${result[i]['Acupuncturist']}</option>`);
            });
        } else {
        }
    },
    error: function(error) {
        console.log(error);
    },
});

// $("#specialty").on("change", function() {
//     specialty = $(this).val();
    
//     $(".specialty-details").hide();
//     $("#specialty-procedures, #specialty-conditions").html('');
    
//     $.ajax({
//         url: "operation/getSpecialtyProceduresConditions.php?specialty_name="+specialty,
//         method: "GET",
//         processData: false,
//         contentType: false,
//         success: function(response) {
//             let result = JSON.parse(response);
            
//             console.log(result);
            
//             $(result.procedures).each(function(i) {
//                 if (!result['procedures_error'] && result['procedures'][i][specialty]) {
//                     $(".specialty-details").show();
//                     $("#specialty-procedures").html(`${$("#specialty-procedures").html()} 
//                     <div class="form-group form-inline">
//                         <input class="form-control specialty-procedure-checkbox" type="checkbox" name='specialtyProcedures[]' id="specialtyProcedures${i}" value="${result['procedures'][i][specialty].replace(/<[\/]*br>(&nbsp;)*/g, "&nbsp;-&nbsp;")}">
//                         <label class="ml-2" for="specialtyProcedures${i}">${result['procedures'][i][specialty].replace(/<[\/]*br>(&nbsp;)*/g, "&nbsp;-&nbsp;")}</label>
//                     </div>`);
//                 }
                
//                 if (!result['conditions_error'] && result['conditions'][i][specialty]) {
//                     $(".specialty-details").show();
//                     $("#specialty-conditions").html(`${$("#specialty-conditions").html()} 
//                     <div class="form-group form-inline">
//                         <input class="form-control specialty-condition-checkbox" type="checkbox" name='specialtyConditions[]' id="specialtyConditions${i}" value="${result['conditions'][i][specialty].replace(/<[\/]*br>(&nbsp;)*/g, "&nbsp;-&nbsp;")}">
//                         <label class="ml-2" for="specialtyConditions${i}">${result['conditions'][i][specialty].replace(/<[\/]*br>(&nbsp;)*/g, "&nbsp;-&nbsp;")}</label>
//                     </div>`);
//                 }
//             });
//         },
//         error: function(error) {
//             console.log(error);
//         },
//     });
    
    
// });

// $(document).on("click", ".specialty-procedure-checkbox", function(){
//     $("#no-proc-selected").hide();
//     if($(this).prop("checked")) {
//         $('#selected-procedures-cntnr').html(`${$('#selected-procedures-cntnr').html()}
//         <span class="bg-light px-1 mx-1" data-proc_id=${$(this).attr("id")}>${$(this).val()}</span>`);
//     } else {
//         $(`[data-proc_id='${$(this).attr('id')}']`).remove();
        
//         if ($('#selected-procedures-cntnr').children().length == 1) {
//             $("#no-proc-selected").show();
//         }
//     }
// });

// $(document).on("click", ".specialty-condition-checkbox", function(){
//     $("#no-cond-selected").hide();
//     if($(this).prop("checked")) {
//         $('#selected-conditions-cntnr').html(`${$('#selected-conditions-cntnr').html()}
//         <span class="bg-light px-1 mx-1" data-cond_id=${$(this).attr("id")}>${$(this).val()}</span>`);
//     } else {
//         $(`[data-cond_id='${$(this).attr('id')}']`).remove();
        
//         if ($('#selected-conditions-cntnr').children().length == 1) {
//             $("#no-cond-selected").show();
//         }
//     }
// });

// $(document).on("click", "#viewSelectedProcedures", function() {
//     $('#selected-conditions-cntnr').hide();
//     if ($(this).attr("data-toggle") == "hidden") {
//         $('#selected-procedures-cntnr').show(150);
//         $(this).attr("data-toggle", "shown");
//     } else {
//         $('#selected-procedures-cntnr').hide(150);
//         $(this).attr("data-toggle", "hidden");
//     }
// });

// $(document).on("click", "#viewSelectedConditions", function() {
//     $('#selected-procedures-cntnr').hide();
//     if ($(this).attr("data-toggle") == "hidden") {
//         $('#selected-conditions-cntnr').show(150);
//         $(this).attr("data-toggle", "shown");
//     } else {
//         $('#selected-conditions-cntnr').hide(150);
//         $(this).attr("data-toggle", "hidden");
//     }
// });

// $(document).on("click", "#specialtyDetailsDone", function() {
//     $(".specialty-details").hide(150);
// });