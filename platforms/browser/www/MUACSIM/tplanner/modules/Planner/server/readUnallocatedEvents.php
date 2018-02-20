<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$out      = [];
$records  = $mysqli->query("SELECT simeventID,requiredRoles,dt_from,allocationCount FROM simevent LEFT JOIN (SELECT simeventID id,COUNT(*) allocationCount FROM simevent_user GROUP BY simeventID)q ON simevent.simeventID=q.id HAVING dt_from LIKE '$_POST[month]%' AND requiredRoles != ''");
while ($r = $records->fetch_object()) {
	$m = 0;
	$z = explode(',',$r->requiredRoles);
	foreach ($z as &$q) $m += explode(':',$q)[1];
	if ($m > $r->allocationCount) $out[] = $r;
}

echo json_encode($out);
