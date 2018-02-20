function friendlyDate(sqld)
{
	var d = new Date(sqld);
	var w = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var m = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	var s = w[d.getDay()] + ' ' + d.getDate();
	switch (d.getDate()) {
		case  1:
		case 21:
			s = s.concat('<sup>st</sup> ');
			break;
		case  2:
		case 22:
			s = s.concat('<sup>nd</sup> ');
			break;
		case  3:
		case 23:
			s = s.concat('<sup>rd</sup> ');
			break;
		default:
			s = s.concat('<sup>th</sup> ');
			break;
	}
	s = s.concat(m[d.getMonth()]) + ' ' + d.getFullYear();
	return s;
}

function getSwapDetails(i,dutyswapID)
{
	$.post("/MUACSIM/tplanner/modules/MyDuties/server/swapDetails.php",{dutyswapID:dutyswapID},function(resp){
		var response = $.parseJSON(resp);
		response.map(function(e){
			$("ul").eq(i+2).append('<li>'+e.name+',&nbsp;&nbsp;'+e.dt_from.substring(11,16)+' - '+e.dt_to.substring(11,16)+'</li>');
		});
	});
}

function showConfirmationModal(dutyswapID,approve)
{
	$("#confirmationModal .btn").last().removeClass("btn-success").removeClass("btn-danger");
	if (approve) $("#confirmationModal .btn").last().addClass("btn-success").html("Approve");
	else         $("#confirmationModal .btn").last().addClass("btn-danger" ).html("Decline");
	
	if (approve) $("#confirmationModal .modal-title").html("Approve swap");
	else         $("#confirmationModal .modal-title").html("Decline swap");
	
	if (!$("#confirmationModal input[type=checkbox]").prop("checked")) $("#confirmationModal .btn").first().trigger("click");
	$("#confirmationModal textarea").val('');
	$("#confirmationModal").modal("show");
	
	$("#confirmationModal .btn").last().unbind().on("click",function(){
		$.post("/MUACSIM/tplanner/modules/Planner/server/swapApproveDecline.php",{dutyswapID:dutyswapID,status:(approve?'APPROVED':'DECLINED'),comments:btoa($("#confirmationModal textarea").val()),sendSMS:($("#confirmationModal input[type=checkbox]").prop("checked")?1:0)},function(){
			$("div[data="+dutyswapID+"]").hide();
			$("#confirmationModal").modal("hide");
		});
	});
}

$(document).ready(function(){
	$.post("/MUACSIM/tplanner/modules/Planner/server/readAgreedSwaps.php",null,function(resp){
		var response = $.parseJSON(resp);
		var template = $("#swapCardTemplate").html();
		
		response.map(function(swap){
			$("#swapContainer").append('<div data="' + swap.dutyswapID + '" class="row" style="border:1px solid #aaa;border-radius:4px;margin-bottom:3em;">' + template.replace(/STR1/,friendlyDate(swap.day)).replace(/STR2/,swap.requestingName+' ('+swap.requestingShift+')').replace(/STR3/,swap.targetName+' ('+swap.targetShift+')') + '</div>');
		});
		
		$("ul:gt(1)").each(function(i){
			getSwapDetails(i,$(this).parent().parent().attr("data"));
		});
		
		$(".btn-success").on("click",function(){
			showConfirmationModal($(this).parent().parent().attr("data"),1);
		});
		$(".btn-danger" ).on("click",function(){
			showConfirmationModal($(this).parent().parent().attr("data"),0);
		});
	});
});
