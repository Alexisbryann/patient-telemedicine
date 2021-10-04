<?php
// slingshot to myonemedpro handler
require "../../functions.php";
$_POST["doctorPostId"] = $_SESSION["doctorid"]["dr_post_id"];
require "{$_SERVER["DOCUMENT_ROOT"]}/coldroom/myonemedpro/operation/sendPrescription.php";
