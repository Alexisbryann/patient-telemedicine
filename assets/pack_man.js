const locked_page_html = (feature_list) => `
    <div tabindex="-1" role="dialog" id="modal_feature_inaccessible">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header" style="padding: .5rem 1rem .5rem; border: none">
                    <h2 class="w-100 my-3" style="text-align: center; font-size: 2rem!important; font-weight: 500;">
                        Get more out of OneMedPro
                    </h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                        style="margin: .5rem -1.5rem 0rem auto">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <hr style="width: 70%; border-color: silver; margin: .5rem auto;">
                <div class="modal-body px-5 pb-5">
                    <div class="d-flex flex-column-reverse flex-lg-row align-items-center align-items-lg-start">
                        <div class="w-100">
                            <header>
                                <p style="font-size: 1.4rem;"><strong>Unlock this and more features in your product</strong></p>
                            </header>

                            ${feature_list}

                            <span
                                style="padding: .75em 1em; border: 1px solid silver; border-radius: 3px; cursor: pointer; font-size: 1rem; background-color: rgb(40, 167, 69); color: white;"
                                title="Upgrade subscription" id="upgrade_subscription"><strong>Upgrade Now</strong></span>
                        </div>
                        <img class="my-auto" style="width: 10rem; margin-left: 1em;" src="images/stethoscope.png">
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    users_limit_reached_hmtl = `
    <div tabindex="-1" role="dialog" id="modal_feature_inaccessible">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header" style="padding: .5rem 1rem .5rem; border: none">
                    <h2 class="w-100 my-3" style="text-align: center; font-size: 2rem!important; font-weight: 500;">
                        Get more out of OneMedPro
                    </h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                        style="margin: .5rem -1.5rem 0rem auto">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <hr style="width: 70%; border-color: silver; margin: .5rem auto;">

                <div class="modal-body" style = "padding:0 4rem 4rem">
                    <div class="d-flex flex-column-reverse flex-lg-row align-items-center align-items-lg-start">
                        <div class="w-100 pr-3" id="accounts_limit_reached_info">
                            <header>
                                <p style="font-size: 1.4rem;"><strong>You have reached the user accounts limit for your subscription.</strong></p>
                            </header>

                            <p class="mb-3 mt-4" style="font-size: 1.3rem">Activate additional user accounts and expand your practice.</p>

                            <ul class="mb-4">
                                <li style="list-style-type: '⭐&nbsp';">Maintain consolidated appointment and patient data from all doctors registered in the subscription.</li>
                                <li style="list-style-type: '⭐&nbsp';">Create accounts for non-clinical staff, such as secretary, marketing and pharmacy departments to extend your medical practice.</li>
                                <li style="list-style-type: '⭐&nbsp';">Share provisions that come with your subscription, such as Patient Experience SMS and email credits, among all users registered with the account.</li>
                            </ul>

                            <span
                                style="padding: .75em 1em; border: 1px solid silver; border-radius: 3px; cursor: pointer; font-size: 1rem; background-color: rgb(40, 167, 69); color: white;"
                                title="Upgrade subscription" id="get_additional_accounts"><strong>Get Additional Accounts</strong></span>
                        </div>
                        <div class="d-flex flex-column" id="purchase_additional_accounts_page" style="display:none!important">
                            <header>
                                <p style="font-size: 1.4rem;"><strong>You have reached the user accounts limit for your subscription.</strong></p>
                            </header>

                            <div class="form-group form-inline mb-5">
                                <label for="additional_accounts_number" class="mr-3">Number of additional accounts:</label>
                                <input class="form-control" type="number" min="1" name="additional_accounts_number"
                                    id="additional_accounts_number" value=1>
                            </div>

                            <strong style="font-size:2rem; margin-bottom: 1em;"><span id="additional_accounts_currency">$</span>&nbsp;<span id = 'additional_accounts_cost'>9.00</span></strong>
                            <span title="Purchase accounts" id="accounts_checkout_btn"><strong style="padding: .75em 1em; border: 1px solid silver; border-radius: 3px; cursor: pointer; font-size: 1.2rem; background-color: rgb(40, 167, 69); color: white;">Finish</strong></span>
                        </div>
                        <img class="m-auto" style="width: 10rem; margin-left: 1em;" src="images/doctor.png">
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    telemed_limit_reached_html = `
    <div tabindex="-1" role="dialog" id="modal_feature_inaccessible">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header" style="padding: .5rem 1rem .5rem; border: none">
                    <h2 class="w-100 my-3" style="text-align: center; font-size: 2rem!important; font-weight: 500;">
                        Get more out of OneMedPro
                    </h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="margin: .5rem -1.5rem 0rem auto">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <hr style="width: 70%; border-color: silver; margin: .5rem auto;">

                <div class="modal-body" style="padding:0 4rem 4rem">
                    <div class="d-flex flex-column-reverse flex-lg-row align-items-center align-items-lg-start">
                        <div class="w-100 pr-3" id="accounts_limit_reached_info">
                            <header>
                                <p style="font-size: 1.4rem;"><strong>You have reached the telemedicine limit for your current
                                        subscription.</strong></p>
                            </header>

                            <p class="mb-3 mt-4" style="font-size: 1.3rem">Click the button below to activate unlimited telemedicine
                                appointments, valid until your subscription expiry date.</p>

                            <ul class="mb-4">
                                <li style="list-style-type: '⭐&nbsp';">Schedule and hold virtual appointments with your patients.</li>
                                <li style="list-style-type: '⭐&nbsp';">Attend to patients at convenient times for both you and them,
                                    from any location.</li>
                                <li style="list-style-type: '⭐&nbsp';">Avoid queues at your clinic and still offer high quality
                                    healthcare.</li>
                            </ul>

                            <span
                                style="padding: .75em 1em; border: 1px solid silver; border-radius: 3px; cursor: pointer; font-size: 1rem; background-color: rgb(40, 167, 69); color: white;"
                                title="Upgrade subscription" id="get_unlimited_telemed"><strong>Get Unlimited
                                    Telemedicine</strong></span>
                        </div>
                        <img class="m-auto" style="width: 10rem; margin-left: 1em;" src="images/consulting.png">
                        </div>
                </div>
            </div>
        </div>
    </div>`,
    locked_feature_badge = `
    <div class="ribbon down" title="Locked feature">
        <div class= "content">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                <g id="Layer_2">
                    <path fill="#fff" d="M376.749,349.097c-13.531,0-24.5-10.969-24.5-24.5V181.932c0-48.083-39.119-87.203-87.203-87.203   c-48.083,0-87.203,39.119-87.203,87.203v82.977c0,13.531-10.969,24.5-24.5,24.5s-24.5-10.969-24.5-24.5v-82.977   c0-75.103,61.1-136.203,136.203-136.203s136.203,61.1,136.203,136.203v142.665C401.249,338.128,390.28,349.097,376.749,349.097z"/>
                </g>
                <g id="Layer_3">
                    <path fill="#fff" d="M414.115,497.459H115.977c-27.835,0-50.4-22.565-50.4-50.4V274.691c0-27.835,22.565-50.4,50.4-50.4h298.138   c27.835,0,50.4,22.565,50.4,50.4v172.367C464.515,474.894,441.95,497.459,414.115,497.459z"/>
                </g>
                <g id="Layer_4">
                    <path fill="silver" d="M109.311,456.841h-2.525c-7.953,0-14.4-6.447-14.4-14.4V279.309c0-7.953,6.447-14.4,14.4-14.4h2.525   c7.953,0,14.4,6.447,14.4,14.4v163.132C123.711,450.394,117.264,456.841,109.311,456.841z"/>
                </g>
            </svg>
        </div >
    </div >`,
    my_patients_feature_list = `
    <ul class="mb-4">
        <li style="list-style-type: '⭐&nbsp';">Access and view comprehensive patient records.</li>
        <li style="list-style-type: '⭐&nbsp';">Upload patient files such as scans to patient records.</li>
        <li style="list-style-type: '⭐&nbsp';">Download or export patient records.</li>
    </ul>`,
    med_on_demand_feature_list = `
    <ul class="mb-4">
        <li style="list-style-type: '⭐&nbsp';">Offer secure online teleconsultations.</li>
        <li style="list-style-type: '⭐&nbsp';">View comprehensive patient records.</li>
        <li style="list-style-type: '⭐&nbsp';">View comprehensive e-Prescription records.</li>
    </ul>`,
    admin_feature_list = `
    <ul class="mb-4">
        <li style="list-style-type: '⭐&nbsp';">Create and manage account users.</li>
        <li style="list-style-type: '⭐&nbsp';">Create new services, departments and locations.</li>
        <li style="list-style-type: '⭐&nbsp';">Create service calendar.</li>
    </ul>`,
    generic_feature_list = `
    <ul class="mb-4">
        <li style="list-style-type: '⭐&nbsp';">Write and send e-prescriptions.</li>
        <li style="list-style-type: '⭐&nbsp';">Hold telemedicine appointments.</li>
        <li style="list-style-type: '⭐&nbsp';">Keep track of all your patients' records.</li>
        <li style="list-style-type: '⭐&nbsp';">Stay in touch with your clients through our <a
                href="https://myhealthafrica.com/onemed-pro/patient-experience/" target="_blank"
                style="text-decoration: none;">Patient Experience</a>
            platform.</li>
    </ul>`,
    patient_experience_views = ["sms", "email", "survey", "feedback", "contacts"],
    allowed_views = {
        Free: [...patient_experience_views,
            "dashboard",
            "my_referrals",
            "past-appointments",
            "upcoming-appointments",
            "subscribe_now",
            "doctor-help",
            "profile_management",
            "admin",
            "my-medical-community",
            "network_chat",
            "doctor-feedback"
        ],
        get Standard() {
            return [...this.Free, "future_schedule", "patient-chat", "appointments-reports"];
        },
        Premium: [...Object.keys(sidebar_links), "account-setup"], //all pages
        Platinum: [...Object.keys(sidebar_links), "account-setup"] //all pages
    };
