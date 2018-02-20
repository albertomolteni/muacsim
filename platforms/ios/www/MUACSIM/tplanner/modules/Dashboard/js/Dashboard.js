function autoAllocate(simeventID)
{
	$.post("/MUACSIM/tplanner/modules/Planner/server/autoRoleAllocation.php",{eventID:simeventID,ignoreWishes:0},function(resp){
		if (resp.indexOf("ERROR_INSUFFICIENT_QUALIFIED_PEOPLE") < 0) {
			aa_done++;
			if (aa_done == aa_todo) $("body").trigger("allocationFinished");
		} else {
			$.post("/MUACSIM/tplanner/modules/Planner/server/autoRoleAllocation.php",{eventID:simeventID,ignoreWishes:1},function(resp){
				if (resp.indexOf("ERROR_INSUFFICIENT_QUALIFIED_PEOPLE") < 0) {
					aa_done++;
					if (aa_done == aa_todo) $("body").trigger("allocationFinished");
				} else {
					console.log('There are not enough qualified people for this event '+simeventID);
				}
			});
		}
	});
}

function showAutoAllocationPrompt()
{
	$("#autoAllocationModal .modal-title").html(cna[0].name);
	$("#autoAllocationModal").modal("show");
	
	$("#autoAllocationModal .btn-danger").unbind().on("click",function(){
		location.assign('/MUACSIM/tplanner/Planner/allocateResources?event='+cna[0].simeventID);
	});
	
	$("#autoAllocationModal .btn-success").unbind().on("click",function(){
		$("#autoAllocationModal button").prop("disabled",true);
		$("#autoAllocationModal .modal-body").html('Please wait ...');
		$("body").on("allocationFinished",function(){location.assign('/MUACSIM/tplanner/Planner/')});
		processCourseAtIndexZero();
	});
}

function processCourseAtIndexZero()
{
	aa_todo = 0;
	aa_done = 0;
	cna.map(function(se){
		if (se.courseID == cna[0].courseID) aa_todo++;
	});
	var postDelay = 0;
	cna.map(function(se){
		if (se.courseID==cna[0].courseID) {
			if (typeof(monthToAllocate)=='undefined' || se.dt_from.substring(5,7)==monthToAllocate) {
				setTimeout(function(){autoAllocate(se.simeventID)},postDelay);
				postDelay += 200;
			} else {
				aa_done++;
				if (aa_done == aa_todo) $("body").trigger("allocationFinished");
			}
		}
	});
}

function drawPilotHoursBarChart()
{
	$("#pilotHoursChartContainer").html('<canvas id="pilotHoursCanvas" style="height:18vh;margin-top:1vh;"></canvas>');
	
	var phData = {
		labels   : pilotHoursBarLabels,
		datasets : [{
			label           : '',
			backgroundColor : pilotHoursBackgroundColors,
			borderWidth     : 1,
			data            : pilotHoursBarData
		}]
	};
	
	var ctx = document.getElementById("pilotHoursCanvas").getContext("2d");
	window.pilotHoursChart = new Chart(ctx,{
		type    : 'horizontalBar',
		data    : phData,
		options : {
			responsive : false,
			legend     : false,
			title      : false,
			tooltips   : false,
			scales     : {
					xAxes : [{
						ticks : {
							min      :   0,
							max      : 100,
							stepSize :  20,
						}
					}],
					yAxes : [{
						ticks : {
							fontSize :  10
						}
					}]
			}
		}
	});
	
	$("#pilotHoursCanvas").css("margin-left",0.5*($("#pilotHoursCanvas").parent().width()-$("#pilotHoursCanvas").width()) + "px");
}

