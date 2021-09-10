<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once '../connect.php';
if (isset($_POST)) {
	$appointment_id = $_POST["id"];
	$response = [];
    $query = mysqli_query($db, "SELECT worker,telemed_status,user,created FROM wp_ea_appointments WHERE id = '$appointment_id'");
    $output = array();
    while ($row = mysqli_fetch_array($query)) {
        $output['doctor'] = $row['worker'];
        $output['status'] = $row['telemed_status'];
        $output['user'] = $row['user'];
        $output['date'] = $row['created'];
    }
    if (!empty($output)) {
        if ($output['user'] != '') {
            $patient = mysqli_query($db, "SELECT * FROM wp_ea_appointments WHERE user = '".$output['user']."' ");
            $count = mysqli_num_rows($patient); 
            if($output['status'] == 'Ongoing' && $count >= 1){
                $response['status'] = 200;
                $response['redirect_url'] = 'https://www.myhealthafrica.com/telemedicine/patient_videochartroom.php?case_signature='.base64_encode($output['date']).'&session_drid='.$output['doctor'].'Break=Y';
            } else {
                $response['status'] = 400;
            }
            echo json_encode($response);
        }
    }
} else {
	echo json_encode(100);
}

?>