var user_currency, currency_symbol, PE_cost, country_code, country, user_account_price, account_type, payment_gateway,
    value_added, telemed_monthly_reminder, pe_monthly_reminder, pe_annualy_reminder, telemed_annualy_reminder, selected_package, package_price, package_plan, iti, SELECTED_DIAL_CODE;

function geoip(json) {
    // Get country code based on IP
    country_code = json.country_code;
    country = json.country;
    if (json) {
        var price_obj = {
                prices: {
                    KE: {
                        monthly: {
                            free: 'FREE',
                            standard: thousands_separators(6844),
                            premium: thousands_separators(11484),
                            platinum: thousands_separators(17284),
                            patient_experience: thousands_separators(6728),
                            account_price: 1044
                        },
                        annualy: {
                            free: 'FREE',
                            standard: thousands_separators(65702),
                            premium: thousands_separators(110246),
                            platinum: thousands_separators(165926),
                            patient_experience: thousands_separators(80736),
                            account_price: 12528
                        }
                    },
                    OTHERS: {
                        monthly: {
                            free: 'FREE',
                            standard: thousands_separators(59),
                            premium: thousands_separators(99),
                            platinum: thousands_separators(149),
                            patient_experience: '',
                            account_price: 9
                        },
                        annualy: {
                            free: 'FREE',
                            standard: thousands_separators(566),
                            premium: thousands_separators(950),
                            platinum: thousands_separators(1430),
                            patient_experience: '',
                            account_price: 108
                        }
                    }
                }
            },
            get_price = price_obj['prices'];
    } else {
        var price_obj = {
                prices: {
                    OTHERS: {
                        monthly: {
                            free: 'FREE',
                            standard: thousands_separators(56),
                            premium: thousands_separators(99),
                            platinum: thousands_separators(149),
                            patient_experience: '',
                            account_price: 9
                        },
                        annualy: {
                            free: 'FREE',
                            standard: thousands_separators(566),
                            premium: thousands_separators(1142),
                            platinum: thousands_separators(1430),
                            patient_experience: '',
                            account_price: 108
                        }
                    }
                }
            },
            get_price = price_obj['prices'];
    }
    // Check if there is a package for the visitor's country, if not set a default
    if (get_price[country_code] == null) {
        free = price_obj['prices']['OTHERS']['monthly']['free'];
        monthly_std = price_obj['prices']['OTHERS']['monthly']['standard'];
        monthly_premium = price_obj['prices']['OTHERS']['monthly']['premium'];
        monthly_platinum = price_obj['prices']['OTHERS']['monthly']['platinum'];
        annualy_std = price_obj['prices']['OTHERS']['annualy']['standard'];
        annualy_premium = price_obj['prices']['OTHERS']['annualy']['premium'];
        annualy_platinum = price_obj['prices']['OTHERS']['annualy']['platinum'];
        monthly_user_account_price = price_obj['prices']['OTHERS']['monthly']['account_price'];
        annualy_user_account_price = price_obj['prices']['OTHERS']['annualy']['account_price'];
        monthly_pe = price_obj['prices']['OTHERS']['monthly']['patient_experience'];
        annualy_pe = price_obj['prices']['OTHERS']['annualy']['patient_experience'];
        user_currency = 'USD';
        currency_symbol = '$';
        value_added = '';
    } else {
        free = get_price[country_code]['monthly']['free'];
        monthly_std = get_price[country_code]['monthly']['standard'];
        monthly_premium = get_price[country_code]['monthly']['premium'];
        monthly_platinum = get_price[country_code]['monthly']['platinum'];
        annualy_std = get_price[country_code]['annualy']['standard'];
        annualy_premium = get_price[country_code]['annualy']['premium'];
        annualy_platinum = get_price[country_code]['annualy']['platinum'];
        monthly_user_account_price = get_price[country_code]['monthly']['account_price'];
        annualy_user_account_price = get_price[country_code]['annualy']['account_price'];
        monthly_pe = get_price[country_code]['monthly']['patient_experience'];
        annualy_pe = get_price[country_code]['annualy']['patient_experience'];
        user_currency = 'KES';
        currency_symbol = 'KSH';
        value_added = ' VAT inclusive';
    }
    
   function GetURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }
    selected_package = GetURLParameter('package'),
    package_plan = GetURLParameter('plan');
    $('#selected-duration').val(package_plan);
    $('#selected-package').val(selected_package);

    $("#currency").val(user_currency);
    var _currency = document.getElementsByClassName("currency_symbol");
    [].slice.call(_currency).forEach(function(_currency) {
        _currency.innerHTML = currency_symbol;
    });
    var vat = document.getElementsByClassName("VAT");
    [].slice.call(vat).forEach(function(vat) {
        vat.innerHTML = value_added;
    });

    var telemed_monthly_reminder = 'Please note that your subscription comes with only 20 OneMed Pro telemedicine appointments per month. By choosing this, you will pay ' + currency_symbol + ' ' + monthly_user_account_price + ' ' + value_added + ' to have access to unlimited telemedicine appointments for the remainder of the month, once you exhaust the 20 allocated.';
    var telemed_annualy_reminder = 'Please note that your subscription comes with only 20 OneMed Pro telemedicine appointments per month. By choosing this, you will pay ' + currency_symbol + ' ' + annualy_user_account_price + ' ' + value_added + ' to have access to unlimited OneMed Pro telemedicine appointments throughout the year.';
    var pe_monthly_reminder = 'Please note that by choosing this, you will pay ' + currency_symbol + ' ' + monthly_pe + ' ' + value_added + ' to have access to patient experience.';
    var pe_annualy_reminder = 'Please note that by choosing this, you will pay ' + currency_symbol + ' ' + annualy_pe + ' ' + value_added + ' to have access to patient experience.';
    $('.accounts-reminder,.telemed-reminder,.pe-reminder').html('');
    // user_account_price = monthly_user_account_price;
    var period_chosen = 'annually';;
    if (package_plan == 'Monthly') {
        $('.telemed-reminder').append(telemed_monthly_reminder);
        $('.pe-reminder').append(pe_monthly_reminder);
        PE_cost = monthly_pe;
        user_account_price = monthly_user_account_price;
        period_chosen = 'monthly';
    } else if (package_plan == 'Annually') {
        $('.pe-reminder').append(pe_annualy_reminder);
        $('.telemed-reminder').append(telemed_annualy_reminder);
        PE_cost = annualy_pe;
        user_account_price = annualy_user_account_price;
        period_chosen = 'annually';
    }
    if (selected_package == 'Free') {
        $('#selected-plan').val('Free');
        $('.accounts-reminder').html('');
        $('#total_symbol, #cost_symbol,#number_of_accounts,#number_of_telemed,#paid-package,#accounts_purchased,#telemed_cost,#added_pe_cost,#added_cost').hide('500');
        $('#free-package').show('500');
        if (country_code == 'KE') {
            $('#purchase_pe').show(500);
        } else {
            $('#purchase_pe').hide(500);
        }
        $('#plan_price').val(free);
        $("a[href$='finish']").html('Confirm Subscription');
        $('.accounts-reminder').html('Please note that your subscription comes with only 2 user accounts. You will have to pay ' + currency_symbol + ' ' + user_account_price + ' ' + value_added + ' ' + period_chosen + ' for any additional user account for the period of your subscription.');
    } else if (selected_package == 'Standard') {
        $('#selected-plan').val('Standard');
        $('.accounts-reminder').html('');
        $('#number_of_accounts, #total_symbol, #cost_symbol,#paid-package').show('500');
        $('#number_of_telemed,#free-package,#telemed_cost').hide('500');
        if (package_plan == 'Monthly') {
            $('#plan_price').val(monthly_std);
        } else if (package_plan == 'Annually') {
            $('#plan_price').val(annualy_std);
        }
        if (country_code == 'KE') {
            $('#purchase_pe').show(500);
        } else {
            $('#purchase_pe').hide(500);
        }
        $("a[href$='finish']").html('Proceed to payment');
        $('.accounts-reminder').html('Please note that your subscription comes with only 2 user accounts. You will have to pay ' + currency_symbol + ' ' + user_account_price + ' ' + value_added + ' ' + period_chosen + ' for any additional user account for the period of your subscription.');
    } else if (selected_package == 'Premium') {
        $('#selected-plan').val('Premium');
        $('#number_of_accounts,#total_symbol, #cost_symbol,#number_of_telemed,#paid-package').show('500');
        if (package_plan == 'Monthly') {
            $('#plan_price').val(monthly_premium);
        } else if (package_plan == 'Annually') {
            $('#plan_price').val(annualy_premium);
        }
        if (country_code == 'KE') {
            $('#purchase_pe').show(500);
        } else {
            $('#purchase_pe').hide(500);
        }
        $('.accounts-reminder').html('');
        $('#free-package').hide('500');
        $("a[href$='finish']").html('Proceed to payment');
        $('.accounts-reminder').html('Please note that your subscription comes with only 3 user accounts. You will have to pay ' + currency_symbol + ' ' + user_account_price + ' ' + value_added + ' ' + period_chosen + ' for any additional user account for the period of your subscription.');
    } else if (selected_package == 'Platinum') {
        $('#selected-plan').val('Platinum');
        if (package_plan == 'Monthly') {
            $('#plan_price').val(monthly_platinum);
        } else if (package_plan == 'Annually') {
            $('#plan_price').val(annualy_platinum);
        }
        $('#number_of_accounts,#number_of_telemed,#total_symbol, #cost_symbol,#paid-package').show('500');
        $('.accounts-reminder').html('');
        $("a[href$='finish']").html('Proceed to payment');
        $('#purchase_pe').hide(500);
        $('.accounts-reminder').html('Please note that your subscription comes with only 3 user accounts. You will have to pay ' + currency_symbol + ' ' + user_account_price + ' ' + value_added + ' ' + period_chosen + ' for any additional user account for the period of your subscription.');
    }

}

