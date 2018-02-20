function readLoginResult()
{
	$.get("/MUACSIM/tplanner/modules/SessionControl/server/readLoginResult.php",function(resp){
		if (resp/1) {
			if (resp == 2) location.assign('/MUACSIM/tplanner/');
		} else {
			setTimeout(readLoginResult,1000);
		}
	});
}

$(document).ready(function(){
	to = setTimeout(function(){location.reload()},6000);
	$.get("https://ext.eurocontrol.int/analytics/saw.dll?Dashboard",function(resp){
		$.post("/MUACSIM/tplanner/modules/SessionControl/server/piggybackLogin.php",{username:resp.match(/tSessionInfos.setUserInfo\("([a-z]+)",/)[1]},function(resp){
			location.assign('/MUACSIM/tplanner/');
		});
	}).fail(function(){
		clearTimeout(to);
		$(".login-option").eq(0).hide();
		$(".login-option").eq(1).show();
		$("#username").focus();
		$("body").on("keyup",function(e){
			if (e.which == 13) $(".btn").trigger("click");
		});
		$(".btn").on("click",function(){
			$.post("/MUACSIM/tplanner/modules/SessionControl/server/writeLoginAttempt.php",{username:$("#username").val(),passwd:btoa($("#passwd").val())},function(){
				readLoginResult();
			});
		});
	});
});
