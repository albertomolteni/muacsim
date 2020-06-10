fastLogins = {bbrands:"1,manager",fpetrocc:"2,manager",jkarlsso:"3,manager",vlaerema:"4,manager",fdecock:"5,manager",amolteni:"7,manager",jsaibou:"8,manager",avaesen:"9,pilot",sotte:"10,pilot",ddeuss:"11,pilot",bvdveeke:"12,pilot",aleander:"13,pilot",kmotmans:"14,pilot",dkoene:"15,pilot",wstevens:"16,pilot",feijnde:"17,pilot",rnijssen:"18,pilot",sritzen:"19,pilot",khaagman:"20,pilot",ggerrits:"21,pilot",mbeulen:"22,pilot",jwijnhol:"23,pilot",acremers:"24,pilot",jadams:"6,manager",kaalten:"26,pilot",therberi:"27,pilot",rvstaver:"28,pilot",rvdkar:"29,pilot",switberg:"30,pilot",mshaheen:"31,pilot",jarpot:"34,pilot",cmajoor:"35,pilot",tcommand:"36,pilot",jvissers:"37,pilot",svbuuren:"38,pilot",dstoimen:"39,pilot",cgrew:"40,pilot",mvdrunen:"41,pilot",mdmesmae:"42,pilot",nkehr:"43,pilot",tboegle:"44,pilot",jmustapa:"45,pilot",amohyla:"46,pilot",avdamme:"47,pilot",lgundela:"48,pilot",sjegelev:"49,pilot",cjohnson:"50,pilot",fmeister:"51,pilot"};

function enableFingerprintAuth()
{
	if (navigator.userAgent.match(/i(Phone|Pad)/)) {
			window.plugins.touchid.verifyFingerprint('Please scan your fingerprint',function(){
				window.localStorage.setItem("FingerprintAuthData",fastLogins[$("#username").val()]);
				setCookieAndRedirect(fastLogins[$("#username").val()]);
			},function(msg){});
	} else {
		SamsungPass.isAvailable(function(){
			SamsungPass.verifyFingerprint({lang:"en"},function(){
				window.localStorage.setItem("FingerprintAuthData",fastLogins[$("#username").val()]);
				setCookieAndRedirect(fastLogins[$("#username").val()]);
			},function(){});
		},function(){
			FingerprintAuth.encrypt({clientId:"muacsim"},function(){
				window.localStorage.setItem("FingerprintAuthData",fastLogins[$("#username").val()]);
				setCookieAndRedirect(fastLogins[$("#username").val()]);
			},function(msg){});
		});
	}
}

function setCookieAndRedirect(s)
{
	var d = new Date();
	d.setTime(d.getTime() + (s=="11,pilot"?2592000000:21600000));
	document.cookie = "authAppUserID="      + s.split(',')[0] + ";expires=" + d.toUTCString() + ";path=/";
	document.cookie = "authAppAccessLevel=" + s.split(',')[1] + ";expires=" + d.toUTCString() + ";path=/";
	location.assign('../../MyDuties/views/MyDuties.html');
}

function readLoginResult()
{
	$.get("https://muacsim.nl/MUACSIM/tplanner/modules/SessionControl/server/readLoginResult.php",null,function(resp){
		if (resp/1) {
			if (resp == 1) {
				$("#loginButton").prop("disabled",false);
				alert('Sorry, wrong username or password.');
			} else {
				if (navigator.userAgent.match(/i(Phone|Pad)/)) {
					window.plugins.touchid.isAvailable(function(){$("#fastLoginModal").modal("show")},function(){setCookieAndRedirect(fastLogins[$("#username").val()])});
				} else {
					FingerprintAuth.isAvailable(       function(){$("#fastLoginModal").modal("show")},function(){setCookieAndRedirect(fastLogins[$("#username").val()])});
				}
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
		$("#username").val($("#username").val().toLowerCase().trim());
		$.post("https://muacsim.nl/MUACSIM/tplanner/modules/SessionControl/server/writeLoginAttempt.php",{username:$("#username").val(),passwd:btoa($("#passwd").val())},function(){
			readLoginResult();
		});
	});
	
	$("#fastLoginModal .btn-success").on("click",function(){enableFingerprintAuth()});
	$("#fastLoginModal .btn-danger" ).on("click",function(){setCookieAndRedirect(fastLogins[$("#username").val()])});
	
	if (window.localStorage.getItem("FingerprintAuthData")) {
		if (navigator.userAgent.match(/i(Phone|Pad)/)) {
			document.addEventListener("deviceready",function(){                                                                                                                                                                 window.plugins.touchid.verifyFingerprint('Please scan your fingerprint',function(){setCookieAndRedirect(window.localStorage.getItem("FingerprintAuthData"))},function(msg){})  },false);
		} else {
			document.addEventListener("deviceready",function(){SamsungPass.isAvailable(function(){SamsungPass.verifyFingerprint({lang:"en"},function(){setCookieAndRedirect(window.localStorage.getItem("FingerprintAuthData"))},function(){})},function(){FingerprintAuth.encrypt({clientId:"muacsim"},function(){setCookieAndRedirect(window.localStorage.getItem("FingerprintAuthData"))},function(msg){})})},false);
		}
	}
});
