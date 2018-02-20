<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$out      = [];
$records  = $mysqli->query("SELECT simeventID,name,courseID,dt_from,dt_to FROM simevent WHERE simeventID NOT IN (SELECT simeventID FROM simevent_user) AND requiredRoles!='' AND dt_from>'2018-02-01' ORDER BY dt_from");
while ($r = $records->fetch_object()) $out[] = $r;

echo json_encode($out);
