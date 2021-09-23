$(document).ready(function() {
    $('#addEPrescriptionModal').modalSteps();
    // document.getElementById('btnModalStepsId').disabled = true;
    $('#caseReview').hide();
    $('#caseDiagnosis').hide();

    $(document).on('click', '#btnShowReviewDiv', function() {
        $('#caseReview').slideToggle("slow");
        $('#caseDiagnosis').slideToggle("slow");
    });

    // $('#addNewPrescription').on('keyup', 'input', function() {
    //     var first_name = $('#patient_firstname').val();
    //     var last_name = $('#patient_lastname').val();
    //     var gender = $('#patient_gender').val();
    //     var dob = $('#patient_dob').val();
    //     var email = $('#patient_email').val();
    //     var phone = $('#patient_phone').val();
    //     if (first_name != '' && last_name != '' && gender !== '' && dob != '' && email !== '' && phone != '') {
    //         document.getElementById('btnModalStepsId').disabled = false;
    //     } else {
    //         document.getElementById('btnModalStepsId').disabled = true;
    //     }
    // });

    $(document).on('click', '.btnModalSteps', function() {
        var elem = document.getElementById('btnModalStepsId');
        var txt = elem.textContent || elem.innerText;
        var prescDrugOne = $('#ePrescDrug1').val();
        var prescDosageOne = $('#ePrescDosage1').val();
        var prescDrugRemarksOne = $('#ePrescInstruction1').val();
        var prescValidity = $('#ePrescValidUntil').val();
        if (txt == 'Confirm') {
            $("#btnSubmitPresc").show();
            $("#btnModalStepsId").hide();
        } else {
            $("#btnSubmitPresc").hide();
            $("#btnModalStepsId").show();
        }
        if (prescDrugOne != '' && prescDosageOne != '' && prescDrugRemarksOne != '' && prescValidity != '') {
            document.getElementById('btnSubmitPresc').disabled = false;
        } else {
            document.getElementById('btnSubmitPresc').disabled = true;
        }

    });

    $(document).on('click', '.btnPrevious', function() {
        var elem = document.getElementById('btnPreviousId');
        var txt = elem.textContent || elem.innerText;

        if (txt == 'Previous' || txt == 'Next') {
            $("#btnSubmitPresc").hide();
            $("#btnModalStepsId").show();
        } else {
            $("#btnSubmitPresc").show();
            $("#btnModalStepsId").hide();
        }
    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("patient_dob").setAttribute("max", today);
    document.getElementById("ePrescValidUntil").setAttribute("min", today);

    //Submitting prescription form
    $(document).on('submit', '#addNewPrescription', function(event) {
        event.preventDefault();
        var doctorPostId = $('#doctorPostId').val();
        var prescValidity = $('#ePrescValidUntil').val();
        var prescDrugOne = $('#ePrescDrug1').val();
        var prescDosageOne = $('#ePrescDosage1').val();
        var prescDrugRemarksOne = $('#ePrescInstruction1').val();
        
        let sendSMS = $("#send-to-sms").prop("checked") ? "sendSMS" : "";
        
        if (prescDrugOne !== '' && prescDosageOne !== '' && prescDrugRemarksOne !== '' && prescValidity !== '') {
            $.ajax({
                url: "operation/ePrescription.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function(data) {
                    var parsed = JSON.parse(data);
                    if (parsed.response == 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Prescription has been successfully added.',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        });
                        var prescNumber = parsed.prescNumber;
                        $.ajax({
                            url: "operation/sendPrescription.php",
                            method: 'POST',
                            data: {doctorPostId: doctorPostId, prescNumber: prescNumber, sendSMS: sendSMS },
                            dataType: "json",
                            success: function(data) {
                                if (data == 200) {
                                    $.toast({
                                        heading: 'Success',
                                        text: 'An e-Prescription pdf document has been sent to patient email, the patient will receive it in a moment.',
                                        icon: 'success',
                                        position: 'bottom-right',
                                        showHideTransition: 'slide'
                                    })
                                }
                            },
                            error: function(error) {
                                console.log(error);
                            }
                        });
                        $('#addEPrescriptionModal').modal('hide');
                        $('#addNewPrescription')[0].reset();
                        $('#btnSubmitPresc').hide().prop("disabled", false).html("Confirm");
                        $('#btnModalStepsId').show();
                        $('#ePrescriptions').DataTable().ajax.reload();
                        
                    } else if (data == 403) { //throw error when unauthorized user tries to make prescription
                        $.toast({
                            heading: 'Error',
                            text: 'Your account is not authorized to make prescriptions.',
                            icon: 'error',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                    } else if (data == 700) {
                        $.toast({
                            heading: 'Error',
                            text: 'You have not fully filled the prescription form.',
                            icon: 'error',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                    } else if (data == 300) {
                        $.toast({
                            heading: 'Error',
                            text: 'You have entered an invalid email address!.',
                            icon: 'error',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                    } else {
                        $.toast({
                            heading: 'Error',
                            text: 'Something went wrong, please try again.',
                            icon: 'error',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                    }
                }
            });
            // $.ajax({
            //     url: "operation/sendPrescription.php",
            //     method: 'POST',
            //     data: new FormData(this),
            //     contentType: false,
            //     processData: false,
            // });
        } else {
            $.toast({
                heading: 'Warning',
                text: 'Kindly fill all the required fields correctly and try again.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }

    });
    
    // error message when unauthorized user tries to make prescription
     $('#NavbarAddEPrescription, #openPrescModal').on('click', function() {
        var doctor_post_id = $(this).attr('data-doctor_post_id');

        $.ajax({
            url: "operation/getDoctorPrescriptionAuthorizationStatus.php",
            method: 'POST',
            data: { doctorPostId:doctor_post_id },
            dataType: "json",
            success: function(data) {
                if (data == "unauthorized") {
                    $('#addNewPrescription .modal-body').html('<div class="prescription-unauthorized d-flex align-items-center justify-content-center m-3"><span class = "d-flex justify-content-center align-items-center flex-column flex-md-row"><!--<i class = "fa fa-exclamation-circle mb-4 mb-md-0" style = "font-size: 2.5em"></i>--><span class="ml-md-3 p-5" style = "color: #fff">Kindly note that the e-Prescription feature has not been activated for your account. To activate this, please contact your Business Development Executive or <a class="text-dark" href="mailto:support@myhealthafrica.com">support@myhealthafrica.com.</a> Please note this feature is only accessible if you are a registered medical professional legally allowed to prescribe medication in your country. <br><br>There are a number of benefits for activating this feature which include:<br><ul><li>Save time - it takes less time to send an e-Prescription than to find your prescription pad, write the prescription and give it to your patient. Quickly fill in the e-Prescription fields and send a professional e-Prescription in seconds.</li><li>Keep a secure record of all prescriptions.</li><li>Increase patient safety and reduce errors when writing prescriptions.</li><li>Reconcile medication history quickly for any patient.</li> <li>Reduce lost prescriptions for your patients, as all e-Prescriptions are sent to the patients email.</li> <li>Spend less time on prescription refills.</li> <li>Provide a better experience to your patients and allow them to easily order medication online.</li> </ul></span> </span> </div>');
                    $('#addNewPrescription [data-orientation="next"]').prop('disabled', true);
                    $('#addEPrescriptionModal .modal-title').text('e-Prescription Patient Details').removeClass('js-title-step');
                }
            }
        });
    });

});


    //Submitting Diagnostic form
    $(document).on('submit', '#addNewdiagnostic', function(event) {
        event.preventDefault();
        var doctorPostId = $('#doctorPostId').val();
        var appointment_id = $('#qtdappointment_id').val();
        var ediagnostic1 = $('#ediagnostic1').val();
        var edgremarks1 = $('#edgremarks1').val();
        //var prescDrugRemarksOne = $('#ePrescInstruction1').val();
        if (ediagnostic1 != '' && edgremarks1 != '') {
            $.ajax({
                url: "operation/ediagnostics.php",
                method: 'POST',
                data: new FormData(this),
                contentType: false,
                processData: false,
                success: function(data) {
                    var parsed = JSON.parse(data);
                    if (parsed.response == 200) {
                        $.toast({
                            heading: 'Success',
                            text: 'Test has been successfully added.',
                            icon: 'success',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        });
                        
                        // disable diagnostic button and change color after saving
                        $('[data-appt_id = "' + appointment_id + '"]').removeClass('diagnostic').addClass('label-success').css('color', 'white').html('<i class="fa fa-check-circle"></i>Diagnostic Saved').prop('disabled', 'true');
                          $('#diagnosticque').modal('hide');
                        $('#addNewdiagnostic')[0].reset();
                        // var prescNumber = parsed.prescNumber;
                        // $.ajax({
                        //     url: "operation/sendPrescription.php",
                        //     method: 'POST',
                        //     data: {doctorPostId: doctorPostId, prescNumber: prescNumber },
                        //     dataType: "json",
                        //     success: function(data) {
                        //         if (data == 200) {
                        //             $.toast({
                        //                 heading: 'Success',
                        //                 text: 'An e-Prescription pdf document has been sent to patient email, the patient will receive it in a moment.',
                        //                 icon: 'success',
                        //                 position: 'bottom-right',
                        //                 showHideTransition: 'slide'
                        //             })
                        //         } 
                        //     }
                        // });
                       // $('#addEPrescriptionModal').modal('hide');
                        //$('#addNewPrescription')[0].reset();
                       // $('#btnSubmitPresc').hide();
                       // $('#btnModalStepsId').show();
                       // $('#ePrescriptions').DataTable().ajax.reload();
                    } else if (data == 300) {
                        $.toast({
                            heading: 'Error',
                            text: 'You have entered an invalid email address!.',
                            icon: 'error',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                    } else {
                        $.toast({
                            heading: 'Error',
                            text: 'Something went wrong, please try again.',
                            icon: 'error',
                            position: 'bottom-right',
                            showHideTransition: 'slide'
                        })
                    }
                }
            });
        } else {
            $.toast({
                heading: 'Warning',
                text: 'Kindly fill all the required fields correctly and try again.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }

    });

$(document).ready(function() {
    $('#btnSubmitPresc').hide();
    $('#addForm2').hide();
    $('#addForm3').hide();
    $('#addForm4').hide();
    $('#addForm5').hide();
    $('#addForm6').hide();
    $('#addForm7').hide();
    $('#addForm8').hide();
    $('.btnShowForm3').hide();
    $('.btnShowForm4').hide();
    $('.btnShowForm5').hide();
    $('.btnShowForm6').hide();
    $('.btnShowForm7').hide();
    $('.btnShowForm8').hide();

    $('#ePrescNo1').hide();
    $('#ePrescNo2').hide();
    $('#ePrescNo3').hide();
    $('#ePrescNo4').hide();
    $('#ePrescNo5').hide();
    $('#ePrescNo6').hide();
    $('#ePrescNo7').hide();
    $('#ePrescNo8').hide();

    $('#confirmePrescDrug2').hide();
    $('#confirmePrescDrug3').hide();
    $('#confirmePrescDrug4').hide();
    $('#confirmePrescDrug5').hide();
    $('#confirmePrescDrug6').hide();
    $('#confirmePrescDrug7').hide();
    $('#confirmePrescDrug8').hide();

    $('#confirmePescDosage2').hide();
    $('#confirmePescDosage3').hide();
    $('#confirmePescDosage4').hide();
    $('#confirmePescDosage5').hide();
    $('#confirmePescDosage6').hide();
    $('#confirmePescDosage7').hide();
    $('#confirmePescDosage8').hide();

    $('#confirmePrescInstruction2').hide();
    $('#confirmePrescInstruction3').hide();
    $('#confirmePrescInstruction4').hide();
    $('#confirmePrescInstruction5').hide();
    $('#confirmePrescInstruction6').hide();
    $('#confirmePrescInstruction7').hide();
    $('#confirmePrescInstruction8').hide();

    var btnNext = $("#btnModalStepsId");
    $(btnNext).click(function() {

        var drug1 = $('#ePrescDrug1').val();
        var drug2 = $('#ePrescDrug2').val();
        var drug3 = $('#ePrescDrug3').val();
        var drug4 = $('#ePrescDrug4').val();
        var drug5 = $('#ePrescDrug5').val();
        var drug6 = $('#ePrescDrug6').val();
        var drug7 = $('#ePrescDrug7').val();
        var drug8 = $('#ePrescDrug8').val();

        var dosage1 = $('#ePrescDosage1').val();
        var dosage2 = $('#ePrescDosage2').val();
        var dosage3 = $('#ePrescDosage3').val();
        var dosage4 = $('#ePrescDosage4').val();
        var dosage5 = $('#ePrescDosage5').val();
        var dosage6 = $('#ePrescDosage6').val();
        var dosage7 = $('#ePrescDosage7').val();
        var dosage8 = $('#ePrescDosage8').val();

        var drug_remarks1 = $('#ePrescInstruction1').val();
        var drug_remarks2 = $('#ePrescInstruction2').val();
        var drug_remarks3 = $('#ePrescInstruction3').val();
        var drug_remarks4 = $('#ePrescInstruction4').val();
        var drug_remarks5 = $('#ePrescInstruction5').val();
        var drug_remarks6 = $('#ePrescInstruction6').val();
        var drug_remarks7 = $('#ePrescInstruction7').val();
        var drug_remarks8 = $('#ePrescInstruction8').val();

        document.getElementById('confirmePrescDrug1').innerHTML = drug1;
        document.getElementById('confirmePrescDrug2').innerHTML = drug2;
        document.getElementById('confirmePrescDrug3').innerHTML = drug3;
        document.getElementById('confirmePrescDrug4').innerHTML = drug4;
        document.getElementById('confirmePrescDrug5').innerHTML = drug5;
        document.getElementById('confirmePrescDrug6').innerHTML = drug6;
        document.getElementById('confirmePrescDrug7').innerHTML = drug7;
        document.getElementById('confirmePrescDrug8').innerHTML = drug8;

        document.getElementById('confirmePescDosage1').innerHTML = dosage1;
        document.getElementById('confirmePescDosage2').innerHTML = dosage2;
        document.getElementById('confirmePescDosage3').innerHTML = dosage3;
        document.getElementById('confirmePescDosage4').innerHTML = dosage4;
        document.getElementById('confirmePescDosage5').innerHTML = dosage5;
        document.getElementById('confirmePescDosage6').innerHTML = dosage6;
        document.getElementById('confirmePescDosage7').innerHTML = dosage7;
        document.getElementById('confirmePescDosage8').innerHTML = dosage8;

        document.getElementById('confirmePrescInstruction1').innerHTML = drug_remarks1;
        document.getElementById('confirmePrescInstruction2').innerHTML = drug_remarks2;
        document.getElementById('confirmePrescInstruction3').innerHTML = drug_remarks3;
        document.getElementById('confirmePrescInstruction4').innerHTML = drug_remarks4;
        document.getElementById('confirmePrescInstruction5').innerHTML = drug_remarks5;
        document.getElementById('confirmePrescInstruction6').innerHTML = drug_remarks6;
        document.getElementById('confirmePrescInstruction7').innerHTML = drug_remarks7;
        document.getElementById('confirmePrescInstruction8').innerHTML = drug_remarks8;

        if ($('#ePrescDrug1').val() != '') {
            $('#confirmePrescDrug1').show();
            $('#confirmePescDosage1').show();
            $('#confirmePrescInstruction1').show();
            $('#ePrescNo1').show();
        }
        if ($('#ePrescDrug2').val() != '') {
            $('#confirmePrescDrug2').show();
            $('#confirmePescDosage2').show();
            $('#confirmePrescInstruction2').show();
            $('#ePrescNo2').show();
        }
        if ($('#ePrescDrug3').val() != '') {
            $('#confirmePrescDrug3').show();
            $('#confirmePescDosage3').show();
            $('#confirmePrescInstruction3').show();
            $('#ePrescNo3').show();
        }
        if ($('#ePrescDrug4').val() != '') {
            $('#confirmePrescDrug4').show();
            $('#confirmePescDosage4').show();
            $('#confirmePrescInstruction4').show();
            $('#ePrescNo4').show();
        }
        if ($('#ePrescDrug5').val() != '') {
            $('#confirmePrescDrug5').show();
            $('#confirmePescDosage5').show();
            $('#confirmePrescInstruction5').show();
            $('#ePrescNo5').show();
        }
        if ($('#ePrescDrug6').val() != '') {
            $('#confirmePrescDrug6').show();
            $('#confirmePescDosage6').show();
            $('#confirmePrescInstruction6').show();
            $('#ePrescNo6').show();
        }
        if ($('#ePrescDrug7').val() != '') {
            $('#confirmePrescDrug7').show();
            $('#confirmePescDosage7').show();
            $('#confirmePrescInstruction7').show();
            $('#ePrescNo7').show();
        }
        if ($('#ePrescDrug8').val() != '') {
            $('#confirmePrescDrug8').show();
            $('#confirmePescDosage8').show();
            $('#confirmePrescInstruction8').show();
            $('#ePrescNo8').show();
        }

    });

    var add_button2 = $(".add_form2");
    var add_button3 = $(".add_form3");
    var add_button4 = $(".add_form4");
    var add_button5 = $(".add_form5");
    var add_button6 = $(".add_form6");
    var add_button7 = $(".add_form7");
    var add_button8 = $(".add_form8");
    $(add_button2).click(function() {
        $('#addForm2').show(1000);
        $('.btnShowForm3').show(1000);

    });
    $(add_button3).click(function() {
        $('#addForm3').show(1000);
        $('.btnShowForm4').show(1000);

    });
    $(add_button4).click(function() {
        $('#addForm4').show(1000);
        $('.btnShowForm5').show(1000);

    });
    $(add_button5).click(function() {
        $('#addForm5').show(1000);
        $('.btnShowForm6').show(1000);

    });
    $(add_button6).click(function() {
        $('#addForm6').show(1000);
        $('.btnShowForm7').show(1000);

    });
    $(add_button7).click(function() {
        $('#addForm7').show(1000);
        $('.btnShowForm8').show(1000);

    });
    $(add_button8).click(function() {
        $('#addForm8').show(1000);

    });
    $('.remove_form1').click(function() {
        $('#addForm1').hide(1000);
        $('.btnShowForm2').hide(1000);
        $('input[name=ePrescDrug1').val('');
        $('input[name=ePrescDosage1').val('');
        $('input[name=ePrescInstruction1').val('');
        $('#ePrescNo1').hide();

    });
    $('.remove_form2').click(function() {
        $('#addForm2').hide(1000);
        $('.btnShowForm3').hide(1000);
        $('input[name=ePrescDrug2').val('');
        $('input[name=ePrescDosage2').val('');
        $('input[name=ePrescInstruction2').val('');
        $('#ePrescNo2').hide();
    });
    $('.remove_form3').click(function() {
        $('#addForm3').hide(1000);
        $('.btnShowForm4').hide(1000);
        $('input[name=ePrescDrug3').val('');
        $('input[name=ePrescDosage3').val('');
        $('input[name=ePrescInstruction3').val('');
        $('#ePrescNo3').hide();
    });
    $('.remove_form4').click(function() {
        $('#addForm4').hide(1000);
        $('.btnShowForm5').hide(1000);
        $('input[name=ePrescDrug4').val('');
        $('input[name=ePrescDosage4').val('');
        $('input[name=ePrescInstruction4').val('');
        $('#ePrescNo4').hide();
    });
    $('.remove_form5').click(function() {
        $('#addForm5').hide(1000);
        $('.btnShowForm6').hide(1000);
        $('input[name=ePrescDrug5').val('');
        $('input[name=ePrescDosage5').val('');
        $('input[name=ePrescInstruction5').val('');
        $('#ePrescNo5').hide();
    });
    $('.remove_form6').click(function() {
        $('#addForm6').hide(1000);
        $('.btnShowForm7').hide(1000);
        $('input[name=ePrescDrug6').val('');
        $('input[name=ePrescDosage6').val('');
        $('input[name=ePrescInstruction6').val('');
        $('#ePrescNo6').hide();
    });
    $('.remove_form7').click(function() {
        $('#addForm7').hide(1000);
        $('.btnShowForm8').hide(1000);
        $('input[name=ePrescDrug7').val('');
        $('input[name=ePrescDosage7').val('');
        $('input[name=ePrescInstruction7').val('');
        $('#ePrescNo7').hide();
    });
    $('.remove_form8').click(function() {
        $('#addForm8').hide(1000);
        $('input[name=ePrescDrug8').val('');
        $('input[name=ePrescDosage8').val('');
        $('input[name=ePrescInstruction8').val('');
        $('#ePrescNo8').hide();
    });

});

// change #addNewPrescription submit button to loader after it's clicked once


$('#btnSubmitPresc').on('click', function(){
    $('#addNewPrescription').submit();
    $(this).prop('disabled', true).html(' <strong>Sending...&nbsp;&nbsp;</strong> <div class="loader" role="status"></div>');
});