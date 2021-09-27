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

    switch ($operation) {
        case 'getTakenTimeSlots':
            if (empty($_REQUEST["facility_id"]) || empty($_REQUEST["selected_date"])) die(json_encode(["error" => "missing request data", "error_code" => 1]));
            die(json_encode($db->getTakenTimeSlots($_REQUEST["facility_id"], $_REQUEST["selected_date"])));
            break;
        case 'getServiceDetails':
            if (empty($_REQUEST["facility_id"]) || empty($_REQUEST["selected_date"]) || empty($_REQUEST["appointment_type"])) die(json_encode(["error" => "missing request data", "error_code" => 1]));
            die(json_encode([
                "service_details" => $db->getServiceDetails($_REQUEST["facility_id"], $_REQUEST["appointment_type"]),
                "time_slots" => $db->getAvailableTimeSlots($_REQUEST["facility_id"], $_REQUEST["appointment_type"], implode("-", array_reverse(explode("/",$_REQUEST["selected_date"]))))
                // "time_slots" => ["08:00", "10:30", "19:00"]
            ]));
            break;
        default:
            # code...
            break;
    }
