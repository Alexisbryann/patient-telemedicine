<!-- <?php
include('functions.php');
session_start();
$doctor_id = $_SESSION['doctorid']['id'];

$appointment_id = (isset($_GET['appid'])) ? $_GET['appid'] : '';
$result = mysqli_query($db, "SELECT wp_ea_fields.field_id, wp_ea_fields.value FROM wp_ea_fields WHERE app_id = '$appointment_id' AND field_id IN (1,2,7) ");
while ($row = mysqli_fetch_array($result)) {
    $field_id = $row['field_id'];
    if ($field_id == 2) {
        $patient_first_name = $row['value'];
    } elseif ($field_id == 7) {
        $patient_last_name = $row['value'];
    }elseif ($field_id == 1) {
      $patient_email = $row['value'];
  }
}
$appoitments = mysqli_fetch_array(mysqli_query($db, "SELECT wp_ea_fields.app_id FROM wp_ea_fields WHERE wp_ea_fields.value = '$patient_email'"))['value'];
$appoitments = implode(',', $appoitments);
$result = mysqli_query($db, "SELECT COUNT(*) AS appointments FROM wp_ea_appointments WHERE worker = '$doctor_id' AND id IN ('&appoitments')");


?> -->
<!DOCTYPE html>
<html>
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="refresh" content="3;url=https://intmedicaltreatment.com/" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/thankyou.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

<style>
body, h1, h2, h3, h4, h5, h6  {
  font-family: "Segoe UI";
}
</style>

  </head>
  <body >
    <section class = "container">
      <div class = "logo-image" >
        <img src = "images/logo_group.png" width = "270px" height = "auto" alt = "My health africa, tunza clinics & psi logos">
      </div>
      <div class = "thank-you-text" >
        <h1 style="font-size:40px;font-weight:bold;margin-bottom: 30px;">Appointment ended.</h1>
        <h3 style="font-size:25px;font-weight:bold;margin-top: 10px;">Great job on your first Telemedicine appointment.</h3>

      </div>
      <div ><h3 style="font-size:15px;font-weight:regular;margin-bottom: 10px;"> You will be redirected to the telemedicine queue shortly.</span></h3>
</div>
      <div>
      <button type="button" class="btn-invite" onclick = "location.href='https://intmedicaltreatment.com/'">Go Back To Queue</button>
      
      <script type="text/javascript" src="js/thankYou.js"></script>
      </div>
    </section>
    
  </body>

</html>
