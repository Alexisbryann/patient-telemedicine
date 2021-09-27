<?php
// php mailer
require_once $_SERVER['DOCUMENT_ROOT'] . '/patientexperience/operation/include/my_mail.php';
require_once('AfricasTalkingGateway.php');
date_default_timezone_set('Africa/Nairobi');
$current_date = date('Y-m-d', time());
$current_time = date('G:i:s', time());
$username = "myhealthafrica";
$api_key = "2a058bb5b78798effe6f25520b10f3fc518798e800b07d0e5afff887a3c766c4";
$gateway = new AfricasTalkingGateway($username, $api_key);
$GLOBALS = array(
    'gateway' => $gateway,
    'date_time' => $current_date.' '.$current_time,
    'date' => $current_date,
    'time' => $current_time,
    'timezone' => date_default_timezone_set('Africa/Nairobi'),
    'from' => 'Myhealthafr'
);



class DB_Functions {

    private $conn;
    public function __construct(){
        $this->conn = mysqli_connect('localhost', 'myhealth_db', 'g0%kVgZgex6W', 'myhealth_database');
        if (!$this->conn) {
            die("Connection failed: " . mysqli_connect_error());
          }

    }
    
    private $africastalking_username = "myhealthafrica";
    private $africastalking_api_key = "2a058bb5b78798effe6f25520b10f3fc518798e800b07d0e5afff887a3c766c4";
    private $africastalking_sender_name = "MyHealthAfr";
    
    private $facility_data =
    [
        127 => ["in_person_service" => 216, "location" => 145, "telemedicine_service" => 218],
        120 => ["in_person_service" => 195, "location" => 148, "telemedicine_service" => 209],
        126 => ["in_person_service" => 213, "location" => 156, "telemedicine_service" => 215],
        116 => ["in_person_service" => 187, "location" => 144, "telemedicine_service" => 200],
        121 => ["in_person_service" => 197, "location" => 149, "telemedicine_service" => 198],
        123 => ["in_person_service" => 203, "location" => 151, "telemedicine_service" => 205],
        119 => ["in_person_service" => 193, "location" => 147, "telemedicine_service" => 199],
        122 => ["in_person_service" => 201, "location" => 150, "telemedicine_service" => 202]
    ];
    
    private function logError(
        string $function_name, 
        array $params, 
        string $error_verbose,
        string $sql = "", 
        string $exception = ""
        ) {
        /**
         * Writes error message to .txt file.
         * 
         * @param $function_name name of function error occurred in
         * @param $params parameters during occurrence of error
         * @param $error_verbose detailed message describing what the error is
         * @param $sql sql statement that failed (if error is on a query)
         * @param $exception PHP generated exception, throwable or mysqli_error() message
         * 
         * @return void
         */

        $time = $GLOBALS['date_time'];
        $msg = "$error_verbose\n";
        $msg .= "Function: $function_name\n";
        $msg .= "Params: " . print_r($params, true) . "\n";
        if ($sql) $msg .= "SQL: $sql\n";
        if ($exception) $msg .= "$exception";

        $error_log = fopen("db_functions_error_log.txt", 'a');
        fwrite($error_log, "[$time]=>\t" . $msg . "\n\n");
        fclose($error_log);
    }

    public function TunzaClinicTelemedicineAppointmentBooking(
        $name, 
        $email,
        $gender,
        $phone,
        $dob,
        $location,
        $date,
        $time,
        $cost,
        $clinic,
        $appointment_type = "telemedicine",
        $facility_id = null,
        $medical_concern = null,
        $manual_booking = 0
        ) {
        $db = $this->conn;
        // $date = date('Y-m-d', $date);
        // $time = date('G:i:s', $time);

        if ($manual_booking) {
            $service_type = $appointment_type == "in-person" ? "in_person_service" : "telemedicine_service";
            $service_field = ", service";
            $service_value = ", '{$this->facility_data[$facility_id][$service_type]}'";
            $cost = $this->getServiceDetails($facility_id, $service_type)["price"];

            $worker_field = ", worker";
            $facility_id_field = ", facility_id";
            $worker_value = $facility_id_value = ", '$facility_id'";

            $med_on_demand = 0;
            
            try {
                // $new_user_id = register_new_user($name, $email);
                // if (!is_wp_error($new_user_id)) {


                //     add_user_meta($new_user_id, 'phone', $phone);
                //     add_user_meta($new_user_id, 'country', 'Kenya');
                //     add_user_meta($new_user_id, 'dob', $dob);
                // } else {
                //     throw new Exception("User account was not created.", 1);
                // }
                $user_id = $this->createPatientAccount($email, $name);
                $name_exploded = explode(" ", $name);
                $first_name = $name_exploded[0];
                $last_name = $name_exploded[1] ?? "";
                $this->saveUserMeta($first_name, $last_name, $email, $user_id);

                $user_id_field = ", user";
                $user_id_value = ", '$user_id'";
            } catch (\Throwable $e) {
                $this->logError(
                    __FUNCTION__,
                    func_get_args(),
                    "Failed to create new user account.",
                    "",
                    $e->getMessage()
                );
            }

            $location = $appointment_type == "inperson" ? $this->facility_data[$facility_id]['location'] : 130;
        } else {
            $med_on_demand = 1;
            $location = 130;
            $user_id_field = $user_id_value = $service_field = $service_value = $worker_field = $facility_id_field = $worker_value = $facility_id_value = "";
        }

        $query = "INSERT INTO wp_ea_appointments (wp_ea_appointments.location, wp_ea_appointments.date, wp_ea_appointments.start, end_date, wp_ea_appointments.status, created, price, med_on_demand, clinic " . trim("$user_id_field $worker_field $facility_id_field $service_field") . ")  VALUES ('$location', '$date', '$time', '$date', 'pending payment', '$date $time', '$cost', $med_on_demand, '$clinic' " . trim("$user_id_value $worker_value $facility_id_value $service_value") . ")";

        if ($appointment_type == "inperson") {
            $facility_details = mysqli_fetch_assoc(mysqli_query($db, "SELECT name, email, phone FROM wp_ea_staff WHERE id = $facility_id"));
            $service_details = mysqli_fetch_assoc(mysqli_query($db, "SELECT name, currency, price FROM wp_ea_services WHERE id = {$this->facility_data[$facility_id]['in_person_service']}"));
            $location_details = mysqli_fetch_assoc(mysqli_query($db, "SELECT name, street, district, city, address FROM wp_ea_locations WHERE id = {$this->facility_data[$facility_id]['location']}"));

            $weekday = date("l", strtotime($date));

            $facility_name = $facility_details["name"];
            $facility_email = $facility_details["email"];
            $facility_location = $location_details["name"];
            $facility_street = $location_details["street"];
            $facility_address = $location_details["address"];
            $facility_district = $location_details["district"];
            $facility_city = $location_details["city"];
            $facility_phone = $facility_details["phone"];
            $service_name = $service_details["name"];
            $service_currency = $service_details["currency"];
            $service_price = $service_details["price"];
            // try {
                $this->sendConfirmationMessages(
                    $name,
                    $email,
                    $phone,
                    $facility_name,
                    $facility_location,
                    $facility_address,
                    $facility_street,
                    $facility_district,
                    $facility_city,
                    "Kenya",
                    $facility_phone,
                    $service_name,
                    $service_currency,
                    $service_price,
                    $weekday,
                    $date,
                    $time,
                    $medical_concern,
                    $facility_email
                );
            // } catch (\Throwable $th) {
                // $this->logError(__FUNCTION__, func_get_args(), "Failed to send confirmation messages.", "", $e->getMessage());
            // }
        }
        
        $result = mysqli_query($db, $query) or die(mysqli_error($db));
        $appointment_id = mysqli_insert_id($db);

        $key_size = 32;
        $encryption_key = openssl_random_pseudo_bytes($key_size, $strong);
        $iv_size = 16;
        $iv = openssl_random_pseudo_bytes($iv_size, $strong);
        $ivBase64 = base64_encode($iv);
        $keyBase64 = base64_encode($encryption_key);

        $date_of_birth = openssl_encrypt($this->pkcs7_pad($dob, 16), 'AES-256-CBC', $encryption_key, 0, $iv);
        $date_of_birth = base64_encode($date_of_birth);
        $phone = openssl_encrypt($this->pkcs7_pad($phone, 16), 'AES-256-CBC', $encryption_key, 0, $iv);
        $phone = base64_encode($phone);

        if (!empty($result) && !empty($appointment_id)) {
            $fields = [1,2,7,8,15,16,20];
            $name = explode(' ', $name);
            $meta_values = [
                $email, 
                $name[0], 
                $name[1] ?? "", 
                $phone,
                $gender,
                $dob,
                $location
            ];
            $i = 0;
            foreach ($fields as $key => $field) {
                foreach ($meta_values as $meta_key => $value) {
                    if ($key === $meta_key) {
                        $meta_field = $field;
                        $field_value = $value;
                    }
                }
                if (in_array($field, [1, 2, 7, 15, 16, 20]) || $manual_booking) {
                    $enc_iv = ''; $enc_key = '';
                } else{
                    $enc_iv = $ivBase64; $enc_key = $keyBase64;
                }
                $query = "INSERT INTO wp_ea_fields (wp_ea_fields.app_id, wp_ea_fields.field_id, wp_ea_fields.value, iv, enc_key) VALUES ('$appointment_id', '$meta_field', '$field_value', '$enc_iv', '$enc_key') ";
                $statement = mysqli_query($db, $query) or die(mysqli_error($db));
                $i++;
            }
            if (!empty($statement)) {
                $response['response'] = 200;
                $response['id'] = $appointment_id;
                return $response;
            } else {
                $response['response'] = 500;
                return $response;
            }
        } else {
            $response['response'] = 500;
            return $response;
        }
        mysqli_close($db);
    }


