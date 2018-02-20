<?php

file_put_contents("../../../loginAttempt.txt",substr(file_get_contents("../../../loginAttempt.txt"),0,-1) . $_GET['result']);
