<?php

session_start();

$eventID      = (int) $_POST['eventID'];
$ignoreWishes = (int) $_POST['ignoreWishes'];

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$simevent = $mysqli->query("SELECT dt_from,dt_to,requiredRoles FROM simevent WHERE simeventID=$eventID")->fetch_object();
$eventDay = substr($simevent->dt_from,0,10);
$t_from   = substr($simevent->dt_from,11);
$t_to     = substr($simevent->dt_to,  11);


$incompatibleShifts = [];
$records  = $mysqli->query("SELECT shiftID FROM shift WHERE type=3 OR (t_from<'$t_to' AND t_to>'$t_from') OR TIME_TO_SEC(TIMEDIFF(t_to,'$t_from'))>34200 OR TIME_TO_SEC(TIMEDIFF('$t_to',t_from))>34200");
while ($r = $records->fetch_object()) $incompatibleShifts[] = $r->shiftID;


$wlu = [];
$ed  = new DateTime($simevent->dt_from);
$edw = (int) $ed->format("w");

// saturday
if ($edw == 6) {
	$records  = $mysqli->query("SELECT userID,COUNT(*) c FROM user_shift WHERE shiftID=10 AND day>DATE_SUB('".substr($simevent->dt_from,0,10)."',INTERVAL 6 DAY) AND day<DATE_SUB('".substr($simevent->dt_from,0,10)."',INTERVAL 0 DAY) GROUP BY userID HAVING c>3");
	while ($r = $records->fetch_object()) $wlu[] = $r->userID;
	$records  = $mysqli->query("SELECT userID,COUNT(*) c FROM user_shift WHERE shiftID=10 AND day>DATE_ADD('".substr($simevent->dt_from,0,10)."',INTERVAL 1 DAY) AND day<DATE_ADD('".substr($simevent->dt_from,0,10)."',INTERVAL 7 DAY) GROUP BY userID HAVING c>3");
	while ($r = $records->fetch_object()) $wlu[] = $r->userID;
}
// sunday
if ($edw == 0) {
	$records  = $mysqli->query("SELECT userID,COUNT(*) c FROM user_shift WHERE shiftID=10 AND day>DATE_SUB('".substr($simevent->dt_from,0,10)."',INTERVAL 7 DAY) AND day<DATE_SUB('".substr($simevent->dt_from,0,10)."',INTERVAL 1 DAY) GROUP BY userID HAVING c>3");
	while ($r = $records->fetch_object()) $wlu[] = $r->userID;
	$records  = $mysqli->query("SELECT userID,COUNT(*) c FROM user_shift WHERE shiftID=10 AND day>DATE_ADD('".substr($simevent->dt_from,0,10)."',INTERVAL 0 DAY) AND day<DATE_ADD('".substr($simevent->dt_from,0,10)."',INTERVAL 6 DAY) GROUP BY userID HAVING c>3");
	while ($r = $records->fetch_object()) $wlu[] = $r->userID;
}


$requiredRoles = explode(',',$simevent->requiredRoles);
$peopleInUse   = [];
$sqlQueries    = [];

