<?php

require_once '../includes/db.php';

    $success = 'insertOk';
    $error = 'insertError';

    if ( isset($_REQUEST['title']) && isset($_REQUEST['label']) && isset($_REQUEST['date']) && isset($_REQUEST['time'])  ) {

        // Note information
        $title = $_REQUEST['title'];
        $label = $_REQUEST['label'];
        $date = $_REQUEST['date'];
        $time = $_REQUEST['time'];

        // Insert query
        $query = "INSERT INTO $TBL_NOTE (title, label, date, time) VALUES ('$title', '$label', '$date', '$time')";

        // Check for errors
        if (!$mysqli->query($query)) {
            $response = array('message' => $error);
            echo json_encode($response);
        }

        // If all went good sent message and inserted note ID
        $response = array('message' => $success, 'id' => mysqli_insert_id($mysqli));
        echo json_encode($response);

    }
?>