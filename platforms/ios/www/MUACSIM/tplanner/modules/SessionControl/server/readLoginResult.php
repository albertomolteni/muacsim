<?php

session_start();

$a = explode(',',file_get_contents("../../../loginAttempt.txt"));

if ($_SERVER['REMOTE_ADDR'] === $a[0]) {
	if ($a[3] === '2') {
		$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");
		$u      = $mysqli->query("SELECT userID,name FROM user WHERE username='$a[1]'")->fetch_object();
		
		if (!$u) exit(0);
		
		$_SESSION['userID']      = $u->userID;
		$_SESSION['name']        = $u->name;
		$_SESSION['accessLevel'] = $u->userID<9 ? 'manager' : 'pilot';
		
		unlink("../../../loginAttempt.txt");
	}
	echo $a[3];
} else {
	echo(0);
}
