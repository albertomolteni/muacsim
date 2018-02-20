function draw_event_divs(events)
{
	var columnWidth = $("td.gc").eq(0).outerWidth();
	var rowHeight   = $("td.gc").eq(0).outerHeight()+1;
	
	for (var e=0 ; e<events.length ; e++) {
		if (typeof events[e].div_x != 'undefined') {
			$("#eventContainer").append('<div class="sim-event'+(events[e].courseID>1 ? ' belongs-to-course' : '')+'" data-noMove="'+events[e].noMove.join(',')+'" data-eventID="'+events[e].simeventID+'" style="top:'+events[e].div_y+'px;left:'+(events[e].div_x+events[e].div_o)+'px;background:'+events[e].bgcolor+';width:'+(events[e].div_w*columnWidth-1)+'px;line-height:'+(events[e].duration*rowHeight-1)+'px;">'+(events[e].div_r ? '<div style="transform:rotate(-90deg) translateY(-2px) translateX(-'+(2*events[e].name.length)+'px);white-space:nowrap;-webkit-backface-visibility:hidden;">'+events[e].name+'</div>' : events[e].name)+'</div>');
		}
	}
	
	$(".sim-event").on("contextmenu",function(){
		var noMove = $(this).attr("data-noMove").split(',');
		$(".nu-context-menu li[data-key^=moveTo]").show();
		noMove.map(function(x){$(".nu-context-menu li[data-key="+x+"]").hide()});
	});
	
	$(".col-sm-1").first().find("div:lt(2)").css("line-height",30*$("table.sim tbody tr").eq(2).find("td").eq(0).outerHeight() + "px");
}

