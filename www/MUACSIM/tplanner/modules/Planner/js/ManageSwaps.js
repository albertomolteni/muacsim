function readSwapPartnerDuties(dutyswapID,inputGroupIndex,requesting,target)
{
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readSwapPartnerDuties.php",    {partnerID:target,    day:$("div[data="+dutyswapID+"] .input-group.date input").eq(inputGroupIndex).val().substring(6,10)+'-'+$("div[data="+dutyswapID+"] .input-group.date input").eq(inputGroupIndex).val().substring(3,5)+'-'+$("div[data="+dutyswapID+"] .input-group.date input").eq(inputGroupIndex).val().substring(0,2)},function(resp){
		var responseP = $.parseJSON(resp);
		$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readSwapPartnerDuties.php",{partnerID:requesting,day:$("div[data="+dutyswapID+"] .input-group.date input").eq(inputGroupIndex).val().substring(6,10)+'-'+$("div[data="+dutyswapID+"] .input-group.date input").eq(inputGroupIndex).val().substring(3,5)+'-'+$("div[data="+dutyswapID+"] .input-group.date input").eq(inputGroupIndex).val().substring(0,2)},function(resp){
			var responseS = $.parseJSON(resp);
			$("div[data="+dutyswapID+"] .input-group.date").eq(inputGroupIndex).after('<div data="'+inputGroupIndex+'" class="row partner-view" style="margin-top:15px;"><div class="col-sm-5"></div><div class="col-sm-2" style="padding:0;"></div><div class="col-sm-5"></div></div>');
			responseS.map(function(duty){
				var decimalTime1 = duty['dt_from'].substring(14,16)/60 + duty['dt_from'].substring(11,13)/1;
				var decimalTime2 = duty['dt_to'  ].substring(14,16)/60 + duty['dt_to'  ].substring(11,13)/1;
				var prevEnd = $("div[data="+dutyswapID+"] .partner-view[data="+inputGroupIndex+"] .col-sm-5:first div").length ? $("div[data="+dutyswapID+"] .partner-view[data="+inputGroupIndex+"] .col-sm-5:first div").last().attr("data-endTime") : 8;
				$("div[data="+dutyswapID+"] .partner-view[data="+inputGroupIndex+"] .col-sm-5").eq(0).append('<div class="swappable" data-eID="'+duty.simeventID+'" data-seuID="'+duty.simevent_userID+'" data-startTime="'+decimalTime1+'" data-endTime="'+decimalTime2+'" style="background:'+duty.bgcolor+';border:3px solid transparent;border-radius:6px;padding:1vw;height:'+(30*(decimalTime2-decimalTime1))+'px;margin-top:'+(30*(decimalTime1-prevEnd))+'px;"><h5>'+duty.name+'</h5>'+(decimalTime2-decimalTime1<3.5?'':duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'<br>')+duty.role+'</div>');
			});
			responseP.map(function(duty){
				var decimalTime1 = duty['dt_from'].substring(14,16)/60 + duty['dt_from'].substring(11,13)/1;
				var decimalTime2 = duty['dt_to'  ].substring(14,16)/60 + duty['dt_to'  ].substring(11,13)/1;
				var prevEnd = $("div[data="+dutyswapID+"] .partner-view[data="+inputGroupIndex+"] .col-sm-5:last  div").length ? $("div[data="+dutyswapID+"] .partner-view[data="+inputGroupIndex+"] .col-sm-5:last  div").last().attr("data-endTime") : 8;
				$("div[data="+dutyswapID+"] .partner-view[data="+inputGroupIndex+"] .col-sm-5").eq(1).append('<div class="swappable" data-eID="'+duty.simeventID+'" data-seuID="'+duty.simevent_userID+'" data-startTime="'+decimalTime1+'" data-endTime="'+decimalTime2+'" style="background:'+duty.bgcolor+';border:3px solid transparent;border-radius:6px;padding:1vw;height:'+(30*(decimalTime2-decimalTime1))+'px;margin-top:'+(30*(decimalTime1-prevEnd))+'px;"><h5>'+duty.name+'</h5>'+(decimalTime2-decimalTime1<3.5?'':duty.dt_from.substring(11,16)+' - '+duty.dt_to.substring(11,16)+'<br>')+duty.role+'</div>');
			});
			var minMT = 999999;
			$("div[data="+dutyswapID+"] .partner-view[data="+inputGroupIndex+"] .swappable:first-child").each(function(){
				if ($(this).css("margin-top").replace(/px/,'')/1 < minMT) minMT = $(this).css("margin-top").replace(/px/,'')/1;
			});
			if (minMT < 999999) $("div[data="+dutyswapID+"] .partner-view[data="+inputGroupIndex+"]").css("margin-top",15-minMT);
			$("div[data="+dutyswapID+"] .partner-view[data="+inputGroupIndex+"] .swappable").on("click",function(){
					var ad = $(this).parent().prevAll(".col-sm-5").length ? "left" : "right";
					var mt = $(this).position().top + $(this).css("margin-top").replace(/px/,'')/1 + $(this).height()*0.5 - 12;
					$(this).parent().parent().find(".col-sm-2").append('<div data-relatedEID="'+$(this).attr("data-eID")+'" style="width:100%;position:absolute;text-align:center;margin-top:'+mt+'px;font-size:30px;"><i class="fa fa-long-arrow-'+ad+'"></i></div>');
					$(this).css("border","3px dashed "+$(this).css("background-color"));
					$(this).addClass("swapping");
			});
			setTimeout(function(){$("body").trigger("dutyDetailsReady"+dutyswapID+","+inputGroupIndex)},200);
		});
	});
}