let number_of_accounts = 1, accounts_value = 9, rate = 1, f_wave_currency = "USD";

if (subscription_package) {
    /**
     * display pop-up on locked pages
     */
    if (!(allowed_views[subscription_package].includes(page_name) || page_directory == "patientexperience" || page_name == "account-setup")) { //subscription_package: navbar.php; page_name: sidebar.js; page_directory: sidebar.js
        $(".page-content").html(locked_page_html(generic_feature_list)).find(".close").remove();
    }

    // display badges on sidebar links for locked features
    let seen_links = [];

    // getting the class name for the sidebar links of allowed pages for the user's subscription
    const allowed_links = new Set(allowed_views[subscription_package].map(allowed => sidebar_links[allowed])); //sidebar_links: sidebar.js

    for (const page in sidebar_links) {
        if (Object.hasOwnProperty.call(sidebar_links, page)) {
            const sidebar_link = sidebar_links[page];
            // disable parent sidebar dropdown toggler for modules that are entirely disabled for a package
            if (!(allowed_views[subscription_package].includes(page) || seen_links.includes(sidebar_link) || allowed_links.has(sidebar_link))) {
                $(`.sb-${sidebar_link} > .nav-link`).append(locked_feature_badge);
                seen_links.push(sidebar_link);
            }

            // disable sidebar links for disabled pages
            if (!allowed_views[subscription_package].includes(page)) {
                $(`.sidemenu [href='${page}']`).removeClass("nav-link").removeAttr("href").addClass("locked-feature").append(locked_feature_badge);
            }
        }
    }

    /**
     * module-specific logic
     * disable buttons for inaccessible features
     * display blocked feature message in disabled pages and modals
     * remove telemedicine options where applicable
     */

    switch (subscription_package) {
        case "Free":
            // navbar e-prescription button
            $("#NavbarAddEPrescription").append(locked_feature_badge);
            // sidebar links
            // $(".sb-my-network > .nav-link, .sb-network-chat > .nav-link, .sb-patient-chat > .nav-link, .sb-set-future-schedule > .nav-link, .sb-my-reviews > .nav-link").append(locked_feature_badge).removeClass("nav-link").removeAttr("href").addClass("locked-feature");
            // modals
            $("#diagnosticque, #reallocateBooking, #prescriptionModal, #addEPrescriptionModal, #modal-patient-file-upload").html(locked_page_html(generic_feature_list));
            // data tables
            $("#visit-history, #patient-prescriptions, #draft-prescriptions, #doctor-notes, #DiagnosticResults, #fileUploads").html(locked_page_html(my_patients_feature_list)).find(".close").remove();
            // telemed manual booking
            $(`#service option[data-location="130"]`).remove();
            
            // show banner on appointment modal 
            $("#free-acc-banner").show();
            break;

        case "Standard":
            // navbar e-prescription button
            $("#NavbarAddEPrescription").append(locked_feature_badge);
            // sidebar links
            // $(".sb-financial-reports > .nav-link").append(locked_feature_badge).removeClass("nav-link").removeAttr("href").addClass("locked-feature");
            // modals
            $("#prescriptionModal, #addEPrescriptionModal, #modal-patient-file-upload").html(locked_page_html(generic_feature_list));
            // data tables
            $("#visit-history, #patient-prescriptions, #draft-prescriptions, #doctor-notes, #DiagnosticResults, #fileUploads").html(locked_page_html(my_patients_feature_list)).find(".close").remove();
            // telemed manual booking
            $(`#service option[data-location="130"]`).remove();
            break;
        default:
            break;
    }
}

