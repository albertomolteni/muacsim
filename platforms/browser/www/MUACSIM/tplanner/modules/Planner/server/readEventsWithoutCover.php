<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$out = [];
$sac = [];

$records  = $mysqli->query("SELECT day,MIN(t_from) min,MAX(t_to) max FROM (SELECT user_shift.day,shift.t_from,shift.t_to FROM user_shift,shift WHERE user_shift.shiftID<4 AND user_shift.shiftID=shift.shiftID)q GROUP BY day");
while ($r = $records->fetch_object()) $sac[$r->day] = $r;

$records  = $mysqli->query("SELECT name,dt_from,dt_to FROM simevent WHERE dt_from>NOW() ORDER BY dt_from");
while ($r = $records->fetch_object()) if (isset($sac[substr($r->dt_from,0,10)])) if (substr($r->dt_from,11)<$sac[substr($r->dt_from,0,10)]->min || substr($r->dt_to,11)>$sac[substr($r->dt_to,0,10)]->max) $out[] = $r;

echo json_encode($out);
