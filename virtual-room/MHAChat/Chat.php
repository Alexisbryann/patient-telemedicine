<?php
class MhaChat
{
    private $conn;
    private $appointment_id;
    private $user_type;

    public function __construct($appointment_id, $user_type)
    {
        $db_connection = mysqli_connect("localhost", "myhealth_db", "g0%kVgZgex6W", "myhealth_database");

        $this->appointment_id = $appointment_id;
        $this->user_type = $user_type;

        if (mysqli_connect_error()) die(json_encode(["error" => "Database connection error", "error_code" => 0]));

        $this->conn = $db_connection;
    }

    private function logError(string $function_name, array $params, string $error_verbose, string $sql = "", string $exception = "")
    {
        /**
         * Writes error message to .txt file.
         * 
         * @param $function_name name of function error occurred in
         * @param $params parameters during occurrence of error
         * @param $error_verbose detailed message describing what the error is
         * @param $sql sql statement that failed (if error is on a query)
         * @param $exception PHP generated exception, throwable or mysqli_error() message
         * 
         * @return void
         */

        $time = new DateTime("now", new DateTimeZone("+3"));
        $time = $time->format("Y-m-d H:i:s");

        $msg = "$error_verbose\n";
        $msg .= "Function: $function_name\n";
        $msg .= "Params: " . print_r($params, true) . "\n";
        if ($sql) $msg .= "SQL: $sql\n";
        if ($exception) $msg .= "$exception";

        $error_log = fopen("psi_telemed_error_log.txt", 'a');
        fwrite($error_log, "[$time]=>\t" . $msg . "\n\n");
        fclose($error_log);
    }

    public function saveNewMessage(
        int $patient_id,
        int $doctor_id,
        string $channel_id,
        int $appointment_id,
        string $message,
        string $file_paths
    ) {
        /**
         * Saves chat message to db
         * 
         * @param int $patient_id patient user id
         * @param int $doctor_id doctor id
         * @param string $channel_id channel id
         * @param string $message message
         * @param array $file_paths uploaded file paths in delimiter separated string. delimiter is #?#
         * 
         * @return array any errors that occur or empty array if none occur
         */

        $db = $this->conn;
        $appointment_id = $this->appointment_id;
        $sender = $this->user_type;

        $channel_id = mysqli_real_escape_string($db, $channel_id);
        $doctor_id = mysqli_real_escape_string($db, $doctor_id);
        $patient_id = mysqli_real_escape_string($db, $patient_id);
        $message = mysqli_real_escape_string($db, $message);
        $selectedfile = mysqli_real_escape_string($db, $file_paths);
        $date_added = new DateTimeImmutable("now", new DateTimeZone("+3"));
        $date_added = $date_added->format("Y-m-d H:i:s");

        $save_message = $db->prepare("INSERT INTO `chat`(`channel_id`, `doctor_id`, `patient_id`, `app_id`, `msg`, `selectedfile`, `msg_from`, `date_added`) VALUES (?,?,?,?,?,?,?,?)");

        $save_message->bind_param("ssssssss", $channel_id, $doctor_id, $patient_id, $appointment_id, $message, $selectedfile, $sender, $date_added);

        $save_message->execute();

        if (mysqli_error($db)) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to insert chat message", "", mysqli_error($db));
            return ["error" => "Failed to save message", "error_code" => 1];
        }

        return array();
    }

    private function saveUpload(
        array $file_uploads,
        string $channel_id
    ) {
        /**
         * validates and stores uploaded files to upload directory for the respective hospital
         * 
         * @param array $file_uploads files submitted through form
         * @param string $channel_id channel id
         * 
         * @return string location of stored file or error or null
         */

        if (empty($file_uploads["name"])) return null;

        if (!empty($file_uploads["error"])) {
            $this->logError(__FUNCTION__, func_get_args(), "Error uploading file", "", $file_uploads["error"]);
            return null;
        }

        $allowed = array('gif', 'png', 'jpg', 'jpeg', 'pdf', 'txt', 'doc', 'docx', "odt");
        $file_name = $file_uploads["name"];
        $tmp_name = $file_uploads["tmp_name"];

        $extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        if (!in_array($extension, $allowed)) { // stop execution if there's a file with an unsupported extension
            $this->logError(__FUNCTION__, func_get_args(), "Unsupported file extension", "", $file_uploads["error"]);
            return "unsupported file extension $extension";
        }

        $uploads_path = "{$_SERVER["DOCUMENT_ROOT"]}/myonemedpro/psi-telemedicine/uploads/$channel_id";
        if (!is_dir($uploads_path)) mkdir($uploads_path);

        $target_path = "$uploads_path/$file_name";
        move_uploaded_file($tmp_name, $target_path);

        return "uploads/$channel_id/$file_name";
    }

    public function getChatMessages(
        int $user_id
    ) {
        /**
         * Gets chat messages that a user should see
         * 
         * @param string $user_type user type, either patient or doctor
         * @param string $user_id user id
         * 
         * @return array list of chat messages that the user should see
         */

        $db = $this->conn;
        $appointment_id = $this->appointment_id;

        $messages_statement = $db->prepare("SELECT msg_from, date_added, msg, selectedfile FROM chat WHERE app_id = ?");
        $messages_statement->bind_param("s", $appointment_id);
        $messages_statement->execute();

        if (mysqli_error($db)) {
            $this->logError(__FUNCTION__, func_get_args(), "Failed to fetch chat messages.", "", mysqli_error($db));

            return ["error" => "Failed to fetch chat messages.", "error_code" => 1];
        }

        $messages = array();
        $messages_result = $messages_statement->get_result();

        while ($message = $messages_result->fetch_assoc()) {
            $message["date_added"] = date("d/m h:i", strtotime($message["date_added"]));
            $message["msg"] = stripslashes($message["msg"]);
            $message["selectedfile"] = explode("#?#", $message["selectedfile"]);

            array_push($messages, $message);
        }

        return $messages;
    }

    public function updateConnection(
        int $connection_id
    ) {
        /**
         * Updates connection record for current appointment with socket resource id for connected party
         * 
         * @param int $connection_id resource id for new party
         * 
         * @return void
         */

        $db = $this->conn;
        $appointment_id = $this->appointment_id;
        $user_type = $this->user_type;

        if ($user_type == "Pat") {
            $recipient_id_field = "patient_connection_id";
        } else {
            $recipient_id_field = "doctor_connection_id";
        }

        $update_slq = "UPDATE `chat_connections` SET `$recipient_id_field`= ? WHERE appointment_id = $appointment_id";

        $update_statement = $db->prepare($update_slq);
        $update_statement->bind_param("i", $connection_id);
        $update_statement->execute();

        if (mysqli_error($db)) $this->logError(__FUNCTION__, func_get_args(), "Failed to update chat connection.", "", mysqli_error($db));
    }

    public function getRecipientConnectionId()
    {
        /**
         * Gets the connection id of the recipient to route the message
         * 
         * @return int resource id of the second party in the chat
         */

        $db = $this->conn;

        if ($this->user_type == "Pat") {
            $recipient_id_field = "doctor_connection_id";
        } else {
            $recipient_id_field = "patient_connection_id";
        }

        $recipient_id_qry = "SELECT `$recipient_id_field` FROM chat_connections WHERE appointment_id = ?";
        $recipient_id_statement = $db->prepare($recipient_id_qry);
        $recipient_id_statement->bind_param("i", $this->appointment_id);
        $recipient_id_statement->execute();

        $recipient_id = $recipient_id_statement->get_result()->fetch_assoc()[$recipient_id_field];
        return $recipient_id;
    }
}