function thousands_separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

$(document).ready(function() {

    $('#add_peexperience, #pe-payment-options, #options-check, #pe-label, .mobile-reminder, #manual, #div-title, #div-fname, #div-lname, #div-name, .maximum_visibility, #number_of_accounts, #number_of_telemed, #add_users, #add_telemed, .payment_details, .flutterwave-notice, #maximum_details, #clinicPreview, #hospitalPreview, #docPreview, .bookings, #dr_p_chat, .reffering, .prescriptioning, .telemedicating, .medOpinions, .filing, .reporting, .experience_details, #details_section, #free-package, #paid-package').hide();
    $(".select2").select2();

    $.ajax({
        url: "operation/getCurrencies.php",
        method: "POST",
        dataType: "json",
        success: function(result) {
            if (result == 404) {
                $('#country').append($('<div class="center col-md-12">Could not fetch country data.</div>'));
            } else {
                $.each(result, function(i) {
                    $('#country').append($('<option value="' + result[i].country_alpha_2 + '">' + result[i].country_name + '</option>'));
                });
                document.getElementById("country").value = country_code;
            }

        },
    });
    if (package_plan == 'Monthly') {
        $('.telemed-reminder').append(telemed_monthly_reminder);
        $('.pe-reminder').append(pe_monthly_reminder);
    } else if (package_plan == 'Annually') {
        $('.pe-reminder').append(pe_annualy_reminder);
        $('.telemed-reminder').append(telemed_annualy_reminder);
    }
    if (selected_package == 'Free') {
        $('#selected-plan').val('Free');
        $('.accounts-reminder').html('');
        $('#total_symbol, #cost_symbol,#number_of_accounts,#number_of_telemed,#paid-package,#accounts_purchased,#telemed_cost,#added_pe_cost,#added_cost').hide('500');
        $('#free-package').show('500');
        if (country_code == 'KE') {
            $('#purchase_pe').show(500);
        } else {
            $('#purchase_pe').hide(500);
        }
        $("a[href$='finish']").html('Confirm Subscription');
        $('.accounts-reminder').html('Please note that your subscription comes with only 2 user accounts. You will have to pay ' + currency_symbol + ' ' + user_account_price + ' ' + value_added + ' for any additional user account for the period of your subscription.');
    } else if (selected_package == 'Standard') {
        $('#selected-plan').val('Standard');
        $('.accounts-reminder').html('');
        $('#number_of_accounts, #total_symbol, #cost_symbol,#paid-package').show('500');
        $('#number_of_telemed,#free-package,#telemed_cost').hide('500');
        if (country_code == 'KE') {
            $('#purchase_pe').show(500);
        } else {
            $('#purchase_pe').hide(500);
        }
        $("a[href$='finish']").html('Proceed to payment');
        $('.accounts-reminder').html('Please note that your subscription comes with only 2 user accounts. You will have to pay ' + currency_symbol + ' ' + user_account_price + ' ' + value_added + ' for any additional user account for the period of your subscription.');
    } else if (selected_package == 'Premium') {
        $('#selected-plan').val('Premium');
        $('#number_of_accounts,#total_symbol, #cost_symbol,#number_of_telemed,#paid-package').show('500');
        if (country_code == 'KE') {
            $('#purchase_pe').show(500);
        } else {
            $('#purchase_pe').hide(500);
        }
        $('.accounts-reminder').html('');
        $('#free-package').hide('500');
        $("a[href$='finish']").html('Proceed to payment');
        $('.accounts-reminder').html('Please note that your subscription comes with only 3 user accounts. You will have to pay ' + currency_symbol + ' ' + user_account_price + ' ' + value_added + ' for any additional user account for the period of your subscription.');
    } else if (selected_package == 'Platinum') {
        $('#selected-plan').val('Platinum');
        $('#number_of_accounts,#number_of_telemed,#total_symbol, #cost_symbol,#paid-package').show('500');
        $('.accounts-reminder').html('');
        $("a[href$='finish']").html('Proceed to payment');
        $('#purchase_pe').hide(500);
        $('.accounts-reminder').html('Please note that your subscription comes with only 3 user accounts. You will have to pay ' + currency_symbol + ' ' + user_account_price + ' ' + value_added + ' for any additional user account for the period of your subscription.');
    } else {
        $('#paid-package,#free-package,#number_of_telemed,#purchase_pe').hide('500');
    }

    document.getElementById("flutterwave").onchange = flutterwave;
    document.getElementById("dpo").onchange = directPayOnline;
    document.getElementById("clinic").onchange = clinicListing;
    document.getElementById("hospital").onchange = hospitalListing;
    document.getElementById("individual").onchange = individualListing;
    document.getElementById("additional_users").onchange = addUserAccounts;
    document.getElementById("additional_telemed").onchange = addTelemedicine;
    document.getElementById("card_payment").onchange = cardPayment;
    document.getElementById("mobile_money").onchange = mobilePayment;
    document.getElementById("purchase_pexperience").onchange = purchasePE;

    var dpo_security = '<div class="info-box-content pp-cwrap bright"><h2 class="security" style="color:#000d47;letter-spacing: -.05rem;font-weight: bold;">Security</h2><img class="boxgrad float-md-right img-thumbnail" src="img/pci-dss.png" alt="PCI DSS"><p class="security"><strong>PCI-DSS Level 1 Certified</strong></p><p id="pci-dss-text">DPO is PCI-DSS (The Payment Card Industry Data Security Standard) Level 1 certified, ensuring that all systems and information involved in the payment process is kept secure and can be trusted with sensitive payment information.</p></div><div class="info-box-content pp-cwrap bleft"><img class="img-thumbnail boxgrad float-md-left" src="img/pci-pts.png" alt="PCI PIN Compliance"><p class="security"><strong>PCI-PIN Compliant</strong></p><p id="pci-pin-text">DPO is PCI-PIN compliant, ensuring that the highest level of Personal Identification Number (PIN) security is maintained throughout the card-processing cycle.</p></div><div class="info-box-content pp-cwrap bright" style="margin-bottom:20px;"><img class="img-thumbnail boxgrad float-md-right" src="img/bank-security.jpg" alt="Bank-level Security"><p class="security"><strong>Bank-Level Security</strong></p><p id="bank-level-text">DPO uses the same security standards that banks use. Our services are monitored and verified by Symantec for Malware and vulnerabilities.</p></div>';
    var flutterwave_security = '<div class="info-box-content pp-cwrap bright"><h2 class="security" style="color:#000d47;letter-spacing: -.05rem;font-weight: bold;">Security</h2><img class="boxgrad float-md-right img-thumbnail" src="img/pci-dss.png" alt="PCI DSS"><p class="security"><strong>PCI-DSS Level 1 Certified</strong></p><p id="pci-dss-text">Flutterwave is PCI-DSS (The Payment Card Industry Data Security Standard) Level 1 certified, ensuring that all systems and information involved in the payment process is kept secure and can be trusted with sensitive payment information.</p></div><div class="row info-box-content pp-cwrap bleft"><div class="col-md-4"><img class="img-thumbnail boxgrad float-md-left" src="img/norton.png" alt="Norton Internet Security"></div><div class="col-md-8"><p class="security"><strong>Norton Internet Security</strong></p><p id="norton-text">Norton Internet Security proactive protection with six patented layers of protection that eliminates almost any threat. So you can do what you want online, knowing you\'re protected.</p></div></div></div>';

    function purchasePE() {
        if (document.getElementById("purchase_pexperience").checked) {
            $('#add_peexperience').show(500);
        } else {
            $('#pe_purchased_cost').val('');
            $('#add_peexperience').hide(500);
        }
    }

    function cardPayment() {
        if (document.getElementById("card_payment").checked) {
            document.getElementById("mobile_money").checked = false;
            $('#manual').show(500);
            $('.mobile-reminder').hide(500);
        } else {
            $('#manual').hide(500);
        }
    }

    function mobilePayment() {
        if (document.getElementById("mobile_money").checked) {
            document.getElementById("card_payment").checked = false;
            $('#manual').hide(500);
            $('.mobile-reminder').show(500);
        } else {
            $('.mobile-reminder').hide(500);
        }
    }

    function flutterwave() {
        if (document.getElementById("flutterwave").checked) {
            document.getElementById("dpo").checked = false;
            $('.flutterwave-notice').show(500);
            $('.payment_details').hide(500);
            $('#payment-title').html('Flutterwave payment details');
            $('#security-badge').html('');
            $('#security-badge').append(flutterwave_security);
            $('#options-check').show(500);
            payment_gateway = 'flutterwave';
        } else {
            $('.flutterwave-notice').hide(500);
            payment_gateway = '';
            $('#payment-title').html('');
            $('#security-badge').html('');
        }
    }

    function directPayOnline() {
        if (document.getElementById("dpo").checked) {
            document.getElementById("flutterwave").checked = false;
            document.getElementById("card_payment").checked = false;
            $('.payment_details').show(500);
            $('.flutterwave-notice').hide(500);
            $('#payment-title').html('Direct Payment Online details');
            $('#security-badge').html('');
            $('#security-badge').append(dpo_security);
            $('#options-check').show(500);
            payment_gateway = 'dpo';
        } else {
            $('.payment_details').hide(500);
            payment_gateway = '';
            $('#payment-title').html('');
            $('#security-badge').html('');
        }
    }

    function individualListing() {
        if (document.getElementById("individual").checked) {
            document.getElementById("clinic").checked = false;
            document.getElementById("hospital").checked = false;
            $('#details_section').show('500');
            account_type = 'Medical professional';
            $('#div-title').show('500');
            $('#div-fname').show('500');
            $('#div-lname').show('500');
            $('#div-name').hide('500');
            $('#cert-label').html('<strong>Medical certification number</strong><span class="required"> * </span>');
            $('#phone-label').html('<strong>Phone number</strong><span class="required"> * </span> (Ensure you select the right dial code)');
            $('#email-label').html('<strong>Email address</strong><span class="required"> * </span>');
            if (selected_package == 'Standard' || selected_package == 'Premium' || selected_package == 'Platinum') {
                $('#number_of_accounts').show('500');
            } else {
                $('#number_of_accounts').hide('500');
            }
        } else {
            $('#details_section').hide('500');
            $('#hospital_number_of_accounts').hide('500');
            $('#individual_number_of_accounts').hide('500');
            $('#clinic_number_of_accounts').hide('500');
            account_type = '';
            $('#div-title').hide('500');
            $('#div-fname').hide('500');
            $('#div-lname').hide('500');
        }
    }

    function hospitalListing() {
        if (document.getElementById("hospital").checked) {
            document.getElementById("individual").checked = false;
            document.getElementById("clinic").checked = false;
            $('#details_section').show('500');
            account_type = 'Hospital';
            $('#div-title').hide('500');
            $('#div-fname').hide('500');
            $('#div-lname').hide('500');
            $('#div-name').show('500');
            $('#cert-label').html('<strong>Hospital medical certification number</strong><span class="required"> * </span>');
            $('#name-label').html('<strong>Hospital name</strong><span class="required"> * </span> (Ensure you select the right dial code)');
            $('#phone-label').html('<strong>Hospital phone number</strong><span class="required"> * </span>');
            $('#email-label').html('<strong>Hospital email address</strong><span class="required"> * </span>');
            if (selected_package == 'Standard' || selected_package == 'Premium' || selected_package == 'Platinum') {
                $('#number_of_accounts').show('500');
            } else {
                $('#number_of_accounts').hide('500');
            }
        } else {
            $('#details_section').hide('500');
            $('#number_of_accounts').hide('500');
            account_type = '';
        }
    }

    function clinicListing() {
        if (document.getElementById("clinic").checked) {
            document.getElementById("hospital").checked = false;
            document.getElementById("individual").checked = false;
            $('#details_section').show('500');
            account_type = 'Clinic';
            $('#div-title').hide('500');
            $('#div-fname').hide('500');
            $('#div-lname').hide('500');
            $('#div-name').show('500');
            $('#cert-label').html('<strong>Clinic medical certification number</strong><span class="required"> * </span>');
            $('#name-label').html('<strong>Clinic Name</strong><span class="required"> * </span>');
            $('#phone-label').html('<strong>Clinic phone number</strong><span class="required"> * </span> (Ensure you select the right dial code)');
            $('#email-label').html('<strong>Clinic email address</strong><span class="required"> * </span>');
            if (selected_package == 'Standard' || selected_package == 'Premium' || selected_package == 'Platinum') {
                $('#number_of_accounts').show('500');
            } else {
                $('#number_of_accounts').hide('500');
            }
        } else {
            $('#details_section').hide('500');
            $('#number_of_accounts').hide('500');
            account_type = '';
        }
    }

    function addUserAccounts() {
        if (document.getElementById("additional_users").checked) {
            $('#add_users').show('500');
        } else {
            $('#add_users').hide('500');
        }
    }

    function addTelemedicine() {
        if (document.getElementById("additional_telemed").checked) {
            $('#add_telemed').show('500');
        } else {
            $('#add_telemed').hide('500');
        }
    }

    var input = document.querySelector("#phone_number"),
        errorMsg = document.querySelector("#error-msg"),
        validMsg = document.querySelector("#valid-msg");
    var errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
    iti = window.intlTelInput(input, {
        allowDropdown: true,
        formatOnDisplay: true,
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "ke";
                callback(countryCode);
            });
        },
        hiddenInput: "full_number",
        nationalMode: false,
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

    $(document).on("change", "#country", function() {
        var selected_country = $(this).val();
        var text, json;
        if (selected_country == 'KE') {
            json = { country_code: 'KE' }
            geoip(json);
            text = 'Please note that your billing has changed to Kenya shillings';
            snackbar(text);
        } else {
            json = { country_code: selected_country }
            geoip(json);
            text = 'Please note that your billing has changed to USD';
            snackbar(text);
        }
    });
});

