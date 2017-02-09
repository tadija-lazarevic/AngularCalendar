<?php

    require_once '../includes/db.php';

    $success = 'deleteOk';
    $error = 'deleteError';

    if (isset($_REQUEST['id']))
    {
        $id = $_REQUEST['id'];
    }
    else
    {
        echo $error;
    }

    $query = "DELETE FROM $TBL_NOTE WHERE id = $id";

    if (!$mysqli->query($query)) {
        $response = array('message' => $error);
        echo json_encode($response);
    }

    // If all went good sent message
    $response = array('message' => $success);
    echo json_encode($response);

?>