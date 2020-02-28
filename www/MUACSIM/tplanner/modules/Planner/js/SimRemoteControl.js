function readTRGstate()
{
	$.vPOST("/MUACSIM/tplanner/modules/Planner/server/TRGstate.php",null,function(resp){
		var response = $.parseJSON(resp);
		response.map(function(o){
			try {
				var s = o.simk.replace(/\./,'_');
				if (dr[o.simk]) {
					dr[o.simk] = 0;
				} else {
					$("#simker0"+s).find("div").last().html(o.TSVdi);
					switch (o.state) {
						case 'init':
							$("#simker0"+s).find("div").eq(1).html('<i class="fa fa-hourglass-half"></i>');
							$("#simker0"+s).find("div").eq(3).html('initialising');
							break;
						case 'star':
							$("#simker0"+s).find("div").eq(1).html('<i class="fa fa-play"></i>');
							$("#simker0"+s).find("div").eq(3).html('running&nbsp;&nbsp;'+o.speed+'x');
							break;
						case 'paus':
							$("#simker0"+s).find("div").eq(1).html('<i class="fa fa-pause"></i>');
							$("#simker0"+s).find("div").eq(3).html('paused');
							break;
						default:
							$("#simker0"+s).find("div").eq(1).html('<i class="fa fa-stop"></i>');
							$("#simker0"+s).find("div").eq(3).html('stopped');
					}
				}
			} catch(e) {
				console.log('readTRGstate('+o.simk+') fail');
			}
		});
	});
}

$(document).ready(function(){
	s  = ['1.tra','2.tra','3.tra','4.tra','1','2','3','4','5','6','7','8'];
	dr = {};
	s.map(function(x){
		$(".content-main").append('<div id="simker0'+x.replace(/\./,'_')+'" class="col-md-3" style="padding:0.4em;margin-bottom:2em;"><div style="border:1px solid #ddd;border-radius:0.4em;text-align:center;padding:1vh;"><div style="font-size:10vh;"></div><div style="font-size:4vh;">simker0'+x+'</div><div style="font-size:2.6vh;"></div><div style="display:none;"></div></div></div>');
		dr[x] = 0;
	});
	setInterval(readTRGstate,12000);
	$("body").on("dblclick",".fa-play",function(){
		var $t = $(this).parent().parent().parent();
		$.vPOST("/MUACSIM/tplanner/modules/Planner/server/TRGsendXml.php",{s:$t.attr("id").substring(6),c:'pause'},function(){});
		$t.find("div").eq(1).html('<i class="fa fa-pause"></i>');
		$t.find("div").eq(3).html('paused');
		dr[$t.attr("id").substring(7).replace(/_/,'.')] = 1;
	});
	$("body").on("dblclick",".fa-pause",function(){
		var $t = $(this).parent().parent().parent();
		$.vPOST("/MUACSIM/tplanner/modules/Planner/server/TRGsendXml.php",{s:$t.attr("id").substring(6),c:'speed100'},function(){});
		$t.find("div").eq(1).html('<i class="fa fa-play"></i>');
		$t.find("div").eq(3).html('running&nbsp;&nbsp;1x');
		dr[$t.attr("id").substring(7).replace(/_/,'.')] = 1;
	});
	$(".col-md-3[id^=simker0]").on("contextmenu",function(){ });
});
