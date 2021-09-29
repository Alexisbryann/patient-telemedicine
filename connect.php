<?php
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
// connect to database
// $db = mysqli_connect('localhost', 'myhealth_db', 'g0%kVgZgex6W', 'myhealth_database');
$db = mysqli_connect('localhost', 'root', '', 'myhealt1_database');
	
	// Check connection
if (!$db) {
  die("Connection failed: " . mysqli_connect_error());
}
?>