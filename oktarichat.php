<div class="chat-card no-border">
    <div class="oktari"><span class="">OktariChat</span></div>
    <div id="chat" class="conv-form-wrapper">
        <form id="chat-data" method="post" class="hidden" enctype="multipart/form-data">
            <input type="text" data-conv-question="Hello <?php echo $patient_first_name; ?>. Oktari here, Tunza Clinic assistant. I'll be connecting you to the doctor in a few. But first, kindly help us with these information." data-no-answer="true">
            <select name="medical-concern" data-conv-question="<?php echo $patient_first_name; ?>, kindly select your medical concern from the options provided below. You can select multiple." multiple>
                <option value="Family Planning">Family Planning</option>
                <option value="Rhesus Factor">Rhesus Factor</option>
                <option value="Non-Communicable Dieses">Non-Communicable Dieses</option>
                <option value="Child Care">Child Care</option>
                <option value="Tuberculosis">Tuberculosis</option>
                <option value="HIV & Aids">HIV & Aids</option>
                <option value="Others">Others</option>
            </select>
            <select data-conv-question="<?php echo $patient_first_name; ?>, would you like to briefly describe your medical condition?" name="second-question">
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <div data-conv-fork="second-question">
                <div data-conv-case="yes">
                    <input type="text" name="medical-condition-desc" data-conv-question="Kindly type the description of your medical condition.">
                    <input type="text" data-conv-question="Got it. Will pass it to daktari in a few." data-no-answer="true">
                </div>
            </div>
            <!-- <select name="third-question" data-conv-question="Would you like to share any recent medical files with our doctor?">
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <div data-conv-fork="third-question">
                <div data-conv-case="yes">
                    <input type="file" id="medical-reports" name="medical-reports[]" accept=".png,.jpg.jpeg,.pdf,.docx" data-conv-question="Kindly upload the medical reports/scans." multiple>
                </div>
            </div> -->
            <select name="fourth-question" data-conv-question="<?php echo $patient_first_name; ?>, are you currently taking any prescribed medication?">
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <div data-conv-fork="fourth-question">
                <div data-conv-case="yes">
                    <input type="text" name="medication" data-conv-question="Kindly state the medication you're currently using.">
                </div>
            </div>
            <select name="fifth-question" data-conv-question="<?php echo $patient_first_name; ?>, do you have any medical allergies?">
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <div data-conv-fork="fifth-question">
                <div data-conv-case="yes">
                    <input type="text" name="allergies" data-conv-question="Kindly state the medical allergies.">
                </div>
            </div>
            <input type="text" data-conv-question="Alright! Thank you <?php echo $patient_first_name; ?> for sharing this information with us." data-no-answer="true">
            <select name="proceed" data-conv-question="Kindly press the button below to proceed to waiting room.">
                <option value="Thank you Oktari">Proceed</option>
            </select>
        </form>
    </div>
</div>