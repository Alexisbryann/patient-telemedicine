<!DOCTYPE html>
<html lang="en">
<!-- BEGIN HEAD -->

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
    <link href="css/booking.css?v=0" rel="stylesheet" type="text/css" />
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
            <h2>Alternatively, Book An In-Person Appointment</h2>
        </header>

        <span>Please complete the steps below to book an in-person appointment.</span>
        
    </section>
                <div class="d-flex booking-step justify-content-center border-btm ">
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

    <form id="book-inperson" data-facility_id="<?php echo $_GET["facility_id"] ?? "" ?>" class = "border margin">
        <h3></h3>
        <fieldset>
            <!--Appointment details step-->
            <div class="d-flex flex-column">
               
                    <span class="mx-auto">Fill in the details to schedule the appointment.</span>
                    <div class="d-flex flex-column flex-md-row" style="border-top-width: 10px;margin-top: 20px;">
                        <!-- medical concern + date + time slots row -->
                        <div class="d-flex flex-column size bord">
                            <!--Medical concern and facility column-->
                            <div class="form-group size">
                                <span>Medical concern</span>

                                <div class="d-flex size">
                                <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios1" >
                                        <label class="form-check-label " for="exampleRadios1">
                                            condition
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios2" >
                                        <label class="form-check-label " for="exampleRadios2">
                                            condition
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios3" >
                                        <label class="form-check-label " for="exampleRadios3">
                                            condition
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios4" >
                                        <label class="form-check-label " for="exampleRadios4">
                                            condition
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios5" >
                                        <label class="form-check-label " for="exampleRadios5">
                                            condition
                                        </label>
                                    </div><div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios6" >
                                        <label class="form-check-label " for="exampleRadios6">
                                            condition
                                        </label>
                                    </div><div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios7" >
                                        <label class="form-check-label " for="exampleRadios7">
                                            condition
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios8" >
                                        <label class="form-check-label " for="exampleRadios8">
                                            condition
                                        </label>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Select facility</label>
                                <select class="form-control" name="facility" id="facility">
                                    <option>facility</option>
                                    <option>facility</option>
                                    <option>facility</option>
                                    <option>facility</option>
                                    <option>facility</option>
                                    <option>facility</option>
                                </select>
                            </div>
                        </div>

                        <div class = "size">
                            <!--Calendar column-->
                        
                            <div class = "border" id="in-person-appointment-date"></div>
                            <input type="hidden" id="appointment-date">
                        </div>

                        <div class="d-flex flex-column pad size">
                            <!-- time slots column -->

                            <div class="form-group">
                                <span>Choose an available time slot</span>

                                <div class="d-flex flex-wrap">
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios10" >
                                        <label class="form-check-label " for="exampleRadios10">
                                            00:00
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios11" >
                                        <label class="form-check-label " for="exampleRadios11">
                                            00:00
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios12" >
                                        <label class="form-check-label " for="exampleRadios12">
                                            00:00
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios13" >
                                        <label class="form-check-label " for="exampleRadios13">
                                            00:00
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios14" >
                                        <label class="form-check-label " for="exampleRadios14">
                                            00:00
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios15" >
                                        <label class="form-check-label " for="exampleRadios15">
                                            00:00
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios16" >
                                        <label class="form-check-label " for="exampleRadios16">
                                            00:00
                                        </label>
                                    </div>
                                    <div class="form-check radio-css align-items-center ml-2">
                                        <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" id = "exampleRadios17" >
                                        <label class="form-check-label " for="exampleRadios17">
                                            00:00
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex flex-column">
                                <span>Your appointment will be on</span>
                                <span><strong>text</strong>&nbsp;text&nbsp;<strong>text</strong>&nbsp;at&nbsp;<strong>text</strong></span>
                            </div>
                        </div>
                    </div>

                    <div class="form-group bord">
                        <label>Describe your medical concern</label>
                        <textarea id="medical-concern-description" class="form-control"></textarea>
                    </div>
                </div>
            </div>
        </fieldset>
        <h3></h3>
        <fieldset style="text-align:left;" id="patient-details-step-parent">
            <div class="row md-col" style="margin-left: 15px;margin-right: 15px;margin-bottom: 15px;">
                <div class="patient-details input-grp col-12 col-md-8" >
                    <div class="w-100 d-none d-md-flex" style="margin-bottom: 30px; margin-top: 30px; font-weight: bold;">Fill in the patient's details</div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Full name<span class="required"> * </span></label>
                        <input type="text" id="name" name="name" class="form-control" placeholder="Full name" required />
                        <div id="name-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Email address<span class="required"> * </span></label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="Email address" required />
                        <div id="email-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Gender<span class="required"> * </span></label>
                        <select id="gender" name="gender" class="form-control" required>
                            <option selected disabled value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <div id="gender-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Phone number<span class="required"> * </span></label>
                        <input type="text" id="phone" name="phone" class="form-control" placeholder="Phone number" required />
                        <div id="phone-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Date of birth<span class="required"> * </span></label>
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

    <?php require "booking-form-javascript.html"; ?>
</body>

</html>