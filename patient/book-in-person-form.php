<!DOCTYPE html>
<html lang="en">
<!-- BEGIN HEAD -->

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <title>Tunza Clinic Telemedicine | My Health Africa </title>
    <!-- google font -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&amp;subset=all" rel="stylesheet" type="text/css" />
    <!-- icons -->
    <link href="css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <!--bootstrap -->
    <link href="assets/bundles/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <!-- wizard -->
    <link href="assets/bundles/steps/steps.css" rel="stylesheet">
    <link href="css/responsive.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="assets/bundles/bootstrap-timepicker/css/bootstrap-timepicker.css" />
    <!-- <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css"> -->
    <link href="css/telemedicine.css?v=0" rel="stylesheet" type="text/css" />
    <!-- favicon -->
    <link rel="shortcut icon" href="images/my-health-africa.png" />
</head>
<!-- END HEAD -->
<body class = "container">
    <div class="col-md-12" style="padding:0px">
    <div class="booking-step col-md-12" style="border-bottom: solid 1px gray;">
        <label>
            <input type="radio"  name="radio-button" checked />
            <span>Patient Details</span>
        </label>
        <label>
            <hr>
        </label>
        <label>
            <input type="radio"  name="radio-button" />
            <span>Set Appointment</span>
        </label>
        <label>
            <hr>
        </label>
        <label>
            <input type="radio"  name="radio-button"  />
            <span>Confirm Details</span>
        </label>
    </div>
    <form class="col-md-12" style="padding:0px" id="booking_form" role="form" name="onboarding_form" method="post" enctype="multipart/form-data">
        <h3></h3>
        <fieldset style="text-align:left;" id="patient-details-step-parent">
            <div class="row md-col">

                <div class="patient-details input-group col-12 col-md-8">
                    <div class="w-100 d-none d-md-flex" >Fill in the patient's details</div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Full name<span class="required"> * </span></label>
                        <input id="fullname" name="fullname" class="form-control" placeholder="Full name" required />
                        <div id="name-error" class="col-6 col-md-6 alert alert-danger" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Email address<span class="required"> * </span></label>
                        <input id="email" name="email" class="form-control" placeholder="Email address" required />
                        <div id="email-error" class="col-6 col-md-6 alert alert-danger" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Gender<span class="required"> * </span></label>
                        <select id="gender" name="gender" class="form-control" required>
                            <option selected disabled>Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <div id="gender-error" class="col-6 col-md-6 alert alert-danger" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Phone number<span class="required"> * </span></label>
                        <input id="phone" name="phone" class="form-control" placeholder="Phone number" required />
                        <div id="phone-error" class="col-6 col-md-6 alert alert-danger" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Date of birth<span class="required"> * </span></label>
                        <input id="dob" name="dob" class="form-control" placeholder="Date of birth" required />
                        <div id="dob-error" class="col-6 col-md-6 alert alert-danger" style="display: none;"></div>
                    </div>
                    <div class="col-12 col-md-6 mt-i">
                        <label>Location<span class="required"> * </span></label>
                        <select id="location" name="location" class="form-control select2" required>
                            <option selected disabled>Select location</option>
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
                        </select>
                        <div id="location-error" class="col-6 col-md-6 alert alert-danger" style="display: none;"></div>
                    </div>
                </div>
                
            </div>
        </fieldset>

        <h3></h3>
        <fieldset style="text-align:left; display: none">
            <div id="confirm-details-section">
                <div class="col-12 col-md-12 col-sm-12" style="text-align:center; margin-bottom: 50px;">Kindly confirm the details you entered to ensure they are correct.</div>

                <div class="d-flex flex-column flex-md-row">
                    <div class="input-group w-100 mr-1 pb-0" style="border:1px solid silver" id="confirm-appointment-patient">
                        <div class="title" style="margin-bottom:10px;">Patient Details</div>
                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Full name</span><br />
                            <span class="preview" id="name-preview">Bonface bonface bonface bonface bonface bonface</span>
                        </div>
                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Gender</span><br>
                            <span class="preview" id="gender-preview">Bonface</span>
                        </div>
                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Date of birth</span><br>
                            <span class="preview" id="dob-preview">Bonface</span>
                        </div>

                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Email address</span><br>
                            <span class="preview" id="email-preview">Bonfacebonfacebonfacebonfacebonface@bonfacebonface.bonface</span>
                        </div>

                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Phone number</span><br>
                            <span class="preview" id="phone-preview">Bonface</span>
                        </div>

                        <div class="preview-div col-12 col-md-4 col-sm-12">
                            <span>Location</span><br>
                            <span class="preview" id="location-preview">Bonface</span>
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
</body>