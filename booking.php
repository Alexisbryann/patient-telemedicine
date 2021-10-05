<?php $inclusions_version = 0 ?>
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
    <link rel="stylesheet" type="text/css" href="assets/bundles/bootstrap-datepicker/css/bootstrap-datepicker.css" />
    <link href="css/booking.css?v=<?php echo $inclusions_version ?>" rel="stylesheet" type="text/css" />
    <!-- favicon -->
    <link rel="shortcut icon" href="images/my-health-africa.png" />
</head>
<!-- END HEAD -->

<body class="appt-booking page-header-fixed sidemenu-closed-hidelogo page-content-white page-md header-white white-sidebar-color logo-indigo">
    <?php require "booking-form-content.php";
    require "booking-form-javascript.php";
    ?>
    <!-- start js include path -->

</body>

</html>