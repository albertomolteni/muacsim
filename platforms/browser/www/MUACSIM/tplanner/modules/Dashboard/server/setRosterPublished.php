<?php

session_start();

if (!isset($_SESSION['userID'])) die();
if ($_SESSION['userID'] - 1)     die();

file_put_contents('../../../config.json','{"rosterPublished":'.$_POST['rosterPublished'].'}');
