<div class="col-md-12" style="padding:0px">
    <div class="booking-step col-md-12 d-md-flex align-items-center justify-content-center d-none" style="border-bottom: solid 1px gray;">
        <label>
            <input type="radio" id="appointment" name="radio-button" checked value="0">
            <span>Appointment Details</span>
        </label>
        <label>
            <hr>
        </label>
        <label>
            <input type="radio" id="confirm" name="radio-button" value="1">
            <span>Confirm Details</span>
        </label>
    </div>
    <form class="col-md-12" style="padding:0px" id="booking-form" role="form" name="onboarding_form" method="post" enctype="multipart/form-data">
        <h3></h3>
        <fieldset style="text-align:left;" id="patient-details-step-parent">
            <div class="row md-col">
                <div class="booking-time input-group col-12 col-md-4 col-sm-12">
                    <div>
                        <p class="mt-0 mt-md-4">What time do you want to consult a doctor?</p>
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
                        <!--<div class="input-group bootstrap-timepicker timepicker mb-2 datepicker" title="Select date">-->
                        <!--    <input type="text" class="form-control input-small" id="set-appointment-date" name="appointment-date" value="<?php echo date("Y-m-d"); ?>">-->
                        <!--    <span class="input-group-addon"><i class="fa fa-calendar"></i></span>-->
                        <!--</div>-->
                        <input type="date" class="form-control mb-3" id="set-appointment-date" name="appointment-date" min="<?php echo date("Y-m-d") ?>" />

                        <div id="date-error" class="error" style="display: none;"></div>

                        <input type="time" class="form-control my-2" id="set-appointment-time" name="appointment-time" data-screen="mobile-only" min="08:00" max="18:00" value="<?php echo date("H:i") ?>">

                        <div class="input-group bootstrap-timepicker timepicker" data-screen="desktop-only" title="Select time">
                            <input id="set-appointment-time" name="appointment-time" type="text" class="form-control input-small">
                            <span class="input-group-addon"><i class="fa fa-clock-o"></i></span>
                        </div>
                        <div id="time-error" class="error" style="display: none;"></div>
                    </div>
                </div>

                <div class="patient-details input-group col-12 col-md-8 border-0">
                    <div class="col-12">
                        <span>Who are you booking the appointment for?</span>
                        <div class="form-check pl-0 pl-md-2">
                            <input type="radio" name="booking-for" id="booking-for-self" value="self" checked>
                            <label for="booking-for-self">I am booking for myself</label>
                        </div>
                        <div class="form-check pl-0 pl-md-2">
                            <input type="radio" name="booking-for" id="booking-for-other" value="other">
                            <label for="booking-for-other">I am booking for somebody else</label>
                        </div>
                    </div>
                    <strong class="col-12 d-none d-md-flex my-2">Fill in the Your details</strong>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Your full name</label><span class="required"></span>
                        <input type="text" id="name" name="name" class="form-control" placeholder="Full name" required />
                        <div id="name-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Your date of birth</label><span class="required"></span>
                        <input type="date" id="dob" name="dob" class="form-control" max="<?php echo date("Y-m-d") ?>" step="1" required />
                        <div id="dob-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Your email address</label><span class="required"></span>
                        <input type="email" id="email" name="email" class="form-control" placeholder="Email address" required />
                        <div id="email-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Your phone number</label><span class="required"></span>
                        <input type="text" id="phone" name="phone" class="form-control" placeholder="Phone number" required />
                        <div id="phone-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Patient's gender</label><span class="required"></span>
                        <select id="gender" name="gender" class="form-control" required>
                            <option selected disabled value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <div id="gender-error" class="col-12 col-md-12 error" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Your location</label><span class="required"></span>
                        <input list="location" name="location" class="form-control" placeholder="Select location">
                        <datalist id="location">
                            <option value='Baringo'>Baringo</option>
                            <option value='Bomet'>Bomet</option>
                            <option value='Bungoma'>Bungoma</option>
                            <option value='Busia'>Busia</option>
                            <option value='Elgeyo-Marakwet'>Elgeyo-Marakwet</option>
                            <option value='Embu'>Embu</option>
                            <option value='Garissa'>Garissa</option>
                            <option value='Homa Bay'>Homa Bay</option>
                            <option value='Isiolo'>Isiolo</option>
                            <option value='Kajiado'>Kajiado</option>
                            <option value='Kakamega'>Kakamega</option>
                            <option value='Kericho'>Kericho</option>
                            <option value='Kiambu'>Kiambu</option>
                            <option value='Kilifi'>Kilifi</option>
                            <option value='Kirinyaga'>Kirinyaga</option>
                            <option value='Kisii'>Kisii</option>
                            <option value='Kisumu'>Kisumu</option>
                            <option value='Kitui'>Kitui</option>
                            <option value='Kwale'>Kwale</option>
                            <option value='Laikipia'>Laikipia</option>
                            <option value='Lamu'>Lamu</option>
                            <option value='Machakos'>Machakos</option>
                            <option value='Makueni'>Makueni</option>
                            <option value='Mandera'>Mandera</option>
                            <option value='Marsabit'>Marsabit</option>
                            <option value='Meru'>Meru</option>
                            <option value='Migori'>Migori</option>
                            <option value='Mombasa'>Mombasa</option>
                            <option value="Murang'a">Murang'a</option>
                            <option value='Nairobi City'>Nairobi City</option>
                            <option value='Nakuru'>Nakuru</option>
                            <option value='Nandi'>Nandi</option>
                            <option value='Narok'>Narok</option>
                            <option value='Nyamira'>Nyamira</option>
                            <option value='Nyandarua'>Nyandarua</option>
                            <option value='Nyeri'>Nyeri</option>
                            <option value='Samburu'>Samburu</option>
                            <option value='Siaya'>Siaya</option>
                            <option value='Taita-Taveta'>Taita-Taveta</option>
                            <option value='Tana River'>Tana River</option>
                            <option value='Tharaka-Nithi'>Tharaka-Nithi</option>
                            <option value='Trans Nzoia'>Trans Nzoia</option>
                            <option value='Turkana'>Turkana</option>
                            <option value='Uasin Gishu'>Uasin Gishu</option>
                            <option value='Vihiga'>Vihiga</option>
                            <option value='West Pokot'>West Pokot</option>
                            <option value='Wajir'>Wajir</option>
                            <option value='Others'>Others</option>
                            </input>
                            <div id="location-error" class="col-12 col-md-12 error" style="display: none;"></div>
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
                            <div class="col-12 px-1 px-md-3 col-sm-12" id="date-time-preview">
                                <div class="d-flex flex-column mr-auto">
                                    <span>Date</span><span class="preview mr-auto" id="date-preview">2021-09-20</span>
                                </div>

                                <div class="d-flex flex-column mr-4">
                                    <span>Time</span><span class="preview" id="time-preview">8:00 AM</span>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-column w-100 mx-0 mx-md-1" id="confirm-appointment-cost">
                            <div class="title">Appointment Cost</div>
                            <div class="cost h-100 p-2">
                                <span>Total</span><br>
                                <span class="preview" id="type-preview">Ksh. 500</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-100 d-flex flex-column text-center my-2">
                    <div class="form-check">
                        <input type="checkbox" name="terms-conditions-consent" id="terms-conditions-consent" required>
                        <label for="terms-conditions-consent">Tick the checkbox to state that you have read and agreed to our <a href="https://www.myhealthafrica.com/my-health-africa-consent-form/">consent form.</a></label>
                    </div>
                    <span class="error"></span>
                </div>
            </div>
        </fieldset>
    </form>
</div>