<style>

#comments {
	min-height: 20vh;
}

.btn-success {
	width: 100%;
	margin-top: 2rem;
}

</style>

<div class="row" style="margin:0;">
	<div class="col-sm-12">
		<form>
			<div class="form-group">
				<label>Expected return to work:</label>
				<div class="input-group date">
					<input type="text" class="form-control" id="date1"><span class="input-group-addon"><i class="fa fa-calendar"></i></span>
				</div>
			</div>
			<div class="form-group">
				<label>Comments:</label>
				<div class="input-group">
					<textarea id="comments" class="form-control"></textarea>
				</div>
			</div>
			<div class="form-group">
				<button type="button" class="btn btn-success">Report sick</button>
			</div>
		</form>
	</div>
</div>
<link rel="stylesheet" href="/MUACSIM/tplanner/lib/bootstrap-datepicker/bootstrap-datepicker3.min.css">
<script src="/MUACSIM/tplanner/lib/bootstrap-datepicker/bootstrap-datepicker.min.js"></script>
<script src="/MUACSIM/tplanner/modules/LeaveAbsences/js/Sick.js"></script>