$(document).ready(function(){
	MONTH_STRINGS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	rpdo = new Date(window.rosterPublished);
	$(".card-text").eq(2).html('Published till '+rpdo.toISOString().substring(8,10)+'/'+rpdo.toISOString().substring(5,7)+'/'+rpdo.toISOString().substring(0,4)+'.<br>You have '+Math.floor((rpdo-3628800000-Date.now())/86400000)+' days left to finalise '+MONTH_STRINGS[rpdo.getMonth()+1]+' '+rpdo.getFullYear()+'.');
	$(".card").eq(2).find(".list-group-item").eq(1).html('<a href="#">Publish '+MONTH_STRINGS[rpdo.getMonth()+1]+' '+rpdo.getFullYear()+'</a>');
	$(".card").eq(2).find(".list-group-item").eq(1).on("click",function(){
		var c = confirm("Are you sure?");
		if (c) {
			rpdo.setDate(  rpdo.getDate()  + 1);
			rpdo.setMonth( rpdo.getMonth() + 1);
			rpdo.setDate(  rpdo.getDate()  - 1);
			$.post("/MUACSIM/tplanner/modules/Dashboard/server/setRosterPublished.php",{rosterPublished:rpdo.getTime()},function(){location.reload()});
		}
	});
	
	$.post("/MUACSIM/tplanner/modules/Dashboard/server/readAbsences.php",null,function(resp){
		var absences = $.parseJSON(resp);
		if (absences.sick.length == 1) {
			$(".card-text").eq(4).html(absences.sick[0]+' is sick today.');
		}
		if (absences.leave.length == 1) {
			$(".card-text").eq(4).html($(".card-text").eq(4).html()+'<br>'+absences.leave[0]+' is on leave.');
		}
	});
	
	$.post("/MUACSIM/tplanner/modules/ManageUsers/server/readPilotTotalHours.php",null,function(resp){
		pilotHours = $.parseJSON(resp);
		var na     = [];
		
		pilotHours.map(function(ph){
			ph.totalHours    = ph.minutesWorked.reduce(function(a,b){return a+b},0)/60;
			ph.relativeTotal = 100 * ph.totalHours / ph.yearlyHours;
			na.push(ph.relativeTotal);
		});
		
		pilotHoursMaxRelativeTotal = na.reduce(function(a,b){return Math.max(a,b)});
		pilotHoursMinRelativeTotal = na.reduce(function(a,b){return Math.min(a,b)});
		pilotHoursAvgRelativeTotal = na.reduce(function(a,b){return a+b},0) / na.length;
		
		pilotHours.sort(function(a,b){return a.relativeTotal - b.relativeTotal});
		
		pilotHoursBarLabels        = [];
		pilotHoursBackgroundColors = [];
		pilotHoursBarData          = [];
		
		for (var i=0 ; i<4 ; i++) {
			var rel = (pilotHours[i].relativeTotal-pilotHoursMinRelativeTotal) / (pilotHoursMaxRelativeTotal-pilotHoursMinRelativeTotal);
			var r   = -512 * rel + 512;
			var g   =  512 * rel;
			pilotHoursBarLabels.push(pilotHours[i].surname.toUpperCase());
			pilotHoursBackgroundColors.push("rgba("+Math.floor(Math.min(255,r))+","+Math.floor(Math.min(255,g))+",0,0.9)");
			pilotHoursBarData.push(pilotHours[i].relativeTotal);
		}
		
		pilotHoursBarLabels.push('Average');
		pilotHoursBackgroundColors.push("rgba(120,120,120,0.9)");
		pilotHoursBarData.push(pilotHoursAvgRelativeTotal);
		
		for (var i=pilotHours.length-4 ; i<pilotHours.length ; i++) {
			var rel = (pilotHours[i].relativeTotal-pilotHoursMinRelativeTotal) / (pilotHoursMaxRelativeTotal-pilotHoursMinRelativeTotal);
			var r   = -512 * rel + 512;
			var g   =  512 * rel;
			pilotHoursBarLabels.push(pilotHours[i].surname.toUpperCase());
			pilotHoursBackgroundColors.push("rgba("+Math.floor(Math.min(255,r))+","+Math.floor(Math.min(255,g))+",0,0.9)");
			pilotHoursBarData.push(pilotHours[i].relativeTotal);
		}
		
		$(".card-text").last().html(pilotHoursAvgRelativeTotal.toFixed(1) + '% of yearly hours used so far.');
		drawPilotHoursBarChart();
		$(window).resize(drawPilotHoursBarChart);
	});
	
	$.post("/MUACSIM/tplanner/modules/Dashboard/server/readCoursesNeedingAllocation.php",null,function(resp){
		cna = $.parseJSON(resp);
		while (cna[0].dt_from.substring(5,7)-1 < rpdo.toISOString().substring(5,7)/1) cna.splice(0,1);
		$(".card").eq(1).find(".list-group-item"  ).eq(0).html('<a '+(cna[0].courseID>1 ? 'class="bulk" ' : '')+'href="/MUACSIM/tplanner/Planner/allocateResources?event='+cna[0].simeventID+'">Allocate resources for '+cna[0].name+'</a>');
		$(".card").eq(1).find(".list-group-item a").eq(0).on("click",function(){
			if ($(this).hasClass("bulk")) {
				showAutoAllocationPrompt();
				return false;
			}
		});
		$(".card").eq(1).find(".list-group-item"  ).eq(1).html('<a href="#">Allocate next month ('+MONTH_STRINGS[cna[0].dt_from.substring(5,7)-1]+' '+cna[0].dt_from.substring(0,4)+')</a>');
		$(".card").eq(1).find(".list-group-item a").eq(1).on("click",function(){
			$(this).html('Please wait ...').unbind().blur();
			monthToAllocate = cna[0].dt_from.substring(5,7);
			$("body").on("allocationFinished",function(){
				var z = cna.length - 1;
				while (z > 0) {
					if (cna[z].courseID == cna[0].courseID) cna.splice(z,1);
					z--;
				}
				$.post("/MUACSIM/tplanner/modules/Planner/server/confirmAllocation.php",{eventID:cna[0].simeventID,bulk:1},function(){
					cna.splice(0,1);
					if (cna[0].dt_from.substring(5,7) == monthToAllocate) processCourseAtIndexZero();
					else location.assign('/MUACSIM/tplanner/planner/ClassicView?month='+monthToAllocate);
				});
			});
			processCourseAtIndexZero();
		});
	});
	
	$.post("/MUACSIM/tplanner/modules/Planner/server/readAgreedSwaps.php",null,function(resp){
		$(".card").eq(2).find(".list-group-item"  ).eq(0).html('<a href="/MUACSIM/tplanner/Planner/ManageSwaps">' + $.parseJSON(resp).length + ' duty swap request' + ($.parseJSON(resp).length==1 ? '' : 's') + '</a>');
	});
	
	$.post("/MUACSIM/tplanner/modules/Planner/server/readEventsWithoutCover.php",null,function(resp){
		var response = $.parseJSON(resp);
		response.map(function(a){
			$(".row").eq(1).prepend('<div class="col-lg-12"><div class="alert alert-danger" style="font-size:1.4em;"><i class="fa fa-exclamation-triangle" style="margin:0 1em;"></i>There is no sim assistant covering '+a.name+' on '+a.dt_from.substring(8,10)+'-'+a.dt_from.substring(5,7)+'-'+a.dt_from.substring(0,4)+'!</div></div>');
		});
	});
});
