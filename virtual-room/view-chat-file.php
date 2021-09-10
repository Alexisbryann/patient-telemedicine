<?php
if (empty($_REQUEST["file_name"]) || empty($_REQUEST["appointment_id"])) die("File not found");

$appointment_id = $_REQUEST["appointment_id"];
$file_name = $_REQUEST["file_name"];

$file_path = "{$_SERVER["DOCUMENT_ROOT"]}/uploads/$appointment_id/$file_name";

if (file_exists($file_path)) {
    header('Content-Description: File Transfer');
    header('Content-Type: ' . mime_content_type($file_path));
    header('Content-Disposition: inline; filename="' . $file_name . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file_path));
    readfile($file_path);
} else {
    die("File not found.");
}
