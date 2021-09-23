<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once '../connect.php';
if (isset($_POST)) {
	$appointment_id = str_replace(' ', '', $_POST['id']);
    $query = mysqli_query($db, "SELECT telemed_status FROM wp_ea_appointments WHERE id = '$appointment_id'");
    $response = array();
    while ($row = mysqli_fetch_array($query)) {
        if($row['telemed_status'] == 'Ongoing'){
            $response['status'] = 200;
            $response['redirect_url'] = 'https://www.myhealthafrica.com/psi/virtual-room/telemedicine-virtual-room.php?app_id='.urlencode(base64_encode($appointment_id)).'&user_type=pat';
        } else {
            $response['status'] = 400;
        }
    }
    echo json_encode($response);
}
?>