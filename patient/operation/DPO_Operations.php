<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'include/DB_Functions.php';
$db = new DB_Functions();
// json response array
$response = array("error" => FALSE);
if (isset($_POST["operation"]) && isset($_POST["id"])) {
	$appointment_id = $_POST["id"];
	$TransactionToken = $_POST["TransactionToken"];
	$TransactionAmount = $_POST["TransactionAmount"];
	$TransactionRef = $_POST["TransactionRef"];
	$ResultExplanation = $_POST["ResultExplanation"];
	$TransactionCurrency = $_POST["TransactionCurrency"];
	$TransactionFinalCurrency = $_POST["TransactionFinalCurrency"];
	$TransactionNetAmount = $_POST["TransactionNetAmount"];
	$CustomerName = $_POST["CustomerName"];
	$CustomerPhone = $_POST["CustomerPhone"];
	$CustomerEmail = $_POST["CustomerEmail"];
	$CustomerCountry = $_POST["CustomerCountry"];
	$ServiceDescription = $_POST["ServiceDescription"];
	$ApprovalNumber = $_POST["ApprovalNumber"];
	$CardType = $_POST["CardType"];
	$FraudAlert = $_POST["FraudAlert"];
	$FraudExplanation = $_POST["FraudExplanation"];
	$SubscriptionToken = $_POST["SubscriptionToken"];
	$CustomerToken = $_POST["CustomerToken"];
    if(isset($_POST["TransactionSettlementDate"])){
    	$TransactionSettlementDate = $_POST["TransactionSettlementDate"];
	} else $TransactionSettlementDate = '';
	if(isset($_POST["CustomerCity"])){
    	$CustomerCity = $_POST["CustomerCity"];
	} else $CustomerCity = '';
	if(isset($_POST["TransactionCreatedDate"])){
    	$TransactionCreatedDate = $_POST["TransactionCreatedDate"];
	} else $TransactionCreatedDate = '';
	if(isset($_POST["TransactionExpiryDate"])){
    	$TransactionExpiryDate = $_POST["TransactionExpiryDate"];
	} else $TransactionExpiryDate = '';
	if(isset($_POST["TransactionPaymentDate"])){
    	$TransactionPaymentDate = $_POST["TransactionPaymentDate"];
	} else $TransactionPaymentDate = '';
	
	if(isset($_POST["AccRef"])){
    	$AccRef = $_POST["AccRef"];
	} else {
    	$AccRef = '';
	}
	if(isset($_POST["CustomerCredit"])){
    	$CustomerCredit = $_POST["CustomerCredit"];
	} else {
    	$CustomerCredit = '';
	}
	if(isset($_POST["CustomerCreditType"])){
    	$CustomerCreditType = $_POST["CustomerCreditType"];
	} else {
    	$CustomerCreditType = '';
	}

	$user = $db->TunzaClinicTelemedicinePayment(
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
	);
	if ($user != false) {
		echo json_encode($user);
	}
} else {
	$response = 100;
	echo json_encode($response);
}

?>