function readSwapPartnerDuties(inputGroupIndex,partner,partnerID)
{
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readSwapPartnerDuties.php",{partnerID:partnerID,day:$(".input-group.date input").eq(inputGroupIndex).val().substring(6,10)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(3,5)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(0,2)},function(resp){
		var responseP = $.parseJSON(resp);
		$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/dutyDetails.php",      {                    day:$(".input-group.date input").eq(inputGroupIndex).val().substring(6,10)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(3,5)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(0,2)},function(resp){
			var responseS = $.parseJSON(resp);
			$(".partner-view[data="+inputGroupIndex+"]").remove();
			$(".input-group.date").eq(inputGroupIndex).after('<div data="'+inputGroupIndex+'" class="row partner-view" style="margin-top:15px;"><div class="col-sm-5"></div><div class="col-sm-2" style="padding:0;"></div><div class="col-sm-5"></div></div>');
			responseS.map(function(duty){
				var decimalTime1 = duty['dt_from'].substring(14,16)/60 + duty['dt_from'].substring(11,13)/1;
				var decimalTime2 = duty['dt_to'  ].substring(14,16)/60 + duty['dt_to'  ].substring(11,13)/1;
				var prevEnd = $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:first div").length ? $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:first div").attr("data-endTime") : 8;
				$(".partner-view[data="+inputGroupIndex+"] .col-sm-5").eq(0).append('<div class="swappable" data-eID="'+duty.simeventID+'" data-seuID="'+duty.simevent_userID+'" data-startTime="'+decimalTime1+'" data-endTime="'+decimalTime2+'" style="background:'+duty.bgcolor+';border:3px solid transparent;border-radius:6px;padding:1em;height:'+(30*(decimalTime2-decimalTime1))+'px;margin-top:'+(30*(decimalTime1-prevEnd))+'px;"><h5>'+duty.name+'</h5>'+duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'<br>'+duty.role+'</div>');
			});
			responseP.map(function(duty){
				var decimalTime1 = duty['dt_from'].substring(14,16)/60 + duty['dt_from'].substring(11,13)/1;
				var decimalTime2 = duty['dt_to'  ].substring(14,16)/60 + duty['dt_to'  ].substring(11,13)/1;
				var prevEnd = $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:last  div").length ? $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:last  div").attr("data-endTime") : 8;
				$(".partner-view[data="+inputGroupIndex+"] .col-sm-5").eq(1).append('<div class="swappable" data-eID="'+duty.simeventID+'" data-seuID="'+duty.simevent_userID+'" data-startTime="'+decimalTime1+'" data-endTime="'+decimalTime2+'" style="background:'+duty.bgcolor+';border:3px solid transparent;border-radius:6px;padding:1em;height:'+(30*(decimalTime2-decimalTime1))+'px;margin-top:'+(30*(decimalTime1-prevEnd))+'px;"><h5>'+duty.name+'</h5>'+duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'<br>'+duty.role+'</div>');
			});
			$(".partner-view[data="+inputGroupIndex+"]").append('<div class="col-sm-5" style="padding-top:1em;text-align:center;"><h5>Me</h5></div><div class="col-sm-1"></div><div class="col-sm-1"></div><div class="col-sm-5" style="padding-top:1em;text-align:center;"><h5>'+partner+'</h5></div>');
			var minMT = 999999;
			$(".partner-view[data="+inputGroupIndex+"] .swappable:first-child").each(function(){
				if ($(this).css("margin-top").replace(/px/,'')/1 < minMT) minMT = $(this).css("margin-top").replace(/px/,'')/1;
			});
			if (minMT < 999999) $(".partner-view[data="+inputGroupIndex+"]").css("margin-top",15-minMT);
			$(".partner-view[data="+inputGroupIndex+"] .swappable").on("click",function(){
					var ad = $(this).parent().prevAll(".col-sm-5").length ? "left" : "right";
					var mt = $(this).position().top + $(this).css("margin-top").replace(/px/,'')/1 + $(this).height()*0.5 - 12;
					$(this).parent().parent().find(".col-sm-2").append('<div data-relatedEID="'+$(this).attr("data-eID")+'" style="width:100%;position:absolute;text-align:center;margin-top:'+mt+'px;font-size:30px;"><i class="fa fa-long-arrow-'+ad+'"></i></div>');
					$(this).css("border","3px dashed "+$(this).css("background-color"));
					$(this).addClass("swapping");
			});
			setTimeout(function(){$("body").trigger("dutyDetailsReady"+inputGroupIndex)},200);
		});
	});
}

