function findGetParameter(parameterName)
{
	var result = null,
	tmp = [];
	location.search.substr(1).split("&").forEach(function(item){
		tmp = item.split("=");
		if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
	});
	return result;
}

$(document).ready(function(){
	$(".input-group.date").eq(0).datepicker({
		format                : "dd-mm-yyyy",
		daysOfWeekHighlighted : "0",
		startDate             : "today"
	});
	
	$(".input-group.date").eq(1).datepicker({
		format                : "dd-mm-yyyy",
		daysOfWeekHighlighted : "0",
		startDate             : "today",
		endDate               : "31-12-2019"
	});
	
	$("#frequency").on("change",function(){
		if ($(this).val()/1) {
			$("#date2").parent().parent().show();
			$("label").first().html('Start date:');
		} else {
			$("#date2").parent().parent().hide();
			$("label").first().html('Date:');
		}
	}).trigger("change");
	
	$(".btn-success").on("click",function(){
		$(this).prop("disabled",true);
		
		var date1 = new Date($("#date1").val().substring(6,10),$("#date1").val().substring(3,5)-1,$("#date1").val().substring(0,2),12);
		var date2 = new Date($("#date2").val().substring(6,10),$("#date2").val().substring(3,5)-1,$("#date2").val().substring(0,2),14);
		
		var days = [];
		
		switch ($("#frequency").val()/1) {
			case 1:
				while (date1 < date2) {
					days.push(date1.toISOString().substring(0,10));
					date1.setDate(date1.getDate() + 7);
				}
				break;
			case 2:
				while (date1 < date2) {
					days.push(date1.toISOString().substring(0,10));
					date1.setDate(date1.getDate() + 14);
				}
				break;
			case 3:
				while (date1 < date2) {
					days.push(date1.toISOString().substring(0,10));
					date1.setMonth(date1.getMonth() + 1);
				}
				break;
			case 4:
				var wn = Math.ceil(date1.getDate()/7);
				var di = date1.getDay();
				while (date1 < date2) {
					days.push(date1.toISOString().substring(0,10));
					date1.setMonth(date1.getMonth() + 1);
					while (date1.getDay() != di)            date1.setDate(date1.getDate() - 1);
					if (Math.ceil(date1.getDate()/7) != wn) date1.setDate(date1.getDate() + 7);
				}
				break;
		}
		
		$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/saveRequest.php",{dayFrom:$("#date1").val().substring(6,10)+'-'+$("#date1").val().substring(3,5)+'-'+$("#date1").val().substring(0,2),dayTo:$("#date2").val().substring(6,10)+'-'+$("#date2").val().substring(3,5)+'-'+$("#date2").val().substring(0,2),frequency:$("#frequency").val(),m:$("input[type=checkbox]").eq(0).prop("checked")?1:0,s:$("input[type=checkbox]").eq(1).prop("checked")?1:0,a:$("input[type=checkbox]").eq(2).prop("checked")?1:0,days:days.join()},function(){
			$(".btn-success").parent().parent().parent().html('<div style="font-size:2em;font-weight:bold;text-align:center;padding-top:4em;">Request saved successfully</div>');
			setTimeout(function(){location.assign('../../MyDuties/views/MyDuties.html')},3000);
		});
	});
});
