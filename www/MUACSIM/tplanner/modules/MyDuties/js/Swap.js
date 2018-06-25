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

function dateIsValid(dateVal)
{
	var  md = [0,31,28,31,30,31,30,31,31,30,31,30,31];
	var  matches = dateVal.match(/^(\d{2})-(\d{2})-(\d{4})$/);
	if (!matches                          ) return false;
	if ( matches[1]/1  >                31) return false;
	if ( matches[2]/1  >                12) return false;
	if ( matches[3]/1  <              2018) return false;
	if ( matches[1]/1  >  md[matches[2]/1]) return false;
	return true;
}

function userIsQualified(userID,qualification)
{
	var pq = $.parseJSON(pquals);
	for (var z=0;z<pq.length;z++) if (pq[z].quals.indexOf(qualification)>-1 && (pq[z].userID==userID || pq[z].self==userID)) return true;
	return false;
}

function readSwapPartnerDuties(inputGroupIndex)
{
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readSwapPartnerDuties.php",{partnerID:$("#swapWith").val(),day:$(".input-group.date input").eq(inputGroupIndex).val().substring(6,10)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(3,5)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(0,2)},function(resp){
		var responseP = $.parseJSON(resp);
		$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/dutyDetails.php",      {                               day:$(".input-group.date input").eq(inputGroupIndex).val().substring(6,10)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(3,5)+'-'+$(".input-group.date input").eq(inputGroupIndex).val().substring(0,2)},function(resp){
			var responseS = $.parseJSON(resp);
			$(".partner-view[data="+inputGroupIndex+"]").remove();
			$(".input-group.date").eq(inputGroupIndex).after('<div data="'+inputGroupIndex+'" class="row partner-view" style="margin-top:15px;"><div class="col-sm-5"></div><div class="col-sm-2" style="padding:0;"></div><div class="col-sm-5"></div></div>');
			responseS.map(function(duty){
				var decimalTime1 = duty['dt_from'].substring(14,16)/60 + duty['dt_from'].substring(11,13)/1;
				var decimalTime2 = duty['dt_to'  ].substring(14,16)/60 + duty['dt_to'  ].substring(11,13)/1;
				var prevEnd = $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:first div").length ? $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:first div").attr("data-endTime") : 8;
				$(".partner-view[data="+inputGroupIndex+"] .col-sm-5").eq(0).append('<div class="swappable'+(duty.isExtra ? ' isExtra' : '')+(duty.criticalHybrid ? (userIsQualified($("#swapWith").val(),duty.role) ? '' : ' criticalHybrid') : '')+'" data-eID="'+duty.simeventID+'" data-seuID="'+duty.simevent_userID+'" data-startTime="'+decimalTime1+'" data-endTime="'+decimalTime2+'" style="background:'+duty.bgcolor+';border:3px solid transparent;border-radius:6px;padding:2vw;height:'+(30*(decimalTime2-decimalTime1))+'px;margin-top:'+(30*(decimalTime1-prevEnd))+'px;"><h5>'+duty.name+'</h5>'+duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'<br>'+duty.role+'</div>');
			});
			responseP.map(function(duty){
				var decimalTime1 = duty['dt_from'].substring(14,16)/60 + duty['dt_from'].substring(11,13)/1;
				var decimalTime2 = duty['dt_to'  ].substring(14,16)/60 + duty['dt_to'  ].substring(11,13)/1;
				var prevEnd = $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:last  div").length ? $(".partner-view[data="+inputGroupIndex+"] .col-sm-5:last  div").attr("data-endTime") : 8;
				$(".partner-view[data="+inputGroupIndex+"] .col-sm-5").eq(1).append('<div class="swappable'+(duty.isExtra ? ' isExtra' : '')+(duty.criticalHybrid ? (userIsQualified('self'              ,duty.role) ? '' : ' criticalHybrid') : '')+'" data-eID="'+duty.simeventID+'" data-seuID="'+duty.simevent_userID+'" data-startTime="'+decimalTime1+'" data-endTime="'+decimalTime2+'" style="background:'+duty.bgcolor+';border:3px solid transparent;border-radius:6px;padding:2vw;height:'+(30*(decimalTime2-decimalTime1))+'px;margin-top:'+(30*(decimalTime1-prevEnd))+'px;"><h5>'+duty.name+'</h5>'+duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'<br>'+duty.role+'</div>');
			});
			$("h5").filter(function(){return $(this).html().replace(/^Sick$/ ,'').length?false:true}).each(function(){$(this).parent().html('<h5>Sick</h5>' )});
			$("h5").filter(function(){return $(this).html().replace(/^Leave$/,'').length?false:true}).each(function(){$(this).parent().html('<h5>Leave</h5>')});
			$(".partner-view[data="+inputGroupIndex+"]").append('<div class="col-sm-5" style="padding-top:1em;text-align:center;"><h5>Me</h5></div><div class="col-sm-1" style="padding:0;"></div><div class="col-sm-1" style="padding:0;"></div><div class="col-sm-5" style="padding-top:1em;text-align:center;"><h5>'+$("#swapWith option:selected").html().split(' ')[0]+'</h5></div>');
			$(".partner-view[data="+inputGroupIndex+"] .isExtra"       ).append('<div style="background:#c00;color:white;border-radius:4px;font-size:12px;padding:0 6px;margin-top:0.4em;"><i class="fa fa-exclamation-triangle" style="margin-right:0.4em;"></i>EXTRA</div>');
			$(".partner-view[data="+inputGroupIndex+"] .criticalHybrid").append('<div style="background:#c00;color:white;border-radius:4px;font-size:12px;padding:0 6px;margin-top:0.4em;"><i class="fa fa-exclamation-triangle" style="margin-right:0.4em;"></i>HYBRID</div>');
			var minMT = 999999;
			$(".partner-view[data="+inputGroupIndex+"] .swappable:first-child").each(function(){
				if ($(this).css("margin-top").replace(/px/,'')/1 < minMT) minMT = $(this).css("margin-top").replace(/px/,'')/1;
			});
			if (minMT < 999999) $(".partner-view[data="+inputGroupIndex+"]").css("margin-top",15-minMT);
			$(".partner-view[data="+inputGroupIndex+"] .swappable").on("click",function(){
				if ($(this).parent().parent().find("div[data-relatedEID="+$(this).attr("data-eID")+"]").length) {
					$(this).parent().parent().find("div[data-relatedEID="+$(this).attr("data-eID")+"]").remove();
					$(this).css("border","3px solid transparent");
					$(this).removeClass("swapping");
				} else {
					var ad = $(this).parent().prevAll(".col-sm-5").length ? "left" : "right";
					var mt = $(this).position().top + $(this).css("margin-top").replace(/px/,'')/1 + $(this).height()*0.5 - 12;
					$(this).parent().parent().find(".col-sm-2").append('<div data-relatedEID="'+$(this).attr("data-eID")+'" style="width:100%;position:absolute;text-align:center;margin-top:'+mt+'px;font-size:30px;"><i class="fa fa-long-arrow-'+ad+'"></i></div>');
					$(this).css("border","3px dashed "+$(this).css("background-color"));
					$(this).addClass("swapping");
					var decimalTime1 = $(this).attr("data-startTime")/1;
					var decimalTime2 = $(this).attr("data-endTime"  )/1;
					$(this).parent().siblings(".col-sm-5").find(".swappable").each(function(){
						if ($(this).attr("data-startTime")/1<decimalTime2 && $(this).attr("data-endTime")/1>decimalTime1 && !$(this).hasClass("swapping")) $(this).trigger("click");
						if ($(this).attr("data-startTime")<10 && decimalTime2>20                                         && !$(this).hasClass("swapping")) $(this).trigger("click");
						if ($(this).attr("data-endTime"  )>20 && decimalTime1<10                                         && !$(this).hasClass("swapping")) $(this).trigger("click");
					});
					if ($(this).hasClass("isExtra")) {
						$(".partner-view[data="+inputGroupIndex+"] div[data-relatedEID]").remove();
						$(".partner-view[data="+inputGroupIndex+"] .swapping").css("border","3px solid transparent");
						$(".partner-view[data="+inputGroupIndex+"] .swapping").removeClass("swapping");
						alert('Sorry, swapping extra duties is not allowed.\n\nFor further details, please contact Bas.');
					}
					if ($(this).hasClass("criticalHybrid")) {
						$(".partner-view[data="+inputGroupIndex+"] div[data-relatedEID]").remove();
						$(".partner-view[data="+inputGroupIndex+"] .swapping").css("border","3px solid transparent");
						$(".partner-view[data="+inputGroupIndex+"] .swapping").removeClass("swapping");
						alert('Sorry, you cannot swap this duty because '+($(this).parent().prevAll(".col-sm-5").length ? $("#swapWith option:selected").html().split(' ')[0]+' is' : 'you are')+' needed as a hybrid and there is nobody else to fill this role.');
					}
					if ($(this).attr("data-eID")==0) {
						$(".partner-view[data="+inputGroupIndex+"] div[data-relatedEID]").remove();
						$(".partner-view[data="+inputGroupIndex+"] .swapping").css("border","3px solid transparent");
						$(".partner-view[data="+inputGroupIndex+"] .swapping").removeClass("swapping");
						alert('Sorry, you cannot swap this duty.');
					}
				}
				if ($(".swapping").length) $("#submitButton").prop("disabled",false);
				else                       $("#submitButton").prop("disabled",true);
			});
		});
	});
}

