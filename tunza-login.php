<?php
include 'functions.php';
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title> My Health Africa OneMed Pro| Doctor Sign In</title>
    <link rel="shortcut icon" href="psi-login/images/favicon.ico" />
    <link rel="stylesheet" href="psi-login/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="psi-login/assets/css/fontawsom-all.min.css">
    <link rel="stylesheet" type="text/css" href="psi-login/assets/css/style.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js?v=<?php echo $inclusions_version; ?>"></script>
    <link href="assets/bundles/simple-line-icons/simple-line-icons.min.css?v=<?php echo $inclusions_version; ?>" rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&amp;subset=all" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    
    <link href="css/style.css" rel="stylesheet" type="text/css" />
    <link href="css/responsive.css" rel="stylesheet" type="text/css" />
    <link href="css/responsive.dataTables.min.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <div class="container-fluid h-100">
            <div class="no-margin h-100">
                <div class="col-sm-12 no-padding login-box h-100">
                    <div class="row no-margin w-100">
                        <div class="col-lg-6 col-md-6 log-det">
                            <div class="text-box-cont">
                                <div class="row">
                                    <div class="logo" style="margin-left:80px">
                                        <img src="psi-login/images/PSI Kenya - Tunza.png" height="50px">
                                    </div>
                                </div>
                                <form method="post" action="login" autocomplete="off">
                                <div class="login-header-text" style="margin-bottom:20px;">
                                    <div style="text-align:left;">Sign In</div>
                                </div>
                                 <div class="input-group mb-sm-3">
                                    <label>
                                        <input type="text" class="inputFiled" style="font-size:12px;font-weight:normal" name="username" id="email_adress" value="" placeholder="Email" autofill="off" required>
                                        <span style="display:none;">Email</span>
                                    </label>
                                </div>
                                <div class="input-group mb-sm-3">
                                <label>
                                <input type="password" class="inputFiled" style="font-size:12px;font-weight:normal" name="password" id="password" value=""  placeholder="Password"autofill="off" required>
                                <span style="display:none;">Password</span>
                                <div class="showBtn" id="togglePassword"><i class="fas fa-eye" id="view"></i><i class="fas fa-eye-slash" id="hide" style="display:none;"></i></div>
                                </label>
                                </div>
                                
                                     <div id="login-error-message" style="color:red; text-align:left;font-weight:normal;font-size:14px;"><?php echo display_error(); ?></div>

                                <div class="input-group mb-sm-3">
                                        <button type="submit" id="loginBtn" class="btn btn-primary button" name="login_btn" style="width:100%;font-size:15px;cursor: pointer;height:37px;">Sign In</button>
                                        
                                </div>   
                                <div class="input-group mb-sm-3" style="margin-top:0px">
                                        <div class="col-md-6 col-6 remember" style="float:left;margin-left:-15px;cursor: pointer;">
                                            <input type="checkbox" name="remember" id="rememberme">
                                            <c for="rememberme" style="cursor: pointer;margin-top:-12px;">Remember Me</c>
                                        </div>
                                        <div class="col-md-6 col-6 remember" style="position: absolute; right:-15px;text-align:right;color:#0080ff;">
                                            <input type="checkbox" id="fort-passs" data-toggle="modal" data-target="#modal" hidden >
                                            <label for="fort-passs" class="forgt-pass" style="float:right;cursor: pointer;">Forgot Password?</label>
                                        </div>
                                    </div>
                                    </form>
                                    <center>
                                <label class="footer-account" style="margin-left:0%">
                                   Don't have an account yet?<br>
                                   <a href="https://www.myhealthafrica.com/onemed-pro/pricing-page/" style="font-size:13px">Sign Up For OneMed Pro</a><br>
                                   <a href="https://www.myhealthafrica.com/onemed-pro/free-plan/" style="font-size:13px">Sign Up For A Free Basic Account</a><br>
                                   <img src="psi-login/images/MHA - PSI.png" height="50px" style="margin-top:40px">
                                </label>
                                
                                </center>
                            </div>
                        </div>
                        <!-- start pass reset modal -->
                        <div class="modal fade" id="modal" tabindex="1" aria-hidden="true" style="margin-top:8%">
                            <div class="modal-dialog modal-md" role="document" style="border-radius:0px">
                                <div class="modal-content">
								<div class="modal-header" style="margin-top:15px;">
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
                                    <div class="modal-body d-flex flex-column px-4">
                                        <form name="forgotpassw" action="forgot/tunza-resetpassword.php" id="forgotpassw" method="post" class="form-horizontal" role="form">
                                            <div class="mb-3">
                                                <center style="margin-top:2px">
                                                <div class="col-md-12">
                                                    <label class="login-header-text-reset" style="text-align:center">
                                                    <div >Reset Your Password</div>
                                                    </label>
                                                </div>
                                                <div class="col-md-12">
                                                    <label class="class control-label" style="padding-top:9px;text-align:center;font-size:14px;color:#000">
                                                    Enter your email address to reset your password.
                                                    </label>
                                                </div>
                                                <div class="input-group mb-sm-3" style="width:80%;margin-top:20px">
                                                <label>
                                                <input type="email" name="email" class="inputFiled" style="font-size:12px;font-weight:normal" id="password_reset_email" placeholder="" required>
                                                <span>Email</span>
                                                </label>
                                                </div>
                                                <div class="input-group mb-sm-3"  style="padding-bottom:25px;width:80%;margin-top:25px;" >
                                                     <button type="submit"  class="btn btn-primary button" name="forgotpassword" id="submit_bt" value="Reset Password"  style="width:100%;font-size:15px;cursor: pointer;height:37px">Reset Password</button>
                                                </div>
                                                
                                                </center>
                                            </div>
                                        </form>
                                        <div id="hiddenForm" method="post" class="form-horizontal" style="display:none;">
                                            <div class="mb-3">
                                                <center style="margin-top:30px">
                                                <div class="col-md-12">
                                                    <label class="login-header-text-reset" style="text-align:center">
                                                    <div>Check Your Email</div>
                                                    </label>
                                                </div>
                                                <div class="col-md-12">
                                                    <label class="class control-label" style="padding-top:9px;text-align:center;font-size:14px;color:#000">
                                                    Please check your email for password reset link.
                                                    </label>
                                                </div>
                                                <div class="input-group mb-sm-3"  style="padding-bottom:25px;width:80%;padding-top:40px;">
                                                     <button type="button" class="btn btn-primary button" data-dismiss="modal" style="text-transform: inherit;font-size: medium;width:100%;font-size:15px">Dismiss</button>
                                                </div>
                                                
                                                </center>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end cert reset modal -->
                       <div class="col-lg-6 col-md-6 box-de">
                           
                        </div>
                    </div>
                </div>
                 
            </div>
        </div>
</body>
<script>
  $('input[autofill="off"]).disableAutofill();
</script>
<script src="psi-login/assets/js/jquery.disable-autofill.js"></script>
<script src="psi-login/assets/js/jquery-3.2.1.min.js"></script>
<script src="psi-login/assets/js/popper.min.js"></script>
<script src="psi-login/assets/js/bootstrap.min.js"></script>
<script src="psi-login/assets/js/script.js"></script>
<script src="psi-login/assets/js/login.js"></script>
<!-- start js include path -->
<script src="forgot/jquery.min.js?v=<?php echo $inclusions_version; ?>"></script>
<!-- bootstrap -->
<script src="forgot/bootstrap.min.js?v=<?php echo $inclusions_version; ?>"></script>


</html>
