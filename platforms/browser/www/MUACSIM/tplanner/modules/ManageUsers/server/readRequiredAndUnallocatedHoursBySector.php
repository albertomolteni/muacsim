<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$sectors = ["","","","TOTAL","DECO","BRU","HANN"];

$out = [];

for ($s=3 ; $s<7 ; $s++) {
	$outo = (object) array("sector" => $sectors[$s] , "required" => [] , "unallocated" => []);
	
	for ($month=1 ; $month<13 ; $month++) {
		// required
		$minutes  = 0;
		$records  = $mysqli->query("SELECT simeventID,TIME_TO_SEC(TIMEDIFF(dt_to,dt_from))/60 eventMinutes,requiredRoles FROM simevent WHERE dt_from LIKE '2018-" . sprintf("%'.02d",$month) . "-%' AND " . ($s==3 ? "requiredRoles != ''" : "requiredRoles LIKE '$s:%'"));
		while ($r = $records->fetch_object()) {
			$m = 0;
			$z = explode(',',$r->requiredRoles);
			foreach ($z as &$q) if (explode(':',$q)[0]==$s || $s==3) $m += explode(':',$q)[1];
			$minutes += $r->eventMinutes * $m;
		}
		
		$outo->required[] = $minutes;
		
		// unallocated
		$minutes  = 0;
		$records  = $mysqli->query("SELECT requiredRoles,dt_from,allocationCount,TIME_TO_SEC(TIMEDIFF(dt_to,dt_from))/60 eventMinutes FROM simevent LEFT JOIN (SELECT simeventID,COUNT(*) allocationCount FROM simevent_user " . ($s==3 ? "" : "WHERE qualificationID=$s") . " GROUP BY simeventID)q ON simevent.simeventID=q.simeventID HAVING dt_from LIKE '2018-" . sprintf("%'.02d",$month) . "-%' AND " . ($s==3 ? "requiredRoles != ''" : "requiredRoles LIKE '$s:%'"));
		while ($r = $records->fetch_object()) {
			if ($r->allocationCount === null) $r->allocationCount = 0;
			$m = 0;
			$z = explode(',',$r->requiredRoles);
			foreach ($z as &$q) if (explode(':',$q)[0]==$s || $s==3) $m += explode(':',$q)[1];
			$m -= $r->allocationCount;
			$minutes += $r->eventMinutes * $m;
		}
		
		$outo->unallocated[] = $minutes;
	}
	
	$out[] = $outo;
}

echo json_encode($out);
