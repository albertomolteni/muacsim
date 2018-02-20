<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$sick     = [];
$records  = $mysqli->query("SELECT name FROM user WHERE userID IN (SELECT userID FROM user_shift WHERE shiftID=14 AND day='".date("Y-m-d")."')");
while ($r = $records->fetch_object()) $sick[] = $r->name;

$leave    = [];
$records  = $mysqli->query("SELECT name FROM user WHERE userID IN (SELECT userID FROM user_shift WHERE shiftID=10 AND day='".date("Y-m-d")."')");
while ($r = $records->fetch_object()) $leave[] = $r->name;

echo json_encode(array("sick" => $sick , "leave" => $leave));
