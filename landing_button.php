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
    <link rel="stylesheet" type="text/css" href="assets/bundles/bootstrap-timepicker/css/bootstrap-timepicker.css" />
    <link rel="stylesheet" type="text/css" href="assets/bundles/bootstrap-timepicker/css/bootstrap-timepicker.css" />
    <link rel="stylesheet" type="text/css" href="assets/bundles/bootstrap-datepicker/css/bootstrap-datepicker.css" />
    <link href="css/booking.css?v=1" rel="stylesheet" type="text/css" />
    <!-- favicon -->
    <link rel="shortcut icon" href="images/my-health-africa.png" />

    <style>
        .booking-card .sticky-top {
            display: none;
        }

        #booking-form-content {
            overflow-x: hidden;
        }
    </style>
</head>

<body>
    <section class="container-fluid d-flex flex-column align-items-center justify-content-center bg-gray h-100 p-0">
        <div class="bg text-center">
            <h2><strong>Telemedicine Consultations At Tunza Clinics.</strong></h2>
            <p>Book a telemedicine consultation through Tunza Clinics</p>
        </div>
        <button class="l-btn button mb-0" data-toggle="collapse" data-target="#booking-form-content">
            <span>Book A Telemedicine Appointment </span>
            <i class="fa fa-chevron-down"></i>
        </button>

        <div id="booking-form-content" class="w-100 collapse">
            <?php
            require "booking-form-content.php";
            ?>
        </div>
    </section>

    <?php
    require "booking-form-javascript.html";
    ?>
</body>

</html>