// control click on locked link
$(".locked-feature").on("click", function (e) {
    e.preventDefault();
    $(".page-content").html(locked_page_html(generic_feature_list)).find(".close").remove();
});

// get USD-KES exchange rate if user country is Kenya
if (country == "Kenya") { // country: navbar.php
    const query = `${encodeURIComponent("USD")}_${encodeURIComponent("KES")}`, url = `https://free.currconv.com/api/v7/convert?q=${query}&compact=ultra&apiKey=3c292f10d66c50e9cfe6`;

    $.ajax({
        url: url,
        dataType: 'json',
        success: function (response) {
            $("#additional_accounts_currency").text("KES");
            f_wave_currency = "KES";
            rate = response[query];
            accounts_value = Math.ceil(rate * 9);
            $("#additional_accounts_cost").text(`${new Intl.NumberFormat().format(accounts_value)}.00`);
        },
        error: function (error) {
            $.toast({
                heading: "Notice",
                text: 'There was a problem fetching the current exchange rate. Payments will be charged in USD. <br>Refreshing the page might help resolving the issue.',
                position: 'bottom-right',
                showHideTransition: 'slide',
                timer: 7000,
            });
        }
    });
}

$(document).on("click", "#get_additional_accounts", function () {
    $("#accounts_limit_reached_info").hide();
    $("#purchase_additional_accounts_page").show();
});

