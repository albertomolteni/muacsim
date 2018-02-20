<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$events = [];

if ($_POST['bulk']) {
	$records  = $mysqli->query("SELECT simeventID FROM simevent WHERE courseID IN (SELECT courseID FROM simevent WHERE simeventID=$_POST[eventID]) HAVING simeventID>=$_POST[eventID]");
	while ($r = $records->fetch_object()) $events[] = $r->simeventID;
} else {
	$events[] = $_POST['eventID'];
}

$mysqli->query("UPDATE simevent_user SET draft=0 WHERE simeventID IN (" . implode(',',$events) . ")");

foreach ($events as &$eventID) {
	$day = substr($mysqli->query("SELECT dt_from FROM simevent WHERE simeventID=$eventID")->fetch_object()->dt_from,0,10);
	
	$calculate_shifts = [];
	$records  = $mysqli->query("SELECT userID FROM simevent_user WHERE simeventID=$eventID");
	while ($r = $records->fetch_object()) $calculate_shifts[] = $r->userID;
	
	foreach ($calculate_shifts as $u) {
		$allDutiesThisDay = [];
		
		$records  = $mysqli->query("SELECT dt_from,dt_to FROM simevent_user,simevent WHERE simevent_user.simeventID=simevent.simeventID AND draft=0 AND userID=$u AND dt_from LIKE '$day%'");
		while ($r = $records->fetch_object()) $allDutiesThisDay[] = $r;
		
		if (count($allDutiesThisDay)) {
			$min = $day.' 23:59:59';
			$max = $day.' 00:00:00';
			
			foreach ($allDutiesThisDay as $duty) {
				if ($duty->dt_from < $min) $min = $duty->dt_from;
				if ($duty->dt_to   > $max) $max = $duty->dt_to;
			}
			
			$shiftID = $mysqli->query("SELECT shiftID FROM shift WHERE type=2 AND t_from<='".substr($min,11)."' AND t_to>='".substr($max,11)."'")->fetch_object()->shiftID;
			$mysqli->query("DELETE FROM user_shift WHERE userID=$u AND day='$day'");
			$mysqli->query("INSERT INTO user_shift (userID,day,shiftID,notes) VALUES ($u,'$day',$shiftID,'')");
		} else {
			$mysqli->query("DELETE FROM user_shift WHERE userID=$u AND day='$day'");
		}
	}
}