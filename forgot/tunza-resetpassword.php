<?php 
include('../functions.php');
require_once $_SERVER['DOCUMENT_ROOT'] . '/patientexperience/operation/include/my_mail.php';
$mail = mailer();
$errors = [];
$user_id = '';
$response = '';

/*
  Accept email of user whose password is to be reset
  Send email to user to reset their password
*/
 if (isset($_POST['forgotpassword'])) {
     
  $email = mysqli_real_escape_string($db, $_POST['email']);
  mysqli_query($db,"DELETE FROM `password_reset_temp` WHERE `email`='$email'");
  // ensure that the user exists on our system
  // ensure that the user exists on our system
  $query = "SELECT user_email,display_name FROM wp_users WHERE user_email='$email'";
  $results = mysqli_query($db, $query);
  $row =  mysqli_fetch_assoc($results);
  $username =$row["display_name"];

  if (empty($email)) {
	  $response = 300;
	  echo $response;
  }else if(mysqli_num_rows($results) <= 0) {
		$response = 600;
	  echo $response;
  } else{
  // generate a unique random token of length 100
  $key = md5(2418*2+$email);
  $addKey = substr(md5(uniqid(rand(),1)),3,10);
  $key = $key . $addKey;

  if (count($errors) == 0) {
	  $expFormat = mktime(
		   date("H"), date("i"), date("s"), date("m") ,date("d")+1, date("Y")
		   );
		   $expDate = date("Y-m-d H:i:s",$expFormat);
    // store token in the password-reset database table against the user's email
    $sql = "INSERT INTO password_reset_temp(`email`, `key`, `expDate`) VALUES ('$email', ' $key' , '$expDate')";
    $results = mysqli_query($db, $sql);

    // Send email to user with the token in a link they can click on
    
    $to = $email;
    $subject = "Reset your password on My HealthAfrica.com";
    $from = 'noreply@myhealthafrica.com';
    
                // To send HTML mail, the Content-type header must be set
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
            $headers .= 'From: '.$from. "\r\n";
             
             
            // Compose a simple HTML email message
            
    
        $output = '<html><body>';
        $output .='<h4> Hello '.$username.',</h4>';
        $output .='<p>There was recently a request to change the password on your OneMed Pro account.</p>';
        $output .='<p>No changes have been made to your account yet.</p>';
        $output .='<p>If you made this request, kindly proceed to reset your password by clicking the button below:</p>';
        $output .='<a href="https://www.myhealthafrica.com/coldroom/myonemedpro/psi-login/reset-password.php?token='. $key .'">
        <button style="border-radius:10px;background-color:#0080ff;border:none;color:white;padding:10px;text-align:center;text-decoration:none;display:inline-block;font-size:16px;margin:4px 2px;color:white;cursor: pointer;">Reset Password</button></a><br><br>'; 
        $output .='<p>If the button above does not work, kindly copy and paste the url link below into your browser:</p>
         https://https://www.myhealthafrica.com/coldroom/myonemedpro/psi-login/reset-password.php?token='.$key.'';
        $output .='<p>Please ignore this email and consider changing your password if you did not make the reset password request.</p>'; 
        $output .='Thank you.<br><br>';
        $output .='Regards,<br>';
        $output .='The OneMed Pro Team<br>';
        $output .= '</body></html>';
        $msg = $output;
    	$msg = wordwrap($msg,70);
   
   $mail->addAddress($email);
   $mail->setFrom('noreply@myhealthafrica.com', 'My Health Africa');
   $mail->Subject = "Reset Your OneMed Pro Password";
   $mail->Body = $msg;
   $mail->isHtml(true);
   
   try {
       $mail->send();
       $response = 200;
   } catch (Exception $e) {
   	   $response = 500;
   }
    // mail($to, $subject, $msg, $headers);        
// 	$response = 200;
	echo $response;
  } else{
	  $response = 500;
	  echo $response;
  }
  
  }
} 

?>