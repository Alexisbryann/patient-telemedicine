<?php
require "Chat.php";

$appointment_id = 2832;
$user_type = "Doc";

$mha_chat = new MhaChat($appointment_id, $user_type);
// print_r($mha_chat->getRecipientConnectionId());


$foobar = "foo/bar/foobar.com";
$foo = "foo";
echo substr($foobar, strlen($foo) + 1);
