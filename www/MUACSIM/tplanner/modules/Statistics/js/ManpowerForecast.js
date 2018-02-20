function drawPilotHoursBarChart()
{
	$("#pilotHoursChartContainer").html('<canvas id="pilotHoursCanvas" style="width:100%;margin-top:1vh;"></canvas>');
	var ctx = document.getElementById("pilotHoursCanvas").getContext("2d");
		/*	var gradientStroke = ctx.createLinearGradient(0, 0, 839, 0);
			gradientStroke.addColorStop(  0,    'rgba(51,255,51,0.2)');
			gradientStroke.addColorStop(0.2733,   'rgba(51,255,51,0.2)');
			gradientStroke.addColorStop(0.2733001,'rgba(255,51,51,0.6)');
			gradientStroke.addColorStop(1,      'rgba(255,51,51,0.6)');*/
	var mfData = {
		labels   : mfLabelsGrouped,
		datasets : [
			{
				label           : '',
				type            : 'line',
				data            : mf24HeqvGrouped,
				lineTension:0,
				borderColor:'rgb(70,210,70)',
				backgroundColor : 'transparent' //gradientStroke ? gradientStroke : 'red'
			},
			{
				label           : '',
				type            : 'line',
				data            : mfValuesGrouped,
				lineTension:0,
				borderColor:'rgb(255,180,120)',
				backgroundColor : 'transparent' //gradientStroke ? gradientStroke : 'red'
			}
		]
	};
	
	window.pilotHoursChart = new Chart(ctx,{
		type    : 'bar',
		data    : mfData,
		options : {
			responsive : false,
			legend     : false,
			title      : false,
			tooltips   : {displayColors:false,callbacks:{title:function(o){return 'Week '+(1+o[0].index%52)},label:function(o){return [mfValuesGrouped[o.index].y+' pilots minimum',mf24HeqvGrouped[o.index].y+' pilots at 60%']},labelColor:function(){return false}}},
			scales     : {
					xAxes : [{
						type         : 'time',
						distribution : 'linear',
						ticks        : {source:'auto'},
		//				time         : {displayFormats:{day:'MMMM'}}
					}],
					yAxes : [{
						ticks : {
							fontSize :  10
						}
					}]
			}
		}
	});
}

function optimizeRoles()
{
	optimizedRoles = {};
	mfLabels       = [];
	mfValues       = [];
	mfColors       = [];
	
	allRequiredRoles.map(function(x){
		var xRR  = x.requiredRoles.split(',');
		var xPN  = 0;
		xRR.map(function(rr){if(rr.length)xPN+=rr.split(':')[1]/1});
		
		var xDay = x.dt_from.substring(0,10);
		if (typeof optimizedRoles[xDay]    === 'undefined') optimizedRoles[xDay] = {m:0,s:0,a:0};
		
		if (x.dt_from.substring(11,13)     === '08') {
			optimizedRoles[xDay].m += xPN;
			if (x.dt_to.substring(11,13)   === '17') optimizedRoles[xDay].s += xPN;
		}
		if (x.dt_to.substring(11,13)       === '22') {
			optimizedRoles[xDay].a += xPN;
			if (x.dt_from.substring(11,13) === '13') optimizedRoles[xDay].s += xPN;
		}
		if (x.dt_from.substring(11,13)==='13' && x.dt_to.substring(11,13)==='17') optimizedRoles[xDay].s += xPN;
	});
	
	for (key in optimizedRoles) if (optimizedRoles.hasOwnProperty(key)) {
		optimizedRoles[key].h = optimizedRoles[key].m + optimizedRoles[key].s + optimizedRoles[key].a;
		optimizedRoles[key].s = Math.max(0,optimizedRoles[key].s - optimizedRoles[key].m);
		optimizedRoles[key].s = Math.max(0,optimizedRoles[key].s - optimizedRoles[key].a);
		optimizedRoles[key].p = optimizedRoles[key].m + optimizedRoles[key].s + optimizedRoles[key].a;
	}
}

function groupByWeek()
{
	mfLabelsGrouped = [];
	mfValuesGrouped = [];
	mf24HeqvGrouped = [];
	mfColorsGrouped = [];
	var d1 = new Date('2018-01-01T04:00:00');
	var d3 = new Date('2019-07-14T02:00:00');
	while (d1 < d3) {
		var maxPeopleNeeded  = 0;
		var trgSessionBlocks = 0;
		for (key in optimizedRoles) if (optimizedRoles.hasOwnProperty(key)) {
			var d2 = new Date(key+'T08:00:00');
			if (d2-d1>0 && d2-d1<604800000) {
				if (optimizedRoles[key].p > maxPeopleNeeded) maxPeopleNeeded = optimizedRoles[key].p;
				trgSessionBlocks += optimizedRoles[key].h;
			}
		}
		mfLabelsGrouped.push(moment(d1.toISOString().substring(0,10),'YYYY-MM-DD'));
		mfValuesGrouped.push({t:mfLabelsGrouped[mfLabelsGrouped.length-1].valueOf(),y:maxPeopleNeeded});
		mf24HeqvGrouped.push({t:mfLabelsGrouped[mfLabelsGrouped.length-1].valueOf(),y:Math.ceil(trgSessionBlocks*0.1875)});
		d1.setDate(d1.getDate()+7);
	}
}

$(document).ready(function(){
	window.minTickX = 999;
	window.maxTickX = 0;
	gradientStroke  = null;
	$.post("/MUACSIM/tplanner/modules/Statistics/server/readRequiredRoles.php",null,function(resp){
		allRequiredRoles = $.parseJSON(resp);
		optimizeRoles();
		groupByWeek();
		drawPilotHoursBarChart();
	});
});
