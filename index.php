<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <base href="/"/>
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:400,600|Roboto:400,500,700" rel="stylesheet">


    <!-- CSS -->
    <link rel="stylesheet" href="css/calendar.css">
    <link href='lib/angular-toastr/dist/angular-toastr.css' rel='stylesheet' type='text/css'>
</head>
<body ng-app="app">

    <!-- Init the component -->
    <my-super-calendar startYear="2015" endYear="2020">
    </my-super-calendar>
</body>

<!-- LIBRARY'S ( angular, toastr ) -->
<script type="text/javascript" src="lib/angular/angular.js"></script>
<script type="text/javascript" src="lib/angular-toastr/dist/angular-toastr.js"></script>
<script type="text/javascript" src="lib/angular-toastr/dist/angular-toastr.tpls.js"></script>

<!-- These are needed for normalizing the scroll -->
<script type="text/javascript" src="lib/hamsterjs/hamster.js"></script>
<script type="text/javascript" src="lib/angular-mousewheel/mousewheel.js"></script>


<!-- Calendar scripts ( calendar.module must be called fist ) -->
<script type="text/javascript" src="app/calendar.module.js"></script>
<script type="text/javascript" src="app/calendar.component.js"></script>
<script type="text/javascript" src="app/calendar.service.js"></script>
<script type="text/javascript" src="app/calendar.filters.js"></script>
<script type="text/javascript" src="app/calendar.directives.js"></script>

</html>
