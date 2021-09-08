<div class="col-sm-12">
    <form class="col-md-12" id="onboarding_form" role="form" name="onboarding_form" method="post" enctype="multipart/form-data">
        <h3></h3>
        <fieldset style="text-align:left;">
            <div class="row">
                <div class="input-group">
                    <div class="col-12 col-md-12">
                        <label>State your medical concern</label>
                        <input id="medical-concern" name="medical-concern" class="form-control" placeholder="Medical concern" required/>
                        <div id="concern-error" class="col-12 col-md-12 alert alert-danger" style="display: none;"></div>
                    </div>
                </div>
            </div>
        </fieldset>
        <h3></h3>
        <fieldset style="text-align:left;">
            <div class="input-group">
                <div class="col-12 col-md-12">
                    <label>Briefly describe your medical concern (optional)</label>
                    <textarea id="medical-concern-desc" name="medical-concern-desc" class="form-control" rows="2" placeholder="Write your medical concern description here"></textarea>
                </div>
                <div id="concern-desc-error" class="col-12 col-md-12 alert alert-danger" style="display: none;"></div>
            </div>
        </fieldset>
        <h3></h3>
        <fieldset style="text-align:left;">
            <div class="input-group">
                <div class="col-12 col-md-12">
                    <label>Would you like to share any recent medical files with the doctor?</label>
                    <div>
                        <input type="radio" id="reports-yes" name="reports">
                        <label for="reports-yes">Yes</label><br>
                        <input type="radio" id="reports-no" name="reports">
                        <label for="reports-no">No</label><br>
                    </div>
                </div>
                <div class="uploads col-12 col-md-12" style="display: none;">
                    <label>Upload your recent medical reports (you can upload multiple reports)</label>
                    <div class="row col-12 col-md-12">
                        <input type="file" accept=".png,.jpg,.jpeg,.pdf,.docx,csv,.xlsx" id="medical-reports" name="medical-reports[]" multiple />
                    </div>
                </div>
                <div id="reports-error" class="col-12 col-md-12 alert alert-danger" style="display: none;"></div>
            </div>
        </fieldset>
        <h3></h3>
        <fieldset style="text-align:left;">
            <div class="input-group">
                <div class="col-12 col-md-12">
                    <label>Are you currently taking any prescribed medication?</label>
                    <div>
                        <input type="radio" id="medication-yes" name="medication">
                        <label for="medication-yes">Yes</label><br>
                        <input type="radio" id="medication-no" name="medication">
                        <label for="medication-no">No</label><br>
                    </div>
                    <input type="text" id="medication" name="medication" class="form-control" placeholder="Kindly describe prescribed medication you're currently taking" style="display: none;"/>
                </div>
                <div id="medication-error" class="col-12 col-md-12 alert alert-danger" style="display: none;"></div>
            </div>
        </fieldset>
        <h3></h3>
        <fieldset style="text-align:left;">
            <div class="input-group">
                <div class="col-12 col-md-12">
                    <label>Do you have any medication allergies?</label>
                    <div>
                        <input type="radio" id="allergies-yes" name="allergies">
                        <label for="allergies-yes">Yes</label><br>
                        <input type="radio" id="allergies-no" name="allergies">
                        <label for="allergies-no">No</label><br>
                    </div>
                    <input type="text" id="allergies" name="allergies" class="form-control" placeholder="Please describe your medication allergies" style="display: none;" />
                    <input type="hidden" name="id" value="<?php echo $appointment_id; ?>" />
                </div>
                <div id="allergies-error" class="col-12 col-md-12 alert alert-danger" style="display: none;"></div>
            </div>
        </fieldset>
    </form>
</div>