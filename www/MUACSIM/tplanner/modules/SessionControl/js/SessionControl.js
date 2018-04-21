function readLoginResult()
{
	$.get("http://muacsim.eu/MUACSIM/tplanner/modules/SessionControl/server/readLoginResult.php",null,function(resp){
		if (resp/1) {
			if (resp == 1) {
				$("#loginButton").prop("disabled",false);
				alert('Sorry, wrong username or password.');
			} else {
				var d = new Date();
				d.setTime(d.getTime() + 60123);
				document.cookie = "authAppUserID=21;expires=" + d.toUTCString() + ";path=/";
				document.cookie = "authAppAccessLevel=pilot;expires=" + d.toUTCString() + ";path=/";
				location.assign('../../MyDuties/views/MyDuties.html');
			}
		} else {
			setTimeout(readLoginResult,1000);
		}
	});
}

$(document).ready(function(){
	$("#username").focus();
	$("input").on("keyup",function(e){
		if (e.which == 13) $("#loginButton").trigger("click");
	});
	$("#loginButton").on("click",function(){
		$(this).prop("disabled",true);
		$.post("http://muacsim.eu/MUACSIM/tplanner/modules/SessionControl/server/writeLoginAttempt.php",{username:$("#username").val(),passwd:btoa($("#passwd").val())},function(){
			readLoginResult();
		});
	});
});
