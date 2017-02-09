<?php


// Warning! Delete this file after installation.
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ERROR);
$host = (isset($_POST['dbhost']) && strlen($_POST['dbhost']) > 0 ) ? $_POST['dbhost'] : 'localhost';
$user = (isset($_POST['dbuser']) && strlen($_POST['dbuser']) > 0 ) ? $_POST['dbuser'] : 'root';
$pass = (isset($_POST['dbpass']) && strlen($_POST['dbpass']) > 0 ) ? $_POST['dbpass'] : '';
$name = (isset($_POST['dbname']) && strlen($_POST['dbname']) > 0 ) ? $_POST['dbname'] : 'calendar';
$error = false;
if (isset($_POST['submit']) && $host && $user && $name) {
  if (!$mysqli = new mysqli($host, $user, $pass, $name)) {
    header("Status: 500 Database error");
    $error = true;
    exit;
  } else {
    // Save the values to a file.
    file_put_contents('dbconfig', "$host:$user:$pass:$name") or die("Cannot create config file. Check Filesystem permissions.");
    // Create the required tables
    $mysqli->query("CREATE TABLE `notes` (
                     `id` int(11) NOT NULL AUTO_INCREMENT,
                     `title` varchar(200) DEFAULT NULL,
                     `label` varchar(20) DEFAULT NULL,
                     `date` date DEFAULT NULL,
                     `time` varchar(14) NOT NULL,
                     PRIMARY KEY (`id`)
                    ) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8") or die("Could not create tables. Make sure all details are correct, and the specified database exists.");
    header("Location: index.php");
    exit;


  }
}
// END PHP
?><!DOCTYPE html>
  <html>
    <head>
      <title>Installer</title>
      <link rel="stylesheet" href="css/bootstrap.css">
      <style>
        label, button[type=submit]{
          margin-top: 1em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-md-offset-2">
            <h1>Project Task</h1>
            <p>
              The MySQL database needs to be configured in the first run.
            </p>
            <h4>
              Please provide the database details and press 'Install'
            </h4>
            <form class="form-horizontal" action="install.php" method="post">
              <label for="dbhost">DB Host</label>
              <input class="form-control" name="dbhost" placeholder="localhost"
                     value="<?php echo @$host; ?>">
              <label for="dbuser">Username</label>
              <input class="form-control" name="dbuser" placeholder="root"
                     value="<?php echo @$user; ?>">
              <label for="dbpass">Password</label>
              <input class="form-control" name="dbpass" type="password" placeholder="toor"
                     value="<?php echo @$pass; ?>">
              <label for="dbname">DB Name</label>
              <input class="form-control" name="dbname" placeholder="project_task"
                     value="<?php echo @$name; ?>">
                     <?php
                     if ($error) {
                       echo '<div class="alert alert-danger">Invalid Details!</div>';
                     }
                     ?>
              <input type="submit" class="btn btn-success" name="submit" value="Install">
            </form>
          </div>
        </div>
      </div>
    </body>
  </html>