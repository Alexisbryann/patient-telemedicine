<?php

/**
 * redirects patient to telemedicine virtual room
 */
require_once('connect.php');

$valcv = $_GET['slp'];

$roomprep = "SELECT wp_ea_appointments.id, wp_ea_appointments.created,wp_ea_appointments.price,wp_ea_appointments.telemed_status, wp_ea_appointments.location,wp_ea_appointments.status,wp_ea_appointments.user,wp_ea_appointments.worker FROM `wp_ea_appointments` WHERE wp_ea_appointments.id ='$valcv' ";
$result = mysqli_query($db, $roomprep) or die(mysqli_error($db));
$room_rows = mysqli_num_rows($result);
$appt_data = mysqli_fetch_array($result);

if ($appt_data['telemed_status'] == 'Paid' || $appt_data['price'] == '0.00' || $appt_data['telemed_status'] == 'Ongoing') {
    $URL = 'telemed/patient_videochartroom.php?case_signature=' . base64_encode($appt_data['created']) . '&session_drid=' . $appt_data['worker'] . '&Break=Y';
    echo '<META HTTP-EQUIV="refresh" content="1;URL=' . $URL . '">';
}
