<!DOCTYPE html>
<html lang="en">
<!-- BEGIN HEAD -->

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <title>Tunza Clinic Telemedicine | My Health Africa </title>
    <!-- google font -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&amp;subset=all" rel="stylesheet" type="text/css" />
    <!-- icons -->
    <link href="css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <!--bootstrap -->
    <link href="assets/bundles/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <!-- wizard -->
    <link href="assets/bundles/steps/steps.css" rel="stylesheet">
    <link href="css/responsive.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="assets/bundles/datetimepicker/jquery.datetimepicker.css" />
    <link href="css/telemedicine.css?v=1" rel="stylesheet" type="text/css" />
    <!-- favicon -->
    <link rel="shortcut icon" href="images/my-health-africa.png" />
</head>
<!-- END HEAD -->

<body class="appt-booking page-header-fixed sidemenu-closed-hidelogo page-content-white page-md header-white white-sidebar-color logo-indigo">
    <div class="page-content">
        <div class="row">
            <div class="col-md-12">
                <div class="booking-card">
                    <div class="fixed-top bg-white pb-2">
                        <div class="d-flex d-md-none w-100 justify-content-between align-items-center px-3">
                            <img src="images/psi/mha-psi-logo.png" id="mobile-page-logo">
                            <span id="mobile-page-close" title="Close">&#x2715;</span>
                        </div>

                        <div class="d-flex px-3 flex-column d-md-none" id="mobile-booking-progress-container">
                            <div class="d-flex justify-content-between">
                                <strong>Patient Details</strong>
                                <span>Step 1 of 3</span>
                            </div>
                            <progress class="w-100" max="3" value="1"></progress>
                        </div>
                    </div>
                    <div class="card-body no-padding height-12">
                        <div class="row text-center m-t-10 " style="border: solid 1px gray;">
                            <div class="col-md-12 telemed-step-one" style="display: none; padding:0px">
                                <?php require_once 'booking-form.php'; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end page content -->
    </div>
    <!-- start js include path -->
    <script src="assets/bundles/jquery/jquery.min.js"></script>
    <!-- bootstrap -->
    <script src="assets/bundles/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/bundles/datetimepicker/build/jquery.datetimepicker.full.js"></script>
    <!-- wizard -->
    <script src="assets/bundles/steps/jquery.steps.js"></script>
    <script src="assets/booking.js?v=0"></script>
    <script src="assets/patientAvatar.js"></script>
    <!-- end js include path -->
</body>

</html>