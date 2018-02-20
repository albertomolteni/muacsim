$(document).ready(function(){
	$("input[type=checkbox]").on("change",function(){
		$.post("/MUACSIM/tplanner/modules/ManageUsers/server/setQualification.php",{userID:$(this).parent().parent().parent().parent().attr("data-userID"),qualificationID:$(this).parent().attr("data-qualID"),status:$(this).prop("checked")},function(){});
	});
});
