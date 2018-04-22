function cacheDutyDetails(postParams)
{
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/dutyDetails.php",postParams,function(resp){
		window.localStorage.setItem("MyDuties/dutyDetails__"+JSON.stringify(postParams),resp);
	});
}

function updateLocalCache()
{
	rpdo  = new Date(window.localStorage.getItem("rosterPublished")/1);
	var d = new Date();
	d.setHours(4);
	var postParams = null;
	while (d < rpdo) {
		postParams = {day:d.toISOString().substring(0,10)};
		cacheDutyDetails(postParams);
		d.setDate(d.getDate() + 1);
	}
	$.vPOST("/MUACSIM/tplanner/modules/MyDuties/server/readMyDuties.php",null,function(resp){
		window.localStorage.setItem("MyDuties/readMyDuties",resp);
		window.localStorage.setItem("localCacheLastModified",Date.now());
	});
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
	
	if (window.localStorage.getItem("localCacheLastModified")) {
		if (Date.now()-window.localStorage.getItem("localCacheLastModified")<21600000) {
			if (retrieveFromCache(URI,data,callback)) return true;
		}
	}
	
	$.post("http://muacsim.eu"+URI,data,callback).fail(function(){retrieveFromCache(URI,data,callback)});
	
	if (navigator.onLine) {
		var lclm = window.localStorage.getItem("localCacheLastModified");
		if (lclm === null) {
			window.localStorage.setItem("localCacheLastModified",0);
			setTimeout(updateLocalCache,5000);
		} else {
			if (lclm>0 && Date.now()-lclm>21600000) {
				setTimeout(updateLocalCache,5000);
			}
		}
	}
}