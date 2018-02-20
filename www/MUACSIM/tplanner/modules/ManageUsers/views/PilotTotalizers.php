<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$pilots   = [];
$records  = $mysqli->query("SELECT * FROM user WHERE contractType>3");
while ($r = $records->fetch_object()) $pilots[] = $r;

?>
<style>

.offset-xl-1 {
	font-size: .9rem;
}

.headerContainer div {
	white-space: nowrap;
	-webkit-backface-visibility: hidden;
	position: absolute;
	transform: rotate(-60deg);
	width: 12em;
}

.table1 tbody td {
	border: 1px solid #ccc;
	text-align: right;
}

.table1 tbody tr:nth-child(even) {
	background: #eee;
}

</style>

<div class="headerContainer">
	<div>January</div>
	<div>February</div>
	<div>March</div>
	<div>April</div>
	<div>May</div>
	<div>June</div>
	<div>July</div>
	<div>August</div>
	<div>September</div>
	<div>October</div>
	<div>November</div>
	<div>December</div>
	<div style="font-weight:bold;">Total</div>
	<div>Contract hours</div>
	<div>Carry over from 2017</div>
	<div style="font-weight:bold;">Available in 2018</div>
	<div>Unused</div>
	<div></div>
	<div>points weekend</div>
	<div>points evening</div>
	<div>points total</div>
	<div>sR</div>
	<div>sm</div>
	<div>s</div>
	<div>sa</div>
	<div>lm</div>
	<div>la</div>
</div>
<table class="table1" style="border-collapse:collapse;margin-top:12em;">
	<tbody>
		<?php
		
		foreach ($pilots as $pilot) {
			echo   '<tr data-userID="'.$pilot->userID.'">
						<th style="border-bottom:1px solid #ccc;">'.$pilot->surname.'</th>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;font-weight:bold;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;font-weight:bold;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;">0</td>
						<td style="width:2.5vw;">0</td>
						<td style="width:2.5vw;">0</td>
						<td style="width:2.5vw;">0</td>
						<td style="width:2.5vw;">0</td>
						<td style="width:2.5vw;">0</td>
						<td style="width:2.5vw;">0</td>
						<td style="width:2.5vw;">0</td>
						<td style="width:2.5vw;">0</td>
					</tr>';
		}
		
		for ($f=0 ; $f<11 ; $f++) {
			echo   '<tr>
						<th style="border-bottom:1px solid #ccc;">&nbsp;</th>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;font-weight:bold;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
						<td style="width:2.5vw;"></td>
					</tr>';
		}
		
		?>
	</tbody>
</table>
<script src="/MUACSIM/tplanner/modules/ManageUsers/js/PilotTotalizers.js"></script>
