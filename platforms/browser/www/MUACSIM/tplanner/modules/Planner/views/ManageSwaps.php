<link rel="stylesheet" href="/MUACSIM/tplanner/css/checkbox.css">
<style>

[data-toggle=buttons] .btn input[type=checkbox] {
	position: absolute;
	clip: rect(0,0,0,0);
	pointer-events: none;
}

.thumbnail {
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

.btn {
	cursor: pointer;
}

#swapCardTemplate {
	display: none;
}

</style>

<div class="row" style="margin:0;">
	<div id="swapContainer" class="col-sm-12">
		<div id="swapCardTemplate">
			<div class="col-md-12"><h3 style="font-size:3vh;text-align:center;padding:1em;border-bottom:1px solid #ddd;">STR1</h3></div>
			<div class="col-md-5">
				<div class="thumbnail">
					<div style="display:flex;">
						<div style="display:table-cell;padding:0 3em 0 1em;">
							<div class="avatar" style="background-image:url(/MUACSIM/tplanner/img/blank_avatar.png);"></div>
						</div>
						<div class="swap-requesting" style="display:table-cell;font-size:2.3vh;padding-top:1.1em;">STR2</div>
					</div>
				</div>
			</div>
			<div class="col-md-2 hidden-sm-down" style="font-size:3em;padding:0.4em;text-align:center;"><i class="fa fa-exchange"></i></div>
			<div class="col-md-5">
				<div class="thumbnail">
					<div style="display:flex;justify-content:flex-end;">
						<div class="swap-target" style="display:table-cell;font-size:2.3vh;padding-top:1.1em;">STR3</div>
						<div style="display:table-cell;padding:0 1em 0 3em;">
							<div class="avatar" style="background-image:url(/MUACSIM/tplanner/img/blank_avatar.png);"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-12"><h3 style="text-align:center;border-bottom:1px solid #ddd;">&nbsp;</h3></div>
			<div class="col-md-12"><br><p>Courses affected:</p><ul></ul></div>
			<div class="col-md-12"><h3 style="text-align:center;border-bottom:1px solid #ddd;">&nbsp;</h3></div>
			<div class="col-md-3"             style="padding:1em;"><button type="button" class="btn btn-danger"  style="width:100%;">Decline</button></div>
			<div class="col-md-3 offset-md-6" style="padding:1em;"><button type="button" class="btn btn-success" style="width:100%;">Approve</button></div>
		</div>
	</div>
</div>
<div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header"><h5 class="modal-title"></h5></div>
			<div class="modal-body" data-toggle="buttons">Comments:<br><br><textarea class="form-control" style="min-height:15vh;"></textarea><br><label class="btn" style="padding:0;"><input type="checkbox" /><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i><span style="left:40px;font-size:1.2em;">Send SMS to pilots</span></label></div>
			<div class="modal-footer">
				<button type="button" class="btn" style="width:100%;"></button>
			</div>
		</div>
	</div>
</div>
<script src="/MUACSIM/tplanner/modules/Planner/js/ManageSwaps.js"></script>
