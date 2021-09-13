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
    <section class="d-flex flex-column align-items-center ">
        <header>
            <h2>Form heading text</h2>
        </header>

        <span>Form sub-header</span>

        <div class="d-flex justify-content-center w-100 border">
            <div>
                <span><i>step icon</i></span>
                <span>Step title</span>
            </div>
            <span>Separator</span>
            <div>
                <span><i>step icon</i></span>
                <span>Step title</span>
            </div>
            <span>Separator</span>
            <div>
                <span><i>step icon</i></span>
                <span>Step title</span>
            </div>
        </div>
    </section>

    <form id="book-inperson">
        <h3></h3>
        <fieldset>
            <!--Appointment details step-->
            <div class="d-flex flex-column border">
                <span class="mx-auto">Step header</span>
                <div class="d-flex flex-column flex-md-row">
                    <!-- medical concern + date + time slots row -->
                    <div class="d-flex flex-column size bord">
                        <!--Medical concern and facility column-->
                        <div class="form-group size">
                            <span>Medical concern</span>

                            <div class="d-flex size">
                                <div class="form-check align-items-center ml-2">
                                   
                                    <label class="form-check-label radio-css" for="exampleRadios1">
                                        condition
                                        <input class="form-check-input d-none " type="radio" name="medical-concern" value="option1"  checked>
                                    </label>
                                </div>
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none " type="radio" name="medical-concern" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
                                        condition
                                    </label>
                                </div>
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="medical-concern" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
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
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="time-slot" id="exampleRadios1" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
                                        00:00
                                    </label>
                                </div>
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="time-slot" id="exampleRadios1" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
                                        00:00
                                    </label>
                                </div>
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="time-slot" id="exampleRadios1" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
                                        00:00
                                    </label>
                                </div>
                                <div class="form-check align-items-center ml-2">
                                    <input class="form-check-input d-none" type="radio" name="time-slot" id="exampleRadios1" value="option1" checked>
                                    <label class="form-check-label radio-css" for="exampleRadios1">
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
        </fieldset>
    </form>

    <?php require "booking-form-javascript.html"; ?>
</body>

</html>