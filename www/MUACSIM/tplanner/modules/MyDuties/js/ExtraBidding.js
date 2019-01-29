function friendlyDate(d)
{
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

function respondToExtraBidding(extraBiddingID,responseValue)
{
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/respondToExtraBidding.php",{extraBiddingID:extraBiddingID,responseValue:responseValue},function(){
		$(".bidding[data="+extraBiddingID+"] .btn").prop("disabled",false).hide();
		switch (responseValue) {
			case '0':
				$(".bidding[data="+extraBiddingID+"] .btn").eq(3).show();
				break;
			case '1':
				$(".bidding[data="+extraBiddingID+"] .btn").eq(2).show();
				break;
			case 'x':
				$(".bidding[data="+extraBiddingID+"] .btn").eq(1).show();
				$(".bidding[data="+extraBiddingID+"] .btn").eq(0).show();
				break;
		}
	});
}

$(document).ready(function(){
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readExtraBidding.php",null,function(resp){
		var response = $.parseJSON(resp);
		var template = $("#template").html();
		
		response.map(function(x){
			$("#template").parent().append('<div class="row bidding" data="'+x.extraBiddingID+'" style="border:1px solid #aaa;border-radius:4px;margin:2em 0 0;padding-bottom:1em;">'+template.replace(/STR1/,friendlyDate(new Date(x.dt_from))).replace(/STR2/,x.shiftName).replace(/STR3/,x.roles).replace(/STR4/,'Bidding closes '+friendlyDate(new Date(x.dt_close))+' '+x.dt_close.substring(11,16))+'</div>');
			if (['0','1'].indexOf(x.responseValue)+1) {
				$(".bidding[data="+x.extraBiddingID+"] .btn").hide();
				$(".bidding[data="+x.extraBiddingID+"] .btn").eq(3-x.responseValue).show();
			}
		});
		
		$(".bidding .btn").on("click",function(){
			$(this).parent().find(".btn").prop("disabled",true);
			respondToExtraBidding($(this).parent().parent().attr("data"),$(this).attr("data"));
		});
	});
});
