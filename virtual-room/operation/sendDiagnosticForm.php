<?php
// relay to handler in /myonemedpro
require "../../functions.php";
$_POST["doctorPostId"] = $_SESSION["doctorid"]["dr_post_id"];
require "{$_SERVER["DOCUMENT_ROOT"]}/coldroom/myonemedpro/operation/sendDiagnosticForm.php";
