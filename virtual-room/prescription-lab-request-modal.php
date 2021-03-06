<div class="modal" id="consultation-review-modal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <!-- <div class="modal-header py-2">
                <h5 class="modal-title mt-0">Consultation Review</h5>
                <button type="button" class="close pt-1" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div> -->
            <div class="modal-body">
                <ul class="nav nav-pills mb-3 justify-content-center flex-wrap flex-md-nowrap" role="tablist">
                    <li class="nav-item w-100 mx-0 mx-md-2">
                        <a class="nav-link active rounded-0" id="notes-tab" data-toggle="pill" href="#notes" role="tab" aria-controls="notes" aria-selected="true" title="Review notes">Review notes</a>
                    </li>
                    <li class="nav-item w-100 mx-0 mx-md-2">
                        <a class="nav-link rounded-0" id="prescription-tab" data-toggle="pill" href="#prescription" role="tab" aria-controls="prescription" aria-selected="false" title="Write a prescription">Write a prescription</a>
                    </li>
                    <li class="nav-item w-100 mx-0 mx-md-2">
                        <a class="nav-link rounded-0" id="lab-request-tab" data-toggle="pill" href="#lab-request" role="tab" aria-controls="lab-request" aria-selected="false" title="Write a lab request">Write a lab request</a>
                    </li>
                </ul>
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade mx-2 active show" id="notes" role="tabpanel" aria-labelledby="notes-tab">
                        <textarea class="form-control w-100" rows="3" placeholder="Enter/update notes..." id="notes-review-textarea"></textarea>
                        <span class="btn btn-success mt-2 float-right py-1" id="notes-review-save" data-target="notes-review-textarea">Save</span>
                    </div>
                    <div class="tab-pane fade mx-2" id="prescription" role="tabpanel" aria-labelledby="prescription-tab">
                        <form class="telemed-forms" role="form" name="addNewPrescription" id="addNewPrescription" method="post" enctype="multipart/form-data">
                            <!-- prescription details step -->
                            <h4></h4>
                            <section>
                                <h3>Prescription details</h3>
                                <?php require "{$_SERVER['DOCUMENT_ROOT']}/myonemedpro/e-prescription-details-section.html" ?>
                            </section>

                            <!-- prescription confirmation step -->
                            <h4></h4>
                            <section>
                                <h3>Confirm and send</h3>
                                <?php require "{$_SERVER['DOCUMENT_ROOT']}/myonemedpro/e-prescription-confirmation-section.html" ?>
                            </section>
                            <input id="patient_firstname" name="patient_firstname" type="hidden">
                            <input id="patient_lastname" name="patient_lastname" type="hidden">
                            <input id="patient_gender" name="patient_gender" type="hidden">
                            <input id="patient_dob" name="patient_dob" type="hidden">
                            <input id="patient_email" name="patient_email" type="hidden">
                            <input id="patient_phone" name="patient_phone" type="hidden">
                            <input name="doctorPostId" type="hidden" value="<?php echo $_SESSION['doctorid']["dr_post_id"] ?>">
                        </form>
                    </div>
                    <div class="tab-pane fade mx-2" id="lab-request" role="tabpanel" aria-labelledby="lab-request-tab">
                        <form class="telemed-forms" role="form" name="diagnosticsForm" id="diagnosticsForm" method="post" enctype="multipart/form-data">
                            <!-- prescription details step -->
                            <h4></h4>
                            <section>
                                <h3>Lab request details</h3>
                                <?php require "{$_SERVER['DOCUMENT_ROOT']}/myonemedpro/diagnostics-test-details-section.html" ?>
                            </section>

                            <!-- prescription confirmation step -->
                            <h4></h4>
                            <section>
                                <h3>Confirm and send</h3>
                                <?php require "{$_SERVER['DOCUMENT_ROOT']}/myonemedpro/diagnostics-confirm-details-section.html" ?>
                            </section>
                            <input id="patient_diagnostic_firstname" name="patient_diagnostic_firstname" type="hidden">
                            <input id="patient_diagnostic_lastname" name="patient_diagnostic_lastname" type="hidden">
                            <input id="patient_diagnostic_gender" name="patient_diagnostic_gender" type="hidden">
                            <input id="patient_diagnostic_dob" name="patient_diagnostic_dob" type="hidden">
                            <input id="patient_diagnostic_email" name="patient_diagnostic_email" type="hidden">
                            <input id="patient_diagnostic_phone" name="patient_diagnostic_phone" type="hidden">
                            <input name="doctorDiagnosticPostId" type="hidden" value="<?php echo $_SESSION['doctorid']["dr_post_id"] ?>">
                        </form>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <span class="border btn-secondary px-2 mr-auto mr-md-2" data-dismiss="modal"><a>Close</a></span>
                <span class="border px-2 d-flex align-items-center" title="Return to the queue."><a href="https://www.myhealthafrica.com/myonemedpro/medondemand">Return to queue&nbsp;&nbsp;</a><i class="fa fa-chevron-right"></i></span>
            </div>
        </div>
    </div>
</div>