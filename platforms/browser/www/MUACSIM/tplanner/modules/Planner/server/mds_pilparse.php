<?php

header("Content-Type: text/plain");

$pilot_initials = ["","","","","","","","","","XV","XO","XD","XW","XL","XM","XK","XS","XE","RY"];

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$limit    = new DateTime('@'.substr(json_decode(file_get_contents("../../../config.json"))->rosterPublished,0,-3));
$records  = $mysqli->query("SELECT user_shift.*,shift.name,shift.t_from,shift.t_to,shift.type FROM user_shift,shift WHERE userID>8 AND user_shift.shiftID=shift.shiftID ORDER BY day,t_from");
while ($r = $records->fetch_object()) {
	if ($r->shiftID != 14 && $r->day <= $limit->format('Y-m-d')) {
		$prefix = '';
		if ($r->dutyChange != '') {
			$e = explode(';',$r->dutyChange);
			if ($e[1] != '') $prefix = 'D';
			else             $prefix = 'E';
		}
		echo $pilot_initials[$r->userID]."</>".$prefix.$r->name."</>".substr($r->day,8,2)."-".substr($r->day,5,2)."-".substr($r->day,0,4)." ".$r->t_from."</>".substr($r->day,8,2)."-".substr($r->day,5,2)."-".substr($r->day,0,4)." ".$r->t_to."\r\n";
	}
}
