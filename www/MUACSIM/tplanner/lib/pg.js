function cacheNextDutyDetails()
{
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/dutyDetails.php",{day:ulc__d1.toISOString().substring(0,10)},function(resp){
		window.localStorage.setItem("MyDuties/dutyDetails__"+JSON.stringify({day:ulc__d1.toISOString().substring(0,10)}),resp);
		ulc__d1.setDate(ulc__d1.getDate() + 1);
		if (ulc__d1 < ulc__d2) {
			cacheNextDutyDetails();
		} else {
			$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readMyDuties.php",null,function(resp){
				window.localStorage.setItem("MyDuties/readMyDuties",resp);
				window.localStorage.setItem("localCacheLastModified",Date.now());
			});
		}
	});
}

function startLocalCacheUpdate()
{
	ulc__d2 = new Date(window.localStorage.getItem("rosterPublished")/1);
	ulc__d1 = new Date();
	ulc__d1.setHours(4);
	cacheNextDutyDetails();
}

function retrieveFromCache(URI,data,callback)
{
	var localStorageKey  = URI.replace(/^\/MUACSIM\/tplanner\/modules\//,'').replace(/\/server\//,'/').replace(/\.php$/,'');
	if (localStorageKey != 'MyDuties/readMyDuties') localStorageKey += '__' + JSON.stringify(data);
	if (window.localStorage.getItem(localStorageKey)) {
		callback(window.localStorage.getItem(localStorageKey));
		return true;
	} else {
		console.log('retrieveFromCache FAIL\n\n'+localStorageKey);
		return false;
	}
}

$.vPOST = function(URI,data,callback)
{
	if (data) {
		data.authAppUserID      = document.cookie.match(/authAppUserID=(\d+)/)[1]/1;
		data.authAppAccessLevel = document.cookie.match(/authAppAccessLevel=(\w+)/)[1];
	} else {
		data = {authAppUserID:document.cookie.match(/authAppUserID=(\d+)/)[1]/1,authAppAccessLevel:document.cookie.match(/authAppAccessLevel=(\w+)/)[1]};
	}
	
	if (retrieveFromCache(URI,data,callback)) return true;
	$.post("http://muacsim.eu"+URI,data,callback).fail(function(){});
	
	if (navigator.onLine) {
		var lclm = window.localStorage.getItem("localCacheLastModified");
		if (lclm === null) {
			window.localStorage.setItem("localCacheLastModified",0);
			setTimeout(startLocalCacheUpdate,5000);
		} else {
			if (lclm>0 && Date.now()-lclm>21600000) {
				setTimeout(startLocalCacheUpdate,5000);
			}
		}
	}
}