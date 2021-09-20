<div class="col-md-12" style="padding:0px">
    <div class="booking-step col-md-12" style="border-bottom: solid 1px gray;">
        <label>
            <input type="radio" id="appointment" name="radio-button" checked />
            <span>Appointment Details</span>
        </label>
        <label>
            <hr>
        </label>
        <label>
            <input type="radio" id="confirm" name="radio-button" />
            <span>Confirm details</span>
        </label>
    </div>
    <form class="col-md-12" style="padding:0px" id="booking-form" role="form" name="onboarding_form" method="post" enctype="multipart/form-data">
        <h3></h3>
        <fieldset style="text-align:left;" id="patient-details-step-parent">
            <div class="row md-col">
                <div class="patient-details input-group col-12 col-md-8">
                    <div class="w-100 d-none d-md-flex" style="margin-bottom: 30px; margin-top: 30px; font-weight: bold;">Fill in the patient's details</div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Full name<span class="required"></span></label>
                        <input type="text" id="name" name="name" class="form-control" placeholder="Full name" required />
                        <div id="name-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Email address<span class="required"></span></label>
                        <input type="email" id="email" name="email" class="form-control" placeholder="Email address" required />
                        <div id="email-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Gender<span class="required"></span></label>
                        <select id="gender" name="gender" class="form-control" required>
                            <option selected disabled value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <div id="gender-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Phone number<span class="required"></span></label>
                        <input type="text" id="phone" name="phone" class="form-control" placeholder="Phone number" required />
                        <div id="phone-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Date of birth<span class="required"></span></label>
                        <input type="date" id="dob" name="dob" class="form-control" placeholder="Date of birth" max="<?php echo date("Y-m-d") ?>" step="1" required />
                        <div id="dob-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Location<span class="required"></span></label>
                        <input list = "location" class = "form-control" placeholder = "Select location">
                    
                            <datalist id = "location">
                            <option value='Baringo'>
                            <option value='Bomet'>
                            <option value='Bungoma'>
                            <option value='Busia'>
                            <option value='Elgeyo-Marakwet'>
                            <option value='Embu'>
                            <option value='Garissa'>
                            <option value='Homa Bay'>
                            <option value='Isiolo'>
                            <option value='Kajiado'>
                            <option value='Kakamega'>
                            <option value='Kericho'>
                            <option value='Kiambu'>
                            <option value='Kilifi'>
                            <option value='Kirinyaga'>
                            <option value='Kisii'>
                            <option value='Kisumu'>
                            <option value='Kitui'>
                            <option value='Kwale'>
                            <option value='Laikipia'>
                            <option value='Lamu'>
                            <option value='Machakos'>
                            <option value='Makueni'>
                            <option value='Mandera'>
                            <option value='Marsabit'>
                            <option value='Meru'>
                            <option value='Migori'>
                            <option value='Mombasa'>
                            <option value="Murang'a">
                            <option value='Nairobi City'>
                            <option value='Nakuru'>
                            <option value='Nandi'>
                            <option value='Narok'>
                            <option value='Nyamira'>
                            <option value='Nyandarua'>
                            <option value='Nyeri'>
                            <option value='Samburu'>
                            <option value='Siaya'>
                            <option value='Taita-Taveta'>
                            <option value='Tana River'>
                            <option value='Tharaka-Nithi'>
                            <option value='Trans Nzoia'>
                            <option value='Turkana'>
                            <option value='Uasin Gishu'>
                            <option value='Vihiga'>
                            <option value='West Pokot'>
                            <option value='Wajir'>
                            <option value='Others'>
                        </select>
                        <div id="location-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                </div>
                <div class="booking-time input-group col-4 col-md-4 col-sm-12" style="border-right:none">
                    <div>
                        <p>What time do you want to consult a doctor?</p>
                        <label>
                            <input type="radio" id="now" name="appointment-type" value="now" checked />
                            <span>Speak to a doctor now</span>
                        </label><br>
                        <label>
                            <input type="radio" id="schedule" name="appointment-type" value="schedule" />
                            <span>Schedule for later</span>
                        </label><br>
                    </div>

                    <div id="date-time-picker-container" class="d-none">
                        <div class="input-group bootstrap-timepicker timepicker mb-2 datepicker" title="Select date">
                            <input type="text" class="form-control input-small" id="set-appointment-date" name="appointment-date" value="<?php echo date("Y-m-d"); ?>">
                            <span class="input-group-addon"><i class="fa fa-calendar"></i></span>
                        </div>
                        <div id="date-error" class="error" style="display: none;"></div>

                        <input type="time" class="form-control my-2" id="set-appointment-time" name="appointment-time" data-screen="mobile-only" min="08:00" max="18:00" value="<?php echo date("H:i") ?>">

                        <div class="input-group bootstrap-timepicker timepicker" data-screen="desktop-only" title="Select time">
                            <input id="set-appointment-time" name="appointment-time" type="text" class="form-control input-small">
                            <span class="input-group-addon"><i class="fa fa-clock-o"></i></span>
                        </div>
                        <div id="time-error" class="error" style="display: none;"></div>
                    </div>
                </div>
                <input type="hidden" name="clinic" value="psi" hidden />
                <input type="hidden" name="operation" value="booking" hidden />
            </div>
        </fieldset>

        <h3></h3>
        <fieldset style="text-align:left;">
            <div id="confirm-details-section">
                <div class="col-12 col-md-12 col-sm-12" style="text-align:center; margin-bottom: 50px;">Kindly confirm the details you entered to ensure they are correct.</div>

                <div class="d-flex flex-column flex-md-row">
                    <div class="input-group w-100 mr-1 pb-0" style="border:1px solid silver" id="confirm-appointment-patient">
                        <div class="title" style="margin-bottom:10px;">Patient Details</div>
                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Full name</span><br />
                            <span class="preview" id="name-preview"></span>
                        </div>
                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Gender</span><br>
                            <span class="preview" id="gender-preview"></span>
                        </div>
                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Date of birth</span><br>
                            <span class="preview" id="dob-preview"></span>
                        </div>

                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Email address</span><br>
                            <span class="preview" id="email-preview"></span>
                        </div>

                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Phone number</span><br>
                            <span class="preview" id="phone-preview"></span>
                        </div>

                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Location</span><br>
                            <span class="preview" id="location-preview"></span>
                        </div>
                    </div>
                    <div class="d-flex flex-column-reverse flex-md-row w-100 px-0 pb-0">
                        <div class="w-100 mx-0 mx-md-1 pb-2 pb-md-0" id="confirm-appointment-details">
                            <div class="title">Appointment Details</div>
                            <div class="col-12 col-md-12 col-sm-12">
                                <span>Type</span><br>
                                <span class="preview" id="type-preview">Speak To A Doctor Now</span>
                            </div>
                            <div class="col-12 px-1 px-md-3 col-sm-12">
                                <span class="preview" id="time-preview">Date </span><br><span class="preview" id="time-preview">Time</span>
                            </div>
                        </div>
                        <div class="d-flex flex-column w-100 mx-0 mx-md-1" id="confirm-appointment-cost">
                            <div class="title">Appointment Cost</div>
                            <div class="cost h-100 p-2">
                                <span>Total</span><br>
                                <span class="preview" id="type-preview">Ksh. 300</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </fieldset>
    </form>
</div>