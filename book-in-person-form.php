<!DOCTYPE html>
<html lang="en">
<!-- BEGIN HEAD -->
<?php $inclusions_version = 1 ?>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <title>Tunza Clinic Appointments | My Health Africa </title>
    <!-- icons -->
    <link href="css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <!--bootstrap -->
    <link href="assets/bundles/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <!-- steps wizard -->
    <link href="assets/bundles/steps/steps.css" rel="stylesheet">
    <!-- sweet alert -->
    <link rel="stylesheet" href="../../myonemedpro/assets/bundles/sweet-alert/sweetalert.min.css?v=<?php echo $inclusions_version; ?>">
    <link rel="stylesheet" type="text/css" href="assets/bundles/bootstrap-timepicker/css/bootstrap-timepicker.css" />
    <link rel="stylesheet" type="text/css" href="assets/bundles/bootstrap-datepicker/css/bootstrap-datepicker.css" />
    <link href="css/booking.css?v=<?php echo $inclusions_version ?>" rel="stylesheet" type="text/css" />
    <!-- favicon -->
    <link rel="shortcut icon" href="images/my-health-africa.png" />
</head>
<!-- END HEAD -->

<body>
    <section class="d-none d-md-flex flex-column  align-items-center ">
        <header class="text-center mb-3">
            <h2 class="h1"><strong>Alternatively, Book An In-Person Appointment</strong></h2>
            <h4 class="text-muted">Please complete the steps below to book an appointment.</h4>
        </header>
    </section>

    <div class="d-none d-md-flex booking-step justify-content-center pad border ">
        <label>
            <input type="radio" id="appointment" name="radio-button" value="0" checked />
            <span>Appointment Details</span>
        </label>
        <label class="d-flex align-items-center">
            <hr>
        </label>
        <label>
            <input type="radio" id="patient" name="radio-button" value="1" />
            <span>Patient Details</span>
        </label>
        <label class="d-flex align-items-center">
            <hr>
        </label>
        <label>
            <input type="radio" id="confirm" name="radio-button" value="2" />
            <span>Confirm Details</span>
        </label>
    </div>

    <div class="sticky-top bg-white pb-2 pb-md-0">
        <div class="d-flex d-md-none w-100 justify-content-between align-items-center px-3">
            <img src="images/psi/mha-psi-logo.png" id="mobile-page-logo">
            <!--<span id="mobile-page-close" title="Close">&#x2715;</span>-->
        </div>

        <div class="d-flex px-3 flex-column d-md-none" id="mobile-booking-progress-container">
            <div class="d-flex justify-content-between">
                <strong id="step-title">Appointment Details</strong>
                <span>Step <span id="booking-form-step-number">1</span> of 3</span>
            </div>
            <progress class="w-100" max="3" value="1" id="booking-form-progress"></progress>
        </div>
    </div>

    <form id="book-inperson" data-facility_id="<?php echo $_GET["facility_id"] ?? "" ?>" class="border">
        <h3></h3>
        <fieldset>
            <!--Appointment details step-->
            <div class="d-flex flex-column">

                <span class="mx-auto pad">Fill in the details to schedule the appointment.</span>
                <div class="d-flex flex-column flex-md-row" style="border-top-width: 10px;">
                    <!-- medical concern + date + time slots row -->
                    <div class="d-flex flex-column size bord justify-content-between">
                        <!--Medical concern and facility column-->
                        <div class="form-group size">

                            <span>Medical concern <span class="required"></span></span>

                            <div class="d-flex size" id="medical-conditions-container">
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="checkbox" name="medical-concern" value="Family planning" id="exampleRadios2">
                                    <label class="form-check-label " for="exampleRadios2">
                                        Family planning
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="checkbox" name="medical-concern" value="Non-communicable diseases" id="exampleRadios3">
                                    <label class="form-check-label " for="exampleRadios3">
                                        Non-communicable diseases
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="checkbox" name="medical-concern" value="Maternal care" id="exampleRadios4">
                                    <label class="form-check-label " for="exampleRadios4">
                                        Maternal care
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="checkbox" name="medical-concern" value="Child care" id="exampleRadios5">
                                    <label class="form-check-label " for="exampleRadios5">
                                        Child care
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="checkbox" name="medical-concern" value="Tuberculosis" id="exampleRadios6">
                                    <label class="form-check-label " for="exampleRadios6">
                                        Tuberculosis
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="checkbox" name="medical-concern" value="HIV" id="exampleRadios7">
                                    <label class="form-check-label " for="exampleRadios7">
                                        HIV
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="checkbox" name="medical-concern" value="Other" id="exampleRadios8">
                                    <label class="form-check-label " for="exampleRadios8">
                                        Other
                                    </label>
                                </div>

                            </div>
                        </div>

                        <div class="form-group">

                            <label>Select facility<span class="required"></span></label>
                            <select class="form-control" name="facility" id="facility">

                                <option selected disabled value=""></option>
                                <option value="123">Meditrust Healthcare Services - Mombasa</option>
                                <option value="126">Ukunda Medical Centre - Ukunda</option>
                                <option value="121">Zamzam Medical Services - Ngong'</option>
                                <option value="127">Watamu Hospital - Watamu</option>
                                <option value="116">Shepherds Hospital - Narok</option>
                                <option value="120">Watamu Community Healthcare - Watamu</option>
                                <option value="122">Wama Nursing Home - Ongata Rongai</option>
                                <option value="119">Topcare Nursing Home - Kitengela</option>
                                <!-- <option value="34">Wankam Medical Centre - Juja</option> -->
                            </select>
                        </div>

                        <div class="d-flex flex-column" id="appointment-type-container">
                            <div class="form-group">
                                <label for="appointment-type">Select appointment type<span class="required"></span></label>
                                <select name="appointment-type" id="appointment-type" class="form-control" required>
                                    <option value="in_person_service" selected>In person consultation</option>
                                    <option value="telemedicine_service">Telemedicine consultation</option>
                                </select>
                            </div>

                            <!-- <div class="form-check">
                                <input class="form-check-input" type="radio" name="appointment-type" value="in_person_service" id="in-person-appointment" checked>
                                <label class="form-check-label" for="in-person-appointment">In person appointment</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="appointment-type" value="telemedicine_service" id="telemedicine-appointment">
                                <label class="form-check-label" for="telemedicine-appointment">Telemedicine appointment</label>
                            </div> -->
                        </div>
                    </div>

                    <div class="size center bord">
                        <!--Calendar column-->
                        <div>
                            <div class="left">Choose a date <span class="required"></span></div>
                            <div class="border disabled-element-target center" id="in-person-appointment-date" data-required_input="#facility"></div>
                            <input type="hidden" id="appointment-date" name="appointment-date">
                            <span class="disabled-element-error"></span>
                        </div>
                    </div>

                    <div class="d-flex flex-column w-100 bord justify-content-between">
                        <!-- time slots column -->
                        <div class="form-group h-100">
                            <span>Choose an available time slot <span class="required"></span></span>

                            <section class="d-none">
                                <div class="d-flex flex-wrap" id="time-slots-container">
                                    <div class="form-check radio-css-slots align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="time-slots" value="option1" id="exampleRadios10">
                                        <label class="form-check-label " for="exampleRadios10">
                                            00:21 AM
                                        </label>
                                    </div>
                                    <div class="form-check radio-css-slots align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="time-slots" value="option1" id="exampleRadios11">
                                        <label class="form-check-label " for="exampleRadios11">
                                            09:30 AM
                                        </label>
                                    </div>
                                    <div class="form-check radio-css-slots align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="time-slots" value="option1" id="exampleRadios12">
                                        <label class="form-check-label " for="exampleRadios12">
                                            11:45 AM
                                        </label>
                                    </div>
                                </div>
                            </section>
                            <section class="d-flex flex-column apt" id="time-slots-disabled">
                                <h5 class="mt-2">Choose a date to see available time slots</h5>
                            </section>
                        </div>

                        <div class="d-flex flex-column">

                            <span>Your appointment will be on</span>
                            <section class="d-none" id="appointment-date-time-display-container">
                                <span><strong id="appointment-date-display"></strong>&nbsp;at&nbsp;<strong id="appointment-time-display"></strong></span>
                            </section>
                            <section class="d-flex flex-column size apt" id="appointment-time-unset">
                                <h5>Choose date and time</h5>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-group bord mt-2">
                <label>Describe your medical concern</label>
                <textarea id="medical-concern-description" name="medical-concern-description" class="form-control"></textarea>
            </div>

            <span class="error" id="step-0-error-display"></span>
            </div>
            </div>
        </fieldset>
        <h3></h3>
        <fieldset style="text-align:left;" id="patient-details-step-parent">
            <div class="w-100 d-none d-md-flex pad-t patient-details">Fill in the patient's details</div>
            <div class="row md-col" style="margin-left: 15px;margin-right: 15px;margin-bottom: 15px;">
                <div class="patient-details input-grp col-12 col-md-8">

                    <div class="col-12 col-md-6 mt-i">
                        <label>Full name<span class="required"></span></label>
                        <input type="text" id="name" name="name" class="form-control" placeholder="Full name" required />
                        <div id="name-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Email address<span class="required"></span></label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="Email address" required />
                        <div id="email-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Gender<span class="required"></span></label>
                        <select id="gender" name="gender" class="form-control" required>
                            <option selected disabled value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <div id="gender-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Phone number<span class="required"></span></label>
                        <input type="text" id="phone" name="phone" class="form-control" placeholder="Phone number" required />
                        <div id="phone-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Date of birth<span class="required"></span></label>
                        <input type="date" id="dob" name="dob" class="form-control" placeholder="Date of birth" max="<?php echo date("Y-m-d") ?>" step="1" required />
                        <div id="dob-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>

                </div>

                <input type="hidden" name="clinic" value="psi" hidden />
                <input type="hidden" name="operation" value="booking" hidden />
            </div>
        </fieldset>
        <h3></h3>
        <fieldset style="text-align:left;">
            <div id="confirm-details-section">
                <div class="d-flex w-100 justify-content-center my-3 px-3">Kindly confirm the details you entered to ensure they are correct.</div>

                <section class="d-flex mx-0 mx-md-4 flex-column flex-md-row">
                    <div class="w-100 border d-flex flex-column p-3">
                        <strong class="mb-2">Appointment Details</strong>
                        <div class="preview-details-container">
                            <div class="w-100 d-flex flex-column">
                                <span class="preview-detail-label">Medical concern</span>
                                <span class="preview-detail" id="concern-preview">Preview detail</span>
                            </div>
                            <div class="w-100 d-flex flex-column">
                                <span class="preview-detail-label">Appointment type</span>
                                <span class="preview-detail" id="appointment-type-preview">Preview detail</span>
                            </div>
                        </div>
                        <div class="preview-details-container flex-column">
                            <span class="w-100 preview-detail-label">Medical concern description</span>
                            <span class="preview-detail" id="concern-description-preview">Preview detail</span>
                            <span id="show-more-link" title="Show more" data-toggle="modal" data-target="#medical-condition-description">show more</span>
                        </div>
                        <div class="preview-details-container">
                            <div class="w-100 d-flex flex-column">
                                <span class="preview-detail-label">Date</span>
                                <span class="preview-detail" id="date-preview">Preview detail</span>
                            </div>
                            <div class="w-100 d-flex flex-column">
                                <span class="preview-detail-label">Time</span>
                                <span class="preview-detail" id="time-preview">Preview detail</span>
                            </div>
                        </div>
                        <div class="preview-details-container">
                            <div class="mr-auto d-flex flex-column">
                                <span class="preview-detail-label">Facility</span>
                                <span class="preview-detail" id="facility-preview">Preview detail</span>
                            </div>
                        </div>
                    </div>
                    <div class="w-100 border d-flex flex-column p-3">
                        <strong class="mb-2">Patient Details</strong>
                        <div class="preview-details-container flex-wrap">
                            <div class="mw-25 mr-2 d-flex flex-column">
                                <span class="preview-detail-label">Full name</span>
                                <span class="preview-detail" id="name-preview">Preview detail</span>
                            </div>
                            <div class="mw-75 d-flex flex-column">
                                <span class="preview-detail-label">Email</span>
                                <span class="preview-detail" id="email-preview">Preview detail</span>
                            </div>
                        </div>
                        <div class="preview-details-container flex-wrap">
                            <div class="mw-25 mr-2 d-flex flex-column">
                                <span class="preview-detail-label">Gender</span>
                                <span class="preview-detail" id="gender-preview">Preview detail</span>
                            </div>
                            <div class="mw-75 d-flex flex-column">
                                <span class="preview-detail-label">Phone number</span>
                                <span class="preview-detail" id="phone-preview">Preview detail</span>
                            </div>
                        </div>
                        <div class="preview-details-container flex-column">
                            <span class="w-100 preview-detail-label">Date of birth</span>
                            <span class="preview-detail" id="dob-preview">Preview detail</span>
                        </div>
                    </div>
                    <div class="w-50 w-100-md border d-flex flex-column pt-3">
                        <strong class="mb-2 px-3">Appointment Cost</strong>
                        <div class="preview-details-container flex-column h-50 px-3">
                            <span>Total</span>
                            <h2>Ksh. <span id="appointment-cost-display"></span></h2>
                        </div>
                        <div class="d-flex flex-column h-100" id="payment-disclaimer">
                            <span class="bg-dark-orange px-3 py-2"><strong>Note</strong></span>
                            <span class="bg-light-orange px-3 py-2 h-100">Please note you will be required to pay at the clinic</span>
                        </div>
                    </div>
                </section>

                <div class="w-100 d-flex flex-column text-center my-2">
                    <div class="form-check">
                        <input type="checkbox" name="terms-conditions-consent" id="terms-conditions-consent" required>
                        <label for="terms-conditions-consent">Tick the checkbox to state that you have read and agreed to our <a href="https://www.myhealthafrica.com/my-health-africa-consent-form/">consent form.</a></label>
                    </div>
                    <span class="error"></span>
                </div>
            </div>
        </fieldset>
    </form>

    <div class="modal fade" id="medical-condition-description" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content rounded-0">
                <div class="modal-header px-3 py-2">
                    <strong class="modal-title">Medical Concern Description</strong>
                    <span type="button" data-dismiss="modal" aria-label="Close" class="close">
                        <span aria-hidden="true">×</span>
                    </span>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    </div>

    <?php require "booking-form-javascript.php"; ?>
</body>

</html>