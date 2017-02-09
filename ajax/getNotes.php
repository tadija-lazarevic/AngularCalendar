<?php
    require_once '../includes/db.php';

    # Data for return
    $result = array();
    $success = 'listOk';

    if ( isset($_REQUEST['from']) && isset($_REQUEST['to'])  ) {

        $from = $_REQUEST['from'];
        $to = $_REQUEST['to'];

        $listOfNotes = $mysqli->query( "SELECT * FROM $TBL_NOTE WHERE Date BETWEEN '$from' AND '$to' ");
        #$listOfNotes = $mysqli->query("SELECT * FROM $TBL_NOTE");
        while($r = mysqli_fetch_assoc($listOfNotes)) {
          $result[] = $r;
        }

        $response = array('message' => $success, 'notes' => $result);
        echo json_encode($response);
    }



?>