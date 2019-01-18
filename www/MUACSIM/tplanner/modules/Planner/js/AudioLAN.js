$(document).ready(function(){
	$(".container1 .col-lg-6").on("click",function(){
		reset_suite = $(this).html();
		$(".container1").hide();
		$(".container2").show();
	});
	$(".container2 .col-lg-4").on("click",function(){
		reset_position      = $(this).attr("data");
		reset_position_text = $(this).html();
		var cnf = confirm(reset_suite+' '+reset_position_text+'\n\nAre you sure?');
		if (cnf) {
			$.vPOST("/MUACSIM/tplanner/modules/Planner/server/resetAL.php",{hostname:'m1'+reset_suite.substring(6).toLowerCase()+reset_position},function(){alert('AudioLAN killed.\n\nInstruct the hybrid to restart AudioLAN on this position via the workspace menu!');location.assign('../../MyDuties/views/MyDuties.html')});
		} else {
			$(".container1").show();
			$(".container2").hide();
		}
	});
});
