<?php

namespace MHAChat;

use MhaChat;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require dirname(__DIR__) . "/Chat.php";

class Chat implements MessageComponentInterface
{
    protected $clients;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        $query_string = $conn->httpRequest->getUri()->getQuery();

        parse_str($query_string, $query_params);

        $appointment_id = $query_params["appointment_id"];
        $user_type = $query_params["user_type"];

        $mha_chat = new MhaChat($appointment_id, $user_type);

        $mha_chat->updateConnection($conn->resourceId, $user_type);

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $numRecv = count($this->clients) - 1;
        echo sprintf(
            'Connection %d sending message "%s" to %d other connection%s' . "\n",
            $from->resourceId,
            $msg,
            $numRecv,
            $numRecv == 1 ? '' : 's'
        );

        $message_data = json_decode($msg, true);

        if (
            $message_data["user_type"]
            && $message_data["user_id"]
            && $message_data["recipient_id"]
            && $message_data["appointment_id"]
            && ($message_data["message"] || $message_data["file_paths"])
        ) {
            $mha_chat = new MhaChat($message_data["appointment_id"], $message_data["user_type"]);

            $patient_id = $message_data["user_type"] == "Pat" ? $message_data["user_id"] : $message_data["recipient_id"];
            $doctor_id = $message_data["user_type"] == "Doc" ? $message_data["user_id"] : $message_data["recipient_id"];

            $mha_chat->saveNewMessage(
                $patient_id,
                $doctor_id,
                "$patient_id - $doctor_id",
                $message_data["appointment_id"],
                $message_data["message"],
                $message_data["file_paths"]
            );
        }

        $recipient_resource_id = $mha_chat->getRecipientConnectionId();

        foreach ($this->clients as $client) {
            if ($client->resourceId == $recipient_resource_id) { // only send to intended receiver
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}
