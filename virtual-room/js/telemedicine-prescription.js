$(document).ready(function () {
    $(`#addNewPrescription`).find(`a[href="#next"]`).prop("id", "btnModalStepsId");
    $.ajax({
        url: "../../myonemedpro/operation/getPatientData.php",
        method: "POST",
        dataType: "json",
        data: { patientId: $("#telemed-iframe").data("appointment_id") },
        success: function (response) {
            $(`[name="patient_firstname"]`).val(response.first_name);
            $(`[name="patient_lastname"]`).val(response.last_name);
            $(`[name="patient_gender"]`).val(response.gender);
            $(`[name="patient_dob"]`).val(response.dob);
            $(`[name="patient_email"]`).val(response.email);
            $(`[name="patient_phone"]`).val(response.phone);
        }
    });
});

$("#addNewPrescription").steps({
    headerTag: "h4",
    bodyTag: "section",
    labels: {
        finish: "Send prescription"
    },
    onInit: function () {
        $("a[href$='previous']").hide();
    },
    onStepChanging: function (event, currentIndex, newIndex) {
        switch (currentIndex) {
            case 0:
                const validation_elements = [$(`#ePrescDrug1`), $(`#ePrescDosage1`), $(`#ePrescInstruction1`), $(`#ePrescValidUntil`)];
                let all_elements_valid = true;
                validation_elements.reverse().forEach(element => {
                    const html_element = element[0];
                    if (!html_element.checkValidity()) {
                        html_element.reportValidity();
                        all_elements_valid = false;
                        return false;
                    }
                });

                if (!all_elements_valid) {
                    return false;
                }
                break;
        }

        if (newIndex === 0) {
            $("a[href$='previous']").hide();
        } else {
            $("a[href$='previous']").show();
        }

        return true;
    },
    onStepChanged: function (event, currentIndex, priorIndex) {
        return true;
    },
    onFinishing: function (event, currentIndex) {
        return true;
    },
    onFinished: function (event, currentIndex) {
        $("#addNewPrescription").submit();
        $("#addNewPrescription").steps("previous");
    }
});