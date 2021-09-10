<?php
include('functions.php');
$logo = 'images/psi/mha-psi-logo.png';
$appointment_id = (isset($_GET['caseappid'])) ? $_GET['caseappid'] : '2364';
$result = mysqli_query($db, "SELECT wp_ea_fields.field_id, wp_ea_fields.value FROM wp_ea_fields WHERE app_id = '$appointment_id' AND field_id IN (2,7) ");
while ($row = mysqli_fetch_array($result)) {
    $field_id = $row['field_id'];
    if ($field_id == 2) {
        $patient_first_name = $row['value'];
    } elseif ($field_id == 7) {
        $patient_last_name = $row['value'];
    }
}
$onboarding = mysqli_fetch_assoc(mysqli_query($db, "SELECT onboarding FROM wp_ea_appointments WHERE id = '$appointment_id'"))['onboarding'];
?>
<!DOCTYPE html>
<html lang="en">
<!-- BEGIN HEAD -->
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta content="width=device-width, initial-scale=1" name="viewport" />
	<title>Waiting Room | My Health Africa </title>
	<!-- google font -->
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&amp;subset=all" rel="stylesheet" type="text/css" />
	<!-- icons -->
	<link href="css/font-awesome.min.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<!--bootstrap -->
	<link href="assets/bundles/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <!-- wizard -->
	<link href="assets/bundles/steps/steps.css" rel="stylesheet">
    <link href="css/responsive.css?v=<?php echo $inclusions_version ?>" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="assets/bundles/datetimepicker/jquery.datetimepicker.css"/>
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
                <input type="hidden" id="onboarding" value="0" />
                <div class="card">
                    <div class="card-body no-padding height-12">
                        <div class="row text-center m-t-10">
                            <div class="col-md-12">
                                <img src="<?php echo $logo ?>" class="img-responsive" alt="PSI" />
                            </div>
                            <div class="col-md-12 telemed-step-one" style="display: none;">
                                <?php require_once 'onboarding_form.php'; ?>
                            </div>
                            <div class="col-md-12 telemed-step-two" style="display: none;">
                                <h3>Please wait, a Tunza Clinic doctor will let you in soon.</h3>
                                <div class="waiting"><h5>Estimated waiting time <span class="waiting-time"><span id="countdown"></span><span>min</span></span></h5></div>
                                <div><h5 class="loading">Connecting you to the next available doctor<span class="one">.</span><span class="two">.</span><span class="three">.</span></h5></div>
                                <div><img class="round" width="120" height="120" avatar="<?php echo $patient_first_name.' '.$patient_last_name; ?>"> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end page content -->
        <?php require_once('requestCallBackModal.php'); ?>
    </div>
	<!-- start js include path -->
	<script src="assets/bundles/jquery/jquery.min.js"></script>
    <!-- bootstrap -->
	<script src="assets/bundles/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/bundles/datetimepicker/build/jquery.datetimepicker.full.js"></script>
    <!-- wizard -->
    <script src="assets/bundles/steps/jquery.steps.js"></script>
    <script src="assets/patient-waiting-room.js"></script>
    <script src="assets/patientAvatar.js"></script>
	<!-- end js include path -->
</body>

</html>