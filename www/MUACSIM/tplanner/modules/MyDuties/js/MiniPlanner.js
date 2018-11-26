function requiredRolesHTML(s)
{
	if (s == '') return '';
	var a = ['','','','Pilots','Hybrids DECO','Hybrids BRU','Hybrids HANN','OJTIs DECO','OJTIs BRU','OJTIs HANN'];
	var o = [];
	var r = s.split(',');
	r.map(function(x){if(x.split(':')[0]>2)o.push((x.split(':')[1]+' '+a[x.split(':')[0]/1]).replace(/1 (.+)s/,'1 $1'))});
	return '<br>Requires ' + o.join(', ');
}

$(document).ready(function(){
	knownHolidays_dates  = ['2019-01-01','2019-01-02','2019-04-19','2019-04-22','2019-05-30','2019-05-31','2019-06-10','2019-12-24','2019-12-25','2019-12-26','2019-12-27'];
	knownHolidays_titles = ['New Year','New Year','Good Friday','Easter Monday','Ascension','Ascension','Whit Monday','Christmas Eve','Christmas','Boxing Day','Year-end Closure'];
	
	$.vPOST("/MUACSIM/tplanner/modules/Planner/server/readSimEvents.php",null,function(resp){
		ev1 = $.parseJSON(resp);
		for (var evi=ev1.length-1;evi>=0;evi--) if (ev1[evi].sim>9) ev1.splice(evi,1);
		ev1.map(function(a){
			a.id        = a.simeventID;
			a.title     = a.name;
			a.start     = a['dt_from'].replace(/ /,'T');
			a.end       = a['dt_to'  ].replace(/ /,'T');
			a.color     = a.bgcolor;
			a.className = 2-a.sim ? 'simulator-escape' : a.mfs/1 ? 'simulator-trg needs-mfs' : 'simulator-trg';
			a.tooltip   = '<b>' + a.name + '</b><br>' + a.dt_from.substring(11,16) + ' - ' + a.dt_to.substring(11,16) + requiredRolesHTML(a.requiredRoles) + (a.notes ? '<div style=\'width:24em;height:0.8em;margin-bottom:0.4em;border-bottom:1px solid white;\'></div>'+a.notes : '');
		});
		
		ev2 = $.parseJSON(JSON.stringify(ev1));
		for (var kh=0 ; kh<knownHolidays_dates.length ; kh++) ev2.push({id:9999000+kh,title:knownHolidays_titles[kh],start:knownHolidays_dates[kh],end:knownHolidays_dates[kh].replace(/\d\d$/,function(a){return (a/1>8?'':'0')+(a/1+1)}).replace(/05-32$/,'06-01'),color:'#e2c266',className:'holiday'});
		
		$("#calendar1").fullCalendar({
			events              : ev2,
			selectable          : true,
			select              : false,
			viewRender          : function( ){setTimeout(function(){$(".needs-mfs .fc-content").append('<span class="badge badge-default" style="position:absolute;right:0;padding:1px 2px 2px 2px;">MFS</span>')},100)},
			timeFormat          : 'HH:mm',
			columnFormat        : 'ddd DD-MM',
			defaultView         : 'basView',
			firstDay            : 1,
			header              : {
									left    : 'title',
									center  : '',
									right   : 'today prev,next'
			},
			views               : {
									basView : {
										type            : 'agenda',
										duration        : {days:3},
										minTime         : '08:00:00',
										maxTime         : '22:00:00',
										slotLabelFormat : 'HH:mm',
										buttonText      : '3 days'
									}
			}
		});
	});
});