    /**************************
    *************************** DIRECT PAY ONLINE  ********************************* 
                                                   **********************************/

    public function TunzaClinicTelemedicinePayment(
        $type,
        $appointment_id,
        $TransactionToken,
        $TransactionAmount,
        $TransactionRef,
        $ResultExplanation,
        $TransactionCurrency,
        $TransactionSettlementDate,
        $TransactionCreatedDate,
        $TransactionExpiryDate,
        $TransactionPaymentDate,
        $TransactionFinalCurrency,
        $TransactionNetAmount,
        $CustomerName,
        $CustomerPhone,
        $CustomerEmail,
        $CustomerCountry,
        $CustomerCity,
        $ServiceDescription,
        $ApprovalNumber,
        $CardType,
        $AccRef,
        $CustomerCredit,
        $CustomerCreditType,
        $FraudAlert,
        $FraudExplanation
        ) {
        $db = $this->conn;

        $sql = "INSERT INTO dpo_payments (appointment_id,TransactionToken,TransactionRef,CustomerName,CustomerPhone,CustomerEmail,CustomerCity,CustomerCountry,CustomerCredit,CustomerCreditType,TransactionCurrency,
                TransactionSettlementDate,TransactionFinalCurrency,TransactionNetAmount,AccRef,TransactionAmount,ResultExplanation,TransactionCreatedDate,TransactionExpiryDate,TransactionPaymentDate,
                CardType,ApprovalNumber, ServiceDescription,FraudAlert,FraudExplanation,payment_purpose,
                date_added) VALUES ('$appointment_id','$TransactionToken','$TransactionRef','$CustomerName','$CustomerPhone','$CustomerEmail','$CustomerCity', '$CustomerCountry', '$CustomerCredit',
                '$CustomerCreditType','$TransactionCurrency','$TransactionSettlementDate','$TransactionFinalCurrency','$TransactionNetAmount','$AccRef','$TransactionAmount','$ResultExplanation', '$TransactionCreatedDate',
                '$TransactionExpiryDate', '$TransactionPaymentDate', '$CardType', '$ApprovalNumber', '$ServiceDescription', '$FraudAlert','$FraudExplanation', 'tunza-telemedicine', NOW() )";
        $result = mysqli_query($db, $sql) or die(mysqli_error($db));
        if (!empty($result)) {
            $statement = mysqli_query($db, "UPDATE wp_ea_appointments SET status = 'pending', telemed_status = 'Paid', payment_status = 'Paid' WHERE id = '$appointment_id' ") or die(mysqli_error($db));
            if (!empty($statement)) {
                $patient = mysqli_query($db, "SELECT wp_ea_appointments.date, wp_ea_appointments.start, wp_ea_fields.field_id, wp_ea_fields.value, wp_ea_fields.iv, wp_ea_fields.enc_key FROM wp_ea_fields, wp_ea_appointments WHERE wp_ea_fields.app_id =  wp_ea_appointments.id AND wp_ea_appointments.id = '$appointment_id' ");
                while ($row = mysqli_fetch_array($patient)) {
                    $field_id = $row['field_id'];
                    $date = $row['date'];
                    $time = $row['start'];
                    $value = $row['value'];
                    $iv = $row['iv'];
                    $enc_key = $row['enc_key'];
                    if ($field_id == 1) {
                        $email = trim($value);
                    } 
                    if ($field_id == 2) {
                        $first_name = trim($value);
                    } 
                    if ($field_id == 7) {
                        $last_name = trim($value);
                    } 
                    if ($field_id == 8) {
                        if (!empty($iv) && !empty($enc_key) ) {
                            $encrypted_phone_no = base64_decode($value);
                            $iv = base64_decode($iv);
                            $key = base64_decode($enc_key);
                            $decrypted_phone_no = openssl_decrypt($encrypted_phone_no, 'AES-256-CBC', $key, 0, $iv);
                            $phone_no = $this->pkcs7_unpad($decrypted_phone_no);
                            $phone = trim($phone_no);
                        } else if (empty($iv) && empty($enc_key) ){
                            $phone = trim($value);
                        }
                    } 
                    if ($field_id == 15) {
                        $gender = trim($value);
                    } 
                    if ($field_id == 20) {
                        $location = trim($value);
                    }
                }
                if ($type == 'now') {
                    $email1 = $this->sendBookingConfirmationEmailToPatient($type, $appointment_id, $date, $time, $email, $first_name.' '.$last_name, $phone, $gender, $location);
                    //$email2 = $this->sendBookingConfirmationEmailToFacility($type, $appointment_id, $date, $time, $email, $first_name.' '.$last_name, $phone, $gender, $location);
                    $sms1 = $this->sendBookingSMSToPatient($type, $appointment_id, $first_name.' '.$last_name, $phone, $date, $time);
                    $paymentInvoice = $this->paymentInvoice('telemedicine',$first_name.' '.$last_name,$email,$TransactionAmount,$TransactionRef,$ResultExplanation,$TransactionPaymentDate,$CardType);
                    //$sms2 = $this->sendBookingSMSToFacility($type, $appointment_id, $first_name.' '.$last_name, $phone, $date, $time);
                } else if($type == 'schedule'){
                    $email1 = $this->sendBookingConfirmationEmailToPatient($type, $appointment_id, $date, $time, $email, $first_name.' '.$last_name, $phone, $gender, $location);
                    $sms1 = $this->sendBookingSMSToPatient($type, $appointment_id, $first_name.' '.$last_name, $phone, $date, $time);
                    $paymentInvoice = $this->paymentInvoice('telemedicine',$first_name.' '.$last_name,$email,$TransactionAmount,$TransactionRef,$ResultExplanation,$TransactionPaymentDate,$CardType);
                }
                ($email1 && $sms1) ? $response = 200 : $response = 500;
                return $response;
            } else {
                mysqli_close($db);
                $response = 500;
                return $response;
            }
        } else {
            mysqli_close($db);
            $response = 700;
            return $response;
        }
    }

    public function rescheduleTelemedicineAppointment($appointment_id, $date, $appointment_time){
        $db = $this->conn;
        $statement = mysqli_query($db, "UPDATE wp_ea_appointments SET wp_ea_appointments.date = '$date', wp_ea_appointments.start = '$appointment_time', end_date = '$date', wp_ea_appointments.pat_roomstatus = '' WHERE id = '$appointment_id' ");
        if ($statement) {
            $patient = mysqli_query($db, "SELECT wp_ea_fields.field_id, wp_ea_fields.value, wp_ea_fields.iv, wp_ea_fields.enc_key FROM wp_ea_fields WHERE wp_ea_fields.app_id = '$appointment_id' ");
            while ($row = mysqli_fetch_array($patient)) {
                $field_id = $row['field_id'];
                $value = $row['value'];
                $iv = $row['iv'];
                $enc_key = $row['enc_key'];
                if ($field_id == 1) {$email = trim($value);} 
                if ($field_id == 2) {$first_name = trim($value);} 
                if ($field_id == 7) {$last_name = trim($value);} 
                if ($field_id == 8) {
                    if (!empty($iv) && !empty($enc_key) ) {
                        $encrypted_phone_no = base64_decode($value);
                        $iv = base64_decode($iv);
                        $key = base64_decode($enc_key);
                        $decrypted_phone_no = openssl_decrypt($encrypted_phone_no, 'AES-256-CBC', $key, 0, $iv);
                        $phone_no = $this->pkcs7_unpad($decrypted_phone_no);
                        $phone = trim($phone_no);
                    } else if (empty($iv) && empty($enc_key) ){
                        $phone = trim($value);
                    }
                } 
                if ($field_id == 15) {$gender = trim($value);} 
                if ($field_id == 20) {$location = trim($value);}
            }
            $email = $this->sendRescheduleEmailToPatient($appointment_id, $date, $appointment_time, $email, $first_name.' '.$last_name, $phone, $gender, $location);
            $sms = $this->sendRescheduleSMSToPatient($appointment_id, $first_name.' '.$last_name, $phone, $date, $appointment_time);
            ($email && $sms) ? $response = 200 : $response = 500;
            return $response;
        }
    }
    
    public function psiNotificationReminders(){
        $db = $this->conn;
        $result = mysqli_query($db, "SELECT wp_ea_appointments.id, wp_ea_appointments.date, wp_ea_appointments.start, wp_ea_fields.field_id, wp_ea_fields.value, wp_ea_fields.iv, wp_ea_fields.enc_key FROM wp_ea_fields, wp_ea_appointments WHERE wp_ea_fields.app_id =  wp_ea_appointments.id AND wp_ea_appointments.clinic ='psi' AND wp_ea_appointments.appt_type = 'schedule' AND wp_ea_appointments.date <= ".$GLOBALS['date']." ");
        while ($row = mysqli_fetch_array($result)) {
            $appointment_id = $row['id'];
            $appointment_date = $row['date'].' '.$row['start'];
            $timeLapse = ($GLOBALS['date_time'] - $appointment_date);
            if ($timeLapse <= 15) {
                $field_id = $row['field_id'];
                $date = $row['date'];
                $time = $row['start'];
                $value = $row['value'];
                $iv = $row['iv'];
                $enc_key = $row['enc_key'];
                if ($field_id == 1) { $email = trim($value); } 
                if ($field_id == 2) { $first_name = trim($value); } 
                if ($field_id == 7) { $last_name = trim($value); } 
                if ($field_id == 8) {
                    if (!empty($iv) && !empty($enc_key) ) {
                        $encrypted_phone_no = base64_decode($value);
                        $iv = base64_decode($iv);
                        $key = base64_decode($enc_key);
                        $decrypted_phone_no = openssl_decrypt($encrypted_phone_no, 'AES-256-CBC', $key, 0, $iv);
                        $phone_no = $this->pkcs7_unpad($decrypted_phone_no);
                        $phone = trim($phone_no);
                    } else if (empty($iv) && empty($enc_key) ){
                        $phone = trim($value);
                    }
                } 
                if ($field_id == 15) { $gender = trim($value); } 
                if ($field_id == 20) { $location = trim($value); }
                $this->sendBookingConfirmationEmailToPatient('reminder', $appointment_id,$date,$time,$email,$first_name.' '.$last_name,$phone,$gender,$location);
                $this->sendBookingConfirmationEmailToFacility('now',$appointment_id,$date,$time,$email,$first_name.' '.$last_name,$phone,$gender,$location);
            }
        }
    }

    /**************************
    ****************************END DPO  *******************************/

    public function sendBookingConfirmationEmailToPatient(
        $type, 
        $appointment_id, 
        $date, 
        $time, 
        $email, 
        $name, 
        $phone, 
        $gender, 
        $location
        ) {
        $appointment_id = urlencode(base64_encode($appointment_id));
        $button = "<a href='https://myhealthafrica.com/psi/patient-setup.php?caseappid={$appointment_id}' target='_blank'><button class='button button4' style='border-radius: 12px;background-color: #28A745;border: none; color: white;
                padding: 13px;text-align: center;text-decoration: none;display: inline-block;
                font-size: 16px;margin: 4px 2px;cursor: pointer;color:white;'>Start Session</button></a>";
        $url = "<a href='https://myhealthafrica.com/psi/patient-setup.php?caseappid={$appointment_id}' target='_blank'>here</a>";

        $separator = md5(time());

        $eol = PHP_EOL;
        $emailFrom = 'My Health Africa<noreply@myhealthafrica.com>';
        $emailTo = $email;
        $headers = "From: ".$emailFrom.$eol;
        $headers .= "Reply-To: ".$emailFrom.$eol;
        $headers .= "MIME-Version: 1.0".$eol;
        $headers .= "Content-Type: multipart/mixed; boundary=\"".$separator."\"";

        if ($type == 'schedule') {
            $subject = 'Tunza Clinic: Scheduled Telemedicine Appointment Confirmed';
            $body_text = 'This email is to inform you that your telemedicine appointment with Tunza Clinics has been successfully scheduled for '.$date.' at '.$time.'. The doctor will be waiting for you.';
        } else if ($type == 'now') {
            $subject = 'Tunza Clinic: Telemedicine Appointment Request';
            $body_text = 'This email is to inform you that your telemedicine request has been successfully submitted to Tunza Clinics. The doctor is waiting for you.';
        } else if ($type == 'reminder') {
            $subject = 'Tunza Clinic: Telemedicine Appointment Reminder';
            $body_text = 'This email is to remind you that you have a telemedicine appointment with Tunza Clinic. The doctor will be waiting for you.';
        }

        $body = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>My Health Africa</title></head><body>" . $eol;
        $body .= "<body style='height: 100%; margin: 0; -webkit-text-size-adjust: none; font-family: Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; width: 100%;'>" . $eol;
        $body .=  '<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7;" bgcolor="#F4F4F7">' . $eol;
        $body .=  "<tr><td class='email-body' width='100%' cellpadding='0' cellspacing='0' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='#FFFFFF'>
                <table class='email-body_inner' cellpadding='0' cellspacing='0' role='presentation' style='margin: 0; padding: 0; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='FFFFFF'>
                    <tr>
                        <td class='content-cell' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 15px;'>
                            <div class='f-fallback'>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>Dear {$name},</p>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>{$body_text}</p>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>
                                Please click {$url} or the button below to start your telemedicine session with the doctor.
                                </p></br>
                                <p><div>{$button}</div></p>
                                <h5 style='margin-top: 0; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Appointment Details</h5>
                            </div>
                            <div class='f-fallback'>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Location:</b> Online Consultation </p>
                            </div>
                            <div class='f-fallback'>
                                <h5 style='margin-top: 20px; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Patient Details</h5>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Name:</b> {$name}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Gender:</b> {$gender}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Phone:</b> {$phone}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Email:</b> {$email}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Location:</b> {$location}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>For the best experience, kindly ensure you have a good stable internet connection and a device with a working microphone and camera.</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Thank you,</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Tunza Clinics Booking Team.</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Appointment services provided by <a href='https://myhealthafrica.com'>myhealthafrica.com</a></p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>" . $eol;
        $body .= $this->psi_email_footer().$eol;
        $body .= '</table>' . $eol;
        $body .= '</td>' . $eol;
        $body .= '</tr>' . $eol;
        $body .= '</table>' . $eol;
        $body .= "</body></html>.$eol";

        //Begin Icalendar invite
        $calendar_attachment = 'NewAppointment.ics';
        $start_date = $date.' '.$time.''.$GLOBALS['timezone'];
        $end_date = $date.' '.$time.''.$GLOBALS['timezone'];
        $event = array(
            'id' => 'General Practitioner',
            'title' => 'Tunza Clinic Telemedicine',
            'address' => 'Online Telemedicine',
            'description' => 'New appointment with Tunza Clinic doctor',
            'date_start' => strtotime($start_date),
            'date_end' => strtotime($end_date),
            'address' => 'Online Telemedicine'
        );

        // The Function
        function dateToCal($time){
            return gmdate('Ymd\This', $time).'Z';
        }

        // Build the ics file
        $ical = 'BEGIN:VCALENDAR'.PHP_EOL;
        $ical .= 'VERSION:2.0'.PHP_EOL;
        $ical .= 'PRODID:-//My Health Africa/Appointments//Booking Platform//EN'.PHP_EOL;
        $ical .= 'CALSCALE:GREGORIAN'.PHP_EOL;
        $ical .= 'BEGIN:VEVENT'.PHP_EOL;
        $ical .= 'DTSTART:'.dateToCal($event["date_start"]).''.PHP_EOL;
        $ical .= 'DTEND:'.dateToCal($event["date_end"]).''.PHP_EOL;
        $ical .= 'UID:'.md5($event["title"]) .''.PHP_EOL;
        $ical .= 'DTSTAMP:'.time().''.PHP_EOL;
        $ical .= 'LOCATION:'.addslashes($event['address']).''.PHP_EOL;
        $ical .= 'ORGANIZER;CN="Tunza Clinic":mailto:noreply@myhealthafrica.com'.PHP_EOL;
        $ical .= 'DESCRIPTION:'.addslashes($event['description']).''.PHP_EOL;
        $ical .= 'URL;VALUE=URI:http://myhealthafrica.com/events/'.$event['id'].''.PHP_EOL;
        $ical .= 'SUMMARY:'.addslashes($event['title']) . ''.PHP_EOL;
        $ical .= 'END:VEVENT'.PHP_EOL;
        $ical .= 'END:VCALENDAR';

        $mail = mailer();
        $mail->isHTML(true);
        $mail->Encoding = "base64";

        $mail->clearAddresses();
        $mail->clearAttachments();

        $mail->setFrom("noreply@myhealthafrica.com", "My Health Africa");
        $mail->addReplyTo("support@myhealthafrica.com", "My Health Africa");
        $mail->Subject = $subject;
        $mail->Body = $body;
        if ($type == 'schedule') {
            $mail->addStringAttachment($ical, $calendar_attachment, "base64", "text/calendar");
        }

        try {
            $mail->addAddress($emailTo);
            $mail->send();
            $send = true;
        } catch (Exception $e) {
            logMailerError($e);
            $send = false;
        }
        $mail->clearAddresses();
        return $send;
    }

    public function sendBookingConfirmationEmailToFacility(
        $type, 
        $appointment_id,
        $date, 
        $time,  
        $email, 
        $name, 
        $phone, 
        $gender, 
        $location
        ) {
        $appointment_id = urlencode(base64_encode($appointment_id));
        $button = "<a href='https://myhealthafrica.com/myonemedpro/my-waiting-room?appid={$appointment_id}' target='_blank'><button class='button button4' style='border-radius: 12px;background-color: #28A745;border: none; color: white;
                padding: 13px;text-align: center;text-decoration: none;display: inline-block;
                font-size: 16px;margin: 4px 2px;cursor: pointer;color:white;'>Start Session</button></a>";
        $url = "<a href='https://myhealthafrica.com/myonemedpro/my-waiting-room?appid={$appointment_id}' target='_blank'>here</a>";

        $separator = md5(time());
        $eol = PHP_EOL;
        $emailFrom = $name.'<'.$email.'>';
        $headers = "From: ".$emailFrom.$eol;
        $headers .= "Reply-To: ".$emailFrom.$eol;
        $headers .= "MIME-Version: 1.0".$eol;
        $headers .= "Content-Type: multipart/mixed; boundary=\"".$separator."\"";

        if ($type == 'schedule') {
            $subject = $name.': Scheduled Telemedicine Appointment Request';
            $body_text = 'This email is to inform you that your telemedicine appointment with '.$name.' has been successfully scheduled for '.$date.' at '.$time.'.';
            $body_text2 = '';
            $notice = '<b>Please Note:</b> If you need to reschedule the appointment for any reason, contact the patient first to agree on a new date and time.';
        } else if ($type == 'now') {
            $subject = $name.': Telemedicine Appointment Request';
            $body_text = 'This email is to inform you that you have a telemedicine appointment with '.$name;
            $body_text2 = 'The patient is waiting for you, please click '.$url.' or the button below to start your telemedicine session with the patient.';
            $notice = '';
        } else if ($type == 'reminder') {
            $subject = $name.': Telemedicine Appointment Reminder';
            $body_text = 'This email is to remind you that you have a telemedicine appointment with '.$name.'.';
            $body_text2 = '';
            $notice = '<b>Please Note:</b> If you need to reschedule the appointment for any reason, contact the patient first to agree on a new date and time.';
        }

        $body = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>My Health Africa</title></head><body>" . $eol;
        $body .= "<body style='height: 100%; margin: 0; -webkit-text-size-adjust: none; font-family: Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; width: 100%;'>" . $eol;
        $body .=  '<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7;" bgcolor="#F4F4F7">' . $eol;
        $body .=  "<tr><td class='email-body' width='100%' cellpadding='0' cellspacing='0' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='#FFFFFF'>
                <table class='email-body_inner' cellpadding='0' cellspacing='0' role='presentation' style='margin: 0; padding: 0; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='FFFFFF'>
                    <tr>
                        <td class='content-cell' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 15px;'>
                            <div class='f-fallback'>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>Dear Tunza Clinic,</p>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>{$body_text}</p>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>{$body_text2}</p>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>
                                Please click {$url} or the button below to start your telemedicine session with the doctor.
                                </p></br>
                                <p><div>{$button}</div></p>
                                <h5 style='margin-top: 0; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Appointment Details</h5>
                            </div>
                            <div class='f-fallback'>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Location:</b> Online Consultation </p>
                            </div>
                            <div class='f-fallback'>
                                <h5 style='margin-top: 20px; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Patient Details</h5>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Name:</b> {$name}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Gender:</b> {$gender}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Phone:</b> {$phone}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Email:</b> {$email}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Location:</b> {$location}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>{$notice}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Thank you,</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Tunza Clinics Booking Team.</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Appointment services provided by <a href='https://myhealthafrica.com'>myhealthafrica.com</a></p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>" . $eol;
        $body .= $this->psi_email_footer().$eol;
        $body .= '</table>' . $eol;
        $body .= '</td>' . $eol;
        $body .= '</tr>' . $eol;
        $body .= '</table>' . $eol;
        $body .= "</body></html>.$eol";

        //Begin Icalendar invite
        $calendar_attachment = 'NewAppointment.ics';
        $start_date = $date.' '.$time.''.$GLOBALS['timezone'];
        $end_date = $date.' '.$time.''.$GLOBALS['timezone'];
        $event = array(
            'id' => 'General Practitioner',
            'title' => 'Tunza Clinic Telemedicine',
            'address' => 'Online Telemedicine',
            'description' => 'New appointment with Tunza Clinic doctor',
            'date_start' => strtotime($start_date),
            'date_end' => strtotime($end_date),
            'address' => 'Online Telemedicine'
        );

        function dateToCalendar($time){
            return gmdate('Ymd\This', $time).'Z';
        }

        // Build the ics file
        $ical = 'BEGIN:VCALENDAR'.PHP_EOL;
        $ical .= 'VERSION:2.0'.PHP_EOL;
        $ical .= 'PRODID:-//My Health Africa/Appointments//Booking Platform//EN'.PHP_EOL;
        $ical .= 'CALSCALE:GREGORIAN'.PHP_EOL;
        $ical .= 'BEGIN:VEVENT'.PHP_EOL;
        $ical .= 'DTSTART:'.dateToCalendar($event["date_start"]).''.PHP_EOL;
        $ical .= 'DTEND:'.dateToCalendar($event["date_end"]).''.PHP_EOL;
        $ical .= 'UID:'.md5($event["title"]).''.PHP_EOL;
        $ical .= 'DTSTAMP:'.time().''.PHP_EOL;
        $ical .= 'LOCATION:'.addslashes($event['address']).''.PHP_EOL;
        $ical .= 'ORGANIZER;CN="Tunza Clinic":mailto:noreply@myhealthafrica.com'.PHP_EOL;
        $ical .= 'DESCRIPTION:'.addslashes($event['description']).''.PHP_EOL;
        $ical .= 'URL;VALUE=URI:http://myhealthafrica.com/events/'.$event['id'].''.PHP_EOL;
        $ical .= 'SUMMARY:'.addslashes($event['title']) . ''.PHP_EOL;
        $ical .= 'END:VEVENT'.PHP_EOL;
        $ical .= 'END:VCALENDAR';

        $mail = mailer();
        $mail->isHTML(true);
        $mail->Encoding = "base64";

        $mail->clearAddresses();
        $mail->clearAttachments();

        $mail->setFrom("support@myhealthafrica.com", "My Health Africa");
        $mail->addReplyTo("support@myhealthafrica.com", "My Health Africa");
        $mail->Subject = $subject;
        $mail->Body = $body;
        if ($type == 'schedule') {
            $mail->addStringAttachment($ical, $calendar_attachment, "base64", "text/calendar");
        }

        $facilities = [
            'Meditrust Heathcare Services',
            'Ukunda Medical Centre',
            'Zamzam Medical Services',
            'Watamu Hospitals',
            'Shepherds Hospitals',
            'Watamu Community Healthcare Ltd',
            'Wama Nursing Home',
            'Topcare Nursing Home',
        ];
        $facility_emails = [
            'meditrust2002@yahoo.com',
            'ukundamedicalcentre@gmail.com',
            'medicalzamzam@yahoo.com',
            'watamuhospitallimited@gmail.com',
            'info@shepherdsmedical.co.ke',
            '64ngoi@gmail.com',
            'wamanursinghome@gmail.com',
            'topcarenh@gmail.com',
        ];
        
        // foreach($facility_emails as $meta_key => $meta_value){
        //     foreach ($facilities as $key => $value) {
        //         if ($key == $meta_key) {
        //             $facility_email = $meta_value;
        //             $facility = $value;
        //         }
        //     }
        //     try {
        //         $mail->addAddress($facility_email, $facility);
        //         $mail->send();
        //         $send = true;
        //     } catch (Exception $e) {
        //         logMailerError($e);
        //         $send = false;
        //     }
        // }
        try {
            $mail->addAddress($email, $name);
            $mail->send();
            $send = true;
        } catch (Exception $e) {
            logMailerError($e);
            $send = false;
        }
        $mail->clearAddresses();
        return $send;
    }

    public function sendRescheduleEmailToPatient(
        $appointment_id, 
        $date, 
        $appointment_time, 
        $email, 
        $name, 
        $phone, 
        $gender, 
        $location
        ) {
        $appointment_id = urlencode(base64_encode($appointment_id));
        $button = "<a href='https://myhealthafrica.com/psi/patient-setup.php?caseappid={$appointment_id}' target='_blank'><button class='button button4' style='border-radius: 12px;background-color: #28A745;border: none; color: white;
                padding: 13px;text-align: center;text-decoration: none;display: inline-block;
                font-size: 16px;margin: 4px 2px;cursor: pointer;color:white;'>Start Session</button></a>";
        $url = "<a href='https://myhealthafrica.com/psi/patient-setup.php?caseappid={$appointment_id}' target='_blank'>here</a>";

        $separator = md5(time());

        $eol = PHP_EOL;
        $emailFrom = 'My Health Africa<noreply@myhealthafrica.com>';
        $emailTo = $email;
        $headers = "From: ".$emailFrom.$eol;
        $headers .= "Reply-To: ".$emailFrom.$eol;
        $headers .= "MIME-Version: 1.0".$eol;
        $headers .= "Content-Type: multipart/mixed; boundary=\"".$separator."\"";

        $subject = 'Tunza Clinic: Rescheduled Telemedicine Appointment';
        $body = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>My Health Africa</title></head><body>" . $eol;
        $body .= "<body style='height: 100%; margin: 0; -webkit-text-size-adjust: none; font-family: Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; width: 100%;'>" . $eol;
        $body .=  '<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7;" bgcolor="#F4F4F7">' . $eol;
        $body .=  "<tr><td class='email-body' width='100%' cellpadding='0' cellspacing='0' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='#FFFFFF'>
                <table class='email-body_inner' cellpadding='0' cellspacing='0' role='presentation' style='margin: 0; padding: 0; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='FFFFFF'>
                    <tr>
                        <td class='content-cell' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 15px;'>
                            <div class='f-fallback'>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>Dear {$name},</p>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>This email is to confirm changes to your appointment with Tunza clinics. Kindly review your new appointment details.</p>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>
                                Please click {$url} or the button below to start your telemedicine session with the doctor.
                                </p></br>
                                <p><div>{$button}</div></p>
                                <h5 style='margin-top: 0; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Appointment Details</h5>
                            </div>
                            <div class='f-fallback'>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Location:</b> Online Consultation </p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Appointment Date:</b> {$date} </p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Appointment Time:</b> {$appointment_time} </p>
                            </div>
                            <div class='f-fallback'>
                                <h5 style='margin-top: 20px; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Patient Details</h5>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Name:</b> {$name}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Gender:</b> {$gender}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Phone:</b> {$phone}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Email:</b> {$email}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Location:</b> {$location}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>For the best experience, kindly ensure you have a good stable internet connection and a device with a working microphone and camera.</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Thank you,</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Tunza Clinics Booking Team.</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Appointment services provided by <a href='https://myhealthafrica.com'>myhealthafrica.com</a></p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>" . $eol;
        $body .= $this->psi_email_footer().$eol;
        $body .= '</table>' . $eol;
        $body .= '</td>' . $eol;
        $body .= '</tr>' . $eol;
        $body .= '</table>' . $eol;
        $body .= "</body></html>.$eol";

        //Begin Icalendar invite
        $calendar_attachment = 'NewAppointment.ics';
        $start_date = $date.' '.$appointment_time.''.$GLOBALS['timezone'];
        $end_date = $date.' '.$appointment_time.''.$GLOBALS['timezone'];
        $event = array(
            'id' => 'General Practitioner',
            'title' => 'Tunza Clinic Telemedicine',
            'address' => 'Online Telemedicine',
            'description' => 'New appointment with Tunza Clinic doctor',
            'date_start' => strtotime($start_date),
            'date_end' => strtotime($end_date),
            'address' => 'Online Telemedicine'
        );

        // The Function
        function dateToCal($appointment_time){
            return gmdate('Ymd\This', $appointment_time).'Z';
        }

        // Build the ics file
        $ical = 'BEGIN:VCALENDAR'.PHP_EOL;
        $ical .= 'VERSION:2.0'.PHP_EOL;
        $ical .= 'PRODID:-//My Health Africa/Appointments//Booking Platform//EN'.PHP_EOL;
        $ical .= 'CALSCALE:GREGORIAN'.PHP_EOL;
        $ical .= 'BEGIN:VEVENT'.PHP_EOL;
        $ical .= 'DTSTART:'.dateToCal($event["date_start"]).''.PHP_EOL;
        $ical .= 'DTEND:'.dateToCal($event["date_end"]).''.PHP_EOL;
        $ical .= 'UID:'.md5($event["title"]) .''.PHP_EOL;
        $ical .= 'DTSTAMP:'.time().''.PHP_EOL;
        $ical .= 'LOCATION:'.addslashes($event['address']).''.PHP_EOL;
        $ical .= 'ORGANIZER;CN="Tunza Clinic":mailto:noreply@myhealthafrica.com'.PHP_EOL;
        $ical .= 'DESCRIPTION:'.addslashes($event['description']).''.PHP_EOL;
        $ical .= 'URL;VALUE=URI:http://myhealthafrica.com/events/'.$event['id'].''.PHP_EOL;
        $ical .= 'SUMMARY:'.addslashes($event['title']) . ''.PHP_EOL;
        $ical .= 'END:VEVENT'.PHP_EOL;
        $ical .= 'END:VCALENDAR';

        $mail = mailer();
        $mail->isHTML(true);
        $mail->Encoding = "base64";

        $mail->clearAddresses();
        $mail->clearAttachments();

        $mail->setFrom("noreply@myhealthafrica.com", "My Health Africa");
        $mail->addReplyTo("support@myhealthafrica.com", "My Health Africa");
        $mail->Subject = $subject;
        $mail->Body = $body;
        if ($type == 'schedule') {
            $mail->addStringAttachment($ical, $calendar_attachment, "base64", "text/calendar");
        }

        try {
            $mail->addAddress($emailTo);
            $mail->send();
            $send = true;
        } catch (Exception $e) {
            logMailerError($e);
            $send = false;
        }
        $mail->clearAddresses();
        return $send;
    }

    public function paymentInvoice(
        $service,
        $name, 
        $email,
        $TransactionAmount,
        $TransactionRef,
        $ResultExplanation,
        $TransactionPaymentDate,
        $CardType
        ) {
        
        $separator = md5(time());

        $eol = PHP_EOL;
        $emailFrom = 'My Health Africa<noreply@myhealthafrica.com>';
        $emailTo = $email;
        $headers = "From: ".$emailFrom.$eol;
        $headers .= "Reply-To: ".$emailFrom.$eol;
        $headers .= "MIME-Version: 1.0".$eol;
        $headers .= "Content-Type: multipart/mixed; boundary=\"".$separator."\"";

        if ($service == 'telemedicine') {
            $service = 'Tunza online consultation';
            $body_text = 'You have successfully paid for an online consultation appointment with Tunza clinic.';
        } else if ($service == 'in-person') {
            $service = 'Tunza in-person consultation';
            $body_text = 'You have successfully paid for an in-person consultation appointment with Tunza clinic.';
        } 
        $subject = 'Your Payment Was Successful!';

        $body = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>My Health Africa</title></head><body>" . $eol;
        $body .= "<body style='height: 100%; margin: 0; -webkit-text-size-adjust: none; font-family: Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; width: 100%;'>" . $eol;
        $body .=  '<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7;" bgcolor="#F4F4F7">' . $eol;
        $body .=  "<tr><td class='email-body' width='100%' cellpadding='0' cellspacing='0' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='#FFFFFF'>
                <table class='email-body_inner' cellpadding='0' cellspacing='0' role='presentation' style='margin: 0; padding: 0; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='FFFFFF'>
                    <tr>
                        <td class='content-cell' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 15px;'>
                            <div class='f-fallback'>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>Dear {$name},</p>
                                <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>{$body_text}</p>
                            </div>
                            <div class='f-fallback'>
                                <h5 style='margin-top: 20px; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Payment Details</h5>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Mode of payment:</b> {$CardType}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Paid amount:</b>Ksh. {$TransactionAmount}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Transaction date:</b> {$TransactionPaymentDate}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Transaction reference number:</b> {$TransactionRef}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Service:</b> {$service}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Thank you,</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Tunza Clinics Booking Team.</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Appointment services provided by <a href='https://myhealthafrica.com'>myhealthafrica.com</a></p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>" . $eol;
        $body .= $this->psi_email_footer().$eol;
        $body .= '</table>' . $eol;
        $body .= '</td>' . $eol;
        $body .= '</tr>' . $eol;
        $body .= '</table>' . $eol;
        $body .= "</body></html>.$eol";

        $mail = mailer();
        $mail->isHTML(true);
        $mail->Encoding = "base64";

        $mail->clearAddresses();
        $mail->clearAttachments();

        $mail->setFrom("noreply@myhealthafrica.com", "My Health Africa");
        $mail->addReplyTo("support@myhealthafrica.com", "My Health Africa");
        $mail->Subject = $subject;
        $mail->Body = $body;

        try {
            $mail->addAddress($emailTo);
            $mail->send();
            $send = true;
        } catch (Exception $e) {
            logMailerError($e);
            $send = false;
        }
        $mail->clearAddresses();
        return $send;
    }

    public function sendBookingSMSToPatient(
        $type, 
        $appointment_id, 
        $name, 
        $phone, 
        $date, 
        $time
        ) {
        $phone = str_replace(' ', '', $phone);
        $appointment_id = urlencode(base64_encode($appointment_id));
        $url = "https://myhealthafrica.com/psi/patient-setup.php?caseappid={$appointment_id}.";
        if ($type == 'schedule') {
            $message = 'Your telemedicine appointment with Tunza Clinic on '.$date.' '.$time.' is confirmed. Start your session on the scheduled date & time by clicking this url '.$url.' or check your email.';
        } else if ($type == 'now') {
            $message = 'Your appointment with a Tunza Clinic doctor now is confirmed. Start your telemedicine session by clicking this url '.$url.' or check your email.';
        } else if ($type == 'reminder') {
            $message = 'This is to remind you that you have a telemedicine appointment with Tunza Clinic on '.$date.' '.$time.'. Start your session on the scheduled date & time by clicking this url '.$url.' or check your email.';
        }
        try {
            $result = $GLOBALS['gateway']->sendMessage($phone, $message, $GLOBALS['from']);
        } catch (Exception $e) {
            echo "Error: ".$e->getMessage();
        }
        if ($result[0]->status == 'Success') {
            return true;
        } else return false;
    }

    public function sendRescheduleSMSToPatient(
        $appointment_id, 
        $name, 
        $phone, 
        $date, 
        $appointment_time
        ) {
        $phone = str_replace(' ', '', $phone);
        $appointment_id = urlencode(base64_encode($appointment_id));
        $url = "https://myhealthafrica.com/psi/patient-setup.php?caseappid={$appointment_id}.";
        $message = 'Your telemedicine appointment with Tunza clinic has been rescheduled to '.$date.' '.$appointment_time.'. Start your session on the scheduled date & time by clicking this URL '.$url.' or check your email.';
        try {
            $result = $GLOBALS['gateway']->sendMessage($phone, $message, $GLOBALS['from']);
        } catch (Exception $e) {
            echo "Error: ".$e->getMessage();
        }
        if ($result[0]->status == 'Success') {
            return true;
        } else return false;
    }

    public function sendBookingSMSToFacility(
        $type, 
        $appointment_id, 
        $name, 
        $phone, 
        $date, 
        $time
        ) {
        $appointment_id = urlencode(base64_encode($appointment_id));
        $facility_phones = [
            '+254720034709',
            '+254733820562',
            '+254722254433',
            '+254720838318',
            '+254722519169',
            '+254724713567',
            '+254722869026',
            '+254720855084',
        ];
        
        $url = "https://myhealthafrica.com/myonemedpro/my-waiting-room?appid={$appointment_id}.";
        if ($type == 'schedule') {
            $message = 'Your telemedicine appointment with '.$name.' on '.$date.' '.$time.' is confirmed. Start your session by clicking this url '.$url.'. Check your email/login to your account for details or to cancel/reschedule.';
        } else if ($type == 'now') {
            $message = 'Your appointment with '.$name.' now is confirmed. Start your telemedicine session by clicking this url '.$url.' or check your email.';
        } else if ($type == 'reminder') {
            $message = 'This is to remind you that you have a telemedicine appointment with '.$name.' on '.$date.' '.$time.' is confirmed. Start your session by clicking this url '.$url.'. Check your email/ login to your account for details or to cancel/reschedule.';
        }
        // foreach ($facility_phones as $phone) {
        //     try {
        //         $result = $GLOBALS['gateway']->sendMessage($phone, $message, $GLOBALS['from']);
        //     } catch (Exception $e) {
        //         echo "Error: ".$e->getMessage();
        //     }
        // }
        try {
            $result = $GLOBALS['gateway']->sendMessage($phone, $message, $GLOBALS['from']);
        } catch (Exception $e) {
            echo "Error: ".$e->getMessage();
        }
        if ($result[0]->status == 'Success') {
            return true;
        } else return false;
    }

    private function psi_email_footer() {
        /**
        * creates a email footer for telemedicine booking notifications
        * 
        * @param int $facility_id facility id of user sending the message
        * @param string $facility_name name of facility sending the message
        * @param string $recipient_email email address the message is being sent to
        * 
        * @return string html footer
        */
        return "<footer style='font-size: 7pt; width:100%; font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; padding:0px 0px;'>
                    <div style='text-align:center;background-color:#F5F5F5; font-size:7pt;' ><br>
                    <img src='https://www.myhealthafrica.com/psi/images/psi/mha-psi-logo.png' alt='PSI logo' width='100' height:'50' style='border: 0; width: 10rem;'><br>
                    <span>This email was sent to you through the My Health Africa Booking platform</span><br>
                    </div>
                    <div style='text-align:center;background-color:#dedede;margin-top:0px;'><br>
                    <span style='font-size:14px semibold;padding-top:60px' >Powered By</span><br>
                    <span style='font-size:14px bold;padding-bottom:60px;'><strong><a href='https://www.myhealthafrica.com/' style='text-decoration: none;color:rgb(0,0,0)'>My Health Africa | Africa's Leading Doctors Booking Platform</a></strong></span><br>
                    <span><span><br><br>
                    </div>
                </footer>";
    }

    /**
     * Encrypting doctor notes
     */
    public function pkcs7_pad($data, $size){
        $length = $size - strlen($data) % $size;
        return $data . str_repeat(chr($length), $length);
    }

    public function pkcs7_unpad($data){
        return substr($data, 0, -ord($data[strlen($data) - 1]));
    }
    
        private function createPatientAccount(
        string $user_email,
        string $user_name
    ) {
        /**
         * Creates an MHA account for the patient after booking an in-person appointment.
         * 
         * @param string $user_email user email address
         * @param string $user_name user name
         * 
         * @return false|int patient's user id if the account gets created successfully, false otherwise
         */

        $db = $this->conn;
        
        $get_user = mysqli_query($db, "SELECT ID FROM wp_users WHERE user_email = '$user_email'");
        if (mysqli_num_rows($get_user) > 0) return mysqli_fetch_assoc($get_user)["ID"];

        $user_registered = date("Y-m-d");

        $save_user_sql = "INSERT INTO `wp_users`(`user_login`, `user_email`, `user_registered`, `display_name`) VALUES ('$user_email','$user_email','$user_registered','$user_name')";

        mysqli_query($db, $save_user_sql);

        if (mysqli_error($db)) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to add new user.", $save_user_sql, mysqli_error($db));
            return ["error" => "Failed to add new user", "error_code" => 3];
        }

        $user_id = mysqli_insert_id($db);
        $user_name_split = explode(" ", $user_name);
        $first_name = $user_name_split[0];
        $last_name = $user_name_split[1] ?? "";

        $save_user_meta_error = $this->saveUserMeta($first_name, $last_name, $user_email, $user_id);

        if ($save_user_meta_error) return $save_user_meta_error;

        return $user_id;
    }

    private function saveUserMeta(
        string $first_name,
        string $last_name,
        string $billing_email,
        int $user_id
    ) {
        /**
         * Saves user metadata when creating a user account
         * 
         * @param string $first_name 
         * @param string $last_name 
         * @param string $billing_email 
         * @param int $user_id user id
         * 
         * @return boolean|array empty array if all metadata are inserted correctly, array with errors if there are any
         */

        $db = $this->conn;

        $save_user_meta_sql = "INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES
        ($user_id, 'first_name', '$first_name'),
        ($user_id, 'last_name', '$last_name'),
        ($user_id, 'billing_email', '$billing_email'),
        ($user_id, 'wp_capabilities', ' a:1:{s:10:\"subscriber\";b:1;} '),
        ($user_id, 'wp_user_level', 0)";

        mysqli_query($db, $save_user_meta_sql);

        if (mysqli_error($db)) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to save user metadata.", $save_user_meta_sql, mysqli_error($db));
            return ["error" => "Failed to store user metadata", "error_code" => 2];
        }

        return array();
    }

    
    private function patientConfirmationEmail(
        $patient_name,
        $patient_email,
        $facility_name,
        $facility_location,
        $facility_address,
        $facility_street,
        $facility_district,
        $facility_city,
        $facility_country,
        $facility_phone,
        $service_name,
        $service_currency,
        $service_price,
        $weekday,
        $appointment_date,
        $appointment_time,
        $medical_concern
    ) {
        $eol = PHP_EOL;
        $body = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>My Health Africa</title></head><body>" . $eol;

        $body .= "<body style='height: 100%; margin: 0; -webkit-text-size-adjust: none; font-family: Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; width: 100%;'>" . $eol;
        $body .=  '<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7;" bgcolor="#F4F4F7">' . $eol;
        $body .=  "<tr><td class='email-body' width='100%' cellpadding='0' cellspacing='0' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='#FFFFFF'>
                        <table class='email-body_inner' cellpadding='0' cellspacing='0' role='presentation' style='margin: 0 auto; padding: 0; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='FFFFFF'>
                          <tr>
                                <td class='content-cell' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 15px;'>
                                    <div class='f-fallback'>
                                    	<p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>Dear {$patient_name},</p>
                                        <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>This email is to inform you that your appointment with {$facility_name} has been confirmed.The Doctor will be waiting for you.</p>
                                        <h5 style='margin-top: 0; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Appointment Details</h5>
                                        
                                    </div>
                                    <div class='f-fallback'>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Location:</b> {$facility_location}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Details:</b> {$facility_address}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Address:</b> {$facility_street}{$facility_district}{$facility_city}{$facility_country}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Phone:</b> {$facility_phone}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Provider:</b> {$facility_name}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Service:</b> {$service_name}, {$service_currency} {$service_price}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Payment mode:</b> Cash</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>When:</b> {$weekday}, {$appointment_date} at {$appointment_time}</p>
                                        
                                    </div>
                                    <div class='f-fallback'>
                                        <h5 style='margin-top: 20px; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Patient Details</h5>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Name:</b> {$patient_name}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Notes:</b> {$medical_concern}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Please Note:</b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>1. The cost for your consultation is not inclusive of any tests or medication that the doctor may recommend.</b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>2. On arrival at the facility, kindly notify the staff that you booked through this platform to easily find your advanced booking. </b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>3. For first time visits, remember to carry any medical reports you have.</b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>4. Please arrive to the appointment destination 15 minutes before your appointment to register.</b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>5. Considering the busy schedules that doctors have, please ensure you reschedule your appointment at least 24 hours prior, to allow another patient to take your time slot. To reschedule your appointment, login to your <a href='https://myhealthafrica.com/patient-login'>patient account</a></b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Thank you,</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>My Health Africa Booking Team.</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Appointment services provided by <a href='https://myhealthafrica.com'>myhealthafrica.com</a></p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>" . $eol;
        $body .= '<tr><td align="center" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px;">
                            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0;">
                            <tr><td class="email-masthead" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 25px 0; text-align: center;" align="center">
                                <img src="https://www.myhealthafrica.com/wp-content/uploads/2018/08/MyHealthAfrica_sd3-final-300x113.png" alt="MyHealthAfrica logo" width="100" height:"50" style="border: 0; width: 10rem;"></td></tr>' . $eol;
        $body .= '</table>' . $eol;
        $body .= '</td>' . $eol;
        $body .= '</tr>' . $eol;
        $body .= '</table>' . $eol;
        $body .= "</body></html>.$eol";

        return $body;
    }

    private function patientConfirmationSMS(
        $facility_name,
        $weekday,
        $appointment_date,
        $appointment_time
    ) {
        return "Appointment confirmed with {$facility_name} on {$weekday}, {$appointment_date} at {$appointment_time}. Check your email/click https://www.myhealthafrica.com/patient-login to login to your account for details or cancel/reschedule.";
    }

    private function facilityConfirmationEmail(
        $patient_name,
        $patient_email,
        $patient_phone,
        $facility_name,
        $facility_location,
        $facility_address,
        $facility_street,
        $facility_district,
        $facility_city,
        $facility_country,
        $facility_phone,
        $service_name,
        $service_currency,
        $service_price,
        $weekday,
        $appointment_date,
        $appointment_time,
        $medical_concern
    ) {
        $eol = PHP_EOL;
        $body = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>My Health Africa</title></head><body>" . $eol;

        $body .= "<body style='height: 100%; margin: 0; -webkit-text-size-adjust: none; font-family: Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; width: 100%;'>" . $eol;
        $body .=  '<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7;" bgcolor="#F4F4F7">' . $eol;
        $body .=  "<tr><td class='email-body' width='100%' cellpadding='0' cellspacing='0' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='#FFFFFF'>
                        <table class='email-body_inner' cellpadding='0' cellspacing='0' role='presentation' style='margin: 0 auto; padding: 0; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='FFFFFF'>
                          <tr>
                                <td class='content-cell' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 15px;'>
                                    <div class='f-fallback'>
                                    	<p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>Dear {$facility_name},</p>
                                        <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>This email is to inform you that your appointment with {$patient_name} has been confirmed.</p>
                                        <h5 style='margin-top: 0; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Appointment Details</h5>
                                        
                                    </div>
                                    <div class='f-fallback'>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Location:</b> {$facility_location}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Details:</b> {$facility_address}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Address:</b> {$facility_street}{$facility_district}{$facility_city}{$facility_country}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Phone:</b> {$facility_phone}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Provider:</b> {$facility_name}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Service:</b> {$service_name}, {$service_currency} {$service_price}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Payment mode:</b> Cash</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>When:</b> {$weekday}, {$appointment_date} at {$appointment_time}</p>
                                        
                                    </div>
                                    <div class='f-fallback'>
                                        <h5 style='margin-top: 20px; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Patient Details</h5>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Name:</b> {$patient_name}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Phone:</b> {$patient_phone}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Email:</b> {$patient_phone}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Notes:</b> {$medical_concern}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Please Note:</b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>If you need to reschedule the appointment for any reason, please login into your MHA account <a href='https://www.myhealthafrica.com/doctor-clinic-login'>here</a> and find the appointment under Upcoming Appointments. Set the appointment to rescheduled and load available dates and times. Please contact the patient first to agree on a new date and time and click save to reschedule. </b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Please also note:</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>1. We have informed the patient that the cost for the consultation is not inclusive of any tests or medication that the doctor may recommend.</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>2. For first time visits, we have informed the patient to carry any medical reports they have.</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>3. We have asked the patient to arrive at least 15 minutes before their appointment to register.</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Thank you,</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>My Health Africa Booking Team.</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Appointment services provided by <a href='https://myhealthafrica.com'>myhealthafrica.com</a></p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>" . $eol;
        $body .= '<tr><td align="center" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px;">
                            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0;">
                            <tr><td class="email-masthead" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 25px 0; text-align: center;" align="center">
                                <img src="https://www.myhealthafrica.com/wp-content/uploads/2018/08/MyHealthAfrica_sd3-final-300x113.png" alt="MyHealthAfrica logo" width="100" height:"50" style="border: 0; width: 10rem;"></td></tr>' . $eol;
        $body .= '</table>' . $eol;
        $body .= '</td>' . $eol;
        $body .= '</tr>' . $eol;
        $body .= '</table>' . $eol;
        $body .= "</body></html>.$eol";

        return $body;
    }

    private function facilityConfirmationSMS(
        $patient_name,
        $weekday,
        $appointment_date,
        $appointment_time
    ) {
        return "Appointment confirmed with {$patient_name} on {$weekday}, {$appointment_date} at {$appointment_time}. Check your email or click https://www.myhealthafrica.com/doctor-clinic-login/ to login to your account for details or cancel/reschedule.";
    }

    private function sendConfirmationMessages(
        $patient_name,
        $patient_email,
        $patient_phone,
        $facility_name,
        $facility_location,
        $facility_address,
        $facility_street,
        $facility_district,
        $facility_city,
        $facility_country,
        $facility_phone,
        $service_name,
        $service_currency,
        $service_price,
        $weekday,
        $appointment_date,
        $appointment_time,
        $medical_concern,
        $facility_email
    ) {
        $event = array(
            'id' => $service_name,
            'title' => "New Appointment",
            'address' => $facility_location,
            'description' => 'New appointment via My Health Africa',
            'datestart' => strtotime($appointment_date),
            'dateend' => strtotime($appointment_date),
            'address' => $facility_address . ' ' . $facility_street
        );

        $ical = 'BEGIN:VCALENDAR' . PHP_EOL;
        $ical .= 'VERSION:2.0' . PHP_EOL;
        $ical .= 'PRODID:-//My Health Africa/Appointments//Booking Platform//EN' . PHP_EOL;
        $ical .= 'CALSCALE:GREGORIAN' . PHP_EOL;
        $ical .= 'BEGIN:VEVENT' . PHP_EOL;
        $ical .= 'DTSTART:' . $this -> dateToCal($event["datestart"]) . '' . PHP_EOL;
        $ical .= 'DTEND:' . $this -> dateToCal($event["dateend"]) . '' . PHP_EOL;
        $ical .= 'UID:' . md5($event["title"]) . '' . PHP_EOL;
        $ical .= 'DTSTAMP:' . time() . '' . PHP_EOL;
        $ical .= 'LOCATION:' . addslashes($event['address']) . '' . PHP_EOL;
        $ical .= 'ORGANIZER;CN="My Health Africa":mailto:noreply@myhealthafrica.com' . PHP_EOL;
        $ical .= 'DESCRIPTION:' . addslashes($event['description']) . '' . PHP_EOL;
        $ical .= 'URL;VALUE=URI:http://myhealthafrica.com/events/' . $event['id'] . '' . PHP_EOL;
        $ical .= 'SUMMARY:' . addslashes($event['title']) . '' . PHP_EOL;
        $ical .= 'END:VEVENT' . PHP_EOL;
        $ical .= 'END:VCALENDAR';

        $ical_name = "New Appointment.ics";

        $mail = mailer();
        $mail->isHTML();
        $mail->setFrom("noreply@myhealthafrica.com", "My Health Africa");
        $mail->addReplyTo("support@myhealthafrica.com", "My Health Africa Support");
        // doctor email notification
        $mail->Subject = "Your appointment with {$patient_name} is confirmed.";
        // $mail->Body = $this->facilityConfirmationEmail(
        //     $patient_name,
        //     $patient_email,
        //     $patient_phone,
        //     $facility_name,
        //     $facility_location,
        //     $facility_address,
        //     $facility_street,
        //     $facility_district,
        //     $facility_city,
        //     $facility_country,
        //     $facility_phone,
        //     $service_name,
        //     $service_currency,
        //     $service_price,
        //     $weekday,
        //     $appointment_date,
        //     $appointment_time,
        //     $medical_concern
        // );

        try {
            $mail->addAddress($facility_email, $facility_name);
            $mail->addStringAttachment($ical, $ical_name, "base64", "text/calendar");
            $mail->send();
            $mail->clearAddresses();
        } catch (\Throwable $e) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to send confirmation email message to doctor.", "", $e->getMessage());
        }
        
        $mail->setFrom("noreply@myhealthafrica.com", "My Health Africa");
        $mail->addReplyTo("support@myhealthafrica.com", "My Health Africa Support");

        $mail->Subject = "Your appointment with $facility_name is confirmed";
        $mail->Body = $this->patientConfirmationEmail(
            $patient_name,
            $patient_email,
            $facility_name,
            $facility_location,
            $facility_address,
            $facility_street,
            $facility_district,
            $facility_city,
            $facility_country,
            $facility_phone,
            $service_name,
            $service_currency,
            $service_price,
            $weekday,
            $appointment_date,
            $appointment_time,
            $medical_concern
        );

        try {
            $mail->addAddress($facility_email, $facility_name);
            $mail->addStringAttachment($ical, $ical_name, "base64", "text/calendar");
            $mail->send();
            $mail->clearAddresses();
        } catch (\Throwable $e) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to send confirmation email message to patient.", "", $e->getMessage());
        }

        $username = "myhealthafrica";
        $api_key = "2a058bb5b78798effe6f25520b10f3fc518798e800b07d0e5afff887a3c766c4";
        $gateway = new AfricasTalkingGateway($username, $api_key);
        $sender_name = 'Myhealthafr';

        try {
            $gateway->sendMessage(
                $patient_phone,
                $this->patientConfirmationSMS($facility_name, $weekday, $appointment_date, $appointment_time),
                $sender_name
            );
        } catch (AfricasTalkingGatewayException $e) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to send patient confirmation SMS.", "", $e->getMessage());
        }

        try {
            $gateway->sendMessage(
                $patient_phone,
                // $this->facilityConfirmationSMS($patient_name, $weekday, $appointment_date, $appointment_time),
                $sender_name
            );
        } catch (AfricasTalkingGatewayException $e) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to send facility confirmation SMS.", "", $e->getMessage());
        }
    }

    public function getTakenTimeSlots(
        int $facility_id,
        string $selected_date
    ) {
        /**
         * Get taken time slots for a clinic on a particular day
         * 
         * @param int $facility_id facility id
         * @param string $selected_date selected date
         * 
         * @return string[] list of selected time slots for the given day
         */

        $db = $this->conn;

        $selected_date = date("Y-m-d", strtotime($selected_date));

        $appointment_times_sql = "SELECT start FROM wp_ea_appointments WHERE date = '$selected_date' AND facility_id = '$facility_id' AND location != 130";


        $appointment_times_result = mysqli_query($db, $appointment_times_sql);

        if (mysqli_error($db)) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to get facility time slots.", $appointment_times_sql, mysqli_error($db));
            return ["error" => true, "error_code" => 0];
        }

        $response = array();
        while ($appointment_time = mysqli_fetch_assoc($appointment_times_result)) {
            $start_time = substr($appointment_time["start"], 0, strlen($appointment_time["start"]) - 3);
            array_push($response, $start_time);
        }

        return $response;
    }
    
    private function dateToCal($time)
    {
        return gmdate('Ymd\This', $time) . 'Z';
    }
    
     public function getServiceDetails(
        int $facility_id,
        string $service_type
    ) {
        /**
         * Gets the cost and currency of a service
         * 
         * @param int $facility_id facility id
         * @param string $service_type service type, either telemedicine or in person
         * 
         * @return array Array of data for the input facility's selected service, or containing error message
         */

        $db = $this->conn;

        $service_id = $this->facility_data[$facility_id][$service_type];
        $service_data_sql = "SELECT id, facility_id, price, currency, slot_step FROM wp_ea_services WHERE id = $service_id";

        $service_data_res = mysqli_query($db, $service_data_sql);

        if (mysqli_error($db)) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to fetch service data for facility_id: $facility_id.", $service_data_sql, mysqli_error($db));
            return ["error" => "Failed to fetch service data", "error_code" => 4];
        }

        return mysqli_fetch_assoc($service_data_res);
    }

    public function getAvailableTimeSlots(
        int $facility_id,
        string $service_type,
        string $selected_date
    ) {
        /**
         * Fetches the available time slots for a selected service
         * 
         * @param int $facility_id facility id
         * @param string $service_type service type
         * @param string $selected_date selected date
         * 
         * @return array array of available time slots or error message
         */

        $db = $this->conn;
        $service_details = $this->getServiceDetails($facility_id, $service_type);
        $serviceId = $service_details["id"];
        $doctorId = $service_details["facility_id"];
        date_default_timezone_set('Africa/Nairobi');
        $selected_date = implode("-", array_reverse(explode("/", $selected_date)));
        $dayOfWeek = date("l", strtotime($selected_date));

        $output = array();
        $data = array();
        $array_of_time = array();
        $blocked_data = array();
        $booked_data = array();

        $duration = " SELECT DISTINCT duration FROM `wp_ea_services` WHERE id = '$serviceId'  ";
        $durationResult = mysqli_query($db, $duration) or die(mysqli_error($db));
        $doc_slots = mysqli_fetch_array($durationResult);
        $slot_duration = $doc_slots["duration"];

        $booking = " SELECT DISTINCT booking_advance_hrs FROM `wp_ea_staff` WHERE id = '$doctorId' ";
        $bookingResult = mysqli_query($db, $booking) or die(mysqli_error($db));
        $bookingHrs = mysqli_fetch_array($bookingResult);
        $booking_advance_hrs = $bookingHrs["booking_advance_hrs"];
        $advancedHrs = ("$booking_advance_hrs hours");
        $add_mins  = $slot_duration * 60;

        $booked = "SELECT wp_ea_appointments.start FROM `wp_ea_appointments` where worker = '$doctorId' AND wp_ea_appointments.date = '$selected_date' ";
        $bookedResult = mysqli_query($db, $booked) or die(mysqli_error($db));
        while ($row = mysqli_fetch_array($bookedResult)) {
            $sub_array = array();
            $sub_array["time_slot"] = date('h:i A', strtotime($row["start"]));
            $booked_data[] = $sub_array;
        }

        $statement = " SELECT DISTINCT Any_VALUE(time_from) AS time_from, Any_VALUE(time_to) AS time_to FROM `wp_ea_connections` WHERE worker = '$doctorId' AND service='$serviceId' AND day_from <= '$selected_date' AND day_of_week LIKE '%$dayOfWeek%' AND is_working = 1 GROUP BY time_from ";
        $result = mysqli_query($db, $statement) or die(mysqli_error($db));
        while ($row = mysqli_fetch_array($result)) {
            $start_time = strtotime($row["time_from"]);
            $end_time = strtotime($row["time_to"]);
        }
        if (!empty($start_time) && !empty($end_time)) {
            while ($start_time <= $end_time) {
                $array_of_time["time_slot"] = date('h:i A', $start_time);
                $start_time += $add_mins;
                $data[] = $array_of_time;
            }
        }

        array_pop($data);

        $blockedTimeSlots = " SELECT DISTINCT time_from FROM `wp_ea_connections` WHERE worker = '$doctorId' AND is_working = 0 AND day_of_week LIKE '%$dayOfWeek%' AND day_from >= '$selected_date' AND day_to <= '$selected_date' ";
        $blockedTimeSlotsResult = mysqli_query($db, $blockedTimeSlots) or die(mysqli_error($db));
        while ($row = mysqli_fetch_array($blockedTimeSlotsResult)) {
            $sub_array = array();
            $sub_array["time_slot"] = date('h:i A', strtotime($row["time_from"]));
            $blocked_data[] = $sub_array;
        }

        $GLOBALS['allowedBookingTime'] = date('h:i A', strtotime($advancedHrs));
        $filtered = array_diff(array_column($data, 'time_slot'), array_column($blocked_data, 'time_slot'), array_column($booked_data, 'time_slot'));
        if (date('Ymd') == date('Ymd', strtotime($selected_date))) {
            $filteredTimeSlots = array_filter($filtered, function ($x) {
                return strtotime($x) >= strtotime($GLOBALS['allowedBookingTime']);
            });
        } else {
            $filteredTimeSlots = array_diff(array_column($data, 'time_slot'), array_column($blocked_data, 'time_slot'), array_column($booked_data, 'time_slot'));
        }

        return $filteredTimeSlots;
    }
    
    public function processFlutterwavePayment(
        int $appointment_id,
        array $rave
    ) {
        /**
         * Records flutterwave transaction response to database.
         * Checks if amount paid is same as the expected amount
         * Marks the appointment being paid for as paid if the amount is right
         * Sends confirmation sms to the patient phone number
         * 
         * @param string $appointment_id appointment id
         * @param array $rave flutterwave response array
         * 
         * @return array contains error message if any, or empty if none
         */

        $db = $this->conn;
        $date = new DateTimeImmutable("now", new DateTimeZone("+3"));

        if (!in_array($rave["status"], ["success", "successful"])) {
            $this->logError(__FUNCTION__, func_get_args(), "Flutterwave transaction failed.");
            return ["error" => "flutterwave transaction was unsuccessful.", "error_code" => 5];
        }

        // parsed this way because sometimes flutterwave response has empty strings on some keys, that cause query to fail because of sql_mode on the server at the time of writing this code
        $query_fields = array("tx_ref", "raveRef");
        $query_fields["txRef"] = !empty($rave["txRef"]) ? "`txRef`," : '';
        $query_fields["raveRef"] = !empty($rave["raveRef"]) ? "`raveRef`," : '';

        $query_values = array("tx_ref", "raveRef");
        $query_values["txRef"] = !empty($rave["txRef"]) ? "'" . $rave["txRef"] . "'," : '';
        $query_values["raveRef"] = !empty($rave["raveRef"]) ? "'" . $rave["raveRef"] . "'," : '';

        // store transaction data to database
        $transaction_sql = "INSERT INTO `wave_transactions`(`status`, `trx_id`,  {$query_fields['txRef']} `flwRef`, `device_fingerprint`, `amount`, `charged_amount`, `appfee`, `chargeResponseCode`, {$query_fields['raveRef']} `chargeResponseMessage`, `authModelUsed`, `currency`, `narration`, `acctvalrespmsg`, `paymentType`, `fraud_status`, `createdAt`, `updatedAt`, `customer_phone`, `customer_email`, `customer_name`, `date_added`) VALUES ('{$rave['status']}','{$rave["id"]}',{$query_values['txRef']} '{$rave["flwRef"]}','{$rave["device_fingerprint"]}','{$rave["amount"]}','{$rave["charged_amount"]}','{$rave["appfee"]}','{$rave["chargeResponseCode"]}', {$query_values['raveRef']}'" . mysqli_real_escape_string($db, trim($rave["chargeResponseMessage"])) . "','{$rave["authModelUsed"]}','{$rave["currency"]}','" . trim($rave["narration"]) . "','{$rave["acctvalrespmsg"]}','{$rave["paymentType"]}','{$rave["fraud_status"]}','{$rave["createdAt"]}','{$rave["updatedAt"]}','{$rave["customer.phone"]}','{$rave["customer.email"]}','{$rave["customer.fullName"]}','{$date->format('Y-m-d H:i:s')}')";

        mysqli_query($db, $transaction_sql);
        if (mysqli_error($db)) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to store transaction data.", $transaction_sql, mysqli_error($db));
            return ["error" => "Failed to save transaction to database.", "error_code" => 6];
        }

        $appointment_details = mysqli_fetch_assoc(mysqli_query($db, "SELECT service, date, start, name, phone FROM wp_ea_appointments, wp_ea_staff WHERE wp_ea_appointments.worker = wp_ea_staff.id AND wp_ea_appointments.id = '$appointment_id'"));

        $service_details = mysqli_fetch_assoc(mysqli_query($db, "SELECT price, currency FROM wp_ea_services WHERE id = '{$appointment_details["service"]}'"));

        if ($service_details["price"] < $rave["amount"]) {
            $this->logError(__FUNCTION__, func_get_args(), "Insufficient amount paid.");
            // return ["error" => "Insufficient amount paid.", "error_code" => 7];
        }

        // mark appointment as paid
        mysqli_query($db, "UPDATE wp_ea_appointments SET status = 'pending' WHERE id = '$appointment_id'");

        if (mysqli_error($db)) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to update appointment to paid.", "UPDATE wp_ea_appointments SET status = 'pending' WHERE id = '$appointment_id'", mysqli_error($db));
        }

        // get patient name
        $patient_names_qry = mysqli_query($db, "SELECT field_id, value FROM wp_ea_fields WHERE app_id = '$appointment_id' AND field_id IN (2, 7, 8)");
        $first_name = $last_name = $patient_phone = "";
        while ($patient_details = mysqli_fetch_assoc($patient_names_qry)) {
            switch ($patient_details["field_id"]) {
                case '2':
                    $first_name = $patient_details["value"];
                    break;
                case '7':
                    $last_name = $patient_details["value"];
                    break;
                case '8':
                    $patient_phone = $patient_details["value"];
                    break;
            }
        }

        // send confirmation sms
        $this->sendTelemedicineConfirmationSMS(
            $patient_phone,
            trim("$first_name $last_name"),
            $appointment_details["date"],
            $appointment_details["start"],
            $appointment_details["name"],
            $appointment_details["phone"]
        );

        return array();
    }

    private function sendTelemedicineConfirmationSMS(
        $patient_phone,
        $patient_name,
        $appointment_date,
        $appointment_time,
        $facility_name,
        $facility_phone
    ) {
        $africastalking_gateway = new AfricasTalkingGateway($this->africastalking_username, $this->africastalking_api_key);

        $appointment_date = date("d/m/Y", strtotime($appointment_date));

        $patient_message = "$facility_name has confirmed your telemedicine appointment on $appointment_date at $appointment_time. Log in to your account at https://myhealthafrica.com/patient-login to manage your appointments.";

        $facility_message = "Your telemedicine appointment with $patient_name on $appointment_date at $appointment_time has been confirmed. Log in to your account at https://myhealthafrica.com/myonemedpro/login to manage your appointments.";

        try {
            $africastalking_gateway->sendMessage(
                $patient_phone,
                $patient_message,
                $this->africastalking_sender_name
            );
        } catch (AfricasTalkingGatewayException $e) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to send patient telemedicine appointment confirmation SMS.", "", $e->getMessage());
        }

        // try {
        //     $africastalking_gateway->sendMessage(
        //         $facility_phone,
        //         $facility_message,
        //         $this->africastalking_sender_name
        //     );
        // } catch (AfricasTalkingGatewayException $e) {
        //     $this->logError(__FUNCTION__, func_get_args(), "Failed to send facility telemedicine appointment confirmation SMS.", "", $e->getMessage());
        // }
    }
}
 
?>