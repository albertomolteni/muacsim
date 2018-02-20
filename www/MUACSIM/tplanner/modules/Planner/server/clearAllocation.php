<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$events = [];

if ($_POST['bulk']) {
	$records  = $mysqli->query("SELECT simeventID FROM simevent WHERE courseID IN (SELECT courseID FROM simevent WHERE simeventID=$_POST[eventID]) HAVING simeventID>=$_POST[eventID]");
	while ($r = $records->fetch_object()) $events[] = $r->simeventID;
} else {
	$events[] = $_POST['eventID'];
}

$mysqli->query("DELETE FROM simevent_user WHERE draft=1 AND simeventID IN (" . implode(',',$events) . ")");