function friendlyDate(d)
{
	var w = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var m = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	var s = w[d.getDay()] + ' ' + d.getDate();
	switch (d.getDate()) {
		case  1:
		case 21:
			s = s.concat('<sup>st</sup> ');
			break;
		case  2:
		case 22:
			s = s.concat('<sup>nd</sup> ');
			break;
		case  3:
		case 23:
			s = s.concat('<sup>rd</sup> ');
			break;
		default:
			s = s.concat('<sup>th</sup> ');
			break;
	}
	s = s.concat(m[d.getMonth()]) + ' ' + d.getFullYear();
	return s;
}

function showDutyDetails(ds,swapInProgress)
{
	$("#dutyModal .modal-title").html(friendlyDate(new Date(ds)));
	$("#dutyModal .modal-body" ).html('');
	
	$("#dutyModal .btn-warning").show();
	if (swapInProgress || !userIsPilot) $("#dutyModal .btn-warning").hide();
	
	$("#dutyModal").modal("show");
	
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/dutyDetails.php",{day:ds},function(resp){
		var response = $.parseJSON(resp);
		
		response.map(function(duty){
			$("#dutyModal .modal-body").append('<div style="background:'+duty.bgcolor+';border-radius:6px;padding:1em;margin-bottom:2em;"><h5>'+duty.name+'</h5>'+duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'<br>'+duty.role+(duty.eta ? '<br>Expected start '+duty.eta.substring(0,5) : '')+'</div>');
		});
		if (!response.length) $("#dutyModal .modal-body").append('<p>No simulations scheduled.</p>');
		
		if (swapInProgress) $("#dutyModal .modal-body").append('<div class="card card-inverse" style="background:#666;color:white;"><div class="card-block">Swap request pending</div></div>');
	});
	
	$("#dutyModal .btn-warning").unbind().on("click",function(){
		location.assign('/MUACSIM/tplanner/MyDuties/Swap?date='+ds.substring(8,10)+'-'+ds.substring(5,7)+'-'+ds.substring(0,4));
	});
}

