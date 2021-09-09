<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set('Africa/Nairobi');
$currentDate = date('Y-m-d', time());
$currentTime = date('G:i:s', time());
$startDate = time();
$created = $currentDate.' '.$currentTime;

require_once 'include/DB_Functions.php';
$db = new DB_Functions();
// json response array
$response = array("error" => FALSE);
if (isset($_POST["operation"])) {

    $CompanyToken = '840AFDA0-77CF-44E2-8673-33108BC35181';
    $Test_Product = 23820;
    $Test_Service = 23819;

    $Endpoint = 'https://secure.3gdirectpay.com/API/v6/';
    $VerityEndpoint = 'https://secure.3gdirectpay.com/API/v7/';

    if($_POST["operation"] == 'verifyToken') {
        $TransactionToken = $_POST["TransactionToken"];
        $verify = verifyToken($CompanyToken, $VerityEndpoint, $TransactionToken);
        echo json_encode($verify);
    } else if($_POST["operation"] == 'createToken') {
        $appointment_id = $_POST["id"];
        $type = $_POST['type'];
        $currency = 'KES';
        $txRef = $_POST["txRef"];
        $name = ltrim($_POST["name"]);
        if ($name == trim($name) && strpos($name, ' ') !== false) {
            $patient_name = explode(' ', $name);
            if (count($patient_name) == 2) {
                $first_name = $patient_name[0];
                $last_name = $patient_name[1];
            } else if (count($patient_name) >= 2){
                $first_name = $patient_name[0];
                $last_name = $patient_name[1].' '.$patient_name[2];
            } else {
                $first_name = $name;
                $last_name = $name;
            }
            
        } else {
            $first_name = $name;
            $last_name = $name;
        }
        $email = $_POST["email"];
        $country = 'KE';
        $SELECTED_COUNTRY_CODE = 'KE';
        $phone = $_POST["phone"];
        $amount = (integer) 1;

        $redirectURL = 'https://myhealthafrica.com/psi/verify-payment?id='.$appointment_id.'&type='.$type.'';
        $xml_request = '<?xml version="1.0" encoding="utf-8"?>
                        <API3G>
                            <CompanyToken>'.$CompanyToken.'</CompanyToken>
                            <Request>createToken</Request>
                            <Transaction>
                            <PaymentAmount>'.$amount.'</PaymentAmount>
                            <PaymentCurrency>'.$currency.'</PaymentCurrency>
                            <CompanyRefUnique>1</CompanyRefUnique>
                            <CompanyRef>'.$txRef.'</CompanyRef>
                            <RedirectURL>'.$redirectURL.'</RedirectURL>
                            <PTL>30</PTL>
                            <PTLtype>minutes</PTLtype>
                            <customerFirstName>'.$first_name.'</customerFirstName>
                            <customerLastName>'.$last_name.'</customerLastName>
                            <customerEmail>'.$email.'</customerEmail>
                            <customerCountry>'.$SELECTED_COUNTRY_CODE.'</customerCountry>
                            <customerPhone>'.$phone.'</customerPhone>
                            <CardHolderName>'.$name.'</CardHolderName>
                            <DefaultPayment>MO</DefaultPayment>
                            </Transaction>
                            <Services>
                            <Service>
                            <ServiceType>23819</ServiceType>
                            <ServiceDescription>Tunza Clinic Telemedicine Appointment</ServiceDescription>
                            <ServiceDate>'.$created.'</ServiceDate>
                            </Service>
                            </Services>
                            <Additional>
                            <BlockPayment>BT</BlockPayment>
                            <BlockPayment>PP</BlockPayment>
                            <BlockPayment>XP</BlockPayment>
                            </Additional>
                        </API3G>';
    
        // file_put_contents($name.'.xml', $xml_request);
        $curl = curl_init();
        curl_setopt_array($curl, array(
        CURLOPT_URL => $Endpoint,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => $xml_request,
        CURLOPT_HTTPHEADER => array(
            "Cache-Control: no-cache",
            "Content-Type: application/xml"
        ),
        ));
    
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
    
        if ($err) {
            echo "cURL Error #:" . $err;
        } else {
            $xml = simplexml_load_string($response);
            file_put_contents('Token-'.$txRef.'.xml', $response);
            // echo json_encode($xml);
        }
    }
}

function verifyToken($CompanyToken, $VerityEndpoint, $TransactionToken) {
        $xml_request = '<?xml version="1.0" encoding="utf-8"?>
                        <API3G>
                            <CompanyToken>'.$CompanyToken.'</CompanyToken>
                            <Request>verifyToken</Request>
                            <TransactionToken>'.$TransactionToken.'</TransactionToken>
                        </API3G>';

        $curl = curl_init();
        curl_setopt_array($curl, array(
        CURLOPT_URL => $VerityEndpoint,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => $xml_request,
        CURLOPT_HTTPHEADER => array(
            "Cache-Control: no-cache",
            "Content-Type: application/xml"
        ),
        ));
    
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
    
        if ($err) {
            echo "cURL Error #:" . $err;
        } else {
            $xml = simplexml_load_string($response);
            return $xml;
        }
}
?>