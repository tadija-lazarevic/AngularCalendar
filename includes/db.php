<?php

// Parse the config file
$dbInfo = @explode(':', file_get_contents('../dbconfig'));

if (is_array($dbInfo) && array_key_exists(3, $dbInfo)) {
  $DB_HOST = $dbInfo[0];
  $DB_USER = $dbInfo[1];
  $DB_PASS = $dbInfo[2];
  $DB_NAME = $dbInfo[3];
} else {
  header("Status: 500 Database error");
  echo "Could not parse config file. Run install.php again.";
  exit;
}



if (!$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME)) {
  header("Status: 500 Database error");
  echo "Could not connect to database with configured details.";
  exit;
}
mysqli_set_charset($mysqli,"utf8");

$TBL_NOTE = 'notes';
