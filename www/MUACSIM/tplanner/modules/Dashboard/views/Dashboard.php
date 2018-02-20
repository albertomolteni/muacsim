<?php

$mysqli = new mysqli("localhost","root","D1sc1pl1n4","tplanner");

?>
<style>

.col-lg-4 {
	margin-bottom: 2rem;
}

.card .card-img {
	height: 20vh;
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
}

.card-block {
	min-height: 130px;
}

a {
	color: #292b2c;
}

.modal button {
	cursor: pointer;
}

</style>

<div class="row" style="margin:0;">
	<div class="col-lg-4">
		<div class="card" style="">
			<div class="card-img" style="background-image:url(/MUACSIM/tplanner/img/calendar_booking.png);"></div>
			<div class="card-block">
				<h4 class="card-title">Bookings</h4>
				<p class="card-text">New - LC2 from 01/03/2018 to 30/06/2018<br/>New - AI74 from 01/04/2018 to 31/03/2019</p>
			</div>
			<ul class="list-group list-group-flush">
				<li class="list-group-item"><a href="/MUACSIM/tplanner/Planner/ManageCourses">Manage courses</a></li>
				<li class="list-group-item">Manage booking opportunities</li>
			</ul>
		</div>
	</div>
	<div class="col-lg-4">
		<div class="card" style="">
			<div class="card-img" style="background-image:url(/MUACSIM/tplanner/img/staff_allocation.png);"></div>
			<div class="card-block">
				<h4 class="card-title">Resource Allocation</h4>
				<p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
			</div>
			<ul class="list-group list-group-flush">
				<li class="list-group-item"></li>
				<li class="list-group-item"></li>
			</ul>
		</div>
	</div>
	<div class="col-lg-4">
		<div class="card" style="">
			<div class="card-img" style="background-image:url(/MUACSIM/tplanner/img/roster.png);"></div>
			<div class="card-block">
				<h4 class="card-title">6 Week Roster</h4>
				<p class="card-text"></p>
			</div>
			<ul class="list-group list-group-flush">
				<li class="list-group-item"></li>
				<li class="list-group-item">Manage next draft</li>
			</ul>
		</div>
	</div>
	<div class="col-lg-4">
		<div class="card" style="">
			<div class="card-img" style="background-image:url(/MUACSIM/tplanner/img/data_prep.png);"></div>
			<div class="card-block">
				<h4 class="card-title">Data Prep</h4>
				<p class="card-text">DARP - 90% complete.<br/>BRU NUT - 10% complete.</p>
			</div>
			<ul class="list-group list-group-flush">
				<li class="list-group-item">View latest notes</li>
			</ul>
		</div>
	</div>
	<div class="col-lg-4">
		<div class="card" style="">
			<div class="card-img" style="background-image:url(/MUACSIM/tplanner/img/holiday.png);"></div>
			<div class="card-block">
				<h4 class="card-title">Leave and Absences</h4>
				<p class="card-text"></p>
			</div>
			<ul class="list-group list-group-flush">
				<li class="list-group-item">3 outstanding leave requests</li>
				<li class="list-group-item">View absence totalizers</li>
			</ul>
		</div>
	</div>
	<div class="col-lg-4">
		<div class="card" style="">
			<div class="card-img" style="" id="pilotHoursChartContainer"></div>
			<div class="card-block">
				<h4 class="card-title">Pilot Hours</h4>
				<p class="card-text"></p>
			</div>
			<ul class="list-group list-group-flush">
				<li class="list-group-item"><a href="./ManageUsers/ManagePilots">Manage pilot qualifications</a></li>
				<li class="list-group-item"><a href="./ManageUsers/PilotTotalizers">View pilot totalizers</a></li>
			</ul>
		</div>
	</div>
</div>
<div class="modal fade" id="autoAllocationModal" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header"><h5 class="modal-title"></h5></div>
			<div class="modal-body">Would you like to auto-allocate staff for the whole course?</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-danger" style="position:absolute;left:15px;">No</button>
				<button type="button" class="btn btn-success">Yes</button>
			</div>
		</div>
	</div>
</div>
<script src="/MUACSIM/tplanner/lib/chartjs/Chart.min.js"></script>
<script src="/MUACSIM/tplanner/modules/Dashboard/js/Dashboard.js"></script>
