<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require "include/DB_Functions.php";

$db = new DB_Functions();

echo $db->sendBookingConfirmationEmailToPatient(
        'now', 
        '11222', 
        '09/10/2021', 
        '10:00 AM', 
        'seekitke@gmail.com', 
        'Bonface Otieno', 
        '0790047832', 
        'Male', 
        'Nairono'
        );