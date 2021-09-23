<?php
include('functions.php');
$logo = 'images/psi/mha-psi-logo.png';
$appointment_id = (isset($_GET['caseappid'])) ? $_GET['caseappid'] : '';
if (!empty($appointment_id)) {
    $appointment_id = str_replace(' ', '', base64_decode($appointment_id));
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
} else die(http_response_code(404));
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
	<link href="assets/fonts/font-awesome.min.css" rel="stylesheet" type="text/css" />
	<!--bootstrap -->
	<link rel="stylesheet" href="assets/bundles/bootstrap/css/bootstrap.min.css">
    <link href="css/responsive.css?v=<?php echo $inclusions_version ?>" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="css/chat.css">
    <link href="css/patient-waiting room.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="assets/bundles/datetimepicker/jquery.datetimepicker.css"/>
	<!-- favicon -->
	<link rel="shortcut icon" href="images/my-health-africa.png" />
</head>
<!-- END HEAD -->
<body class="patient page-header-fixed sidemenu-closed-hidelogo page-content-white page-md header-white white-sidebar-color logo-indigo">
    <div class="page-content">
        <div class="row">
            <div class="col-md-12">
                <input type="hidden" id="appointment_id" value="<?php echo $appointment_id; ?>" />
                <input type="hidden" id="first_name" value="<?php echo $patient_first_name; ?>" />
                <input type="hidden" id="last_name" value="<?php echo $patient_last_name; ?>" />
                <input type="hidden" id="onboarding" value="<?php echo $onboarding; ?>" />
                <div class="card">
                    <div class="card-body no-padding height-12">
                        <div class="row text-center m-t-10">
                            <div class="logo col-md-12">
                                <img src="<?php echo $logo ?>" class="center img-responsive" alt="PSI" />
                            </div>
                            <div class="col-md-12 telemed-step-one">
                                <h3>Just one more thing...</h3>
                                <h5 class="loading">Before you get started, we would like to get some information from you to help your doctor with a comprehensive case review</h5>
                                <h5 class="loading">Would you like to proceed?</h5>
                                <div class="btn-proceed">
                                    <button id="no" class="button">No</button>
                                    <button id="yes" class="button">Yes</button>
                                </div>
                            </div>
                            <div class="row col-md-12 telemed-step-two" style="display: none;">
                                <div class="col-md-7">
                                    <div class="col-md-12" style="margin-bottom: 20px;">
                                        <img src="<?php echo $logo ?>" class="center img-responsive" alt="PSI" />
                                    </div>
                                    <div class="row chat-info col-md-12">
                                        <div class="col-md-10">
                                            <h3 class="col-md-12">Talk to Oktari, our chatbot</h3>
                                            <h5>We would like to get some information from you to help your doctor with a comprehensive case review.</h5>
                                        </div>
                                        <div class="col-md-2">
                                            <h3 class="col-md-12"><span style="color: #0080ff;font-size: 2em;">&#10230;</span></h3>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-5">
                                    <?php require_once 'oktarichat.php'; ?>
                                </div>
                            </div>
                            <div class="col-md-12 telemed-step-three" style="display: none;">
                                <h3>Please wait, a Tunza Clinic doctor will let you in soon.</h3>
                                <div class="waiting"><h5>Estimated waiting time <span class="waiting-time"><span id="countdown"></span><span>min</span></span></h5></div>
                                <div><h5 class="loading">Connecting you to the next available doctor<span class="one">.</span><span class="two">.</span><span class="three">.</span></h5></div>
                                <div style="display:none;"><img class="round" width="120" height="120" avatar="<?php echo $patient_first_name.' '.$patient_last_name; ?>"> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end page content -->
        <?php include 'requestCallBackModal.php'; ?>
    </div>
	<!-- start js include path -->
	<script src="assets/bundles/jquery/jquery.min.js"></script>
    <!-- bootstrap -->
	<script src="assets/bundles/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/bundles/datetimepicker/build/jquery.datetimepicker.full.js"></script>
    <script src="assets/patient-waiting-room.js"></script>
    <script type="text/javascript" src="assets/autosize.min.js"></script>
	<script type="text/javascript" src="assets/chat.js"></script>
	<script>
		jQuery(function($){
			convForm = $('#chat').convform({selectInputStyle: 'disable'});
		});
	</script>
    <script src="assets/patientAvatar.js"></script>
	<!-- end js include path -->
</body>

</html>