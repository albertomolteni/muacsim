function triggerSwapDetails()
{
	if ($(".swap-card").length) {
		$(".swap-card").first().trigger("click");
	} else {
		setTimeout(triggerSwapDetails,200);
	}
}

function readSwapPartnerDuties(inputGroupIndex,partner,partnerID)
{
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readSwapPartnerDuties.php",{partnerID:partnerID,day:$(".input-group.date input").eq(inputGroupIndex).val().substring(6,10)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(3,5)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(0,2)},function(resp){
		var responseP = $.parseJSON(resp);
		$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/dutyDetails.php",  {                    day:$(".input-group.date input").eq(inputGroupIndex).val().substring(6,10)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(3,5)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(0,2)},function(resp){
			var responseS = $.parseJSON(resp);
			$(".partner-view[data="+inputGroupIndex+"]").remove();
			$(".input-group.date").eq(inputGroupIndex).after('<div data="'+inputGroupIndex+'" class="row partner-view" style="margin-top:15px;"><div class="col-sm-5"></div><div class="col-sm-2" style="padding:0;"></div><div class="col-sm-5"></div></div>');
			responseS.map(function(duty){
				var decimalTime1 = duty['dt_from'].substring(14,16)/60 + duty['dt_from'].substring(11,13)/1;
				var decimalTime2 = duty['dt_to'  ].substring(14,16)/60 + duty['dt_to'  ].substring(11,13)/1;
				var prevEnd = $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:first div").length ? $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:first div").last().attr("data-endTime") : 8;
				$(".partner-view[data="+inputGroupIndex+"] .col-sm-5").eq(0).append('<div class="swappable" data-eID="'+duty.simeventID+'" data-seuID="'+duty.simevent_userID+'" data-startTime="'+decimalTime1+'" data-endTime="'+decimalTime2+'" style="background:'+duty.bgcolor+';border:3px solid transparent;border-radius:6px;padding:1vw;height:'+(30*(decimalTime2-decimalTime1))+'px;margin-top:'+(30*(decimalTime1-prevEnd))+'px;"><h5>'+duty.name+'</h5>'+(decimalTime2-decimalTime1<3.5?'':duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'<br>')+duty.role+'</div>');
			});
			responseP.map(function(duty){
				var decimalTime1 = duty['dt_from'].substring(14,16)/60 + duty['dt_from'].substring(11,13)/1;
				var decimalTime2 = duty['dt_to'  ].substring(14,16)/60 + duty['dt_to'  ].substring(11,13)/1;
				var prevEnd = $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:last  div").length ? $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:last  div").last().attr("data-endTime") : 8;
				$(".partner-view[data="+inputGroupIndex+"] .col-sm-5").eq(1).append('<div class="swappable" data-eID="'+duty.simeventID+'" data-seuID="'+duty.simevent_userID+'" data-startTime="'+decimalTime1+'" data-endTime="'+decimalTime2+'" style="background:'+duty.bgcolor+';border:3px solid transparent;border-radius:6px;padding:1vw;height:'+(30*(decimalTime2-decimalTime1))+'px;margin-top:'+(30*(decimalTime1-prevEnd))+'px;"><h5>'+duty.name+'</h5>'+(decimalTime2-decimalTime1<3.5?'':duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'<br>')+duty.role+'</div>');
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
		case 31:
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

function hexToL(hex)
{
	if (!hex.match(/^#[0-9a-f]{6}$/i)) return 1;
	var r = parseInt(hex.substring(1,3),16)/255;
	var g = parseInt(hex.substring(3,5),16)/255;
	var b = parseInt(hex.substring(5,7),16)/255;
	return (Math.max(r,g,b)+Math.min(r,g,b))/2;
}

function showDutyDetails(ds,swapInProgress)
{
	$("#dutyModal .modal-title").html(friendlyDate(new Date(ds)));
	$("#dutyModal .modal-body" ).html('<i class="fa fa-spinner fa-pulse fa-2x fa-fw" style="margin:2vh 0 2vh 35vw;"></i>');
	
	$("#dutyModal .btn-warning").show();
	if (swapInProgress || !userIsPilot) $("#dutyModal .btn-warning").hide();
	
	$("#dutyModal").modal("show");
	
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/dutyDetails.php",{day:ds},function(resp){
		var response = $.parseJSON(resp);
		$(".fa-spinner").remove();
		
		response.map(function(duty){
			$("#dutyModal .modal-body").append('<div style="'+(hexToL(duty.bgcolor)<0.36?'color:#fafafa;':'')+'background:'+duty.bgcolor+';border-radius:6px;padding:1em;margin-bottom:2em;" data-eID="'+duty.simeventID+'"'+(duty.eta?' data-eta="'+duty.eta.substring(0,5)+'"':'')+'><h5>'+duty.name+'</h5>'+duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'<br>'+duty.role+(duty.eta ? '<br>Expected start '+duty.eta.substring(0,5) : '')+'</div>');
			if (duty.milesIn||duty.milesOut) $("#dutyModal .modal-body div").last().prepend('<img src="../../../img/hasMiles'+(duty.milesIn?1:0)+(duty.milesOut?1:0)+'.png" style="float:right;width:6vw;height:6vw;'+(hexToL(duty.bgcolor)<0.36?'filter:invert(100%);':'')+'">');
		});
		if (!response.length) $("#dutyModal .modal-body").append('<p>No simulations scheduled.</p>');
		
		if (swapInProgress) $("#dutyModal .modal-body").append('<div class="card card-inverse" style="background:#666;color:white;"><div class="card-block">Swap request pending</div></div>');
		
		if (!userIsPilot) {
			$("#dutyModal .modal-body").unbind("click").on("click",function(){$(".miles-outer").remove()});
			$("#dutyModal .modal-body div").on("dblclick",function(){
				var tstr_start = $(this).html().match(/(\d\d:\d\d) - \d\d:\d\d<br>/)[1];
				var tstr_eta   = $(this).attr("data-eta");
				time_start     = new Date();
				time_start.setHours(  tstr_start.substring(0,2)/1);
				time_start.setMinutes(tstr_start.substring(3,5)/1);
				
				$(".miles-outer").remove();
				$(this).after('<div class="miles-outer" style="border:1px solid #ccc;border-radius:6px;padding:1em;margin-bottom:2em;margin-top:-1.6em;" data-eID="'+$(this).attr("data-eID")+'"><p>What time will this simulation start?</p><div class="row">\
									<div class="col-sm-5"><input type="time" class="form-control" value="'+(tstr_eta||tstr_start)+'"></div>\
									<div class="col-sm-4" style="text-align:center;padding-top:8px;"></div>\
									<div class="col-sm-3" style="padding:0;"><button class="btn btn-secondary" style="background:white;height:100%;">OK</button></div>\
								</div></div>');
				
				$(".miles-outer input").on("change",function(){
					if ($(this).val().match(/^\d\d:\d\d$/)) {
						var time_set = new Date(time_start.getTime());
						time_set.setHours(  $(this).val().substring(0,2)/1);
						time_set.setMinutes($(this).val().substring(3,5)/1);
						miles_to_add = Math.floor((time_set-time_start)/1800000);
						$(".miles-outer .col-sm-4").html('miles: '+miles_to_add);
					}
				}).trigger("change");
				
				$(".miles-outer .btn-secondary").on("click",function(){
					ttt_from = $(".miles-outer input").val();
					$(".miles-outer").html('Please wait ...');
					$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/addMiles.php",{simeventID:$(".miles-outer").attr("data-eID"),qty:miles_to_add,t_from:ttt_from},function(){
						$(".miles-outer").html('Miles added successfully');
						$(".miles-outer").prevAll("div").eq(0).attr("data-eta",ttt_from);
						$(".miles-outer").prevAll("div").eq(0).find("img").remove();
						$(".miles-outer").prevAll("div").eq(0).html($(".miles-outer").prevAll("div").eq(0).html().replace(/Expected start \d\d:\d\d/,'Expected start '+ttt_from));
						$(".miles-outer").prevAll("div").eq(0).prepend('<img src="../../../img/hasMiles10.png" style="float:right;width:6vw;height:6vw;">');
						var lsKeys = Object.keys(window.localStorage);
						for (var keyi=0;keyi<lsKeys.length;keyi++) {
							if (lsKeys[keyi].substring(0,41)=='MyDuties/dutyDetails__{"day":"'+ds+'"') {
								var j = $.parseJSON(window.localStorage.getItem(lsKeys[keyi]));
								for (var ji=0;ji<j.length;ji++) {
									if (j[ji].simeventID==$(".miles-outer").attr("data-eID")) {
										j[ji].eta     = ttt_from;
										j[ji].milesIn = miles_to_add;
									}
								}
								window.localStorage.setItem(lsKeys[keyi],JSON.stringify(j));
							}
						}
						setTimeout(function(){$(".miles-outer").remove()},2000);
					});
				});
				
				$(".miles-outer").on("click",function(e){e.stopPropagation()});
			});
		}
	});
	
	$("#dutyModal .btn-warning").unbind().on("click",function(){
		location.assign('./Swap.html?date='+ds.substring(8,10)+'-'+ds.substring(5,7)+'-'+ds.substring(0,4));
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
	if (document.cookie.match(/authAppUserID=(1|7);/))       $(".nav-item:first").after('<li class="nav-item"><a class="nav-link" style="padding:0.5em 2em;" href="../../Planner/views/ManageSwaps.html">Manage swaps</a></li>');
	if (document.cookie.match(/authAppUserID=[1-8](?!\d)/))  $(".nav-item:last" ).after('<li class="nav-item"><a class="nav-link" style="padding:0.5em 2em;" href="../../Planner/views/SimRemoteControl.html">TRG remote control</a></li>');
	if (window.localStorage.getItem("localCacheLastModified")==="0") window.localStorage.removeItem("localCacheLastModified");
	$("img").first().on("click",function(){$("#aboutModal").modal("show")});
	rpdo  = new Date(window.localStorage.getItem("rosterPublished")/1);
	var d = new Date();
	d.setHours(4);
	d.setDate(d.getDate() - 1);
	
	knownHolidays_dates  = ['2019-01-01','2019-01-02','2019-04-19','2019-04-22','2019-05-30','2019-05-31','2019-06-10','2019-12-24','2019-12-25','2019-12-26','2019-12-27','2020-01-01','2020-01-02','2020-04-10','2020-04-13','2020-05-21','2020-05-22','2020-06-01','2020-12-24','2020-12-25'];
	knownHolidays_titles = ['New Year','New Year','Good Friday','Easter Monday','Ascension','Ascension','Whit Monday','Christmas Eve','Christmas','Boxing Day','Year-end Closure','New Year','New Year','Good Friday','Easter Monday','Ascension','Ascension','Whit Monday','Christmas Eve','Christmas'];
	
	var template = $("#dutyCalendarTemplate").html();
	
	for (var i=0 ; i<140 ; i++) {
		d.setDate(d.getDate() + 1);
		if (d > rpdo) break;
		
		if (d.getDate() == 1) $("#calendarContainer").append('<div class="month-start-banner" style="background-image:url(../../../img/maastricht_monthly_'+(d.getMonth()+1)+'.jpg);"></div>');
		
		$("#calendarContainer").append('<div data="' + d.toISOString().substring(0,10) + '" class="row calendar-row"' + (d.getDay()%6&&knownHolidays_dates.indexOf(d.toISOString().substring(0,10))<0 ? '' : ' style="background:#ddd;"') + '>' + template.replace(/STR1/,d.toDateString().substring(0,3).toUpperCase()).replace(/STR2/,d.getDate()).replace(/STR3/,d.toDateString().substring(4,7).toUpperCase()) + '</div>');
	}
	
	$("body").append('<div id="loadingOverlay" style="position:fixed;left:0;top:0;z-index:999999;width:100vw;height:100vh;background:rgba(0,0,0,0.8);color:white;text-align:center;padding-top:40vh;"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><br><br>Loading duties, please wait</div>');
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readMyDuties.php",null,function(resp){
		var response = $.parseJSON(resp);
		var dutyBar  = '<div class="dutyBar"></div>';
		userIsPilot  = true;
		
		response.map(function(duty){
			$targets = $(".calendar-row[data="+duty.day+"] .col-sm-3");
			
			if (duty.name == 'sm'  ||  duty.name == 'lm'  ||  duty.name == 'm'  ||  duty.name == 'sR'  ||  duty.name == 'X'                                               ||  duty.name == 'Morning'  ||  duty.name == 'Swing'                                ||  duty.name.match(/^C(S|P)?$/)) $targets.eq(1).append(dutyBar);
			if (duty.name == 's'   ||  duty.name == 'lm'  ||  duty.name == 'm'  ||  duty.name == 'sR'  ||  duty.name == 'X'  ||  duty.name == 'a'  ||  duty.name == 'la'                              ||  duty.name == 'Swing'  ||  duty.name == 'Afternoon'  ||  duty.name.match(/^C(S|P)?$/)) $targets.eq(2).append(dutyBar);
			if (duty.name == 'sa'                                                                                            ||  duty.name == 'a'  ||  duty.name == 'la'                                                        ||  duty.name == 'Afternoon'  ||  duty.name.match(/^C(S|P)?$/)) $targets.eq(3).append(dutyBar);
			
			$targets.find(".dutyBar").first().css("border-top-left-radius", "6px").css("border-bottom-left-radius", "6px");
			$targets.find(".dutyBar").last( ).css("border-top-right-radius","6px").css("border-bottom-right-radius","6px");
			
			$targets.find(".dutyBar").not(":last" ).css("border-right","none");
			$targets.find(".dutyBar").not(":first").css("border-left", "none");
			
			var textDIVwidth = 0;
			$targets.find(".dutyBar").each(function(){textDIVwidth += $(this).width()});
			
			var l = '';
			if (!duty.dutyChange.length) {
				l = duty.name.replace(/^C(S|P)?$/,'Leave');
			} else {
				if (duty.dutyChange.split(';')[1].length) {
					l = 'd' + duty.name;
				} else {
					l = 'E' + duty.name;
				}
			}
			
			if (l == 'Leave') {
				$targets.find(".dutyBar").addClass("leave");
			} else {
				if (duty.notes=='miles:'+duty.cancelledMiles) l = l + ' - cancelled';
			}
			
			$(".calendar-row[data="+duty.day+"] .dutyBar").first().parent().append('<div class="dutyBarText" style="width:'+textDIVwidth+'px;">'+l+'</div>');
			if (duty.name.length>2) userIsPilot = false;
		});
		
		$(".dutyBarText").on("click",function(){
			if (!$(this).prevAll(".dutyBar").hasClass("leave")) showDutyDetails($(this).parent().parent().attr("data"),$(this).parent().parent().find(".swapInProgress").length);
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
		
		$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readExtraBidding.php",null,function(resp){
			var response = $.parseJSON(resp);
			if (response.length) $(".nav-item:first").after('<li class="nav-item"><a class="nav-link" style="padding:0.5em 2em;" href="./ExtraBidding.html">Extra offers</a></li>');
			for (var i=response.length-1 ; i>=0 ; i--) if (['0','1'].indexOf(response[i].responseValue)+1) response.splice(i,1);
			if (response.length) $("#extraDutyCard").show().on("click",function(){location.assign('./ExtraBidding.html')});
		});
		
		ev2 = [];
		for (var kh=0 ; kh<knownHolidays_dates.length ; kh++) ev2.push({id:9999000+kh,title:knownHolidays_titles[kh],start:knownHolidays_dates[kh],end:knownHolidays_dates[kh].replace(/\d\d$/,function(a){return (a/1>8?'':'0')+(a/1+1)}).replace(/05-32$/,'06-01'),color:'#e2c266',className:'holiday'});
		response.map(function(a){
			a.id        = a.user_shiftID;
			a.title     = a.name.length>2 ? a.name.substring(0,1) : a.name;
			a.start     = a.day + 'T' + a.t_from;
			a.end       = a.day + 'T' + a.t_to;
			a.color     = '#fea';
			if (a.name.match(/^C(S|P)?$/)) {
				a.color     = '#def';
				a.className = 'holiday';
			} else {
				if (a.dutyChange.length) {
					if (a.dutyChange.split(';')[1].length) {
						a.title = 'd' + a.title;
					} else {
						a.title = 'E' + a.title;
					}
				}
			}
			ev2.push(a);
		});
		if (window.innerWidth < 768) {} else $(".offset-xl-1").removeClass("col-xl-10").removeClass("offset-xl-1").addClass("col-xl-8").addClass("offset-xl-2");
		$("#calendar1").fullCalendar({
			events              : ev2,
			selectable          : false,
			eventClick          : function(calEvent){if(calEvent.className!='holiday')showDutyDetails(calEvent.day,$(".calendar-row[data="+calEvent.day+"]").find(".swapInProgress").length)},
			viewRender          : function(){setTimeout(function(){knownHolidays_dates.map(function(khd){$(".fc-bg .fc-day[data-date="+khd+"]").addClass("fc-sun")});if($(".fc-month-button").hasClass("fc-state-active")){$(".fc-scroller").css("height",$(".fc-day-grid").height()+"px")}else{$(".fc-scroller").css("height","55vh")}},200)},
			timeFormat          : 'HH:mm',
			defaultView         : 'month',
			firstDay            : 1,
			header              : {
									left       : 'title',
									center     : '',
									right      : 'today prev,next agendaWeek,month'
			},
			views               : {
									agendaWeek : {
										minTime         : '08:00:00',
										maxTime         : '22:00:00',
										slotDuration    : '01:00:00',
										slotLabelFormat : 'HH:mm'
									}
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
		$("#loadingOverlay").remove();
		setTimeout(function(){
			if (window.innerWidth < 768) {
				$(".fc-toolbar h2").css("font-size","1.4rem").css("margin-bottom","0.8rem");
				$(".fc-toolbar button").css("font-size","0.9em");
				$("head").append("<style>.fc-month-view .fc-time{display:none}.fc-day-grid-event{text-align:center}.fc-agenda-view .fc-day-header span{font-size:0.8em}</style>");
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
	
	document.addEventListener("resume",          function(){                                       if(!document.cookie.match(/authAppUserID=\d+/))location.assign('../../SessionControl/views/SessionControl.html')});
	document.addEventListener("visibilitychange",function(){if(document.visibilityState=="visible")if(!document.cookie.match(/authAppUserID=\d+/))location.assign('../../SessionControl/views/SessionControl.html')});
	document.addEventListener("deviceready",function(){
		pn = PushNotification.init({android:{senderID:"690910508250"},browser:{},ios:{alert:true,badge:true,sound:true},windows:{}});
		pn.on("registration",function(data){
			if (navigator.userAgent.match(/i(Phone|Pad)/)) {
				$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/saveAPNS.php",{apnsID:data.registrationId,appVersion:'1.5.9f'},function(){});
			} else {
				$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/saveFCM.php", { fcmID:data.registrationId,appVersion:'1.5.9f'},function(){});
			}
		});
		pn.on("notification",function(data){
			if (data.additionalData.notamText.split(' ').length-1) {
				$("#notamModal .modal-title").html(data.message);
				$("#notamModal .modal-body" ).html(data.additionalData.notamText);
				$("#notamModal").modal("show");
			} else {
				if (data.additionalData.notamText == 'triggerSwapDetails') {
					triggerSwapDetails();
				} else {
					location.assign('../../'+data.additionalData.notamText+'.html');
				}
			}
		});
		pn.on("error",function(e){alert(e.message)});
	});
});
