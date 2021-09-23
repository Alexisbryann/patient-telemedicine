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
        type = GetURLParameter('type'),
        TransactionToken = GetURLParameter('TransactionToken');
    if (appointment_id !== '' && TransactionToken !== '') {
        DPO_VerifyToken(TransactionToken);
    }

    function DPO_VerifyToken(TransactionToken) {
        $.ajax({
            url: "operation/DPO_API.php",
            method: "POST",
            data: {
                operation: 'verifyToken',
                TransactionToken: TransactionToken
            },
            dataType: "json",
            success: function(response) {
                if (response.Result == '000') { 
                    $.ajax({
                        url: "operation/bookingOperations.php",
                        method: "POST",
                        data: {
                            operation: 'payment',
                            id: appointment_id,
                            type: type,
                            TransactionToken: TransactionToken,
                            TransactionRef: response.TransactionRef,
                            ResultExplanation: response.ResultExplanation,
                            CustomerCreditType: response.CustomerCreditType,
                            TransactionCurrency: response.TransactionCurrency,
                            TransactionAmount: response.TransactionAmount,
                            TransactionNetAmount: response.TransactionNetAmount,
                            TransactionFinalAmount: response.TransactionFinalAmount,
                            TransactionSettlementDate: response.TransactionSettlementDate,
                            TransactionFinalCurrency: response.TransactionFinalCurrency,
                            CustomerName: response.CustomerName,
                            CustomerPhone: response.CustomerPhone,
                            CustomerEmail: response.CustomerEmail,
                            FraudAlert: response.TransactionFraudAlert,
                            FraudExplanation: response.TransactionFraudExplanation,
                            CustomerCity: response.CustomerCity,
                            AccRef: response.AccRef,
                            TransactionCreatedDate: response.TransactionCreatedDate,
                            TransactionExpiryDate: response.TransactionExpiryDate,
                            TransactionPaymentDate: response.TransactionPaymentDate,
                            CardType: response.CardType,
                            ApprovalNumber: response.ApprovalNumber,
                            ServiceDescription: response.ServiceDescription,
                            CustomerCountry: response.CustomerCountry,
                            TransactionRollingReserveAmount: response.TransactionRollingReserveDate,
                            TransactionRollingReserveDate: response.TransactionRollingReserveDate
                        },
                        dataType: "json",
                        success: function(result) {
                            if (result.response == 200) {
                                $('.payment-step-one').hide();
                                $('.payment-step-two').show(500);
                                setInterval(function () {
                                    window.location.href = 'https://www.myhealthafrica.com/psi/patient-setup.php?caseappid=' + result.id + '';
                                }, 5000);
                            } else if (response == 500) {
                                document.getElementById('error').innerHTML = '';
                                document.getElementById('error').innerHTML = 'Sorry. There was an error in updating your payment status. Kindly contact our support team for assistance.';
                                $('#error').show(500);
                            } 
                        }
                    });
                } else {
                    var tokenError = response.ResultExplanation;
                    document.getElementById('error').innerHTML = '';
                    document.getElementById('error').innerHTML = 'Sorry. There was an error in verifying your payment, please refresh the page. If the error persist, kindly contact our support team. The system exited with error message: '+ tokenError;
                    $('#error').show(500);
                }
            }
        });
    }
});