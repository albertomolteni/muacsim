function refreshCalendar()
{
	ev2 = [];
	ev1.map(function(e){
		if (e.sim == $("#epcc select").eq(0).val()) ev2.push(e);
	});
	HOLIDAYS.map(function(e){
		ev2.push(e);
	});
	ev3.map(function(e){
		if (e.sim == $("#epcc select").eq(0).val()) ev2.push(e);
	});
	
	$("#calendar1").fullCalendar('removeEventSources');
	$("#calendar1").fullCalendar('addEventSource',ev2);
	
	if (selectedCalendarDate) {
		var z = selectedCalendarDate;
		$("#calendar1").fullCalendar('gotoDate',selectedCalendarDate);
		selectedCalendarDate = z;
		$("#calendar1").fullCalendar('select',  selectedCalendarDate);
	}
	
	if (ev3.length) {
		if ($("#saveChangesButton").is(":hidden")) {
			$("#saveChangesButton").show();
			$("#newCourseButton"  ).hide();
			$("#saveChangesButton").unbind().on("click",function(){
				$.post("/MUACSIM/tplanner/modules/Planner/server/addEventsToCourse.php",{courseID:$("#table1 tbody tr.selected").attr("data-courseID"),events:JSON.stringify(ev3)},function(){
					location.reload();
				});
			});
		}
	} else {
			$("#saveChangesButton").hide();
			$("#newCourseButton"  ).show();
	}
}

function optimizeCalendarForMobileBrowser()
{
	$(".fc-scroller").css("height","60vh");
	$(".fc-event-container").on("click",function(){
		$("marquee").remove();
		$(".fc-title").show();
		$(this).parent().parent().find(".fc-title").each(function(){
			$(this).after('<marquee scrolldelay="240">'+$(this).html()+'&nbsp;&nbsp;&nbsp;'+$(this).prevAll(".fc-time").eq(0).html()+'</marquee>');
			$(this).hide();
		});
	});
}

function requiredRolesHTML(s)
{
	if (s == '') return '';
	var a = ['','','','Pilots','Hybrids DECO','Hybrids BRU','Hybrids HANN'];
	var o = [];
	var r = s.split(',');
	r.map(function(x){o.push((x.split(':')[1]+' '+a[x.split(':')[0]/1]).replace(/1 (.+)s/,'1 $1'))});
	return '<br>Requires ' + o.join(', ');
}