var form = $("#subscription_form").show();
form.steps({
    headerTag: "h3",
    bodyTag: "fieldset",
    transitionEffect: "slideLeft",
    onInit: function(event, current) {
        $("a[href$='previous']").hide();
    },
    labels: {
        finish: "Proceed to payment",
        next: "Next",
        previous: "Previous",
    },
    onStepChanging: function(event, currentIndex, newIndex) {
        // Allways allow previous action even if the current form is not valid!
        if (currentIndex > newIndex) {
            if (currentIndex === 0) {
                $("a[href$='previous']").hide();
            } else if (currentIndex === 1) {
                $("a[href$='previous']").hide();
            }
            return true;
        }
        // Forbid next action if no package selected
        if (currentIndex === 0) {
            $("a[href$='previous']").show();
            if (document.getElementById("clinic").checked) {
                $('#details_preview').show('500');
                selected = 'clinic';
                if (validateFields(selected)) {
                    return true;
                }
            } else if (document.getElementById("hospital").checked) {
                $('#details_preview').show('500');
                selected = 'hospital';
                if (validateFields(selected)) {
                    return true
                }
            } else if (document.getElementById("individual").checked) {
                $('#details_preview').show('500');
                selected = 'individual';
                if (validateFields(selected)) {
                    return true
                }
            } else {
                $.toast({
                    heading: 'Warning',
                    text: 'Please choose type of listing to continue',
                    icon: 'warning',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                });
                return false;
            }
        } else if (currentIndex === 1) {
            $("a[href$='previous']").show();
            if (selected_package == 'Free') {
                if (document.getElementById("purchase_pexperience").checked) {
                    $('#paid-package,#pe-label').show('500');
                    $('#payment_options').hide('500');
                    $('#pe-payment-options').show('500');
                } else if (!document.getElementById("purchase_pexperience").checked) {
                    $('#paid-package,#pe-label').hide('500');
                    $('#payment_options').show('500');
                     $('#pe-payment-options').hide('500');
                }
            } else if (selected_package == 'Standard') {
                $('#paid-package').show('500');
                $('#free-package').hide('500');
            } else if (selected_package == 'Premium' || selected_package == 'Platinum') {
                $('#paid-package').show('500');
                $('#free-package').hide('500');
            } else {
                $('#paid-package,#free-package').hide('500');
            }
            return true;
        }
        if (currentIndex < newIndex) {
            // To remove error styles
            form.find(".body:eq(" + newIndex + ") label.error").remove();
            form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
        }
    },
    onStepChanged: function(event, currentIndex, priorIndex) {
        if (currentIndex === 3) {

        }
    },
    onFinishing: function(event, currentIndex) {
        form.validate().settings.ignore = ":disabled";
        return form.valid();
    },
    onFinished: function(event, currentIndex) {
        event.preventDefault();
        var btn = document.querySelectorAll('a[href="#finish"]');
        const API_publicKey = "FLWPUBK-59c70a34288d4c9337bc3a8ad22db9e7-X";
        const txRef = '' + Math.floor((Math.random() * 1000000000) + 1);
        const fullName = document.getElementById('payment_name').value;
        const email = document.getElementById('payment_email').value;
        const phone = document.getElementById('fullPhoneNumber').value;
        var amount_payable = document.getElementById('payable_amount').value;
        const amount = parseInt(amount_payable.replace(/,/g, ''));
        const currency = document.getElementById('currency').value;
        const country = document.getElementById('country').value;
        const selected_plan = document.getElementById('selected-package').value;
        const SELECTED_COUNTRY_CODE = document.getElementById('SELECTED_COUNTRY_CODE').value;

        //Direct Pay Online details
        const PaymentURL = 'https://secure.3gdirectpay.com/dpopayment.php?ID=';

        if (email !== '' && phone !== '' && amount !== '' && currency !== '' && fullName !== '' && country) {
            // getpaidSetup is Rave's inline script function. it holds the payment data to pass to Rave.
            var operation, renewal, payment_method;
            if (selected_plan == 'Free') {
                operation = 'free-subscription', renewal = 1;
                $(btn).prop('disabled', true).html('<strong>Processing...&nbsp;&nbsp;</strong> <div class="btn-spinner" role="status"></div>');
                var data_object = { operation: operation, account_type: account_type, renewal: renewal },
                    form = new FormData(this);
                form.forEach((value, key) => data_object[key] = value);
                var subscription_data = JSON.stringify(data_object);
                if (document.getElementById('purchase_pexperience').checked) {
                    if (document.getElementById('flutterwave').checked) {
                        payment_method = 'flutterwave';
                        sendPostData(subscription_data, payment_method);
                    } else if (document.getElementById('dpo').checked) {
                        payment_method = 'dpo';
                        sendPostData(subscription_data, payment_method);
                    } else {
                        $.toast({
                            heading: 'Warning',
                            text: 'Choose payment method you want to use to pay for your patient experience subscription.',
                            icon: 'warning',
                            position: 'bottom-right',
                            showHideTransition: 'slide',
                            hideAfter: 5000
                        });
                        return false;
                    }
                } else {
                    payment_method = '';
                    sendPostData(subscription_data, payment_method);
                }

                function sendPostData(subscription_data, payment_method) {
                    var btn = document.querySelectorAll('a[href="#finish"]');
                    $.ajax({
                        url: "operation/subscriptionOperations.php",
                        method: "POST",
                        data: { data: subscription_data },
                        dataType: "json",
                        success: function(response) {
                            if (response.response == 200) {
                                swal({
                                    title: "Success",
                                    text: "Your subscription to My Health Africa OneMedPro FREE package is successful. Please check your email address for account activation link.",
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonColor: "#37ce8a",
                                    confirmButtonText: "Continue",
                                    closeOnConfirm: false,
                                }, function(isConfirm) {
                                    if (isConfirm) {
                                        window.location.replace("https://myhealthafrica.com/myonemedpro");
                                    }
                                });
                                $(btn).prop('disabled', true).html('Successful');
                            } else if (response.response == 250) {
                                swal({
                                    title: "Success",
                                    text: "Your subscription to My Health Africa OneMedPro FREE package is successful. Please, now pay for your patient experience subscription.",
                                    type: "success",
                                    timer: 5000,
                                    showConfirmButton: false
                                });
                                var facility_id = response.facility_id;
                                if (payment_method == 'flutterwave') {
                                    var data_object = { facility_id: facility_id, operation: 'pe-payment', payment_method: 'flutterwave', action: 'update-pe-payment' };
                                    $(btn).prop('disabled', true).html('Successful');
                                    setTimeout(function() {
                                        Flutterwave_PatientExperiencePayment(API_publicKey, fullName, email, amount, phone, currency, country, txRef, data_object);
                                    }, 5000);
                                } else if (payment_method == 'dpo') {
                                    $(btn).prop('disabled', true).html('Successful');
                                    setTimeout(function() {
                                        DPO_PatientExperiencePayment(facility_id, PaymentURL, fullName, email, amount, phone, currency, country, SELECTED_COUNTRY_CODE, txRef);
                                    }, 5000);
                                }
                            } else if (response.response == 500) {
                                swal({
                                    title: "Error",
                                    text: "Your subscription to FREE package was not successful. An error was encountered while creating your account. Please try again or contact My Health Africa support team for help. Thank you",
                                    type: "error",
                                    timer: 5000,
                                    showConfirmButton: false
                                });
                                $(btn).prop('disabled', false).html('Confirm subscription');
                            } else if (response.response == 300) {
                                swal({
                                    title: "Error",
                                    text: "Your subscription to FREE package was successful. However, an error was encountered while creating your account activation link. Please contact My Health Africa support team for help. Thank you",
                                    type: "error",
                                    timer: 5000,
                                    showConfirmButton: false
                                });
                                $(btn).prop('disabled', false).html('Confirm subscription');
                            } else if (response.response == 800) {
                                swal({
                                    title: "Error",
                                    text: "A user already exists with the email address you provided. Please provide another email address for this subscription.",
                                    type: "error",
                                    timer: 6000,
                                    showConfirmButton: false
                                });
                                $(btn).prop('disabled', false).html('Confirm subscription');
                            }
                        }
                    });
                }
            } else {
                operation = 'paid-subscription';
                if (payment_gateway == 'flutterwave') {
                    payment_method = 'flutterwave';
                    if (document.getElementById('card_payment').checked) {
                        renewal = 1;
                        var plan_name, plan_amount, plan_currency, interval, plan_interval, plan_duration;
                        plan_name = $('#payment_name').val() + ' ' + $('#selected-package').val() + ' Subscription';
                        var amount_payable = document.getElementById('payable_amount').value;
                        plan_amount = parseInt(amount_payable.replace(/,/g, ''));
                        plan_currency = $('#currency').val();
                        interval = $('#selected-duration').val();
                        // plan_interval = interval.toLowerCase();
                        if (interval == 'Monthly') {
                            plan_interval = 'daily';
                        } else if (interval == 'Annually') {
                            plan_interval = 'weekly';
                        }
                        plan_duration = 100;
                        $(btn).prop('disabled', true).html(' <strong>Processing...&nbsp;&nbsp;</strong> <div class="loader" role="status"></div>');
                        var data_object1 = { operation: operation, payment_method: payment_method, action: 'create-user', account_type: account_type, renewal: renewal },
                            data_object2 = { operation: operation, payment_method: payment_method, action: 'update-payment', account_type: account_type, renewal: renewal },
                            form = new FormData(this);
                        form.forEach((value, key) => data_object1[key] = value);
                        form.forEach((value, key) => data_object2[key] = value);
                        flutterwaveRecurrentBilling(API_publicKey, fullName, email, amount, phone, currency, country, txRef, data_object1, data_object2, plan_name, plan_amount, plan_currency, plan_interval, plan_duration);
                    } else if (document.getElementById('mobile_money').checked) {
                        $(btn).prop('disabled', true).html(' <strong>Processing...&nbsp;&nbsp;</strong> <div class="loader" role="status"></div>');
                        renewal = 0;
                        var data_object1 = { operation: operation, payment_method: payment_method, action: 'create-user', account_type: account_type, renewal: renewal },
                            data_object2 = { operation: operation, payment_method: payment_method, action: 'update-payment', account_type: account_type, renewal: renewal },
                            form = new FormData(this);
                        form.forEach((value, key) => data_object1[key] = value);
                        form.forEach((value, key) => data_object2[key] = value);
                        var subscription_data = JSON.stringify(data_object1);
                        $.ajax({
                            url: "operation/subscriptionOperations.php",
                            method: "POST",
                            data: { data: subscription_data },
                            dataType: "json",
                            success: function(result) {
                                if (result.response == 200) {
                                    var facility_id = result.facility_id;
                                    flutterwavePayment(API_publicKey, fullName, email, amount, phone, currency, country, txRef, facility_id, data_object2);
                                } else if (result.response == 800) {
                                    swal({
                                        title: "Already Registered",
                                        text: "A user already exists with the email address you provided. Please provide another email address for this subscription.",
                                        type: "error",
                                        timer: 5000,
                                        showConfirmButton: false
                                    });
                                    $(btn).prop('disabled', false).html('Proceed to payment');
                                } else if (result.response == 900) {
                                    console.log("This is the response returned", result);
                                    var facility_id = result.facility_id;
                                    setTimeout(function() {
                                        flutterwavePayment(API_publicKey, fullName, email, amount, phone, currency, country, txRef, facility_id, data_object2);
                                    }, 2000);
                                }
                            }
                        });
                    } else {
                        $.toast({
                            heading: 'Warning',
                            text: 'Choose payment method you want to use to pay for your subscription.',
                            icon: 'warning',
                            position: 'bottom-right',
                            showHideTransition: 'slide',
                            hideAfter: 5000
                        });
                        return false;
                    }
                } else if (payment_gateway == 'dpo') {
                    payment_method = 'dpo';
                    var patient_experience;
                    $(btn).prop('disabled', true).html(' <strong>Processing...&nbsp;&nbsp;</strong> <div class="loader" role="status"></div>');
                    if (document.getElementById('card_payment').checked || document.getElementById('mobile_money').checked) {
                        if (document.getElementById('card_payment').checked) {
                            renewal = 1;
                        } else if (document.getElementById('mobile_money').checked) {
                            renewal = 0;
                        }
                        if (document.getElementById('purchase_pexperience').checked) {
                            patient_experience = 1;
                        } else patient_experience = 0;
                        var data_object1 = { operation: operation, payment_method: payment_method, action: 'create-user', account_type: account_type, renewal: renewal },
                            form = new FormData(this);
                        form.forEach((value, key) => data_object1[key] = value);
                        var subscription_data = JSON.stringify(data_object1);
                        $.ajax({
                            url: "operation/subscriptionOperations.php",
                            method: "POST",
                            data: { data: subscription_data },
                            dataType: "json",
                            success: function(result) {
                                if (result.response == 200) {
                                    var facility_id = result.facility_id;
                                    if (document.getElementById('card_payment').checked) {
                                        DPO_CardSubscriptionPayment(PaymentURL, fullName, email, amount, phone, currency, country, SELECTED_COUNTRY_CODE, txRef, facility_id, patient_experience);
                                    } else if (document.getElementById('mobile_money').checked) {
                                        DPO_MobileSubscriptionPayment(PaymentURL, fullName, email, amount, phone, currency, country, SELECTED_COUNTRY_CODE, txRef, facility_id, patient_experience);
                                    }
                                } else if (result.response == 800) {
                                    swal({
                                        title: "Already Registered",
                                        text: "A user already exists with the email address you provided. Please provide another email address for this subscription.",
                                        type: "error",
                                        timer: 5000,
                                        showConfirmButton: false
                                    });
                                    $(btn).prop('disabled', false).html('Proceed to payment');
                                } else if (result.response == 900) {
                                    var facility_id = result.facility_id;
                                    setTimeout(function() {
                                        if (document.getElementById('card_payment').checked) {
                                            DPO_CardSubscriptionPayment(PaymentURL, fullName, email, amount, phone, currency, country, SELECTED_COUNTRY_CODE, txRef, facility_id, patient_experience);
                                        } else if (document.getElementById('mobile_money').checked) {
                                            DPO_MobileSubscriptionPayment(PaymentURL, fullName, email, amount, phone, currency, country, SELECTED_COUNTRY_CODE, txRef, facility_id, patient_experience);
                                        }
                                    }, 2000);
                                }
                            }
                        });
                    } else {
                        $.toast({
                            heading: 'Warning',
                            text: 'Choose payment method you want to use to pay for your subscription.',
                            icon: 'warning',
                            position: 'bottom-right',
                            showHideTransition: 'slide',
                            hideAfter: 5000
                        });
                        return false;
                    }
                } else {
                    $.toast({
                        heading: 'Warning',
                        text: 'Choose your preferred payment method to continue.',
                        icon: 'warning',
                        position: 'bottom-right',
                        showHideTransition: 'slide'
                    });
                    return false;
                }
            }
        } else {
            $.toast({
                heading: 'Warning',
                text: 'Please make sure you fill in all the field marked with asteric.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        }

    }
});

function snackbar(text) {
    var x = document.getElementById("snackbar");
    x.innerHTML = text;
    x.className = "show";
    setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
}

function validateFields(selected) {
    var users_added = $('#users_added').val();
    if (document.getElementById("additional_users").checked) {
        if (users_added == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter the number of user accounts you wish to purchase to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        }
    }
    var accounts_purchased = $("#users_added").val(),
        plan = $('#selected-package').val(),
        plan_duration = $('#selected-duration').val(),
        plan_price = $('#plan_price').val(),
        totalAmountForUserAccounts,
        totalSubscriptionAmountPayable,
        fullName = $("#full_name").val(),
        certNo = $("#certification_number").val(),
        phoneNo = $("#phone_number").val(),
        emailAdd = $("#email_address").val(),
        country = $("#country option:selected").text(),
        location = $("#location").val(),
        title = $("#title").val(),
        firstName = $("#first_name").val(),
        lastName = $("#last_name").val(),
        telemedicine_cost = user_account_price,
        VAT, plusVAT, numberFormatAmount, numberFormatAccts, numberFormatTelemed, pe_VAT, purchased_PE, countryData;
      
    countryData = iti.getSelectedCountryData();
    if(countryData){
        var SELECTED_COUNTRY_CODE = (countryData.iso2).toUpperCase(),
            fullPhoneNumber = iti.getNumber(intlTelInputUtils.numberFormat.E164);
        SELECTED_DIAL_CODE = (countryData.dialCode);
        $('#SELECTED_COUNTRY_CODE').val(SELECTED_COUNTRY_CODE);
        $('#fullPhoneNumber').val(fullPhoneNumber);
    } else {
        var SELECTED_COUNTRY_CODE = '',
        fullPhoneNumber = '';
        SELECTED_DIAL_CODE = '';
    }
    var SELECTED_COUNTRY_CODE = (countryData.iso2).toUpperCase(),
        fullPhoneNumber = iti.getNumber(intlTelInputUtils.numberFormat.E164);
    SELECTED_DIAL_CODE = (countryData.dialCode);
    $('#SELECTED_COUNTRY_CODE').val(SELECTED_COUNTRY_CODE);
    $('#fullPhoneNumber').val(fullPhoneNumber);

    if (document.getElementById("purchase_pexperience").checked && (country == 'Kenya' || country == 'KE')) {
        $("#added_pe_cost").show();
    } else {
        $("#added_pe_cost").hide();
        document.getElementById("purchase_pexperience").checked = false;
    };
    if (!document.getElementById("additional_users").checked && !document.getElementById("additional_telemed").checked) {
        if (selected_package == 'Free') {
            $("#accounts_purchased,#telemed_cost,#added_cost").hide();
            totalSubscriptionAmountPayable = plan_price;
        } else {
            $("#accounts_purchased,#telemed_cost,#added_cost").hide();
            totalSubscriptionAmountPayable = parseInt(plan_price.replace(/,/g, ''));
        }
    } else if (document.getElementById("additional_users").checked && document.getElementById("additional_telemed").checked) {
        $("#accounts_purchased,#telemed_cost,#added_cost").show();
        totalAmountForUserAccounts = parseInt(accounts_purchased) * parseInt(user_account_price),
            totalSubscriptionAmountPayable = (totalAmountForUserAccounts + telemedicine_cost + parseInt(plan_price.replace(/,/g, '')));
        numberFormatAccts = thousands_separators(totalAmountForUserAccounts);
        numberFormatTelemed = thousands_separators(telemedicine_cost);
    } else if (document.getElementById("additional_users").checked && !document.getElementById("additional_telemed").checked) {
        $("#accounts_purchased,#added_cost").show();
        $("#telemed_cost").hide();
        totalAmountForUserAccounts = parseInt(accounts_purchased) * parseInt(user_account_price),
            totalSubscriptionAmountPayable = (totalAmountForUserAccounts + parseInt(plan_price.replace(/,/g, '')));
        numberFormatAccts = thousands_separators(totalAmountForUserAccounts);
    } else if (!document.getElementById("additional_users").checked && document.getElementById("additional_telemed").checked) {
        $("#telemed_cost").show();
        $("#accounts_purchased,#added_cost").hide();
        totalSubscriptionAmountPayable = (telemedicine_cost + parseInt(plan_price.replace(/,/g, '')));
        numberFormatTelemed = thousands_separators(telemedicine_cost);
    } else {
        $("#accounts_purchased,#telemed_cost,#added_cost,#added_pe_cost").hide();
    }
    if (country == 'Kenya') {
        pe_VAT = ' VAT inclusive';
        if (selected_package == 'Free') {
            if (document.getElementById("purchase_pexperience").checked) {
                $("#total_symbol").show();
                totalSubscriptionAmountPayable = parseInt(PE_cost.replace(/,/g, ''));
                VAT = ' VAT inclusive';
                plusVAT = '';
                numberFormatAmount = thousands_separators(totalSubscriptionAmountPayable);
                $('#pe_purchased_cost').val(numberFormatAmount);
            } else {
                $("#total_symbol").hide();
                totalSubscriptionAmountPayable;
                numberFormatAmount = totalSubscriptionAmountPayable;
                VAT = '', plusVAT = '';
                $('#pe_purchased_cost').val('');
            }
        } else {
            VAT = ' VAT inclusive', plusVAT = ' VAT inclusive';
            if (document.getElementById("purchase_pexperience").checked) {
                purchased_PE = parseInt(PE_cost.replace(/,/g, ''));
                totalSubscriptionAmountPayable = purchased_PE + totalSubscriptionAmountPayable;
                numberFormatAmount = totalSubscriptionAmountPayable;
                $('#pe_purchased_cost').val(purchased_PE);
            } else {
                numberFormatAmount = totalSubscriptionAmountPayable;
            }
            numberFormatAmount = thousands_separators(totalSubscriptionAmountPayable);
        }
    } else {
        totalSubscriptionAmountPayable = totalSubscriptionAmountPayable;
        VAT = '';
        plusVAT = '';
        numberFormatAmount = thousands_separators(totalSubscriptionAmountPayable);
    }

    if (selected == 'clinic') {
        if (fullName == '' && certNo == "" && phoneNo == "" && emailAdd == "" && country == "" && location == "") {
            $.toast({
                heading: 'Warning',
                text: 'You have selected a clinic. Please fill in all the mandatory fields to proceed',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (fullName == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter clinic name to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (certNo == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter clinic certification number to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (phoneNo == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter phone number used by the clinic to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (emailAdd == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter email address used by the clinic to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (country == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter country name in which the clinic operates to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (location == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter location of the clinic to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (SELECTED_DIAL_CODE == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please select your phone dial code to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else {
            document.getElementById("prevName").innerHTML = fullName;
            document.getElementById("prevCert").innerHTML = certNo;
            document.getElementById("prevPhone").innerHTML = fullPhoneNumber;
            document.getElementById("prevEmail").innerHTML = emailAdd;
            document.getElementById("prevCountry").innerHTML = country;
            document.getElementById("prevLocation").innerHTML = location;
            document.getElementById("prevAccountsPurchased").innerHTML = accounts_purchased;
            document.getElementById("prevPEPurchased").innerHTML = PE_cost + pe_VAT;
            document.getElementById("prevPackage").innerHTML = plan;
            document.getElementById("prevDuration").innerHTML = plan_duration;
            document.getElementById("prevCost").innerHTML = plan_price + plusVAT;
            document.getElementById("prevAdditionalCost").innerHTML = numberFormatAccts + plusVAT;
            document.getElementById("prevTelemedCost").innerHTML = numberFormatTelemed + plusVAT;
            document.getElementById("prevTotalAmount").innerHTML = numberFormatAmount + VAT;
            $("#payment_name").val(fullName);
            $("#payment_email").val(emailAdd);
            $("#payment_number").val(fullPhoneNumber);
            $("#payable_amount").val(thousands_separators(totalSubscriptionAmountPayable));
            $("#additional_cost").val(totalAmountForUserAccounts);
            $("#total_telemed_cost").val(telemedicine_cost);
            $("#total_telemed_purchased").val('Unlimited');
            $("#selected_country").val(country);
            return true;
        }

    } else if (selected == 'hospital') {
        if (fullName == '' && certNo == "" && phoneNo == "" && emailAdd == "" && country == "" && location == "") {
            $.toast({
                heading: 'Warning',
                text: 'You have selected a hospital. Please fill in all the mandatory fields to proceed',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;

        } else if (fullName == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter hospital name to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (certNo == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter hospital certification number to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (phoneNo == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter phone number used by the hospital to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (emailAdd == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter email address used by the hospital to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (country == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter name of the country in which the hospital operates to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (SELECTED_DIAL_CODE == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please select your phone dial code to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (location == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter location of the hospital to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else {
            document.getElementById("prevName").innerHTML = fullName;
            document.getElementById("prevCert").innerHTML = certNo;
            document.getElementById("prevPhone").innerHTML = fullPhoneNumber;
            document.getElementById("prevEmail").innerHTML = emailAdd;
            document.getElementById("prevCountry").innerHTML = country;
            document.getElementById("prevLocation").innerHTML = location;
            document.getElementById("prevAccountsPurchased").innerHTML = accounts_purchased;
            document.getElementById("prevPEPurchased").innerHTML = PE_cost + pe_VAT;
            document.getElementById("prevPackage").innerHTML = plan;
            document.getElementById("prevDuration").innerHTML = plan_duration;
            document.getElementById("prevCost").innerHTML = plan_price + plusVAT;
            document.getElementById("prevAdditionalCost").innerHTML = numberFormatAccts + plusVAT;
            document.getElementById("prevTotalAmount").innerHTML = numberFormatAmount + VAT;
            document.getElementById("prevTelemedCost").innerHTML = numberFormatTelemed + plusVAT;
            $("#payment_name").val(fullName);
            $("#payment_email").val(emailAdd);
            $("#payment_number").val(fullPhoneNumber);
            $("#payable_amount").val(thousands_separators(totalSubscriptionAmountPayable));
            $("#additional_cost").val(totalAmountForUserAccounts);
            $("#total_telemed_cost").val(telemedicine_cost);
            $("#total_telemed_purchased").val('Unlimited');
            $("#selected_country").val(country);
            return true;
        }
    } else if (selected == 'individual') {
        if (title == '' && firstName == "" && lastName == "" && certNo == "" && phoneNo == "" && emailAdd == "" && country == "" && location == "") {
            $.toast({
                heading: 'Warning',
                text: 'You have selected individual practie. Please fill in all the mandatory fields to proceed',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else
        if (title == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter your title to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (firstName == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter your first name to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (lastName == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter your last name to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (certNo == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter your practice certification number to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (phoneNo == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter your phone number to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (emailAdd == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter your email address to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (country == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter name of the country in which you\'re practising in to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (location == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please enter location of your practice to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else if (SELECTED_DIAL_CODE == '') {
            $.toast({
                heading: 'Warning',
                text: 'Please select your phone dial code to continue',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            return false;
        } else {
            document.getElementById("prevName").innerHTML = title + ' ' + firstName + ' ' + lastName;;
            document.getElementById("prevCert").innerHTML = certNo;
            document.getElementById("prevPhone").innerHTML = fullPhoneNumber;
            document.getElementById("prevEmail").innerHTML = emailAdd;
            document.getElementById("prevCountry").innerHTML = country;
            document.getElementById("prevLocation").innerHTML = location;
            document.getElementById("prevAccountsPurchased").innerHTML = accounts_purchased;
            document.getElementById("prevPEPurchased").innerHTML = PE_cost + pe_VAT;
            document.getElementById("prevPackage").innerHTML = plan;
            document.getElementById("prevDuration").innerHTML = plan_duration;
            document.getElementById("prevCost").innerHTML = plan_price + plusVAT;
            document.getElementById("prevAdditionalCost").innerHTML = numberFormatAccts + plusVAT;
            document.getElementById("prevTotalAmount").innerHTML = numberFormatAmount + VAT;
            document.getElementById("prevTelemedCost").innerHTML = numberFormatTelemed + plusVAT;
            $("#payment_name").val(title + ' ' + firstName + ' ' + lastName);
            $("#payment_email").val(emailAdd);
            $("#payment_number").val(fullPhoneNumber);
            $("#payable_amount").val(thousands_separators(totalSubscriptionAmountPayable));
            $("#additional_cost").val(totalAmountForUserAccounts);
            $("#total_telemed_cost").val(telemedicine_cost);
            $("#total_telemed_purchased").val('Unlimited');
            $("#selected_country").val(country);
            return true;
        }
    }
}

function flutterwavePayment(API_publicKey, fullName, email, amount, phone, currency, country, txRef, facility_id, data_object2) {
    var btn = document.querySelectorAll('a[href="#finish"]'),
        selected_country, selected_currency;
    if (country == 'KE') {
        selected_country = 'KE';
        selected_currency = 'KES'
    } else {
        selected_country = 'US';
        selected_currency = 'USD';
    }
    var x = getpaidSetup({
        PBFPubKey: API_publicKey,
        customer_firstname: fullName,
        customer_email: email,
        amount: 1,
        customer_phone: phone,
        currency: selected_currency,
        country: selected_country,
        txref: txRef,
        onclose: function() {},
        callback: function(response) {
            flw_ref = response.data.txRef;
            response.data = response.hasOwnProperty("tx") ? response.tx : response.data;
            if (response.data.paymentType == "card") {
                response.data["customer.email"] = email;
                response.data["customer.phone"] = phone;
            }
            response.data["customer.fullName"] = fullName;
            var wave = response.data;
            if (wave !== '') {
                x.close();
                console.log("This is the response returned after a charge", wave);
                var subscription_data = JSON.stringify(data_object2);
                console.log("This is the subscription data", subscription_data);
                $.ajax({
                    url: "operation/subscriptionOperations.php",
                    method: "POST",
                    data: { facility_id: facility_id, data: subscription_data, wave: wave },
                    dataType: "json",
                    success: function(data_response) {
                        if (data_response == 200) {
                            swal({
                                title: "Success",
                                text: "Your subscription payment is successful. A link to set up your account password has been sent to your email address",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#37ce8a",
                                confirmButtonText: "Continue",
                                closeOnConfirm: false,
                            }, function(isConfirm) {
                                if (isConfirm) {
                                    window.location.replace("https://myhealthafrica.com/myonemedpro");
                                }
                            });
                            $(btn).prop('disabled', true).html('Successful');
                        } else if (data_response == 400) {
                            swal({
                                title: "Error",
                                text: "Your subscription payment failed to complete. Please try again.",
                                type: "error",
                                timer: 5000,
                                showConfirmButton: false
                            });
                            $(btn).prop('disabled', false).html('Proceed to payment');
                        } else if (data_response == 500) {
                            swal({
                                title: "Error",
                                text: "Your subscription payment was successful. However, an error was encountered while creating your account. Please contact My Health Africa support team for help. Thank you",
                                type: "error",
                                timer: 5000,
                                showConfirmButton: false
                            });
                            $(btn).prop('disabled', false).html('Proceed to payment');
                        } else if (data_response == 300) {
                            swal({
                                title: "Error",
                                text: "Your subscription was successful. However, an error was encountered while creating your account activation link. Please contact My Health Africa support team for help. Thank you",
                                type: "error",
                                timer: 5000,
                                showConfirmButton: false
                            });
                            $(btn).prop('disabled', false).html('Proceed to payment');
                        } else if (data_response == 700) {
                            swal({
                                title: "Error",
                                text: "Something went wrong while processing your request, please try again or contact My Health Africa support team for help. Thank you",
                                type: "error",
                                timer: 5000,
                                showConfirmButton: false
                            });
                            $(btn).prop('disabled', false).html('Proceed to payment');
                        }
                    }
                });
            }
        }
    });
}

function flutterwavePaymentPlan(API_publicKey, fullName, email, amount, phone, currency, country, txRef, data_object2, plan_name, plan_amount, plan_currency, plan_interval, plan_duration, facility_id) {
    var btn = document.querySelectorAll('a[href="#finish"]'),
        selected_country, selected_currency;
    if (country == 'KE') {
        selected_country = 'KE';
        selected_currency = 'KES'
    } else {
        selected_country = 'US';
        selected_currency = 'USD';
    }
    $.ajax({
        url: "operation/subscriptionPaymentPlans.php",
        method: "POST",
        data: { operation: 'create-plan', plan_name: plan_name, plan_amount: 1, plan_currency: plan_currency, plan_interval: plan_interval, plan_duration: plan_duration },
        dataType: "json",
        success: function(response) {
            console.log(response);
            if (response.status == 'success') {
                $.toast({
                    heading: 'Success',
                    text: 'Your payment plan has been successfully created, proceed to pay now for the subscription now',
                    icon: 'success',
                    position: 'bottom-right',
                    showHideTransition: 'slide',
                    hideAfter: 5000
                });
                var plan_id = response.data.id;
                var x = getpaidSetup({
                    PBFPubKey: API_publicKey,
                    customer_firstname: fullName,
                    customer_email: email,
                    payment_plan: plan_id,
                    payment_options: 'card',
                    amount: 1,
                    customer_phone: phone,
                    currency: selected_currency,
                    country: selected_country,
                    txref: txRef,
                    onclose: function() {},
                    callback: function(response) {
                        flw_ref = response.data.txRef;
                        response.data = response.hasOwnProperty("tx") ? response.tx : response.data;
                        if (response.data.paymentType == "card") {
                            response.data["customer.email"] = email;
                            response.data["customer.phone"] = phone;
                        }
                        response.data["customer.fullName"] = fullName;
                        var wave = response.data;
                        if (wave !== '') {
                            x.close();
                            console.log("This is the response returned after a charge", wave);
                            var subscription_data = JSON.stringify(data_object2);
                            console.log("This is the subscription data", subscription_data);
                            $.ajax({
                                url: "operation/subscriptionOperations.php",
                                method: "POST",
                                data: { facility_id: facility_id, data: subscription_data, plan_id: plan_id, wave: wave },
                                dataType: "json",
                                success: function(data_response) {
                                    if (data_response == 200) {
                                        swal({
                                            title: "Success",
                                            text: "Your subscription payment is successful. A link to set up your account password has been sent to your email address",
                                            type: "success",
                                            showCancelButton: false,
                                            confirmButtonColor: "#37ce8a",
                                            confirmButtonText: "Continue",
                                            closeOnConfirm: false,
                                        }, function(isConfirm) {
                                            if (isConfirm) {
                                                window.location.replace("https://myhealthafrica.com/myonemedpro");
                                            }
                                        });
                                        $(btn).prop('disabled', true).html('Successful');
                                    } else if (data_response == 400) {
                                        swal({
                                            title: "Error",
                                            text: "Your subscription payment failed to complete. Please try again.",
                                            type: "error",
                                            timer: 5000,
                                            showConfirmButton: false
                                        });
                                        $(btn).prop('disabled', false).html('Proceed to payment');
                                    } else if (data_response == 500) {
                                        swal({
                                            title: "Error",
                                            text: "Your subscription payment was successful. However, an error was encountered while creating your account. Please contact My Health Africa support team for help. Thank you",
                                            type: "error",
                                            timer: 5000,
                                            showConfirmButton: false
                                        });
                                        $(btn).prop('disabled', false).html('Proceed to payment');
                                    } else if (data_response == 300) {
                                        swal({
                                            title: "Error",
                                            text: "Your subscription was successful. However, an error was encountered while creating your account activation link. Please contact My Health Africa support team for help. Thank you",
                                            type: "error",
                                            timer: 5000,
                                            showConfirmButton: false
                                        });
                                        $(btn).prop('disabled', false).html('Proceed to payment');
                                    } else if (data_response == 700) {
                                        swal({
                                            title: "Error",
                                            text: "Something went wrong while processing your request, please try again or contact My Health Africa support team for help. Thank you",
                                            type: "error",
                                            timer: 5000,
                                            showConfirmButton: false
                                        });
                                        $(btn).prop('disabled', false).html('Proceed to payment');
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                swal({
                    title: "Error",
                    text: "There was an error in creating your subscription plan. Please try again or contact .",
                    type: "error",
                    timer: 5000,
                    showConfirmButton: false
                });
                $(btn).prop('disabled', false).html('Proceed to payment');
            }
        }
    });
}

function flutterwaveRecurrentBilling(API_publicKey, fullName, email, amount, phone, currency, country, txRef, data_object1, data_object2, plan_name, plan_amount, plan_currency, plan_interval, plan_duration) {
    var subscription_data = JSON.stringify(data_object1);
    var btn = document.querySelectorAll('a[href="#finish"]');
    $.ajax({
        url: "operation/subscriptionOperations.php",
        method: "POST",
        data: { data: subscription_data },
        dataType: "json",
        success: function(data_response) {
            if (data_response.response == 200) {
                var facility_id = data_response.facility_id;
                flutterwavePaymentPlan(API_publicKey, fullName, email, amount, phone, currency, country, txRef, data_object2, plan_name, plan_amount, plan_currency, plan_interval, plan_duration, facility_id);
            } else if (data_response.response == 800) {
                swal({
                    title: "Error",
                    text: "A user already exists with the email address you provided. Please provide another email address for this subscription.",
                    type: "error",
                    timer: 5000,
                    showConfirmButton: false
                });
                $(btn).prop('disabled', false).html('Proceed to payment');
            } else {
                swal({
                    title: "Error",
                    text: "Something went wrong while processing your request, please try again or contact My Health Africa support team for help. Thank you",
                    type: "error",
                    timer: 5000,
                    showConfirmButton: false
                });
                $(btn).prop('disabled', false).html('Proceed to payment');
            }
        }
    });
}

function Flutterwave_PatientExperiencePayment(API_publicKey, fullName, email, amount, phone, currency, country, txRef, data_object) {
    var btn = document.querySelectorAll('a[href="#finish"]'),
        selected_country = 'KE',
        selected_currency = 'KES';
    var x = getpaidSetup({
        PBFPubKey: API_publicKey,
        customer_firstname: fullName,
        customer_email: email,
        amount: 1,
        customer_phone: phone,
        currency: selected_currency,
        country: selected_country,
        txref: txRef,
        onclose: function() {},
        callback: function(response) {
            flw_ref = response.data.txRef;
            response.data = response.hasOwnProperty("tx") ? response.tx : response.data;
            if (response.data.paymentType == "card") {
                response.data["customer.email"] = email;
                response.data["customer.phone"] = phone;
            }
            response.data["customer.fullName"] = fullName;
            var wave = response.data;
            if (wave !== '') {
                x.close();
                console.log("This is the response returned after a charge", wave);
                var subscription_data = JSON.stringify(data_object);
                console.log("This is the subscription data", subscription_data);
                $.ajax({
                    url: "operation/subscriptionOperations.php",
                    method: "POST",
                    data: { facility_id: facility_id, data: subscription_data, wave: wave },
                    dataType: "json",
                    success: function(data_response) {
                        if (data_response == 200) {
                            swal({
                                title: "Success",
                                text: "Your patient experience subscription payment is successful. A link to set up your account password has been sent to your email address",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#37ce8a",
                                confirmButtonText: "Continue",
                                closeOnConfirm: false,
                            }, function(isConfirm) {
                                if (isConfirm) {
                                    window.location.replace("https://myhealthafrica.com/myonemedpro");
                                }
                            });
                        } else if (data_response == 400) {
                            swal({
                                title: "Error",
                                text: "Your patient experience subscription payment failed to complete. Please try again.",
                                type: "error",
                                timer: 5000,
                                showConfirmButton: false
                            });
                            $(btn).prop('disabled', false).html('Proceed to payment');
                        } else if (data_response == 700) {
                            swal({
                                title: "Error",
                                text: "Something went wrong while processing your request, please try again or contact My Health Africa support team for help. Thank you",
                                type: "error",
                                timer: 5000,
                                showConfirmButton: false
                            });
                            $(btn).prop('disabled', false).html('Proceed to payment');
                        }
                    }
                });
            }
        }
    });
}

function DPO_CardSubscriptionPayment(PaymentURL, fullName, email, amount, phone, currency, country, SELECTED_COUNTRY_CODE, txRef, facility_id, patient_experience) {
    $.ajax({
        url: "operation/DPO_API.php",
        method: "POST",
        data: {
            operation: 'OneMedPro-createCardToken',
            facility_id: facility_id,
            currency: currency,
            txRef: txRef,
            fullName: fullName,
            email: email,
            country: country,
            SELECTED_COUNTRY_CODE: SELECTED_COUNTRY_CODE,
            phone: (phone.replace(/\s/g, '')).replace(SELECTED_DIAL_CODE, ''),
            amount: amount,
            patient_experience: patient_experience
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
                $(btn).prop('disabled', false).html('Proceed to payment');
            }
        }
    });
}

function DPO_MobileSubscriptionPayment(PaymentURL, fullName, email, amount, phone, currency, country, SELECTED_COUNTRY_CODE, txRef, facility_id, patient_experience) {
    $.ajax({
        url: "operation/DPO_API.php",
        method: "POST",
        data: {
            operation: 'OneMedPro-createMobileToken',
            facility_id: facility_id,
            currency: currency,
            txRef: txRef,
            fullName: fullName,
            email: email,
            country: country,
            SELECTED_COUNTRY_CODE: SELECTED_COUNTRY_CODE,
            phone: (phone.replace(/\s/g, '')).replace(SELECTED_DIAL_CODE, ''),
            amount: amount,
            patient_experience: patient_experience
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
                $(btn).prop('disabled', false).html('Proceed to payment');
            }
        }
    });
}

function DPO_PatientExperiencePayment(facility_id, PaymentURL, fullName, email, amount, phone, currency, country, SELECTED_COUNTRY_CODE, txRef) {
    $.ajax({
        url: "operation/DPO_API.php",
        method: "POST",
        data: {
            operation: 'PE-createToken',
            facility_id: facility_id,
            currency: currency,
            txRef: txRef,
            fullName: fullName,
            email: email,
            country: country,
            phone: (phone.replace(/\s/g, '')).replace(SELECTED_DIAL_CODE, ''),
            amount: amount
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
                $(btn).prop('disabled', false).html('Proceed to payment');
            }
        }
    });
}