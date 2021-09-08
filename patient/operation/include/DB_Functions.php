<?php
// php mailer
require_once 'my_mail.php';
require_once('AfricasTalkingGateway.php');

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

        $time = new DateTime("now", new DateTimeZone("+3"));
        $time = $time->format("Y-m-d H:i:s");

        $msg = "$error_verbose\n";
        $msg .= "Function: $function_name\n";
        $msg .= "Params: " . print_r($params, true) . "\n";
        if ($sql) $msg .= "SQL: $sql\n";
        if ($exception) $msg .= "$exception";

        $error_log = fopen("db_functions_error_log.txt", 'a');
        fwrite($error_log, "[$time]=>\t" . $msg . "\n\n");
        fclose($error_log);
    }
    
    /**************************
     ******************************** DIRECT PAY ONLINE  *********************************** 
                                                         ***************************************************/


    public function TunzaClinicTelemedicineBooking(
        $service,
        $location,
        $patientFirstName,
        $patientLastName,
        $patientEmail,
        $patientGender,
        $patientDateOfBirth,
        $appointmentDate,
        $appointmentTime,
        $patientPhoneNumber,
        $paymentMethod
    ) {
        date_default_timezone_set('Africa/Nairobi');
        $db = $this->conn;
        $currentDate = date('Y-m-d', time());
        $currentTime = date('G:i:s', time());
        $created = $currentDate.' '.$currentTime;
        $display_name = $patientFirstName.' '.$patientLastName;

        $key_size = 32;
        $encryption_key = openssl_random_pseudo_bytes($key_size, $strong);
        $iv_size = 16;
        $iv = openssl_random_pseudo_bytes($iv_size, $strong);
        $ivBase64 = base64_encode($iv);
        $keyBase64 = base64_encode($encryption_key);

        $encryptedDoB = openssl_encrypt($this->pkcs7_pad($patientDateOfBirth, 16), 'AES-256-CBC', $encryption_key, 0, $iv);
        $encryptedDoBase64 = base64_encode($encryptedDoB);
        $encryptedPhone = openssl_encrypt($this->pkcs7_pad($patientPhoneNumber, 16), 'AES-256-CBC', $encryption_key, 0, $iv);
        $encryptedPhoneBase64 = base64_encode($encryptedPhone);

        $insertSQL = "INSERT INTO wp_ea_appointments (wp_ea_appointments.location, wp_ea_appointments.date, wp_ea_appointments.start, wp_ea_appointments.end, end_date, wp_ea_appointments.status, user, created, price,facility_id) 
                VALUES ('$location', '$service', '$doctorId', '$appointmentDate', '$startTime', '$endTime', '$appointmentDate', '$appointmentStatus', '$userId', '$created', '$servicePrice','$facility_id' )";
        $insertStatement = mysqli_query($db, $insertSQL) or die(mysqli_error($db));
        $appointment_id = mysqli_insert_id($db);

        if (!empty($insertStatement)) {
            if (!empty($appointment_id)) {
                $insertPhoneNumber = "INSERT INTO wp_ea_fields (wp_ea_fields.app_id, wp_ea_fields.field_id, wp_ea_fields.value, iv, enc_key) VALUES ('$appointment_id', 8, '$encryptedPhoneBase64', '$ivBase64', '$keyBase64') ";
                $insertPhoneNumberStatement = mysqli_query($db, $insertPhoneNumber) or die(mysqli_error($db));

                $insertFirstName = "INSERT INTO wp_ea_fields (wp_ea_fields.app_id, wp_ea_fields.field_id, wp_ea_fields.value) VALUES ('$appointment_id', 2, '$patientFirstName') ";
                $insertFirstNameStatement = mysqli_query($db, $insertFirstName) or die(mysqli_error($db));

                $insertLastName = "INSERT INTO wp_ea_fields (wp_ea_fields.app_id, wp_ea_fields.field_id, wp_ea_fields.value) VALUES ('$appointment_id', 7, '$patientLastName') ";
                $insertLastNameStatement = mysqli_query($db, $insertLastName) or die(mysqli_error($db));

                $insertEmail = "INSERT INTO wp_ea_fields (wp_ea_fields.app_id, wp_ea_fields.field_id, wp_ea_fields.value) VALUES ('$appointment_id', 1, '$patientEmail') ";
                $insertEmailStatement = mysqli_query($db, $insertEmail) or die(mysqli_error($db));

                $insertGender = "INSERT INTO wp_ea_fields (wp_ea_fields.app_id, wp_ea_fields.field_id, wp_ea_fields.value) VALUES ('$appointment_id', 15, '$patientGender') ";
                $insertGenderStatement = mysqli_query($db, $insertGender) or die(mysqli_error($db));

                $insertDateOfBirth = "INSERT INTO wp_ea_fields (wp_ea_fields.app_id, wp_ea_fields.field_id, wp_ea_fields.value, iv, enc_key) VALUES ('$appointment_id', 16, '$encryptedDoBase64', '$ivBase64', '$keyBase64') ";
                $insertDateOfBirthStatement = mysqli_query($db, $insertDateOfBirth) or die(mysqli_error($db));
            }

            if (!empty($insertPhoneNumberStatement) && !empty($insertFirstNameStatement) && !empty($insertLastNameStatement) && !empty($insertEmailStatement) && !empty($insertGenderStatement) && !empty($insertDateOfBirthStatement) && !empty($insertPaymentMethodStatement)) {
                

                $query = " SELECT name, email, phone FROM `wp_ea_staff` WHERE dr_post_id = '$doctorPostId' ";
                $statement = mysqli_query($db, $query) or die(mysqli_error($db));
                $doctor = mysqli_fetch_assoc($statement);
                $doctor_name = $doctor["name"];
                $doctor_email = $doctor["email"];
                $doctorPhone = $doctor["phone"];

                $key_query = " SELECT meta_value FROM `wp_postmeta` WHERE post_id = '$doctorPostId' AND meta_key = '_yoast_wpseo_primary_medclinic_doctor_speciality' ";
                $key_statement = mysqli_query($db, $key_query) or die(mysqli_error($db));
                $meta_key = mysqli_fetch_assoc($key_statement);
                $key = $meta_key["meta_value"];

                $speciality_query = " SELECT wp_terms.name FROM `wp_terms` WHERE term_id = '$key' ";
                $speciality_statement = mysqli_query($db, $speciality_query) or die(mysqli_error($db));
                $speciality = mysqli_fetch_assoc($speciality_statement);
                $doctorSpeciality = $speciality["name"];

                $service_query = " SELECT wp_ea_services.name, price, currency FROM `wp_ea_services` WHERE id = '$service' ";
                $service_result = mysqli_query($db, $service_query) or die(mysqli_error($db));
                $doc_service = mysqli_fetch_assoc($service_result);
                $doctorBookedService = $doc_service["name"];
                $doctorBookedPrice = $doc_service["price"];
                $doctorBookedCurrency = $doc_service["currency"];

                $location_query = " SELECT wp_ea_locations.name, wp_ea_locations.address, wp_ea_locations.street, wp_ea_locations.district, wp_ea_locations.city, wp_ea_locations.state, wp_ea_locations.location, wp_ea_locations.timezone, wp_ea_connections.service FROM `wp_ea_connections` INNER JOIN `wp_ea_locations` ON wp_ea_connections.location = wp_ea_locations.id WHERE wp_ea_connections.service = '$service' GROUP BY service";
                $location_result = mysqli_query($db, $location_query) or die(mysqli_error($db));
                $doc_location = mysqli_fetch_assoc($location_result);
                $doctorBookedLocation = $doc_location["name"];
                $doctorBookedAddress = $doc_location["address"];
                $doctorBookedStreet = $doc_location["street"];
                $doctorBookedDistrict = $doc_location["district"];
                $doctorBookedCity = $doc_location["city"];
                $doctorBookedState = $doc_location["state"];
                $doctorBookedCountry = $doc_location["location"];
                $doctorBookedTimeZone = $doc_location["timezone"];



                if ($doctorBookedLocation != '') {
                    $appt_location = $doctorBookedLocation . ', ';
                } else $appt_location = '';
                if ($doctorBookedAddress != '') {
                    $appt_address = $doctorBookedAddress . ', ';
                } else $appt_address = '';
                if ($doctorBookedStreet != '') {
                    $appt_street = $doctorBookedStreet . ', ';
                } else $appt_street = '';
                if ($doctorBookedDistrict != '') {
                    $appt_district = $doctorBookedDistrict . ', ';
                } else $appt_district = '';
                if ($doctorBookedCity != '') {
                    $appt_city = $doctorBookedCity . ', ';
                } else $appt_city = '';
                if ($doctorBookedState != '') {
                    $appt_state = $doctorBookedState . ', ';
                } else $appt_state = '';
                if ($doctorBookedCountry != '') {
                    $appt_country = $doctorBookedCountry . ', ';
                } else $appt_country = '';
                
                $separator = md5(time());
                //BEGINNING OF ONEMED IN-PERSON APPOINTMENTS CONFIRMATION EMAIL TO PATIENT
                
                $point_pos = 0;
                $eol = PHP_EOL;
                $emailFrom = 'My Health Africa<noreply@myhealthafrica.com>';
                $emailTo = $patientEmail;
                $emailToDoctor = $doctor_email;
                $headers = "From: " . $emailFrom  . $eol;
                $headers .= "Reply-To: " . $emailFrom . $eol;
                $headers .= "MIME-Version: 1.0" . $eol;
                $headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"";

                $subject = "{$patientFirstName} {$patientLastName} your appointment with {$facty_doc} is confirmed";
                $doctorSubject = "{$facty_doc} your appointment with {$patientFirstName} {$patientLastName} is confirmed";

                $body = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>My Health Africa</title></head><body>" . $eol;

                $body .= "<body style='height: 100%; margin: 0; -webkit-text-size-adjust: none; font-family: Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; width: 100%;'>" . $eol;
                $body .=  '<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7;" bgcolor="#F4F4F7">' . $eol;
                $body .=  "<tr><td class='email-body' width='100%' cellpadding='0' cellspacing='0' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='#FFFFFF'>
                        <table class='email-body_inner' cellpadding='0' cellspacing='0' role='presentation' style='margin: 0 auto; padding: 0; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='FFFFFF'>
                          <tr>
                                <td class='content-cell' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 15px;'>
                                    <div class='f-fallback'>
                                    	<p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>Dear {$patientFirstName} {$patientLastName},</p>
                                        <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>This email is to inform you that your appointment with {$facty_doc} has been confirmed.The Doctor will be waiting for you.</p>
                                        <h5 style='margin-top: 0; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Appointment Details</h5>
                                        
                                    </div>
                                    <div class='f-fallback'>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Location:</b> {$appt_location}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Details:</b> {$appt_address}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Address:</b> {$appt_street}{$appt_district}{$appt_city}{$appt_country}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Phone:</b> {$facty_phone}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Provider:</b> {$facty_doc}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Speciality:</b> {$doctorSpeciality}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Service:</b> {$doctorBookedService}, {$doctorBookedCurrency} {$doctorBookedPrice}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Payment mode:</b> Cash</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>When:</b> {$dayOfWeek}, {$dateString} at {$appointmentTime} {$doctorBookedTimeZone}</p>
                                        
                                    </div>
                                    <div class='f-fallback'>
                                        <h5 style='margin-top: 20px; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Patient Details</h5>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Name:</b> {$patientFirstName} {$patientLastName}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Notes:</b> {$bookingNote}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Please Note:</b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>". ++$point_pos .". The cost for your consultation is not inclusive of any tests or medication that the doctor may recommend.</b></p>
                                        ". (revo_dental_msg($point_pos, $facility_id)) ."
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>". ++$point_pos .". On arrival at the facility, kindly notify the staff that you booked through this platform to easily find your advanced booking. </b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>". ++$point_pos .". For first time visits, remember to carry any medical reports you have.</b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>". ++$point_pos .". Please arrive to the appointment destination 15 minutes before your appointment to register.</b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>". ++$point_pos .". Considering the busy schedules that doctors have, please ensure you reschedule your appointment at least 24 hours prior, to allow another patient to take your time slot. To reschedule your appointment, login to your <a href='https://myhealthafrica.com/patient-login'>patient account</a></b></p>
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

                $pfilename = 'NewAppointment.ics';
                //Begin Icalendar invite
                $timezone = new DateTimeZone('Africa/Nairobi');
                $startdate = $appointmentDate.' '.$startTime.''.$doctorBookedTimeZone;
                $enddate = $appointmentDate.' '.$endTime.''.$doctorBookedTimeZone;
                $event = array(
                    'id' => $doctorSpeciality,
                    'title' => $doctorBookedService,
                    'address' => $appt_location,
                    'description' => 'New appointment with'.' '.$doctor_name,
                    'datestart' => strtotime($startdate),
                    'dateend' => strtotime($enddate),
                    'address' => $appt_address . ' ' . $appt_street
                );

                function dateToCal($time){
                    return gmdate('Ymd\This', $time).'Z';
                }

                // Build the ics file
                $ical = 'BEGIN:VCALENDAR'.PHP_EOL;
                $ical .= 'VERSION:2.0'.PHP_EOL;
                $ical .= 'PRODID:-//My Health Africa/Appointments//Booking Platform//EN'.PHP_EOL;
                $ical .= 'CALSCALE:GREGORIAN'.PHP_EOL;
                $ical .= 'BEGIN:VEVENT'.PHP_EOL;
                $ical .= 'DTSTART:' . dateToCal($event["datestart"]) . ''.PHP_EOL;
                $ical .= 'DTEND:' . dateToCal($event["dateend"]) . ''.PHP_EOL;
                $ical .= 'UID:' . md5($event["title"]) .''.PHP_EOL;
                $ical .= 'DTSTAMP:' . time() . ''.PHP_EOL;
                $ical .= 'LOCATION:' . addslashes($event['address']) . ''.PHP_EOL;
                $ical .= 'ORGANIZER;CN="My Health Africa":mailto:noreply@myhealthafrica.com'.PHP_EOL;
                $ical .= 'DESCRIPTION:' . addslashes($event['description']) . ''.PHP_EOL;
                $ical .= 'URL;VALUE=URI:http://myhealthafrica.com/events/' . $event['id'] . ''.PHP_EOL;
                $ical .= 'SUMMARY:' . addslashes($event['title']) . ''.PHP_EOL;
                $ical .= 'END:VEVENT'.PHP_EOL;
                $ical .= 'END:VCALENDAR';

                //END OF ONEMED IN-PERSON APPOINTMENTS CONFIRMATION EMAIL FOR PATIENT


                //BEGINNING OF ONEMED TELEMED APPOITMENTS CONFIRMTION EMAIL FOR PATIENT
                
                $url = "<p><div><a href='https://myhealthafrica.com/myonemedpro/my_virtual_doctor?appid={$appointment_id}' target='_blank'><button class='button button4' style='border-radius: 12px;background-color: #28A745;border: none; color: white;
                                    padding: 13px;text-align: center;text-decoration: none;display: inline-block;
                                    font-size: 16px;margin: 4px 2px;cursor: pointer;color:white;'>Start Session</button></a>
                            </div>
                        </p>";

                $separator = md5(time());

                $point_pos = 0;
                $eol = PHP_EOL;
                $emailFrom = 'My Health Africa<noreply@myhealthafrica.com>';
                $emailTelePat = $patientEmail;
                $Teleheaders = "From: " . $emailFrom  . $eol;
                $Teleheaders .= "Reply-To: " . $emailFrom . $eol;
                $Teleheaders .= "MIME-Version: 1.0" . $eol;
                $Teleheaders .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"";

                $TeleSubject = " Your Telemedicine Appointment Has Been Confirmed";

                $Telebody = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>My Health Africa</title></head><body>" . $eol;

                $Telebody .= "<body style='height: 100%; margin: 0; -webkit-text-size-adjust: none; font-family: Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; width: 100%;'>" . $eol;
                $Telebody .=  '<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7;" bgcolor="#F4F4F7">' . $eol;
                $Telebody .=  "<tr><td class='email-body' width='100%' cellpadding='0' cellspacing='0' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='#FFFFFF'>
                        <table class='email-body_inner' cellpadding='0' cellspacing='0' role='presentation' style='margin: 0 auto; padding: 0; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF;' bgcolor='FFFFFF'>
                          <tr>
                                <td class='content-cell' style='word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 15px;'>
                                    <div class='f-fallback'>
                                    	<p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>Dear {$patientFirstName} {$patientLastName},</p>
                                        <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>This email is to inform you that your appointment with  has been confirmed.The Doctor will be waiting for you.</p>
                                        <p style='margin: .4em 0 1.1875em; font-size: 13px; line-height: 1.625; color: #51545E;'>
                                        Please Click the link below to start your telemedicine session with a Tunza Clinic doctor.
                                        </p></br>
                                        {$url}
                                        <h5 style='margin-top: 0; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Appointment Details</h5>
                                        
                                    </div>
                                    <div class='f-fallback'>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Location:</b> Online Consultation </p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Details:</b> Telemedicine Appointment</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Doctor Phone:</b> {$facty_phone} </p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Doctor Email:</b> {$facty_email} </p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Provider:</b> {$facty_doc} </p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Payment mode:</b> Cash</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>When:</b> </p>
                                        
                                    </div>
                                    <div class='f-fallback'>
                                        <h5 style='margin-top: 20px; text-decoration: underline; color: #333333; font-size: 14px; font-weight: bold; text-align: left;'>Patient Details</h5>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Name:</b> {$patientFirstName} {$patientLastName}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Phone:</b> {$patientEmail}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Email:</b> {$patientPhoneNumber}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>Notes:</b> {$bookingNote}</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>". ++$point_pos .". The cost for your consultation is not inclusive of any tests or medication that the doctor may recommend.</b></p>
                                        ". revo_dental_msg($point_pos, $facility_id) ."
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>". ++$point_pos .". On arrival at the facility, kindly notify the staff that you booked through this platform to easily find your advanced booking. </b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>". ++$point_pos .". For first time visits, remember to carry any medical reports you have.</b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>". ++$point_pos .". Please arrive to the appointment destination 15 minutes before your appointment to register.</b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'><b>". ++$point_pos .". Considering the busy schedules that doctors have, please ensure you reschedule your appointment at least 24 hours prior, to allow another patient to take your time slot. To reschedule your appointment, login to your <a href='https://myhealthafrica.com/patient-login'>patient account</a></b></p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Thank you,</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>My Health Africa Booking Team.</p>
                                        <p style=' font-size: 13px; line-height: 1.625; color: #51545E;'>Appointment services provided by <a href='https://myhealthafrica.com'>myhealthafrica.com</a></p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>" . $eol;
                $Telebody .= '<tr><td align="center" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px;">
                            <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0;">
                            <tr><td class="email-masthead" style="word-break: break-word; font-family: Helvetica, Arial, sans-serif; font-size: 16px; padding: 25px 0; text-align: center;" align="center">
                                <img src="https://www.myhealthafrica.com/wp-content/uploads/2018/08/MyHealthAfrica_sd3-final-300x113.png" alt="MyHealthAfrica logo" width="100" height:"50" style="border: 0; width: 10rem;"></td></tr>' . $eol;
                $Telebody .= '</table>' . $eol;
                $Telebody .= '</td>' . $eol;
                $Telebody .= '</tr>' . $eol;
                $Telebody .= '</table>' . $eol;
                $Telebody .= "</body></html>.$eol";

                //END OF ONEMED TELEMED APPOINTMENT CONFIRMATION EMAIL FOR PATIENT

                $mail = mailer();
                $mail->isHTML(true);
                $mail->Encoding = "base64";
                
                $mail->setFrom("noreply@myhealthafrica.com", "My Health Africa");
                $mail->addReplyTo($doctor_email, $doctor_name);
                $mail->addCC("support@myhealthafrica.com", "My Health Africa Support");
                $mail->Subject = $TeleSubject;
                $mail->Body = $Telebodydoc;
                $mail->addStringAttachment($docical, $dfilename, "base64", "text/calendar");

                try {
                    $mail->addAddress($emailToDoctor);
                    $mail->send();
                    $sendToDoctor = true;
                } catch (Exception $e) {
                    logMailerError($e);
                    $sendToDoctor = false;
                }

                $mail->clearAddresses();
                $mail->clearAttachments();

                $mail->setFrom("noreply@myhealthafrica.com", "My Health Africa");
                $mail->addReplyTo($doctor_email, $doctor_name);
                $mail->addCC("support@myhealthafrica.com", "My Health Africa Support");
                $mail->Subject = $TeleSubject;
                $mail->Body = $Telebody;
                $mail->addStringAttachment($ical, $pfilename, "base64", "text/calendar");

                try {
                    $mail->addAddress($emailTelePat);
                    $mail->send();
                    $send = true;
                } catch (Exception $e) {
                    logMailerError($e);
                    $send = false;
                }
                $mail->clearAddresses();

                //SEND Africa Stalking Confirmation Notification to PATIENT Start
                $telemed_url = $location == 130 ? "Start your session here: https://myhealthafrica.com/myonemedpro/my_virtual_doctor?appid={$appointment_id}." : "";
                $patientmessage =   "Appointment confirmed with {$facty_doc} on {$dayOfWeek}, {$dateString} at {$appointmentTime} {$doctorBookedTimeZone}. $telemed_url Check your email/click https://www.myhealthafrica.com/patient-login to login to your account for details or cancel/reschedule.";
                //END SURMON MESSAGE
                $from_sent       = 'Myhealthafr';
                $recipient_pat =  "$patientPhoneNumber";
                try {
                    $results = $gateway->sendMessage($recipient_pat, $patientmessage, $from_sent);
                } catch (AfricasTalkingGatewayException $e) {
                    echo "Encountered an error while sending: " . $e->getMessage();
                }
                if ($send && $sendToDoctor) {
                    $response = 200;
                    echo $response;
                } else {
                    $response = 500;
                    echo $response;
                }

            } else {
                $response = 500;
                echo $response;
            }
        } else {
            $response = 500;
            echo $response;
        }

        mysqli_close($db);
    }




















    public function TunzaClinicTelemedicinePayment(
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
    	$FraudExplanation,
    	$SubscriptionToken,
    	$CustomerToken
        ) {
        $db = $this->conn;

        $sql = "INSERT INTO dpo_payments (appointment_id,TransactionToken,TransactionRef,CustomerName,CustomerPhone,CustomerEmail,CustomerCity,CustomerCountry,CustomerCredit,CustomerCreditType,TransactionCurrency,
                TransactionSettlementDate,TransactionFinalCurrency,TransactionNetAmount,AccRef,TransactionAmount,ResultExplanation,TransactionCreatedDate,TransactionExpiryDate,TransactionPaymentDate,
                CardType,ApprovalNumber, ServiceDescription,FraudAlert,FraudExplanation,payment_purpose,
                date_added) VALUES ('$appointment_id','$TransactionToken','$TransactionRef','$CustomerName','$CustomerPhone','$CustomerEmail','$CustomerCity', '$CustomerCountry', '$CustomerCredit',
                '$CustomerCreditType','$TransactionCurrency','$TransactionSettlementDate','$TransactionFinalCurrency','$TransactionNetAmount','$AccRef','$TransactionAmount','$ResultExplanation', '$TransactionCreatedDate',
                '$TransactionExpiryDate', '$TransactionPaymentDate', '$CardType', '$ApprovalNumber', '$ServiceDescription', '$FraudAlert','$FraudExplanation', 'onemedpro_subscription', NOW() )";
        $result = mysqli_query($db, $sql) or die(mysqli_error($db));
        if (!empty($result)) {
            $statement = mysqli_query($db, "UPDATE wp_ea_appointments SET telemed_status = 'Paid' WHERE id = '$appointment_id' ") or die(mysqli_error($db));
            if (!empty($statement)) {
                if (!empty($pass_result)) {
                    $account_type = $user['subscribing_as'];
                    $fullname = $user['fullname'];
                    $total_no_accounts = $user['total_user_accounts'];
                    $country = $user['country'];
                    $location = $user['location'];
                    $payable_amount = $user['total_payable_amount'];
                    $package = $user['package'];
                    $package_cost = $user['package_cost'];
                    $plan = $user['plan'];
                    $subscription_end_date = $user['subscription_expiry_date'];
                    $amount = $TransactionAmount;
                    $currency = $TransactionCurrency;
                    $customer_phone = $CustomerPhone;
                    $customer_email = $user['email'];
                    $customer_name = $fullname;
                    $flwRef = $TransactionRef;

                    $this->subscriptionSuccessfulEmail($account_type, $fullname, $total_no_accounts, $country, $location, $payable_amount, $package, $package_cost, $plan, $subscription_end_date,$amount,$currency,$customer_phone,$customer_email,$customer_name);
                    $this->subscriptionSuccessfulAccountActivationEmail($account_type, $fullname, $email, $key, $package);
                    $this->subscriptionPaymentInvoiceEmail($total_no_accounts, $package, $plan, $flwRef,$amount,$currency,$customer_email,$customer_name, $subscription_end_date);
                    mysqli_close($db);
                    $response = 200;
                    return $response;
                } else{
                    mysqli_close($db);
                    $response = 300;
                    return $response;
                }
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
    ****************************END DPO  *******************************
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

}
 
?>