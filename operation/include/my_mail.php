<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require "vendor/autoload.php";
// require '..\vendor\autoload.php';

function mailer()
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = "smtp-pulse.com";
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
    $mail->Username = 'support@myhealthafrica.com';
    $mail->Password = 'La5tSLEeeKCF8M8';
    $mail->SMTPDebug = 0;

    return $mail;
}

function logMailerError($error_msg)
{
    $time = new DateTime("now", new DateTimeZone("+3"));
    $time = $time->format("Y-m-d H:i:s");

    $mailer_error_log = fopen($_SERVER['DOCUMENT_ROOT'] . "/patient/mailer_error_log.txt", 'a');
    fwrite($mailer_error_log, "[$time]=>\t" . $error_msg . "" . PHP_EOL);
    fclose($mailer_error_log);
}