foreach ($requiredRoles as $requiredRole) {
	$role = (int) explode(':',$requiredRole)[0];
	$qty  = (int) explode(':',$requiredRole)[1];
	
	$allocations = [];
	
	$pilots   = [];
	$records  = $mysqli->query("SELECT userID FROM user_qualification WHERE qualificationID=$role AND userID NOT IN (SELECT userID FROM user_shift WHERE day='$eventDay' AND shiftID IN (".implode(',',$incompatibleShifts)."))".(count($wlu)?" AND userID NOT IN (".implode(',',$wlu).")":""));
	while ($r = $records->fetch_object()) $pilots[] = $r->userID;
	
	$i = 0;
	while ($i < count($pilots)) {
		if (in_array($pilots[$i],$peopleInUse)) array_splice($pilots,$i,1);
		else $i++;
	}
	
	if (!$ignoreWishes) {
		$wishes   = [];
		$records  = $mysqli->query("SELECT userID,m,s,a FROM dutywish,dutywishday WHERE dutywish.dutywishID=dutywishday.dutywishID AND day='$eventDay'");
		while ($r = $records->fetch_object()) $wishes[] = $r;
		
		foreach ($wishes as $wish) {
			if ($wish->m == 0  &&   $t_from < '13:00:00'                       )  $pilots = array_values(array_diff($pilots,array($wish->userID)));
			if ($wish->s == 0  &&  ($t_from < '17:30:00' || $t_to > '13:00:00'))  $pilots = array_values(array_diff($pilots,array($wish->userID)));
			if ($wish->a == 0  &&                           $t_to > '17:30:00' )  $pilots = array_values(array_diff($pilots,array($wish->userID)));
		}
	}
	
	if (count($pilots) < $qty) exit("ERROR_INSUFFICIENT_QUALIFIED_PEOPLE");
	
	if ($edw>0 && $edw<6) {
		if ($t_from == '13:00:00' && $t_to == '17:30:00') {
			$records  = $mysqli->query("SELECT userID FROM simevent_user WHERE simeventID IN (SELECT simeventID FROM simevent WHERE (dt_from='$eventDay 08:00:00' AND dt_to='$eventDay 12:30:00') OR (dt_from='$eventDay 17:30:00' AND dt_to='$eventDay 22:00:00')) AND userID NOT IN (SELECT userID FROM simevent_user WHERE simeventID IN (SELECT simeventID FROM simevent WHERE dt_from='$eventDay 13:00:00' AND dt_to='$eventDay 17:30:00'))");
			while ($r = $records->fetch_object()) {
				if ($qty && count(array_intersect($pilots,array($r->userID)))) {
					$allocations[] = $r->userID;
					$peopleInUse[] = $r->userID;
					$qty--;
				}
			}
		}
	}
	
	if ($qty) {
		$pilotTotalHours = [];
		
		foreach ($pilots as &$pilot) {
			$outo = (object) array("userID" => $pilot , "minutesWorked" => 0);
			
			$outo->yearlyHours = $mysqli->query("SELECT yearlyHours FROM user WHERE userID=$pilot")->fetch_object()->yearlyHours;
			
			$utilizationRatio = 100;
			
			$records  = $mysqli->query("SELECT TIME_TO_SEC(TIMEDIFF(dt_to,dt_from))/60 shiftMinutes,DATEDIFF('$eventDay',dt_from) daysAgo,qualificationID FROM simevent,simevent_user WHERE simevent.simeventID=simevent_user.simeventID AND userID=$pilot AND dt_from LIKE '2018-%'");
			while ($r = $records->fetch_object()) {
				if ($r->daysAgo>0 && $r->daysAgo<7) {
					if ($r->qualificationID  ==  $role) $utilizationRatio += 6.0 * (8 - $r->daysAgo);
					else                                $utilizationRatio += 0.4 * (8 - $r->daysAgo);
				}
				$outo->minutesWorked += $r->shiftMinutes;
			}
			
	/*		$records  = $mysqli->query("SELECT TIME_TO_SEC(TIMEDIFF(shift.t_to,shift.t_from))/60 absenceMinutes FROM user_shift,shift WHERE user_shift.userID=" . $pilot->userID . " AND user_shift.day LIKE '2018-%' AND shift.type=3 AND user_shift.shiftID=shift.shiftID");
			while ($r = $records->fetch_object()) $outo->minutesWorked += $r->absenceMinutes; */
			
			$outo->utilization = $utilizationRatio * $outo->minutesWorked / $outo->yearlyHours;
			
			$pilotTotalHours[] = $outo;
		}
		
		usort($pilotTotalHours,function($a,$b){return $a->utilization - $b->utilization;});
		
		for ($i=0 ; $i<$qty ; $i++) {
			$allocations[] = $pilotTotalHours[$i]->userID;
			$peopleInUse[] = $pilotTotalHours[$i]->userID;
		}
	}
	
	foreach ($allocations as $allocation) {
		$sqlQueries[] = "INSERT INTO simevent_user (simeventID,userID,qualificationID,draft) VALUES ($eventID,$allocation,$role,1)";
	}
}

foreach ($sqlQueries as $sqlQuery) $mysqli->query($sqlQuery);
