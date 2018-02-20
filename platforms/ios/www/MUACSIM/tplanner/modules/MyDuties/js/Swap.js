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

function formIsValid()
{
	var md = [0,31,28,31,30,31,30,31,31,30,31,30,31];
	var matches = $("#swapDate").val().match(/^(\d{2})-(\d{2})-(\d{4})$/);
	if (matches.length !=    4) return false;
	
	if (matches[1]/1    >   31) return false;
	if (matches[2]/1    >   12) return false;
	if (matches[3]/1    < 2018) return false;
	
	if (matches[1]/1 > md[matches[2]/1]) return false;
	// end of swapDate validation
	
	var matches = $("#swapFrom").val().match(/^(\d{2}):(\d{2})$/);
	if (matches.length !=    3) return false;
	
	if (matches[1]/1    <    8) return false;
	if (matches[1]/1    >   22) return false;
	if (matches[2]      >   30) return false;
	if (matches[2] % 30 >    0) return false;
	// end of swapFrom validation
	
	var matches = $("#swapTo"  ).val().match(/^(\d{2}):(\d{2})$/);
	if (matches.length !=    3) return false;
	
	if (matches[1]/1    <    8) return false;
	if (matches[1]/1    >   22) return false;
	if (matches[2]      >   30) return false;
	if (matches[2] % 30 >    0) return false;
	// end of swapTo validation
	
	return true;
}

$(document).ready(function(){
	$("#swapDate").val(findGetParameter("date"));
	$("#swapFrom").val(findGetParameter("from"));
	$("#swapTo"  ).val(findGetParameter("to"  ));
	
	$("input[type=text]").on("change",function(){
		$("#swapWith").html('');
		$(".btn-success").prop("disabled",true);
		
		if (formIsValid()) {
			$.post("/MUACSIM/tplanner/modules/MyDuties/server/swapPossibleColleagues.php",{swapDate:$("#swapDate").val().substring(6,10)+'-'+$("#swapDate").val().substring(3,5)+'-'+$("#swapDate").val().substring(0,2),swapFrom:$("#swapFrom").val()+':00',swapTo:$("#swapTo").val()+':00'},function(resp){
				var response = $.parseJSON(resp);
				response.map(function(pilot){
					$("#swapWith").append('<option '+(pilot.shiftID?'data-doubleswap-shiftID="'+pilot.shiftID+'" data-doubleswap-shiftName="'+pilot.shiftName+'" data-doubleswap-compulsory="'+pilot.doubleswapCompulsory+'" ':'')+'value="'+pilot.userID+'">'+pilot.name+' '+pilot.surname+' ('+(pilot.shiftID?pilot.shiftName:'off')+')</option>');
					$(".btn-success").prop("disabled",false);
				});
				$("#swapWith").prop("selectedIndex",-1).unbind().on("change",function(){
					doubleSwap = 0;
					if ($(this).find("option:selected").attr("data-doubleswap-shiftID")) {
						if ($(this).find("option:selected").attr("data-doubleswap-compulsory")/1) {
							doubleSwap = 1;
							$("#doubleswapModal2 .modal-body").html($("#swapWith option:selected").html().split(' ')[0]+' is working a "'+$("#swapWith option:selected").attr("data-doubleswap-shiftName")+'" duty on '+$("#swapDate").val()+'<br><br>This cannot be combined with the duty you are proposing to swap. By submitting this request you agree to take '+$("#swapWith option:selected").html().split(' ')[0]+'\'s '+$("#swapWith option:selected").attr("data-doubleswap-shiftName")+'.');
							$("#doubleswapModal2").modal("show");
							$("#doubleswapModal2 .btn-success").unbind().on("click",function(){
								$("#doubleswapModal2").modal("hide");
							});
						} else {
							$("#doubleswapModal1 .modal-body").html($("#swapWith option:selected").html().split(' ')[0]+' is working a "'+$("#swapWith option:selected").attr("data-doubleswap-shiftName")+'" duty on '+$("#swapDate").val()+'<br><br>Would you like to make this a double swap and take '+$("#swapWith option:selected").html().split(' ')[0]+'\'s '+$("#swapWith option:selected").attr("data-doubleswap-shiftName")+'?');
							$("#doubleswapModal1").modal("show");
							$("#doubleswapModal1 .btn-danger").unbind().on("click",function(){
								$("#doubleswapModal1").modal("hide");
							});
							$("#doubleswapModal1 .btn-success").unbind().on("click",function(){
								doubleSwap = 1;
								$("#doubleswapModal1").modal("hide");
							});
						}
					}
				});
				if (!response.length) alert('Sorry, there are no colleagues available to swap during this period');
			});
		}
	});
	
	$(".input-group.date").datepicker({
		format                : "dd-mm-yyyy",
		daysOfWeekDisabled    : "0",
		daysOfWeekHighlighted : "0",
		startDate             : "today"
	});
	
	$("#submitButton").on("click",function(){
		if (formIsValid() && $("#swapWith").prop("selectedIndex")>-1) {
			$.post("/MUACSIM/tplanner/modules/MyDuties/server/saveSwap.php",{swapDate:$("#swapDate").val().substring(6,10)+'-'+$("#swapDate").val().substring(3,5)+'-'+$("#swapDate").val().substring(0,2),swapFrom:$("#swapFrom").val()+':00',swapTo:$("#swapTo").val()+':00',swapWith:$("#swapWith").val(),doubleSwap:doubleSwap,comments:btoa($("#swapComments").val())},function(){
				$(".btn-success").parent().parent().parent().html('<div style="font-size:2em;font-weight:bold;text-align:center;padding-top:4em;">Swap request saved successfully</div>');
				setTimeout(function(){location.assign('/MUACSIM/tplanner/MyDuties/')},3000);
			});
		}
	});
	
	$("input").first().trigger("change");
});
