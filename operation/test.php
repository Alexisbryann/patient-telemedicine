<?php
require "include/DB_Functions.php";

$db = new DB_Functions();

print_r(
    $db->getAvailableTimeSlots(13, "in_person_service", date("Y-m-d"))
);
