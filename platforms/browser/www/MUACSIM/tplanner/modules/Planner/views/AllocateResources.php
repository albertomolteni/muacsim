<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$eventDetails = $mysqli->query("SELECT * FROM simevent WHERE simeventID=" . $_GET['event'])->fetch_object();

$pilots   = [];
$records  = $mysqli->query("SELECT * FROM user WHERE contractType>3");
while ($r = $records->fetch_object()) $pilots[] = $r;

$quals    = [];
$records  = $mysqli->query("SELECT * FROM qualification");
while ($r = $records->fetch_object()) $quals[] = $r;

$userqual = [];
$records  = $mysqli->query("SELECT user_qualification.*,qualification.name FROM user_qualification,qualification WHERE user_qualification.qualificationID=qualification.qualificationID");
while ($r = $records->fetch_object()) $userqual[] = $r;

$u_pilots = [];
$records  = $mysqli->query("SELECT userID FROM user_shift WHERE day='".substr($eventDetails->dt_from,0,10)."' AND shiftID IN (SELECT shiftID FROM shift WHERE type=3 OR (t_from<'".substr($eventDetails->dt_to,11,5)."' AND t_to>'".substr($eventDetails->dt_from,11,5)."') OR TIME_TO_SEC(TIMEDIFF(t_to,'".substr($eventDetails->dt_from,11,5)."'))>34200 OR TIME_TO_SEC(TIMEDIFF('".substr($eventDetails->dt_to,11,5)."',t_from))>34200)");
while ($r = $records->fetch_object()) $u_pilots[] = $r->userID;

?>
<style>

.role-vacancy {
	border: 2px dashed navy;
	border-radius: 4px;
	padding: 1em;
	height: 6em;
	margin-top: 1em;
}

.pilot-card {
	border: 1px solid navy;
	border-radius: 4px;
	padding: 1em;
	margin-bottom: 1em;
	background: white;
}
.pilot-card.hidden {
	opacity: 0;
}
.pilot-card.disabled {
	opacity: 0.1;
	background: #eee;
	cursor: not-allowed;
}

.avatar {
	height: 3em;
	width: 3em;
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	border-radius: 50%;
}

</style>

<div class="row" style="margin:0;">
	<div class="col-sm-8">
		<div class="card" style="padding:2em;height:70vh;">
			<div class="row">
				<div class="col-sm-6" style="font-size:28px;font-weight:bold;"><?php echo $eventDetails->name; ?></div>
				<div class="col-sm-4" style="padding:0;"><i class="fa fa-calendar" aria-hidden="true" style="margin-right:1em;"></i><?php echo substr($eventDetails->dt_from,0,10).'&nbsp;&nbsp;&nbsp;&nbsp;'.substr($eventDetails->dt_from,11,5).' - '.substr($eventDetails->dt_to,11,5); ?></div>
				<div class="col-sm-2" style="padding:0;"><i class="fa fa-desktop"  aria-hidden="true" style="margin-right:1em;"></i><?php echo $eventDetails->sim>1?'TRG':'Escape'; ?></div>
			</div>
			<?php
			
			$requiredRoles = explode(',',$eventDetails->requiredRoles);
			
			foreach ($requiredRoles as $requiredRole) {
				$roleID  = explode(':',$requiredRole)[0];
				$roleQty = explode(':',$requiredRole)[1];
				
				$q = 0;
				while ($quals[$q]->qualificationID != $roleID) $q++;
				
				echo '<div style="font-size:22px;border-bottom:1px solid navy;margin-top:2em;">'.$quals[$q]->name.'</div><div class="row role-droppable" data-qualID="'.$roleID.'">';
				for ($i=0 ; $i<$roleQty ; $i++) echo '<div class="col-sm-4"><div class="role-vacancy"></div></div>';
				echo '</div>';
			}
			
			?>
		</div>
	</div>
	<div class="col-sm-4">
		<div class="card" style="padding:2em;overflow-y:scroll;">
			<?php
			
			foreach ($pilots as $pilot) {
				$thisPersonQuals = [];
				
				foreach ($userqual as $uqual) if ($uqual->userID == $pilot->userID) $thisPersonQuals[] = $uqual->name;
				
				echo   '<div class="pilot-card' . (in_array($pilot->userID,$u_pilots) ? ' disabled' : '') . '" data-userID="' . $pilot->userID . '">
							<div style="display:flex;">
								<div style="display:table-cell;padding-right:1em;">
									<div class="avatar" style="background-image:url(/MUACSIM/tplanner/img/' . (file_exists("./img/avatar/".$pilot->username.".jpg") ? 'avatar/'.$pilot->username.'.jpg' : 'blank_avatar.png') . ');"></div>
								</div>
								<div style="display:table-cell;font-size:16px;">' . $pilot->name . '<br/><span style="font-size:12px;color:#aaa;">' . implode(', ',$thisPersonQuals) . '</span></div>
							</div>
						</div>';
			}
			
			?>
		</div>
	</div>
</div>
<div class="row" style="margin:2em 0;">
	<div class="col-sm-2">
		<button class="btn" id="autoButton" data-eventID="<?php echo $_GET['event']; ?>" style="width:100%;cursor:pointer;">Auto</button>
	</div>
	<div class="col-sm-2 offset-sm-8">
		<button class="btn" id="saveButton" data-eventID="<?php echo $_GET['event']; ?>" style="width:100%;cursor:pointer;">Save</button>
	</div>
</div>
<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="/MUACSIM/tplanner/modules/Planner/js/AllocateResources.js"></script>
