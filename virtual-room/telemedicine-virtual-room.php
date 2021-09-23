<?php
include('../../myonemedpro/functions.php');

$inclusions_version = 2;
function clean_str($string)
{
    $remove_single_ap = str_replace("'", "_", $string);
    $remove_single_bs = str_replace("/", "_", $remove_single_ap);
    $remove_single_fs = str_replace("\/", "_", $remove_single_bs);
    $remove_single_sp = str_replace(" ", "_", $remove_single_fs);
    $cleanstr = str_replace("*", "_", $remove_single_sp);
    return $cleanstr;
}

if (empty($_GET["user_type"]) || empty($_GET["app_id"])) die(http_response_code(404));

$user_type = ucfirst(strtolower($_GET["user_type"]));
$appointment_id = base64_decode($_GET["app_id"]);
$patient_id = mysqli_fetch_assoc(mysqli_query($db, "SELECT user FROM wp_ea_appointments WHERE id = $appointment_id"))["user"];
$patient_data_result = mysqli_query($db, "SELECT value, field_id FROM wp_ea_fields WHERE app_id = $appointment_id AND field_id IN (2, 7)");
$patient_first_name = $patient_last_name = "";

while ($patient_data = mysqli_fetch_assoc($patient_data_result)) {
    switch ($patient_data["field_id"]) {
        case 2:
            $patient_first_name = $patient_data["value"];
            break;
        case 7:
            $patient_last_name = $patient_data["value"];
            break;
    }
}

$patient_name = "{$patient_first_name} {$patient_last_name}";

switch ($user_type) {
    case 'Doc':
        if (!isset($_SESSION['doctorid'])) header('location: ../../myonemedpro/tunza-login.php'); // redirect to login page if session variables are missing

        $doctorId = $user = $_SESSION['doctorid']['id'];
        $doctor_name = $_SESSION["doctorid"]["name"];
        $chat_recipient = $patient_id;
        $chat_recipient_name = $patient_name;

        mysqli_query($db, "UPDATE wp_ea_appointments SET worker = $doctorId, telemed_status = 'Ongoing' WHERE id = $appointment_id"); // assign the appointment to current doctor and update status to ongoing
        // create chat connection record if it's first time having session for appointment
        $connection_records = mysqli_query($db, "SELECT * FROM chat_connections WHERE appointment_id = $appointment_id");
        if (mysqli_num_rows($connection_records) == 0) mysqli_query($db, "INSERT INTO chat_connections (`appointment_id`) VALUES ($appointment_id)");

        $video_room_name = "{$doctor_name} - {$appointment_id}";
        $room_participant_name = $doctor_name;
        break;
    case 'Pat':
        $appointment_data = mysqli_fetch_assoc(mysqli_query($db, "SELECT wp_ea_appointments.worker, wp_ea_appointments.user, wp_ea_staff.name FROM wp_ea_appointments, wp_ea_staff WHERE wp_ea_appointments.worker = wp_ea_staff.id AND wp_ea_appointments.id = $appointment_id"));

        $user = $appointment_data["user"];
        $chat_recipient = $appointment_data["worker"];
        $chat_recipient_name = $doctor_name = $appointment_data["name"];
        $video_room_name = "{$doctor_name} - {$appointment_id}";
        $room_participant_name = "{$patient_first_name} {$patient_last_name}";
        break;
    default:
        die(http_response_code(404));
        break;
}

?>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">

    <title>My Health Africa Telemedicine</title>
    <link rel="shortcut icon" type="image/x-icon" href="https://www.myhealthafrica.com/wp-content/uploads/2018/05/MyHealthAfrica_sd3-final-heart.png">
    <link rel="stylesheet" type="text/css" href="../../myonemedpro/css/font-awesome.min.css?v=<?php echo $inclusions_version ?>">
    <link rel="stylesheet" type="text/css" href="../../myonemedpro/assets/bundles/bootstrap/css/bootstrap.min.css?v=<?php echo $inclusions_version ?>">
    <link href="css/telemedicine.css?v=<?php echo $inclusions_version ?>" type="text/css" rel="stylesheet" />

    <script type="text/javascript" src="//code.jquery.com/jquery-1.11.3.min.js?v=<?php echo $inclusions_version ?>"></script>
    <script type="text/javascript" src="../../myonemedpro/assets/bundles/bootstrap/js/bootstrap.min.js?v=<?php echo $inclusions_version ?>"></script>
</head>


<body>
    <main id="main-container">
        <span id="virtual-room-logo-cntnr">
            <img src="../../myonemedpro/images/psi/mha-psi-tunza.png" id="virtual-room-logo" alt="My Health Africa - PSI - Tunza Clinics">
        </span>

        <div class="modal fade" id="leave-room-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header py-0">
                        <img src="../../myonemedpro/images/psi/mha-psi-tunza.png" alt="My Health Africa - PSI - Tunza Clinics">
                    </div>
                    <div class="modal-body">
                        <div class="text-center">
                            <div class="mb-3"><strong id="leave-room-text">Are you sure you want to end this call?</strong></div>
                            <div class="d-flex w-100 justify-content-around">
                                <span class="modal-button ml-auto mr-2 btn-danger btn stay">No</span>
                                <span class="modal-button mr-auto ml-2 btn-success btn leave">Yes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <span id="leave-room-btn" title="Leave Consultation" data-toggle="modal" data-target="#leave-room-modal">Leave Virtual Room</span>
        <!-- Telemedicine video room iframe -->
        <iframe id="telemed-iframe" src="https://video-app-9155-dev.twil.io?new_room_name=<?php echo $video_room_name ?>&new_patient_name=<?php echo $room_participant_name ?>&passcode=3574959155" allow="camera;microphone" loading="eager" title="My Health Africa telemedicine consultation virtual room" data-user_type="<?php echo $user_type ?>" data-appointment_id="<?php echo $appointment_id ?>" data-user_id="<?php echo $user ?>" data-recipient_id="<?php echo $chat_recipient ?>" data-chat_recipient_name="<?php echo $chat_recipient_name ?>"></iframe>

        <?php
        if ($user_type == "Doc") require_once("virtual-room-notes.html"); // only display case notes if user is a doctor
        require_once("virtual-room-chat.php");
        ?>

    </main>

    <script type="text/javascript" src="js/telemedicine.js?v=<?php echo $inclusions_version ?>"></script>
</body>

</html>