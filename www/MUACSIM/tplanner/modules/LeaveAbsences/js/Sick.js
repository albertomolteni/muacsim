$(document).ready(function(){
	$(".input-group.date").eq(0).datepicker({
		format                : "dd-mm-yyyy",
		daysOfWeekDisabled    : "0",
		daysOfWeekHighlighted : "0",
		startDate             : "today"
	});
	
	$(".btn-success").on("click",function(){
		$(this).prop("disabled",true);
		$.vPOST("/MUACSIM/tplanner/modules/LeaveAbsences/server/reportSick.php",{ertw:$("#date1").val().substring(6,10)+'-'+$("#date1").val().substring(3,5)+'-'+$("#date1").val().substring(0,2),comments:btoa($("#comments").val())},function(){
			$(".btn-success").parent().parent().parent().html('<div style="font-size:2em;font-weight:bold;text-align:center;padding-top:2em;"><img src="../../../img/getwellsoon.jpg" style="width:100%;"><br><br>Get well soon!</div>');
			setTimeout(function(){location.assign('../../MyDuties/views/MyDuties.html')},3000);
		});
	});
});
