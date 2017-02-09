<?php
    require_once '../includes/db.php';

    $success = 'updateOk';
    $error = 'updateError';

    if (isset($_REQUEST['id']) && isset($_REQUEST['date']) && isset($_REQUEST['time']) && isset($_REQUEST['title']) && isset($_REQUEST['label']))
    {
        $noteid = $_REQUEST['id'];
        $date = $_REQUEST['date'];
        $time = $_REQUEST['time'];
        $title = $_REQUEST['title'];
        $label = $_REQUEST['label'];

        $query = "UPDATE $TBL_NOTE SET title = '$title', label = '$label', date = '$date', time = '$time'  WHERE id = $noteid";

        if ($mysqli->query($query) === TRUE) {
            $response = array('message' => $success);
            echo json_encode($response);
        }
        else {
            $response = array('message' => $error);
            echo json_encode($response);
        }
    }
    else
    {
        $error = 'noID';
        $response = array('message' => $error);
        echo json_encode($response);
    }

?>