<?php
include('functions.php');
$logo = 'images/psi/mha-psi-logo.png';
$appointment_id = (isset($_GET['caseappid'])) ? $_GET['caseappid'] : '';
if (!empty($appointment_id)) {
    $appointment_id = base64_decode($appointment_id);
    $result = mysqli_query($db, "SELECT wp_ea_fields.field_id, wp_ea_fields.value FROM wp_ea_fields WHERE app_id = '$appointment_id' AND field_id IN (2,7) ");
    while ($row = mysqli_fetch_array($result)) {
        $field_id = $row['field_id'];
        if ($field_id == 2) {
            $patient_first_name = $row['value'];
        } elseif ($field_id == 7) {
            $patient_last_name = $row['value'];
        }
    }
} else die(http_response_code(404));
?>
<!DOCTYPE html>
<html lang="en">
<!-- BEGIN HEAD -->
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta content="width=device-width, initial-scale=1" name="viewport" />
	<title>Telemedicine Setup | My Health Africa </title>
	<!-- google font -->
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&amp;subset=all" rel="stylesheet" type="text/css" />
	<!-- icons -->
	<link href="css/font-awesome.min.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<!--bootstrap -->
	<link href="assets/bundles/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
	<link href="css/telemedicine-setup.css" rel="stylesheet" type="text/css" />
    <link href="css/responsive.css?v=<?php echo $inclusions_version ?>" rel="stylesheet" type="text/css" />
	<!-- favicon -->
	<link rel="shortcut icon" href="images/my-health-africa.png" />
