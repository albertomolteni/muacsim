function enableFingerprintAuth()
{
	FingerprintAuth.encrypt({clientId:"muacsim"},function(){
		window.localStorage.setItem("FingerprintAuthData","21,pilot");
		setCookieAndRedirect();
	},function(msg){});
}

function setCookieAndRedirect()
{
	var d = new Date();
	d.setTime(d.getTime() + 60123);
	document.cookie = "authAppUserID=21;expires=" + d.toUTCString() + ";path=/";
	document.cookie = "authAppAccessLevel=pilot;expires=" + d.toUTCString() + ";path=/";
	location.assign('../../MyDuties/views/MyDuties.html');
}

function readLoginResult()
{
	$.get("http://muacsim.eu/MUACSIM/tplanner/modules/SessionControl/server/readLoginResult.php",null,function(resp){
		if (resp/1) {
			if (resp == 1) {
				$("#loginButton").prop("disabled",false);
				alert('Sorry, wrong username or password.');
			} else {
				FingerprintAuth.isAvailable(function(){$("#fastLoginModal").modal("show")},function(){setCookieAndRedirect()});
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
	
	$("#fastLoginModal .btn-success").on("click",function(){enableFingerprintAuth()});
	$("#fastLoginModal .btn-danger" ).on("click",function(){ setCookieAndRedirect()});
	
	if (window.localStorage.getItem("FingerprintAuthData")) {
		FingerprintAuth.encrypt({clientId:"muacsim"},function(){setCookieAndRedirect()},function(msg){});
	}
});
