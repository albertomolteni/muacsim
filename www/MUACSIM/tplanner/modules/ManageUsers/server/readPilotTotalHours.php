<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$pilots   = [];
$records  = $mysqli->query("SELECT userID,surname,yearlyHours FROM user WHERE contractType>3");
while ($r = $records->fetch_object()) $pilots[] = $r;

$out = [];

foreach ($pilots as $pilot) {
	$outo = (object) array("userID" => $pilot->userID , "surname" => $pilot->surname , "yearlyHours" => $pilot->yearlyHours , "minutesWorked" => []);
	
	for ($month=1 ; $month<13 ; $month++) {
		$minutesWorked = 0;
		$records  = $mysqli->query("SELECT user_shift.user_shiftID,user_shift.day,TIME_TO_SEC(TIMEDIFF(shift.t_to,shift.t_from))/60 shiftMinutes FROM user_shift,shift WHERE user_shift.userID=" . $pilot->userID . " AND user_shift.day LIKE '2018-" . sprintf("%'.02d",$month) . "-%' AND shift.shiftID<10 AND dutyChange NOT LIKE '%;' AND user_shift.shiftID=shift.shiftID");
		while ($r = $records->fetch_object()) $minutesWorked += $r->shiftMinutes;
		
		$records  = $mysqli->query("SELECT user_shift.user_shiftID,user_shift.day,TIME_TO_SEC(TIMEDIFF(shift.t_to,shift.t_from))/60 shiftMinutes FROM user_shift,shift WHERE user_shift.userID=" . $pilot->userID . " AND user_shift.day LIKE '2018-" . sprintf("%'.02d",$month) . "-%' AND user_shift.shiftID=14 AND shift.name=SUBSTRING(dutyChange,12)");
		while ($r = $records->fetch_object()) $minutesWorked += $r->shiftMinutes;
		
		$outo->minutesWorked[] = $minutesWorked;
	}
	
	$outo->weekends = $mysqli->query("SELECT 17.5*SUM(TIME_TO_SEC(TIMEDIFF(t_to,t_from))/3600) weekends FROM user_shift,shift WHERE userID=" . $pilot->userID . " AND user_shift.shiftID<10 AND user_shift.shiftID=shift.shiftID AND day LIKE '2018-%' AND (DAYOFWEEK(day)=7 OR DAYOFWEEK(day)=1)")->fetch_object()->weekends;
	
	$shiftCounts = [];
	$records     = $mysqli->query("SELECT shiftID,COUNT(*) c   FROM user_shift WHERE userID=" . $pilot->userID . " AND day LIKE '2018-%' AND shiftID<10 GROUP BY shiftID");
	while ($r    = $records->fetch_object()) $shiftCounts[] = $r->shiftID . ':' . $r->c;
	
	$outo->shiftCounts = implode(',',$shiftCounts);
	
	$out[] = $outo;
}

echo json_encode($out);
