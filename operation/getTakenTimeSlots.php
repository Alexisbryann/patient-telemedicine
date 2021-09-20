 <?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    date_default_timezone_set('Africa/Nairobi');
    $currentDate = date('Y-m-d', time());
    $currentTime = date('G:i:s', time());

    require_once 'include/DB_Functions.php';
    $db = new DB_Functions();

    if (empty($_REQUEST["operation"])) die(json_encode(["error" => "missing request data", "error_code" => 1]));

    $operation = $_REQUEST["operation"];

    if ($operation = "getTakenTimeSlots") {
        if (empty($_REQUEST["facility_id"]) || empty($_REQUEST["selected_date"])) die(json_encode(["error" => "missing request data", "error_code" => 1]));
        die(json_encode($db->getTakenTimeSlots($_REQUEST["facility_id"], $_REQUEST["selected_date"])));
    }
