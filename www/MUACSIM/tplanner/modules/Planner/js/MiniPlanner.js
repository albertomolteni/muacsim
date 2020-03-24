function requiredRolesHTML(s)
{
	if (s == '') return '';
	var a = ['','','','Pilots','Hybrids DECO','Hybrids BRU','Hybrids HANN','OJTIs DECO','OJTIs BRU','OJTIs HANN'];
	var o = [];
	var r = s.split(',');
	r.map(function(x){if(x.split(':')[0]>2)o.push((x.split(':')[1]+' '+a[x.split(':')[0]/1]).replace(/1 (.+)s/,'1 $1'))});
	return '<br>Requires ' + o.join(', ');
}

function getwx()
{
	$.getJSON("https://muacsim.nl/wx.json",function(data){wx=data;showwx()});
}

function showwx()
{
	$(".fc-day-grid .fc-day").not(".fc-past").each(function(){
		for (var wxi=0;wxi<wx.list.length;wxi++) {
			if (wx.list[wxi].dt_txt == $(this).attr("data-date")+' 09:00:00') {
				$(this).html('<div style="text-align:right;padding:10% 15%;background-position:30% center;background-repeat:no-repeat;background-image:url(../../../img/'+wx.list[wxi].weather[0].icon+'@2x.png);background-size:contain;height:100%;font-size:11px;">'+Math.round(wx.list[wxi].main.temp-273.15)+'&#176;</div>');
				break;
			}
		}
	});
}

function fillSimCoreRoster()
{
	var s = ['M','S','A','sR','sm','s','sa','lm','la','C','P','CP','CS','AM','m','a','X'];
	simcoreDuties.map(function(duty){
		try {
			$(".simcore-roster[data-userID="+duty.userID+"][data-day="+duty.day+"]").html(s[duty.shiftID-1]);
		} catch(e) {
			$(".simcore-roster[data-userID="+duty.userID+"][data-day="+duty.day+"]").html('?');
		}
	});
}

function insertSimCoreRoster()
{
	var simcore = ['','BAS','FEDERICO','EMIL','VINCENT','FRED','JEAN-PETER','ALBERTO','JEAN-YVES'];
	var c_width = $(".fc-day-header").eq(0).width()+1;
	var zzzzzzz = document.cookie.match(/authAppUserID=(\d+)/)[1];
	for (var jj=0;jj<simcore.length;jj++) {
		if (simcore[jj].length) {
			$(".fc-time-grid .fc-slats tbody").append('<tr><td class="fc-axis fc-time fc-widget-content" style="font-size:0.5em;font-style:italic;"><span>'+simcore[jj]+'</span></td><td class="fc-widget-content"></td></tr>');
			for (var ii=0;ii<3;ii++) $(".fc-widget-content").last().append('<div class="simcore-roster" data-userID="'+jj+'" data-day="'+$(".fc-day-header").eq(ii).attr("data-date")+'" style="display:inline-block;width:'+(ii?c_width+1:c_width)+'px;text-align:center;">&nbsp;</div>');
			if (jj==zzzzzzz) $(".simcore-roster[data-userID="+jj+"]").on("contextmenu",function(){$(".duty-picking").removeClass("duty-picking");$(this).addClass("duty-picking");$("#dutyPickerModal .duty-picker").removeClass("active");$("#dutyPickerModal .duty-picker[data-tag="+$(this).html().replace(/&nbsp;/,'o')+"]").addClass("active");$("#dutyPickerModal").modal("show")});
		}
	}
	$(".fc-scroller").css("height",(22*$(".fc-slats tr").last().height()+8)+"px");
	fillSimCoreRoster();
}

