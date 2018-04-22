fastLogins = {bbrands:"1,manager",amolteni:"7,manager"};

function enableFingerprintAuth()
{
	FingerprintAuth.encrypt({clientId:"muacsim"},function(){
		window.localStorage.setItem("FingerprintAuthData",fastLogins[$("#username").val().toLowerCase()]);
		setCookieAndRedirect(fastLogins[$("#username").val().toLowerCase()]);
	},function(msg){});
}

function setCookieAndRedirect(s)
{
	var d = new Date();
	d.setTime(d.getTime() + 30123);
	document.cookie = "authAppUserID="      + s.split(',')[0] + ";expires=" + d.toUTCString() + ";path=/";
	document.cookie = "authAppAccessLevel=" + s.split(',')[1] + ";expires=" + d.toUTCString() + ";path=/";
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
				FingerprintAuth.isAvailable(function(){$("#fastLoginModal").modal("show")},function(){setCookieAndRedirect(fastLogins[$("#username").val().toLowerCase()])});
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
	$("#fastLoginModal .btn-danger" ).on("click",function(){setCookieAndRedirect(fastLogins[$("#username").val().toLowerCase()])});
	
	if (window.localStorage.getItem("FingerprintAuthData")) {
		FingerprintAuth.encrypt({clientId:"muacsim"},function(){setCookieAndRedirect(window.localStorage.getItem("FingerprintAuthData"))},function(msg){});
	}
});
