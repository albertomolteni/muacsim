function draw_assignments()
{
	$(".role-vacancy").removeClass("filled").attr("data-userID",null).html('');
	
	for (var ri=0 ; ri<role_assignments.length ; ri++) {
		role_assignments[ri].assignments.map(function(a){
			$(".role-droppable[data-qualID="+role_assignments[ri].qualID+"] .role-vacancy").not(".filled").first().html($(".pilot-card[data-userID="+a+"]").html()).attr("data-userID",a).addClass("filled");
		});
	}
	
	$(".role-vacancy.filled").prepend('<div class="remove-assignment" style="float:right;margin-top:-0.4em;cursor:pointer;"><i class="fa fa-times"></i></div>');
	$(".remove-assignment").on("click",function(){
		var u  = $(this).parent().attr("data-userID");
		var ri = 0;
		while (role_assignments[ri].qualID != $(this).parent().parent().parent().attr("data-qualID")) ri++;
		role_assignments[ri].assignments.splice(role_assignments[ri].assignments.indexOf(u),1);
		$(".pilot-card[data-userID="+u+"]").removeClass("disabled").draggable("enable");
		draw_assignments();
	});
}

$(document).ready(function(){
	$(".card").eq(1).css("max-height",$(".card").eq(0).outerHeight() + "px");
	
	role_assignments = [];
	
	$(".role-droppable").each(function(){
		role_assignments.push({qualID:$(this).attr("data-qualID"),assignments:[]});
	});
	
	$(".pilot-card").draggable({helper:"clone",appendTo:"body",start:function(event,ui){
		$(this).addClass("hidden");
		ui.helper.outerWidth($(".role-vacancy").eq(0).outerWidth()*0.95);
	},stop:function(event,ui){
		$(this).removeClass("hidden");
	}});
	
	$(".role-droppable").droppable({drop:function(event,ui){
		if (ui.draggable.find("span").text().indexOf($(this).prevAll("div").eq(0).text()) > -1) {
			var ri = 0;
			while (role_assignments[ri].qualID != $(this).attr("data-qualID")) ri++;
			role_assignments[ri].assignments.push(ui.helper.attr("data-userID"));
			ui.draggable.addClass("disabled").draggable("disable");
			draw_assignments();
		}
	}});
	
	$.post("/MUACSIM/tplanner/modules/Planner/server/readRoleAllocation.php",{eventID:$("#saveButton").attr("data-eventID")},function(resp){
		var response = $.parseJSON(resp);
		
		response.map(function(a){
			var ri = 0;
			while (role_assignments[ri].qualID != a.qualificationID) ri++;
			role_assignments[ri].assignments.push(a.userID);
		});
		
		$(".pilot-card.disabled").draggable("disable");
		draw_assignments();
	});
	
	$("#saveButton").on("click",function(){
		$.post("/MUACSIM/tplanner/modules/Planner/server/saveRoleAllocation.php",{eventID:$(this).attr("data-eventID"),role_assignments:JSON.stringify(role_assignments)},function(){
			location.assign('/MUACSIM/tplanner/Planner/');
		});
	});
	
	$("#autoButton").on("click",function(){
		$.post("/MUACSIM/tplanner/modules/Planner/server/autoRoleAllocation.php",{eventID:$(this).attr("data-eventID"),ignoreWishes:0},function(resp){
			if (resp.indexOf("ERROR_INSUFFICIENT_QUALIFIED_PEOPLE") < 0) {
				location.reload();
			} else {
				$.post("/MUACSIM/tplanner/modules/Planner/server/autoRoleAllocation.php",{eventID:$(this).attr("data-eventID"),ignoreWishes:1},function(resp){
					if (resp.indexOf("ERROR_INSUFFICIENT_QUALIFIED_PEOPLE") < 0) {
						location.reload();
					} else {
						alert('There are not enough qualified people for this event');
					}
				});
			}
		});
	});
});
