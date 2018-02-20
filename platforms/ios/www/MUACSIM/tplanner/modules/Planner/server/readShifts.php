<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$out = [];

$records  = $mysqli->query("SELECT * FROM shift");
while ($r = $records->fetch_object()) $out[] = $r;

echo json_encode($out);
