<?php
function saveChatUploads(array $file_uploads, $appointment_id)
{
    /**
     * validates and stores uploaded files to upload directory for the respective hospital
     * 
     * @param array $file_uploads files submitted through form
     * @param int $appointment_id hospital id
     * 
     * @return array array of paths for all stored files
     */

    $file_paths = array();
    $allowed = array('gif', 'png', 'jpg', 'jpeg', 'pdf', 'txt', 'doc', 'docx', "odt");
    $file_names = is_array($file_uploads["name"]) ? $file_uploads["name"] : [$file_uploads["name"]];
    $upload_errors = is_array($file_uploads["error"]) ? $file_uploads["error"] : [$file_uploads["error"]];
    $tmp_names = is_array($file_uploads["tmp_name"]) ? $file_uploads["tmp_name"] : [$file_uploads["tmp_name"]];

    if (!in_array(true, $file_names)) return $file_paths;

    if (in_array(true, $upload_errors)) return ["error" => "broken file", "error_code" => 3]; // stop execution if nay of the uploads is broken

    foreach ($file_names as $file_name) {
        $extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        if (!in_array($extension, $allowed)) return ["error" => "unsupported file extension $extension", "error_code" => 4]; // stop execution if there's a file with an unsupported extension
    }

    $uploads_path = "{$_SERVER['DOCUMENT_ROOT']}/uploads";

    if (!is_dir($uploads_path)) mkdir($uploads_path);

    if (!is_dir("$uploads_path/$appointment_id")) mkdir("$uploads_path/$appointment_id");

    $uploads_base = "$uploads_path/$appointment_id";

    foreach ($file_names as $index => $file_name) {
        $target_path = "$uploads_base/$file_name";
        move_uploaded_file($tmp_names[$index], $target_path);

        array_push($file_paths, substr($target_path, strlen("{$_SERVER['DOCUMENT_ROOT']}/")));
    }

    return $file_paths;
}

if (!(isset($_REQUEST["appointment_id"]) && isset($_REQUEST["operation"]) && isset($_REQUEST["user_type"]))) die(json_encode(["error" => "Request missing critical data", "error_code" => 2]));

$appointment_id = $_REQUEST["appointment_id"];
$operation = $_REQUEST["operation"];
$user_type = $_REQUEST["user_type"];

require "Chat.php";
$mha_chat = new MhaChat($appointment_id, $user_type);

switch ($operation) {
    case 'getChatMessages':
        $user_id = $_GET["user_id"];

        $response = $mha_chat->getChatMessages($user_id);
        break;
    case 'insertChatMessage':
        $user_type = $_POST["user_type"];
        $patient_id = $_POST["patient_id"];
        $doctor_id = $_POST["doctor_id"];
        $channel_id = "{$_POST['patient_id']}-{$_POST['doctor_id']}";
        $message = $_POST["message"];
        $files = $_FILES;

        $response = $mha_chat->saveNewMessage(
            $patient_id,
            $doctor_id,
            $channel_id,
            $appointment_id,
            $message,
            $files
        );
        break;
    case 'saveFileUploads':
        $file_paths = isset($_FILES["chat-files"]) ? saveChatUploads($_FILES["chat-files"], $appointment_id) : array();

        if (isset($file_paths["error"])) die(json_encode([$file_paths]));

        die(json_encode(["file_paths" => implode("#?#", $file_paths)]));
        break;
}

die(json_encode($response));
