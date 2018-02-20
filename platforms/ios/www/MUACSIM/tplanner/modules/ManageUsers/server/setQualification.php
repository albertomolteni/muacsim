<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

if ($_POST['status'] == "true") $mysqli->query("INSERT INTO user_qualification (userID,qualificationID) VALUES ($_POST[userID],$_POST[qualificationID])");
else                            $mysqli->query("DELETE FROM user_qualification WHERE userID=$_POST[userID] AND qualificationID=$_POST[qualificationID] ");

echo "OK";
