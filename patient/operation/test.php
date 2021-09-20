<?php
require "include/DB_Functions.php";

$db = new DB_Functions();

$name = "name";
$email = "email";
$gender = "gender";
$phone = "phone";
$dob = "dob";
$location = "location";
$date = date("Y-m-d");
$time = date("h:i:s");
$cost = "100";
$clinic = "clinic";

// $db->TunzaClinicTelemedicineAppointmentBooking($name, $email, $gender, $phone, $dob, $location, $date, $time, $cost, $clinic, "inperson", 33, "foobaring");

// echo date("Y-m-d", strtotime(str_replace("-", "/", "22/09/2021")));
echo implode("-", array_reverse(explode("/", "22/09/2021")));