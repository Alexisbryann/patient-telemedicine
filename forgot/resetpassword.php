<?php 
include('../functions.php');
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
  $query = "SELECT user_email FROM wp_users WHERE user_email='$email'";
  $results = mysqli_query($db, $query);

  if (empty($email)) {
	  $response = 300;
	  echo $response;
  } else if (mysqli_num_rows($results) <= 0) {
		$response = 600;
	  echo $response;
  } else {
    // generate a unique random token of length 100
    $key = md5($email);
    $addKey = substr(md5(uniqid(rand(),1)),3,10);
    $key = "$key$addKey";

    if (count($errors) == 0) {
      $expFormat = mktime(
        date("H"),
        date("i"),
        date("s"),
        date("m"),
        date("d") + 1,
        date("Y")
        );

      $expDate = date("Y-m-d H:i:s",$expFormat);
      // store token in the password-reset database table against the user's email
      $sql = "INSERT INTO password_reset_temp(`email`, `key`, `expDate`) VALUES ('$email', ' $key' , '$expDate')";
      $results = mysqli_query($db, $sql);

      // Send email to user with the token in a link they can click on
      
      $to = $email;
      $subject = "Reset your password on My HealthAfrica.com";
      $from = 'My Health Africa Patient Experience <info@myhealthafrica.com>';
    
      // To send HTML mail, the Content-type header must be set
      $headers  = 'MIME-Version: 1.0' . "\r\n";
      $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
      $headers .= 'From: '.$from. "\r\n";             
        
      // Compose a simple HTML email message
      $message = '<html><body>';
      $message .= '<h1 style="color:#f40;">Hi Jane!</h1>';
      $message .= '<p style="color:#080;font-size:18px;">Will you marry me?</p>';
      $message .= '</body></html>';
    
      $output = '<html><body>';
      $output .='<h4> Dear user,</h4> <br>';
      $output .='Please click on the following link to reset your password. ';
      $output .='<a href="https://mha2.0.myhealthafrica.co.ke/forgot/setnewpass.php?token='. $key .'">
      Reset my Password</a><br>'; 
      $output .='You can also copy the entire link below in your browser.<br> <br>
        https://mha2.0.myhealthafrica.co.ke/forgot/setnewpass.php?token='.$key.'<br><br>';
      $output .='Please be sure to copy the entire link into your browser.
      The link will expire after 1 day for security reason.<br>';
      $output .='If you did not request this forgotten password email, no action 
      is needed, your password will not be reset.<br> However, you may want to log into 
      your account and change your password as someone may have guessed it.<br><br>';   
      $output .='Regards,<br>';
      $output .='My Health Africa Team <br>';
      $output .= '</body></html>';
      $msg = $output;
      $msg = wordwrap($msg,70);
    
      mail($to, $subject, $msg, $headers);        
      $response = 200;
      echo $response;
    } else {
      $response = 500;
      echo $response;
    }
  
  }
} 

/* // ENTER A NEW PASSWORD
if (isset($_POST['new_password']) && isset($_GET['token']))  {
  $key = $_SESSION['token'];
  $curDate = date("Y-m-d H:i:s");
	
  $new_pass = mysqli_real_escape_string($db, $_POST['new_pass']);
  $new_pass_con = mysqli_real_escape_string($db, $_POST['new_pass_con']);

  // Grab to token that came from the email link
 // $token = $_SESSION['token'];

    // select email address of user from the password_reset table 
    $sql = "SELECT email FROM password_reset_temp WHERE key='$key' LIMIT 1";
    $results = mysqli_query($db, $sql);
    $email = mysqli_fetch_assoc($results)['email'];

    if ($email) {
      $new_pass = md5($new_pass);
      $sql = "UPDATE wp_users SET user_pass='$new_pass' WHERE user_email='$email'";
      $results = mysqli_query($db, $sql);
	  
	  $response = 200;
		echo $response;
    }else{
		$response = 500;
		echo $response;
  }
  
} */
