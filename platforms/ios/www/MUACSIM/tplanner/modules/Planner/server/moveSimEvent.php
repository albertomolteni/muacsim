<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$times0 = array("m" => "08:00:00" , "s" => "13:00:00" , "a" => "17:30:00");
$times1 = array("m" => "12:30:00" , "s" => "17:30:00" , "a" => "22:00:00");

if  ($mysqli->query("SELECT * FROM simevent_user WHERE simeventID=$_POST[eventID]")->num_rows) die();
$e = $mysqli->query("SELECT * FROM simevent      WHERE simeventID=$_POST[eventID]")->fetch_object();
$mysqli->query("UPDATE simevent SET dt_from='" . substr($e->dt_from,0,11) . $times0[$_POST['moveTo']] . "',dt_to='" . substr($e->dt_to,0,11) . $times1[$_POST['moveTo']] . "' WHERE simeventID=$_POST[eventID]");
