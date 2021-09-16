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
    <!-- wizard -->
    <link href="assets/bundles/steps/steps.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="assets/bundles/bootstrap-timepicker/css/bootstrap-timepicker.css" />
    <link rel="stylesheet" type="text/css" href="assets/bundles/bootstrap-datepicker/css/bootstrap-datepicker.css" />
    <link href="css/booking.css?v=<?php echo $inclusions_version ?>" rel="stylesheet" type="text/css" />
    <!-- favicon -->
    <link rel="shortcut icon" href="images/my-health-africa.png" />

    <script></script>
    <script></script>
    <script></script>
</head>
<!-- END HEAD -->

<body>
    <section class="d-flex flex-column  align-items-center ">
        <header>
            <h2>In-Person Appointment</h2>
        </header>
    </section>

    <div class="d-flex booking-step justify-content-center pad border-btm ">
        <label>
            <input type="radio" id="appointment" name="radio-button" checked />
            <span>Appointment Details</span>
        </label>
        <label>
            <hr>
        </label>
        <label>
            <input type="radio" id="patient" name="radio-button" />
            <span>Patient details</span>
        </label>
        <label>
            <hr>
        </label>
        <label>
            <input type="radio" id="confirm" name="radio-button" />
            <span>Confirm details</span>
        </label>
    </div>

    <form id="book-inperson" data-facility_id="<?php echo $_GET["facility_id"] ?? "33" ?>" class="border margin">
        <h3></h3>
        <fieldset>
            <!--Appointment details step-->
            <div class="d-flex flex-column">

                <span class="mx-auto pad">Fill in the details to schedule the appointment.</span>
                <div class="d-flex flex-column flex-md-row" style="border-top-width: 10px;">
                    <!-- medical concern + date + time slots row -->
                    <div class="d-flex flex-column size bord">
                        <!--Medical concern and facility column-->
                        <div class="form-group size">

                            <span>Medical concern <span class="required"></span></span>

                        


                            <div class="d-flex size" id="medical-conditions-container">
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id="exampleRadios2">
                                    <label class="form-check-label " for="exampleRadios2">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id="exampleRadios3">
                                    <label class="form-check-label " for="exampleRadios3">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id="exampleRadios4">
                                    <label class="form-check-label " for="exampleRadios4">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id="exampleRadios5">
                                    <label class="form-check-label " for="exampleRadios5">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id="exampleRadios6">
                                    <label class="form-check-label " for="exampleRadios6">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id="exampleRadios7">
                                    <label class="form-check-label " for="exampleRadios7">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check radio-css-concern align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id="exampleRadios8">
                                    <label class="form-check-label " for="exampleRadios8">
                                        condition
                                    </label>
                                </div>

                            </div>
                        </div>

                        <div class="form-group">

                            <label>Select facility<span class="required"></span></label>
                            <select class="form-control" name="facility" id="facility">
                                <option selected disabled value="">select facility</option>
                                <option value="33">facility 1</option>
                                <option value="34">facility 2</option>
                                <option value="35">facility 3</option>
                                <option value="36">facility 4</option>
                                <option value="37">facility 5</option>
                            </select>
                        </div>
                    </div>

                    <div class="size center bord">
                        <!--Calendar column-->
                        <div>
                            <div class = "left">Choose a date <span class="required"></span></div>
                            <div class="border disabled-element-target center" id="in-person-appointment-date" data-required_input="#facility"></div>
                            <input type="hidden" id="appointment-date" name="appointment-date">
                            <span class="disabled-element-error"></span>
                        </div>
                    </div>

                    <div class="d-flex flex-column  bord">
                        <!-- time slots column -->
                        <div class="form-group">
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
                                <h5>Choose a date to see available time slots</h5>
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

            <div class="form-group bord">
                <label>Describe your medical concern</label>
                <textarea id="medical-concern-description" class="form-control"></textarea>
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
                <div class="col-12 col-md-12 col-sm-12" style="text-align:center; margin-bottom: 50px;">Kindly confirm the details you entered to ensure they are correct.</div>

                <div class="d-flex flex-column flex-md-row">

                    <div class="input-group w-100 mr-1 pb-0" style="border:1px solid silver" id="confirm-appointment-patient">
                        <div class="title" style="margin-bottom:10px;">Patient Details</div>

                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Full name</span><br />
                            <span class="preview" id="name-preview"></span>
                        </div>
                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Gender</span><br>
                            <span class="preview" id="gender-preview"></span>
                        </div>
                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Date of birth</span><br>
                            <span class="preview" id="dob-preview"></span>
                        </div>

                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Email address</span><br>
                            <span class="preview" id="email-preview"></span>
                        </div>

                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Phone number</span><br>
                            <span class="preview" id="phone-preview"></span>
                        </div>


                    </div>
                    <div class="d-flex flex-column-reverse flex-md-row w-100 px-0 pb-0">
                        <div class="w-100 mx-0 mx-md-1 pb-2 pb-md-0" id="confirm-appointment-details">

                            <div class="title">Appointment Details</div>

                            <div class="col-12 col-md-12 col-sm-12">
                                <span>Type</span><br>
                                <span class="preview" id="type-preview">Speak To A Doctor Now</span>
                            </div>
                            <div class="col-12 px-1 px-md-3 col-sm-12">
                                <span class="preview" id="time-preview">Date </span><br><span class="preview" id="time-preview">Time</span>
                            </div>
                        </div>
                        <div class="d-flex flex-column w-100 mx-0 mx-md-1" id="confirm-appointment-cost">
                            <div class="title">Appointment Cost</div>
                            <div class="cost1 h-100 p-2">
                                <span>Total</span><br>
                                <span class="preview" id="type-preview">Ksh. 300</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    </form>

    <?php require "booking-form-javascript.php"; ?>
</body>

</html>