<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

$courseTableRows = [];
$records         = $mysqli->query("SELECT course.courseID,name,bgcolor,courseStart,courseEnd,courseNext FROM course LEFT JOIN (SELECT courseID,MIN(dt_from) courseStart,MAX(dt_to) courseEnd FROM simevent GROUP BY courseID)sq1 ON course.courseID=sq1.courseID LEFT JOIN (SELECT courseID,MIN(dt_from) courseNext FROM simevent WHERE dt_from>NOW() GROUP BY courseID)sq2 ON course.courseID=sq2.courseID HAVING courseID>1");
while ($r        = $records->fetch_object()) $courseTableRows[] = $r;

?>
<style>

.fc-bg .fc-sat,
.fc-bg .fc-sun {
	background: #ebebeb;
}

.dataTables_filter {
	display: none;
}
.dataTables_length,
.dataTables_info,
.dataTables_paginate {
	font-size: .875rem;
}

#table1 tbody tr:nth-child(even) {
	background: #ebebeb;
}
#table1 tbody tr.selected {
	background: navy;
	color: white;
}
#table1 tbody tr {
	cursor: pointer;
	font-size: .9rem;
}

.tooltip-inner {
	font-size: .8rem;
	line-height: 1.4;
	text-align: left;
	max-width: 400px;
}

</style>

<div class="row" style="margin:2em 0;">
	<div class="col-lg-4 hidden-md-down" style="padding:0;">
		<table id="table1">
			<thead>
				<tr>
					<th>Name</th>
					<th>Starts</th>
					<th>Ends</th>
					<th>Next</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ($courseTableRows as &$cRow) echo '<tr data-courseID="'.$cRow->courseID.'" data-color="'.$cRow->bgcolor.'"><td>'.$cRow->name.'</td><td>'.substr($cRow->courseStart,0,10).'</td><td>'.substr($cRow->courseEnd,0,10).'</td><td>'.substr($cRow->courseNext,0,10).'</td></tr>'; ?>
			</tbody>
		</table>
	</div>
	<div class="col-sm-12 col-lg-7 offset-lg-1">
		<div id="epcc" class="hidden-md-down" style="margin-bottom:2em;">
			<div style="display:inline-block;width:19%;padding-right:0.6em;"><select class="form-control"><option value="1">SIM: Escape</option><option value="2" selected>SIM: TRG</option></select></div>
			<div style="display:inline-block;width:19%;padding-right:0.6em;"><input  class="form-control" type="text" placeholder="ATCO consoles"  /></div>
			<div style="display:inline-block;width:19%;padding-right:0.6em;"><input  class="form-control" type="text" placeholder="Pilot consoles" /></div>
			<div style="display:inline-block;width:19%;padding-right:0.6em;"><select class="form-control"><option value="0" selected>MFS: No</option><option value="1">MFS: Yes</option></select></div>
			<div style="display:inline-block;width:21%;padding-right:0.0em;"><input  class="form-control" type="text" placeholder="Required roles" /></div>
		</div>
		<div id="calendar1"></div>
	</div>
</div>
<div class="modal fade" id="newCourseModal" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document" style="max-width:40vw;">
		<div class="modal-content">
			<div class="modal-header"><h5 class="modal-title">New course</h5></div>
			<div class="modal-body">
				<form>
					<div class="form-group">
						<label>Course name:</label>
						<div>
							<input type="text" class="form-control" id="newCourse_name">
						</div>
					</div>
					<div class="form-group">
						<label>Default colour for calendar:</label>
						<div>
							<input type="color" class="form-control" id="newCourse_color" value="#73aaee" style="height:3em;">
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" style="cursor:pointer;">Save</button>
			</div>
		</div>
	</div>
</div>
<link rel="stylesheet" href="/MUACSIM/tplanner/lib/fullcalendar/fullcalendar.css">
<link rel="stylesheet" href="/MUACSIM/tplanner/lib/datatables/jquery.dataTables.min.css">
<script src="/MUACSIM/tplanner/lib/moment.min.js"></script>
<script src="/MUACSIM/tplanner/lib/fullcalendar/fullcalendar.js"></script>
<script src="/MUACSIM/tplanner/lib/datatables/jquery.dataTables.min.js"></script>
<script src="/MUACSIM/tplanner/modules/Planner/js/ManageCourses.js"></script>
