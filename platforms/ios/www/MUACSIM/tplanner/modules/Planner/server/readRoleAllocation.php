<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$eventID = $_POST['eventID'];

$allocations = [];
$records  = $mysqli->query("SELECT userID,qualificationID FROM simevent_user WHERE simeventID=$eventID");
while ($r = $records->fetch_object()) $allocations[] = $r;

echo json_encode($allocations);
