<div>
    <div class="row">
        <div class="col-md-12">
            <div class="booking-card">
                <div class="sticky-top bg-white pb-2">
                    <div class="d-flex d-md-none w-100 justify-content-between align-items-center px-3">
                        <img src="images/psi/mha-psi-logo.png" id="mobile-page-logo">
                        <!--<span id="mobile-page-close" title="Close">&#x2715;</span>-->
                    </div>

                    <div class="d-flex px-3 flex-column d-md-none" id="mobile-booking-progress-container">
                        <div class="d-flex justify-content-between">
                            <strong id="step-title">Appointment Details</strong>
                            <span>Step <span id="booking-form-step-number">1</span> of 2</span>
                        </div>
                        <progress class="w-100" max="2" value="1" id="booking-form-progress"></progress>
                    </div>
                </div>
                <div class="card-body no-padding height-12">
                    <div class="row text-center m-t-10 " style="border: solid 1px gray;">
                        <div class="col-md-12 telemed-step-one" style="padding:0px">
                            <?php require_once 'booking-form.php'; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- end page content -->
</div>