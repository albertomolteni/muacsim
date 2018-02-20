<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$pilots   = [];
$records  = $mysqli->query("SELECT * FROM user WHERE contractType>3");
while ($r = $records->fetch_object()) $pilots[] = $r;

$quals    = [];
$records  = $mysqli->query("SELECT * FROM qualification WHERE type=2");
while ($r = $records->fetch_object()) $quals[] = $r;

$userqual = [];
$records  = $mysqli->query("SELECT * FROM user_qualification");
while ($r = $records->fetch_object()) $userqual[] = $r;

?>
<style>

label input[type="checkbox"] ~ i.fa.fa-square-o{
    color: #c8c8c8;    display: inline;
}
label input[type="checkbox"] ~ i.fa.fa-check-square-o{
    display: none;
}
label input[type="checkbox"]:checked ~ i.fa.fa-square-o{
    display: none;
}
label input[type="checkbox"]:checked ~ i.fa.fa-check-square-o{
    color: #f35b3f;    display: inline;
}
label:hover input[type="checkbox"] ~ i.fa {
color: #f35b3f;
}

div[data-toggle="buttons"] label.active{
    color: #f35b3f;
}

div[data-toggle="buttons"] label {
display: inline-block;
padding: 6px 12px;
margin-bottom: 0;
font-size: 14px;
font-weight: normal;
line-height: 2em;
text-align: left;
white-space: nowrap;
vertical-align: top;
cursor: pointer;
background-color: none;
border: 0px solid #c8c8c8;
border-radius: 3px;
color: #c8c8c8;
box-shadow: none !important;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
-o-user-select: none;
user-select: none;
}

div[data-toggle="buttons"] label span {
font-size: 1.4em;
margin-left: 0.6em;
position: absolute;
left: 40px;
margin-top: -2px;
}

div[data-toggle="buttons"] label:hover {
color: #f35b3f;
}





.col-lg-4 {
	margin-bottom: 2rem;
}

.thumbnail {
	border: 1px solid #aaa;
	border-radius: 4px;
	padding: 1em;
}

.avatar {
	height: 10vh;
	width: 10vh;
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	border-radius: 50%;
}

</style>

<div class="row" style="margin:0;">
	<?php
	
	foreach ($pilots as $pilot) {
		echo   '<div class="col-lg-4">
					<div class="thumbnail" data-userID="'.$pilot->userID.'">
						<div style="display:flex;">
							<div style="display:table-cell;padding:0 3em 0 1em;">
								<div class="avatar" style="background-image:url(/MUACSIM/tplanner/img/' . (file_exists("./img/avatar/".$pilot->username.".jpg") ? 'avatar/'.$pilot->username.'.jpg' : 'blank_avatar.png') . ');"></div>
							</div>
							<div style="display:table-cell;font-size:22px;padding-top:0.7em;">'.$pilot->name.' '.$pilot->surname.'<br/><span style="font-size:14px;color:#aaa;">Pilot contract 60%&nbsp;&nbsp;|&nbsp;&nbsp;'.$pilot->yearlyHours.' hours</span></div>
						</div>
						<div style="padding:1em 10em 0;">
							<div class="btn-group btn-group-vertical" data-toggle="buttons">';

		foreach ($quals as $qual) echo '<label class="btn" style="padding:0;" data-qualID="'.$qual->qualificationID.'"><input type="checkbox" /><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span style="left:20px;font-size:1.2em;">'.$qual->name.'</span></label>';

		echo               '</div>
						</div>
					</div>
				</div>';
	}
	
	echo '<script>';
	foreach ($userqual as $qual) echo '$(".thumbnail[data-userID='.$qual->userID.'] label[data-qualID='.$qual->qualificationID.']").trigger("click");';
	echo '</script>';
	
	?>
</div>
<script src="/MUACSIM/tplanner/modules/ManageUsers/js/ManagePilots.js"></script>