$(document).ready(function(){
	if (document.cookie.match(/authAppUserID=(1|7);/))       $(".nav-item:first").after('<li class="nav-item"><a class="nav-link" style="padding:0.5em 2em;" href="../../Planner/views/ManageSwaps.html">Manage swaps</a></li>');
	if (document.cookie.match(/authAppUserID=[1-8](?!\d)/))  $(".nav-item:last" ).after('<li class="nav-item"><a class="nav-link" style="padding:0.5em 2em;" href="../../Planner/views/SimRemoteControl.html">TRG remote control</a></li>');
	$("#dutyPickerModal .duty-picker").on("click",function(){
		$("#dutyPickerModal .duty-picker").not(this).removeClass("active");
		$(this).toggleClass("active");
	});
	$("#dutyPickerModal .btn-success").on("click",function(){
		$("#dutyPickerModal .btn-success").prop("disabled",true);
		if ($(".duty-picker.active").length) {
			if ($(".duty-picking").html()!='&nbsp;') {
				for (var scd=0;scd<simcoreDuties.length;scd++) if (simcoreDuties[scd].userID==document.cookie.match(/authAppUserID=(\d+)/)[1]&&simcoreDuties[scd].day==$(".duty-picking").attr("data-day")) simcoreDuties[scd].shiftID = $(".duty-picker.active").attr("data-shiftID");
			} else {
				simcoreDuties.push({userID:document.cookie.match(/authAppUserID=(\d+)/)[1],day:$(".duty-picking").attr("data-day"),shiftID:$(".duty-picker.active").attr("data-shiftID")});
			}
		} else {
				for (var scd=0;scd<simcoreDuties.length;scd++) if (simcoreDuties[scd].userID==document.cookie.match(/authAppUserID=(\d+)/)[1]&&simcoreDuties[scd].day==$(".duty-picking").attr("data-day")) simcoreDuties.splice(scd,1);
		}
		$.vPOST("/MUACSIM/tplanner/modules/Planner/server/quickaddshift.php",{day:$(".duty-picking").attr("data-day"),shiftID:$(".duty-picker.active").length?$(".duty-picker.active").attr("data-shiftID"):0},function(){
			$("#dutyPickerModal .btn-success").prop("disabled",false);
			$(".duty-picking").html($(".duty-picker.active").length?$(".duty-picker.active").attr("data-tag"):'&nbsp;');
			$("#dutyPickerModal").modal("hide");
		});
	});
	
	knownHolidays_dates  = ['2019-01-01','2019-01-02','2019-04-19','2019-04-22','2019-05-30','2019-05-31','2019-06-10','2019-12-24','2019-12-25','2019-12-26','2019-12-27','2020-01-01','2020-01-02','2020-04-10','2020-04-13','2020-05-21','2020-05-22','2020-06-01','2020-12-24','2020-12-25'];
	knownHolidays_titles = ['New Year','New Year','Good Friday','Easter Monday','Ascension','Ascension','Whit Monday','Christmas Eve','Christmas','Boxing Day','Year-end Closure','New Year','New Year','Good Friday','Easter Monday','Ascension','Ascension','Whit Monday','Christmas Eve','Christmas'];
	
	$("body").append('<div id="loadingOverlay" style="position:fixed;left:0;top:0;z-index:999999;width:100vw;height:100vh;background:rgba(0,0,0,0.8);color:white;text-align:center;padding-top:40vh;"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><br><br>Loading events, please wait</div>');
	wx = {list:[]};
	getwx();
	$.vPOST("/MUACSIM/tplanner/modules/Planner/server/readSimEvents.php",null,function(resp){
		ev1 = $.parseJSON(resp);
		for (var evi=ev1.length-1;evi>=0;evi--) if (ev1[evi].sim>9) ev1.splice(evi,1);
		ev1.map(function(a){
			a.id        = a.simeventID;
			a.title     = a.name;
			a.start     = a['dt_from'].replace(/ /,'T');
			a.end       = a['dt_to'  ].replace(/ /,'T');
			a.color     = a.bgcolor;
			a.className = 'simeventID-'+a.simeventID;
			a.tooltip   = '<b>' + a.name + '</b><br>' + a.dt_from.substring(11,16) + ' - ' + a.dt_to.substring(11,16) + requiredRolesHTML(a.requiredRoles) + (a.notes ? '<div style=\'width:24em;height:0.8em;margin-bottom:0.4em;border-bottom:1px solid white;\'></div>'+a.notes : '');
		});
		
		ev2 = $.parseJSON(JSON.stringify(ev1));
		for (var kh=0 ; kh<knownHolidays_dates.length ; kh++) ev2.push({id:9999000+kh,title:knownHolidays_titles[kh],start:knownHolidays_dates[kh],end:knownHolidays_dates[kh].replace(/\d\d$/,function(a){return (a/1>8?'':'0')+(a/1+1)}).replace(/05-32$/,'06-01'),color:'#e2c266',className:'holiday'});
		
		simcoreDuties = [];
		$.vPOST("/MUACSIM/tplanner/modules/Planner/server/readUserShifts.php",null,function(resp){
			simcoreDuties = $.parseJSON(resp);
			fillSimCoreRoster();
		});
		
		$("#calendar1").fullCalendar({
			events              : ev2,
			selectable          : true,
			select              : false,
			viewRender          : function(){setTimeout(function(){knownHolidays_dates.map(function(khd){$(".fc-bg .fc-day[data-date="+khd+"]").addClass("fc-sun")});showwx();insertSimCoreRoster()},200)},
			timeFormat          : 'HH:mm',
			columnFormat        : 'ddd DD-MM',
			defaultView         : 'miniView',
			firstDay            : 1,
			header              : {
									left    : 'title',
									center  : '',
									right   : 'today prev,next'
			},
			views               : {
									miniView : {
										type            : 'agenda',
										duration        : {days:3},
										minTime         : '08:00:00',
										maxTime         : '22:00:00',
										slotDuration    : '01:00:00',
										slotLabelFormat : 'HH:mm',
										buttonText      : '3 days'
									}
			}
		});
		$(".fc-toolbar h2").css("font-size","1rem").css("margin-bottom","0.8rem").css("margin-top","0.5rem");
		$(".fc-toolbar button").css("font-size","0.9em");
		$("head").append("<style>.fc-month-view .fc-time{display:none}.fc-day-grid-event{text-align:center}.fc-agenda-view .fc-day-header span{font-size:0.8em}.fc button .fc-icon{top:0.1em!important}</style>");
		$(".fc-view-container").on("contextmenu",".fc-v-event",function(){
			$("#getInfoModal .modal-body").html('');
			$("#getInfoModal .modal-title").html($(this).find(".fc-title").html());
			$("#getInfoModal").modal("show");
			$.vPOST("/MUACSIM/tplanner/modules/Planner/server/getInfo.php",{simeventID:$(this).attr("class").match(/simeventID-(\d+)/)[1]},function(resp){
				$("#getInfoModal .modal-body").html(resp);
			});
		});
		$("#loadingOverlay").remove();
	});
	
	document.addEventListener("resume",          function(){                                       if(!document.cookie.match(/authAppUserID=\d+/))location.assign('../../SessionControl/views/SessionControl.html')});
	document.addEventListener("visibilitychange",function(){if(document.visibilityState=="visible")if(!document.cookie.match(/authAppUserID=\d+/))location.assign('../../SessionControl/views/SessionControl.html')});
	document.addEventListener("deviceready",function(){
		pn = PushNotification.init({android:{senderID:"690910508250"},browser:{},ios:{alert:true,badge:true,sound:true},windows:{}});
		pn.on("registration",function(data){
			if (navigator.userAgent.match(/i(Phone|Pad)/)) {
				$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/saveAPNS.php",{apnsID:data.registrationId,appVersion:'1.5.9c'},function(){});
			} else {
				$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/saveFCM.php", { fcmID:data.registrationId,appVersion:'1.5.9c'},function(){});
			}
		});
		pn.on("notification",function(data){
			if (data.additionalData.notamText.split(' ').length-1) {
				$("#notamModal .modal-title").html(data.message);
				$("#notamModal .modal-body" ).html(data.additionalData.notamText);
				$("#notamModal").modal("show");
			} else {
				if (data.additionalData.notamText == 'triggerSwapDetails') {
					location.assign('../../MyDuties/views/MyDuties.html');
				} else {
					location.assign('../../'+data.additionalData.notamText+'.html');
				}
			}
		});
		pn.on("error",function(e){alert(e.message)});
	});
});
