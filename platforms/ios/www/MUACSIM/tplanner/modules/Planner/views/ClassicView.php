<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$TPstaff = [];
$pilots  = [];

$records  = $mysqli->query("SELECT * FROM user WHERE contractType<4");
while ($r = $records->fetch_object()) $TPstaff[] = $r;

$records  = $mysqli->query("SELECT * FROM user WHERE contractType>3");
while ($r = $records->fetch_object()) $pilots[]  = $r;

?>
<style>

.grey-border div {
	border-bottom: 1px solid #666;
	border-right:  1px solid #666;
}

.gc {
	font-size: 1vh;
	line-height: 1.1vh;
	width: 50px;
	text-align: center;
	padding: 0;
	border-right:  1px solid #666;
	border-bottom: 1px solid #ddd;
}

.gc.weekend {
	background: #bbb;
	border-bottom: 1px solid #bbb;
}

table {
	border-collapse: collapse;
}

.sim-event {
	position: absolute;
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 0.7vw;
	white-space: nowrap;
}

.TPstaff:nth-child(odd) {
	background: #0000ff;
	color: white;
}
.TPstaff:nth-child(even) {
	background: #6666ff;
	color: white;
}

.nu-context-menu ul li .fa {
	margin-right: 1em;
	width: 1.28571429em;
	text-align: center;
}

</style>
<div class="row" style="margin:0 0 1em 0;">
	<div class="col-sm-5" id="monthNavPrev"  style="text-align: right;"></div>
	<div class="col-sm-2" id="monthNavTitle" style="text-align:center;"></div>
	<div class="col-sm-5" id="monthNavNext"  style="text-align:  left;"></div>
</div>
<div class="row" style="margin:0;">
	<div class="col-sm-1" style="max-width:7%;padding:0;">
		<div style="background:#ffa;text-align:center;">Escape</div>
		<div style="background:#eca;text-align:center;">TRG</div>
		<?php
		foreach ($TPstaff as $u) echo '<div class="TPstaff" style="font-size:1vh;line-height:1.1vh;text-transform:uppercase;border-bottom:1px solid #666;padding-left:2em;">'.$u->surname.'</div>';
		foreach ($pilots  as $u) echo '<div class="pilots"  style="font-size:1vh;line-height:1.1vh;text-transform:uppercase;border-bottom:1px solid #666;padding-left:2em;">'.$u->surname.'</div>';
		?>
	</div>
	<div class="col-sm-1 grey-border" style="max-width:3%;text-align:center;font-size:1vh;line-height:1.1vh;padding:0;">
		<?php
		for ($i=0 ; $i<30 ; $i++) echo '<div>'.($i%2 ? floor(8+$i/2).':00' : '&nbsp;').'</div>';
		for ($i=0 ; $i<30 ; $i++) echo '<div>'.($i%2 ? floor(8+$i/2).':00' : '&nbsp;').'</div>';
		?>
	</div>
	<div class="col-sm-12" style="max-width:90%;padding:0;overflow-x:hidden;" id="eventContainer">
		<table class="sim">
			<?php
			
			$month = '02';
			if (isset($_GET['month'])) $_SESSION['ClassicViewMonth'] = $_GET['month'];
			if (isset($_SESSION['ClassicViewMonth'])) $month = $_SESSION['ClassicViewMonth'];
			$month_day_count = [31,28,31,30,31,30,31,31,30,31,30,31];
			$j_limiter = $month_day_count[$month-1] + 1;
			
			$bd  = new DateTime('2018-'.$month.'-01');
			$bwd = (int) $bd->format("w");
			
			// Escape table
			$black_bottom_borders = [0,9,10,19,28,29];
			for ($i=0 ; $i<30 ; $i++) {
				echo '<tr>';
					for ($j=1 ; $j<$j_limiter ; $j++) echo '<td class="gc'.(($j+$bwd)%7<2 ? ' weekend' : '').'" style="'.(in_array($i,$black_bottom_borders) ? 'border-bottom: 1px solid #666;' : '').($i==0||$i==29 ? 'background: #bbb;' : '').'">'.($i ? '&nbsp;' : $j).'</td>';
				echo '</tr>';
			}
			
			// TRG table
			$black_bottom_borders = [0,9,10,19,28,29];
			for ($i=0 ; $i<30 ; $i++) {
				echo '<tr>';
					for ($j=1 ; $j<$j_limiter ; $j++) echo '<td class="gc'.(($j+$bwd)%7<2 ? ' weekend' : '').'" style="'.(in_array($i,$black_bottom_borders) ? 'border-bottom: 1px solid #666;' : '').($i==0||$i==29 ? 'background: #bbb;' : '').'">&nbsp;</td>';
				echo '</tr>';
			}
			
			// TP staff table
			for ($i=0 ; $i<8 ; $i++) {
				echo '<tr data-userID="'.($i+1).'">';
					for ($j=1 ; $j<$j_limiter ; $j++) echo '<td class="gc'.(($j+$bwd)%7<2 ? ' weekend' : '').'" data-day="2018-'.$month.'-'.($j<10 ? '0'.$j : $j).'">&nbsp;</td>';
				echo '</tr>';
			}
			
			// Pilots table
			for ($i=0 ; $i<10 ; $i++) {
				echo '<tr data-userID="'.($i+9).'">';
					for ($j=1 ; $j<$j_limiter ; $j++) echo '<td class="gc'.(($j+$bwd)%7<2 ? ' weekend' : '').'" data-day="2018-'.$month.'-'.($j<10 ? '0'.$j : $j).'">&nbsp;</td>';
				echo '</tr>';
			}
			
			?>
		</table>
	</div>
</div>
<?php echo '<script>current_display_month="'.$month.'";</script>'; ?>
<link rel="stylesheet" href="/MUACSIM/tplanner/lib/nuContextMenu/nu-context-menu.css">
<script src="/MUACSIM/tplanner/lib/nuContextMenu/jquery.nu-context-menu.js"></script>
<script src="/MUACSIM/tplanner/modules/Planner/js/ClassicView.js"></script>
