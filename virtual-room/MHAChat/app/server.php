<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use MHAChat\Chat;

require dirname(__DIR__, 3) . "/vendor/autoload.php";
require dirname(__DIR__) . "/app/ChatApp.php";

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),
    8080
);

echo "foo";

$server->run();
