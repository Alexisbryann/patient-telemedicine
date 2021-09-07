$(document).ready(function() {

    function GetURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }
    var appointment_id = GetURLParameter('id'),
        email = GetURLParameter('email'),
        TransactionToken = GetURLParameter('TransactionToken');
    if (appointment_id !== '' && TransactionToken !== '') {
        DPO_VerifyToken(TransactionToken, email);
    }

    function DPO_VerifyToken(TransactionToken, email) {
        $.ajax({
            url: "operation/DPO_API.php",
            method: "POST",
            data: {
                operation: 'verifyToken',
                TransactionToken: TransactionToken,
                email: email
            },
            dataType: "json",
            success: function(response) {
                if (response['verify']['Result'] == '000') { 
                    var TransactionRef = response['verify']['TransactionRef'],
                        ResultExplanation = response['verify']['ResultExplanation'],
                        CustomerCreditType = response['verify']['CustomerCreditType'],
                        TransactionCurrency = response['verify']['TransactionCurrency'],
                        TransactionAmount = response['verify']['TransactionAmount'],
                        TransactionNetAmount = response['verify']['TransactionFinalAmount'],
                        TransactionSettlementDate = response['verify']['TransactionSettlementDate'],
                        TransactionFinalCurrency = response['verify']['TransactionFinalCurrency'],
                        CustomerName = response['verify']['CustomerName'],
                        CustomerPhone = response['verify']['CustomerPhone'],
                        CustomerEmail = response['verify']['CustomerEmail'],
                        FraudAlert = response['verify']['TransactionFraudAlert'],
                        FraudExplanation = response['verify']['TransactionFraudExplanation'],
                        SubscriptionToken = response['SubscriptionToken'],
                        CustomerToken = response['CustomerToken'],
                        CustomerCity = response['verify']['CustomerCity'],
                        AccRef = response['verify']['AccRef'],
                        TransactionCreatedDate = response['verify']['TransactionCreatedDate'],
                        TransactionExpiryDate = response['verify']['TransactionExpiryDate'],
                        TransactionPaymentDate = response['verify']['TransactionPaymentDate'],
                        CardType =  response['verify']['CardType'],
                        ApprovalNumber =  response['verify']['ApprovalNumber'],
                        ServiceDescription =  response['verify']['ServiceDescription'],
                        CustomerCountry = response['verify']['CustomerCountry'],
                        TransactionRollingReserveAmount = response['verify']['TransactionRollingReserveAmount'],
                        TransactionRollingReserveDate =response['verify']['TransactionRollingReserveDate'];
                    $.ajax({
                        url: "operation/DPO_Operations.php",
                        method: "POST",
                        data: {
                            operation: operation,
                            action: action,
                            facility_id: facility_id,
                            data: post_data,
                            TransactionToken: TransactionToken,
                            TransactionRef: TransactionRef,
                            ResultExplanation: ResultExplanation,
                            CustomerCreditType: CustomerCreditType,
                            TransactionCurrency: TransactionCurrency,
                            TransactionAmount: TransactionAmount,
                            TransactionNetAmount: TransactionNetAmount,
                            TransactionSettlementDate: TransactionSettlementDate,
                            TransactionFinalCurrency: TransactionFinalCurrency,
                            CustomerName: CustomerName,
                            CustomerPhone: CustomerPhone,
                            CustomerEmail: CustomerEmail,
                            FraudAlert: FraudAlert,
                            FraudExplanation: FraudExplanation,
                            SubscriptionToken: SubscriptionToken,
                            CustomerToken: CustomerToken,
                            CustomerCity: CustomerCity,
                            AccRef: AccRef,
                            TransactionCreatedDate: TransactionCreatedDate,
                            TransactionExpiryDate: TransactionExpiryDate,
                            TransactionPaymentDate: TransactionPaymentDate,
                            CardType: CardType,
                            ApprovalNumber: ApprovalNumber,
                            ServiceDescription: ServiceDescription,
                            CustomerCountry: CustomerCountry,
                            TransactionRollingReserveAmount: TransactionRollingReserveDate,
                            TransactionRollingReserveDate: TransactionRollingReserveDate
                        },
                        dataType: "json",
                        success: function(response) {
                            if (response == 200) {
                                window.history.replaceState({}, document.title, "/" + "myhealthafrica.com/subscription/verify_payment");
                                var text_msg;
                                if (operation == 'subscription-payment') {
                                    text_msg = 'Your subscription payment is successful. A link to set up your account password has been sent to your email address.';
                                } else if (operation == 'pe-payment') {
                                    text_msg = 'Your patient experience subscription payment is successful. Login to your OneMed Pro account to start using patient experience.';
                                } else if (operation == 'subscription-upgrade') {
                                    text_msg = 'Your OneMed Pro subscription upgrade payment is successful. Login now to access the new features added to your account.';
                                } else if (operation == 'Subsequent-Subscription') {
                                    text_msg = 'Your subscription renewal payment is successful. Click on continue button to access OneMed Pro features.';
                                }
                                swal({
                                    title: "Success",
                                    text: text_msg,
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonColor: "#37ce8a",
                                    confirmButtonText: "Continue",
                                    closeOnConfirm: false,
                                }, function(isConfirm) {
                                    if (isConfirm) {
                                        window.location.replace("https://myhealthafrica.com/myonemedpro");
                                    }
                                });
                            } else if (response == 400) {
                                swal({
                                    title: "Error",
                                    text: "Your subscription payment failed to complete. Please try again.",
                                    type: "error",
                                    timer: 5000,
                                    showConfirmButton: false
                                });
                            } else if (response == 500) {
                                swal({
                                    title: "Error",
                                    text: "Something went wrong while processing your request. Please contact My Health Africa support team for help. Thank you",
                                    type: "error",
                                    timer: 5000,
                                    showConfirmButton: false
                                });
                            } 
                        }
                    });
                } else {
                    var tokenError = response.ResultExplanation;
                    swal({
                        title: "Verification failed",
                        text: tokenError,
                        type: "error",
                        timer: 6000,
                        showConfirmButton: false
                    });
                }
            }
        });
    }
});