$(document).on("change", "#additional_accounts_number", function () {
    if (!$(this).val().length > 0) $(this).val(1);

    number_of_accounts = $(this).val(), accounts_value = Math.ceil(parseFloat(number_of_accounts) * 9 * rate);

    $("#additional_accounts_cost").text(`${new Intl.NumberFormat().format(accounts_value)}.00`);
});

// payment handler for purchasing addons
$(document).on("click", "#accounts_checkout_btn, #get_unlimited_telemed", function () {
    const API_publicKey = "FLWPUBK-59c70a34288d4c9337bc3a8ad22db9e7-X", txRef = $("#facility_id").val(), element_id = $(this).attr("id");

    const f_wave_amt = element_id == "accounts_checkout_btn" ? Math.ceil(parseInt($("#additional_accounts_number").val()) * rate * 9) : Math.ceil(rate * 9);
    const addon_item = element_id == "accounts_checkout_btn" ? "additional user accounts" : "unlimited telemedicine";

    var flutter_wave = getpaidSetup({
        PBFPubKey: API_publicKey,
        customer_firstname: addons_doctor_name.split(" ").shift(), //addons_doctor_name: navbar.php
        customer_lastname: addons_doctor_name.split(" ").pop(),
        customer_phone: addons_doctor_phone, //addons_doctor_phone: navbar.php
        customer_email: addons_doctor_email, //addons_doctor_email: navbar.php
        currency: f_wave_currency,
        amount: f_wave_amt,
        country: country,
        txref: txRef,

        callback: function (response) {
            console.log(response);
            let wave = response.hasOwnProperty("tx") ? response.tx : response.data;

            if (wave.paymentType == "card") {
                wave["customer.phone"] = flutter_wave.customer_phone;
                wave["customer.email"] = flutter_wave.customer_email;
            }

            // saves all transactions, even failed/cancelled ones
            $.ajax({
                url: "operation/addonPaymentHandler.php",
                method: "POST",
                data: { addon_item: addon_item, wave: wave, rate: rate, number_of_accounts: number_of_accounts },
                dataType: "json",
                success: function (response) {
                    flutter_wave.close();

                    if (!(response.error || response.db_error || response.wave_error)) {
                        swal({
                            title: `Success`,
                            text: `User accounts limit extended successfuly.`,
                            type: "success",
                            showConfirmButton: true,
                            showCloseButton: true,
                        }, function (isConfirm) {
                            location.reload();
                        });

                    }
                    if (response.wave_error) {
                        $.toast({
                            heading: "Error",
                            text: 'Your payment was not successful. Please complete the payment to extend your user limit.',
                            position: 'bottom-right',
                            showHideTransition: 'slide',
                            timer: 7000,
                        });
                    }
                    if (response.db_error || response.error) {
                        $.toast({
                            heading: "Error",
                            text: `Something went wrong while processing your payment. Please contact billing@myhealthafrica.com for assistance. Your transaction reference number is ${wave.id}`,
                            position: 'bottom-right',
                            showHideTransition: 'slide',
                            timer: 7000,
                        });
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
});

// payment prompt when telemedicine service selected and user has reached telemed limit
$('#service').on('change', function () {
    var location = $('#service option[value="' + $(this).val() + '"]').attr('data-location');

    if (location == 130 && subscription_telemed_status == "exhausted") { // subscription_telemed_status: navbar.php
        $(this).closest(".modal").html(telemed_limit_reached_html).find(".close").on("click", function () {
            window.location.reload();
        });
    }
});

if (subscription_accounts_status == "exhausted") { //subscription_accounts_status: navbar.php
    $("#add_user").html(users_limit_reached_hmtl);
}

$(document).on('click', '#upgrade_subscription', function () {
    localStorage.setItem("upgrade_facility_id", f_i_d); //f_i_d: navbar.php
    window.location = '../subscription/subscription-upgrade';
});

setInterval(() => {
    $.ajax({
        url: "operation/sessionAssertion.php",
        dataType: "json",
        data: {
            "token": csrf_token,
        },
        success: function (response) {
            if (!response.session) {
                if (response.hasOwnProperty("user_login")) {
                    const user_login = response.user_login;
                    $("#session-user_login").text(user_login);
                    $("#sessionExpiredPopUp").modal("show");
                } else {
                    window.location.href = "login";
                }
            }
        },
    });
}, 60000);

$("#sessionExpiredPopUp").on("submit", function (event) {
    event.preventDefault();

    $("#resume-session-submit").html("<strong>Verifying...</strong>");

    $.ajax({
        method: "POST",
        url: "operation/passwordVerification.php",
        dataType: "json",
        data: {
            "password": $("#session-expired-password").val(),
        },
        success: function (response) {
            if (response.verified) {
                $("#resume-session-submit").html("<strong>Verified&nbsp;<i class = 'fa fa-check'></i></strong>");

                setTimeout(() => {
                    $("#sessionExpiredPopUp").modal("hide");
                }, 2000);
            } else {
                $("#resume-session-submit").html("<strong>Verification failed&nbsp;<i class = 'fa fa-times'></i></strong>");

                setTimeout(() => {
                    $("#resume-session-submit").html("Try again");
                }, 2000);
            }
        }
    });
});