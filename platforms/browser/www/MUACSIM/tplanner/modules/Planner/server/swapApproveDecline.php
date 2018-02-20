<?php

session_start();

if (!isset($_SESSION['userID'])) die();
if ($_SESSION['userID'] - 1)     die();

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");
require '../../../lib/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;

$Twilio_sid    = 'AC4b3c15ff563e3fe25bb691b2e0edbe6f';
$Twilio_token  = 'd4c7095ddc5b5f98a45c2661d6601108';
$Twilio_client = new Client($Twilio_sid,$Twilio_token);

$dutyswapID = $_POST['dutyswapID'];
$status     = $_POST['status'];


if ($status == 'DECLINED') {
	if ($_POST['sendSMS'] == 1) {
		$day     = $mysqli->query("SELECT day FROM dutyswap WHERE dutyswapID=$dutyswapID")->fetch_object()->day;
		
		$phone1  = $mysqli->query("SELECT phone FROM user WHERE userID IN (SELECT requesting FROM dutyswap WHERE dutyswapID=$dutyswapID)")->fetch_object()->phone;
		$phone2  = $mysqli->query("SELECT phone FROM user WHERE userID IN (SELECT target     FROM dutyswap WHERE dutyswapID=$dutyswapID)")->fetch_object()->phone;
		
		$smsBody = "Sorry, Bas has declined your swap request on " . substr($day,8,2) . "-" . substr($day,5,2) . "-" . substr($day,0,4);
		if (isset($_POST['comments'])) if (strlen($_POST['comments'])) $smsBody .= "\n\nComments: " . base64_decode($_POST['comments']);
		
		if (strlen($phone1)) {
			try {
				$Twilio_client->messages->create($phone1,array("from" => "+32460202066" , "body" => iconv("ISO-8859-1","UTF-8",$smsBody)));
			} catch (TypeError $e) {}
		}
		if (strlen($phone2)) {
			try {
				$Twilio_client->messages->create($phone2,array("from" => "+32460202066" , "body" => iconv("ISO-8859-1","UTF-8",$smsBody)));
			} catch (TypeError $e) {}
		}
	}
} else {
	$a = $mysqli->query("SELECT requesting,target,day,t_from,t_to,doubleSwap FROM dutyswap WHERE dutyswapID=$dutyswapID");
	$b = $a->fetch_object();
	
	$records1 = $mysqli->query("SELECT simevent_userID FROM simevent_user,simevent WHERE simevent_user.simeventID=simevent.simeventID AND draft=0 AND userID=".$b->requesting." AND dt_from<'".$b->day." ".$b->t_to."' AND dt_to>'".$b->day." ".$b->t_from."'");
	$records2 = $mysqli->query("SELECT simevent_userID FROM simevent_user,simevent WHERE simevent_user.simeventID=simevent.simeventID AND draft=0 AND userID=".$b->target    ." AND dt_from LIKE '".$b->day."%'");
	while ($r = $records1->fetch_object())                          $mysqli->query("UPDATE simevent_user SET userID=".$b->target    ." WHERE simevent_userID=".$r->simevent_userID);
	while ($r = $records2->fetch_object()) if ($b->doubleSwap == 1) $mysqli->query("UPDATE simevent_user SET userID=".$b->requesting." WHERE simevent_userID=".$r->simevent_userID);
	
	$calculate_shifts = array($b->requesting,$b->target);
	$day = $b->day;
	
	foreach ($calculate_shifts as $u) {
		$allDutiesThisDay = [];
		
		$records  = $mysqli->query("SELECT dt_from,dt_to FROM simevent_user,simevent WHERE simevent_user.simeventID=simevent.simeventID AND draft=0 AND userID=$u AND dt_from LIKE '$day%'");
		while ($r = $records->fetch_object()) $allDutiesThisDay[] = $r;
		
		if (count($allDutiesThisDay)) {
			$min = $day.' 23:59:59';
			$max = $day.' 00:00:00';
			
			foreach ($allDutiesThisDay as $duty) {
				if ($duty->dt_from < $min) $min = $duty->dt_from;
				if ($duty->dt_to   > $max) $max = $duty->dt_to;
			}
			
			$shiftID = $mysqli->query("SELECT shiftID FROM shift WHERE type=2 AND t_from<='".substr($min,11)."' AND t_to>='".substr($max,11)."'")->fetch_object()->shiftID;
			$mysqli->query("DELETE FROM user_shift WHERE userID=$u AND day='$day'");
			$mysqli->query("INSERT INTO user_shift (userID,day,shiftID,notes) VALUES ($u,'$day',$shiftID,'')");
			
			if ($_POST['sendSMS'] == 1) {
				$phone   = $mysqli->query("SELECT phone FROM user WHERE userID=$u")->fetch_object()->phone;
				
				$smsBody = "Good news - Bas has approved your swap request!";
				if (isset($_POST['comments'])) if (strlen($_POST['comments'])) $smsBody .= "\n\nComments: " . base64_decode($_POST['comments']);
				$smsBody.= "\n\nYour new duty on " . substr($day,8,2) . "-" . substr($day,5,2) . "-" . substr($day,0,4) . " is " . substr($min,11,5) . " - " . substr($max,11,5);
				
				if (strlen($phone)) {
					try {
						$Twilio_client->messages->create($phone,array("from" => "+32460202066" , "body" => iconv("ISO-8859-1","UTF-8",$smsBody)));
					} catch (TypeError $e) {}
				}
			}
		} else {
			$mysqli->query("DELETE FROM user_shift WHERE userID=$u AND day='$day'");
			
			if ($_POST['sendSMS'] == 1) {
				$phone   = $mysqli->query("SELECT phone FROM user WHERE userID=$u")->fetch_object()->phone;
				
				$smsBody = "Good news - Bas has approved your swap request!";
				if (isset($_POST['comments'])) if (strlen($_POST['comments'])) $smsBody .= "\n\nComments: " . base64_decode($_POST['comments']);
				$smsBody.= "\n\nYou are now off-duty on " . substr($day,8,2) . "-" . substr($day,5,2) . "-" . substr($day,0,4);
				
				if (strlen($phone)) {
					try {
						$Twilio_client->messages->create($phone,array("from" => "+32460202066" , "body" => iconv("ISO-8859-1","UTF-8",$smsBody)));
					} catch (TypeError $e) {}
				}
			}
		}
	}
}


$mysqli->query("UPDATE dutyswap SET status='$status' WHERE dutyswapID=$dutyswapID");