</head>
<!-- END HEAD -->
<body class="patient page-header-fixed sidemenu-closed-hidelogo page-content-white page-md header-white white-sidebar-color logo-indigo" style="zoom: 90%;">
    <div class="page-content">
        <div class="row">
            <div class="col-md-12">
                <input type="hidden" id="patient_first_name" value="<?php echo $patient_first_name; ?>" />
                <input type="hidden" id="appointment_id" value="<?php echo $appointment_id; ?>" />
                <div class="card">
                    <div class="card-body no-padding height-12">
                        <div class="row text-center m-t-10">
                            <div class="col-md-12">
                                <img src="<?php echo $logo ?>" class="img-responsive" alt="PSI" />
                            </div>
                            <div class="tab setup-1 col-md-12">
                                <h3>Telemedicine Consultation Set-up Guide</h3>
                                <p><span>Hello <?php echo $patient_first_name.' '.$patient_last_name; ?></span>, I am the MHA Tech Bot here to help you get set up for your online video consultation with Tunza clinic Daktari. I will guide you through some steps to ensure you are ready to go for your online consultation.</p>
                                <p><b>For the best user experience, we always recommend using Chrome browser.</b></p>
                                <div class="step-buttons">
                                    <button type="button" id="prevBtn" class="prevBtn">Previous</button>
                                    <button type="button" id="nextBtn" class="nextBtn">Get Started</button>
                                </div>
                            </div>
                            <div class="tab setup-2 col-md-12">
                                <h3>Please Allow Camera And Microphone</h3>
                                <p><span>Hey <?php echo $patient_first_name; ?></span> Tunza Clinic Telemedicine needs access to your camera and microphone so that other participants in the consultation room can see and hear you.</p>
                                <p>Please close any applications using your camera and microphone.</p>
                                <button id="allowPermissions" class="setup-button" onclick="start()">Allow Camera &amp; Microphone</button>
                                <div class="step-buttons">
                                    <button type="button" id="prevBtn" class="prevBtn">Previous</button>
                                    <button type="button" id="nextBtn" class="nextBtn permissions">I Have Allowed</button>
                                </div>
                            </div>
                            <div class="tab">
                                <h3>Testing If The Camera Works</h3>
                                <p class="test-vid"> <span>Hey <b><?php echo $patient_first_name; ?></b></span>, can you see yourself below?</p>
                                <div class="row col-sm-12 col-md-12 col-lg-12" style="align-items: center;">
                                    <div class="col-sm-12 col-md-5 col-lg-5">
                                        <video id="v" autoplay></video>
                                    </div>
                                    <div class="camera-tips col-sm-12 col-md-7 col-lg-7">
                                        <p style="text-align: left;font-size: 16px;"><i>Tip: If you can't see your preview and you have allowed microphone and camera;<br>
                                            - Ensure your camera is not covered by anything.<br>
                                            - Close any other application that could be using microphone and camera.<br>
                                            - Ensure your computer/phone or external camera is working fine.<br>
                                            - Make sure your drivers are up to date.<br>
                                            - If all of the above issues have been met, please restart your device or use a different device.</i></p>
                                    </div>
                                </div>
                                <div class="step-buttons">
                                    <button type="button" id="prevBtn" class="prevBtn">Previous</button>
                                    <button type="button" id="nextBtn" class="vidOff">I Can See Myself</button>
                                </div>
                            </div>
                            <div class="tab microphone-step">
                                <h3>Testing If The Microphone Works</h3>
                                <p><span>Hey <b><?php echo $patient_first_name; ?></b></span>, we will now be testing that your microphone works. When you speak into the microphone, can you see the bars moving?</p>
                                <div class="bar" id="volume-visualizer"></div>
                                <button id="testMic"> <i class="fa fa-microphone"></i> Start The Test</button>
                                <h5 id="test-result"></h5>
                                <p style="margin: 1em;"><i>Tip: if nothing happens, try changing your device or using another microphone. For example, if you are using your headphones, try removing the headphones & speak into the device. Or try using headphones if you are not using them.</i></p>
                                <div class="step-buttons">
                                    <button type="button" id="prevBtn" class="prevBtn">Previous</button>
                                    <button type="button" id="nextBtn" class="mic-bars mic nextBtn">I Can See The Bars Move</button>
                                </div>
                            </div>
                            <div class="tab speakers-step">
                                <h3>Testing If The Speakers Works</h3>
                                <p><span>Hey <b><?php echo $patient_first_name; ?></b></span>, play the media file below. Can you hear anything?</p>
                                <audio controls src="https://www.myhealthafrica.com/wp-content/uploads/2020/07/test-mic-1.mp3">
                                    Your browser does not support the <code>audio</code> element.
                                </audio>
                                <p><i>Tip: try increasing the volume or changing the speakers if you cannot hear anything. For example, if you are using headphones,
                                        try removing them to hear the device speakers instead or if you are using the device speakers, try using headphones.
                                        <br>Also Make sure you are not on mute. </i></p>
                                <div class="step-buttons">
                                    <button type="button" id="prevBtn" class="prevBtn">Previous</button>
                                    <button type="button" id="nextBtn" id="mute_all" class="nextBtn">I Can Hear A Sound</button>
                                </div>
                            </div>
                            <div class="tab internet-step">
                                <h3>Testing Your Internet Connection</h3>
                                <p><span>Hey <b><?php echo $patient_first_name; ?></b></span>, just one more to go. Please let's check on your internet speed.</p>
                                <button id="testInternet"></button>
                                <div id="test">
                                    <div class="testGroup">
                                        <div class="testArea">
                                            <div class="testName">Internet Speed</div>
                                            <div id="dlText" class="meterText"></div>
                                            <div class="unit">Mbps</div>
                                        </div>
                                        <div class="testArea">
                                            <div class="testName">Upload Speed</div>
                                            <div id="ulText" class="meterText"></div>
                                            <div class="unit">Mbps</div>
                                        </div>
                                    </div>
                                    <div id="ipArea">IP address: <span id="ip"></span></div>
                                </div>
                                <p style="margin-top:1em;"><i>Tip: If your internet speed is below 3Mbps and you are using WiFi, try turning on your 3G/4G.
                                        If you are using mobile data and it's not strong, try moving closer to a window or somewhere you can get stronger signal. You can also switch off the video during the consultation
                                        if you are on a low internet connectivity and only enable the video if you need to show the doctor something.</i></p>
                                <div class="finish step-buttons">
                                    <button type="button" id="prevBtn" class="prevBtn">Previous</button>
                                    <button type="button" id="finishSetup">Proceed To Waiting Room</button>
                                </div>
                            </div>
                            <!-- Step indicators -->
                            <div class="step-indicators">
                                <span class="step"></span>
                                <span class="step"></span>
                                <span class="step"></span>
                                <span class="step"></span>
                                <span class="step"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- end page content -->
        <?php require_once('permissionModal.php'); ?>
    </div>
	<!-- start js include path -->
	<script src="assets/bundles/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="speedtest/speedtest.js"></script>
	<!-- bootstrap -->
	<script src="assets/bundles/bootstrap/js/bootstrap.min.js"></script>
	<script src="assets/safari.js"></script>
    <script src="assets/microphone.js"></script>
    <script src="assets/patient-setup.js"></script>
    <script src="//cdn.jsdelivr.net/npm/eruda"></script>
    <script>eruda.init();</script>
	<!-- end js include path -->
</body>

</html>