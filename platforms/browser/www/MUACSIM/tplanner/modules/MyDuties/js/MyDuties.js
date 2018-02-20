function showDutyDetails(ds,dutyFrom,dutyTo,swapInProgress)
{
	var d = new Date(ds);
	$("#dutyModal .modal-title").html(d.toDateString());
	$("#dutyModal .modal-body" ).html('');
	
	$("#dutyModal .btn-warning").show();
	if (swapInProgress || !userIsPilot) $("#dutyModal .btn-warning").hide();
	
	$("#dutyModal").modal("show");
	
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/dutyDetails.php",{day:ds},function(resp){
		var response = $.parseJSON(resp);
		
		response.map(function(duty){
			$("#dutyModal .modal-body").append('<div style="background:'+duty.bgcolor+';border-radius:6px;padding:1em;margin-bottom:2em;"><h5>'+duty.name+'</h5>'+duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'<br>'+duty.role+(duty.eta ? '<br>Expected start '+duty.eta.substring(0,5) : '')+'</div>');
		});
		
		if (swapInProgress) $("#dutyModal .modal-body").append('<div class="card card-inverse" style="background:#666;color:white;"><div class="card-block">Swap request pending</div></div>');
	});
	
	$("#dutyModal .btn-warning").unbind().on("click",function(){
		location.assign('/MUACSIM/tplanner/MyDuties/Swap?date='+ds.substring(8,10)+'-'+ds.substring(5,7)+'-'+ds.substring(0,4)+'&from='+dutyFrom+'&to='+dutyTo);
	});
}

function showSwapDetails(ds,dutyswapID,requester,doubleswap,comments)
{
	var d = new Date(ds);
	$("#swapModal .modal-title").html('Swap - ' + d.toDateString());
	$("#swapModal .modal-body" ).html('');
	
	$("#swapModal").modal("show");
	
	$.post("/MUACSIM/tplanner/modules/MyDuties/server/swapDetails.php",{dutyswapID:dutyswapID},function(resp){
		var response = $.parseJSON(resp);
		
		response.map(function(duty){
			$("#swapModal .modal-body").append('<div style="background:'+duty.bgcolor+';border-radius:6px;padding:1em;margin-bottom:2em;"><h5>'+duty.name+'</h5>'+duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'</div>');
		});
		
		if (doubleswap) $("#swapModal .modal-body").append('<p style="font-weight:bold;">This is a double swap - '+requester+' is proposing to take your '+doubleswap+'.</p>');
		if (comments)   $("#swapModal .modal-body").append('<p>'+requester+' says: '+atob(comments)+'</p>');
	});
	
	$("#swapModal .btn-danger" ).unbind().on("click",function(){$.post("/MUACSIM/tplanner/modules/MyDuties/server/swapAcceptDecline.php",{dutyswapID:dutyswapID,status:'DECLINED'},function(){location.reload()})});
	$("#swapModal .btn-success").unbind().on("click",function(){$.post("/MUACSIM/tplanner/modules/MyDuties/server/swapAcceptDecline.php",{dutyswapID:dutyswapID,status:'AGREED'  },function(){location.reload()})});
}

