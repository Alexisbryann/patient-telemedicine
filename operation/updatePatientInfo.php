<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../connect.php';
// json response array
$response = array("error" => FALSE);
if (isset($_POST)) {
    $data = $_POST["chat"];
	$appointment_id = $_POST["appointment_id"];
	$medical_concern = implode(',', $data["medical-concern"]);
    if (isset($data['medical-condition-desc'])) {
        $medical_concern_desc = $data['medical-condition-desc']['value'];
    } else $medical_concern_desc = '';
    if (isset($data['medication'])) {
        $medication = $data["medication"]['value'];
    } else $medication = '';
    if (isset($data['allergies'])) {
        $allergies = $data["allergies"]['value'];
    } else $allergies ='';
    
    if(isset($_FILES['medical-reports']) && ((count($_FILES['medical-reports']['name']) == 1 && !empty($_FILES["medical-reports"]["name"][0])) || (count($_FILES["medical-reports"]["name"]) > 1))){
        $errors= array();$uploads = [];
        $extensions = array("jpeg","jpg","png","pdf","docx","doc","csv","xlsx");
        $countfiles = count($_FILES['medical-reports']['name']);
        for($i=0;$i<$countfiles;$i++){
            $file_type = $_FILES['medical-reports']['type'][$i];
            $file_size = $_FILES['medical-reports']['size'][$i];
            $filename = $_FILES['medical-reports']['name'][$i];
            $explode_file = explode('.', $filename);
            $file_ext = strtolower(end($explode_file));
            if(in_array($file_ext,$extensions) === false){
                $errors[] = "extension not allowed";
                echo 400;
                exit();
            }
            if($file_size > 2097152){
                $errors[]='File size too big';
                echo 405;
                exit();
            }
        }
        if(!empty($errors)){
            echo 404;
            exit();
        } else {
            for($i=0;$i<$countfiles;$i++){
                $filename = $_FILES['medical-reports']['name'][$i];
                move_uploaded_file($_FILES['medical-reports']['tmp_name'][$i], 'uploads/'.$filename);
                array_push($uploads, $filename);
            }
        }
    } else $uploads = '';

    $key_size = 32;
    $encryption_key = openssl_random_pseudo_bytes($key_size, $strong);
    $iv_size = 16;
    $iv = openssl_random_pseudo_bytes($iv_size, $strong);
    $ivBase64 = base64_encode($iv);
    $keyBase64 = base64_encode($encryption_key);

    $medical_concern = ($medical_concern) ? openssl_encrypt(pkcs7_pad($medical_concern, 16), 'AES-256-CBC', $encryption_key, 0, $iv) : '';
    $medical_concern = base64_encode($medical_concern);
    $medical_concern_desc = ($medical_concern_desc) ? openssl_encrypt(pkcs7_pad($medical_concern_desc, 16), 'AES-256-CBC', $encryption_key, 0, $iv) : '';
    $medical_concern_desc = base64_encode($medical_concern_desc);
    $medication = ($medication) ? openssl_encrypt(pkcs7_pad($medication, 16), 'AES-256-CBC', $encryption_key, 0, $iv) : '';
    $medication = base64_encode($medication);
    $allergies = ($allergies) ? openssl_encrypt(pkcs7_pad($allergies, 16), 'AES-256-CBC', $encryption_key, 0, $iv) : '';
    $allergies = base64_encode($allergies);

    $result = mysqli_query($db, "INSERT INTO case_notes (appointment_id, iv, enc_key, medical_concern, medical_concern_description, medication, allergies) VALUES ('$appointment_id', '$ivBase64', '$keyBase64', '$medical_concern', '$medical_concern_desc', '$medication', '$allergies')");
    $case_notes_id = mysqli_insert_id($db);
    if ($result) {
        if (!empty($uploads)) {
            foreach ($uploads as $file) {
                $file = openssl_encrypt(pkcs7_pad($file, 16), 'AES-256-CBC', $encryption_key, 0, $iv);
                $file = base64_encode($file);
                mysqli_query($db, "INSERT INTO case_notes_meta (note_id, meta_type, meta_value, iv, enc_key) VALUES ('$case_notes_id', 'file_attachments', '$file', '$ivBase64', '$keyBase64')");
            }
        }
        $sql = mysqli_query($db, "UPDATE wp_ea_appointments SET pat_roomstatus = 'waiting', onboarding = 1 WHERE id = '$appointment_id'");
        if ($sql) {
            echo 200;
        } else echo 500;
    }
} else {
	echo 100;
}

function pkcs7_pad($data, $size){
    $length = $size - strlen($data) % $size;
    return $data.str_repeat(chr($length), $length);
}

function pkcs7_unpad($data){
    return substr($data, 0, -ord($data[strlen($data) - 1]));
}

?>