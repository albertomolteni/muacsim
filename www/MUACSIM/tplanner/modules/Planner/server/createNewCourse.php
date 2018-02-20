<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$mysqli->query("INSERT INTO course (name,bgcolor) VALUES ('" . $mysqli->real_escape_string(base64_decode($_POST['name'])) . "','" . $mysqli->real_escape_string($_POST['color']) . "')");
