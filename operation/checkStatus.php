<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once '../connect.php';

date_default_timezone_set('Africa/Nairobi');
$current_time = date('Y-m-d G:i:s', time());

if (isset($_POST)) {
    $response = array();
	$appointment_id = str_replace(' ', '', $_POST['id']);
    $statement = mysqli_query($db, "UPDATE wp_ea_appointments SET current_session = '$current_time' WHERE id = '$appointment_id'");
    $status = mysqli_fetch_assoc(mysqli_query($db, "SELECT telemed_status FROM wp_ea_appointments WHERE id = '$appointment_id'"))['telemed_status'];
    if($status == 'Ongoing'){
        $response['status'] = 200;
        $response['redirect_url'] = 'https://www.myhealthafrica.com/psi/virtual-room/telemedicine-virtual-room.php?app_id='.urlencode(base64_encode($appointment_id)).'&user_type=pat';
    } else {
        $response['status'] = 400;
    }
    echo json_encode($response);
}
?>