<link rel="stylesheet" href="/MUACSIM/tplanner/css/checkbox.css">
<style>

[data-toggle=buttons] .btn input[type=checkbox] {
	position: absolute;
	clip: rect(0,0,0,0);
	pointer-events: none;
}

.btn {
	cursor: pointer;
}

</style>

<div class="row" style="margin:0;">
	<div id="pilotHoursChartContainer" class="col-lg-8"></div>
	<div class="col-lg-4"></div>
</div>
<script src="/MUACSIM/tplanner/lib/moment.min.js"></script>
<script src="/MUACSIM/tplanner/lib/chartjs/Chart.js"></script>
<script src="/MUACSIM/tplanner/modules/Statistics/js/ManpowerForecast.js"></script>