$(document).ready(function(){
	$("#table1").DataTable();
	$("#table1 tbody").on("click","tr",function(){
		$("#table1 tbody tr").not(this).removeClass("selected");
		$(this).toggleClass("selected");
	});
	
	$(".dataTables_length").after('<div style="float:right;"><button id="newCourseButton" class="btn btn-sm btn-success" style="cursor:pointer;">New course</button><button id="saveChangesButton" class="btn btn-sm btn-warning" style="cursor:pointer;">Save changes</button></div>');
	$("#saveChangesButton").hide();
	$("#newCourseButton").on("click",function(){
		$("#newCourseModal").modal("show");
		$("#newCourseModal .btn-success").unbind().on("click",function(){
			$.post("/MUACSIM/tplanner/modules/Planner/server/createNewCourse.php",{name:btoa($("#newCourse_name").val()),color:$("#newCourse_color").val()},function(){location.reload()});
		});
	});
	
	HOLIDAYS = [
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
	
	$.post("/MUACSIM/tplanner/modules/Planner/server/readSimEvents.php",null,function(resp){
		ev1      = $.parseJSON(resp);
		lastEvID = 0;
		
		ev1.map(function(a){
			a.id        = a.simeventID;
			a.title     = a.name;
			a.start     = a['dt_from'].replace(/ /,'T');
			a.end       = a['dt_to'  ].replace(/ /,'T');
			a.color     = a.bgcolor;
			a.className = a.mfs/1 ? 'needs-mfs' : '';
			a.tooltip   = '<b>' + a.name + '</b><br>' + a.dt_from.substring(11,16) + ' - ' + a.dt_to.substring(11,16) + requiredRolesHTML(a.requiredRoles);
			if (a.id > lastEvID) lastEvID = a.id;
		});
		
		ev3 = [];
		ev2 = [];
		ev1.map(function(e){
			if (e.sim == $("#epcc select").eq(0).val()) ev2.push(e);
		});
		HOLIDAYS.map(function(e){
			ev2.push(e);
		});
		
		selectedCalendarDate = 0;
		
		$("#calendar1").fullCalendar({
			events              : ev2,
			selectable          : true,
			select              : function(s){selectedCalendarDate=s;$("#epcc input,select").blur();$(".fc-toolbar button").blur();},
			unselect            : function( ){selectedCalendarDate=0;},
			viewRender          : function( ){setTimeout(function(){if(window.innerWidth<768)optimizeCalendarForMobileBrowser();else{$("[data-toggle=tooltip]").tooltip();$(".needs-mfs .fc-content").append('<span class="badge badge-default" style="position:absolute;right:0;padding:1px 2px 2px 2px;">MFS</span>');}},100);},
			timeFormat          : 'HH:mm',
			defaultView         : 'month',
			firstDay            : 1,
			header              : {
									left   : 'title',
									center : '',
									right  : 'today prev,next agendaWeek,month'
			}
		});
		
		$("#epcc select").eq(0).on("change",function(){
			if ($(this).val() == 1) {
				$("#epcc select").eq(1).css("visibility","hidden");
				$("#epcc input" ).eq(1).css("visibility","hidden");
				$("#epcc input" ).eq(0).attr("placeholder","Suites");
			} else {
				$("#epcc select").eq(1).css("visibility","visible");
				$("#epcc input" ).eq(1).css("visibility","visible");
				$("#epcc input" ).eq(0).attr("placeholder","ATCO consoles");
			}
			refreshCalendar();
		});
		
		$("body").on("keyup",function(e){
			if (e.which == 77) {
				if (selectedCalendarDate  &&  $("#table1 tbody tr.selected").length) {
					lastEvID++;
					ev3.push({
						id             : lastEvID,
						title          : $("#table1 tbody tr.selected td:first").html(),
						sim            : $("#epcc select").eq(0).val()/1,
						mfs            : $("#epcc select").eq(1).val()/1,
						atco_consoles  : $("#epcc input" ).eq(0).val()/1,
						pilot_consoles : $("#epcc input" ).eq(1).val()/1,
						requiredRoles  : $("#epcc input" ).eq(2).val(),
						start          : selectedCalendarDate.format() + 'T08:00:00',
						end            : selectedCalendarDate.format() + 'T12:30:00',
						color          : $("#table1 tbody tr.selected").attr("data-color"),
						className      : 'asd'
					});
					selectedCalendarDate.add(1,'days');
					refreshCalendar();
				}
			}
			if (e.which == 83) {
				if (selectedCalendarDate  &&  $("#table1 tbody tr.selected").length) {
					lastEvID++;
					ev3.push({
						id             : lastEvID,
						title          : $("#table1 tbody tr.selected td:first").html(),
						sim            : $("#epcc select").eq(0).val()/1,
						mfs            : $("#epcc select").eq(1).val()/1,
						atco_consoles  : $("#epcc input" ).eq(0).val()/1,
						pilot_consoles : $("#epcc input" ).eq(1).val()/1,
						requiredRoles  : $("#epcc input" ).eq(2).val(),
						start          : selectedCalendarDate.format() + 'T13:00:00',
						end            : selectedCalendarDate.format() + 'T17:30:00',
						color          : $("#table1 tbody tr.selected").attr("data-color"),
						className      : 'asd'
					});
					selectedCalendarDate.add(1,'days');
					refreshCalendar();
				}
			}
			if (e.which == 65) {
				if (selectedCalendarDate  &&  $("#table1 tbody tr.selected").length) {
					lastEvID++;
					ev3.push({
						id             : lastEvID,
						title          : $("#table1 tbody tr.selected td:first").html(),
						sim            : $("#epcc select").eq(0).val()/1,
						mfs            : $("#epcc select").eq(1).val()/1,
						atco_consoles  : $("#epcc input" ).eq(0).val()/1,
						pilot_consoles : $("#epcc input" ).eq(1).val()/1,
						requiredRoles  : $("#epcc input" ).eq(2).val(),
						start          : selectedCalendarDate.format() + 'T17:30:00',
						end            : selectedCalendarDate.format() + 'T22:00:00',
						color          : $("#table1 tbody tr.selected").attr("data-color"),
						className      : 'asd'
					});
					selectedCalendarDate.add(1,'days');
					refreshCalendar();
				}
			}
			if (e.which == 32 || e.which == 39) {
				if (selectedCalendarDate) {
					selectedCalendarDate.add(1,'days');
					var z = selectedCalendarDate;
					$("#calendar1").fullCalendar('gotoDate',selectedCalendarDate);
					selectedCalendarDate = z;
					$("#calendar1").fullCalendar('select',  selectedCalendarDate);
				}
			}
			if (e.which == 8) {
				ev3.splice(ev3.length-1,1);
				selectedCalendarDate.subtract(1,'days');
				refreshCalendar();
			}
		});
		
		if (window.innerWidth < 768) {
			$(".fc-toolbar h2").css("font-size","1.4rem").css("margin-bottom","0.8rem");
			$(".fc-toolbar .fc-right").prepend('<button type="button" class="swap-sim-button fc-button fc-state-default fc-corner-left fc-corner-right">TRG</button>');
			$(".fc-toolbar button").css("font-size","0.9em");
			$(".swap-sim-button").on("click",function(){$("#epcc select").eq(0).val(3-$("#epcc select").eq(0).val()).trigger("change");$(this).html($(this).html()=='TRG'?'Esca':'TRG');setTimeout(optimizeCalendarForMobileBrowser,100);});
			$(".row").eq(1).css("margin","0 -15px");
			$("head").append("<style>.fc-time{display:none}</style>");
			optimizeCalendarForMobileBrowser();
		}
	});
});
