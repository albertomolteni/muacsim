<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$courseID = $_POST['courseID'];
$events   = json_decode($_POST['events']);

foreach ($events as &$event) {
	if ($event->sim == 1) {
		$event->pilot_consoles = $event->atco_consoles;
		$event->mfs = 0;
	}
	$mysqli->query("INSERT INTO simevent (name,courseID,dt_from,dt_to,sim,mfs,atco_consoles,pilot_consoles,requiredRoles,bgcolor) VALUES ('".$mysqli->real_escape_string($event->title)."',$courseID,'".preg_replace('/T/',' ',$event->start)."','".preg_replace('/T/',' ',$event->end)."',$event->sim,$event->mfs,$event->atco_consoles,$event->pilot_consoles,'$event->requiredRoles','$event->color')");
}
