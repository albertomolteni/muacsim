<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$mysqli->query("INSERT INTO user_shift (userID,day,shiftID,dutyChange,notes) VALUES ($_POST[userID],'$_POST[day]',$_POST[shiftID],'','')");
