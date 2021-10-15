<?php
// relay to handler in /myonemedpro
// ini_set("display_errors", 1);
// error_reporting(E_ALL);

require "{$_SERVER["DOCUMENT_ROOT"]}/myonemedpro/functions.php";
$_POST["doctorPostId"] = $_SESSION["doctorid"]["dr_post_id"];
require "{$_SERVER["DOCUMENT_ROOT"]}/myonemedpro/operation/sendDiagnosticForm.php";
