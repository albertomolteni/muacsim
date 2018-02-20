$(document).ready(function(){
	var td_width  = $(".table1 tbody tr:first td:first").width();
	var td_height = $(".table1 tbody tr:first td:first").height();
	
	$(".table1 tr").eq(11).addClass("required-TOTAL").find("th").css("white-space","nowrap").html("Required hours");
	$(".table1 tr").eq(12).addClass("required-DECO" ).find("th").css("font-weight","normal").css("padding-left","2em").html("DECO");
	$(".table1 tr").eq(13).addClass("required-BRU"  ).find("th").css("font-weight","normal").css("padding-left","2em").html("BRU");
	$(".table1 tr").eq(14).addClass("required-HANN" ).find("th").css("font-weight","normal").css("padding-left","2em").html("HANN");
	
	$(".table1 tr").eq(17).addClass("unallocated-TOTAL").find("th").css("white-space","nowrap").html("Unallocated hours");
	$(".table1 tr").eq(18).addClass("unallocated-DECO" ).find("th").css("font-weight","normal").css("padding-left","2em").html("DECO");
	$(".table1 tr").eq(19).addClass("unallocated-BRU"  ).find("th").css("font-weight","normal").css("padding-left","2em").html("BRU");
	$(".table1 tr").eq(20).addClass("unallocated-HANN" ).find("th").css("font-weight","normal").css("padding-left","2em").html("HANN");
	
	$(".table1 tbody tr:first td").each(function(i){
		$(".headerContainer div").eq(i).css("left",$(this).position().left - 0.5*td_width );
		$(".headerContainer div").eq(i).css("top", $(this).position().top  - 5.2*td_height);
	});
	
	$(".table1 tr").each(function(){
		$(this).find("td").eq(17).css("border-top","none").css("border-bottom","none").css("background","white");
	});
	
	$.post("/MUACSIM/tplanner/modules/ManageUsers/server/readPilotTotalHours.php",null,function(resp){
		var response = $.parseJSON(resp);
		
		response.map(function(u){
			$(".table1 tr[data-userID="+u.userID+"] td").each(function(i){
				if (i < 12) $(this).html(u.minutesWorked[i]/60);
				if (i===12) $(this).html(u.minutesWorked.reduce(function(a,b){return a+b},0)/60);                           // Total
				if (i===13) $(this).html(u.yearlyHours);                                                                    // Contract hours
				if (i===14) $(this).html(50);                                                                               // Carry over from last year
				if (i===15) $(this).html($(this).prevAll("td").eq(0).html()/1 + $(this).prevAll("td").eq(1).html()/1);      // Available this year
				if (i===16) $(this).html($(this).prevAll("td").eq(0).html()/1 - $(this).prevAll("td").eq(3).html()/1);      // Unused
				if (i===18) $(this).html(Math.floor(u.weekends));
			});
			
			var shiftCounts = u.shiftCounts.split(',');
			shiftCounts.map(function(sc){
				$(".table1 tr[data-userID="+u.userID+"] td").eq(sc.split(':')[0]/1+17).html(sc.split(':')[1]);
			});
			$(".table1 tr[data-userID="+u.userID+"] td").eq(19).html(  Math.floor(17.5*(
					$(".table1 tr[data-userID="+u.userID+"] td").eq(24).html()/1 +
					$(".table1 tr[data-userID="+u.userID+"] td").eq(26).html()/1              ))
			);
			$(".table1 tr[data-userID="+u.userID+"] td").eq(20).html(
					$(".table1 tr[data-userID="+u.userID+"] td").eq(18).html()/1 +
					$(".table1 tr[data-userID="+u.userID+"] td").eq(19).html()/1
			);
		});
		
		for (var i=0 ; i<4 ; i++) {
			var col = [];
			$(".table1 tr:lt(10)").each(function(){
				col.push($(this).find("td").eq(i).text()/1);
			});
			
			var max = col.reduce(function(a,b){return Math.max(a,b)});
			var min = col.reduce(function(a,b){return Math.min(a,b)});
			
			$(".table1 tr:lt(10)").each(function(){
				var rel = ($(this).find("td").eq(i).text()-min) / (max-min);
				var r   = -512 * rel + 512;
				var g   =  512 * rel;
				$(this).find("td").eq(i).css("background","rgba("+Math.floor(Math.min(255,r))+","+Math.floor(Math.min(255,g))+",0,0.6)");
			});
		}
		for (var i=12 ; i<13 ; i++) {
			var col = [];
			$(".table1 tr:lt(10)").each(function(){
				col.push($(this).find("td").eq(i).text()/1);
			});
			
			var max = col.reduce(function(a,b){return Math.max(a,b)});
			var min = col.reduce(function(a,b){return Math.min(a,b)});
			
			$(".table1 tr:lt(10)").each(function(){
				var rel = ($(this).find("td").eq(i).text()-min) / (max-min);
				var r   = -512 * rel + 512;
				var g   =  512 * rel;
				$(this).find("td").eq(i).css("background","rgba("+Math.floor(Math.min(255,r))+","+Math.floor(Math.min(255,g))+",0,0.6)");
			});
		}
		for (var i=18 ; i<21 ; i++) {
			var col = [];
			$(".table1 tr:lt(10)").each(function(){
				col.push($(this).find("td").eq(i).text()/1);
			});
			
			var max = col.reduce(function(a,b){return Math.max(a,b)});
			var min = col.reduce(function(a,b){return Math.min(a,b)});
			
			$(".table1 tr:lt(10)").each(function(){
				var rel = ($(this).find("td").eq(i).text()-min) / (max-min);
				var r   = -512 * rel + 512;
				var g   =  512 * rel;
				$(this).find("td").eq(i).css("background","rgba("+Math.floor(Math.min(255,r))+","+Math.floor(Math.min(255,g))+",0,0.6)");
			});
		}
	});
	
	$.post("/MUACSIM/tplanner/modules/ManageUsers/server/readRequiredAndUnallocatedHoursBySector.php",null,function(resp){
		var response = $.parseJSON(resp);
		
		response.map(function(u){
			$(".table1 tr.required-"+u.sector).find("td").each(function(i){
				if (i < 12) $(this).html(u.required[i]/60);
				if (i===12) $(this).html(u.required.reduce(function(a,b){return a+b},0)/60);
			});
			$(".table1 tr.unallocated-"+u.sector).find("td").each(function(i){
				if (i < 12) $(this).html(u.unallocated[i]/60);
				if (i===12) $(this).html(u.unallocated.reduce(function(a,b){return a+b},0)/60);
			});
		});
		
		$(".table1 tbody tr:first td").each(function(i){
			$(".headerContainer div").eq(i).css("left",$(this).position().left - 0.5*td_width );
			$(".headerContainer div").eq(i).css("top", $(this).position().top  - 5.2*td_height);
		});
	});
	
	$(".table1 tr:gt(9)").each(function(){$(this).find("td:gt(12)").css("background","white").css("border","none")});
	$(".table1 tr").eq(10).find("td"   ).css("background","white").css("border","none");
	$(".table1 tr").eq(15).find("td,th").css("background","white").css("border","none");
	$(".table1 tr").eq(16).find("td"   ).css("background","white").css("border","none");
});