function friendlyDate(sqld)
{
	var d = new Date(sqld);
	var w = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var m = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	var s = w[d.getDay()] + ' ' + d.getDate();
	switch (d.getDate()) {
		case  1:
		case 21:
		case 31:
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

function showConfirmationModal(dutyswapID,approve)
{
	$("#confirmationModal .btn").last().removeClass("btn-success").removeClass("btn-danger").prop("disabled",false);
	if (approve) $("#confirmationModal .btn").last().addClass("btn-success").html("Approve");
	else         $("#confirmationModal .btn").last().addClass("btn-danger" ).html("Decline");
	
	if (approve) $("#confirmationModal .modal-title").html("Approve swap");
	else         $("#confirmationModal .modal-title").html("Decline swap");
	
	if (!$("#confirmationModal input[type=checkbox]").prop("checked")) $("#confirmationModal .btn").first().trigger("click");
	$("#confirmationModal textarea").val('');
	$("#confirmationModal").modal("show");
	
	$("#confirmationModal .btn").last().unbind().on("click",function(){
		$(this).prop("disabled",true);
		$.vPOST("/MUACSIM/tplanner/modules/Planner/server/swapApproveDecline.php",{dutyswapID:dutyswapID,status:(approve?'APPROVED':'DECLINED'),comments:btoa($("#confirmationModal textarea").val()),sendSMS:($("#confirmationModal input[type=checkbox]").prop("checked")?1:0)},function(){
			$("div[data="+dutyswapID+"] button").remove();
			$("div[data="+dutyswapID+"]").append('<div style="position:absolute;width:100%;padding-top:1em;padding-left:50%;"><img src="../../../img/'+(approve?'approved':'declined')+'_stamp.png" style="width:16em;margin-left:-8em;"></div>');
			$("#confirmationModal").modal("hide");
			$(window).scrollTop(0);
			if (!($("#swapContainer button").length-2)) setTimeout(function(){location.assign('../../MyDuties/views/MyDuties.html')},3000);
		});
	});
}

$(document).ready(function(){
	$("body").append('<div id="loadingOverlay" style="position:fixed;left:0;top:0;z-index:999999;width:100vw;height:100vh;background:rgba(0,0,0,0.8);color:white;text-align:center;padding-top:40vh;"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><br><br>Loading swaps, please wait</div>');
	$.vPOST("/MUACSIM/tplanner/modules/Planner/server/readAgreedSwaps.php",null,function(resp){
		var response = $.parseJSON(resp);
		var template = $("#swapCardTemplate").html();
		
		days      = {};
		days_done = {};
		
		response.map(function(swap){
			$("#swapContainer").append('<div data="' + swap.dutyswapID + '" class="row" style="border:1px solid #aaa;border-radius:4px;margin-bottom:3em;">' + template.replace(/STR1/,swap.requestingName).replace(/STR2/,swap.targetName));
			days['swap'+swap.dutyswapID] = [];
			$.parseJSON(swap.json).map(function(swap_e){if(days['swap'+swap.dutyswapID].indexOf(swap_e.day)<0)days['swap'+swap.dutyswapID].push(swap_e.day)});
			
			days_done['swap'+swap.dutyswapID] = 0;
			days['swap'+swap.dutyswapID].map(function(day){
				var i = $("div[data="+swap.dutyswapID+"] form input").length;
				$("div[data="+swap.dutyswapID+"] form").append('<div class="form-group"><div class="input-group date"><input type="text" class="form-control" value="'+day+'"><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div></div><hr>');
				$("body").on("dutyDetailsReady"+swap.dutyswapID+","+i,function(event){
					$.parseJSON(swap.json).map(function(swap_e){
						if (swap_e.day == $("div[data="+swap.dutyswapID+"] form input").eq(event.type.substring(16).split(',')[1]).val()) $(".swappable[data-seuID="+swap_e.simevent_userID+"]").trigger("click");
					});
					$("div[data="+swap.dutyswapID+"] .partner-view[data="+event.type.substring(16).split(',')[1]+"] .swappable").unbind();
					days_done['swap'+swap.dutyswapID]++;
					if (days_done['swap'+swap.dutyswapID] == days['swap'+swap.dutyswapID].length) $("div[data="+swap.dutyswapID+"] .input-group").each(function(){
						$(this).replaceWith('<div style="text-align:center;font-size:20px;">'+friendlyDate(new Date($(this).find("input").val().substring(6,10)/1,$(this).find("input").val().substring(3,5)-1,$(this).find("input").val().substring(0,2)/1,8,0,0))+'</div>');
						if (!$(".input-group").length) $("#loadingOverlay").remove();
					});
				});
				readSwapPartnerDuties(swap.dutyswapID,i,swap.requesting,swap.target);
			});
			
			if (swap.comments) {
				$("div[data="+swap.dutyswapID+"] form").parent().append('<p>'+swap.requestingName+' says: '+swap.comments+'</p>');
			} else {
				$("hr").last().remove();
			}
		});
		
		$(".btn-success").on("click",function(){
			showConfirmationModal($(this).parent().parent().attr("data"),1);
		});
		$(".btn-danger" ).on("click",function(){
			showConfirmationModal($(this).parent().parent().attr("data"),0);
		});
		
		if (!response.length) $("#loadingOverlay").remove();
	});
});
