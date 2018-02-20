<?php

session_start();

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$out      = [];
$records  = $mysqli->query("SELECT dutyswap.*,CONCAT_WS(\" \",user1.name,user1.surname) requestingName,CONCAT_WS(\" \",user2.name,user2.surname) targetName FROM dutyswap,user user1,user user2 WHERE status='AGREED' AND dutyswap.requesting=user1.userID AND dutyswap.target=user2.userID");
while ($r = $records->fetch_object()) {
	$out[] = $r;
	
	$z = $mysqli->query("SELECT name FROM shift,user_shift WHERE shift.shiftID=user_shift.shiftID AND userID=$r->requesting AND day='$r->day'");
	if  ($z->num_rows) $r->requestingShift = $z->fetch_object()->name;
	else               $r->requestingShift = "off";
	
	$z = $mysqli->query("SELECT name FROM shift,user_shift WHERE shift.shiftID=user_shift.shiftID AND userID=$r->target     AND day='$r->day'");
	if  ($z->num_rows) $r->targetShift = $z->fetch_object()->name;
	else               $r->targetShift = "off";
}

echo json_encode($out);