$(document).ready(function(){
	pquals = pquals.replace(new RegExp('"userID":"'+document.cookie.match(/authAppUserID=(\d+)/)[1]+'","self":""'),'"userID":"'+document.cookie.match(/authAppUserID=(\d+)/)[1]+'","self":"self"');
	$("#swapWith option[value="+document.cookie.match(/authAppUserID=(\d+)/)[1]+"]").remove();
	$("#swapWith").prop("selectedIndex",-1);
	var mdTemplate = $(".form-group").eq(1).html();
	$(".input-group.date input").val(findGetParameter("date"));
	$(".input-group.date").last().datepicker({
		format                : "dd-mm-yyyy",
		daysOfWeekDisabled    : "0",
		daysOfWeekHighlighted : "0",
		startDate             : "today"
	}).on("input change",function(){
		if (dateIsValid($(this).find("input").val())) {
			readSwapPartnerDuties($(this).parent().prevAll(".form-group").length-1);
		} else {
			$(".partner-view[data="+($(this).parent().prevAll(".form-group").length-1)+"]").remove();
		}
	});
	$("#swapWith").on("change",function(){
		var g = $(".form-group").length;
		$("hr:lt("+(g-3)+"):gt(1)").remove();
		$(".form-group:lt("+(g-3)+"):gt(1)").remove();
		$(".partner-view").remove();
		$(".input-group.date").last().trigger("change");
	});
	$("#moreDatesButton").on("click",function(){
		$("hr").eq(-2).before('<hr><div class="form-group">'+mdTemplate+'</div>');
		$(".input-group.date").last().datepicker({
			format                : "dd-mm-yyyy",
			daysOfWeekDisabled    : "0",
			daysOfWeekHighlighted : "0",
			startDate             : "today"
		}).on("input change",function(){
			if (dateIsValid($(this).find("input").val())) {
				readSwapPartnerDuties($(this).parent().prevAll(".form-group").length-1);
			} else {
				$(".partner-view[data="+($(this).parent().prevAll(".form-group").length-1)+"]").remove();
			}
		});
	});
	$("#submitButton").on("click",function(){
		$(this).prop("disabled",true);
		var swapping = [];
		$(".swapping").each(function(){
			var swapTo = $("div[data-relatedEID="+$(this).attr("data-eID")+"] .fa-long-arrow-left").length ? 'requesting' : 'target';
			swapping.push({simevent_userID:$(this).attr("data-seuID"),swapTo:swapTo,day:$(this).parent().parent().prevAll(".input-group.date").find("input").val()});
		});
		$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/saveSwap.php",{swapWith:$("#swapWith").val(),json:JSON.stringify(swapping),comments:btoa($("#swapComments").val())},function(){
			$(".btn-success").parent().parent().parent().html('<div style="font-size:2em;font-weight:bold;text-align:center;padding-top:4em;">Swap request saved successfully</div>');
			setTimeout(function(){location.assign('./MyDuties.html')},3000);
		});
	});
});
