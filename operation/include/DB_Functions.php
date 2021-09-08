<?php
// php mailer
require_once 'my_mail.php';
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
        $this->conn = mysqli_connect('localhost', 'root', '', 'myhealth_database');
        if (!$this->conn) {
            die("Connection failed: " . mysqli_connect_error());
          }

    }
    
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
        $clinic
        ) {
        $db = $this->conn;

        $query = "INSERT INTO wp_ea_appointments (wp_ea_appointments.location, wp_ea_appointments.date, wp_ea_appointments.start, end_date, wp_ea_appointments.status, created, price, med_on_demand, clinic) 
                VALUES (130, '$date', '$time', '$date', 'pending payment', '$date.' '.$time', '$cost', 1, '$clinic')";
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
                $name[1], 
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
                if (in_array($field, [1,2,7,15,16,20])) {
                    $enc_iv = ''; $enc_key = '';
                } else{
                    $enc_iv = $ivBase64; $enc_key = $keyBase64;
                }
                $query = "INSERT INTO wp_ea_fields (wp_ea_fields.app_id, wp_ea_fields.field_id, wp_ea_fields.value, iv, enc_key) VALUES ('$appointment_id', '$meta_field', '$field_value', '$enc_iv', '$enc_key') ";
                $statement = mysqli_query($db, $query) or die(mysqli_error($db));
                $i++;
            }
            echo $appointment_id;
            exit();
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
        $appointment_id, 
        $type,
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
            $statement = mysqli_query($db, "UPDATE wp_ea_appointments SET telemed_status = 'Paid' WHERE id = '$appointment_id' ") or die(mysqli_error($db));
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
                $email1 = $this->sendBookingConfirmationEmailToPatient($type, $appointment_id, $date, $time, $email, $first_name.' '.$last_name, $phone, $gender, $concern='', $location);
                $email2 = $this->sendBookingConfirmationEmailToFacility($type, $appointment_id, $date, $time, $email, $first_name.' '.$last_name, $phone, $gender, $concern='', $location);
                $sms1 = $this->sendBookingSMSToPatient($type, $appointment_id, $first_name.' '.$last_name, $phone, $date, $time);
                //$sms2 = $this->sendBookingSMSToFacility($type, $appointment_id, $first_name.' '.$last_name, $phone, $date, $time);
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
        $concern, 
        $location
        ) {
        $button = "<a href='https://myhealthafrica.com/coldroom/myonemedpro/psi-telemedicine/patient/patient-waiting-room.php?appid={$appointment_id}' target='_blank'><button class='button button4' style='border-radius: 12px;background-color: #28A745;border: none; color: white;
                padding: 13px;text-align: center;text-decoration: none;display: inline-block;
                font-size: 16px;margin: 4px 2px;cursor: pointer;color:white;'>Start Session</button></a>";
        $url = "<a href='https://myhealthafrica.com/coldroom/myonemedpro/psi-telemedicine/patient/patient-waiting-room.php?appid={$appointment_id}' target='_blank'>here</a>";

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
            $body_text = 'This email is to inform you that your telemedicine appointment with Tunza Clinics has been successfully scheduled. The doctor will be waiting for you.';
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
                <table class='email-body_inner' cellpadding='0' cellspacing='0' role='presentation' style='margin: 0 auto; padding: 0; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='FFFFFF'>
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
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Medical concern:</b> {$concern}</p>
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
        $concern, 
        $location
        ) {
        
        $button = "<a href='https://myhealthafrica.com/coldroom/myonemedpro/my-waiting-room?appid={$appointment_id}' target='_blank'><button class='button button4' style='border-radius: 12px;background-color: #28A745;border: none; color: white;
                padding: 13px;text-align: center;text-decoration: none;display: inline-block;
                font-size: 16px;margin: 4px 2px;cursor: pointer;color:white;'>Start Session</button></a>";
        $url = "<a href='https://myhealthafrica.com/coldroom/myonemedpro/my-waiting-room?appid={$appointment_id}' target='_blank'>here</a>";

        $separator = md5(time());
        $eol = PHP_EOL;
        $emailFrom = $name.'<'.$email.'>';
        $headers = "From: ".$emailFrom.$eol;
        $headers .= "Reply-To: ".$emailFrom.$eol;
        $headers .= "MIME-Version: 1.0".$eol;
        $headers .= "Content-Type: multipart/mixed; boundary=\"".$separator."\"";

        if ($type == 'schedule') {
            $subject = $name.': Scheduled Telemedicine Appointment Request';
            $body_text = 'This email is to inform you that your telemedicine appointment with '.$name.' has been successfully scheduled.';
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
                <table class='email-body_inner' cellpadding='0' cellspacing='0' role='presentation' style='margin: 0 auto; padding: 0; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='FFFFFF'>
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
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Medical concern:</b> {$concern}</p>
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
            'datestart' => strtotime($start_date),
            'dateend' => strtotime($end_date),
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
        $ical .= 'DTSTART:'.dateToCalendar($event["datestart"]).''.PHP_EOL;
        $ical .= 'DTEND:'.dateToCalendar($event["dateend"]).''.PHP_EOL;
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


    public function sendBookingSMSToPatient(
        $type, 
        $appointment_id, 
        $name, 
        $phone, 
        $date, 
        $time
        ) {
        $url = "https://myhealthafrica.com/coldroom/myonemedpro/psi-telemedicine/patient/patient-waiting-room.php?appid={$appointment_id}.";
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

    public function sendBookingSMSToFacility(
        $type, 
        $appointment_id, 
        $name, 
        $phone, 
        $date, 
        $time
        ) {
        
        $url = "https://myhealthafrica.com/coldroom/myonemedpro/my-waiting-room?appid={$appointment_id}.";
        if ($type == 'schedule') {
            $message = 'Your telemedicine appointment with '.$name.' on '.$date.' '.$time.' is confirmed. Start your session by clicking this url '.$url.'. Check your email/login to your account for details or to cancel/reschedule.';
        } else if ($type == 'now') {
            $message = 'Your appointment with '.$name.' now is confirmed. Start your telemedicine session by clicking this url '.$url.' or check your email.';
        } else if ($type == 'reminder') {
            $message = 'This is to remind you that you have a telemedicine appointment with '.$name.' on '.$date.' '.$time.' is confirmed. Start your session by clicking this url '.$url.'. Check your email/ login to your account for details or to cancel/reschedule.';
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
                    <img src='https://ones.myhealthafrica.co.ke/myonemedpro/upload/PSIKENYA.png' alt='PSI logo' width='100' height:'50' style='border: 0; width: 10rem;'><br>
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
    *  Booking Telemedicine Payment Invoice Email
    */
    public function telemedicinePaymentInvoiceEmail($total_no_accounts, $package, $plan, $flwRef,$amount,$currency,$customer_email,$customer_name, $subscription_end_date) {
        $subscription_end_date = date("d/m/Y G:i:s", strtotime($subscription_end_date));
        $emailFrom = 'My Health Africa<billing@myhealthafrica.com>';
        $emailTo = $customer_email;
        $headers = "From: $emailFrom";
        $headers = "From: " . $emailFrom . "\r\n";
        $headers .= "Reply-To: ". $emailFrom . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        $subject = "Your payment was successful!";
        $body = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>My Health Africa</title></head><body>";
        $body .= "<body style='height: 100%; margin: 0; -webkit-text-size-adjust: none; font-family: Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; width: 100%;'>";
        $body .=  '<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7;" bgcolor="#F4F4F7">';
        $body .=  "<tr><td class='email-body' width='100%' cellpadding='0' cellspacing='0' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='#FFFFFF'>
                <table class='email-body_inner' cellpadding='0' cellspacing='0' role='presentation' style='margin: 0; padding: 0; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='FFFFFF'>
                    <tr>
                        <td class='content-cell' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 15px;'>
                            <div class='f-fallback'>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Hello {$customer_name},</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>You have successfully paid for the OneMed Pro {$package} subscription plan.</p>
                            </div>
                            <div class='f-fallback'>
                                <h5 style='margin-top: 20px; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Subscription Details</h5>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Subscription plan:</b> {$package}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Billing period:</b> {$plan}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Number of users added:</b> {$total_no_accounts}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Amount paid:</b> {$currency} {$amount}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Payment confirmation number:</b> {$flwRef}</p>
                                <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Subscription expiry date:</b> {$subscription_end_date}</p>
                            </div>
                            <div class='f-fallback'>
                                <p style=' font-size: 12px; line-height: 1.625; color: #51545E;'>Thank you,</p>
                                <p style=' font-size: 12px; line-height: 1.625; color: #51545E;'>My Health Africa OneMed Pro Team.</p>
                                <p style=' font-size: 12px; line-height: 1.625; color: #51545E;'>Services provided by <a href=https://www.myhealthafrica.com/myonemedpro>OneMedPro</a></p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>";
        $body .= '<tr><td align="center" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px;">
                    <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0;">
                    <tr><td class="email-masthead" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 25px 0; text-align: center;" align="center">
                        <img src="https://myhealthafrica.com/myonemedpro/img/MHAOneMedlogo.png" alt="MyHealthAfrica logo" width="100" height:"50" style="border: 0; width: 10rem;"></td></tr>';
        $body .= '</table>';
        $body .='</td>';
        $body .= '</tr>';
        $body .= '</table>';
        $body .= "</body></html>";
        
        $mail = mailer();
        $mail->setFrom("billing@myhealthafrica.com", "My Health Africa Billing");
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->isHTML(true);
        $mail->Encoding = "base64";
        $mail->addAddress($emailTo);

        try {
            $mail->send();
            $send = true;
        } catch (Exception $e) {
            $send = false;
        }
        $mail->clearAddresses();
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

}
 
?>