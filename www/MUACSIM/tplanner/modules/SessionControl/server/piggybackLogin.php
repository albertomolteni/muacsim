<?php

session_start();

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");
$u      = $mysqli->query("SELECT userID,name FROM user WHERE username='".$mysqli->real_escape_string($_POST['username'])."'")->fetch_object();

if (!$u) exit(0);

$_SESSION['userID']      = $u->userID;
$_SESSION['name']        = $u->name;
$_SESSION['accessLevel'] = $u->userID<9 ? 'manager' : 'pilot';
