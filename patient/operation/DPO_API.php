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
        $email = $_POST["email"];
        $TransactionToken = $_POST["TransactionToken"];
        $verify = verifyToken($CompanyToken, $VerityEndpoint, $TransactionToken, $Endpoint, $email);
        echo json_encode($verify);
    } else if($_POST["createToken"]) {
        $appointment_id = $_POST["id"];
        $currency = $_POST["currency"];
        $txRef = $_POST["txRef"];
        $fullName = ltrim($_POST["fullName"]);
        $email = $_POST["email"];
        $country = $_POST["country"];
        $SELECTED_COUNTRY_CODE = $_POST["SELECTED_COUNTRY_CODE"];
        $phone = $_POST["phone"];
        $amount = (integer) $_POST["amount"];

        $redirectURL = 'https://myhealthafrica.com/psi/verify-payment?id='.$appointment_id.'&email='.$email.'';
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
                            <PTL>15</PTL>
                            <PTLtype>minutes</PTLtype>
                            <customerFirstName>'.$fullName.'</customerFirstName>
                            <customerLastName>'.$fullName.'</customerLastName>
                            <customerEmail>'.$email.'</customerEmail>
                            <customerCountry>'.$SELECTED_COUNTRY_CODE.'</customerCountry>
                            <customerPhone>'.$phone.'</customerPhone>
                            <CardHolderName>'.$fullName.'</CardHolderName>
                            <DefaultPayment>MO</DefaultPayment>
                            </Transaction>
                            <Services>
                            <Service>
                            <ServiceType>23819</ServiceType>
                            <ServiceDescription>Tunza Clinic Telemedicine</ServiceDescription>
                            <ServiceDate>'.$created.'</ServiceDate>
                            </Service>
                            </Services>
                            <Additional>
                            <BlockPayment>BT</BlockPayment>
                            <BlockPayment>PP</BlockPayment>
                            <BlockPayment>XP</BlockPayment>
                            </Additional>
                        </API3G>';
    
        // file_put_contents($fullName.'.xml', $xml_request);
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
            echo json_encode($xml);
        }
    }
}

function verifyToken($CompanyToken, $VerityEndpoint, $TransactionToken, $Endpoint, $email) {
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