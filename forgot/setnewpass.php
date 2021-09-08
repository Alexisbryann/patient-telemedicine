<?php
include('../functions.php');

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <meta name="HandheldFriendly" content="true">

    <title>My Health Africa - Doctor Login </title>
    <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans'>
    <link rel="stylesheet" href="style.css">
    <!-- icons -->
    <!--bootstrap -->
    <link href="bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link rel="shortcut icon" href="img/favicon.ico" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>



</head>

<body>
    <!-- partial:index.partial.html -->
    <p class="tip"></p>

    <div class="cont">
        <?php
if (isset($_GET["token"])) {
  $key = $_GET["token"];
  $curDate = date("Y-m-d H:i:s");
  $query = mysqli_query($db, "SELECT * FROM `password_reset_temp` WHERE `key` = ' $key'" );
    $row = mysqli_num_rows($query);
   if (mysqli_num_rows($query)===0){ 
  echo '<div class="error"><h2>Invalid Link</h2>
<p>The link is invalid/expired. Either you did not copy the correct link
from the email, or you have already used the key in which case it has 
deactivated.</p>
<p><a href="https://mha2.0.myhealthafrica.co.ke/login"> 
Click here</a> to reset password.</p></div>';
       echo $email;
 }else{
  $row = mysqli_fetch_assoc($query);
    $email = $row['email'];
  $expDate = $row['expDate'];
  if ($expDate >= $curDate){
  ?>
        <form name="newpassw" id="newpassw" class="form sign-in" action="" method="post" onSubmit="return valid();">
            <input type="hidden" name="action" value="update" />
            <h2 class="form-title"></h2>
            <h2>Set New Password</h2>
            <label>
                <span>New Password</span>
                <input type="password" name="new_pass" id="new_pass" />
            </label>
            <label>
                <span>Confirm New Password</span>
                <input type="password" name="new_pass_con" id="new_pass_con" />
            </label>
            <br>
            <input type="submit" class="btn btn-info m-r-20" name="new_password" id="newpas" value="Change Password" />
            <div class="error"></div><br />


            <script>
                function valid() {
                    if (document.newpassw.new_pass.value == "") {
                        alert("New Password Field is Empty !!");
                        document.newpassw.new_pass.focus();
                        return false;
                    } else if (document.newpassw.new_pass_con.value == "") {
                        alert("Confirm Password Field is Empty !!");
                        document.newpassw.new_pass_con.focus();
                        return false;
                    } else if (document.newpassw.new_pass.value != document.newpassw.new_pass_con.value) {
                        alert("New Password and Confirm New Password Field do not match  !!");
                        document.newpassw.new_pass_con.focus();
                        return false;
                    }
                    return true;
                }

            </script>
            <?php
}else{
echo '<div class="error"><h2>Link Expired</h2>
<p>The link is expired. You are trying to use the expired link which 
is valid only for 24 hours (1 days after request).<br />Kindly Reset you password again<br /></p></div>';
            }
      }
} // isset email key validate end
 
 
if(isset($_POST["action"]) && ($_POST["action"]=="update")){
$pass1 = mysqli_real_escape_string($db,$_POST["new_pass"]);
$pass2 = mysqli_real_escape_string($db,$_POST["new_pass_con"]);
$curDate = date("Y-m-d H:i:s");

$hasher = new PasswordHash(8, false);
$hash = $hasher->HashPassword($pass1);
mysqli_query($db,"UPDATE wp_users SET user_pass = '$hash' WHERE user_email ='$email'");
 
mysqli_query($db,"DELETE FROM `password_reset_temp` WHERE `email`='$email'");
 
echo  '<div class="success"><p>Congratulations! Your password has been updated successfully. You will be reiderected to the login page in 5 seconds</p>
<p>If you are not automatically redirected<a href="https://mha2.0.myhealthafrica.co.ke/login">
Click here</a> to Login.</p></div><br />';
    header("Refresh:5; url=https://mha2.0.myhealthafrica.co.ke/login");
    
    
   } 

?>

        </form>

    </div>

    <!-- start js include path -->
	<script src="jquery.min.js"></script>
	<!-- bootstrap -->
	<script src="bootstrap.min.js"></script>

</body>

</html>