$(document).ready(function(){
	rpdo  = new Date(window.rosterPublished);
	var d = new Date();
	d.setHours(4);
	d.setDate(d.getDate() - 1);
	
	var template = $("#dutyCalendarTemplate").html();
	
	for (var i=0 ; i<90 ; i++) {
		d.setDate(d.getDate() + 1);
		if (d > rpdo) break;
		
		if (d.getDate() == 1) $("#calendarContainer").append('<div class="month-start-banner" style="background-image:url(/MUACSIM/tplanner/img/maastricht_monthly_'+(d.getMonth()+1)+'.jpg);"></div>');
		
		$("#calendarContainer").append('<div data="' + d.toISOString().substring(0,10) + '" class="row calendar-row"' + (d.getDay() ? '' : ' style="background:#ddd;"') + '>' + template.replace(/STR1/,d.toDateString().substring(0,3).toUpperCase()).replace(/STR2/,d.getDate()).replace(/STR3/,d.toDateString().substring(4,7).toUpperCase()) + '</div>');
	}
	
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readMyDuties.php",null,function(resp){
		var response = $.parseJSON(resp);
		var dutyBar  = '<div class="dutyBar"></div>';
		userIsPilot  = true;
		
		response.map(function(duty){
			$targets = $(".calendar-row[data="+duty.day+"] .col-sm-3");
			
			if (duty.name == 'sm'  ||  duty.name == 'lm'  ||  duty.name == 'sR'                         ||  duty.name == 'Morning'  ||  duty.name == 'Swing'                              ) $targets.eq(1).append(dutyBar);
			if (duty.name == 's'   ||  duty.name == 'lm'  ||  duty.name == 'sR'  ||  duty.name == 'la'                              ||  duty.name == 'Swing'  ||  duty.name == 'Afternoon') $targets.eq(2).append(dutyBar);
			if (duty.name == 'sa'                                                ||  duty.name == 'la'                                                        ||  duty.name == 'Afternoon') $targets.eq(3).append(dutyBar);
			
			$targets.find(".dutyBar").first().css("border-top-left-radius", "6px").css("border-bottom-left-radius", "6px");
			$targets.find(".dutyBar").last( ).css("border-top-right-radius","6px").css("border-bottom-right-radius","6px");
			
			$targets.find(".dutyBar").not(":last" ).css("border-right","none");
			$targets.find(".dutyBar").not(":first").css("border-left", "none");
			
			var textDIVwidth = 0;
			$targets.find(".dutyBar").each(function(){textDIVwidth += $(this).width()});
			
			$(".calendar-row[data="+duty.day+"] .dutyBar").first().parent().append('<div data-tfrom="'+duty.t_from.substring(0,5)+'" data-tto="'+duty.t_to.substring(0,5)+'" class="dutyBarText" style="width:'+textDIVwidth+'px;">'+duty.name+'</div>');
			if (duty.name.length>2) userIsPilot = false;
		});
		
		$(".dutyBarText").on("click",function(){
			showDutyDetails($(this).parent().parent().attr("data"),$(this).attr("data-tfrom"),$(this).attr("data-tto"),$(this).parent().parent().find(".swapInProgress").length);
		});
		
		$.post("/MUACSIM/tplanner/modules/MyDuties/server/readOngoingSwaps.php",null,function(resp){
			var response = $.parseJSON(resp);
			var swapCardTemplate = $("#swapCardTemplate").html();
			response.out.map(function(swap){
				$(".calendar-row[data="+swap.day+"] .dutyBar").addClass("swapInProgress");
			});
			response.in.map(function(swap){
				if (swap.status == 'REQUESTED') {
					$("#calendarContainer").prepend('<div data-ds="' + swap.day + '" data-dutyswapID="' + swap.dutyswapID + '" data-requester="' + swap.name + '" data-doubleswap="' + (swap.doubleSwap/1?$(".calendar-row[data="+swap.day+"] .dutyBarText").html():'') + '" data-comments="' + btoa(swap.comments) + '" class="card swap-card">' + swapCardTemplate.replace(/STR1/,swap.name+' wants to swap '+swap.t_from.substring(0,5)+' - '+swap.t_to.substring(0,5)+' on '+swap.day.substring(8)+'-'+swap.day.substring(5,7)+'-'+swap.day.substring(0,4)) + '</div>');
				}
			});
			$(".swap-card").on("click",function(){
				showSwapDetails($(this).attr("data-ds"),$(this).attr("data-dutyswapID"),$(this).attr("data-requester"),$(this).attr("data-doubleswap"),$(this).attr("data-comments"));
			});
		});
		
		ev2 = [
			{
				id             : 9999001,
				title          : 'Carnaval NL',
				start          : '2018-02-12',
				end            : '2018-02-17',
				color          : '#e2c266',
				className      : 'holiday'
			},
			{
				id             : 9999002,
				title          : 'Away Day',
				start          : '2018-05-25',
				end            : '2018-05-26',
				color          : '#e2c266',
				className      : 'holiday'
			}
		];
		response.map(function(a){
			a.id        = a.user_shiftID;
			a.title     = a.name.length>2 ? a.name.substring(0,1) : a.name;
			a.start     = a.day + 'T' + a.t_from;
			a.end       = a.day + 'T' + a.t_to;
			a.color     = '#fea';
			ev2.push(a);
		});
		if (window.innerWidth < 768) {} else $(".offset-xl-1").removeClass("col-xl-10").removeClass("offset-xl-1").addClass("col-xl-8").addClass("offset-xl-2");
		$("#calendar1").fullCalendar({
			events              : ev2,
			selectable          : false,
			eventClick          : function(calEvent){if(calEvent.className!='holiday')showDutyDetails(calEvent.day,calEvent.t_from.substring(0,5),calEvent.t_to.substring(0,5),$(".calendar-row[data="+calEvent.day+"]").find(".swapInProgress").length)},
			viewRender          : function(){setTimeout(function(){if(window.innerWidth<768)$(".fc-scroller").css("height",$(".fc-day-grid").height()+"px")},200)},
			timeFormat          : 'HH:mm',
			defaultView         : 'month',
			firstDay            : 1,
			header              : {
									left   : 'title',
									center : '',
									right  : 'today prev,next agendaWeek,month'
			}
		});
		
		$("#viewSelector .btn-secondary").eq(0).on("click",function(){
			$("#calendar1").hide();
			$("#calendarContainer").show();
		});
		$("#viewSelector .btn-secondary").eq(1).on("click",function(){
			$("#calendar1").show();
			$("#calendarContainer").hide();
		});
		setTimeout(function(){
			if (window.innerWidth < 768) {
				$(".fc-toolbar h2").css("font-size","1.4rem").css("margin-bottom","0.8rem");
				$(".fc-toolbar button").css("font-size","0.9em");
				$("head").append("<style>.fc-time{display:none}.fc-day-grid-event{text-align:center}</style>");
				$("#viewSelector .btn-secondary").eq(0).trigger("click");
			} else {
				$("#viewSelector .btn-secondary").eq(1).trigger("click");
			}
		},200);
	});
	
	$(window).resize(function(){
		$(".dutyBarText").each(function(){
			$targets = $(this).parent().parent();
			
			var textDIVwidth = 0;
			$targets.find(".dutyBar").each(function(){textDIVwidth += $(this).width()});
			
			$(this).width(textDIVwidth);
		});
	});
});
