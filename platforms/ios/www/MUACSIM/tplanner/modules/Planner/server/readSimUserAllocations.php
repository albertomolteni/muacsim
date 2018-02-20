<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$out = [];

$records  = $mysqli->query("SELECT simevent_user.*,dt_from FROM simevent_user,simevent WHERE simevent_user.simeventID=simevent.simeventID ORDER BY draft,dt_from DESC");
while ($r = $records->fetch_object()) $out[] = $r;

echo json_encode($out);
