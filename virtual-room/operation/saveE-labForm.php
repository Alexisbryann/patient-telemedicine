<?php
// relay request to handler in myonemedpro
require "../../functions.php";
$_POST["doctorDiagnosticPostId"] = $_SESSION["doctorid"]["dr_post_id"];
require "{$_SERVER['DOCUMENT_ROOT']}/coldroom/myonemedpro/operation/saveE-labForm.php";
