$(function () {
    let available_accounts = subscription_accounts - subscription_user_count; // [subscription_accounts, subscription_user_count] -> navbar.php
    $(".top-menu .nav.navbar-nav.pull-left").remove();

    $("#account-setup").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        enableKeyNavigation: false,
        saveState: true,
        onStepChanging: function (event, currentIndex, newIndex) {
            if (newIndex == 3) {
                // populate locations
                $.ajax({
                    url: "operation/getLocationsDropDown.php",
                    method: "POST",
                    data: { facility_id: f_i_d }, //f_i_d: navbar.php
                    dataType: "json",
                    success: function (result) {
                        $("#service_location").empty();
                        $.each(result, function (i) {
                            $('#service_location').val(result[i].id);
                            $('#service_location_display').val(result[i].name);
                        });
                    }
                });

                // populate services
                $.ajax({
                    url: "operation/getServicesDropDown.php",
                    method: "POST",
                    data: { facility_id: f_i_d },
                    dataType: "json",
                    success: function (result) {
                        $("#user_service").empty();
                        $.each(result, function (i) {
                            $('#user_service').val(result[i].id);
                            $('#user_service_display').val(result[i].name);
                        });
                    }

                });
            }

            if (newIndex == 4) {
                // populate locations
                $.ajax({
                    url: "operation/getLocationsDropDown.php",
                    method: "POST",
                    data: { facility_id: f_i_d }, //f_i_d: navbar.php
                    dataType: "json",
                    success: function (response) {
                        $.each(response, function (i) {
                            $('#user_location').append(`<option value = "${response[i].id}">${response[i].name}</option>`);
                        });
                    },
                });

                // populate departments
                $.ajax({
                    url: "operation/getDepartmentsDropDown.php",
                    method: "POST",
                    data: { facility_id: f_i_d },
                    dataType: "json",
                    success: function (response) {
                        $.each(response, function (i) {
                            $('#user_department').append(`<option value = "${response[i].id}">${response[i].department_name}</option>`);
                        });
                    },
                });
            }
            return true;
        }
    });

    $(".account-setup-form [type='submit']").on("click", function (e) {
        e.preventDefault();
        let all_fields_valid = true;
        
        const timezone = $(`option[value='${$("#location_country").val()}']`).attr(`data-timezone`);
        $("#location_timezone").val(timezone);

        // use html5 constraint validation API to check validity of elements
        const clicked_btn = $(this), clicked_btn_text = clicked_btn.html(), validation_elements = $(this).closest("form").find("input, select"), parent_form = $(this).closest("form")[0], form_id = parent_form.id, form_data = new FormData(parent_form);

        $.each(validation_elements, function (i) {
            let element = $(this)[0], element_validity = element.checkValidity();
            if (!element_validity) {
                all_fields_valid = false;
                if (element.type == "tel") element.setCustomValidity("Please include a country code in the phone number, e.g. +254777777777");
                element.reportValidity();
                return false;
            }
        });

        // kill process if there's an invalid field
        if (!all_fields_valid) return false;

        // disable submit button until input is processed
        clicked_btn.prop("disabled", true).text("Saving...");

        // handle form submissions
        switch (form_id) {
            case "locationForm":
                $.ajax({
                    method: "POST",
                    url: "operation/addLocation.php",
                    data: form_data,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response == 200) {
                            $.ajax({
                                method: "POST",
                                url: "operation/updateAccountSetupProgress.php",
                                data: { "setup_step": 1 }
                            });
                            $("#account-setup").steps("next");
                        } else {
                            $.toast({
                                heading: 'Error',
                                text: 'Something went wrong while saving your data. Please try again.',
                                icon: 'warning',
                                position: 'bottom-right',
                                showHideTransition: 'slide'
                            });
                        }
                    },
                    error: function (error) {
                        $.toast({
                            heading: 'Error',
                            text: 'Something went wrong while saving your data. Please try again.',
                            icon: 'warning',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        });
                    },
                    complete: function () {
                        clicked_btn.html(clicked_btn_text).prop("disabled", false);
                    },
                });
                break;

            case "serviceForm":
                $.ajax({
                    url: "operation/addService.php",
                    method: 'POST',
                    data: form_data,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data == 200) {
                            $.ajax({
                                method: "POST",
                                url: "operation/updateAccountSetupProgress.php",
                                data: { "setup_step": 2 }
                            });
                            $("#account-setup").steps("next");
                        } else if (data == 400) {
                            $.toast({
                                heading: 'Error',
                                text: 'Kindly fill all the required inputs. If the error persist, try reloading the page.',
                                icon: 'warning',
                                position: 'bottom-right',
                                showHideTransition: 'slide'
                            });
                        } else {
                            $.toast({
                                heading: 'Error',
                                text: 'Something went wrong while saving your data. Please try again.',
                                icon: 'warning',
                                position: 'bottom-right',
                                showHideTransition: 'slide'
                            });
                        }
                    },
                    complete: function () {
                        clicked_btn.html(clicked_btn_text).prop("disabled", false);
                    },
                });
                break;

            case "departmentForm":
                $.ajax({
                    url: "operation/addDepartment.php",
                    method: 'POST',
                    data: form_data,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data == 200) {
                            $.ajax({
                                method: "POST",
                                url: "operation/updateAccountSetupProgress.php",
                                data: { "setup_step": 3 }
                            });
                            $("#account-setup").steps("next");
                        } else {
                            $.toast({
                                heading: 'Error',
                                text: 'Something went wrong while saving your data. Please try again.',
                                icon: 'warning',
                                position: 'bottom-right',
                                showHideTransition: 'slide'
                            });
                        }
                    },
                    complete: function () {
                        clicked_btn.html(clicked_btn_text).prop("disabled", false);
                    },
                });
                break;

            case "assignServiceForm":
                $.ajax({
                    url: "operation/addUserService.php",
                    method: 'POST',
                    data: form_data,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data == 200) {
                            $.ajax({
                                method: "POST",
                                url: "operation/updateAccountSetupProgress.php",
                                data: { "setup_step": 4 }
                            });
                            
                            if (available_accounts <= 0) {
                                swal({
                                    title: "All Set Up",
                                    text: "Your account is fully set up now. Thank you for making us your partner in managing your medical practice.",
                                    type: "success",
                                    timer: 4000,
                                    showConfirmButton: false
                                }, function (isConfirm) {
                                    window.location.href = "dashboard";
                                });
                                return false;
                            }

                            $("#account-setup").steps("next");
                        } else {
                            $.toast({
                                heading: 'Error',
                                text: 'Something went wrong while saving your data. Please try again.',
                                icon: 'warning',
                                position: 'bottom-right',
                                showHideTransition: 'slide'
                            });
                        }
                    },
                    complete: function () {
                        clicked_btn.html(clicked_btn_text).prop("disabled", false);
                    },
                });
                break;

            case "addUserForm":
                $.ajax({
                    url: "operation/addUser.php",
                    method: "POST",
                    data: form_data,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response == 200) {
                            available_accounts--;
                            if (available_accounts <= 0) $("#account-setup").steps("next");
                            $.toast({
                                heading: 'Success',
                                text: 'User added successfuly. Login details have been set to the provided email address.',
                                icon: 'success',
                                position: 'bottom-right',
                                timer: 5000,
                                showHideTransition: 'slide'
                            });
                        } else if (response == 800) {
                            $.toast({
                                heading: 'Error',
                                text: 'Account creation was not successful. There already exiss an account that uses the email address provided. Please try using a different email address.',
                                icon: 'warning',
                                position: 'bottom-right',
                                timer: 5000,
                                showHideTransition: 'slide'
                            });
                        } else {
                            $.toast({
                                heading: 'Error',
                                text: 'Something went wrong while saving your data. Please try again.',
                                icon: 'warning',
                                position: 'bottom-right',
                                timer: 5000,
                                showHideTransition: 'slide'
                            });
                        }
                    },
                    complete: function () {
                        clicked_btn.html("Add another").prop("disabled", false);
                    }
                });
                break;
            case "telemedServiceForm":
                $.ajax({
                    url: `operation/addTelemedService.php?token=${csrf_token}`,
                    method: "POST",
                    data: form_data,
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    success: function (response) {
                        if (response.hasOwnProperty("error")) {
                            if (response.hasOwnProperty("error_code")) {
                                switch (response.error_code) {
                                    case 0:
                                        location.reload();
                                        break;
                                    case 1:
                                        $.toast({
                                            heading: 'Error',
                                            text: 'There was a problem saving your data. Please ensure you filled all relevant fields and try again.',
                                            icon: 'warning',
                                            position: 'bottom-right',
                                            timer: 5000,
                                            showHideTransition: 'slide'
                                        });
                                        break;

                                    default:
                                        $.toast({
                                            heading: 'Error',
                                            text: 'There was a problem saving your data. Please ensure you filled all relevant fields and try again. Refreshing the page might help.',
                                            icon: 'warning',
                                            position: 'bottom-right',
                                            timer: 5000,
                                            showHideTransition: 'slide'
                                        });
                                        break;
                                }
                            } else {
                                $.toast({
                                    heading: 'Error',
                                    text: 'There was a problem saving your data. Please ensure you filled all relevant fields and try again.',
                                    icon: 'warning',
                                    position: 'bottom-right',
                                    timer: 5000,
                                    showHideTransition: 'slide'
                                });
                            }
                        } else {
                            $.ajax({
                                method: "POST",
                                url: "operation/updateAccountSetupProgress.php",
                                data: { "setup_step": 6 }
                            });
                            swal({
                                title: "All Set Up",
                                text: "Your account is fully set up now. Thank you for making us your partner in managing your medical practice.",
                                type: "success",
                                timer: 4000,
                                showConfirmButton: false
                            }, function (isConfirm) {
                                window.location.href = "dashboard";
                            });
                        }
                    },
                    complete: function () {
                        clicked_btn.html("Finish").prop("disabled", false);
                    }
                });
                break;
        }
    });

    $(".day-selector").on("change", function () {
        if ($(this).prop("checked")) {
            $(this).closest(".assign-service-day-parent").find(".time-from, .time-to").prop({ "disabled": false, "required": true });
            $(this).closest(".assign-service-day-parent").find(".time-from").val("08:00");
        } else {
            // disable time inputs if respective day option is unchecked
            $(this).closest(".d-flex").siblings(".d-flex").find(".time-from, .time-to").prop({ "disabled": true, "required": false }).val(null);
        }
    });

    // advance setup steps to place where user had reached
    while (account_setup > 0) { //account_setup: account-setup.php
        $("#account-setup").steps("next");
        account_setup--;
    }

    $("#service_currency, #location_country").select2();

    $(`[data-toggle = "tooltip"]`).tooltip();

    if (available_accounts > 0) $("#assignServiceForm button[type='submit']").html(`Next&nbsp;&nbsp;<i class="fa fa-chevron-right"></i>`);
    if (subscription_package !== "Standard") $("#addUserForm button[type='submit']").html(`Next&nbsp;&nbsp;<i class="fa fa-chevron-right"></i>`);

    switch (subscription_package) {
        case "Free":
        case "Standard":
            $("#account-setup").steps("remove", 5);
            break;
    }

    $(".skip-step-btn").on("click", function () {
        if (!$("#account-setup").steps("next")) {
            $.ajax({
                method: "POST",
                url: "operation/updateAccountSetupProgress.php",
                data: { "setup_step": 6 }
            });
            swal({
                title: "All Set Up",
                text: "Your account is fully set up now. Thank you for making us your partner in managing your medical practice.",
                type: "success",
                timer: 4000,
                showConfirmButton: false
            }, function (isConfirm) {
                window.location.href = "dashboard";
            });
        }
    });
});