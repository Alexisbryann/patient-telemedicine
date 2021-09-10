<?php
$logo = 'images/psi/mha-psi-logo.png';
?>
<!DOCTYPE html>
<html lang="en">
<!-- BEGIN HEAD -->
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta content="width=device-width, initial-scale=1" name="viewport" />
	<title>Processing Payment | My Health Africa </title>
	<!-- google font -->
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&amp;subset=all" rel="stylesheet" type="text/css" />
	<!-- icons -->
	<link href="css/font-awesome.min.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<!--bootstrap -->
	<link href="assets/bundles/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="css/responsive.css?v=<?php echo $inclusions_version ?>" rel="stylesheet" type="text/css" />
    <link href="css/telemedicine.css" rel="stylesheet" type="text/css" />
	<!-- favicon -->
	<link rel="shortcut icon" href="images/my-health-africa.png" />
</head>
<!-- END HEAD -->
<body class="patient page-header-fixed sidemenu-closed-hidelogo page-content-white page-md header-white white-sidebar-color logo-indigo">
    <div class="page-content">
        <div class="row">
            <div class="col-md-12">
                <input type="hidden" id="appointment_id" value="<?php echo $appointment_id; ?>" />
                <input type="hidden" id="onboarding" value="<?php echo $onboarding; ?>" />
                <div class="payment card">
                    <div class="card-body no-padding height-12">
                        <div class="row text-center m-t-10">
                            <div class="col-md-12">
                                <img src="<?php echo $logo ?>" class="img-responsive" alt="PSI" />
                            </div>
                            <div class="col-md-12 payment-step-one">
                                <div class="loader-container"><p class="loader" style="margin: auto;"></p></div>
                                <h3>Processing Payment...</h3>
                                <div id="error" class="col-12 col-md-12 alert alert-danger" style="display: none;"></div>
                            </div>
                            <div class="col-md-12 payment-step-two" style="display: none;">
                                <div class="checkmark" style="margin: 20px;"></div>
                                <h4>Payment Is Successful</h4>
                                <p>We have sent payment confirmation to you via email and SMS. Please check and verify</p>
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
    <!-- wizard -->
    <script src="assets/verify-payment.js"></script>
	<!-- end js include path -->
</body>

</html>