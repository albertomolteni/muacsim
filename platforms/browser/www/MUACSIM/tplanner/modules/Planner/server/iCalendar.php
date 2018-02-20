<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");
$limit  = new DateTime('@'.substr(json_decode(file_get_contents("../../../config.json"))->rosterPublished,0,-3));

for ($userID=1 ; $userID<19 ; $userID++) {
	file_put_contents("../../../iCalendar$userID.ics","BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//EUROCONTROL//NONSGML MUACSIM//EN\r\nBEGIN:VTIMEZONE\r\nTZID:Europe/Amsterdam\r\nBEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nDTSTART:20180325T020000\r\nTZNAME:GMT+02:00\r\nTZOFFSETTO:+0200\r\nEND:DAYLIGHT\r\nBEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nDTSTART:20181028T030000\r\nTZNAME:GMT+01:00\r\nTZOFFSETTO:+0100\r\nEND:STANDARD\r\nEND:VTIMEZONE\r\n");
	$records  = $mysqli->query("SELECT user_shift.*,shift.name,shift.t_from,shift.t_to,shift.type FROM user_shift,shift WHERE userID=$userID AND user_shift.shiftID=shift.shiftID ORDER BY day,t_from");
	while ($r = $records->fetch_object()) {
		if ($r->type < 3 && $r->day < $limit->format('Y-m-d')) {
			file_put_contents("../../../iCalendar$userID.ics","BEGIN:VEVENT\r\nUID:".$r->user_shiftID."\r\nDTSTAMP:".preg_replace('/-/','',$r->day)."T".preg_replace('/:/','',$r->t_from)."\r\nDTSTART;TZID=Europe/Amsterdam:".preg_replace('/-/','',$r->day)."T".preg_replace('/:/','',$r->t_from)."\r\nDTEND;TZID=Europe/Amsterdam:".preg_replace('/-/','',$r->day)."T".preg_replace('/:/','',$r->t_to)."\r\nSUMMARY:".$r->name."\r\nEND:VEVENT\r\n",FILE_APPEND);
		}
	}
	file_put_contents("../../../iCalendar$userID.ics","END:VCALENDAR\r\n",FILE_APPEND);
}