function showSwapDetails(dutyswapID,requester,requesterID,json,comments)
{
	$("#swapModal .modal-title").html('Swapping duties with '+requester);
	$("#swapModal .modal-body" ).html('<form></form>');
	$("#swapModal").modal("show");
	
	var swapping = $.parseJSON(atob(json));
	var days = [];
	swapping.map(function(swap){if(days.indexOf(swap.day)<0)days.push(swap.day)});
	
	days_done = 0;
	days.map(function(day){
		var i = $("#swapModal .modal-body form input").length;
		$("#swapModal .modal-body form").append('<div class="form-group"><div class="input-group date"><input type="text" class="form-control" value="'+day+'"><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div></div><hr>');
		$("body").unbind("dutyDetailsReady"+i).on("dutyDetailsReady"+i,function(event){
			swapping.map(function(swap){
				if (swap.day == $("#swapModal .modal-body form input").eq(event.type.substring(16,17)).val()) $(".swappable[data-seuID="+swap.simevent_userID+"]").trigger("click");
			});
			$(".partner-view[data="+event.type.substring(16,17)+"] .swappable").unbind();
			days_done++;
			if (days_done == days.length) $(".input-group").each(function(){
				$(this).replaceWith('<div style="text-align:center;font-size:20px;">'+friendlyDate(new Date($(this).find("input").val().substring(6,10)/1,$(this).find("input").val().substring(3,5)-1,$(this).find("input").val().substring(0,2)/1,8,0,0))+'</div>');
			});
		});
		readSwapPartnerDuties(i,requester,requesterID);
	});
	
	if (comments) {
		$("#swapModal .modal-body").append('<p>'+requester+' says: '+atob(comments)+'</p>');
	} else {
		$("hr").last().remove();
	}
	
	$("#swapModal .btn-danger" ).unbind().on("click",function(){$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/swapAcceptDecline.php",{dutyswapID:dutyswapID,status:'DECLINED'},function(){location.reload()})});
	$("#swapModal .btn-success").unbind().on("click",function(){$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/swapAcceptDecline.php",{dutyswapID:dutyswapID,status:'AGREED'  },function(){location.reload()})});
}

$(document).ready(function(){
	rpdo  = new Date(window.localStorage.getItem("rosterPublished")/1);
	var d = new Date();
	d.setHours(4);
	d.setDate(d.getDate() - 1);
	
	var template = $("#dutyCalendarTemplate").html();
	
	for (var i=0 ; i<90 ; i++) {
		d.setDate(d.getDate() + 1);
		if (d > rpdo) break;
		
		if (d.getDate() == 1) $("#calendarContainer").append('<div class="month-start-banner" style="background-image:url(../../../img/maastricht_monthly_'+(d.getMonth()+1)+'.jpg);"></div>');
		
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
			
			$(".calendar-row[data="+duty.day+"] .dutyBar").first().parent().append('<div class="dutyBarText" style="width:'+textDIVwidth+'px;">'+duty.name+'</div>');
			if (duty.name.length>2) userIsPilot = false;
		});
		
		$(".dutyBarText").on("click",function(){
			showDutyDetails($(this).parent().parent().attr("data"),$(this).parent().parent().find(".swapInProgress").length);
		});
		
		$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readOngoingSwaps.php",null,function(resp){
			var response = $.parseJSON(resp);
			var swapCardTemplate = $("#swapCardTemplate").html();
			response.out.map(function(swap){
					var days = [];
					$.parseJSON(swap.json).map(function(swap_e){if(days.indexOf(swap_e.day.replace(/^(\d\d)-(\d\d)-(20\d\d)$/,'$3-$2-$1'))<0)days.push(swap_e.day.replace(/^(\d\d)-(\d\d)-(20\d\d)$/,'$3-$2-$1'))});
					days.map(function(day){$(".calendar-row[data="+day+"] .dutyBar").addClass("swapInProgress")});
			});
			response.in.map(function(swap){
				if (swap.status == 'REQUESTED') {
					var days = [];
					$.parseJSON(swap.json).map(function(swap_e){if(days.indexOf(swap_e.day.substring(0,5))<0)days.push(swap_e.day.substring(0,5))});
					$("#calendarContainer").prepend('<div data-dutyswapID="' + swap.dutyswapID + '" data-requester="' + swap.name + '" data-requesterID="' + swap.requesting + '" data-json="' + btoa(swap.json) + '" data-comments="' + btoa(swap.comments) + '" class="card swap-card">' + swapCardTemplate.replace(/STR1/,swap.name+' wants to swap on '+days.join(', ').replace(/, (\d\d-\d\d)$/,' and $1')));
				}
			});
			$(".swap-card").on("click",function(){
				showSwapDetails($(this).attr("data-dutyswapID"),$(this).attr("data-requester"),$(this).attr("data-requesterID"),$(this).attr("data-json"),$(this).attr("data-comments"));
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
			eventClick          : function(calEvent){if(calEvent.className!='holiday')showDutyDetails(calEvent.day,$(".calendar-row[data="+calEvent.day+"]").find(".swapInProgress").length)},
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
