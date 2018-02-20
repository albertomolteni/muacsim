<?php

session_start();

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");
require '../../../lib/twilio-php-master/Twilio/autoload.php';
use Twilio\Rest\Client;

$Twilio_sid    = 'AC4b3c15ff563e3fe25bb691b2e0edbe6f';
$Twilio_token  = 'd4c7095ddc5b5f98a45c2661d6601108';
$Twilio_client = new Client($Twilio_sid,$Twilio_token);

$ertw    = $_POST['ertw'];
$today   = date("Y-m-d");
$smsBody = $_SESSION['name'] . ' has reported sick. Expected return to work ' . substr($ertw,8,2) . '-' . substr($ertw,5,2) . '-' . substr($ertw,0,4);
if (isset($_POST['comments'])) if (strlen($_POST['comments'])) $smsBody .= "\n\nComments: " . base64_decode($_POST['comments']);


$records  = $mysqli->query("SELECT user_shiftID,name FROM user_shift,shift WHERE userID=$_SESSION[userID] AND day>='$today' AND day<'$ertw' AND type<3 AND shift.shiftID=user_shift.shiftID");
while ($r = $records->fetch_object()) $mysqli->query("UPDATE user_shift SET dutyChange='$today;" . $r->name . "',shiftID=14 WHERE user_shiftID=" . $r->user_shiftID);

$smsBody .= "\n\nCourses affected:";

$records  = $mysqli->query("SELECT simevent_userID,qualificationID,name,dt_from FROM simevent_user,simevent WHERE userID=$_SESSION[userID] AND dt_from>'$today 00:00:00' AND dt_from<'$ertw 00:00:00' AND simevent.simeventID=simevent_user.simeventID ORDER BY dt_from");
while ($r = $records->fetch_object()) {
	$smsBody .= "\n- " . $r->name . " on " . substr($r->dt_from,8,2) . "-" . substr($r->dt_from,5,2) . "-" . substr($r->dt_from,0,4) . ($r->qualificationID>3 ? " (HYBRID)" : "");
	$mysqli->query("DELETE FROM simevent_user WHERE simevent_userID=" . $r->simevent_userID);
}


try {
	$Twilio_client->messages->create('+31651491428',array("from" => "+32460202066" , "body" => iconv("ISO-8859-1","UTF-8",$smsBody)));
} catch (TypeError $e) {}
