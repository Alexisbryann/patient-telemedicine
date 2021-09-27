<?php
if (
    !isset($_POST["wave"])
    || !isset($_POST["appointment_id"])
) {
    die(json_encode(["error" => "missing request data", "error_code" => 1]));
}

require "include/DB_Functions.php";
$db = new DB_Functions();

die(json_encode($db->processFlutterwavePayment($_POST["appointment_id"], $_POST["wave"])));
