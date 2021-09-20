<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set('Africa/Nairobi');

require_once 'include/DB_Functions.php';
$db = new DB_Functions();
// json response array
$response = array("error" => FALSE);
$user = $db->psiNotificationReminders();
if ($user != false) {
    echo json_encode($user);
}

?>