$(document).ready(function(){
	$("#monthNavTitle").html(current_display_month+'/2018');
	$("#monthNavPrev" ).html('<a href="/MUACSIM/tplanner/Planner/ClassicView?month='+(current_display_month/1-1>9?current_display_month/1-1:'0'+(current_display_month/1-1))+'" style="color:#292b2c;">&#171;&nbsp;&nbsp;Prev</a>');
	$("#monthNavNext" ).html('<a href="/MUACSIM/tplanner/Planner/ClassicView?month='+(current_display_month/1+1>9?current_display_month/1+1:'0'+(current_display_month/1+1))+'" style="color:#292b2c;">Next&nbsp;&nbsp;&#187;</a>');
	
	if (current_display_month == '03') {
		$("table.sim tbody tr:gt(0)").each(function(){
			$(this).find("td").eq(29).addClass("weekend");
		});
	}
	if (current_display_month == '04') {
		$("table.sim tbody tr:gt(0)").each(function(){
			$(this).find("td").eq( 1).addClass("weekend");
		});
	}
	if (current_display_month == '05') {
		$("table.sim tbody tr:gt(0)").each(function(){
			$(this).find("td").eq( 9).addClass("weekend");
			$(this).find("td").eq(10).addClass("weekend");
			$(this).find("td").eq(20).addClass("weekend");
		});
	}
	
	$.post("/MUACSIM/tplanner/modules/Planner/server/readShifts.php",null,function(resp){
		var shifts = $.parseJSON(resp);
		$.post("/MUACSIM/tplanner/modules/Planner/server/readUserShifts.php",null,function(resp){
			var ushifts = $.parseJSON(resp);
			ushifts.map(function(ushift){
				var l = '';
				
				if (ushift.userID < 9) {
					l = ushift.shiftID>9 ? shifts[ushift.shiftID-1].name : shifts[ushift.shiftID-1].name.substring(0,1);
				} else {
					if (ushift.shiftID == 14) {
						l = ushift.dutyChange.split(';')[1];
					} else {
						if (!ushift.dutyChange.length) {
							l = shifts[ushift.shiftID-1].name.replace(/^C$/,'c');
						} else {
							if (ushift.dutyChange.split(';')[1].length) {
								l = 'd' + shifts[ushift.shiftID-1].name;
							} else {
								l = 'E' + shifts[ushift.shiftID-1].name;
							}
						}
					}
				}
				
				$("tr[data-userID="+ushift.userID+"] td[data-day="+ushift.day+"]").html(l);
				
				if (ushift.shiftID <  14  &&  ushift.shiftID > 9) $("tr[data-userID="+ushift.userID+"] td[data-day="+ushift.day+"]").css("color","red" ).css("font-weight","bold");
				if (ushift.shiftID == 14)                         $("tr[data-userID="+ushift.userID+"] td[data-day="+ushift.day+"]").css("color","blue").css("font-weight","bold");
			});
			
			$.post("/MUACSIM/tplanner/modules/Planner/server/readSimUserAllocations.php",null,function(resp){
				var u_allocations = $.parseJSON(resp);
				u_allocations.map(function(u_allocation){
					var i = 0;
					while (response[i].simeventID != u_allocation.simeventID) {
						i++;
						if (i == response.length) return false;
					}
					
					if (u_allocation.draft/1) {
						var previousBackground = $("tr[data-userID="+u_allocation.userID+"] td[data-day="+response[i].dt_from.substring(0,10)+"]").css("background-color");
						$("tr[data-userID="+u_allocation.userID+"] td[data-day="+response[i].dt_from.substring(0,10)+"]").css("background","repeating-linear-gradient(90deg,"+previousBackground+","+previousBackground+" 3px,"+response[i].bgcolor+" 3px,"+response[i].bgcolor+" 6px)");
					} else {
						$("tr[data-userID="+u_allocation.userID+"] td[data-day="+response[i].dt_from.substring(0,10)+"]").css("background",response[i].bgcolor);
					}
					
					if (u_allocation.qualificationID > 3) $("tr[data-userID="+u_allocation.userID+"] td[data-day="+response[i].dt_from.substring(0,10)+"]").addClass("hybrid");
				});
				
				var hybridMarker = '<svg height="6" width="6" style="float:right;"><polygon points="0,0 6,0 6,6" style="fill:red;stroke:red;stroke-width:1" /></svg>';
				$("td.hybrid").append(hybridMarker);
			});
		});
	});
	
	$.post("/MUACSIM/tplanner/modules/Planner/server/readSimEvents.php",{month:"2018-"+current_display_month},function(resp){
		response = $.parseJSON(resp);
		
		var baseTime = new Date("2018-"+current_display_month+"-01T07:30:00");
		
		var columnWidth = $("td.gc").eq(0).outerWidth();
		var rowHeight   = $("td.gc").eq(0).outerHeight()+1;
		
		for (var e=0 ; e<response.length ; e++) {
			if (response[e].dt_from.substring(5,7) == current_display_month) {
				response[e].div_x = 1;
				response[e].div_y = 0;
				response[e].div_w = 1;
				response[e].div_o = 0;
				response[e].div_r = 0;
				
				var eventFromTime    = new Date(response[e]['dt_from'].replace(/ /,'T'));
				var eventToTime      = new Date(response[e]['dt_to'  ].replace(/ /,'T'));
				
				response[e].duration = (eventToTime   - eventFromTime) / 1800000;
				var timeDiff         = (eventFromTime - baseTime)      / 1800000;                                     // offset as number of 30-minute periods since baseTime
				if (current_display_month == "03"  &&  response[e].dt_from.substring(8,10)/1 > 24) timeDiff += 2;     // fix for DST as from 25 MAR 2018
				if (current_display_month == "10"  &&  response[e].dt_from.substring(8,10)/1 > 28) timeDiff -= 2;     // fix for DST as from 28 OCT 2018
				
				for (var col=0 ; col<Math.floor(timeDiff/48) ; col++) response[e].div_x += $("td.gc").eq(col).outerWidth();
				timeDiff = timeDiff % 48;
				
				while (timeDiff > 0) {
					response[e].div_y += rowHeight;
					timeDiff--;
				}
				
				for (var pe=0 ; pe<e ; pe++) {
					var overlap = false;
					if (response[pe]['dt_from'] < response[e]['dt_to']  &&  response[pe]['dt_to'] > response[e]['dt_from']  &&  response[pe]['sim'] == response[e]['sim']) overlap = true;
					
					if (overlap) {
						response[pe].div_w  = 1/(1/response[pe].div_w+1);
						response[ e].div_w  = response[pe].div_w;
						response[ e].div_o  = Math.floor(columnWidth*0.5);  // only works for 2 parallel events
						
						response[pe].div_r  = 1;
						response[ e].div_r  = 1;
					}
				}
				
				if (response[e].sim > 1) response[e].div_y += 30 * rowHeight;
				
				response[e].noMove = [];
				if (response[e].duration != 9) response[e].noMove = ['moveTo_m','moveTo_s','moveTo_a'];
				else {
					if (response[e]['dt_from'].substring(11,13) == '08'                                                     ) response[e].noMove.push('moveTo_m');
					if (response[e]['dt_from'].substring(11,13) == '13'  &&  response[e]['dt_to'  ].substring(11,13) == '17') response[e].noMove.push('moveTo_s');
					if (                                                     response[e]['dt_to'  ].substring(11,13) == '22') response[e].noMove.push('moveTo_a');
				}
			}
		}
		
		draw_event_divs(response);
		
		$("body").on("keyup",function(e){
			if (e.which == 85) {
				if ($(".warning-unallocated").length) {
					$(".warning-unallocated").remove();
				} else {
					$.post("/MUACSIM/tplanner/modules/Planner/server/readUnallocatedEvents.php",{month:"2018-"+current_display_month},function(resp){
						$.parseJSON(resp).map(function(ue){
							var pt = $(".sim-event[data-eventID="+ue.simeventID+"]").css("line-height").replace(/px$/,'') * 0.4;
							$(".sim-event[data-eventID="+ue.simeventID+"]").prepend('<div class="warning-unallocated" style="position:absolute;padding-top:'+pt+'px;right:2px;color:red;font-size:10px;"><i class="fa fa-exclamation-triangle"></i></div>');
						});
					});
				}
			}
		});
	});
	
	$("#eventContainer").nuContextMenu({
		hideAfterClick : false,
		trigger        : 'contextmenu',
		items          : '.sim-event',
		menu           : [
			{
				name  : 'allocation',
				title : 'Go to staff allocation',
				icon  : 'user-circle-o'
			},
			{
				name  : 'confirmAllocation',
				title : 'Confirm duties',
				icon  : 'check'
			},
			{
				name  : 'clearAllocation',
				title : 'Clear duties',
				icon  : 'ban'
			},
			{
				name  : 'void'
			},
			{
				name  : 'moveTo_m',
				title : 'Move to morning slot',
				icon  : 'null'
			},
			{
				name  : 'moveTo_s',
				title : 'Move to swing slot',
				icon  : 'null'
			},
			{
				name  : 'moveTo_a',
				title : 'Move to afternoon slot',
				icon  : 'null'
			},
			{
				name  : 'void'
			},
			{
				name  : 'deleteEvent',
				title : 'Delete event',
				icon  : 'times'
			}
		],
		callback       : function(key,element){
			switch (key) {
				case 'allocation':
					location.assign('/MUACSIM/tplanner/Planner/AllocateResources?event=' + $(element).attr("data-eventID"));
					break;
				case 'moveTo_m':
				case 'moveTo_s':
				case 'moveTo_a':
					$.post("/MUACSIM/tplanner/modules/Planner/server/moveSimEvent.php",{eventID:$(element).attr("data-eventID"),moveTo:key.substring(7)},function(){
						location.reload();
					});
					break;
				default:
					if ($(element).hasClass("belongs-to-course")) {
						var actions  = ['confirmAllocation','clearAllocation','deleteEvent'];
						var yOffsets = [20,45,80];
						
						bulkOperation       = key;
						bulkOperationTarget = $(element).attr("data-eventID");
						
						setTimeout(function(){$(".nu-context-menu:last").css("top",$(".nu-context-menu:first").css("top").replace(/px/,'')/1+yOffsets[actions.indexOf(key)]).css("left",$(".nu-context-menu:first").css("left").replace(/px/,'')/1+$(".nu-context-menu:first").width()/1);},20);
					} else {
						$.post("/MUACSIM/tplanner/modules/Planner/server/"+key+".php",{eventID:$(element).attr("data-eventID"),bulk:0},function(){
							location.reload();
						});
					}
			}
		}
	});
	
	$(".nu-context-menu:first").nuContextMenu({
		hideAfterClick : true,
		trigger        : 'click',
		items          : 'li',
		menu           : [
			{
				name  : 'single',
				title : 'This occurrence only',
			},
			{
				name  : 'all',
				title : 'From this day onwards',
			}
		],
		callback       : function(key,element){
			$.post("/MUACSIM/tplanner/modules/Planner/server/"+bulkOperation+".php",{eventID:bulkOperationTarget,bulk:(key=='all'?1:0)},function(){
				location.reload();
			});
		}
	});
});
